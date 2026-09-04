type BoundaryFeature = { properties: Record<string, string | number> };
type TehsilDatum = { n: string; d: string };

const normalise = (value: unknown) => String(value).toLowerCase().replace(/district|agency/g, '').replace(/[^a-z0-9]/g, '');
const normaliseTehsil = (value: unknown) => normalise(value).replace(/(?:subdivision|sub|taluks?)$/, '');

// Data Darbar and the boundary file describe several districts at different
// points in their administrative history. Alternatives are deliberately
// explicit so a similarly named tehsil in an unrelated district cannot match.
const DISTRICT_ALTERNATIVES: Record<string, string[]> = {
  astore: ['astor'],
  chagai: ['chaghi'],
  chaman: ['killaabdullah'],
  chitrallower: ['chitral'],
  chitralupper: ['chitral'],
  centralkarachi: ['karachi'],
  dikhan: ['deraismailkhan'],
  dukki: ['loralai'],
  duki: ['loralai'],
  eastkarachi: ['karachi'],
  ghanche: ['ghanchi'],
  gupisyasin: ['ghizer'],
  hunza: ['hunzanagar'],
  jhelumvalley: ['muzaffarabad'],
  kharmang: ['skardu'],
  killaabdullah: ['pishin'],
  kohistanlower: ['kohistan'],
  kohistanupper: ['kohistan'],
  kolaipalaskohistan: ['kohistan'],
  korangikarachi: ['karachi'],
  lehri: ['sibi'],
  leiah: ['layyah'],
  malirkarachi: ['karachi'],
  musakhel: ['musakhail'],
  naushahroferoze: ['naushehroferoze'],
  rondu: ['skardu'],
  shaheedsikandarabad: ['kalat'],
  shigar: ['skardu'],
  southkarachi: ['karachi'],
  sudhnoti: ['sudhnutti'],
  sujawal: ['sajawal', 'thatta'],
  westkarachi: ['karachi'],
};

// One-to-one administrative renames between the current boundary file and the
// older tehsil index used by Data Darbar. Do not add parent-to-child splits
// here: each source row may be consumed only once.
const TEHSIL_ALTERNATIVES: Record<string, string[]> = {
  'bannu:wazir': ['frbannu'],
  'dikhan:darazinda': ['frdikhan'],
  'kohat:darraadamkhel': ['frkohat'],
  'lakkimarwat:bettani': ['frlakki'],
  'lakkimarwat:sarainaurang': ['naurang'],
  'lowerdir:samarbagh': ['samarbaghbarwa'],
  'peshawar:hassankhel': ['frpeshawar'],
  'peshawar:towni': ['peshawari'],
  'peshawar:townii': ['peshawarii'],
  'peshawar:towniii': ['peshawariii'],
  'peshawar:towniv': ['peshawariv'],
  'tank:jandola': ['frtank'],
};

function editDistance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + Number(a[i - 1] !== b[j - 1]));
      diagonal = above;
    }
  }
  return row[b.length];
}

export function buildTehsilDataLookup<T extends TehsilDatum>(features: BoundaryFeature[], rows: T[]) {
  const sources = rows.map((row, index) => ({ row, index, district: normalise(row.d), name: normaliseTehsil(row.n) }));
  const byDistrict = new Map<string, typeof sources>();
  sources.forEach(source => byDistrict.set(source.district, [...(byDistrict.get(source.district) || []), source]));
  const matches = new Map<string, T>();
  const used = new Set<number>();
  const ordered = [...features].sort((a, b) => String(a.properties.tehsil_code).localeCompare(String(b.properties.tehsil_code)));
  const districtsFor = (feature: BoundaryFeature) => {
    const district = normalise(feature.properties.district_name);
    return [district, ...(DISTRICT_ALTERNATIVES[district] || [])];
  };
  const namesFor = (feature: BoundaryFeature) => {
    const district = normalise(feature.properties.district_name);
    const name = normaliseTehsil(feature.properties.tehsil_name);
    return [name, ...(TEHSIL_ALTERNATIVES[`${district}:${name}`] || [])];
  };

  // First take only unique exact-name matches, including explicit historical parents.
  ordered.forEach(feature => {
    const names = namesFor(feature);
    const candidates = districtsFor(feature).flatMap(district => byDistrict.get(district) || []).filter(source => !used.has(source.index) && names.includes(source.name));
    if (candidates.length !== 1) return;
    matches.set(String(feature.properties.tehsil_code), candidates[0].row);
    used.add(candidates[0].index);
  });

  // Then accept conservative, unambiguous spelling/transliteration variants.
  ordered.forEach(feature => {
    const code = String(feature.properties.tehsil_code);
    if (matches.has(code)) return;
    const name = normaliseTehsil(feature.properties.tehsil_name);
    const candidates = districtsFor(feature).flatMap(district => byDistrict.get(district) || []).filter(source => !used.has(source.index)).map(source => ({
      source,
      ratio: editDistance(name, source.name) / Math.max(name.length, source.name.length, 1),
    })).sort((a, b) => a.ratio - b.ratio);
    const [best, second] = candidates;
    if (!best || best.ratio > .25 || (second && second.ratio - best.ratio < .08)) return;
    matches.set(code, best.source.row);
    used.add(best.source.index);
  });

  return matches;
}
