'use strict';
// The campaign map on the opening screen: the Punjab between the Indus and
// the Sutlej, drawn in the manner of a period map (hachured hills, stippled
// desert, the doabs lettered between their rivers), with a seal wherever a
// campaign was fought. Rivers, hills and towns are hand-placed from their
// real coordinates (lat, lon) in an equirectangular projection true at 31.5°N.

const CAMPAIGN_MAP = (() => {
  const LON0 = 69.9, LON1 = 76.7, LAT0 = 34.6, LAT1 = 29.3, COS = Math.cos(31.5 * Math.PI / 180);
  const M = 22, W = 700, IW = W - 2 * M, K = IW / ((LON1 - LON0) * COS), IH = Math.round(K * (LAT0 - LAT1)), H = IH + 2 * M;
  const px = ([lat, lon]) => [M + (lon - LON0) * COS * K, M + (LAT0 - lat) * K];
  const f = v => v.toFixed(1);
  const rand = (seed => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; });

  // The Indus and the five rivers from Natural Earth (js/panjab-rivers.js,
  // made by tools/campaign-relief.py); the Kabul by hand. [name, width, points].
  const RIVERS = [
    ...PANJAB_RIVERS,
    ['Kabul', 2.2, [[34.42, 69.9], [34.41, 70.45], [34.30, 70.95], [34.25, 71.15], [34.16, 71.36], [34.10, 71.66], [34.02, 71.98], [33.92, 72.20], [33.89, 72.24]]],
  ];
  // Where each river's name is written.
  const RIVER_LABELS = { Indus: [32.55, 71.52], Jhelum: [32.45, 72.65], Chenab: [31.95, 73.35], Ravi: [31.05, 73.35], Beas: [31.55, 75.38], Sutlej: [30.15, 73.55], Kabul: [34.18, 71.3] };
  // Hill ranges as ridge lines, hachured on both flanks.
  const RIDGES = [
    [[34.40, 71.00], [34.15, 71.18], [33.97, 71.15], [33.75, 70.95]],                                      // the Khyber hills
    [[34.40, 71.45], [34.33, 71.75], [34.36, 72.10], [34.30, 72.45]],                                      // the Mohmand and Swat hills
    [[34.40, 72.95], [34.12, 73.12], [33.95, 73.38]],                                                      // Hazara
    [[32.95, 71.62], [32.72, 71.95], [32.63, 72.35], [32.68, 72.85], [32.78, 73.15], [32.93, 73.45]],      // the Salt Range
    [[32.73, 73.86], [32.80, 73.98], [32.86, 74.08]],                                                      // the Pabbi hills
    [[33.70, 72.35], [33.63, 72.80], [33.74, 73.10]],                                                      // Kala Chitta and the Margallas
    [[33.95, 73.38], [33.55, 73.62], [33.30, 73.95], [33.05, 74.35], [32.92, 74.95], [32.60, 75.45], [32.30, 75.85]],
    [[33.95, 74.05], [33.62, 74.45], [33.35, 74.95], [33.12, 75.45], [32.90, 75.85]],
    [[33.95, 74.90], [33.65, 75.40], [33.42, 75.85]],
    [[31.90, 70.30], [31.30, 70.27], [30.60, 70.30], [29.90, 70.27]],                                      // the Sulaiman foothills
  ];
  const DESERTS = [
    [[32.15, 71.45], [32.10, 71.95], [31.70, 72.15], [31.10, 72.0], [30.75, 71.75], [30.80, 71.25], [31.35, 71.1], [31.85, 71.15]],   // the Thal
    [[29.88, 72.0], [29.90, 72.9], [29.62, 73.6], [29.47, 73.6], [29.47, 71.9]],                                                     // Cholistan
  ];
  const ROADS = [
    // The Grand Trunk Road, and the road from Lahore to Multan by Harappa and Tulamba.
    [[33.89, 72.24], [33.60, 73.05], [32.97, 73.58], [32.93, 73.72], [32.78, 73.87], [32.57, 74.08], [32.44, 74.12], [32.16, 74.19], [31.58, 74.33], [31.63, 74.87], [31.17, 74.95], [30.97, 75.30], [30.90, 75.85]],
    [[31.58, 74.33], [31.30, 73.95], [30.63, 72.86], [30.52, 72.24], [30.20, 71.47]],
  ];
  // name, lat, lon, label side (r/l/a/b), city? (2: the capital, starred)
  const TOWNS = [
    ['Attock', 33.89, 72.24, 'r'], ['Peshawar', 34.01, 71.58, 'b', 1], ['Rawalpindi', 33.60, 73.05, 'r'], ['Jhelum', 32.93, 73.72, 'r'],
    ['Jammu', 32.73, 74.86, 'r', 1], ['Sialkot', 32.49, 74.53, 'r'], ['Wazirabad', 32.44, 74.12, 'b'], ['Ramnagar', 32.33, 73.78, 'l'],
    ['Gujranwala', 32.16, 74.19, 'r'], ['Lahore', 31.58, 74.33, 'b', 2], ['Amritsar', 31.63, 74.87, 'r', 1], ['Kasur', 31.12, 74.45, 'r'], ['Ferozepur', 30.95, 74.62, 'r'],
    ['Dera Ghazi Khan', 30.05, 70.64, 'r'], ['Dera Ismail Khan', 31.83, 70.90, 'r'],
    ['Jhang', 31.27, 72.32, 'r'], ['Chiniot', 31.72, 72.98, 'r'], ['Kalabagh', 32.96, 71.55, 'r'],
    ['Pakpattan', 30.34, 73.39, 'r'], ['Shujabad', 29.88, 71.30, 'r'], ['Harappa', 30.63, 72.86, 'b'],
    ['Srinagar', 34.08, 74.80, 'r', 1], ['Muzaffarabad', 34.37, 73.47, 'r'], ['Mirpur', 33.15, 73.75, 'r'], ['Kohat', 33.58, 71.44, 'r'], ['Bannu', 32.99, 70.60, 'r'],
    ['Bhera', 32.48, 72.91, 'r'], ['Batala', 31.82, 75.20, 'r'], ['Jullundur', 31.33, 75.58, 'r'], ['Hoshiarpur', 31.53, 75.91, 'l'], ['Ludhiana', 30.90, 75.85, 'r', 1],
    ['Sirhind', 30.64, 76.39, 'l'], ['Patiala', 30.34, 76.39, 'l'], ['Kangra', 32.10, 76.27, 'l'], ['Nurpur', 32.30, 75.89, 'l'], ['Bahawalpur', 29.40, 71.68, 'r', 1], ['Bathinda', 30.21, 74.95, 'r'],
  ];
  const REGIONS = [
    ['SIND SAGAR DOAB', 31.55, 71.62, -62, 15], ['CHAJ DOAB', 32.12, 72.88, -52, 11], ['RECHNA DOAB', 31.62, 73.72, -36, 11],
    ['BARI DOAB', 30.84, 73.86, -32, 12], ['KASHMIR', 33.68, 74.55, 0, 13], ['POTHOHAR', 33.25, 72.75, 0, 11],
    ['DERAJAT', 31.15, 70.3, -84, 11], ['SIRHIND', 30.85, 76.25, 0, 11],
    ['JULLUNDUR DOAB', 31.42, 75.62, -38, 10], ['MALWA', 30.42, 75.25, 0, 12], ['HAZARA', 34.25, 73.2, 0, 11], ['JAMMU HILLS', 32.95, 75.3, -28, 10],
  ];
  // Where each campaign is marked: the place, the seal's offset from it (px),
  // and which side of the seal its name goes.
  const SPOTS = {
    khari: { at: [33.07, 73.70], side: 'r', lab: [0, -6], name: 'Khari' },
    jamrud: { at: [34.0033, 71.3784], side: 'l', name: 'Jamrud' },
    rohtas: { at: [32.97, 73.58], side: 'l', lab: [0, -4], name: 'Rohtas' },
    jammu: { at: [32.72, 74.86], side: 'r', nudge: [5, -3], name: 'Jammu' },
    chillianwala: { at: [32.66, 73.60], side: 'l', name: 'Chillianwala' },
    gujrat: { at: [32.57, 74.08], side: 'r', name: 'Gujrat' },
    lahore: { at: [31.58, 74.33], side: 'l', name: 'Lahore' },
    multan1818: { at: [30.20, 71.47], side: 'l', nudge: [-5, -4], name: 'Multan' },
    multan1849: { at: [30.20, 71.47], side: 'r', nudge: [5, 4], name: 'Multan', year: '1848–49' },
    jhelum1857: { at: [32.925, 73.725], side: 'r', lab: [0, 7], name: 'Jhelum' },
    aliwal: { at: [30.945, 75.614], side: 'l', lab: [0, -10], name: 'Aliwal' },
    gogera: { at: [30.955, 73.33], side: 'l', name: 'Gogera' },
    ferozeshah: { at: [30.88, 74.79], side: 'r', lab: [0, 6], name: 'Ferozeshah' },
    gujranwala: { at: [32.153, 74.193], side: 'l', name: 'Gujranwala' },
    nowshera: { at: [34.011, 71.975], side: 'r', name: 'Nowshera' },
    naurangabad: { at: [31.16, 74.95], side: 'r', nudge: [6, -4], lab: [0, -8], name: 'Naurangabad' },
    sobraon: { at: [31.14, 74.866], side: 'l', nudge: [-6, 4], lab: [0, 4], name: 'Sobraon' },
    lahore1752: { at: [31.604, 74.394], side: 'l', lab: [0, -7], name: 'Lahore' },
    attock: { at: [33.922, 72.362], side: 'r', name: 'Attock' },
    ramnagar: { at: [32.331, 73.779], side: 'l', lab: [0, 6], name: 'Ramnagar' },
    murree: { at: [33.9056, 73.3926], side: 'r', lab: [0, -6], name: 'Murree' },
    jammu1845: { at: [32.72, 74.86], side: 'l', nudge: [-5, 3], name: 'Jammu' },
    batala: { at: [31.762, 75.205], side: 'r', name: 'Batala' },
    trimmu: { at: [32.16, 75.32], side: 'l', name: 'Trimmu Ghat' },
    muzaffarabad: { at: [34.37, 73.471], side: 'r', name: 'Muzaffarabad' },
  };
  // Battles fought by the same army one after another: a march arrow from
  // each to the next, [from, to, what marched].
  const MARCHES = [
    ['ferozeshah', 'sobraon', 'Gough’s army, from Ferozeshah to the Sobraon bridgehead, Dec 1845 – Feb 1846'],
    ['aliwal', 'sobraon', 'Harry Smith’s division rejoins Gough after Aliwal, Feb 1846'],
    ['chillianwala', 'gujrat', 'Gough follows Sher Singh from Chillianwala to Gujrat, Feb 1849'],
    ['multan1849', 'gujrat', 'Whish’s force marches north from Multan to join Gough, Feb 1849'],
    ['lahore', 'khari', 'Gulab Singh’s Dogras, from the siege of Lahore to Khari Khariyali, 1841'],
  ];

  const spotAt = s => { const [x, y] = px(s.at), [nx, ny] = s.nudge || [0, 0]; return [x + nx, y + ny]; };
  const line = pts => 'M' + pts.map(p => px(p).map(f).join(' ')).join('L');
  // A smooth path through the points (Catmull-Rom as cubic Béziers).
  const smooth = pts => {
    const p = pts.map(px);
    let d = `M${f(p[0][0])} ${f(p[0][1])}`;
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
      d += `C${f(b[0] + (c[0] - a[0]) / 6)} ${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (e[0] - b[0]) / 6)} ${f(c[1] - (e[1] - b[1]) / 6)} ${f(c[0])} ${f(c[1])}`;
    }
    return d;
  };

  function hachures(ridge, r) {
    const p = ridge.map(px), out = [];
    let total = 0;
    const segs = p.slice(1).map((q, i) => { const l = Math.hypot(q[0] - p[i][0], q[1] - p[i][1]); total += l; return l; });
    for (let s = 0, run = 0, i = 0; s <= total; s += 3.2) {
      while (i < segs.length - 1 && s > run + segs[i]) run += segs[i++];
      const t = Math.min(1, (s - run) / segs[i]), a = p[i], b = p[i + 1];
      const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
      const nx = -(b[1] - a[1]) / segs[i], ny = (b[0] - a[0]) / segs[i];
      const taper = Math.min(1, s / 26, (total - s) / 26);
      for (const side of [1, -1]) {
        const len = (6 + 5 * r()) * (0.35 + 0.65 * taper), j = 0.8 + r() * 1.4;
        out.push(`M${f(x + nx * side * j)} ${f(y + ny * side * j)}l${f(nx * side * len + (r() - .5) * 1.6)} ${f(ny * side * len + (r() - .5) * 1.6)}`);
      }
    }
    return out.join('');
  }

  function stipple(poly, r) {
    const p = poly.map(px), xs = p.map(q => q[0]), ys = p.map(q => q[1]);
    const inside = (x, y) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) if ((p[i][1] > y) !== (p[j][1] > y) && x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) c = !c; return c; };
    let d = '';
    for (let y = Math.min(...ys); y < Math.max(...ys); y += 4.2) for (let x = Math.min(...xs); x < Math.max(...xs); x += 4.2) {
      const jx = x + (r() - .5) * 3.6, jy = y + (r() - .5) * 3.6;
      if (inside(jx, jy) && r() < .55) d += `M${f(jx)} ${f(jy)}h.01`;
    }
    return d;
  }

  function riverLabel(name) {
    const at = px(RIVER_LABELS[name] || [0, 0]);
    let a, b, best = Infinity;
    for (const [n, , pts] of RIVERS) if (n === name) for (let i = 0; i < pts.length - 1; i++) {
      const p = px(pts[i]), q = px(pts[i + 1]), d = Math.hypot((p[0] + q[0]) / 2 - at[0], (p[1] + q[1]) / 2 - at[1]);
      if (d < best && Math.hypot(q[0] - p[0], q[1] - p[1]) > 4) { best = d; a = p; b = q; }
    }
    if (!a) return '';
    let ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
    if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
    const x = (a[0] + b[0]) / 2, y = (a[1] + b[1]) / 2;
    return `<text class="cm-water" transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)}) translate(0 -5)">${name}</text>`;
  }

  function frame() {
    let s = `<rect x="${M - 7}" y="${M - 7}" width="${IW + 14}" height="${IH + 14}" class="cm-frame-out"/>`;
    s += `<rect x="${M}" y="${M}" width="${IW}" height="${IH}" class="cm-frame-in"/>`;
    // Degree ticks on the frame, alternating bars between them.
    for (let lon = Math.ceil(LON0); lon <= LON1; lon++) {
      const [x] = px([LAT0, lon]);
      s += `<path d="M${f(x)} ${M}V${M + IH}" class="cm-grat"/><text x="${f(x)}" y="${M - 10}" class="cm-deg">${lon}°E</text>`;
    }
    for (let lat = Math.ceil(LAT1); lat <= LAT0; lat++) {
      const [, y] = px([lat, LON0]);
      s += `<path d="M${M} ${f(y)}H${M + IW}" class="cm-grat"/><text transform="translate(${M - 10} ${f(y)}) rotate(-90)" class="cm-deg">${lat}°N</text>`;
    }
    for (let i = 0, x = M; x < M + IW; i++, x += 20) if (i % 2) s += `<rect x="${x}" y="${M - 7}" width="${Math.min(20, M + IW - x)}" height="3" class="cm-bar"/><rect x="${x}" y="${M + IH + 4}" width="${Math.min(20, M + IW - x)}" height="3" class="cm-bar"/>`;
    for (let i = 0, y = M; y < M + IH; i++, y += 20) if (i % 2) s += `<rect x="${M - 7}" y="${y}" width="3" height="${Math.min(20, M + IH - y)}" class="cm-bar"/><rect x="${M + IW + 4}" y="${y}" width="3" height="${Math.min(20, M + IH - y)}" class="cm-bar"/>`;
    return s;
  }

  function cartouche() {
    const [x0] = px([0, 74.75]), [, y0] = px([30.05, 0]), w = W - M - 12 - x0, km = K / 111.32; // px per km
    let s = `<g class="cm-cartouche" transform="translate(${f(x0)} ${f(y0)})"><rect width="${f(w)}" height="96" rx="3" class="cm-cart-box"/><rect x="4" y="4" width="${f(w - 8)}" height="88" rx="2" class="cm-cart-in"/>`;
    s += `<text x="${f(w / 2)}" y="30" class="cm-cart-title">THE PANJAB</text><text x="${f(w / 2)}" y="47" class="cm-cart-sub">and its marches, 1761–1857</text>`;
    const bar = 100 * km, bx = (w - bar) / 2;
    for (let i = 0; i < 4; i++) s += `<rect x="${f(bx + i * bar / 4)}" y="62" width="${f(bar / 4)}" height="4" class="${i % 2 ? 'cm-scale-b' : 'cm-scale-a'}"/>`;
    s += `<text x="${f(bx)}" y="78" class="cm-cart-km">0</text><text x="${f(bx + bar / 2)}" y="78" class="cm-cart-km">50</text><text x="${f(bx + bar)}" y="78" class="cm-cart-km">100 km</text></g>`;
    return s;
  }

  function compass() {
    const [x, y] = px([29.85, 70.55]);
    return `<g class="cm-compass" transform="translate(${f(x)} ${f(y)})"><circle r="22" class="cm-rose-disc"/><circle r="17" class="cm-rose-ring"/>`
      + `<path d="M0 -26L5 0L0 26L-5 0Z" class="cm-rose-a"/><path d="M-20 0L0 -4L20 0L0 4Z" class="cm-rose-b"/><path d="M0 -26L5 0L0 0Z" class="cm-rose-dark"/><path d="M20 0L0 4L0 0Z" class="cm-rose-dark"/>`
      + `<text y="-30" class="cm-rose-n">N</text></g>`;
  }

  // A battle: a small seal with crossed swords on the very spot, its name and
  // year beside it.
  function seal(g, current, era) {
    const s = SPOTS[g.group]; if (!s) return '';
    // Battles of other eras stay on the map, faint, as landmarks.
    if (era && g.era !== era) { const [x, y] = px(s.at); return `<circle cx="${f(x)}" cy="${f(y)}" r="2.6" class="cm-past"><title>${g.title}, ${g.year}</title></circle>`; }
    const [x, y] = spotAt(s), on = g.group === current, [lx, ly] = s.lab || [0, 0];
    const left = s.side === 'l', tx = (left ? -11 : 11) + lx, anchor = left ? 'end' : 'start';
    return `<g class="cm-battle${on ? ' on' : ''}" data-group="${g.group}" tabindex="0" role="button" aria-label="${g.title}" transform="translate(${f(x)} ${f(y)})"><title>${g.title}, ${s.year || g.year}</title>`
      + `<circle r="14" class="cm-hit"/><g class="cm-seal-g">${on ? '<circle r="12" class="cm-halo"/>' : ''}<circle r="7.5" class="cm-seal-rim"/><circle r="6" class="cm-seal" style="fill:url(#cm${on ? 'Gold' : 'Wax'})"/>`
      + `<path d="M-3 -3L3 3M3 -3L-3 3" class="cm-swords"/></g>`
      + `<text x="${tx}" y="${f(3.5 + ly)}" text-anchor="${anchor}" class="cm-bname">${s.name}<tspan class="cm-byear" dx="4">${s.year || g.year}</tspan></text></g>`;
  }

  // A dotted line from one battle to the next by the same army.
  function march([from, to, what], groups, era) {
    const a = SPOTS[from], b = SPOTS[to], ga = groups.find(g => g.group === from), gb = groups.find(g => g.group === to);
    if (!a || !b || !ga || !gb || (era && (ga.era !== era || gb.era !== era))) return '';
    const [x0, y0] = spotAt(a), [x1, y1] = spotAt(b), dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, bend = Math.min(18, len * .12);
    const d = `M${f(x0 + ux * 9)} ${f(y0 + uy * 9)}Q${f((x0 + x1) / 2 - uy * bend)} ${f((y0 + y1) / 2 + ux * bend)} ${f(x1 - ux * 9)} ${f(y1 - uy * 9)}`;
    return `<path d="${d}" class="cm-march-line"><title>${what}</title></path>`;
  }

  function draw(groups, current, era) {
    const r = rand(1849), battleTowns = new Set(groups.filter(g => !era || g.era === era).map(g => SPOTS[g.group]?.name));  // a battle's seal names its town
    let svg = `<svg viewBox="0 0 ${W} ${H}" class="campaign-map" role="img" aria-label="Map of the Punjab with the campaigns">`
      + `<defs><filter id="cmGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .25  0 0 0 0 .12  0 0 0 .5 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>`
      + `<filter id="cmBlot" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="3"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .40  0 0 0 0 .20  0 0 0 .55 -.18"/><feComposite in2="SourceGraphic" operator="in"/></filter>`
      + `<radialGradient id="cmVignette" cx="50%" cy="50%" r="72%"><stop offset="62%" stop-color="#6b4a22" stop-opacity="0"/><stop offset="100%" stop-color="#6b4a22" stop-opacity=".38"/></radialGradient>`
      + `<radialGradient id="cmWax" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#c0503a"/><stop offset="1" stop-color="#7a2418"/></radialGradient>`
      + `<radialGradient id="cmGold" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#f6dc96"/><stop offset="1" stop-color="#b48a3c"/></radialGradient>`
      + `<clipPath id="cmClip"><rect x="${M}" y="${M}" width="${IW}" height="${IH}"/></clipPath></defs>`;
    svg += `<rect width="${W}" height="${H}" class="cm-paper"/><rect width="${W}" height="${H}" class="cm-paper" filter="url(#cmBlot)"/><rect width="${W}" height="${H}" class="cm-paper" filter="url(#cmGrain)" opacity=".5"/>`;
    svg += `<g clip-path="url(#cmClip)">`;
    svg += `<image href="img/panjab-relief.jpg" x="${M}" y="${M}" width="${IW}" height="${IH}" preserveAspectRatio="none" class="cm-relief"/>`;
    for (const d of DESERTS) svg += `<path d="${stipple(d, r)}" class="cm-sand"/>`;
    for (const [name, lat, lon, ang, size] of REGIONS) { const [x, y] = px([lat, lon]); svg += `<text transform="translate(${f(x)} ${f(y)}) rotate(${ang})" class="cm-region" style="font-size:${size}px">${name}</text>`; }
    for (const rd of ROADS) svg += `<path d="${line(rd)}" class="cm-road"/>`;
    for (const [, w, pts] of RIVERS) svg += `<path d="${smooth(pts)}" class="cm-river-halo" style="stroke-width:${w + 4}"/>`;
    for (const [, w, pts] of RIVERS) svg += `<path d="${smooth(pts)}" class="cm-river" style="stroke-width:${w}"/>`;
    for (const name of Object.keys(RIVER_LABELS)) svg += riverLabel(name);
    
    for (const [name, lat, lon, side, city] of TOWNS) {
      if (battleTowns.has(name)) continue;
      const [x, y] = px([lat, lon]);
      const [tx, ty, a] = { r: [5, 3.5, 'start'], l: [-5, 3.5, 'end'], a: [0, -6, 'middle'], b: [0, 12, 'middle'] }[side];
      const star = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 2.6 : 6.4; return `${f(x + Math.cos(a) * rr)} ${f(y + Math.sin(a) * rr)}`; }).join('L');
      svg += city === 2 ? `<path d="M${star}Z" class="cm-capital"/>` : city ? `<rect x="${f(x - 3)}" y="${f(y - 3)}" width="6" height="6" class="cm-city"/>` : `<circle cx="${f(x)}" cy="${f(y)}" r="2.2" class="cm-town"/>`;
      svg += `<text x="${f(x + tx * (city ? 1.3 : 1))}" y="${f(y + ty * (city === 2 ? 1.3 : 1))}" text-anchor="${a}" class="cm-townname${city ? ' big' : ''}${city === 2 ? ' capital' : ''}">${name}</text>`;
    }
    svg += `</g>`;
    svg += `<rect x="${M}" y="${M}" width="${IW}" height="${IH}" fill="url(#cmVignette)" pointer-events="none"/>`;
    svg += frame() + compass() + cartouche();
    for (const m of MARCHES) svg += march(m, groups, era);
    // The chosen campaign's seal goes last so it sits on top.
    for (const g of [...groups].sort((a, b) => (a.group === current) - (b.group === current))) svg += seal(g, current, era);
    // Each drawing gets its own ids: the title page and the opening screen
    // both draw the map, and a fill pointing into a hidden copy renders blank.
    const uid = `cm${++drawn}`;
    return (svg + '</svg>').replace(/(id="|url\(#)cm([A-Z])/g, `$1${uid}$2`);
  }
  let drawn = 0;
  return { draw };
})();
