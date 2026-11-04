const fs = require('fs');
const vm = require('vm');

const arenaPath = 'website/cold-call-arena/index.html';
let rawContent = fs.readFileSync(arenaPath, 'utf8');

// Normalize line endings to \n for clean processing
let isCrlf = rawContent.includes('\r\n');
let content = rawContent.replace(/\r\n/g, '\n');

// 1. Prepare clean verified real leads
const cleanLeads = JSON.parse(fs.readFileSync('data/real_verified_leads.json', 'utf8'));

const verified270 = cleanLeads.filter(l => {
  if (!l.phone) return false;
  const digits = l.phone.replace(/\D/g, '');
  if (digits.length !== 10 && digits.length !== 11) return false;
  const ex = digits.length === 10 ? digits.substring(3, 6) : digits.substring(4, 7);
  if (ex === '555') return false;
  return true;
});

verified270.forEach((l, idx) => {
  l.batch = Math.floor(idx / 50) + 1;
});

console.log(`Prepared ${verified270.length} clean real verified leads.`);

// 2. Replace LEADS_DATA using line search
const lines = content.split('\n');
let startLineIdx = -1;
let endLineIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const LEADS_DATA = [')) {
    startLineIdx = i;
  }
  if (startLineIdx !== -1 && i > startLineIdx && lines[i].trim() === '];') {
    endLineIdx = i;
    break;
  }
}

console.log(`Found LEADS_DATA at lines ${startLineIdx + 1} to ${endLineIdx + 1}`);

if (startLineIdx === -1 || endLineIdx === -1) {
  throw new Error('Could not find LEADS_DATA line boundaries');
}

const newLeadsLines = [
  '  const LEADS_DATA = ' + JSON.stringify(verified270, null, 2) + ';'
];

// Splice new leads into lines
lines.splice(startLineIdx, (endLineIdx - startLineIdx + 1), ...newLeadsLines);
content = lines.join('\n');
console.log('1. Embedded 271 clean verified real leads.');

// -------------------------------------------------------------
// 3. Overhaul Top Caller Command Bar
// -------------------------------------------------------------
const oldCallerBarRegex = /<!-- ⚔️ PROMINENT CALLER LOGIN & REP SWITCHER BAR -->[\s\S]*?<\/div>\s*<\/div>\s*<div class="tabs">/;

const newCallerBar = `<!-- ⚔️ EXECUTIVE CLOSER COMMAND BAR -->
  <div class="caller-bar" id="callerQuickBar" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:12px 18px;background:linear-gradient(135deg,rgba(15,23,42,0.95),rgba(11,15,22,0.95));border:1px solid rgba(245,158,11,0.35);border-radius:16px;margin-bottom:18px">
    <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
      <div class="user-profile-badge" id="quickProfileTrigger" onclick="openAccountModal()" style="cursor:pointer;display:inline-flex;align-items:center;gap:10px;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.4);padding:6px 14px;border-radius:999px" title="Click to view your personal call history &amp; stats">
        <span style="font-size:18px" id="callerBarAvatar">👑</span>
        <span style="font-size:14px;font-weight:800;color:#ffffff" id="callerBarCurrent">Luke (Founder)</span>
        <span style="font-size:11px;font-family:var(--font-mono);color:var(--accent2);background:rgba(245,158,11,0.2);padding:2px 8px;border-radius:999px">👤 My Profile &amp; History</span>
      </div>

      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:12px;color:var(--dim);font-family:var(--font-mono)">SWITCH CLOSER:</span>
        <select id="quickRepSelect" class="custom-select" style="font-size:13px;padding:6px 12px;background:var(--bg);border:1px solid rgba(245,158,11,0.3);border-radius:8px;color:#fff;font-weight:700" onchange="quickSwitchCaller(this.value)">
          <option value="luke">👑 Luke (Founder)</option>
          <option value="buddy">🤝 Buddy (Closer)</option>
          <option value="lucas">🎯 Lucas (Closer)</option>
          <option value="carter_mccauliss">⚔️ Carter McCauliss</option>
          <option value="james_mccullohs">🛡️ James McCullohs</option>
        </select>
      </div>

      <!-- Live Closer Stats Pill -->
      <div id="closerLiveStatsPill" onclick="openAccountModal()" style="cursor:pointer;display:inline-flex;align-items:center;gap:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);padding:5px 14px;border-radius:10px;font-size:13px" title="Click to see your call history">
        <span>📞 <strong id="closerBarCallsCount" style="color:#ffffff">0</strong> dials</span>
        <span style="color:rgba(255,255,255,0.2)">|</span>
        <span>⭐ <strong id="closerBarPointsCount" style="color:var(--accent2)">0.0</strong> pts</span>
        <span style="color:rgba(255,255,255,0.2)">|</span>
        <span>🏆 <strong id="closerBarRankMedal" style="color:#fbbf24">🥇 1st</strong></span>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:10px">
      <button class="btn btn-ghost btn-sm" id="btnSyncTeamCalls" onclick="fetchTeamCallsFromCloud(true)" style="border:1px solid rgba(56,189,248,0.4);color:#38bdf8;font-size:12px;font-weight:700;display:inline-flex;align-items:center;gap:6px">
        <span id="teamCallSyncDot" style="width:8px;height:8px;background:#34d399;border-radius:50%;display:inline-block"></span>
        🔄 Sync Cloud Calls
      </button>
      <button class="btn btn-ghost btn-sm" onclick="pushLocalCallsToCloud()" style="border:1px solid rgba(245,158,11,0.4);color:var(--accent2);font-size:12px;font-weight:700" title="Upload local calls to team cloud">
        ☁️ Push Calls
      </button>
    </div>
  </div>

  <div class="tabs">`;

if (oldCallerBarRegex.test(content)) {
  content = content.replace(oldCallerBarRegex, newCallerBar);
  console.log('2. Overhauled Caller Command Bar.');
}

// -------------------------------------------------------------
// 4. Streamline Tabs Bar (Lines ~609 to ~618)
// -------------------------------------------------------------
const oldTabsRegex = /<div class="tabs">[\s\S]*?<\/div>\s*<!-- TAB 0: 📋 LEAD DISPATCHER & LEAK CALCULATOR -->/;

const newTabs = `<div class="tabs">
    <button class="tab-btn active" type="button" id="tabBtnLeads" data-tab="tabLeads" onclick="switchTab('tabLeads')">📋 Lead Queue &amp; Call History (271 Real Targets)</button>
    <button class="tab-btn" type="button" id="tabBtnLeaderboard" data-tab="tabLeaderboard" onclick="switchTab('tabLeaderboard')" style="border-color:rgba(245,158,11,0.4);background:rgba(245,158,11,0.08);color:#fbbf24">🏆 Closer Leaderboard (Gold · Silver · Bronze)</button>
    <button class="tab-btn" type="button" id="tabBtnScript" data-tab="tabScript" onclick="switchTab('tabScript')">📜 Multi-Product Teleprompter</button>
    <button class="tab-btn" type="button" id="tabBtnAcademy" data-tab="tabAcademy" onclick="switchTab('tabAcademy')">🎓 Closer Training &amp; Objections</button>
  </div>

  <!-- TAB 0: 📋 LEAD DISPATCHER & LEAK CALCULATOR -->`;

if (oldTabsRegex.test(content)) {
  content = content.replace(oldTabsRegex, newTabs);
  console.log('3. Streamlined Tabs Bar.');
}

// -------------------------------------------------------------
// 5. Clean Clutter & Insert Prominent Podium + View Toggle Pill in Tab 0
// -------------------------------------------------------------
const oldCockpitHeaderRegex = /<!-- Leads Cockpit Container \(Shown when unlocked\) -->\s*<div id="leadsTableContainer" class="lead-cockpit">[\s\S]*?<div class="daily-batch-banner">/;

const newCockpitHeader = `<!-- Leads Cockpit Container (Shown when unlocked) -->
    <div id="leadsTableContainer" class="lead-cockpit">
      
      <!-- 🏆 PROMINENT CHAMPIONSHIP LEADERBOARD PODIUM -->
      <div class="leaderboard-champion-card" id="leadsTabLeaderboardStrip" style="background:linear-gradient(135deg,rgba(15,23,42,0.98),rgba(11,15,22,0.98));border:1.5px solid rgba(245,158,11,0.45);border-radius:20px;padding:20px 24px;margin-bottom:20px;box-shadow:0 12px 35px rgba(0,0,0,0.6)">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:16px;border-bottom:1px solid rgba(245,158,11,0.2);padding-bottom:12px">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="font-size:26px">🏆</span>
            <div>
              <div style="font-family:var(--font-head);font-size:18px;font-weight:800;color:#ffffff;letter-spacing:0.02em">CLOSER CHAMPIONSHIP LEADERBOARD PODIUM</div>
              <div style="font-size:12px;color:var(--dim);font-family:var(--font-mono)">Scoring: 1 Call = 1 pt &middot; +10 pts Booked Demo &middot; +0.5 Callback &middot; +0 No Luck</div>
            </div>
          </div>
          <button class="btn btn-gold btn-sm" type="button" onclick="switchTab('tabLeaderboard')" style="font-weight:800;display:inline-flex;align-items:center;gap:6px">
            🏆 Full Standings &amp; Podium Table ➔
          </button>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px" id="leadsStripPodiumPills">
          <!-- 🥇 Gold Card -->
          <div style="background:linear-gradient(135deg,rgba(245,158,11,0.18),rgba(217,119,6,0.08));border:1.5px solid #f59e0b;border-radius:14px;padding:14px 18px;display:flex;align-items:center;gap:14px;box-shadow:0 0 20px rgba(245,158,11,0.2)">
            <div style="font-size:36px">🥇</div>
            <div>
              <div style="font-size:11px;font-family:var(--font-mono);color:#fbbf24;font-weight:800;text-transform:uppercase">1ST PLACE · GOLD</div>
              <div style="font-size:17px;font-weight:800;color:#ffffff" id="stripGoldName">Buddy (12.5 pts)</div>
              <div style="font-size:12px;color:var(--dim)" id="stripGoldStats">6 Calls · 1 Demo · 1 Callback</div>
            </div>
          </div>
          <!-- 🥈 Silver Card -->
          <div style="background:linear-gradient(135deg,rgba(148,163,184,0.15),rgba(71,85,105,0.08));border:1.5px solid #94a3b8;border-radius:14px;padding:14px 18px;display:flex;align-items:center;gap:14px">
            <div style="font-size:36px">🥈</div>
            <div>
              <div style="font-size:11px;font-family:var(--font-mono);color:#cbd5e1;font-weight:800;text-transform:uppercase">2ND PLACE · SILVER</div>
              <div style="font-size:17px;font-weight:800;color:#ffffff" id="stripSilverName">Lucas (11.0 pts)</div>
              <div style="font-size:12px;color:var(--dim)" id="stripSilverStats">1 Call · 1 Demo</div>
            </div>
          </div>
          <!-- 🥉 Bronze Card -->
          <div style="background:linear-gradient(135deg,rgba(217,119,6,0.15),rgba(146,64,14,0.08));border:1.5px solid #d97706;border-radius:14px;padding:14px 18px;display:flex;align-items:center;gap:14px">
            <div style="font-size:36px">🥉</div>
            <div>
              <div style="font-size:11px;font-family:var(--font-mono);color:#f59e0b;font-weight:800;text-transform:uppercase">3RD PLACE · BRONZE</div>
              <div style="font-size:17px;font-weight:800;color:#ffffff" id="stripBronzeName">Luke (1.5 pts)</div>
              <div style="font-size:12px;color:var(--dim)" id="stripBronzeStats">1 Call · 1 Callback</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 📋 VIEW SWITCHER: QUEUE (TO CALL) VS PREVIOUSLY CALLED HISTORY -->
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px;background:linear-gradient(135deg,rgba(15,23,42,0.8),rgba(11,15,22,0.8));border:1px solid rgba(245,158,11,0.3);border-radius:16px;padding:14px 18px">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <button type="button" class="view-toggle-pill active" id="btnViewToCall" onclick="switchLeadView('toCall')" style="display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:12px;font-size:14px;font-weight:800;border:1px solid #f59e0b;background:linear-gradient(135deg,#f59e0b,#d97706);color:#070a0f;cursor:pointer;transition:all 0.2s">
            <span>📋</span> Dial Queue: To Call (<span id="uncalledCountBadge">265</span>)
          </button>
          <button type="button" class="view-toggle-pill" id="btnViewCalledHistory" onclick="switchLeadView('calledHistory')" style="display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:12px;font-size:14px;font-weight:800;border:1px solid var(--line);background:rgba(255,255,255,0.06);color:#cbd5e1;cursor:pointer;transition:all 0.2s">
            <span>✅</span> Previously Called History (<span id="calledCountBadge">6</span>)
          </button>
        </div>

        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <button class="btn btn-gold btn-sm" id="exportLeadsCsvBtn" onclick="exportLeadsCsv()">📥 Export CSV</button>
          <button class="btn btn-ghost btn-sm" id="resetCallsBtn" onclick="resetMyCalls()" style="border:1px solid rgba(248,113,113,0.3);color:#fca5a5" title="Clear checked calls on this browser">🔄 Reset My Calls</button>
        </div>
      </div>

      <div class="daily-batch-banner">`;

if (oldCockpitHeaderRegex.test(content)) {
  content = content.replace(oldCockpitHeaderRegex, newCockpitHeader);
  console.log('4. Injected Leaderboard Podium and View Switcher.');
}

// -------------------------------------------------------------
// 6. Update Batch Options in batchSelect
// -------------------------------------------------------------
const oldBatchSelectRegex = /<select id="batchSelect" class="custom-select">[\s\S]*?<\/select>/;
const newBatchSelect = `<select id="batchSelect" class="custom-select" style="font-weight:700">
                <option value="all" selected>All 271 Real Verified Leads (Strictly 2-10 Staff)</option>
                <option value="1">Batch 1: Palm Beach &amp; Broward (50 Real Targets)</option>
                <option value="2">Batch 2: Miami-Dade &amp; South FL (50 Real Targets)</option>
                <option value="3">Batch 3: Tampa Bay &amp; Gulf Coast (50 Real Targets)</option>
                <option value="4">Batch 4: Orlando &amp; Central FL (50 Real Targets)</option>
                <option value="5">Batch 5: Jacksonville &amp; North FL (50 Real Targets)</option>
                <option value="6">Batch 6: Southwest Florida (21 Real Targets)</option>
              </select>`;

if (oldBatchSelectRegex.test(content)) {
  content = content.replace(oldBatchSelectRegex, newBatchSelect);
  console.log('5. Updated batchSelect dropdown.');
}

// -------------------------------------------------------------
// 7. Add History Section inside Account Modal
// -------------------------------------------------------------
const targetModalBtn = '<button class="btn btn-gold btn-sm" type="button" onclick="closeAccountModal(); switchTab(\'tabLeaderboard\')" style="width:100%;font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px">';
const modalHistoryMarkup = `<!-- 📋 YOUR PREVIOUSLY CALLED LEADS LIST -->
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
      ` + targetModalBtn;

if (content.includes(targetModalBtn)) {
  content = content.replace(targetModalBtn, modalHistoryMarkup);
  console.log('6. Injected Called History into Account Modal.');
}

// -------------------------------------------------------------
// 8. Inject switchLeadView and populateModalCallHistory logic
// -------------------------------------------------------------
const scriptInsertTarget = '  let currentBatch = \'activeQueue\';';
const scriptReplacement = `  let currentLeadView = 'toCall'; // 'toCall' or 'calledHistory'
  window.currentLeadView = currentLeadView;

  window.switchLeadView = function(view) {
    currentLeadView = view;
    window.currentLeadView = view;
    
    const btnToCall = document.getElementById('btnViewToCall');
    const btnCalled = document.getElementById('btnViewCalledHistory');

    if (view === 'toCall') {
      if (btnToCall) {
        btnToCall.style.border = '1px solid #f59e0b';
        btnToCall.style.background = 'linear-gradient(135deg,#f59e0b,#d97706)';
        btnToCall.style.color = '#070a0f';
      }
      if (btnCalled) {
        btnCalled.style.border = '1px solid var(--line)';
        btnCalled.style.background = 'rgba(255,255,255,0.06)';
        btnCalled.style.color = '#cbd5e1';
      }
    } else {
      if (btnCalled) {
        btnCalled.style.border = '1px solid #34d399';
        btnCalled.style.background = 'linear-gradient(135deg,#10b981,#059669)';
        btnCalled.style.color = '#070a0f';
      }
      if (btnToCall) {
        btnToCall.style.border = '1px solid var(--line)';
        btnToCall.style.background = 'rgba(255,255,255,0.06)';
        btnToCall.style.color = '#cbd5e1';
      }
    }

    if (typeof renderLeadsTable === 'function') {
      renderLeadsTable();
    }
  };

  function populateModalCallHistory() {
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

  let currentBatch = 'all';`;

if (content.includes(scriptInsertTarget)) {
  content = content.replace(scriptInsertTarget, scriptReplacement);
  console.log('7. Injected switchLeadView and populateModalCallHistory.');
}

// -------------------------------------------------------------
// 9. Update renderLeadsTable filter to support currentLeadView
// -------------------------------------------------------------
const oldLeadFilterMarker = "const isCalled = !!(CALL_RECORDS[lead.id] && CALL_RECORDS[lead.id].called);";
const newLeadFilter = `const isCalled = !!(CALL_RECORDS[lead.id] && CALL_RECORDS[lead.id].called);
      if (currentLeadView === 'toCall' && isCalled) return false;
      if (currentLeadView === 'calledHistory' && !isCalled) return false;`;

content = content.replace(oldLeadFilterMarker, newLeadFilter);

// In renderLeadsTable start, update badges:
const oldRenderLeadsStart = "function renderLeadsTable() {";
const newRenderLeadsStart = `function renderLeadsTable() {
    // Update uncalled vs called counts
    const callsObj = window.CALL_RECORDS || {};
    const totalCalledCount = Object.values(callsObj).filter(c => c && c.called).length;
    const totalUncalledCount = Math.max(0, (window.LEADS_DATA || []).length - totalCalledCount);

    const uncalledBadgeEl = document.getElementById('uncalledCountBadge');
    const calledBadgeEl = document.getElementById('calledCountBadge');
    if (uncalledBadgeEl) uncalledBadgeEl.textContent = totalUncalledCount;
    if (calledBadgeEl) calledBadgeEl.textContent = totalCalledCount;
`;

content = content.replace(oldRenderLeadsStart, newRenderLeadsStart);
console.log('8. Updated renderLeadsTable logic.');

// -------------------------------------------------------------
// 10. Update renderLeaderboardUI to update top podium cards & command bar
// -------------------------------------------------------------
const oldRenderLeaderboardStart = 'window.renderLeaderboardUI = function() {';
const newRenderLeaderboardUI = `window.renderLeaderboardUI = function() {
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

content = content.replace(oldRenderLeaderboardStart, newRenderLeaderboardUI);
console.log('9. Updated renderLeaderboardUI logic.');

// In openAccountModal, call populateModalCallHistory
const openAccountModalMarker = 'window.openAccountModal = function() {';
const newOpenAccountModal = `window.openAccountModal = function() {
  setTimeout(() => {
    if (typeof populateModalCallHistory === 'function') populateModalCallHistory();
  }, 40);`;

content = content.replace(openAccountModalMarker, newOpenAccountModal);

// Verify Syntax Before Writing!
const scriptMatches = content.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
if (scriptMatches) {
  for (let i = 0; i < scriptMatches.length; i++) {
    const code = scriptMatches[i].replace(/<script\b[^>]*>/i, '').replace(/<\/script>/i, '');
    try {
      new vm.Script(code);
      console.log(`Script ${i+1}: Syntax Verified Clean!`);
    } catch(err) {
      console.error(`Syntax error in script ${i+1}:`, err.message);
      throw err;
    }
  }
}

// Write back with original line endings if needed
if (isCrlf) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(arenaPath, content, 'utf8');
console.log('Successfully wrote clean, validated arena HTML!');
