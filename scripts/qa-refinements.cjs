const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});await p.goto(process.env.QA_URL||'http://127.0.0.1:4175/',{waitUntil:'networkidle'});
for(const [width,height] of [[1920,1080],[1600,900],[1440,900],[1366,768],[1280,640],[768,1024],[390,844],[320,568]]){
 await p.setViewportSize({width,height});
 const sizes=await p.locator('.chapter-title').evaluateAll(es=>es.map(e=>getComputedStyle(e).fontSize));assert.equal(sizes.length,11);assert.equal(new Set(sizes).size,1,`${width} chapter headings`);
 const families=await p.locator('.chapter-title').evaluateAll(es=>es.map(e=>getComputedStyle(e).fontFamily));assert.equal(new Set(families).size,1);
 const overflow=await p.locator('.chapter-title').evaluateAll(es=>es.filter(e=>{const r=document.createRange();r.selectNodeContents(e);const t=r.getBoundingClientRect(),s=e.closest('.viewport-section').getBoundingClientRect();return t.left<s.left||t.right>s.right;}).map(e=>e.textContent));assert.deepEqual(overflow,[]);
 const ends=await p.locator('.bookend-title').evaluateAll(es=>es.map(e=>getComputedStyle(e).fontSize));assert.equal(ends[0],ends[1]);assert.ok(parseFloat(ends[0])>parseFloat(sizes[0]));
 if(width>1000){const heights=await p.locator('#contact,#global,#smartcook').evaluateAll(es=>es.map(e=>({id:e.id,height:e.offsetHeight})));console.log(width,heights);assert.ok(heights.every(e=>e.height<=height-72+1));}
}
await p.setViewportSize({width:1440,height:900});
 const counter=await p.locator('.app-story-count').evaluate(e=>{const a=e.getBoundingClientRect(),b=e.closest('.app-story-frame').getBoundingClientRect();return a.top-b.top<30&&b.right-a.right<40});assert.equal(counter,true);
 assert.equal(await p.locator('.partner-form').getAttribute('data-email'),'info@demiand.com');
 await p.locator('.production-video').click();assert.equal(await p.locator('#production-dialog').evaluate(e=>e.open),true);assert.equal(await p.locator('#production-dialog video').getAttribute('src'),null);await p.keyboard.press('Escape');assert.equal(await p.locator('#production-dialog').evaluate(e=>e.open),false);assert.equal(await p.evaluate(()=>document.activeElement.className),'production-video');
await p.locator('.production-video').click();await p.locator('.film-close').click();await p.locator('body:not(.film-open)').waitFor({state:'attached'});assert.equal(await p.locator('body').evaluate(e=>e.classList.contains('film-open')),false);
await p.locator('.production-video').click();await p.mouse.click(2,2);assert.equal(await p.locator('#production-dialog').evaluate(e=>e.open),false);
console.log('PASS heading parity, compact chapters, modal keyboard/backdrop/focus');await b.close();})().catch(e=>{console.error(e);process.exit(1)});
