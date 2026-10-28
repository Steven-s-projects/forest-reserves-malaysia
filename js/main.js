"use strict";
const chartDefs = [
 ["chart1","01_national_trend.json"], ["chart13","02_regional_composition.json"],
 ["chart8","03_change_contribution.json"], ["chart2","04_state_coverage_map.json"],
 ["chart6","05_state_endpoint_change.json"], ["chart9","06_reserve_per_resident.json"],
 ["chart7","07_reserve_population_shares.json"], ["chart5","08_flood_heatmap.json"],
 ["chart11","09_district_flood_map.json"], ["chart15","10_rainfall_flood_context.json"]
];
const stateViews = [], allViews = [];
let stateData = [];
const select = document.getElementById("state-focus");
const num = (n,d=0) => Number(n).toLocaleString("en-GB",{maximumFractionDigits:d,minimumFractionDigits:d});
function drawTable() {
 const rows = stateData.filter(r => select.value === "All states" || r.state === select.value);
 const body = document.getElementById("state-data"); body.replaceChildren();
 for (const row of rows) {
  const tr = document.createElement("tr");
  for (const value of [row.state,num(row.area),num(row.pop),num(row.per1000,2),num(row.forest_share,2),num(row.population_share,2)]) {
   const td = document.createElement("td"); td.textContent = value; tr.appendChild(td);
  }
  body.appendChild(tr);
 }
}
async function focusState() {
 await Promise.all(stateViews.map(v => v.signal("stateFocus",select.value).runAsync()));
 document.getElementById("focus-status").textContent = select.value === "All states" ? "All available states shown." : `${select.value} highlighted; other states remain for context.`;
 drawTable();
}
select.addEventListener("change",focusState);
document.getElementById("reset-focus").addEventListener("click",()=>{select.value="All states";focusState();});
document.getElementById("download-data").addEventListener("click",()=>{
 const headers=["state","area","pop","per1000","forest_share","population_share"];
 const rows=stateData.filter(r=>select.value==="All states"||r.state===select.value);
 const csv=[headers.join(","),...rows.map(r=>headers.map(k=>JSON.stringify(r[k])).join(","))].join(String.fromCharCode(13,10));
 const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
 const a=document.createElement("a");a.href=url;a.download="reserve-population-2021.csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
async function loadChart([id,path]) {
 const el=document.getElementById(id);
 try {
  const response=await fetch(`vega/${path}`); if(!response.ok)throw new Error(`HTTP ${response.status}`);
  const spec=await response.json();
  if(window.innerWidth<600) {
   spec.config.axis.labelFontSize=9; spec.config.axis.titleFontSize=10;
   spec.config.legend.labelFontSize=9;
   if(id==="chart2")spec.height=225;
   if(id==="chart11")spec.height=350;
  }
  el.replaceChildren();
  const {view}=await vegaEmbed(el,spec,{actions:false,renderer:"svg"});
  allViews.push({view,el});
  if(spec.params?.some(p=>p.name==="stateFocus")){stateViews.push(view);await view.signal("stateFocus",select.value).runAsync();}
  if(id==="chart2")view.addEventListener("click",(event,item)=>{const state=item?.datum?.state_join;if(stateData.some(r=>r.state===state)){select.value=state;focusState();}});
  el.dataset.loaded="true";
 } catch(error) {
  el.replaceChildren();const note=document.createElement("p");note.className="error";note.textContent="This chart could not load. Serve this folder with a local HTTP server and check the file paths. The data table and notes provide an alternative.";el.appendChild(note);
  console.error(id,error);el.dataset.loaded="error";
 }
}
async function init() {
 try {
  const response=await fetch("data/derived/population_comparison.json");if(!response.ok)throw new Error("Data unavailable");stateData=await response.json();
  for(const state of stateData.map(r=>r.state).sort()){const option=document.createElement("option");option.textContent=state;select.appendChild(option);}drawTable();
 }catch(e){document.getElementById("focus-status").textContent="Data unavailable. Open this page through a local HTTP server.";console.error(e);}
 await Promise.all(chartDefs.map(loadChart));
 window.dashboardReady=true;
 const resize=new ResizeObserver(entries=>{for(const entry of entries){const item=allViews.find(x=>x.el===entry.target);if(item)item.view.resize().runAsync();}});
 allViews.forEach(x=>resize.observe(x.el));
 const navObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){document.querySelectorAll(".chapter-nav a").forEach(a=>a.classList.toggle("active",a.hash===`#${entry.target.id}`));}},{rootMargin:"-10% 0px -65% 0px"});
 document.querySelectorAll(".chapter").forEach(section=>navObserver.observe(section));
}
init();
