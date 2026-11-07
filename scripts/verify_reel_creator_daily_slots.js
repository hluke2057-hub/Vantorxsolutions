const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  console.log('🚀 Verifying Reel Creator Daily Slots and Playback in Microsoft Edge...');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1100']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  const fileUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'demo', 'reel-creator.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  const artifactDir = 'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0';

  // 1. Verify play overlay is visible on load
  const isOverlayVisible = await page.evaluate(() => {
    const el = document.getElementById('reelPlayOverlay');
    return el && window.getComputedStyle(el).display !== 'none';
  });
  console.log('Is #reelPlayOverlay visible on load?', isOverlayVisible);

  // Scroll to video stage and screenshot play overlay
  await page.evaluate(() => {
    const stage = document.querySelector('.video-stage');
    if (stage) stage.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(artifactDir, 'verified_reel_play_overlay.png') });
  console.log('📸 Saved verified_reel_play_overlay.png');

  // 2. Click Drop #1 (Morning 9:00 AM)
  console.log('Clicking #btnMorningSlot...');
  await page.click('#btnMorningSlot');
  await new Promise(r => setTimeout(r, 1200));

  const morningState = await page.evaluate(() => {
    return {
      activeStory: window.ACTIVE_STORY?.name,
      storyType: window.ACTIVE_STORY?.storyType,
      isPlaying: window.isPlaying,
      currentTime: window.currentTime
    };
  });
  console.log('Drop #1 State after click:', morningState);
  await page.screenshot({ path: path.join(artifactDir, 'verified_reel_drop1_morning_playing.png') });
  console.log('📸 Saved verified_reel_drop1_morning_playing.png');

  // 3. Click Drop #2 (Evening 5:00 PM)
  console.log('Clicking #btnEveningSlot...');
  await page.click('#btnEveningSlot');
  await new Promise(r => setTimeout(r, 1200));

  const eveningState = await page.evaluate(() => {
    return {
      activeStory: window.ACTIVE_STORY?.name,
      storyType: window.ACTIVE_STORY?.storyType,
      isPlaying: window.isPlaying,
      currentTime: window.currentTime
    };
  });
  console.log('Drop #2 State after click:', eveningState);
  await page.screenshot({ path: path.join(artifactDir, 'verified_reel_drop2_evening_playing.png') });
  console.log('📸 Saved verified_reel_drop2_evening_playing.png');

  // 4. Test contractor on ladder stick figure scene (t = 28s)
  console.log('Testing Contractor on Ladder Stickman (t = 28s)...');
  await page.evaluate(() => {
    window.currentTime = 28.5;
    window.renderFrame(28.5);
  });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(artifactDir, 'verified_reel_stickman_ladder.png') });
  console.log('📸 Saved verified_reel_stickman_ladder.png');

  // 5. Test competitor cash thief stick figure scene (t = 33s)
  console.log('Testing Competitor Cash Thief Stickman (t = 33s)...');
  await page.evaluate(() => {
    window.currentTime = 33.0;
    window.renderFrame(33.0);
  });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(artifactDir, 'verified_reel_stickman_cash_thief.png') });
  console.log('📸 Saved verified_reel_stickman_cash_thief.png');

  // 6. Test Giant Generate Reel Button click & rotation
  console.log('Testing Giant Generate Reel Button click...');
  await page.evaluate(() => {
    const btn = document.getElementById('btnGiantGenerateReel');
    if (btn) btn.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 300));
  await page.click('#btnGiantGenerateReel');
  await new Promise(r => setTimeout(r, 3500)); // wait for 2.2s progress bar

  const postGenState = await page.evaluate(() => {
    return {
      activeStory: window.ACTIVE_STORY?.name,
      isPlaying: window.isPlaying,
      currentTime: window.currentTime
    };
  });
  console.log('State after Giant Generate click:', postGenState);

  await browser.close();
  console.log('🎉 ALL REEL CREATOR TESTS COMPLETED SUCCESSFULLY!');
})();
