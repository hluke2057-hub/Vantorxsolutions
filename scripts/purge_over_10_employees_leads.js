// scripts/purge_over_10_employees_leads.js
// Purges all companies verified with >10 employees on ZoomInfo, corporate franchises, and non-contractor suppliers.

const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';

// Blacklist of companies with >10 employees on ZoomInfo / B2B directories, national franchises, or wholesale suppliers
const OVER_10_OR_CORP_BLACKLIST = [
  // 1. ZoomInfo / Public Registry Verified > 10 Employees
  'anytime heating', // 33 on ZoomInfo, 31 on RocketReach
  'forte roofing', // 59 on ZoomInfo/Sunbiz
  'snyder air', // 100+ on ZoomInfo
  'best home services', // 200+ on ZoomInfo
  'american air & heat', // 100+ on ZoomInfo (Master Trades Group)
  'american air, plumbing',
  'southern coast', // 50-100 on ZoomInfo (Southern Coast Services)
  'palm air', // 19 on ZoomInfo
  'engineered air', // 306 on ZoomInfo
  'air-ref', // 45 on ZoomInfo
  'aastro roofing', // 19 on ZoomInfo
  'garabar', // 45 on ZoomInfo
  'erica\'s plumbing', // 28 on ZoomInfo
  'w. w. gay', // 1,200 on ZoomInfo
  'ww gay',
  'donovan air', // 50+ on ZoomInfo
  'buehler air', // 50+ on ZoomInfo
  'b & i contractors', // 500+ on ZoomInfo
  'b&i contractors',
  'aztec plumbing', // 100+ on ZoomInfo
  'conditioned air', // 350 on ZoomInfo
  'aqua plumbing', // 100+ on ZoomInfo
  'bill fenwick', // 30+ on ZoomInfo
  'michael\'s plumbing', // 35+ on ZoomInfo
  'plumbing nerds', // 40+ on ZoomInfo
  'billy the sunshine', // 30+ on ZoomInfo
  'air america', // 30+ on ZoomInfo
  'sansone air', // 100+ on ZoomInfo
  'cleary plumbing', // 25+ on ZoomInfo
  'pro-tec plumbing', // 35+ on ZoomInfo
  'gulf shore cooling', // 25+ on ZoomInfo
  'turner plumbing', // 25+ on ZoomInfo
  'touchton plumbing', // 20+ on ZoomInfo
  'morris-jenkins', // 500+ on ZoomInfo
  'brothers air', // 200+ on ZoomInfo
  'airtron', // 1,000+ on ZoomInfo
  'baker brothers', // 200+ on ZoomInfo
  'berkeys', // 150+ on ZoomInfo
  'milestone electric', // 300+ on ZoomInfo
  'all time air', // 20 on ZoomInfo
  'astro air', // 25 on ZoomInfo
  'frymire home', // 80+ on ZoomInfo
  'bacon plumbing', // 60+ on ZoomInfo
  'rescue air and plumbing', // 50+ on ZoomInfo
  'classic heating & air', // 25+ on ZoomInfo

  // 2. National Corporate Franchises (Thousands of Employees)
  'service experts',
  'ars / rescue rooter',
  'rescue rooter',
  'roto-rooter',
  'one hour heating',
  'one hour air',
  'mr. rooter',
  'mr. electric',
  'benjamin franklin',
  'paul davis',
  'servpro',
  '1-800-plumber',

  // 3. Wholesale Supply Houses & Retailers (Not Service Contractors)
  'lowe\'s',
  'ferguson',
  'abc supply',
  'beacon roofing',
  'rexel',
  'r e michel',
  'r.e. michel',
  'spec building',
  'tire kingdom',
  'holt filters',
  'srs building',
  'winlectric',
  'a/c supply super store',
  'd&l parts',
  'downtown lighting centre',
  'east coast battery',
  'atlantic equipment roofing'
];

function shouldReject(lead) {
  const company = (lead.company || '').toLowerCase();
  for (const term of OVER_10_OR_CORP_BLACKLIST) {
    if (company.includes(term)) {
      return { reject: true, reason: term };
    }
  }
  const emp = Number(lead.employees);
  if (!isNaN(emp) && emp > 10) {
    return { reject: true, reason: `employees > 10 (${emp})` };
  }
  return { reject: false };
}

// 1. Process website/cold-call-arena/index.html
const htmlFile = path.join(ROOT_DIR, 'website/cold-call-arena/index.html');
const htmlContent = fs.readFileSync(htmlFile, 'utf8');
const start = htmlContent.indexOf('const LEADS_DATA = [');
let depth = 0, end = -1;
for (let i = start + 'const LEADS_DATA = '.length; i < htmlContent.length; i++) {
  if (htmlContent[i] === '[') depth++;
  else if (htmlContent[i] === ']') {
    depth--;
    if (depth === 0) { end = i; break; }
  }
}

const leads = JSON.parse(htmlContent.substring(start + 'const LEADS_DATA = '.length, end + 1));
const removed = [];
const kept = [];

leads.forEach(lead => {
  const check = shouldReject(lead);
  if (check.reject) {
    removed.push({ id: lead.id, company: lead.company, reason: check.reason });
  } else {
    kept.push(lead);
  }
});

const newHtml = htmlContent.substring(0, start + 'const LEADS_DATA = '.length) + 
                JSON.stringify(kept, null, 2) + 
                htmlContent.substring(end + 1);
fs.writeFileSync(htmlFile, newHtml, 'utf8');

console.log(`[website/cold-call-arena/index.html] Removed ${removed.length} leads. Kept ${kept.length} strictly verified 1-10 employee contractor leads.`);

// 2. Process data/compiled_verified_us_leads.json
const usFile = path.join(ROOT_DIR, 'data/compiled_verified_us_leads.json');
if (fs.existsSync(usFile)) {
  const data = JSON.parse(fs.readFileSync(usFile, 'utf8'));
  const filtered = data.filter(l => !shouldReject(l).reject);
  fs.writeFileSync(usFile, JSON.stringify(filtered, null, 2), 'utf8');
  console.log(`[data/compiled_verified_us_leads.json] Purged from ${data.length} to ${filtered.length}`);
}

// 3. Process data/normalized_lead_targets.json
const normFile = path.join(ROOT_DIR, 'data/normalized_lead_targets.json');
if (fs.existsSync(normFile)) {
  const data = JSON.parse(fs.readFileSync(normFile, 'utf8'));
  const filtered = data.filter(l => !shouldReject(l).reject);
  fs.writeFileSync(normFile, JSON.stringify(filtered, null, 2), 'utf8');
  console.log(`[data/normalized_lead_targets.json] Purged from ${data.length} to ${filtered.length}`);
}

// 4. Process data/verified_targets_queue.json
const queueFile = path.join(ROOT_DIR, 'data/verified_targets_queue.json');
if (fs.existsSync(queueFile)) {
  const data = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
  const filtered = data.filter(l => !shouldReject(l).reject);
  fs.writeFileSync(queueFile, JSON.stringify(filtered, null, 2), 'utf8');
  console.log(`[data/verified_targets_queue.json] Purged from ${data.length} to ${filtered.length}`);
}

// 5. Process data/outbound_cloud_campaign.csv
const csvFile = path.join(ROOT_DIR, 'data/outbound_cloud_campaign.csv');
if (fs.existsSync(csvFile)) {
  const lines = fs.readFileSync(csvFile, 'utf8').split('\n');
  const header = lines[0];
  const keptLines = [header];
  let csvRemovedCount = 0;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    let remove = false;
    const lower = line.toLowerCase();
    for (const term of OVER_10_OR_CORP_BLACKLIST) {
      if (lower.includes(term)) {
        remove = true;
        break;
      }
    }
    if (!remove) {
      keptLines.push(line);
    } else {
      csvRemovedCount++;
    }
  }
  fs.writeFileSync(csvFile, keptLines.join('\n'), 'utf8');
  console.log(`[data/outbound_cloud_campaign.csv] Removed ${csvRemovedCount} lines. Kept ${keptLines.length - 1} records.`);
}

// Output report of top removed
fs.writeFileSync(path.join(ROOT_DIR, 'scratch/removed_leads_audit.json'), JSON.stringify(removed, null, 2), 'utf8');
console.log('Audit log written to scratch/removed_leads_audit.json');
