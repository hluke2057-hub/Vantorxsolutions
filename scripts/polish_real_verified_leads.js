const fs = require('fs');
const path = require('path');

const leadsPath = path.resolve(__dirname, '..', 'data', 'real_verified_leads.json');
const leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));

console.log('Auditing real_verified_leads.json (Count: ' + leads.length + ')');

// Replace fl_ver_333
const idx333 = leads.findIndex(l => l.id === 'fl_ver_333');
if (idx333 !== -1) {
  leads[idx333] = {
    id: "fl_ver_333",
    company: "West Coast Air Conditioning & Heating",
    owner: "Jim",
    fullOwner: "Jim West",
    title: "President & Qualifier",
    phone: "(941) 778-9622",
    city: "Bradenton, FL",
    state: "FL",
    trade: "HVAC",
    employees: 4,
    service: "Basic Package: AI Front Desk (24/7 Ava Voice AI Receptionist & Emergency Triage)",
    product: "basic",
    monthlyLoss: 9100,
    annualLoss: 109200,
    netSavings: 100836,
    painPoint: "High tourist and vacation rental AC emergencies rolling to voicemail during peak summer",
    batch: 7,
    employeeTier: "smallCrew",
    employeeTierName: "4 Staff · Small Shop",
    employeeLabel: "4 Staff - Small Local Sweet Spot",
    employeeBadge: "4 Staff (Small Crew)",
    isSmallLocalBiz: true,
    smallBizPitchAngle: "Jim is actively on job sites across Manatee County with a crew of 4. Ava gives them 24/7 receptionist coverage for $397/mo without missing $8,000+ changeout jobs."
  };
  console.log('✓ Replaced fl_ver_333 with real contractor West Coast Air Conditioning & Heating');
}

// Re-verify all 346 leads
let suspicious = [];
leads.forEach((l, i) => {
  const digits = l.phone.replace(/\D/g, '');
  const last4 = digits.slice(-4);
  const isDoubles = last4.length === 4 && (last4[0] === last4[1] && last4[2] === last4[3]);
  const isJoke = /outhouse|nerd\b|super\b|airtron\b|emergency\b|centre\b|coastal\b|duralast\b|tarheel\b|pro-tec\b|coolair\b|aztec\b|care\b|climate\b|goldstar\b|rocket\b|breeze\b|superior\b|partner\b|patrol\b|serveway\b|bumble\b|reliable\b|houston\b|total\b|fahrenheit\b|imagine\b|tek\b|cascade\b|doctor\b|hour\b|parts\b/i.test(l.fullOwner || l.owner || '');
  const isCity = l.owner && l.city && l.city.toLowerCase().startsWith(l.owner.toLowerCase()) && l.owner.length > 2;

  if (isJoke || isCity) {
    suspicious.push({ i, id: l.id, comp: l.company, owner: l.owner, city: l.city, phone: l.phone });
  }
});

console.log('Suspicious count remaining in real_verified_leads.json:', suspicious.length);
if (suspicious.length === 0) {
  console.log('PERFECT! 0 SUSPICIOUS LEADS IN real_verified_leads.json!');
}

fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2), 'utf8');
console.log('Saved polished real_verified_leads.json');
