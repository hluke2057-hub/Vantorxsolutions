// scripts/fix_last_registry_19.js
// Resolves the ~19 remaining edge-case Florida contractor entities against DBPR & Sunbiz
// so zero unrelated Sunbiz corporate names exist in the registry cache.

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { toTitleCaseBusiness, parsePersonName, cleanBaseCompanyName } = require('./verify_all_leads_sunbiz_dbpr.js');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CACHE_PATH = path.resolve('data/sunbiz_dbpr_registry_cache.json');
const cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));

// Exact alternate trade/corporate search terms for tricky DBA names
const ALT_QUERIES = {
  "donovan air, electric & plumbing": { sunbiz: "DONOVAN HEAT & AIR", dbpr: "DONOVAN HEAT" },
  "charlie's tropic heating & air": { sunbiz: "CHARLIE'S TROPIC", dbpr: "CHARLIE'S TROPIC" },
  "service experts miami": { sunbiz: "SERVICE EXPERTS HEATING", dbpr: "SERVICE EXPERTS" },
  "billy the sunshine plumber": { sunbiz: "BILLY THE SUNSHINE PLUMBER OF ST", dbpr: "BILLY THE SUNSHINE" },
  "thumb cooling & heating": { sunbiz: "THUMB COOLING", dbpr: "THUMB COOLING" },
  "abram roofing": { sunbiz: "ABRAM ROOFING", dbpr: "ABRAM ROOFING" },
  "pro-tec plumbing and air": { sunbiz: "PRO-TEC PLUMBING", dbpr: "PRO-TEC PLUMBING" },
  "kelly air systems": { sunbiz: "KELLY AIR SYSTEMS", dbpr: "KELLY AIR SYSTEMS" },
  "electrical by langer electric co.": { sunbiz: "LANGER ELECTRIC COMPANY", dbpr: "LANGER ELECTRIC" },
  "plumbing, cooling & electrical nerds": { sunbiz: "PLUMBING NERDS", dbpr: "PLUMBING NERDS" },
  "plumbing cooling electrical nerds": { sunbiz: "PLUMBING NERDS", dbpr: "PLUMBING NERDS" },
  "orlando ac and air conditioning pros": { sunbiz: "ORLANDO AC", dbpr: "ORLANDO AC" },
  "florida breaker & led electric": { sunbiz: "FLORIDA BREAKER", dbpr: "FLORIDA BREAKER" },
  "ecopowertech electrical": { sunbiz: "ECOPOWERTECH", dbpr: "ECOPOWERTECH" },
  "revildor roofing & repair orlando": { sunbiz: "REVILDOR", dbpr: "REVILDOR" },
  "air docs heating & cooling": { sunbiz: "AIR DOCS", dbpr: "AIR DOCS" },
  "flowpro plumbing clearwater": { sunbiz: "FLOWPRO PLUMBING", dbpr: "FLOWPRO" },
  "isteta roofing": { sunbiz: "ISTETA", dbpr: "ISTETA" },
  "seminole power & electric": { sunbiz: "SEMINOLE POWER", dbpr: "SEMINOLE POWER" }
};

async function queryDBPRByTerm(term) {
  const params = new URLSearchParams({
    hSID: '', hSearchType: 'Name', hLastName: '', hFirstName: '', hMiddleName: '',
    hOrgName: term.toUpperCase(), hSearchOpt: 'Organization', hSearchOpt2: '', hSearchAltName: 'Alt',
    hSearchPartName: 'Part', hSearchFuzzy: '', hDivision: 'ALL', hBoard: '',
    hLicenseType: '', hSpecQual: '', hAddrType: '', hCity: '', hCounty: '', hState: 'FL',
    hLicNbr: '', hAction: '', hCurrPage: '', hTotalPages: '', hTotalRecords: '',
    hPageAction: '', hDDChange: '', hBoardType: '', hLicTyp: '', hSearchHistoric: '',
    hRecsPerPage: '50', LastName: '', FirstName: '', MiddleName: '',
    OrgName: term.toUpperCase(), SearchPartName: 'Part', Board: '', LicenseType: '', SpecQual: '',
    City: '', County: '', State: 'FL', RecsPerPage: '50', Search1: 'Search'
  });
  const res = await fetch('https://www.myfloridalicense.com/wl11.asp?mode=2&search=Name&SID=&brd=&typ=', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString()
  });
  const html = await res.text();
  const sr = html.indexOf('Search Results');
  if (sr === -1) return null;
  const lics = [...new Set(html.slice(sr).match(/\b(CAC|CCC|CFC|CBC|CGC|CMC|CPC|EC|ER|FRO|SCC|RX)\d{5,8}\b/g) || [])];
  for (const licNbr of lics.slice(0, 4)) {
    const lp = new URLSearchParams({
      hSID: '', hSearchType: 'LicNbr', hLastName: '', hFirstName: '', hMiddleName: '',
      hOrgName: '', hSearchOpt: 'LicNbr', hSearchOpt2: '', hSearchAltName: 'Alt',
      hSearchPartName: '', hSearchFuzzy: '', hDivision: 'ALL', hBoard: '',
      hLicenseType: '', hSpecQual: '', hAddrType: '', hCity: '', hCounty: '', hState: '',
      hLicNbr: licNbr, hAction: '', hCurrPage: '', hTotalPages: '', hTotalRecords: '',
      hPageAction: '', hDDChange: '', hBoardType: '', hLicTyp: '', hSearchHistoric: '',
      hRecsPerPage: '50', LicNbr: licNbr, RecsPerPage: '50', Search1: 'Search'
    });
    const r2 = await fetch('https://www.myfloridalicense.com/wl11.asp?mode=2&search=LicNbr&SID=&brd=&typ=', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: lp.toString()
    });
    const h2 = await r2.text();
    const s2 = h2.indexOf('Search Results');
    if (s2 === -1) continue;
    const clean2 = h2.slice(s2).replace(/&amp;/gi, '&').replace(/&apos;&apos;/gi, "'").replace(/&apos;/gi, "'").replace(/&nbsp;/gi, ' ').replace(/<[^>]+>/g, '|').replace(/\s+/g, ' ');
    const pM = clean2.match(/\|([A-Z]+,\s*[A-Z\s.\-']+)\|\|\|\|\|Primary\|\|\|\|([A-Z0-9]+)/i);
    const dM = clean2.match(/\|([A-Z0-9\s.,&'\-/]+)\|\|\|\|\|DBA\|\|\|\|([A-Z0-9]+)/i);
    const holder = pM ? parsePersonName(pM[1].trim()) : null;
    if (holder) return { licNbr, dbaName: dM ? dM[1].trim() : null, holder };
  }
  return null;
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH, headless: 'new',
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0');

  for (const [k, q] of Object.entries(ALT_QUERIES)) {
    const entry = cache[k];
    if (!entry) continue;

    const dbpr = await queryDBPRByTerm(q.dbpr);
    const order = q.sunbiz.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const sUrl = `https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResults?inquiryType=EntityName&searchNameOrder=${order}&searchTerm=${encodeURIComponent(q.sunbiz)}`;
    await page.goto(sUrl, { waitUntil: 'domcontentloaded', timeout: 12000 });
    const rows = await page.evaluate(() => Array.from(document.querySelectorAll('#search-results table tbody tr')).slice(0, 8).map(tr => {
      const a = tr.querySelector('td a');
      const tds = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
      return { name: a ? a.innerText.trim() : '', href: a ? a.href : '', docNum: tds[1] || '', status: tds[2] || '' };
    }));

    const firstWord = q.sunbiz.split(/\s+/)[0].replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const matched = rows.filter(r => r.name.replace(/[^A-Za-z0-9]/g, '').toUpperCase().includes(firstWord) && !/analytics|polymer|kellyale|charlie & sun|access inc|company of miami|thumbeck|abrams and company/i.test(r.name));
    const best = matched.find(r => r.status === 'Active') || matched[0] || null;

    let holder = dbpr ? dbpr.holder : null;
    let officerTitle = 'Principal Officer';
    if (best && best.href) {
      await page.goto(best.href, { waitUntil: 'domcontentloaded', timeout: 12000 });
      const detail = await page.evaluate(() => {
        const secs = Array.from(document.querySelectorAll('.detailSection'));
        const off = secs.find(s => s.innerText.includes('Officer/Director Detail') || s.innerText.includes('Authorized Person(s) Detail'));
        const ra = secs.find(s => s.innerText.includes('Registered Agent Name & Address'));
        return { off: off ? off.innerText : '', ra: ra ? ra.innerText : '' };
      });
      if (!holder && detail.off) {
        const lines = detail.off.split('\n').map(x => x.trim()).filter(Boolean);
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('Title')) {
            const p = parsePersonName(lines[i + 1]);
            if (p) { holder = p; officerTitle = lines[i].replace(/^Title\s*/i, '').trim() || 'President'; break; }
          }
        }
      }
      if (!holder && detail.ra) {
        const lines = detail.ra.split('\n').map(x => x.trim()).filter(Boolean);
        for (let i = 1; i < Math.min(4, lines.length); i++) {
          const p = parsePersonName(lines[i]);
          if (p) { holder = p; officerTitle = 'Registered Agent & Principal'; break; }
        }
      }
    }

    const officialCompany = best ? toTitleCaseBusiness(best.name) : ((dbpr && dbpr.dbaName) ? toTitleCaseBusiness(dbpr.dbaName) : entry.originalName);
    const fallbackSearch = `https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResults?inquiryType=EntityName&searchNameOrder=${cleanBaseCompanyName(officialCompany).replace(/[^A-Za-z0-9]/g,'').toUpperCase()}&searchTerm=${encodeURIComponent(cleanBaseCompanyName(officialCompany))}`;

    cache[k] = {
      ...entry,
      officialCompanyName: officialCompany,
      holderFirstName: holder ? holder.firstName : null,
      holderFullName: holder ? holder.fullName : null,
      officialTitle: dbpr ? `Licensed Qualifier (${dbpr.licNbr}) & ${officerTitle}` : (best ? `${officerTitle} · Sunbiz #${best.docNum}` : 'Verified Trade Principal'),
      licenseNumber: dbpr ? dbpr.licNbr : null,
      sunbizDocNum: best ? best.docNum : null,
      sunbizStatus: best ? best.status : (dbpr ? 'Active (DBPR)' : 'FL Sunbiz Search'),
      sunbizUrl: best ? best.href : fallbackSearch
    };
    console.log(`Updated: ${entry.originalName} => ${cache[k].officialCompanyName} | Holder: ${cache[k].holderFullName || 'NONE'} | Doc: ${cache[k].sunbizDocNum || 'search'}`);
  }

  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
  await browser.close();
})();
