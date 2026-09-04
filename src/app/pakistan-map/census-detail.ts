export type CensusDistrict = {
  name:string; province:string; areaKm2:number|null; population:number|null; male:number|null; female:number|null;
  sexRatio:number|null; density:number|null; householdSize:number|null; growthRate:number|null;
  agePopulation?:number|null; under15?:number|null; age15to64?:number|null; age65plus?:number|null;
  waterHouseholds?:number|null; improvedWater?:number|null; waterInside?:number|null; tapWater?:number|null;
  sanitationHouseholds?:number|null; flushToilet?:number|null; noToilet?:number|null; separateWashroom?:number|null;
  housingHouseholds?:number|null; ownedHouse?:number|null; rentedHouse?:number|null; femaleOwner?:number|null; oneRoom?:number|null;
};

export type CensusDetail = {
  source:string; sourceUrl:string; tables:number[]; coverage:string; districts:Record<string,CensusDistrict>;
};

export type CensusAggregate = {
  matches:number; areaKm2:number|null; population:number|null; density:number|null; sexRatio:number|null;
  householdSize:number|null; growthRate:number|null; under15Share:number|null; workingAgeShare:number|null;
  seniorShare:number|null; dependencyRatio:number|null; improvedWater:number|null; waterInside:number|null;
  tapWater:number|null; flushToilet:number|null; noToilet:number|null; separateWashroom:number|null;
  ownedHousing:number|null; rentedHousing:number|null; oneRoomHousing:number|null; femaleOwnership:number|null;
};

const ratio = (numerator:number, denominator:number) => denominator ? numerator / denominator * 100 : null;
const censusAliases:Record<string,string> = {
  killaabdullah:'qillaabdullah',
  killasaifullah:'qillasaifullah',
};

export function aggregateCensus(keys:Iterable<string>, census:CensusDetail|null|undefined):CensusAggregate {
  const rows = [...new Set(keys)].map(key=>census?.districts[censusAliases[key]||key]).filter((row):row is CensusDistrict=>Boolean(row));
  const sum = (field:keyof CensusDistrict) => rows.reduce((total,row)=>total+(typeof row[field]==='number'?Number(row[field]):0),0);
  const weighted = (field:keyof CensusDistrict, weight:keyof CensusDistrict) => {
    let total=0,base=0;
    rows.forEach(row=>{const value=row[field],weightValue=row[weight];if(typeof value==='number'&&typeof weightValue==='number'){total+=value*weightValue;base+=weightValue;}});
    return base?total/base:null;
  };
  const population=sum('population'),areaKm2=sum('areaKm2'),male=sum('male'),female=sum('female');
  const agePopulation=sum('agePopulation'),under15=sum('under15'),workingAge=sum('age15to64'),senior=sum('age65plus');
  const waterHouseholds=sum('waterHouseholds'),sanitationHouseholds=sum('sanitationHouseholds'),housingHouseholds=sum('housingHouseholds');
  return {
    matches:rows.length,
    areaKm2:areaKm2||null,
    population:population||null,
    density:population&&areaKm2?population/areaKm2:null,
    sexRatio:female?male/female*100:null,
    householdSize:weighted('householdSize','population'),
    growthRate:weighted('growthRate','population'),
    under15Share:ratio(under15,agePopulation),
    workingAgeShare:ratio(workingAge,agePopulation),
    seniorShare:ratio(senior,agePopulation),
    dependencyRatio:workingAge?(under15+senior)/workingAge*100:null,
    improvedWater:ratio(sum('improvedWater'),waterHouseholds),
    waterInside:ratio(sum('waterInside'),waterHouseholds),
    tapWater:ratio(sum('tapWater'),waterHouseholds),
    flushToilet:ratio(sum('flushToilet'),sanitationHouseholds),
    noToilet:ratio(sum('noToilet'),sanitationHouseholds),
    separateWashroom:ratio(sum('separateWashroom'),sanitationHouseholds),
    ownedHousing:ratio(sum('ownedHouse'),housingHouseholds),
    rentedHousing:ratio(sum('rentedHouse'),housingHouseholds),
    oneRoomHousing:ratio(sum('oneRoom'),housingHouseholds),
    femaleOwnership:ratio(sum('femaleOwner'),housingHouseholds),
  };
}
