'use strict';
// Drawing: shaded relief, static cartography, dynamic overlays, labels,
// unit counters and the camera. Everything lives on one board element that
// is panned and zoomed with a CSS transform.

const SVGNS = 'http://www.w3.org/2000/svg';
const $ = sel => document.querySelector(sel);
const el = (tag, cls, parent) => { const e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.append(e); return e; };
const svgEl = (tag, attrs = {}, parent) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.append(e); return e; };
const f1 = n => Math.round(n * 10) / 10;
const ptsAttr = pts => pts.map(p => `${f1(p[0])},${f1(p[1])}`).join(' ');
const linePath = pts => 'M' + pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join('L');

// Smooth a km polyline into an SVG path with Catmull-Rom curves.
function smoothPath(kmPts) {
  const p = kmPts.map(([x, y]) => [kmToPx(x), kmToPx(y)]);
  if (p.length < 3) return linePath(p);
  let d = `M${f1(p[0][0])} ${f1(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d;
}

const R = {
  view: null, board: null, relief: null, mapSvg: null, overlay: null, units: null, labels: null, markers: null,
  cam: { x: 0, y: 0, z: 0.5 }, labelItems: [], unitEls: new Map(), hover: -1,
};

// ---------------------------------------------------------------------------
// Relief: hypsometric tint × hillshade, lit from the north-west.

const HYPSO = [
  [150, [226, 216, 176]], [260, [222, 211, 166]], [420, [214, 200, 150]], [650, [203, 185, 134]],
  [1000, [188, 166, 120]], [1500, [168, 147, 112]], [2200, [150, 136, 116]], [3000, [170, 163, 152]], [4200, [232, 229, 222]],
];
function hypso(e) {
  if (e <= HYPSO[0][0]) return HYPSO[0][1];
  for (let i = 1; i < HYPSO.length; i++) if (e <= HYPSO[i][0]) {
    const [e0, c0] = HYPSO[i - 1], [e1, c1] = HYPSO[i], t = (e - e0) / (e1 - e0);
    return [c0[0] + (c1[0] - c0[0]) * t, c0[1] + (c1[1] - c0[1]) * t, c0[2] + (c1[2] - c0[2]) * t];
  }
  return HYPSO[HYPSO.length - 1][1];
}

// Wash the land colour toward olive where WorldCover records woodland and
// toward dusty sage where it records scrub, interpolated between cells.
function vegetate(base, elev, xKm, yKm) {
  const { cols, rows, stepKm } = MAP.landcover;
  const gx = Math.max(0, Math.min(cols - 1.001, xKm / stepKm - 0.5)), gy = Math.max(0, Math.min(rows - 1.001, yKm / stepKm - 0.5));
  const x0 = Math.floor(gx), y0 = Math.floor(gy), tx = gx - x0, ty = gy - y0, i = y0 * cols + x0;
  const lerp = a => ((a[i] * (1 - tx) + a[i + 1] * tx) * (1 - ty) + (a[i + cols] * (1 - tx) + a[i + cols + 1] * tx) * ty) / 255;
  const tree = lerp(LC_TREE) * 0.42, shrub = lerp(LC_SHRUB) * 0.3, crop = lerp(LC_CROP) * 0.16;
  const green = elev > 1100 ? [92, 108, 72] : [118, 124, 76], sage = [150, 145, 100], tilled = [204, 192, 128];
  return base.map((v, k) => v * (1 - tree - shrub - crop) + green[k] * tree + sage[k] * shrub + tilled[k] * crop);
}

function drawRelief(canvas, kmPerPx) {
  const { cols, rows, stepKm } = MAP.relief;
  const W = Math.round(MAP.widthKm / kmPerPx), H = Math.round(MAP.heightKm / kmPerPx);
  canvas.width = W; canvas.height = H;
  // Shade per DEM node, then interpolate per pixel.
  const shade = new Float32Array(cols * rows), Z = 2.2, alt = 38 * Math.PI / 180;
  const lx = -Math.cos(alt) * Math.SQRT1_2, ly = -Math.cos(alt) * Math.SQRT1_2, lz = Math.sin(alt);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const e = (cc, rr) => DEM[Math.max(0, Math.min(rows - 1, rr)) * cols + Math.max(0, Math.min(cols - 1, cc))];
    const dx = (e(c + 1, r) - e(c - 1, r)) / (2 * stepKm * 1000) * Z, dy = (e(c, r + 1) - e(c, r - 1)) / (2 * stepKm * 1000) * Z;
    const n = Math.hypot(dx, dy, 1);
    shade[r * cols + c] = (-dx * lx - dy * ly + lz) / n / lz;
  }
  const ctx = canvas.getContext('2d'), img = ctx.createImageData(W, H), px = img.data;
  for (let y = 0; y < H; y++) {
    const gy = Math.min(rows - 1.001, (y + 0.5) * kmPerPx / stepKm), y0 = Math.floor(gy), ty = gy - y0;
    for (let x = 0; x < W; x++) {
      const gx = Math.min(cols - 1.001, (x + 0.5) * kmPerPx / stepKm), x0 = Math.floor(gx), tx = gx - x0, i = y0 * cols + x0;
      const w00 = (1 - tx) * (1 - ty), w10 = tx * (1 - ty), w01 = (1 - tx) * ty, w11 = tx * ty;
      const e = DEM[i] * w00 + DEM[i + 1] * w10 + DEM[i + cols] * w01 + DEM[i + cols + 1] * w11;
      const s = shade[i] * w00 + shade[i + 1] * w10 + shade[i + cols] * w01 + shade[i + cols + 1] * w11;
      const base = vegetate(hypso(e), e, (x + 0.5) * kmPerPx, (y + 0.5) * kmPerPx), k = Math.max(0.2, Math.min(1.45, s));
      let rC, gC, bC;
      if (k < 1) { const t = (1 - k) * 0.95; rC = base[0] * (1 - t) + 74 * t; gC = base[1] * (1 - t) + 58 * t; bC = base[2] * (1 - t) + 44 * t; }
      else { const t = (k - 1) * 0.85; rC = base[0] + (250 - base[0]) * t; gC = base[1] + (243 - base[1]) * t; bC = base[2] + (222 - base[2]) * t; }
      const o = (y * W + x) * 4;
      px[o] = rC; px[o + 1] = gC; px[o + 2] = bC; px[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

// ---------------------------------------------------------------------------
// Static cartography

function drawStaticMap() {
  const svg = R.mapSvg;
  svg.setAttribute('viewBox', `0 0 ${BOARD_W} ${BOARD_H}`);
  svg.innerHTML = '';
  const g = cls => svgEl('g', { class: cls }, svg);

  // Political spheres: faint wash plus an inset border in each power's colour.
  const politics = g('politics');
  for (const power of POWERS) {
    const mine = HEXES.filter(h => h.territory === power.id);
    if (!mine.length) continue;
    const fill = mine.map(h => linePath(hexCorners(h.x, h.y)) + 'Z').join('');
    svgEl('path', { d: fill, class: `realm-fill realm-${power.id}`, fill: power.color }, politics);
    let edge = '';
    for (const h of mine) for (let dir = 0; dir < 6; dir++) {
      const n = h.nbr[dir];
      if (n < 0 || HEXES[n].territory === power.id) continue;
      const a = DIR_ANGLE[dir] * Math.PI / 180, inset = 3.2;
      const cx = h.x - Math.cos(a) * inset, cy = h.y - Math.sin(a) * inset;
      edge += linePath(edgeCorners(cx, cy, dir));
    }
    svgEl('path', { d: edge, class: 'realm-edge', stroke: power.color }, politics);
  }
  // Shared frontier line on top of the coloured insets.
  let frontier = '';
  for (const h of HEXES) for (let dir = 0; dir < 3; dir++) {
    const n = h.nbr[dir];
    if (n >= 0 && HEXES[n].territory !== h.territory) frontier += linePath(edgeCorners(h.x, h.y, dir));
  }
  svgEl('path', { d: frontier, class: 'frontier' }, politics);

  // Vegetation symbols, scattered deterministically within each covered hex.
  // Vegetation and fields are scattered on a jittered grid that ignores the
  // hexes, sampled straight from the land-cover data, so the pattern reads
  // as countryside rather than repeating tile by tile.
  const STEP = 19, glyph = { pine: '', canopy: '', shade: '', scrub: '' };
  let plots = '', plots2 = '', furrows = '';
  // Field systems share an orientation across a district, as real ones do.
  const lattice = (i, j) => hash2(i + 9000, j + 7000), smooth = t => t * t * (3 - 2 * t);
  const field = (x, y) => {
    const fx = x / 260, fy = y / 260, i = Math.floor(fx), j = Math.floor(fy), u = smooth(fx - i), v = smooth(fy - j);
    return (lattice(i, j) * (1 - u) + lattice(i + 1, j) * u) * (1 - v) + (lattice(i, j + 1) * (1 - u) + lattice(i + 1, j + 1) * u) * v;
  };
  const settled = Object.values(MAP.places).filter(p => p.kind !== 'village').map(p => [kmToPx(p.x), kmToPx(p.y)]);
  for (let gy = 0; gy * STEP < BOARD_H; gy++) for (let gx = 0; gx * STEP < BOARD_W; gx++) {
    const r1 = hash2(gx, gy), r2 = hash2(gy + 101, gx + 37), r3 = hash2(gx + 517, gy + 211);
    const x = (gx + 0.15 + r1 * 0.7) * STEP, y = (gy + 0.15 + r2 * 0.7) * STEP;
    if (settled.some(([sx, sy]) => Math.abs(sx - x) < 9 && Math.abs(sy - y) < 9)) continue;
    const [tree, shrub, crop] = vegetationKm(x / PX_PER_KM, y / PX_PER_KM);
    if (tree > 0.3 && r3 < tree * 0.95) {
      const sz = 0.75 + hash2(gx + 3, gy + 5) * 0.55;
      if (elevationKm(x / PX_PER_KM, y / PX_PER_KM) > 1100) glyph.pine += `M${f1(x)} ${f1(y - 6.5 * sz)}l${f1(3.2 * sz)} ${f1(7.5 * sz)}h${f1(-6.4 * sz)}z`;
      else {
        const rr = 2.6 * sz, ox = (hash2(gx, gy + 9) - 0.5) * 4;
        glyph.shade += `M${f1(x + 0.9 - rr)} ${f1(y + 1)}a${f1(rr)} ${f1(rr * 0.85)} 0 1 0 ${f1(rr * 2)} 0a${f1(rr)} ${f1(rr * 0.85)} 0 1 0 ${f1(-rr * 2)} 0`;
        glyph.canopy += `M${f1(x - rr)} ${f1(y)}a${f1(rr)} ${f1(rr * 0.85)} 0 1 0 ${f1(rr * 2)} 0a${f1(rr)} ${f1(rr * 0.85)} 0 1 0 ${f1(-rr * 2)} 0`;
        if (tree > 0.6) glyph.canopy += `M${f1(x + ox - rr * 0.7)} ${f1(y - 2.4)}a${f1(rr * 0.7)} ${f1(rr * 0.6)} 0 1 0 ${f1(rr * 1.4)} 0a${f1(rr * 0.7)} ${f1(rr * 0.6)} 0 1 0 ${f1(-rr * 1.4)} 0`;
      }
    } else if (shrub + tree * 0.5 > 0.25 && r3 < (shrub + tree * 0.5) * 1.1) {
      glyph.scrub += `M${f1(x - 3)} ${f1(y)}q.8-2.4 1.6-.3q.8-2.8 1.5-.2q.8-2.2 1.5.3`;
    } else if (crop > 0.4 && r3 < crop * 1.1) {
      const turn = field(x, y) * Math.PI + (r1 > 0.8 ? Math.PI / 2 : 0), ca = Math.cos(turn), sa = Math.sin(turn);
      const w = 6 + r2 * 2.5, hh = 3.2 + r3 * 1.6, pt = (u, v) => `${f1(x + u * ca - v * sa)} ${f1(y + u * sa + v * ca)}`;
      const plot = `M${pt(-w, -hh)}L${pt(w, -hh)}L${pt(w, hh)}L${pt(-w, hh)}Z`;
      if (hash2(gx + 41, gy + 13) < 0.4) plots2 += plot; else plots += plot;
      for (let f = -hh + 1.5; f < hh - 0.5; f += 1.7) furrows += `M${pt(-w + 1, f)}L${pt(w - 1, f)}`;
    }
  }
  const farm = g('farmland');
  if (plots) svgEl('path', { d: plots, class: 'field ochre' }, farm);
  if (plots2) svgEl('path', { d: plots2, class: 'field green' }, farm);
  if (furrows) svgEl('path', { d: furrows, class: 'furrow' }, farm);
  const veg = g('vegetation');
  for (const [kind, d] of Object.entries(glyph)) if (d) svgEl('path', { d, class: `veg ${kind}` }, veg);

  // Streams that really do die out on the plain taper over their last stretch
  // instead of stopping abruptly.
  const TAIL_KM = 1.6;
  const splitTail = line => {
    let km = 0, i = line.length - 1;
    for (; i > 0 && km < TAIL_KM; i--) km += Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]);
    return [line.slice(0, i + 1), line.slice(i)];
  };
  const water = g('water'), tails = { drainage: '', nala: '', river: '' };
  let drain = '';
  MAP.drainage.forEach((line, i) => {
    if (MAP.drainageFades?.[i] && line.length > 2) { const [body, tail] = splitTail(line); drain += smoothPath(body); tails.drainage += smoothPath(tail); }
    else drain += smoothPath(line);
  });
  svgEl('path', { d: drain, class: 'drainage' }, water);
  if (tails.drainage) svgEl('path', { d: tails.drainage, class: 'drainage tail' }, water);
  for (const cls of ['nala', 'river', 'major']) {
    let d = '';
    for (const r of MAP.rivers.filter(rv => rv.cls === cls)) r.lines.forEach((line, i) => {
      if (r.fades?.[i] && line.length > 2) { const [body, tail] = splitTail(line); d += smoothPath(body); tails[cls] = (tails[cls] || '') + smoothPath(tail); }
      else d += smoothPath(line);
    });
    svgEl('path', { d, class: `river-bank ${cls}` }, water);
    svgEl('path', { d, class: `river-water ${cls}` }, water);
    if (tails[cls]) svgEl('path', { d: tails[cls], class: `river-water ${cls} tail` }, water);
  }

  const roads = g('roads');
  for (const grade of [3, 2, 1]) {
    const d = MAP.roads.filter(r => r.grade === grade).flatMap(r => r.lines).map(smoothPath).join('');
    if (grade === 1) svgEl('path', { d, class: 'road-casing' }, roads);
    svgEl('path', { d, class: `road grade-${grade}` }, roads);
  }
  // Ghats: a ferry bar drawn across the river.
  for (const ghat of Object.values(MAP.ghats)) {
    const x = kmToPx(ghat.x), y = kmToPx(ghat.y), dir = riverDirection(ghat.x, ghat.y), nx = -dir[1], ny = dir[0];
    svgEl('path', { d: `M${f1(x - nx * 11)} ${f1(y - ny * 11)}L${f1(x + nx * 11)} ${f1(y + ny * 11)}`, class: 'ghat-bar' }, roads);
    svgEl('circle', { cx: f1(x), cy: f1(y), r: 3.4, class: 'ghat-dot' }, roads);
  }

  // Hex lattice: each hex draws its three southern edges.
  let grid = '';
  for (const h of HEXES) { const c = hexCorners(h.x, h.y); grid += linePath([c[0], c[1], c[2], c[3]]); }
  svgEl('path', { d: grid, class: 'hexgrid' }, svg);

  // Settlement symbols.
  const towns = g('settlements');
  for (const [key, p] of Object.entries(MAP.places)) {
    const x = kmToPx(p.x), y = kmToPx(p.y);
    if (p.kind === 'fort') svgEl('path', { d: fortGlyph(x, y, 7), class: 'sym fort' }, towns);
    else if (p.kind === 'city') svgEl('rect', { x: f1(x - 5.5), y: f1(y - 5.5), width: 11, height: 11, class: 'sym city' }, towns);
    else if (p.kind === 'sarai') svgEl('rect', { x: f1(x - 4), y: f1(y - 4), width: 8, height: 8, class: 'sym sarai' }, towns);
    else svgEl('circle', { cx: f1(x), cy: f1(y), r: p.kind === 'town' ? 4.2 : p.tier >= 4 ? 1.8 : 2.6, class: `sym ${p.kind}${p.tier >= 4 ? ' minor' : ''}` }, towns);
    if (key === 'mirpur') svgEl('circle', { cx: f1(x), cy: f1(y), r: 9, class: 'sym ring' }, towns);
  }

  // Graticule ticks on the neat line every 0.1°.
  const frame = g('graticule');
  const { west, east, north, south } = MAP.bounds;
  for (let lon = Math.ceil(west * 10) / 10; lon <= east + 1e-9; lon += 0.1) {
    const x = kmToPx((lon - west) * MAP.kmPerDegLon);
    svgEl('path', { d: `M${f1(x)} 0V9M${f1(x)} ${BOARD_H}V${BOARD_H - 9}`, class: 'tick' }, frame);
  }
  for (let lat = Math.ceil(south * 10) / 10; lat <= north + 1e-9; lat += 0.1) {
    const y = kmToPx((north - lat) * MAP.kmPerDegLat);
    svgEl('path', { d: `M0 ${f1(y)}H9M${BOARD_W} ${f1(y)}H${BOARD_W - 9}`, class: 'tick' }, frame);
  }
}

function fortGlyph(x, y, s) {
  // Square trace with four corner bastions.
  const b = s * 0.55, pts = [];
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) pts.push([x + sx * s, y + sy * s]);
  let d = linePath(pts) + 'Z';
  for (const [px, py] of pts) d += `M${f1(px - b)} ${f1(py)}L${f1(px)} ${f1(py - b)}L${f1(px + b)} ${f1(py)}L${f1(px)} ${f1(py + b)}Z`;
  return d;
}

function riverDirection(xKm, yKm) {
  let best = null;
  for (const r of MAP.rivers) if (r.cls === 'major') for (const line of r.lines) for (let i = 1; i < line.length; i++) {
    const [ax, ay] = line[i - 1], [bx, by] = line[i], d = Math.hypot((ax + bx) / 2 - xKm, (ay + by) / 2 - yKm);
    if (!best || d < best.d) { const len = Math.hypot(bx - ax, by - ay) || 1; best = { d, v: [(bx - ax) / len, (by - ay) / len] }; }
  }
  return best ? best.v : [1, 0];
}

// ---------------------------------------------------------------------------
// Labels: constant on-screen size, decluttered for the current zoom.


function buildLabels() {
  R.labels.innerHTML = '';
  R.labelItems = [];
  const add = (x, y, text, cls, tier, prio, angle = 0, anchored = true) => {
    const node = el('div', `label ${cls}`, R.labels);
    node.style.left = `${f1(x)}px`; node.style.top = `${f1(y)}px`;
    const span = el('span', null, node);
    span.textContent = text;
    if (angle) span.style.setProperty('--angle', `${angle}deg`);
    R.labelItems.push({ node, span, x, y, tier, prio, anchored, w: 0, h: 0 });
  };
  for (const [key, p] of Object.entries(MAP.places)) {
    const strong = STRONGPOINTS.includes(key) || POWERS.some(pw => pw.npc && pw.seat === key);
    add(kmToPx(p.x), kmToPx(p.y), p.name, `place ${p.kind} tier-${p.tier}${strong ? ' strong' : ''}`, strong ? 1 : p.tier, (strong ? 0 : 10) + p.tier * 3 + (p.kind === 'village' ? 2 : 0));
  }
  for (const x of SCN.labels) {
    const [kx, ky] = geoToKm(x.lat, x.lon);
    add(kmToPx(kx), kmToPx(ky), x.text, x.cls, x.tier, x.cls === 'region' ? 30 : 20, x.angle || 0, false);
  }
  measureLabels();
}
function measureLabels() {
  for (const item of R.labelItems) { const hidden = item.node.hidden; item.node.hidden = false; item.w = item.span.offsetWidth; item.h = item.span.offsetHeight; item.node.hidden = hidden; }
}

// Counters grow on screen when zoomed out so they stay legible.
const unitScale = z => Math.max(1, Math.min(2.4, 1.05 / z));
const placePx = key => [kmToPx(MAP.places[key].x), kmToPx(MAP.places[key].y)];

function layoutLabels() {
  const z = R.cam.z, placed = [], uh = 22 * unitScale(z) * z + 2;
  // Counters and markers are obstacles: names go beside them, never under them.
  if (S) {
    const stacks = new Map();
    for (const u of S.units) stacks.set(u.hex, (stacks.get(u.hex) || 0) + 1);
    for (const [hex, n] of stacks) { const h = HEXES[hex], spread = (n - 1) * 8 * z * unitScale(z); placed.push([h.x * z - uh - spread, h.y * z - uh * 1.15, uh * 2 + spread * 2, uh * 2.2]); }
  }
  // Markers sit at the town's true position and keep a constant on-screen size.
  for (const key of STRONGPOINTS) { const [x, y] = placePx(key); placed.push([x * z + 3, y * z - 23, 16, 16]); }
  for (const p of POWERS) if (p.npc) { const [x, y] = placePx(p.seat); placed.push([x * z - 17, y * z - 28, 16, 24]); }
  for (const key of FORTS) { const [x, y] = placePx(key); placed.push([x * z + 3, y * z - 17, 12, 12]); }
  const visibleTier = z < 0.42 ? 1 : z < 0.8 ? 2 : z < 1.35 ? 3 : 4;
  // Only names on (or near) the screen take part in the layout.
  const vw = R.view.clientWidth, vh = R.view.clientHeight, cx = -R.cam.x, cy = -R.cam.y;
  const items = [...R.labelItems].sort((a, b) => a.prio - b.prio);
  const overlaps = box => placed.some(p => box[0] < p[0] + p[2] && box[0] + box[2] > p[0] && box[1] < p[1] + p[3] && box[1] + box[3] > p[1]);
  for (const it of items) {
    if (it.tier > visibleTier) { it.node.hidden = true; continue; }
    if (it.x * z < cx - 200 || it.x * z > cx + vw + 200 || it.y * z < cy - 100 || it.y * z > cy + vh + 100) { it.node.hidden = true; continue; }
    // Names sit tight against their town symbol; wider rings are fallbacks.
    const sx = it.x * z, sy = it.y * z, w = it.w, h = it.h, options = [];
    if (it.anchored) for (const gap of [7, 14, uh + 4]) options.push([gap, -h / 2], [-w - gap, -h / 2], [-w / 2, gap - 2], [-w / 2, -h - gap], [gap * 0.8, gap * 0.6], [-w - gap * 0.8, gap * 0.6]);
    else options.push([-w / 2, -h / 2]);
    let chosen = null;
    const onBoard = box => box[0] >= 2 && box[1] >= 2 && box[0] + box[2] <= BOARD_W * z - 2 && box[1] + box[3] <= BOARD_H * z - 2;
    for (const [dx, dy] of options) {
      const box = [sx + dx - 2, sy + dy - 1, w + 4, h + 2];
      if (!overlaps(box) && onBoard(box)) { chosen = [dx, dy, box]; break; }
    }
    if (!chosen && it.tier === 1 && it.anchored) {
      // Key names always show: take the spot that covers the least.
      const cover = box => placed.reduce((s, p) => s + Math.max(0, Math.min(box[0] + box[2], p[0] + p[2]) - Math.max(box[0], p[0])) * Math.max(0, Math.min(box[1] + box[3], p[1] + p[3]) - Math.max(box[1], p[1])), 0);
      const scored = options.map(([dx, dy]) => [dx, dy, [sx + dx, sy + dy, w, h]]).sort((a, b) => (onBoard(b[2]) - onBoard(a[2])) || cover(a[2]) - cover(b[2]));
      chosen = scored[0];
    }
    if (!chosen) { it.node.hidden = true; continue; }
    it.node.hidden = false;
    it.span.style.transform = `translate(${f1(chosen[0])}px, ${f1(chosen[1])}px)${it.anchored ? '' : ' rotate(var(--angle, 0deg))'}`;
    if (it.anchored || it.node.classList.contains('region')) placed.push(chosen[2]);
  }
}

// ---------------------------------------------------------------------------
// Objective markers and unit counters

function drawMarkers() {
  R.markers.innerHTML = '';
  for (const key of STRONGPOINTS) {
    const [x, y] = placePx(key), m = el('div', `marker strongpoint owner-${S.owners[key] || 'none'}`, R.markers);
    m.style.left = `${f1(x)}px`; m.style.top = `${f1(y)}px`;
    m.innerHTML = '<i></i>';
    m.title = `${MAP.places[key].name} — strongpoint (${S.owners[key] ? SIDES[S.owners[key]].name : 'unclaimed'})`;
  }
  for (const key of FORTS) {
    const [x, y] = placePx(key), owner = S.forts[key], m = el('div', `marker fortflag owner-${owner || 'none'}`, R.markers);
    m.style.left = `${f1(x)}px`; m.style.top = `${f1(y)}px`;
    m.innerHTML = '<i></i>';
    m.title = `${MAP.places[key].name} — fort (${owner ? `held by the ${SIDES[owner].name}; a supply source` : 'ungarrisoned'})`;
  }
  for (const power of POWERS.filter(p => p.npc)) {
    const [x, y] = placePx(power.seat), ally = S.allies[power.id], m = el('div', `marker seat ally-${ally || 'none'}`, R.markers);
    m.style.left = `${f1(x)}px`; m.style.top = `${f1(y)}px`;
    m.style.setProperty('--power', power.color);
    m.innerHTML = '<i></i><b></b>';
    m.title = `${power.name} — seat of a local power (${ally ? `allied to the ${SIDES[ally].name}` : 'uncommitted'})`;
  }
  // Crossed swords where a battle or siege was fought, in the victor's colour.
  for (const b of S.battles) if (!b.open && b.major) {
    const h = HEXES[b.focus], m = el('div', `marker battle won-${b.victor || 'none'}`, R.markers);
    m.style.left = `${f1(h.x)}px`; m.style.top = `${f1(h.y)}px`;
    m.dataset.battle = b.id;
    m.innerHTML = '<i><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4l10.5 10.5M16 4L5.5 14.5M12.6 16.4l3.8-3.8M3.6 12.6l3.8 3.8"/></svg></i>';
    m.title = `${b.account?.name || b.name}, ${b.last > b.first ? `days ${b.first}–${b.last}` : `day ${b.first}`}: ${b.account?.verdict || ''} (click to read)`;
  }
}

// Counters are drawn as miniature stands: five soldiers (or five gun crew)
// on a base, each one a fifth of the formation's strength. Losses remove
// figures from the flanks inward, so the standard-bearer is the last to fall.
// Period palette: vegetable-dyed coats with soft shading (gradients are
// defined once in the page; see ensureFigureDefs), fine sepia outlines.
const PALETTE = {
  azure: { coat: 'url(#coat-azure)', flat: '#3d6688', turban: '#ece4cf', sash: '#c99a45', legs: '#ddd3bd', flag: '#5fb8c9', edge: '#e9f6f8' },
  red:   { coat: 'url(#coat-red)', flat: '#93402f', turban: '#e6dccb', sash: '#c9a14e', legs: '#d3c6ab', flag: '#c8503d', edge: '#f3d9a8' },
};
const INK = '#2a1c11', SKIN = '#a57653', WOOD = '#5e4127', STEEL = '#c9ccc8', IRON = '#3a3732', BRASS = '#b08a48';
const HORSE_COATS = ['#7b5233', '#5d3d27', '#9a7350', '#b9a183', '#6e4630'];
const LINE = `stroke="${INK}" stroke-width=".42" stroke-linejoin="round"`;

function ensureFigureDefs() {
  if (document.getElementById('figure-defs')) return;
  const grad = (id, top, bottom) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>`;
  document.body.insertAdjacentHTML('afterbegin', `<svg id="figure-defs" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${grad('coat-azure', '#5a84a3', '#2e4b66')}${grad('coat-red', '#ab5a44', '#6c2a1e')}${grad('bronze', '#c7a061', '#6f5026')}</defs></svg>`);
}

// A standing figure, feet at the origin, about 24 units tall, facing right.
function footFigure(variant, p) {
  const arm = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${p.flat}" stroke-width="1.15" stroke-linecap="round"/>`;
  const weapon = {
    // Toradar matchlock carried at the slope, with its brass bands.
    'Matchlockmen': { back: `<path d="M-3.4 -7.5L8.6 -22.5" stroke="${WOOD}" stroke-width="1.05" stroke-linecap="round"/><path d="M6.2 -19.5L8.6 -22.5" stroke="${STEEL}" stroke-width=".8"/><path d="M-1.4 -10L-.9 -10.6M2.2 -14.6L2.7 -15.2" stroke="${BRASS}" stroke-width="1.3"/>`, front: arm(1.3, -15.5, 2.6, -13.6) },
    // Round dhal with four bosses and a curved talwar raised.
    'Dhal & Talwar': { back: `<path d="M2.4 -14.8Q6.8 -18.8 6.2 -24" stroke="${STEEL}" stroke-width=".9" fill="none" stroke-linecap="round"/>${arm(1.2, -15.6, 2.6, -15)}`, front: `<circle cx="-2.6" cy="-11.4" r="3.1" fill="#6b4c2c" ${LINE}/><circle cx="-2.6" cy="-11.4" r="2.2" fill="none" stroke="${BRASS}" stroke-width=".35"/>${[[-3.5, -12.3], [-1.7, -12.3], [-3.5, -10.5], [-1.7, -10.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".38" fill="${BRASS}"/>`).join('')}` },
    // Long spear with a leaf blade, grounded beside the man.
    'Spearmen': { back: `<path d="M3.8 .6L3.8 -27" stroke="${WOOD}" stroke-width=".8"/><path d="M3.8 -31L4.9 -27.6Q3.8 -26.6 2.7 -27.6Z" fill="${STEEL}" ${LINE}/>`, front: arm(1.3, -15.6, 3.7, -13.8) },
    crew: { back: `<path d="M-6.5 -3.5L6.5 -17" stroke="${WOOD}" stroke-width=".8"/>`, front: arm(1.2, -15.4, 3.2, -12.6) },
  }[variant] || { back: '', front: '' };
  return weapon.back
    // Churidar legs and dark jutti shoes.
    + `<path d="M-1.2 -.3L-1 -6.8M1.3 -.3L1.1 -6.8" stroke="${p.legs}" stroke-width="1.05" stroke-linecap="round"/><path d="M-2 .1H-.5M.5 .1H2.1" stroke="${INK}" stroke-width=".8" stroke-linecap="round"/>`
    // Jama: fitted bodice, flared skirt to below the knee.
    + `<path d="M-1.8 -16.4Q0 -17 1.8 -16.4L2.1 -11.6Q4.2 -8.6 4.4 -6.2Q0 -5.2 -4.4 -6.2Q-4.2 -8.6 -2.1 -11.6Z" fill="${p.coat}" ${LINE}/>`
    + `<path d="M-2.2 -11.8Q0 -11.3 2.2 -11.8" stroke="${p.sash}" stroke-width=".9" fill="none"/><path d="M-.2 -11.2L.4 -7.8" stroke="${p.sash}" stroke-width=".5"/>`
    // Head, beard and a wrapped pagri with its tail.
    + `<path d="M-.5 -16.6V-17.5" stroke="${SKIN}" stroke-width=".9"/><ellipse cx="0" cy="-18.6" rx="1.15" ry="1.35" fill="${SKIN}" ${LINE}/><path d="M-.8 -17.9Q0 -16.8 1.1 -17.8" stroke="#2d2620" stroke-width=".55" fill="none"/>`
    + `<path d="M-1.45 -19.1Q-1.5 -21.2 0 -21.4Q1.6 -21.3 1.45 -19.2Q0 -18.8 -1.45 -19.1Z" fill="${p.turban}" ${LINE}/><path d="M-1.3 -19.4Q-2.6 -18.6 -2.3 -17.2" stroke="${p.turban}" stroke-width=".55" fill="none"/>`
    + weapon.front;
}

// A horseman, hooves at the origin, facing right.
function riderFigure(variant, p, coat) {
  const dark = '#2e2118';
  const weapon = {
    'Lancers': `<path d="M-6 -11.5L15 -31" stroke="${WOOD}" stroke-width=".75"/><path d="M15 -31L13.7 -28.6L14.6 -28.5Z" fill="${STEEL}" ${LINE}/><path d="M13.6 -29.4L10.8 -28.6L12.4 -27.3Z" fill="${p.flag}"/>`,
    'Mounted Matchlocks': `<path d="M-3.6 -15.8L10.4 -21.6" stroke="${WOOD}" stroke-width=".95" stroke-linecap="round"/><path d="M8.6 -20.8L10.4 -21.6" stroke="${STEEL}" stroke-width=".7"/>`,
    'Irregular Sowars': `<path d="M1.6 -19.4Q5.2 -23.2 3.6 -28.4" stroke="${STEEL}" stroke-width=".85" fill="none" stroke-linecap="round"/>`,
  }[variant] || '';
  return `<path d="M-8.2 -10.4Q-10.6 -9 -10 -4.2Q-9.6 -6.6 -8.8 -8.2" fill="${dark}" stroke="${dark}" stroke-width=".6"/>`
    // Legs with knees and hocks.
    + `<path d="M-6.3 -8.2L-7.4 -4.4L-6.6 0M-4.6 -7.6L-5.1 -4L-4.3 0M3.6 -7.6L3.2 -3.8L3.8 0M5.1 -7.8L5.8 -4.1L5.2 0" stroke="${coat}" stroke-width="1.05" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    + `<path d="M-7 -.1H-6M-4.7 -.1H-3.8M3.4 -.1H4.3M4.8 -.1H5.7" stroke="${dark}" stroke-width=".8"/>`
    // Barrel, chest and an arched neck to a tapered head.
    + `<path d="M-8.6 -9.6C-9 -12.2 -6 -12.8 -3 -12.2L3.4 -12.4C5.2 -12.6 6.2 -13.4 7.2 -15.6L8.5 -18C9.1 -18.8 10.3 -18.6 11.2 -17.6L12.6 -15.8C12.9 -15.2 12.4 -14.7 11.8 -14.9L10.4 -15.4C9.6 -13.8 8.8 -11.8 7.6 -10.4C7 -8.8 6.2 -7.8 4.8 -7.6L-4.6 -7.4C-6.6 -7.4 -8.2 -8 -8.6 -9.6Z" fill="${coat}" ${LINE}/>`
    + `<path d="M7 -15.4Q8.2 -17.8 9.2 -18.6" stroke="${dark}" stroke-width=".9" fill="none"/>`
    // Saddle cloth, rider seated with leg down the flank.
    + `<path d="M-3.4 -12.4H2.8L2.2 -9.6H-2.8Z" fill="${p.sash}" ${LINE}/>`
    + `<path d="M.2 -12.6L1 -9.2L.4 -7.6" stroke="${p.legs}" stroke-width="1.05" fill="none" stroke-linecap="round"/>`
    + `<path d="M-1.6 -12.6Q-.2 -13.2 1.4 -12.6L1.2 -18.6Q0 -19.2 -1.2 -18.6Z" fill="${p.coat}" ${LINE}/>`
    + `<ellipse cx=".1" cy="-20.4" rx="1.05" ry="1.25" fill="${SKIN}" ${LINE}/><path d="M-1.3 -20.8Q-1.3 -22.8 .1 -23Q1.5 -22.9 1.35 -20.9Q.1 -20.5 -1.3 -20.8Z" fill="${p.turban}" ${LINE}/>`
    + weapon;
}

function gunPiece(variant) {
  if (variant === 'Light Field Gun') return `<path d="M-1.5 -4.8L-14 -.2" stroke="${WOOD}" stroke-width="1.6" stroke-linecap="round"/><path d="M-6 -8.2L13.5 -11.6" stroke="url(#bronze)" stroke-width="2.6" stroke-linecap="round"/><path d="M-6 -8.2L13.5 -11.6" stroke="${INK}" stroke-width="2.6" stroke-opacity=".25" stroke-linecap="round" fill="none"/><circle cx="-6.4" cy="-8.1" r="1.1" fill="url(#bronze)" ${LINE}/>`
    + `<circle cx="-1" cy="-4.8" r="4.6" fill="none" stroke="${WOOD}" stroke-width="1.1"/><circle cx="-1" cy="-4.8" r="4.6" fill="none" stroke="${INK}" stroke-width=".3"/><path d="M-5.6 -4.8H3.6M-1 -9.4V-.2M-4.2 -8L2.2 -1.6M-4.2 -1.6L2.2 -8" stroke="${WOOD}" stroke-width=".45"/><circle cx="-1" cy="-4.8" r=".9" fill="${IRON}"/>`;
  if (variant === 'Jingal') return `<path d="M2 -9.6L-2.6 0M2 -9.6L6.4 0M2 -9.6L2.2 0" stroke="${WOOD}" stroke-width=".75"/><path d="M-13 -8.4L17 -11.6" stroke="${IRON}" stroke-width="1.25" stroke-linecap="round"/><path d="M-13 -8.4L-6 -9.2" stroke="${WOOD}" stroke-width="1.9" stroke-linecap="round"/>`;
  // Zamburak: a kneeling camel carrying a swivel gun.
  const camel = '#a9895f';
  return `<path d="M-6.4 -6L-7.4 -2.6L-6.6 0M-3.4 -6L-3.6 0M3.4 -6L3.6 -2.8L4.4 0M6.2 -6.2L7.6 0" stroke="${camel}" stroke-width="1" fill="none" stroke-linecap="round"/>`
    + `<path d="M-8 -8.4C-8.6 -11 -6.2 -11.6 -4 -11.8Q-1.8 -15.6 1.4 -12.2Q4 -12.4 5.6 -11L7.6 -14.6Q8.6 -17.8 10.6 -17.6L12.2 -17C12.6 -16.6 12.2 -16 11.6 -16.2L10.6 -16Q9.6 -12 7.8 -8.8Q7 -7 5 -6.6H-5.6C-7 -6.6 -7.8 -7.4 -8 -8.4Z" fill="${camel}" ${LINE}/>`
    + `<path d="M-2.4 -15.4L9.4 -18.2" stroke="url(#bronze)" stroke-width="1.5" stroke-linecap="round"/><path d="M1 -14L1.6 -16.2" stroke="${WOOD}" stroke-width=".7"/>`;
}
// Figure slots in the order they fall: flanks first, standard-bearer last.
const SLOTS = {
  foot:  [[11, 52, 1.2], [53, 52, 1.2], [21.5, 43, 1.05], [42.5, 43, 1.05], [32, 52, 1.2]],
  horse: [[12, 53, 1], [52, 53, 1], [22, 44, 0.9], [42, 44, 0.9], [32, 53, 1]],
  guns:  [[8, 53, 1.05], [56, 53, 1.05], [17, 43, 0.95], [47, 43, 0.95], [32, 41, 0.9]],
};

function unitSprite(u, cls = 'sprite') {
  const v = VARIANTS[u.variant], p = PALETTE[u.side], led = ledBy(u), slots = SLOTS[v.type], look = v.look || u.variant;
  const flagW = led ? 15 : 11, flagH = led ? 10 : 7.5, poleTop = led ? 3 : 8;
  const standard = `<path d="M32 44V${poleTop}" stroke="${INK}" stroke-width="2.2"/><path d="M32 44V${poleTop}" stroke="${led ? '#e8c46a' : WOOD}" stroke-width="1.1"/>`
    + `<path d="M33 ${poleTop + 1}h${flagW}l-3 ${flagH / 2} 3 ${flagH / 2}h-${flagW}z" fill="${p.flag}" stroke="${led ? '#f2d27c' : INK}" stroke-width="${led ? 1.3 : 0.7}"/>`
    + (led ? `<path d="M38.6 ${poleTop + 3.2}l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z" fill="#fff3c4"/><circle cx="32" cy="${poleTop - 1}" r="2" fill="#f2d27c" stroke="${INK}" stroke-width=".6"/>` : '');
  const figures = slots.map(([x, y, sc], i) => {
    const art = v.type === 'horse' ? riderFigure(look, p, HORSE_COATS[(i + u.id.length) % HORSE_COATS.length]) : footFigure(v.type === 'guns' ? 'crew' : look, p);
    return { y, svg: `<g class="fig" data-i="${i}"><g transform="translate(${x} ${y}) scale(${sc})">${art}</g></g>` };
  });
  const piece = v.type === 'guns' ? { y: 47, svg: `<g transform="translate(31 53) scale(1.15)">${gunPiece(look)}</g>` } : null;
  const body = [...figures, ...(piece ? [piece] : [])].sort((a, b) => a.y - b.y).map(f => f.svg).join('');
  // The Hill Confederacy faces west, the Durrani east: the armies face each other.
  const facing = u.side === 'azure' ? ' transform="translate(64 0) scale(-1 1)"' : '';
  return `<svg class="${cls}" viewBox="0 0 64 56" aria-hidden="true"><ellipse class="base" cx="32" cy="50.5" rx="27" ry="5.5"/><g${facing}>${standard}${body}</g></svg>`;
}
// Static snapshot for panels: hides fallen figures inline.
function unitPortrait(u, cls) {
  return unitSprite(u, cls).replace(/<g class="fig" data-i="(\d)">/g, (m, i) => +i < MAX_HP - u.hp ? '<g class="fig" style="display:none">' : m);
}

function syncUnits(animating = null) {
  const alive = new Set();
  const stacks = new Map();
  for (const u of S.units) { if (!stacks.has(u.hex)) stacks.set(u.hex, []); stacks.get(u.hex).push(u); }
  for (const u of S.units) {
    alive.add(u.id);
    let node = R.unitEls.get(u.id);
    if (!node) { node = el('div', 'unit', R.units); R.unitEls.set(u.id, node); }
    const look = `${u.variant}|${ledBy(u)}`;
    if (node.dataset.look !== look) {
      node.dataset.look = look;
      node.innerHTML = unitSprite(u);
      node._hp = u.hp;
    }
    // Figures fall (or return) one at a time as strength changes.
    const lost = MAX_HP - u.hp, was = MAX_HP - (node._hp ?? u.hp);
    node.querySelectorAll('.fig').forEach(f => {
      const i = +f.dataset.i, down = i < lost;
      f.classList.remove('falling', 'rising');
      if (down && i >= was) { f.classList.add('falling'); f.classList.remove('down'); }
      else if (!down && i < was) { f.classList.add('rising'); f.classList.remove('down'); }
      else f.classList.toggle('down', down);
    });
    node._hp = u.hp;
    const pile = stacks.get(u.hex), idx = pile.indexOf(u), mine = S.turn === u.side && !S.ai[u.side];
    node.className = `unit ${u.side} type-${VARIANTS[u.variant].type}${u.id === S.selected ? ' selected' : ''}${mine && !canActCached(u) ? ' spent' : ''}${mine && canActCached(u) ? ' ready' : ''}${wavering(u) ? ' wavering' : ''}${ledBy(u) ? ' led' : ''}${stockOf(u) < STOCK_HUNGRY ? ' oos' : ''}`;
    node.title = `${u.name} · ${SIDES[u.side].name} · ${men(u.hp)} of ${MEN_PER_FORMATION.toLocaleString('en')}${wavering(u) ? ' · wavering' : ''}${ledBy(u) ? ` · led by ${GENERALS[u.side].name}` : ''}} · supplies ${stockOf(u)}%`;
    if (animating === u.id) continue;
    const h = HEXES[u.hex], spread = 8 * unitScale(R.cam.z), off = pile.length > 1 ? (idx - (pile.length - 1) / 2) * spread * 2 : 0;
    node.style.setProperty('--x', `${f1(h.x + off)}px`);
    node.style.setProperty('--y', `${f1(h.y - (pile.length > 1 ? idx * spread * 0.6 - 3 : 0))}px`);
    node.style.zIndex = String(Math.round(h.y) * 4 + idx + (u.id === S.selected ? 3 : 0));
  }
  for (const [id, node] of R.unitEls) if (!alive.has(id)) { node.classList.add('gone'); R.unitEls.delete(id); setTimeout(() => node.remove(), 650); }
}

// canAct runs a full march search; memoise it per refresh.
let ACT_CACHE = new Map();
function canActCached(u) {
  if (!ACT_CACHE.has(u.id)) ACT_CACHE.set(u.id, canAct(u));
  return ACT_CACHE.get(u.id);
}

// ---------------------------------------------------------------------------
// Overlay: reachable ground, march path, targets, hover

function ferryGlyph(o, a, b, cls) {
  const A = HEXES[a], B = HEXES[b], mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, dx = (B.x - A.x) / 2, dy = (B.y - A.y) / 2;
  svgEl('path', { d: `M${f1(mx - dx * 0.8)} ${f1(my - dy * 0.8)}L${f1(mx + dx * 0.8)} ${f1(my + dy * 0.8)}`, class: `${cls}-rope` }, o);
  // A flat boat hull across the line of the crossing.
  const len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, px = -uy, py = ux;
  const pt = (u, v) => `${f1(mx + ux * u + px * v)} ${f1(my + uy * u + py * v)}`;
  svgEl('path', { d: `M${pt(-3.2, -7)}L${pt(3.2, -7)}L${pt(2.2, 7)}L${pt(-2.2, 7)}Z`, class: `${cls}-boat` }, o);
}

function drawOverlay(sel, reach, targets, pathHexes, pathCost, ferryPick = null, supplySide = null) {
  const o = R.overlay;
  o.innerHTML = '';
  if (supplySide) {
    const field = supplyField(supplySide);
    let d = '';
    // Strong wash where the wagons keep a formation fed; faint where they still reach.
    let reach = '';
    for (const h of HEXES) {
      const days = field[h.id] / WAGON_MP;
      if (days <= SUSTAINED) d += linePath(hexCorners(h.x, h.y)) + 'Z';
      else if (deliveryFor(days) > 0) reach += linePath(hexCorners(h.x, h.y)) + 'Z';
    }
    svgEl('path', { d, class: 'supply-area', fill: SIDES[supplySide].color }, o);
    svgEl('path', { d: reach, class: 'supply-area thin', fill: SIDES[supplySide].color }, o);
  }
  for (const f of S.ferries || []) ferryGlyph(o, f.a, f.b, 'ferry');
  if (ferryPick) for (const site of ferryPick.sites) {
    const h = HEXES[site];
    svgEl('polygon', { points: ptsAttr(hexCorners(h.x, h.y, 1.5)), class: 'ferry-site' }, o);
    ferryGlyph(o, ferryPick.from, site, 'ferry-plan');
  }
  if (sel) {
    const color = SIDES[sel.side].color;
    if (reach && reach.cost.size) {
      const set = reach.cost;
      svgEl('path', { d: [...set.keys()].map(id => linePath(hexCorners(HEXES[id].x, HEXES[id].y, 1)) + 'Z').join(''), class: 'reach-fill', fill: color }, o);
      let rim = '';
      const inside = id => id === sel.hex || set.has(id);
      for (const id of [...set.keys(), sel.hex]) {
        const h = HEXES[id];
        for (let dir = 0; dir < 6; dir++) if (!inside(h.nbr[dir])) rim += linePath(edgeCorners(h.x, h.y, dir));
      }
      svgEl('path', { d: rim, class: 'reach-rim', stroke: color }, o);
    }
    const s = HEXES[sel.hex];
    svgEl('polygon', { points: ptsAttr(hexCorners(s.x, s.y, 2)), class: 'sel-hex' }, o);
    const ring = 21 * unitScale(R.cam.z) + 4;
    for (const t of targets || []) {
      const h = HEXES[t.hex], a = ring + 2, b = ring + 11;
      svgEl('circle', { cx: f1(h.x), cy: f1(h.y), r: f1(ring), class: 'target-ring' }, o);
      svgEl('path', { d: `M${f1(h.x - b)} ${f1(h.y)}H${f1(h.x - a)}M${f1(h.x + a)} ${f1(h.y)}H${f1(h.x + b)}M${f1(h.x)} ${f1(h.y - b)}V${f1(h.y - a)}M${f1(h.x)} ${f1(h.y + a)}V${f1(h.y + b)}`, class: 'target-tick' }, o);
    }
    if (pathHexes && pathHexes.length > 1) {
      const pts = pathHexes.map(id => [HEXES[id].x, HEXES[id].y]);
      svgEl('path', { d: linePath(pts), class: 'march-path-shadow' }, o);
      svgEl('path', { d: linePath(pts), class: 'march-path', stroke: color }, o);
      const end = pts[pts.length - 1];
      svgEl('circle', { cx: f1(end[0]), cy: f1(end[1]), r: 11, class: 'march-end', stroke: color }, o);
      const t = svgEl('text', { x: f1(end[0]), y: f1(end[1] + 4), class: 'march-cost' }, o);
      t.textContent = pathCost;
    }
  }
  if (R.hover >= 0) {
    const h = HEXES[R.hover];
    svgEl('polygon', { points: ptsAttr(hexCorners(h.x, h.y, 1.5)), class: 'hover-hex' }, o);
  }
}

// ---------------------------------------------------------------------------
// Camera

function applyCamera() {
  const { x, y, z } = R.cam;
  R.board.style.transform = `translate(${f1(x)}px, ${f1(y)}px) scale(${z})`;
  R.board.style.setProperty('--inv', String(1 / z));
  R.board.style.setProperty('--mk', String(1 / z));
  R.board.style.setProperty('--unit-scale', String(unitScale(z)));
  R.view.classList.toggle('far', z < 0.42);
  R.view.classList.toggle('near', z >= 0.8);
  scheduleLabelLayout();
  UI.cameraChanged?.();
}
let labelTimer = 0, lastLayoutZ = 0;
function scheduleLabelLayout() {
  clearTimeout(labelTimer);
  labelTimer = setTimeout(() => { lastLayoutZ = R.cam.z; layoutLabels(); }, 70);
}
function zoomLimits() {
  const vw = R.view.clientWidth, vh = R.view.clientHeight;
  return { min: Math.min(vw / BOARD_W, vh / BOARD_H) * 0.92, max: 2.2 };
}
function clampCamera() {
  const vw = R.view.clientWidth, vh = R.view.clientHeight, c = R.cam, w = BOARD_W * c.z, h = BOARD_H * c.z, m = 120;
  c.x = w < vw ? (vw - w) / 2 : Math.min(m, Math.max(vw - w - m, c.x));
  c.y = h < vh ? (vh - h) / 2 : Math.min(m, Math.max(vh - h - m, c.y));
}
function zoomAt(z, sx, sy) {
  const { min, max } = zoomLimits(), c = R.cam, nz = Math.max(min, Math.min(max, z));
  const bx = (sx - c.x) / c.z, by = (sy - c.y) / c.z;
  c.z = nz; c.x = sx - bx * nz; c.y = sy - by * nz;
  clampCamera(); applyCamera();
}
function fitBoard() {
  R.cam.z = zoomLimits().min;
  clampCamera(); applyCamera();
}
let camAnim = 0;
function flyTo(bx, by, z = R.cam.z, ms = 380) {
  return new Promise(resolve => {
    cancelAnimationFrame(camAnim);
    const vw = R.view.clientWidth, vh = R.view.clientHeight, from = { ...R.cam };
    const to = { z, x: vw / 2 - bx * z, y: vh / 2 - by * z };
    { const keep = R.cam; R.cam = { ...to }; clampCamera(); Object.assign(to, R.cam); R.cam = keep; }
    const t0 = performance.now();
    const step = now => {
      const t = Math.min(1, (now - t0) / ms), e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      R.cam.x = from.x + (to.x - from.x) * e; R.cam.y = from.y + (to.y - from.y) * e; R.cam.z = from.z + (to.z - from.z) * e;
      applyCamera();
      if (t < 1) camAnim = requestAnimationFrame(step); else resolve();
    };
    camAnim = requestAnimationFrame(step);
  });
}
function hexOnScreen(hex, margin = 0.18) {
  const h = HEXES[hex], vw = R.view.clientWidth, vh = R.view.clientHeight, sx = h.x * R.cam.z + R.cam.x, sy = h.y * R.cam.z + R.cam.y;
  return sx > vw * margin && sx < vw * (1 - margin) && sy > vh * margin && sy < vh * (1 - margin);
}
function screenToBoard(clientX, clientY) {
  const r = R.view.getBoundingClientRect();
  return [(clientX - r.left - R.cam.x) / R.cam.z, (clientY - r.top - R.cam.y) / R.cam.z];
}

// ---------------------------------------------------------------------------

function initRenderer() {
  ensureFigureDefs();
  R.view = $('#viewport');
  R.board = $('#board');
  R.relief = $('#relief');
  R.mapSvg = $('#mapSvg');
  R.overlay = $('#overlay');
  R.markers = $('#markers');
  R.units = $('#units');
  R.labels = $('#labels');
  R.board.style.width = `${BOARD_W}px`;
  R.board.style.height = `${BOARD_H}px`;
  R.overlay.setAttribute('viewBox', `0 0 ${BOARD_W} ${BOARD_H}`);
  drawRelief(R.relief, 0.1);
  drawStaticMap();
  buildLabels();
}
