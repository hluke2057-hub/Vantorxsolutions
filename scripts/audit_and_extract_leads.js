const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, '..', 'data');
const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

const allLeads = new Map();

jsonFiles.forEach(f => {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
    if (Array.isArray(raw)) {
      raw.forEach(item => {
        if (item.company && (item.phone || item.telephone)) {
          const key = (item.company + '|' + (item.phone || item.telephone)).toLowerCase().trim();
          if (!allLeads.has(key)) {
            allLeads.set(key, { ...item, _source: f });
          }
        }
      });
    }
  } catch(e) {}
});

console.log('Total unique business/phone pairs across data dir:', allLeads.size);

// Audit each lead:
let realCount = 0;
let fakeCount = 0;
const realList = [];
const fakeList = [];

for (const [key, item] of allLeads.entries()) {
  const comp = item.company || '';
  const owner = item.owner || item.contact_name || '';
  const fullOwner = item.fullOwner || owner || '';
  const phone = (item.phone || item.telephone || '').replace(/\D/g, '');
  const city = item.city || '';
  const state = item.state || '';

  // Indicators of fake lead:
  // 1. Phone number with repeating digits: 3344, 1188, 2211, 4488, 1122, 3322, 1166, 1155, 2244, 3399, 4400, 3377, 2288
  // 2. Owner name alliterative or joke name: Scott in Scottsdale, Carl in Catalina, Frank Fahrenheit, Sean Outhouse, William Nerd, etc.
  // 3. Fake pattern email: @...com with "Pattern Synthesized"
  const last4 = phone.slice(-4);
  const isRepeats = last4.length === 4 && (last4[0] === last4[1] && last4[2] === last4[3]);
  const isJokeName = /outhouse|nerd|super\b|airtron\b|modern\b|emergency\b|centre\b|coastal\b|duralast\b|tarheel\b|pro-tec\b|coolair\b|aztec\b|care\b|climate\b|goldstar\b|rocket\b|breeze\b|superior\b|partner\b|patrol\b|serveway\b|bumble\b|reliable\b|houston\b|total\b|fahrenheit\b|imagine\b|tek\b|cascade\b|doctor\b|hour\b|parts\b/i.test(fullOwner);
  const isCityName = owner && city && city.toLowerCase().startsWith(owner.toLowerCase()) && owner.length > 2;
  const isSynth = item.emailSource === 'Pattern Synthesized' || item.mxStatus === 'SYNTHESIZED';

  if (isRepeats || isJokeName || isCityName || isSynth) {
    fakeCount++;
    fakeList.push({ comp, owner: fullOwner, phone: item.phone, city, reason: { isRepeats, isJokeName, isCityName, isSynth } });
  } else {
    realCount++;
    realList.push(item);
  }
}

console.log('Real leads count:', realCount);
console.log('Fake leads count:', fakeCount);
console.log('\nSample Real Leads (first 5):');
console.log(realList.slice(0, 5).map(l => `${l.company} | ${l.owner} | ${l.phone} | ${l.city} (${l._source})`));
console.log('\nSample Real Leads (around index 100):');
console.log(realList.slice(100, 105).map(l => `${l.company} | ${l.owner} | ${l.phone} | ${l.city} (${l._source})`));
console.log('\nSample Fake Leads:');
console.log(fakeList.slice(0, 5));
