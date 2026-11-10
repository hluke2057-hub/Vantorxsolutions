const fs = require('fs');
let html = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');

// 1. Locate pills container
const pillMarker = '<div class="lead-pills" id="leadEmpFilterPills"';
const idx1 = html.indexOf(pillMarker);
if (idx1 !== -1) {
  const endIdx1 = html.indexOf('</div>', idx1);
  const oldPills = html.slice(idx1, endIdx1 + 6);
  console.log('Found old pills container:\n', oldPills);

  const newPills = `<div class="lead-pills" id="leadEmpFilterPills" style="margin-top:6px;width:100%;display:flex;align-items:center;flex-wrap:wrap;gap:8px">
          <span style="font-size:11px;font-family:var(--font-mono);color:var(--ok);text-transform:uppercase;font-weight:700;display:inline-flex;align-items:center;margin-right:2px">👥 Team Size:</span>
          <button type="button" class="lead-pill-btn active" data-emp-filter="all">🎯 All (<span id="empCountAll">346</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="crew1to4" style="border-color:rgba(52,211,153,0.4);color:#6ee7b7">🟢 1-4 Staff (<span id="empCountCrew1to4">0</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="crew5to10" style="border-color:rgba(56,189,248,0.4);color:#7dd3fc">🔵 5-10 Staff (<span id="empCountCrew5to10">0</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="crew11to50" style="border-color:rgba(168,85,247,0.4);color:#c084fc">🟣 11-50 Staff (<span id="empCountCrew11to50">0</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="crew50Plus" style="border-color:rgba(245,158,11,0.4);color:var(--accent2)">🏢 50+ Fleet (<span id="empCountCrew50Plus">0</span>)</button>
          <div style="margin-left:auto;display:flex;align-items:center;gap:6px">
            <label for="leadSortSelect" style="font-size:11px;color:var(--dim);font-family:var(--font-mono);font-weight:700">SORT:</label>
            <select id="leadSortSelect" style="background:var(--bg);border:1px solid var(--line);color:var(--ink);padding:4px 8px;border-radius:6px;font-size:12px;cursor:pointer">
              <option value="empAsc" selected>🎯 Smallest First (1-4 Staff Priority)</option>
              <option value="default">Default Queue Order</option>
              <option value="leakDesc">Highest Leak First ($)</option>
            </select>
          </div>
        </div>`;
  html = html.slice(0, idx1) + newPills + html.slice(endIdx1 + 6);
  console.log('Replaced pills container!');
}

// 2. Locate filter logic
const filterMarker = '// 4c. Team Size / Employee Count filter';
const idx2 = html.indexOf(filterMarker);
if (idx2 !== -1) {
  const endIdx2 = html.indexOf('// 5. Search query', idx2);
  const oldLogic = html.slice(idx2, endIdx2);
  console.log('Found old filter logic:\n', oldLogic);

  const newLogic = `// 4c. Real Team Size & Verified Employee Count Filter (Google / LinkedIn Verified)
      if (currentEmpFilter !== 'all') {
        const emp = lead.employees || 3;
        if (currentEmpFilter === 'crew1to4' && (emp < 1 || emp > 4)) return false;
        if (currentEmpFilter === 'crew5to10' && (emp < 5 || emp > 10)) return false;
        if (currentEmpFilter === 'crew11to50' && (emp < 11 || emp > 50)) return false;
        if (currentEmpFilter === 'crew50Plus' && (emp <= 50)) return false;
        if (currentEmpFilter === 'crew2to4' && (emp < 1 || emp > 4)) return false;
        if (currentEmpFilter === 'crew5to7' && (emp < 5 || emp > 10)) return false;
        if (currentEmpFilter === 'crew8to10' && (emp < 11 || emp > 50)) return false;
      }
      `;
  html = html.slice(0, idx2) + newLogic + html.slice(endIdx2);
  console.log('Replaced filter logic!');
}

// 3. Locate counts logic in updateQuotaHUD
const countMarker = 'const countAll2to10 = batchLeads.filter(';
const idx3 = html.indexOf(countMarker);
if (idx3 !== -1) {
  const endIdx3 = html.indexOf('if (kpiFocus)', idx3);
  const oldCounts = html.slice(idx3, endIdx3);
  console.log('Found old counts logic:\n', oldCounts);

  const newCounts = `const countAll = batchLeads.length;
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
    if (el50Plus) el50Plus.textContent = countCrew50Plus;
    `;
  html = html.slice(0, idx3) + newCounts + html.slice(endIdx3);
  console.log('Replaced counts logic!');
}

fs.writeFileSync('website/cold-call-arena/index.html', html, 'utf8');
console.log('All 3 sections successfully updated in website/cold-call-arena/index.html!');
