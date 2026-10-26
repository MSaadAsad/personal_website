'use strict';
// Map model: projection, hex lattice, terrain derived from the real relief,
// river crossings, roads and political geography.
//
// Coordinates: the survey data is in kilometres from the north-west corner
// (equirectangular, corrected for latitude so a kilometre is the same length
// in both directions). The board draws 16 px per km; each hex is 2 km across,
// so a day's march is a realistic number of hexes rather than slower units.

let MAP = null;  // the loaded map's data (dist/maps/<id>.js)
const PX_PER_KM = 16;
const HEX_KM = 2;
const HEX_D = HEX_KM * PX_PER_KM;              // centre-to-centre distance, px
const HEX_R = HEX_D / Math.sqrt(3);            // circumradius, px
const COL_W = HEX_R * 1.5;
let BOARD_W, BOARD_H, COLS, ROWS, ORIGIN_X, ORIGIN_Y;
function initGeometry() {
  BOARD_W = Math.round(MAP.widthKm * PX_PER_KM);
  BOARD_H = Math.round(MAP.heightKm * PX_PER_KM);
  COLS = Math.floor((BOARD_W - HEX_R * 1.5) / COL_W) + 1;
  ROWS = Math.floor((BOARD_H - HEX_D * 1.5) / HEX_D) + 1;
  ORIGIN_X = (BOARD_W - (COLS - 1) * COL_W) / 2;
  ORIGIN_Y = (BOARD_H - ((ROWS - 1) * HEX_D + HEX_D / 2)) / 2;
}

// Flat-topped hexes in axial coordinates. Order: SE, NE, N, NW, SW, S.
const DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
const DIR_ANGLE = [30, -30, -90, -150, 150, 90];

const kmToPx = km => km * PX_PER_KM;
const geoToKm = (lat, lon) => [(lon - MAP.bounds.west) * MAP.kmPerDegLon, (MAP.bounds.north - lat) * MAP.kmPerDegLat];

function hexCenter(c, r) {
  return { x: ORIGIN_X + c * COL_W, y: ORIGIN_Y + r * HEX_D + (c & 1 ? HEX_D / 2 : 0) };
}
function hexId(c, r) {
  return c < 0 || r < 0 || c >= COLS || r >= ROWS ? -1 : r * COLS + c;
}
function axialOf(c, r) {
  return { q: c, r: r - (c - (c & 1)) / 2 };
}
function offsetOf(q, r) {
  return { c: q, r: r + (q - (q & 1)) / 2 };
}
function pixelToHex(px, py) {
  const lx = px - ORIGIN_X, ly = py - ORIGIN_Y;
  const fq = (2 / 3 * lx) / HEX_R, fr = (-1 / 3 * lx + Math.sqrt(3) / 3 * ly) / HEX_R, fs = -fq - fr;
  let q = Math.round(fq), r = Math.round(fr), s = Math.round(fs);
  const dq = Math.abs(q - fq), dr = Math.abs(r - fr), ds = Math.abs(s - fs);
  if (dq > dr && dq > ds) q = -r - s; else if (dr > ds) r = -q - s;
  const o = offsetOf(q, r);
  return hexId(o.c, o.r);
}
function hexCorners(x, y, inset = 0) {
  const R = HEX_R - inset, pts = [];
  for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k; pts.push([x + R * Math.cos(a), y + R * Math.sin(a)]); }
  return pts;
}
// The two corners bounding the edge that faces direction `dir`.
function edgeCorners(x, y, dir) {
  const a = DIR_ANGLE[dir] * Math.PI / 180, b1 = a - Math.PI / 6, b2 = a + Math.PI / 6;
  return [[x + HEX_R * Math.cos(b1), y + HEX_R * Math.sin(b1)], [x + HEX_R * Math.cos(b2), y + HEX_R * Math.sin(b2)]];
}

// ---------------------------------------------------------------------------
// Relief

let DEM = null; // Int16Array of metres on a regular km grid (MAP.relief.stepKm)

async function loadRelief() {
  const bytes = Uint8Array.from(atob(MAP.relief.data), ch => ch.charCodeAt(0));
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'));
  const delta = new Int16Array(await new Response(stream).arrayBuffer());
  const { cols, rows } = MAP.relief;
  DEM = new Int16Array(delta.length);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c;
    DEM[i] = c ? DEM[i - 1] + delta[i] : delta[i];
  }
}

// Land cover from ESA WorldCover: shares of tree, shrub and cropland per cell (0–255).
let LC_TREE = null, LC_SHRUB = null, LC_CROP = null;

async function loadLandCover() {
  const bytes = Uint8Array.from(atob(MAP.landcover.data), ch => ch.charCodeAt(0));
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'));
  const all = new Uint8Array(await new Response(stream).arrayBuffer()), n = MAP.landcover.cols * MAP.landcover.rows;
  LC_TREE = all.subarray(0, n); LC_SHRUB = all.subarray(n, 2 * n); LC_CROP = all.subarray(2 * n, 3 * n);
}
// Period vegetation the satellite record no longer shows (the jungle round
// Chillianwala went under the plough with the canal colonies). A scenario sets
// these patches; they thicken the cover inside, patchily, fading at the edge.
let VEG_PATCHES = [];  // { x, y, r (km), tree, shrub }
function vegetationKm(xKm, yKm) {
  const { cols, rows, stepKm } = MAP.landcover;
  const c = Math.max(0, Math.min(cols - 1, Math.floor(xKm / stepKm))), r = Math.max(0, Math.min(rows - 1, Math.floor(yKm / stepKm))), i = r * cols + c;
  let tree = LC_TREE[i] / 255, shrub = LC_SHRUB[i] / 255, crop = LC_CROP[i] / 255;
  for (const p of VEG_PATCHES) {
    const d = Math.hypot(xKm - p.x, yKm - p.y) / p.r;
    if (d >= 1) continue;
    const w = Math.min(1, (1 - d) * 3) * (0.55 + 0.45 * hash2(Math.floor(xKm / 0.9) + 333, Math.floor(yKm / 0.9) + 777));
    tree = Math.max(tree, p.tree * w); shrub = Math.max(shrub, p.shrub * w); crop *= 1 - w;
  }
  return [tree, shrub, crop];
}

function elevationKm(xKm, yKm) {
  const { cols, rows, stepKm } = MAP.relief;
  const gx = Math.max(0, Math.min(cols - 1.001, xKm / stepKm)), gy = Math.max(0, Math.min(rows - 1.001, yKm / stepKm));
  const x0 = Math.floor(gx), y0 = Math.floor(gy), tx = gx - x0, ty = gy - y0, i = y0 * cols + x0;
  return (DEM[i] * (1 - tx) + DEM[i + 1] * tx) * (1 - ty) + (DEM[i + cols] * (1 - tx) + DEM[i + cols + 1] * tx) * ty;
}

// ---------------------------------------------------------------------------
// Terrain

const TERRAIN = {
  plain:    { name: 'Open plain',        move: 2, def: 0, note: 'Barani fields and grazing' },
  broken:   { name: 'Broken hills',      move: 3, def: 1, note: 'Ravines and low ridges' },
  hills:    { name: 'Hills',             move: 4, def: 2, note: 'Steep sandstone ridges' },
  mountain: { name: 'Mountains',         move: 6, def: 3, note: 'Pir Panjal spurs' },
};
// Cover classes follow ESA WorldCover. Its "tree cover" below ~1,100 m here is
// the dry subtropical scrub forest of phulai (Acacia modesta) and kao (wild
// olive); above that it is chir pine. Its "shrubland" is open thorn scrub.
const COVER = {
  scrub:  { name: 'Thorn scrub',  move: 1, def: 1, note: 'Ber and phulai bushes: slows a march, gives some cover' },
  woods:  { name: 'Scrub forest', move: 1, def: 2, note: 'Dense phulai and kao thicket: hard going, good cover; horse struggles' },
  forest: { name: 'Pine forest',  move: 1, def: 1, note: 'Chir pine on the upper slopes: horse struggles' },
};
const RIVER_CLASS = {
  nala:  { name: 'seasonal nala', move: 1, def: 1 },
  river: { name: 'river ford',    move: 3, def: 2 },
  major: { name: 'great river',   move: Infinity, def: 3 },
  ghat:  { name: 'ghat crossing', move: 3, def: 2 },
};

// Small deterministic hash so vegetation is patchy but stable between loads.
function hash2(a, b) {
  let h = Math.imul(a * 374761393 + b * 668265263, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const HEXES = [];

function buildHexes() {
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const { x, y } = hexCenter(c, r), id = HEXES.length, ax = axialOf(c, r);
    const xKm = x / PX_PER_KM, yKm = y / PX_PER_KM;
    // Sample the relief across the hex: centre plus two rings.
    let sum = 0, lo = Infinity, hi = -Infinity, n = 0;
    for (const radius of [0, 0.45, 0.95]) for (let k = 0; k < (radius ? 6 : 1); k++) {
      const a = Math.PI / 3 * k + (radius > 0.5 ? Math.PI / 6 : 0);
      const e = elevationKm(xKm + radius * Math.cos(a), yKm + radius * Math.sin(a));
      sum += e; lo = Math.min(lo, e); hi = Math.max(hi, e); n++;
    }
    const elev = sum / n, relief = hi - lo;
    const terrain = relief < 36 ? 'plain' : relief < 96 ? 'broken' : relief < 264 ? 'hills' : 'mountain';
    // Vegetation: average the land-cover shares over the same footprint.
    let tree = 0, shrub = 0, crop = 0, m = 0;
    for (const dy of [-0.7, -0.35, 0, 0.35, 0.7]) for (const dx of [-0.8, -0.4, 0, 0.4, 0.8]) {
      const [t, sh, cr] = vegetationKm(xKm + dx, yKm + dy);
      tree += t; shrub += sh; crop += cr; m++;
    }
    tree /= m; shrub /= m; crop /= m;
    const cover = tree >= 0.45 ? (elev >= 1100 ? 'forest' : 'woods') : shrub + tree * 0.5 >= 0.3 ? 'scrub' : null;
    HEXES.push({
      id, c, r, q: ax.q, ar: ax.r, x, y, elev: Math.round(elev), relief: Math.round(relief), terrain, cover,
      tree: Math.round(tree * 100), shrub: Math.round(shrub * 100), crop: Math.round(crop * 100),
      // Cultivated fields: open, gentle ground the satellite record shows farmed.
      fields: !cover && terrain !== 'hills' && terrain !== 'mountain' && crop >= 0.35,
      nbr: DIRS.map(([dq, dr]) => { const o = offsetOf(ax.q + dq, ax.r + dr); return hexId(o.c, o.r); }),
      river: [null, null, null, null, null, null],   // crossing class per edge
      river0: null,                                   // as surveyed, before any ferries
      road: [0, 0, 0, 0, 0, 0],                      // road grade per edge (0 = none)
      place: null, territory: null,
    });
  }
}

function hexDistance(a, b) {
  const A = HEXES[a], B = HEXES[b], dq = A.q - B.q, dr = A.ar - B.ar;
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
}
// Points in the thin margin outside the outermost hex centres snap inward.
function hexAtKm(xKm, yKm) {
  const px = Math.max(ORIGIN_X, Math.min(ORIGIN_X + (COLS - 1) * COL_W, kmToPx(xKm)));
  const py = Math.max(ORIGIN_Y + HEX_D / 2, Math.min(ORIGIN_Y + (ROWS - 1) * HEX_D, kmToPx(yKm)));
  return pixelToHex(px, py);
}
function dirTo(a, b) {
  return HEXES[a].nbr.indexOf(b);
}

// ---------------------------------------------------------------------------
// Rivers: a crossing exists where the segment between two hex centres cuts a
// river line an odd number of times. Major rivers are impassable except at ghats.

function segmentsIntersect(ax, ay, bx, by, cx, cy, dx, dy) {
  const d1x = bx - ax, d1y = by - ay, d2x = dx - cx, d2y = dy - cy, den = d1x * d2y - d1y * d2x;
  if (!den) return null;
  const t = ((cx - ax) * d2y - (cy - ay) * d2x) / den, u = ((cx - ax) * d1y - (cy - ay) * d1x) / den;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? [ax + d1x * t, ay + d1y * t] : null;
}

function buildRiverCrossings() {
  const BUCKET = 3, buckets = new Map(), rank = { nala: 1, river: 2, major: 3 };
  for (const river of MAP.rivers) for (const line of river.lines) for (let i = 1; i < line.length; i++) {
    const seg = { a: line[i - 1], b: line[i], cls: river.cls, river: river.id };
    const x0 = Math.floor(Math.min(seg.a[0], seg.b[0]) / BUCKET), x1 = Math.floor(Math.max(seg.a[0], seg.b[0]) / BUCKET);
    const y0 = Math.floor(Math.min(seg.a[1], seg.b[1]) / BUCKET), y1 = Math.floor(Math.max(seg.a[1], seg.b[1]) / BUCKET);
    for (let bx = x0; bx <= x1; bx++) for (let by = y0; by <= y1; by++) {
      const k = bx + ',' + by;
      if (!buckets.has(k)) buckets.set(k, []);
      buckets.get(k).push(seg);
    }
  }
  const ghats = Object.values(MAP.ghats);
  for (const h of HEXES) for (let dir = 0; dir < 3; dir++) {
    const nb = h.nbr[dir];
    if (nb < 0) continue;
    const o = HEXES[nb], ax = h.x / PX_PER_KM, ay = h.y / PX_PER_KM, bx = o.x / PX_PER_KM, by = o.y / PX_PER_KM;
    const seen = new Set(), counts = new Map();
    let crossPoint = null;
    for (let gx = Math.floor(Math.min(ax, bx) / BUCKET); gx <= Math.floor(Math.max(ax, bx) / BUCKET); gx++)
      for (let gy = Math.floor(Math.min(ay, by) / BUCKET); gy <= Math.floor(Math.max(ay, by) / BUCKET); gy++)
        for (const seg of buckets.get(gx + ',' + gy) || []) {
          if (seen.has(seg)) continue;
          seen.add(seg);
          const hit = segmentsIntersect(ax, ay, bx, by, seg.a[0], seg.a[1], seg.b[0], seg.b[1]);
          if (hit) { counts.set(seg.river, (counts.get(seg.river) || 0) + 1); if (seg.cls === 'major') crossPoint = hit; }
        }
    let best = null;
    for (const [riverId, count] of counts) {
      if (count % 2 === 0) continue;  // a meander that returns to the same bank
      const cls = MAP.rivers.find(r => r.id === riverId).cls;
      if (!best || rank[cls] > rank[best]) best = cls;
    }
    if (best === 'major' && crossPoint && ghats.some(g => Math.hypot(g.x - crossPoint[0], g.y - crossPoint[1]) < 1.3)) best = 'ghat';
    h.river[dir] = best;
    o.river[(dir + 3) % 6] = best;
  }
}

// ---------------------------------------------------------------------------
// Roads: walk each surveyed road line through the lattice. A road that crosses
// the Jhelum or Chenab does so by ferry, so that edge becomes a ghat.

const ROAD_NAMES = {};

function buildRoads() {
  for (const road of MAP.roads) for (const line of road.lines) {
    const cells = [];
    for (let i = 1; i < line.length; i++) {
      const [ax, ay] = line[i - 1], [bx, by] = line[i], n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 0.25));
      for (let k = 0; k <= n; k++) {
        const id = hexAtKm(ax + (bx - ax) * k / n, ay + (by - ay) * k / n);
        if (id >= 0 && cells[cells.length - 1] !== id) cells.push(id);
      }
    }
    for (let i = 1; i < cells.length; i++) {
      let a = cells[i - 1], b = cells[i], dir = dirTo(a, b);
      if (dir < 0) {
        // The line clipped a hex corner; route through a hex adjacent to both.
        const bridge = HEXES[a].nbr.find(n => n >= 0 && dirTo(n, b) >= 0);
        if (bridge === undefined) continue;
        link(road, a, bridge); link(road, bridge, b);
        continue;
      }
      link(road, a, b);
    }
  }
  function link(road, a, b) {
    const dir = dirTo(a, b);
    if (dir < 0) return;
    const grade = Math.min(HEXES[a].road[dir] || 9, road.grade);
    HEXES[a].road[dir] = grade; HEXES[b].road[(dir + 3) % 6] = grade;
    if (HEXES[a].river[dir] === 'major') { HEXES[a].river[dir] = 'ghat'; HEXES[b].river[(dir + 3) % 6] = 'ghat'; }
    ROAD_NAMES[a] ??= road.name; ROAD_NAMES[b] ??= road.name;
  }
}

// ---------------------------------------------------------------------------
// Places and polities

const SETTLEMENT_DEF = { village: 0, sarai: 1, town: 1, city: 2, fort: 3 };

function buildPlaces() {
  for (const [key, p] of Object.entries(MAP.places)) {
    const id = hexAtKm(p.x, p.y);
    if (id < 0) continue;
    const h = HEXES[id];
    // Keep the most defensible place when two share a hex.
    if (!h.place || SETTLEMENT_DEF[p.kind] > SETTLEMENT_DEF[MAP.places[h.place].kind]) h.place = key;
    // Towns and forts stand in cleared ground.
    if (p.kind !== 'village') h.cover = null;
  }
}

// Political spheres come from the scenario (see scenarios.js).
let POWERS = [], POWER_BY_ID = {};

function placeHex(key) {
  const p = MAP.places[key];
  return hexAtKm(p.x, p.y);
}

// Minimal binary heap keyed by number; used by every path search.
class MinHeap {
  constructor() { this.k = []; this.v = []; }
  get size() { return this.k.length; }
  push(key, val) {
    const k = this.k, v = this.v;
    let i = k.length; k.push(key); v.push(val);
    while (i) { const p = (i - 1) >> 1; if (k[p] <= key) break; k[i] = k[p]; v[i] = v[p]; i = p; }
    k[i] = key; v[i] = val;
  }
  pop() {
    const k = this.k, v = this.v, top = v[0], lastK = k.pop(), lastV = v.pop(), n = k.length;
    if (n) {
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i, mk = lastK;
        if (l < n && k[l] < mk) { m = l; mk = k[l]; }
        if (r < n && k[r] < mk) m = r;
        if (m === i) break;
        k[i] = k[m]; v[i] = v[m]; i = m;
      }
      k[i] = lastK; v[i] = lastV;
    }
    return top;
  }
}

// Multi-source Dijkstra over marching cost (ignores units). `edgeExtra` lets
// callers penalise crossings, e.g. to keep territories behind the Jhelum.
function costField(sources, unit = null, edgeExtra = null) {
  const dist = new Float64Array(HEXES.length).fill(Infinity), from = new Int32Array(HEXES.length).fill(-1), heap = new MinHeap();
  for (const [id, bias] of sources) if (bias < dist[id]) { dist[id] = bias; from[id] = id; heap.push(bias, id); }
  while (heap.size) {
    const a = heap.pop(), d = dist[a];
    for (let dir = 0; dir < 6; dir++) {
      const b = HEXES[a].nbr[dir];
      if (b < 0) continue;
      let step = terrainCost(a, dir, unit);
      if (edgeExtra) step += edgeExtra(a, dir);
      if (d + step < dist[b]) { dist[b] = d + step; from[b] = from[a]; heap.push(dist[b], b); }
    }
  }
  return { dist, from };
}

function buildTerritories() {
  const seats = POWERS.flatMap(power => [power.seat, ...(power.extraSeats || [])].map(seat => [placeHex(seat), 0, power.id]));
  const ownerOfSeat = new Map(seats.map(([id, , power]) => [id, power]));
  // Rivers are frontiers: a realm only spreads across water when nothing nearer
  // on the far bank claims the ground. Great rivers count most, nalas least.
  const RIVER_FRONTIER = { ghat: 60, river: 33, nala: 10 };
  // So are ridgelines. Between each pair of neighbouring hexes, find the crest
  // the ground rises to above both centres (sampled every ~250 m on the
  // relief grid); every 10 m of it costs a realm as much as a hex of plain.
  // Each power fills its own valleys and two realms meet along the divide.
  const RIDGE_PER_10M = 2;
  const ridge = (a, dir) => {
    const A = HEXES[a], B = HEXES[A.nbr[dir]];
    let top = -Infinity;
    for (let k = 1; k < 8; k++) top = Math.max(top, elevationKm((A.x + (B.x - A.x) * k / 8) / PX_PER_KM, (A.y + (B.y - A.y) * k / 8) / PX_PER_KM));
    return Math.max(0, top - Math.max(A.elev, B.elev));
  };
  const { from } = costField(seats.map(([id]) => [id, 0]), null, (a, dir) => (RIVER_FRONTIER[HEXES[a].river[dir]] || 0) + RIDGE_PER_10M * ridge(a, dir) / 10);
  HEXES.forEach((h, i) => { h.territory = ownerOfSeat.get(from[i]) || null; });
  // A realm can be cut off beyond a named place ("nothing north-east of
  // Panjeri"): ground more than a kilometre past it in that direction (both
  // north and east, for a diagonal) goes to another realm.
  const TOWARD = { north: [0, -1], 'north-east': [1, -1], east: [1, 0], 'south-east': [1, 1], south: [0, 1], 'south-west': [-1, 1], west: [-1, 0], 'north-west': [-1, -1] };
  for (const power of POWERS) for (const cut of power.limits || []) {
    const at = MAP.places[cut.beyond], [dx, dy] = TOWARD[cut.toward];
    const past = h => (!dx || (h.x / PX_PER_KM - at.x) * dx > 1) && (!dy || (h.y / PX_PER_KM - at.y) * dy > 1);
    for (const h of HEXES) if (h.territory === power.id && past(h)) h.territory = cut.to;
  }
}

// Cost to march from hex `a` across edge `dir`. `unit` may be null (generic foot).
function terrainCost(a, dir, unit) {
  const from = HEXES[a], to = HEXES[from.nbr[dir]], road = from.road[dir], river = from.river[dir];
  const kind = unit ? unitKind(unit) : 'foot';
  if (river === 'major') return Infinity;
  let cost;
  if (road && road <= 2) cost = 1;
  else {
    cost = TERRAIN[to.terrain].move + (to.cover ? COVER[to.cover].move : 0);
    // Horse struggles wherever the ground rises and falls more than 100 m within a hex.
    if (kind === 'horse' && to.relief > 100) cost += 2;
    else if (kind === 'horse' && (to.cover === 'forest' || to.cover === 'woods')) cost += 1;
    if (kind === 'guns' && (to.terrain === 'hills' || to.terrain === 'mountain')) cost += 2;
    if (kind === 'camel' && to.terrain === 'mountain') cost += 1;
    if (road) cost = Math.max(1, cost - 2);  // tracks help but do not flatten the hills
  }
  if (river) cost += road ? (river === 'ghat' ? 2 : river === 'river' ? 1 : 0) : RIVER_CLASS[river].move;
  return cost;
}

// Implemented in game.js; geo only needs the movement family.
function unitKind(unit) {
  return unit.variant === 'Zamburak' ? 'camel' : VARIANTS[unit.variant].type;
}

function nearestMajorRiver(hex) {
  const x = HEXES[hex].x / PX_PER_KM, y = HEXES[hex].y / PX_PER_KM;
  let best = null;
  for (const r of MAP.rivers) if (r.cls === 'major') for (const line of r.lines) for (const [px, py] of line) {
    const d = Math.hypot(px - x, py - y);
    if (!best || d < best.d) best = { d, name: r.name };
  }
  return best ? best.name : 'river';
}

// Ferries built during a campaign turn a great-river edge into a crossing.
function applyFerries(ferries = []) {
  for (const h of HEXES) h.river = [...h.river0];
  for (const { a, b } of ferries) {
    const dir = dirTo(a, b);
    if (dir < 0) continue;
    HEXES[a].river[dir] = 'ghat'; HEXES[b].river[(dir + 3) % 6] = 'ghat';
  }
}

async function buildMapModel() {
  initGeometry();
  await Promise.all([loadRelief(), loadLandCover()]);
  buildHexes();
  buildRiverCrossings();
  buildRoads();
  buildPlaces();
  for (const h of HEXES) h.river0 = [...h.river];
  buildTerritories();
}
