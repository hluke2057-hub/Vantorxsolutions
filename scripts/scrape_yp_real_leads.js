const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const SEARCH_TARGETS = [
  // Tampa Bay
  { term: 'plumbing contractors', city: 'Tampa, FL', metro: 'Tampa Bay', trade: 'Plumbing' },
  { term: 'roofing contractors', city: 'Tampa, FL', metro: 'Tampa Bay', trade: 'Roofing' },
  { term: 'air conditioning contractors', city: 'Tampa, FL', metro: 'Tampa Bay', trade: 'HVAC' },
  { term: 'electrical contractors', city: 'Tampa, FL', metro: 'Tampa Bay', trade: 'Electrical' },
  { term: 'plumbing contractors', city: 'St Petersburg, FL', metro: 'Tampa Bay', trade: 'Plumbing' },
  { term: 'roofing contractors', city: 'Clearwater, FL', metro: 'Tampa Bay', trade: 'Roofing' },
  // Central FL / Orlando
  { term: 'plumbing contractors', city: 'Orlando, FL', metro: 'Central FL', trade: 'Plumbing' },
  { term: 'roofing contractors', city: 'Orlando, FL', metro: 'Central FL', trade: 'Roofing' },
  { term: 'air conditioning contractors', city: 'Orlando, FL', metro: 'Central FL', trade: 'HVAC' },
  { term: 'electrical contractors', city: 'Kissimmee, FL', metro: 'Central FL', trade: 'Electrical' },
  // South FL / Miami / Fort Lauderdale
  { term: 'plumbing contractors', city: 'Miami, FL', metro: 'South FL', trade: 'Plumbing' },
  { term: 'roofing contractors', city: 'Miami, FL', metro: 'South FL', trade: 'Roofing' },
  { term: 'air conditioning contractors', city: 'Fort Lauderdale, FL', metro: 'South FL', trade: 'HVAC' },
  { term: 'plumbing contractors', city: 'Hialeah, FL', metro: 'South FL', trade: 'Plumbing' },
  // Palm Beach
  { term: 'plumbing contractors', city: 'West Palm Beach, FL', metro: 'Palm Beach', trade: 'Plumbing' },
  { term: 'roofing contractors', city: 'Boca Raton, FL', metro: 'Palm Beach', trade: 'Roofing' },
  { term: 'air conditioning contractors', city: 'Delray Beach, FL', metro: 'Palm Beach', trade: 'HVAC' },
  // SW Florida
  { term: 'plumbing contractors', city: 'Fort Myers, FL', metro: 'SW Florida', trade: 'Plumbing' },
  { term: 'roofing contractors', city: 'Cape Coral, FL', metro: 'SW Florida', trade: 'Roofing' },
  { term: 'air conditioning contractors', city: 'Naples, FL', metro: 'SW Florida', trade: 'HVAC' },
  { term: 'plumbing contractors', city: 'Sarasota, FL', metro: 'SW Florida', trade: 'Plumbing' },
  // North FL
  { term: 'plumbing contractors', city: 'Jacksonville, FL', metro: 'North FL', trade: 'Plumbing' },
  { term: 'roofing contractors', city: 'Jacksonville, FL', metro: 'North FL', trade: 'Roofing' },
  { term: 'air conditioning contractors', city: 'Pensacola, FL', metro: 'North FL', trade: 'HVAC' },
  { term: 'plumbing contractors', city: 'Tallahassee, FL', metro: 'North FL', trade: 'Plumbing' }
];

async function scrapeYP() {
  console.log('=== STARTING 100% REAL LEADS SCRAPER ON YELLOWPAGES ===');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0');

  const allScraped = [];
  const seenPhones = new Set();

  for (const target of SEARCH_TARGETS) {
    const encodedTerm = encodeURIComponent(target.term);
    const encodedCity = encodeURIComponent(target.city);
    const url = `https://www.yellowpages.com/search?search_terms=${encodedTerm}&geo_location_terms=${encodedCity}`;
    console.log(`Querying: ${target.term} in ${target.city}...`);

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await new Promise(r => setTimeout(r, 1500));

      const items = await page.evaluate(() => {
        const list = [];
        const results = document.querySelectorAll('.result, .v-card, .info-section');
        results.forEach(el => {
          const nameEl = el.querySelector('.business-name span') || el.querySelector('.business-name') || el.querySelector('h2 a');
          const phoneEl = el.querySelector('.phone');
          const addrEl = el.querySelector('.street-address');
          const locEl = el.querySelector('.locality');
          const webEl = el.querySelector('.track-visit-website');
          const ratingEl = el.querySelector('.rating-count, .count, .rating');
          const yearsEl = el.querySelector('.years-in-business, .years-with-yp');

          if (nameEl && phoneEl) {
            const name = nameEl.textContent.trim();
            const phone = phoneEl.textContent.trim();
            const street = addrEl ? addrEl.textContent.trim() : '';
            const locality = locEl ? locEl.textContent.trim() : '';
            const hasWeb = !!webEl;
            const webUrl = webEl ? webEl.getAttribute('href') : null;
            const rating = ratingEl ? ratingEl.textContent.trim() : '';
            const years = yearsEl ? yearsEl.textContent.trim() : '';

            list.push({
              name,
              phone,
              street,
              locality,
              hasWeb,
              webUrl,
              rating,
              years
            });
          }
        });
        return list;
      });

      console.log(`  -> Got ${items.length} raw results`);
      for (const item of items) {
        const cleanDigits = item.phone.replace(/\D/g, '');
        if (cleanDigits.length < 10) continue;
        if (seenPhones.has(cleanDigits)) continue;
        seenPhones.add(cleanDigits);

        allScraped.push({
          ...item,
          cleanPhone: cleanDigits,
          targetCity: target.city,
          metro: target.metro,
          trade: target.trade
        });
      }

      // If we already have over 150 leads with no website and 250 with website, we can break or continue
      const noWebCount = allScraped.filter(x => !x.hasWeb).length;
      console.log(`  Total unique collected: ${allScraped.length} (Zero website: ${noWebCount})`);
    } catch (e) {
      console.warn(`  Failed query for ${target.city}: ${e.message}`);
    }
  }

  await browser.close();

  fs.writeFileSync(path.resolve(__dirname, '..', 'data', 'yp_scraped_raw.json'), JSON.stringify(allScraped, null, 2), 'utf8');
  console.log(`\n=== COMPLETED SCRAPE ===`);
  console.log(`Saved ${allScraped.length} total real Florida contractors to data/yp_scraped_raw.json`);
  console.log(`Real Contractors with NO WEBSITE: ${allScraped.filter(x => !x.hasWeb).length}`);
  console.log(`Real Contractors with website: ${allScraped.filter(x => x.hasWeb).length}`);
}

scrapeYP();
