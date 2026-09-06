export type ShareLevel = 'districts' | 'tehsils';
export type ShareKind = 'province' | 'territory';
export type SharedProvince = [string, string, string, ShareKind?, string?];
export type ExpandedAssignment = [string, string, number];

export type SharedMap = {
  v: 1;
  n: string;
  l: ShareLevel;
  p: SharedProvince[];
  a: ExpandedAssignment[];
};

// These dictionaries are append-only: their indexes are part of the share format.
const SHARE_COLOURS = [
  '#000000','#464646','#787878','#b4b4b4','#ffffff','#880015','#ed1c24','#ff7f27','#fff200','#22b14c','#00a2e8','#3f48cc','#a349a4','#b97a57','#ffaec9','#ffc90e','#b5e61d','#99d9ea','#7092be','#c8bfe7',
  '#65915f','#d99b42','#b76d57','#435267','#4f7bd9','#ef6a55','#42a66c','#a967c7','#f2b93f','#2e9daa','#d65392','#8c6b4f','#78a950','#e68235','#5964bd','#b84848','#56b6d2','#8463a9','#c8952f','#397f68','#e35d68','#648a3f','#b85c9a','#3e8fbd','#ba7041','#6e73cf','#9a8138','#278b83',
  '#cf5d87','#5577ad','#75a6bc','#a97b50','#786999','#829b73','#418674',
] as const;
const SHARE_CAPITALS = ['Karachi','Lahore','Faisalabad','Rawalpindi','Islamabad','Multan','Hyderabad','Peshawar','Quetta','Gujranwala','Sialkot','Sargodha','Bahawalpur','Sukkur','Larkana','Mardan','Abbottabad','Muzaffarabad','Gilgit','Gwadar'] as const;

const SPLIT_PROVINCES: SharedProvince[] = [
  ['punjab','Punjab','#65915f','province','Lahore'], ['south-punjab','South Punjab','#d99b42','province',''],
  ['sindh','Sindh','#b76d57','province',''], ['karachi','Karachi','#cf5d87','province','Karachi'],
  ['kp','Khyber Pakhtunkhwa','#5577ad','province','Peshawar'], ['hazara','Hazara','#75a6bc','province',''],
  ['balochistan','Balochistan','#a97b50','province','Quetta'], ['islamabad','Islamabad','#786999','territory','Islamabad'],
  ['gb','Gilgit–Baltistan','#829b73','territory','Gilgit'], ['ajk','Azad Kashmir','#418674','territory','Muzaffarabad'],
];
const CURRENT_PROVINCES = SPLIT_PROVINCES.filter(([id]) => !['south-punjab','karachi','hazara'].includes(id)).map(province =>
  province[0] === 'sindh' ? [province[0], province[1], province[2], province[3], 'Karachi'] as SharedProvince : province);
const DIVISION_LABELS = ['KP · Malakand','KP · Hazara','KP · Mardan','KP · Peshawar','KP · Kohat','KP · Bannu','KP · Dera Ismail Khan','Punjab · Rawalpindi','Punjab · Sargodha','Punjab · Faisalabad','Punjab · Gujranwala','Punjab · Lahore','Punjab · Sahiwal','Punjab · Multan','Punjab · Dera Ghazi Khan','Punjab · Bahawalpur','Sindh · Larkana','Sindh · Sukkur','Sindh · Shaheed Benazirabad','Sindh · Hyderabad','Sindh · Mirpur Khas','Sindh · Karachi','Balochistan · Quetta','Balochistan · Rakhshan','Balochistan · Loralai','Balochistan · Zhob','Balochistan · Sibi','Balochistan · Nasirabad','Balochistan · Kalat','Balochistan · Mekran','AJK · Muzaffarabad','AJK · Rawalakot','AJK · Mirpur','GB · Gilgit','GB · Baltistan','GB · Diamer','ICT'] as const;
const DIVISION_CODE_GROUPS = ['9gMDAgEMAQgDAw','9QMDBwQBAQUM','iwQI','-gMHCwIC','_gMCAgQJ','9wMQBg','_QMVAw','2QQECBE','3AQMBQs','3gQCBBc','4QQBAQkFCQ','5gQDBwk','8gQBBA','5wQEAw4','3wQLBQY','2gQBGQ','wwUCAQMH','wQUGDA','zQUBAQ','vQUCAwIHBwIBAg','zAUKAg','vgUCCAIHCA','1gELAQk','ywEJCwc','ygERAg0','1wEMBA','zAECCgIKBA','zwEBAQ0H','yQEJAwQDDQ','zQEGDQ','ZwQB','ZQMFAQ','ZgMB','sAIBAQIF','rwIEAgEE','rQIBCQE','kQM'] as const;
function divisionColour(index: number) {
  const hue=index*137.508%360, saturation=42+index%3*5, lightness=48+index%4*3;
  const chroma=(1-Math.abs(2*lightness/100-1))*saturation/100, x=chroma*(1-Math.abs(hue/60%2-1)), match=lightness/100-chroma/2;
  const channels=hue<60?[chroma,x,0]:hue<120?[x,chroma,0]:hue<180?[0,chroma,x]:hue<240?[0,x,chroma]:hue<300?[x,0,chroma]:[chroma,0,x];
  return `#${channels.map(channel=>Math.round((channel+match)*255).toString(16).padStart(2,'0')).join('')}`;
}
const DIVISION_PROVINCES: SharedProvince[] = DIVISION_LABELS.map((label,index) => [
  `division-${label.toLowerCase().replace(/[^a-z0-9]/g,'')}`,
  label === 'ICT' ? 'Islamabad' : `${label.split(' · ')[1]} Division`,
  divisionColour(index), label === 'ICT' ? 'territory' : 'province', '',
]);
const PRESET_PROVINCES = [CURRENT_PROVINCES, SPLIT_PROVINCES, DIVISION_PROVINCES] as const;
type PresetIndex = 0 | 1 | 2;

// version, title, level, names, colours, territories, capitals, district/default groups,
// optional tehsil overrides by owner, optional explicitly unassigned tehsil overrides
type CompactSharedMap = [5, string, 'd' | 't', string[], string, number[], string, string[], string[]?, string?];
type DeltaProvince = number | [number, string, string, 0 | 1, string];
type DeltaSharedMap = [6, PresetIndex, string, 'd' | 't', DeltaProvince[], string[], string];

export type DecodedSharedMap = {
  n: string;
  l: ShareLevel;
  p: SharedProvince[];
  assignments: Array<[string, number]>;
  tehsilOverrides?: Array<[string, number]>;
  preset?: PresetIndex;
  assignmentOverrides?: Array<[string, number]>;
};

function toBase64Url(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64 + '='.repeat((4 - base64.length % 4) % 4));
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

async function gzip(bytes: Uint8Array) {
  const input = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const stream = new Blob([input]).stream().pipeThrough(new CompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function gunzip(bytes: Uint8Array) {
  const input = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const stream = new Blob([input]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function encodeCodes(codes: number[]) {
  const bytes: number[] = [];
  let previous = 0;
  codes.forEach(code => {
    let delta = code - previous;
    previous = code;
    while (delta >= 0x80) {
      bytes.push((delta & 0x7f) | 0x80);
      delta >>>= 7;
    }
    bytes.push(delta);
  });
  return toBase64Url(Uint8Array.from(bytes));
}

function decodeCodes(value: string) {
  const codes: number[] = [];
  let previous = 0;
  let delta = 0;
  let shift = 0;
  fromBase64Url(value).forEach(byte => {
    delta |= (byte & 0x7f) << shift;
    if (byte & 0x80) {
      shift += 7;
      return;
    }
    previous += delta;
    codes.push(previous);
    delta = 0;
    shift = 0;
  });
  if (shift) throw new Error('Invalid shared-map geography data');
  return codes;
}

const SOUTH_PUNJAB_CODES = new Set([602,603,607,615,618,619,622,623,628,629,636]);
const KARACHI_CODES = new Set([702,704,712,714,721,729]);
const HAZARA_CODES = new Set([501,504,511,515,516,517,522,534]);
let divisionOwnerByDistrict: Map<number, number> | undefined;

function presetOwner(preset: PresetIndex, geographyCode: number) {
  const district = geographyCode >= 10000 ? Math.floor(geographyCode / 100) : geographyCode;
  if (preset === 2) {
    divisionOwnerByDistrict ||= new Map(DIVISION_CODE_GROUPS.flatMap((group, owner) => decodeCodes(group).map(code => [code, owner] as [number, number])));
    return divisionOwnerByDistrict.get(district);
  }
  const source = Math.floor(district / 100);
  if (preset === 0) return ({ 6:0, 7:1, 5:2, 2:3, 4:4, 3:5, 1:6 } as Record<number,number>)[source];
  if (source === 6) return SOUTH_PUNJAB_CODES.has(district) ? 1 : 0;
  if (source === 7) return KARACHI_CODES.has(district) ? 3 : 2;
  if (source === 5) return HAZARA_CODES.has(district) ? 5 : 4;
  return ({ 2:6, 4:7, 3:8, 1:9 } as Record<number,number>)[source];
}

const provinceMetadata = (province: SharedProvince) => [province[1], province[2].toLowerCase(), province[3] || 'province', province[4] || ''] as const;

function deltaCandidate(config: SharedMap, preset: PresetIndex): DeltaSharedMap | null {
  if (config.a.length !== (config.l === 'districts' ? 160 : 577)) return null;
  const base = PRESET_PROVINCES[preset];
  const references = config.p.map(([id]) => base.findIndex(([baseId]) => baseId === id));
  if (references.filter(index => index >= 0).length < Math.min(3, base.length)) return null;
  const provinces: DeltaProvince[] = config.p.map((province, index) => {
    const reference = references[index];
    if (reference >= 0 && JSON.stringify(provinceMetadata(province)) === JSON.stringify(provinceMetadata(base[reference]))) return reference;
    return [reference, province[1], province[2], province[3] === 'territory' ? 1 : 0, province[4] || ''];
  });
  const overrides = config.p.map(() => [] as number[]);
  const unassigned: number[] = [];
  config.a.forEach(([id, , owner]) => {
    const match = /^PK(\d+)$/.exec(id);
    if (!match) throw new Error('Invalid shared-map geography code');
    const code = Number(match[1]);
    const baseOwner = presetOwner(preset, code);
    const expectedOwner = baseOwner === undefined ? -1 : references.indexOf(baseOwner);
    if (owner === expectedOwner) return;
    if (owner >= 0 && overrides[owner]) overrides[owner].push(code);
    else unassigned.push(code);
  });
  return [6, preset, config.n, config.l === 'districts' ? 'd' : 't', provinces,
    overrides.map(codes => encodeCodes(codes.sort((left,right) => left-right))), encodeCodes(unassigned.sort((left,right) => left-right))];
}

export async function encodeShare(config: SharedMap) {
  const colourBytes: number[] = [];
  config.p.forEach(([, , rawColour]) => {
    const colour = rawColour.toLowerCase();
    if (!/^#[0-9a-f]{6}$/i.test(colour)) throw new Error('Invalid shared-map colour');
    const paletteIndex = SHARE_COLOURS.indexOf(colour as typeof SHARE_COLOURS[number]);
    if (paletteIndex >= 0) colourBytes.push(paletteIndex);
    else colourBytes.push(0xff, Number.parseInt(colour.slice(1, 3), 16), Number.parseInt(colour.slice(3, 5), 16), Number.parseInt(colour.slice(5, 7), 16));
  });
  const capitals = Uint8Array.from(config.p.map(([, , , , capital]) => {
    if (!capital) return 0;
    const capitalIndex = SHARE_CAPITALS.indexOf(capital as typeof SHARE_CAPITALS[number]);
    if (capitalIndex < 0) throw new Error('Invalid shared-map capital');
    return capitalIndex + 1;
  }));
  const codedAssignments = config.a.map(([id, , owner]) => {
    const match = /^PK(\d+)$/.exec(id);
    if (!match) throw new Error('Invalid shared-map geography code');
    return { code:Number(match[1]), owner };
  });
  let ownerCodes: number[][];
  let overrideCodes: number[][] | undefined;
  let unassignedOverrides: number[] | undefined;
  if (config.l === 'tehsils') {
    ownerCodes = config.p.map(() => []);
    overrideCodes = config.p.map(() => []);
    unassignedOverrides = [];
    const districts = new Map<number, typeof codedAssignments>();
    codedAssignments.forEach(row => {
      const district = Math.floor(row.code / 100);
      districts.set(district, [...(districts.get(district) || []), row]);
    });
    districts.forEach((rows, district) => {
      const counts = new Map<number, number>();
      rows.forEach(({ owner }) => counts.set(owner, (counts.get(owner) || 0) + 1));
      const defaultOwner = [...counts].sort((left, right) => right[1] - left[1] || (left[0] === -1 ? -1 : right[0] === -1 ? 1 : left[0] - right[0]))[0][0];
      if (defaultOwner >= 0 && ownerCodes[defaultOwner]) ownerCodes[defaultOwner].push(district);
      rows.forEach(({ code, owner }) => {
        if (owner === defaultOwner) return;
        if (owner >= 0 && overrideCodes?.[owner]) overrideCodes[owner].push(code);
        else unassignedOverrides?.push(code);
      });
    });
  } else {
    ownerCodes = config.p.map((_, owner) => codedAssignments.filter(row => row.owner === owner).map(row => row.code));
  }
  const groups = ownerCodes.map(codes => encodeCodes([...new Set(codes)].sort((left, right) => left - right)));
  const overrideGroups = overrideCodes?.map(codes => encodeCodes([...new Set(codes)].sort((left, right) => left - right)));
  const compactBase: [5, string, 'd' | 't', string[], string, number[], string, string[]] = [
    5,
    config.n,
    config.l === 'districts' ? 'd' : 't',
    config.p.map(([, name]) => name),
    toBase64Url(Uint8Array.from(colourBytes)),
    config.p.flatMap(([, , , kind], index) => kind === 'territory' ? [index] : []),
    toBase64Url(capitals),
    groups,
  ];
  const compact: CompactSharedMap = config.l === 'tehsils' ? [
    ...compactBase,
    overrideGroups || config.p.map(() => ''),
    encodeCodes([...new Set(unassignedOverrides || [])].sort((left, right) => left - right)),
  ] : compactBase;
  const candidates: Array<CompactSharedMap | DeltaSharedMap> = [compact];
  ([0,1,2] as PresetIndex[]).forEach(preset => {
    const delta = deltaCandidate(config, preset);
    if (delta) candidates.push(delta);
  });
  const payloads = await Promise.all(candidates.map(candidate => gzip(new TextEncoder().encode(JSON.stringify(candidate)))));
  return toBase64Url(payloads.sort((left, right) => left.length - right.length)[0]);
}

export async function decodeShare(value: string): Promise<DecodedSharedMap> {
  const parsed = JSON.parse(new TextDecoder().decode(await gunzip(fromBase64Url(value)))) as CompactSharedMap | DeltaSharedMap;
  if (!Array.isArray(parsed) || (parsed[0] !== 5 && parsed[0] !== 6)) throw new Error('Unsupported shared-map format');
  if (parsed[0] === 6) {
    const base = PRESET_PROVINCES[parsed[1]];
    if (!base) throw new Error('Invalid shared-map preset');
    const p: SharedProvince[] = parsed[4].map((description, index) => {
      if (typeof description === 'number') {
        const province = base[description];
        if (!province) throw new Error('Invalid shared-map province reference');
        return [...province] as SharedProvince;
      }
      const [reference, name, colour, territory, capital] = description;
      return [reference >= 0 ? base[reference]?.[0] || `u${index}` : `u${index}`, name, colour, territory ? 'territory' : 'province', capital];
    });
    if (parsed[5].length !== p.length) throw new Error('Invalid shared-map overrides');
    const assignmentOverrides = [
      ...parsed[5].flatMap((group, owner) => decodeCodes(group).map(code => [`PK${code}`, owner] as [string,number])),
      ...decodeCodes(parsed[6]).map(code => [`PK${code}`, -1] as [string,number]),
    ];
    return { n:parsed[2], l:parsed[3] === 'd' ? 'districts' : 'tehsils', p, assignments:[], preset:parsed[1], assignmentOverrides };
  }
  const colourBytes = fromBase64Url(parsed[4]);
  const capitalBytes = fromBase64Url(parsed[6]);
  if (capitalBytes.length !== parsed[3].length || parsed[7].length !== parsed[3].length || (parsed[2] === 't' && parsed[8]?.length !== parsed[3].length)) {
    throw new Error('Invalid shared-map metadata');
  }
  const colours: string[] = [];
  let colourCursor = 0;
  while (colours.length < parsed[3].length) {
    const paletteIndex = colourBytes[colourCursor++];
    if (paletteIndex === undefined) throw new Error('Invalid shared-map colour data');
    if (paletteIndex < SHARE_COLOURS.length) colours.push(SHARE_COLOURS[paletteIndex]);
    else if (paletteIndex === 0xff && colourCursor + 2 < colourBytes.length) {
      colours.push(`#${[colourBytes[colourCursor++], colourBytes[colourCursor++], colourBytes[colourCursor++]].map(byte => byte.toString(16).padStart(2, '0')).join('')}`);
    } else throw new Error('Invalid shared-map colour data');
  }
  if (colourCursor !== colourBytes.length) throw new Error('Invalid shared-map colour data');
  const territories = new Set(parsed[5]);
  const p: SharedProvince[] = parsed[3].map((name, index) => [
    `u${index}`,
    name,
    colours[index],
    territories.has(index) ? 'territory' : 'province',
    capitalBytes[index] ? SHARE_CAPITALS[capitalBytes[index] - 1] || '' : '',
  ]);
  const assignments = parsed[7].flatMap((group, owner) =>
    decodeCodes(group).map(code => [`PK${code}`, owner] as [string, number]));
  const tehsilOverrides = parsed[2] === 't' ? [
    ...(parsed[8] || []).flatMap((group, owner) => decodeCodes(group).map(code => [`PK${code}`, owner] as [string, number])),
    ...decodeCodes(parsed[9] || '').map(code => [`PK${code}`, -1] as [string, number]),
  ] : undefined;
  return { n: parsed[1], l: parsed[2] === 'd' ? 'districts' : 'tehsils', p, assignments, tehsilOverrides };
}

export function assignmentOwners(shared: DecodedSharedMap, featureIds: string[] = []) {
  if (shared.preset !== undefined) {
    const base = PRESET_PROVINCES[shared.preset];
    const finalOwnerByBase = new Map(base.map(([id], baseOwner) => [baseOwner, shared.p.findIndex(([finalId]) => finalId === id)]));
    const overrides = new Map(shared.assignmentOverrides || []);
    return new Map(featureIds.flatMap(id => {
      const match = /^PK(\d+)$/.exec(id);
      if (!match) return [];
      const override = overrides.get(id);
      const baseOwner = presetOwner(shared.preset as PresetIndex, Number(match[1]));
      const owner = override !== undefined ? override : baseOwner === undefined ? -1 : finalOwnerByBase.get(baseOwner) ?? -1;
      return owner >= 0 ? [[id, owner] as [string,number]] : [];
    }));
  }
  if (shared.l === 'districts') return new Map(shared.assignments);
  const defaults = new Map(shared.assignments);
  const overrides = new Map(shared.tehsilOverrides || []);
  return new Map(featureIds.flatMap(id => {
    const match = /^PK(\d+)$/.exec(id);
    if (!match) return [];
    const owner = overrides.has(id) ? overrides.get(id) : defaults.get(`PK${Math.floor(Number(match[1]) / 100)}`);
    return owner !== undefined && owner >= 0 ? [[id, owner] as [string, number]] : [];
  }));
}

export function expandShare(shared: DecodedSharedMap, featureIds: string[] = []) : SharedMap {
  return {
    v: 1,
    n: shared.n,
    l: shared.l,
    p: shared.p,
    a: [...assignmentOwners(shared, featureIds)].map(([id, owner]) => [id, '', owner]),
  };
}
