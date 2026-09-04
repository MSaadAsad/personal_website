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

const regionalKey = (district: string) => district === 'sudhnutti' ? 'sudhnoti' : district;

export function isRegionalPopulationDistrict(district: string) {
  const key = regionalKey(district);
  return AJK_DISTRICTS.includes(key) || GB_DISTRICTS.includes(key);
}

export function regionalDistrictPopulation2017(district: string) {
  return AJK_POPULATION_2017[regionalKey(district)] ?? null;
}

export function completeRegionalPopulation2017(districts: Iterable<string>, includeAjk = false) {
  const selected = new Set([...districts].map(regionalKey));
  let population = 0;
  if (includeAjk && AJK_DISTRICTS.every(district => selected.has(district))) population += AJK_TOTAL_2017;
  if (GB_DISTRICTS.every(district => selected.has(district))) population += GB_TOTAL_2017;
  return population;
}

export const REGIONAL_POPULATION_SOURCES = {
  ajk: 'https://food.ajk.gov.pk/elementor-111/',
  gb: 'https://src.pnd.gog.pk/GBatGlance/GBatGlance2023.pdf',
};
