const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';

const anytimeEntry = {
  id: 'ga_225',
  company: 'Anytime Heating, Cooling and Plumbing',
  owner: 'Jason',
  fullOwner: 'Jason Cole',
  title: 'Founder & President',
  phone: '(770) 504-5881',
  city: 'Alpharetta, GA',
  state: 'GA',
  trade: 'HVAC',
  service: 'Full Digital Infrastructure Bundle',
  product: 'ava',
  monthlyLoss: 15500,
  annualLoss: 186000,
  netSavings: 165000,
  painPoint: 'After-hours voicemail causing 80% of emergency breakdown callers to call next company',
  batch: 5,
  employees: 33,
  employeeRange: '19-33',
  employeeTier: 'regionalEnterprise',
  employeeTierName: '19-33 Staff · Regional Fleet (ZoomInfo Verified)',
  employeeLabel: '33 Staff (ZoomInfo Directory ID 384795916)',
  employeeBadge: '33 Staff (ZoomInfo)',
  isSmallLocalBiz: false,
  smallBizPitchAngle: 'Jason runs a regional operation of 33 staff across multiple service trucks. Inbound emergency calls peak after hours and on weekends when office dispatchers are off, causing lost changeouts.',
  employeeSource: 'ZoomInfo: 33 employees (ID 384795916) / RocketReach: 31 employees / PitchBook: 19 employees',
  website: 'https://www.anytimeheatingcoolingandplumbing.com',
  zoominfoUrl: 'https://www.zoominfo.com/pic/anytime-heating-and-cooling-inc/384795916',
  rocketreachUrl: 'https://rocketreach.co/anytime-heating-cooling-plumbing-management_b4724250fc5cd719',
  email: 'service@anytimeheatingcoolingand.com',
  source: 'zoominfo_verified'
};

// 1. Update website/cold-call-arena/index.html
const htmlFile = path.join(ROOT_DIR, 'website/cold-call-arena/index.html');
let content = fs.readFileSync(htmlFile, 'utf8');
const start = content.indexOf('const LEADS_DATA = [');
let depth = 0, end = -1;
for (let i = start + 'const LEADS_DATA = '.length; i < content.length; i++) {
  if (content[i] === '[') depth++;
  else if (content[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
}
const leads = JSON.parse(content.substring(start + 'const LEADS_DATA = '.length, end + 1));
const existingIndex = leads.findIndex(l => l.id === 'ga_225' || (l.company && l.company.includes('Anytime')));
if (existingIndex !== -1) {
  leads[existingIndex] = anytimeEntry;
} else {
  leads.unshift(anytimeEntry);
}
content = content.substring(0, start + 'const LEADS_DATA = '.length) + JSON.stringify(leads, null, 2) + content.substring(end + 1);
fs.writeFileSync(htmlFile, content, 'utf8');
console.log('Updated index.html with Anytime (33 employees, ZoomInfo verified)');

// 2. Update data/outbound_cloud_campaign.csv
const csvFile = path.join(ROOT_DIR, 'data/outbound_cloud_campaign.csv');
if (fs.existsSync(csvFile)) {
  const csvLines = fs.readFileSync(csvFile, 'utf8').split('\n');
  const anytimeCsv = '"ga_225","Anytime Heating, Cooling and Plumbing","Jason","service@anytimeheatingcoolingand.com","(770) 504-5881","Alpharetta, GA","HVAC","Full Digital Infrastructure Bundle","33","Quick question for Jason regarding Anytime Heating, Cooling and Plumbing emergency calls","$15,500/mo","01a197ef-c894-7b64-9321-6ede0a5d2012","2026-11-01T16:27:16.558Z"';
  let found = false;
  for (let i = 0; i < csvLines.length; i++) {
    if (csvLines[i].includes('ga_225') || csvLines[i].includes('Anytime Heating')) {
      csvLines[i] = anytimeCsv;
      found = true;
      break;
    }
  }
  if (!found) csvLines.push(anytimeCsv);
  fs.writeFileSync(csvFile, csvLines.join('\n'), 'utf8');
  console.log('Updated outbound_cloud_campaign.csv with 33 employees');
}

// 3. Update data/compiled_verified_us_leads.json
const jsonFile = path.join(ROOT_DIR, 'data/compiled_verified_us_leads.json');
if (fs.existsSync(jsonFile)) {
  const jsonLeads = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  const idx = jsonLeads.findIndex(l => l.id === 'ga_225' || (l.company && l.company.includes('Anytime')));
  if (idx !== -1) jsonLeads[idx] = anytimeEntry;
  else jsonLeads.unshift(anytimeEntry);
  fs.writeFileSync(jsonFile, JSON.stringify(jsonLeads, null, 2), 'utf8');
  console.log('Updated compiled_verified_us_leads.json with Anytime (33 employees)');
}

// 4. Update data/normalized_lead_targets.json
const normFile = path.join(ROOT_DIR, 'data/normalized_lead_targets.json');
if (fs.existsSync(normFile)) {
  const normLeads = JSON.parse(fs.readFileSync(normFile, 'utf8'));
  const idx = normLeads.findIndex(l => l.id === 'ga_225' || (l.company && l.company.includes('Anytime')));
  if (idx !== -1) normLeads[idx] = anytimeEntry;
  else normLeads.unshift(anytimeEntry);
  fs.writeFileSync(normFile, JSON.stringify(normLeads, null, 2), 'utf8');
  console.log('Updated normalized_lead_targets.json with Anytime (33 employees)');
}
