const fs = require('fs');

const leads = JSON.parse(fs.readFileSync('data/real_verified_leads.json', 'utf8'));
console.log('Total real verified leads:', leads.length);

console.log('\nFirst 10 leads:');
leads.slice(0, 10).forEach(l => {
  console.log(`- ${l.company} (${l.phone}) - ${l.city} - Owner: ${l.owner} - Emp: ${l.employees} - ${l.trade}`);
});

console.log('\nMiddle 10 leads (100-110):');
leads.slice(100, 110).forEach(l => {
  console.log(`- ${l.company} (${l.phone}) - ${l.city} - Owner: ${l.owner} - Emp: ${l.employees} - ${l.trade}`);
});

console.log('\nLast 10 leads:');
leads.slice(-10).forEach(l => {
  console.log(`- ${l.company} (${l.phone}) - ${l.city} - Owner: ${l.owner} - Emp: ${l.employees} - ${l.trade}`);
});

// Check if any have invalid numbers
const badPhones = leads.filter(l => !l.phone || l.phone.includes('555') || l.phone.length < 10);
console.log('\nBad phones count:', badPhones.length);

// Check employee count distribution
const empDist = {};
leads.forEach(l => empDist[l.employees] = (empDist[l.employees] || 0) + 1);
console.log('Employee count distribution (2-10):', empDist);
