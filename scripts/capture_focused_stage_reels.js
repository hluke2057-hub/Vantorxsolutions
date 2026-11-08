const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1200 });

  const reelUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'demo', 'reel-creator.html').replace(/\\/g, '/');
  console.log('Navigating to:', reelUrl);
  await page.goto(reelUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Capture Fresh Load WITH the Play Overlay
  const stageInit = await page.$('.video-stage-column');
  if (stageInit) {
    await stageInit.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_fresh_load_stage_overlay.png') });
    console.log('📸 Captured verified_fresh_load_stage_overlay.png');
  }

  // Hide the play overlay to capture live animation frames
  await page.evaluate(() => {
    const ov = document.getElementById('reelPlayOverlay');
    if (ov) ov.style.display = 'none';
  });

  const scenes = [
    { name: 'verified_focused_t0_laser.png', time: 0.1, story: 0 },
    { name: 'verified_focused_contractor_ladder.png', time: 28.5, story: 0 },
    { name: 'verified_focused_competitor_cash.png', time: 33.5, story: 0 },
    { name: 'verified_focused_ava_heroine.png', time: 37.5, story: 0 },
    { name: 'verified_focused_stat_78_slam.png', time: 19.5, story: 0 },
    { name: 'verified_focused_f1_pitstop.png', time: 2.5, story: 2 },
    { name: 'verified_focused_falcon_dive.png', time: 6.0, story: 1 },
    { name: 'verified_focused_lightning.png', time: 6.0, story: 5 },
    { name: 'verified_focused_saturn_rocket.png', time: 6.0, story: 4 }
  ];

  for (const s of scenes) {
    await page.evaluate((sc) => {
      buildReelAssetsForProduct(window.PRODUCTS_MIND_QUEUE[sc.story]);
      currentTime = sc.time;
      renderFrame(sc.time);
    }, s);
    await new Promise(r => setTimeout(r, 200));

    const stageEl = await page.$('.video-stage-column');
    if (stageEl) {
      await stageEl.screenshot({ path: path.join(ARTIFACTS_DIR, s.name) });
      console.log('📸 Captured', s.name);
    }
  }

  await browser.close();
  console.log('🎉 All focused stage reels captured successfully!');
})();
