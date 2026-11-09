const puppeteer = require('puppeteer-core');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0');

  const res = await page.goto('https://www.yellowpages.com/search?search_terms=plumbers&geo_location_terms=Orlando%2C+FL', {
    waitUntil: 'domcontentloaded'
  });
  console.log('Status:', res.status());
  console.log('Title:', await page.title());
  console.log('URL:', page.url());

  const resultsCount = await page.evaluate(() => document.querySelectorAll('.result').length);
  console.log('Results count:', resultsCount);

  await browser.close();
})();
