const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1200 });

    page.on('console', msg => console.log('LOG [' + msg.type() + ']:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    const reelUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'demo', 'reel-creator.html').replace(/\\/g, '/');
    console.log('Navigating to:', reelUrl);
    await page.goto(reelUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));

    // Capture initial load
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'debug_initial_load.png') });

    // Click play overlay if visible
    const playOverlay = await page.$('#reelPlayOverlay');
    if (playOverlay) {
      console.log('Found #reelPlayOverlay, clicking it...');
      await playOverlay.click();
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'debug_after_play_click.png') });
    }

    // Now let's test clicking Generate Reel button: #btnGenerateReel
    const genBtn = await page.$('#btnGenerateReel');
    if (genBtn) {
      console.log('Found #btnGenerateReel, clicking it...');
      await genBtn.click();
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'debug_after_generate_click.png') });
    }

    await browser.close();
    console.log('Edge debugging complete!');
  } catch (e) {
    console.error('Test error:', e);
  }
})();
