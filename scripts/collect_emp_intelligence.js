// scripts/collect_emp_intelligence.js
// Queries ZoomInfo, SignalHire, LeadIQ, and PitchBook snippets via Yahoo Search
// to build accurate, multi-source employee count estimates for Florida contractors.

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CACHE_PATH = path.resolve('data/emp_intelligence_cache.json');
const REG_CACHE_PATH = path.resolve('data/sunbiz_dbpr_registry_cache.json');

let empCache = fs.existsSync(CACHE_PATH) ? JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')) : {};
const regCache = JSON.parse(fs.readFileSync(REG_CACHE_PATH, 'utf8'));

function cleanName(n) {
  return (n || '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/,?\s*(LLC|L\.L\.C\.|INC\.?|CORP\.?|CORPORATION|COMPANY|CO\.?)$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseEmployeeNumbers(text, sourceHint) {
  if (!text) return null;
  // Pattern 1: "has 26 employees", "employs 14 employees", "158 employees", "51-200 employees"
  const rangeM = text.match(/\b(\d{1,4})\s*-\s*(\d{1,5})\s*(?:\+\s*)?employees\b/i);
  if (rangeM) {
    const low = parseInt(rangeM[1], 10);
    const high = parseInt(rangeM[2], 10);
    if (low >= 1 && high <= 10000) {
      return {
        raw: `${low}-${high}`,
        estimate: Math.round((low + Math.min(high, low * 3)) / 2),
        source: sourceHint
      };
    }
  }
  const exactM = text.match(/(?:has|employs|have|with|of|list of)\s+(\d{1,4})\s*(?:\+\s*)?(?:employees|staff)?\b|\b(\d{1,4})\s*(?:\+\s*)?employees\b/i);
  if (exactM) {
    const val = parseInt(exactM[1] || exactM[2], 10);
    if (val >= 1 && val <= 5000) {
      return { raw: `${val}`, estimate: val, source: sourceHint };
    }
  }
  return null;
}

// Get unique company+city list from real_verified_leads + florida_100 + cylex FL
const rvl = require('../data/real_verified_leads.json');
const fnw = require('../data/florida_100_no_website_leads.json');
const p1 = require('./leads_data_cylex_part1.js');
const p2 = require('./leads_data_cylex_part2.js');

const targetsMap = new Map();
const addTarget = (comp, city, trade) => {
  const k = comp.toLowerCase().trim();
  if (!targetsMap.has(k)) {
    const reg = regCache[k];
    targetsMap.set(k, {
      origName: comp,
      officialName: (reg && reg.officialCompanyName) || comp,
      city: (city || 'Florida').split(',')[0].trim(),
      trade: trade || 'Contractor'
    });
  }
};

rvl.filter(x => x.state === 'FL').forEach(x => addTarget(x.company, x.city, x.trade));
fnw.forEach(x => addTarget(x.company, x.city, x.trade));
[...p1.batch1Raw, ...p1.batch2Raw, ...p1.batch3Raw, ...p1.batch4Raw.filter(x => x.state === 'FL'), ...p2.batch5Raw.filter(x => x.state === 'FL' && !/Ferguson|ABC Supply|Beacon|SRS|Michel|Rexel|Lowe|Tire Kingdom|Super Store|Izard/i.test(x.company))]
  .forEach(x => addTarget(x.company, x.city, x.trade));

const targets = Array.from(targetsMap.entries());
console.log(`Collecting PitchBook/ZoomInfo/LeadIQ/SignalHire employee intelligence for ${targets.length} Florida companies...`);

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const CONCURRENCY = 6;
  const pages = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    const p = await browser.newPage();
    await p.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0');
    pages.push(p);
  }

  let idx = 0;
  let done = 0;
  let hitCount = 0;

  async function worker(wid) {
    const page = pages[wid];
    while (true) {
      const myIdx = idx++;
      if (myIdx >= targets.length) break;
      const [key, info] = targets[myIdx];

      if (empCache[key] && empCache[key].checkedAt) {
        done++;
        if (Object.keys(empCache[key].platforms || {}).length > 0) hitCount++;
        continue;
      }

      const shortName = cleanName(info.origName);
      const platforms = {};

      // Query 1: ZoomInfo + SignalHire + LeadIQ + PitchBook combined on Yahoo
      const queries = [
        `"${shortName}" ${info.city} (zoominfo OR signalhire OR leadiq OR pitchbook) employees`,
        `${shortName} Florida (zoominfo OR signalhire OR pitchbook) employees`
      ];

      for (const q of queries) {
        try {
          await page.goto('https://search.yahoo.com/search?p=' + encodeURIComponent(q), {
            waitUntil: 'domcontentloaded',
            timeout: 12000
          });
          const results = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('#web ol li, .algo')).slice(0, 8).map(el => ({
              title: el.querySelector('h3, a')?.innerText || '',
              url: el.querySelector('a')?.href || '',
              txt: el.innerText.replace(/\s+/g, ' ')
            }));
          });

          for (const r of results) {
            const combined = `${r.title} ${r.url} ${r.txt}`;
            const firstWord = shortName.split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '');
            if (firstWord.length >= 3 && !combined.toLowerCase().includes(firstWord)) continue;

            let plat = null;
            if (/zoominfo/i.test(combined)) plat = 'ZoomInfo';
            else if (/signalhire/i.test(combined)) plat = 'SignalHire';
            else if (/leadiq/i.test(combined)) plat = 'LeadIQ';
            else if (/pitchbook/i.test(combined)) plat = 'PitchBook';

            if (plat && !platforms[plat]) {
              const parsed = parseEmployeeNumbers(r.title + ' ' + r.txt, plat);
              if (parsed) {
                platforms[plat] = parsed;
              }
            }
          }
        } catch (e) {}
        if (Object.keys(platforms).length >= 2) break;
      }

      const estimates = Object.values(platforms).map(p => p.estimate).sort((a, b) => a - b);
      const medianEst = estimates.length > 0
        ? estimates[Math.floor(estimates.length / 2)]
        : null;

      empCache[key] = {
        company: info.origName,
        platforms,
        consensusEstimate: medianEst,
        checkedAt: new Date().toISOString()
      };

      done++;
      if (estimates.length > 0) hitCount++;

      if (done % 25 === 0 || done === targets.length) {
        fs.writeFileSync(CACHE_PATH, JSON.stringify(empCache, null, 2), 'utf8');
        console.log(`[${done}/${targets.length}] Multi-source hits: ${hitCount} | Latest: ${info.origName} -> ${medianEst ? medianEst + ' emp (' + Object.keys(platforms).join('/') + ')' : 'fallback directory/estimate'}`);
      }
    }
  }

  await Promise.all(pages.map((_, i) => worker(i)));
  fs.writeFileSync(CACHE_PATH, JSON.stringify(empCache, null, 2), 'utf8');
  await browser.close();
  console.log(`DONE! Checked ${done} companies. Live PitchBook/ZoomInfo/LeadIQ/SignalHire hits: ${hitCount}`);
})();
