const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CACHE_PATH = path.resolve(__dirname, '..', 'data', 'sunbiz_dbpr_registry_cache.json');

let cache = {};
if (fs.existsSync(CACHE_PATH)) {
  try { cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')); } catch (e) {}
}

const GENERIC_FIRST_WORDS = new Set([
  'THE', 'ALL', 'AMERICAN', 'FLORIDA', 'SOUTH', 'FIRST', 'BEST', 'ONE', 'TOTAL', 'UNITED',
  'GENERAL', 'QUALITY', 'ADVANCED', 'COASTAL', 'ELITE', 'PREMIER', 'EXPRESS', 'MODERN',
  'ACTION', 'ATLANTIC', 'SUNSHINE', 'PARADISE', 'PRECISION', 'PRO', 'A', 'A1', 'AA', 'AAA',
  'APEX', 'BLUE', 'CENTRAL', 'CITY', 'CLASSIC', 'CLEARWATER', 'COMMERCIAL', 'COMPLETE',
  'CROWN', 'CUSTOM', 'DAYTONA', 'DELRAY', 'DIRECT', 'DYNAMIC', 'EAST', 'EAGLE', 'EMERALD',
  'EMPIRE', 'EXPERT', 'EXPERTS', 'FAST', 'FAMILY', 'GOLD', 'GOLDEN', 'GREEN', 'GULF',
  'HOME', 'IDEAL', 'ISLAND', 'JACKSONVILLE', 'LAKE', 'LEE', 'LIBERTY', 'LOCAL', 'MASTER',
  'METRO', 'MIAMI', 'MR', 'NATIONAL', 'NEW', 'NORTH', 'OCEAN', 'ORLANDO', 'PALM', 'PEAK',
  'PERFECT', 'PINELLAS', 'PLATINUM', 'POWER', 'PRIME', 'PRIORITY', 'PROFESSIONAL', 'PURE',
  'QUICK', 'RELIABLE', 'RIVER', 'ROYAL', 'SAFE', 'SARASOTA', 'SERVICE', 'SILVER', 'SMART',
  'SOLAR', 'SPACE', 'STAR', 'STATE', 'SUN', 'SUNCOAST', 'SUPER', 'SUPERIOR', 'SUPREME',
  'TAMPA', 'TEAM', 'TECH', 'TOP', 'TOWN', 'TREASURE', 'TRI', 'TRUE', 'TRUST', 'ULTIMATE',
  'UNIVERSAL', 'USA', 'VALLEY', 'VERO', 'VICTORY', 'VILLAGE', 'WEST', 'YOUR'
]);

const CORP_RA_PATTERNS = /CORPORATION SERVICE|CT CORPORATION|REGISTERED AGENT|LEGALINC|INCFILE|ZENBUSINESS|NORTHWEST REGISTERED|UNITED STATES CORPORATION|INCORP SERVICES|COGENCY GLOBAL|NATIONAL REGISTERED|BUSINESS FILINGS|FILINGS INC|LLC|INC\.|CORP\.|COMPANY|L\.L\.C\.|SYSTEMS|SERVICES|SOLUTIONS|ENTERPRISES|GROUP|HOLDINGS|PARTNERS|ASSOCIATES|TRUST|BANK|LAW FIRM|ATTORNEY|P\.A\.|PLLC/i;

function decodeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/gi, '&')
    .replace(/&apos;&apos;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanBaseCompanyName(name) {
  return (name || '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/,?\s*(LLC|L\.L\.C\.|INC\.?|INCORPORATED|CORP\.?|CORPORATION|COMPANY|CO\.?)$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function toTitleCaseBusiness(rawName) {
  if (!rawName) return '';
  const clean = decodeHtml(rawName).replace(/\s+/g, ' ').trim();
  const upperWords = new Set(['LLC', 'L.L.C.', 'INC', 'INC.', 'CORP', 'CORP.', 'CO', 'CO.', 'A/C', 'AC', 'HVAC', 'USA', 'FL', 'II', 'III', 'IV', 'JR', 'JR.', 'SR', 'SR.', 'DBPR', 'LED', 'STS', 'EES', 'A2Z', 'DRG', 'TLC', 'RCI', 'ARS', 'USI', 'DAC', 'BSA', 'ADI', 'A.D.I.', 'ECM', 'ABC']);
  return clean.split(' ').map(w => {
    const bare = w.replace(/[,.;:]/g, '').toUpperCase();
    if (upperWords.has(bare) || upperWords.has(w.toUpperCase())) {
      return w.toUpperCase();
    }
    if (/^[A-Z]&[A-Z]$/i.test(bare)) return w.toUpperCase();
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(' ');
}

function parsePersonName(rawPerson) {
  if (!rawPerson) return null;
  let s = decodeHtml(rawPerson).replace(/\s+/g, ' ').trim();
  if (!s || CORP_RA_PATTERNS.test(s)) return null;
  if (/\d/.test(s)) return null;

  let first = '', last = '', middle = '', suffix = '';
  if (s.includes(',')) {
    // Format: LAST, FIRST MIDDLE SUFFIX
    const parts = s.split(',').map(p => p.trim()).filter(Boolean);
    if (parts.length < 2) return null;
    last = parts[0];
    const rest = parts.slice(1).join(' ').split(/\s+/).filter(Boolean);
    if (rest.length === 0) return null;
    first = rest[0];
    if (rest.length > 1) {
      const lastToken = rest[rest.length - 1].replace(/\./g, '').toUpperCase();
      if (['JR', 'SR', 'II', 'III', 'IV'].includes(lastToken)) {
        suffix = lastToken === 'JR' ? 'Jr.' : (lastToken === 'SR' ? 'Sr.' : lastToken);
        middle = rest.slice(1, -1).join(' ');
      } else {
        middle = rest.slice(1).join(' ');
      }
    }
  } else {
    const tokens = s.split(/\s+/).filter(Boolean);
    if (tokens.length < 2 || tokens.length > 4) return null;
    first = tokens[0];
    last = tokens[tokens.length - 1];
    if (tokens.length > 2) middle = tokens.slice(1, -1).join(' ');
  }

  const cap = (w) => {
    if (!w) return '';
    if (/^(II|III|IV)$/i.test(w)) return w.toUpperCase();
    if (/^Mc[a-zA-Z]+$/i.test(w)) return 'Mc' + w.charAt(2).toUpperCase() + w.slice(3).toLowerCase();
    if (/^O'[a-zA-Z]+$/i.test(w)) return "O'" + w.charAt(2).toUpperCase() + w.slice(3).toLowerCase();
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  };

  const cleanFirst = cap(first.replace(/[^A-Za-z'\-]/g, ''));
  const cleanLast = last.split('-').map(cap).join('-');
  if (cleanFirst.length < 2 || cleanLast.length < 2) return null;

  let full = `${cleanFirst} ${cleanLast}`;
  if (suffix) full += ` ${suffix}`;
  return {
    firstName: cleanFirst,
    fullName: full,
    raw: s
  };
}

function getDBPRSearchTerms(companyName) {
  const base = cleanBaseCompanyName(companyName);
  const terms = [base];
  // Also without punctuation
  const noPunct = base.replace(/[,.'"]/g, ' ').replace(/\s+/g, ' ').trim();
  if (noPunct !== base) terms.push(noPunct);

  // If has '&' or 'and', also try part before '&' if it has >= 2 words
  const beforeAmp = noPunct.split(/\s+(?:&|AND)\s+/i)[0].trim();
  if (beforeAmp && beforeAmp !== noPunct && beforeAmp.split(' ').length >= 2) {
    terms.push(beforeAmp);
  }

  const words = noPunct.split(' ');
  if (words.length >= 3) {
    terms.push(words.slice(0, 3).join(' '));
  }
  if (words.length >= 2) {
    const w0 = words[0].toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!GENERIC_FIRST_WORDS.has(w0) || words[1].length >= 4) {
      terms.push(words.slice(0, 2).join(' '));
    }
  }
  if (words[0] && words[0].length >= 6 && !GENERIC_FIRST_WORDS.has(words[0].toUpperCase().replace(/[^A-Z0-9]/g, ''))) {
    terms.push(words[0]);
  }
  return [...new Set(terms.filter(t => t.length >= 3))];
}

function doesNameMatchTarget(candidateName, targetCompany) {
  if (!candidateName || !targetCompany) return false;
  const norm = s => decodeHtml(s).toUpperCase().replace(/\b(THE|AND|OF|IN|FL|FLORIDA|SOUTH|NORTH|CENTRAL|WEST|EAST|INC|LLC|CORP|CORPORATION|COMPANY|CO)\b/g, ' ').replace(/[^A-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const cWords = decodeHtml(candidateName).toUpperCase().replace(/[^A-Z0-9\s]/g, ' ').trim().split(/\s+/).filter(Boolean);
  const tWords = cleanBaseCompanyName(targetCompany).toUpperCase().replace(/[^A-Z0-9\s]/g, ' ').trim().split(/\s+/).filter(Boolean);
  if (cWords.length === 0 || tWords.length === 0) return false;

  // Must match first word
  if (cWords[0] !== tWords[0]) {
    // Allow A/C <-> AC or AIRCONDITIONING
    if (cWords[0].replace(/[^A-Z0-9]/g, '') !== tWords[0].replace(/[^A-Z0-9]/g, '')) return false;
  }

  // If first word is generic and target has >= 2 words, second word must also match or be prefix
  if (GENERIC_FIRST_WORDS.has(tWords[0]) && tWords.length >= 2) {
    if (!cWords[1]) return false;
    const cw1 = cWords[1];
    const tw1 = tWords[1];
    if (cw1 !== tw1 && !cw1.startsWith(tw1) && !tw1.startsWith(cw1)) return false;
  }
  return true;
}

async function queryDBPR(companyName) {
  const terms = getDBPRSearchTerms(companyName);
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

      // Check top 3 license matches to find one whose DBA/Primary matches targetCompany
      for (const licNbr of licMatches.slice(0, 3)) {
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
        const clean2 = decodeHtml(html2.slice(sr2).replace(/<[^>]+>/g, '|'));
        const primaryMatch = clean2.match(/\|([A-Z]+,\s*[A-Z\s.\-']+)\|\|\|\|\|Primary\|\|\|\|([A-Z0-9]+)/i);
        const dbaMatch = clean2.match(/\|([A-Z0-9\s.,&'\-/]+)\|\|\|\|\|DBA\|\|\|\|([A-Z0-9]+)/i);
        const dbaName = dbaMatch ? dbaMatch[1].trim() : null;
        const holderRaw = primaryMatch ? primaryMatch[1].trim() : null;

        if (dbaName && !doesNameMatchTarget(dbaName, companyName) && !doesNameMatchTarget(dbaName, term)) {
          continue;
        }
        const parsedHolder = parsePersonName(holderRaw);
        if (parsedHolder || dbaName) {
          return {
            licNbr,
            dbaName,
            holderRaw,
            holder: parsedHolder
          };
        }
      }
    } catch (e) {}
  }
  return null;
}

async function querySunbizOnPage(page, companyName, dbprInfo) {
  const candidates = [];
  if (dbprInfo && dbprInfo.dbaName) candidates.push(cleanBaseCompanyName(dbprInfo.dbaName));
  candidates.push(cleanBaseCompanyName(companyName));
  const words = cleanBaseCompanyName(companyName).split(/\s+/);
  if (words.length >= 3) candidates.push(words.slice(0, 3).join(' '));
  if (words.length >= 2 && !GENERIC_FIRST_WORDS.has(words[0].toUpperCase().replace(/[^A-Z0-9]/g, ''))) {
    candidates.push(words.slice(0, 2).join(' '));
  }

  const uniqueCands = [...new Set(candidates.filter(Boolean))];

  for (const term of uniqueCands) {
    try {
      const order = term.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      const searchUrl = `https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResults?inquiryType=EntityName&searchNameOrder=${order}&searchTerm=${encodeURIComponent(term)}`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const rows = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('#search-results table tbody tr')).slice(0, 10).map(tr => {
          const a = tr.querySelector('td a');
          const tds = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
          return { name: a ? a.innerText.trim() : '', href: a ? a.href : '', docNum: tds[1] || '', status: tds[2] || '' };
        });
      });

      const matching = rows.filter(r => doesNameMatchTarget(r.name, term) || doesNameMatchTarget(r.name, companyName));
      if (matching.length === 0) continue;

      const best = matching.find(r => r.status === 'Active') || matching.find(r => r.status.startsWith('Act')) || matching[0];
      if (!best || !best.href) continue;

      await page.goto(best.href, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const detail = await page.evaluate(() => {
        const secs = Array.from(document.querySelectorAll('.detailSection'));
        const offSec = secs.find(s => s.innerText.includes('Officer/Director Detail') || s.innerText.includes('Authorized Person(s) Detail'));
        const raSec = secs.find(s => s.innerText.includes('Registered Agent Name & Address'));
        return {
          offText: offSec ? offSec.innerText : '',
          raText: raSec ? raSec.innerText : ''
        };
      });

      let officerPerson = null;
      let officerTitle = 'Principal Officer';
      if (detail.offText) {
        const lines = detail.offText.split('\n').map(x => x.trim()).filter(Boolean);
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('Title')) {
            const rawTitle = lines[i].replace(/^Title\s*/i, '').trim();
            // Look ahead 1-2 lines for the name
            for (let j = i + 1; j <= Math.min(i + 2, lines.length - 1); j++) {
              const p = parsePersonName(lines[j]);
              if (p) {
                officerPerson = p;
                officerTitle = rawTitle || 'President';
                break;
              }
            }
            if (officerPerson) break;
          }
        }
      }
      if (!officerPerson && detail.raText) {
        const lines = detail.raText.split('\n').map(x => x.trim()).filter(Boolean);
        for (let i = 1; i < Math.min(4, lines.length); i++) {
          const p = parsePersonName(lines[i]);
          if (p) {
            officerPerson = p;
            officerTitle = 'Registered Agent & Principal';
            break;
          }
        }
      }

      return {
        sunbizName: best.name,
        sunbizDocNum: best.docNum,
        sunbizStatus: best.status,
        sunbizUrl: best.href,
        officer: officerPerson,
        officerTitle
      };
    } catch (e) {}
  }

  // Fallback: if we have a DBPR license holder, search Sunbiz by Officer/RA Name!
  if (dbprInfo && dbprInfo.holderRaw) {
    try {
      const searchUrl = `https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResults?inquiryType=OfficerRegisteredAgentName&searchTerm=${encodeURIComponent(dbprInfo.holderRaw)}`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const rows = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('#search-results table tbody tr')).slice(0, 8).map(tr => {
          const a = tr.querySelector('td a');
          const tds = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
          return { officer: tds[0] || '', href: a ? a.href : '', entityName: tds[1] || '', docNum: tds[2] || '' };
        });
      });
      if (rows.length > 0 && rows[0].href) {
        const best = rows[0];
        return {
          sunbizName: best.entityName,
          sunbizDocNum: best.docNum,
          sunbizStatus: 'Active',
          sunbizUrl: best.href,
          officer: dbprInfo.holder,
          officerTitle: 'President & Qualifying Agent'
        };
      }
    } catch (e) {}
  }

  return null;
}

module.exports = {
  queryDBPR,
  querySunbizOnPage,
  toTitleCaseBusiness,
  parsePersonName,
  cleanBaseCompanyName
};
