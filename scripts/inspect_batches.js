const fs = require('fs');

const norm = JSON.parse(fs.readFileSync('data/normalized_lead_targets.json', 'utf8'));

console.log('Total leads in normalized:', norm.length);

// Group by batch and show 3 sample companies and phone numbers from each batch
for (let b = 1; b <= 11; b++) {
  const batchLeads = norm.filter(l => Number(l.batch) === b);
  console.log(`\n--- BATCH ${b} (Total: ${batchLeads.length}) ---`);
  batchLeads.slice(0, 3).forEach(l => {
    console.log(`  [${l.id}] ${l.company} | ${l.owner} | Phone: ${l.phone} | City: ${l.city} | Emp: ${l.employees}`);
  });
}
