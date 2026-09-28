const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const output = process.env.QA_OUTPUT || '/tmp/demiand-marketing-qa';
fs.mkdirSync(output, {recursive:true});
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ reducedMotion:'reduce' });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(process.env.QA_URL || 'http://127.0.0.1:4175/', {waitUntil:'networkidle'});
  await page.evaluate(() => document.fonts.ready);
  for (const [width,height] of [[1366,768],[1440,900],[1920,1080],[1280,640],[768,1024],[390,844],[320,568]]) {
    await page.setViewportSize({width,height});
    await page.locator('#marketing').evaluate(e => e.scrollIntoView({behavior:'instant'}));
    const frame = await page.locator('.marketing-screen').boundingBox();
    assert(Math.abs(frame.width / frame.height - 9 / 16) < .01, 'Video frame must stay 9:16');
    const section = await page.locator('#marketing').boundingBox();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Page overflow');
    if (width >= 1001) assert(section.height <= height - 72 + 1, `Marketing section exceeds available viewport: ${section.height}`);
    for (let i = 0; i < 4; i++) {
      await page.locator('.marketing-pagination button').nth(i).click();
      assert.equal(await page.locator('[data-marketing-slide]:visible').count(),1);
      assert.equal(await page.locator('.marketing-pagination [aria-current=true]').textContent(),`0${i+1}`);
      const updated = await page.locator('.marketing-screen').boundingBox();
      assert.equal(updated.height,frame.height);
      assert.equal((await page.locator('#marketing').boundingBox()).height,section.height);
      const overflow = await page.locator('[data-marketing-slide]:visible .marketing-video-metrics').evaluate(e => e.scrollWidth > e.clientWidth + 1);
      assert.equal(overflow,false,'Metric badges overflow');
      if (width === 1366) await page.locator('#marketing').screenshot({path:`${output}/video-${i+1}.png`,style:'.nav{visibility:hidden}'});
    }
    await page.locator('.marketing-carousel').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('.marketing-pagination [aria-current=true]').textContent(),'01');
    await page.keyboard.press('End');
    assert.equal(await page.locator('.marketing-pagination [aria-current=true]').textContent(),'04');
    await page.keyboard.press('Home');
    await page.locator('.marketing-carousel').evaluate(e => e.blur());
    await page.locator('#marketing').screenshot({path:`${output}/marketing-${width}.png`,style:'.nav{visibility:hidden}'});
    console.log(`PASS ${width}×${height}: section ${Math.round(section.height)}px; stable frame, all four slides, keyboard, no horizontal overflow`);
  }
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('.marketing-next').click();
  await page.waitForTimeout(450);
  assert.equal(await page.locator('[data-marketing-slide]:visible').count(),1);
  await page.emulateMedia({reducedMotion:'reduce'});
  const values = await page.locator('.marketing-video-metrics').allTextContents();
  assert.deepEqual(values,['17.2Klikes17.4Mviews','243Klikes17Mviews','283Klikes15Mviews','197Klikes16.7Mviews']);
  assert.deepEqual(errors,[]);
  await browser.close();
  console.log('PASS supplied metrics, motion toggle and clean JavaScript console');
})().catch(e => { console.error(e); process.exit(1); });
