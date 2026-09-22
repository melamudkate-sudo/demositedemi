/* Browser regression checks. Supply PLAYWRIGHT_MODULE when using a shared runtime. */
const { chromium, webkit } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.QA_URL || 'http://127.0.0.1:4175/';
const output = process.env.QA_OUTPUT || '/tmp/demiand-final-qa';
fs.mkdirSync(output,{recursive:true});
const viewports = process.env.QA_VIEWPORTS ? JSON.parse(process.env.QA_VIEWPORTS) : [[1920,1080],[1600,900],[1440,900],[1366,768],[1280,720],[1280,640],[768,1024],[390,844],[320,568]];
(async()=>{
 const browser=await (process.env.QA_ENGINE === 'webkit' ? webkit : chromium).launch();
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 const page=await context.newPage();const errors=[], missing=[], results=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)missing.push(`${r.status()} ${r.url()}`)});
 await page.goto(base,{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 const numbers=await page.locator('[data-section]').evaluateAll(es=>es.map(e=>e.dataset.section));
 assert.deepEqual(numbers,Array.from({length:13},(_,i)=>String(i+1).padStart(2,'0')));
 assert.equal(await page.locator('.section-menu-grid a').count(),13);
 assert.equal(await page.locator('.section-menu-head button').count(),0);
 const jump=async id=>{await page.locator('#'+id).evaluate(e=>e.scrollIntoView({behavior:'instant'}));await page.waitForTimeout(100)};
 const shots=async name=>page.screenshot({path:path.join(output,name+'.png')});
 // Keyboard focus after removing Close, wrap, Escape, outside click and item click.
 await page.locator('.nav-sections').focus();await page.keyboard.press('ArrowDown');await page.waitForTimeout(50);
 assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('href')),'#hero');
 await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('href')),'#contact');
 await page.keyboard.press('Home');assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('href')),'#hero');
 await page.keyboard.press('End');assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('href')),'#contact');
 await shots('menu');await page.keyboard.press('Escape');
 assert.equal(await page.locator('.nav-sections').getAttribute('aria-expanded'),'false');
 assert.equal(await page.evaluate(()=>document.activeElement.className),'nav-sections');
 await page.locator('.nav-sections').click();await page.mouse.click(12,500);
 assert.equal(await page.locator('.nav-sections').getAttribute('aria-expanded'),'false');
 await page.locator('.nav-sections').click();await page.locator('.section-menu-grid a[href="#manufacturing-proof"]').click();
 assert.equal(await page.locator('.nav-sections').getAttribute('aria-expanded'),'false');
 assert.equal(await page.evaluate(()=>document.activeElement.id),'manufacturing-proof');
 // All catalogue categories and all four color choices where supplied.
 await jump('portfolio');
 for(let c=0;c<3;c++){
  await page.locator('.product-card').nth(c).click();await page.waitForTimeout(80);
  assert.equal(await page.locator('.catalog-card').count(),[8,3,2][c]);
  const choices=page.locator('.catalog-card').first().locator('.catalog-swatches button');
  for(let i=0;i<await choices.count();i++){await choices.nth(i).click();assert.equal(await choices.nth(i).getAttribute('aria-pressed'),'true')}
  if(await page.locator('.catalog-next').isEnabled()){await page.locator('.catalog-next').click();await page.waitForTimeout(60);await page.locator('.catalog-prev').click();}
  await page.locator('.catalog-back').click();
 }
 await jump('potential');
 for(let i=0;i<4;i++){
  await page.locator('.market-tabs button').nth(i).click();
  assert.equal(await page.locator('.market-panels article:not([hidden])').count(),1);
  assert.equal(await page.locator('.market-tabs button').nth(i).getAttribute('aria-selected'),'true');
 }
 await page.locator('.market-tabs button').last().focus();await page.keyboard.press('ArrowRight');
 assert.equal(await page.locator('.market-tabs button').first().getAttribute('aria-selected'),'true');
 // Every slide at every requested viewport, plus baseline tablet/mobile.
 for(const [width,height] of viewports){
  await page.setViewportSize({width,height});await page.waitForTimeout(100);
  const layout=await page.evaluate(()=>({horizontal:document.documentElement.scrollWidth>innerWidth,sections:[...document.querySelectorAll('.viewport-section')].map(s=>({id:s.id,height:s.getBoundingClientRect().height}))}));
  assert.equal(layout.horizontal,false,`${width} page overflow`);
  if(width>1000)for(const s of layout.sections)assert.ok(s.height<=(s.id==='hero'?height:height-72)+1,`${width} ${s.id} height ${s.height}`);
  for(const id of ['hero','portfolio','potential','advantages','demand','manufacturing-proof','technology','manufacturing','after-sales','global','terms','contact']){
   await jump(id);
   const clipped=await page.locator('#'+id).evaluate(s=>{
    const r=s.getBoundingClientRect();return [...s.querySelectorAll('h1,h2,h3,p,li,dt,dd,.contact-bottom')].filter(e=>!e.closest('[hidden],[data-clone],details:not([open]),.catalog-rail')).filter(e=>{const t=e.getBoundingClientRect();return t.width&&t.height&&(t.top<r.top-2||t.bottom>r.bottom+2)}).map(e=>e.textContent.slice(0,50));
   });assert.deepEqual(clipped,[],`${width} ${id} bounds`);
   if(width===1440)await shots(`section-${id}`);
  }
  await jump('smartcook');
  for(let i=0;i<9;i++){
   await page.locator('.app-story-pagination button').nth(i).click();
   await page.locator('.app-slide:not([hidden]) img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));
   await page.waitForTimeout(60);
   const audit=await page.evaluate(()=>{
    const s=document.querySelector('.app-slide:not([hidden])'),section=s.closest('section'),frame=document.querySelector('.app-story-frame');
    const r=s.getBoundingClientRect(),b=frame.getBoundingClientRect(),sr=section.getBoundingClientRect();
    const nodes=[...s.querySelectorAll('h2,h3,p,li,blockquote,.app-intelligence-level,.app-mockup img,.app-overview-group img')];
    const out=nodes.filter(e=>{const t=e.getBoundingClientRect();return t.width&&t.height&&(t.top<r.top-2||t.bottom>r.bottom+2||t.left<r.left-2||t.right>r.right+2)}).map(e=>e.className||e.tagName);
    const prev=document.querySelector('.app-story-prev').getBoundingClientRect(),next=document.querySelector('.app-story-next').getBoundingClientRect();
    return {out,arrows:prev.right<b.left&&next.left>b.right,controls:prev.top>=sr.top&&next.bottom<=sr.bottom,visible:document.querySelectorAll('.app-slide:not([hidden])').length,inactive:[...document.querySelectorAll('.app-slide[hidden]')].every(e=>e.inert&&e.getAttribute('aria-hidden')==='true'),images:[...s.querySelectorAll('img')].every(e=>e.complete&&e.naturalWidth&&getComputedStyle(e).objectFit==='contain')};
   });assert.deepEqual(audit.out,[],`${width}x${height} slide ${i+1} bounds`);assert.equal(audit.arrows,true);assert.equal(audit.controls,true);assert.equal(audit.visible,1);assert.equal(audit.inactive,true);assert.equal(audit.images,true);
   if(width===1440||width===1280&&height===640||width===390)await shots(`${width}x${height}-slide-${i+1}`);
  }
  console.log('Viewport PASS',width,height);
  results.push({width,height,sections:13,slides:9,status:'PASS'});
 }
 await page.setViewportSize({width:1440,height:900});await jump('smartcook');
 await page.locator('.app-story-next').click();assert.equal(await page.locator('#smartcook').getAttribute('data-active-slide'),'0');
 await page.locator('.app-story-prev').click();assert.equal(await page.locator('#smartcook').getAttribute('data-active-slide'),'8');
 await page.locator('.app-story-shell').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#smartcook').getAttribute('data-active-slide'),'0');
 const stage=await page.locator('.app-story-stage').boundingBox();
 await page.mouse.move(stage.x+stage.width*.8,stage.y+stage.height/2);await page.mouse.down();await page.mouse.move(stage.x+stage.width*.5,stage.y+stage.height/2,{steps:8});await page.mouse.up();assert.equal(await page.locator('#smartcook').getAttribute('data-active-slide'),'1');
 // Terms stay mutually exclusive. Contact validates, then prepares a draft only.
 await jump('terms');for(const item of await page.locator('.terms-accordion summary').all()){await item.click();assert.ok(await page.locator('.terms-accordion details[open]').count()<=1)}
 await jump('contact');await page.locator('.partner-form button').click();assert.equal(await page.locator('.partner-form').evaluate(e=>e.checkValidity()),false);
 for(const [name,value] of Object.entries({email:'qa@example.com',company:'QA & Review',market:'Test market'}))await page.locator(`[name="${name}"]`).fill(value);
 await page.locator('[name="category"]').selectOption('Air Fryers');await page.locator('.partner-form button').click();assert.match(await page.locator('.form-status').textContent(),/Email request prepared/);
 // Motion tests: no hover pause, clean manual restart, keyboard pause, reduced motion and loop.
 await page.emulateMedia({reducedMotion:'no-preference'});await jump('smartcook');await page.locator('.app-story-pagination button').nth(8).click();await page.mouse.move(700,450);await page.waitForTimeout(6700);
 assert.equal(await page.locator('#smartcook').getAttribute('data-active-slide'),'0','autoplay 09 → 01 while hovered');
 await page.locator('.app-story-next').click();await page.waitForTimeout(3000);assert.equal(await page.locator('#smartcook').getAttribute('data-active-slide'),'1','manual timer restarted');await page.waitForTimeout(3400);assert.equal(await page.locator('#smartcook').getAttribute('data-active-slide'),'2','exactly one timer');
 await page.locator('.app-story-shell').focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(6600);assert.equal(await page.locator('#smartcook').getAttribute('data-active-slide'),'3','keyboard focus pauses autoplay');
 await page.locator('.nav-sections').focus();await page.waitForTimeout(6500);assert.equal(await page.locator('#smartcook').getAttribute('data-active-slide'),'4','focus exit resumes');
 await page.emulateMedia({reducedMotion:'reduce'});const before=await page.locator('#smartcook').getAttribute('data-active-slide');await page.waitForTimeout(6500);assert.equal(await page.locator('#smartcook').getAttribute('data-active-slide'),before);
 await jump('manufacturing-proof');
 assert.equal(await page.locator('.validation-pipeline > li').count(),4);
 assert.equal(await page.locator('#manufacturing-proof img, .manufacturing-proof-rail, [data-clone]').count(),0);
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({engine:process.env.QA_ENGINE||'chromium',viewports:results,errors,missing,interactions:'PASS'},null,2));
 console.log(JSON.stringify({viewports:results,errors,missing,interactions:'PASS'}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
