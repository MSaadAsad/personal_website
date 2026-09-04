'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Level = 'districts' | 'tehsils';
type Props = Record<string, string | number>;
type Feature = { type: 'Feature'; properties: Props; geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: number[][][] | number[][][][] } };
type UnitKind = 'province' | 'territory';
type Province = { id: string; name: string; color: string; kind: UnitKind };
type SharedMap = { v: 1; n: string; l: Level; p: [string, string, string, UnitKind?][]; a: [string, string, number][] };
type DistrictData = { n: string; p: number | null; l: number | null; i: number | null; u: number | null; ur: number | null; lfpr: number | null; oos: number | null; mat: number | null; enrol: number | null; num: number | null; cons: number | null; fi: number | null; net: number | null; elec: number | null; mpi: number | null; h: number | null };
type TehsilData = { n: string; d: string; p: number | null; r: number | null; nl: number | null };
type DarbarData = { source: string; generated: string; methodology: string; districts: Record<string, DistrictData>; tehsils: TehsilData[] };
type AssemblyDistrict = { district: string; province: string; seats: number; parties: Record<string, number> };
type AssemblyData = { election: string; basis: string; source: string; districts: AssemblyDistrict[] };
type RegionalAssemblyData = { generated: string; sources: Record<string, string>; notes: Record<string, string>; districts: { region: 'AJK' | 'GB'; district: string; parties: Record<string, number> }[] };
type RankMetric = 'population' | 'literacy' | 'matricPlus' | 'outOfSchool' | 'consumption' | 'lfpr' | 'foodInsecurity' | 'internet' | 'electricity' | 'mpi';

const RANK_METRICS: { key: RankMetric; label: string; unit: string }[] = [
  { key: 'population', label: 'Population', unit: 'people' },
  { key: 'literacy', label: 'Literacy', unit: '%' },
  { key: 'matricPlus', label: 'Matric or higher', unit: '%' },
  { key: 'outOfSchool', label: 'Out of school', unit: 'children' },
  { key: 'consumption', label: 'Monthly consumption', unit: 'Rs / person' },
  { key: 'lfpr', label: 'Labor-force participation', unit: '%' },
  { key: 'foodInsecurity', label: 'Food insecurity', unit: '%' },
  { key: 'internet', label: 'Internet users', unit: '%' },
  { key: 'electricity', label: 'Electricity access', unit: '%' },
  { key: 'mpi', label: 'Multidimensional poverty', unit: 'MPI' },
];

const PALETTE = ['#ef6351', '#f4b942', '#48a9a6', '#5b70d6', '#a267c7', '#3c9d60', '#e27d3f', '#d85b8b'];
const PAINT_COLORS = ['#000000','#464646','#787878','#b4b4b4','#ffffff','#880015','#ed1c24','#ff7f27','#fff200','#22b14c','#00a2e8','#3f48cc','#a349a4','#b97a57','#ffaec9','#ffc90e','#b5e61d','#99d9ea','#7092be','#c8bfe7','#65915f','#d99b42','#b76d57','#435267'];
const CANONICAL: Province[] = [
  { id: 'punjab', name: 'Punjab', color: '#65915f', kind: 'province' },
  { id: 'south-punjab', name: 'South Punjab', color: '#d99b42', kind: 'province' },
  { id: 'sindh', name: 'Sindh', color: '#b76d57', kind: 'province' },
  { id: 'karachi', name: 'Karachi', color: '#cf5d87', kind: 'province' },
  { id: 'kp', name: 'Khyber Pakhtunkhwa', color: '#5577ad', kind: 'province' },
  { id: 'hazara', name: 'Hazara', color: '#75a6bc', kind: 'province' },
  { id: 'balochistan', name: 'Balochistan', color: '#a97b50', kind: 'province' },
  { id: 'islamabad', name: 'Islamabad', color: '#786999', kind: 'territory' },
  { id: 'gb', name: 'Gilgit–Baltistan', color: '#829b73', kind: 'territory' },
  { id: 'ajk', name: 'Azad Kashmir', color: '#418674', kind: 'territory' },
];
const SOUTH_PUNJAB = new Set(['bahawalnagar', 'bahawalpur', 'deraghazikhan', 'khanewal', 'layyah', 'leiah', 'lodhran', 'multan', 'muzaffargarh', 'rahimyarkhan', 'rajanpur', 'vehari']);
const KARACHI = new Set(['centralkarachi', 'eastkarachi', 'korangikarachi', 'malirkarachi', 'southkarachi', 'westkarachi', 'keamari']);
const HAZARA = new Set(['abbottabad', 'batagram', 'battagram', 'haripur', 'kohistanlower', 'kohistanupper', 'kolaipalaskohistan', 'mansehra', 'torghar']);
const EXTENT = { minX: 60.75, maxX: 77.25, minY: 23.35, maxY: 37.25 };
const WIDTH = 760, HEIGHT = 820;

function project([lon, lat]: number[]) {
  return [20 + ((lon - EXTENT.minX) / (EXTENT.maxX - EXTENT.minX)) * 720, 20 + ((EXTENT.maxY - lat) / (EXTENT.maxY - EXTENT.minY)) * 780];
}

function ringPath(ring: number[][]) {
  return ring.map((point, index) => `${index ? 'L' : 'M'}${project(point).map(n => n.toFixed(1)).join(' ')}`).join(' ') + 'Z';
}

function geometryPath(geometry: Feature['geometry']) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates as number[][][]] : geometry.coordinates as number[][][][];
  return polygons.map(polygon => polygon.map(ringPath).join(' ')).join(' ');
}

function featureId(feature: Feature, level: Level) {
  return String(feature.properties[level === 'districts' ? 'district_code' : 'tehsil_code']);
}

function featureName(feature: Feature, level: Level) {
  return String(feature.properties[level === 'districts' ? 'district_name' : 'tehsil_name']);
}

function encodeShare(config: SharedMap) {
  const bytes = new TextEncoder().encode(JSON.stringify(config));
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeShare(value: string): SharedMap {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64 + '='.repeat((4 - base64.length % 4) % 4));
  return JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, character => character.charCodeAt(0))));
}

const normalise = (value: unknown) => String(value).toLowerCase().replace(/district|agency/g, '').replace(/[^a-z0-9]/g, '');
function canonicalAssignments(features: Feature[], level: Level) {
  return Object.fromEntries(features.map(feature => {
    const district = normalise(feature.properties.district_name);
    const origin = String(feature.properties.province_name);
    let owner = origin === 'Punjab' ? (SOUTH_PUNJAB.has(district) ? 'south-punjab' : 'punjab')
      : origin === 'Sindh' ? (KARACHI.has(district) ? 'karachi' : 'sindh')
      : origin === 'Khyber Pakhtunkhwa' ? (HAZARA.has(district) ? 'hazara' : 'kp')
      : origin === 'Balochistan' ? 'balochistan'
      : origin === 'Islamabad' ? 'islamabad'
      : origin === 'Gilgit Baltistan' ? 'gb' : 'ajk';
    return [featureId(feature, level), owner];
  }));
}
const DISTRICT_ALIASES: Record<string, string> = {
  chagai: 'chaghi', sudhnoti: 'sudhnutti', leiah: 'layyah', dikhan: 'deraismailkhan',
  centralkarachi: 'karachicentral', eastkarachi: 'karachieast', southkarachi: 'karachisouth',
  westkarachi: 'karachiwest', malirkarachi: 'karachimalir', korangikarachi: 'karachikorangi',
};
const ELECTION_ALIASES: Record<string, string> = {
  leiah: 'layyah', kambershahdadkot: 'qambarshahdadkot', shaheedbenazirabad: 'nawabshah',
  umerkot: 'umerkot', centralkarachi: 'central', eastkarachi: 'east', southkarachi: 'south',
  westkarachi: 'west', malirkarachi: 'malir', korangikarachi: 'korangi', dikhan: 'deraismailkhan',
  chitralupper: 'upperchitral', chitrallower: 'lowerchitral', kohistanupper: 'upperkohistan',
  kohistanlower: 'lowerkohistan', kolaipalaskohistan: 'kolaipalas', torghar: 'torghar',
  shaheedsikandarabad: 'surab', musakhel: 'musakhail',
};
const ELECTION_CHILDREN: Record<string, string[]> = {
  rawalpindi: ['murree'], chakwal: ['talagang'], gujranwala: ['wazirabad'],
  muzaffargarh: ['kotaddu'], deraghazikhan: ['taunsa'], west: ['keamari'],
  southwaziristan: ['uppersouthwaziristan', 'lowersouthwaziristan'],
  lasbela: ['hub'], jaffarabad: ['ustamuhammad'],
};
const PARTY_COLORS: Record<string, string> = { 'PTI-backed IND': '#d64b43', 'PML-N': '#2f8a52', PPP: '#252525', 'MQM-P': '#e0a526', 'JUI-F': '#6a8f76', IND: '#8b887f', 'PML-Q': '#74b85a', ANP: '#9f3b3b', BAP: '#788b36', NP: '#b96b6b', 'PTI-P': '#d77b78', JI: '#397db2', GDA: '#6267b8', IPP: '#78a94a', 'BNP-M': '#c6ad2f', 'BNP-A': '#31a697', HDT: '#315fc0', Other: '#aaa49a', Postponed: '#d8d1c5' };

function allocateSeats(parties: Record<string, number>, seats = 23) {
  const total = Object.values(parties).reduce((sum, value) => sum + value, 0);
  if (!total) return {};
  const exact = Object.entries(parties).map(([party, value]) => ({ party, exact: value / total * seats }));
  const result = Object.fromEntries(exact.map(row => [row.party, Math.floor(row.exact)]));
  let left = seats - Object.values(result).reduce((sum: number, value) => sum + Number(value), 0);
  exact.sort((a, b) => (b.exact % 1) - (a.exact % 1)).slice(0, left).forEach(row => { result[row.party]++; });
  return result as Record<string, number>;
}

export default function PakistanMapStudio() {
  const [level, setLevel] = useState<Level>('districts');
  const [features, setFeatures] = useState<Feature[]>([]);
  const [provinces, setProvinces] = useState<Province[]>(CANONICAL);
  const [active, setActive] = useState(CANONICAL[0].id);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Record<string, string>[]>([]);
  const [future, setFuture] = useState<Record<string, string>[]>([]);
  const [query, setQuery] = useState('');
  const [hovered, setHovered] = useState<Feature | null>(null);
  const [painting, setPainting] = useState(false);
  const [toolMode, setToolMode] = useState<'paint' | 'inspect'>('paint');
  const [mapView, setMapView] = useState({ x: 0, y: 0, width: WIDTH, height: HEIGHT });
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [finalized, setFinalized] = useState(false);
  const [rankedOpen, setRankedOpen] = useState(false);
  const [rankMetric, setRankMetric] = useState<RankMetric>('population');
  const [mapName, setMapName] = useState('My province plan');
  const [shareStatus, setShareStatus] = useState('Share link');
  const [darbar, setDarbar] = useState<DarbarData | null>(null);
  const [assembly, setAssembly] = useState<AssemblyData | null>(null);
  const [regionalAssembly, setRegionalAssembly] = useState<RegionalAssemblyData | null>(null);
  const [paletteOpen, setPaletteOpen] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const panRef = useRef<{ pointerId:number; clientX:number; clientY:number; view:typeof mapView } | null>(null);
  const hashLoaded = useRef(false);
  const pendingSharedAssignments = useRef<Record<string, string> | null>(null);
  const hasAssignments = Object.keys(assignments).length > 0;

  useEffect(() => {
    if (!hashLoaded.current) {
      hashLoaded.current = true;
      const raw = window.location.hash.startsWith('#map=') ? window.location.hash.slice(5) : '';
      if (raw) {
        try {
          const shared = decodeShare(raw);
          if (shared.v === 1 && (shared.l === 'districts' || shared.l === 'tehsils')) {
            const restoredProvinces = shared.p.map(([id, name, color, kind]) => ({ id, name, color, kind: kind || 'province' }));
            const restoredAssignments = Object.fromEntries(shared.a.map(([id, , provinceIndex]) => [id, restoredProvinces[provinceIndex]?.id]).filter(([, id]) => id));
            setMapName(shared.n || 'Shared province plan');
            setProvinces(restoredProvinces);
            setActive(restoredProvinces[0]?.id || '');
            setAssignments(restoredAssignments);
            if (shared.l !== level) { pendingSharedAssignments.current = restoredAssignments; setLevel(shared.l); return; }
            fetch(`/data/pakistan-map/${shared.l}.geojson`).then(r => r.json()).then(data => setFeatures(data.features));
            return;
          }
        } catch { window.history.replaceState(null, '', window.location.pathname + window.location.search); }
      }
    }
    if (pendingSharedAssignments.current) {
      const restored = pendingSharedAssignments.current;
      pendingSharedAssignments.current = null;
      fetch(`/data/pakistan-map/${level}.geojson`).then(r => r.json()).then(data => setFeatures(data.features));
      setAssignments(restored); setHistory([]); setFuture([]);
      return;
    }
    const saved = localStorage.getItem(`naya-naqsha-${level}`);
    fetch(`/data/pakistan-map/${level}.geojson`).then(r => r.json()).then(data => {
      setFeatures(data.features);
      if (saved) setAssignments(JSON.parse(saved));
      else { setProvinces(CANONICAL); setActive(CANONICAL[0].id); setMapName('My province plan'); setAssignments({}); }
    });
    setHistory([]); setFuture([]);
  }, [level]);

  useEffect(() => { if (hasAssignments && !darbar) fetch('/data/pakistan-map/datadarbar.json').then(r => r.json()).then(setDarbar).catch(() => setDarbar(null)); }, [darbar, hasAssignments]);
  useEffect(() => { if (finalized && !assembly) fetch('/data/pakistan-map/assembly-2024.json').then(r => r.json()).then(setAssembly).catch(() => setAssembly(null)); }, [assembly, finalized]);
  useEffect(() => { if (finalized && !regionalAssembly) fetch('/data/pakistan-map/regional-assembly-2026.json').then(r => r.json()).then(setRegionalAssembly).catch(() => setRegionalAssembly(null)); }, [finalized, regionalAssembly]);

  useEffect(() => {
    if (Object.keys(assignments).length) localStorage.setItem(`naya-naqsha-${level}`, JSON.stringify(assignments));
  }, [assignments, level]);

  const provinceById = useMemo(() => Object.fromEntries(provinces.map(p => [p.id, p])), [provinces]);
  const assignmentCounts = useMemo(() => Object.values(assignments).reduce<Record<string, number>>((counts, id) => { counts[id] = (counts[id] || 0) + 1; return counts; }, {}), [assignments]);
  const tehsilDataByKey = useMemo(() => new Map((darbar?.tehsils || []).map(row => [`${row.d}:${normalise(row.n)}`, row])), [darbar]);
  const paths = useMemo(() => features.map(feature => ({ feature, d: geometryPath(feature.geometry) })), [features]);
  const matches = useMemo(() => query.trim() ? features.filter(f => `${featureName(f, level)} ${f.properties.district_name} ${f.properties.province_name}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8) : [], [features, level, query]);
  const totalAssigned = Object.keys(assignments).length;
  const districtOwners = useMemo(() => {
    if (level === 'districts') return Object.fromEntries(features.map(feature => [normalise(feature.properties.district_name), assignments[featureId(feature, level)]]).filter(([, owner]) => owner));
    const votes: Record<string, Record<string, number>> = {};
    features.forEach(feature => {
      const owner = assignments[featureId(feature, level)]; if (!owner) return;
      const district = normalise(feature.properties.district_name);
      votes[district] ||= {}; votes[district][owner] = (votes[district][owner] || 0) + 1;
    });
    return Object.fromEntries(Object.entries(votes).map(([district, counts]) => [district, Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]]));
  }, [assignments, features, level]);
  const finalRows = useMemo(() => provinces.map(province => {
    const members = features.filter(feature => assignments[featureId(feature, level)] === province.id);
    const area = members.reduce((sum, feature) => sum + Number(feature.properties.area_km2 || 0), 0);
    const origins = Object.entries(members.reduce<Record<string, number>>((counts, feature) => {
      const origin = String(feature.properties.province_name);
      counts[origin] = (counts[origin] || 0) + 1;
      return counts;
    }, {})).sort((a, b) => b[1] - a[1]);
    let population = 0, literate = 0, literacyBase = 0, urban = 0, urbanBase = 0;
    let weightedUnemployment = 0, unemploymentBase = 0, weightedMpi = 0, mpiBase = 0;
    let weightedRwi = 0, rwiBase = 0, weightedNightLight = 0, nightLightBase = 0, dataMatches = 0;
    let outOfSchool = 0, outOfSchoolMatches = 0;
    const extended = { lfpr: 0, mat: 0, enrol: 0, num: 0, cons: 0, fi: 0, net: 0, elec: 0 };
    const extendedBase = { lfpr: 0, mat: 0, enrol: 0, num: 0, cons: 0, fi: 0, net: 0, elec: 0 };
    const addExtended = (district: DistrictData, pop: number) => {
      (Object.keys(extended) as (keyof typeof extended)[]).forEach(key => {
        const value = district[key];
        if (value != null && pop) { extended[key] += value * pop; extendedBase[key] += pop; }
      });
    };
    for (const feature of members) {
      const districtKeyRaw = normalise(feature.properties.district_name);
      const districtKey = DISTRICT_ALIASES[districtKeyRaw] || districtKeyRaw;
      const district = darbar?.districts[districtKey];
      if (level === 'districts') {
        if (!district) continue;
        dataMatches++;
        const pop = district.p || 0; population += pop;
        if (district.l != null && district.i != null) { literate += district.l; literacyBase += district.l + district.i; }
        if (district.u != null && pop) { urban += district.u; urbanBase += pop; }
        if (district.ur != null && pop) { weightedUnemployment += district.ur * pop; unemploymentBase += pop; }
        if (district.mpi != null && pop) { weightedMpi += district.mpi * pop; mpiBase += pop; }
        if (district.oos != null) { outOfSchool += district.oos; outOfSchoolMatches++; }
        addExtended(district, pop);
      } else {
        const tehsilName = normalise(feature.properties.tehsil_name);
        const tehsil = tehsilDataByKey.get(`${districtKey}:${tehsilName}`);
        if (!tehsil) continue;
        dataMatches++;
        const pop = tehsil.p || 0; population += pop;
        if (district?.l != null && district.i != null && pop) { const rate = district.l / (district.l + district.i); literate += rate * pop; literacyBase += pop; }
        if (district) addExtended(district, pop);
        if (tehsil.r != null && pop) { weightedRwi += tehsil.r * pop; rwiBase += pop; }
        if (tehsil.nl != null && pop) { weightedNightLight += tehsil.nl * pop; nightLightBase += pop; }
      }
    }
    const ownedElectionKeys = new Set<string>();
    Object.entries(districtOwners).filter(([, owner]) => owner === province.id).forEach(([rawKey]) => {
      const key = ELECTION_ALIASES[rawKey] || rawKey;
      ownedElectionKeys.add(key); (ELECTION_CHILDREN[key] || []).forEach(child => ownedElectionKeys.add(child));
    });
    const partySeats: Record<string, number> = {};
    assembly?.districts.filter(row => ownedElectionKeys.has(normalise(row.district))).forEach(row => Object.entries(row.parties).forEach(([party, seats]) => { partySeats[party] = (partySeats[party] || 0) + seats; }));
    const electionSeats = Object.values(partySeats).reduce((sum, seats) => sum + seats, 0);
    const senateSeats = allocateSeats(partySeats);
    const regionalSeats: Record<string, number> = {};
    const regionalRegions = new Set<string>();
    regionalAssembly?.districts.filter(row => ownedElectionKeys.has(normalise(row.district))).forEach(row => { regionalRegions.add(row.region); Object.entries(row.parties).forEach(([party, seats]) => { regionalSeats[party] = (regionalSeats[party] || 0) + seats; }); });
    const regionalSeatCount = Object.values(regionalSeats).reduce((sum, seats) => sum + seats, 0);
    return { ...province, members, area, origins, dataMatches, population, partySeats, electionSeats, senateSeats, regionalSeats, regionalSeatCount, regionalRegions: [...regionalRegions],
      literacy: literacyBase ? literate / literacyBase * 100 : null,
      urbanShare: urbanBase ? urban / urbanBase * 100 : null,
      unemployment: unemploymentBase ? weightedUnemployment / unemploymentBase : null,
      outOfSchool: outOfSchoolMatches ? outOfSchool : null,
      lfpr: extendedBase.lfpr ? extended.lfpr / extendedBase.lfpr : null,
      matricPlus: extendedBase.mat ? extended.mat / extendedBase.mat : null,
      enrolment: extendedBase.enrol ? extended.enrol / extendedBase.enrol : null,
      numeracy: extendedBase.num ? extended.num / extendedBase.num : null,
      consumption: extendedBase.cons ? extended.cons / extendedBase.cons : null,
      foodInsecurity: extendedBase.fi ? extended.fi / extendedBase.fi : null,
      internet: extendedBase.net ? extended.net / extendedBase.net : null,
      electricity: extendedBase.elec ? extended.elec / extendedBase.elec : null,
      mpi: mpiBase ? weightedMpi / mpiBase : null,
      rwi: rwiBase ? weightedRwi / rwiBase : null,
      nightLight: nightLightBase ? weightedNightLight / nightLightBase : null };
  }), [assembly, assignments, darbar, districtOwners, features, level, provinces, regionalAssembly, tehsilDataByKey]);
  const assignedArea = finalRows.reduce((sum, row) => sum + row.area, 0);
  const activeRow = finalRows.find(row => row.id === active);
  const selectedDistrictKeyRaw = selectedFeature ? normalise(selectedFeature.properties.district_name) : '';
  const selectedDistrictKey = DISTRICT_ALIASES[selectedDistrictKeyRaw] || selectedDistrictKeyRaw;
  const selectedDistrict = selectedDistrictKey ? darbar?.districts[selectedDistrictKey] : null;
  const selectedTehsil = selectedFeature && level === 'tehsils' ? tehsilDataByKey.get(`${selectedDistrictKey}:${normalise(selectedFeature.properties.tehsil_name)}`) : null;
  const rankedRows = useMemo(() => finalRows.filter(row => row.members.length && row[rankMetric] != null).sort((a, b) => Number(b[rankMetric]) - Number(a[rankMetric])), [finalRows, rankMetric]);
  const rankMaximum = Math.max(...rankedRows.map(row => Number(row[rankMetric])), 1);
  const formatRankValue = (value: number) => rankMetric === 'population' || rankMetric === 'outOfSchool'
    ? Math.round(value).toLocaleString()
    : rankMetric === 'consumption' ? `Rs ${Math.round(value).toLocaleString()}`
    : rankMetric === 'mpi' ? value.toFixed(3) : `${value.toFixed(1)}%`;

  const paint = useCallback((feature: Feature) => {
    const id = featureId(feature, level);
    if (assignments[id] === active) return;
    setHistory(h => [...h.slice(-39), assignments]);
    setFuture([]);
    setAssignments(current => ({ ...current, [id]: active }));
  }, [active, assignments, level]);

  const zoomMap = useCallback((factor:number, anchorX = .5, anchorY = .5) => {
    setMapView(view => {
      const width = Math.max(220, Math.min(WIDTH, view.width * factor));
      const height = width * HEIGHT / WIDTH;
      const x = Math.max(0, Math.min(WIDTH - width, view.x + (view.width - width) * anchorX));
      const y = Math.max(0, Math.min(HEIGHT - height, view.y + (view.height - height) * anchorY));
      return { x, y, width, height };
    });
  }, []);
  const resetMapView = () => setMapView({ x:0, y:0, width:WIDTH, height:HEIGHT });

  const undo = () => setHistory(h => {
    if (!h.length) return h;
    const previous = h[h.length - 1];
    setFuture(f => [assignments, ...f]); setAssignments(previous);
    return h.slice(0, -1);
  });
  const redo = () => setFuture(f => {
    if (!f.length) return f;
    const next = f[0]; setHistory(h => [...h, assignments]); setAssignments(next);
    return f.slice(1);
  });

  const addProvince = () => {
    const id = `province-${Date.now()}`;
    const next: Province = { id, name: `Province ${provinces.length + 1}`, color: PALETTE[provinces.length % PALETTE.length], kind: 'province' };
    setProvinces(p => [...p, next]); setActive(id);
  };

  const removeProvince = (id: string) => {
    if (provinces.length <= 1) return;
    const remaining = provinces.filter(province => province.id !== id);
    setProvinces(remaining);
    setAssignments(current => Object.fromEntries(Object.entries(current).filter(([, owner]) => owner !== id)));
    if (active === id) setActive(remaining[0].id);
    setHistory([]); setFuture([]);
  };

  const setProvinceColor = (id: string, color: string) => setProvinces(items => items.map(item => item.id === id ? { ...item, color } : item));

  const clearMap = () => {
    setHistory(h => [...h, assignments]); setAssignments({}); setFuture([]);
    localStorage.removeItem(`naya-naqsha-${level}`);
  };

  const loadCanonical = () => {
    setHistory(h => [...h, assignments]); setFuture([]);
    setProvinces(CANONICAL); setActive(CANONICAL[0].id);
    setMapName('Canonical province split');
    setAssignments(canonicalAssignments(features, level));
  };

  const exportPlan = () => {
    const payload = { title: 'Naya Naqsha', level, provinces, assignments, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `pakistan-${level}-province-plan.json`; link.click(); URL.revokeObjectURL(link.href);
  };

  const exportPng = () => {
    if (!svgRef.current) return;
    const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);
    const canvas = document.createElement('canvas'); canvas.width = 1520; canvas.height = 1800;
    const context = canvas.getContext('2d'); if (!context) return;
    context.fillStyle = '#f5f0e7'; context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#293027'; context.font = '600 58px sans-serif'; context.fillText(mapName.trim() || 'My province plan', 70, 82);
    context.fillStyle = '#77766f'; context.font = '24px monospace'; context.fillText(`PAKISTAN · ${level.toUpperCase()} · NAYA NAQSHA`, 72, 126);
    const image = new Image(); image.onload = () => { context.drawImage(image, 0, 160, canvas.width, 1640); const link = document.createElement('a'); link.download = `${(mapName.trim() || `pakistan-${level}-map`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.png`; link.href = canvas.toDataURL('image/png'); link.click(); };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;
  };

  const currentShareConfig = (): SharedMap => {
    const provinceIndex = Object.fromEntries(provinces.map((province, index) => [province.id, index]));
    return { v: 1, n: mapName.trim() || 'Untitled province plan', l: level,
      p: provinces.map(province => [province.id, province.name, province.color, province.kind]),
      a: features.filter(feature => assignments[featureId(feature, level)] !== undefined).map(feature => [featureId(feature, level), featureName(feature, level), provinceIndex[assignments[featureId(feature, level)]]]),
    };
  };

  const openProfile = (unitId: string) => {
    window.open(`/pakistan-map/profile#map=${encodeShare(currentShareConfig())}&unit=${encodeURIComponent(unitId)}`, '_blank', 'noopener,noreferrer');
  };

  const shareMap = async () => {
    const config = currentShareConfig();
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#map=${encodeShare(config)}`;
    window.history.replaceState(null, '', url);
    try { await navigator.clipboard.writeText(url); setShareStatus('Link copied!'); }
    catch { setShareStatus('Link ready'); }
    window.setTimeout(() => setShareStatus('Share link'), 1800);
  };

  return (
    <main className="naqsha-shell" onPointerUp={() => setPainting(false)} onPointerLeave={() => setPainting(false)}>
      <header className="naqsha-header">
        <a className="brand" href="/" aria-label="Back to saad’s website"><span className="brand-mark">ن</span><span>NAYA NAQSHA<small>PROVINCE BUILDER</small></span></a>
        <input className="map-name-input" value={mapName} onChange={e => setMapName(e.target.value)} aria-label="Map name" placeholder="Name your map" />
        <div className="header-actions"><button onClick={undo} disabled={!history.length} aria-label="Undo">↶</button><button onClick={redo} disabled={!future.length} aria-label="Redo">↷</button><button className="export" onClick={exportPng}>Export PNG</button><button className="export share-button" disabled={!totalAssigned} onClick={shareMap}>{shareStatus}</button><button className="export dark finalize-button" disabled={!totalAssigned} onClick={() => setFinalized(true)}>Finalize map →</button></div>
      </header>

      <section className="studio">
        <aside className="control-panel">
          <div className="eyebrow"><span>01</span> CHOOSE THE BUILDING BLOCK</div>
          <div className="segmented" role="group" aria-label="Map detail">
            <button className={level === 'districts' ? 'selected' : ''} onClick={() => setLevel('districts')}>Districts <b>160</b></button>
            <button className={level === 'tehsils' ? 'selected' : ''} onClick={() => setLevel('tehsils')}>Tehsils <b>577</b></button>
          </div>
          <button className="preset-button" onClick={loadCanonical}><span>◆</span><b>Load canonical split</b><small>Karachi · South Punjab · Hazara</small></button>

          <div className="eyebrow province-title"><span>02</span> YOUR MAP UNITS</div>
          <p className="hint">Set each unit as a province or territory, then paint.</p>
          <div className="province-list">
            {provinces.map((province, index) => {
              const count = assignmentCounts[province.id] || 0;
              return <div className={`province-row ${active === province.id ? 'active' : ''}`} key={province.id} onClick={() => setActive(province.id)}>
                <button className="swatch" style={{ background: province.color }} aria-label={`Choose ${province.name} colour`} aria-expanded={paletteOpen === province.id} onClick={e => { e.stopPropagation(); setPaletteOpen(open => open === province.id ? null : province.id); }}/>
                {paletteOpen === province.id && <div className="paint-palette" onClick={e => e.stopPropagation()}>
                  <div className="paint-palette-head"><span className="paint-wells"><i style={{background:province.color}}/><i/></span><b>COLOURS</b><button onClick={()=>setPaletteOpen(null)} aria-label="Close colour palette">×</button></div>
                  <div className="paint-color-grid">{PAINT_COLORS.map(color=><button key={color} className={color.toLowerCase()===province.color.toLowerCase()?'selected':''} style={{background:color}} onClick={()=>{setProvinceColor(province.id,color);setPaletteOpen(null)}} aria-label={`Use colour ${color}`}/>)}</div>
                  <label className="custom-color"><span>EDIT COLOUR</span><input type="color" value={province.color} aria-label={`Custom colour for ${province.name}`} onChange={e=>setProvinceColor(province.id,e.target.value)}/></label>
                </div>}
                <div className="name-editor"><input className="province-name" value={province.name} aria-label={`Map unit ${index + 1} name`} onChange={e => setProvinces(items => items.map(item => item.id === province.id ? { ...item, name: e.target.value } : item))}/></div>
                <button className={`unit-kind ${province.kind}`} onClick={e => { e.stopPropagation(); setProvinces(items => items.map(item => item.id === province.id ? { ...item, kind: item.kind === 'province' ? 'territory' : 'province' } : item)); }} aria-label={`Set ${province.name} as ${province.kind === 'province' ? 'territory' : 'province'}`}>{province.kind}</button>
                <span className="count">{count}</span>
                <button className="remove-unit" disabled={provinces.length <= 1} onClick={e => { e.stopPropagation(); removeProvince(province.id); }} aria-label={`Delete ${province.name}`} title={provinces.length <= 1 ? 'At least one map unit is required' : `Delete ${province.name}`}><span className="trash-icon" aria-hidden="true"/></button>
              </div>;
            })}
          </div>
          <button className="add-province" onClick={addProvince}>＋ Add a map unit</button>
          <div className="tip"><b>TIP</b><span>Click and drag across neighbouring areas to paint faster.</span></div>
        </aside>

        <section className="map-stage">
          <div className="map-toolbar">
            <div className="search-wrap"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder={`Find a ${level === 'districts' ? 'district' : 'tehsil'}…`} aria-label="Search areas"/>
              {matches.length > 0 && <div className="search-results">{matches.map(f => <button key={featureId(f, level)} onClick={() => { setHovered(f); setSelectedFeature(f); setToolMode('inspect'); setQuery(''); }}>{featureName(f, level)}<small>{String(f.properties.district_name)} · {String(f.properties.province_name)}</small></button>)}</div>}
            </div>
            <div className="map-tools" role="group" aria-label="Map interaction mode"><button className={toolMode === 'paint' ? 'selected' : ''} onClick={() => { setToolMode('paint'); setSelectedFeature(null); }}>Paint</button><button className={toolMode === 'inspect' ? 'selected' : ''} onClick={() => setToolMode('inspect')}>Inspect</button></div>
          </div>
          <div className="map-paper">
            {!features.length && <div className="loading">Drawing boundaries…</div>}
            <svg ref={svgRef} viewBox={`${mapView.x} ${mapView.y} ${mapView.width} ${mapView.height}`} role="img" aria-label={`Interactive map of Pakistan ${level}`} onWheel={e=>{e.preventDefault();const rect=e.currentTarget.getBoundingClientRect();zoomMap(e.deltaY>0?1.16:.86,(e.clientX-rect.left)/rect.width,(e.clientY-rect.top)/rect.height)}} onPointerDown={e=>{if(!(e.shiftKey||e.button===1||e.target===e.currentTarget))return;e.currentTarget.setPointerCapture(e.pointerId);panRef.current={pointerId:e.pointerId,clientX:e.clientX,clientY:e.clientY,view:mapView}}} onPointerMove={e=>{const pan=panRef.current;if(!pan||pan.pointerId!==e.pointerId)return;const rect=e.currentTarget.getBoundingClientRect();const x=Math.max(0,Math.min(WIDTH-pan.view.width,pan.view.x-(e.clientX-pan.clientX)/rect.width*pan.view.width));const y=Math.max(0,Math.min(HEIGHT-pan.view.height,pan.view.y-(e.clientY-pan.clientY)/rect.height*pan.view.height));setMapView({...pan.view,x,y})}} onPointerUp={e=>{if(panRef.current?.pointerId===e.pointerId)panRef.current=null}} onPointerCancel={()=>{panRef.current=null}}>
              <g fillRule="evenodd">
                {paths.map(({ feature, d }) => {
                  const id = featureId(feature, level); const province = provinceById[assignments[id]];
                  const highlighted = hovered && featureId(hovered, level) === id;
                  return <path key={id} d={d} fill={province?.color || '#e8e1d5'} className={highlighted ? 'region highlighted' : 'region'} onPointerDown={e => { if (e.shiftKey||e.button===1) return; if (toolMode === 'inspect') { setSelectedFeature(feature); setPainting(false); return; } e.currentTarget.setPointerCapture(e.pointerId); setPainting(true); paint(feature); }} onPointerEnter={() => { setHovered(feature); if (painting && toolMode === 'paint') paint(feature); }} onPointerMove={() => painting && toolMode === 'paint' && paint(feature)} onPointerUp={() => setPainting(false)}/>;
                })}
              </g>
            </svg>
            <div className="map-navigation" role="group" aria-label="Map zoom controls"><button onClick={()=>zoomMap(.8)} aria-label="Zoom in">+</button><button onClick={()=>zoomMap(1.25)} aria-label="Zoom out">−</button><button onClick={resetMapView} aria-label="Reset map view">⌂</button></div>
            <div className="north">N<span>↑</span></div>
            {hovered && <div className="map-tooltip"><b>{featureName(hovered, level)}</b><span>{level === 'tehsils' && `${String(hovered.properties.district_name)} · `}{String(hovered.properties.province_name)}</span><small>{provinceById[assignments[featureId(hovered, level)]]?.name || 'Unassigned'}</small></div>}
            {selectedFeature && toolMode === 'inspect' && <aside className="district-drawer"><div className="district-head"><div><small>{level === 'tehsils' ? 'TEHSIL DETAIL' : 'DISTRICT DETAIL'}</small><h2>{featureName(selectedFeature, level)}</h2><p>{level === 'tehsils' && `${String(selectedFeature.properties.district_name)} · `}{String(selectedFeature.properties.province_name)}</p></div><button onClick={() => setSelectedFeature(null)} aria-label="Close district details">×</button></div>{selectedDistrict ? <div className="district-stats"><span><b>{selectedTehsil?.p || selectedDistrict.p ? `${((selectedTehsil?.p || selectedDistrict.p || 0)/1_000_000).toFixed(2)}m` : '—'}</b>{level === 'tehsils' ? 'estimated population' : 'population · 2023'}</span><span><b>{selectedDistrict.l != null && selectedDistrict.i != null ? `${(selectedDistrict.l/(selectedDistrict.l+selectedDistrict.i)*100).toFixed(1)}%` : '—'}</b>literacy</span><span><b>{selectedDistrict.mat==null?'—':`${selectedDistrict.mat.toFixed(1)}%`}</b>matric or higher</span><span><b>{selectedDistrict.enrol==null?'—':`${selectedDistrict.enrol.toFixed(1)}%`}</b>net enrolment</span><span><b>{selectedDistrict.lfpr==null?'—':`${selectedDistrict.lfpr.toFixed(1)}%`}</b>labor-force participation</span><span><b>{selectedDistrict.ur==null?'—':`${selectedDistrict.ur.toFixed(1)}%`}</b>unemployment</span><span><b>{selectedDistrict.cons==null?'—':`Rs ${Math.round(selectedDistrict.cons).toLocaleString()}`}</b>consumption / person</span><span><b>{selectedDistrict.mpi==null?'—':selectedDistrict.mpi.toFixed(3)}</b>MPI</span><span><b>{selectedDistrict.net==null?'—':`${selectedDistrict.net.toFixed(1)}%`}</b>internet users</span><span><b>{selectedDistrict.elec==null?'—':`${selectedDistrict.elec.toFixed(1)}%`}</b>electricity access</span>{selectedTehsil && <><span><b>{selectedTehsil.r==null?'—':`${selectedTehsil.r.toFixed(0)}th`}</b>wealth percentile</span><span><b>{selectedTehsil.nl==null?'—':selectedTehsil.nl.toFixed(2)}</b>night radiance</span></>}</div>:<p className="district-empty">No matched Data Darbar record is available for this area.</p>}<footer>Data Darbar · PBS Census 2023 and household surveys</footer></aside>}
            <div className="map-caption">BOUNDARIES ARE INDICATIVE · {level.toUpperCase()} VIEW</div>
          </div>
        </section>

        <aside className="summary-panel">
          <div className="eyebrow"><span>03</span> YOUR NEW MAP</div>
          {activeRow && <section className="live-vitals" style={{ '--province-color': activeRow.color } as React.CSSProperties}>
            <div className="live-vitals-head"><div><small>{activeRow.kind}</small><h2>{activeRow.name}</h2></div><b>{activeRow.members.length}</b></div>
            {activeRow.members.length ? <><div className="live-vitals-grid"><span><b>{activeRow.population ? `${(activeRow.population/1_000_000).toFixed(2)}m` : '—'}</b>population</span><span><b>{activeRow.population && finalRows.reduce((sum,row)=>sum+row.population,0) ? `${(activeRow.population/finalRows.reduce((sum,row)=>sum+row.population,0)*100).toFixed(1)}%` : '—'}</b>mapped share</span><span><b>{activeRow.literacy==null?'—':`${activeRow.literacy.toFixed(1)}%`}</b>literacy</span><span><b>{activeRow.matricPlus==null?'—':`${activeRow.matricPlus.toFixed(1)}%`}</b>matric+</span><span><b>{activeRow.urbanShare==null?'—':`${activeRow.urbanShare.toFixed(1)}%`}</b>urban</span><span><b>{activeRow.consumption==null?'—':`Rs ${Math.round(activeRow.consumption).toLocaleString()}`}</b>consumption / person</span></div><button onClick={() => openProfile(activeRow.id)}>Open full profile ↗</button></> : <p>Paint districts or tehsils with {activeRow.name} to see its live statistics.</p>}
          </section>}
          <div className="big-stat"><strong>{provinces.length}</strong><span>PROVINCES<br/>CREATED</span></div>
          <div className="assignment-stat"><span>{totalAssigned} of {features.length}</span><span>{Math.round(totalAssigned / Math.max(features.length, 1) * 100)}% assigned</span><div><i style={{ width: `${totalAssigned / Math.max(features.length, 1) * 100}%` }}/></div></div>
          <div className="summary-list">{provinces.map(p => { const count = assignmentCounts[p.id] || 0; return <div key={p.id}><i style={{ background: p.color }}/><span>{p.name}</span><b>{count}</b></div>; })}</div>
          <div className="unassigned"><i/>Unassigned <b>{features.length - totalAssigned}</b></div>
          <button className="clear" onClick={clearMap}>Clear map</button>
          <p className="source-note">Boundary data: <a href="https://github.com/abdullahumer1101/pkmapr" target="_blank" rel="noreferrer">pkmapr / OCHA</a>. Administrative boundaries and names may change.</p>
        </aside>
      </section>
      {finalized && <div className="final-overlay" role="dialog" aria-modal="true" aria-labelledby="final-title" onMouseDown={e => e.target === e.currentTarget && setFinalized(false)}>
        <section className="final-sheet">
          <div className="final-head"><div><span>PROVINCE PLAN · {level.toUpperCase()}</span><h1 id="final-title">{mapName || 'Untitled province plan'}</h1><p>{totalAssigned} of {features.length} {level} assigned across {provinces.filter(p => finalRows.find(r => r.id === p.id)?.members.length).length} populated provinces.</p></div><div className="final-head-actions"><button className="compare-button" onClick={() => setRankedOpen(true)}>Compare provinces</button><button onClick={() => setFinalized(false)} aria-label="Close summary">×</button></div></div>
          {rankedOpen && <aside className="rank-drawer" aria-label="Rank proposed provinces by indicator">
            <div className="rank-head"><div><span>VITAL STATISTICS</span><h2>Compare provinces</h2><p>Ranked highest to lowest for the selected indicator.</p></div><button onClick={() => setRankedOpen(false)} aria-label="Close comparison">×</button></div>
            <div className="rank-picker" role="tablist" aria-label="Choose indicator">{RANK_METRICS.map(metric => <button key={metric.key} className={rankMetric === metric.key ? 'selected' : ''} onClick={() => setRankMetric(metric.key)} role="tab" aria-selected={rankMetric === metric.key}>{metric.label}</button>)}</div>
            <div className="rank-context"><b>{RANK_METRICS.find(metric => metric.key === rankMetric)?.label}</b><span>{RANK_METRICS.find(metric => metric.key === rankMetric)?.unit}</span></div>
            <ol className="rank-list">{rankedRows.map((row, index) => <li key={row.id}><div className="rank-place">{String(index + 1).padStart(2, '0')}</div><div className="rank-result"><div><b>{row.name}</b><strong>{formatRankValue(Number(row[rankMetric]))}</strong></div><span><i style={{ width: `${Number(row[rankMetric]) / rankMaximum * 100}%`, background: row.color }}/></span></div></li>)}</ol>
            <p className="rank-note">Figures marked as estimates in the province cards use the same underlying district-weighted method here. Higher MPI and food insecurity indicate worse outcomes.</p>
          </aside>}
          <div className="final-grid">
            {finalRows.filter(row => row.members.length).map((row, index) => <article key={row.id} style={{ '--province-color': row.color } as React.CSSProperties}>
              <div className="final-number">{String(index + 1).padStart(2, '0')}</div>
              <div><div className="unit-heading"><div><h2>{row.name}</h2><button className="open-profile" onClick={() => openProfile(row.id)}>Open full profile ↗</button></div><span className={`status-pill ${row.kind}`}>{row.kind} · {row.kind === 'province' ? 'included in NA calculation' : 'excluded from NA calculation'}</span></div>
              <section className="metric-section overview-metrics"><h3>At a glance</h3><div className="final-metrics"><span><b>{row.members.length}</b>{level}</span><span><b>{Math.round(row.area).toLocaleString()}</b>km²</span><span><b>{row.population ? (row.population / 1_000_000).toFixed(2) + 'm' : '—'}</b>{level === 'tehsils' ? 'estimated population' : 'population · 2023'}</span><span><b>{row.urbanShare == null ? '—' : `${row.urbanShare.toFixed(1)}%`}</b>urban share</span></div></section>
              <section className="metric-section"><h3>Education</h3><div className="final-metrics"><span><b>{row.literacy == null ? '—' : `${level === 'tehsils' ? '≈' : ''}${row.literacy.toFixed(1)}%`}</b>literacy · 2023</span><span><b>{row.matricPlus == null ? '—' : `≈${row.matricPlus.toFixed(1)}%`}</b>matric or higher</span><span><b>{row.enrolment == null ? '—' : `≈${row.enrolment.toFixed(1)}%`}</b>net enrolment</span><span><b>{row.numeracy == null ? '—' : `≈${row.numeracy.toFixed(1)}%`}</b>numeracy</span>{level === 'districts' && <span className="wide-metric"><b>{row.outOfSchool == null ? '—' : Math.round(row.outOfSchool).toLocaleString()}</b>children aged 5–16 out of school</span>}</div></section>
              <section className="metric-section"><h3>Economy &amp; living conditions</h3><div className="final-metrics"><span><b>{row.consumption == null ? '—' : `Rs ${Math.round(row.consumption).toLocaleString()}`}</b>monthly consumption / person</span><span><b>{row.lfpr == null ? '—' : `≈${row.lfpr.toFixed(1)}%`}</b>labor-force participation</span><span><b>{row.foodInsecurity == null ? '—' : `≈${row.foodInsecurity.toFixed(1)}%`}</b>food insecurity</span><span><b>{row.internet == null ? '—' : `≈${row.internet.toFixed(1)}%`}</b>internet users</span><span><b>{row.electricity == null ? '—' : `≈${row.electricity.toFixed(1)}%`}</b>electricity access</span>{level === 'districts' ? <><span><b>{row.mpi == null ? '—' : row.mpi.toFixed(3)}</b>MPI · 2019–20</span><span><b>{row.unemployment == null ? '—' : `${row.unemployment.toFixed(1)}%`}</b>unemployment</span></> : <><span><b>{row.rwi == null ? '—' : `${row.rwi.toFixed(0)}th`}</b>wealth percentile</span><span><b>{row.nightLight == null ? '—' : row.nightLight.toFixed(2)}</b>night radiance · 2026</span></>}</div></section>
              <div className="origin-bar">{row.origins.map(([origin, count]) => <i key={origin} style={{ width: `${count / row.members.length * 100}%` }} title={`${origin}: ${count}`}/>)}</div>
              <p>Drawn from {row.origins.map(([origin, count]) => `${count} ${origin}`).join(' · ')} · Data matched for {row.dataMatches}/{row.members.length} units</p>
              {row.regionalSeatCount > 0 && <div className="politics-block regional-politics"><div className="politics-title"><b>{row.regionalRegions.join(' + ')} 2026 assembly results</b><span>{row.regionalSeatCount} mapped general seats</span></div><div className="party-bar">{Object.entries(row.regionalSeats).sort((a,b) => b[1] - a[1]).map(([party,seats]) => <i key={party} style={{ width: `${seats / row.regionalSeatCount * 100}%`, background: PARTY_COLORS[party] || '#9b958a' }} title={`${party}: ${seats}`}/>)}</div><div className="party-list">{Object.entries(row.regionalSeats).sort((a,b) => b[1] - a[1]).map(([party,seats]) => <span key={party}><i style={{ background: PARTY_COLORS[party] || '#9b958a' }}/>{party}<b>{seats}</b></span>)}</div><p>Latest 2026 regional election results follow their districts if AJK or GB is split. Pending AJK seats and non-geographic refugee seats are excluded.</p></div>}
              {row.electionSeats > 0 && <div className="politics-block">
                <div className="politics-title"><b>2024 assembly replay</b><span>{row.electionSeats} directly elected seats</span></div>
                <div className="party-bar">{Object.entries(row.partySeats).sort((a,b) => b[1] - a[1]).map(([party,seats]) => <i key={party} style={{ width: `${seats / row.electionSeats * 100}%`, background: PARTY_COLORS[party] || '#9b958a' }} title={`${party}: ${seats}`}/>)}</div>
                <div className="party-list">{Object.entries(row.partySeats).sort((a,b) => b[1] - a[1]).map(([party,seats]) => <span key={party}><i style={{ background: PARTY_COLORS[party] || '#9b958a' }}/>{party}<b>{seats}</b></span>)}</div>
                {row.kind === 'province' && <div className="senate-line"><div className="senate-title"><strong>Province-wide Senate projection</strong><span>23 seats elected by this proposed assembly</span></div><div className="senate-bar">{Object.entries(row.senateSeats).filter(([,seats]) => seats > 0).sort((a,b) => b[1] - a[1]).map(([party,seats]) => <i key={party} style={{ width: `${seats / 23 * 100}%`, background: PARTY_COLORS[party] || '#9b958a' }} title={`${party}: ${seats}`}/>)}</div><div className="senate-parties">{Object.entries(row.senateSeats).filter(([,seats]) => seats > 0).sort((a,b) => b[1] - a[1]).map(([party,seats]) => <span key={party}><i style={{ background: PARTY_COLORS[party] || '#9b958a' }}/>{party}<b>{seats}</b></span>)}</div></div>}
              </div>}
              </div>
            </article>)}
          </div>
          <footer className="final-footer"><p><b>Data & method</b> <a href="https://darbar.adaad.org/" target="_blank" rel="noreferrer">Data Darbar</a>: PBS Census 2023, PSLM/HIES education, employment and living-conditions measures, Meta/WorldPop wealth and population, and VIIRS night lights. Custom-province GDP is not published, so monthly household consumption, wealth and night lights are shown as economic proxies—not GDP estimates. Tehsil figures marked ≈ apply district rates to tehsil populations. Politics replays February 2024 general-seat winners by district; reserved seats are excluded. The Senate line is a 23-seat proportional scenario, not a legal prediction.</p><div><button onClick={exportPng}>Export PNG</button><button onClick={shareMap}>{shareStatus}</button><button className="dark" onClick={exportPlan}>Download plan</button></div></footer>
        </section>
      </div>}
    </main>
  );
}
