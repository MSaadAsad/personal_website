'use strict';
// Portraits of the generals, drawn in profile after the court miniatures of
// the Punjab hills and Lahore (and, for the British, after the engraved
// portraits of the day): the head turned to the left on a flat ground inside
// ruled borders. They are put together from a few parts (headwear, beard,
// coat) and dressed after contemporary portraits where they exist. A general
// with no entry here is dressed after his army's standard.

const FACE_SKIN = { punjabi: '#b98058', pathan: '#c48e64', dogra: '#b4805a', british: '#e2ae8e', tanned: '#d29c78', sepoy: '#9a6646' };
const HAIR = { black: '#1d1712', dark: '#2e211a', brown: '#5a3b24', grey: '#8d8780', white: '#e6e1d8', salt: '#57514b' };

// [name pattern, look]. hat: dastar (the Sikh turban), pagri (a wound
// turban), kulla (a turban round a peaked cap), cocked (a general's
// bicorne), forage (a peaked cap), bare. beard: full, medium, short,
// whiskers, none. mo (moustache): plain, grand, none. nose: long (the
// miniature line, the default for Indian sitters), aquiline or short.
// ground: the flat colour behind the sitter, else one for his headwear.
const GENERAL_LOOKS = [
  [/Mir Mannu|Muin-ul-Mulk/, { skin: 'pathan', hat: 'pagri', hatC: '#efe6d0', beard: 'short', hair: 'black', mo: 'plain', coat: 'choga', coatC: '#2f5d3a', kalgi: true, pearls: true }],
  [/Ahmad Shah Durrani/, { skin: 'pathan', hat: 'kulla', hatC: '#efe9dd', capC: '#8a2a24', beard: 'medium', hair: 'black', mo: 'plain', coat: 'choga', coatC: '#5a2f6b', kalgi: true, pearls: true, age: 1 }],
  [/Ranjit Singh/, { w: 0.95, skin: 'punjabi', hat: 'dastar', hatC: '#efe5cc', beard: 'full', hair: 'grey', mo: 'plain', coat: 'angarkha', coatC: '#e7d3a1', kalgi: true, pearls: true, blind: true, pox: true, age: 1 }],
  [/Hari Singh Nalwa/, { shield: true, w: 1.07, skin: 'punjabi', hat: 'dastar', hatC: '#cf8a2e', beard: 'full', hair: 'black', mo: 'plain', coat: 'mail', coatC: '#8e918c', kalgi: true }],
  [/Sher Singh Attariwala/, { skin: 'punjabi', hat: 'dastar', hatC: '#34508a', beard: 'full', hair: 'black', mo: 'plain', coat: 'angarkha', coatC: '#8a2f2a', kalgi: true }],
  [/Kanwar Sher Singh/, { w: 1.05, skin: 'punjabi', hat: 'dastar', hatC: '#d9a23e', beard: 'full', hair: 'black', mo: 'plain', coat: 'angarkha', coatC: '#5a2f6b', kalgi: true, pearls: true }],
  [/Surat Singh/, { skin: 'punjabi', hat: 'dastar', hatC: '#2f4a7a', beard: 'full', hair: 'black', mo: 'plain', coat: 'angarkha', coatC: '#b68f4a' }],
  [/Attar Singh/, { skin: 'punjabi', hat: 'dastar', hatC: '#efe5cc', beard: 'full', hair: 'salt', mo: 'plain', coat: 'angarkha', coatC: '#2f5a4a', kalgi: true, age: 1 }],
  [/Charat Singh/, { shield: true, w: 1.03, skin: 'punjabi', hat: 'dastar', hatC: '#283a6c', beard: 'full', hair: 'black', mo: 'plain', coat: 'angarkha', coatC: '#a8452e' }],
  [/Jhanda Singh/, { shield: true, skin: 'punjabi', hat: 'dastar', hatC: '#1f2c55', beard: 'full', hair: 'black', mo: 'plain', coat: 'angarkha', coatC: '#6b4a2a' }],
  [/Bhangi Sardars|Desa Singh/, { shield: true, skin: 'punjabi', hat: 'dastar', hatC: '#24346a', beard: 'full', hair: 'dark', mo: 'plain', coat: 'mail', coatC: '#8e918c' }],
  [/Ranjodh Singh/, { skin: 'punjabi', hat: 'dastar', hatC: '#cf8d33', beard: 'full', hair: 'black', mo: 'plain', coat: 'angarkha', coatC: '#8b2b2b', kalgi: true }],
  [/Tej Singh/, { w: 0.96, skin: 'punjabi', hat: 'dastar', hatC: '#ebe0c6', beard: 'full', hair: 'black', mo: 'plain', coat: 'angarkha', coatC: '#3c4f7a', kalgi: true, pearls: true }],
  [/Lal Singh/, { w: 0.97, skin: 'dogra', hat: 'pagri', hatC: '#e0a23a', beard: 'medium', hair: 'black', mo: 'plain', coat: 'angarkha', coatC: '#efe6d0', kalgi: true, pearls: true }],
  [/Gulab Singh/, { w: 1.08, skin: 'dogra', hat: 'pagri', hatC: '#bf352d', beard: 'short', hair: 'black', mo: 'grand', coat: 'angarkha', coatC: '#efe6d0', kalgi: true, pearls: true, age: 1 }],
  [/Hari Chand/, { skin: 'dogra', hat: 'pagri', hatC: '#d7882f', beard: 'short', hair: 'black', mo: 'grand', coat: 'angarkha', coatC: '#7a3a24' }],
  [/Labh Singh/, { skin: 'dogra', hat: 'pagri', hatC: '#b9342b', beard: 'none', hair: 'black', mo: 'grand', coat: 'angarkha', coatC: '#e4d6b4' }],
  [/Diwan Chand/, { skin: 'punjabi', hat: 'pagri', hatC: '#e6dabd', beard: 'short', hair: 'black', mo: 'plain', coat: 'angarkha', coatC: '#c88a3a' }],
  [/Mulraj/, { w: 1.04, skin: 'punjabi', hat: 'pagri', hatC: '#c9a23a', beard: 'short', hair: 'black', mo: 'plain', coat: 'angarkha', coatC: '#efe6d0', pearls: true }],
  [/Muzaffar Khan/, { w: 0.95, skin: 'pathan', hat: 'kulla', hatC: '#efe9dd', capC: '#b0843a', beard: 'medium', hair: 'white', mo: 'plain', coat: 'choga', coatC: '#2d4a3a', age: 2 }],
  [/Ubaid Khan/, { skin: 'pathan', hat: 'kulla', hatC: '#3c4b68', capC: '#a8432e', beard: 'medium', hair: 'black', mo: 'plain', coat: 'choga', coatC: '#7a3020' }],
  [/Zangi Khan/, { skin: 'pathan', hat: 'kulla', hatC: '#e8dfcc', capC: '#3a5a8a', beard: 'medium', hair: 'black', mo: 'plain', coat: 'choga', coatC: '#4a3a5a' }],
  [/Akbar Khan/, { w: 0.96, skin: 'pathan', hat: 'kulla', hatC: '#e9e1d0', capC: '#8a2a24', beard: 'short', hair: 'black', mo: 'plain', coat: 'choga', coatC: '#3e5a7a' }],
  [/Akbar Shah/, { skin: 'pathan', hat: 'pagri', hatC: '#f1ece0', beard: 'medium', hair: 'black', mo: 'plain', coat: 'choga', coatC: '#d9cfb6', age: 1 }],
  [/Ahmad Khan/, { w: 0.94, skin: 'punjabi', hat: 'pagri', hatC: '#f1ece0', beard: 'full', hair: 'white', mo: 'plain', coat: 'angarkha', coatC: '#6a5434', age: 2 }],
  [/Dildar Baig/, { skin: 'sepoy', hat: 'pagri', hatC: '#f0ebe0', beard: 'short', hair: 'black', mo: 'plain', coat: 'sepoy', coatC: '#a8322a', trim: '#d8b13a' }],
  [/46th/, { skin: 'sepoy', hat: 'pagri', hatC: '#f0ebe0', beard: 'medium', hair: 'salt', mo: 'plain', coat: 'sepoy', coatC: '#a8322a', trim: '#d8b13a', age: 1 }],
  [/Gough/, { w: 1.04, skin: 'british', hat: 'cocked', beard: 'whiskers', hair: 'white', mo: 'none', coat: 'fighting', coatC: '#efeae0', age: 2 }],
  [/Harry Smith/, { skin: 'british', hat: 'cocked', beard: 'whiskers', hair: 'grey', mo: 'none', coat: 'redcoat', coatC: '#b3261e', age: 1 }],
  [/Nicholson/, { w: 0.93, skin: 'tanned', hat: 'forage', hatC: '#ece6d6', beard: 'full', hair: 'dark', mo: 'plain', coat: 'frock', coatC: '#262c33', stern: true }],
  [/Ellice/, { skin: 'british', hat: 'forage', hatC: '#ece6d6', beard: 'whiskers', hair: 'brown', mo: 'plain', coat: 'redcoat', coatC: '#b3261e', age: 1 }],
  [/Edwardes/, { w: 0.95, skin: 'tanned', hat: 'bare', beard: 'whiskers', hair: 'dark', mo: 'plain', coat: 'frock', coatC: '#2c3546' }],
  [/Elphinstone/, { skin: 'british', hat: 'bare', beard: 'whiskers', hair: 'brown', mo: 'none', coat: 'frock', coatC: '#2c3546' }],
];
// Dress for a general with no entry, after his army's standard.
const LOOK_BY_STANDARD = {
  khalsa: { skin: 'punjabi', hat: 'dastar', hatC: '#d08c34', beard: 'full', hair: 'black', mo: 'plain', coat: 'angarkha', coatC: '#8b2b2b' },
  nishan: { shield: true, skin: 'punjabi', hat: 'dastar', hatC: '#283a6c', beard: 'full', hair: 'black', mo: 'plain', coat: 'angarkha', coatC: '#a8452e' },
  dogra: { skin: 'dogra', hat: 'pagri', hatC: '#bf352d', beard: 'short', hair: 'black', mo: 'grand', coat: 'angarkha', coatC: '#e4d6b4' },
  durrani: { skin: 'pathan', hat: 'kulla', hatC: '#e8dfcc', capC: '#a8432e', beard: 'medium', hair: 'black', mo: 'plain', coat: 'choga', coatC: '#4a3a5a' },
  sadozai: { skin: 'pathan', hat: 'kulla', hatC: '#efe9dd', capC: '#b0843a', beard: 'medium', hair: 'black', mo: 'plain', coat: 'choga', coatC: '#2d4a3a' },
  tribal: { skin: 'pathan', hat: 'pagri', hatC: '#e8e0cc', beard: 'medium', hair: 'black', mo: 'plain', coat: 'choga', coatC: '#8a7a5a' },
  kharal: { skin: 'punjabi', hat: 'pagri', hatC: '#f1ece0', beard: 'full', hair: 'salt', mo: 'plain', coat: 'angarkha', coatC: '#6a5434' },
  rebel: { skin: 'sepoy', hat: 'pagri', hatC: '#f0ebe0', beard: 'short', hair: 'black', mo: 'plain', coat: 'sepoy', coatC: '#a8322a', trim: '#d8b13a' },
  company: { skin: 'british', hat: 'cocked', beard: 'whiskers', hair: 'grey', mo: 'none', coat: 'redcoat', coatC: '#b3261e', age: 1 },
  punjab: { skin: 'tanned', hat: 'forage', hatC: '#ece6d6', beard: 'whiskers', hair: 'brown', mo: 'plain', coat: 'frock', coatC: '#2c3546' },
};

function lookFor(name, std) {
  const hit = GENERAL_LOOKS.find(([re]) => re.test(name || ''));
  return hit ? hit[1] : LOOK_BY_STANDARD[std] || LOOK_BY_STANDARD.khalsa;
}

// Mix a hex colour towards black (k < 0) or white (k > 0).
function shadeHex(hex, k) {
  const n = parseInt(hex.slice(1), 16), t = k < 0 ? 0 : 255, a = Math.abs(k);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v + (t - v) * a));
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
}

// Flat grounds, as in the miniatures; British sitters get a sky wash.
const FACE_GROUND = { dastar: '#35543b', pagri: '#2f4b5e', kulla: '#5e6634', cocked: 'sky', forage: 'sky', bare: 'sky' };
const KALGI_AT = { dastar: [21.4, 13.6], pagri: [20.4, 15.2], kulla: [20.2, 16] };

// The sitter in left profile, in a 60 × 72 frame (the shape of the panel's
// portrait): head and turban fill the upper two-thirds, the beard falls to
// the chest.
function drawnFace(name, std, uid = 'gf') {
  const L = lookFor(name, std), O = '#2a1c11', ow = 'stroke="#2a1c11" stroke-width=".5" stroke-linejoin="round"';
  const british = ['cocked', 'forage', 'bare'].includes(L.hat);
  const skin = FACE_SKIN[L.skin] || FACE_SKIN.punjabi, skinD = shadeHex(skin, -.3), hair = HAIR[L.hair] || HAIR.black, hairD = shadeHex(hair, -.35);
  const hairL = L.hair === 'white' || L.hair === 'grey' ? hairD : shadeHex(hair, .28);
  const coatC = L.coatC || '#6b4a2a', coatD = shadeHex(coatC, -.35), gold = '#d9b04a';
  const p = [];

  // Ground: a flat colour with a pale strip of sky along the top, or a wash.
  const ground = L.ground || FACE_GROUND[L.hat] || '#35543b';
  if (ground === 'sky') {
    p.push(`<defs><linearGradient id="${uid}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f879c"/><stop offset=".6" stop-color="#a9b3b0"/><stop offset="1" stop-color="#d6cfb8"/></linearGradient></defs><rect width="60" height="72" fill="url(#${uid}-sky)"/>`);
  } else {
    p.push(`<rect width="60" height="72" fill="${ground}"/><path d="M0 0H60V7C50 8.6 40 6.4 30 8C20 9.6 10 7 0 8.6Z" fill="#cfdde2" opacity=".5"/><path d="M0 8.6C10 7 20 9.6 30 8C40 6.4 50 8.6 60 7" fill="none" stroke="#e8eef0" stroke-width=".5" opacity=".6"/>`);
  }

  // Coat and shoulders; a dhal slung on the back for the misl chiefs.
  p.push('<g transform="translate(3 0)">');
  if (L.hat === 'kulla') p.push(`<path d="M40.6 25C44 32 45.4 42 44.6 54L40 55C40.4 45 39.6 36 37.6 29Z" fill="${shadeHex(L.hatC, -.14)}" ${ow}/>`);
  p.push(`<path d="M-4 72C-1 63 10 58.4 21.6 57C26 56.4 30.4 57.6 33.4 57C38.4 55.8 42.6 55.2 47.4 56.6C52 58 55 61 56.6 66L58 72Z" fill="${coatC}" ${ow}/><path d="M47.4 56.6C52 58 55 61 56.6 66L58 72H44C46 66 47.6 61 47.4 56.6Z" fill="${coatD}" opacity=".45"/>`);
  if (L.coat === 'angarkha') p.push(`<path d="M25 57.4C27 62 30.6 67 35.4 72" fill="none" stroke="${coatD}" stroke-width="1.6"/><path d="M25.8 57.4C27.8 62 31.4 67 36.2 72" fill="none" stroke="${gold}" stroke-width=".8"/><path d="M24.6 57.4C29 59.2 35 58.8 39.6 56.2" fill="none" stroke="${gold}" stroke-width=".9"/>`);
  if (L.coat === 'choga') p.push(`<path d="M25.6 57.2C28.6 57.8 31.6 57.8 34.2 57.2C31.8 61 30 66 29 72H19.6C21.4 66 23.2 61 25.6 57.2Z" fill="#e9e1cf" ${ow}/><path d="M39.6 55.6C35 59 31.4 64 29.6 72" fill="none" stroke="${gold}" stroke-width="2.4"/><path d="M39.6 55.6C35 59 31.4 64 29.6 72" fill="none" stroke="${coatD}" stroke-width=".8"/>`);
  if (L.coat === 'mail') p.push(`<g fill="none" stroke="#d4d6d2" stroke-width=".55" stroke-dasharray=".6 1.1"><path d="M4 66C16 60.4 40 59.4 56 64"/><path d="M2.6 69.6C16 64 42 63 57.6 67.6"/><path d="M9 61.4C20 57.8 38 57 51 59.6"/></g><path d="M24.6 57.4C29 59.4 35 59 39.6 56.2" fill="none" stroke="${gold}" stroke-width="1.2"/>`);
  if (L.coat === 'redcoat' || L.coat === 'sepoy') {
    const fac = L.coat === 'sepoy' ? L.trim : '#1f2c55';
    p.push(`<path d="M24.4 55.4C29 55.2 35 54.4 39.8 53.4L40.6 58.6C35.6 59.6 29.6 60.2 25.2 60Z" fill="${fac}" ${ow}/><path d="M25.2 59.6C29.6 59.8 35.6 59.2 40.6 58.2" fill="none" stroke="${gold}" stroke-width=".8"/>`);
    p.push(`<g fill="${gold}">${[[19.6, 61.4], [15.6, 64], [12, 67], [9, 70.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9"/>`).join('')}</g>`);
    if (L.coat === 'redcoat') p.push(`<ellipse cx="44" cy="57.8" rx="7.6" ry="2.4" transform="rotate(8 44 57.8)" fill="${gold}" ${ow}/><path d="M37.4 58.6l-.4 3.6M39.8 59l-.2 3.8M42.2 59.4v3.8M44.6 59.8l.2 3.8M47 60l.4 3.6M49.4 60l.6 3.4" stroke="${gold}" stroke-width=".9"/>`);
  }
  if (L.coat === 'frock' || L.coat === 'fighting') {
    const lap = L.coat === 'frock' ? coatD : '#c9c2b0';
    p.push(`<path d="M24.2 55C25.8 55.2 27.4 55 28.6 54.4L29.2 58.8C27.6 59.4 25.8 59.6 24.4 59.4Z" fill="#151515" ${ow}/><path d="M24.2 54.6L22.6 57.2L25 56.4Z" fill="#f2eee4"/><path d="M29.2 58.8C25.4 62 22.4 66.4 20.6 72" fill="none" stroke="${lap}" stroke-width="1.2"/>`);
    if (L.coat === 'frock') p.push(`<g fill="#9a8a5a"><circle cx="21.6" cy="63" r=".8"/><circle cx="19" cy="67" r=".8"/></g>`);
  }
  if (L.shield) p.push(`<circle cx="48.4" cy="60.6" r="9.4" fill="#3b2a1a" ${ow}/><circle cx="48.4" cy="60.6" r="7.6" fill="none" stroke="${gold}" stroke-width=".7"/><g fill="${gold}" ${ow}>${[[45.8, 58], [51, 58], [45.8, 63.2], [51, 63.2]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2"/>`).join('')}</g>`);
  if (L.pearls) p.push(`<path d="M37.6 57.2C33 62.4 27 64.6 20.6 63.4" fill="none" stroke="#f3ecdc" stroke-width="1.8" stroke-dasharray=".05 2.1" stroke-linecap="round"/><path d="M38.8 58.6C33.6 65.4 26 67.6 19.4 66.2" fill="none" stroke="#f3ecdc" stroke-width="1.6" stroke-dasharray=".05 2" stroke-linecap="round"/><circle cx="21.2" cy="65.4" r="1.5" fill="#3f9a62" stroke="${gold}" stroke-width=".6"/>`);

  // Face and neck, with the line of the nose running straight down from the
  // brow as the miniaturists drew it.
  const tx = L.nose === 'short' ? 13.2 : 11.8, aq = L.nose === 'aquiline';
  p.push(`<path d="M19.5 22C18.5 25 17.8 27.5 17.3 29.6C17 30.6 17.3 31.4 17 32.2${aq ? `C14.6 33.8 ${tx + .3} 37.2 ${tx} 39.6` : `L${tx} 39.6`}C${tx - .4} 40.4 ${tx + .1} 41 ${tx + 1} 41C${tx + 1.8} 41 14.2 41.5 14.6 42C14.3 42.6 14.2 43 14.4 43.4C15 43.8 15.6 43.9 16 44.1C15.4 44.6 15 45.2 15.1 45.8C15.3 46.6 15.8 47 15.6 47.8C15.2 49.5 15.6 51 17.5 52C20 53 23 52.5 25 52L25.6 60H40.4L38.2 46C38.6 40 38 34 37 30C36 24 32 20 26 20.5C23 20.8 21 21 19.5 22Z" fill="${skin}" ${ow}/>`);
  p.push(`<path d="M25 52C29 51.6 33.4 49 36.4 45.6L38.2 46L40.4 60H25.6Z" fill="${skinD}" opacity=".5"/>`);
  p.push(`<path d="M31.6 42.4C29.6 47.2 26 51 21 52.6" fill="none" stroke="${skinD}" stroke-width=".5"/>`);
  if (L.hat !== 'dastar') p.push(`<path d="M30.2 33.4C31.6 32.2 34.2 32.6 34.4 35.6C34.6 38 33.6 40.2 31.8 41.2C30.8 41.6 30.2 40.8 30.4 40" fill="${skin}" ${ow}/><path d="M31.4 34.8C32.8 34.4 33.2 36 32.4 37.6" fill="none" stroke="${skinD}" stroke-width=".55"/>`);
  // Eye and brow: the long almond of the miniatures, smaller for the British.
  if (L.blind) p.push(`<path d="M18.6 32.3C20.4 33.4 23 33.1 24.8 31.6" fill="none" stroke="${O}" stroke-width=".75" stroke-linecap="round"/><path d="M19 30.9C20.6 30.1 23 30.1 24.4 30.7" fill="none" stroke="${skinD}" stroke-width=".55"/>`);
  else if (british) p.push(`<path d="M19 32.4C20.2 31.2 22.4 31 23.4 31.6C22.4 32.6 20.4 32.9 19 32.4Z" fill="#efe6d6"/><circle cx="20.3" cy="32" r=".85" fill="#2a2420"/><path d="M18.8 32.3C20.2 30.8 22.6 30.6 23.8 31.4" fill="none" stroke="${O}" stroke-width=".7" stroke-linecap="round"/><path d="M19.4 33.6C20.6 34.2 22.2 34.1 23.2 33.3" fill="none" stroke="${skinD}" stroke-width=".4"/>`);
  else p.push(`<path d="M18.6 32.6C20 30.6 23 30.4 24.6 31.4C23 32.8 20.2 33.2 18.6 32.6Z" fill="#f1e9da"/><circle cx="20.4" cy="31.9" r="1.05" fill="#1e140c"/><path d="M18.4 32.5C20 30.3 23.2 30.1 25.8 30.9" fill="none" stroke="${O}" stroke-width=".8" stroke-linecap="round"/><path d="M18.8 32.8C20.6 33.4 23 33.1 24.6 31.6" fill="none" stroke="${O}" stroke-width=".4"/>`);
  p.push(`<path d="${L.stern ? 'M17.8 29.9C20.4 28.6 24 28.3 26.6 29' : 'M17.8 29.3C20.4 27.7 24 27.5 26.6 28.8'}" fill="none" stroke="${L.hair === 'white' ? hairD : hair}" stroke-width="1.1" stroke-linecap="round"/>`);
  p.push(`<path d="M${tx + 1.6} 40.3C${tx + 2.4} 39.5 ${tx + 3.4} 39.7 ${tx + 3.6} 40.6" fill="none" stroke="${skinD}" stroke-width=".6" stroke-linecap="round"/><path d="M16 44.1L18 44.3" stroke="#6b3a2a" stroke-width=".7" stroke-linecap="round"/>`);
  if (L.age) p.push(`<path d="M${tx + 3.8} 40.9C17 42 17.6 43 18.4 44.6" fill="none" stroke="${skinD}" stroke-width=".5"/>`);
  if (L.age > 1) p.push(`<path d="M25.6 32.6L27.4 33.4M25.8 31.4L27.6 31.2M19.4 34.2C21 35 23 34.8 24.4 33.8" fill="none" stroke="${skinD}" stroke-width=".45"/>`);
  if (L.pox) p.push(`<g fill="${skinD}" opacity=".6">${[[22.4, 36.4], [24.6, 37.8], [26.8, 36], [23.4, 39.4], [27.6, 38.8], [25.6, 34.8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".4"/>`).join('')}</g>`);

  // Hair showing below the headwear.
  if (L.hat === 'pagri' || L.hat === 'kulla') p.push(`<path d="M34 29.4C36.6 29.6 39 29.8 40.6 30.4C41.2 35.6 40.2 41 38.6 46.2C36.8 43.4 35.6 39.4 35 36C34.6 33.6 34.2 31.4 34 29.4Z" fill="${hair}" ${ow}/>`);
  if (L.hat === 'cocked' || L.hat === 'forage') p.push(`<path d="M23.6 21C27 19.6 32 19 36 20.4C39.4 21.8 41.2 25.6 41 30.6C40.8 36 39.6 41 38.2 46C36.4 42.6 35.2 38.6 34.4 35C33.4 31.4 31.6 28.6 29 27C27 25.6 25 24.4 23.2 23.4Z" fill="${hair}" ${ow}/>`);
  if (L.hat === 'bare') p.push(`<path d="M19.4 22.6C19 16 23 11.6 29 11C36 10.4 42 14 43.4 21C44.4 27 42.6 34 40 40C38.8 43.4 38.2 45.4 38.2 46C36.4 42 35 38 34.4 34C33 30 30.6 28 28 26.4C25 24.8 22 23.6 19.4 22.6Z" fill="${hair}" ${ow}/><path d="M22 18.6C25 15.4 30 14 35 14.8M24.6 22.4C27.4 19.4 32 18 37 18.6M30 26C33 23.6 37 23 40.6 24.4M33.4 31.6C35.6 29.6 38.4 29.4 41 30.4" fill="none" stroke="${hairL}" stroke-width=".55"/><path d="M19.4 22.6C18.6 20.4 19.4 18.2 21.2 17.4C20.8 19 21.4 20.6 22.8 21.6C21.6 22.4 20.4 22.8 19.4 22.6Z" fill="${hair}" ${ow}/>`);
  if (L.beard === 'whiskers') p.push(`<path d="M27.4 27.6C29.6 30 30.6 33.4 30.4 37C30.2 41 29 45 26.8 47.4C25.8 48.2 24.8 48 24.6 47.2L25.6 45.6L24.8 45C25.8 42.4 26.4 39.6 26.4 36.4C26.4 33.4 26.2 30.6 25.4 28.4Z" fill="${hair}"/><path d="M27.6 30C28.8 34 28.8 40 26.6 45.6M26.4 31.6C27.2 35 27 39.6 25.6 43.6" fill="none" stroke="${L.hair === 'white' || L.hair === 'grey' ? shadeHex(hair, -.25) : hairL}" stroke-width=".4"/>`);

  // Beard in profile, falling to the chest, and the moustache.
  const beards = {
    full: 'M29.4 28.6C31.2 33 32.4 38.6 32.6 43.6C33 50 31.8 56 29.4 60.6C27.4 64.6 25 67.6 22.6 70C20.2 67 17.8 63.6 16.2 59.6C14.6 55.6 13.8 51.6 14 48.6C14.2 47 14.6 46.2 15.2 45.8C16.4 45.8 17.4 45.2 18.2 44.4C21.6 40.4 26 34.4 29.4 28.6Z',
    medium: 'M29.4 28.6C31.4 33 33 38.6 33.4 43.6C33.8 49 32.6 54 30 57.6C27.8 60.6 25.4 62.2 23.4 63C20.6 61.4 17.8 59 16.2 56C14.4 53 13.6 50.6 13.8 48.4C14 47 14.6 46.2 15.2 45.8C16.4 45.8 17.4 45.2 18.2 44.4C21.6 40.4 26 34.4 29.4 28.6Z',
    short: 'M29.4 28.6C31 33 32 38 32 42.6C32 47 30.4 50.6 27.6 52.8C24.8 54.6 20.6 55 17.6 54C15.6 53.2 14.4 51.4 14.4 49C14.4 47.6 14.8 46.4 15.2 45.8C16.4 45.8 17.4 45.2 18.2 44.4C21.6 40.4 26 34.4 29.4 28.6Z',
  };
  if (beards[L.beard]) {
    p.push(`<path d="${beards[L.beard]}" fill="${hair}" ${ow}/>`);
    const end = { full: 66, medium: 59, short: 52 }[L.beard];
    p.push(`<path d="M29.4 32C31 40 30.6 ${end - 10} 26.4 ${end - 2}M26.4 36C27.8 43 27.2 ${end - 8} 23.8 ${end}M22.8 41.4C24 47 23.4 ${end - 6} 21 ${end - 1}M19.6 45.6C20.4 50 19.8 ${end - 6} 18.4 ${end - 3}M16.6 48C16.4 51 16.6 ${end - 9} 16.8 ${end - 6}" fill="none" stroke="${hairL}" stroke-width=".45" stroke-linecap="round" opacity=".9"/>`);
  }
  if (L.mo === 'plain') p.push(`<path d="M14.2 42.6C15.6 41.6 18.6 41.4 21.6 42.6C22.6 43 22.8 43.8 22 44C19.6 44.2 17 43.8 14.4 43.6C14 43.4 13.9 42.9 14.2 42.6Z" fill="${hair}" ${ow}/>`);
  if (L.mo === 'grand') p.push(`<path d="M14.2 42.6C16 41.4 19.6 41.2 22.6 42.2C24.6 42.8 25.8 41.6 25.8 39.4C27 41.6 26.2 44.2 23.4 44.6C20.4 45 17 44 14.4 43.6C14 43.4 13.9 42.9 14.2 42.6Z" fill="${hair}" ${ow}/>`);

  // Headwear, seen from the side.
  const hc = L.hatC || '#e8dfcc', hd = shadeHex(hc, -.32), hl = shadeHex(hc, .2);
  if (L.hat === 'dastar') {
    p.push(`<path d="M17.4 25.6C16.4 19 18 11.4 22.6 4.4C28.6 3.6 37.4 5.4 42.4 11C45.6 16.4 45.2 24 43 30C41.8 34 40.6 38 39.6 41.6C37 42 35 41.6 33.6 40.6C33 36 31.6 31.6 29 29C25.6 26.6 21.6 25.6 17.4 25.6Z" fill="${hc}" ${ow}/>`);
    p.push(`<path d="M42.4 11C45.6 16.4 45.2 24 43 30C41.8 34 40.6 38 39.6 41.6C37 42 35 41.6 33.6 40.6C37 32 40 21 42.4 11Z" fill="${hd}" opacity=".4"/>`);
    p.push(`<g fill="none" stroke="${hd}" stroke-width=".85" stroke-linecap="round" opacity=".85"><path d="M37.6 41.4C34.6 30 29.4 17 23 5.4"/><path d="M42.2 31.6C38 21.6 31.6 11.6 24.6 4.8"/><path d="M44.8 19.4C40.4 12.4 34 7 27.4 4.2"/><path d="M18 22.6C25 18.4 35 15.8 44.8 18"/><path d="M18.8 15.8C26 11.8 34 10 42.6 11.2"/></g>`);
    p.push(`<path d="M17.6 24.4C22 24.4 26 25.4 29.6 27.8" fill="none" stroke="${hl}" stroke-width="1"/>`);
  } else if (L.hat === 'pagri') {
    p.push(`<path d="M17 25C15.6 19 17.6 12.6 23 9.4C28 6.6 36 6.6 41 9.8C45 12.6 46 18.4 44.2 24.4C43.4 27 42 29 40.4 30.4C37.6 30.2 35.6 30 34 29.6C30 28.4 27 26.4 23 25.6C21 25.2 19 25 17 25Z" fill="${hc}" ${ow}/>`);
    p.push(`<path d="M41 9.8C45 12.6 46 18.4 44.2 24.4C43.4 27 42 29 40.4 30.4C37.6 30.2 36 30 34.6 29.8C38.6 23 41 16 41 9.8Z" fill="${hd}" opacity=".4"/>`);
    p.push(`<g fill="none" stroke="${hd}" stroke-width=".85" stroke-linecap="round" opacity=".85"><path d="M17.2 21C24 18.4 34 18.2 44.8 21.4"/><path d="M18.4 15.6C25.4 12.8 34 12.4 43.6 15"/><path d="M23 9.6C30 13 37 19 40.4 30"/></g>`);
  } else if (L.hat === 'kulla') {
    p.push(`<path d="M24 11.4C24.4 5.4 27.6 1.8 30.6 1.6C33.6 1.8 37 5.4 37.6 11.4Z" fill="${L.capC || '#a8432e'}" ${ow}/><path d="M27.4 11L28.6 3.6M30.8 11V1.8M34.2 11L33 3.6" stroke="${gold}" stroke-width=".7"/>`);
    p.push(`<path d="M17 25C15.6 18.6 18.6 12.2 24 10.2C29 8.4 37 8.4 41.6 11C45.6 13.6 46.4 19.6 44.4 25C43.4 27.6 42 29.4 40.4 30.6C36.4 30 33.4 29.2 30.4 28C26.4 26.4 21.6 25.4 17 25Z" fill="${hc}" ${ow}/>`);
    p.push(`<g fill="none" stroke="${hd}" stroke-width=".85" stroke-linecap="round" opacity=".85"><path d="M17.6 20.4C25.6 14.2 35 12.2 44.4 14.6"/><path d="M18.4 24.6C26.6 19 36 17.8 45.6 20.8"/><path d="M26 10.4C31 15 36 21.6 39.6 30"/></g>`);
  } else if (L.hat === 'cocked') {
    // The cocked hat worn fore and aft, with a general's plume of white swan
    // feathers over red.
    p.push(`<path d="M5.6 21.4C9.6 9.6 23.6 4 32.6 4.4C41.6 4.8 51.6 10.4 54.6 20.6C46.6 17.4 38.6 16.4 30.6 16.4C20.6 16.4 11.6 18 5.6 21.4Z" fill="#17140f" ${ow}/><path d="M6.4 20.8C12.6 17.6 21 16 30.6 16C38.6 16 46.4 17 53.8 20" fill="none" stroke="${gold}" stroke-width=".9"/><path d="M31.4 15.8V7.4" stroke="${gold}" stroke-width="1.3"/><circle cx="31.4" cy="12.6" r="1.6" fill="#17140f" stroke="${gold}" stroke-width=".7"/>`);
    p.push(`<path d="M11.6 14.6C21.6 8.2 39.6 8.2 49.6 13.6C39.6 11 21.6 11 11.6 14.6Z" fill="#b8322a"/><path d="M9.6 13.2C17.6 3.8 39.6 1.8 51.6 11.8C43.6 7.8 21.6 7.8 9.6 13.2Z" fill="#f4f1ea" ${ow}/><path d="M14 10.6C22 6 38 5.2 48 9.6" fill="none" stroke="#d5cfc2" stroke-width=".55"/>`);
  } else if (L.hat === 'forage') {
    p.push(`<path d="M17.6 21L18.8 10.8C26.4 9.6 34.4 9.6 41.8 10.8L42 21Z" fill="${hc}" ${ow}/><path d="M37 10.2C39 10.4 40.6 10.6 41.8 10.8L42 21H38.6C38.8 17 38.4 13.4 37 10.2Z" fill="${hd}" opacity=".4"/><path d="M17.6 17.8H42V21.4H17.6Z" fill="${hd}" ${ow}/><path d="M17.6 21.4C14 21.6 11 22.6 9.6 24C12.6 24 16 23.6 18.8 22.8Z" fill="#141414" ${ow}/>`);
    // A white curtain over the neck against the sun, as worn in 1857.
    p.push(`<path d="M42 19.6C43.4 28 43 38 41.6 47L37.4 45C38.4 36.4 38.6 28 38.2 21Z" fill="${hc}" ${ow}/><path d="M40.4 22C41 30 40.8 38 39.8 45.6" fill="none" stroke="${hd}" stroke-width=".5"/>`);
  }
  if (L.kalgi && KALGI_AT[L.hat]) {
    const [x, y] = KALGI_AT[L.hat];
    p.push(`<path d="M${x} ${y + 1.6}C${x + 6} ${y + 1.2} ${x + 13} ${y + 1.6} ${x + 20} ${y + 3.6}" fill="none" stroke="#f3ecdc" stroke-width="1.5" stroke-dasharray=".05 1.9" stroke-linecap="round"/>`);
    p.push(`<path d="M${x + 1.6} ${y - 3.4}C${x - .4} ${y - 7.6} ${x - .6} ${y - 11} ${x + 1.2} ${y - 13.2}C${x + 2.2} ${y - 10.4} ${x + 3.2} ${y - 7} ${x + 3.6} ${y - 3.6}Z" fill="#f6f1e4" ${ow}/><path d="M${x + 2.4} ${y - 4}C${x + 1.4} ${y - 7} ${x + 1.2} ${y - 9.6} ${x + 1.6} ${y - 11.6}" fill="none" stroke="#c9bfa8" stroke-width=".45"/>`);
    p.push(`<circle cx="${x}" cy="${y}" r="1.9" fill="#b8323a" stroke="${gold}" stroke-width=".8"/>`);
  }

  p.push('</g>');
  // Ruled borders.
  p.push(british
    ? `<rect x="1.2" y="1.2" width="57.6" height="69.6" fill="none" stroke="#4a3520" stroke-width=".7"/>`
    : `<rect x="1" y="1" width="58" height="70" fill="none" stroke="#f0e2b0" stroke-width=".9"/><rect x="2.5" y="2.5" width="55" height="67" fill="none" stroke="#8a2a1c" stroke-width=".6"/>`);
  return `<svg class="face" viewBox="0 0 60 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${p.join('')}</svg>`;
}

// The general's portrait: his own where one survives (js/pictures.js), a
// contemporary's where none does, and the drawn bust only if neither.
function generalFace(name, std, uid = 'gf') {
  const hit = GENERAL_PICTURES.find(([re]) => new RegExp(re).test(name || ''));
  const [img, cap] = hit ? [hit[1], hit[2]] : STANDARD_PICTURES[std] || [];
  if (!img) return drawnFace(name, std, uid);
  const alt = cap.replace(/"/g, '&quot;');
  return `<img class="face" src="img/generals/${img}.jpg" alt="${alt}" title="${alt}" draggable="false">`;
}
