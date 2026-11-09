const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const MORE_TARGETS = [
  // Miami & Fort Lauderdale
  { term: 'plumber', city: 'Miami, FL', metro: 'South FL', trade: 'Plumbing' },
  { term: 'roofing', city: 'Miami, FL', metro: 'South FL', trade: 'Roofing' },
  { term: 'electrician', city: 'Miami, FL', metro: 'South FL', trade: 'Electrical' },
  { term: 'air conditioning', city: 'Fort Lauderdale, FL', metro: 'South FL', trade: 'HVAC' },
  { term: 'plumber', city: 'Fort Lauderdale, FL', metro: 'South FL', trade: 'Plumbing' },
  // Orlando
  { term: 'plumber', city: 'Orlando, FL', metro: 'Central FL', trade: 'Plumbing' },
  { term: 'roofing', city: 'Orlando, FL', metro: 'Central FL', trade: 'Roofing' },
  { term: 'air conditioning', city: 'Orlando, FL', metro: 'Central FL', trade: 'HVAC' },
  { term: 'electrician', city: 'Orlando, FL', metro: 'Central FL', trade: 'Electrical' },
  // Jacksonville
  { term: 'plumber', city: 'Jacksonville, FL', metro: 'North FL', trade: 'Plumbing' },
  { term: 'roofing', city: 'Jacksonville, FL', metro: 'North FL', trade: 'Roofing' },
  { term: 'air conditioning', city: 'Jacksonville, FL', metro: 'North FL', trade: 'HVAC' },
  // Palm Beach
  { term: 'plumber', city: 'West Palm Beach, FL', metro: 'Palm Beach', trade: 'Plumbing' },
  { term: 'roofing', city: 'West Palm Beach, FL', metro: 'Palm Beach', trade: 'Roofing' },
  { term: 'air conditioning', city: 'Boca Raton, FL', metro: 'Palm Beach', trade: 'HVAC' },
  // Naples & Fort Myers
  { term: 'plumber', city: 'Fort Myers, FL', metro: 'SW Florida', trade: 'Plumbing' },
  { term: 'roofing', city: 'Naples, FL', metro: 'SW Florida', trade: 'Roofing' }
];

async function scrapeMoreYP() {
  console.log('=== SCRAPING MORE REAL FLORIDA CONTRACTORS ===');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
  });

  const existingRaw = fs.existsSync('data/yp_scraped_raw.json') 
    ? JSON.parse(fs.readFileSync('data/yp_scraped_raw.json', 'utf8')) 
    : [];

  const seenPhones = new Set(existingRaw.map(x => x.cleanPhone));
  let added = 0;

  for (const t of MORE_TARGETS) {
    // Wait 3 seconds between targets
    await new Promise(r => setTimeout(r, 3000));
    const url = `https://www.yellowpages.com/search?search_terms=${encodeURIComponent(t.term)}&geo_location_terms=${encodeURIComponent(t.city)}`;
    console.log(`Querying ${t.term} in ${t.city}...`);

    try {
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      if (res.status() === 429) {
        console.warn(`Got 429 on ${t.city}, backing off 6s...`);
        await new Promise(r => setTimeout(r, 6000));
        continue;
      }

      const items = await page.evaluate(() => {
        const list = [];
        document.querySelectorAll('.result, .v-card, .info-section').forEach(el => {
          const nameEl = el.querySelector('.business-name span') || el.querySelector('.business-name') || el.querySelector('h2 a');
          const phoneEl = el.querySelector('.phone');
          const addrEl = el.querySelector('.street-address');
          const locEl = el.querySelector('.locality');
          const webEl = el.querySelector('.track-visit-website');
          const ratingEl = el.querySelector('.rating-count, .count, .rating');
          const yearsEl = el.querySelector('.years-in-business, .years-with-yp');

          if (nameEl && phoneEl) {
            list.push({
              name: nameEl.textContent.trim(),
              phone: phoneEl.textContent.trim(),
              street: addrEl ? addrEl.textContent.trim() : '',
              locality: locEl ? locEl.textContent.trim() : '',
              hasWeb: !!webEl,
              webUrl: webEl ? webEl.getAttribute('href') : null,
              rating: ratingEl ? ratingEl.textContent.trim() : '',
              years: yearsEl ? yearsEl.textContent.trim() : ''
            });
          }
        });
        return list;
      });

      console.log(`  -> Found ${items.length} raw results`);
      for (const item of items) {
        const cleanDigits = item.phone.replace(/\D/g, '');
        if (cleanDigits.length < 10) continue;
        if (seenPhones.has(cleanDigits)) continue;
        seenPhones.add(cleanDigits);

        existingRaw.push({
          ...item,
          cleanPhone: cleanDigits,
          targetCity: t.city,
          metro: t.metro,
          trade: t.trade
        });
        added++;
      }
      console.log(`  Total database now: ${existingRaw.length} (Newly added: ${added})`);
    } catch(e) {
      console.warn(`  Failed: ${e.message}`);
    }
  }

  await browser.close();

  fs.writeFileSync('data/yp_scraped_raw.json', JSON.stringify(existingRaw, null, 2), 'utf8');
  console.log(`\nDONE. Total records: ${existingRaw.length}`);
  console.log(`Zero Website Total: ${existingRaw.filter(x => !x.hasWeb).length}`);
}

scrapeMoreYP();
