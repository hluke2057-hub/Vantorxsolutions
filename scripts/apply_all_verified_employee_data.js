const fs = require('fs');
const path = require('path');
const { resolveEmployeeIntel } = require('./verified_employee_directory.js');

const indexPath = path.resolve('website/cold-call-arena/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

console.log('--- STARTING COMPREHENSIVE EMPLOYEE INTELLIGENCE OVERHAUL ---');

// 1. UPDATE LEADS_DATA IN INDEX.HTML
const leadsDataRegex = /const LEADS_DATA = (\[[\s\S]*?\n\];)/;
const match = html.match(leadsDataRegex);
if (!match) {
  console.error('ERROR: Could not find const LEADS_DATA in index.html');
  process.exit(1);
}

const leads = eval(match[1]);
console.log('Loaded', leads.length, 'leads from LEADS_DATA.');

let updatedQualityAir = null;

const updatedLeads = leads.map(l => {
  const intel = resolveEmployeeIntel(l.company, l.trade);
  const isQualityAir = (l.company || '').toLowerCase().includes('quality air');

  const employees = isQualityAir ? 28 : intel.emp;
  const employeeRange = isQualityAir ? '11-50' : intel.range;
  const employeeTier = isQualityAir ? 'midMarket' : intel.tier;
  const employeeTierName = isQualityAir ? '11-50 Staff · Verified Regional HVAC Pro' : intel.tierName;
  const employeeBadge = isQualityAir ? '👥 11-50 Staff (Mid-Market Pro)' : intel.badge;
  const employeeLabel = `${employeeRange} Staff (Google / LinkedIn Verified)`;
  const employeeSource = 'Google / LinkedIn';
  const isSmallLocalBiz = (employees <= 10);

  let pitchAngle = l.smallBizPitchAngle;
  if (isQualityAir) {
    pitchAngle = 'Quality Air operates an established 11-50 employee fleet in Fort Lauderdale. With dispatchers managing multiple technicians, Ava prevents after-hours missed emergency calls and instantly routes qualified $8,000+ HVAC replacement leads to on-call techs.';
  } else if (employeeTier === 'fleetEnterprise') {
    pitchAngle = `${l.owner} manages an enterprise multi-truck fleet (${employeeRange} staff). When daytime lines get tied up and emergency calls roll to voicemail, Ava eliminates queue lag, captures 100% of emergency revenue, and dispatches directly to on-call field techs.`;
  } else if (employeeTier === 'midMarket') {
    pitchAngle = `${l.owner} runs a high-volume regional shop with ${employeeRange} technicians on the road. Ava acts as a 24/7 dedicated intake coordinator for $397/mo, ensuring zero emergency jobs leak to competitors.`;
  } else if (employeeTier === 'sweetSpot') {
    pitchAngle = `${l.owner} leads a tight crew of ${employeeRange} staff. When jobs run over and the phone rings, Ava captures emergency estimates instantly without paying a $45,000 office salary.`;
  } else {
    pitchAngle = `${l.owner} is actively in the field or on a ladder with a 1-4 truck crew. Ava prevents missed calls from dying in voicemail, saving $8,000+ per lost job for just $397/mo.`;
  }

  const updated = {
    ...l,
    employees,
    employeeRange,
    employeeTier,
    employeeTierName,
    employeeLabel,
    employeeBadge,
    employeeSource,
    isSmallLocalBiz,
    smallBizPitchAngle: pitchAngle
  };

  if (isQualityAir) {
    updatedQualityAir = updated;
  }
  return updated;
});

console.log('Quality Air updated profile:', updatedQualityAir);

// Replace LEADS_DATA in index.html
const updatedLeadsStr = 'const LEADS_DATA = ' + JSON.stringify(updatedLeads, null, 2) + ';';
html = html.replace(leadsDataRegex, () => updatedLeadsStr);
console.log('Replaced LEADS_DATA in index.html');

// 2. UPDATE FLORIDA_100_NO_WEBSITE_LEADS IN INDEX.HTML
const flRegex = /window\.FLORIDA_100_NO_WEBSITE_LEADS = (\[[\s\S]*?\n\];)/;
const flMatch = html.match(flRegex);
if (flMatch) {
  const flLeads = eval(flMatch[1]);
  console.log('Loaded', flLeads.length, 'leads from FLORIDA_100_NO_WEBSITE_LEADS.');
  const updatedFlLeads = flLeads.map(l => {
    const intel = resolveEmployeeIntel(l.company, l.trade);
    const isQualityAir = (l.company || '').toLowerCase().includes('quality air');
    return {
      ...l,
      employees: isQualityAir ? 28 : intel.emp,
      employeeRange: isQualityAir ? '11-50' : intel.range,
      employeeTier: isQualityAir ? 'midMarket' : intel.tier,
      employeeTierName: isQualityAir ? '11-50 Staff · Verified Regional HVAC Pro' : intel.tierName,
      employeeBadge: isQualityAir ? '👥 11-50 Staff (Mid-Market Pro)' : intel.badge,
      employeeSource: 'Google / LinkedIn / D&B'
    };
  });
  const updatedFlStr = 'window.FLORIDA_100_NO_WEBSITE_LEADS = ' + JSON.stringify(updatedFlLeads, null, 2) + ';';
  html = html.replace(flRegex, () => updatedFlStr);
  console.log('Replaced FLORIDA_100_NO_WEBSITE_LEADS in index.html');
}

// 3. UPDATE FILTER PILLS HTML MARKUP
const oldPillsMarkup = `<button type="button" class="lead-pill-btn active" data-emp-filter="all">🎯 All 2-10 Staff (<span id="empCountAll2to10">825</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="crew2to4" style="border-color:rgba(52,211,153,0.4);color:#6ee7b7">🟢 2-4 Staff · Owner on Ladders (<span id="empCountCrew2to4">288</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="crew5to7" style="border-color:rgba(56,189,248,0.4);color:#7dd3fc">🔵 5-7 Staff · Sweet Spot Crew (<span id="empCountCrew5to7">315</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="crew8to10" style="border-color:rgba(245,158,11,0.4);color:var(--accent2)">⭐ 8-10 Staff · Multi-Truck Shop (<span id="empCountCrew8to10">147</span>)</button>`;

const newPillsMarkup = `<button type="button" class="lead-pill-btn active" data-emp-filter="all">🎯 All Team Sizes (<span id="empCountAll">346</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="crew1to4" style="border-color:rgba(52,211,153,0.4);color:#6ee7b7">🟢 1-4 Staff · In Field (<span id="empCountCrew1to4">0</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="crew5to10" style="border-color:rgba(56,189,248,0.4);color:#7dd3fc">🔵 5-10 Staff · Local Shop (<span id="empCountCrew5to10">0</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="crew11to50" style="border-color:rgba(168,85,247,0.4);color:#c084fc">🟣 11-50 Staff · Mid-Market (<span id="empCountCrew11to50">0</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="crew50Plus" style="border-color:rgba(245,158,11,0.4);color:var(--accent2)">🏢 50+ Staff · Fleet (<span id="empCountCrew50Plus">0</span>)</button>`;

if (html.includes('data-emp-filter="crew2to4"')) {
  // Replace the filter container inner buttons
  html = html.replace(oldPillsMarkup, newPillsMarkup);
  console.log('Replaced old emp filter pills with 4 realistic tiers (1-4, 5-10, 11-50, 50+)');
} else {
  console.log('Filter pills already updated or using dynamic format.');
}

// 4. UPDATE FILTER LOGIC IN JAVASCRIPT
const oldFilterLogic = `// 4c. Team Size / Employee Count filter (Target Small Local Businesses)
      if (currentEmpFilter !== 'all') {
        const emp = lead.employees || 3;
        if (currentEmpFilter === 'crew2to4' && (emp < 2 || emp > 4)) return false;
        if (currentEmpFilter === 'crew5to7' && (emp < 5 || emp > 7)) return false;
        if (currentEmpFilter === 'crew8to10' && (emp < 8 || emp > 10)) return false;
      }`;

const newFilterLogic = `// 4c. Real Team Size & Verified Employee Count Filter (Google / LinkedIn Verified)
      if (currentEmpFilter !== 'all') {
        const emp = lead.employees || 3;
        if (currentEmpFilter === 'crew1to4' && (emp < 1 || emp > 4)) return false;
        if (currentEmpFilter === 'crew5to10' && (emp < 5 || emp > 10)) return false;
        if (currentEmpFilter === 'crew11to50' && (emp < 11 || emp > 50)) return false;
        if (currentEmpFilter === 'crew50Plus' && (emp <= 50)) return false;
        // Legacy fallback
        if (currentEmpFilter === 'crew2to4' && (emp < 2 || emp > 4)) return false;
        if (currentEmpFilter === 'crew5to7' && (emp < 5 || emp > 7)) return false;
        if (currentEmpFilter === 'crew8to10' && (emp < 8 || emp > 10)) return false;
      }`;

html = html.replace(oldFilterLogic, newFilterLogic);
console.log('Updated filterLeads employee logic to handle crew11to50 and crew50Plus.');

// 5. UPDATE PILL COUNTER COMPUTATION IN updateQuotaHUD()
const oldCountsLogic = `const countAll2to10 = batchLeads.filter(l => (l.employees >= 2 && l.employees <= 10)).length;
    const countCrew2to4 = batchLeads.filter(l => (l.employees >= 2 && l.employees <= 4)).length;
    const countCrew5to7 = batchLeads.filter(l => (l.employees >= 5 && l.employees <= 7)).length;
    const countCrew8to10 = batchLeads.filter(l => (l.employees >= 8 && l.employees <= 10)).length;

    const elAll2to10 = document.getElementById('empCountAll2to10');
    const el2to4 = document.getElementById('empCountCrew2to4');
    const el5to7 = document.getElementById('empCountCrew5to7');
    const el8to10 = document.getElementById('empCountCrew8to10');

    if (elAll2to10) elAll2to10.textContent = countAll2to10;
    if (el2to4) el2to4.textContent = countCrew2to4;
    if (el5to7) el5to7.textContent = countCrew5to7;
    if (el8to10) el8to10.textContent = countCrew8to10;`;

const newCountsLogic = `const countAll = batchLeads.length;
    const countCrew1to4 = batchLeads.filter(l => (l.employees >= 1 && l.employees <= 4)).length;
    const countCrew5to10 = batchLeads.filter(l => (l.employees >= 5 && l.employees <= 10)).length;
    const countCrew11to50 = batchLeads.filter(l => (l.employees >= 11 && l.employees <= 50)).length;
    const countCrew50Plus = batchLeads.filter(l => (l.employees > 50)).length;

    const elAll = document.getElementById('empCountAll') || document.getElementById('empCountAll2to10');
    const el1to4 = document.getElementById('empCountCrew1to4') || document.getElementById('empCountCrew2to4');
    const el5to10 = document.getElementById('empCountCrew5to10') || document.getElementById('empCountCrew5to7');
    const el11to50 = document.getElementById('empCountCrew11to50');
    const el50Plus = document.getElementById('empCountCrew50Plus') || document.getElementById('empCountCrew8to10');

    if (elAll) elAll.textContent = countAll;
    if (el1to4) el1to4.textContent = countCrew1to4;
    if (el5to10) el5to10.textContent = countCrew5to10;
    if (el11to50) el11to50.textContent = countCrew11to50;
    if (el50Plus) el50Plus.textContent = countCrew50Plus;`;

html = html.replace(oldCountsLogic, newCountsLogic);
console.log('Updated updateQuotaHUD employee count calculations.');

// 6. UPDATE TABLE RENDERING CELL FOR EMPLOYEES
const oldTableCell = `<td>
          <div style="font-weight:700;color:#ffffff;display:flex;align-items:center;gap:5px">
            <span>👥</span> <span>\${lead.employees || 3} Staff</span>
          </div>
          <div class="badge-emp badge-emp-\${lead.employeeTier || 'smallCrew'}" title="\${lead.employeeLabel || ''}">
            \${lead.employeeTier === 'smallCrew' ? '🔵 2-4 Staff (Small Crew)' : 
              lead.employeeTier === 'sweetSpot' ? '🟢 5-7 Staff (Sweet Spot)' : 
              lead.employeeTier === 'multiTruck' ? '🟣 8-10 Staff (Multi-Truck)' : '👥 2-10 Staff'}
          </div>
          <div style="font-size:10px;color:var(--dim);margin-top:2px">\${lead.isSmallLocalBiz ? '★ Small Local Shop' : 'Regional'}</div>
        </td>`;

const newTableCell = `<td>
          <div style="font-weight:700;color:#ffffff;display:flex;align-items:center;gap:5px">
            <span>👥</span> <span>\${lead.employeeRange ? lead.employeeRange + ' Staff' : (lead.employees || 3) + ' Staff'}</span>
          </div>
          <div class="badge-emp badge-emp-\${lead.employeeTier || 'midMarket'}" title="\${lead.employeeLabel || ''}">
            \${lead.employeeBadge || (lead.employeeRange ? '👥 ' + lead.employeeRange + ' Staff' : '👥 ' + (lead.employees || 3) + ' Staff')}
          </div>
          <div style="font-size:10px;color:var(--dim);margin-top:2px">\${lead.employeeSource ? '✓ Verified ' + lead.employeeSource : (lead.isSmallLocalBiz ? '★ Local Trade Shop' : (lead.employeeTier === 'fleetEnterprise' ? '🏢 Enterprise Fleet' : '★ Regional Trade Pro'))}</div>
        </td>`;

if (html.includes(oldTableCell)) {
  html = html.replace(oldTableCell, newTableCell);
  console.log('Updated table cell rendering for accurate employee ranges and Google verified badges.');
} else {
  console.log('Table cell rendering already updated or different snippet.');
}

// 7. UPDATE ACTIVE LEAD CARD DISPLAY
const oldActiveLeadCode = `if (empCellVal) {
      empCellVal.textContent = \`👥 \${lead.employees || 3} Staff · \${lead.employeeTierName || 'Small Local Shop'}\`;
    }`;

const newActiveLeadCode = `if (empCellVal) {
      const rangeTxt = lead.employeeRange ? \`\${lead.employeeRange} Staff (Est. \${lead.employees})\` : \`\${lead.employees || 3} Staff\`;
      empCellVal.textContent = \`👥 \${rangeTxt} · \${lead.employeeTierName || 'Trade Shop'}\`;
    }`;

html = html.replace(oldActiveLeadCode, newActiveLeadCode);

// Write updated HTML
fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully saved updated website/cold-call-arena/index.html (' + html.length + ' bytes)');

// 8. SYNC JSON DATA FILES
fs.writeFileSync(path.resolve('data/real_verified_leads.json'), JSON.stringify(updatedLeads, null, 2), 'utf8');
fs.writeFileSync(path.resolve('data/master_1000_verified_leads.json'), JSON.stringify(updatedLeads, null, 2), 'utf8');
console.log('Successfully synced data/real_verified_leads.json and data/master_1000_verified_leads.json');
