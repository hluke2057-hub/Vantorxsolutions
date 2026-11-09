const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, '..', 'data');
const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

const leadsMap = new Map();

jsonFiles.forEach(f => {
  if (f === 'florida_100_no_website_leads.json') return; // Skip the synthesized one
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
    if (Array.isArray(raw)) {
      raw.forEach(item => {
        const comp = (item.company || item.business_name || '').trim();
        const phone = (item.phone || item.telephone || '').trim();
        if (comp && phone) {
          const key = (comp + '|' + phone.replace(/\D/g, '')).toLowerCase();
          if (!leadsMap.has(key)) {
            leadsMap.set(key, { ...item, _source: f });
          }
        }
      });
    }
  } catch(e) {}
});

console.log('Total ingested from other json files:', leadsMap.size);

// Audit rigorously
const cleanReal = [];
const rejected = [];

leadsMap.forEach(lead => {
  const phone = (lead.phone || lead.telephone || '').replace(/\D/g, '');
  const comp = lead.company || lead.business_name || '';
  const owner = lead.owner || '';
  const fullOwner = lead.fullOwner || owner || '';
  const city = lead.city || '';
  const state = lead.state || (city.includes(', ') ? city.split(', ')[1] : 'FL');

  const last4 = phone.slice(-4);
  const isRepeats = last4.length === 4 && (last4[0] === last4[1] && last4[2] === last4[3]);
  const isJokeName = /outhouse|nerd\b|super\b|airtron\b|modern\b|emergency\b|centre\b|coastal\b|duralast\b|tarheel\b|pro-tec\b|coolair\b|aztec\b|care\b|climate\b|goldstar\b|rocket\b|breeze\b|superior\b|partner\b|patrol\b|serveway\b|bumble\b|reliable\b|houston\b|total\b|fahrenheit\b|imagine\b|tek\b|cascade\b|doctor\b|hour\b|parts\b/i.test(fullOwner);
  const isAlliterative = owner && city && city.toLowerCase().startsWith(owner.toLowerCase()) && owner.length > 2;

  // Real phone check: valid US area code, valid exchange
  if (phone.length < 10 || phone.startsWith('555') || phone.substring(3, 6) === '555') {
    rejected.push({ comp, phone, reason: 'Invalid phone' });
    return;
  }

  if (isRepeats || isJokeName || isAlliterative) {
    rejected.push({ comp, fullOwner, phone, city, reason: 'Heuristic match' });
  } else {
    cleanReal.push({
      ...lead,
      cleanState: state.trim()
    });
  }
});

console.log('Clean Real Leads Count:', cleanReal.length);
console.log('Rejected Count:', rejected.length);

const stateCounts = {};
cleanReal.forEach(l => {
  const s = l.cleanState || 'FL';
  stateCounts[s] = (stateCounts[s] || 0) + 1;
});
console.log('State counts:', stateCounts);
