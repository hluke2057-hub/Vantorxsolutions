// inspect_top_leads.js
const fs = require('fs');
const content = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');
const match = content.match(/const LEADS_DATA = (\[[\s\S]*?\]);\s*\n/);
const leads = eval(match[1]);
console.log('Total leads:', leads.length);
console.log('Top 25 leads:');
leads.slice(0, 25).forEach((l, i) => {
  console.log(`${i+1}. [${l.id}] ${l.company} | ${l.phone} | ${l.city} | ${l.owner} | Emp: ${l.employees}`);
});
