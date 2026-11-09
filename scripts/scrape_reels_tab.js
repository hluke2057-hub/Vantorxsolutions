const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('--- SCRAPING REELS ON TRYTASKLESS.AI ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  await page.goto('https://www.instagram.com/trytaskless.ai/reels/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Dismiss modal
  await page.evaluate(() => {
    document.querySelector('svg[aria-label="Close"]')?.closest('div[role="button"]')?.click();
    document.querySelectorAll('div[role="dialog"], div[role="presentation"]').forEach(d => d.remove());
    document.body.style.overflow = 'auto';
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'trytaskless_reels_tab.png'), fullPage: true });
  console.log('Saved trytaskless_reels_tab.png');

  const reelLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a'))
      .map(a => a.href)
      .filter(h => h.includes('/reel/'));
  });
  console.log('Reel links:', reelLinks);

  for (let i = 0; i < reelLinks.length; i++) {
    const url = reelLinks[i];
    console.log(`Navigating to reel ${i}: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise(r => setTimeout(r, 2000));
      await page.evaluate(() => {
        document.querySelectorAll('div[role="dialog"], div[role="presentation"]').forEach(d => d.remove());
      });
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, `trytaskless_reel_item_${i}.png`) });
      
      const details = await page.evaluate(() => {
        const video = document.querySelector('video');
        const text = document.querySelector('h1')?.innerText || document.querySelector('article')?.innerText || '';
        return {
          hasVideo: !!video,
          videoSrc: video ? video.src : null,
          text: text.slice(0, 500)
        };
      });
      console.log(`Reel ${i} details:`, details);
    } catch(e) {
      console.log(`Reel ${i} failed:`, e.message);
    }
  }

  await browser.close();
  console.log('REELS SCRAPE COMPLETE!');
})();
