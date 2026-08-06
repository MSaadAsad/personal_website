const loading=document.querySelector('#mapLoading');
const loadingMessage=document.querySelector('#mapLoadingMessage');
window.BASELINE_READY.then(()=>{
const D=window.LAHORE_BASELINE;
const P=window.LAHORE_TERRITORY_PLACES;
const regionLabel=D.meta.region||'Lahore District';
const shortRegion=regionLabel.replace(/ District$/,'');
document.querySelector('#regionName').textContent=shortRegion;
document.title=`${shortRegion} neighbourhoods`;
const map=L.map('map',{zoomControl:false,preferCanvas:true}).setView([31.46,74.32],10);
L.control.zoom({position:'topright'}).addTo(map);
const labels=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
const district=L.geoJSON(D.district,{style:{color:'#171a18',weight:2.2,fill:false,dashArray:'7 5'}}).addTo(map);
const infra=L.geoJSON(D.infrastructure,{filter:f=>['LineString','MultiLineString'].includes(f.geometry?.type),style:f=>({color:{arterial:'#393e3a',rail:'#9d4052',water:'#607d86',wall:'#7c5546'}[f.properties.kind]||'#555',weight:{arterial:1.3,rail:1.8,water:1.35,wall:1}[f.properties.kind]||1,opacity:f.properties.kind==='water'?.52:.64})}).addTo(map);
let mode='clusters';
let levelIndex=D.meta.cluster_levels.indexOf(35);
let clusterCount=D.meta.cluster_levels[levelIndex];
let selectedProperties=null;
let selectedTerritory=null;
const visibleLevelIndices=[10,35,50,90].map(count=>D.meta.cluster_levels.indexOf(count));
const ramps={activity:['#eff2dd','#d8ff46','#f7ad45','#d84343'],population:['#f1eee5','#d8c9a3','#dd765b','#7b1834'],vegetation:['#eee7cf','#cdd892','#78ae71','#24684d']};
function ramp(v,colors){const i=Math.min(colors.length-1,Math.floor(v*colors.length));return colors[i]}
function territory(p){return p.levels[levelIndex]}
function territoryColor(id){return D.meta.territory_colors?.[levelIndex]?.[String(id)]||`hsl(${Math.round((id*137.508)%360)} 52% ${48+(id%3)*7}%)`}
function cellStyle(f){const p=f.properties;const inferred=p.observed===false;const selected=selectedTerritory!==null&&territory(p)===selectedTerritory;const dimmed=selectedTerritory!==null&&!selected;const fill=mode==='clusters'?territoryColor(territory(p)):ramp(p[mode],ramps[mode]);return {color:selected?'rgba(23,26,24,.92)':inferred?'rgba(23,26,24,.32)':mode==='clusters'?'rgba(255,255,255,.72)':'rgba(23,26,24,.12)',dashArray:inferred?'3 4':null,weight:selected?1.05:inferred?.65:.38,fillColor:fill,fillOpacity:dimmed?.12:mode==='clusters'?(inferred?.5:.68):(inferred?.22:.76)}}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]))}
function namedPlaces(id){return P?.levels?.[String(clusterCount)]?.[String(id)]||[]}
function placeSummary(id){const places=namedPlaces(id);if(!places.length)return '<p class="eyebrow">MAIN PLACES</p><p class="muted">No named OSM neighbourhood or settlement record falls inside this area.</p>';const importantTypes=new Set(['city','town','suburb','quarter','neighbourhood']);let main=places.filter(place=>importantTypes.has(place.type)).slice(0,5);if(!main.length)main=places.slice(0,3);const mainKeys=new Set(main.map(place=>place.name.trim().toLocaleLowerCase()));const local=places.filter(place=>!mainKeys.has(place.name.trim().toLocaleLowerCase()));const mainNames=main.map(place=>escapeHtml(place.name));const localNames=local.map(place=>escapeHtml(place.name));const remainder=local.length?`<details class="place-details"><summary>Show ${local.length} smaller/local names</summary><p class="place-list">${localNames.join(' · ')}</p></details>`:'';return `<p class="eyebrow">MAIN PLACES · ${main.length}</p><p class="place-list place-list-main">${mainNames.join(' · ')}</p>${remainder}<p class="muted">Main names prioritize OSM city, town, suburb and neighbourhood labels. The full list also includes villages and hamlets; these are reference points, not official boundary overlaps.</p>`}
const territoryStats=D.meta.cluster_levels.map((_,i)=>{const stats=new Map();D.cells.features.forEach(f=>{const p=f.properties;const id=p.levels[i];const s=stats.get(id)||{population:0,area:0,blocks:0,inferred:0};s.population+=Number(p.population_estimate||0);s.area+=Number(p.area_km2||0);if(p.observed===false)s.inferred++;else s.blocks++;stats.set(id,s)});return stats});
function showSelection(p){const id=territory(p);const total=territoryStats[levelIndex].get(id);document.querySelector('#selection').innerHTML=`<b>Neighbourhood ${String(id).padStart(2,'0')} of ${clusterCount}</b><p class="territory-summary"><strong>≈${Math.round(total.population).toLocaleString()}</strong> residents · ${total.area.toFixed(1)} km² · ${total.blocks.toLocaleString()} observed blocks</p>${placeSummary(id)}<p class="muted">Population is the sum of WorldPop 2020 estimates across this neighbourhood; it is modeled, not a census count.</p>`}
function clearSelection(){selectedProperties=null;selectedTerritory=null;cells.setStyle(cellStyle);document.querySelector('#selection').innerHTML='<p class="muted">Click a street block to highlight its whole neighbourhood and inspect its population and main place names.</p>'}
const cells=L.geoJSON(D.cells,{style:cellStyle,onEachFeature:(f,l)=>l.on('click',e=>{L.DomEvent.stopPropagation(e);const clickedTerritory=territory(f.properties);if(selectedTerritory===clickedTerritory){clearSelection();return}selectedProperties=f.properties;selectedTerritory=clickedTerritory;cells.setStyle(cellStyle);showSelection(selectedProperties)})}).addTo(map);
map.on('click',clearSelection);
const waterLayer=L.geoJSON(D.water||{type:'FeatureCollection',features:[]},{interactive:false,style:f=>f.geometry.type.includes('Line')?{color:'#607d86',weight:1.45,opacity:.62}:{color:'#607d86',weight:.8,fillColor:'#a9bdc3',fillOpacity:.42}}).addTo(map);
map.fitBounds(district.getBounds(),{padding:[18,18]});
const viewDescriptions={clusters:'Each colour is a model-derived neighbourhood: adjoining blocks grouped by street structure, urban form, destinations and sampled travel reach.',activity:'Highlights blocks with more and more varied mapped destinations, such as shops, schools and clinics. It indicates likely urban activity, not measured footfall or traffic.',population:'Shows the estimated number of residents per square kilometre from WorldPop 2020. Darker areas are denser; these are modeled estimates, not census counts.',vegetation:'Shows satellite-observed greenness within each block using Sentinel-2 imagery. Greener areas contain more vegetation at the time of the image.'};
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{document.querySelectorAll('.mode').forEach(x=>x.classList.remove('active'));b.classList.add('active');mode=b.dataset.mode;cells.setStyle(cellStyle);document.querySelector('#resolutionSection').hidden=mode!=='clusters';document.querySelector('#viewDescription').textContent=viewDescriptions[mode];document.querySelector('#legend span').textContent={clusters:'Solid = observed blocks · faded/dashed = inferred coverage',activity:'Brighter = greater mapped urban intensity',population:'Darker = greater modeled residential population density',vegetation:'Greener = greater satellite-observed vegetation'}[mode]});
document.querySelector('#infraToggle').onchange=e=>e.target.checked?infra.addTo(map):map.removeLayer(infra);
document.querySelector('#labelsToggle').onchange=e=>e.target.checked?labels.addTo(map):map.removeLayer(labels);
document.querySelector('#waterToggle').onchange=e=>e.target.checked?waterLayer.addTo(map):map.removeLayer(waterLayer);
const resolutionOptions=document.querySelector('#resolutionOptions');
D.meta.cluster_levels.forEach((count,index)=>{if(!visibleLevelIndices.includes(index))return;const button=document.createElement('button');button.type='button';button.textContent=count;button.dataset.index=index;button.setAttribute('aria-label',`${count} neighbourhoods`);resolutionOptions.appendChild(button)});
function setResolution(index){levelIndex=index;clusterCount=D.meta.cluster_levels[levelIndex];document.querySelector('#resolutionValue').textContent=clusterCount;document.querySelector('#clusterCount').textContent=clusterCount;resolutionOptions.querySelectorAll('button').forEach(button=>{const active=Number(button.dataset.index)===levelIndex;button.classList.toggle('active',active);button.setAttribute('aria-pressed',active)});if(selectedProperties){selectedTerritory=territory(selectedProperties);showSelection(selectedProperties)}cells.setStyle(cellStyle);}
resolutionOptions.onclick=e=>{const button=e.target.closest('button');if(button)setResolution(Number(button.dataset.index))};
setResolution(levelIndex);
document.querySelector('#cellCount').textContent=D.meta.street_blocks.toLocaleString();
document.querySelector('#clusterCount').textContent=clusterCount;
document.querySelector('#roadCount').textContent=Math.round(D.meta.source_records.street_ways/1000)+'k';
const dialog=document.querySelector('#about');document.querySelector('#aboutBtn').onclick=()=>dialog.showModal();document.querySelector('.close').onclick=()=>dialog.close();
try{const introKey='lahore-neighbourhoods-intro-seen-v1';if(!localStorage.getItem(introKey)){dialog.showModal();localStorage.setItem(introKey,'1')}}catch{if(!dialog.open)dialog.showModal()}
loading.classList.add('loaded');
}).catch(error=>{console.error(error);loading.classList.add('error');loadingMessage.textContent='The map could not load. Please refresh and try again.'});
