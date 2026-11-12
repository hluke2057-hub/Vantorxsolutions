const fs = require('fs');

['master_1000_verified_leads.json', 'real_verified_leads.json', 'daily_verified_leads_feed.json', 'normalized_lead_targets.json'].forEach(file => {
  try {
    const data = JSON.parse(fs.readFileSync('data/' + file, 'utf8'));
    const len = Array.isArray(data) ? data.length : Object.keys(data).length;
    console.log(file, 'Length:', len);
    const sample = Array.isArray(data) ? data[0] : data[Object.keys(data)[0]];
    if (sample) {
      console.log('Sample keys:', Object.keys(sample).slice(0, 10));
      console.log('Sample email:', sample.email, 'website:', sample.website, 'company:', sample.company || sample.businessName || sample.name);
    }
  } catch (e) {
    console.log(file, 'Error:', e.message);
  }
});
