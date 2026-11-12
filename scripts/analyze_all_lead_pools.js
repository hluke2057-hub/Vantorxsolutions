const fs = require('fs');
const path = require('path');

const files = [
  'data/master_1000_verified_leads.json',
  'data/daily_verified_leads_feed.json',
  'data/real_verified_leads.json',
  'data/normalized_lead_targets.json',
  'website/data/normalized_lead_targets.json',
  'data/florida_100_no_website_leads.json',
  'data/sunbiz_dbpr_registry_cache.json'
];

const allCompanies = new Map();

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  try {
    const raw = fs.readFileSync(f, 'utf8');
    const data = JSON.parse(raw);
    const arr = Array.isArray(data) ? data : (data.leads || Object.values(data));
    arr.forEach(item => {
      if (!item) return;
      const name = item.company || item.officialCompanyName || item.businessName || item.name;
      if (!name) return;
      const cleanName = name.trim().toLowerCase();
      if (!allCompanies.has(cleanName)) {
        allCompanies.set(cleanName, {
          company: name,
          phone: item.phone,
          city: item.city || 'West Palm Beach',
          state: item.state || 'FL',
          owner: item.holderFullName || item.owner || item.licenseHolder || 'Owner',
          website: item.website || item.webUrl || null,
          email: item.email || null,
          trade: item.trade || item.service || 'Contractor',
          sunbizVerified: !!item.officialCompanyName || !!item.sunbizLink || false
        });
      } else {
        const existing = allCompanies.get(cleanName);
        if (!existing.website && (item.website || item.webUrl)) existing.website = item.website || item.webUrl;
        if (!existing.email && item.email) existing.email = item.email;
        if (!existing.phone && item.phone) existing.phone = item.phone;
        if (item.holderFullName && existing.owner === 'Owner') existing.owner = item.holderFullName;
      }
    });
  } catch (e) {
    console.log('Error reading', f, e.message);
  }
});

console.log(`Total unique commercial contractors found across all databases: ${allCompanies.size}`);
let withWebsite = 0;
let withEmail = 0;
let withPhone = 0;

allCompanies.forEach(c => {
  if (c.website) withWebsite++;
  if (c.email) withEmail++;
  if (c.phone) withPhone++;
});

console.log(`With website: ${withWebsite}`);
console.log(`With email:   ${withEmail}`);
console.log(`With phone:   ${withPhone}`);

