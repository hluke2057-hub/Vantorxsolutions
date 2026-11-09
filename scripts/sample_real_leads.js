const fs = require('fs');
const leads = JSON.parse(fs.readFileSync('data/real_verified_leads.json', 'utf8'));

for (let i = 0; i < leads.length; i += 12) {
  const l = leads[i];
  console.log(`[${i}] ${l.id} | ${l.company} | ${l.owner} (${l.fullOwner}) | ${l.phone} | ${l.city} | ${l.trade} | Staff: ${l.employees}`);
}
