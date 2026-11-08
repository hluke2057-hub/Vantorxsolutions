const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1100 });

  const errors = [];
  page.on('console', msg => console.log('LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => {
    console.error('ERROR ON PAGE:', err.message, err.stack);
    errors.push(err);
  });

  const url = 'file:///' + path.resolve(__dirname, '..', 'website', 'demo', 'reel-creator.html').replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Let's test calling renderFrame manually for all times from 0 to 60 in 1-second steps
  console.log('Testing renderFrame across 60 seconds...');
  const renderTest = await page.evaluate(() => {
    const results = [];
    for (let t = 0; t <= 63; t += 1) {
      try {
        window.renderFrame(t);
        results.push({ t, ok: true });
      } catch (e) {
        results.push({ t, ok: false, error: e.message, stack: e.stack });
      }
    }
    return results;
  });

  const failures = renderTest.filter(r => !r.ok);
  console.log('Render failures:', failures.length);
  if (failures.length > 0) {
    console.log('FAILURES:', JSON.stringify(failures, null, 2));
  } else {
    console.log('All 64 frames rendered without throwing JS error.');
  }

  // Now test all 7 story types
  const storyTypes = ['cosmic_light', 'falcon_dive', 'f1_pitstop', 'brain_ai', 'saturn_rocket', 'lightning_strike', 'niagara_torrent'];
  for (const st of storyTypes) {
    const storyTest = await page.evaluate((type) => {
      try {
        window.ACTIVE_STORY = { storyType: type };
        window.renderFrame(2.0);
        window.renderFrame(6.0);
        window.renderFrame(10.0);
        return { type, ok: true };
      } catch(e) {
        return { type, ok: false, error: e.message };
      }
    }, st);
    console.log('Story test:', storyTest);
  }

  await browser.close();
})();
