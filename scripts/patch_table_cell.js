const fs = require('fs');
let html = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');

const marker = '<div class="badge-emp badge-emp-${lead.employeeTier || \'smallCrew\'}"';
const idx = html.indexOf(marker);

if (idx !== -1) {
  // Find surrounding <td> and </td>
  const tdStart = html.lastIndexOf('<td>', idx);
  const tdEnd = html.indexOf('</td>', idx) + 5;

  const oldCell = html.slice(tdStart, tdEnd);
  console.log('Found old cell:\n', oldCell);

  const newCell = `<td>
          <div style="font-weight:700;color:#ffffff;display:flex;align-items:center;gap:5px">
            <span>👥</span> <span>\${lead.employeeRange ? lead.employeeRange + ' Staff' : (lead.employees || 3) + ' Staff'}</span>
          </div>
          <div class="badge-emp badge-emp-\${lead.employeeTier || 'midMarket'}" title="\${lead.employeeLabel || ''}">
            \${lead.employeeBadge || (lead.employeeRange ? '👥 ' + lead.employeeRange + ' Staff' : '👥 ' + (lead.employees || 3) + ' Staff')}
          </div>
          <div style="font-size:10px;color:var(--dim);margin-top:2px">\${lead.employeeSource ? '✓ Verified ' + lead.employeeSource : (lead.isSmallLocalBiz ? '★ Local Trade Shop' : (lead.employeeTier === 'fleetEnterprise' ? '🏢 Enterprise Fleet' : '★ Regional Trade Pro'))}</div>
        </td>`;

  html = html.slice(0, tdStart) + newCell + html.slice(tdEnd);
  fs.writeFileSync('website/cold-call-arena/index.html', html, 'utf8');
  console.log('Successfully replaced table cell at line 21665!');
} else {
  console.error('Marker not found!');
}
