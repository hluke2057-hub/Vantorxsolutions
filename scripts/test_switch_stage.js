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
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // Click btnViewVideo then btnViewCanvas
  console.log('Clicking btnViewVideo...');
  await page.click('#btnViewVideo');
  await new Promise(r => setTimeout(r, 500));

  console.log('Clicking btnViewCanvas...');
  await page.click('#btnViewCanvas');
  await new Promise(r => setTimeout(r, 500));

  const stage = await page.$('.video-stage');
  if (stage) {
    await stage.screenshot({ path: path.join(ARTIFACTS_DIR, 'debug_stage_after_switch.png') });
    console.log('Saved debug_stage_after_switch.png');
  }

  const overlayDisplay = await page.evaluate(() => {
    const o = document.getElementById('reelPlayOverlay');
    return o ? window.getComputedStyle(o).display : 'none';
  });
  console.log('reelPlayOverlay display after switch:', overlayDisplay);

  await browser.close();
})();
