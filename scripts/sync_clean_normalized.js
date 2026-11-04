const fs = require('fs');

const realLeads = JSON.parse(fs.readFileSync('data/real_verified_leads.json', 'utf8'));

// Ensure no bad phones (filter out anything that might have slipped through)
const cleanRealLeads = realLeads.filter(l => {
  if (!l.phone) return false;
  const digits = l.phone.replace(/\D/g, '');
  if (digits.length !== 10 && digits.length !== 11) return false;
  // Ensure exchange is not 555
  const exchange = digits.length === 10 ? digits.substring(3, 6) : digits.substring(4, 7);
  if (exchange === '555') return false;
  return true;
});

// Re-index batch numbers: 50 leads per batch
cleanRealLeads.forEach((l, idx) => {
  l.batch = Math.floor(idx / 50) + 1;
});

console.log('Clean verified real leads count:', cleanRealLeads.length);

// Save to data/normalized_lead_targets.json
fs.writeFileSync('data/normalized_lead_targets.json', JSON.stringify(cleanRealLeads, null, 2), 'utf8');
console.log('Updated data/normalized_lead_targets.json successfully!');
