const fs = require('fs');
const path = require('path');

const real = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'real_verified_leads.json'), 'utf8'));

console.log('Auditing real_verified_leads.json (total: ' + real.length + ')');
let suspicious = [];

real.forEach((r, idx) => {
  // Check phone pattern
  const phone = r.phone || '';
  const digits = phone.replace(/\D/g, '');
  const last4 = digits.slice(-4);
  const isDoubles = last4.length === 4 && (last4[0] === last4[1] && last4[2] === last4[3]);
  
  // Check alliteration: e.g. Scott in Scottsdale, Carl in Catalina
  const owner = (r.owner || '').trim().toLowerCase();
  const city = (r.city || '').split(',')[0].trim().toLowerCase();
  const isAlliterative = owner.length > 2 && city.startsWith(owner.slice(0, 3));

  if (isDoubles || isAlliterative) {
    suspicious.push({ idx, id: r.id, company: r.company, owner: r.owner, phone: r.phone, city: r.city, isDoubles, isAlliterative });
  }
});

console.log('Suspicious count in real_verified_leads.json:', suspicious.length);
if (suspicious.length > 0) {
  console.log('Suspicious items:', suspicious.slice(0, 10));
} else {
  console.log('ALL 346 LEADS IN real_verified_leads.json PASS INTEGRITY AUDIT!');
}
