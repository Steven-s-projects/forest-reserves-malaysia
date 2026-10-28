/* Run after starting a local HTTP server at port 8765.
   Requires Playwright and installed Edge. Set NODE_PATH if Playwright is not local. */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),os=require('os'),assert=require('assert');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const browser=await chromium.launch({channel:'msedge',headless:process.env.SHOW_BROWSER!=='1'});
 const results={viewports:[],interactions:[],compileWarnings:[],consoleMessages:[],pageErrors:[]};
 for(const width of [1440,768,390]){
  const page=await browser.newPage({viewport:{width,height:950},acceptDownloads:true});
  page.on('pageerror',e=>results.pageErrors.push(e.message));
  page.on('console',m=>{if(['warning','error'].includes(m.type()))results.consoleMessages.push({width,type:m.type(),text:m.text()})});
  await page.goto('http://127.0.0.1:8765/');await page.waitForFunction(()=>window.dashboardReady,{timeout:60000});
  assert.equal(await page.locator('[data-loaded="true"]').count(),10);
  assert.equal(await page.locator('[data-loaded="error"]').count(),0);
  const dimensions=await page.evaluate(()=>({viewport:innerWidth,content:document.documentElement.scrollWidth}));
  assert(dimensions.content<=dimensions.viewport,'Page has horizontal overflow');
  const clips=await page.locator('.chart-box').evaluateAll(es=>es.filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>({id:e.id,content:e.scrollWidth,width:e.clientWidth})));
  assert.equal(clips.length,0,'A chart overflows its container');
  results.viewports.push({...dimensions,charts:10,chartOverflow:clips});
  if(width===1440){
   results.compileWarnings=await page.evaluate(async()=>{let found=[];for(const [id,name] of chartDefs){const logger=vega.logger(vega.Warn);logger.warn=(...args)=>found.push({id,message:args.join(' ')});const spec=await(await fetch('vega/'+name)).json();vegaLite.compile(spec,{logger});}return found});
   console.log('Compiler review:',results.compileWarnings);assert.equal(results.compileWarnings.length,0,'Vega-Lite compiler warning');
   await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.className),'skip');results.interactions.push('Keyboard skip link');
   await page.selectOption('#state-focus','Sarawak');await page.waitForFunction(()=>document.querySelectorAll('#state-data tr').length===1);
   assert((await page.locator('#state-data').textContent()).includes('3,964,880'));
   assert(await page.evaluate(()=>stateViews.every(v=>v.signal('stateFocus')==='Sarawak')));results.interactions.push('State focus updates all five linked charts and exact-value table');
   await page.locator('.data-details summary').click();
   const downloadPromise=page.waitForEvent('download');await page.locator('#download-data').click();const download=await downloadPromise;
   const downloaded=await download.path();const csv=fs.readFileSync(downloaded,'utf8');assert.equal(csv.split('\r\n').length,2);assert(csv.includes('Sarawak'));results.interactions.push('CSV export: header and selected record');
   await page.locator('#reset-focus').click();await page.waitForFunction(()=>document.querySelectorAll('#state-data tr').length===14);results.interactions.push('Reset restores 14 rows');
   await page.locator('.data-details summary').click();
   await page.locator('#chart6 select').selectOption('Hectares');await page.waitForTimeout(120);assert((await page.locator('#chart6').textContent()).includes('reserve area (ha)'));results.interactions.push('Percentage/hectare toggle updates axis unit');
   await page.locator('#chart6 select').selectOption('Percent');
   await page.locator('#chart11 select').selectOption('Pahang');await page.waitForTimeout(120);results.interactions.push('District map state selection');await page.locator('#chart11 select').selectOption('All five states');
   await page.locator('#chart15 select').selectOption('Johor');await page.waitForTimeout(120);results.interactions.push('Rainfall state selection');await page.locator('#chart15 select').selectOption('Pahang');
   const mapPath=page.locator('#chart2 path[aria-label*="Sabah"]');if(await mapPath.count()){
    await mapPath.first().click();await page.waitForFunction(()=>document.querySelector('#state-focus').value==='Sabah');results.interactions.push('Map click updates state selector');await page.locator('#reset-focus').click();
   }
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(root,'docs/screenshots/desktop-full.png'),fullPage:true});
   for(const [id,name] of [['chart13','regional-composition'],['chart2','state-map'],['chart15','rainfall-context']]){await page.locator('#'+id).locator('..').screenshot({path:path.join(root,'docs/screenshots',name+'.png')})}
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(root,'docs/screenshots/desktop-preview.png')});
  } else if(width===390){await page.screenshot({path:path.join(root,'docs/screenshots/mobile-full.png'),fullPage:true});await page.screenshot({path:path.join(root,'docs/screenshots/mobile-preview.png')});}
  if(process.env.SHOW_BROWSER==='1')await page.waitForTimeout(1500);
  await page.close();
 }
 // Reload/resizing must also keep the already loaded chart containers usable.
 const page=await browser.newPage({viewport:{width:1440,height:950}});await page.goto('http://127.0.0.1:8765/');await page.waitForFunction(()=>window.dashboardReady);await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));results.interactions.push('Desktop-to-mobile live resize');await page.close();
 assert.equal(results.pageErrors.length,0);assert.equal(results.consoleMessages.length,0);
 results.status='passed';fs.writeFileSync(path.join(root,'docs/browser-validation.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
