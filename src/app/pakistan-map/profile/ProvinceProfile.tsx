'use client';

import { useEffect, useMemo, useState } from 'react';
import { completeRegionalPopulation2017, isRegionalPopulationDistrict, REGIONAL_POPULATION_SOURCES, regionalDistrictPopulation2017, regionalSocialStats } from '../regional-population';
import { aggregateCensus, type CensusDetail } from '../census-detail';
import { buildTehsilDataLookup } from '../tehsil-data-match';

type Kind = 'province' | 'territory';
type Config = { n:string; l:'districts'|'tehsils'; p:[string,string,string,Kind?,string?][]; a:[string,string,number][] };
type Feature = { properties:Record<string,string|number> };
type District = { n:string; p:number|null; l:number|null; i:number|null; u:number|null; ur:number|null; lfpr:number|null; oos:number|null; mat:number|null; enrol:number|null; num:number|null; cons:number|null; fi:number|null; net:number|null; elec:number|null; mpi:number|null };
type Tehsil = { n:string; d:string; p:number|null };
type Darbar = { districts:Record<string,District>; tehsils:Tehsil[] };
type DemographicRow = { languages:Record<string,number>; religion:Record<string,number> };
type Demographics = { source:string; districts:Record<string,DemographicRow> };
type ChartKey = 'people'|'education'|'development';

const normalise=(v:unknown)=>String(v).toLowerCase().replace(/district|agency/g,'').replace(/[^a-z0-9]/g,'');
const aliases:Record<string,string>={chagai:'chaghi',sudhnoti:'sudhnutti',leiah:'layyah',dikhan:'deraismailkhan',centralkarachi:'karachicentral',eastkarachi:'karachieast',southkarachi:'karachisouth',westkarachi:'karachiwest',malirkarachi:'karachimalir',korangikarachi:'karachikorangi'};
const CITIES=[
  ['Karachi',18868021,['centralkarachi','eastkarachi','southkarachi','westkarachi','malirkarachi','korangikarachi','keamari']],['Lahore',13004135,['lahore']],['Faisalabad',3691999,['faisalabad']],['Rawalpindi',3357612,['rawalpindi']],['Gujranwala',2668047,['gujranwala']],['Multan',2215381,['multan']],['Hyderabad',1921275,['hyderabad']],['Peshawar',1905975,['peshawar']],['Quetta',1565546,['quetta']],['Islamabad',1108872,['islamabad']],['Sargodha',975886,['sargodha']],['Sialkot',911817,['sialkot']],['Bahawalpur',903795,['bahawalpur']]
] as const;

const PAKISTAN_CENSUS_2023_POPULATION=241499431;

function decode(value:string):Config { const b=value.replace(/-/g,'+').replace(/_/g,'/'); const raw=atob(b+'='.repeat((4-b.length%4)%4)); return JSON.parse(new TextDecoder().decode(Uint8Array.from(raw,c=>c.charCodeAt(0)))); }
const fmt=(v:number|null,suffix='%')=>v==null?'—':`${v.toFixed(1)}${suffix}`;
const makeBreakdown=(counts:Record<string,number>,limit:number)=>{const merged:Record<string,number>={};let explicitOther=0;Object.entries(counts).forEach(([label,n])=>{/^all other$|^other(s)?$/i.test(label)?explicitOther+=n:merged[label]=(merged[label]||0)+n});const total=Object.values(merged).reduce((sum,n)=>sum+n,explicitOther);if(!total)return [];const sorted=Object.entries(merged).filter(([,n])=>n>0).sort((a,b)=>b[1]-a[1]);const shown=sorted.slice(0,limit);const remainder=explicitOther+sorted.slice(limit).reduce((sum,[,n])=>sum+n,0);if(remainder)shown.push(['All other',remainder]);return shown.map(([label,n])=>[label,n/total*100] as const);};
const breakdownPercent=(value:number)=>value>0&&value<.05?'<0.1%':`${value.toFixed(1)}%`;

export default function ProvinceProfile(){
  const [config,setConfig]=useState<Config|null>(null); const [unitId,setUnitId]=useState(''); const [features,setFeatures]=useState<Feature[]>([]); const [data,setData]=useState<Darbar|null>(null); const [demographics,setDemographics]=useState<Demographics|null>(null); const [censusDetail,setCensusDetail]=useState<CensusDetail|null>(null); const [chart,setChart]=useState<ChartKey>('people');
  useEffect(()=>{ const params=new URLSearchParams(location.hash.slice(1)); const raw=params.get('map'); if(raw){try{const c=decode(raw);setConfig(c);setUnitId(params.get('unit')||c.p[0]?.[0]||'');fetch(`/data/pakistan-map/${c.l}.geojson`).then(r=>r.json()).then(x=>setFeatures(x.features));fetch('/data/pakistan-map/datadarbar.json').then(r=>r.json()).then(setData);fetch('/data/pakistan-map/demographics-2023.json').then(r=>r.json()).then(setDemographics);fetch('/data/pakistan-map/census-2023-detail.json').then(r=>r.json()).then(setCensusDetail);}catch{}} },[]);
  const report=useMemo(()=>{
    if(!config||!data)return null;
    const unitIndex=config.p.findIndex(p=>p[0]===unitId);
    const assigned=new Map(config.a.map(([id,,owner])=>[id,owner]));
    const idField=config.l==='districts'?'district_code':'tehsil_code';
    const tehsilLookup=buildTehsilDataLookup(features,data.tehsils);
    const selectedFeatures=features.filter(feature=>assigned.get(String(feature.properties[idField]))===unitIndex);
    const districtWeights=new Map<string,number>();
    const ownerWeights=new Map<string,Map<number,number>>();
    features.forEach(feature=>{
      const owner=assigned.get(String(feature.properties[idField]));
      if(owner==null)return;
      const raw=normalise(feature.properties.district_name),key=aliases[raw]||raw;
      const weight=config.l==='tehsils'?(tehsilLookup.get(String(feature.properties.tehsil_code))?.p||0):(data.districts[key]?.p||regionalDistrictPopulation2017(key)||0);
      const weights=ownerWeights.get(key)||new Map<number,number>();
      weights.set(owner,(weights.get(owner)||0)+weight);
      ownerWeights.set(key,weights);
      if(owner===unitIndex)districtWeights.set(key,(districtWeights.get(key)||0)+weight);
    });
    const owners=new Map([...ownerWeights].map(([key,weights])=>[key,[...weights].sort((a,b)=>b[1]-a[1])[0][0]]));
    const keys=[...districtWeights.keys()];
    const rowsWithKeys=keys.map(key=>[key,data.districts[key]] as const).filter((entry):entry is readonly [string,District]=>Boolean(entry[1]));
    const rows=rowsWithKeys.map(([,row])=>row);
    const census=config.l==='districts'?aggregateCensus(keys,censusDetail):null;
    const regional=config.l==='districts'?regionalSocialStats(keys):null;
    const districtPopulation=(key:string)=>data.districts[key]?.p||regionalDistrictPopulation2017(key)||0;
    const pop=config.l==='districts'
      ? keys.reduce((sum,key)=>sum+districtPopulation(key),0)+completeRegionalPopulation2017(keys)
      : selectedFeatures.reduce((sum,feature)=>sum+(tehsilLookup.get(String(feature.properties.tehsil_code))?.p||0),0);
    const weightFor=(key:string,row:District)=>config.l==='districts'?(row.p||0):(districtWeights.get(key)||0);
    const weighted=(field:keyof District)=>{let sum=0,base=0;rowsWithKeys.forEach(([key,row])=>{const value=row[field],weight=weightFor(key,row);if(typeof value==='number'&&weight){sum+=value*weight;base+=weight}});return base?sum/base:null};
    let literate=0,literacyBase=0,urbanPopulation=0,urbanBase=0;
    rowsWithKeys.forEach(([key,row])=>{
      const weight=weightFor(key,row);
      if(row.l!=null&&row.i!=null&&weight){const denominator=row.l+row.i;literate+=denominator?row.l/denominator*weight:0;literacyBase+=weight}
      if(row.u!=null&&row.p&&weight){urbanPopulation+=row.u/row.p*weight;urbanBase+=weight}
    });
    if(regional?.literacy!=null&&regional.literacyWeight){literate+=regional.literacy/100*regional.literacyWeight;literacyBase+=regional.literacyWeight}
    if(regional?.urbanShare!=null&&regional.urbanWeight){urbanPopulation+=regional.urbanShare/100*regional.urbanWeight;urbanBase+=regional.urbanWeight}
    const literacy=literacyBase?literate/literacyBase*100:null;
    const urban=urbanBase?urbanPopulation/urbanBase*100:null;
    const cities=CITIES.filter(([, ,districts])=>districts.some(d=>owners.get(d)===unitIndex)).sort((a,b)=>b[1]-a[1]).slice(0,6);
    const demoRows=keys.map(key=>[key,demographics?.districts[key]] as const).filter((entry):entry is readonly [string,DemographicRow]=>Boolean(entry[1]));
    const aggregate=(field:'languages'|'religion')=>{const counts:Record<string,number>={};demoRows.forEach(([key,row])=>{const sourceTotal=Object.values(row[field]).reduce((sum,n)=>sum+n,0);const factor=config.l==='tehsils'&&sourceTotal?(districtWeights.get(key)||0)/sourceTotal:1;Object.entries(row[field]).forEach(([label,n])=>counts[label]=(counts[label]||0)+n*factor)});return counts};
    return {unit:config.p[unitIndex],keys,rows,census,pop,populationYear:config.l==='tehsils'?null:keys.length&&keys.every(isRegionalPopulationDistrict)?2017:keys.some(isRegionalPopulationDistrict)?null:2023,literacy,literacyYear:regional?.literacyYear||'2023',enrolmentYear:regional?.enrolmentYear||'2019–20',urbanYear:regional?.urbanYear||'2023',cities,demographicCoverage:demoRows.length,languages:makeBreakdown(aggregate('languages'),7),religion:makeBreakdown(aggregate('religion'),6),metrics:{urban,matric:weighted('mat'),enrolment:regional?.enrolment??weighted('enrol'),numeracy:weighted('num'),lfpr:weighted('lfpr'),consumption:weighted('cons'),food:weighted('fi'),internet:weighted('net'),electricity:weighted('elec'),mpi:weighted('mpi')}};
  },[censusDetail,config,data,demographics,features,unitId]);
  if(!report)return <main className="profile-loading">Loading province profile…</main>;
  const [id,name,color,kind='province']=report.unit;
  const isCurrentPunjab=config?.n==='Current provincial structure'&&normalise(name)==='punjab'&&config.l==='districts';
  const hasRegionalPopulation=report.keys.some(isRegionalPopulationDistrict);
  const metrics=report.metrics;
  const populationShare=config?.l!=='tehsils'&&!hasRegionalPopulation&&report.pop?report.pop/PAKISTAN_CENSUS_2023_POPULATION*100:null;
  const includesIslamabad=report.keys.some(key=>(aliases[key]||key)==='islamabad');
  const federalStatus=kind==='province'
    ? 'Represented in Pakistan’s National Assembly and Senate'
    : includesIslamabad
      ? 'Includes Islamabad · represented in Pakistan’s National Assembly and Senate'
      : 'Outside Pakistan’s National Assembly and Senate';
  const charts={people:[['Share of Pakistan’s 2023 census population',populationShare],[`Urban share · PBS Census ${report.urbanYear}`,metrics.urban]],education:[[`Literacy · PBS Census ${report.literacyYear}`,report.literacy],['Matric or higher · Census district estimate',metrics.matric],[`Net enrolment · PSLM ${report.enrolmentYear} rural estimate`,metrics.enrolment],['Numeracy · PSLM rural estimate',metrics.numeracy]],development:[['Labor-force participation · Census district estimate',metrics.lfpr],['Internet use · HIES rural estimate',metrics.internet],['Electricity · HIES rural estimate',metrics.electricity],['Food insecurity · HIES rural estimate',metrics.food]]} as const;
  return <main className="profile-shell" style={{'--unit-color':color} as React.CSSProperties}>
    <header><a href="/pakistan-map">← Back to map</a><span>NAYA NAQSHA · UNIT PROFILE</span></header>
    <section className="profile-hero">
      <div><span>{kind} · {config?.n}</span><h1>{name}</h1><p>{report.keys.length} {config?.l==='tehsils'?'source districts represented':'Census-map districts'} · {federalStatus}</p>{isCurrentPunjab&&<small>Punjab was subsequently reorganized into 41 administrative districts; this map retains the published Census 2023 geography.</small>}</div>
      <div className="hero-stat"><b>{report.pop?(report.pop/1e6).toFixed(2)+'m':'—'}</b><span>population · {config?.l==='tehsils'?'modeled tehsil estimate':report.populationYear||'mixed years'}</span><strong>{populationShare!=null?populationShare.toFixed(1):'—'}{populationShare!=null?'%':''}</strong><span>{populationShare!=null?'of Pakistan’s 2023 census population':'not comparable across census years'}</span></div>
    </section>
    <section className="profile-grid">
      <article className="chart-card">
        <div className="section-title"><span>PRESET CHARTS</span><h2>Vital statistics</h2></div>
        <div className="chart-tabs">{(['people','education','development'] as ChartKey[]).map(k=><button className={chart===k?'selected':''} onClick={()=>setChart(k)} key={k}>{k}</button>)}</div>
        <div className="bars">{charts[chart].map(([label,value])=><div key={label}><div><b>{label}</b><strong>{fmt(value)}</strong></div><span><i style={{width:`${Math.min(value||0,100)}%`}}/></span></div>)}</div>
        <small>Counts and demographic ratios use PBS Census 2023. Indicators labelled estimate use one consistent population-weighted district method; HIES district observations are rural-only.</small>
        {report.keys.some(isRegionalPopulationDistrict)&&<small>Historical regional data: <a href={REGIONAL_POPULATION_SOURCES.ajkSocial} target="_blank" rel="noreferrer">AJK Statistical Year Book ↗</a> · <a href={REGIONAL_POPULATION_SOURCES.gb} target="_blank" rel="noreferrer">GB at a Glance ↗</a>. Missing indicators remain unavailable.</small>}
      </article>
      <article className="cities-card">
        <div className="section-title"><span>URBAN CENTRES</span><h2>Largest cities</h2></div>
        {report.cities.length?<ol>{report.cities.map(([city,pop],i)=><li key={city}><span>{String(i+1).padStart(2,'0')}</span><b>{city}</b><strong>{(pop/1e6).toFixed(2)}m</strong></li>)}</ol>:<p>No nationally tabulated major city is matched to this unit.</p>}
        <small>PBS Census 2023 large-city table; published city/agglomeration boundaries are not interchangeable with district totals.</small>
      </article>
      <article className="facts-card">
        <div className="section-title"><span>HOUSEHOLDS &amp; ECONOMY</span><h2>Selected indicators</h2></div>
        <div className="facts"><span><b>{metrics.consumption==null?'—':`≈Rs ${Math.round(metrics.consumption).toLocaleString()}`}</b>monthly consumption / person · HIES rural estimate</span><span><b>{metrics.mpi==null?'—':metrics.mpi.toFixed(3)}</b>Data Darbar deprivation index · 2019–20</span><span><b>{fmt(metrics.lfpr)}</b>labor-force participation · Census district estimate</span><span><b>{fmt(metrics.food)}</b>food insecurity · HIES rural estimate</span></div>
        <small>Custom-unit values are population-weighted from matched districts. They are map estimates, not published province totals; unavailable districts are omitted, never treated as zero.</small>
      </article>
      <article className="demographics-card">
        <div className="section-title"><span>IDENTITY · CENSUS 2023</span><h2>Language &amp; religion</h2></div>
        {report.demographicCoverage?<><div className="demographic-columns"><Breakdown title="Mother tongue" rows={report.languages}/><Breakdown title="Religion" rows={report.religion}/></div><small><a href="https://www.pbs.gov.pk/result-excel/" target="_blank" rel="noreferrer">Pakistan Bureau of Statistics, Census 2023, Tables 11 and 9 ↗</a> · {report.demographicCoverage}/{report.keys.length} mapped districts matched. Mother tongue records first language, not all languages spoken. Detailed-characteristic tables exclude restricted-area records, so their denominator is below the province headcount.{config?.l==='tehsils'?' District figures follow each district’s majority tehsil allocation.':''}</small></>:<p className="demographic-empty">No comparable PBS 2023 district language or religion table is available for this territory.</p>}
      </article>
    </section>
    <footer><span>Profile ID · {id} · <a href="/pakistan-map/methodology">Data methodology</a></span><button onClick={()=>navigator.clipboard.writeText(location.href)}>Copy profile link</button></footer>
  </main>;
}

function Breakdown({title,rows}:{title:string;rows:readonly (readonly [string,number])[]}){return <section className="breakdown"><h3>{title}</h3><div>{rows.map(([label,value])=><div className="breakdown-row" key={label}><header><b>{label}</b><strong>{breakdownPercent(value)}</strong></header><span><i style={{width:`${value}%`}}/></span></div>)}</div></section>}
