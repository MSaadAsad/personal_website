'use client';

import { useEffect, useMemo, useState } from 'react';

type Level='districts'|'tehsils';
type Kind='province'|'territory';
type Config={n:string;l:Level;p:[string,string,string,Kind?][];a:[string,string,number][]};
type Feature={properties:Record<string,string|number>};
type District={p:number|null;l:number|null;i:number|null;u:number|null;mat:number|null;oos:number|null;cons:number|null;lfpr:number|null;fi:number|null;net:number|null;elec:number|null;mpi:number|null};
type Darbar={districts:Record<string,District>;tehsils:{n:string;d:string;p:number|null}[]};
type Metric='population'|'literacy'|'urban'|'matric'|'outOfSchool'|'consumption'|'lfpr'|'food'|'internet'|'electricity'|'mpi';
type Row={id:string;name:string;color:string;kind:Kind;members:number;population:number;literacy:number|null;urban:number|null;matric:number|null;outOfSchool:number|null;consumption:number|null;lfpr:number|null;food:number|null;internet:number|null;electricity:number|null;mpi:number|null};

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

export default function ProvinceComparison(){
  const [config,setConfig]=useState<Config|null>(null);
  const [features,setFeatures]=useState<Feature[]>([]);
  const [data,setData]=useState<Darbar|null>(null);
  const [metric,setMetric]=useState<Metric>('population');
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
      members.forEach(f=>{const districtKey=aliases[normalise(f.properties.district_name)]||normalise(f.properties.district_name);const district=data.districts[districtKey];if(!district)return;const tehsil=config.l==='tehsils'?tehsils.get(`${districtKey}:${normalise(f.properties.tehsil_name)}`):null;const pop=config.l==='tehsils'?(tehsil?.p||0):(district.p||0);population+=pop;if(district.l!=null&&district.i!=null&&pop){literate+=district.l/(district.l+district.i)*pop;literacyBase+=pop}if(district.u!=null&&district.p&&pop){urban+=district.u/district.p*pop;urbanBase+=pop}if(config.l==='districts'&&district.oos!=null){outOfSchool+=district.oos;oosMatches++}const source:{[K in keyof typeof totals]:number|null}={matric:district.mat,consumption:district.cons,lfpr:district.lfpr,food:district.fi,internet:district.net,electricity:district.elec,mpi:district.mpi};(Object.keys(totals) as (keyof typeof totals)[]).forEach(k=>{if(source[k]!=null&&pop){totals[k]+=Number(source[k])*pop;bases[k]+=pop}})});
      const weighted=(k:keyof typeof totals)=>bases[k]?totals[k]/bases[k]:null;
      return{id,name,color,kind:kind||'province',members:members.length,population,literacy:literacyBase?literate/literacyBase*100:null,urban:urbanBase?urban/urbanBase*100:null,matric:weighted('matric'),outOfSchool:oosMatches?outOfSchool:null,consumption:weighted('consumption'),lfpr:weighted('lfpr'),food:weighted('food'),internet:weighted('internet'),electricity:weighted('electricity'),mpi:weighted('mpi')};
    }).filter(r=>r.members);
  },[config,data,features]);
  const meta=METRICS.find(m=>m.key===metric)!;
  const ranked=[...rows].filter(r=>r[metric]!=null).sort((a,b)=>Number(b[metric])-Number(a[metric]));
  const maximum=meta.kind==='rate'?100:Math.max(...ranked.map(r=>Number(r[metric])),1);
  const totalPopulation=rows.reduce((sum,r)=>sum+r.population,0);
  let angle=0;
  const pie=rows.map(r=>{const start=angle;angle+=totalPopulation?r.population/totalPopulation*360:0;return `${r.color} ${start}deg ${angle}deg`}).join(',');
  if(!config)return <main className="compare-shell"><div className="compare-empty"><h1>No map to compare</h1><a href="/pakistan-map">← Build a map</a></div></main>;
  return <main className="compare-shell"><header><a href={`/pakistan-map#map=${new URLSearchParams(location.hash.slice(1)).get('map')||''}`}>← Back to map</a><span>NAYA NAQSHA · COMPARISON</span></header><section className="compare-head"><div><span>PROVINCE PLAN · {config.l.toUpperCase()}</span><h1>{config.n}</h1><p>{rows.length} populated map units compared using the same matched source data as the profiles.</p></div><div><b>{rows.length}</b><span>MAP UNITS</span></div></section><nav className="metric-tabs" aria-label="Choose comparison metric">{METRICS.map(m=><button key={m.key} className={metric===m.key?'selected':''} onClick={()=>setMetric(m.key)}>{m.label}</button>)}</nav><section className="comparison-view"><div className="comparison-title"><div><span>{meta.kind==='share'?'COMPOSITION':meta.kind==='rate'?'COMMON 0–100 SCALE':'RANKED COMPARISON'}</span><h2>{meta.label}</h2></div><p>{meta.unit}{meta.lowBetter?' · lower is better':''}</p></div>{metric==='population'?<div className="population-composition"><div className="pie" style={{background:`conic-gradient(${pie})`}} role="img" aria-label="Population share by map unit"><span><b>{(totalPopulation/1e6).toFixed(1)}m</b>mapped population</span></div><ol>{ranked.map((r,i)=><li key={r.id}><i style={{background:r.color}}/><span>{String(i+1).padStart(2,'0')}</span><b>{r.name}</b><strong>{format(metric,r.population)}</strong><small>{totalPopulation?(r.population/totalPopulation*100).toFixed(1):'0.0'}%</small></li>)}</ol></div>:<ol className="comparison-bars">{ranked.map((r,i)=><li key={r.id}><div className="rank">{String(i+1).padStart(2,'0')}</div><div><header><b>{r.name}</b><strong>{format(metric,Number(r[metric]))}</strong></header><span><i style={{width:`${Number(r[metric])/maximum*100}%`}}/></span></div></li>)}</ol>}</section><footer><span>Data Darbar · PBS Census 2023 and household-survey indicators</span><button onClick={()=>navigator.clipboard.writeText(location.href)}>Copy comparison link</button></footer></main>;
}
