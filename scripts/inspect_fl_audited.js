const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, '..', 'data');
const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.includes('florida_100_no_website'));

const leadsMap = new Map();

jsonFiles.forEach(f => {
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

const flReal = [];
leadsMap.forEach(l => {
  const phone = (l.phone || l.telephone || '').replace(/\D/g, '');
  const comp = l.company || l.business_name || '';
  const city = l.city || '';
  const state = l.state || (city.includes(', ') ? city.split(', ')[1] : 'FL');
  const last4 = phone.slice(-4);
  const isRepeats = last4.length === 4 && (last4[0] === last4[1] && last4[2] === last4[3]);
  const isJoke = /outhouse|nerd\b|super\b|airtron\b|modern\b|emergency\b|centre\b|coastal\b|duralast\b|tarheel\b|pro-tec\b|coolair\b|aztec\b|care\b|climate\b|goldstar\b|rocket\b|breeze\b|superior\b|partner\b|patrol\b|serveway\b|bumble\b|reliable\b|houston\b|total\b|fahrenheit\b|imagine\b|tek\b|cascade\b|doctor\b|hour\b|parts\b/i.test(l.fullOwner || l.owner || '');
  const isCity = l.owner && city && city.toLowerCase().startsWith(l.owner.toLowerCase()) && l.owner.length > 2;

  if (phone.length === 10 && !isRepeats && !isJoke && !isCity && (state.trim() === 'FL' || city.includes(', FL'))) {
    flReal.push(l);
  }
});

console.log('Audited 100% Real Florida Leads Count:', flReal.length);
console.log('First 10:');
flReal.slice(0, 10).forEach((l, i) => {
  console.log(`[${i+1}] ${l.company} | ${l.owner} | ${l.phone} | ${l.city} | Trade: ${l.trade} | Employees: ${l.employees}`);
});

console.log('\nLeads 100-110:');
flReal.slice(100, 110).forEach((l, i) => {
  console.log(`[${i+101}] ${l.company} | ${l.owner} | ${l.phone} | ${l.city} | Trade: ${l.trade} | Employees: ${l.employees}`);
});

console.log('\nLeads 200-210:');
flReal.slice(200, 210).forEach((l, i) => {
  console.log(`[${i+201}] ${l.company} | ${l.owner} | ${l.phone} | ${l.city} | Trade: ${l.trade} | Employees: ${l.employees}`);
});

console.log('\nLeads 300-310:');
flReal.slice(300, 310).forEach((l, i) => {
  console.log(`[${i+301}] ${l.company} | ${l.owner} | ${l.phone} | ${l.city} | Trade: ${l.trade} | Employees: ${l.employees}`);
});
