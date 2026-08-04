window.BASELINE_READY=(async()=>{
  const response=await fetch('data/mobility.json.gz?v=31',{cache:'reload'});
  if(!response.ok) throw new Error(`Dataset failed to load: ${response.status}`);
  const stream=response.body.pipeThrough(new DecompressionStream('gzip'));
  window.LAHORE_BASELINE=JSON.parse(await new Response(stream).text());
  window.LAHORE_TERRITORY_PLACES=null;
  const placeResponse=await fetch('data/territory-places.json?v=1',{cache:'reload'});
  if(placeResponse.ok) window.LAHORE_TERRITORY_PLACES=await placeResponse.json();
  window.STRUCTURE_REGION='lahore';
})();
