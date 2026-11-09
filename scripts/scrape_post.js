const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  const postUrls = [
    'https://www.instagram.com/taskless.ai/p/DPEIbPUDDNP/',
    'https://www.instagram.com/taskless.ai/p/DPEIB_BDIfM/'
  ];

  for (let i = 0; i < postUrls.length; i++) {
    try {
      console.log('Navigating to post', i, postUrls[i]);
      await page.goto(postUrls[i], { waitUntil: 'networkidle2', timeout: 25000 });
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, `taskless_post_${i}.png`) });
      console.log(`Saved taskless_post_${i}.png`);

      const text = await page.evaluate(() => document.body.innerText.slice(0, 500));
      console.log('Post text:', text);
    } catch(e) {
      console.log('Error:', e.message);
    }
  }

  await browser.close();
})();
