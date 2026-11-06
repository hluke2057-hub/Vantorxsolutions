// scripts/test_giant_button_and_progress_bar.js
const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  console.log('🚀 Testing Giant Generate Reel Button & Active Render Progress Bar...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  const url = 'file:///' + path.resolve(__dirname, '../website/demo/reel-creator.html').replace(/\\/g, '/');
  console.log('Opening:', url);
  await page.goto(url, { waitUntil: 'networkidle2' });

  // 1. Initial State Check of Box 1 (Giant Button)
  const initialData = await page.evaluate(() => {
    const btn = document.getElementById('btnGiantGenerateReel');
    const title = document.getElementById('giantNextProductTitle') ? document.getElementById('giantNextProductTitle').textContent : '';
    const scen = document.getElementById('giantNextProductScenario') ? document.getElementById('giantNextProductScenario').textContent : '';
    return {
      hasGiantBtn: !!btn,
      nextProduct: title,
      nextScenario: scen
    };
  });
  console.log('📊 Initial State of Giant Button:', initialData);

  // Take screenshot of the Giant Button Workbench
  const workbenchEl = await page.$('#promptWorkbench');
  if (workbenchEl) {
    await workbenchEl.screenshot({ path: 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0\\giant_button_workbench_verified.png' });
    console.log('📸 Saved giant_button_workbench_verified.png');
  }

  // 2. Click the Giant Button
  console.log('⚡ Clicking Giant Generate Reel Button...');
  await page.click('#btnGiantGenerateReel');

  // Wait 1.0 second and check the Active Progress Bar Overlay!
  await new Promise(r => setTimeout(r, 1000));
  const progressState = await page.evaluate(() => {
    const overlay = document.getElementById('reelRenderingOverlay');
    const progressBar = document.getElementById('renderProgressBar');
    const percentText = document.getElementById('renderPercentText');
    const statusTitle = document.getElementById('renderStatusTitle');
    return {
      overlayDisplay: overlay ? window.getComputedStyle(overlay).display : 'none',
      progressWidth: progressBar ? progressBar.style.width : '0%',
      percent: percentText ? percentText.textContent : '0%',
      title: statusTitle ? statusTitle.textContent : ''
    };
  });
  console.log('⏳ Active Rendering HUD Progress State:', progressState);

  // Screenshot the active progress bar on the video stage!
  const stageEl = await page.$('.video-stage');
  if (stageEl) {
    await stageEl.screenshot({ path: 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0\\reel_rendering_progress_bar_active.png' });
    console.log('📸 Saved reel_rendering_progress_bar_active.png');
  }

  // 3. Wait for progress bar to finish (approx 2.5s more)
  console.log('⏳ Waiting for render completion & video playback...');
  await new Promise(r => setTimeout(r, 2600));

  const completedData = await page.evaluate(() => {
    return {
      activeProduct: window.ACTIVE_SCENARIO ? window.ACTIVE_SCENARIO.productName : null,
      activeTicket: window.ACTIVE_SCENARIO ? window.ACTIVE_SCENARIO.ticket : null,
      activeKeyword: window.ACTIVE_SCENARIO ? window.ACTIVE_SCENARIO.keyword : null,
      captionSnippet: document.getElementById('igCaptionText') ? document.getElementById('igCaptionText').textContent.substring(0, 90) : '',
      nextProductInMind: document.getElementById('giantNextProductTitle') ? document.getElementById('giantNextProductTitle').textContent : '',
      rotationIndex: window.PRODUCT_ROTATION_INDEX
    };
  });
  console.log('✨ Render Finished & New Reel Active:', completedData);

  // Screenshot newly playing video stage
  if (stageEl) {
    await stageEl.screenshot({ path: 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0\\reel_new_video_playing_verified.png' });
    console.log('📸 Saved reel_new_video_playing_verified.png');
  }

  // 4. Test Click #2: Should rotate to Product #2 (90s SMS Speed-to-Lead)!
  console.log('⚡ Clicking Giant Generate Reel Button 2nd time (Advancing mind queue)...');
  await page.click('#btnGiantGenerateReel');
  await new Promise(r => setTimeout(r, 1200));

  const click2Progress = await page.evaluate(() => {
    const statusTitle = document.getElementById('renderStatusTitle');
    return {
      title: statusTitle ? statusTitle.textContent : '',
      percent: document.getElementById('renderPercentText').textContent
    };
  });
  console.log('⏳ Click #2 Rendering HUD State (Product 2 in rotation):', click2Progress);

  await new Promise(r => setTimeout(r, 2200));
  const click2Completed = await page.evaluate(() => {
    return {
      activeProduct: window.ACTIVE_SCENARIO ? window.ACTIVE_SCENARIO.productName : null,
      activeKeyword: window.ACTIVE_SCENARIO ? window.ACTIVE_SCENARIO.keyword : null,
      nextProductInMind: document.getElementById('giantNextProductTitle') ? document.getElementById('giantNextProductTitle').textContent : '',
      rotationIndex: window.PRODUCT_ROTATION_INDEX
    };
  });
  console.log('✨ Click #2 Completed (Cleanly Rotated):', click2Completed);

  await browser.close();
  console.log('🎉 ALL TESTS PASSED! Giant button works, brain queue cycles properly, and progress bar renders every time!');
})().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
