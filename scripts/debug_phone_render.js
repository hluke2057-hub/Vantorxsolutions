const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1100 });
  const url = 'file:///' + path.resolve(__dirname, '..', 'website', 'demo', 'reel-creator.html').replace(/\\/g, '/');
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  const stage = await page.$('.video-stage');
  if (stage) {
    await stage.screenshot({ path: path.join(ARTIFACTS_DIR, 'debug_stage_initial.png') });
    console.log('Saved debug_stage_initial.png');
  }

  // Now simulate click on Play button (or togglePlay)
  console.log('Toggling play...');
  await page.evaluate(() => {
    if (typeof togglePlay === 'function') {
      togglePlay();
    }
  });
  await new Promise(r => setTimeout(r, 500));

  await stage.screenshot({ path: path.join(ARTIFACTS_DIR, 'debug_stage_playing_t0.png') });
  console.log('Saved debug_stage_playing_t0.png');

  // Let's test different time points during playback
  for (let t of [0.5, 2.0, 5.0, 10.0, 20.0, 30.0, 45.0]) {
    await page.evaluate((timeVal) => {
      window.currentTime = timeVal;
      window.renderFrame(timeVal);
    }, t);
    await stage.screenshot({ path: path.join(ARTIFACTS_DIR, `debug_stage_t_${t}.png`) });
    console.log(`Saved screenshot for t=${t}`);
  }

  await browser.close();
})();
