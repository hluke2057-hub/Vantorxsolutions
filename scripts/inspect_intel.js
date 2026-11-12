const fs = require('fs');

['sunbiz_dbpr_registry_cache.json', 'outbound_intelligence.json', 'yp_scraped_raw.json', 'emp_intelligence_cache.json'].forEach(file => {
  try {
    const raw = fs.readFileSync('data/' + file, 'utf8');
    const data = JSON.parse(raw);
    const keys = Array.isArray(data) ? data.length : Object.keys(data).length;
    console.log(file, 'Length:', keys);
    const sample = Array.isArray(data) ? data[0] : data[Object.keys(data)[0]];
    console.log(file, 'Sample:', JSON.stringify(sample).slice(0, 150));
  } catch (e) {
    console.log(file, 'Error:', e.message);
  }
});
