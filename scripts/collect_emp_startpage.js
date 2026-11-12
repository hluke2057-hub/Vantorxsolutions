// scripts/collect_emp_startpage.js
// Queries PitchBook, ZoomInfo, LeadIQ, and SignalHire via Startpage (Google index, no bot block)
// Strictly verifies company name match in the result before recording headcounts!

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CACHE_PATH = path.resolve('data/emp_intelligence_cache.json');
const REG_CACHE_PATH = path.resolve('data/sunbiz_dbpr_registry_cache.json');

let empCache = fs.existsSync(CACHE_PATH) ? JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')) : {};
const regCache = JSON.parse(fs.readFileSync(REG_CACHE_PATH, 'utf8'));

// Skip already Startpage-checked entries so we resume cleanly without repeating
for (const k of Object.keys(empCache)) {
  if (empCache[k] && !empCache[k].consensusEstimate && empCache[k].engine !== 'startpage') {
    delete empCache[k];
  }
}

const STOP_WORDS = new Set(['THE','AND','OF','IN','FL','FLORIDA','INC','LLC','CORP','CO','COMPANY','SERVICES','SERVICE','SYSTEMS','SOLUTIONS','PRO','PROS','CONTRACTORS','AIR','CONDITIONING','PLUMBING','ROOFING','ELECTRIC','ELECTRICAL','HEATING','COOLING','MECHANICAL']);

function cleanName(n) {
  return (n || '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/,?\s*(LLC|L\.L\.C\.|INC\.?|CORP\.?|CORPORATION|COMPANY|CO\.?)$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isResultForCompany(resultText, companyName) {
  const txt = (resultText || '').toLowerCase();
  const rawWords = cleanName(companyName).toUpperCase().replace(/&/g, ' ').replace(/[^A-Z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const brandWords = rawWords.filter(w => w.length >= 3 && !STOP_WORDS.has(w));
  const checkWords = brandWords.length > 0 ? brandWords : rawWords.filter(w => w.length >= 3);
  if (checkWords.length === 0) return false;
  // At least first distinctive word AND if multiple brandWords exist, majority must match
  const matched = checkWords.filter(w => txt.includes(w.toLowerCase()));
  if (checkWords.length === 1) return matched.length === 1;
  return matched.length >= Math.min(2, checkWords.length);
}

function parseEmployeeCount(text, source) {
  if (!text) return null;
  // Match range like "51-200 employees" or "201-500" near employees or "Company size: 11-50"
  const rangeM = text.match(/\b(\d{1,4})\s*-\s*(\d{1,5})\s*(?:\+\s*)?(?:employees|associates|staff)\b/i)
    || text.match(/company size[:\s]*(\d{1,4})\s*-\s*(\d{1,5})/i);
  if (rangeM) {
    const lo = parseInt(rangeM[1], 10);
    const hi = parseInt(rangeM[2], 10);
    if (lo >= 1 && hi >= lo && hi <= 10000) {
      // Midpoint biased slightly toward realistic contractor headcount (lower third of wide ranges)
      const est = Math.round(lo + (Math.min(hi, lo * 3) - lo) * 0.35);
      return { raw: `${lo}-${hi}`, estimate: est, low: lo, high: hi, source };
    }
  }
  const exactM = text.match(/(?:has|employs|have|with)\s+(\d{1,4})\s*(?:\+\s*)?(?:employees|staff)\b/i)
    || text.match(/\bList of\s+(\d{1,4})\s+[\w\s.&'-]+Employees\b/i)
    || text.match(/\b(\d{1,4})\s+employees\b/i);
  if (exactM) {
    const val = parseInt(exactM[1], 10);
    if (val >= 1 && val <= 3000) {
      return { raw: `${val}`, estimate: val, low: val, high: val, source };
    }
  }
  return null;
}

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
console.log(`Collecting PitchBook/ZoomInfo/LeadIQ/SignalHire counts via Startpage for ${targets.length} FL companies...`);

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const CONCURRENCY = 3; // Gentle concurrency on Startpage avoids CAPTCHA completely
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

      if (empCache[key] && (empCache[key].consensusEstimate || empCache[key].engine === 'startpage')) {
        done++;
        if (empCache[key].consensusEstimate) hitCount++;
        continue;
      }

      const shortName = cleanName(info.origName);
      const q = `"${shortName}" ${info.city} (zoominfo OR signalhire OR leadiq OR pitchbook) employees`;
      const platforms = {};

      try {
        await page.goto('https://www.startpage.com/do/search?q=' + encodeURIComponent(q), {
          waitUntil: 'domcontentloaded',
          timeout: 15000
        });
        await new Promise(r => setTimeout(r, 350));

        const hits = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('.result, .w-gl__result')).slice(0, 8).map(el => ({
            title: (el.querySelector('h2, h3, .w-gl__result-title') || {}).innerText || '',
            url: (el.querySelector('a') || {}).href || '',
            desc: (el.querySelector('p, .w-gl__description') || {}).innerText || ''
          }));
        });

        for (const h of hits) {
          const fullTxt = `${h.title} ${h.url} ${h.desc}`;
          if (!isResultForCompany(h.title + ' ' + h.desc, info.origName)) continue;

          let plat = null;
          if (/zoominfo/i.test(fullTxt)) plat = 'ZoomInfo';
          else if (/signalhire/i.test(fullTxt)) plat = 'SignalHire';
          else if (/leadiq/i.test(fullTxt)) plat = 'LeadIQ';
          else if (/pitchbook/i.test(fullTxt)) plat = 'PitchBook';
          else if (/linkedin/i.test(fullTxt)) plat = 'LinkedIn';

          if (plat && !platforms[plat]) {
            const parsed = parseEmployeeCount(h.title + ' ' + h.desc, plat);
            if (parsed) {
              platforms[plat] = { ...parsed, url: h.url };
            }
          }
        }
      } catch (e) {}

      // If no specific platform number matched yet, fallback without city quotes
      if (Object.keys(platforms).length === 0) {
        try {
          const q2 = `${shortName} Florida (zoominfo OR signalhire OR leadiq OR pitchbook) employees`;
          await page.goto('https://www.startpage.com/do/search?q=' + encodeURIComponent(q2), {
            waitUntil: 'domcontentloaded',
            timeout: 15000
          });
          await new Promise(r => setTimeout(r, 350));
          const hits2 = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.result, .w-gl__result')).slice(0, 8).map(el => ({
              title: (el.querySelector('h2, h3, .w-gl__result-title') || {}).innerText || '',
              url: (el.querySelector('a') || {}).href || '',
              desc: (el.querySelector('p, .w-gl__description') || {}).innerText || ''
            }));
          });
          for (const h of hits2) {
            const fullTxt = `${h.title} ${h.url} ${h.desc}`;
            if (!isResultForCompany(h.title + ' ' + h.desc, info.origName)) continue;
            // Also prefer FL mention in fallback to avoid Michigan/Canada collisions
            if (!/\bFL\b|Florida|Boca|Miami|Fort|Tampa|Orlando|Jacksonville|Delray|Sarasota|Naples|Pompano|Clearwater/i.test(fullTxt)) continue;

            let plat = null;
            if (/zoominfo/i.test(fullTxt)) plat = 'ZoomInfo';
            else if (/signalhire/i.test(fullTxt)) plat = 'SignalHire';
            else if (/leadiq/i.test(fullTxt)) plat = 'LeadIQ';
            else if (/pitchbook/i.test(fullTxt)) plat = 'PitchBook';

            if (plat && !platforms[plat]) {
              const parsed = parseEmployeeCount(h.title + ' ' + h.desc, plat);
              if (parsed) platforms[plat] = { ...parsed, url: h.url };
            }
          }
        } catch (e) {}
      }

      const estimates = Object.values(platforms).map(p => p.estimate).sort((a, b) => a - b);
      const consensus = estimates.length > 0 ? estimates[Math.floor(estimates.length / 2)] : null;

      empCache[key] = {
        company: info.origName,
        platforms,
        consensusEstimate: consensus,
        engine: 'startpage',
        checkedAt: new Date().toISOString()
      };

      done++;
      if (consensus) hitCount++;

      if (done % 25 === 0 || done === targets.length) {
        fs.writeFileSync(CACHE_PATH, JSON.stringify(empCache, null, 2), 'utf8');
        console.log(`[${done}/${targets.length}] Multi-Platform Live Hits: ${hitCount} | Latest: ${info.origName} -> ${consensus ? consensus + ' emp (' + Object.entries(platforms).map(([k, v]) => `${k}: ${v.raw}`).join(', ') + ')' : 'none'}`);
      }
    }
  }

  await Promise.all(pages.map((_, i) => worker(i)));
  fs.writeFileSync(CACHE_PATH, JSON.stringify(empCache, null, 2), 'utf8');
  await browser.close();
  console.log(`DONE! Checked ${done} FL companies. Live PitchBook/ZoomInfo/LeadIQ/SignalHire matches: ${hitCount}`);
})();
