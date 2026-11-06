const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });
  await page.goto('file:///' + path.resolve('website/demo/reel-creator.html').replace(/\\/g, '/'), { waitUntil: 'networkidle2' });
  const el = await page.$('#promptWorkbench');
  if (el) {
    await el.screenshot({ path: 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0\\two_box_product_rotation_verified.png' });
    console.log('Saved workbench screenshot');
  }
  await browser.close();
})();
