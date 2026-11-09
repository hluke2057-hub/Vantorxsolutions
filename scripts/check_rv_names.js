const fs = require('fs');
const path = require('path');

const leads = JSON.parse(fs.readFileSync('data/real_verified_leads.json', 'utf8'));
console.log('Total in real_verified_leads.json:', leads.length);

const funnyOrFake = [];
leads.forEach((l, idx) => {
  const full = (l.fullOwner || l.owner || '').toLowerCase();
  const comp = (l.company || '').toLowerCase();
  if (/outhouse|nerd\b|super\b|airtron\b|modern\b|emergency\b|centre\b|coastal\b|duralast\b|tarheel\b|pro-tec\b|coolair\b|aztec\b|care\b|climate\b|goldstar\b|rocket\b|breeze\b|superior\b|partner\b|patrol\b|serveway\b|bumble\b|reliable\b|houston\b|total\b|fahrenheit\b|imagine\b|tek\b|cascade\b|doctor\b|hour\b|parts\b/i.test(full)) {
    funnyOrFake.push({ idx, id: l.id, company: l.company, fullOwner: l.fullOwner, owner: l.owner, phone: l.phone, city: l.city });
  }
});

console.log('Funny or suspicious fullOwner in real_verified_leads.json:', funnyOrFake.length);
console.log(funnyOrFake.slice(0, 20));
