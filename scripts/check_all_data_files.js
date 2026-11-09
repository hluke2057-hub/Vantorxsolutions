const fs = require('fs');
const path = require('path');

const files = [
  'real_verified_leads.json',
  'daily_verified_leads_feed.json',
  'master_1000_verified_leads.json',
  'normalized_lead_targets.json',
  'verified_targets_queue.json'
];

files.forEach(f => {
  const p = path.resolve(__dirname, '..', 'data', f);
  if (fs.existsSync(p)) {
    try {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      console.log(`\n=== ${f} === (Count: ${Array.isArray(data) ? data.length : Object.keys(data).length})`);
      if (Array.isArray(data) && data.length > 0) {
        console.log('Sample item [0]:', {
          id: data[0].id,
          company: data[0].company || data[0].business_name,
          phone: data[0].phone || data[0].telephone,
          owner: data[0].owner || data[0].contact_name,
          city: data[0].city,
          state: data[0].state
        });
        const last = data[data.length - 1];
        console.log(`Sample item [${data.length - 1}]:`, {
          id: last.id,
          company: last.company || last.business_name,
          phone: last.phone || last.telephone,
          owner: last.owner || last.contact_name,
          city: last.city,
          state: last.state
        });
      }
    } catch(e) {
      console.log(`Error parsing ${f}:`, e.message);
    }
  } else {
    console.log(`${f} not found`);
  }
});
