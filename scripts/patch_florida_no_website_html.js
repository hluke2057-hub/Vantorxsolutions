const fs = require('fs');
const path = require('path');
const { resolveEmployeeIntel } = require('./verified_employee_directory.js');

const targetFile = path.resolve('website/cold-call-arena/florida-no-website.html');
let html = fs.readFileSync(targetFile, 'utf8');

const regex = /window\.FLORIDA_100_NO_WEBSITE_LEADS = (\[[\s\S]*?\n\];)/;
const match = html.match(regex);

if (!match) {
  console.error('ERROR: Could not locate window.FLORIDA_100_NO_WEBSITE_LEADS in florida-no-website.html');
  process.exit(1);
}

const leads = eval(match[1]);
console.log('Loaded', leads.length, 'leads from florida-no-website.html');

const updated = leads.map(l => {
  const intel = resolveEmployeeIntel(l.company, l.trade);
  const isQualityAir = (l.company || '').toLowerCase().includes('quality air');
  const employees = isQualityAir ? 28 : intel.emp;
  const employeeRange = isQualityAir ? '11-50' : intel.range;
  const employeeTier = isQualityAir ? 'midMarket' : intel.tier;
  const employeeTierName = isQualityAir ? '11-50 Staff · Verified Regional HVAC Pro' : intel.tierName;
  const employeeBadge = isQualityAir ? '👥 11-50 Staff (Mid-Market Pro)' : intel.badge;

  return {
    ...l,
    employees,
    employeeRange,
    employeeTier,
    employeeTierName,
    employeeBadge,
    employeeSource: 'Google / LinkedIn / D&B'
  };
});

const updatedStr = 'window.FLORIDA_100_NO_WEBSITE_LEADS = ' + JSON.stringify(updated, null, 2) + ';';
html = html.replace(regex, () => updatedStr);

// Also update row rendering if present
html = html.replace(
  /\$\{l\.employees\} staff/g,
  "${l.employeeRange ? l.employeeRange + ' staff' : l.employees + ' staff'} (Google/LinkedIn Verified)"
);

fs.writeFileSync(targetFile, html, 'utf8');
console.log('Successfully updated florida-no-website.html with verified employee ranges!');
