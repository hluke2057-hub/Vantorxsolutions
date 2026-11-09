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

    console.log('Navigating to YellowPages...');
    await page.goto('https://www.yellowpages.com/search?search_terms=plumber&geo_location_terms=Tampa%2C+FL', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    const title = await page.title();
    console.log('Page Title:', title);

    const listings = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll('.result').forEach(el => {
        const name = el.querySelector('.business-name span')?.textContent || el.querySelector('.business-name')?.textContent;
        const phone = el.querySelector('.phone')?.textContent;
        const address = el.querySelector('.street-address')?.textContent;
        const locality = el.querySelector('.locality')?.textContent;
        const website = el.querySelector('.track-visit-website')?.getAttribute('href') || null;
        if (name && phone) {
          results.push({ name: name.trim(), phone: phone.trim(), address: address ? address.trim() : '', locality: locality ? locality.trim() : '', hasWebsite: !!website, website });
        }
      });
      return results;
    });

    console.log(`Found ${listings.length} listings in Tampa:`);
    console.log(listings.slice(0, 5));
    const noWeb = listings.filter(l => !l.hasWebsite);
    console.log(`Listings without website: ${noWeb.length}`);
    console.log(noWeb.slice(0, 3));

    await browser.close();
  } catch (err) {
    console.error('Puppeteer test failed:', err.message);
  }
})();
