'use strict';
// Interface: input, panels, tooltip, minimap, animation and dialogs.

const V = { reach: null, targets: [], farTargets: [], hoverHex: -1, pendingHex: -1, peek: -1, animating: null, busy: false, followAI: true, speed: 1 };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pct = p => `${Math.round(p * 100)}%`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const humanTurn = () => S && !S.winner && !S.ai[S.turn] && !V.busy;

// ---------------------------------------------------------------------------
// Refresh

function refresh() {
  ACT_CACHE = new Map();
  const sel = S.selected && unitById(S.selected);
  if (sel && sel.side === S.turn && humanTurn()) {
    V.reach = sel.mp > 0 ? reachable(sel) : null;
    V.targets = sel.attacked ? [] : targetsFrom(sel);
    V.farTargets = [];
    if (V.reach && !sel.attacked) {
      const near = new Set(V.targets.map(t => t.hex));
      for (const e of S.units) if (e.side !== sel.side && !near.has(e.hex) && strikeHexFor(sel, e) !== null) { near.add(e.hex); V.farTargets.push(e); }
    }
  } else { V.reach = null; V.targets = []; V.farTargets = []; if (sel && sel.side !== S.turn) S.selected = sel.id; }
  R.peek = V.peek;
  syncUnits(V.animating);
  syncActions();
  drawMarkers();
  layoutLabels();
  redrawOverlay();
  renderPanels();
  drawMinimap();
}

function redrawOverlay() {
  const sel = S.selected && unitById(S.selected);
  let path = null, cost = '';
  if (sel && V.reach && V.hoverHex >= 0) {
    const enemy = S.units.find(e => e.side !== sel.side && e.hex === V.hoverHex);
    if (V.reach.cost.has(V.hoverHex)) { path = pathTo(V.reach, sel.hex, V.hoverHex); cost = V.reach.cost.get(V.hoverHex); }
    else if (enemy && !V.targets.includes(enemy)) {
      const from = strikeHexFor(sel, enemy);
      if (from !== null) { path = pathTo(V.reach, sel.hex, from); cost = V.reach.cost.get(from); }
    }
  }
  const showSel = sel && (sel.side === S.turn && humanTurn() || !humanTurn());
  R.view.classList.toggle('selecting', !!(showSel && V.reach));
  drawOverlay(showSel ? sel : null, showSel ? V.reach : null, showSel ? [...V.targets, ...V.farTargets] : [], path, cost, V.ferryPick, V.showSupply ? (!S.ai[S.turn] ? S.turn : S.player) : null);
  R.overlay.querySelectorAll('.target-ring').forEach((ring, i) => { if (i >= V.targets.length) ring.classList.add('far'); });
}

// Best hex to strike `enemy` from after marching: prefer cover and short marches.
function strikeHexFor(u, enemy) {
  if (!V.reach) return null;
  let best = null;
  for (const [hex, cost] of V.reach.cost) {
    if (!canStrike(u, hex, enemy, u.mp - cost)) continue;
    const h = HEXES[hex], dirRiver = hexDistance(hex, enemy.hex) === 1 ? HEXES[hex].river[dirTo(hex, enemy.hex)] : null;
    const score = TERRAIN[h.terrain].def + settlementDef(hex) - cost * 0.3 - (dirRiver ? 2 : 0);
    if (!best || score > best.score) best = { hex, score };
  }
  return best ? best.hex : null;
}

// ---------------------------------------------------------------------------
// Panels

function renderPanels() {
  const side = S.turn, ready = S.units.filter(u => u.side === side && canActCached(u)).length, total = S.units.filter(u => u.side === side).length;
  document.body.dataset.turn = side;
  $('#roundNo').textContent = S.round;
  $('#roundMax').textContent = ROUND_LIMIT;
  $('#roundWhen').textContent = SCN.clock ? `${roundName().replace(', ', ' · ')}${isNight() ? ' ☾' : ''}` : 'Round';
  const esc0 = escapeGoal();
  if (esc0) $('#goalText').title = `${men(escaped(esc0.side))} of ${men(esc0.need)} across`;
  for (const s of ['azure', 'red']) {
    $(`#name-${s}`).textContent = SIDES[s].name;
    $(`#vp-${s}`).textContent = S.vp[s];
    $(`#vpbar-${s}`).style.width = `${Math.min(100, S.vp[s] / VP_TARGET * 100)}%`;
    $(`#held-${s}`).textContent = `+${STRONGPOINTS.filter(k => S.owners[k] === s).length}/round`;
  }
  $('#goalText').textContent = SCN.goal ? SCN.goal.short : `First to ${VP_TARGET}`;
  $('#turnName').textContent = SIDES[side].name;
  $('#turnSub').textContent = S.replay ? 'Replay' : S.winner ? 'Campaign decided' : S.ai[side] ? 'Computer is moving…' : `${ready} of ${total} formations can act`;
  const human = humanTurn();
  $('#endTurnBtn').disabled = !human;
  $('#nextBtn').disabled = !human || !ready;
  const sel = S.selected && unitById(S.selected);
  $('#undoBtn').disabled = !human || !S.undo;
  renderGeneral();
  renderInspector();
  renderRoster();
  renderObjectives();
  renderPowers();
  renderBattles();
  renderLog();
}

// The general's card: who he leads and his two once-per-command orders.
function renderGeneral() {
  const side = !S.ai[S.turn] ? S.turn : S.player, g = S.generals[side], info = GENERALS[side], lead = generalUnit(side);
  const sel = S.selected && unitById(S.selected), human = humanTurn() && side === S.turn;
  const card = $('#generalCard');
  card.dataset.side = side;
  card.classList.toggle('captured', g.captured);
  $('#genPortrait').innerHTML = generalPortrait(side);
  $('#genName').textContent = info.name;
  $('#genTitle').textContent = info.title;
  $('#genLeads').innerHTML = g.fallen ? 'Killed — his orders are lost' : g.captured ? 'Taken prisoner — his orders are lost'
    : `Leading the <button class="link" id="genJump">${esc(lead.name)}</button>${placeName(lead.hex) ? ` at ${esc(placeName(lead.hex))}` : ''}`;
  const ride = $('#rideBtn'), force = $('#forceBtn');
  const rideOk = human && sel && canRide(side, sel), forceOk = human && sel && canForce(sel);
  ride.disabled = !rideOk;
  ride.title = g.fallen ? 'The general is dead' : g.captured ? 'The general is captured' : g.rode ? 'He has already ridden this command' : `Select a formation within ${GENERAL_RIDE} hexes of him, then press G`;
  ride.querySelector('span').textContent = rideOk ? `Lead ${sel.name}` : g.rode ? 'Already rode' : 'Ride to…';
  force.disabled = !forceOk;
  force.title = g.fallen ? 'The general is dead' : g.captured ? 'The general is captured' : g.forced ? 'Forced march already ordered this command' : `Select a formation within ${GENERAL_REACH} hexes of him that has not fought, then press F: its march is refilled`;
  force.querySelector('span').textContent = g.forced ? 'March ordered' : 'Force march';
  card.title = `G: ride to the selected formation and lead it (once per command, within ${GENERAL_RIDE} hexes). F: forced march for a formation within ${GENERAL_REACH} hexes.`;
  const jump = $('#genJump');
  if (jump) jump.onclick = () => { if (humanTurn() && lead.side === S.turn) select(lead.id); flyTo(HEXES[lead.hex].x, HEXES[lead.hex].y, Math.max(R.cam.z, 0.75)); };
}
function generalPortrait(side) {
  const p = PALETTE[side], lead = S.units.find(u => u.id === S.generals[side]?.unitId), std = lead && standardOf(lead);
  const flag = std ? standardSvg(std, 9, 7, 20, 12, '#f2d27c', 1.2)
    : `<path d="M9 7h20l-5 6 5 6H9z" fill="${p.flag}" stroke="#f2d27c" stroke-width="1.2"/><path d="M16.5 10l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z" fill="#fff3c4"/>`;
  return `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 47V6" stroke="${INK}" stroke-width="2.4"/><path d="M8 47V6" stroke="#e8c46a" stroke-width="1.2"/>${flag}<circle cx="8" cy="5" r="2.2" fill="#f2d27c"/><g transform="translate(29 46) scale(1.75)">${riderFigure('Irregular Sowars', { ...p, turban: '#f2d27c' }, '#e9e1d2')}</g></svg>`;
}

function statBlock(u) {
  const v = VARIANTS[u.variant];
  return `<div class="stats"><div><small>March</small><b>${u.side === S.turn ? `${u.mp}<span>/${fullMp(u)}</span>` : fullMp(u)}</b></div><div><small>Attack</small><b>${v.atk}</b></div><div><small>Defence</small><b>${v.def}</b></div><div><small>Range</small><b>${rangeOf(u.variant)}</b></div></div>`;
}
function pipsHtml(hp, max = MAX_HP) { return `<span class="hp-pips${hp < max * WAVER_BELOW ? ' low' : ''}" title="${men(hp)} of ${men(max)}">${Array.from({ length: max }, (_, i) => `<i class="${i < hp ? 'on' : ''}"></i>`).join('')}</span>`; }

function renderInspector() {
  const box = $('#inspector'), sel = S.selected && unitById(S.selected);
  const hex = V.hoverHex >= 0 ? V.hoverHex : sel ? sel.hex : -1;
  let html = '';
  if (sel) {
    const v = VARIANTS[sel.variant], status = wavering(sel) ? 'Wavering — cannot attack until it rallies' : sel.side !== S.turn ? 'Awaiting its command' : sel.attacked ? (sel.mp > 0 ? 'Has fought — may still march' : 'Has fought this round') : sel.mp <= 0 ? 'March spent' : sel.moved ? 'On the march' : 'Ready for orders';
    html += `<div class="unit-card ${sel.side}"><div class="unit-badge ${sel.side}">${unitPortrait(sel, 'portrait')}</div><div><small>${SIDES[sel.side].name} · ${TYPE_NAME[v.type]}</small><h2>${esc(sel.name)}</h2><p>${pipsHtml(sel.hp, maxHp(sel))} ${men(sel.hp)}</p><p class="${wavering(sel) ? 'warn' : ''}">${status}</p></div></div>${statBlock(sel)}<p class="trait">${v.trait}</p>`;
    const st = stockOf(sel), days = wagonDays(sel.side, sel.hex), got = deliveryFor(days), net = got - STOCK_USE;
    const level = st < STOCK_DESERT ? 'cut' : st < STOCK_HUNGRY ? 'warn' : 'ok';
    const effect = st < STOCK_DESERT ? `starving: −2 attack, −1 defence, losing ${men(1)} every command` : st < STOCK_HUNGRY ? 'hungry: −1 attack, −1 defence, cannot rally' : st < STOCK_SHORT ? 'short: −1 attack' : 'well supplied';
    html += `<div class="supply-card ${level}"><div class="supply-top"><b>Supplies ${st}%</b><span>${effect}</span></div><div class="supply-bar"><i style="width:${st}%"></i><em style="left:${STOCK_DESERT}%"></em><em style="left:${STOCK_HUNGRY}%"></em></div>`
      + `<small>${Number.isFinite(days) ? `Wagons need ${days < 0.05 ? 'no time — at the depot' : `${days.toFixed(1)} day${days >= 1.05 ? 's' : ''}`} to reach it: +${got}% a day against −${STOCK_USE}% eaten (${net >= 0 ? '+' : ''}${net}%).` : 'No wagons can reach it: the road is cut or there is no friendly depot. −20% a day.'}</small></div>`;
    if (ledBy(sel)) html += `<p class="led-note">★ Led by ${GENERALS[sel.side].name}: +1 attack, +1 defence, never falls back.</p>`;
    if (humanTurn() && canFortify(sel)) html += `<button class="ferry-btn" id="fortifyBtn"><b>Dig a kacha fort here (K)</b><small>Takes this formation's whole day · mud wall and ditch, +${KACHA_DEF} defence · guns wear it down</small></button>`;
    if (humanTurn() && canCountermine(sel)) { const [, m] = enemyGallery(sel); html += `<button class="ferry-btn" id="mineBtn"><b>Countermine (M)</b><small>The enemy has dug ${m.days} of ${MINE_DAYS} days towards these works · this formation's whole day · breaks into the gallery on a 4 or better</small></button>`; }
    else if (humanTurn() && canMine(sel)) { const g = galleryAt(sel.side, sel.hex), t = mineTarget(sel), done = g && +g[0] === t ? g[1].days : 0; html += `<button class="ferry-btn" id="mineBtn"><b>${done ? 'Carry on the mine' : 'Dig a mine'} under ${esc(worksTitle(t))} (M)</b><small>${done + 1 === MINE_DAYS ? `Day ${MINE_DAYS} of ${MINE_DAYS}: springs it today, bringing down ${MINE_LEVELS} levels of the works` : `Day ${done + 1} of ${MINE_DAYS} · this formation's whole day · keep someone at the mouth or the gallery is lost`}</small></button>`; }
    if (humanTurn() && sel.side === S.turn && ferrySites(sel).length) html += `<button class="ferry-btn" id="ferryBtn"><b>${V.ferryPick ? 'Choose the far bank…' : `Build a ferry across the ${nearestMajorRiver(sel.hex)}`}</b><small>Once per campaign · costs this command and ${FERRY_COST} soldier · either army may then cross</small></button>`;
    if (sel.side === S.turn && humanTurn()) {
      const hint = sel.attacked ? (sel.mp > 0 ? 'It has struck; horse can ride on with its remaining march points.' : 'This formation has fought and is done for the round.')
        : V.targets.length ? 'Red rings are in range. Click one to attack, or click blue ground to march.'
        : V.farTargets.length ? 'Dashed rings can be reached and attacked in one order.'
        : wavering(sel) ? 'Pull it back into a village, town or fort out of contact and let it rest to rally.'
        : `Click blue ground to march. Holding still in a village, town or fort out of contact rallies ${men(1)} (${men(2)} near the general).`;
      html += `<p class="hint">${hint}</p>`;
    }
  }
  if (hex >= 0 && (!sel || hex !== sel.hex || !sel)) html += groundReport(hex, !!sel);
  else if (!sel) html = `<div class="empty"><h2>Survey the field</h2><p>Hover the map for a ground report. Select one of your formations to see where it can march and strike.</p></div>`;
  box.innerHTML = html;
}

function groundReport(hex, compact) {
  const h = HEXES[hex], t = TERRAIN[h.terrain], place = h.place && MAP.places[h.place], power = POWER_BY_ID[h.territory];
  const def = t.def + (h.cover ? COVER[h.cover].def : 0) + settlementDef(hex);
  const title = place ? place.name : t.name;
  const rows = [
    ['Ground', `${t.name} — ${t.note.toLowerCase()}`],
    ['Vegetation', h.cover ? `${COVER[h.cover].name} — ${COVER[h.cover].note.split(':')[0].toLowerCase()}` : place ? 'Cleared around the settlement' : h.fields ? 'Cultivated fields — open going' : 'Open'],
    ['Height', `${h.elev} m · relief ${h.relief} m`],
    ['March cost', `${TERRAIN[h.terrain].move + (h.cover ? COVER[h.cover].move : 0)} (road 1)`],
    ['Defence', `+${def}`],
  ];
  if (ROAD_NAMES[hex]) rows.push(['Road', ROAD_NAMES[hex]]);
  const rivers = [...new Set(h.river.filter(Boolean))];
  if (rivers.length) rows.push(['Water', `${rivers.map(r => `${RIVER_CLASS[r].name} +${RIVER_CLASS[r].def}`).join(', ')} against attacks across it`]);
  if (power) rows.push(['Sphere', `${power.name}${power.npc ? ` · ${S.allies[power.id] ? `allied to ${SIDES[S.allies[power.id]].short}` : 'uncommitted'}` : ''}`]);
  const sk = STRONG_HEX.get(hex), fk = FORT_HEX.get(hex);
  if (sk) rows.push(['Strongpoint', S.owners[sk] ? `held by ${SIDES[S.owners[sk]].name}` : 'unclaimed']);
  if (fk) rows.push(['Fort', S.forts[fk] ? `held by ${SIDES[S.forts[fk]].name} · supply source` : 'ungarrisoned']);
  const works = worksOf(hex);
  if (works) rows.push([works.name === 'Kacha fort' ? 'Kacha fort' : 'Works', works.left ? `+${Math.ceil(works.left)} defence${works.left < works.max ? ` · battered (${Math.round(works.left / works.max * 100)}% standing)` : ''}` : 'battered down']);
  if (S.walls?.[h.place] !== undefined) rows.push(['Walls', S.walls[h.place] > 0 ? `+${Math.ceil(S.walls[h.place])} defence${S.walls[h.place] % 1 ? ' · battered' : ''}` : 'battered down']);
  if (works || S.walls?.[h.place] !== undefined) rows.push(['Under fire', 'every bombardment wears the works down; a hit brings down a level']);
  const enemies = unitsAt(hex).filter(playerSees);
  return `<div class="ground ${compact ? 'compact' : ''}"><small>Ground report${place ? ` · ${place.kind}` : ''}</small><h3>${esc(title)}</h3><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>${enemies.length ? `<p class="occupants">${enemies.map(u => `<span class="${u.side}">${esc(u.name)} ${pipsHtml(u.hp, maxHp(u))}</span>`).join('')}</p>` : ''}</div>`;
}

function renderRoster() {
  const side = !S.ai[S.turn] ? S.turn : S.player;
  $('#rosterSide').textContent = SIDES[side].short;
  $('#roster').innerHTML = S.units.filter(u => u.side === side).map(u => {
    const able = side === S.turn && canActCached(u), place = placeName(u.hex) || TERRAIN[HEXES[u.hex].terrain].name;
    return `<button class="roster-row ${u.side} ${u.id === S.selected ? 'active' : ''} ${able ? 'able' : 'done'}" data-unit="${u.id}"><span class="mini-badge ${u.side}">${unitPortrait(u, 'portrait')}</span><span class="r-main"><b>${ledBy(u) ? '★ ' : ''}${esc(u.name)}</b><small>${esc(place)}${wavering(u) ? ' · <span class="warn">wavering</span>' : ''}</small></span><span class="r-side">${pipsHtml(u.hp, maxHp(u))}<em class="${stockOf(u) < STOCK_HUNGRY ? 'low' : ''}">${stockOf(u)}% supplies</em><em>${side !== S.turn || S.replay ? '' : able ? (u.moved ? `${u.mp} mp` : 'ready') : 'done'}</em></span></button>`;
  }).join('');
}
function renderObjectives() {
  const counts = { azure: 0, red: 0 };
  $('#objectives').innerHTML = STRONGPOINTS.map(k => {
    const o = S.owners[k];
    if (o) counts[o]++;
    return `<button class="obj-row ${o || 'none'}" data-hex="${HEX_OF[k]}"><i></i><b>${MAP.places[k].name}</b><small>${o ? SIDES[o].short : 'Unclaimed'}</small></button>`;
  }).join('');
  $('#objCount').textContent = `${counts.azure} · ${counts.red}`;
}
function renderPowers() {
  $('#powers').innerHTML = POWERS.filter(p => p.npc).map(p => {
    const a = S.allies[p.id];
    return `<button class="power-row ${a || 'none'}" data-hex="${HEX_OF[p.seat]}" style="--power:${p.color}"><i></i><span><b>${p.name}</b><small>${p.chief} · seat ${MAP.places[p.seat].name}</small><em>${S.levied[p.id] ? 'Levy raised' : `Offers ${p.levy.name}`} · +1 defence in their sphere</em></span><strong>${a ? SIDES[a].short : 'Neutral'}</strong></button>`;
  }).join('');
}
function renderLog() {
  $('#log').innerHTML = S.log.slice(0, 30).map(e => `<p class="${e.side}"><span>R${e.round}</span>${e.html}</p>`).join('');
}

// ---------------------------------------------------------------------------
// Tooltip

function updateTooltip(clientX, clientY) {
  const tip = $('#tooltip'), hex = V.hoverHex;
  if (hex < 0 || V.dragging) { tip.hidden = true; return; }
  const sel = S.selected && unitById(S.selected), h = HEXES[hex], here = unitsAt(hex);
  let html = '';
  const enemy = sel && here.find(u => u.side !== sel.side);
  if (sel && enemy && humanTurn() && sel.side === S.turn && !sel.attacked) {
    const direct = V.targets.includes(enemy) || here.some(u => V.targets.includes(u));
    const from = direct ? sel.hex : strikeHexFor(sel, enemy);
    if (from !== null) {
      const left = direct ? sel.mp : sel.mp - V.reach.cost.get(from);
      const saved = sel.hex; sel.hex = from;
      const f = forecast(sel, from, enemy, left);
      sel.hex = saved;
      const line = parts => parts.map(([k, v]) => `<span>${esc(k)} <b>${v > 0 ? '+' : ''}${v}</b></span>`).join('');
      const seg = (k, label) => f[k] > 0.005 ? `<span class="k ${k}">${label} ${pct(f[k])}</span>` : '';
      html = `<div class="tip-head attack"><b>${direct ? 'Attack' : 'March & attack'}</b> ${esc(f.def.name)} ${pipsHtml(f.def.hp, maxHp(f.def))}</div>
        <div class="odds"><div>${['rout', 'hit', 'standoff', 'miss', 'repulse'].map(k => `<i class="${k}" style="width:${pct(f[k])}"></i>`).join('')}</div>
        <p>${seg('rout', 'Smash')}${seg('hit', 'Strike')}${seg('standoff', 'Standoff')}${seg('miss', 'Fall short')}${seg('repulse', 'Repulsed')}</p></div>
        <div class="losses"><div><small>They lose</small><b>~${men(f.expDef)}</b><em>${pct(f.pBreak)} breaks them${f.pKill > 0.005 ? ` · ${pct(f.pKill)} destroys` : ''}</em></div><div><small>You lose</small><b>~${men(f.expAtt)}</b><em>${f.melee ? (f.pAttBreak > 0.005 ? `${pct(f.pAttBreak)} breaks you` : 'you hold') : 'fire from range: no risk'}</em></div></div>
        <div class="mods"><div><small>Attack ${f.A.total}</small>${line(f.A.parts)}</div><div><small>Defence ${f.D.total}</small>${line(f.D.parts)}</div></div>`;
    } else html = `<div class="tip-head">${esc(enemy.name)}</div><p class="muted">Out of reach this round.</p>`;
  } else {
    const place = h.place && MAP.places[h.place];
    html = `<div class="tip-head">${esc(place ? place.name : TERRAIN[h.terrain].name)}</div><p class="muted">${TERRAIN[h.terrain].name}${h.cover ? `, ${COVER[h.cover].name.toLowerCase()}` : ''} · ${h.elev} m</p>`;
    if (sel && V.reach) {
      if (V.reach.cost.has(hex)) html += `<p>March cost <b>${V.reach.cost.get(hex)}</b> of ${sel.mp}${enemyZoc(sel.side)[hex] ? ' · <span class="warn">enemy contact ends the march</span>' : ''}${here.some(u => u.side === sel.side) ? '<br><span class="muted">Click to join this stack · Shift-click to select it</span>' : ''}</p>`;
      else if (hex !== sel.hex) html += '<p class="muted">Beyond this march.</p>';
    }
    if (here.length) html += `<p>${here.map(u => `<span class="${u.side}-text">${esc(u.name)}</span>`).join(', ')}</p>`;
  }
  tip.innerHTML = html;
  tip.hidden = false;
  const vr = R.view.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
  let x = clientX - vr.left + 18, y = clientY - vr.top + 18;
  if (x + tw > vr.width - 8) x = clientX - vr.left - tw - 14;
  if (y + th > vr.height - 8) y = clientY - vr.top - th - 14;
  tip.style.transform = `translate(${Math.max(8, x)}px, ${Math.max(8, y)}px)`;
}

// ---------------------------------------------------------------------------
// Orders

function doFortify() {
  const sel = S.selected && unitById(S.selected);
  if (!humanTurn() || !sel) return;
  if (!canFortify(sel)) { toast('A kacha fort takes a foot formation’s whole day, out of the enemy’s reach, on ground without standing walls'); return; }
  fortify(sel);
}
function doMine() {
  const sel = S.selected && unitById(S.selected);
  if (!humanTurn() || !sel) return;
  if (canCountermine(sel)) { countermine(sel); return; }
  if (!canMine(sel)) { toast('A mine is dug by foot, next to enemy-held works, with a whole day to spare'); return; }
  digMine(sel);
}
function startFerry() {
  const sel = S.selected && unitById(S.selected), sites = ferrySites(sel);
  if (!humanTurn() || !sites.length) return;
  if (sites.length === 1) { buildFerry(sel, sites[0]); return; }
  V.ferryPick = { from: sel.hex, sites, unit: sel.id };
  toast('Click a highlighted hex on the far bank (Esc to cancel)', sel.side);
  refresh();
}

// The spadework a foot formation can do, as buttons beside it on the map:
// the ones it can do now are lit, the rest say what they need.
const ACT_ICON = {
  ferry: '<path d="M2 10h12l-2.5 3.5h-7z"/><path d="M8 2.5V10M8 3l4 5H8"/>',
  fort: '<path d="M1.5 13.5h13M3 13.5V7h2v2h2V7h2v2h2V7h2v6.5"/>',
  mine: '<path d="M3 13.5l6.5-6.5"/><path d="M4.5 4.5c3.5-1.5 7-.5 9 3.5-2.5-1.5-5-2-7.5-1.5z"/>',
};
function spadework(u) {
  if (!u || !humanTurn() || u.side !== S.turn || !isFoot(u)) return [];
  const h = HEXES[u.hex], fresh = !u.moved && !u.attacked && u.mp >= fullMp(u), acts = [];
  if (HEXES.some(x => x.river.includes('major'))) {
    const ok = ferrySites(u).length > 0;
    acts.push({ id: 'ferry', key: 'B', label: V.ferryPick ? 'Pick far bank' : 'Ferry', ok,
      why: ok ? `Lash boats across the ${nearestMajorRiver(u.hex)}: once per campaign, costs this command and ${men(FERRY_COST)}`
        : S.ferryBuilt[u.side] ? 'Your one ferry of the campaign is already built'
        : !h.river.includes('major') ? 'A ferry is built from the bank of a great river: march a foot formation to the water’s edge'
        : u.attacked ? 'It has fought this round' : 'Too few men left to spare for the boats' });
  }
  {
    const ok = canFortify(u), enemyNext = h.nbr.some(n => n >= 0 && S.units.some(e => e.side !== u.side && e.hex === n));
    acts.push({ id: 'fort', key: 'K', label: 'Kacha fort', ok,
      why: ok ? `Dig a mud wall and ditch here: the whole day, +${KACHA_DEF} defence`
        : !fresh ? 'Takes a whole day: only a formation that has not marched or fought'
        : S.kacha?.[u.hex] > 0 ? 'There is a kacha fort here already'
        : S.walls?.[h.place] > 0 ? 'These works already have walls'
        : enemyNext ? 'Not with the enemy next to it' : 'There is no room to dig inside this town' });
  }
  if (canCountermine(u)) acts.push({ id: 'mine', key: 'M', label: 'Countermine', ok: true, why: `The enemy is mining towards these works: break into the gallery on a 4 or better` });
  else if (Object.values(HEX_OF).some(x => fortLevels(x) > 0)) {
    const ok = canMine(u);
    acts.push({ id: 'mine', key: 'M', label: 'Mine', ok,
      why: ok ? `Dig a gallery under ${worksTitle(mineTarget(u))}: ${MINE_DAYS} days, then it brings down ${MINE_LEVELS} levels of the works`
        : !fresh ? 'Takes a whole day: only a formation that has not marched or fought' : 'A mine is begun next to walls the enemy holds' });
  }
  return acts;
}
function syncActions() {
  const box = $('#unitActions'), sel = S.selected && unitById(S.selected), acts = V.busy ? [] : spadework(sel);
  box.hidden = !acts.length;
  if (!acts.length) return;
  const h = HEXES[sel.hex];
  box.style.setProperty('--x', `${h.x.toFixed(1)}px`);
  box.style.setProperty('--y', `${h.y.toFixed(1)}px`);
  box.innerHTML = acts.map(a => `<button class="act${a.ok ? '' : ' off'}${a.id === 'ferry' && V.ferryPick ? ' on' : ''}" data-act="${a.id}" title="${esc(a.why)}"><svg viewBox="0 0 16 16" aria-hidden="true">${ACT_ICON[a.id]}</svg><span>${a.label}</span><kbd>${a.key}</kbd></button>`).join('');
}
function onAction(e) {
  const b = e.target.closest('.act');
  if (!b) return;
  const a = spadework(S.selected && unitById(S.selected)).find(x => x.id === b.dataset.act);
  if (!a) return;
  if (!a.ok) { toast(a.why); return; }
  if (a.id === 'ferry') startFerry(); else if (a.id === 'fort') doFortify(); else doMine();
}

async function onHexClick(hex, selectOnly = false) {
  if (!humanTurn() || hex < 0) return;
  if (V.ferryPick) {
    const pick = V.ferryPick, u = unitById(pick.unit);
    V.ferryPick = null;
    if (pick.sites.includes(hex) && u) buildFerry(u, hex); else refresh();
    return;
  }
  const sel = S.selected && unitById(S.selected), here = unitsAt(hex);
  const own = here.filter(u => u.side === S.turn), enemy = here.find(u => u.side !== S.turn);
  const mine = sel && sel.side === S.turn, reach = V.reach;  // order() clears V.reach while busy
  // Clicking a stack again steps through its formations, then sets them
  // aside to show the ground they stand on: the fort, ghat or village.
  if (V.peek === hex) { V.peek = -1; select((own[0] || here[0])?.id ?? null); return; }
  V.peek = -1;
  if (sel && sel.hex === hex) {
    const pile = here.filter(u => u.side === sel.side), i = pile.indexOf(sel);
    if (i < pile.length - 1) select(pile[i + 1].id); else peekAt(hex);
    return;
  }
  if (mine && enemy && !sel.attacked) {
    if (V.targets.some(t => t.hex === hex)) return order(() => attack(sel, enemy));
    const from = strikeHexFor(sel, enemy);
    if (from !== null) return order(async () => { await moveUnit(sel, from, reach); await attack(sel, enemy); });
  }
  // A friendly hex the selection can reach (with room) is a march into that
  // stack; Shift-click, or a friend out of reach, selects them instead.
  if (mine && reach?.cost.has(hex) && !selectOnly) return order(() => moveUnit(sel, hex, reach));
  if (own.length) { select(own[0].id); return; }
  if (enemy) { S.selected = enemy.id; refresh(); return; }
  select(null);
}
function peekAt(hex) {
  V.peek = hex;
  S.selected = null;
  refresh();
  toast(`${placeName(hex) || 'The ground'} beneath the stack · click again to pick up the formations`);
}
// Would clicking this hex issue a march or an attack for the selection?
function isOrderHex(hex) {
  const sel = S.selected && unitById(S.selected);
  if (!humanTurn() || !sel || sel.side !== S.turn || hex < 0) return false;
  const enemy = unitsAt(hex).find(u => u.side !== sel.side);
  if (enemy) return !sel.attacked && (V.targets.includes(enemy) || unitsAt(hex).some(u => V.targets.includes(u)) || strikeHexFor(sel, enemy) !== null);
  return !!V.reach?.cost.has(hex);
}
async function order(fn) {
  V.busy = true;
  $('#tooltip').hidden = true;
  refresh();
  try { await fn(); } finally { V.busy = false; }
  const sel = S.selected && unitById(S.selected);
  if (sel && !canAct(sel)) S.selected = null;
  refresh();
  if (!S.winner && S.units.filter(u => u.side === S.turn).every(u => !canAct(u))) toast('Every formation has acted — end your command (E)', S.turn);
}
function doForce() {
  const u = unitById(S.selected);
  if (humanTurn() && forcedMarch(u)) toast(`Forced march: ${u.name}`, u.side);
  else if (humanTurn()) toast(`Select a formation within ${GENERAL_REACH} hexes of the general that has not fought`);
}
function doRide() {
  const u = unitById(S.selected);
  if (humanTurn() && u && rideTo(u)) toast(`${GENERALS[u.side].name} now leads the ${u.name}`, u.side);
  else if (humanTurn()) toast(`Select one of your formations within ${GENERAL_RIDE} hexes of the general`);
}
function select(id) {
  S.selected = id;
  V.peek = -1;
  refresh();
}
function selectNext() {
  if (!humanTurn()) return;
  const mine = S.units.filter(u => u.side === S.turn && canAct(u));
  if (!mine.length) return;
  const i = mine.findIndex(u => u.id === S.selected), next = mine[(i + 1) % mine.length];
  select(next.id);
  if (!hexOnScreen(next.hex, 0.12)) flyTo(HEXES[next.hex].x, HEXES[next.hex].y, Math.max(R.cam.z, 1.1));
}
async function doEndTurn() {
  if (!humanTurn()) return;
  const idle = S.units.filter(u => u.side === S.turn && !u.moved && !u.attacked && canAct(u)).length;
  if (idle && !V.confirmedEnd) {
    V.confirmedEnd = true;
    toast(`${idle} formation${idle > 1 ? 's have' : ' has'} no orders (they will rest). Press End again to confirm.`, S.turn);
    setTimeout(() => { V.confirmedEnd = false; }, 4000);
    return;
  }
  V.confirmedEnd = false;
  S.selected = null;
  V.busy = true;
  refresh();
  try { await endTurn(); } finally { V.busy = false; }
  refresh();
  if (!S.winner && !S.ai[S.turn]) {
    const first = S.units.find(u => u.side === S.turn);
    if (first && Object.values(S.ai).some(Boolean)) flyTo(HEXES[first.hex].x, HEXES[first.hex].y, R.cam.z, 500);
  }
}

// ---------------------------------------------------------------------------
// UI hooks used by the rules

UI.refresh = () => refresh();
UI.log = () => {};
UI.flash = (text, side) => toast(text, side);
UI.banner = () => {
  const b = $('#turnBanner');
  b.querySelector('strong').textContent = SIDES[S.turn].name;
  b.querySelector('span').textContent = `Round ${S.round} of ${ROUND_LIMIT}${SCN.clock ? ` · ${roundName()}` : ""}`;
  b.dataset.side = S.turn;
  b.classList.add('show');
  setTimeout(() => b.classList.remove('show'), 1100);
};
UI.focus = async hex => {
  if (!V.followAI || !S.ai[S.turn]) return;
  if (fogOn() && !sightOf(viewSide())[hex]) return;  // the camera does not follow what cannot be seen
  if (!hexOnScreen(hex)) await flyTo(HEXES[hex].x, HEXES[hex].y, Math.max(R.cam.z, 0.6), 300 / V.speed);
};
UI.animateMove = async (u, path) => {
  const node = R.unitEls.get(u.id);
  if (!node || !path || path.length < 2) return;
  // An enemy march wholly out of sight is not shown.
  if (fogOn() && u.side !== viewSide() && !path.some(h => sightOf(viewSide())[h])) return;
  V.animating = u.id;
  node.classList.add('moving');
  // Long marches on the 2 km lattice animate quickly: about half a second each.
  const steps = path.length - 1, step = Math.max(22, Math.min(S.ai[u.side] ? 55 : 70, (S.ai[u.side] ? 480 : 560) / steps)) / V.speed;
  node.style.transitionDuration = `${step}ms`;
  for (const hex of path.slice(1)) {
    node.style.setProperty('--x', `${HEXES[hex].x}px`);
    node.style.setProperty('--y', `${HEXES[hex].y}px`);
    await sleep(step);
  }
  node.classList.remove('moving');
  node.style.transitionDuration = '';
  V.animating = null;
};
UI.combatFx = async ({ att, def, outcome, dmgDef, dmgAtt, ar, dr, A, D }) => {
  syncUnits(V.animating);  // drop the fallen figures as the blow lands
  const h = HEXES[def.hex], fx = el('div', `combat-fx ${outcome}`, R.markers);
  fx.style.left = `${h.x}px`; fx.style.top = `${h.y}px`;
  const word = { rout: 'SMASHED', hit: 'STRUCK', standoff: 'STANDOFF', miss: 'FELL SHORT', repulse: 'REPULSED' }[outcome];
  fx.innerHTML = `<b>${word}</b><span><i>${ar}</i>+${A} vs <i>${dr}</i>+${D}</span>${dmgDef || dmgAtt ? `<em>${dmgDef ? `−${menCount(dmgDef)}` : ''}${dmgDef && dmgAtt ? ' / ' : ''}${dmgAtt ? `<small>attacker</small> −${menCount(dmgAtt)}` : ''}</em>` : ''}`;
  const hitNode = R.unitEls.get((dmgAtt ? att : def).id);
  if (hitNode && (dmgDef || dmgAtt)) { hitNode.classList.remove('struck'); void hitNode.offsetWidth; hitNode.classList.add('struck'); }
  const a = R.unitEls.get(att.id);
  if (a) { a.classList.remove('firing'); void a.offsetWidth; a.classList.add('firing'); }
  await sleep((S.ai[att.side] ? 750 : 650) / V.speed);
  setTimeout(() => fx.remove(), 900);
};
UI.victory = (side, reason) => {
  const d = $('#victoryDialog');
  d.dataset.side = side;
  $('#victoryTitle').textContent = side === 'draw' ? 'The season ends in stalemate' : `${SIDES[side].name} prevails`;
  $('#victoryCopy').textContent = reason;
  renderVictoryBattles();
  setTimeout(() => { if (!d.open) d.showModal(); }, 600);
};
// Dispatches: the campaign's main events (a column comes in, a magazine blows
// up, a general falls, a post is taken), shown one at a time with their
// history. Only when someone is playing, never in a replay; the computer waits
// for them to be read before it moves.
const DISPATCHES = [];
let dispatchWaiters = [];
UI.dispatch = d => {
  if (!S || S.replay || (S.ai.azure && S.ai.red)) return;
  DISPATCHES.push({ when: roundName(), ...d });
  showDispatch();
};
UI.dispatchesRead = () => DISPATCHES.length || $('#dispatchDialog').open ? new Promise(r => dispatchWaiters.push(r)) : Promise.resolve();
function showDispatch() {
  const dlg = $('#dispatchDialog');
  if (dlg.open || !DISPATCHES.length) return;
  const d = DISPATCHES.shift();
  dlg.dataset.side = d.side || '';
  dlg.dataset.hex = d.hex ?? '';
  $('#dispatchKicker').textContent = `${d.when}${d.kind ? ` · ${d.kind}` : ''}${d.side ? ` · ${SIDES[d.side].name}` : ''}`;
  $('#dispatchTitle').textContent = d.title;
  $('#dispatchText').textContent = d.text || '';
  const h = $('#dispatchHistory'); h.hidden = !d.history; h.querySelector('p').textContent = d.history || '';
  $('#dispatchShow').hidden = d.hex === undefined || d.hex === null || d.hex < 0;
  $('#dispatchNext').textContent = DISPATCHES.length ? `Next dispatch (${DISPATCHES.length} more)` : 'Continue';
  dlg.showModal();
}
function initDispatches() {
  const dlg = $('#dispatchDialog');
  $('#dispatchNext').onclick = () => dlg.close();
  $('#dispatchShow').onclick = () => { const hex = +dlg.dataset.hex; dlg.close(); if (HEXES[hex]) flyTo(HEXES[hex].x, HEXES[hex].y, Math.max(R.cam.z, 1.6), 420); };
  dlg.addEventListener('close', () => {
    if (DISPATCHES.length) return void setTimeout(showDispatch, 120);
    const w = dispatchWaiters; dispatchWaiters = []; w.forEach(f => f());
  });
}
let overlayTimer = 0;
UI.cameraChanged = () => {
  drawMinimapView();
  updateScaleBar();
  // Target rings are sized to the counters, which change with zoom.
  if (S?.selected) { clearTimeout(overlayTimer); overlayTimer = setTimeout(redrawOverlay, 80); }
};

// ---------------------------------------------------------------------------
// Replay: troop movements played back on the map. game.js keeps a keyframe
// of the board at the start of every command and notes every march, blow,
// retreat and capture after it. A replay lends the renderer a copy of the
// board (S is swapped out; save() ignores it) and walks those events.

const RP = { active: false, real: null, frames: [], from: 0, end: 0, frame: 0, focus: null, paused: false, speed: 2, token: 0, done: false, title: '' };

function canReplay() { return !!S?.frames?.length && !V.busy && !RP.active; }

// Frames covering an engagement: from the command before its first blow (to
// see the approach) to the end of the command with its last.
function battleFrames(b) {
  const evs = S.events.map((e, i) => e.battle === b.id ? i : -1).filter(i => i >= 0);
  if (!evs.length || !S.frames.length) return null;
  const frameOf = i => { let k = 0; while (k + 1 < S.frames.length && S.frames[k + 1].ev <= i) k++; return k; };
  if (S.frames[0].ev > evs[0]) return null;  // fought before replays were recorded
  return { from: Math.max(0, frameOf(evs[0]) - 1), end: frameOf(evs[evs.length - 1]) + 1 };
}

async function startReplay({ battle = null } = {}) {
  if (!canReplay()) { toast(V.busy ? 'Wait for the computer to finish its command' : 'Nothing to replay yet'); return; }
  const span = battle ? battleFrames(battle) : { from: 0, end: S.frames.length };
  if (!span) { toast('This battle was fought before replays were recorded'); return; }
  for (const d of document.querySelectorAll('dialog[open]')) d.close();
  $('#battleNotice').hidden = true;
  Object.assign(RP, { active: true, real: S, frames: S.frames, events: S.events, ...span, frame: span.from, focus: battle ? battle.focus : null,
    paused: false, done: false, speed: battle ? 1 : 3, title: battle ? (battle.account?.name || battle.name) : `${SCN.title}: the whole campaign`, savedSpeed: V.speed });
  V.busy = true; V.speed = RP.speed;
  document.body.classList.add('replaying');
  $('#replayBar').hidden = false;
  renderReplayBar();
  if (battle) await flyTo(HEXES[battle.focus].x, HEXES[battle.focus].y, Math.max(R.cam.z, 1.05), 500);
  else fitBoard();
  playReplay();
}

function exitReplay() {
  if (!RP.active) return;
  RP.active = false; RP.token++;
  S = RP.real;
  V.busy = false; V.speed = RP.savedSpeed; V.animating = null;
  document.body.classList.remove('replaying');
  $('#replayBar').hidden = true;
  for (const node of R.markers.querySelectorAll('.combat-fx')) node.remove();
  refresh();
}

// Lay the board out as it stood at the start of frame k.
function loadFrame(k) {
  const f = RP.frames[k], b = JSON.parse(JSON.stringify(f.board));
  MINI.trails = [];
  S = { ...RP.real, ...b, replay: true, ai: { azure: true, red: true }, winner: null, selected: null, undo: null, log: [], battles: [], events: [] };
  V.animating = null;
  refresh();
  renderReplayBar();
}

// Wait while paused; false once the replay is exited or jumps elsewhere.
async function replayGate(token) {
  while (RP.paused && token === RP.token && RP.active) await sleep(80);
  return token === RP.token && RP.active;
}
const nearFocus = hex => RP.focus === null || hexDistance(hex, RP.focus) <= 9;

async function playReplay() {
  const token = ++RP.token;
  RP.done = false;
  while (RP.frame < RP.end) {
    loadFrame(RP.frame);
    if (!(await replayGate(token))) return;
    await sleep(350 / RP.speed);
    const stop = RP.frame + 1 < RP.frames.length ? RP.frames[RP.frame + 1].ev : RP.events.length;
    for (let i = RP.frames[RP.frame].ev; i < stop; i++) {
      if (!(await replayGate(token))) return;
      await replayEvent(RP.events[i]);
      drawMinimap();
    }
    if (token !== RP.token) return;
    RP.frame++;
  }
  RP.done = true; RP.paused = true;
  renderReplayBar();
}

async function replayEvent(e) {
  const unit = id => S.units.find(u => u.id === id);
  const march = async (u, path) => {
    if (!u || !path?.length || !RP.active) return;
    if (path.length > 1 && (nearFocus(path[0]) || nearFocus(path[path.length - 1]))) await UI.animateMove(u, path);
    u.hex = path[path.length - 1];
    syncUnits();
  };
  const drop = id => { S.units = S.units.filter(u => u.id !== id); syncUnits(); };
  switch (e.t) {
    case 'move': if (e.path?.length > 1) MINI.trails.push({ side: unit(e.id)?.side || 'azure', path: e.path }); return march(unit(e.id), e.path);
    case 'fallback': return march(unit(e.unit.id), e.path || [unit(e.unit.id)?.hex, e.hex]);
    case 'advance': return march(unit(e.unit.id), [e.from ?? unit(e.unit.id)?.hex, e.hex]);
    case 'destroyed': case 'surrender': drop(e.unit.id); if (nearFocus(e.hex)) await sleep(300 / RP.speed); return;
    case 'ride': S.generals[e.side].unitId = e.id; syncUnits(); return;
    case 'general': Object.assign(S.generals[e.side], { captured: true, fallen: !!e.fallen }); syncUnits(); return;
    case 'breach':
      if (e.place && e.walls !== undefined) S.walls[e.place] = e.walls; else if (e.place && e.left !== undefined && S.walls[e.place] !== undefined) S.walls[e.place] = e.left;
      if (e.place && e.battered !== undefined) (S.battered ||= {})[e.place] = e.battered;
      if (e.kacha !== undefined) { S.kacha ||= {}; if (e.kacha) S.kacha[e.hex] = e.kacha; else delete S.kacha[e.hex]; }
      if (e.mine) delete S.mines?.[e.hex];
      drawMarkers();
      return replayFx(e.hex, 'breach', e.mine ? 'MINE SPRUNG' : e.left ? 'WALLS BATTERED' : 'WALLS DOWN', '');
    case 'mine': (S.mines ||= {})[e.hex] = { side: e.side, from: e.from, days: e.days }; drawMarkers(); return replayFx(e.from, 'capture', 'MINE DUG', '');
    case 'countermine': if (e.broke) delete S.mines?.[e.hex]; drawMarkers(); return replayFx(e.hex, 'capture', e.broke ? 'GALLERY BROKEN' : 'COUNTERMINE FAILED', '');
    case 'fortify': (S.kacha ||= {})[e.hex] = KACHA_DEF; drawMarkers(); return replayFx(e.hex, 'capture', 'KACHA FORT DUG', '');
    case 'capture':
      if (STRONG_HEX.get(e.hex) === e.place) S.owners[e.place] = e.side; else S.forts[e.place] = e.side;
      drawMarkers(); renderPanels();
      return replayFx(e.hex, 'capture', `${placeTitle(e.place).toUpperCase()} TAKEN`, '');
    case 'combat': {
      for (const m of [e.att, e.def]) { const u = unit(m.id); if (u) u.hp = Math.max(0, m.hp); }
      if (!nearFocus(e.hex)) { syncUnits(); return; }
      const a = R.unitEls.get(e.att.id);
      if (a) { a.classList.remove('firing'); void a.offsetWidth; a.classList.add('firing'); }
      syncUnits();
      const hit = R.unitEls.get((e.lostAtt && !e.lostDef ? e.att : e.def).id);
      if (hit && (e.lostDef || e.lostAtt)) { hit.classList.remove('struck'); void hit.offsetWidth; hit.classList.add('struck'); }
      const word = { rout: 'SMASHED', hit: 'STRUCK', standoff: 'STANDOFF', miss: e.melee ? 'NO IMPRESSION' : 'FELL SHORT', repulse: 'REPULSED' }[e.outcome];
      const loss = e.lostDef || e.lostAtt ? `${e.lostDef ? `−${menCount(e.lostDef)}` : ''}${e.lostDef && e.lostAtt ? ' / ' : ''}${e.lostAtt ? `<small>attacker</small> −${menCount(e.lostAtt)}` : ''}` : '';
      return replayFx(e.hex, e.outcome, word, loss);
    }
    default: return;
  }
}
async function replayFx(hex, cls, word, loss) {
  if (!nearFocus(hex) || !RP.active) return;
  const h = HEXES[hex], fx = el('div', `combat-fx ${cls}`, R.markers);
  fx.style.left = `${h.x}px`; fx.style.top = `${h.y}px`;
  fx.innerHTML = `<b>${word}</b>${loss ? `<em>${loss}</em>` : ''}`;
  setTimeout(() => fx.remove(), 1600);
  await sleep(700 / RP.speed);
}

function renderReplayBar() {
  if (!RP.active) return;
  const f = RP.frames[Math.min(RP.frame, RP.frames.length - 1)].board;
  $('#rpTitle').textContent = RP.title;
  $('#rpDay').textContent = RP.done ? 'The end' : `${roundName(f.round)} · ${SIDES[f.turn].name} moves`;
  $('#rpDay').dataset.side = RP.done ? '' : f.turn;
  $('#rpPlay').textContent = RP.done ? 'Play again' : RP.paused ? 'Play' : 'Pause';
  $('#rpSpeed').textContent = `${RP.speed}×`;
  const cells = [];
  for (let k = RP.from; k < RP.end; k++) {
    const b = RP.frames[k].board, state = k < RP.frame || RP.done ? 'past' : k === RP.frame ? 'now' : '';
    cells.push(`<button class="${b.turn} ${state}" data-frame="${k}" title="Day ${b.round}, ${SIDES[b.turn].name}"></button>`);
  }
  $('#rpTrack').innerHTML = cells.join('');
}

function bindReplay() {
  $('#rpPlay').onclick = () => {
    if (RP.done) { RP.frame = RP.from; RP.paused = false; playReplay(); }
    else RP.paused = !RP.paused;
    renderReplayBar();
  };
  $('#rpSpeed').onclick = () => { RP.speed = { 1: 2, 2: 4, 4: 8, 8: 1 }[RP.speed]; V.speed = RP.speed; renderReplayBar(); };
  $('#rpExit').onclick = exitReplay;
  $('#rpTrack').addEventListener('click', e => {
    const c = e.target.closest('[data-frame]');
    if (!c) return;
    RP.frame = +c.dataset.frame; RP.paused = false;
    playReplay();
  });
}

// ---------------------------------------------------------------------------
// Chronicle: every battle and siege is named and written up when it ends.
// game.js decides what counts as one engagement; chronicle.js writes it.

const CHRON = { shown: null, writing: new Set(), errors: new Map(), noticeTimer: 0 };
const KIND_NAME = { siege: 'Siege', assault: 'Assault', battle: 'Battle', skirmish: 'Skirmish' };
const daysText = b => b.last > b.first ? `days ${b.first}–${b.last}` : `day ${b.first}`;
const titleOf = b => b.account?.name || b.name;

UI.battleEnded = b => {
  b.account = CHRONICLE.fieldNotes(b);
  if (!b.major) return;
  if (CHRONICLE.key() && CHRONICLE.auto()) writeAccount(b);
  showNotice(b);
};

async function writeAccount(b) {
  if (CHRON.writing.has(b.id) || !CHRONICLE.key()) return;
  const campaign = S;
  CHRON.writing.add(b.id); CHRON.errors.delete(b.id);
  refreshChronicle(b);
  try {
    const account = await CHRONICLE.write(b);
    if (S === campaign) { b.account = account; save(); }
  } catch (err) {
    CHRON.errors.set(b.id, err.message);
  }
  CHRON.writing.delete(b.id);
  refreshChronicle(b);
}
function refreshChronicle(b) {
  if (S?.battles.includes(b)) renderBattles();
  if ($('#chronicleDialog').open) renderChronicle();
  if ($('#victoryDialog').open) renderVictoryBattles();
  if (CHRON.noticeFor === b.id && !$('#battleNotice').hidden) showNotice(b, true);
}

// A dispatch in the corner of the map when an engagement ends.
function showNotice(b, quiet = false) {
  const n = $('#battleNotice'), a = b.account;
  const status = CHRON.writing.has(b.id) ? '<em class="writing">Claude is writing the account…</em>'
    : CHRON.errors.has(b.id) ? `<em class="error">No account: ${esc(CHRON.errors.get(b.id))}</em>` : '';
  n.dataset.side = b.victor || '';
  n.innerHTML = `<small>${KIND_NAME[b.kind]} ended · ${daysText(b)}</small><b>${esc(a.name)}</b><span>${esc(a.verdict)}</span>${status}
    <div><button class="primary" data-read="${b.id}">Read the account</button><button class="ghost" data-dismiss aria-label="Dismiss">×</button></div>`;
  n.hidden = false;
  CHRON.noticeFor = b.id;
  if (!quiet) {
    n.classList.remove('show'); void n.offsetWidth; n.classList.add('show');
    clearTimeout(CHRON.noticeTimer);
    CHRON.noticeTimer = setTimeout(() => { n.hidden = true; }, 16000);
  }
}

function battleRow(b) {
  const live = b.open ? { ...b, ...describeBattle(b) } : b;
  return `<button class="battle-row won-${live.open ? 'open' : live.victor || 'none'}" data-battle="${b.id}">
    <i class="kind-${live.kind}"></i><span><b>${esc(titleOf(live))}</b><small>${KIND_NAME[live.kind]} · ${daysText(live)}${live.open ? ' · <em>under way</em>' : ''}</small>
    ${live.open ? '' : `<em>${esc(b.account?.verdict || '')}</em>`}</span></button>`;
}
function renderBattles() {
  const list = S.battles.filter(b => b.open || b.major).slice().reverse();
  const done = S.battles.filter(b => !b.open && b.major).length;
  $('#battleCount').textContent = done ? `${done} fought` : list.length ? 'under way' : 'none yet';
  $('#battles').innerHTML = list.length ? list.map(battleRow).join('') : '<p class="card-note">Battles and sieges are named and written up here when they end.</p>';
}
function renderVictoryBattles() {
  const list = S.battles.filter(b => b.major);
  $('#victoryBattles').innerHTML = list.length ? `<h4>Battles of the campaign</h4><div>${list.map(battleRow).join('')}</div>` : '';
}

function openChronicle(id = null) {
  exitReplay();
  const done = S.battles.filter(b => !b.open);
  CHRON.shown = id ?? CHRON.shown ?? [...done].reverse().find(b => b.major)?.id ?? done.at(-1)?.id ?? null;
  renderChronicle();
  const d = $('#chronicleDialog');
  if (!d.open) d.showModal();
  if (!done.length || !CHRONICLE.key()) $('#chronSettings').open = !CHRONICLE.key() && !!done.length;
}
function renderChronicle() {
  const done = S.battles.filter(b => !b.open), major = done.filter(b => b.major), minor = done.filter(b => !b.major);
  let b = done.find(x => x.id === CHRON.shown) || major.at(-1) || done.at(-1);
  $('#chronList').innerHTML = done.length
    ? major.map(battleRow).join('') + (minor.length ? `<h5>Skirmishes</h5>${minor.map(battleRow).join('')}` : '')
    : '<p class="card-note">No battle has been fought yet.</p>';
  $('#chronList').querySelector(`[data-battle="${b?.id}"]`)?.classList.add('active');
  $('#chronBody').innerHTML = b ? accountHtml(b) : `<h2>${esc(SCN.title)}</h2><p class="verdict">The chronicle is empty.</p><div class="story"><p>When a battle or siege ends, it is named after the place it was fought and written up here: who struck first, how it turned and what it cost.</p></div>`;
  const key = CHRONICLE.key();
  $('#chronModel').textContent = CHRONICLE.MODEL;
  $('#chronStatus').textContent = key ? `Claude writes the accounts (key …${key.slice(-4)})` : 'field notes only: add an API key for Claude';
  $('#apiKey').value = '';
  $('#apiKey').placeholder = key ? `saved: …${key.slice(-4)}` : 'sk-ant-…';
  $('#forgetKey').disabled = !key;
  $('#autoChron').checked = CHRONICLE.auto();
}
function accountHtml(b) {
  const a = b.account || CHRONICLE.fieldNotes(b), key = CHRONICLE.key();
  const toll = s => `<span class="${s}"><b>${esc(SIDES[s].name)}</b> ${b.lost[s] ? `−${men(b.lost[s])}` : 'no losses'}${b.broken[s] ? `, ${b.broken[s]} formation${b.broken[s] > 1 ? 's' : ''} lost` : ''}</span>`;
  const status = CHRON.writing.has(b.id) ? '<em class="writing">Claude is writing the account…</em>'
    : CHRON.errors.has(b.id) ? `<em class="error">Claude could not write it: ${esc(CHRON.errors.get(b.id))}</em>` : '';
  const by = a.by === 'claude' ? `Written by Claude (${esc(a.model)}) from the day’s dispatches.` : 'Field notes from the dispatches.';
  const action = !key ? '<button class="ghost" data-settings>Add an API key to have Claude write it</button>'
    : `<button class="ghost" data-write="${b.id}" ${CHRON.writing.has(b.id) ? 'disabled' : ''}>${a.by === 'claude' ? 'Write it again' : 'Have Claude write it'}</button>`;
  return `<header class="won-${b.victor || 'none'}"><small>${KIND_NAME[b.kind]} · ${daysText(b)} · ${esc(b.place)}</small><h2>${esc(a.name)}</h2><p class="verdict">${esc(a.verdict)}</p></header>
    <div class="story">${a.story.split(/\n\s*\n/).map(p => `<p>${esc(p.trim())}</p>`).join('')}</div>
    ${a.moments?.length ? `<h4>Turning points</h4><ol class="moments">${a.moments.map(m => `<li><span>Day ${m.day}</span>${esc(m.text)}</li>`).join('')}</ol>` : ''}
    <div class="toll">${toll('azure')}${toll('red')}</div>
    <footer><small>${by}</small>${status}<span>${action}<button class="ghost" data-map="${b.focus}">Show on map</button><button class="replay-btn" data-replay="${b.id}" ${battleFrames(b) ? '' : 'disabled title="Fought before replays were recorded"'}>▶ Replay the battle</button></span></footer>`;
}

function bindChronicle() {
  $('#chronicleBtn').onclick = () => openChronicle();
  $('#replayCampaign').onclick = () => startReplay();
  $('#victoryReplay').onclick = () => startReplay();
  const pick = e => {
    const row = e.target.closest('[data-battle]');
    if (!row) return;
    const b = S.battles.find(x => x.id === +row.dataset.battle);
    if (b?.open) { $('#chronicleDialog').close(); flyTo(HEXES[b.hex].x, HEXES[b.hex].y, Math.max(R.cam.z, 0.75)); }
    else if (b) { if ($('#victoryDialog').open) $('#victoryDialog').close(); openChronicle(b.id); }
  };
  for (const id of ['#battles', '#chronList', '#victoryBattles']) $(id).addEventListener('click', pick);
  $('#chronBody').addEventListener('click', e => {
    const w = e.target.closest('[data-write]'), m = e.target.closest('[data-map]');
    if (w) writeAccount(S.battles.find(x => x.id === +w.dataset.write));
    if (e.target.closest('[data-settings]')) { $('#chronSettings').open = true; $('#apiKey').focus(); }
    if (m) { $('#chronicleDialog').close(); flyTo(HEXES[+m.dataset.map].x, HEXES[+m.dataset.map].y, Math.max(R.cam.z, 1)); }
    const rp = e.target.closest('[data-replay]');
    if (rp) startReplay({ battle: S.battles.find(x => x.id === +rp.dataset.replay) });
  });
  $('#battleNotice').addEventListener('click', e => {
    const r = e.target.closest('[data-read]');
    if (r) openChronicle(+r.dataset.read);
    if (r || e.target.closest('[data-dismiss]')) $('#battleNotice').hidden = true;
  });
  $('#markers').addEventListener('pointerdown', e => { if (e.target.closest('.marker.battle')) e.stopPropagation(); });
  $('#markers').addEventListener('click', e => { const m = e.target.closest('.marker.battle'); if (m) openChronicle(+m.dataset.battle); });
  $('#saveKey').onclick = () => {
    const k = $('#apiKey').value.trim();
    if (!k) return;
    CHRONICLE.setKey(k);
    renderChronicle();
    toast('API key saved in this browser');
  };
  $('#apiKey').addEventListener('keydown', e => { if (e.key === 'Enter') $('#saveKey').click(); });
  $('#forgetKey').onclick = () => { CHRONICLE.setKey(null); renderChronicle(); toast('API key forgotten'); };
  $('#autoChron').onchange = e => CHRONICLE.setAuto(e.target.checked);
}

let toastTimer = 0;
function toast(text, side) {
  const t = $('#toast');
  t.textContent = text;
  t.dataset.side = side || '';
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

// ---------------------------------------------------------------------------
// Minimap and scale bar

// The overview map, small in the corner or enlarged (the button in its
// corner). Formations are drawn as rectangles in the military fashion: a
// cross for foot, a diagonal for horse, a dot for guns, gold round the
// general's. In a replay it follows every move and traces each march.
const MINI = { canvas: null, base: null, scale: 1, big: false, trails: [] };
function initMinimap() {
  MINI.canvas = $('#minimap');
  try { MINI.big = localStorage.getItem('jhelum-marches-bigmap') === '1'; } catch { /* storage blocked */ }
  $('#miniExpand').onclick = () => {
    MINI.big = !MINI.big;
    try { localStorage.setItem('jhelum-marches-bigmap', MINI.big ? '1' : '0'); } catch { /* storage blocked */ }
    sizeMinimap(); drawMinimap();
  };
  sizeMinimap();
  window.addEventListener('resize', () => { if (MINI.big) { sizeMinimap(); drawMinimap(); } });
  const pick = e => {
    const r = MINI.canvas.getBoundingClientRect();
    const bx = (e.clientX - r.left) / r.width * BOARD_W, by = (e.clientY - r.top) / r.height * BOARD_H;
    const vw = R.view.clientWidth, vh = R.view.clientHeight;
    R.cam.x = vw / 2 - bx * R.cam.z; R.cam.y = vh / 2 - by * R.cam.z;
    clampCamera(); applyCamera();
  };
  let dragging = false;
  MINI.canvas.addEventListener('pointerdown', e => { dragging = true; MINI.canvas.setPointerCapture(e.pointerId); pick(e); });
  MINI.canvas.addEventListener('pointermove', e => { if (dragging) pick(e); });
  MINI.canvas.addEventListener('pointerup', () => { dragging = false; });
}
function sizeMinimap() {
  // Enlarged, it sits top left and stops short of the command bar.
  const fit = Math.min(R.view.clientWidth * .5, (R.view.clientHeight - 190) * BOARD_W / BOARD_H);
  const w = MINI.big ? Math.max(168, Math.round(Math.min(560, fit))) : 168, h = Math.round(w * BOARD_H / BOARD_W);
  $('.minimap-hud').classList.toggle('big', MINI.big);
  document.body.classList.toggle('bigmap', MINI.big);
  document.body.style.setProperty('--mini-w', `${w + 12}px`);
  $('#miniExpand').textContent = MINI.big ? '⤡' : '⤢';
  const label = MINI.big ? 'Shrink the overview map' : 'Enlarge the overview map';
  $('#miniExpand').title = label; $('#miniExpand').setAttribute('aria-label', label);
  MINI.canvas.width = w * 2; MINI.canvas.height = h * 2;
  MINI.canvas.style.width = `${w}px`; MINI.canvas.style.height = `${h}px`;
  MINI.scale = (w * 2) / BOARD_W;
  MINI.base = document.createElement('canvas');
  MINI.base.width = w * 2; MINI.base.height = h * 2;
  const ctx = MINI.base.getContext('2d');
  ctx.drawImage(R.relief, 0, 0, w * 2, h * 2);
  ctx.strokeStyle = '#3d6f78'; ctx.lineWidth = 2.2;
  for (const r of MAP.rivers) if (r.cls !== 'nala') for (const line of r.lines) {
    ctx.beginPath();
    line.forEach(([x, y], i) => ctx[i ? 'lineTo' : 'moveTo'](kmToPx(x) * MINI.scale, kmToPx(y) * MINI.scale));
    ctx.stroke();
  }
  // Enlarged, it shows the roads and names the main places too.
  if (MINI.big) {
    ctx.strokeStyle = '#8a6a44'; ctx.lineWidth = 1.6; ctx.globalAlpha = .75;
    for (const road of MAP.roads || []) for (const line of road.lines || []) {
      ctx.beginPath();
      line.forEach(([x, y], i) => ctx[i ? 'lineTo' : 'moveTo'](kmToPx(x) * MINI.scale, kmToPx(y) * MINI.scale));
      ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.font = '600 21px Newsreader, Georgia, serif'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 4; ctx.strokeStyle = '#efe4c4'; ctx.fillStyle = '#2b241a';
    for (const p of Object.values(MAP.places)) if (p.tier === 1) {
      const x = kmToPx(p.x) * MINI.scale + 16, y = kmToPx(p.y) * MINI.scale;
      ctx.strokeText(p.name, x, y); ctx.fillText(p.name, x, y);
    }
  }
  MINI.layer = null;
}
// One formation's symbol, centred on (x, y); k scales it with the map.
function miniSymbol(ctx, x, y, type, color, led, k) {
  const w = 13 * k, h = 9 * k, l = x - w / 2, t = y - h / 2;
  ctx.fillStyle = color; ctx.fillRect(l, t, w, h);
  ctx.strokeStyle = '#111'; ctx.lineWidth = 1.3 * k; ctx.beginPath();
  if (type === 'foot') { ctx.moveTo(l, t); ctx.lineTo(l + w, t + h); ctx.moveTo(l + w, t); ctx.lineTo(l, t + h); }
  else if (type === 'horse') { ctx.moveTo(l, t + h); ctx.lineTo(l + w, t); }
  ctx.stroke();
  if (type === 'guns') { ctx.beginPath(); ctx.arc(x, y, h * .24, 0, Math.PI * 2); ctx.fillStyle = '#111'; ctx.fill(); }
  ctx.strokeStyle = led ? '#f2d27c' : '#111'; ctx.lineWidth = (led ? 2.6 : 1.6) * k; ctx.strokeRect(l, t, w, h);
}
function drawMinimap() {
  if (!MINI.canvas) return;
  MINI.layer ??= Object.assign(document.createElement('canvas'), { width: MINI.canvas.width, height: MINI.canvas.height });
  const ctx = MINI.layer.getContext('2d'), s = MINI.scale, k = Math.min(1.5, Math.max(1, MINI.canvas.width / 600));
  ctx.drawImage(MINI.base, 0, 0);
  for (const key of STRONGPOINTS) {
    const h = HEXES[HEX_OF[key]], o = S.owners[key], d = 5 * k;
    ctx.save(); ctx.translate(h.x * s, h.y * s); ctx.rotate(Math.PI / 4);
    ctx.fillStyle = o ? SIDES[o].color : '#d8c58e'; ctx.strokeStyle = '#1b1a14'; ctx.lineWidth = 2 * k;
    ctx.fillRect(-d, -d, 2 * d, 2 * d); ctx.strokeRect(-d, -d, 2 * d, 2 * d); ctx.restore();
  }
  if (RP.active) for (const t of MINI.trails) {
    ctx.beginPath(); t.path.forEach((hex, i) => ctx[i ? 'lineTo' : 'moveTo'](HEXES[hex].x * s, HEXES[hex].y * s));
    ctx.strokeStyle = SIDES[t.side].color; ctx.globalAlpha = .85; ctx.lineWidth = 2.2 * k; ctx.lineJoin = ctx.lineCap = 'round';
    ctx.setLineDash([5 * k, 4 * k]); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
  }
  // Two formations in a hex make a stacked counter: the general's (or the
  // first) in front, the other's edge showing behind it.
  const stacks = new Map();
  for (const u of S.units) if (playerSees(u)) { if (!stacks.has(u.hex)) stacks.set(u.hex, []); stacks.get(u.hex).push(u); }
  for (const [hex, us] of stacks) {
    const h = HEXES[hex], front = us.find(ledBy) || us[0], x = h.x * s, y = h.y * s, o = 2.5 * k;
    for (const u of us) if (u !== front) {
      ctx.fillStyle = SIDES[u.side].color; ctx.strokeStyle = '#111'; ctx.lineWidth = 1.4 * k;
      ctx.fillRect(x - 6.5 * k + o, y - 4.5 * k - o, 13 * k, 9 * k); ctx.strokeRect(x - 6.5 * k + o, y - 4.5 * k - o, 13 * k, 9 * k);
    }
    miniSymbol(ctx, x, y, VARIANTS[front.variant].type, SIDES[front.side].color, ledBy(front), k);
  }
  drawMinimapView();
}
function drawMinimapView() {
  if (!MINI.layer) return;
  const ctx = MINI.canvas.getContext('2d'), s = MINI.scale;
  ctx.drawImage(MINI.layer, 0, 0);
  const x = -R.cam.x / R.cam.z * s, y = -R.cam.y / R.cam.z * s, w = R.view.clientWidth / R.cam.z * s, h = R.view.clientHeight / R.cam.z * s;
  ctx.strokeStyle = '#f6e3a8'; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, h);
}
function updateScaleBar() {
  const pxPerKm = PX_PER_KM * R.cam.z, km = [1, 2, 5, 10, 20, 50].find(k => k * pxPerKm >= 70) || 50;
  $('#scaleBar i').style.width = `${Math.round(km * pxPerKm)}px`;
  $('#scaleBar b').textContent = `${km} km`;
}

// ---------------------------------------------------------------------------
// Input

function bindInput() {
  const view = R.view, pointers = new Map();
  let drag = null, pinch = null, raf = 0, lastMove = null;
  view.addEventListener('pointerdown', e => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    view.focus({ preventScroll: true });
    pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointers.size === 1) drag = { x: e.clientX, y: e.clientY, cx: R.cam.x, cy: R.cam.y, moved: false, id: e.pointerId };
    else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: R.cam.z };
      drag = null;
    }
  });
  view.addEventListener('pointermove', e => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (pinch && pointers.size === 2) {
      const [a, b] = [...pointers.values()], r = view.getBoundingClientRect();
      zoomAt(pinch.z * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d, (a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top);
      return;
    }
    if (drag && drag.id === e.pointerId) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) > 5) { drag.moved = true; V.dragging = true; view.classList.add('dragging'); view.setPointerCapture(e.pointerId); $('#tooltip').hidden = true; }
      if (drag.moved) { R.cam.x = drag.cx + dx; R.cam.y = drag.cy + dy; clampCamera(); applyCamera(); return; }
    }
    lastMove = e;
    if (!raf) raf = requestAnimationFrame(() => {
      raf = 0;
      const [bx, by] = screenToBoard(lastMove.clientX, lastMove.clientY), hex = pixelToHex(bx, by);
      if (hex !== V.hoverHex) { V.hoverHex = hex; R.hover = hex; redrawOverlay(); renderInspector(); }
      updateTooltip(lastMove.clientX, lastMove.clientY);
    });
  });
  const end = e => {
    pointers.delete(e.pointerId);
    if (pinch && pointers.size < 2) { pinch = null; drag = null; return; }
    if (!drag || drag.id !== e.pointerId) return;
    const wasDrag = drag.moved;
    drag = null; V.dragging = false; view.classList.remove('dragging');
    if (!wasDrag && e.type === 'pointerup') {
      const [bx, by] = screenToBoard(e.clientX, e.clientY), hex = pixelToHex(bx, by);
      // Touch has no hover: the first tap on an order previews it, the second confirms.
      if (e.pointerType === 'touch' && isOrderHex(hex) && V.pendingHex !== hex) {
        V.pendingHex = hex; V.hoverHex = hex; R.hover = hex;
        redrawOverlay(); renderInspector(); updateTooltip(e.clientX, e.clientY);
        return;
      }
      V.pendingHex = -1;
      onHexClick(hex, e.shiftKey);
    }
  };
  view.addEventListener('pointerup', end);
  view.addEventListener('pointercancel', end);
  view.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { V.hoverHex = -1; R.hover = -1; $('#tooltip').hidden = true; redrawOverlay(); renderInspector(); } });
  view.addEventListener('contextmenu', e => { e.preventDefault(); select(null); });
  view.addEventListener('wheel', e => {
    e.preventDefault();
    const r = view.getBoundingClientRect(), k = e.ctrlKey ? 0.012 : 0.0018;
    zoomAt(R.cam.z * Math.exp(-e.deltaY * k), e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });
  view.addEventListener('dblclick', e => {
    const r = view.getBoundingClientRect();
    zoomAt(R.cam.z * 1.7, e.clientX - r.left, e.clientY - r.top);
  });
  window.addEventListener('resize', () => { clampCamera(); applyCamera(); });
  document.addEventListener('keydown', e => {
    if (e.target.closest('input, select, textarea, dialog[open]') || e.metaKey || e.altKey) return;
    const k = e.key.toLowerCase(), pan = { arrowleft: [1, 0], arrowright: [-1, 0], arrowup: [0, 1], arrowdown: [0, -1] }[k];
    if (pan) { e.preventDefault(); R.cam.x += pan[0] * 140; R.cam.y += pan[1] * 140; clampCamera(); applyCamera(); }
    else if (k === '+' || k === '=') zoomAt(R.cam.z * 1.25, view.clientWidth / 2, view.clientHeight / 2);
    else if (k === '-') zoomAt(R.cam.z / 1.25, view.clientWidth / 2, view.clientHeight / 2);
    else if (k === '0') fitBoard();
    else if (k === 'n') selectNext();
    else if (k === 'e') doEndTurn();
    else if (k === 'u' || (k === 'z' && e.ctrlKey)) { if (humanTurn() && undoMove()) toast('March undone'); }
    else if (k === 'f') doForce();
    else if (k === 'g') doRide();
    else if (k === 'k') doFortify();
    else if (k === 'm') doMine();
    else if (k === 'b') startFerry();
    else if (k === 'escape') { if (RP.active) exitReplay(); else { V.ferryPick = null; select(null); } }
    else if (k === ' ' && RP.active && !e.target.closest('button')) { e.preventDefault(); $('#rpPlay').click(); }
    else if (k === '?' || k === 'h') $('#helpDialog').showModal();
    else if (k === 'c' && !e.ctrlKey) openChronicle();
  });
}

function bindControls() {
  $('#endTurnBtn').onclick = doEndTurn;
  $('#nextBtn').onclick = selectNext;
  $('#undoBtn').onclick = () => { if (humanTurn() && undoMove()) toast('March undone'); };
  $('#forceBtn').onclick = doForce;
  $('#rideBtn').onclick = doRide;
  const acts = $('#unitActions');
  for (const ev of ['pointerdown', 'pointerup', 'wheel']) acts.addEventListener(ev, e => e.stopPropagation());
  acts.addEventListener('click', onAction);
  $('#inspector').addEventListener('click', e => { if (e.target.closest('#ferryBtn')) startFerry(); if (e.target.closest('#fortifyBtn')) doFortify(); if (e.target.closest('#mineBtn')) doMine(); });
  $('#zoomIn').onclick = () => zoomAt(R.cam.z * 1.3, R.view.clientWidth / 2, R.view.clientHeight / 2);
  $('#zoomOut').onclick = () => zoomAt(R.cam.z / 1.3, R.view.clientWidth / 2, R.view.clientHeight / 2);
  $('#fitBtn').onclick = fitBoard;
  $('#helpBtn').onclick = () => $('#helpDialog').showModal();
  $('#newBtn').onclick = () => showStart();
  $('#panelToggle').onclick = () => document.body.classList.toggle('panel-open');
  document.querySelectorAll('dialog [data-close]').forEach(b => b.onclick = () => b.closest('dialog').close());
  initDispatches();
  for (const id of ['#roster', '#objectives', '#powers']) $(id).addEventListener('click', e => {
    const row = e.target.closest('[data-unit], [data-hex]');
    if (!row) return;
    const hex = row.dataset.unit ? unitById(row.dataset.unit)?.hex : +row.dataset.hex;
    if (row.dataset.unit && humanTurn()) select(row.dataset.unit);
    if (hex !== undefined) flyTo(HEXES[hex].x, HEXES[hex].y, Math.max(R.cam.z, 0.75));
  });
  for (const [id, cls] of [['#layerRealms', 'hide-realms'], ['#layerGrid', 'hide-grid'], ['#layerLabels', 'hide-labels']]) {
    $(id).onchange = e => R.view.classList.toggle(cls, !e.target.checked);
  }
  $('#followAI').onchange = e => { V.followAI = e.target.checked; };
  $('#layerSupply').onchange = e => { V.showSupply = e.target.checked; redrawOverlay(); };
  $('#victoryNew').onclick = () => { $('#victoryDialog').close(); showStart(); };
  bindChronicle();
  bindReplay();
}

// ---------------------------------------------------------------------------
// Start, continue, and boot

// The opening screen: pick a map (each its own scenario), then a side.
// The opening screen: a campaign map of the Punjab with a marker for each
// battle; a battle fought in more than one mode (historic: the armies, numbers
// and days as recorded; open: an earlier start, evenly matched) offers both.
// The wars the battles belong to, in order; a scenario names its own `era`
// or falls in by its year.
const ERAS = [
  { id: 'misl', name: 'The misls', years: '1748–1798' },
  { id: 'ranjit', name: 'Rise of Ranjit Singh', years: '1799–1838' },
  { id: 'civil', name: 'Sikh civil war', years: '1839–1845' },
  { id: 'asw1', name: 'First Anglo-Sikh War', years: '1845–46' },
  { id: 'asw2', name: 'Second Anglo-Sikh War', years: '1848–49' },
  { id: 'rebellion', name: '1857', years: 'The rebellion' },
];
const eraOf = scn => scn.era || (scn.year < 1799 ? 'misl' : scn.year < 1839 ? 'ranjit' : scn.year < 1845 ? 'civil' : scn.year < 1847 ? 'asw1' : scn.year < 1850 ? 'asw2' : 'rebellion');
function renderStart() {
  const groupOf = id => SCENARIOS[id].group || id, current = groupOf(MAP_ID);
  const groups = [];
  for (const [id, scn] of Object.entries(SCENARIOS)) if (!groups.some(g => g.group === groupOf(id))) groups.push({ group: groupOf(id), title: scn.title, year: scn.year, era: eraOf(scn) });
  const go = id => { if (id === MAP_ID) return; const url = new URL(location.href); url.searchParams.set('map', id); location.href = url.toString(); };
  // A battle's seal opens its `primary` version, else its historic one.
  const pickGroup = group => { const ids = Object.keys(SCENARIOS).filter(id => groupOf(id) === group); go(ids.find(id => SCENARIOS[id].primary) || ids.find(id => SCENARIOS[id].mode === 'historic') || ids[0]); };
  // The era tabs filter the map's seals and the list; the era of the battle
  // on the board is shown first.
  V.era ||= eraOf(SCN);
  const drawPick = () => {
    const inEra = groups.filter(g => g.era === V.era), era = ERAS.find(e => e.id === V.era);
    $('#mapPick').innerHTML = `<div class="era-pick" role="tablist">${ERAS.map(e => { const n = groups.filter(g => g.era === e.id).length; return `<button role="tab" class="era ${e.id === V.era ? 'active' : ''}${n ? '' : ' empty'}" data-era="${e.id}" aria-selected="${e.id === V.era}"><b>${e.name}</b><small>${e.years}${n ? ` · ${n}` : ''}</small></button>`; }).join('')}</div>`
      + CAMPAIGN_MAP.draw(groups, current, V.era)
      + `<div class="cm-list">${inEra.length ? inEra.map(g => `<button class="cm-chip ${g.group === current ? 'active' : ''}" data-group="${g.group}">${esc(g.title)}</button>`).join('') : `<p class="cm-none">No battles of ${esc(era.name)} have been surveyed yet.</p>`}</div>`;
    $('#mapPick').querySelectorAll('[data-group]').forEach(b => {
      b.onclick = () => pickGroup(b.dataset.group);
      b.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickGroup(b.dataset.group); } };
    });
    $('#mapPick').querySelectorAll('[data-era]').forEach(b => b.onclick = () => { V.era = b.dataset.era; drawPick(); });
  };
  drawPick();
  const modes = Object.keys(SCENARIOS).filter(id => groupOf(id) === current).sort((a, b) => !!SCENARIOS[b].primary - !!SCENARIOS[a].primary || (SCENARIOS[a].mode === 'open') - (SCENARIOS[b].mode === 'open'));
  $('#modePick').innerHTML = modes.length < 2 ? '' : modes.map(id => {
    const m = SCENARIOS[id].mode || 'historic';
    const sc = SCENARIOS[id], label = sc.modeLabel || (m === 'historic' ? 'Historic' : 'Open campaign'), note = sc.modeNote || (m === 'historic' ? 'the armies, numbers and days as recorded' : 'from an earlier start, evenly matched');
    return `<button class="mode ${id === MAP_ID ? 'active' : ''}" data-mode="${id}"><b>${label}</b><small>${note}</small></button>`;
  }).join('');
  $('#modePick').querySelectorAll('[data-mode]').forEach(b => b.onclick = () => go(b.dataset.mode));
  $('#startMeta').textContent = [SCN.year, SCN.region].filter(Boolean).join(' · ');
  $('#startTitle').textContent = SCN.title;
  $('#startLede').textContent = SCN.blurb;
  $('#sidePick').innerHTML = ['azure', 'red'].map(side => {
    const sd = SCN.sides[side];
    return `<button data-start="${side}" class="pick ${side}"><small>Play as</small><b>${esc(sd.name)}</b><span>${esc(sd.pitch)}</span><footer><em>${esc(sd.tag)}</em><i>Take command</i></footer></button>`;
  }).join('');
  $('#sidePick').querySelectorAll('[data-start]').forEach(b => b.onclick = () => briefThenStart(b.dataset.start, $('#opponent').value === 'ai'));
}
function showStart() {
  exitReplay();
  renderStart();
  const d = $('#startDialog'), saved = S && !S.winner && S.log.length > 1;
  $('#continueBtn').hidden = !saved;
  if (saved) $('#continueBtn').querySelector('small').textContent = `Round ${S.round} · ${SIDES[S.player].name}${Object.values(S.ai).some(Boolean) ? ' vs computer' : ' · hot-seat'}`;
  d.showModal();
  $('#mapPick .active')?.focus();
}
// The rules in brief, shown once a side is chosen and before the map opens,
// until the player asks not to see them again.
const RULES_KEY = 'jhelum-marches-rules-hidden';
function briefThenStart(player, ai) {
  let hidden = false;
  try { hidden = localStorage.getItem(RULES_KEY) === '1'; } catch { /* storage blocked */ }
  if (hidden) { startCampaign(player, ai); return; }
  const sd = SCN.sides[player], goal = $('#rulesGoal');
  goal.className = `rules-goal ${player}`;
  goal.innerHTML = `<b>${esc(sd.name)}</b>${esc(sd.pitch)}<em>${esc(sd.tag)}</em>`;
  $("#rulesRound").textContent = SCN.clock && SCN.clock.hours < 24 ? `Each round is ${SCN.clock.hours} hours.` : 'Each round is one day.';
  $('#rulesHide').checked = false;
  const d = $('#rulesDialog');
  $('#rulesBegin').onclick = () => {
    if ($('#rulesHide').checked) try { localStorage.setItem(RULES_KEY, '1'); } catch { /* storage blocked */ }
    d.close();
    startCampaign(player, ai);
  };
  $('#rulesManual').onclick = () => $('#helpDialog').showModal();
  d.showModal();
  $('#rulesBegin').focus();
}
function startCampaign(player, ai) {
  clearSave();
  for (const node of R.unitEls.values()) node.remove();
  R.unitEls.clear();
  newCampaign({ player, ai, fog: $('#fogPick').value === 'on' });
  V.started = true;
  log(FIRST, (SCN.goal ? `${SCN.title}, ${SCN.year}: the campaign opens. ${SIDES[SCN.goal.attacker].name} must ${SCN.goal.short[0].toLowerCase() + SCN.goal.short.slice(1)} before ${SCN.clock ? roundName(ROUND_LIMIT) + ' is out' : `day ${ROUND_LIMIT} is out`}.` : 'The banners are raised. Hold the strongpoints to earn war points; win the local chiefs to raise their levies.' ));
  save();
  $('#startDialog').close();
  refresh();
  const home = S.units.filter(u => u.side === player), cx = home.reduce((s, u) => s + HEXES[u.hex].x, 0) / home.length, cy = home.reduce((s, u) => s + HEXES[u.hex].y, 0) / home.length;
  flyTo(cx, cy, 1.1, 700).then(() => UI.banner());
  if (S.ai[S.turn]) { V.busy = true; runAI(S.turn).finally(() => { V.busy = false; refresh(); }); }
}

function chosenMap() {
  const asked = new URLSearchParams(location.search).get('map');
  if (asked && SCENARIOS[asked]) return asked;
  try { const last = localStorage.getItem('jhelum-marches-map'); if (last && SCENARIOS[last]) return last; } catch { /* storage blocked */ }
  return Object.keys(SCENARIOS)[0];
}
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const tag = document.createElement('script');
    tag.src = src; tag.onload = resolve; tag.onerror = () => reject(new Error(`could not load ${src}`));
    document.head.append(tag);
  });
}

async function boot() {
  const id = chosenMap();
  try { localStorage.setItem('jhelum-marches-map', id); } catch { /* storage blocked */ }
  await loadScript(`maps/${SCENARIOS[id].map || id}.js?v=49`);
  applyScenario(id);
  // The field manual quotes distances and march points for this map's hex size.
  const km = k => k >= 1 ? `${+k.toFixed(1)} km` : `${Math.round(k * 1000)} m`, mpOf = v => Math.round(VARIANTS[v].mp * MARCH_SCALE * PACE);
  const hexKm = MAP.hexKm || 1, scale = { hex: km(hexKm), foot: mpOf('Matchlockmen'), horse: `${mpOf('Lancers')}–${mpOf('Irregular Sowars')}`, attack: ATTACK_MP, range: km(rangeOf('Light Field Gun') * hexKm), rangeHexes: ['', 'one', 'two', 'three', 'four', 'five', 'six'][rangeOf('Light Field Gun')] };
  document.querySelectorAll('[data-scale]').forEach(e => { e.textContent = scale[e.dataset.scale]; });
  document.title = `${SCN.title} — ${SCN.year}`;
  $('#brandTitle').textContent = SCN.title;
  $('#brandSub').textContent = `${SCN.region} — ${SCN.year}`;
  await buildMapModel();
  indexPlaces();
  initRenderer();
  initMinimap();
  bindInput();
  bindControls();
  const resume = () => {
    V.started = true;
    $('#startDialog').close();
    refresh();
    if (S.ai[S.turn] && !S.winner && !V.busy) { V.busy = true; runAI(S.turn).finally(() => { V.busy = false; refresh(); }); }
  };
  $('#continueBtn').onclick = resume;
  // Escape on the opening screen continues a saved campaign, or does nothing
  // if there is none yet (there would be no campaign to return to).
  $('#startDialog').addEventListener('cancel', e => {
    if (V.started) return;
    e.preventDefault();
    if (!$('#continueBtn').hidden) resume();
  });
  const resumed = load();
  if (!resumed) newCampaign();
  fitBoard();
  refresh();
  document.fonts?.ready.then(() => { measureLabels(); layoutLabels(); });
  document.body.classList.remove('loading');
  showStart();
  window.__jm = { get S() { return S; }, HEXES, MAP, endTurn, runAI, attack, moveUnit, reachable, V, R, newCampaign, refresh };
}

boot().catch(err => {
  console.error(err);
  document.body.classList.remove('loading');
  $('#loadError').hidden = false;
  $('#loadError').textContent = `The survey could not be drawn: ${err.message}`;
});
