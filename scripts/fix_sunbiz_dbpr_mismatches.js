const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const {
  decodeHtml,
  cleanBaseCompanyName,
  toTitleCaseBusiness,
  parsePersonName
} = (() => {
  // Reuse helpers from verify_all_leads_sunbiz_dbpr
  const base = require('./verify_all_leads_sunbiz_dbpr.js');
  return {
    cleanBaseCompanyName: base.cleanBaseCompanyName,
    toTitleCaseBusiness: base.toTitleCaseBusiness,
    parsePersonName: base.parsePersonName
  };
})();

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CACHE_PATH = path.resolve(__dirname, '..', 'data', 'sunbiz_dbpr_registry_cache.json');
const cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));

const NON_CONTRACTOR_BLACKLIST = /\b(ANESTHESIA|AUTO NETWORK|BROKER|BROKERAGE|HOME CARE|IMPROVEMENT ASSOCIATION|SALON|BAKERY|CHURCH|DENTAL|MEDICAL|PHARMACY|RESTAURANT|TRUCKING|LOGISTICS|INSURANCE|APPLIANCES|SCREENS|PARKER, SMITH)\b/i;

const STOP_WORDS = new Set([
  'THE', 'AND', 'OF', 'IN', 'AT', 'BY', 'FOR', 'A', 'AN', 'FL', 'FLORIDA',
  'INC', 'LLC', 'LLP', 'CORP', 'CORPORATION', 'COMPANY', 'CO', 'LTD', 'LP', 'PLLC', 'PA',
  'SERVICES', 'SERVICE', 'SYSTEMS', 'SYSTEM', 'SOLUTIONS', 'CONTRACTORS', 'CONTRACTING',
  'PRO', 'PROS', 'EXPERTS', 'MASTERS', 'COMPANY', 'GROUP', 'SPECIALISTS', 'BROTHERS', 'SONS'
]);

const TRADE_WORDS = new Set([
  'AIR', 'AC', 'A/C', 'HVAC', 'CONDITIONING', 'COOLING', 'HEATING', 'HEAT', 'REFRIGERATION', 'MECHANICAL', 'COMFORT',
  'PLUMBING', 'PLUMBER', 'PLUMBERS', 'DRAIN', 'ROOTER', 'SEWER', 'WATER', 'SEPTIC', 'PIPE',
  'ROOF', 'ROOFING', 'ROOFER', 'ROOFERS', 'WINDOWS', 'DOORS', 'EXTERIORS',
  'ELECTRIC', 'ELECTRICAL', 'ELECTRICIANS', 'POWER', 'LIGHTING', 'SOLAR', 'BREAKER',
  'RESTORATION', 'REMEDIATION', 'CLEANUP', 'MOLD', 'DAMAGE', 'CONSTRUCTION', 'BUILDERS', 'HOME'
]);

function extractWords(str) {
  return (str || '')
    .toUpperCase()
    .replace(/&/g, ' ')
    .replace(/[^A-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 2 && !STOP_WORDS.has(w));
}

function scoreEntityMatch(candidateName, targetName) {
  if (!candidateName || !targetName) return -999;
  if (NON_CONTRACTOR_BLACKLIST.test(candidateName)) return -999;

  const cWords = extractWords(candidateName);
  const tWords = extractWords(targetName);
  const cBrandWords = cWords.filter(w => !TRADE_WORDS.has(w));
  const tBrandWords = tWords.filter(w => !TRADE_WORDS.has(w));

  let brandMatches = 0;
  for (const tw of tBrandWords) {
    if (cWords.some(cw => cw === tw || (tw.length >= 4 && cw.startsWith(tw)) || (cw.length >= 4 && tw.startsWith(cw)))) {
      brandMatches++;
    }
  }

  // Must match at least one distinctive brand word (or all trade words if no brand words)
  if (tBrandWords.length > 0 && brandMatches === 0) return -500;
  // Require majority of distinctive brand words when target has multiple brand words
  if (tBrandWords.length >= 2 && brandMatches < 2) {
    // Allow 1 only if cBrandWords only has 1 word and matches tBrandWords[0] AND trade matches
    if (!(brandMatches === 1 && tBrandWords[0] === cBrandWords[0])) return -200;
  }
  // Reject if candidate adds extra unrelated brand words
  const extraBrand = cBrandWords.filter(cw => !tBrandWords.some(tw => cw === tw || cw.startsWith(tw) || tw.startsWith(cw)));
  if (extraBrand.length > 1) return -200;

  let tradeMatches = 0;
  for (const tw of tWords.filter(w => TRADE_WORDS.has(w))) {
    if (cWords.includes(tw)) tradeMatches++;
  }

  // Check conflicting trade domain (e.g. target has PLUMBING, candidate has POWER/APPLIANCE and NO plumbing/pipe/mechanical)
  if (targetName.match(/PLUMB/i) && candidateName.match(/POWER|ELECTRIC|ROOF/i) && !candidateName.match(/PLUMB|MECHANICAL|HOME|SERVICE|CONTRACT/i)) {
    return -500;
  }
  if (targetName.match(/ELECTRIC/i) && candidateName.match(/HOME CARE|IMPROVEMENT ASSOCIATION|ANESTHESIA/i)) {
    return -500;
  }

  return (brandMatches * 40) + (tradeMatches * 15) - (extraBrand.length * 25);
}

function needsReverify(entry) {
  if (!entry) return true;
  if (!entry.holderFullName || !entry.sunbizDocNum) return true;
  const s = scoreEntityMatch(entry.officialCompanyName, entry.originalName);
  return s < 25;
}

const toFix = Object.entries(cache).filter(([, v]) => needsReverify(v));
console.log(`Total cache entries: ${Object.keys(cache).length} | Entries needing clean re-verification: ${toFix.length}`);

async function queryDBPRStrict(companyName) {
  const base = cleanBaseCompanyName(companyName);
  const terms = [...new Set([
    base,
    base.replace(/[,.'"]/g, ' ').replace(/\s+/g, ' ').trim(),
    extractWords(base).slice(0, 3).join(' '),
    extractWords(base).slice(0, 2).join(' ')
  ].filter(t => t.length >= 4))];

  for (const term of terms) {
    try {
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
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });
      const html = await res.text();
      const srIdx = html.indexOf('Search Results');
      if (srIdx === -1) continue;
      const sub = html.slice(srIdx);
      const licMatches = [...new Set(sub.match(/\b(CAC|CCC|CFC|CBC|CGC|CMC|CPC|EC|ER|FRO|SCC|RX)\d{5,8}\b/g) || [])];
      if (licMatches.length === 0) continue;

      let bestResult = null;
      let bestScore = -999;

      for (const licNbr of licMatches.slice(0, 6)) {
        const licParams = new URLSearchParams({
          hSID: '', hSearchType: 'LicNbr', hLastName: '', hFirstName: '', hMiddleName: '',
          hOrgName: '', hSearchOpt: 'LicNbr', hSearchOpt2: '', hSearchAltName: 'Alt',
          hSearchPartName: '', hSearchFuzzy: '', hDivision: 'ALL', hBoard: '',
          hLicenseType: '', hSpecQual: '', hAddrType: '', hCity: '', hCounty: '', hState: '',
          hLicNbr: licNbr, hAction: '', hCurrPage: '', hTotalPages: '', hTotalRecords: '',
          hPageAction: '', hDDChange: '', hBoardType: '', hLicTyp: '', hSearchHistoric: '',
          hRecsPerPage: '50', LicNbr: licNbr, RecsPerPage: '50', Search1: 'Search'
        });
        const res2 = await fetch('https://www.myfloridalicense.com/wl11.asp?mode=2&search=LicNbr&SID=&brd=&typ=', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: licParams.toString()
        });
        const html2 = await res2.text();
        const sr2 = html2.indexOf('Search Results');
        if (sr2 === -1) continue;
        const clean2 = html2.slice(sr2)
          .replace(/&amp;/gi, '&').replace(/&apos;&apos;/gi, "'").replace(/&apos;/gi, "'").replace(/&nbsp;/gi, ' ')
          .replace(/<[^>]+>/g, '|').replace(/\s+/g, ' ');
        const primaryMatch = clean2.match(/\|([A-Z]+,\s*[A-Z\s.\-']+)\|\|\|\|\|Primary\|\|\|\|([A-Z0-9]+)/i);
        const dbaMatch = clean2.match(/\|([A-Z0-9\s.,&'\-/]+)\|\|\|\|\|DBA\|\|\|\|([A-Z0-9]+)/i);
        const dbaName = dbaMatch ? dbaMatch[1].trim() : null;
        const holderRaw = primaryMatch ? primaryMatch[1].trim() : null;
        const sc = dbaName ? scoreEntityMatch(dbaName, companyName) : 0;
        const parsedHolder = parsePersonName(holderRaw);
        if (parsedHolder && sc > bestScore && sc >= 0) {
          bestScore = sc;
          bestResult = { licNbr, dbaName, holderRaw, holder: parsedHolder };
        }
      }
      if (bestResult) return bestResult;
    } catch (e) {}
  }
  return null;
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0');

  let fixed = 0;
  for (const [key, entry] of toFix) {
    const comp = entry.originalName;
    const dbpr = await queryDBPRStrict(comp);

    // Search Sunbiz by multiple candidate names + Officer search if DBPR holder exists
    const cands = [cleanBaseCompanyName(comp)];
    if (dbpr && dbpr.dbaName) cands.unshift(cleanBaseCompanyName(dbpr.dbaName));
    const bw = extractWords(comp).slice(0, 2).join(' ');
    if (bw.length >= 5) cands.push(bw);

    let bestRow = null;
    let bestRowScore = 20; // minimum score threshold

    for (const term of [...new Set(cands)]) {
      const order = term.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      const url = `https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResults?inquiryType=EntityName&searchNameOrder=${order}&searchTerm=${encodeURIComponent(term)}`;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 12000 });
        const rows = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('#search-results table tbody tr')).slice(0, 12).map(tr => {
            const a = tr.querySelector('td a');
            const tds = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
            return { name: a ? a.innerText.trim() : '', href: a ? a.href : '', docNum: tds[1] || '', status: tds[2] || '' };
          });
        });
        for (const r of rows) {
          let sc = scoreEntityMatch(r.name, comp);
          if (r.status === 'Active') sc += 25;
          if (sc > bestRowScore) {
            bestRowScore = sc;
            bestRow = r;
          }
        }
      } catch (e) {}
      if (bestRowScore >= 80) break;
    }

    // If still no great Sunbiz match & DBPR has a holder, search Sunbiz by Officer Name
    if (!bestRow && dbpr && dbpr.holderRaw) {
      try {
        const offUrl = `https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResults?inquiryType=OfficerRegisteredAgentName&searchTerm=${encodeURIComponent(dbpr.holderRaw)}`;
        await page.goto(offUrl, { waitUntil: 'domcontentloaded', timeout: 12000 });
        const rows = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('#search-results table tbody tr')).slice(0, 10).map(tr => {
            const a = tr.querySelector('td a');
            const tds = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
            return { name: tds[1] || '', href: a ? a.href : '', docNum: tds[2] || '', status: 'Active' };
          });
        });
        for (const r of rows) {
          const sc = scoreEntityMatch(r.name, comp);
          if (sc > bestRowScore) {
            bestRowScore = sc;
            bestRow = r;
          }
        }
      } catch (e) {}
    }

    let officer = dbpr ? dbpr.holder : null;
    let officerTitle = 'Principal Officer';
    if (bestRow && bestRow.href) {
      try {
        await page.goto(bestRow.href, { waitUntil: 'domcontentloaded', timeout: 12000 });
        const detail = await page.evaluate(() => {
          const secs = Array.from(document.querySelectorAll('.detailSection'));
          const offSec = secs.find(s => s.innerText.includes('Officer/Director Detail') || s.innerText.includes('Authorized Person(s) Detail'));
          const raSec = secs.find(s => s.innerText.includes('Registered Agent Name & Address'));
          return { offText: offSec ? offSec.innerText : '', raText: raSec ? raSec.innerText : '' };
        });
        if (!officer && detail.offText) {
          const lines = detail.offText.split('\n').map(x => x.trim()).filter(Boolean);
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('Title')) {
              const p = parsePersonName(lines[i + 1]);
              if (p) {
                officer = p;
                officerTitle = lines[i].replace(/^Title\s*/i, '').trim() || 'President';
                break;
              }
            }
          }
        }
        if (!officer && detail.raText) {
          const lines = detail.raText.split('\n').map(x => x.trim()).filter(Boolean);
          for (let i = 1; i < Math.min(4, lines.length); i++) {
            const p = parsePersonName(lines[i]);
            if (p) { officer = p; officerTitle = 'Registered Agent & Principal'; break; }
          }
        }
      } catch (e) {}
    }

    const cleanOfficialName = bestRow ? toTitleCaseBusiness(bestRow.name) : ((dbpr && dbpr.dbaName) ? toTitleCaseBusiness(dbpr.dbaName) : comp);
    const searchOrder = cleanBaseCompanyName(cleanOfficialName).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const fallbackUrl = `https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResults?inquiryType=EntityName&searchNameOrder=${searchOrder}&searchTerm=${encodeURIComponent(cleanBaseCompanyName(cleanOfficialName))}`;

    // Keep previous DBPR holder ONLY if previous holder came from a non-bad DBA (otherwise use strict holder)
    const finalHolder = officer || (scoreEntityMatch(entry.officialCompanyName, comp) >= 0 && entry.holderFullName ? { firstName: entry.holderFirstName, fullName: entry.holderFullName } : null);
    const finalLic = dbpr ? dbpr.licNbr : (scoreEntityMatch(entry.officialCompanyName, comp) >= 0 ? entry.licenseNumber : null);

    cache[key] = {
      ...entry,
      officialCompanyName: cleanOfficialName,
      holderFirstName: finalHolder ? finalHolder.firstName : null,
      holderFullName: finalHolder ? finalHolder.fullName : null,
      officialTitle: finalLic ? `Licensed Qualifier (${finalLic}) & ${officerTitle}` : (bestRow ? `${officerTitle} · Sunbiz #${bestRow.docNum}` : 'Registered Florida Trade Principal'),
      licenseNumber: finalLic,
      sunbizDocNum: bestRow ? bestRow.docNum : null,
      sunbizStatus: bestRow ? bestRow.status : (finalLic ? 'Active (DBPR)' : 'FL Registry Search'),
      sunbizUrl: bestRow ? bestRow.href : fallbackUrl,
      reverifiedAt: new Date().toISOString()
    };
    fixed++;
    console.log(`Fixed [${fixed}/${toFix.length}]: ${comp} -> ${cache[key].officialCompanyName} | Holder: ${cache[key].holderFullName || 'NONE'} | Doc: ${cache[key].sunbizDocNum || 'search'}`);
  }

  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
  await browser.close();
  console.log('Done fixing Sunbiz/DBPR cache!');
})();
