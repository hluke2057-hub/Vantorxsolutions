const fs = require('fs');
const path = require('path');

const leads = JSON.parse(fs.readFileSync('data/real_verified_leads.json', 'utf8'));

console.log('real_verified_leads.json total:', leads.length);
// Check how many have batch numbers
const batches = {};
leads.forEach(l => {
  batches[l.batch] = (batches[l.batch] || 0) + 1;
});
console.log('Batches in real_verified_leads.json:', batches);

// Check if any joke names or alliterations
let badCount = 0;
leads.forEach(l => {
  const digits = l.phone.replace(/\D/g, '');
  const last4 = digits.slice(-4);
  const isDoubles = last4.length === 4 && (last4[0] === last4[1] && last4[2] === last4[3]);
  const isJoke = /outhouse|nerd\b|super\b|airtron\b|emergency\b|centre\b|coastal\b|duralast\b|tarheel\b|pro-tec\b|coolair\b|aztec\b|care\b|climate\b|goldstar\b|rocket\b|breeze\b|superior\b|partner\b|patrol\b|serveway\b|bumble\b|reliable\b|houston\b|total\b|fahrenheit\b|imagine\b|tek\b|cascade\b|doctor\b|hour\b|parts\b/i.test(l.fullOwner || l.owner || '');
  const isCity = l.owner && l.city && l.city.toLowerCase().startsWith(l.owner.toLowerCase()) && l.owner.length > 2;

  if (isJoke || isCity) {
    console.log('Suspicious lead:', l.id, l.company, l.owner, l.city, l.phone);
    badCount++;
  }
});
console.log('Total bad in real_verified_leads.json:', badCount);
