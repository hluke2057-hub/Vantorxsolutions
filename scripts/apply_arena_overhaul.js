const fs = require('fs');

const arenaPath = 'website/cold-call-arena/index.html';
let content = fs.readFileSync(arenaPath, 'utf8');

// -------------------------------------------------------------
// 1. Overhaul Caller Bar (Lines ~587 to ~607)
// -------------------------------------------------------------
const oldCallerBarRegex = /<!-- ⚔️ PROMINENT CALLER LOGIN & REP SWITCHER BAR -->[\s\S]*?<\/div>\s*<\/div>\s*<div class="tabs">/;

const newCallerBar = `<!-- ⚔️ EXECUTIVE CLOSER COMMAND BAR -->
  <div class="caller-bar" id="callerQuickBar" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:12px 18px;background:linear-gradient(135deg,rgba(15,23,42,0.95),rgba(11,15,22,0.95));border:1px solid rgba(245,158,11,0.3);border-radius:16px;margin-bottom:18px">
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
  console.log('1. Overhauled Caller Command Bar.');
} else {
  console.warn('Could not match oldCallerBarRegex');
}

// -------------------------------------------------------------
// 2. Streamline Tabs Bar (Lines ~609 to ~618)
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
  console.log('2. Streamlined Tabs to 4 clear pillars.');
} else {
  console.warn('Could not match oldTabsRegex');
}

// -------------------------------------------------------------
// 3. Clean Clutter & Insert Prominent Podium + View Toggle Pill in Tab 0
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
  console.log('3. Cleaned cockpit header and inserted Leaderboard Podium + View Switcher.');
} else {
  console.warn('Could not match oldCockpitHeaderRegex');
}

// -------------------------------------------------------------
// 4. Update Batch Options in batchSelect (clean 271 real targets)
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
  console.log('4. Updated batchSelect dropdown to 271 real targets.');
} else {
  console.warn('Could not match oldBatchSelectRegex');
}

// -------------------------------------------------------------
// 5. Update Account Modal to include "Your Previously Called Leads"
// -------------------------------------------------------------
const oldAccountStatsRegex = /<div class="profile-stats-dossier" id="profileStatsDossier"[\s\S]*?<\/div>\s*<\/div>\s*<!-- Founder God Mode/;

const newAccountStats = `<div class="profile-stats-dossier" id="profileStatsDossier" style="background:linear-gradient(135deg,rgba(18,24,38,0.98),rgba(30,41,59,0.9));border:1.5px solid rgba(245,158,11,0.4);border-radius:14px;padding:16px;margin-bottom:20px;box-shadow:0 6px 20px rgba(0,0,0,0.4)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:18px">📊</span>
          <span style="font-size:14px;font-weight:700;color:#ffffff;letter-spacing:0.02em">YOUR CALL VOLUME &amp; PODIUM STANDING</span>
        </div>
        <div id="modalProfileMedalPill" style="font-size:12px;font-family:var(--font-mono);font-weight:700;padding:3px 10px;border-radius:999px;background:rgba(245,158,11,0.2);border:1px solid #f59e0b;color:#fbbf24">
          🥇 1st Place · Gold Leader
        </div>
      </div>
      
      <!-- 5-Card Stats Grid -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(85px,1fr));gap:8px;margin-bottom:14px">
        <div style="background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:10px;color:var(--dim);font-family:var(--font-mono);text-transform:uppercase">TOTAL CALLS</div>
          <div style="font-size:20px;font-weight:800;color:#ffffff;margin-top:2px" id="modalStatTotalCalls">0</div>
          <div style="font-size:9.5px;color:var(--dim)">1 pt / call</div>
        </div>
        <div style="background:var(--bg);border:1px solid rgba(52,211,153,0.3);border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:10px;color:var(--ok);font-family:var(--font-mono);text-transform:uppercase">DEMOS BOOKED</div>
          <div style="font-size:20px;font-weight:800;color:var(--ok);margin-top:2px" id="modalStatDemos">0</div>
          <div style="font-size:9.5px;color:var(--dim)">+10 pts bonus</div>
        </div>
        <div style="background:var(--bg);border:1px solid rgba(56,189,248,0.3);border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:10px;color:#38bdf8;font-family:var(--font-mono);text-transform:uppercase">CALLBACKS</div>
          <div style="font-size:20px;font-weight:800;color:#38bdf8;margin-top:2px" id="modalStatCallbacks">0</div>
          <div style="font-size:9.5px;color:var(--dim)">+0.5 pt bonus</div>
        </div>
        <div style="background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:10px;color:var(--dim);font-family:var(--font-mono);text-transform:uppercase">NO LUCK</div>
          <div style="font-size:20px;font-weight:800;color:var(--dim);margin-top:2px" id="modalStatNoLuck">0</div>
          <div style="font-size:9.5px;color:var(--dim)">+0 bonus (1 pt)</div>
        </div>
        <div style="background:linear-gradient(135deg,rgba(245,158,11,0.2),rgba(217,119,6,0.25));border:1.5px solid rgba(245,158,11,0.6);border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:10px;color:var(--accent2);font-family:var(--font-mono);text-transform:uppercase;font-weight:700">TOTAL SCORE</div>
          <div style="font-size:22px;font-weight:900;color:var(--accent2);margin-top:2px" id="modalStatTotalPoints">0.0</div>
          <div style="font-size:9.5px;color:var(--accent2)">Championship Pts</div>
        </div>
      </div>

      <!-- 📋 YOUR PREVIOUSLY CALLED LEADS LIST -->
      <div style="background:rgba(0,0,0,0.4);border:1px solid var(--line);border-radius:12px;padding:14px;margin-bottom:14px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div style="font-size:13px;font-weight:800;color:#ffffff;display:flex;align-items:center;gap:6px">
            <span>📋</span> YOUR CALLED LEADS HISTORY (<span id="modalCallerHistoryCount">0</span>)
          </div>
          <span style="font-size:11px;font-family:var(--font-mono);color:var(--dim)">Logged by this closer</span>
        </div>
        <div id="modalCallerHistoryList" style="max-height:200px;overflow-y:auto;display:flex;flex-direction:column;gap:8px">
          <!-- Populated dynamically -->
        </div>
      </div>
      
      <button class="btn btn-gold btn-sm" type="button" onclick="closeAccountModal(); switchTab('tabLeaderboard')" style="width:100%;font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px">
        🏆 View Championship Podium &amp; Full Team Standings ➔
      </button>
    </div>

    <!-- Founder God Mode`;

if (oldAccountStatsRegex.test(content)) {
  content = content.replace(oldAccountStatsRegex, newAccountStats);
  console.log('5. Added previous called history to Account Modal.');
} else {
  console.warn('Could not match oldAccountStatsRegex');
}

// -------------------------------------------------------------
// 6. Add JavaScript State and Logic for switchLeadView and Called History
// -------------------------------------------------------------
const scriptInsertMarker = 'let currentBatch = \'activeQueue\';';
const newJsLogic = `let currentLeadView = 'toCall'; // 'toCall' or 'calledHistory'
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

  let currentBatch = 'all';`;

if (content.includes(scriptInsertMarker)) {
  content = content.replace(scriptInsertMarker, newJsLogic);
  console.log('6. Injected currentLeadView state and switchLeadView function.');
} else {
  console.warn('Could not find scriptInsertMarker');
}

// Write to file
fs.writeFileSync(arenaPath, content, 'utf8');
console.log('Saved arena HTML with UI overhaul!');
