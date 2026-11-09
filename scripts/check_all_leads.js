const fs = require('fs');
const path = require('path');

const realPath = path.resolve(__dirname, '..', 'data', 'real_verified_leads.json');
const noWebPath = path.resolve(__dirname, '..', 'data', 'florida_100_no_website_leads.json');

if (fs.existsSync(realPath)) {
  const real = JSON.parse(fs.readFileSync(realPath, 'utf8'));
  console.log('real_verified_leads count:', real.length);
  console.log('Sample real[0]:', real[0]);
  console.log('Sample real[100]:', real[100]);
  console.log('Sample real[200]:', real[200]);
  console.log('Sample real[300]:', real[300]);
} else {
  console.log('real_verified_leads.json does not exist');
}

if (fs.existsSync(noWebPath)) {
  const noWeb = JSON.parse(fs.readFileSync(noWebPath, 'utf8'));
  console.log('\nflorida_100_no_website_leads count:', noWeb.length);
  console.log('Sample noWeb[0]:', noWeb[0]);
  console.log('Sample noWeb[50]:', noWeb[50]);
} else {
  console.log('florida_100_no_website_leads.json does not exist');
}
