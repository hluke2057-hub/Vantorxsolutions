const fs = require('fs');

const files = [
  'data/master_1000_verified_leads.json',
  'data/daily_verified_leads_feed.json',
  'data/real_verified_leads.json',
  'data/normalized_lead_targets.json',
  'website/data/normalized_lead_targets.json',
  'data/florida_100_no_website_leads.json',
  'data/sunbiz_dbpr_registry_cache.json'
];

const webCompanies = [];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  try {
    const raw = fs.readFileSync(f, 'utf8');
    const data = JSON.parse(raw);
    const arr = Array.isArray(data) ? data : (data.leads || Object.values(data));
    arr.forEach(item => {
      if (!item) return;
      const web = item.website || item.webUrl;
      if (web && typeof web === 'string' && web.includes('.')) {
        webCompanies.push({
          company: item.company || item.officialCompanyName || item.businessName || item.name,
          website: web,
          phone: item.phone,
          owner: item.holderFullName || item.owner || 'Owner',
          trade: item.trade || 'Contractor',
          city: item.city || 'West Palm Beach',
          state: item.state || 'FL',
          email: item.email || null
        });
      }
    });
  } catch (e) {}
});

console.log('Total web companies entries:', webCompanies.length);
// Deduplicate by clean domain
const domainMap = new Map();
webCompanies.forEach(c => {
  let cleanDomain = c.website.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].split('?')[0].trim();
  if (cleanDomain && !domainMap.has(cleanDomain)) {
    c.cleanDomain = cleanDomain;
    domainMap.set(cleanDomain, c);
  }
});

console.log(`Unique domains with real contractor websites: ${domainMap.size}`);
console.log('Sample 20 domains:');
Array.from(domainMap.keys()).slice(0, 20).forEach(d => {
  const c = domainMap.get(d);
  console.log(`- ${d} | ${c.company} | ${c.phone} | email: ${c.email || 'none'}`);
});
