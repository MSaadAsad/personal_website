export const AJK_POPULATION_2017: Record<string, number> = {
  neelum: 191251,
  muzaffarabad: 650370,
  jhelumvalley: 230529,
  bagh: 371919,
  haveli: 152124,
  poonch: 500571,
  sudhnoti: 297584,
  kotli: 774194,
  mirpur: 456200,
  bhimber: 420624,
};

export const AJK_TOTAL_2017 = Object.values(AJK_POPULATION_2017).reduce((sum, population) => sum + population, 0);
export const GB_TOTAL_2017 = 1492924;

const AJK_DISTRICTS = Object.keys(AJK_POPULATION_2017);
const GB_DISTRICTS = ['astore','diamir','darel','tangir','ghanche','ghizer','gupisyasin','gilgit','hunza','kharmang','nagar','rondu','shigar','skardu'];
const GB_HISTORICAL_DISTRICTS = [
  { districts:['astore'], population:95416, literacy:55 },
  { districts:['diamir','darel','tangir'], population:269772, literacy:29 },
  { districts:['ghanche'], population:156697, literacy:43 },
  { districts:['ghizer','gupisyasin'], population:172696, literacy:64 },
  { districts:['gilgit'], population:285236, literacy:67 },
  { districts:['hunza'], population:51372, literacy:71 },
  { districts:['kharmang'], population:54613, literacy:49 },
  { districts:['nagar'], population:71746, literacy:66 },
  { districts:['shigar'], population:74540, literacy:46 },
  { districts:['skardu','rondu'], population:260836, literacy:54 },
];

const regionalKey = (district: string) => district === 'sudhnutti' ? 'sudhnoti' : district;

export function isRegionalPopulationDistrict(district: string) {
  const key = regionalKey(district);
  return AJK_DISTRICTS.includes(key) || GB_DISTRICTS.includes(key);
}

export function regionalDistrictPopulation2017(district: string) {
  const key = regionalKey(district);
  const gbDistrict = GB_HISTORICAL_DISTRICTS.find(row => row.districts.length === 1 && row.districts[0] === key);
  return AJK_POPULATION_2017[key] ?? gbDistrict?.population ?? null;
}

export function completeRegionalPopulation2017(districts: Iterable<string>, includeAjk = false) {
  const selected = new Set([...districts].map(regionalKey));
  let population = 0;
  if (includeAjk && AJK_DISTRICTS.every(district => selected.has(district))) population += AJK_TOTAL_2017;
  GB_HISTORICAL_DISTRICTS.filter(row => row.districts.length > 1 && row.districts.every(district => selected.has(district))).forEach(row => { population += row.population; });
  return population;
}

export function regionalSocialStats(districts: Iterable<string>) {
  const selected = new Set([...districts].map(regionalKey));
  const fullAjk = AJK_DISTRICTS.every(district => selected.has(district));
  const matchedGb = GB_HISTORICAL_DISTRICTS.filter(row => row.districts.every(district => selected.has(district)));
  const gbPopulation = matchedGb.reduce((sum, row) => sum + row.population, 0);
  const fullGb = GB_DISTRICTS.every(district => selected.has(district));
  const literacyWeight = (fullAjk ? AJK_TOTAL_2017 : 0) + gbPopulation;
  const gbLiteracyTotal = fullGb ? 53 * GB_TOTAL_2017 : matchedGb.reduce((sum, row) => sum + row.literacy * row.population, 0);
  const literacy = literacyWeight ? ((fullAjk ? 76 * AJK_TOTAL_2017 : 0) + gbLiteracyTotal) / literacyWeight : null;
  const enrolmentWeight = (fullAjk ? AJK_TOTAL_2017 : 0) + (fullGb ? GB_TOTAL_2017 : 0);
  const enrolment = enrolmentWeight ? ((fullAjk ? 80 * AJK_TOTAL_2017 : 0) + (fullGb ? 80 * GB_TOTAL_2017 : 0)) / enrolmentWeight : null;
  return {
    literacy,
    literacyWeight,
    literacyYear: fullAjk && gbPopulation ? 'mixed historical' : fullAjk ? '2019–20' : gbPopulation ? '2016–17' : null,
    enrolment,
    enrolmentWeight,
    enrolmentYear: fullAjk && fullGb ? 'mixed historical' : fullAjk ? '2019–20' : fullGb ? '2022' : null,
    urbanShare: fullGb ? 16.5 : null,
    urbanWeight: fullGb ? GB_TOTAL_2017 : 0,
    urbanYear: fullGb ? '2017' : null,
    matchedDistricts: (fullAjk ? AJK_DISTRICTS.length : 0) + matchedGb.reduce((sum, row) => sum + row.districts.length, 0),
  };
}

export const REGIONAL_POPULATION_SOURCES = {
  ajk: 'https://food.ajk.gov.pk/elementor-111/',
  gb: 'https://src.pnd.gog.pk/GBatGlance/GBatGlance2023.pdf',
  ajkSocial: 'https://pndajk.gov.pk/uploadfiles/downloads/AJ%26K%20Statistical%20Year%20Book%202024%281%29.pdf',
};
