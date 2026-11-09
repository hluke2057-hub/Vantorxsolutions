const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('--- SCRAPING INSTAGRAM.COM/TRYTASKLESS.AI ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  await page.goto('https://www.instagram.com/trytaskless.ai/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Dismiss modal
  await page.evaluate(() => {
    document.querySelector('svg[aria-label="Close"]')?.closest('div[role="button"]')?.click();
    document.querySelectorAll('div[role="dialog"], div[role="presentation"]').forEach(d => d.remove());
    document.body.style.overflow = 'auto';
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'trytaskless_ig_grid_clean.png'), fullPage: true });
  console.log('Saved trytaskless_ig_grid_clean.png');

  // Extract all post and reel links
  const postLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a'))
      .map(a => a.href)
      .filter(h => h.includes('/p/') || h.includes('/reel/'));
  });
  console.log('Found post links:', postLinks);

  // Visit the first 6 posts/reels
  for (let i = 0; i < Math.min(postLinks.length, 6); i++) {
    const url = postLinks[i];
    console.log(`\nNavigating to post ${i}: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise(r => setTimeout(r, 2000));
      await page.evaluate(() => {
        document.querySelectorAll('div[role="dialog"], div[role="presentation"]').forEach(d => d.remove());
      });

      const postData = await page.evaluate(() => {
        const video = document.querySelector('video');
        const img = document.querySelector('article img');
        const text = document.querySelector('article')?.innerText || '';
        return {
          isVideo: !!video,
          videoSrc: video ? video.src : null,
          imgSrc: img ? img.src : null,
          text: text.slice(0, 500)
        };
      });
      console.log(`Post ${i} data:`, postData);

      await page.screenshot({ path: path.join(ARTIFACTS_DIR, `trytaskless_post_${i}.png`) });
    } catch(err) {
      console.log(`Error on post ${i}:`, err.message);
    }
  }

  // Also check trytaskless.ai/links or trytaskless.ai/field-services/
  console.log('\nNavigating to trytaskless.ai/field-services/...');
  try {
    await page.goto('https://trytaskless.ai/field-services/', { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'trytaskless_field_services.png'), fullPage: true });
    console.log('Saved trytaskless_field_services.png');
  } catch(e) {
    console.log('Field services page error:', e.message);
  }

  await browser.close();
  console.log('TRYTASKLESS.AI SCRAPE COMPLETE!');
})();
