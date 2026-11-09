const fs = require('fs');

const leads = JSON.parse(fs.readFileSync('data/florida_100_no_website_leads.json', 'utf8'));

console.log('Total count:', leads.length);
console.log('\n--- FIRST 5 LEADS ---');
leads.slice(0, 5).forEach(l => {
  console.log(`[${l.id}] ${l.company} | ${l.phone} | ${l.address}, ${l.city}, FL ${l.zip} | Trade: ${l.trade}`);
});

console.log('\n--- LEADS 50 to 55 ---');
leads.slice(50, 55).forEach(l => {
  console.log(`[${l.id}] ${l.company} | ${l.phone} | ${l.address}, ${l.city}, FL ${l.zip} | Trade: ${l.trade}`);
});

console.log('\n--- LAST 5 LEADS ---');
leads.slice(-5).forEach(l => {
  console.log(`[${l.id}] ${l.company} | ${l.phone} | ${l.address}, ${l.city}, FL ${l.zip} | Trade: ${l.trade}`);
});
