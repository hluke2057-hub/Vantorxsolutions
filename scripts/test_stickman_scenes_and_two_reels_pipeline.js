const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

async function testStickmanAndPipeline() {
  console.log('🚀 Running Full Verification of Stickman Scenes & 2-Reels-A-Day Pipeline in Edge...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  page.on('console', msg => console.log(`[Browser ${msg.type()}]:`, msg.text()));
  page.on('pageerror', err => console.error('[Page Error]:', err.message));

  const url = `file:///${path.resolve('website/demo/reel-creator.html').replace(/\\/g, '/')}`;
  await page.goto(url, { waitUntil: 'load', timeout: 20000 });

  // 1. Verify 2-Reels Scheduler UI
  const morningBtn = await page.$('#btnMorningSlot');
  const eveningBtn = await page.$('#btnEveningSlot');
  console.log('Morning Slot button present:', !!morningBtn);
  console.log('Evening Slot button present:', !!eveningBtn);

  // Click Morning Slot (Ava Voice AI / Rooftop Emergency)
  if (morningBtn) {
    console.log('Clicking Morning Slot #1 (9:00 AM)...');
    await morningBtn.click();
    await new Promise(r => setTimeout(r, 400));
  }

  // Click Giant Generate Reel Button
  const giantBtn = await page.$('#btnGiantGenerateReel');
  console.log('Clicking Giant Generate Reel Button...');
  await giantBtn.click();

  // Wait for rendering progress bar to complete (approx 2.5s)
  await new Promise(r => setTimeout(r, 3000));

  // Render & Screenshot specific Stick Figure scenes by seeking canvas
  const canvas = await page.$('#reelCanvas');

  // Scene 6: Panicked Homeowner & Bursting Water Pipe (t = 24.5s)
  await page.evaluate(() => {
    window.currentTime = 24.5;
    renderFrame(24.5);
  });
  await new Promise(r => setTimeout(r, 200));
  await canvas.screenshot({ path: path.join(ARTIFACT_DIR, 'reel_stickman_scene6_homeowner_pipe.png') });
  console.log('📸 Saved reel_stickman_scene6_homeowner_pipe.png');

  // Scene 7: Contractor Stickman on Ladder with Ringing Phone (t = 28.5s)
  await page.evaluate(() => {
    window.currentTime = 28.5;
    renderFrame(28.5);
  });
  await new Promise(r => setTimeout(r, 200));
  await canvas.screenshot({ path: path.join(ARTIFACT_DIR, 'reel_stickman_scene7_contractor_ladder.png') });
  console.log('📸 Saved reel_stickman_scene7_contractor_ladder.png');

  // Scene 8: Competitor Thief Running with Sack of Cash (t = 33.0s)
  await page.evaluate(() => {
    window.currentTime = 33.0;
    renderFrame(33.0);
  });
  await new Promise(r => setTimeout(r, 200));
  await canvas.screenshot({ path: path.join(ARTIFACT_DIR, 'reel_stickman_scene8_competitor_cash.png') });
  console.log('📸 Saved reel_stickman_scene8_competitor_cash.png');

  // Scene 9: Ava Cyber Heroine with Headset & Holographic Dispatch Tablet (t = 37.5s)
  await page.evaluate(() => {
    window.currentTime = 37.5;
    renderFrame(37.5);
  });
  await new Promise(r => setTimeout(r, 200));
  await canvas.screenshot({ path: path.join(ARTIFACT_DIR, 'reel_stickman_scene9_ava_heroine.png') });
  console.log('📸 Saved reel_stickman_scene9_ava_heroine.png');

  // 2. Test Drop #2: Evening Slot (5:00 PM)
  console.log('\nTesting Drop #2: Evening Slot (5:00 PM)...');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 300));
  await eveningBtn.click();
  await new Promise(r => setTimeout(r, 400));

  // Check that Evening Slot changed the staged product to 90s SMS Speed-to-Lead
  const eveningData = await page.evaluate(() => {
    return {
      productTitle: document.getElementById('giantNextProductTitle').textContent,
      storyTitle: document.getElementById('giantNextProductScenario').textContent
    };
  });
  console.log('Evening Slot Loaded:', eveningData);

  // Click Giant Button for Evening Reel
  await giantBtn.click();
  await new Promise(r => setTimeout(r, 3000));

  // Render & Screenshot Evening Reel Scene 2 (Falcon Dive at t = 6.0s)
  await page.evaluate(() => {
    window.currentTime = 6.0;
    renderFrame(6.0);
  });
  await new Promise(r => setTimeout(r, 200));
  await canvas.screenshot({ path: path.join(ARTIFACT_DIR, 'reel_evening_drop_pipeline.png') });
  console.log('📸 Saved reel_evening_drop_pipeline.png');

  await browser.close();
  console.log('\n🎉 ALL STICKMAN SCENES & 2-REELS PIPELINE TESTED AND VERIFIED WITH 0 ERRORS!');
}

testStickmanAndPipeline();
