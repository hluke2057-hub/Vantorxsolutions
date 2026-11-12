const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const {
  queryDBPR,
  querySunbizOnPage,
  toTitleCaseBusiness,
  parsePersonName,
  cleanBaseCompanyName
} = require('./verify_all_leads_sunbiz_dbpr.js');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CACHE_PATH = path.resolve(__dirname, '..', 'data', 'sunbiz_dbpr_registry_cache.json');

let cache = {};
if (fs.existsSync(CACHE_PATH)) {
  try { cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')); } catch (e) {}
}

function saveCache() {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
}

// Collect all candidate Florida contractors across our files
const rvl = require('../data/real_verified_leads.json');
const fnw = require('../data/florida_100_no_website_leads.json');
const p1 = require('./leads_data_cylex_part1.js');
const p2 = require('./leads_data_cylex_part2.js');

const allCompanyNames = new Set();

// 1. All FL companies in real_verified_leads.json
rvl.filter(x => x.state === 'FL').forEach(x => allCompanyNames.add(x.company));

// 2. All 100 companies in florida_100_no_website_leads.json
fnw.forEach(x => allCompanyNames.add(x.company));

// 3. All FL contractor companies in leads_data_cylex_part1.js & part2.js
[...p1.batch1Raw, ...p1.batch2Raw, ...p1.batch3Raw, ...p1.batch4Raw.filter(x => x.state === 'FL'), ...p2.batch5Raw.filter(x => x.state === 'FL' && !/Ferguson|ABC Supply|Beacon|SRS|Michel|Rexel|Lowe|Tire Kingdom|Super Store|Izard/i.test(x.company))]
  .forEach(x => allCompanyNames.add(x.company));

const companyList = [...allCompanyNames];
console.log(`Total unique Florida companies to verify against DBPR + Sunbiz: ${companyList.length}`);

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const CONCURRENCY = 8;
  const pages = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    const p = await browser.newPage();
    await p.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0');
    pages.push(p);
  }

  let idx = 0;
  let completed = 0;
  let verifiedCount = 0;

  async function worker(workerId) {
    const page = pages[workerId];
    while (true) {
      const myIdx = idx++;
      if (myIdx >= companyList.length) break;
      const comp = companyList[myIdx];
      const key = comp.toLowerCase().trim();

      if (cache[key] && (cache[key].holderFullName || cache[key].checkedAt)) {
        completed++;
        if (cache[key].holderFullName) verifiedCount++;
        continue;
      }

      const dbpr = await queryDBPR(comp);
      const sunbiz = await querySunbizOnPage(page, comp, dbpr);

      // Determine official registered business name
      const officialRawName = (sunbiz && sunbiz.sunbizName) || (dbpr && dbpr.dbaName) || comp;
      const officialCompanyName = toTitleCaseBusiness(officialRawName);

      // Determine official license holder / corporate officer
      const holderObj = (dbpr && dbpr.holder) || (sunbiz && sunbiz.officer) || null;
      const licenseNumber = (dbpr && dbpr.licNbr) || null;
      const sunbizDocNum = (sunbiz && sunbiz.sunbizDocNum) || null;
      const sunbizStatus = (sunbiz && sunbiz.sunbizStatus) || (licenseNumber ? 'Active (DBPR)' : 'Registered');

      const searchOrder = cleanBaseCompanyName(officialCompanyName).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      const sunbizUrl = (sunbiz && sunbiz.sunbizUrl) ||
        `https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResults?inquiryType=EntityName&searchNameOrder=${searchOrder}&searchTerm=${encodeURIComponent(cleanBaseCompanyName(officialCompanyName))}`;

      let officialTitle = 'State Licensed Qualifier & Principal';
      if (licenseNumber && sunbiz && sunbiz.officerTitle) {
        officialTitle = `Licensed Qualifier (${licenseNumber}) & ${sunbiz.officerTitle}`;
      } else if (licenseNumber) {
        officialTitle = `State License Holder (${licenseNumber})`;
      } else if (sunbiz && sunbiz.officerTitle && sunbizDocNum) {
        officialTitle = `${sunbiz.officerTitle} · Sunbiz #${sunbizDocNum}`;
      }

      cache[key] = {
        originalName: comp,
        officialCompanyName,
        officialRawName,
        holderFirstName: holderObj ? holderObj.firstName : null,
        holderFullName: holderObj ? holderObj.fullName : null,
        officialTitle,
        licenseNumber,
        sunbizDocNum,
        sunbizStatus,
        sunbizUrl,
        dbprDba: dbpr ? dbpr.dbaName : null,
        dbprHolderRaw: dbpr ? dbpr.holderRaw : null,
        sunbizOfficerRaw: sunbiz && sunbiz.officer ? sunbiz.officer.raw : null,
        checkedAt: new Date().toISOString()
      };

      completed++;
      if (holderObj) verifiedCount++;

      if (completed % 20 === 0 || completed === companyList.length) {
        saveCache();
        console.log(`[${completed}/${companyList.length}] Verified w/ Real Holder: ${verifiedCount} | Latest: ${comp} -> ${officialCompanyName} | Holder: ${holderObj ? holderObj.fullName : 'NONE'} (${licenseNumber || sunbizDocNum || 'no-doc'})`);
      }
    }
  }

  await Promise.all(pages.map((_, i) => worker(i)));
  saveCache();
  await browser.close();
  console.log(`DONE! Total checked: ${completed}, Verified with real human license holder/officer: ${verifiedCount}`);
})();
