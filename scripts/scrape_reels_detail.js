const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1200 });

  await page.goto('https://www.instagram.com/taskless_ai/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Dismiss modal
  await page.evaluate(() => {
    // Find close button
    const closeBtn = document.querySelector('svg[aria-label="Close"]')?.closest('div[role="button"]') ||
                     document.querySelector('div[role="dialog"] button');
    if (closeBtn) closeBtn.click();
    // Also remove any backdrop or dialog
    const dialogs = document.querySelectorAll('div[role="dialog"], div[role="presentation"]');
    dialogs.forEach(d => d.remove());
    document.body.style.overflow = 'auto';
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'taskless_ai_grid_clean.png'), fullPage: true });
  console.log('Saved clean grid screenshot');

  // Now let's visit each reel and capture frames and info!
  const reelLinks = [
    'https://www.instagram.com/taskless_ai/reel/DK96yRCx3tl/',
    'https://www.instagram.com/taskless_ai/reel/DKumAUdRyEJ/',
    'https://www.instagram.com/taskless_ai/reel/DKkLSxqx5sz/',
    'https://www.instagram.com/taskless_ai/reel/DKhoMyaRKkn/',
    'https://www.instagram.com/taskless_ai/reel/DKfQa2gRASm/'
  ];

  for (let i = 0; i < reelLinks.length; i++) {
    const url = reelLinks[i];
    console.log(`\nNavigating to reel ${i}: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise(r => setTimeout(r, 2000));
      
      // Dismiss dialogs
      await page.evaluate(() => {
        const dialogs = document.querySelectorAll('div[role="dialog"], div[role="presentation"]');
        dialogs.forEach(d => d.remove());
      });

      // Get video src or screenshot
      const reelData = await page.evaluate(() => {
        const video = document.querySelector('video');
        const caption = document.querySelector('h1')?.innerText || document.querySelector('article')?.innerText || '';
        return {
          videoSrc: video ? video.src : null,
          poster: video ? video.poster : null,
          caption: caption.slice(0, 300)
        };
      });
      console.log(`Reel ${i} Data:`, reelData);

      await page.screenshot({ path: path.join(ARTIFACTS_DIR, `taskless_ai_reel_${i}.png`) });
    } catch(err) {
      console.log(`Error on reel ${i}:`, err.message);
    }
  }

  await browser.close();
  console.log('ALL REELS INSPECTED!');
})();
