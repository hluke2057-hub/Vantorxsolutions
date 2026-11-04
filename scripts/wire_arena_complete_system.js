const fs = require('fs');

const arenaPath = 'website/cold-call-arena/index.html';
let content = fs.readFileSync(arenaPath, 'utf8');

// 1. Add Call History List inside accountModal (around line 5085)
const targetBtn = '<button class="btn btn-gold btn-sm" type="button" onclick="closeAccountModal(); switchTab(\'tabLeaderboard\')" style="width:100%;font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px">';
const historySection = `<!-- 📋 YOUR PREVIOUSLY CALLED LEADS LIST -->
      <div style="background:rgba(0,0,0,0.5);border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:14px;margin-bottom:14px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div style="font-size:13px;font-weight:800;color:#ffffff;display:flex;align-items:center;gap:6px">
            <span>📋</span> YOUR CALLED LEADS HISTORY (<span id="modalCallerHistoryCount" style="color:var(--accent2)">0</span>)
          </div>
          <span style="font-size:11px;font-family:var(--font-mono);color:var(--dim)">Logged by this closer</span>
        </div>
        <div id="modalCallerHistoryList" style="max-height:180px;overflow-y:auto;display:flex;flex-direction:column;gap:8px">
          <!-- Populated dynamically -->
        </div>
      </div>
      
      ` + targetBtn;

if (content.includes(targetBtn)) {
  content = content.replace(targetBtn, historySection);
  console.log('1. Injected Call History into Account Modal.');
} else {
  console.warn('Could not find targetBtn for accountModal');
}

// 2. Overhaul renderLeaderboardUI to also update the Top Podium Strip and Top Command Bar
const oldRenderLeaderboardStart = 'window.renderLeaderboardUI = function() {';
const newRenderLeaderboard = `window.renderLeaderboardUI = function() {
    const standings = window.calculateLeaderboard();
    if (!standings || standings.length === 0) return;

    // 1. Update Top Command Bar Stats for Active Closer
    try {
      const activeCloserLower = (activeCaller || '').toLowerCase();
      const myRecord = standings.find(c => {
        const idLower = (c.id || '').toLowerCase();
        const nameLower = (c.name || '').toLowerCase();
        return activeCloserLower.includes(idLower) || activeCloserLower.includes(nameLower) || idLower.includes(activeCloserLower);
      }) || standings[0];

      const barCallsEl = document.getElementById('closerBarCallsCount');
      const barPointsEl = document.getElementById('closerBarPointsCount');
      const barRankEl = document.getElementById('closerBarRankMedal');
      const repSelectEl = document.getElementById('quickRepSelect');
      const barAvatarEl = document.getElementById('callerBarAvatar');

      if (barCallsEl) barCallsEl.textContent = myRecord.calls;
      if (barPointsEl) barPointsEl.textContent = myRecord.points.toFixed(1);
      if (barRankEl) barRankEl.textContent = \`\${myRecord.medal} \${myRecord.rank}\${myRecord.rank === 1 ? 'st' : (myRecord.rank === 2 ? 'nd' : (myRecord.rank === 3 ? 'rd' : 'th'))}\`;
      if (barAvatarEl) barAvatarEl.textContent = myRecord.avatar || '👑';
      if (repSelectEl && myRecord.id) {
        repSelectEl.value = myRecord.id;
      }
    } catch(e) {
      console.warn('Command bar update error:', e);
    }

    // 2. Update Top Leaderboard Champion Cards in Tab 0
    try {
      const gold = standings[0] || { name: 'Buddy (Closer)', points: 12.5, calls: 6, demos: 1, callbacks: 1 };
      const silver = standings[1] || { name: 'Lucas', points: 11.0, calls: 1, demos: 1, callbacks: 0 };
      const bronze = standings[2] || { name: 'Luke (Founder)', points: 1.5, calls: 1, demos: 0, callbacks: 1 };

      const gName = document.getElementById('stripGoldName');
      const gStats = document.getElementById('stripGoldStats');
      const sName = document.getElementById('stripSilverName');
      const sStats = document.getElementById('stripSilverStats');
      const bName = document.getElementById('stripBronzeName');
      const bStats = document.getElementById('stripBronzeStats');

      if (gName) gName.textContent = \`\${gold.name} (\${gold.points.toFixed(1)} pts)\`;
      if (gStats) gStats.textContent = \`\${gold.calls} Calls · \${gold.demos} Demos · \${gold.callbacks} Callbacks\`;

      if (sName) sName.textContent = \`\${silver.name} (\${silver.points.toFixed(1)} pts)\`;
      if (sStats) sStats.textContent = \`\${silver.calls} Calls · \${silver.demos} Demos · \${silver.callbacks} Callbacks\`;

      if (bName) bName.textContent = \`\${bronze.name} (\${bronze.points.toFixed(1)} pts)\`;
      if (bStats) bStats.textContent = \`\${bronze.calls} Calls · \${bronze.demos} Demos · \${bronze.callbacks} Callbacks\`;
    } catch(e) {
      console.warn('Top strip podium update error:', e);
    }
`;

content = content.replace(oldRenderLeaderboardStart, newRenderLeaderboard);
console.log('2. Overhauled renderLeaderboardUI to sync top command bar & top podium cards.');

// 3. Update updateUserUI to also populate modalCallerHistoryList
const updateUserMarker = 'function updateUserUI() {';
const newHistoryPopulateLogic = `function populateModalCallHistory() {
    const listEl = document.getElementById('modalCallerHistoryList');
    const countEl = document.getElementById('modalCallerHistoryCount');
    if (!listEl) return;

    listEl.innerHTML = '';
    const activeCloserLower = (activeCaller || '').toLowerCase();
    const calls = window.CALL_RECORDS || {};

    const callerCalls = [];
    for (const [id, rec] of Object.entries(calls)) {
      if (!rec || !rec.called) continue;
      const callerStr = (rec.caller || '').toLowerCase();
      // Match active caller
      if (activeCloserLower.includes('luke') && callerStr.includes('luke')) callerCalls.push({ id, ...rec });
      else if (activeCloserLower.includes('buddy') && callerStr.includes('buddy')) callerCalls.push({ id, ...rec });
      else if (activeCloserLower.includes('lucas') && callerStr.includes('lucas')) callerCalls.push({ id, ...rec });
      else if (activeCloserLower.includes('carter') && callerStr.includes('carter')) callerCalls.push({ id, ...rec });
      else if (activeCloserLower.includes('james') && callerStr.includes('james')) callerCalls.push({ id, ...rec });
      else if (callerStr.includes(activeCloserLower)) callerCalls.push({ id, ...rec });
    }

    if (countEl) countEl.textContent = callerCalls.length;

    if (callerCalls.length === 0) {
      listEl.innerHTML = '<div style="font-size:12px;color:var(--dim);text-align:center;padding:16px">No calls recorded yet for this closer profile. Dial a lead from the queue!</div>';
      return;
    }

    callerCalls.forEach(call => {
      const lead = (window.LEADS_DATA || []).find(l => String(l.id) === String(call.id)) || { company: 'Contractor Lead', phone: 'Unknown' };
      const item = document.createElement('div');
      item.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px';

      const isDemo = call.outcome === 'Success' || call.outcome === 'Booked Demo';
      const isCb = call.outcome === 'Call Back' || call.outcome === 'Callback Scheduled';
      const badgeColor = isDemo ? '#34d399' : (isCb ? '#38bdf8' : 'var(--dim)');
      const badgeText = isDemo ? '🎉 Booked Demo (+10)' : (isCb ? '⏳ Callback (+0.5)' : '❌ No Luck (1 pt)');

      item.innerHTML = \`
        <div>
          <div style="font-size:13px;font-weight:700;color:#ffffff">\${lead.company}</div>
          <div style="font-size:11px;color:var(--dim);display:flex;align-items:center;gap:6px">
            <span>\${lead.phone}</span> &middot; <span>\${call.timestamp || 'Today'}</span>
          </div>
          \${call.notes ? \`<div style="font-size:11px;color:#fbbf24;margin-top:2px">📝 "\${call.notes}"</div>\` : ''}
        </div>
        <div style="font-size:11px;font-family:var(--font-mono);font-weight:700;color:\${badgeColor};background:rgba(0,0,0,0.4);border:1px solid \${badgeColor};padding:3px 8px;border-radius:999px;white-space:nowrap">
          \${badgeText}
        </div>
      \`;
      listEl.appendChild(item);
    });
  }

  function updateUserUI() {
    setTimeout(populateModalCallHistory, 50);`;

content = content.replace(updateUserMarker, newHistoryPopulateLogic);
console.log('3. Injected populateModalCallHistory into updateUserUI.');

// 4. Update renderLeadsTable to handle both 'toCall' and 'calledHistory'
const renderLeadsStartMarker = 'function renderLeadsTable() {';
const newRenderLeadsHeader = `function renderLeadsTable() {
    leadTableBody.innerHTML = '';

    // Update uncalled vs called counts
    const callsObj = window.CALL_RECORDS || {};
    const totalCalledCount = Object.values(callsObj).filter(c => c && c.called).length;
    const totalUncalledCount = Math.max(0, LEADS_DATA.length - totalCalledCount);

    const uncalledBadgeEl = document.getElementById('uncalledCountBadge');
    const calledBadgeEl = document.getElementById('calledCountBadge');
    if (uncalledBadgeEl) uncalledBadgeEl.textContent = totalUncalledCount;
    if (calledBadgeEl) calledBadgeEl.textContent = totalCalledCount;

    // View: 'calledHistory' vs 'toCall'
    const viewMode = window.currentLeadView || 'toCall';
`;

content = content.replace(renderLeadsStartMarker, newRenderLeadsHeader);

// In the filtering logic of renderLeadsTable, respect viewMode:
content = content.replace(
  "const isCalled = !!(CALL_RECORDS[lead.id] && CALL_RECORDS[lead.id].called);",
  `const isCalled = !!(CALL_RECORDS[lead.id] && CALL_RECORDS[lead.id].called);
      if (viewMode === 'toCall' && isCalled) return false;
      if (viewMode === 'calledHistory' && !isCalled) return false;`
);

console.log('4. Updated renderLeadsTable filter to cleanly separate toCall vs calledHistory.');

// Write back to file
fs.writeFileSync(arenaPath, content, 'utf8');
console.log('All updates written to website/cold-call-arena/index.html!');
