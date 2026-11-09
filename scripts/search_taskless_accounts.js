const puppeteer = require('puppeteer-core');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  
  await page.goto('https://www.google.com/search?q=%22taskless.ai%22+instagram', { waitUntil: 'networkidle2' });
  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h3')).map(h => ({
      title: h.innerText,
      link: h.closest('a')?.href
    }));
  });
  console.log('Google results for "taskless.ai" instagram:', JSON.stringify(results.slice(0, 10), null, 2));

  await browser.close();
})();
