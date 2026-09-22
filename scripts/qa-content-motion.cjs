/* Structural, responsive navigation and entrance regression checks. No dependencies added. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const viewports=[[1366,768],[1440,900],[1600,900],[1920,1080],[768,1024],[390,844],[320,568]];
(async()=>{
 const browser=await chromium.launch();
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];
 page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(process.env.QA_URL||'http://127.0.0.1:4175/',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 const chapters=await page.locator('[data-section]').evaluateAll(es=>es.map(e=>({id:e.id,number:e.dataset.section})));
 const menu=await page.locator('.section-menu-grid a').evaluateAll(es=>es.map(e=>({id:e.hash.slice(1),number:e.querySelector('b').textContent})));
 assert.deepEqual(menu,chapters);
 assert.equal(chapters.length,13);
 assert.equal(await page.locator('#commercial,[href="#commercial"],.manufacturing-proof-rail,[data-clone],script[src*="viewport-layout"]').count(),0);
 assert.equal(await page.locator('#manufacturing-proof img').count(),0);
 assert.equal(await page.locator('.validation-pipeline > li').count(),4);
 assert.match(await page.locator('.warranty-statement').textContent(),/1-YEAR WARRANTY<0.87%DEFECT RATE · INTERNAL STATISTICS/);
 assert.match(await page.locator('.warranty-copy').textContent(),/including compensation where applicable/);
 assert.match(await page.locator('.warranty-copy').textContent(),/Quality Assurance team/);
 assert.equal(await page.locator('#contact .contact-intro').evaluate(e=>e.classList.contains('visible')),false);
 // Native wheel scrolling must still move the document.
 await page.bringToFront();await page.mouse.move(20,500);await page.mouse.wheel(0,250);
 await page.waitForFunction(()=>scrollY>0,{},{timeout:5000});
 for(const {id} of chapters){
  const section=page.locator('#'+id);
  await section.evaluate(e=>e.scrollIntoView({behavior:'instant'}));
  await page.waitForTimeout(1800);
  const missed=await section.locator('.reveal').evaluateAll(es=>es.filter(e=>{
   const r=e.getBoundingClientRect();return r.width&&r.top<innerHeight*.95&&r.bottom>72&&getComputedStyle(e).opacity!=='1';
  }).map(e=>e.className));
  assert.deepEqual(missed,[],`${id}: visible chapter content`);
  if(id!=='hero')assert.ok(await section.locator('[data-reveal]').count()>0,id);
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.reveal:not(.visible)').count(),0);
 assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
 for(const [width,height] of viewports){
  await page.setViewportSize({width,height});
  await page.locator('#hero').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
  const compact=await page.locator('.menu-toggle').isVisible();
  if(compact)await page.locator('.menu-toggle').click();
  await page.locator('.nav-sections').focus();await page.keyboard.press('ArrowDown');
  await page.waitForFunction(()=>document.activeElement.hash==='#hero');
  assert.equal(await page.evaluate(()=>document.activeElement.hash),'#hero');
  await page.keyboard.press('End');assert.equal(await page.evaluate(()=>document.activeElement.hash),'#contact');
  const linksFit=await page.locator('.section-menu-grid a').evaluateAll(es=>es.every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.height>0;}));
  assert.equal(linksFit,true,`${width}: More menu width`);
  await page.locator('.section-menu-grid a[href="#manufacturing-proof"]').click();
  assert.equal(await page.locator('.nav-sections').getAttribute('aria-expanded'),'false');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'manufacturing-proof');
  for(const id of ['manufacturing-proof','after-sales']){
   const section=page.locator('#'+id);await section.evaluate(e=>e.scrollIntoView({behavior:'instant'}));
   const clipped=await section.evaluate(s=>{
    const r=s.getBoundingClientRect();return [...s.querySelectorAll('h2,h3,p,li,strong')].filter(e=>{const a=e.getBoundingClientRect();return a.width&&(a.left<r.left-1||a.right>r.right+1||a.bottom>r.bottom+1);}).map(e=>e.textContent);
   });assert.deepEqual(clipped,[],`${width}: ${id} bounds`);
  }
  const stages=await page.locator('.validation-pipeline li').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y};}));
  assert.equal(stages.every((r,i)=>i===0||(width>900?r.x>stages[i-1].x&&r.y===stages[i-1].y:r.y>stages[i-1].y&&r.x===stages[i-1].x)),true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${width}: page overflow`);
  console.log('PASS responsive navigation and content',width,height);
 }
 assert.equal(await page.locator('.chapter-surface').count(),0);
 assert.deepEqual(errors,[]);
 console.log('PASS 13 chapter/menu pairs, cooking sequence, warranty, native scroll, entrances, reduced motion, clean console');
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
