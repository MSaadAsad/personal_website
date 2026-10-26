'use strict';
// Battle chronicles. When an engagement closes (game.js: closeBattles), its
// recorded events are turned into a plain-facts brief and Claude writes the
// account: a name for the battle or siege, a verdict, a short story and the
// moments that decided it. Claude is called straight from the browser with
// the player's own API key, which is kept only in this browser's storage.
// Without a key the chronicle falls back to field notes built from the same
// facts, so the game never depends on the network.

const CHRONICLE = (() => {
  const SDK_URL = 'https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.133.0/+esm';
  const MODEL = 'claude-opus-5-5';
  const KEY_STORE = 'jhelum-marches-anthropic-key', AUTO_STORE = 'jhelum-marches-chronicle-auto';
  let sdk = null, queue = Promise.resolve();

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch { /* storage blocked */ } },
  };
  const key = () => store.get(KEY_STORE) || '';
  const auto = () => store.get(AUTO_STORE) !== 'off';

  // ---- The brief: what happened, in order, in plain words -----------------

  const OUTCOME = { rout: 'smashed', hit: 'struck', standoff: 'fought to a bloody standstill with', repulse: 'was thrown back by' };
  const missed = melee => melee ? 'attacked, but made no impression on' : 'fired on, but the shot fell short of';
  const COMPASS = ['east', 'north-east', 'north', 'north-west', 'west', 'south-west', 'south', 'south-east'];
  const sideName = s => SIDES[s].name;
  const unitText = u => `${u.name} (${u.variant}${u.general ? `, led by ${u.general}` : ''})`;
  const strength = u => men(Math.max(0, u.hp));
  const placeOf = key => placeTitle(key);
  // Compass direction from one hex to another (map north is up).
  function bearing(from, to) {
    const a = Math.atan2(HEXES[from].y - HEXES[to].y, HEXES[to].x - HEXES[from].x);
    return COMPASS[(Math.round(a / (Math.PI / 4)) + 8) % 8];
  }
  // "at Khari Sharif (broken hills, 292 m)" or "on open plain 4 km south-east of Jatlan (247 m)".
  function ground(hex) {
    const h = HEXES[hex], kind = [TERRAIN[h.terrain].name.toLowerCase(), h.cover && COVER[h.cover].name.toLowerCase()].filter(Boolean).join(', ');
    const key = h.place;
    if (key && !(SCN.anonymous || []).includes(key)) return `at ${placeOf(key)} (${kind}, ${h.elev} m)`;
    const near = battlePlace(hex);
    const rel = near && near.dist ? ` ${near.dist * HEX_KM} km ${bearing(HEX_OF[near.key], hex)} of ${placeOf(near.key)}` : '';
    return `on ${kind}${rel} (${h.elev} m)`;
  }
  function eventLine(e) {
    const r = `Round ${e.round}`;
    switch (e.t) {
      case 'combat': {
        const rise = HEXES[e.hex].elev - HEXES[e.from].elev, water = HEXES[e.from].river[dirTo(e.from, e.hex)];
        const how = [e.melee ? 'in melee' : 'at range', `coming from the ${bearing(e.hex, e.from)}`];
        if (Math.abs(rise) >= 60) how.push(rise > 0 ? `uphill (${rise} m)` : `downhill (${-rise} m)`);
        if (water) how.push(`across a ${RIVER_CLASS[water === 'ghat' ? 'major' : water]?.name || 'river'}`);
        const loss = [e.lostDef ? `${e.def.name} lost ${e.lostDef} (now ${strength(e.def)})` : `${e.def.name} lost nothing`];
        if (e.melee) loss.push(e.lostAtt ? `${e.att.name} lost ${e.lostAtt} (now ${strength(e.att)})` : `${e.att.name} lost nothing`);
        const verb = e.outcome === 'miss' ? missed(e.melee) : OUTCOME[e.outcome];
        return `${r} · ${sideName(e.att.side)}: ${unitText(e.att)} ${verb} ${unitText(e.def)} ${ground(e.hex)}, ${how.join(', ')}. ${loss.join('; ')}.`;
      }
      case 'breach': return `${r} · The guns of the ${e.unit.name} breached the walls of ${placeOf(e.place)} (${e.left ? `${e.left} levels of wall still standing` : 'the walls are down'}).`;
      case 'destroyed': return `${r} · ${unitText(e.unit)} of the ${sideName(e.side)} was destroyed.`;
      case 'surrender': return `${r} · ${unitText(e.unit)} of the ${sideName(e.side)} was ${e.why === 'surrounded' ? 'surrounded and laid down its arms' : 'cut off and surrendered'}.`;
      case 'fallback': return `${r} · ${unitText(e.unit)} fell back in disorder ${ground(e.hex)} (${strength(e.unit)}).`;
      case 'advance': return `${r} · ${e.unit.name} pressed forward ${ground(e.hex).replace(/^(at|on) /, 'onto ')}.`;
      case 'capture': return `${r} · ${e.unit.name} took ${placeOf(e.place)} for the ${sideName(e.side)}${e.from ? ` from the ${sideName(e.from)}` : ''}.`;
      case 'general': return `${r} · ${e.name}, general of the ${sideName(e.side)}, was taken prisoner.`;
      default: return null;
    }
  }
  // The same events as short sentences for the field notes.
  function plainLine(e) {
    switch (e.t) {
      case 'combat': return e.outcome === 'rout' ? `The ${e.att.name} smashed the ${e.def.name}${e.def.hp <= 0 ? '' : `, leaving it ${men(e.def.hp)} strong`}.` : null;
      case 'breach': return `The guns of the ${e.unit.name} ${e.left ? 'breached the walls' : 'brought the last of the walls down'} at ${placeOf(e.place)}.`;
      case 'destroyed': return `The ${e.unit.name} was destroyed.`;
      case 'surrender': return `The ${e.unit.name} was ${e.why === 'surrounded' ? 'surrounded and laid down its arms' : 'cut off and surrendered'}.`;
      case 'capture': return `The ${e.unit.name} took ${placeOf(e.place)}.`;
      case 'general': return `${e.name} was taken prisoner.`;
      default: return null;
    }
  }
  function brief(b) {
    const evs = S.events.filter(e => e.battle === b.id), g = s => GENERALS[s];
    const result = b.victor ? `${sideName(b.victor)} came off better${b.kind === 'siege' && b.victor === b.defender ? ' (the place held)' : ''}` : 'indecisive';
    return [
      `CAMPAIGN: ${SCN.title}, ${SCN.year}. ${SCN.region}.`,
      `BACKGROUND: ${SCN.blurb}`,
      `SIDES: ${['azure', 'red'].map(s => `${sideName(s)}, commanded by ${g(s).name} (${g(s).title})`).join('; ')}.`,
      `ENGAGEMENT: provisional name "${b.name}" (${b.kind}). Centred ${ground(b.focus)}. Rounds ${b.first}–${b.last} (each round is about a day). The ${sideName(b.attacker)} struck first.`,
      `RESULT BY THE RULES: ${result}. Men lost (round figures; a full formation is about ${MEN_PER_FORMATION.toLocaleString('en')} men): ${sideName('azure')} ${men(b.lost.azure)}, ${sideName('red')} ${men(b.lost.red)}. Formations destroyed or surrendered: ${sideName('azure')} ${b.broken.azure}, ${sideName('red')} ${b.broken.red}.${S.winner ? ' The campaign ended with this engagement.' : ''}`,
      'EVENTS IN ORDER:',
      ...evs.map(eventLine).filter(Boolean),
    ].join('\n');
  }

  // ---- Claude ---------------------------------------------------------------

  const SYSTEM = `You are the chronicler of a historical strategy game set on the Jhelum frontier of the Punjab hills. After each engagement you receive the facts of what happened, as recorded by the game's rules, and you write the account that goes into the campaign chronicle.

Write it as a historian telling the story of the fight: clear, vivid, period-appropriate English prose, past tense. The reader has just played the battle, so make it feel like their battle: who struck first, how the fight turned, what decided it and what it cost.

Stay strictly within the facts. Do not invent people, named officers, dates, weather, or events that are not in the brief. You may describe the ground from the terrain given, and draw on the campaign background for context. Strength is given in round figures of men (a full formation is about 1,000). Use them as the approximations they are ("some 400 men", "nearly a thousand"), and never give a more precise count. The dice and modifiers are the game's abstraction: never mention dice, rounds as game turns, or rules. Call a round "a day" or "the next morning".

Name the engagement. Keep the provisional name unless it misdescribes the fight; it must contain the same place name. You may change only the form, for example "Siege of", "Storming of", "Assault on", "Battle of", "Action at", "Rout at", "Skirmish at", and keep any ordinal ("Second ...").`;

  const SCHEMA = {
    type: 'object',
    additionalProperties: false,
    required: ['name', 'verdict', 'story', 'moments'],
    properties: {
      name: { type: 'string', description: 'The name of the battle or siege, e.g. "Siege of Mangla Fort".' },
      verdict: { type: 'string', description: 'One short line on the outcome, e.g. "Dogra victory: Sukhchainpur falls".' },
      story: { type: 'string', description: 'The account: two or three paragraphs, 120 to 220 words in all, separated by blank lines.' },
      moments: {
        type: 'array',
        description: 'Three to five turning points, in order.',
        items: {
          type: 'object', additionalProperties: false, required: ['day', 'text'],
          properties: { day: { type: 'integer', description: 'The round it happened in.' }, text: { type: 'string', description: 'One sentence.' } },
        },
      },
    },
  };

  async function claude(b, facts) {
    sdk ||= import(SDK_URL).catch(err => { sdk = null; throw new Error(`could not load the Claude SDK (${err.message})`); });
    const { default: Anthropic } = await sdk;
    const client = new Anthropic({ apiKey: key(), dangerouslyAllowBrowser: true });
    let msg;
    try {
      msg = await client.beta.messages.create({
        model: MODEL,
        max_tokens: 8000,
        // If a safety classifier declines, Anthropic retries on its recommended fallback model.
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        output_config: { effort: 'low', format: { type: 'json_schema', schema: SCHEMA } },
        system: SYSTEM,
        messages: [{ role: 'user', content: facts }],
      });
    } catch (err) {
      const why = { 401: 'the API key was rejected', 403: 'this API key may not use that model', 429: 'rate limited; try again shortly', 529: 'Claude is overloaded; try again shortly' }[err?.status];
      throw new Error(why || err?.error?.error?.message || err?.message || 'request failed');
    }
    if (msg.stop_reason === 'refusal') throw new Error('Claude declined to write this account');
    if (msg.stop_reason === 'max_tokens') throw new Error('the account was cut off');
    const text = msg.content.find(c => c.type === 'text')?.text;
    const out = JSON.parse(text);
    // The name must stay tied to the real place.
    const place = b.place.toLowerCase();
    if (!out.name?.toLowerCase().includes(place)) out.name = b.name;
    return { ...out, by: 'claude', model: msg.model || MODEL };
  }

  // ---- Field notes: the same facts without Claude ----------------------------

  function fieldNotes(b) {
    const evs = S.events.filter(e => e.battle === b.id), A = sideName(b.attacker), D = sideName(b.defender);
    const days = b.last - b.first + 1, first = evs.find(e => e.t === 'combat');
    const turns = evs.filter(e => plainLine(e));
    const story = [
      `On day ${b.first} the ${A} fell upon the ${D} ${ground(b.focus).replace(/ \([^)]*\)$/, '')}${first ? `, the ${first.att.name} leading against the ${first.def.name}` : ''}. ${b.kind === 'siege' ? `The siege lasted ${days} days.` : days > 1 ? `The fighting went on for ${days} days.` : 'It was over within the day.'}`,
      turns.slice(0, 8).map(plainLine).join(' '),
      `The ${sideName('azure')} lost ${men(b.lost.azure)} and the ${sideName('red')} ${men(b.lost.red)}. ${verdictOf(b)}.`,
    ].filter(Boolean);
    // Turning points: what changed hands or broke first, then the heaviest blows.
    const rank = { capture: 0, general: 0, breach: 1, surrender: 1, destroyed: 2, combat: 3 };
    const moments = turns.map((e, i) => ({ e, i })).sort((a, c) => rank[a.e.t] - rank[c.e.t] || a.i - c.i).slice(0, 5)
      .sort((a, c) => a.i - c.i).map(({ e }) => ({ day: e.round, text: plainLine(e) }));
    return { name: b.name, verdict: verdictOf(b), story: story.join('\n\n'), moments, by: 'notes' };
  }
  function verdictOf(b) {
    if (b.took) return `${SIDES[b.victor].adj} victory: ${placeOf(b.took)} taken`;
    if (b.kind === 'siege' || b.kind === 'assault') return S.winner && b.last >= S.round - 1 ? `${b.place} still held when the season closed` : `${b.place} held by the ${sideName(b.defender)}`;
    return b.victor ? `${SIDES[b.victor].adj} victory` : 'Indecisive';
  }

  // Requests run one at a time, in the order the battles ended. The brief is
  // taken now, while the campaign it describes is still the one in play.
  function write(b) {
    const facts = brief(b), job = queue.then(() => claude(b, facts));
    queue = job.catch(() => {});
    return job;
  }

  return {
    MODEL,
    key, setKey: k => store.set(KEY_STORE, k?.trim() || null),
    auto, setAuto: on => store.set(AUTO_STORE, on ? null : 'off'),
    brief, fieldNotes, verdictOf, write,
  };
})();
