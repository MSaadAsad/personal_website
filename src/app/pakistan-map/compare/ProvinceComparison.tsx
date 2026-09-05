'use client';

import { useEffect, useMemo, useState } from 'react';
import { completeRegionalPopulation2017, REGIONAL_POPULATION_SOURCES, regionalDistrictPopulation2017, regionalSocialStats } from '../regional-population';
import { buildTehsilDataLookup } from '../tehsil-data-match';
import { aggregateCensus, type CensusDetail } from '../census-detail';

type Level='districts'|'tehsils';
type Kind='province'|'territory';
type Config={n:string;l:Level;p:[string,string,string,Kind?,string?][];a:[string,string,number][]};
type Feature={properties:Record<string,string|number>;geometry:{type:'Polygon'|'MultiPolygon';coordinates:number[][][]|number[][][][]}};
type District={p:number|null;l:number|null;i:number|null;u:number|null;mat:number|null;oos:number|null;cons:number|null;lfpr:number|null;fi:number|null;net:number|null;elec:number|null;mpi:number|null};
type Darbar={districts:Record<string,District>;tehsils:{n:string;d:string;p:number|null}[]};
type Metric='population'|'density'|'growth'|'householdSize'|'under15'|'workingAge'|'dependency'|'literacy'|'urban'|'matric'|'outOfSchool'|'consumption'|'lfpr'|'food'|'internet'|'electricity'|'mpi'|'improvedWater'|'waterInside'|'flushToilet'|'noToilet'|'ownedHousing'|'oneRoomHousing';
type Row={id:string;name:string;color:string;kind:Kind;members:number;population:number|null;density:number|null;growth:number|null;householdSize:number|null;under15:number|null;workingAge:number|null;dependency:number|null;literacy:number|null;urban:number|null;matric:number|null;outOfSchool:number|null;consumption:number|null;lfpr:number|null;food:number|null;internet:number|null;electricity:number|null;mpi:number|null;improvedWater:number|null;waterInside:number|null;flushToilet:number|null;noToilet:number|null;ownedHousing:number|null;oneRoomHousing:number|null};

const METRICS:{key:Metric;label:string;unit:string;kind:'share'|'rate'|'absolute'|'index';lowBetter?:boolean}[]=[
  {key:'population',label:'Population',unit:'people',kind:'share'},
  {key:'density',label:'Population density',unit:'people / km²',kind:'absolute'},
  {key:'growth',label:'Annual population growth',unit:'% · 2017–23',kind:'absolute'},
  {key:'householdSize',label:'Average household size',unit:'people / household',kind:'absolute'},
  {key:'under15',label:'Population under 15',unit:'%',kind:'rate'},
  {key:'workingAge',label:'Working-age population',unit:'%',kind:'rate'},
  {key:'dependency',label:'Age dependency ratio',unit:'dependants / 100 working-age',kind:'rate'},
  {key:'literacy',label:'Literacy',unit:'%',kind:'rate'},
  {key:'urban',label:'Urban share',unit:'%',kind:'rate'},
  {key:'matric',label:'Matric or higher',unit:'%',kind:'rate'},
  {key:'outOfSchool',label:'Out of school',unit:'children',kind:'absolute',lowBetter:true},
  {key:'consumption',label:'Monthly consumption',unit:'Rs / person',kind:'absolute'},
  {key:'lfpr',label:'Labor-force participation',unit:'%',kind:'rate'},
  {key:'food',label:'Food insecurity',unit:'%',kind:'rate',lowBetter:true},
  {key:'internet',label:'Internet users',unit:'%',kind:'rate'},
  {key:'electricity',label:'Electricity access',unit:'%',kind:'rate'},
  {key:'mpi',label:'Multidimensional poverty',unit:'MPI',kind:'index',lowBetter:true},
  {key:'improvedWater',label:'Improved drinking water',unit:'% households',kind:'rate'},
  {key:'waterInside',label:'Water inside the home',unit:'% households',kind:'rate'},
  {key:'flushToilet',label:'Flush toilet',unit:'% households',kind:'rate'},
  {key:'noToilet',label:'No toilet',unit:'% households',kind:'rate',lowBetter:true},
  {key:'ownedHousing',label:'Owner-occupied housing',unit:'% households',kind:'rate'},
  {key:'oneRoomHousing',label:'One-room housing',unit:'% households',kind:'rate',lowBetter:true},
];
const BASIC_METRIC_KEYS:Metric[]=['population','density','literacy','urban','consumption','mpi'];
const MORE_METRIC_GROUPS:{label:string;keys:Metric[]}[]=[
  {label:'Population & households',keys:['growth','householdSize','under15','workingAge','dependency']},
  {label:'Education',keys:['matric','outOfSchool']},
  {label:'Work & living conditions',keys:['lfpr','food','internet','electricity']},
  {label:'Housing & services',keys:['improvedWater','waterInside','flushToilet','noToilet','ownedHousing','oneRoomHousing']},
];
const aliases:Record<string,string>={chagai:'chaghi',sudhnoti:'sudhnutti',leiah:'layyah',dikhan:'deraismailkhan',centralkarachi:'karachicentral',eastkarachi:'karachieast',southkarachi:'karachisouth',westkarachi:'karachiwest',malirkarachi:'karachimalir',korangikarachi:'karachikorangi'};
const normalise=(v:unknown)=>String(v).toLowerCase().replace(/district|agency/g,'').replace(/[^a-z0-9]/g,'');
const decode=(value:string):Config=>{const base=value.replace(/-/g,'+').replace(/_/g,'/');const binary=atob(base+'='.repeat((4-base.length%4)%4));return JSON.parse(new TextDecoder().decode(Uint8Array.from(binary,c=>c.charCodeAt(0))))};
const format=(key:Metric,value:number)=>key==='population'||key==='outOfSchool'||key==='density'?Math.round(value).toLocaleString():key==='consumption'?`Rs ${Math.round(value).toLocaleString()}`:key==='mpi'?value.toFixed(3):key==='householdSize'?value.toFixed(1):`${value.toFixed(1)}%`;
const formatAxis=(key:Metric,value:number)=>key==='mpi'?value.toFixed(2):key==='consumption'?`Rs ${Math.round(value/1000)}k`:key==='outOfSchool'?(value>=1_000_000?`${(value/1_000_000).toFixed(1)}m`:`${Math.round(value/1000)}k`):key==='density'?Math.round(value).toLocaleString():key==='householdSize'?value.toFixed(1):key==='growth'?`${value.toFixed(1)}%`:`${Math.round(value)}%`;
const MAP_EXTENT={minX:60.75,maxX:77.25,minY:23.35,maxY:37.25};
const MAP_WIDTH=760,MAP_HEIGHT=820;
const project=([lon,lat]:number[])=>[20+((lon-MAP_EXTENT.minX)/(MAP_EXTENT.maxX-MAP_EXTENT.minX))*720,20+((MAP_EXTENT.maxY-lat)/(MAP_EXTENT.maxY-MAP_EXTENT.minY))*780];
const ringPath=(ring:number[][])=>ring.map((point,index)=>`${index?'L':'M'}${project(point).map(value=>value.toFixed(1)).join(' ')}`).join(' ')+'Z';
const geometryPath=(geometry:Feature['geometry'])=>(geometry.type==='Polygon'?[geometry.coordinates as number[][][]]:geometry.coordinates as number[][][][]).map(polygon=>polygon.map(ringPath).join(' ')).join(' ');
const proposedBoundaryPath=(features:Feature[],owners:Map<string,number>,level:Level)=>{
  const segments=new Map<string,{start:number[];end:number[];owners:Set<string>;uses:number}>();
  features.forEach(feature=>{
    const code=String(feature.properties[level==='tehsils'?'tehsil_code':'district_code']);
    const owner=String(owners.get(code)??'unassigned');
    const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates as number[][][]]:feature.geometry.coordinates as number[][][][];
    polygons.forEach(polygon=>polygon.forEach(ring=>ring.forEach((start,index)=>{
      const end=ring[(index+1)%ring.length];
      if(!end||(start[0]===end[0]&&start[1]===end[1]))return;
      const a=`${start[0].toFixed(4)},${start[1].toFixed(4)}`,b=`${end[0].toFixed(4)},${end[1].toFixed(4)}`;
      const key=a<b?`${a}|${b}`:`${b}|${a}`;
      const segment=segments.get(key)||{start,end,owners:new Set<string>(),uses:0};
      segment.owners.add(owner);segment.uses++;segments.set(key,segment);
    })));
  });
  return [...segments.values()].filter(segment=>segment.uses>1&&segment.owners.size>1).map(segment=>{
    const start=project(segment.start),end=project(segment.end);
    return `M${start[0].toFixed(1)} ${start[1].toFixed(1)}L${end[0].toFixed(1)} ${end[1].toFixed(1)}`;
  }).join(' ');
};

export default function ProvinceComparison(){
  const [config,setConfig]=useState<Config|null>(null);
  const [features,setFeatures]=useState<Feature[]>([]);
  const [data,setData]=useState<Darbar|null>(null);
  const [censusDetail,setCensusDetail]=useState<CensusDetail|null>(null);
  const [metric,setMetric]=useState<Metric>('population');
  const [metricOpen,setMetricOpen]=useState(false);
  const [moreMetricsOpen,setMoreMetricsOpen]=useState(false);
  const [outOfSchoolMode,setOutOfSchoolMode]=useState<'total'|'perCapita'>('total');
  useEffect(()=>{const raw=new URLSearchParams(location.hash.slice(1)).get('map');if(!raw)return;try{const parsed=decode(raw);setConfig(parsed);Promise.all([fetch(`/data/pakistan-map/${parsed.l}.geojson`).then(r=>r.json()),fetch('/data/pakistan-map/datadarbar.json').then(r=>r.json()),fetch('/data/pakistan-map/census-2023-detail.json').then(r=>r.json())]).then(([geo,darbar,census])=>{setFeatures(geo.features);setData(darbar);setCensusDetail(census)})}catch{}},[]);
  const rows=useMemo<Row[]>(()=>{
    if(!config||!data)return[];
    const assigned=new Map(config.a.map(([id,,owner])=>[id,owner]));
    const tehsils=buildTehsilDataLookup(features,data.tehsils);
    return config.p.map(([id,name,color,kind],owner)=>{
      const members=features.filter(f=>assigned.get(String(f.properties[config.l==='districts'?'district_code':'tehsil_code']))===owner);
      let population=0,literate=0,literacyBase=0,urban=0,urbanBase=0,outOfSchool=0,oosMatches=0;
      const totals={matric:0,consumption:0,lfpr:0,food:0,internet:0,electricity:0,mpi:0};
      const bases={...totals};
      if(config.l==='districts')population+=members.reduce((sum,f)=>{const raw=normalise(f.properties.district_name);const key=aliases[raw]||raw;return data.districts[key]?sum:sum+(regionalDistrictPopulation2017(key)||0)},0);
      members.forEach(f=>{const districtKey=aliases[normalise(f.properties.district_name)]||normalise(f.properties.district_name);const district=data.districts[districtKey];const tehsil=config.l==='tehsils'?tehsils.get(String(f.properties.tehsil_code)):null;if(config.l==='districts'&&!district)return;const pop=config.l==='tehsils'?(tehsil?.p||0):(district?.p||regionalDistrictPopulation2017(districtKey)||0);population+=pop;if(!district)return;if(district.l!=null&&district.i!=null&&pop){literate+=district.l/(district.l+district.i)*pop;literacyBase+=pop}if(district.u!=null&&district.p&&pop){urban+=district.u/district.p*pop;urbanBase+=pop}if(config.l==='districts'&&district.oos!=null){outOfSchool+=district.oos;oosMatches++}const source:{[K in keyof typeof totals]:number|null}={matric:district.mat,consumption:district.cons,lfpr:district.lfpr,food:district.fi,internet:district.net,electricity:district.elec,mpi:district.mpi};(Object.keys(totals) as (keyof typeof totals)[]).forEach(k=>{if(source[k]!=null&&pop){totals[k]+=Number(source[k])*pop;bases[k]+=pop}})});
      const memberDistricts=new Set(members.map(f=>normalise(f.properties.district_name)));
      const census=config.l==='districts'?aggregateCensus([...memberDistricts].map(key=>aliases[key]||key),censusDetail):null;
      if(config.l==='districts')population+=completeRegionalPopulation2017(memberDistricts);else if(!population)population=completeRegionalPopulation2017(memberDistricts,true);
      const regionalSocial=config.l==='districts'?regionalSocialStats(memberDistricts):null;
      if(regionalSocial?.literacy!=null&&regionalSocial.literacyWeight){literate+=regionalSocial.literacy/100*regionalSocial.literacyWeight;literacyBase+=regionalSocial.literacyWeight}
      if(regionalSocial?.urbanShare!=null&&regionalSocial.urbanWeight){urban+=regionalSocial.urbanShare/100*regionalSocial.urbanWeight;urbanBase+=regionalSocial.urbanWeight}
      const weighted=(k:keyof typeof totals)=>bases[k]?totals[k]/bases[k]:null;
      return{id,name,color,kind:kind||'province',members:members.length,population:population||null,density:census?.density??null,growth:census?.growthRate??null,householdSize:census?.householdSize??null,under15:census?.under15Share??null,workingAge:census?.workingAgeShare??null,dependency:census?.dependencyRatio??null,literacy:literacyBase?literate/literacyBase*100:null,urban:urbanBase?urban/urbanBase*100:null,matric:weighted('matric'),outOfSchool:oosMatches?outOfSchool:null,consumption:weighted('consumption'),lfpr:weighted('lfpr'),food:weighted('food'),internet:weighted('internet'),electricity:weighted('electricity'),mpi:weighted('mpi'),improvedWater:census?.improvedWater??null,waterInside:census?.waterInside??null,flushToilet:census?.flushToilet??null,noToilet:census?.noToilet??null,ownedHousing:census?.ownedHousing??null,oneRoomHousing:census?.oneRoomHousing??null};
    }).filter(r=>r.members);
  },[censusDetail,config,data,features]);
  const meta=METRICS.find(m=>m.key===metric)!;
  const perCapita=metric==='outOfSchool'&&outOfSchoolMode==='perCapita';
  const metricValue=(row:Row)=>perCapita&&row.outOfSchool!=null&&row.population?row.outOfSchool/row.population*1_000:Number(row[metric]);
  const composition=metric==='population'||(metric==='outOfSchool'&&!perCapita);
  const ranked=[...rows].filter(r=>r[metric]!=null&&(!perCapita||(r.population??0)>0)).sort((a,b)=>{
    const difference=metricValue(b)-metricValue(a);
    return meta.lowBetter&&!composition?-difference:difference;
  });
  const unavailable=rows.filter(row=>row[metric]==null||(perCapita&&!row.population));
  const observedMaximum=Math.max(...ranked.map(metricValue),1);
  const maximum=meta.kind==='rate'?100:metric==='mpi'?1:metric==='consumption'?Math.ceil(observedMaximum/5_000)*5_000:perCapita?Math.ceil(observedMaximum/10)*10:observedMaximum;
  const compositionTotal=ranked.reduce((sum,row)=>sum+metricValue(row),0);
  const formatValue=(row:Row)=>perCapita?`${metricValue(row).toFixed(1)} / 1k`:format(metric,metricValue(row));
  const formatScale=(value:number)=>perCapita?value.toFixed(1):formatAxis(metric,value);
  const compositionCentre=metric==='population'?`${(compositionTotal/1e6).toFixed(1)}m`:Math.round(compositionTotal).toLocaleString();
  const compositionLabel=metric==='population'?'mapped population':'out-of-school children';
  const kicker=composition?'COMPOSITION':perCapita?'PER-CAPITA COMPARISON':meta.kind==='rate'?'PERCENTAGE COMPARISON · 0–100%':metric==='mpi'?'INDEX COMPARISON · 0–1':metric==='consumption'?'PER-PERSON COMPARISON':'RANKED COMPARISON';
  const unitLabel=perCapita?'children per 1,000 residents':meta.unit;
  let angle=0;
  const pie=ranked.map(r=>{const start=angle;angle+=compositionTotal?metricValue(r)/compositionTotal*360:0;return `${r.color} ${start}deg ${angle}deg`}).join(',');
  const featureOwners=useMemo(()=>new Map(config?.a.map(([id,,owner])=>[id,owner])||[]),[config]);
  const proposedBoundaries=useMemo(()=>config?proposedBoundaryPath(features,featureOwners,config.l):'',[config,featureOwners,features]);
  const rowsByOwner=useMemo(()=>new Map(config?.p.map((province,index)=>[index,rows.find(row=>row.id===province[0])])||[]),[config,rows]);
  const mapValue=(feature:Feature)=>{const code=String(feature.properties[config?.l==='tehsils'?'tehsil_code':'district_code']);const row=rowsByOwner.get(featureOwners.get(code)??-1);return row&&row[metric]!=null&&(!perCapita||row.population)?metricValue(row):null};
  if(!config)return <main className="compare-shell"><div className="compare-empty"><h1>No map to compare</h1><a href="/pakistan-map">← Build a map</a></div></main>;
  return <main className="compare-shell">
    <header><a href={`/pakistan-map#map=${new URLSearchParams(location.hash.slice(1)).get('map')||''}`}>← Back to map</a><span>NAYA NAQSHA · COMPARISON</span></header>
    <section className="compare-head">
      <div><span>PROVINCE PLAN · {config.l.toUpperCase()}</span><h1>{config.n}</h1><p>{rows.length} populated provinces and territories compared using the same matched source data as the profiles.</p></div>
    </section>
    <section className="metric-picker">
      <span className="metric-picker-label" id="comparison-metric-label">Compare by</span>
      <div className={`metric-select ${metricOpen?'open':''}`}>
        <button className="metric-select-trigger" type="button" aria-labelledby="comparison-metric-label comparison-metric-value" aria-haspopup="listbox" aria-expanded={metricOpen} onClick={()=>setMetricOpen(open=>!open)}><span id="comparison-metric-value">{meta.label}</span><b className={metricOpen?'close':'chevron'} aria-hidden="true">{metricOpen?'×':''}</b></button>
        {metricOpen&&<div className="metric-select-menu" role="listbox" aria-labelledby="comparison-metric-label">
          <div className="metric-menu-group basic-metrics">
            <span className="metric-menu-heading">Basic statistics</span>
            <div className="metric-menu-options">{BASIC_METRIC_KEYS.map((key,index)=>{const item=METRICS.find(candidate=>candidate.key===key)!;return <button type="button" role="option" aria-selected={metric===item.key} className={metric===item.key?'selected':''} key={item.key} onClick={()=>{setMetric(item.key);setMetricOpen(false)}}><span>{String(index+1).padStart(2,'0')}</span><b>{item.label}</b>{metric===item.key&&<i aria-hidden="true">✓</i>}</button>})}</div>
          </div>
          <button className={`more-metrics-toggle ${moreMetricsOpen?'open':''}`} type="button" aria-expanded={moreMetricsOpen} onClick={()=>setMoreMetricsOpen(open=>!open)}><b>{moreMetricsOpen?'Fewer statistics':'More statistics'}</b><i aria-hidden="true">{moreMetricsOpen?'−':'+'}</i></button>
          {moreMetricsOpen&&<div className="more-metric-groups">{MORE_METRIC_GROUPS.map(group=><div className="metric-menu-group" key={group.label}><span className="metric-menu-heading">{group.label}</span><div className="metric-menu-options">{group.keys.map(key=>{const item=METRICS.find(candidate=>candidate.key===key)!;return <button type="button" role="option" aria-selected={metric===item.key} className={metric===item.key?'selected':''} key={item.key} onClick={()=>{setMetric(item.key);setMetricOpen(false)}}><span aria-hidden="true">•</span><b>{item.label}</b>{metric===item.key&&<i aria-hidden="true">✓</i>}</button>})}</div></div>)}</div>}
        </div>}
      </div>
    </section>
    <section className="comparison-view">
      <div className="comparison-title"><div><span>{kicker}</span><h2>{meta.label}</h2></div><p>{unitLabel}{meta.lowBetter?' · lower is better':''}</p></div>
      {metric==='outOfSchool'&&<div className="comparison-mode" role="group" aria-label="Out-of-school comparison basis"><button className={outOfSchoolMode==='total'?'selected':''} onClick={()=>setOutOfSchoolMode('total')}>Total children</button><button className={outOfSchoolMode==='perCapita'?'selected':''} onClick={()=>setOutOfSchoolMode('perCapita')}>Per 1,000 residents</button></div>}
      {!ranked.length?<div className="comparison-no-data"><b>No comparable data</b><span>This indicator is not available for the selected map level.</span></div>:composition?<div className="population-composition">
        <div className="pie" style={{background:`conic-gradient(${pie})`}} role="img" aria-label={`${meta.label} share by map unit`}><span><b>{compositionCentre}</b>{compositionLabel}</span></div>
        <ol>{ranked.map((r,i)=><li key={r.id}><i style={{background:r.color}}/><span>{String(i+1).padStart(2,'0')}</span><b>{r.name}<em>{r.kind}</em></b><strong>{formatValue(r)}</strong><small>{compositionTotal?(metricValue(r)/compositionTotal*100).toFixed(1):'0.0'}%</small></li>)}</ol>
      </div>:<div className="depth-map-layout">
        <div className="depth-map-panel">
          <svg className="depth-map" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} role="img" aria-labelledby="depth-map-title depth-map-description">
            <title id="depth-map-title">{meta.label} by proposed province</title>
            <desc id="depth-map-description">Darker blue indicates a higher {meta.label.toLowerCase()} value. Heavy lines show the proposed provincial boundaries; areas without comparable data are concrete grey.</desc>
            {features.map((feature,index)=>{const value=mapValue(feature);const depth=value==null?0:.18+.82*Math.max(0,Math.min(1,value/maximum));return <path key={index} d={geometryPath(feature.geometry)} className={value==null?'depth-region unavailable':'depth-region'} style={value==null?undefined:{fillOpacity:depth}}><title>{value==null?'No comparable data':formatScale(value)}</title></path>})}
            {proposedBoundaries&&<path className="proposed-province-boundaries" d={proposedBoundaries}/>}
          </svg>
          <div className="depth-legend"><span>Lower</span><i/><span>Higher</span><b>Unavailable</b><em>Proposed province</em></div>
        </div>
        <ol className="depth-ranking">{ranked.map((row,index)=><li key={row.id}><div className="depth-rank-main"><span>{String(index+1).padStart(2,'0')}</span><b>{row.name}<em>{row.kind}</em></b><strong>{formatValue(row)}</strong></div><span className="depth-rank-bar"><i style={{width:`${Math.max(0,Math.min(100,metricValue(row)/maximum*100))}%`}}/></span></li>)}</ol>
      </div>}
      {perCapita&&ranked.length>0&&<p className="comparison-note">Calculated from out-of-school children divided by total 2023 population. This is per 1,000 residents, not per 1,000 children aged 5–16.</p>}
      {unavailable.length>0&&<p className="comparison-note"><b>No comparable {meta.label.toLowerCase()} data:</b> {unavailable.map(row=>row.name).join(', ')}. {metric==='population'?'AJK has district-level 2017 figures; the GB total can only be used when all 14 current map districts remain together because the 2017 census used an older district structure.':'These units are omitted from the chart rather than plotted as zero.'}</p>}
    </section>
    <footer><span><a href="https://www.pbs.gov.pk/result-excel/" target="_blank" rel="noreferrer">PBS Census 2023 district tables 1, 5, 23, 24 and 25 ↗</a> provide demography, water, sanitation and housing. Regional sources: <a href={REGIONAL_POPULATION_SOURCES.ajk} target="_blank" rel="noreferrer">AJK population (2017) ↗</a> · <a href={REGIONAL_POPULATION_SOURCES.ajkSocial} target="_blank" rel="noreferrer">AJK literacy / primary enrolment (PSLM 2019–20) ↗</a> · <a href={REGIONAL_POPULATION_SOURCES.gb} target="_blank" rel="noreferrer">GB population / urban share (2017), literacy (MICS 2016–17), primary enrolment (2022) ↗</a>. Historical parent figures require all successor districts; unavailable indicators are omitted, never treated as zero.</span><button onClick={()=>navigator.clipboard.writeText(location.href)}>Copy comparison link</button></footer>
  </main>;
}
