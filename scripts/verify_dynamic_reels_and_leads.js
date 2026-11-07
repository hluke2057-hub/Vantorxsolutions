const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('🚀 Launching Edge browser for end-to-end verification...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });

  // -------------------------------------------------------------
  // TEST 1: Cold Call Arena Direct Link to #tabNoWebsite
  // -------------------------------------------------------------
  const coldCallUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html').replace(/\\/g, '/') + '#tabNoWebsite';
  console.log('Testing Cold Call Arena direct hash link:', coldCallUrl);
  await page.goto(coldCallUrl, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));

  const isTabActive = await page.evaluate(() => {
    const tab = document.getElementById('tabNoWebsite');
    const btn = document.getElementById('tabBtnNoWebsite');
    return tab && tab.classList.contains('active') && btn && btn.classList.contains('active');
  });

  const rowCount = await page.evaluate(() => {
    const tbody = document.getElementById('flLeadsTableBody');
    return tbody ? tbody.querySelectorAll('tr').length : 0;
  });

  console.log(`Cold Call Arena Result -> Tab Active: ${isTabActive}, Florida Rows Loaded: ${rowCount}`);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_direct_florida_link.png') });

  // -------------------------------------------------------------
  // TEST 2: Reel Creator Dynamic Story #2 (Peregrine Falcon 242 MPH)
  // -------------------------------------------------------------
  const reelUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'demo', 'reel-creator.html').replace(/\\/g, '/');
  console.log('Testing Reel Creator:', reelUrl);
  await page.goto(reelUrl, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200));

  // Select Evening Drop #2 (Peregrine Falcon)
  console.log('Selecting Drop #2 (Evening - Peregrine Falcon)...');
  await page.evaluate(() => {
    window.selectDailySlot('evening');
  });
  await new Promise(r => setTimeout(r, 600));

  // Check state of active story and script cues
  const falconState = await page.evaluate(() => {
    return {
      storyType: window.ACTIVE_STORY ? window.ACTIVE_STORY.storyType : null,
      storyTitle: window.ACTIVE_STORY ? window.ACTIVE_STORY.storyTitle : null,
      firstWord: (window.ACTIVE_WORD_TIMESTAMPS && window.ACTIVE_WORD_TIMESTAMPS[0]) ? window.ACTIVE_WORD_TIMESTAMPS[0].word : null,
      firstWords: (window.ACTIVE_WORD_TIMESTAMPS) ? window.ACTIVE_WORD_TIMESTAMPS.slice(0, 8).map(w => w.word).join(' ') : null,
      firstCue: (window.ACTIVE_SCRIPT_CUES && window.ACTIVE_SCRIPT_CUES[0]) ? window.ACTIVE_SCRIPT_CUES[0].text : null,
      scene1Title: document.getElementById('scene1TitleLabel') ? document.getElementById('scene1TitleLabel').textContent : null
    };
  });
  console.log('Falcon State:', falconState);

  // Advance time to 2.5s and render frame
  await page.evaluate(() => {
    currentTime = 2.5;
    renderFrame(2.5);
  });
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_story2_falcon_canvas.png') });

  // -------------------------------------------------------------
  // TEST 3: Click Giant Button to Advance to Product 3 (Formula 1 Pitstop)
  // -------------------------------------------------------------
  console.log('Clicking Giant Button to cycle to Product 3 (Formula 1)...');
  await page.evaluate(() => {
    window.generatePromptAndMakeReel();
  });
  // Wait for 2.8s progress bar to finish
  await new Promise(r => setTimeout(r, 3200));

  const f1State = await page.evaluate(() => {
    return {
      storyType: window.ACTIVE_STORY ? window.ACTIVE_STORY.storyType : null,
      storyTitle: window.ACTIVE_STORY ? window.ACTIVE_STORY.storyTitle : null,
      firstWords: (window.ACTIVE_WORD_TIMESTAMPS) ? window.ACTIVE_WORD_TIMESTAMPS.slice(0, 8).map(w => w.word).join(' ') : null,
      scene1Title: document.getElementById('scene1TitleLabel') ? document.getElementById('scene1TitleLabel').textContent : null
    };
  });
  console.log('Formula 1 State:', f1State);

  await page.evaluate(() => {
    currentTime = 3.0;
    renderFrame(3.0);
  });
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_story3_f1_canvas.png') });

  // -------------------------------------------------------------
  // TEST 4: Advance to Product 4 (AEO Brain Synapses)
  // -------------------------------------------------------------
  console.log('Clicking Giant Button to cycle to Product 4 (Brain Synapses)...');
  await page.evaluate(() => {
    window.generatePromptAndMakeReel();
  });
  await new Promise(r => setTimeout(r, 3200));

  const brainState = await page.evaluate(() => {
    return {
      storyType: window.ACTIVE_STORY ? window.ACTIVE_STORY.storyType : null,
      storyTitle: window.ACTIVE_STORY ? window.ACTIVE_STORY.storyTitle : null,
      firstWords: (window.ACTIVE_WORD_TIMESTAMPS) ? window.ACTIVE_WORD_TIMESTAMPS.slice(0, 8).map(w => w.word).join(' ') : null,
      scene1Title: document.getElementById('scene1TitleLabel') ? document.getElementById('scene1TitleLabel').textContent : null
    };
  });
  console.log('Brain State:', brainState);

  await page.evaluate(() => {
    currentTime = 2.5;
    renderFrame(2.5);
  });
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_story4_brain_canvas.png') });

  await browser.close();
  console.log('🎉 Verification completed successfully!');
})();
