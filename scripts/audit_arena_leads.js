const fs = require('fs');

const content = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');

// Find all lead objects
const regex = /\{"id":"([^"]+)","company":"([^"]+)","owner":"([^"]+)"[^}]*"phone":"([^"]+)"[^}]*"batch":(\d+)[^}]*\}/g;
let m;
let total = 0;
const batches = {};
const leads = [];

while ((m = regex.exec(content)) !== null) {
  total++;
  const id = m[1];
  const company = m[2];
  const owner = m[3];
  const phone = m[4];
  const batch = m[5];
  batches[batch] = (batches[batch] || 0) + 1;
  leads.push({ id, company, owner, phone, batch });
}

console.log('Total leads found:', total);
console.log('Batches breakdown:', batches);

// Check phone patterns
const phoneCounts = {};
const areaCodes = {};
leads.forEach(l => {
  phoneCounts[l.phone] = (phoneCounts[l.phone] || 0) + 1;
  const ac = l.phone.match(/\((\d{3})\)/);
  if (ac) areaCodes[ac[1]] = (areaCodes[ac[1]] || 0) + 1;
});

console.log('Unique phone numbers:', Object.keys(phoneCounts).length);
console.log('Top area codes:', Object.entries(areaCodes).sort((a,b)=>b[1]-a[1]).slice(0, 15));

// Check batch 1 and 2 leads in detail
console.log('\nSample from Batch 1 (first 10):');
leads.filter(l => l.batch === '1').slice(0, 10).forEach(l => {
  console.log(`[${l.id}] ${l.company} | ${l.owner} | Phone: ${l.phone}`);
});

console.log('\nSample from other batches:');
leads.filter(l => l.batch !== '1').slice(0, 10).forEach(l => {
  console.log(`[${l.id}] [B${l.batch}] ${l.company} | ${l.owner} | Phone: ${l.phone}`);
});
