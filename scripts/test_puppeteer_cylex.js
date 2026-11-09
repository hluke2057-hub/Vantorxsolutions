const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0');

    console.log('Navigating to Cylex US...');
    await page.goto('https://www.cylex.us.com/s?q=roofing&c=Orlando&z=FL', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    const title = await page.title();
    console.log('Page Title:', title);

    await browser.close();
  } catch (err) {
    console.error('Puppeteer test failed:', err.message);
  }
})();
