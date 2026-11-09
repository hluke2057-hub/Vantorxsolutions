const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('Loading instagram.com/taskless.ai/ in Edge...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1200 });

  try {
    await page.goto('https://www.instagram.com/taskless.ai/', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'taskless_ai_instagram.png') });
    console.log('Screenshot saved to taskless_ai_instagram.png');

    const pageData = await page.evaluate(() => {
      const bio = document.querySelector('header')?.innerText || '';
      const links = Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => h.includes('/p/') || h.includes('/reel/'));
      const text = document.body.innerText.slice(0, 1000);
      return { bio, links: links.slice(0, 10), textSample: text };
    });
    console.log('Page Data:', JSON.stringify(pageData, null, 2));
  } catch (err) {
    console.error('Error loading Instagram:', err.message);
  } finally {
    await browser.close();
  }
})();
