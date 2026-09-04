'use client';

import { useEffect, useMemo, useState } from 'react';
import { completeRegionalPopulation2017, REGIONAL_POPULATION_SOURCES, regionalDistrictPopulation2017 } from '../regional-population';

type Level='districts'|'tehsils';
type Kind='province'|'territory';
type Config={n:string;l:Level;p:[string,string,string,Kind?][];a:[string,string,number][]};
type Feature={properties:Record<string,string|number>};
type District={p:number|null;l:number|null;i:number|null;u:number|null;mat:number|null;oos:number|null;cons:number|null;lfpr:number|null;fi:number|null;net:number|null;elec:number|null;mpi:number|null};
type Darbar={districts:Record<string,District>;tehsils:{n:string;d:string;p:number|null}[]};
type Metric='population'|'literacy'|'urban'|'matric'|'outOfSchool'|'consumption'|'lfpr'|'food'|'internet'|'electricity'|'mpi';
type Row={id:string;name:string;color:string;kind:Kind;members:number;population:number|null;literacy:number|null;urban:number|null;matric:number|null;outOfSchool:number|null;consumption:number|null;lfpr:number|null;food:number|null;internet:number|null;electricity:number|null;mpi:number|null};

const METRICS:{key:Metric;label:string;unit:string;kind:'share'|'rate'|'absolute'|'index';lowBetter?:boolean}[]=[
  {key:'population',label:'Population',unit:'people',kind:'share'},
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
];
const aliases:Record<string,string>={chagai:'chaghi',sudhnoti:'sudhnutti',leiah:'layyah',dikhan:'deraismailkhan',centralkarachi:'karachicentral',eastkarachi:'karachieast',southkarachi:'karachisouth',westkarachi:'karachiwest',malirkarachi:'karachimalir',korangikarachi:'karachikorangi'};
const normalise=(v:unknown)=>String(v).toLowerCase().replace(/district|agency/g,'').replace(/[^a-z0-9]/g,'');
const decode=(value:string):Config=>{const base=value.replace(/-/g,'+').replace(/_/g,'/');const binary=atob(base+'='.repeat((4-base.length%4)%4));return JSON.parse(new TextDecoder().decode(Uint8Array.from(binary,c=>c.charCodeAt(0))))};
const format=(key:Metric,value:number)=>key==='population'||key==='outOfSchool'?Math.round(value).toLocaleString():key==='consumption'?`Rs ${Math.round(value).toLocaleString()}`:key==='mpi'?value.toFixed(3):`${value.toFixed(1)}%`;
const formatAxis=(key:Metric,value:number)=>key==='mpi'?value.toFixed(2):key==='consumption'?`Rs ${Math.round(value/1000)}k`:key==='outOfSchool'?(value>=1_000_000?`${(value/1_000_000).toFixed(1)}m`:`${Math.round(value/1000)}k`):`${Math.round(value)}%`;

export default function ProvinceComparison(){
  const [config,setConfig]=useState<Config|null>(null);
  const [features,setFeatures]=useState<Feature[]>([]);
  const [data,setData]=useState<Darbar|null>(null);
  const [metric,setMetric]=useState<Metric>('population');
  const [outOfSchoolMode,setOutOfSchoolMode]=useState<'total'|'perCapita'>('total');
  useEffect(()=>{const raw=new URLSearchParams(location.hash.slice(1)).get('map');if(!raw)return;try{const parsed=decode(raw);setConfig(parsed);Promise.all([fetch(`/data/pakistan-map/${parsed.l}.geojson`).then(r=>r.json()),fetch('/data/pakistan-map/datadarbar.json').then(r=>r.json())]).then(([geo,darbar])=>{setFeatures(geo.features);setData(darbar)})}catch{}},[]);
  const rows=useMemo<Row[]>(()=>{
    if(!config||!data)return[];
    const assigned=new Map(config.a.map(([id,,owner])=>[id,owner]));
    const tehsils=new Map(data.tehsils.map(t=>[`${normalise(t.d)}:${normalise(t.n)}`,t]));
    return config.p.map(([id,name,color,kind],owner)=>{
      const members=features.filter(f=>assigned.get(String(f.properties[config.l==='districts'?'district_code':'tehsil_code']))===owner);
      let population=0,literate=0,literacyBase=0,urban=0,urbanBase=0,outOfSchool=0,oosMatches=0;
      const totals={matric:0,consumption:0,lfpr:0,food:0,internet:0,electricity:0,mpi:0};
      const bases={...totals};
      if(config.l==='districts')population+=members.reduce((sum,f)=>{const raw=normalise(f.properties.district_name);const key=aliases[raw]||raw;return data.districts[key]?sum:sum+(regionalDistrictPopulation2017(key)||0)},0);
      members.forEach(f=>{const districtKey=aliases[normalise(f.properties.district_name)]||normalise(f.properties.district_name);const district=data.districts[districtKey];if(!district)return;const tehsil=config.l==='tehsils'?tehsils.get(`${districtKey}:${normalise(f.properties.tehsil_name)}`):null;const pop=config.l==='tehsils'?(tehsil?.p||0):(district.p||regionalDistrictPopulation2017(districtKey)||0);population+=pop;if(district.l!=null&&district.i!=null&&pop){literate+=district.l/(district.l+district.i)*pop;literacyBase+=pop}if(district.u!=null&&district.p&&pop){urban+=district.u/district.p*pop;urbanBase+=pop}if(config.l==='districts'&&district.oos!=null){outOfSchool+=district.oos;oosMatches++}const source:{[K in keyof typeof totals]:number|null}={matric:district.mat,consumption:district.cons,lfpr:district.lfpr,food:district.fi,internet:district.net,electricity:district.elec,mpi:district.mpi};(Object.keys(totals) as (keyof typeof totals)[]).forEach(k=>{if(source[k]!=null&&pop){totals[k]+=Number(source[k])*pop;bases[k]+=pop}})});
      const memberDistricts=new Set(members.map(f=>normalise(f.properties.district_name)));
      if(config.l==='districts')population+=completeRegionalPopulation2017(memberDistricts);else if(!population)population=completeRegionalPopulation2017(memberDistricts,true);
      const weighted=(k:keyof typeof totals)=>bases[k]?totals[k]/bases[k]:null;
      return{id,name,color,kind:kind||'province',members:members.length,population:population||null,literacy:literacyBase?literate/literacyBase*100:null,urban:urbanBase?urban/urbanBase*100:null,matric:weighted('matric'),outOfSchool:oosMatches?outOfSchool:null,consumption:weighted('consumption'),lfpr:weighted('lfpr'),food:weighted('food'),internet:weighted('internet'),electricity:weighted('electricity'),mpi:weighted('mpi')};
    }).filter(r=>r.members);
  },[config,data,features]);
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
  if(!config)return <main className="compare-shell"><div className="compare-empty"><h1>No map to compare</h1><a href="/pakistan-map">← Build a map</a></div></main>;
  return <main className="compare-shell">
    <header><a href={`/pakistan-map#map=${new URLSearchParams(location.hash.slice(1)).get('map')||''}`}>← Back to map</a><span>NAYA NAQSHA · COMPARISON</span></header>
    <section className="compare-head">
      <div><span>PROVINCE PLAN · {config.l.toUpperCase()}</span><h1>{config.n}</h1><p>{rows.length} populated provinces and territories compared using the same matched source data as the profiles.</p></div>
    </section>
    <section className="metric-picker">
      <label htmlFor="comparison-metric">Compare by</label>
      <div><select id="comparison-metric" value={metric} onChange={event=>setMetric(event.target.value as Metric)}>{METRICS.map(item=><option key={item.key} value={item.key}>{item.label}</option>)}</select><span aria-hidden="true">⌄</span></div>
    </section>
    <section className="comparison-view">
      <div className="comparison-title"><div><span>{kicker}</span><h2>{meta.label}</h2></div><p>{unitLabel}{meta.lowBetter?' · lower is better':''}</p></div>
      {metric==='outOfSchool'&&<div className="comparison-mode" role="group" aria-label="Out-of-school comparison basis"><button className={outOfSchoolMode==='total'?'selected':''} onClick={()=>setOutOfSchoolMode('total')}>Total children</button><button className={outOfSchoolMode==='perCapita'?'selected':''} onClick={()=>setOutOfSchoolMode('perCapita')}>Per 1,000 residents</button></div>}
      {!ranked.length?<div className="comparison-no-data"><b>No comparable data</b><span>This indicator is not available for the selected map level.</span></div>:composition?<div className="population-composition">
        <div className="pie" style={{background:`conic-gradient(${pie})`}} role="img" aria-label={`${meta.label} share by map unit`}><span><b>{compositionCentre}</b>{compositionLabel}</span></div>
        <ol>{ranked.map((r,i)=><li key={r.id}><i style={{background:r.color}}/><span>{String(i+1).padStart(2,'0')}</span><b>{r.name}<em>{r.kind}</em></b><strong>{formatValue(r)}</strong><small>{compositionTotal?(metricValue(r)/compositionTotal*100).toFixed(1):'0.0'}%</small></li>)}</ol>
      </div>:<div className="comparison-column-chart">
        <div className="column-axis" aria-hidden="true">{[1,.75,.5,.25,0].map(stop=><b key={stop}>{formatScale(maximum*stop)}</b>)}</div>
        <ol className="comparison-columns" style={{gridTemplateColumns:`repeat(${ranked.length},minmax(92px,1fr))`}}>{ranked.map((r,i)=><li key={r.id}><strong>{formatValue(r)}</strong><span className="column-track"><i style={{height:`${metricValue(r)/maximum*100}%`}}/></span><div className="column-label"><span>{String(i+1).padStart(2,'0')}</span><b>{r.name}<em>{r.kind}</em></b></div></li>)}</ol>
      </div>}
      {perCapita&&ranked.length>0&&<p className="comparison-note">Calculated from out-of-school children divided by total 2023 population. This is per 1,000 residents, not per 1,000 children aged 5–16.</p>}
      {unavailable.length>0&&<p className="comparison-note"><b>No comparable {meta.label.toLowerCase()} data:</b> {unavailable.map(row=>row.name).join(', ')}. {metric==='population'?'AJK has district-level 2017 figures; the GB total can only be used when all 14 current map districts remain together because the 2017 census used an older district structure.':'These units are omitted from the chart rather than plotted as zero.'}</p>}
    </section>
    <footer><span>Population fallback sources: <a href={REGIONAL_POPULATION_SOURCES.ajk} target="_blank" rel="noreferrer">AJK Government district table (2017) ↗</a> · <a href={REGIONAL_POPULATION_SOURCES.gb} target="_blank" rel="noreferrer">GB at a Glance / Census 2017 ↗</a>. Unavailable indicators are omitted, never treated as zero.</span><button onClick={()=>navigator.clipboard.writeText(location.href)}>Copy comparison link</button></footer>
  </main>;
}
