const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../website/cold-call-arena/index.html');
let content = fs.readFileSync(targetPath, 'utf8');

// Detect line ending
const isCRLF = content.includes('\r\n');
const EOL = isCRLF ? '\r\n' : '\n';

console.log('Line ending is CRLF:', isCRLF);

// 1. Employee Filter Pills
const oldPillStart = '<div class="lead-pills" id="leadEmpFilterPills"';
const oldPillEnd = '</select>' + EOL + '          </div>' + EOL + '        </div>';

const idx1 = content.indexOf(oldPillStart);
if (idx1 !== -1) {
  const idx1End = content.indexOf(oldPillEnd, idx1);
  if (idx1End !== -1) {
    const fullEnd = idx1End + oldPillEnd.length;
    const replacementPills = `<div class="lead-pills" id="leadEmpFilterPills" style="margin-top:6px;width:100%;display:flex;align-items:center;flex-wrap:wrap;gap:8px">
          <span style="font-size:11px;font-family:var(--font-mono);color:var(--ok);text-transform:uppercase;font-weight:700;display:inline-flex;align-items:center;margin-right:2px">👥 Team Size (2-10 Staff Targets):</span>
          <button type="button" class="lead-pill-btn active" data-emp-filter="all">🎯 All 2-10 Staff (<span id="empCountAll2to10">750</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="crew2to4" style="border-color:rgba(52,211,153,0.4);color:#6ee7b7">🟢 2-4 Staff · Owner on Ladders (<span id="empCountCrew2to4">288</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="crew5to7" style="border-color:rgba(56,189,248,0.4);color:#7dd3fc">🔵 5-7 Staff · Sweet Spot Crew (<span id="empCountCrew5to7">315</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="crew8to10" style="border-color:rgba(245,158,11,0.4);color:var(--accent2)">⭐ 8-10 Staff · Multi-Truck Shop (<span id="empCountCrew8to10">147</span>)</button>
          <div style="margin-left:auto;display:flex;align-items:center;gap:6px">
            <label for="leadSortSelect" style="font-size:11px;color:var(--dim);font-family:var(--font-mono);font-weight:700">SORT:</label>
            <select id="leadSortSelect" style="background:var(--bg);border:1px solid var(--line);color:var(--ink);padding:4px 8px;border-radius:6px;font-size:12px;cursor:pointer">
              <option value="empAsc" selected>🎯 Smallest First (2-4 Staff Priority)</option>
              <option value="default">Default Queue Order</option>
              <option value="leakDesc">Highest Leak First ($)</option>
            </select>
          </div>
        </div>`.split('\n').join(EOL);

    content = content.slice(0, idx1) + replacementPills + content.slice(fullEnd);
    console.log('1. Replaced Employee Filter Pills');
  } else {
    console.log('1. Could not find idx1End');
  }
} else {
  console.log('1. Could not find idx1');
}

// 2. renderLeadsTable filter logic
const oldFilterStart = "if (currentEmpFilter !== 'all') {";
const oldFilterEnd = "if (currentEmpFilter === 'regional' && lead.employeeTier !== 'regional') return false;" + EOL + "      }";

const idx2 = content.indexOf(oldFilterStart);
if (idx2 !== -1) {
  const idx2End = content.indexOf(oldFilterEnd, idx2);
  if (idx2End !== -1) {
    const fullEnd2 = idx2End + oldFilterEnd.length;
    const replacementFilter = `if (currentEmpFilter !== 'all') {
        const emp = lead.employees || 3;
        if (currentEmpFilter === 'crew2to4' && (emp < 2 || emp > 4)) return false;
        if (currentEmpFilter === 'crew5to7' && (emp < 5 || emp > 7)) return false;
        if (currentEmpFilter === 'crew8to10' && (emp < 8 || emp > 10)) return false;
      }`.split('\n').join(EOL);

    content = content.slice(0, idx2) + replacementFilter + content.slice(fullEnd2);
    console.log('2. Replaced renderLeadsTable filter logic');
  } else {
    console.log('2. Could not find idx2End');
  }
} else {
  console.log('2. Could not find idx2');
}

// 3. Hook updateUserUI
const userHookSearch = "updateDailyGoalsUI();" + EOL + "      renderAccountProfileList();";
const idx3 = content.indexOf(userHookSearch);
if (idx3 !== -1) {
  const replacementHook = `updateDailyGoalsUI();
      renderAccountProfileList();
      if (typeof window.renderLeaderboardUI === 'function') {
        window.renderLeaderboardUI();
      }`.split('\n').join(EOL);
  content = content.slice(0, idx3) + replacementHook + content.slice(idx3 + userHookSearch.length);
  console.log('3. Hooked renderLeaderboardUI into updateUserUI');
} else {
  console.log('3. Could not find userHookSearch');
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Done apply_exact_edits.js!');
