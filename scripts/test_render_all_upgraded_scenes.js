const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });

  const reelUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'demo', 'reel-creator.html').replace(/\\/g, '/');
  console.log('Loading reel-creator.html:', reelUrl);
  await page.goto(reelUrl, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Falcon Dive (Story 2) at 6.0s (vertical stoop dive HUD)
  console.log('Rendering Falcon Dive at 6.0s...');
  await page.evaluate(() => {
    window.selectDailySlot('evening');
    currentTime = 6.0;
    renderFrame(6.0);
  });
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_upgraded_falcon_dive.png') });

  // 2. F1 Car in Pit Box (Story 3) at 2.5s
  console.log('Rendering F1 Car at 2.5s...');
  await page.evaluate(() => {
    buildReelAssetsForProduct(window.PRODUCTS_MIND_QUEUE[2]); // mobile_web_f1
    currentTime = 2.5;
    renderFrame(2.5);
  });
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_upgraded_f1_car.png') });

  // 3. Lightning Storm (Story 6) at 2.5s
  console.log('Rendering Lightning at 2.5s...');
  await page.evaluate(() => {
    buildReelAssetsForProduct(window.PRODUCTS_MIND_QUEUE[5]); // voice_ai_lightning
    currentTime = 2.5;
    renderFrame(2.5);
  });
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_upgraded_lightning.png') });

  // 4. Scene 5: Stat 78% Slam at 19.5s
  console.log('Rendering 78% Slam at 19.5s...');
  await page.evaluate(() => {
    currentTime = 19.5;
    renderFrame(19.5);
  });
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_upgraded_stat_78_slam.png') });

  // 5. Scene 7: Contractor on Ladder with Hard Hat & Pipe Wrench at 28.5s
  console.log('Rendering Contractor on Ladder at 28.5s...');
  await page.evaluate(() => {
    currentTime = 28.5;
    renderFrame(28.5);
  });
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_upgraded_contractor_ladder.png') });

  // 6. Scene 8: Competitor with Cash Sack & Fluttering Dollar Bills at 33.5s
  console.log('Rendering Competitor Cash Thief at 33.5s...');
  await page.evaluate(() => {
    currentTime = 33.5;
    renderFrame(33.5);
  });
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_upgraded_competitor_cash.png') });

  // 7. Scene 9: Ava Heroine with Illuminated Headset & Voice Waveform at 37.5s
  console.log('Rendering Ava Heroine at 37.5s...');
  await page.evaluate(() => {
    currentTime = 37.5;
    renderFrame(37.5);
  });
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_upgraded_ava_heroine.png') });

  // 8. Scene 14: Live Demo Call at 56.0s
  console.log('Rendering Live Demo Call at 56.0s...');
  await page.evaluate(() => {
    currentTime = 56.0;
    renderFrame(56.0);
  });
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_upgraded_live_demo_call.png') });

  await browser.close();
  console.log('🎉 All upgraded scenes rendered and captured successfully!');
})();
