const fs = require('fs');
let html = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');

// Normalize line endings for replacement or replace CRLF
const marker1 = 'id="activeLeadEmpCell"';
const idx1 = html.indexOf(marker1);
if (idx1 !== -1) {
  const start1 = html.lastIndexOf('<div class="active-lead-cell"', idx1);
  const end1 = html.indexOf('</div>\r\n          <div class="active-lead-cell active-lead-savings-cell"', idx1);
  if (end1 !== -1) {
    const old1 = html.slice(start1, end1 + 6);
    console.log('Found markup around activeLeadEmpCell:\n', old1);
    const new1 = `<div class="active-lead-cell" id="activeLeadEmpCell" style="border-color:rgba(52,211,153,0.35)">
            <div class="active-lead-label">👥 Team Size &amp; Verified Headcount (Google / LinkedIn)</div>
            <div class="active-lead-val" id="activeLeadEmpVal" style="color:#6ee7b7">5-15 Staff · Boutique HVAC Shop</div>
            <div style="font-size:11px;color:var(--dim);margin-top:3px" id="activeLeadEmpPitchAngle">🔵 5-15 Staff · Verified Local Sweet Spot (Google/LinkedIn)</div>
          </div>`.replace(/\n/g, '\r\n');
    html = html.slice(0, start1) + new1 + html.slice(end1 + 6);
    console.log('Successfully replaced activeLeadEmpCell markup!');
  }
}

// 2. loadLeadIntoTeleprompter
const marker2 = 'const empCellVal = document.getElementById(\'activeLeadEmpVal\');';
const idx2 = html.indexOf(marker2);
if (idx2 !== -1) {
  const end2 = html.indexOf('const smallBizOwner =', idx2);
  const old2 = html.slice(idx2, end2);
  console.log('Found JS block in loadLeadIntoTeleprompter:\n', old2);

  const new2 = `const empCellVal = document.getElementById('activeLeadEmpVal');
    const empPitchAngle = document.getElementById('activeLeadEmpPitchAngle');

    if (empCellVal) {
      const rangeTxt = lead.employeeRange ? \`\${lead.employeeRange} Staff (Est. \${lead.employees})\` : \`\${lead.employees || 3} Staff\`;
      empCellVal.textContent = \`👥 \${rangeTxt} · \${lead.employeeTierName || 'Trade Shop'}\`;
    }
    if (empPitchAngle) {
      empPitchAngle.textContent = lead.employeeTier === 'fleetEnterprise' ? '🏢 Enterprise Multi-Truck Fleet' :
        lead.employeeTier === 'midMarket' ? '🟣 11-50 Staff · Verified Regional Pro (Google/LinkedIn)' :
        lead.employeeTier === 'sweetSpot' ? '🔵 5-10 Staff · Local Trade Shop' :
        '🟢 1-4 Staff · Owner in Field';
    }
    `.replace(/\n/g, '\r\n');
  html = html.slice(0, idx2) + new2 + html.slice(end2);
  console.log('Successfully replaced loadLeadIntoTeleprompter JS block!');
}

fs.writeFileSync('website/cold-call-arena/index.html', html, 'utf8');
console.log('Saved index.html');
