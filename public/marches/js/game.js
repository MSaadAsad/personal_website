'use strict';
// Rules, campaign state and the computer opponent. No DOM access here: the
// interface registers callbacks on `UI` (see ui.js).

const UI = { refresh() {}, log() {}, animateMove: async () => {}, combatFx: async () => {}, focus: async () => {}, banner() {}, victory() {}, flash() {}, battleEnded() {} };

const SIDES = {
  azure: { name: 'Hill Confederacy', short: 'Hills', adj: 'Hill', color: '#5fb8c9' },
  red:   { name: 'Durrani Lashkar', short: 'Durrani', adj: 'Durrani', color: '#d36b56' },
};
const other = side => side === 'azure' ? 'red' : 'azure';

const VARIANTS = {
  'Matchlockmen':       { type: 'foot',  mp: 8,  range: 1, atk: 3, def: 3, trait: 'Volley — a failed attack costs nothing', skirmish: true },
  'Dhal & Talwar':      { type: 'foot',  mp: 8,  range: 1, atk: 5, def: 2, trait: 'Assault — +1 against towns and forts' },
  'Spearmen':           { type: 'foot',  mp: 7,  range: 1, atk: 3, def: 4, trait: 'Brace — +2 defence against horse' },
  // Only the field guns reach two hexes; swivels and wall pieces fire at close quarters.
  'Zamburak':           { type: 'guns',  mp: 9,  range: 1, atk: 3, def: 2, trait: 'Camel swivel guns — climb hills like foot; +1 against walls' },
  'Jingal':             { type: 'guns',  mp: 6,  range: 1, atk: 3, def: 2, trait: 'Wall pieces — light to carry; +1 against walls' },
  'Light Field Gun':    { type: 'guns',  mp: 5,  range: 2, atk: 5, def: 1, breach: 2, trait: 'Breaching — fires two hexes; +2 against towns and forts' },
  'Irregular Sowars':   { type: 'horse', mp: 14, range: 1, atk: 3, def: 2, trait: 'Swift — the longest march' },
  'Lancers':            { type: 'horse', mp: 12, range: 1, atk: 5, def: 2, trait: 'Charge — +1 on open plain, −1 into rough ground' },
  'Mounted Matchlocks': { type: 'horse', mp: 12, range: 1, atk: 3, def: 2, trait: 'Skirmish — a failed attack costs nothing', skirmish: true },
  // 1849: the armies of the Second Anglo-Sikh War. `look` borrows the figures
  // of an older variant; `breach` is the bonus guns get against walls.
  'Line Infantry':      { type: 'foot',  mp: 8,  range: 1, atk: 4, def: 4, look: 'Matchlockmen', trait: 'Musket and bayonet — steady in line' },
  'Sepoy Infantry':     { type: 'foot',  mp: 8,  range: 1, atk: 3, def: 3, look: 'Matchlockmen', trait: 'Company sepoys — musket and bayonet' },
  'Khalsa Infantry':    { type: 'foot',  mp: 8,  range: 1, atk: 4, def: 4, look: 'Matchlockmen', trait: 'Fauj-i-Ain battalions, drilled on the European model' },
  'Light Dragoons':     { type: 'horse', mp: 12, range: 1, atk: 4, def: 2, look: 'Irregular Sowars', trait: 'Regular cavalry — the sabre charge' },
  'Horse Artillery':    { type: 'guns',  mp: 10, range: 2, atk: 4, def: 1, breach: 1, look: 'Light Field Gun', trait: 'Galloper guns — keep pace with the cavalry; fire two hexes' },
  'Heavy Battery':      { type: 'guns',  mp: 4,  range: 2, atk: 6, def: 1, breach: 2, look: 'Light Field Gun', trait: '18-pounders — the heaviest guns in the field; fire two hexes; +2 against walls' },
  'Great Gun':          { type: 'guns',  mp: 3,  range: 2, atk: 7, def: 0, breach: 3, look: 'Light Field Gun', trait: 'A monster siege gun — barely moves; fires two hexes; +3 against walls' },
};
const TYPE_NAME = { foot: 'Foot', guns: 'Guns', horse: 'Horse' };

const STACK_LIMIT = 2;
// Distances below are for a 2 km hex; applyScenario scales them to the map's
// hex size so a day's march, a wagon's day and a general's ride cover the
// same ground on a 1 km map (in twice as many hexes).
let MARCH_SCALE = 1;
// Armies with baggage and guns march slower than the variants' nominal rate:
// a foot formation covers about 12 km a day by road, 6 km across open plain.
const PACE = 0.75;
let ATTACK_MP = 2;             // march points an attack takes; a formation needs them left to attack
const MAX_HP = 5;              // soldiers on the counter; each one is a fifth of the formation
let MEN_PER_FORMATION = 1000; // a full formation is about a thousand men, so each figure is 200
let MEN_PER_FIGURE = MEN_PER_FORMATION / MAX_HP;  // (a scenario of small detachments sets its own `menPerFormation`)
// Strength in men, as a round figure (to the nearest hundred, or ten for small detachments).
const menCount = figures => { const r = MEN_PER_FIGURE < 100 ? 10 : 100; return Math.round(figures * MEN_PER_FIGURE / r) * r; };
// A formation raised under strength (a company, a troop) never rallies past it.
const maxHp = u => u.max || MAX_HP;
const men = figures => `${menCount(figures).toLocaleString('en')} men`;
const WAVER_BELOW = 0.4;       // below this share a formation falls back and cannot attack
const SAVE_VERSION = 12;
let GENERAL_RIDE = 12;     // hexes (24 km) he can ride to take command of another formation
let GENERAL_REACH = 4;     // hexes (8 km) within which he can order a forced march
const GENERAL_RANSOM = 5;  // war points to whoever captures him

// Set from the chosen scenario by applyScenario().
let SCN = null, MAP_ID = null, SAVE_KEY = null;
let VP_TARGET, ROUND_LIMIT, FIRST, GENERALS, STRONGPOINTS, START_OWNERS, START_UNITS;

function applyScenario(id) {
  MAP_ID = id; SCN = SCENARIOS[id]; MAP = window.MAPS[SCN.map || id];  // several scenarios can share a map
  MARCH_SCALE = 2 / (MAP.hexKm || 2);
  MEN_PER_FORMATION = SCN.menPerFormation || 1000; MEN_PER_FIGURE = MEN_PER_FORMATION / MAX_HP;
  [GENERAL_RIDE, GENERAL_REACH, WAGON_MP, BATTLE_REACH] = [12, 4, 8, 3].map(n => Math.round(n * MARCH_SCALE));
  ATTACK_MP = Math.round(2 * MARCH_SCALE * PACE);
  SAVE_KEY = `jhelum-marches-${id}-v${SAVE_VERSION}`;
  ({ vpTarget: VP_TARGET, roundLimit: ROUND_LIMIT, first: FIRST, generals: GENERALS, strongpoints: STRONGPOINTS, startOwners: START_OWNERS, startUnits: START_UNITS } = SCN);
  for (const side of ['azure', 'red']) Object.assign(SIDES[side], SCN.sides[side]);
  POWERS = SCN.powers;
  VEG_PATCHES = (SCN.jungle || []).map(j => { const [x, y] = geoToKm(j.lat, j.lon); return { x, y, r: j.radiusKm, tree: j.tree ?? 0.6, shrub: j.shrub ?? 0.5 }; });
  POWER_BY_ID = Object.fromEntries(POWERS.map(p => [p.id, p]));
}

let S = null;            // campaign state
let HEX_OF = {};         // place key -> hex id
let STRONG_HEX = new Map(); // hex id -> place key
let SEAT_HEX = new Map();   // hex id -> power id (local powers only)
let FORTS = [];             // forts that are not strongpoints: held, but score no points
let FORT_HEX = new Map();   // hex id -> fort key

function indexPlaces() {
  HEX_OF = Object.fromEntries(Object.keys(MAP.places).map(k => [k, placeHex(k)]));
  STRONG_HEX = new Map(STRONGPOINTS.map(k => [HEX_OF[k], k]));
  SEAT_HEX = new Map(POWERS.filter(p => p.npc).map(p => [HEX_OF[p.seat], p.id]));
  FORTS = Object.keys(MAP.places).filter(k => MAP.places[k].kind === 'fort' && !STRONGPOINTS.includes(k));
  FORT_HEX = new Map(FORTS.map(k => [HEX_OF[k], k]));
}

function newCampaign({ player = 'azure', ai = true, fog = true } = {}) {
  let seq = 0;
  // A starting formation may carry options: `post` keeps it where it stands
  // under the computer (a bridge guard, a frontier post).
  const units = START_UNITS.map(([side, variant, at, name, figures, opts]) => Object.assign(makeUnit(side, variant, hexOfStop(at), `${side[0]}${++seq}`, name, figures), opts));
  S = {
    version: SAVE_VERSION, map: MAP_ID, round: 1, turn: FIRST, player, ai: { azure: ai && player !== 'azure', red: ai && player !== 'red' }, fog, lastSeen: {},
    units, seq,
    owners: Object.fromEntries(STRONGPOINTS.map(k => [k, START_OWNERS[k] || null])),
    // Forts start in the hands of the side whose home sphere they stand in.
    forts: Object.fromEntries(FORTS.map(k => [k, POWER_BY_ID[HEXES[HEX_OF[k]].territory]?.side || null])),
    allies: Object.fromEntries(POWERS.filter(p => p.npc).map(p => [p.id, null])),
    levied: {}, vp: { azure: 0, red: 0 }, winner: null, log: [], undo: null, selected: null,
    ferries: [], ferryBuilt: { azure: false, red: false },
    walls: { ...(SCN.walls || {}) },  // great fortifications that must be breached
    battered: {}, kacha: {}, mines: {},  // levels shelled off places' works; kacha forts dug, by hex; galleries under way, by target hex
    turnNo: 0, events: [], battles: [],  // the chronicle: what happened, gathered into battles
    frames: [],                          // the board at the start of every command, for replays
    arrived: {},                         // reinforcements that have marched in
    generals: Object.fromEntries(['azure', 'red'].map(side => [side, { unitId: (units.find(u => u.side === side && (u.name === GENERALS[side].leads || u.variant === GENERALS[side].leads)) || units.find(u => u.side === side)).id, rode: false, forced: false, captured: false }])),
  };
  applyFerries(S.ferries);
  reportPositions();
  startTurn();
  return S;
}
// A formation's full day's march, in this map's hexes.
const fullMp = u => Math.round(VARIANTS[u.variant].mp * MARCH_SCALE * PACE);
function makeUnit(side, variant, hex, id, name = null, figures = MAX_HP) {
  const u = { id, side, variant, name: name || variant, hex, hp: figures, mp: Math.round(VARIANTS[variant].mp * MARCH_SCALE * PACE), attacked: false, moved: false, stock: 100 };
  if (figures < MAX_HP) u.max = figures;
  return u;
}

// A scenario with a `clock` is fought in watches of `hours` from `from`
// o'clock on its first `day`, rather than a day to a round; between eight in
// the evening and five in the morning it is night.
function clockAt(r) { const c = SCN.clock, h = c.from + (r - 1) * c.hours; return { day: c.day + Math.floor(h / 24), hour: h % 24 }; }
function roundName(r = S.round) {
  if (!SCN.clock) return `Day ${r}`;
  const { day, hour } = clockAt(r), time = hour === 0 ? 'midnight' : hour === 12 ? 'noon' : `${hour % 12} ${hour < 12 ? 'am' : 'pm'}`;
  return `${day} ${SCN.clock.month}, ${time}`;
}
const isNight = (r = S?.round) => !!SCN.clock && r !== undefined && (({ hour }) => hour >= 20 || hour < 5)(clockAt(r));
// The share of a day's rations eaten (and brought up) in a round.
const dayShare = () => SCN.clock ? SCN.clock.hours / 24 : 1;

function save() {
  if (S.replay) return;  // a replay borrows the board; it is never saved
  SUPPLY = {};
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ ...S, undo: null, selected: null })); } catch { /* private mode */ }
}
function load() {
  try {
    const data = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (data?.version === SAVE_VERSION && Array.isArray(data.units)) {
      S = data; applyFerries(S.ferries);
      S.turnNo ??= 0; S.events ??= []; S.battles ??= []; S.frames ??= [];
      return true;
    }
  } catch { /* corrupt save */ }
  return false;
}
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ } }

function log(side, html) {
  S.log.unshift({ side, html, round: S.round });
  S.log.length = Math.min(S.log.length, 60);
  UI.log(side, html);
}

// ---------------------------------------------------------------------------
// Queries

const unitById = id => S.units.find(u => u.id === id);
const unitsAt = hex => S.units.filter(u => u.hex === hex);
const placeName = hex => HEXES[hex]?.place ? MAP.places[HEXES[hex].place].name : null;
const isHuman = side => !S.ai[side];

// `known`: only the enemies this side can see (for planning under the fog).
function enemyZoc(side, known = false) {
  const zoc = new Uint8Array(HEXES.length);
  for (const u of known ? knownEnemies(side) : S.units.filter(v => v.side !== side)) {
    const h = HEXES[u.hex];
    h.nbr.forEach((n, dir) => { if (n >= 0 && h.river[dir] !== 'major') zoc[n] = 1; });
  }
  return zoc;
}

// Dijkstra over remaining march points. Entering an enemy's zone of control
// ends the march; friendly units can be passed through but stacks are capped.
// Under the fog a formation plans its march round the enemies it can see;
// moveUnit stops it if it runs into ones it could not.
function reachable(u) {
  const zoc = enemyZoc(u.side, true), cost = new Map([[u.hex, 0]]), prev = new Map(), heap = new MinHeap();
  const enemyAt = new Set(knownEnemies(u.side).map(v => v.hex));
  const friends = new Map();
  for (const v of S.units) if (v.side === u.side && v.id !== u.id) friends.set(v.hex, (friends.get(v.hex) || 0) + 1);
  heap.push(0, u.hex);
  while (heap.size) {
    const a = heap.pop(), d = cost.get(a);
    if (a !== u.hex && zoc[a]) continue;
    for (let dir = 0; dir < 6; dir++) {
      const b = HEXES[a].nbr[dir];
      if (b < 0 || enemyAt.has(b)) continue;
      const nd = d + terrainCost(a, dir, u);
      if (nd > u.mp || nd >= (cost.get(b) ?? Infinity)) continue;
      cost.set(b, nd); prev.set(b, a); heap.push(nd, b);
    }
  }
  const out = new Map();
  for (const [hex, c] of cost) if (hex !== u.hex && (friends.get(hex) || 0) < STACK_LIMIT) out.set(hex, c);
  return { cost: out, prev };
}
function pathTo(reach, from, to) {
  const path = [to];
  while (path[0] !== from) { const p = reach.prev.get(path[0]); if (p === undefined) return null; path.unshift(p); }
  return path;
}

// A formation below 40% strength has lost its nerve: it falls back when hit
// and cannot attack until it rallies.
const wavering = u => u.hp < maxHp(u) * WAVER_BELOW;

// Melee across a great river is impossible; fire can reach over it.
// `mpLeft`: the march points the formation would have left at `fromHex`.
function canStrike(u, fromHex, target, mpLeft = u.mp) {
  if (wavering(u) || mpLeft < ATTACK_MP) return false;
  const range = VARIANTS[u.variant].range, d = hexDistance(fromHex, target.hex);
  if (d > range || d === 0) return false;
  if (d === 1) { const dir = dirTo(fromHex, target.hex); if (HEXES[fromHex].river[dir] === 'major') return range > 1; }
  return d === 1 || seenBy(u.side, target);  // fire at range needs a line of sight
}
function targetsFrom(u, fromHex = u.hex) {
  return S.units.filter(v => v.side !== u.side && canStrike(u, fromHex, v));
}
// A formation that has attacked may still march on with what it has left.
function canAct(u) {
  return u.mp > 0 && reachable(u).cost.size > 0 || !u.attacked && targetsFrom(u).length > 0;
}

// ---------------------------------------------------------------------------
// Generals

const generalOf = side => S.generals[side];
const generalUnit = side => { const g = S.generals[side]; return g && !g.captured ? unitById(g.unitId) : null; };
const ledBy = u => { const g = S.generals[u.side]; return !!g && !g.captured && g.unitId === u.id; };
const nearGeneral = u => { const lead = generalUnit(u.side); return !!lead && hexDistance(lead.hex, u.hex) <= 1; };

function canRide(side, u) {
  const g = S.generals[side], lead = generalUnit(side);
  return !!lead && !g.rode && u && u.side === side && u !== lead && hexDistance(lead.hex, u.hex) <= GENERAL_RIDE;
}
function rideTo(u) {
  const side = u.side, g = S.generals[side];
  if (!canRide(side, u)) return false;
  g.unitId = u.id; g.rode = true;
  note({ t: 'ride', side, id: u.id });
  log(side, `<b>${GENERALS[side].name}</b> rode to take command of the ${u.name}${placeName(u.hex) ? ` at ${placeName(u.hex)}` : ''}.`);
  save(); UI.refresh();
  return true;
}
// Forced March: once per command, the general drives a nearby formation on.
function canForce(u) {
  const g = u && S.generals[u.side], lead = u && generalUnit(u.side);
  return !!lead && !g.forced && u.side === S.turn && !u.attacked && hexDistance(lead.hex, u.hex) <= GENERAL_REACH;
}
function forcedMarch(u) {
  if (!canForce(u)) return false;
  S.generals[u.side].forced = true; u.mp = fullMp(u); S.undo = null;
  log(u.side, `Forced march: <b>${GENERALS[u.side].name}</b> drove the ${u.name} on through the night.`);
  save(); UI.refresh();
  return true;
}
function captureGeneral(side) {
  const g = S.generals[side];
  g.captured = true;
  S.vp[other(side)] += GENERAL_RANSOM;
  note({ t: 'general', side, name: GENERALS[side].name, hex: unitById(g.unitId)?.hex ?? null });
  log(other(side), `<b>${GENERALS[side].name} has been taken prisoner!</b> The ${SIDES[other(side)].name} gains ${GENERAL_RANSOM} war points.`);
  UI.flash(`${GENERALS[side].name.toUpperCase()} CAPTURED`, other(side));
}

// ---------------------------------------------------------------------------
// Supply. Each side's supply zone is every strongpoint, fort and allied seat
// it holds, plus any home base. Supply is measured the way it actually moved:
// by how many days a wagon train needs to march from the zone to a formation,
// along roads where it can and never through enemy formations or their zones
// of control. Every formation carries a stock (0–100%). Each command it eats
// 20%, and the wagons bring in an amount that falls off with travel time.
// Low stock weakens it; below 20% its soldiers start to desert.

let WAGON_MP = 8;              // march points a wagon train covers in a day (a foot day)
const STOCK_USE = 20;          // % eaten every command
const STOCK_HUNGRY = 40, STOCK_SHORT = 60, STOCK_DESERT = 20;
const wagonDays = (side, hex) => supplyField(side)[hex] / WAGON_MP;
// % delivered per command for a given wagon journey: 40% at the depot, about
// 21% two days out (just keeping pace), nothing beyond three and a half days.
const deliveryFor = days => Number.isFinite(days) ? Math.max(0, Math.min(40, Math.round(45 - 12 * days))) : 0;
const delivery = u => deliveryFor(wagonDays(u.side, u.hex));
const SUSTAINED = (45 - STOCK_USE) / 12;  // wagon-days at which delivery just matches use
const stockOf = u => u.stock ?? 100;
// Kept for the panels and the AI: a formation is "in supply" if wagons can keep it fed.
const inSupply = u => delivery(u) >= STOCK_USE;
// A side may have no base on the map at all (an invading army living off what it takes).
// A side's bases off the map: a place key, a [lat, lon], or a list of these
// (Edwardes from Dera Ghazi Khan and Bahawalpur from the south, say).
const homeBases = side => {
  const b = SCN.homeBase?.[side];
  if (!b) return [];
  const list = Array.isArray(b) && (Array.isArray(b[0]) || typeof b[0] === 'string') ? b : [b];
  return list.map(x => Array.isArray(x) ? hexAtKm(...geoToKm(...x)) : HEX_OF[x]);
};
const homeBase = side => homeBases(side)[0] ?? null;
let SUPPLY = {};

// A town or fort the enemy has closed on from two or more sides is besieged:
// its wagons stop, and it feeds no one, not even its own garrison.
const besieged = (hex, side) => new Set(S.units.filter(u => u.side !== side && HEXES[hex].nbr.includes(u.hex)).map(u => u.hex)).size >= 2;
function supplySources(side) {
  const out = [];
  for (const k of STRONGPOINTS) if (S.owners[k] === side) out.push(HEX_OF[k]);
  for (const p of POWERS) if (p.npc && S.allies[p.id] === side) out.push(HEX_OF[p.seat]);
  for (const k of FORTS) if (S.forts[k] === side) out.push(HEX_OF[k]);
  const held = out.filter(hex => !S.units.some(u => u.side !== side && u.hex === hex) && !besieged(hex, side));
  held.push(...homeBases(side));
  return held;
}
function supplyField(side) {
  if (SUPPLY[side]) return SUPPLY[side];
  const zoc = enemyZoc(side), enemyAt = new Set(), friendAt = new Set();
  for (const u of S.units) (u.side === side ? friendAt : enemyAt).add(u.hex);
  const dist = new Float64Array(HEXES.length).fill(Infinity), heap = new MinHeap();
  for (const hex of supplySources(side)) { dist[hex] = 0; heap.push(0, hex); }
  while (heap.size) {
    const a = heap.pop(), d = dist[a];
    for (let dir = 0; dir < 6; dir++) {
      const b = HEXES[a].nbr[dir];
      if (b < 0 || enemyAt.has(b) || (zoc[b] && !friendAt.has(b))) continue;
      const step = HEXES[a].road[dir] ? 1 + (HEXES[a].river[dir] ? 1 : 0) : terrainCost(a, dir, null) + 1;
      if (d + step < dist[b]) { dist[b] = d + step; heap.push(dist[b], b); }
    }
  }
  return (SUPPLY[side] = dist);
}

// ---------------------------------------------------------------------------
// Ferries: once per campaign each side's foot may lash boats together across
// the Jhelum or Chenab. It costs the builders their whole command and one
// soldier, and once it stands anyone may use it.

const FERRY_COST = 1;
// Only foot do the spadework: ferries and kacha forts are infantry jobs.
const isFoot = u => VARIANTS[u.variant].type === 'foot';
function ferrySites(u) {
  if (!u || !isFoot(u) || S.ferryBuilt[u.side] || u.side !== S.turn || u.attacked || u.hp <= FERRY_COST + 1) return [];
  const h = HEXES[u.hex];
  return h.nbr.filter((n, dir) => n >= 0 && h.river[dir] === 'major');
}
function buildFerry(u, across) {
  if (!ferrySites(u).includes(across)) return false;
  const river = nearestMajorRiver(u.hex);
  S.ferries.push({ a: u.hex, b: across, side: u.side, round: S.round });
  S.ferryBuilt[u.side] = true;
  applyFerries(S.ferries);
  u.hp -= FERRY_COST; u.mp = 0; u.attacked = true; S.undo = null;
  log(u.side, `<b>${u.name}</b> lashed boats into a ferry across the ${river}${placeName(u.hex) ? ` at ${placeName(u.hex)}` : ''} (−${men(FERRY_COST)}). Either army may now cross there.`);
  UI.flash('FERRY BUILT', u.side);
  save(); UI.refresh();
  return true;
}

// ---------------------------------------------------------------------------
// Combat

function settlementDef(hex) {
  const key = HEXES[hex].place;
  return key ? SETTLEMENT_DEF[MAP.places[key].kind] : 0;
}

// Fortifications. A place's works are its settlement defence (the mud walls
// of a town or sarai, a city's ramparts, a fort), and gunfire wears them away:
// S.battered holds the levels lost. A great fortress has walls on top
// (S.walls), which go first. A kacha fort is a mud wall and ditch dug by a
// formation in a day; S.kacha holds the levels left at each hex.
const KACHA_DEF = 2;
const r2 = v => Math.round(v * 100) / 100;
function worksOf(hex) {
  const key = HEXES[hex].place, base = settlementDef(hex);
  if (base > 0) return { name: MAP.places[key].name, max: base, left: Math.max(0, base - (S.battered?.[key] || 0)) };
  if (S.kacha?.[hex] > 0) return { name: 'Kacha fort', max: KACHA_DEF, left: S.kacha[hex] };
  return null;
}
// Defence still standing: a level counts whole while any part of it stands.
const fortLevels = hex => Math.ceil(worksOf(hex)?.left || 0) + Math.ceil(S.walls?.[HEXES[hex].place] || 0);

// Wear `dmg` levels off the works at a hex: a great fortress's walls go
// first, then the place's own works, then a kacha fort.
function wearWorks(hex, dmg) {
  const key = HEXES[hex].place;
  if (S.walls?.[key] > 0) { const t = Math.min(S.walls[key], dmg); S.walls[key] = r2(S.walls[key] - t); dmg = r2(dmg - t); }
  if (dmg > 0 && settlementDef(hex) > 0) { S.battered ||= {}; S.battered[key] = r2(Math.min(settlementDef(hex), (S.battered[key] || 0) + dmg)); }
  else if (dmg > 0 && S.kacha?.[hex] > 0) { S.kacha[hex] = r2(Math.max(0, S.kacha[hex] - dmg)); if (!S.kacha[hex]) delete S.kacha[hex]; }
}
const worksTitle = hex => settlementDef(hex) > 0 ? MAP.places[HEXES[hex].place].name : 'the kacha fort';
function noteBreach(att, hex, after, mine = false) {
  const key = HEXES[hex].place;
  note({ t: 'breach', side: att.side, unit: muster(att), place: settlementDef(hex) > 0 ? key : null, hex, left: after, walls: S.walls?.[key], battered: S.battered?.[key], kacha: S.kacha?.[hex] || 0, mine });
}

// Every bombardment wears the works down: a hit brings down a level, any
// other shot part of one (more from the heavier pieces).
function shell(att, hex, hit) {
  const before = fortLevels(hex);
  if (!before) return;
  wearWorks(hex, hit ? 1 : 0.1 + 0.05 * (VARIANTS[att.variant].breach ?? 1));
  const after = fortLevels(hex);
  if (after >= before) return;
  noteBreach(att, hex, after);
  log(att.side, `<b>The guns battered down the works of ${worksTitle(hex)}</b> (${after ? `${after} defence left standing` : 'nothing left standing'}).`);
  UI.flash(after ? 'WALLS BATTERED' : 'THE WALLS ARE DOWN', att.side);
}

// Mines: foot next to enemy works dig a gallery under them, a whole day at a
// time; on the last day it is sprung and brings MINE_LEVELS down at once.
// The gallery is lost if no one of the side is left at its mouth.
const MINE_DAYS = 3, MINE_LEVELS = 2;
const enemyHeld = (hex, side) => S.units.some(e => e.hex === hex && e.side !== side)
  || STRONG_HEX.has(hex) && S.owners[STRONG_HEX.get(hex)] === other(side) || FORT_HEX.has(hex) && S.forts[FORT_HEX.get(hex)] === other(side);
const mineTargets = u => HEXES[u.hex].nbr.filter(n => n >= 0 && fortLevels(n) > 0 && enemyHeld(n, u.side));
const galleryAt = (side, from) => Object.entries(S.mines || {}).find(([, m]) => m.side === side && m.from === from);
const canMine = u => !!u && isFoot(u) && !S.winner && u.side === S.turn && !u.moved && !u.attacked && u.mp >= fullMp(u) && mineTargets(u).length > 0;
// Carry on the gallery begun from this hex, else start under the strongest works.
function mineTarget(u) {
  const g = galleryAt(u.side, u.hex), targets = mineTargets(u);
  if (g && targets.includes(+g[0])) return +g[0];
  return targets.sort((a, b) => fortLevels(b) - fortLevels(a))[0];
}
function digMine(u) {
  if (!canMine(u)) return false;
  const target = mineTarget(u), name = worksTitle(target);
  S.mines ||= {};
  for (const [k, m] of Object.entries(S.mines)) if (m.side === u.side && m.from === u.hex && +k !== target) delete S.mines[k];
  const m = S.mines[target]?.side === u.side && S.mines[target].from === u.hex ? S.mines[target] : (S.mines[target] = { side: u.side, from: u.hex, days: 0 });
  m.days++;
  u.mp = 0; u.attacked = true; S.undo = null;
  if (m.days < MINE_DAYS) {
    note({ t: 'mine', side: u.side, unit: muster(u), hex: target, from: u.hex, days: m.days });
    log(u.side, `<b>${u.name}</b> drove a mine towards the works of ${name} (${m.days} of ${MINE_DAYS} days). Keep a formation at its mouth.`);
    UI.flash('MINE DUG', u.side);
  } else {
    delete S.mines[target];
    wearWorks(target, MINE_LEVELS);
    const after = fortLevels(target);
    noteBreach(u, target, after, true);
    log(u.side, `<b>${u.name} sprang a mine under ${name}</b>: the works came down (${after ? `${after} defence left standing` : 'nothing left standing'}).`);
    UI.flash('MINE SPRUNG', u.side);
  }
  save(); UI.refresh();
  return true;
}
// The garrison can countermine: foot in the works spend their day digging to
// meet the gallery, and break into it on a roll of 4 or better.
const enemyGallery = u => Object.entries(S.mines || {}).find(([k, m]) => +k === u.hex && m.side !== u.side);
const canCountermine = u => !!u && isFoot(u) && !S.winner && u.side === S.turn && !u.moved && !u.attacked && u.mp >= fullMp(u) && !!enemyGallery(u);
function countermine(u) {
  if (!canCountermine(u)) return false;
  const [k, m] = enemyGallery(u), roll = 1 + Math.floor(Math.random() * 6), name = worksTitle(u.hex);
  u.mp = 0; u.attacked = true; S.undo = null;
  if (roll >= 4) delete S.mines[k];
  note({ t: 'countermine', side: u.side, unit: muster(u), hex: u.hex, from: m.from, broke: roll >= 4 });
  log(u.side, roll >= 4 ? `<b>${u.name}</b> countermined under ${name} and broke into the enemy’s gallery: the mine is lost.` : `${u.name} countermined under ${name} but could not find the enemy’s gallery (rolled ${roll}).`);
  UI.flash(roll >= 4 ? 'GALLERY BROKEN' : 'COUNTERMINE FAILED', u.side);
  save(); UI.refresh();
  return true;
}
// At the start of a side's command its galleries with no one at the mouth are lost.
function checkMines() {
  for (const [k, m] of Object.entries(S.mines || {})) {
    if (m.side !== S.turn || S.units.some(u => u.side === m.side && u.hex === m.from) && fortLevels(+k) > 0) continue;
    delete S.mines[k];
    if (fortLevels(+k) > 0) log(m.side, `The mine under ${worksTitle(+k)} was abandoned.`);
  }
}

// A foot formation that spends its whole day digging throws up a kacha fort round
// its hex, out of reach of the enemy.
const canFortify = u => !!u && isFoot(u) && !S.winner && u.side === S.turn && !u.moved && !u.attacked && u.mp >= fullMp(u)
  && !settlementDef(u.hex) && !(S.kacha?.[u.hex] > 0)
  && !HEXES[u.hex].nbr.some(n => n >= 0 && S.units.some(e => e.side !== u.side && e.hex === n));
function fortify(u) {
  if (!canFortify(u)) return false;
  S.kacha ||= {}; S.kacha[u.hex] = KACHA_DEF;
  u.mp = 0; u.attacked = true; S.undo = null;
  note({ t: 'fortify', side: u.side, unit: muster(u), hex: u.hex });
  log(u.side, `<b>${u.name}</b> dug a kacha fort${placeName(u.hex) ? ` at ${placeName(u.hex)}` : ''}: a mud wall and ditch, +${KACHA_DEF} defence.`);
  UI.flash('KACHA FORT DUG', u.side);
  save(); UI.refresh();
  return true;
}
function localLevy(side, hex) {
  const t = HEXES[hex].territory, power = POWER_BY_ID[t];
  return power?.npc && S.allies[t] === side ? 1 : 0;
}
// Pressure on a formation from the enemy soldiers around it. `except` is the
// attacker itself, whose strength already counts through its own attack.
function pressureOn(u, except = null) {
  const h = HEXES[u.hex], held = h.nbr.map(n => n >= 0 && S.units.some(v => v.side !== u.side && v.hex === n));
  const soldiers = S.units.filter(v => v.side !== u.side && v !== except && h.nbr.includes(v.hex)).reduce((n, v) => n + v.hp, 0);
  const sides = held.filter(Boolean).length, opposite = held.some((x, i) => x && held[(i + 3) % 6]);
  return { soldiers, encircled: sides >= 3 || opposite };
}

// Fatigue, read from a formation's own latest command: one that held its
// ground fights steadier; one that spent most of its day's march fights tired.
function marchState(u, moved = u.moved, mpLeft = u.mp) {
  if (!moved) return ['Holding its ground', 1];
  const spent = 1 - mpLeft / fullMp(u);
  return spent > 2 / 3 ? ['Spent by the march', -2] : spent > 1 / 3 ? ['Tired from the march', -1] : ['', 0];
}

function defenceOf(def, attacker, attackFrom) {
  const v = VARIANTS[def.variant], h = HEXES[def.hex], parts = [['Formation', v.def]];
  parts.push([TERRAIN[h.terrain].name, TERRAIN[h.terrain].def]);
  if (h.cover) parts.push([COVER[h.cover].name, COVER[h.cover].def]);
  const works = worksOf(def.hex), wall = Math.ceil(S.walls?.[h.place] || 0);
  if (works) parts.push([works.left < works.max ? `${works.name} (battered)` : works.name, Math.ceil(works.left)]);
  if (wall) parts.push([`${MAP.places[h.place].name} walls`, wall]);
  if (attacker && hexDistance(attackFrom, def.hex) === 1) {
    const river = HEXES[attackFrom].river[dirTo(attackFrom, def.hex)];
    if (river) parts.push([`Across ${RIVER_CLASS[river].name}`, RIVER_CLASS[river].def]);
    if (def.variant === 'Spearmen' && VARIANTS[attacker.variant].type === 'horse') parts.push(['Braced spears', 2]);
  }
  if (v.type === 'horse' && h.relief > 100) parts.push(['Horse on steep ground', -1]);
  if (stockOf(def) < STOCK_HUNGRY) parts.push([stockOf(def) < STOCK_DESERT ? 'Starving' : 'Hungry', -1]);
  const levy = localLevy(def.side, def.hex);
  if (levy) parts.push(['Allied levies', levy]);
  if (ledBy(def)) parts.push([GENERALS[def.side].name, 1]);
  parts.push(marchState(def));
  if (attacker) {
    const rise = h.elev - HEXES[attackFrom].elev;
    if (rise >= 60) parts.push(['Higher ground', rise >= 180 ? 2 : 1]);
  }
  // Outnumbered and surrounded: every 4 enemy soldiers alongside cost 1.
  // Standing walls cover a garrison's flanks: numbers outside count only
  // once the walls are down.
  if (attacker && !wall) {
    const press = pressureOn(def, attacker);
    if (press.soldiers >= 4) parts.push([`Pressed by ${men(press.soldiers)}`, -Math.min(3, Math.floor(press.soldiers / 4))]);
    if (press.encircled) parts.push(['Encircled', -1]);
  }
  return { total: parts.reduce((s, p) => s + p[1], 0), parts: parts.filter(p => p[1]) };
}
function attackOf(att, fromHex, def, mpLeft = att.mp) {
  const v = VARIANTS[att.variant], h = HEXES[def.hex], parts = [['Formation', v.atk]], melee = hexDistance(fromHex, def.hex) === 1;
  const rough = h.relief > 100 || h.cover === 'forest' || h.cover === 'woods' || settlementDef(def.hex) >= 1;
  const walled = fortLevels(def.hex) > 0;
  if (att.variant === 'Lancers') parts.push(h.terrain === 'plain' && !h.cover && !walled ? ['Charge on open ground', 1] : rough ? ['Charging rough ground', -1] : ['', 0]);
  else if (v.type === 'horse' && rough) parts.push(['Horse in rough ground', -1]);
  if (att.variant === 'Dhal & Talwar' && walled) parts.push(['Assault', 1]);
  // Artillery is what brings down walls.
  if (v.type === 'guns' && walled) parts.push(['Breaching fire', v.breach ?? 1]);
  // Height: attacking downhill helps (the defender's uphill bonus is in defenceOf).
  if (HEXES[fromHex].elev - h.elev >= 60) parts.push(['Attacking downhill', 1]);
  if (ledBy(att)) parts.push([GENERALS[att.side].name, 1]);
  parts.push(marchState(att, att.moved || fromHex !== att.hex || mpLeft < att.mp, mpLeft));
  const st = stockOf(att);
  if (st < STOCK_DESERT) parts.push(['Starving', -2]);
  else if (st < STOCK_SHORT) parts.push([st < STOCK_HUNGRY ? 'Hungry' : 'Short of supplies', -1]);
  return { total: parts.reduce((s, p) => s + p[1], 0), parts: parts.filter(p => p[1]), melee };
}
// The defender in a stack is whichever formation defends best.
function defenderIn(hex, attacker, fromHex) {
  return unitsAt(hex).filter(u => u.side !== attacker.side).sort((a, b) => defenceOf(b, attacker, fromHex).total - defenceOf(a, attacker, fromHex).total || b.hp - a.hp)[0];
}

// Soldiers a formation strikes down scale with how many it still has.
const damageOut = (u, base) => Math.max(1, Math.round(base * u.hp / MAX_HP));

// Outcome by margin (attack roll − defence roll, each d6 + modifiers):
//   ≥ 3      rout      defender loses 3 × attacker strength
//   0 to 2   hit       defender loses 2 × attacker strength; in melee the attacker takes 1 back
//   −1, −2   standoff  melee: both lose 1 · fire: falls short
//   ≤ −3     repulse   melee: attacker loses 2 × defender strength · fire: falls short
// ("× strength" means scaled by soldiers remaining out of five, minimum 1.)
// Skirmishers never take losses when they attack; guns give nothing back in melee.
function resolve(m, att, def, melee) {
  const exposed = melee && !VARIANTS[att.variant].skirmish, bites = VARIANTS[def.variant].type !== 'guns';
  if (m >= 3) return { outcome: 'rout', dDef: damageOut(att, 3), dAtt: 0 };
  if (m >= 0) return { outcome: 'hit', dDef: damageOut(att, 2), dAtt: exposed && bites ? 1 : 0 };
  if (!exposed) return { outcome: 'miss', dDef: 0, dAtt: 0 };
  if (m >= -2) return { outcome: 'standoff', dDef: 1, dAtt: bites ? 1 : 0 };
  return { outcome: 'repulse', dDef: 0, dAtt: bites ? damageOut(def, 2) : 1 };
}
// Breaks = destroyed, or pushed below 40% and forced back (a led formation holds).
const breaks = (u, loss) => u.hp - loss <= 0 || (!ledBy(u) && settlementDef(u.hex) < SETTLEMENT_DEF.fort && u.hp - loss < maxHp(u) * WAVER_BELOW && loss > 0);

function forecast(att, fromHex, target, mpLeft = att.mp) {
  const def = defenderIn(target.hex, att, fromHex) || target, A = attackOf(att, fromHex, def, mpLeft), D = defenceOf(def, att, fromHex);
  const p = { rout: 0, hit: 0, standoff: 0, miss: 0, repulse: 0 };
  let expDef = 0, expAtt = 0, pBreak = 0, pKill = 0, pAttBreak = 0, pAttKill = 0;
  for (let a = 1; a <= 6; a++) for (let d = 1; d <= 6; d++) {
    const r = resolve(a + A.total - (d + D.total), att, def, A.melee);
    p[r.outcome] += 1 / 36;
    expDef += r.dDef / 36; expAtt += r.dAtt / 36;
    if (breaks(def, r.dDef)) pBreak += 1 / 36;
    if (def.hp - r.dDef <= 0) pKill += 1 / 36;
    if (breaks(att, r.dAtt)) pAttBreak += 1 / 36;
    if (att.hp - r.dAtt <= 0) pAttKill += 1 / 36;
  }
  return { def, A, D, ...p, expDef, expAtt, pBreak, pKill, pAttBreak, pAttKill, melee: A.melee };
}

// Where a broken formation falls back to: up to two hexes, away from the
// enemy, toward friends and cover. Null if it is cut off.
function retreatPath(u, fromHex) {
  const enemies = S.units.filter(v => v.side !== u.side), zoc = enemyZoc(u.side);
  const enemyAt = new Set(enemies.map(v => v.hex));
  const prev = new Map([[u.hex, -1]]), depth = new Map([[u.hex, 0]]), queue = [u.hex];
  while (queue.length) {
    const a = queue.shift();
    if (depth.get(a) === 2) continue;
    for (let dir = 0; dir < 6; dir++) {
      const b = HEXES[a].nbr[dir];
      if (b < 0 || prev.has(b) || enemyAt.has(b) || !Number.isFinite(terrainCost(a, dir, u))) continue;
      prev.set(b, a); depth.set(b, depth.get(a) + 1); queue.push(b);
    }
  }
  let best = null;
  for (const [hex, dpt] of depth) {
    if (!dpt || unitsAt(hex).filter(v => v.side === u.side && v !== u).length >= STACK_LIMIT) continue;
    const nearest = Math.min(4, ...enemies.map(e => hexDistance(e.hex, hex)));
    const sk = STRONG_HEX.get(hex);
    const score = hexDistance(hex, fromHex) * 3 + nearest * 2 - (zoc[hex] ? 4 : 0)
      + (unitsAt(hex).some(v => v.side === u.side) ? 1 : 0) + (sk && S.owners[sk] === u.side ? 2 : 0) + settlementDef(hex) * 0.5;
    if (!best || score > best.score) best = { hex, score };
  }
  if (!best) return null;
  const path = [best.hex];
  while (prev.get(path[0]) !== -1) path.unshift(prev.get(path[0]));
  return path;
}

async function fallBack(u, fromHex) {
  const path = retreatPath(u, fromHex);
  if (!path) {
    S.units = S.units.filter(v => v !== u);
    log(u.side, `${u.name} was cut off and surrendered.`);
    note({ t: 'surrender', side: u.side, unit: muster(u), hex: u.hex, why: 'cut off' });
    return null;
  }
  await UI.animateMove(u, path);
  u.hex = path[path.length - 1];
  if (u.side === S.turn) { u.mp = 0; u.attacked = true; }
  log(u.side, `${u.name} fell back in disorder (${men(u.hp)} left).`);
  note({ t: 'fallback', side: u.side, unit: muster(u), hex: u.hex, path });
  return u.hex;
}

async function attack(att, target) {
  const fromHex = att.hex, f = forecast(att, fromHex, target), def = f.def, defHex = def.hex;
  const ar = 1 + Math.floor(Math.random() * 6), dr = 1 + Math.floor(Math.random() * 6);
  const { outcome, dDef, dAtt } = resolve(ar + f.A.total - (dr + f.D.total), att, def, f.melee);
  // Only horse can strike and ride on (a raid); foot and guns are done for the day.
  att.attacked = true; att.mp = VARIANTS[att.variant].type === 'horse' ? Math.max(0, att.mp - ATTACK_MP) : 0; S.undo = null;
  const lostDef = Math.min(def.hp, dDef), lostAtt = Math.min(att.hp, dAtt);
  def.hp -= lostDef; att.hp -= lostAtt;
  ENGAGEMENT = engagementAt(defHex);
  note({ t: 'combat', side: att.side, att: muster(att), def: muster(def), from: fromHex, hex: defHex, melee: f.melee, outcome, lostAtt, lostDef, odds: [ar + f.A.total, dr + f.D.total] });
  const where = placeName(defHex) ? ` at ${placeName(defHex)}` : '';
  const roll = `<span class="roll">${ar}+${f.A.total} vs ${dr}+${f.D.total}</span>`;
  const losses = `(${lostDef ? `−${men(lostDef)}` : 'no loss'}${f.melee ? `; attackers ${lostAtt ? `−${men(lostAtt)}` : 'unhurt'}` : ''})`;
  const text = {
    rout: `<b>${att.name}</b> smashed ${def.name}${where} ${losses}. ${roll}`,
    hit: `<b>${att.name}</b> struck ${def.name}${where} ${losses}. ${roll}`,
    standoff: `<b>${att.name}</b> and ${def.name} fought to a bloody standstill${where} ${losses}. ${roll}`,
    miss: `<b>${att.name}</b> fired on ${def.name}${where}; the shot fell short. ${roll}`,
    repulse: `<b>${def.name}</b> threw back ${att.name}${where} ${losses}. ${roll}`,
  }[outcome];
  log(att.side, text);
  if (VARIANTS[att.variant].type === 'guns') shell(att, defHex, outcome === 'hit' || outcome === 'rout');
  await UI.combatFx({ att, def, outcome, dmgDef: lostDef, dmgAtt: lostAtt, ar, dr, A: f.A.total, D: f.D.total });
  for (const u of [def, att]) if (u.hp <= 0) {
    S.units = S.units.filter(v => v !== u);
    log(u.side, `${u.name} was destroyed.`);
    note({ t: 'destroyed', side: u.side, unit: muster(u), hex: u.hex });
    if (S.generals[u.side].unitId === u.id && !S.generals[u.side].captured) captureGeneral(u.side);
  }
  // Below 40% a formation must fall back, unless the general holds it together
  // or it is garrisoning a fort, where it fights to the last. An encircled
  // formation has nowhere to go and surrenders instead.
  const garrisoned = settlementDef(defHex) >= SETTLEMENT_DEF.fort;
  if (def.hp > 0 && lostDef && wavering(def) && !ledBy(def) && !garrisoned) {
    if (pressureOn(def).encircled) {
      S.units = S.units.filter(v => v !== def);
      log(def.side, `${def.name} was surrounded and laid down its arms${placeName(defHex) ? ` at ${placeName(defHex)}` : ''}.`);
      note({ t: 'surrender', side: def.side, unit: muster(def), hex: defHex, why: 'surrounded' });
    } else await fallBack(def, fromHex);
  }
  if (att.hp > 0 && lostAtt && wavering(att) && !ledBy(att)) await fallBack(att, defHex);
  // Foot and horse that clear a hex in melee follow up into it, unless they
  // are a garrison sallying from walls or a strongpoint they hold: they stay.
  const garrison = fortLevels(fromHex) > 0 || STRONG_HEX.has(fromHex) && S.owners[STRONG_HEX.get(fromHex)] === att.side;
  if (att.hp > 0 && att.hex === fromHex && f.melee && !garrison && VARIANTS[att.variant].type !== 'guns' && !wavering(att)
      && !unitsAt(defHex).length && HEXES[fromHex].river[dirTo(fromHex, defHex)] !== 'major') {
    await UI.animateMove(att, [fromHex, defHex]);
    att.hex = defHex;
    note({ t: 'advance', side: att.side, unit: muster(att), hex: defHex, from: fromHex });
    capture(att);
  }
  ENGAGEMENT = null;
  checkVictory();
  save();
  UI.refresh();
  return outcome;
}

// ---------------------------------------------------------------------------
// Chronicle. The rules note down what happened as plain facts. Fights close
// together in place and time are gathered into one engagement, named after
// the nearest place; it closes once both sides have had a command without
// striking a blow there. ui.js then has it written up (see chronicle.js).

let BATTLE_REACH = 3;     // hexes (6 km) from where an engagement began that still count as part of it
const BATTLE_LULL = 2, BATTLE_LULL_IN_CONTACT = 4;  // quiet commands before an engagement is over
let ENGAGEMENT = null;    // the engagement the attack being resolved belongs to

const muster = u => ({ id: u.id, side: u.side, name: u.name, variant: u.variant, hp: u.hp, general: ledBy(u) ? GENERALS[u.side].name : null });
// Fights within reach of an open engagement join it, except that an attack on
// a different town or fort from the one an engagement began at is its own.
const heldPlace = hex => STRONG_HEX.has(hex) || FORT_HEX.has(hex);
const openBattleNear = hex => S.battles.filter(b => b.open && hexDistance(b.hex, hex) <= BATTLE_REACH && !(b.hex !== hex && heldPlace(b.hex) && heldPlace(hex)))
  .sort((a, b) => hexDistance(a.hex, hex) - hexDistance(b.hex, hex))[0] || null;

function note(e) {
  const near = ENGAGEMENT || (e.t === 'capture' && e.hex != null ? openBattleNear(e.hex) : null);
  S.events.push({ ...e, round: S.round, battle: near?.id ?? null });
}
function engagementAt(hex) {
  let b = openBattleNear(hex);
  if (!b) S.battles.push(b = { id: S.battles.length + 1, hex, first: S.round, open: true });
  b.last = S.round; b.lastTurn = S.turnNo;
  return b;
}

// The place a fight is named after: the nearest named place, preferring the
// bigger ones, skipping camps and other scenario landmarks.
function battlePlace(hex) {
  const skip = new Set(SCN.anonymous || []);
  let best = null, score = Infinity;
  for (const [k, h] of Object.entries(HEX_OF)) {
    if (skip.has(k) || !(h >= 0)) continue;
    const d = hexDistance(h, hex), sc = d + (MAP.places[k].tier || 3) * 0.4 - (d === 0 ? 2 : 0);
    if (sc < score) { score = sc; best = k; }
  }
  return best && { key: best, dist: hexDistance(HEX_OF[best], hex) };
}
const ORDINAL = ['', 'Second ', 'Third ', 'Fourth ', 'Fifth ', 'Sixth '];
const placeTitle = key => MAP.places[key].name.replace(/[\u200e\u200f\u202a-\u202e]/g, '').trim();

// Everything known about an engagement: where it centred, what kind of fight
// it was, who struck first, who came off better, and what it cost.
function describeBattle(b) {
  const evs = S.events.filter(e => e.battle === b.id), fights = evs.filter(e => e.t === 'combat');
  const struck = new Map();
  for (const e of fights) struck.set(e.hex, (struck.get(e.hex) || 0) + 1);
  const focus = [...struck].sort((a, c) => c[1] - a[1])[0]?.[0] ?? b.hex;
  const attacker = fights[0]?.side ?? evs[0]?.side, defender = other(attacker);
  const lost = { azure: 0, red: 0 }, broken = { azure: 0, red: 0 };
  for (const e of fights) { lost[e.att.side] += e.lostAtt; lost[e.def.side] += e.lostDef; }
  for (const e of evs) if (e.t === 'destroyed' || e.t === 'surrender') broken[e.side]++;
  const taken = evs.filter(e => e.t === 'capture'), breaches = evs.filter(e => e.t === 'breach');
  const where = battlePlace(focus), key = where?.key, place = key ? placeTitle(key) : 'the open country';
  const walled = key && where.dist === 0 && (S.walls?.[key] !== undefined || settlementDef(focus) >= SETTLEMENT_DEF.fort);
  const rounds = (b.last ?? b.first) - b.first + 1;
  const decisive = taken.length || breaches.length || broken.azure || broken.red || evs.some(e => e.t === 'general');
  const kind = walled && (struck.get(focus) >= 3 && rounds >= 2 || breaches.length) ? 'siege'
    : walled || (key && where.dist === 0 && taken.length) ? 'assault'
    : fights.length >= 3 || decisive ? 'battle' : 'skirmish';
  // Who won: a place taken decides it; a siege that never took the place was
  // held; otherwise whoever bled the other clearly more.
  const toll = s => lost[s] + 2 * broken[s];
  const tookPlace = taken.filter(e => e.place === key).pop() || taken[taken.length - 1];
  const victor = tookPlace ? tookPlace.side
    : kind === 'siege' || kind === 'assault' ? defender
    : Math.abs(toll('azure') - toll('red')) >= 2 ? (toll('azure') < toll('red') ? 'azure' : 'red') : null;
  const near = !where || where.dist <= 1 || kind === 'siege' || kind === 'assault';
  const base = {
    siege: `Siege of ${place}`,
    assault: taken.some(e => e.place === key) ? `Storming of ${place}` : `Assault on ${place}`,
    battle: `Battle ${near ? 'of' : 'near'} ${place}`,
    skirmish: `Skirmish ${near ? 'at' : 'near'} ${place}`,
  }[kind];
  const before = S.battles.filter(x => x.id < b.id && x.base === base).length;
  return { focus, placeKey: key || null, place, took: tookPlace?.place ?? null, kind, base, name: ORDINAL[Math.min(before, 5)] + base, attacker, defender, victor, lost, broken, rounds, fights: fights.length, major: kind !== 'skirmish' };
}

// Close the engagements that have gone quiet (or all of them when the
// campaign ends) and hand each to the interface to be written up. While the
// two sides both still stand close round where it began (a siege line round a
// fort, say) a lull of a day does not end it.
const inContact = b => ['azure', 'red'].every(side => S.units.some(u => u.side === side && hexDistance(u.hex, b.hex) <= 2));
function closeBattles(all = false) {
  for (const b of S.battles) if (b.open && (all || S.turnNo - b.lastTurn >= (inContact(b) ? BATTLE_LULL_IN_CONTACT : BATTLE_LULL))) {
    b.open = false;
    Object.assign(b, describeBattle(b));
    UI.battleEnded(b);
  }
}

// ---------------------------------------------------------------------------
// Movement and turn flow

async function moveUnit(u, to, reach = reachable(u)) {
  let cost = reach.cost.get(to);
  if (cost === undefined) return false;
  let path = pathTo(reach, u.hex, to), contact = null;
  // A march into enemies it could not see halts on contact: beside them, or
  // short of the hex they hold (and short of a hex already full of friends).
  if (fogOn()) {
    const enemies = S.units.filter(v => v.side !== u.side), touches = h => enemies.some(e => hexDistance(e.hex, h) === 1 && HEXES[h].river[dirTo(h, e.hex)] !== 'major');
    for (let i = 1; i < path.length; i++) {
      if (enemies.some(e => e.hex === path[i])) { path = path.slice(0, i); contact = path[i - 1]; break; }
      if (touches(path[i]) && !enemies.some(e => hexDistance(e.hex, path[i]) === 1 && seenBy(u.side, e))) { path = path.slice(0, i + 1); contact = path[i]; break; }
    }
    while (contact !== null && path.length > 1 && unitsAt(path.at(-1)).filter(v => v.side === u.side).length >= STACK_LIMIT) path.pop();
    if (contact !== null) {
      to = path.at(-1);
      cost = path.slice(1).reduce((c, h, i) => c + terrainCost(path[i], dirTo(path[i], h), u), 0);
    }
  }
  if (path.length < 2) {
    S.undo = null;
    log(u.side, `<b>${u.name}</b> ran into the enemy${placeName(u.hex) ? ` near ${placeName(u.hex)}` : ''} and halted.`);
    UI.flash('CONTACT', u.side); save(); UI.refresh();
    return true;
  }
  const key = STRONG_HEX.get(to), fort = FORT_HEX.get(to);
  S.undo = { id: u.id, hex: u.hex, mp: u.mp, moved: u.moved, owner: key ? [key, S.owners[key]] : null, fort: fort ? [fort, S.forts[fort]] : null, events: S.events.length };
  await UI.animateMove(u, path);
  note({ t: 'move', side: u.side, id: u.id, path });
  u.hex = to; u.mp -= cost; u.moved = true;
  capture(u);
  if (contact !== null) {
    S.undo = null;  // what has been seen cannot be unseen
    log(u.side, `<b>${u.name}</b> ran into the enemy${placeName(u.hex) ? ` near ${placeName(u.hex)}` : ''} and halted.`);
    UI.flash('CONTACT', u.side);
  }
  save();
  UI.refresh();
  return true;
}
function capture(u) {
  const fort = FORT_HEX.get(u.hex);
  if (fort && S.forts[fort] !== u.side) {
    note({ t: 'capture', side: u.side, unit: muster(u), place: fort, hex: u.hex, from: S.forts[fort] || null });
    S.forts[fort] = u.side;
    log(u.side, `<b>${u.name}</b> garrisoned ${MAP.places[fort].name}; it now feeds the ${SIDES[u.side].adj} supply lines.`);
  }
  const key = STRONG_HEX.get(u.hex);
  if (key && S.owners[key] !== u.side) {
    note({ t: 'capture', side: u.side, unit: muster(u), place: key, hex: u.hex, from: S.owners[key] || null });
    S.owners[key] = u.side;
    log(u.side, `<b>${u.name}</b> raised the ${SIDES[u.side].adj} standard over ${MAP.places[key].name}.`);
    UI.flash(`${MAP.places[key].name.toUpperCase()} TAKEN`, u.side);
  }
}
function undoMove() {
  const o = S.undo, u = o && unitById(o.id);
  if (!u) return false;
  u.hex = o.hex; u.mp = o.mp; u.moved = o.moved;
  if (o.owner) S.owners[o.owner[0]] = o.owner[1];
  if (o.fort) S.forts[o.fort[0]] = o.fort[1];
  S.events.length = Math.min(S.events.length, o.events ?? S.events.length);
  S.undo = null; S.selected = u.id;
  save(); UI.refresh();
  return true;
}

// A place key, or [lat, lon] for a spot with no place of its own.
const hexOfStop = at => Array.isArray(at) ? hexAtKm(...geoToKm(...at)) : HEX_OF[at];

// Columns that join during the campaign (Whish's division from Multan, say)
// march in at the start of their side's command on their round, filling the
// nearest hexes with room.
// Every formation needs its own id; reinforcements and levies continue the
// count past the highest one on the board (older saves never kept a counter).
function nextUnitId(side) {
  S.seq = Math.max(S.seq || 0, ...S.units.map(u => +u.id.slice(1) || 0)) + 1;
  return `${side[0]}${S.seq}`;
}
function arrive() {
  (SCN.reinforcements || []).forEach((r, i) => {
    if (r.side !== S.turn || r.round !== S.round || S.arrived?.[i]) return;
    (S.arrived ||= {})[i] = true;
    const at = hexOfStop(r.at);
    for (const [variant, name, figures] of r.units) {
      const hex = roomNear(at, r.side);
      if (hex >= 0) S.units.push(makeUnit(r.side, variant, hex, nextUnitId(r.side), name, figures));
    }
    log(r.side, `<b>${r.name}</b> ${r.note || 'joined the army'}.`);
    UI.flash(`${r.name.toUpperCase()} ARRIVES`, r.side);
  });
}
function roomNear(start, side) {
  const seen = new Set([start]), queue = [start];
  while (queue.length) {
    const h = queue.shift(), here = unitsAt(h);
    if (here.length < STACK_LIMIT && !here.some(u => u.side !== side)) return h;
    for (const n of HEXES[h].nbr) if (n >= 0 && !seen.has(n)) { seen.add(n); queue.push(n); }
  }
  return -1;
}

// Scripted happenings at the start of a round (Multan's magazine, say):
// walls change by `walls`, formations at `hurt.at` lose `hurt.hp` each, those named
// in `defect.names` go over to `defect.to`, and those named in `depart` leave.
function happen() {
  if (S.turn !== FIRST) return;
  (SCN.events || []).forEach((ev, i) => {
    if (ev.round !== S.round || S.happened?.[i]) return;
    (S.happened ||= {})[i] = true;
    for (const [k, d] of Object.entries(ev.walls || {})) S.walls[k] = Math.max(0, (S.walls[k] || 0) + d);
    if (ev.hurt) for (const u of [...unitsAt(HEX_OF[ev.hurt.at])]) u.hp = Math.max(1, u.hp - ev.hurt.hp);
    // Formations that change sides (never the one a general rides with), and
    // ones that march off the map altogether.
    if (ev.defect) for (const u of S.units) if (ev.defect.names.includes(u.name) && u.side !== ev.defect.to && !ledBy(u)) { u.side = ev.defect.to; u.stock = 100; }
    if (ev.depart) S.units = S.units.filter(u => !ev.depart.includes(u.name) || ledBy(u));
    log(ev.side || FIRST, `<b>${ev.text}</b>`);
    UI.flash(ev.flash || ev.text.toUpperCase(), ev.side || FIRST);
  });
}

function startTurn() {
  happen();
  arrive();
  checkMines();
  for (const u of S.units) if (u.side === S.turn) { u.mp = fullMp(u); u.attacked = false; u.moved = false; }
  Object.assign(S.generals[S.turn], { rode: false, forced: false });
  S.undo = null; S.selected = null;
  // Keyframe for replays: the board as this command begins. The events noted
  // after it (marches, fights, captures) carry the board to the next one.
  S.frames.push({ ev: S.events.length, turnNo: S.turnNo, board: boardSnapshot() });
}
const boardSnapshot = () => JSON.parse(JSON.stringify({
  round: S.round, turn: S.turn, units: S.units, owners: S.owners, forts: S.forts, allies: S.allies,
  levied: S.levied, vp: S.vp, generals: S.generals, walls: S.walls, battered: S.battered || {}, kacha: S.kacha || {}, mines: S.mines || {},
}));

async function endTurn() {
  if (S.winner) return;
  const side = S.turn, zoc = enemyZoc(side);
  // Formations that held still away from the enemy recover soldiers; the
  // general's presence brings stragglers back faster.
  for (const u of S.units) if (u.side === side && !u.moved && !u.attacked && u.hp < maxHp(u) && !zoc[u.hex] && stockOf(u) >= STOCK_HUNGRY) {
    const gain = Math.min(maxHp(u) - u.hp, nearGeneral(u) ? 2 : 1);
    u.hp += gain;
    log(side, `${u.name} rested and rallied +${men(gain)} (${men(u.hp)}).`);
  }
  // The day's rations are eaten and the wagons that can reach each formation
  // refill it. Below 20% men start to desert.
  for (const u of [...S.units]) if (u.side === side) {
    // A garrison shut up in a besieged fort or walled town lives on its
    // magazines: half rations, so it starves over a week or two, not days.
    const before = stockOf(u), got = delivery(u), shut = settlementDef(u.hex) >= SETTLEMENT_DEF.town && besieged(u.hex, side);
    u.stock = Math.max(0, Math.min(100, Math.round(before + (got - STOCK_USE / (shut ? 2 : 1)) * dayShare())));
    if (before >= STOCK_HUNGRY && u.stock < STOCK_HUNGRY) log(side, `${u.name} is going hungry: its wagons cannot keep up (${u.stock}% supplies).`);
    if (u.stock >= STOCK_DESERT) continue;
    u.hp--;
    log(side, `${u.name} is starving and losing men to desertion (${men(Math.max(0, u.hp))} left, ${u.stock}% supplies).`);
    if (u.hp <= 0) {
      S.units = S.units.filter(v => v !== u);
      log(side, `${u.name} melted away for want of supply.`);
      if (S.generals[side].unitId === u.id && !S.generals[side].captured) captureGeneral(side);
    }
  }
  // Local chiefs side with whoever holds their seat.
  for (const [hex, powerId] of SEAT_HEX) {
    const here = unitsAt(hex);
    if (!here.length || here.some(u => u.side !== side) || S.allies[powerId] === side) continue;
    const power = POWER_BY_ID[powerId];
    S.allies[powerId] = side;
    log(side, `<b>${power.name}</b> pledged their levies to the ${SIDES[side].name}.`);
    UI.flash(`${power.name.toUpperCase()} JOINS`, side);
    if (!S.levied[powerId] && unitsAt(hex).length < STACK_LIMIT) {
      S.levied[powerId] = true;
      S.units.push(makeUnit(side, power.levy.variant, hex, nextUnitId(side), power.levy.name));
      log(side, `${power.levy.name} rode in to join the column at ${placeName(hex)}.`);
    }
  }
  // Strongpoints score once both sides have moved, so a capture can be
  // answered before it pays out.
  S.roundEnded = other(side) === FIRST;
  if (other(side) === FIRST) for (const s of [FIRST, other(FIRST)]) {
    const held = STRONGPOINTS.filter(k => S.owners[k] === s).length;
    if (held) { S.vp[s] += held; if (Number.isFinite(VP_TARGET)) log(s, `${held} strongpoint${held === 1 ? '' : 's'} held at the end of round ${S.round}: <b>+${held} war points</b> (${S.vp[s]}/${VP_TARGET}).`); }
  }
  if (checkVictory()) { save(); UI.refresh(); return; }
  S.turnNo++;
  closeBattles();
  S.turn = other(side);
  if (S.turn === FIRST) S.round++;
  if (S.round > ROUND_LIMIT && SCN.goal) {
    const g = SCN.goal, holder = goalMet(g.attacker) ? g.attacker : other(g.attacker);
    declareWinner(holder, holder === g.attacker ? g.attackerWins : g.defenderWins);
    save(); UI.refresh(); return;
  }
  if (S.round > ROUND_LIMIT) {
    // Ties go to whoever holds more strongpoints, then whoever has more men left.
    const score = s => [S.vp[s], STRONGPOINTS.filter(k => S.owners[k] === s).length, S.units.filter(u => u.side === s).reduce((n, u) => n + u.hp, 0)];
    const a = score('azure'), r = score('red'), k = a.findIndex((v, i) => v !== r[i]);
    const w = k < 0 ? 'draw' : a[k] > r[k] ? 'azure' : 'red';
    const why = k <= 0 ? '' : k === 1 ? ' Level on points, it is decided by the strongpoints held.' : ' Level on points and strongpoints, it is decided by the men still under arms.';
    declareWinner(w, `The campaigning season ends after ${ROUND_LIMIT} rounds. War points ${S.vp.azure}–${S.vp.red}.${why}`);
    save(); UI.refresh(); return;
  }
  startTurn();
  log(S.turn, `${SCN.clock ? roundName() : `Round ${S.round}`}: the ${SIDES[S.turn].name} takes the initiative.${SCN.clock && isNight() && !isNight(S.round - (S.turn === FIRST ? 1 : 0)) ? ' Night has fallen.' : ''}`);
  save();
  UI.refresh();
  UI.banner();
  if (S.ai[S.turn]) await runAI(S.turn);
}

function declareWinner(side, reason) {
  S.winner = side;
  closeBattles(true);
  UI.victory(side, reason);
}
// A scenario's goal is one fort, or `need` of several `forts`, that the
// attacker must hold at the end of a round; with `general`, taking the
// defending general wins as well.
const goalForts = () => SCN.goal ? SCN.goal.forts || [SCN.goal.fort] : [];
const goalMet = side => goalForts().length > 0 && goalForts().filter(k => S.owners[k] === side).length >= (SCN.goal.need || goalForts().length);
// An escape goal: the side wins once `need` of its soldiers (figures) stand
// on the ground of `power` at the end of its command, out of the enemy's reach.
const escapeGoal = () => SCN.goal?.escape || null;
const escaped = side => escapeGoal()?.side === side ? S.units.filter(u => u.side === side && HEXES[u.hex].territory === escapeGoal().power).reduce((n, u) => n + u.hp, 0) : 0;

function checkVictory() {
  if (S.winner) return true;
  const g = SCN.goal;
  if (g && goalMet(g.attacker) && S.roundEnded) { declareWinner(g.attacker, g.attackerWins); return true; }
  // Some goals also fall to the attacker if the defending general is taken.
  if (g && g.general && S.generals[other(g.attacker)].captured) { declareWinner(g.attacker, g.generalWins); return true; }
  if (g?.escape && S.turn === g.escape.side && escaped(g.escape.side) >= g.escape.need) { declareWinner(g.escape.side, g.escapeWins); return true; }
  const lead = S.vp.azure === S.vp.red ? null : S.vp.azure > S.vp.red ? 'azure' : 'red';
  if (lead && S.vp[lead] >= VP_TARGET) { declareWinner(lead, `${S.vp[lead]} war points to ${S.vp[other(lead)]}: the forts and ghats of the Jhelum answer to the ${SIDES[lead].name}.`); return true; }
  for (const side of ['azure', 'red']) {
    // (Not in a scenario with a fort to take: there one side may start out holding them all.)
    if (!g && STRONGPOINTS.every(k => S.owners[k] === side)) { declareWinner(side, 'Every strongpoint flies its standard.'); return true; }
    if (!S.units.some(u => u.side === other(side))) { declareWinner(side, `The ${SIDES[other(side)].name} has broken and scattered.`); return true; }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Computer opponent
//
// Each formation scores every hex it can reach: the value of standing there
// (objectives, cover, distance to its goals, danger) plus the best attack it
// could make from there (expected soldiers struck down minus those risked).

function aiGoalField(side) {
  const sources = [], esc = escapeGoal();
  // A side making its escape heads for the ground it must reach; the other hunts it.
  if (esc?.side === side) { HEXES.forEach((h, i) => { if (h.territory === esc.power) sources.push([i, 0]); }); return costField(sources).dist; }
  if (esc) for (const u of believedEnemies(side)) sources.push([u.hex, 0]);
  // Nearest objectives first: each one taken becomes a depot for the next.
  // Where only some of several goals must be held, walls count as distance:
  // the easier ones are worth taking first.
  const g = SCN.goal, pick = g && g.attacker === side && g.need && g.need < goalForts().length;
  for (const k of STRONGPOINTS) if (S.owners[k] !== side) sources.push([HEX_OF[k], pick && goalForts().includes(k) ? (S.walls?.[k] || 0) * 4 : 0]);
  for (const [hex, id] of SEAT_HEX) if (S.allies[id] !== side) sources.push([hex, 2]);
  for (const k of FORTS) if (S.forts[k] !== side) sources.push([HEX_OF[k], 6]);
  for (const u of believedEnemies(side)) sources.push([u.hex, 7]);
  return costField(sources).dist;
}

// Weighted count of enemy formations that could strike each hex within `turns`
// commands, from each enemy's real march reach (our zones of control apply).
function aiThreat(side, turns = 1) {
  const threat = new Float32Array(HEXES.length);
  for (const e of believedEnemies(side)) if (!wavering(e)) {
    const v = VARIANTS[e.variant], saved = e.mp;
    e.mp = fullMp(e) * turns;
    const reach = reachable(e);
    e.mp = saved;
    const hit = new Uint8Array(HEXES.length), w = v.atk / 4 * (0.4 + 0.6 * e.hp / MAX_HP);
    for (const from of [e.hex, ...reach.cost.keys()]) for (const h of rangeHexes(from, v.range)) hit[h] = 1;
    for (let i = 0; i < hit.length; i++) if (hit[i]) threat[i] += w;
  }
  return threat;
}
function rangeHexes(center, radius) {
  const out = [], C = HEXES[center];
  for (let dq = -radius; dq <= radius; dq++) for (let dr = Math.max(-radius, -dq - radius); dr <= Math.min(radius, -dq + radius); dr++) {
    const o = offsetOf(C.q + dq, C.ar + dr), id = hexId(o.c, o.r);
    if (id >= 0) out.push(id);
  }
  return out;
}

// Where taking the defending general decides the campaign, the defender's
// AI treats his formation as the one thing it cannot lose.
const preciousGeneral = u => !!SCN.goal?.general && u.side !== SCN.goal.attacker && ledBy(u);

function aiStrikeValue(u, f) {
  const weak = u.hp <= 2;
  let value = f.expDef * 2.2 + f.pBreak * 3 + f.pKill * 5 - f.expAtt * (weak ? 4 : 2.5) - f.pAttBreak * 2;
  if (STRONG_HEX.has(f.def.hex)) value += f.expDef * 0.8;
  if (ledBy(f.def)) value += f.pKill * 8;          // a chance to take the enemy general
  if (ledBy(u)) value -= f.pAttKill * (preciousGeneral(u) ? 40 : 15);   // never gamble our own
  // Sieges: guns that can bring a wall down are worth firing even at long odds,
  // and an attacker racing the season presses harder on the fort that decides it.
  const place = HEXES[f.def.hex].place;
  if (VARIANTS[u.variant].type === 'guns' && fortLevels(f.def.hex) > 0) value += (f.hit + f.rout) * 3 + (S.walls?.[place] > 0 ? (f.hit + f.rout) + 1 : 0.6);
  if (SCN.goal && u.side === SCN.goal.attacker) {
    if (goalForts().includes(place)) value += (f.hit + f.rout) * 2.5;
    value *= 1 + S.round / ROUND_LIMIT;
  }
  return value;
}

// Every hex of a walled place the enemy holds (all of a great city's
// footprint), or where enemy troops behind works were seen or last seen.
const WORKS = { key: '', hexes: [] };
function enemyWorks(side) {
  const key = `${side}|${S.turnNo}|${JSON.stringify(S.owners)}|${JSON.stringify(S.forts)}|${Object.keys(S.kacha || {}).join(',')}`;
  if (WORKS.key !== key) {
    const held = new Set(believedEnemies(side).map(e => e.hex)), out = [];
    for (const h of HEXES) {
      if (fortLevels(h.id) < 2) continue;
      const k = h.place, owner = k && (STRONGPOINTS.includes(k) ? S.owners[k] : FORTS.includes(k) ? S.forts[k] : null);
      if (held.has(h.id) || owner && owner !== side) out.push(h.id);
    }
    WORKS.key = key; WORKS.hexes = out;
  }
  return WORKS.hexes;
}

function aiPlan(u, goal, threat, garrisoned, looming, supply) {
  const v = VARIANTS[u.variant], reach = reachable(u), here = u.hex, zoc = enemyZoc(u.side);
  const friendsAt = hex => unitsAt(hex).filter(f => f.side === u.side && f !== u).length;
  // A threatened strongpoint we hold always keeps one formation in it; the
  // first formation planned there claims the duty and the rest are free.
  const key = STRONG_HEX.get(here);
  // The fort a scenario turns on is never left empty by its defenders: it
  // keeps a full garrison of foot or guns (horse holds it only if nothing
  // else is there).
  const vital = SCN.goal && goalForts().includes(key) && u.side !== SCN.goal.attacker;
  const holders = unitsAt(here).filter(f => f.side === u.side && VARIANTS[f.variant].type !== 'horse').length;
  const vitalDuty = vital && (VARIANTS[u.variant].type !== 'horse' || !holders) && (garrisoned.get(here) || 0) < STACK_LIMIT;
  // A side making its escape holds nothing: it only wants to be gone.
  const fleeing = escapeGoal()?.side === u.side;
  const garrison = !fleeing && key && S.owners[key] === u.side && !wavering(u) && (vitalDuty || (looming[here] > 0 && !garrisoned.has(here)));
  const options = garrison || u.post || u.mp <= 0 ? [here] : [here, ...reach.cost.keys()];
  const foes = knownEnemies(u.side), walledEnemy = [...new Set(foes.map(e => e.hex))].filter(h => fortLevels(h) >= 2);
  const works = v.type === 'guns' && v.range > 1 ? enemyWorks(u.side) : [];
  const precious = preciousGeneral(u);
  const fragile = (u.hp <= 2 ? 1.8 : 1) * (precious ? 6 : ledBy(u) ? 2.5 : 1);
  let best = null;
  // An attacker racing the clock presses harder as the days run out: its
  // objectives pull more and the danger of the enemy's reach counts for less.
  const late = SCN.goal && u.side === SCN.goal.attacker ? Math.min(1, S.round / ROUND_LIMIT) : 0;
  const pull = 1 + 0.5 * late, nerve = 1 - 0.4 * late;
  for (const hex of options) {
    const h = HEXES[hex], cover = TERRAIN[h.terrain].def + (h.cover ? 1 : 0) + fortLevels(hex);
    let score = -goal[hex] * (wavering(u) ? 0.2 : 0.9 * pull);
    if (!Number.isFinite(score)) score = -999;
    const sk = fleeing ? undefined : STRONG_HEX.get(hex);
    if (sk && S.owners[sk] !== u.side) score += 14;
    else if (sk && threat[hex] > 0 && !garrisoned.has(hex)) score += hex === here ? 5 : 9;
    // Foot and guns are drawn back into an under-garrisoned objective.
    if (sk && SCN.goal && goalForts().includes(sk) && u.side !== SCN.goal.attacker && S.owners[sk] === u.side && v.type !== 'horse'
        && unitsAt(hex).filter(f => f.side === u.side && f !== u && VARIANTS[f.variant].type !== 'horse').length < STACK_LIMIT) score += 12;
    // Siege lines. Guns that fire at range batter the walls from as far off as
    // they reach, measured from every hex the enemy's works cover, and never
    // stand against them (the walls' fire and a sally would wreck them).
    // Swivels and wall pieces must close to the next hex to fire. Foot keep
    // out of the batteries' ring.
    if (v.type === 'guns' && v.range > 1 && works.length) {
      const d = Math.min(...works.map(w => hexDistance(hex, w)));
      if (d <= 1) score -= 14; else if (d === v.range) score += 9;
    } else {
      const ring = v.type === 'guns' ? v.range : 2, battering = walledEnemy.some(w => hexDistance(hex, w) === ring);
      if (battering) score += v.type === 'guns' ? 5 : -4;
    }
    const seat = SEAT_HEX.get(hex);
    if (seat && S.allies[seat] !== u.side) score += 9;
    score += cover * 0.8;
    // Stay where the wagons can reach; a formation running low heads back to them.
    const fed = deliveryFor(supply[hex] / WAGON_MP), need = stockOf(u) < 45 ? 3 : 1;
    score += (Math.min(fed, 30) - STOCK_USE) * 0.22 * need;
    // Only so many formations can strike one hex in a day: danger saturates.
    score -= Math.min(threat[hex], 4) * Math.max(0.3, 1 - cover * 0.12) * (v.type === 'guns' ? 2.2 : 1.1) * fragile * nerve;
    if (v.type === 'guns' && v.range > 1 && foes.some(e => hexDistance(e.hex, hex) === 1)) score -= 6;
    if (precious && foes.some(e => hexDistance(e.hex, hex) === 1)) score -= 12;
    score -= friendsAt(hex) * 0.6;
    // Standing still out of contact rallies a worn formation.
    if (hex === here && !u.moved && u.hp < maxHp(u) && !zoc[hex]) score += 1.6 * Math.min(2, maxHp(u) - u.hp) * (nearGeneral(u) ? 1.5 : 1);
    // Strikes it can make today, and ones it is setting up for tomorrow: a
    // formation that closes in with too little march left to attack can hit
    // next day from where it stands, steadier for having held its ground.
    let strike = null, setup = 0;
    if (!u.attacked) for (const t of foes) {
      if (t.side === u.side) continue;
      const left = u.mp - (hex === here ? 0 : reach.cost.get(hex)), full = fullMp(u);
      const now = canStrike(u, hex, t, left);
      if (!now && !canStrike(u, hex, t, full)) continue;
      const savedHex = u.hex, savedMoved = u.moved; u.hex = hex;
      if (!now) u.moved = false;
      const value = aiStrikeValue(u, forecast(u, hex, t, now ? left : full));
      u.hex = savedHex; u.moved = savedMoved;
      if (!now) { setup = Math.max(setup, value * 0.6); continue; }
      if (value > 1.2 && (!strike || value > strike.value)) strike = { target: t, value };
    }
    const total = score + (strike ? strike.value * 1.6 : setup > 1.2 ? setup : 0);
    if (!best || total > best.total) best = { hex, strike, total };
  }
  return { ...best, reach };
}

// The general rides to whichever formation within reach is best placed to fight.
async function aiGeneral(side) {
  const lead = generalUnit(side);
  if (!lead || S.generals[side].rode) return;
  // A general whose capture loses the campaign rides to the fort instead.
  const foes = knownEnemies(side), safe = preciousGeneral(lead), near = (u, d) => foes.some(e => hexDistance(e.hex, u.hex) <= d);
  const worth = safe
    ? u => (goalForts().includes(STRONG_HEX.get(u.hex)) ? 8 : 0) + u.hp * 0.6 - (near(u, 2) ? 6 : 0) - (VARIANTS[u.variant].type === 'guns' ? 2 : 0)
    : u => VARIANTS[u.variant].atk + u.hp * 0.6 + (near(u, 3) ? 2.5 : 0)
      - (VARIANTS[u.variant].type === 'guns' ? 3 : 0) - (wavering(u) ? 6 : 0) - (u.hp <= 2 ? 3 : 0);
  const best = S.units.filter(u => u.side === side && hexDistance(u.hex, lead.hex) <= GENERAL_RIDE).sort((a, b) => worth(b) - worth(a))[0];
  if (best && best !== lead && worth(best) > worth(lead) + 1.5) { await UI.focus(best.hex); rideTo(best); }
}

// Build the one ferry where crossing would shorten the road to our goals most.
// A formation may march to the bank first and build there the same day.
async function aiFerry(side) {
  if (S.ferryBuilt[side] || S.round < 2) return;
  if (escapeGoal() && escapeGoal().side !== side) return;  // the hunters do not open a way across for the hunted
  const goal = aiGoalField(side);
  let best = null;
  for (const u of S.units) {
    if (u.side !== side || u.attacked || u.hp <= FERRY_COST + 2 || !isFoot(u)) continue;
    const reach = reachable(u);
    for (const hex of [u.hex, ...reach.cost.keys()]) {
      if (S.units.some(v => v.hex === hex && v !== u)) continue;
      const h = HEXES[hex];
      h.nbr.forEach((across, dir) => {
        if (across < 0 || h.river[dir] !== 'major' || S.units.some(v => v.hex === across)) return;
        const gain = goal[hex] - goal[across] - (reach.cost.get(hex) || 0) * 0.3;
        if (Number.isFinite(gain) && (!best || gain > best.gain)) best = { u, hex, across, gain, reach };
      });
    }
  }
  if (!best || best.gain < 6) return;
  await UI.focus(best.u.hex);
  if (best.hex !== best.u.hex) await moveUnit(best.u, best.hex, best.reach);
  buildFerry(best.u, best.across);
}

async function runAI(side) {
  UI.refresh();
  await aiGeneral(side);
  await aiFerry(side);
  let dug = 0;
  for (let pass = 0; pass < 2 && !S.winner; pass++) {
    const goal = aiGoalField(side), threat = aiThreat(side), looming = aiThreat(side, 2), garrisoned = new Map(), supply = supplyField(side);
    const order = S.units.filter(u => u.side === side)
      .map(u => ({ u, d: Math.min(...believedEnemies(side).map(e => hexDistance(u.hex, e.hex)), 99) }))
      // Guns go first, so they take the firing positions before the foot
      // crowd them (and soften the enemy for the assault); then nearest first.
      .sort((a, b) => (VARIANTS[b.u.variant].type === 'guns') - (VARIANTS[a.u.variant].type === 'guns') || a.d - b.d).map(x => x.u);
    for (const u of order) {
      if (S.winner || !S.units.includes(u) || u.attacked) continue;
      let plan = null;
      if (pass === 1 && u.mp <= 0) {
        // A spent formation near the general may be driven on by a forced march.
        if (!canForce(u)) { if (!targetsFrom(u).length) continue; }
        else {
          u.mp = fullMp(u);
          const pushed = aiPlan(u, goal, threat, garrisoned, looming, supply);
          u.mp = 0;
          if (pushed.strike && pushed.strike.value > 3 || STRONG_HEX.has(pushed.hex) && S.owners[STRONG_HEX.get(pushed.hex)] !== side) { forcedMarch(u); plan = aiPlan(u, goal, threat, garrisoned, looming, supply); }
          else if (!targetsFrom(u).length) continue;
        }
      }
      plan ??= aiPlan(u, goal, threat, garrisoned, looming, supply);
      if (STRONG_HEX.has(plan.hex)) garrisoned.set(plan.hex, (garrisoned.get(plan.hex) || 0) + 1);
      // One formation a day digs in where it is staying put with the enemy two
      // days off: on an unwalled strongpoint, or covering its own siege guns.
      const worthDigging = STRONG_HEX.has(u.hex) || VARIANTS[u.variant].type === 'guns' && knownEnemies(side).some(e => hexDistance(e.hex, u.hex) <= 2 && fortLevels(e.hex) > 0);
      if (pass === 0 && plan.hex === u.hex && !plan.strike && !dug && worthDigging && looming[u.hex] > 0 && canFortify(u)) { await UI.focus(u.hex); fortify(u); dug++; continue; }
      // A garrison with a mine under it countermines unless it has a good blow to strike.
      if (pass === 0 && canCountermine(u) && (!plan.strike || plan.strike.value < 3)) { await UI.focus(u.hex); countermine(u); continue; }
      // Foot already at the walls with nothing better to strike mines them.
      if (pass === 0 && plan.hex === u.hex && (!plan.strike || plan.strike.value < 1.5) && canMine(u) && (galleryAt(side, u.hex) || fortLevels(mineTarget(u)) >= MINE_LEVELS)) { await UI.focus(u.hex); digMine(u); continue; }
      if (plan.hex !== u.hex) {
        await UI.focus(u.hex);
        await moveUnit(u, plan.hex, plan.reach);
      }
      if (plan.strike && S.units.includes(u) && S.units.includes(plan.strike.target) && canStrike(u, u.hex, plan.strike.target)) {
        await UI.focus(plan.strike.target.hex);
        await attack(u, plan.strike.target);
      }
    }
  }
  if (!S.winner && S.turn === side) await endTurn();
}
