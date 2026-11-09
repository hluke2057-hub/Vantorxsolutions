const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('Visiting taskless.it...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1200 });

  try {
    await page.goto('https://taskless.it/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'taskless_it_website.png') });
    console.log('Saved taskless_it_website.png');

    const content = await page.evaluate(() => {
      return {
        title: document.title,
        h1: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim()).slice(0, 10),
        images: Array.from(document.querySelectorAll('img, video')).map(m => m.src).slice(0, 10)
      };
    });
    console.log('Website Data:', JSON.stringify(content, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
