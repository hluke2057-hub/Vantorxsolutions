const puppeteer = require('puppeteer-core');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const path = require('path');
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1200 });

  const targets = ['taskless_ai', 'tasklessai', 'trytaskless'];
  for (const t of targets) {
    console.log(`\n--- Inspecting @${t} ---`);
    try {
      await page.goto(`https://www.instagram.com/${t}/`, { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, `inspect_${t}.png`) });

      const data = await page.evaluate(() => {
        const header = document.querySelector('header')?.innerText || '';
        const links = Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => h.includes('/p/') || h.includes('/reel/'));
        return { header, links: links.slice(0, 10) };
      });
      console.log(`@${t} data:`, JSON.stringify(data, null, 2));
    } catch(e) {
      console.log(`@${t} failed:`, e.message);
    }
  }

  await browser.close();
})();
