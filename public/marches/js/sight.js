'use strict';
// Sight and the fog of war. Each side sees what its formations can see: every
// hex with a clear line from the watcher's eye to a man standing in it, over
// the surveyed ground, over the curve of the earth (with ordinary refraction),
// and past the woods, orchards, roofs and walls that rise above the ground.
// On flat ground a standing man sees the ground to about 4.7 km and another
// man's head to about 10 km; from a 30 m rise he sees ground to 20 km. Beyond
// what the eye can make out (about 10 km for a formation, 12 km for horse
// scouts, 16 km from high walls or hills) nothing is seen, except the dust of
// a marching column, which rises high and shows from further off. Troops in
// woods or a settlement, or behind their own earthworks, are seen only from
// close by. Neighbouring hexes are always seen: that is contact. Sight is not
// mutual: a rider or a man on a wall sees further than a man on foot, and
// troops under cover see out better than they are seen. The same sight limits
// the computer's choices.

const EARTH_M = 6371000, REFRACTION = 0.13;             // refraction lifts the line of sight a little
const ACUITY_KM = { foot: 10, guns: 10, horse: 12 };      // the furthest a formation can be made out
const HIGH_ACUITY_KM = 16;                                // from walls, towers or a hill 30 m above the ground round it
const DUST_KM = 4, DUST_M = 25;                           // a marching column's dust: seen further, standing high
const POST_SIGHT_KM = 3;                                  // a held strongpoint or fort keeps a watch from its walls
const CLOSE_KM = 1.5;                                     // troops under cover are seen only this close
const NIGHT_KM = 1.5, NIGHT_HIGH_KM = 2;                  // by night a formation is made out only close by, and raises no dust to see
const acuity = (type, high) => isNight() ? (high ? NIGHT_HIGH_KM : NIGHT_KM) : high ? HIGH_ACUITY_KM : ACUITY_KM[type];
const EYE_M = { foot: 1.7, guns: 1.7, horse: 2.7 };       // the watcher's eye above the ground
const WALL_EYE_M = { village: 5, sarai: 8, town: 8, city: 12, fort: 15 };   // from roofs, walls and towers
const COVER_M = { woods: 8, forest: 15, scrub: 1.5 };     // what vegetation rises above the ground
const BUILT_M = { village: 5, sarai: 8, town: 8, city: 10, fort: 12 };
const STANDING_M = 2.5;                                   // a man standing in the target hex
const RIDGE_SHARE = 0.25;                                 // part of a hex's local relief that stands proud of its mean
const NOISE_M = 3;                                        // the survey's height error: a line grazing the ground by less is not blocked
const RISE_M = 4;                                         // a hex this far above its neighbours is a true viewpoint, seen alone

const kindAt = hex => { const p = HEXES[hex].place; return p ? MAP.places[p].kind : null; };
const eyeAt = (hex, type) => HEXES[hex].elev + Math.max(EYE_M[type], WALL_EYE_M[kindAt(hex)] || 0);
const groundAt = hex => HEXES[hex].elev + HEXES[hex].relief * RIDGE_SHARE;
const blockAt = hex => { const h = HEXES[hex]; return groundAt(hex) + Math.max(COVER_M[h.cover] || 0, BUILT_M[kindAt(hex)] || 0); };
const concealed = hex => { const h = HEXES[hex]; return h.cover === 'woods' || h.cover === 'forest' || !!h.place || S.kacha?.[hex] > 0; };
// How far the earth's curve lifts the ground at fraction t of a sightline D metres long.
const bulge = (t, D) => t * (1 - t) * D * D * (1 - REFRACTION) / (2 * EARTH_M);
// A watcher well above the ground round it (walls, towers, a hill) can make out more.
const raised = (hex, eye) => eye - Math.min(...HEXES[hex].nbr.filter(n => n >= 0).map(n => HEXES[n].elev)) >= 30;

// Is the line from an eye at `eye` metres over hex `from` to a point `above`
// metres over hex `to` clear of the ground and of what stands on it?
// `bare`: only the ground counts (dust rises above trees and roofs).
function lineOfSight(from, to, eye, above = STANDING_M, bare = false) {
  const a = HEXES[from], b = HEXES[to], top = b.elev + above, D = hexDistance(from, to) * HEX_KM * 1000, n = hexDistance(from, to) * 2;
  let last = from;
  for (let i = 1; i < n; i++) {
    const t = i / n, hx = pixelToHex(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
    if (hx < 0 || hx === last || hx === from || hx === to) continue;
    last = hx;
    if ((bare ? groundAt(hx) : blockAt(hx)) + bulge(t, D) > eye + (top - eye) * t + NOISE_M) return false;
  }
  return true;
}

// What one side's watchers can see. `ground`: the hexes a line of sight
// reaches, tidied of the specks the survey's error leaves (a hidden hex in
// seen ground is filled in; a lone seen hex is kept only if it truly stands
// above its neighbours). `troops`: where troops can be seen, which under
// cover (woods, settlements, earthworks) needs a watcher close by.
function computeSight(side) {
  const n = HEXES.length, ground = new Uint8Array(n), near = new Uint8Array(n).fill(255), perKm = 1 / HEX_KM, close = Math.max(1, Math.round(CLOSE_KM * perKm));
  const watch = (hex, km, eye) => {
    ground[hex] = 1; near[hex] = 0;
    for (const t of rangeHexes(hex, Math.round(km * perKm))) {
      const d = hexDistance(hex, t);
      if (d <= 1) { ground[t] = 1; near[t] = Math.min(near[t], d); continue; }
      if (ground[t] && near[t] <= d) continue;
      if (lineOfSight(hex, t, eye)) { ground[t] = 1; near[t] = Math.min(near[t], d); }
    }
  };
  for (const u of S.units) if (u.side === side) {
    const type = VARIANTS[u.variant].type, eye = eyeAt(u.hex, type);
    watch(u.hex, acuity(type, raised(u.hex, eye)), eye);
  }
  const posts = [...STRONGPOINTS.filter(k => S.owners[k] === side), ...FORTS.filter(k => S.forts?.[k] === side)];
  for (const k of posts) if (HEX_OF[k] >= 0 && !S.units.some(u => u.side === side && u.hex === HEX_OF[k])) watch(HEX_OF[k], isNight() ? NIGHT_KM : POST_SIGHT_KM, eyeAt(HEX_OF[k], 'foot'));
  // Tidy the specks: fill holes, drop lone hexes that are no true viewpoint.
  const tidy = Uint8Array.from(ground);
  for (const h of HEXES) {
    const nb = h.nbr.filter(x => x >= 0), seen = nb.filter(x => ground[x]).length;
    if (!ground[h.id] && seen >= 5) { tidy[h.id] = 1; near[h.id] = Math.min(255, Math.min(...nb.map(x => near[x])) + 1); }
    else if (ground[h.id] && near[h.id] > 1 && seen <= 1 && h.elev < Math.max(...nb.map(x => HEXES[x].elev)) + RISE_M) tidy[h.id] = 0;
  }
  const troops = new Uint8Array(n);
  for (let i = 0; i < n; i++) troops[i] = tidy[i] && (!concealed(i) || near[i] <= close) ? 1 : 0;
  return { ground: tidy, troops };
}
// Enemy columns that marched in their latest command and whose dust one of
// this side's formations can see, though the column itself is out of sight.
function computeDust(side, vis) {
  const dust = new Set(), perKm = 1 / HEX_KM;
  if (isNight()) return dust;
  const watchers = S.units.filter(u => u.side === side).map(u => { const type = VARIANTS[u.variant].type, eye = eyeAt(u.hex, type); return { hex: u.hex, eye, km: (raised(u.hex, eye) ? HIGH_ACUITY_KM : ACUITY_KM[type]) + DUST_KM }; });
  for (const e of S.units) if (e.side !== side && e.moved && !vis[e.hex] && !S.kacha?.[e.hex])
    if (watchers.some(w => hexDistance(w.hex, e.hex) <= Math.round(w.km * perKm) && lineOfSight(w.hex, e.hex, w.eye, DUST_M, true))) dust.add(e.id);
  return dust;
}

// Each side's sight is worked out afresh only when its own watchers move;
// dust and the record of where each enemy formation was last seen are kept
// up to date whenever anything moves.
const SIGHT = { key: '', vis: {}, ground: {}, own: {}, dust: {} };
const sideKey = side => `${isNight() ? 'n' : 'd'}|${S.units.filter(u => u.side === side).map(u => `${u.hex}${VARIANTS[u.variant].type[0]}`).join(',')}|${Object.keys(S.kacha || {}).join(',')}|${Object.entries(S.owners).filter(([, o]) => o === side).map(([k]) => k).join(',')}`;
function sightOf(side) {
  const key = `${S.turnNo}|${S.units.map(u => `${u.id}${u.side[0]}${u.hex}${u.moved ? 'm' : ''}`).join(',')}|${Object.keys(S.kacha || {}).join(',')}|${Object.values(S.owners).join(',')}`;
  if (key !== SIGHT.key) {
    SIGHT.key = key;
    for (const s of ['azure', 'red']) {
      const own = sideKey(s);
      if (SIGHT.own[s] !== own) { SIGHT.own[s] = own; const c = computeSight(s); SIGHT.vis[s] = c.troops; SIGHT.ground[s] = c.ground; }
      const vis = SIGHT.vis[s], dust = SIGHT.dust[s] = computeDust(s, vis), seen = ((S.lastSeen ||= {})[s] ||= {});
      for (const u of S.units) if (u.side !== s && (vis[u.hex] || dust.has(u.id))) seen[u.id] = { hex: u.hex, round: S.round, name: u.name, variant: u.variant, side: u.side };
      for (const [id, g] of Object.entries(seen)) if (vis[g.hex] && !S.units.some(u => u.id === id && u.hex === g.hex)) delete seen[id];
    }
  }
  return SIGHT.vis[side];
}

const fogOn = () => !!S?.fog && !S.replay && !S.winner;
const seenBy = (side, u) => !fogOn() || u.side === side || sightOf(side)[u.hex] === 1 || !!SIGHT.dust[side]?.has(u.id);
const knownEnemies = side => S.units.filter(e => e.side !== side && seenBy(side, e));
// The side whose eyes the player is looking through.
const viewSide = () => S.ai.azure && !S.ai.red ? 'red' : S.ai.red && !S.ai.azure ? 'azure' : S.turn;
const playerSees = u => seenBy(viewSide(), u);
// Enemy formations the player has seen (or had reported) but cannot see now.
const ghostsFor = side => fogOn() ? Object.entries(S.lastSeen?.[side] || {}).filter(([id]) => { const u = S.units.find(v => v.id === id); return !u || !seenBy(side, u); }).map(([id, g]) => ({ id, ...g })) : [];

// What a side's commanders believe of the enemy: the formations they can see,
// and where the rest were last seen in the past few days (or reported at the
// outset). The computer weighs danger and objectives by this.
function believedEnemies(side, days = 4) {
  const seen = knownEnemies(side);
  if (!fogOn()) return seen;
  const ghosts = ghostsFor(side).filter(g => S.round - g.round <= days)
    .flatMap(g => Array.from({ length: g.strength || 1 }, (_, i) => ({ id: `ghost-${g.id}-${i}`, side: g.side, hex: g.hex, variant: g.variant, hp: MAX_HP, mp: 0, stock: 100, ghost: true })));
  return [...seen, ...ghosts];
}
// At the outset each side knows what any commander of the time would: which
// enemy forts and strongpoints are held (and by whom), and roughly where each
// enemy army in the field lies and how strong it is. Each army is one report
// at its centre, not its formations one by one.
function reportPositions() {
  S.lastSeen = { azure: {}, red: {} };
  const posts = new Set([...STRONGPOINTS, ...FORTS].map(k => HEX_OF[k]).filter(h => h >= 0));
  for (const side of ['azure', 'red']) {
    const enemy = S.units.filter(u => u.side !== side), field = enemy.filter(u => !posts.has(u.hex)), seen = S.lastSeen[side];
    for (const u of enemy) if (posts.has(u.hex)) seen[u.id] = { hex: u.hex, round: 0, name: u.name, variant: u.variant, side: u.side };
    // Bodies in the field: formations within 3 km of one another march as one.
    const left = new Set(field), reach = Math.max(2, Math.round(3 / HEX_KM));
    let k = 0;
    while (left.size) {
      const body = [left.values().next().value];
      left.delete(body[0]);
      for (let i = 0; i < body.length; i++) for (const v of [...left]) if (hexDistance(v.hex, body[i].hex) <= reach) { body.push(v); left.delete(v); }
      const cx = body.reduce((a, u) => a + HEXES[u.hex].x, 0) / body.length, cy = body.reduce((a, u) => a + HEXES[u.hex].y, 0) / body.length;
      const at = body.reduce((b, u) => Math.hypot(HEXES[u.hex].x - cx, HEXES[u.hex].y - cy) < Math.hypot(HEXES[b.hex].x - cx, HEXES[b.hex].y - cy) ? u : b).hex;
      const kinds = body.map(u => u.variant), main = kinds.sort((a, b) => kinds.filter(x => x === b).length - kinds.filter(x => x === a).length)[0];
      seen[`report-${side}-${k++}`] = { hex: at, round: 0, name: body.length > 1 ? `${SIDES[body[0].side].adj} army` : `${SIDES[body[0].side].adj} detachment`, variant: main, side: body[0].side, strength: body.length, report: true };
    }
  }
}

// The ground a side can see (for the fog the player sees).
const groundSeen = side => { sightOf(side); return SIGHT.ground[side]; };
