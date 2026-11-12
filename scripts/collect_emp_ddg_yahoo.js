// scripts/collect_emp_ddg_yahoo.js
// Queries PitchBook, ZoomInfo, LeadIQ, and SignalHire employee counts using DDG + Yahoo
// gently paced to avoid search engine rate limits, preserving existing verified hits.

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CACHE_PATH = path.resolve('data/emp_intelligence_cache.json');
const REG_CACHE_PATH = path.resolve('data/sunbiz_dbpr_registry_cache.json');

let empCache = fs.existsSync(CACHE_PATH) ? JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')) : {};
const regCache = JSON.parse(fs.readFileSync(REG_CACHE_PATH, 'utf8'));

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
  const matched = checkWords.filter(w => txt.includes(w.toLowerCase()));
  if (checkWords.length === 1) return matched.length === 1;
  return matched.length >= Math.min(2, checkWords.length);
}

function parseEmployeeCount(text, source) {
  if (!text) return null;
  const rangeM = text.match(/\b(\d{1,4})\s*-\s*(\d{1,5})\s*(?:\+\s*)?(?:employees|associates|staff)\b/i)
    || text.match(/company size[:\s]*(\d{1,4})\s*-\s*(\d{1,5})/i);
  if (rangeM) {
    const lo = parseInt(rangeM[1], 10);
    const hi = parseInt(rangeM[2], 10);
    if (lo >= 1 && hi >= lo && hi <= 10000) {
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

// Filter to ONLY those without consensusEstimate (or already finished <= 175)
const targets = Array.from(targetsMap.entries()).filter(([k]) => {
  const c = empCache[k];
  return !c || (!c.consensusEstimate && c.engine !== 'ddg_yahoo');
});

console.log(`Remaining companies to enrich via DDG/Yahoo (PitchBook/ZoomInfo/LeadIQ/SignalHire): ${targets.length} (already cached: ${Object.values(empCache).filter(x=>x.consensusEstimate).length} live hits)`);

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const CONCURRENCY = 2; // Gentle 2 tabs alternating DDG & Yahoo
  const pages = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    const p = await browser.newPage();
    await p.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0');
    pages.push(p);
  }

  let idx = 0;
  let done = 0;
  let newHits = 0;

  async function worker(wid) {
    const page = pages[wid];
    while (true) {
      const myIdx = idx++;
      if (myIdx >= targets.length) break;
      const [key, info] = targets[myIdx];
      const shortName = cleanName(info.origName);
      const platforms = {};

      // Use DDG HTML for even indices, Yahoo for odd indices to spread traffic evenly
      const q = `"${shortName}" ${info.city} zoominfo OR signalhire OR leadiq OR pitchbook employees`;
      try {
        if (myIdx % 2 === 0) {
          await page.goto('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q), { waitUntil: 'domcontentloaded', timeout: 12000 });
          const results = await page.evaluate(() => Array.from(document.querySelectorAll('.result')).slice(0, 7).map(r => ({
            title: (r.querySelector('.result__a') || {}).innerText || '',
            url: (r.querySelector('.result__url') || {}).innerText || '',
            desc: (r.querySelector('.result__snippet') || {}).innerText || ''
          })));
          for (const r of results) {
            const full = `${r.title} ${r.url} ${r.desc}`;
            if (!isResultForCompany(r.title + ' ' + r.desc, info.origName)) continue;
            let plat = null;
            if (/zoominfo/i.test(full)) plat = 'ZoomInfo';
            else if (/signalhire/i.test(full)) plat = 'SignalHire';
            else if (/leadiq/i.test(full)) plat = 'LeadIQ';
            else if (/pitchbook/i.test(full)) plat = 'PitchBook';
            if (plat && !platforms[plat]) {
              const p = parseEmployeeCount(r.title + ' ' + r.desc, plat);
              if (p) platforms[plat] = p;
            }
          }
        } else {
          await page.goto('https://search.yahoo.com/search?p=' + encodeURIComponent(q), { waitUntil: 'domcontentloaded', timeout: 12000 });
          const results = await page.evaluate(() => Array.from(document.querySelectorAll('#web ol li, .algo')).slice(0, 7).map(el => ({
            title: (el.querySelector('h3, a') || {}).innerText || '',
            url: (el.querySelector('a') || {}).href || '',
            desc: el.innerText.replace(/\s+/g, ' ')
          })));
          for (const r of results) {
            const full = `${r.title} ${r.url} ${r.desc}`;
            if (!isResultForCompany(r.title + ' ' + r.desc, info.origName)) continue;
            let plat = null;
            if (/zoominfo/i.test(full)) plat = 'ZoomInfo';
            else if (/signalhire/i.test(full)) plat = 'SignalHire';
            else if (/leadiq/i.test(full)) plat = 'LeadIQ';
            else if (/pitchbook/i.test(full)) plat = 'PitchBook';
            if (plat && !platforms[plat]) {
              const p = parseEmployeeCount(r.title + ' ' + r.desc, plat);
              if (p) platforms[plat] = p;
            }
          }
        }
      } catch (e) {}

      await new Promise(r => setTimeout(r, 450));

      const estimates = Object.values(platforms).map(p => p.estimate).sort((a, b) => a - b);
      const consensus = estimates.length > 0 ? estimates[Math.floor(estimates.length / 2)] : null;

      if (consensus || !empCache[key]) {
        empCache[key] = {
          company: info.origName,
          platforms,
          consensusEstimate: consensus,
          engine: 'ddg_yahoo',
          checkedAt: new Date().toISOString()
        };
      } else {
        empCache[key].engine = 'ddg_yahoo';
      }

      done++;
      if (consensus) newHits++;

      if (done % 25 === 0 || done === targets.length) {
        fs.writeFileSync(CACHE_PATH, JSON.stringify(empCache, null, 2), 'utf8');
        console.log(`[${done}/${targets.length}] New DDG/Yahoo Hits: ${newHits} | Latest: ${info.origName} -> ${consensus ? consensus + ' (' + Object.keys(platforms).join('/') + ')' : 'none'}`);
      }
    }
  }

  await Promise.all(pages.map((_, i) => worker(i)));
  fs.writeFileSync(CACHE_PATH, JSON.stringify(empCache, null, 2), 'utf8');
  await browser.close();
  console.log(`DONE! New DDG/Yahoo live hits: ${newHits}`);
})();
