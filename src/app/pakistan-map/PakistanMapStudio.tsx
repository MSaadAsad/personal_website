'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { completeRegionalPopulation2017, isRegionalPopulationDistrict, regionalDistrictPopulation2017, regionalSocialStats } from './regional-population';
import { buildTehsilDataLookup } from './tehsil-data-match';
import { aggregateCensus, type CensusDetail } from './census-detail';

type Level = 'divisions' | 'districts' | 'tehsils';
type Props = Record<string, string | number>;
type Feature = { type: 'Feature'; properties: Props; geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: number[][][] | number[][][][] } };
type UnitKind = 'province' | 'territory';
type PanelSide = 'left' | 'right';
type Province = { id: string; name: string; color: string; kind: UnitKind; capital?: string };
type SharedMap = { v: 1; n: string; l: Level; p: [string, string, string, UnitKind?, string?][]; a: [string, string, number][] };
type DistrictData = { n: string; p: number | null; l: number | null; i: number | null; u: number | null; ur: number | null; lfpr: number | null; oos: number | null; mat: number | null; enrol: number | null; num: number | null; cons: number | null; fi: number | null; net: number | null; elec: number | null; mpi: number | null; h: number | null };
type TehsilData = { n: string; d: string; p: number | null; r: number | null; nl: number | null };
type DarbarData = { source: string; generated: string; methodology: string; districts: Record<string, DistrictData>; tehsils: TehsilData[] };
type ElectionYear = 2018 | 2024;
type AssemblyDistrict = { district: string; districts?: string[]; province: string; seats: number; parties: Record<string, number> };
type AssemblyData = { election: string; year?: number; basis: string; source: string; districts: AssemblyDistrict[] };
type RegionalAssemblyData = { generated: string; sources: Record<string, string>; notes: Record<string, string>; districts: { region: 'AJK' | 'GB'; district: string; parties: Record<string, number> }[] };
type RankMetric = 'population' | 'literacy' | 'matricPlus' | 'outOfSchool' | 'consumption' | 'lfpr' | 'foodInsecurity' | 'internet' | 'electricity' | 'mpi';
type InspectMetric = 'allocation' | 'population' | 'density' | 'growthRate' | 'householdSize' | 'under15Share' | 'workingAgeShare' | 'dependencyRatio' | 'literacy' | 'urbanShare' | 'matricPlus' | 'outOfSchool' | 'consumption' | 'lfpr' | 'foodInsecurity' | 'internet' | 'electricity' | 'mpi' | 'improvedWater' | 'waterInside' | 'flushToilet' | 'noToilet' | 'ownedHousing' | 'oneRoomHousing';
type CityMarker = { name: string; lon: number; lat: number; tier: 1 | 2; dx?: number; dy?: number; anchor?: 'start' | 'middle' | 'end' };

const RANK_METRICS: { key: RankMetric; label: string; unit: string }[] = [
  { key: 'population', label: 'Population', unit: 'people' },
  { key: 'literacy', label: 'Literacy', unit: '%' },
  { key: 'matricPlus', label: 'Matric or higher', unit: '%' },
  { key: 'outOfSchool', label: 'Out of school', unit: 'children' },
  { key: 'consumption', label: 'Rural consumption estimate', unit: 'Rs / person' },
  { key: 'lfpr', label: 'Census LFPR estimate', unit: '%' },
  { key: 'foodInsecurity', label: 'Rural food-insecurity estimate', unit: '%' },
  { key: 'internet', label: 'Rural internet-use estimate', unit: '%' },
  { key: 'electricity', label: 'Rural electricity estimate', unit: '%' },
  { key: 'mpi', label: 'Data Darbar deprivation index', unit: 'index' },
];
const INSPECT_METRICS: { key: InspectMetric; label: string; unit: string; scale: 'allocation' | 'percent' | 'index' | 'observed' }[] = [
  { key:'allocation', label:'Province allocation', unit:'', scale:'allocation' },
  { key:'population', label:'Population', unit:'people', scale:'observed' },
  { key:'density', label:'Population density', unit:'people / km²', scale:'observed' },
  { key:'growthRate', label:'Annual population growth', unit:'%', scale:'observed' },
  { key:'householdSize', label:'Average household size', unit:'people / household', scale:'observed' },
  { key:'under15Share', label:'Population under 15', unit:'%', scale:'percent' },
  { key:'workingAgeShare', label:'Working-age population', unit:'%', scale:'percent' },
  { key:'dependencyRatio', label:'Age dependency ratio', unit:'per 100 working-age', scale:'percent' },
  { key:'literacy', label:'Literacy', unit:'%', scale:'percent' },
  { key:'urbanShare', label:'Urban share', unit:'%', scale:'percent' },
  { key:'matricPlus', label:'Matric or higher', unit:'%', scale:'percent' },
  { key:'outOfSchool', label:'Out of school', unit:'children', scale:'observed' },
  { key:'consumption', label:'Rural consumption estimate', unit:'Rs / person', scale:'observed' },
  { key:'lfpr', label:'Census LFPR estimate', unit:'%', scale:'percent' },
  { key:'foodInsecurity', label:'Rural food-insecurity estimate', unit:'%', scale:'percent' },
  { key:'internet', label:'Rural internet-use estimate', unit:'%', scale:'percent' },
  { key:'electricity', label:'Rural electricity estimate', unit:'%', scale:'percent' },
  { key:'mpi', label:'Data Darbar deprivation index', unit:'index', scale:'index' },
  { key:'improvedWater', label:'Improved drinking water', unit:'% households', scale:'percent' },
  { key:'waterInside', label:'Water inside the home', unit:'% households', scale:'percent' },
  { key:'flushToilet', label:'Flush toilet', unit:'% households', scale:'percent' },
  { key:'noToilet', label:'No toilet', unit:'% households', scale:'percent' },
  { key:'ownedHousing', label:'Owner-occupied housing', unit:'% households', scale:'percent' },
  { key:'oneRoomHousing', label:'One-room housing', unit:'% households', scale:'percent' },
];
const BASIC_INSPECT_METRIC_KEYS: InspectMetric[] = ['allocation','population','density','literacy','urbanShare','consumption','mpi'];
const OTHER_INSPECT_METRIC_GROUPS: { label: string; keys: InspectMetric[] }[] = [
  { label:'Population & households', keys:['growthRate','householdSize','under15Share','workingAgeShare','dependencyRatio'] },
  { label:'Education', keys:['matricPlus','outOfSchool'] },
  { label:'Work & living conditions', keys:['lfpr','foodInsecurity','internet','electricity'] },
  { label:'Housing & services', keys:['improvedWater','waterInside','flushToilet','noToilet','ownedHousing','oneRoomHousing'] },
];

// Ordered so consecutive map units differ strongly in both hue and lightness.
// Keep this longer than the usual unit list so colours do not repeat early.
const PALETTE = [
  '#4f7bd9', '#ef6a55', '#42a66c', '#a967c7', '#f2b93f', '#2e9daa',
  '#d65392', '#8c6b4f', '#78a950', '#e68235', '#5964bd', '#b84848',
  '#56b6d2', '#8463a9', '#c8952f', '#397f68', '#e35d68', '#648a3f',
  '#b85c9a', '#3e8fbd', '#ba7041', '#6e73cf', '#9a8138', '#278b83',
];
const PAINT_COLORS = ['#000000','#464646','#787878','#b4b4b4','#ffffff','#880015','#ed1c24','#ff7f27','#fff200','#22b14c','#00a2e8','#3f48cc','#a349a4','#b97a57','#ffaec9','#ffc90e','#b5e61d','#99d9ea','#7092be','#c8bfe7','#65915f','#d99b42','#b76d57','#435267'];
const PRESET_1: Province[] = [
  { id: 'punjab', name: 'Punjab', color: '#65915f', kind: 'province', capital: 'Lahore' },
  { id: 'south-punjab', name: 'South Punjab', color: '#d99b42', kind: 'province', capital: '' },
  { id: 'sindh', name: 'Sindh', color: '#b76d57', kind: 'province', capital: '' },
  { id: 'karachi', name: 'Karachi', color: '#cf5d87', kind: 'province', capital: 'Karachi' },
  { id: 'kp', name: 'Khyber Pakhtunkhwa', color: '#5577ad', kind: 'province', capital: 'Peshawar' },
  { id: 'hazara', name: 'Hazara', color: '#75a6bc', kind: 'province', capital: '' },
  { id: 'balochistan', name: 'Balochistan', color: '#a97b50', kind: 'province', capital: 'Quetta' },
  { id: 'islamabad', name: 'Islamabad', color: '#786999', kind: 'territory', capital: 'Islamabad' },
  { id: 'gb', name: 'Gilgit–Baltistan', color: '#829b73', kind: 'territory', capital: 'Gilgit' },
  { id: 'ajk', name: 'Azad Kashmir', color: '#418674', kind: 'territory', capital: 'Muzaffarabad' },
];
const CURRENT_STRUCTURE: Province[] = PRESET_1
  .filter(province => !['south-punjab', 'karachi', 'hazara'].includes(province.id))
  .map(province => province.id === 'sindh' ? { ...province, capital: 'Karachi' } : province);
const CURRENT_OWNER_BY_SOURCE: Record<string, string> = {
  Punjab: 'punjab',
  Sindh: 'sindh',
  'Khyber Pakhtunkhwa': 'kp',
  Balochistan: 'balochistan',
  Islamabad: 'islamabad',
  'Gilgit Baltistan': 'gb',
  'Azad Kashmir': 'ajk',
};
const SOUTH_PUNJAB = new Set(['bahawalnagar', 'bahawalpur', 'deraghazikhan', 'khanewal', 'layyah', 'leiah', 'lodhran', 'multan', 'muzaffargarh', 'rahimyarkhan', 'rajanpur', 'vehari']);
const KARACHI = new Set(['centralkarachi', 'eastkarachi', 'korangikarachi', 'malirkarachi', 'southkarachi', 'westkarachi', 'keamari']);
const HAZARA = new Set(['abbottabad', 'batagram', 'battagram', 'haripur', 'kohistanlower', 'kohistanupper', 'kolaipalaskohistan', 'mansehra', 'torghar']);
const EXTENT = { minX: 60.75, maxX: 77.25, minY: 23.35, maxY: 37.25 };
const WIDTH = 760, HEIGHT = 820;
const CITY_MARKERS: CityMarker[] = [
  { name:'Karachi', lon:67.0099, lat:24.8615, tier:1, dx:7, dy:11 },
  { name:'Lahore', lon:74.3587, lat:31.5204, tier:1, dx:7, dy:-7 },
  { name:'Faisalabad', lon:73.0845, lat:31.4504, tier:1, dx:-7, dy:12, anchor:'end' },
  { name:'Rawalpindi', lon:73.0479, lat:33.5651, tier:1, dx:-8, dy:12, anchor:'end' },
  { name:'Islamabad', lon:73.0479, lat:33.6844, tier:1, dx:8, dy:-8 },
  { name:'Multan', lon:71.5249, lat:30.1575, tier:1, dx:7, dy:-7 },
  { name:'Hyderabad', lon:68.3737, lat:25.3960, tier:1, dx:7, dy:-7 },
  { name:'Peshawar', lon:71.5249, lat:34.0151, tier:1, dx:7, dy:-7 },
  { name:'Quetta', lon:66.9750, lat:30.1798, tier:1, dx:7, dy:-7 },
  { name:'Gujranwala', lon:74.1870, lat:32.1877, tier:2, dx:7, dy:-7 },
  { name:'Sialkot', lon:74.5310, lat:32.4945, tier:2, dx:7, dy:-7 },
  { name:'Sargodha', lon:72.6711, lat:32.0836, tier:2, dx:-7, dy:-7, anchor:'end' },
  { name:'Bahawalpur', lon:71.6833, lat:29.3956, tier:2, dx:7, dy:12 },
  { name:'Sukkur', lon:68.8574, lat:27.7244, tier:2, dx:7, dy:-7 },
  { name:'Larkana', lon:68.2141, lat:27.5570, tier:2, dx:-7, dy:12, anchor:'end' },
  { name:'Mardan', lon:72.0400, lat:34.1980, tier:2, dx:7, dy:12 },
  { name:'Abbottabad', lon:73.2215, lat:34.1688, tier:2, dx:7, dy:-7 },
  { name:'Muzaffarabad', lon:73.4711, lat:34.3700, tier:2, dx:7, dy:-7 },
  { name:'Gilgit', lon:74.3089, lat:35.9208, tier:2, dx:7, dy:-7 },
  { name:'Gwadar', lon:62.3254, lat:25.1264, tier:2, dx:7, dy:-7 },
];

const DIVISION_DISTRICTS: Record<string, string[]> = {
  'KP · Malakand': ['chitralupper','chitrallower','upperdir','lowerdir','swat','shangla','buner','malakand','bajaur'],
  'KP · Hazara': ['kohistanupper','kohistanlower','kolaipalaskohistan','mansehra','torghar','batagram','abbottabad','haripur'],
  'KP · Mardan': ['mardan','swabi'],
  'KP · Peshawar': ['charsadda','peshawar','nowshera','khyber','mohmand'],
  'KP · Kohat': ['kohat','hangu','karak','orakzai','kurram'],
  'KP · Bannu': ['bannu','lakkimarwat','northwaziristan'],
  'KP · Dera Ismail Khan': ['dikhan','tank','southwaziristan'],
  'Punjab · Rawalpindi': ['attock','rawalpindi','jhelum','chakwal'],
  'Punjab · Sargodha': ['sargodha','bhakkar','khushab','mianwali'],
  'Punjab · Faisalabad': ['faisalabad','jhang','chiniot','tobateksingh'],
  'Punjab · Gujranwala': ['gujranwala','hafizabad','gujrat','mandibahauddin','sialkot','narowal'],
  'Punjab · Lahore': ['lahore','kasur','sheikhupura','nankanasahib'],
  'Punjab · Sahiwal': ['sahiwal','okara','pakpattan'],
  'Punjab · Multan': ['vehari','multan','lodhran','khanewal'],
  'Punjab · Dera Ghazi Khan': ['deraghazikhan','rajanpur','leiah','muzaffargarh'],
  'Punjab · Bahawalpur': ['bahawalpur','bahawalnagar','rahimyarkhan'],
  'Sindh · Larkana': ['jacobabad','kashmore','shikarpur','larkana','kambarshahdadkot'],
  'Sindh · Sukkur': ['sukkur','ghotki','khairpur'],
  'Sindh · Shaheed Benazirabad': ['naushahroferoze','shaheedbenazirabad','sanghar'],
  'Sindh · Hyderabad': ['dadu','jamshoro','hyderabad','matiari','tandoallahyar','tandomuhammadkhan','badin','thatta','sujawal'],
  'Sindh · Mirpur Khas': ['mirpurkhas','umerkot','tharparkar'],
  'Sindh · Karachi': ['eastkarachi','westkarachi','southkarachi','centralkarachi','malirkarachi','korangikarachi','keamari'],
  'Balochistan · Quetta': ['quetta','pishin','killaabdullah','chaman'],
  'Balochistan · Rakhshan': ['chagai','nushki','kharan','washuk'],
  'Balochistan · Loralai': ['loralai','duki','barkhan','musakhel'],
  'Balochistan · Zhob': ['killasaifullah','zhob','sherani'],
  'Balochistan · Sibi': ['sibi','harnai','ziarat','kohlu','derabugti','lehri'],
  'Balochistan · Nasirabad': ['jaffarabad','nasirabad','kachhi','jhalmagsi','sohbatpur'],
  'Balochistan · Kalat': ['kalat','shaheedsikandarabad','mastung','khuzdar','awaran','lasbela'],
  'Balochistan · Mekran': ['kech','gwadar','panjgur'],
  'AJK · Muzaffarabad': ['jhelumvalley','muzaffarabad','neelum'],
  'AJK · Rawalakot': ['bagh','haveli','sudhnoti','poonch'],
  'AJK · Mirpur': ['bhimber','mirpur','kotli'],
  'GB · Gilgit': ['gilgit','hunza','nagar','ghizer','gupisyasin'],
  'GB · Baltistan': ['skardu','kharmang','shigar','ghanche','rondu'],
  'GB · Diamer': ['astore','diamir','darel','tangir'],
  'ICT': ['islamabad'],
};
const DIVISION_BY_DISTRICT = Object.fromEntries(Object.entries(DIVISION_DISTRICTS).flatMap(([division, districts]) => districts.map(district => [district, division])));
const DIVISION_DISTRICT_ALIASES: Record<string, string> = {
  deraismailkhan: 'dikhan', layyah: 'leiah', battagram: 'batagram', qambarshahdadkot: 'kambarshahdadkot',
  chaghi: 'chagai', sudhnutti: 'sudhnoti', surab: 'shaheedsikandarabad',
};

function divisionColor(index: number) {
  const hue = index * 137.508 % 360;
  const saturation = 42 + index % 3 * 5;
  const lightness = 48 + index % 4 * 3;
  const chroma = (1 - Math.abs(2 * lightness / 100 - 1)) * saturation / 100;
  const x = chroma * (1 - Math.abs(hue / 60 % 2 - 1));
  const match = lightness / 100 - chroma / 2;
  const [red, green, blue] = hue < 60 ? [chroma, x, 0] : hue < 120 ? [x, chroma, 0] : hue < 180 ? [0, chroma, x] : hue < 240 ? [0, x, chroma] : hue < 300 ? [x, 0, chroma] : [chroma, 0, x];
  return `#${[red, green, blue].map(channel => Math.round((channel + match) * 255).toString(16).padStart(2, '0')).join('')}`;
}

const DIVISION_PROVINCES: Province[] = Object.keys(DIVISION_DISTRICTS).map((division, index) => ({
  id: `division-${division.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
  name: division === 'ICT' ? 'Islamabad' : `${division.split(' · ')[1]} Division`,
  color: divisionColor(index),
  kind: division === 'ICT' ? 'territory' : 'province',
  capital: '',
}));

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

function pointInRing(point: [number, number], ring: number[][]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > point[1]) !== (yj > point[1]) && point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function featureContainsPoint(feature: Feature, point: [number, number]) {
  const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates as number[][][]] : feature.geometry.coordinates as number[][][][];
  return polygons.some(polygon => pointInRing(point, polygon[0]) && !polygon.slice(1).some(ring => pointInRing(point, ring)));
}

function divisionBoundaryPath(features: Feature[]) {
  const segments = new Map<string, { start:number[]; end:number[]; divisions:Set<string>; uses:number }>();
  features.forEach(feature => {
    const district = normalise(feature.properties.district_name);
    const division = DIVISION_BY_DISTRICT[district] || `${String(feature.properties.province_name)} · ${district}`;
    const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates as number[][][]] : feature.geometry.coordinates as number[][][][];
    polygons.forEach(polygon => polygon.forEach(ring => ring.forEach((start, index) => {
      const end = ring[(index + 1) % ring.length];
      if (!end || (start[0] === end[0] && start[1] === end[1])) return;
      const a = `${start[0].toFixed(4)},${start[1].toFixed(4)}`;
      const b = `${end[0].toFixed(4)},${end[1].toFixed(4)}`;
      const key = a < b ? `${a}|${b}` : `${b}|${a}`;
      const segment = segments.get(key) || { start, end, divisions:new Set<string>(), uses:0 };
      segment.divisions.add(division); segment.uses++; segments.set(key, segment);
    })));
  });
  const pathFor = (selected: { start:number[]; end:number[]; divisions:Set<string>; uses:number }[]) => selected.map(segment => {
    const start = project(segment.start), end = project(segment.end);
    return `M${start[0].toFixed(1)} ${start[1].toFixed(1)}L${end[0].toFixed(1)} ${end[1].toFixed(1)}`;
  }).join(' ');
  const allSegments = [...segments.values()];
  return {
    divisionPath: pathFor(allSegments.filter(segment => segment.uses > 1 && segment.divisions.size > 1)),
    nationalPath: pathFor(allSegments.filter(segment => segment.uses === 1)),
  };
}

function featureId(feature: Feature, level: Level) {
  return String(feature.properties[level === 'divisions' ? 'division_code' : level === 'districts' ? 'district_code' : 'tehsil_code']);
}

function featureName(feature: Feature, level: Level) {
  return String(feature.properties[level === 'divisions' ? 'division_name' : level === 'districts' ? 'district_name' : 'tehsil_name']);
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
const featureDistrictKeys = (feature: Feature) => String(feature.properties.district_names || feature.properties.district_name).split('|').filter(Boolean).map(normalise);

function buildDivisionFeatures(districts: Feature[]) {
  const byDistrict = new Map(districts.map(feature => [normalise(feature.properties.district_name), feature]));
  return Object.entries(DIVISION_DISTRICTS).map(([name, districtKeys]) => {
    const members = districtKeys.map(key => byDistrict.get(key)).filter((feature): feature is Feature => Boolean(feature));
    const coordinates = members.flatMap(feature => feature.geometry.type === 'Polygon'
      ? [feature.geometry.coordinates as number[][][]]
      : feature.geometry.coordinates as number[][][][]);
    return {
      type: 'Feature' as const,
      properties: {
        division_code: `division-${normalise(name)}`,
        division_name: name,
        province_name: String(members[0]?.properties.province_name || name.split(' · ')[0]),
        district_name: String(members[0]?.properties.district_name || ''),
        district_names: members.map(feature => String(feature.properties.district_name)).join('|'),
        district_codes: members.map(feature => String(feature.properties.district_code)).join('|'),
        area_km2: members.reduce((sum, feature) => sum + Number(feature.properties.area_km2 || 0), 0),
      },
      geometry: { type: 'MultiPolygon' as const, coordinates },
    } satisfies Feature;
  }).filter(feature => feature.geometry.coordinates.length);
}

function featuresForLevel(districtsOrTehsils: Feature[], level: Level) {
  return level === 'divisions' ? buildDivisionFeatures(districtsOrTehsils) : districtsOrTehsils;
}

function presetOneAssignments(features: Feature[], level: Level) {
  return Object.fromEntries(features.map(feature => {
    const districts = featureDistrictKeys(feature);
    const origin = String(feature.properties.province_name);
    let owner = origin === 'Punjab' ? (districts.every(district => SOUTH_PUNJAB.has(district)) ? 'south-punjab' : 'punjab')
      : origin === 'Sindh' ? (districts.every(district => KARACHI.has(district)) ? 'karachi' : 'sindh')
      : origin === 'Khyber Pakhtunkhwa' ? (districts.every(district => HAZARA.has(district)) ? 'hazara' : 'kp')
      : origin === 'Balochistan' ? 'balochistan'
      : origin === 'Islamabad' ? 'islamabad'
      : origin === 'Gilgit Baltistan' ? 'gb' : 'ajk';
    return [featureId(feature, level), owner];
  }));
}
function currentStructureAssignments(features: Feature[], level: Level) {
  return Object.fromEntries(features.map(feature => [featureId(feature, level), CURRENT_OWNER_BY_SOURCE[String(feature.properties.province_name)]]).filter(([, owner]) => owner));
}
function divisionProvinceAssignments(features: Feature[], level: Level) {
  return Object.fromEntries(features.flatMap(feature => {
    const division = level === 'divisions'
      ? String(feature.properties.division_name)
      : featureDistrictKeys(feature).map(district => DIVISION_BY_DISTRICT[district] || DIVISION_BY_DISTRICT[DIVISION_DISTRICT_ALIASES[district]]).find(Boolean);
    return division ? [[featureId(feature, level), `division-${normalise(division)}`]] : [];
  }));
}
const DISTRICT_ALIASES: Record<string, string> = {
  chagai: 'chaghi', sudhnoti: 'sudhnutti', leiah: 'layyah', dikhan: 'deraismailkhan',
  centralkarachi: 'karachicentral', eastkarachi: 'karachieast', southkarachi: 'karachisouth',
  westkarachi: 'karachiwest', malirkarachi: 'karachimalir', korangikarachi: 'karachikorangi',
};
const ELECTION_ALIASES: Record<string, string> = {
  leiah: 'layyah', kambershahdadkot: 'qambarshahdadkot', kambarshahdadkot: 'qambarshahdadkot',
  naushahroferoze: 'naushahroferoz', batagram: 'battagram', shaheedbenazirabad: 'nawabshah',
  umerkot: 'umerkot', centralkarachi: 'central', eastkarachi: 'east', southkarachi: 'south',
  westkarachi: 'west', malirkarachi: 'malir', korangikarachi: 'korangi', dikhan: 'deraismailkhan',
  chitralupper: 'upperchitral', chitrallower: 'lowerchitral', kohistanupper: 'upperkohistan',
  kohistanlower: 'lowerkohistan', kolaipalaskohistan: 'kolaipalas', torghar: 'torghar',
  shaheedsikandarabad: 'surab', musakhel: 'musakhail',
};
const ELECTION_2024_CHILDREN: Record<string, string[]> = {
  rawalpindi: ['murree'], chakwal: ['talagang'], gujranwala: ['wazirabad'],
  muzaffargarh: ['kotaddu'], deraghazikhan: ['taunsa'], west: ['keamari'],
  southwaziristan: ['uppersouthwaziristan', 'lowersouthwaziristan'],
  lasbela: ['hub'], jaffarabad: ['ustamuhammad'],
};
const ELECTION_2018_PARENTS: Record<string, string> = {
  murree: 'rawalpindi', talagang: 'chakwal', wazirabad: 'gujranwala', kotaddu: 'muzaffargarh',
  taunsa: 'deraghazikhan', keamari: 'west', upperchitral: 'chitral', lowerchitral: 'chitral',
  uppersouthwaziristan: 'southwaziristan', lowersouthwaziristan: 'southwaziristan',
  hub: 'lasbela', ustamuhammad: 'jaffarabad', chaman: 'killaabdullah',
};
const PARTY_COLORS: Record<string, string> = { PTI: '#d64b43', 'PTI-backed IND': '#d64b43', 'PML-N': '#2f8a52', PPP: '#252525', 'MQM-P': '#e0a526', 'JUI-F': '#6a8f76', MMA: '#6a8f76', IND: '#8b887f', 'PML-Q': '#74b85a', ANP: '#9f3b3b', BAP: '#788b36', NP: '#b96b6b', 'PTI-P': '#d77b78', JI: '#397db2', GDA: '#6267b8', IPP: '#78a94a', 'BNP-M': '#c6ad2f', 'BNP-A': '#31a697', HDT: '#8d65a8', PKMAP: '#d2773f', JWP: '#d88aa3', PRHP: '#8a7055', Other: '#aaa49a', Postponed: '#d8d1c5' };

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
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [active, setActive] = useState('');
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Record<string, string>[]>([]);
  const [future, setFuture] = useState<Record<string, string>[]>([]);
  const [query, setQuery] = useState('');
  const [hovered, setHovered] = useState<Feature | null>(null);
  const [painting, setPainting] = useState(false);
  const [toolMode, setToolMode] = useState<'paint' | 'inspect'>('paint');
  const [inspectMetric, setInspectMetric] = useState<InspectMetric>('allocation');
  const [inspectMetricOpen, setInspectMetricOpen] = useState(false);
  const [inspectOtherOpen, setInspectOtherOpen] = useState(false);
  const [mapView, setMapView] = useState({ x: 0, y: 0, width: WIDTH, height: HEIGHT });
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [finalized, setFinalized] = useState(false);
  const [politicsOpen, setPoliticsOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [rankedOpen, setRankedOpen] = useState(false);
  const [rankMetric, setRankMetric] = useState<RankMetric>('population');
  const [mapName, setMapName] = useState('My province plan');
  const [shareStatus, setShareStatus] = useState('Share link');
  const [darbar, setDarbar] = useState<DarbarData | null>(null);
  const [censusDetail, setCensusDetail] = useState<CensusDetail | null>(null);
  const [assembly, setAssembly] = useState<AssemblyData | null>(null);
  const [electionYear, setElectionYear] = useState<ElectionYear>(2024);
  const [regionalAssembly, setRegionalAssembly] = useState<RegionalAssemblyData | null>(null);
  const [paletteOpen, setPaletteOpen] = useState<string | null>(null);
  const [capitalPickerOpen, setCapitalPickerOpen] = useState<string | null>(null);
  const [unitEditorOpen, setUnitEditorOpen] = useState<string | null>(null);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [leftPanelWidth, setLeftPanelWidth] = useState(340);
  const [rightPanelWidth, setRightPanelWidth] = useState(310);
  const svgRef = useRef<SVGSVGElement>(null);
  const panRef = useRef<{ pointerId:number; clientX:number; clientY:number; view:typeof mapView } | null>(null);
  const panelResizeRef = useRef<{ side:PanelSide; pointerId:number; startX:number; startWidth:number } | null>(null);
  const hashLoaded = useRef(false);
  const pendingSharedAssignments = useRef<Record<string, string> | null>(null);
  const hasAssignments = Object.keys(assignments).length > 0;
  const cityZoom = WIDTH / mapView.width;

  useEffect(() => {
    if (!hashLoaded.current) {
      hashLoaded.current = true;
      const raw = window.location.hash.startsWith('#map=') ? window.location.hash.slice(5) : '';
      if (raw) {
        try {
          const shared = decodeShare(raw);
          if (shared.v === 1 && (shared.l === 'divisions' || shared.l === 'districts' || shared.l === 'tehsils')) {
            const restoredProvinces = shared.p.map(([id, name, color, kind, capital]) => ({ id, name, color, kind: kind || 'province', capital: capital || '' }));
            const restoredAssignments = Object.fromEntries(shared.a.map(([id, , provinceIndex]) => [id, restoredProvinces[provinceIndex]?.id]).filter(([, id]) => id));
            setMapName(shared.n || 'Shared province plan');
            setProvinces(restoredProvinces);
            setActive(restoredProvinces[0]?.id || '');
            setAssignments(restoredAssignments);
            if (shared.l !== level) { pendingSharedAssignments.current = restoredAssignments; setLevel(shared.l); return; }
            fetch(`/data/pakistan-map/${shared.l === 'divisions' ? 'districts' : shared.l}.geojson`).then(r => r.json()).then(data => setFeatures(featuresForLevel(data.features, shared.l)));
            return;
          }
        } catch { window.history.replaceState(null, '', window.location.pathname + window.location.search); }
      }
    }
    if (pendingSharedAssignments.current) {
      const restored = pendingSharedAssignments.current;
      pendingSharedAssignments.current = null;
      fetch(`/data/pakistan-map/${level === 'divisions' ? 'districts' : level}.geojson`).then(r => r.json()).then(data => setFeatures(featuresForLevel(data.features, level)));
      setAssignments(restored); setHistory([]); setFuture([]);
      return;
    }
    fetch(`/data/pakistan-map/${level === 'divisions' ? 'districts' : level}.geojson`).then(r => r.json()).then(data => {
      setFeatures(featuresForLevel(data.features, level));
      setProvinces([]); setActive(''); setMapName('My province plan'); setAssignments({});
    });
    setHistory([]); setFuture([]);
  }, [level]);

  useEffect(() => { if ((hasAssignments || toolMode === 'inspect') && !darbar) fetch('/data/pakistan-map/datadarbar.json').then(r => r.json()).then(setDarbar).catch(() => setDarbar(null)); }, [darbar, hasAssignments, toolMode]);
  useEffect(() => { if ((hasAssignments || toolMode === 'inspect') && !censusDetail) fetch('/data/pakistan-map/census-2023-detail.json').then(r => r.json()).then(setCensusDetail).catch(() => setCensusDetail(null)); }, [censusDetail, hasAssignments, toolMode]);
  useEffect(() => {
    if (!finalized) return;
    let cancelled = false;
    setAssembly(null);
    fetch(`/data/pakistan-map/assembly-${electionYear}.json`).then(r => r.json()).then(data => { if (!cancelled) setAssembly(data); }).catch(() => { if (!cancelled) setAssembly(null); });
    return () => { cancelled = true; };
  }, [electionYear, finalized]);
  useEffect(() => { if (finalized && !regionalAssembly) fetch('/data/pakistan-map/regional-assembly-2026.json').then(r => r.json()).then(setRegionalAssembly).catch(() => setRegionalAssembly(null)); }, [finalized, regionalAssembly]);

  const provinceById = useMemo(() => Object.fromEntries(provinces.map(p => [p.id, p])), [provinces]);
  const assignmentCounts = useMemo(() => Object.values(assignments).reduce<Record<string, number>>((counts, id) => { counts[id] = (counts[id] || 0) + 1; return counts; }, {}), [assignments]);
  const tehsilDataByFeatureId = useMemo(() => level === 'tehsils' ? buildTehsilDataLookup(features, darbar?.tehsils || []) : new Map<string, TehsilData>(), [darbar, features, level]);
  const paths = useMemo(() => features.map(feature => ({ feature, d: geometryPath(feature.geometry) })), [features]);
  const capitalCitiesByProvince = useMemo(() => Object.fromEntries(provinces.map(province => [province.id, CITY_MARKERS.filter(city => features.some(feature => assignments[featureId(feature, level)] === province.id && featureContainsPoint(feature, [city.lon, city.lat])))])), [assignments, features, level, provinces]);

  useEffect(() => {
    if (!features.length || !Object.keys(assignments).length) return;
    setProvinces(items => {
      let changed = false;
      const next = items.map(item => {
        if (!item.capital || (capitalCitiesByProvince[item.id] || []).some(city => city.name === item.capital)) return item;
        changed = true;
        return { ...item, capital: '' };
      });
      return changed ? next : items;
    });
  }, [assignments, capitalCitiesByProvince, features.length]);
  const { divisionPath, nationalPath } = useMemo(() => divisionBoundaryPath(features), [features]);
  const matches = useMemo(() => query.trim() ? features.filter(f => `${featureName(f, level)} ${f.properties.district_name} ${f.properties.province_name}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8) : [], [features, level, query]);
  const totalAssigned = Object.keys(assignments).length;
  const districtOwners = useMemo(() => {
    if (level !== 'tehsils') return Object.fromEntries(features.flatMap(feature => featureDistrictKeys(feature).map(district => [district, assignments[featureId(feature, level)]])).filter(([, owner]) => owner));
    const votes: Record<string, Record<string, number>> = {};
    features.forEach(feature => {
      const owner = assignments[featureId(feature, level)]; if (!owner) return;
      const district = normalise(feature.properties.district_name);
      votes[district] ||= {}; votes[district][owner] = (votes[district][owner] || 0) + 1;
    });
    return Object.fromEntries(Object.entries(votes).map(([district, counts]) => [district, Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]]));
  }, [assignments, features, level]);
  const electionOwners = useMemo(() => {
    const owners: Record<string, string | null> = {};
    Object.entries(districtOwners).forEach(([rawKey, owner]) => {
      const ownerId = String(owner);
      let key = ELECTION_ALIASES[rawKey] || rawKey;
      const keys = electionYear === 2018 ? [ELECTION_2018_PARENTS[key] || key] : [key, ...(ELECTION_2024_CHILDREN[key] || [])];
      keys.forEach(electionKey => {
        if (!(electionKey in owners)) owners[electionKey] = ownerId;
        else if (owners[electionKey] !== ownerId) owners[electionKey] = null;
      });
    });
    return owners;
  }, [districtOwners, electionYear]);
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
      if (level !== 'tehsils') {
        for (const districtKeyRaw of featureDistrictKeys(feature)) {
          const districtKey = DISTRICT_ALIASES[districtKeyRaw] || districtKeyRaw;
          const district = darbar?.districts[districtKey];
          if (!district) { population += regionalDistrictPopulation2017(districtKey) || 0; continue; }
          dataMatches++;
          const pop = district.p || regionalDistrictPopulation2017(districtKey) || 0; population += pop;
          if (district.l != null && district.i != null) { literate += district.l; literacyBase += district.l + district.i; }
          if (district.u != null && pop) { urban += district.u; urbanBase += pop; }
          if (district.ur != null && pop) { weightedUnemployment += district.ur * pop; unemploymentBase += pop; }
          if (district.mpi != null && pop) { weightedMpi += district.mpi * pop; mpiBase += pop; }
          if (district.oos != null) { outOfSchool += district.oos; outOfSchoolMatches++; }
          addExtended(district, pop);
        }
      } else {
        const districtKeyRaw = normalise(feature.properties.district_name);
        const districtKey = DISTRICT_ALIASES[districtKeyRaw] || districtKeyRaw;
        const district = darbar?.districts[districtKey];
        const tehsil = tehsilDataByFeatureId.get(featureId(feature, 'tehsils'));
        if (!tehsil) continue;
        dataMatches++;
        const pop = tehsil.p || 0; population += pop;
        if (district?.l != null && district.i != null && pop) { const rate = district.l / (district.l + district.i); literate += rate * pop; literacyBase += pop; }
        if (district) addExtended(district, pop);
        if (tehsil.r != null && pop) { weightedRwi += tehsil.r * pop; rwiBase += pop; }
        if (tehsil.nl != null && pop) { weightedNightLight += tehsil.nl * pop; nightLightBase += pop; }
      }
    }
    const memberDistricts = new Set(members.flatMap(feature => featureDistrictKeys(feature)));
    if (level !== 'tehsils') population += completeRegionalPopulation2017(memberDistricts);
    else if (!population) population = completeRegionalPopulation2017(memberDistricts, true);
    const regionalSocial = level === 'tehsils' ? null : regionalSocialStats(memberDistricts);
    if (regionalSocial?.literacy != null && regionalSocial.literacyWeight) { literate += regionalSocial.literacy / 100 * regionalSocial.literacyWeight; literacyBase += regionalSocial.literacyWeight; }
    if (regionalSocial?.enrolment != null && regionalSocial.enrolmentWeight) { extended.enrol += regionalSocial.enrolment * regionalSocial.enrolmentWeight; extendedBase.enrol += regionalSocial.enrolmentWeight; }
    if (regionalSocial?.urbanShare != null && regionalSocial.urbanWeight) { urban += regionalSocial.urbanShare / 100 * regionalSocial.urbanWeight; urbanBase += regionalSocial.urbanWeight; }
    const ownedElectionKeys = new Set(Object.entries(electionOwners).filter(([, owner]) => owner === province.id).map(([key]) => key));
    const partySeats: Record<string, number> = {};
    if (province.kind === 'province') assembly?.districts.filter(row => (row.districts || [row.district]).every(district => {
      const rawKey = normalise(district);
      return ownedElectionKeys.has(ELECTION_ALIASES[rawKey] || rawKey);
    })).forEach(row => Object.entries(row.parties).forEach(([party, seats]) => { partySeats[party] = (partySeats[party] || 0) + seats; }));
    const electionSeats = Object.values(partySeats).reduce((sum, seats) => sum + seats, 0);
    const senateSeats = allocateSeats(partySeats);
    const regionalSeats: Record<string, number> = {};
    const regionalRegions = new Set<string>();
    regionalAssembly?.districts.filter(row => Object.entries(districtOwners).some(([rawKey, owner]) => owner === province.id && (ELECTION_ALIASES[rawKey] || rawKey) === normalise(row.district))).forEach(row => { regionalRegions.add(row.region); Object.entries(row.parties).forEach(([party, seats]) => { regionalSeats[party] = (regionalSeats[party] || 0) + seats; }); });
    const regionalSeatCount = Object.values(regionalSeats).reduce((sum, seats) => sum + seats, 0);
    const populationYears = new Set([...memberDistricts].map(district => isRegionalPopulationDistrict(district) ? 2017 : 2023));
    return { ...province, members, area, origins, dataMatches:dataMatches + (regionalSocial?.matchedDistricts || 0), dataUnitCount: level === 'tehsils' ? members.length : memberDistricts.size, population, populationYear: level === 'tehsils' ? null : populationYears.size === 1 ? [...populationYears][0] : null, literacyYear:regionalSocial?.literacyYear || '2023', enrolmentYear:regionalSocial?.enrolmentYear || '2019–20', urbanYear:regionalSocial?.urbanYear || '2023', partySeats, electionSeats, senateSeats, regionalSeats, regionalSeatCount, regionalRegions: [...regionalRegions],
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
  }), [assembly, assignments, darbar, districtOwners, electionOwners, features, level, provinces, regionalAssembly, tehsilDataByFeatureId]);
  const assignedArea = finalRows.reduce((sum, row) => sum + row.area, 0);
  const activeRow = finalRows.find(row => row.id === active);
  const populatedRows = finalRows.filter(row => row.population != null);
  const mappedPopulationYears = new Set(populatedRows.map(row => row.populationYear).filter((year): year is number => year != null));
  const comparableMappedPopulation = populatedRows.length && mappedPopulationYears.size === 1 && populatedRows.every(row => row.populationYear != null)
    ? populatedRows.reduce((sum,row)=>sum+(row.population||0),0)
    : null;
  const countryPolitics = finalRows.filter(row => row.kind === 'province' && row.members.length).reduce((summary, row) => {
    Object.entries(row.partySeats).forEach(([party,seats]) => { summary.assembly[party] = (summary.assembly[party] || 0) + seats; });
    Object.entries(row.senateSeats).forEach(([party,seats]) => { summary.senate[party] = (summary.senate[party] || 0) + seats; });
    summary.provinces++;
    return summary;
  }, { assembly:{} as Record<string,number>, senate:{} as Record<string,number>, provinces:0 });
  const countryAssemblySeats = Object.values(countryPolitics.assembly).reduce((sum,seats)=>sum+seats,0);
  const countrySenateSeats = Object.values(countryPolitics.senate).reduce((sum,seats)=>sum+seats,0);
  const statsForFeature = useCallback((feature: Feature) => {
    const selectedTehsil = level === 'tehsils' ? tehsilDataByFeatureId.get(featureId(feature, 'tehsils')) : null;
    const districtKeys = featureDistrictKeys(feature).map(key => DISTRICT_ALIASES[key] || key);
    const census = level === 'tehsils' ? null : aggregateCensus(districtKeys, censusDetail);
    const districtRows = districtKeys.map(key => ({ key, data: darbar?.districts[key] }));
    const area = Number(feature.properties.area_km2 || 0);
    const tehsilPopulation = selectedTehsil?.p || 0;
    let population = 0, literate = 0, literacyBase = 0, urban = 0, urbanBase = 0;
    let outOfSchool = 0, outOfSchoolMatches = 0;
    const weightedTotals = { mat:0, enrol:0, num:0, lfpr:0, ur:0, cons:0, fi:0, net:0, elec:0, mpi:0 };
    const weightedBases = { mat:0, enrol:0, num:0, lfpr:0, ur:0, cons:0, fi:0, net:0, elec:0, mpi:0 };
    const weightedKeys = Object.keys(weightedTotals) as (keyof typeof weightedTotals)[];

    districtRows.forEach(({ key, data }) => {
      const districtPopulation = data?.p || regionalDistrictPopulation2017(key) || 0;
      const weight = level === 'tehsils' ? tehsilPopulation : districtPopulation;
      if (level !== 'tehsils') population += districtPopulation;
      if (!data || !weight) return;
      if (data.l != null && data.i != null) {
        if (level === 'tehsils') {
          literate += data.l / (data.l + data.i) * weight;
          literacyBase += weight;
        } else {
          literate += data.l;
          literacyBase += data.l + data.i;
        }
      }
      if (data.u != null && data.p) {
        urban += data.u / data.p * weight;
        urbanBase += weight;
      }
      if (level !== 'tehsils' && data.oos != null) {
        outOfSchool += data.oos;
        outOfSchoolMatches++;
      }
      weightedKeys.forEach(key => {
        const value = data[key];
        if (value != null) {
          weightedTotals[key] += value * weight;
          weightedBases[key] += weight;
        }
      });
    });
    if (level === 'tehsils') population = tehsilPopulation;
    else population += completeRegionalPopulation2017(districtKeys);
    const regionalSocial = level === 'tehsils' ? null : regionalSocialStats(districtKeys);
    if (regionalSocial?.literacy != null && regionalSocial.literacyWeight) { literate += regionalSocial.literacy / 100 * regionalSocial.literacyWeight; literacyBase += regionalSocial.literacyWeight; }
    if (regionalSocial?.urbanShare != null && regionalSocial.urbanWeight) { urban += regionalSocial.urbanShare / 100 * regionalSocial.urbanWeight; urbanBase += regionalSocial.urbanWeight; }
    if (regionalSocial?.enrolment != null && regionalSocial.enrolmentWeight) { weightedTotals.enrol += regionalSocial.enrolment * regionalSocial.enrolmentWeight; weightedBases.enrol += regionalSocial.enrolmentWeight; }
    const weighted = (key: keyof typeof weightedTotals) => weightedBases[key] ? weightedTotals[key] / weightedBases[key] : null;
    const populationYears = new Set(districtKeys.map(key => isRegionalPopulationDistrict(key) ? 2017 : 2023));
    return {
      area,
      population: population || null,
      populationYear: level === 'tehsils' ? null : populationYears.size === 1 ? [...populationYears][0] : null,
      literacyYear: regionalSocial?.literacyYear || '2023',
      enrolmentYear: regionalSocial?.enrolmentYear || '2019–20',
      urbanYear: regionalSocial?.urbanYear || '2023',
      density: area && population ? population / area : null,
      literacy: literacyBase ? literate / literacyBase * 100 : null,
      urbanShare: urbanBase ? urban / urbanBase * 100 : null,
      matricPlus: weighted('mat'),
      enrolment: weighted('enrol'),
      numeracy: weighted('num'),
      outOfSchool: outOfSchoolMatches ? outOfSchool : null,
      lfpr: weighted('lfpr'),
      unemployment: weighted('ur'),
      consumption: weighted('cons'),
      foodInsecurity: weighted('fi'),
      internet: weighted('net'),
      electricity: weighted('elec'),
      mpi: weighted('mpi'),
      wealthPercentile: selectedTehsil?.r ?? null,
      nightLight: selectedTehsil?.nl ?? null,
      census,
    };
  }, [censusDetail, darbar, level, tehsilDataByFeatureId]);
  const selectedStats = useMemo(() => selectedFeature ? statsForFeature(selectedFeature) : null, [selectedFeature, statsForFeature]);
  const formatPercent = (value: number | null) => value == null ? '—' : `${value.toFixed(1)}%`;
  const inspectStats = selectedStats ? [
    { value:selectedStats.area ? Math.round(selectedStats.area).toLocaleString() : '—', label:'area · km²' },
    { value:selectedStats.population == null ? '—' : Math.round(selectedStats.population).toLocaleString(), label:`total population${selectedStats.populationYear ? ` · ${selectedStats.populationYear}` : ''}` },
    { value:selectedStats.density == null ? '—' : Math.round(selectedStats.density).toLocaleString(), label:'population density · people / km²' },
    ...(selectedStats.census ? [
      { value:formatPercent(selectedStats.census.growthRate), label:'annual population growth · 2017–23' },
      { value:selectedStats.census.sexRatio == null ? '—' : selectedStats.census.sexRatio.toFixed(1), label:'males per 100 females · 2023' },
      { value:selectedStats.census.householdSize == null ? '—' : selectedStats.census.householdSize.toFixed(1), label:'average household size · 2023' },
      { value:formatPercent(selectedStats.census.under15Share), label:'population under 15 · 2023' },
      { value:formatPercent(selectedStats.census.dependencyRatio), label:'age dependency ratio · 2023' },
    ] : []),
    { value:formatPercent(selectedStats.urbanShare), label:`urban share · ${selectedStats.urbanYear}` },
    { value:formatPercent(selectedStats.literacy), label:`literacy · ${selectedStats.literacyYear}` },
    { value:formatPercent(selectedStats.matricPlus), label:'matric or higher' },
    { value:selectedStats.outOfSchool == null ? '—' : Math.round(selectedStats.outOfSchool).toLocaleString(), label:'children aged 5–16 out of school' },
    { value:formatPercent(selectedStats.enrolment), label:`net enrolment · ${selectedStats.enrolmentYear}` },
    { value:formatPercent(selectedStats.numeracy), label:'numeracy' },
    { value:formatPercent(selectedStats.lfpr), label:'labor-force participation · Census district estimate' },
    { value:formatPercent(selectedStats.unemployment), label:'unemployment' },
    { value:selectedStats.consumption == null ? '—' : `≈Rs ${Math.round(selectedStats.consumption).toLocaleString()}`, label:'monthly consumption / person · rural estimate' },
    { value:formatPercent(selectedStats.foodInsecurity), label:'food insecurity · rural estimate' },
    { value:formatPercent(selectedStats.internet), label:'internet use · rural estimate' },
    { value:formatPercent(selectedStats.electricity), label:'electricity · rural estimate' },
    { value:selectedStats.mpi == null ? '—' : selectedStats.mpi.toFixed(3), label:'Data Darbar deprivation index · not official MPI' },
    ...(selectedStats.census ? [
      { value:formatPercent(selectedStats.census.improvedWater), label:'households with improved water · 2023' },
      { value:formatPercent(selectedStats.census.waterInside), label:'drinking water inside · 2023' },
      { value:formatPercent(selectedStats.census.flushToilet), label:'households with flush toilet · 2023' },
      { value:formatPercent(selectedStats.census.noToilet), label:'households with no toilet · 2023' },
      { value:formatPercent(selectedStats.census.ownedHousing), label:'owner-occupied housing · 2023' },
      { value:formatPercent(selectedStats.census.oneRoomHousing), label:'one-room housing · 2023' },
    ] : []),
    ...(level === 'tehsils' ? [
      { value:selectedStats.wealthPercentile == null ? '—' : `${selectedStats.wealthPercentile.toFixed(0)}th`, label:'wealth percentile' },
      { value:selectedStats.nightLight == null ? '—' : selectedStats.nightLight.toFixed(2), label:'night radiance' },
    ] : []),
  ] : [];
  const inspectMetricMeta = INSPECT_METRICS.find(item => item.key === inspectMetric) || INSPECT_METRICS[0];
  const inspectValue = useCallback((feature: Feature): number | null => {
    if (inspectMetric === 'allocation') return null;
    const stats = statsForFeature(feature);
    if (inspectMetric === 'growthRate' || inspectMetric === 'householdSize' || inspectMetric === 'under15Share' || inspectMetric === 'workingAgeShare' || inspectMetric === 'dependencyRatio' || inspectMetric === 'improvedWater' || inspectMetric === 'waterInside' || inspectMetric === 'flushToilet' || inspectMetric === 'noToilet' || inspectMetric === 'ownedHousing' || inspectMetric === 'oneRoomHousing') {
      return stats.census?.[inspectMetric] ?? null;
    }
    return stats[inspectMetric] ?? null;
  }, [inspectMetric, statsForFeature]);
  const inspectValues = useMemo(() => new Map(features.map(feature => [featureId(feature, level), inspectValue(feature)])), [features, inspectValue, level]);
  const inspectMaximum = useMemo(() => {
    if (inspectMetricMeta.scale === 'percent') return 100;
    if (inspectMetricMeta.scale === 'index') return 1;
    return Math.max(1, ...[...inspectValues.values()].filter((value): value is number => value != null));
  }, [inspectMetricMeta.scale, inspectValues]);
  const inspectColorDepth = useCallback((value: number | null) => {
    if (value == null) return 1;
    const bounded = Math.max(0, Math.min(value, inspectMaximum));
    // District density is extremely right-skewed (Lahore is the dominant
    // outlier), so a linear ramp makes nearly every other district identical.
    const ratio = inspectMetric === 'density'
      ? Math.log1p(bounded) / Math.log1p(inspectMaximum)
      : bounded / inspectMaximum;
    return .12 + .88 * ratio;
  }, [inspectMaximum, inspectMetric]);
  const formatInspectValue = (value:number|null) => value == null ? 'Unavailable'
    : inspectMetric === 'population' || inspectMetric === 'density' || inspectMetric === 'outOfSchool' ? Math.round(value).toLocaleString()
    : inspectMetric === 'consumption' ? `Rs ${Math.round(value).toLocaleString()}`
    : inspectMetric === 'mpi' ? value.toFixed(3)
    : inspectMetric === 'householdSize' ? value.toFixed(1)
    : `${value.toFixed(1)}%`;
  const rankedRows = useMemo(() => finalRows.filter(row => row.members.length && row[rankMetric] != null).sort((a, b) => Number(b[rankMetric]) - Number(a[rankMetric])), [finalRows, rankMetric]);
  const rankMaximum = Math.max(...rankedRows.map(row => Number(row[rankMetric])), 1);
  const formatRankValue = (value: number) => rankMetric === 'population' || rankMetric === 'outOfSchool'
    ? Math.round(value).toLocaleString()
    : rankMetric === 'consumption' ? `Rs ${Math.round(value).toLocaleString()}`
    : rankMetric === 'mpi' ? value.toFixed(3) : `${value.toFixed(1)}%`;

  const paint = useCallback((feature: Feature) => {
    if (!active) return;
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

  const setPanelWidth = (side: PanelSide, width: number) => {
    const nextWidth = Math.max(220, Math.min(520, width));
    if (side === 'left') setLeftPanelWidth(nextWidth);
    else setRightPanelWidth(nextWidth);
  };

  const beginPanelResize = (side: PanelSide, event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button')) return;
    const isOpen = side === 'left' ? leftPanelOpen : rightPanelOpen;
    if (!isOpen) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    panelResizeRef.current = {
      side,
      pointerId: event.pointerId,
      startX: event.clientX,
      startWidth: side === 'left' ? leftPanelWidth : rightPanelWidth,
    };
  };

  const continuePanelResize = (event: React.PointerEvent<HTMLDivElement>) => {
    const resize = panelResizeRef.current;
    if (!resize || resize.pointerId !== event.pointerId) return;
    const direction = resize.side === 'left' ? 1 : -1;
    setPanelWidth(resize.side, resize.startWidth + (event.clientX - resize.startX) * direction);
  };

  const endPanelResize = (event: React.PointerEvent<HTMLDivElement>) => {
    if (panelResizeRef.current?.pointerId === event.pointerId) panelResizeRef.current = null;
  };

  const resizePanelWithKeyboard = (side: PanelSide, event: React.KeyboardEvent<HTMLElement>) => {
    const currentWidth = side === 'left' ? leftPanelWidth : rightPanelWidth;
    const direction = side === 'left' ? 1 : -1;
    if (event.key === 'Home') setPanelWidth(side, 220);
    else if (event.key === 'End') setPanelWidth(side, 520);
    else if (event.key === 'ArrowLeft') setPanelWidth(side, currentWidth - 20 * direction);
    else if (event.key === 'ArrowRight') setPanelWidth(side, currentWidth + 20 * direction);
    else return;
    event.preventDefault();
  };

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
    const next: Province = { id, name: `Province ${provinces.length + 1}`, color: PALETTE[provinces.length % PALETTE.length], kind: 'province', capital: '' };
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

  const loadPreset = (preset: 'current' | 'preset-1' | 'preset-2') => {
    const isCurrent = preset === 'current';
    const isDivisions = preset === 'preset-2';
    const nextProvinces = isCurrent ? CURRENT_STRUCTURE : isDivisions ? DIVISION_PROVINCES : PRESET_1;
    setHistory(h => [...h, assignments]); setFuture([]);
    setProvinces(nextProvinces); setActive(nextProvinces[0].id);
    setMapName(isCurrent ? 'Current provincial structure' : isDivisions ? 'Preset 2 · Division provinces' : 'Preset 1');
    setAssignments(isCurrent ? currentStructureAssignments(features, level) : isDivisions ? divisionProvinceAssignments(features, level) : presetOneAssignments(features, level));
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
    const sharedLevel = level === 'divisions' ? 'districts' : level;
    const sharedAssignments: [string, string, number][] = level === 'divisions'
      ? features.flatMap(feature => {
          const owner = provinceIndex[assignments[featureId(feature, level)]];
          if (owner === undefined) return [];
          const codes = String(feature.properties.district_codes || '').split('|');
          const names = String(feature.properties.district_names || '').split('|');
          return codes.map((code, index) => [code, names[index] || code, owner] as [string, string, number]);
        })
      : features.filter(feature => assignments[featureId(feature, level)] !== undefined).map(feature => [featureId(feature, level), featureName(feature, level), provinceIndex[assignments[featureId(feature, level)]]]);
    return { v: 1, n: mapName.trim() || 'Untitled province plan', l: sharedLevel,
      p: provinces.map(province => [province.id, province.name, province.color, province.kind, province.capital || '']),
      a: sharedAssignments,
    };
  };

  const openProfile = (unitId: string) => {
    window.open(`/pakistan-map/profile#map=${encodeShare(currentShareConfig())}&unit=${encodeURIComponent(unitId)}`, '_blank', 'noopener,noreferrer');
  };

  const openComparison = () => {
    window.open(`/pakistan-map/compare#map=${encodeShare(currentShareConfig())}`, '_blank', 'noopener,noreferrer');
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
        <div className="header-actions"><button onClick={undo} disabled={!history.length} aria-label="Undo">↶</button><button onClick={redo} disabled={!future.length} aria-label="Redo">↷</button><button className="export" onClick={exportPng}>Export PNG</button><button className="export share-button" disabled={!totalAssigned} onClick={shareMap}>{shareStatus}</button><a className="export method-link" href="/pakistan-map/methodology">Data &amp; method</a><button className="export dark finalize-button" disabled={!totalAssigned} onClick={() => setFinalized(true)}>Finalize map →</button></div>
      </header>

      <section className="studio" style={{ '--left-panel-width': `${leftPanelOpen ? leftPanelWidth : 0}px`, '--right-panel-width': `${rightPanelOpen ? rightPanelWidth : 0}px` } as React.CSSProperties}>
        <aside id="map-control-panel" className="control-panel" hidden={!leftPanelOpen}>
          <div className="eyebrow"><span>01</span> CHOOSE THE BUILDING BLOCK</div>
          <div className="segmented" role="group" aria-label="Map detail">
            <button className={level === 'divisions' ? 'selected' : ''} onClick={() => setLevel('divisions')}>Divisions <b>{Object.keys(DIVISION_DISTRICTS).length}</b></button>
            <button className={level === 'districts' ? 'selected' : ''} onClick={() => setLevel('districts')}>Districts <b>160</b></button>
            <button className={level === 'tehsils' ? 'selected' : ''} onClick={() => setLevel('tehsils')}>Tehsils <b>577</b></button>
          </div>
          <div className="preset-control">
            <h3>Presets</h3>
            <div className="preset-list">
              <button type="button" onClick={() => loadPreset('current')}>
                <b>Current structure</b>
                <small>Default · Punjab · Sindh · Khyber Pakhtunkhwa · Balochistan · federal territories</small>
              </button>
              <button type="button" onClick={() => loadPreset('preset-1')}>
                <b>Preset 1</b>
                <small>Proposed split · Karachi · South Punjab · Hazara</small>
              </button>
              <button type="button" onClick={() => loadPreset('preset-2')}>
                <b>Preset 2</b>
                <small>Every administrative division becomes a province · Islamabad remains a territory</small>
              </button>
            </div>
          </div>

          <div className="eyebrow province-title"><span>02</span> YOUR MAP UNITS</div>
          <p className="hint">Set each unit as a province or territory, then paint.</p>
          <div className="province-list">
            {provinces.map((province, index) => {
              const count = assignmentCounts[province.id] || 0;
              return <div className={`province-row ${active === province.id ? 'active' : ''}`} key={province.id} onClick={() => setActive(province.id)}>
                <button className="swatch" style={{ background: province.color }} aria-label={`Choose ${province.name} colour`} aria-expanded={paletteOpen === province.id} onClick={e => { e.stopPropagation(); setUnitEditorOpen(null); setCapitalPickerOpen(null); setPaletteOpen(open => open === province.id ? null : province.id); }}/>
                {paletteOpen === province.id && <div className="paint-palette" onClick={e => e.stopPropagation()}>
                  <div className="paint-palette-head"><span className="paint-wells"><i style={{background:province.color}}/><i/></span><b>COLOURS</b><button onClick={()=>setPaletteOpen(null)} aria-label="Close colour palette">×</button></div>
                  <div className="paint-color-grid">{PAINT_COLORS.map(color=><button key={color} className={color.toLowerCase()===province.color.toLowerCase()?'selected':''} style={{background:color}} onClick={()=>{setProvinceColor(province.id,color);setPaletteOpen(null)}} aria-label={`Use colour ${color}`}/>)}</div>
                  <label className="custom-color"><span>EDIT COLOUR</span><input type="color" value={province.color} aria-label={`Custom colour for ${province.name}`} onChange={e=>setProvinceColor(province.id,e.target.value)}/></label>
                </div>}
                <button className="unit-name" onClick={event => { event.stopPropagation(); setActive(province.id); setPaletteOpen(null); setCapitalPickerOpen(null); setUnitEditorOpen(open => open === province.id ? null : province.id); }} aria-expanded={unitEditorOpen === province.id} aria-controls={`unit-editor-${province.id}`}>{province.name}</button>
                {unitEditorOpen === province.id && <div id={`unit-editor-${province.id}`} className="unit-editor" onClick={event => event.stopPropagation()}>
                  <div className="unit-editor-head"><b>EDIT MAP UNIT</b><button onClick={() => { setUnitEditorOpen(null); setCapitalPickerOpen(null); }} aria-label="Close map unit editor">×</button></div>
                  <label><span>Name</span><input autoFocus className="province-name" value={province.name} aria-label={`Map unit ${index + 1} name`} onChange={e => setProvinces(items => items.map(item => item.id === province.id ? { ...item, name: e.target.value } : item))}/></label>
                  <button className={`unit-kind ${province.kind}`} onClick={() => setProvinces(items => items.map(item => item.id === province.id ? { ...item, kind: item.kind === 'province' ? 'territory' : 'province' } : item))} aria-label={`Set ${province.name} as ${province.kind === 'province' ? 'territory' : 'province'}`}>{province.kind} · click to change</button>
                  <div className="capital-editor">
                    <span>Capital</span>
                    <button type="button" aria-label={`Choose capital of ${province.name}`} aria-haspopup="listbox" aria-expanded={capitalPickerOpen === province.id} onClick={() => setCapitalPickerOpen(open => open === province.id ? null : province.id)}>{province.capital || 'Choose city'}<i aria-hidden="true">⌄</i></button>
                    {capitalPickerOpen === province.id && <div className="capital-menu" role="listbox" aria-label={`Cities inside ${province.name}`}>
                      {(capitalCitiesByProvince[province.id] || []).length ? <><button className={!province.capital ? 'selected' : ''} onClick={() => { setProvinces(items => items.map(item => item.id === province.id ? { ...item, capital: '' } : item)); setCapitalPickerOpen(null); }}>No capital</button>{capitalCitiesByProvince[province.id].map(city => <button className={province.capital === city.name ? 'selected' : ''} role="option" aria-selected={province.capital === city.name} key={city.name} onClick={() => { setProvinces(items => items.map(item => item.id === province.id ? { ...item, capital: city.name } : item)); setCapitalPickerOpen(null); }}>{city.name}</button>)}</> : <p>Shade an area containing a marked city first.</p>}
                    </div>}
                  </div>
                </div>}
                <span className="count">{count}</span>
                <button className="remove-unit" disabled={provinces.length <= 1} onClick={e => { e.stopPropagation(); removeProvince(province.id); }} aria-label={`Delete ${province.name}`} title={provinces.length <= 1 ? 'At least one map unit is required' : `Delete ${province.name}`}><span className="trash-icon" aria-hidden="true"/></button>
              </div>;
            })}
          </div>
          <button className="add-province" onClick={addProvince}>＋ Add a map unit</button>
          <div className="tip"><b>TIP</b><span>Click and drag across neighbouring areas to paint faster.</span></div>
        </aside>

        <div className={`panel-resizer left ${leftPanelOpen ? '' : 'collapsed'}`} onPointerDown={event => beginPanelResize('left', event)} onPointerMove={continuePanelResize} onPointerUp={endPanelResize} onPointerCancel={endPanelResize}>
          <button type="button" className="panel-toggle" aria-label={leftPanelOpen ? 'Collapse map controls' : 'Open map controls'} aria-controls="map-control-panel" aria-expanded={leftPanelOpen} onClick={() => setLeftPanelOpen(open => !open)}>{leftPanelOpen ? '‹' : '›'}</button>
          <span className="panel-grip" role="separator" aria-label="Resize map controls panel" aria-orientation="vertical" aria-valuemin={220} aria-valuemax={520} aria-valuenow={leftPanelWidth} tabIndex={leftPanelOpen ? 0 : -1} onKeyDown={event => resizePanelWithKeyboard('left', event)}/>
        </div>

        <section className="map-stage">
          <div className="map-toolbar">
            <div className="search-wrap"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder={`Find a ${level === 'divisions' ? 'division' : level === 'districts' ? 'district' : 'tehsil'}…`} aria-label="Search areas"/>
              {matches.length > 0 && <div className="search-results">{matches.map(f => <button key={featureId(f, level)} onClick={() => { setHovered(f); setSelectedFeature(f); setToolMode('inspect'); setQuery(''); }}>{featureName(f, level)}<small>{String(f.properties.district_name)} · {String(f.properties.province_name)}</small></button>)}</div>}
            </div>
            <div className="map-tools" role="group" aria-label="Map interaction mode"><button className={toolMode === 'paint' ? 'selected' : ''} onClick={() => { setToolMode('paint'); setSelectedFeature(null); setInspectMetricOpen(false); }}>Paint</button><button className={toolMode === 'inspect' ? 'selected' : ''} onClick={() => setToolMode('inspect')}>Inspect</button></div>
          </div>
          <div className="map-paper">
            {toolMode === 'inspect' && <div className={`inspect-map-picker ${inspectMetricOpen ? 'open' : ''}`}>
              <button type="button" aria-label={`Inspect map: ${inspectMetricMeta.label}`} aria-haspopup="listbox" aria-expanded={inspectMetricOpen} onClick={() => setInspectMetricOpen(open => !open)}><b><small>MAP</small>{inspectMetricMeta.label}</b><i>{inspectMetricOpen ? '×' : '⌄'}</i></button>
              {inspectMetricOpen && <div className="inspect-map-menu">
                <span className="inspect-menu-heading">Basic maps</span>
                {BASIC_INSPECT_METRIC_KEYS.map((key,index) => { const item=INSPECT_METRICS.find(candidate=>candidate.key===key)!; return <button type="button" aria-pressed={item.key === inspectMetric} className={item.key === inspectMetric ? 'selected' : ''} key={item.key} onClick={() => { setInspectMetric(item.key); setInspectMetricOpen(false); }}><span>{String(index + 1).padStart(2,'0')}</span><b>{item.label}</b>{item.key === inspectMetric && <i>✓</i>}</button>; })}
                <button type="button" className={`inspect-other-toggle ${inspectOtherOpen ? 'open' : ''}`} aria-expanded={inspectOtherOpen} onClick={() => setInspectOtherOpen(open => !open)}><span>+</span><b>{inspectOtherOpen ? 'Hide other statistics' : 'Other statistics'}</b><i>{inspectOtherOpen ? '−' : '⌄'}</i></button>
                {inspectOtherOpen && <div className="inspect-other-groups">{OTHER_INSPECT_METRIC_GROUPS.map(group => <section key={group.label}><span className="inspect-menu-heading">{group.label}</span>{group.keys.map(key => { const item=INSPECT_METRICS.find(candidate=>candidate.key===key)!; return <button type="button" aria-pressed={item.key === inspectMetric} className={item.key === inspectMetric ? 'selected' : ''} key={item.key} onClick={() => { setInspectMetric(item.key); setInspectMetricOpen(false); }}><span aria-hidden="true">•</span><b>{item.label}</b>{item.key === inspectMetric && <i>✓</i>}</button>; })}</section>)}</div>}
              </div>}
            </div>}
            {!features.length && <div className="loading">Drawing boundaries…</div>}
            <svg ref={svgRef} viewBox={`${mapView.x} ${mapView.y} ${mapView.width} ${mapView.height}`} role="img" aria-label={`Interactive map of Pakistan ${level}`} onWheel={e=>{e.preventDefault();const rect=e.currentTarget.getBoundingClientRect();zoomMap(e.deltaY>0?1.16:.86,(e.clientX-rect.left)/rect.width,(e.clientY-rect.top)/rect.height)}} onPointerDown={e=>{if(!(e.shiftKey||e.button===1||e.target===e.currentTarget))return;e.currentTarget.setPointerCapture(e.pointerId);panRef.current={pointerId:e.pointerId,clientX:e.clientX,clientY:e.clientY,view:mapView}}} onPointerMove={e=>{const pan=panRef.current;if(!pan||pan.pointerId!==e.pointerId)return;const rect=e.currentTarget.getBoundingClientRect();const x=Math.max(0,Math.min(WIDTH-pan.view.width,pan.view.x-(e.clientX-pan.clientX)/rect.width*pan.view.width));const y=Math.max(0,Math.min(HEIGHT-pan.view.height,pan.view.y-(e.clientY-pan.clientY)/rect.height*pan.view.height));setMapView({...pan.view,x,y})}} onPointerUp={e=>{if(panRef.current?.pointerId===e.pointerId)panRef.current=null}} onPointerCancel={()=>{panRef.current=null}}>
              <g fillRule="evenodd">
                {paths.map(({ feature, d }) => {
                  const id = featureId(feature, level); const province = provinceById[assignments[id]];
                  const highlighted = hovered && featureId(hovered, level) === id;
                  const metricValue = toolMode === 'inspect' && inspectMetric !== 'allocation' ? inspectValues.get(id) ?? null : null;
                  const metricDepth = inspectColorDepth(metricValue);
                  const metricMapActive = toolMode === 'inspect' && inspectMetric !== 'allocation';
                  return <path key={id} d={d} fill={metricMapActive ? metricValue == null ? '#e8e1d5' : '#4c7bd9' : province?.color || '#e8e1d5'} fillOpacity={metricMapActive ? metricDepth : 1} className={`${level === 'divisions' ? 'region division-region' : 'region'}${highlighted ? ' highlighted' : ''}`} aria-label={metricMapActive ? `${featureName(feature, level)} · ${inspectMetricMeta.label}: ${formatInspectValue(metricValue)}${metricValue != null && inspectMetricMeta.unit ? ` ${inspectMetricMeta.unit}` : ''}` : featureName(feature, level)} onPointerDown={e => { if (e.shiftKey||e.button===1) return; if (toolMode === 'inspect') { setSelectedFeature(feature); setPainting(false); return; } e.currentTarget.setPointerCapture(e.pointerId); setPainting(true); paint(feature); }} onPointerEnter={() => { setHovered(feature); if (painting && toolMode === 'paint') paint(feature); }} onPointerMove={() => painting && toolMode === 'paint' && paint(feature)} onPointerUp={() => setPainting(false)}/>;
                })}
              </g>
              {divisionPath && <path className="division-boundaries" d={divisionPath}/>}
              {nationalPath && <path className="national-boundary" d={nationalPath}/>}
              <g className="city-layer" aria-label="Major cities">
                {CITY_MARKERS.filter(city => city.tier === 1 || cityZoom >= 1.35).map(city => {
                  const [x, y] = project([city.lon, city.lat]);
                  return <g className={`city-marker city-tier-${city.tier}`} key={city.name} transform={`translate(${x} ${y})`}><title>{city.name}</title><circle className="city-dot" r="2.5"/></g>;
                })}
              </g>
            </svg>
            <div className="map-navigation" role="group" aria-label="Map zoom controls"><button onClick={()=>zoomMap(.8)} aria-label="Zoom in">+</button><button onClick={()=>zoomMap(1.25)} aria-label="Zoom out">−</button><button onClick={resetMapView} aria-label="Reset map view">⌂</button></div>
            <div className="north">N<span>↑</span></div>
            {hovered && <div className="map-tooltip"><b>{featureName(hovered, level)}</b><span>{level === 'tehsils' && `${String(hovered.properties.district_name)} · `}{String(hovered.properties.province_name)}</span>{toolMode === 'inspect' && inspectMetric !== 'allocation' ? <strong><small>{inspectMetricMeta.label}</small>{formatInspectValue(inspectValues.get(featureId(hovered, level)) ?? null)}{inspectValues.get(featureId(hovered, level)) != null && inspectMetricMeta.unit ? <em>{inspectMetricMeta.unit}</em> : null}</strong> : <small>{provinceById[assignments[featureId(hovered, level)]]?.name || 'Unassigned'}</small>}</div>}
            {selectedFeature && toolMode === 'inspect' && <aside className="district-drawer">
              <div className="district-head"><div><small>{level === 'divisions' ? 'DIVISION DETAIL' : level === 'tehsils' ? 'TEHSIL DETAIL' : 'DISTRICT DETAIL'}</small><h2>{featureName(selectedFeature, level)}</h2><p>{level === 'tehsils' && `${String(selectedFeature.properties.district_name)} · `}{String(selectedFeature.properties.province_name)}</p></div><button onClick={() => setSelectedFeature(null)} aria-label="Close details">×</button></div>
              <p className="district-section-label">VITAL STATISTICS</p>
              <div className="district-stats">{inspectStats.map(stat => <span key={stat.label}><b>{stat.value}</b>{stat.label}</span>)}</div>
              <footer>PBS Census 2023 demographic and housing tables · Data Darbar modeled indicators. HIES district observations are rural-only. Missing values are shown as —; tehsil social indicators inherit their matched district estimate.</footer>
            </aside>}
            <div className="map-caption">PBS 2023 DIVISIONS HEAVY · {level.toUpperCase()} LIGHT · CITY DOTS ARE REFERENCE LOCATIONS</div>
          </div>
        </section>

        <div className={`panel-resizer right ${rightPanelOpen ? '' : 'collapsed'}`} onPointerDown={event => beginPanelResize('right', event)} onPointerMove={continuePanelResize} onPointerUp={endPanelResize} onPointerCancel={endPanelResize}>
          <button type="button" className="panel-toggle" aria-label={rightPanelOpen ? 'Collapse map summary' : 'Open map summary'} aria-controls="map-summary-panel" aria-expanded={rightPanelOpen} onClick={() => setRightPanelOpen(open => !open)}>{rightPanelOpen ? '›' : '‹'}</button>
          <span className="panel-grip" role="separator" aria-label="Resize map summary panel" aria-orientation="vertical" aria-valuemin={220} aria-valuemax={520} aria-valuenow={rightPanelWidth} tabIndex={rightPanelOpen ? 0 : -1} onKeyDown={event => resizePanelWithKeyboard('right', event)}/>
        </div>

        <aside id="map-summary-panel" className="summary-panel" hidden={!rightPanelOpen}>
          <div className="eyebrow"><span>03</span> YOUR NEW MAP</div>
          {activeRow && <section className="live-vitals" style={{ '--province-color': activeRow.color } as React.CSSProperties}>
            <div className="live-vitals-head"><div><small>{activeRow.kind}</small><h2>{activeRow.name}</h2>{activeRow.capital && <span>Capital · {activeRow.capital}</span>}</div><b>{activeRow.members.length}</b></div>
            {activeRow.members.length ? <><div className="live-vitals-grid"><span><b>{activeRow.population ? `${(activeRow.population/1_000_000).toFixed(2)}m` : '—'}</b>population · {level==='tehsils'?'modeled estimate':activeRow.populationYear||'mixed years'}</span><span><b>{activeRow.population && comparableMappedPopulation ? `${(activeRow.population/comparableMappedPopulation*100).toFixed(1)}%` : '—'}</b>{comparableMappedPopulation?'mapped share':'share not comparable across years'}</span><span><b>{activeRow.literacy==null?'—':`${activeRow.literacy.toFixed(1)}%`}</b>literacy</span><span><b>{activeRow.matricPlus==null?'—':`≈${activeRow.matricPlus.toFixed(1)}%`}</b>matric+ · district estimate</span><span><b>{activeRow.urbanShare==null?'—':`${activeRow.urbanShare.toFixed(1)}%`}</b>urban</span><span><b>{activeRow.consumption==null?'—':`≈Rs ${Math.round(activeRow.consumption).toLocaleString()}`}</b>consumption / person · rural estimate</span></div><button onClick={() => openProfile(activeRow.id)}>Open full profile ↗</button></> : <p>Paint {level} with {activeRow.name} to see its live statistics.</p>}
          </section>}
          <div className="big-stat"><strong>{provinces.length}</strong><span>MAP UNITS<br/>CREATED</span></div>
          <div className="assignment-stat"><span>{totalAssigned} of {features.length}</span><span>{Math.round(totalAssigned / Math.max(features.length, 1) * 100)}% assigned</span><div><i style={{ width: `${totalAssigned / Math.max(features.length, 1) * 100}%` }}/></div></div>
          <div className="summary-list">{provinces.map(p => { const count = assignmentCounts[p.id] || 0; return <div key={p.id}><i style={{ background: p.color }}/><span>{p.name}</span><b>{count}</b></div>; })}</div>
          <div className="unassigned"><i/>Unassigned <b>{features.length - totalAssigned}</b></div>
          <button className="clear" onClick={clearMap}>Clear map</button>
          <p className="source-note">Boundary data: <a href="https://github.com/abdullahumer1101/pkmapr" target="_blank" rel="noreferrer">pkmapr / OCHA</a>. Administrative boundaries and names may change. <a href="/pakistan-map/methodology">Data methodology →</a></p>
          <p className="source-note">AJK uses government 2017 district population plus territory-wide PSLM 2019–20 literacy and primary enrolment. GB uses official 2017 census population, MICS 2016–17 district literacy, and territory-wide 2017 urban share / 2022 primary enrolment. Historical parent figures appear only when all successor districts stay together; missing indicators remain blank, never zero.</p>
        </aside>
      </section>
      {finalized && <div className="final-overlay" role="dialog" aria-modal="true" aria-labelledby="final-title" onMouseDown={e => e.target === e.currentTarget && setFinalized(false)}>
        <section className="final-sheet">
          <div className="final-head"><div><span>PROVINCE PLAN · {level.toUpperCase()}</span><h1 id="final-title">{mapName || 'Untitled province plan'}</h1><p>{totalAssigned} of {features.length} {level} assigned across {provinces.filter(p => finalRows.find(r => r.id === p.id)?.members.length).length} populated provinces and territories.</p></div><div className="final-head-actions"><button className="compare-button" onClick={openComparison}>Compare provinces ↗</button><button onClick={() => setFinalized(false)} aria-label="Close summary">×</button></div></div>
          <section className="country-politics">
            <div className="country-politics-head"><div><span>POLITICAL RESULTS</span><h2>Assembly composition</h2></div><div className="election-controls"><div className="election-year" role="group" aria-label="Election year"><button className={electionYear === 2024 ? 'selected' : ''} onClick={() => { setElectionYear(2024); setAssembly(null); }}>2024</button><button className={electionYear === 2018 ? 'selected' : ''} onClick={() => { setElectionYear(2018); setAssembly(null); }}>2018</button></div><p>{countryPolitics.provinces} provincial assemblies replayed</p><button className="politics-toggle" type="button" aria-expanded={politicsOpen} aria-controls="political-results" onClick={() => setPoliticsOpen(open => !open)}>{politicsOpen ? 'Collapse ↑' : 'Expand ↓'}</button></div></div>
            {politicsOpen && <div id="political-results" className="country-politics-body">
              <div className="country-politics-grid">
                <article><div className="politics-title"><b>{electionYear} provincial assembly replay · country total</b><span>{countryAssemblySeats} directly elected seats</span></div><div className="party-bar">{Object.entries(countryPolitics.assembly).filter(([,seats])=>seats>0).sort((a,b)=>b[1]-a[1]).map(([party,seats])=><i key={party} style={{width:`${seats/Math.max(countryAssemblySeats,1)*100}%`,background:PARTY_COLORS[party]||'#9b958a'}} title={`${party}: ${seats}`}/>)}</div><div className="party-list">{Object.entries(countryPolitics.assembly).filter(([,seats])=>seats>0).sort((a,b)=>b[1]-a[1]).map(([party,seats])=><span key={party}><i style={{background:PARTY_COLORS[party]||'#9b958a'}}/>{party}<b>{seats}</b></span>)}</div></article>
                <article><div className="politics-title"><b>Country-wide Senate projection · {electionYear} basis</b><span>{countrySenateSeats} projected provincial seats · ICT’s 4 federal seats not party-projected</span></div><div className="party-bar">{Object.entries(countryPolitics.senate).filter(([,seats])=>seats>0).sort((a,b)=>b[1]-a[1]).map(([party,seats])=><i key={party} style={{width:`${seats/Math.max(countrySenateSeats,1)*100}%`,background:PARTY_COLORS[party]||'#9b958a'}} title={`${party}: ${seats}`}/>)}</div><div className="party-list">{Object.entries(countryPolitics.senate).filter(([,seats])=>seats>0).sort((a,b)=>b[1]-a[1]).map(([party,seats])=><span key={party}><i style={{background:PARTY_COLORS[party]||'#9b958a'}}/>{party}<b>{seats}</b></span>)}</div></article>
              </div>
              <div className="province-politics-grid">
                {finalRows.filter(row => row.members.length && (row.electionSeats > 0 || row.regionalSeatCount > 0)).map(row => <article key={row.id} style={{'--province-color':row.color} as React.CSSProperties}>
                  <div className="province-politics-head"><i/><div><b>{row.name}</b><span>{row.kind}{row.capital ? ` · capital: ${row.capital}` : ''}</span></div></div>
                  {row.kind === 'province' && row.electionSeats > 0 && <div className="politics-block"><div className="politics-title"><b>{electionYear} assembly replay</b><span>{row.electionSeats} directly elected seats</span></div><div className="party-bar">{Object.entries(row.partySeats).filter(([,seats]) => seats > 0).sort((a,b) => b[1] - a[1]).map(([party,seats]) => <i key={party} style={{ width: `${seats / row.electionSeats * 100}%`, background: PARTY_COLORS[party] || '#9b958a' }} title={`${party}: ${seats}`}/>)}</div><div className="party-list">{Object.entries(row.partySeats).filter(([,seats]) => seats > 0).sort((a,b) => b[1] - a[1]).map(([party,seats]) => <span key={party}><i style={{ background: PARTY_COLORS[party] || '#9b958a' }}/>{party}<b>{seats}</b></span>)}</div><div className="senate-line"><div className="senate-title"><strong>Province-wide Senate projection</strong><span>23 seats elected by this proposed assembly</span></div><div className="senate-bar">{Object.entries(row.senateSeats).filter(([,seats]) => seats > 0).sort((a,b) => b[1] - a[1]).map(([party,seats]) => <i key={party} style={{ width: `${seats / 23 * 100}%`, background: PARTY_COLORS[party] || '#9b958a' }} title={`${party}: ${seats}`}/>)}</div><div className="senate-parties">{Object.entries(row.senateSeats).filter(([,seats]) => seats > 0).sort((a,b) => b[1] - a[1]).map(([party,seats]) => <span key={party}><i style={{ background: PARTY_COLORS[party] || '#9b958a' }}/>{party}<b>{seats}</b></span>)}</div></div></div>}
                  {row.regionalSeatCount > 0 && <div className="politics-block regional-politics"><div className="politics-title"><b>{row.regionalRegions.join(' + ')} 2026 assembly results</b><span>{row.regionalSeatCount} mapped general seats</span></div><div className="party-bar">{Object.entries(row.regionalSeats).filter(([,seats]) => seats > 0).sort((a,b) => b[1] - a[1]).map(([party,seats]) => <i key={party} style={{ width: `${seats / row.regionalSeatCount * 100}%`, background: PARTY_COLORS[party] || '#9b958a' }} title={`${party}: ${seats}`}/>)}</div><div className="party-list">{Object.entries(row.regionalSeats).filter(([,seats]) => seats > 0).sort((a,b) => b[1] - a[1]).map(([party,seats]) => <span key={party}><i style={{ background: PARTY_COLORS[party] || '#9b958a' }}/>{party}<b>{seats}</b></span>)}</div><p>Split rule: each mapped seat goes to the new unit containing its district. Unmapped and non-geographic seats are excluded.</p></div>}
                </article>)}
              </div>
              <p className="historical-note">Islamabad has no provincial assembly, so it is absent from the provincial replay. It is represented in Pakistan’s National Assembly and by four Senate seats; AJK and Gilgit–Baltistan are outside Pakistan’s federal Parliament.</p>
              {electionYear === 2018 && <p className="historical-note">2018 did not use today’s district map. Later splits are rolled back to their 2018 parent district; a seat is omitted if your proposed boundary divides that historical unit. Former FATA districts had no KP Assembly seats in the July 2018 election.</p>}
            </div>}
          </section>
          {rankedOpen && <aside className="rank-drawer" aria-label="Rank proposed provinces by indicator">
            <div className="rank-head"><div><span>VITAL STATISTICS</span><h2>Compare provinces</h2><p>Ranked highest to lowest for the selected indicator.</p></div><button onClick={() => setRankedOpen(false)} aria-label="Close comparison">×</button></div>
            <div className="rank-picker" role="tablist" aria-label="Choose indicator">{RANK_METRICS.map(metric => <button key={metric.key} className={rankMetric === metric.key ? 'selected' : ''} onClick={() => setRankMetric(metric.key)} role="tab" aria-selected={rankMetric === metric.key}>{metric.label}</button>)}</div>
            <div className="rank-context"><b>{RANK_METRICS.find(metric => metric.key === rankMetric)?.label}</b><span>{RANK_METRICS.find(metric => metric.key === rankMetric)?.unit}</span></div>
            <ol className="rank-list">{rankedRows.map((row, index) => <li key={row.id}><div className="rank-place">{String(index + 1).padStart(2, '0')}</div><div className="rank-result"><div><b>{row.name}</b><strong>{formatRankValue(Number(row[rankMetric]))}</strong></div><span><i style={{ width: `${Number(row[rankMetric]) / rankMaximum * 100}%`, background: row.color }}/></span></div></li>)}</ol>
            <p className="rank-note">Figures marked as estimates use the same population-weighted district method here. HIES district observations are rural-only. Higher deprivation-index and food-insecurity values indicate worse outcomes.</p>
          </aside>}
          <div className="province-details-head"><div><span>MAP UNIT PROFILES</span><h2>Vital statistics</h2></div><button type="button" aria-expanded={detailsOpen} aria-controls="province-details" onClick={() => setDetailsOpen(open => !open)}>{detailsOpen ? 'Collapse ↑' : 'Expand ↓'}</button></div>
          {detailsOpen && <div id="province-details" className="final-grid">
            {finalRows.filter(row => row.members.length).map((row, index) => <article key={row.id} style={{ '--province-color': row.color } as React.CSSProperties}>
              <div className="final-number">{String(index + 1).padStart(2, '0')}</div>
              <div><div className="unit-heading"><div><h2>{row.name}</h2><button className="open-profile" onClick={() => openProfile(row.id)}>Open full profile ↗</button></div><span className="unit-type-line">{row.kind}{row.capital ? ` · capital: ${row.capital}` : ' · capital not selected'}</span></div>
              <section className="metric-section overview-metrics"><h3>At a glance</h3><div className="final-metrics"><span><b>{row.members.length}</b>{level}</span><span><b>{Math.round(row.area).toLocaleString()}</b>km²</span><span><b>{row.population ? (row.population / 1_000_000).toFixed(2) + 'm' : '—'}</b>{level === 'tehsils' ? `estimated population${row.populationYear ? ` · ${row.populationYear}` : ' · mixed years'}` : `population${row.populationYear ? ` · ${row.populationYear}` : ' · mixed years'}`}</span><span><b>{row.urbanShare == null ? '—' : `${row.urbanShare.toFixed(1)}%`}</b>urban share · {row.urbanYear}</span></div></section>
              <section className="metric-section"><h3>Education</h3><div className="final-metrics"><span><b>{row.literacy == null ? '—' : `${level === 'tehsils' ? '≈' : ''}${row.literacy.toFixed(1)}%`}</b>literacy · {row.literacyYear}</span><span><b>{row.matricPlus == null ? '—' : `≈${row.matricPlus.toFixed(1)}%`}</b>matric or higher</span><span><b>{row.enrolment == null ? '—' : `≈${row.enrolment.toFixed(1)}%`}</b>net enrolment · {row.enrolmentYear}</span><span><b>{row.numeracy == null ? '—' : `≈${row.numeracy.toFixed(1)}%`}</b>numeracy</span>{level !== 'tehsils' && <span className="wide-metric"><b>{row.outOfSchool == null ? '—' : Math.round(row.outOfSchool).toLocaleString()}</b>children aged 5–16 out of school</span>}</div></section>
              <section className="metric-section"><h3>Economy &amp; living conditions</h3><div className="final-metrics"><span><b>{row.consumption == null ? '—' : `≈Rs ${Math.round(row.consumption).toLocaleString()}`}</b>monthly consumption / person · rural model</span><span><b>{row.lfpr == null ? '—' : `≈${row.lfpr.toFixed(1)}%`}</b>labor-force participation · Census estimate</span><span><b>{row.foodInsecurity == null ? '—' : `≈${row.foodInsecurity.toFixed(1)}%`}</b>food insecurity · rural model</span><span><b>{row.internet == null ? '—' : `≈${row.internet.toFixed(1)}%`}</b>internet use · rural model</span><span><b>{row.electricity == null ? '—' : `≈${row.electricity.toFixed(1)}%`}</b>electricity · rural model</span>{level !== 'tehsils' ? <><span><b>{row.mpi == null ? '—' : row.mpi.toFixed(3)}</b>Data Darbar deprivation index · 2019–20</span><span><b>{row.unemployment == null ? '—' : `${row.unemployment.toFixed(1)}%`}</b>unemployment · Census estimate</span></> : <><span><b>{row.rwi == null ? '—' : `${row.rwi.toFixed(0)}th`}</b>wealth percentile</span><span><b>{row.nightLight == null ? '—' : row.nightLight.toFixed(2)}</b>night radiance · 2026</span></>}</div></section>
              <div className="origin-bar">{row.origins.map(([origin, count]) => <i key={origin} style={{ width: `${count / row.members.length * 100}%` }} title={`${origin}: ${count}`}/>)}</div>
              <p>Drawn from {row.origins.map(([origin, count]) => `${count} ${origin}`).join(' · ')} · Data matched for {row.dataMatches}/{row.dataUnitCount} source units</p>
              </div>
            </article>)}
          </div>}
          <footer className="final-footer"><p><b>Data & method</b> PBS Census 2023 counts are kept separate from district-rate estimates, rural-only HIES observations, and modeled proxies. Missing values are never zero. <a href="/pakistan-map/methodology">Read sources, formulas and assumptions →</a> Politics replays {electionYear} provincial general-seat winners grouped by election-era districts from the <a href={electionYear === 2018 ? 'https://www.ecp.gov.pk/storage/files/3/03-ECP%20Annual%20Report%202018.pdf' : 'https://www.ecp.gov.pk/storage/files/3/General%20Election%20Report%202024%20Vol-II-compressed.pdf'} target="_blank" rel="noreferrer">Election Commission of Pakistan</a>; reserved seats are excluded.</p><div><button onClick={exportPng}>Export PNG</button><button onClick={shareMap}>{shareStatus}</button><button className="dark" onClick={exportPlan}>Download plan</button></div></footer>
        </section>
      </div>}
    </main>
  );
}
