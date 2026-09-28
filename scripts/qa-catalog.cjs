const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const output = process.env.QA_OUTPUT || '/tmp/demiand-catalog-qa';
fs.mkdirSync(output, {recursive:true});
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({reducedMotion:'reduce'});
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(process.env.QA_URL || 'http://127.0.0.1:4175/', {waitUntil:'networkidle'});
  await page.evaluate(() => document.fonts.ready);
  for (const [width,height] of [[1366,768],[1440,900],[1920,1080],[390,844],[320,568]]) {
    await page.setViewportSize({width,height});
    await page.locator('#portfolio').evaluate(e => e.scrollIntoView({behavior:'instant'}));
    for (let category = 0; category < 3; category++) {
      await page.locator('.product-card').nth(category).click();
      await page.locator('.catalog-card img').evaluateAll(es => Promise.all(es.map(e => e.decode())));
      assert.equal(await page.locator('.catalog-card').count(), [8,3,2][category]);
      assert.equal(await page.locator('.catalog-ladder,.catalog-recommended,.catalog-commercial,.is-recommended').count(), 0);
      const sizes = await page.locator('.catalog-card').evaluateAll(es => es.map(e => {
        const card = e.getBoundingClientRect(), image = e.querySelector('.catalog-image').getBoundingClientRect();
        return {height:card.height,image:image.height,width:card.width,children:e.children.length};
      }));
      assert(sizes.every(s => Math.abs(s.height-sizes[0].height)<1 && Math.abs(s.image-sizes[0].image)<1 && Math.abs(s.width-sizes[0].width)<1 && s.children===3), 'All cards must share the same dimensions and structure');
      assert(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth), 'Page overflow');
      const rail = page.locator('.catalog-rail');
      if (category === 0) {
        await page.locator('#portfolio').screenshot({path:`${output}/air-fryers-${width}.png`,style:'.nav{visibility:hidden}'});
        await page.locator('.catalog-next').click();
        assert(await rail.evaluate(e => e.scrollLeft>0));
        await page.locator('.catalog-prev').click();
      }
      await rail.focus(); await page.keyboard.press('End');
      await page.waitForTimeout(100);
      const last = page.locator('.catalog-card').last();
      const swatches = last.locator('.catalog-swatches button');
      for (let i=0; i<await swatches.count(); i++) {
        await swatches.nth(i).click();
        assert.equal(await swatches.nth(i).getAttribute('aria-pressed'),'true');
      }
      if (category === 0 && width === 1366) await page.locator('#portfolio').screenshot({path:`${output}/air-fryers-last.png`,style:'.nav{visibility:hidden}'});
      await page.locator('.catalog-back').click();
      assert.equal(await page.locator('.products').isVisible(),true);
    }
    console.log(`PASS ${width}×${height}: uniform cards, all 13 models, all categories, arrows, keyboard and color options`);
  }
  assert.deepEqual(errors,[]);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
