const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../website/cold-call-arena/index.html');
let html = fs.readFileSync(targetPath, 'utf8');

// 1. Employee Filter Pills
const oldPills = html.slice(78380, 79450);
const startTag = '<div class="lead-pills" id="leadEmpFilterPills"';
const endTag = '</div>\n      </div>';

const pStart = html.indexOf(startTag);
const pEnd = html.indexOf('</div>\n      </div>\n\n      <!-- Pagination', pStart);

if (pStart !== -1 && pEnd !== -1) {
  const currentBlock = html.slice(pStart, pEnd + 6);
  const newBlock = `<div class="lead-pills" id="leadEmpFilterPills" style="margin-top:6px;width:100%;display:flex;align-items:center;flex-wrap:wrap;gap:8px">
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
        </div>`;
  html = html.slice(0, pStart) + newBlock + html.slice(pEnd + 6);
  console.log('1. Replaced Employee Filter Pills');
} else {
  console.log('1. Could not locate employee filter pills block');
}

// 2. renderLeadsTable Filter Logic
const oldFilterSearch = `if (currentEmpFilter !== 'all') {
        const emp = lead.employees || 3;
        if (currentEmpFilter === 'sweetSpot' && lead.employeeTier !== 'sweetSpot') return false;
        if (currentEmpFilter === 'smallCrew' && lead.employeeTier !== 'smallCrew') return false;
        if (currentEmpFilter === 'smallBizAll' && (!lead.isSmallLocalBiz && emp > 10)) return false;
        if (currentEmpFilter === 'midShop' && lead.employeeTier !== 'midShop') return false;
        if (currentEmpFilter === 'regional' && lead.employeeTier !== 'regional') return false;
      }`;

const newFilterReplacement = `if (currentEmpFilter !== 'all') {
        const emp = lead.employees || 3;
        if (currentEmpFilter === 'crew2to4' && (emp < 2 || emp > 4)) return false;
        if (currentEmpFilter === 'crew5to7' && (emp < 5 || emp > 7)) return false;
        if (currentEmpFilter === 'crew8to10' && (emp < 8 || emp > 10)) return false;
      }`;

if (html.includes(oldFilterSearch)) {
  html = html.replace(oldFilterSearch, newFilterReplacement);
  console.log('2. Replaced renderLeadsTable currentEmpFilter logic');
} else {
  console.log('2. Could not locate oldFilterSearch');
}

// 3. updateQuotaHUD Employee Counts and Leaderboard Trigger
const hudIdx = html.indexOf('const sweetCount = batchLeads.filter(');
if (hudIdx !== -1) {
  const hudEndIdx = html.indexOf('if (empRg) empRg.textContent = regCount;', hudIdx);
  if (hudEndIdx !== -1) {
    const oldHudChunk = html.slice(hudIdx, hudEndIdx + 'if (empRg) empRg.textContent = regCount;'.length);
    const newHudChunk = `const countAll2to10 = batchLeads.filter(l => (l.employees >= 2 && l.employees <= 10)).length;
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
    if (el8to10) el8to10.textContent = countCrew8to10;

    if (kpiFocus) kpiFocus.textContent = \`\${countAll2to10} Small Local Shops\`;
    if (kpiFocusSub) kpiFocusSub.textContent = totalInBatch > 0 ? '100% of queue targets 2-10 staff contractors' : '2-10 staff';

    if (typeof window.renderLeaderboardUI === 'function') {
      window.renderLeaderboardUI();
    }`;

    html = html.slice(0, hudIdx) + newHudChunk + html.slice(hudEndIdx + 'if (empRg) empRg.textContent = regCount;'.length);
    console.log('3. Replaced updateQuotaHUD employee counts and hooked renderLeaderboardUI');
  }
} else {
  console.log('3. Could not locate updateQuotaHUD employee counts');
}

// 4. updateUserUI hook
const userHookIdx = html.indexOf('updateDailyGoalsUI();\n      renderAccountProfileList();');
if (userHookIdx !== -1) {
  const targetStr = 'updateDailyGoalsUI();\n      renderAccountProfileList();';
  const replStr = `updateDailyGoalsUI();
      renderAccountProfileList();
      if (typeof window.renderLeaderboardUI === 'function') {
        window.renderLeaderboardUI();
      }`;
  html = html.replace(targetStr, replStr);
  console.log('4. Hooked renderLeaderboardUI into updateUserUI');
} else {
  console.log('4. Could not locate updateUserUI hook');
}

fs.writeFileSync(targetPath, html, 'utf8');
console.log('Completed finish_arena_updates.js!');
