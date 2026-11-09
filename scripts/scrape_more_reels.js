const puppeteer = require('puppeteer-core');
const path = require('path');
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

  const extraReels = [
    { name: 'wasting_life', url: 'https://www.instagram.com/taskless_ai/reel/DKZ-awYxN6D/' },
    { name: 'doing_everything', url: 'https://www.instagram.com/taskless_ai/reel/DKe0sZrR64f/' },
    { name: 'quit_job', url: 'https://www.instagram.com/taskless_ai/reel/DKd7HCrs4e9/' }
  ];

  for (const r of extraReels) {
    try {
      await page.goto(r.url, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(res => setTimeout(res, 2000));
      await page.evaluate(() => {
        document.querySelectorAll('div[role="dialog"], div[role="presentation"]').forEach(d => d.remove());
      });
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, `taskless_ai_${r.name}.png`) });
      console.log(`Captured ${r.name}`);
    } catch(e) {
      console.log(`Failed ${r.name}: ${e.message}`);
    }
  }

  await browser.close();
})();
