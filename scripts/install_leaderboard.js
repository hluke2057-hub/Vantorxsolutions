const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../website/cold-call-arena/index.html');
let html = fs.readFileSync(targetPath, 'utf8');

console.log('Original file lines:', html.split('\n').length);

// 1. ADD CSS
const cssToInsert = `
/* 🏆 CLOSER LEADERBOARD & PODIUM STYLING */
.leaderboard-live-strip{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(90deg,rgba(245,158,11,0.12),rgba(15,23,42,0.95),rgba(56,189,248,0.12));border:1.5px solid rgba(245,158,11,0.45);border-radius:12px;padding:10px 18px;margin-bottom:18px;cursor:pointer;transition:all 0.2s ease;flex-wrap:wrap;gap:12px;box-shadow:0 4px 18px rgba(0,0,0,0.35)}
.leaderboard-live-strip:hover{border-color:var(--accent);box-shadow:0 0 22px rgba(245,158,11,0.25);transform:translateY(-1px)}
.leaderboard-strip-left{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.leaderboard-strip-badge{font-size:12px;font-family:var(--font-mono);font-weight:800;letter-spacing:0.06em;color:var(--accent2);background:rgba(245,158,11,0.2);border:1px solid rgba(245,158,11,0.5);padding:3px 10px;border-radius:999px}
.leaderboard-strip-rule{font-size:12px;color:var(--dim)}
.leaderboard-strip-podium{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.podium-mini-pill{font-size:12px;font-family:var(--font-mono);font-weight:700;padding:4px 12px;border-radius:8px;display:inline-flex;align-items:center;gap:6px;transition:all 0.15s ease}
.podium-mini-pill.gold{background:linear-gradient(135deg,rgba(245,158,11,0.25),rgba(217,119,6,0.35));border:1.5px solid #f59e0b;color:#fef3c7;box-shadow:0 0 10px rgba(245,158,11,0.3)}
.podium-mini-pill.silver{background:linear-gradient(135deg,rgba(226,232,240,0.18),rgba(148,163,184,0.25));border:1.5px solid #cbd5e1;color:#f8fafc;box-shadow:0 0 10px rgba(203,213,225,0.2)}
.podium-mini-pill.bronze{background:linear-gradient(135deg,rgba(217,119,6,0.18),rgba(180,83,9,0.25));border:1.5px solid #d97706;color:#fed7aa;box-shadow:0 0 10px rgba(217,119,6,0.2)}

/* 🏆 Dedicated Leaderboard Tab 3D Podium Layout */
.podium-container{display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:20px;align-items:end;margin:24px 0 32px}
@media (max-width:880px){.podium-container{grid-template-columns:1fr;align-items:stretch}}
.podium-card{background:linear-gradient(180deg,rgba(18,24,38,0.98),rgba(15,23,42,0.98));border-radius:16px;padding:22px 18px;text-align:center;position:relative;box-shadow:0 8px 30px rgba(0,0,0,0.4);transition:all 0.25s ease}
.podium-card:hover{transform:translateY(-4px)}
.podium-card.gold{border:2px solid #f59e0b;background:linear-gradient(180deg,rgba(36,26,10,0.95),rgba(18,24,38,0.98));box-shadow:0 0 35px rgba(245,158,11,0.25);padding-top:28px}
.podium-card.silver{border:1.5px solid #cbd5e1;box-shadow:0 0 25px rgba(203,213,225,0.15)}
.podium-card.bronze{border:1.5px solid #d97706;box-shadow:0 0 25px rgba(217,119,6,0.15)}
.podium-crown{position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:32px;filter:drop-shadow(0 0 10px rgba(245,158,11,0.8))}
.podium-medal{font-size:42px;margin-bottom:8px}
.podium-name{font-family:var(--font-head);font-size:20px;font-weight:800;color:#ffffff;margin-bottom:4px}
.podium-role{font-size:12px;color:var(--dim);margin-bottom:12px;font-family:var(--font-mono)}
.podium-score{font-family:var(--font-head);font-size:34px;font-weight:900;color:var(--accent2);margin-bottom:2px}
.podium-score-label{font-size:11px;font-family:var(--font-mono);color:var(--dim);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:14px}
.podium-stats-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;background:rgba(0,0,0,0.35);padding:10px 8px;border-radius:10px;border:1px solid rgba(255,255,255,0.06)}
.podium-stat-val{font-size:14px;font-weight:700;color:#ffffff}
.podium-stat-lbl{font-size:9.5px;color:var(--dim);font-family:var(--font-mono);text-transform:uppercase}

/* Leaderboard Standings Table */
.lb-table-wrap{background:var(--bg2);border:1px solid var(--line);border-radius:14px;overflow-x:auto;box-shadow:0 6px 24px rgba(0,0,0,0.35)}
.lb-table{width:100%;border-collapse:collapse;font-size:13.5px}
.lb-table th{background:rgba(15,23,42,0.95);padding:14px 16px;text-align:left;font-family:var(--font-mono);font-size:11.5px;text-transform:uppercase;letter-spacing:0.05em;color:var(--dim);border-bottom:1px solid var(--line)}
.lb-table td{padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.05);color:#e2e8f0}
.lb-table tr:hover td{background:rgba(255,255,255,0.02)}
.lb-table tr.active-user-row td{background:rgba(245,158,11,0.08);border-top:1px solid rgba(245,158,11,0.3);border-bottom:1px solid rgba(245,158,11,0.3)}
.rank-badge{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;font-weight:800;font-size:14px;font-family:var(--font-mono)}
.rank-badge.gold{background:rgba(245,158,11,0.25);border:1.5px solid #f59e0b;color:#fbbf24}
.rank-badge.silver{background:rgba(203,213,225,0.2);border:1.5px solid #cbd5e1;color:#f8fafc}
.rank-badge.bronze{background:rgba(217,119,6,0.2);border:1.5px solid #d97706;color:#fed7aa}
.rank-badge.standard{background:rgba(255,255,255,0.05);border:1px solid var(--line);color:var(--dim)}
`;

if (!html.includes('CLOSER LEADERBOARD & PODIUM STYLING')) {
  html = html.replace('</style>', cssToInsert + '\n</style>');
  console.log('1. Injected CSS');
}

// 2. ADD TAB BUTTON
const tabTarget = '<button class="tab-btn active" type="button" id="tabBtnLeads" data-tab="tabLeads" onclick="switchTab(\'tabLeads\')">📋 100-Lead Dial Queue (+75/Day)</button>';
const tabReplacement = `<button class="tab-btn active" type="button" id="tabBtnLeads" data-tab="tabLeads" onclick="switchTab('tabLeads')">📋 100-Lead Dial Queue (+75/Day)</button>
    <button class="tab-btn" type="button" id="tabBtnLeaderboard" data-tab="tabLeaderboard" onclick="switchTab('tabLeaderboard')">🏆 Closer Leaderboard (Gold · Silver · Bronze)</button>`;

if (!html.includes('id="tabBtnLeaderboard"')) {
  html = html.replace(tabTarget, tabReplacement);
  console.log('2. Injected Leaderboard tab button');
}

// 3. ADD LIVE PODIUM STRIP ON TAB 1
const stripTarget = `<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px">
        <div>
          <h2 style="font-size:22px;margin-bottom:4px;font-family:var(--font-head)">📋 Nationwide Trade Leads Dispatcher &amp; Leak Calculator (750+ Targets)</h2>`;

const stripHtml = `<!-- 🏆 LIVE CLOSER LEADERBOARD PODIUM STRIP -->
      <div class="leaderboard-live-strip" id="leadsTabLeaderboardStrip" onclick="switchTab('tabLeaderboard')" title="Click to view full Leaderboard Podium &amp; Scoring Details">
        <div class="leaderboard-strip-left">
          <span class="leaderboard-strip-badge">🏆 LIVE CLOSER PODIUM</span>
          <span class="leaderboard-strip-rule">Formula: 1 pt / Call · +10 pts Booked Demo · +0.5 Callback · +0 No Luck</span>
        </div>
        <div class="leaderboard-strip-podium" id="leadsStripPodiumPills">
          <span class="podium-mini-pill gold">🥇 1st Gold: Syncing...</span>
          <span class="podium-mini-pill silver">🥈 2nd Silver: Syncing...</span>
          <span class="podium-mini-pill bronze">🥉 3rd Bronze: Syncing...</span>
        </div>
        <button class="btn btn-ghost btn-xs" type="button" onclick="event.stopPropagation(); switchTab('tabLeaderboard')" style="border-color:rgba(245,158,11,0.4);color:var(--accent2);font-weight:700">
          Open Full Podium ➔
        </button>
      </div>\n\n      ` + stripTarget;

if (!html.includes('id="leadsTabLeaderboardStrip"')) {
  html = html.replace(stripTarget, stripHtml);
  console.log('3. Injected Live Podium strip on Tab 1');
}

// 4. UPDATE EMPLOYEE FILTER PILLS TO 2-10 STAFF
const empPillsTarget = `<!-- Team Size / Employee Count Filter Pills (Targeting Small Local Businesses) -->
        <div class="lead-pills" id="leadEmpFilterPills" style="margin-top:6px;width:100%;display:flex;align-items:center;flex-wrap:wrap;gap:8px">
          <span style="font-size:11px;font-family:var(--font-mono);color:var(--ok);text-transform:uppercase;font-weight:700;display:inline-flex;align-items:center;margin-right:2px">👥 Team Size:</span>
          <button type="button" class="lead-pill-btn active" data-emp-filter="all">All Sizes (750)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="sweetSpot" style="border-color:rgba(52,211,153,0.4);color:#6ee7b7">🟢 1-5 Staff · Sweet Spot (<span id="empCountSweet">366</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="smallCrew" style="border-color:rgba(56,189,248,0.4);color:#7dd3fc">🔵 6-10 Staff · Local Crew (<span id="empCountCrew">162</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="smallBizAll" style="border-color:rgba(245,158,11,0.4);color:var(--accent2)">⭐ All Small Local (1-10) (<span id="empCountSmallAll">528</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="midShop">🟡 11-20 Staff (<span id="empCountMid">114</span>)</button>
          <button type="button" class="lead-pill-btn" data-emp-filter="regional">⚪ 21+ Staff (<span id="empCountReg">108</span>)</button>
          <div style="margin-left:auto;display:flex;align-items:center;gap:6px">
            <label for="leadSortSelect" style="font-size:11px;color:var(--dim);font-family:var(--font-mono);font-weight:700">SORT:</label>
            <select id="leadSortSelect" style="background:var(--bg);border:1px solid var(--line);color:var(--ink);padding:4px 8px;border-radius:6px;font-size:12px;cursor:pointer">
              <option value="empAsc" selected>🎯 Smallest Local First (1-5 Staff Priority)</option>
              <option value="default">Default Queue Order</option>
              <option value="leakDesc">Highest Leak First ($)</option>
            </select>
          </div>
        </div>`;

const empPillsReplacement = `<!-- Team Size / Employee Count Filter Pills (Targeting 2-10 Small Local Trades) -->
        <div class="lead-pills" id="leadEmpFilterPills" style="margin-top:6px;width:100%;display:flex;align-items:center;flex-wrap:wrap;gap:8px">
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

if (html.includes(empPillsTarget)) {
  html = html.replace(empPillsTarget, empPillsReplacement);
  console.log('4. Updated Employee Filter Pills to 2-10 staff');
}

// 5. ADD #tabLeaderboard PANEL BEFORE </main>
const tabLeaderboardHtml = `
  <!-- TAB: 🏆 CLOSER LEADERBOARD (GOLD, SILVER, BRONZE PODIUM) -->
  <div id="tabLeaderboard" class="tab-panel">
    <div class="lead-cockpit" style="margin-bottom:18px">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:14px">
        <div>
          <div style="font-size:12px;font-family:var(--font-mono);color:var(--accent2);text-transform:uppercase;letter-spacing:0.06em">Real-Time Closer Championship &amp; Dial Activity Podium</div>
          <h2 style="font-size:24px;margin-top:2px;font-family:var(--font-head);color:#ffffff">🏆 Closer Leaderboard (Gold · Silver · Bronze)</h2>
          <p style="color:var(--dim);font-size:13.5px;max-width:820px">
            High-volume closers take the podium. Every call logged earns points toward the championship, with maximum rewards for booking live 10-minute contractor demos.
          </p>
        </div>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <button class="btn btn-gold btn-sm" type="button" onclick="switchTab('tabLeads')">📞 Start Dialing in Queue ➔</button>
          <button class="btn btn-ghost btn-sm" type="button" onclick="fetchTeamCallsFromCloud(false)" style="border:1px solid rgba(56,189,248,0.4);color:#38bdf8">🔄 Refresh Standings</button>
        </div>
      </div>

      <!-- Championship Points Rules Banner -->
      <div style="background:linear-gradient(90deg,rgba(245,158,11,0.15),rgba(15,23,42,0.95),rgba(52,211,153,0.15));border:1.5px solid rgba(245,158,11,0.4);border-radius:12px;padding:14px 18px;margin-bottom:24px">
        <div style="font-size:11.5px;font-family:var(--font-mono);font-weight:800;color:var(--accent2);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">
          ⚖️ CHAMPIONSHIP SCORING FORMULA
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px">
          <div style="background:rgba(0,0,0,0.3);border:1px solid var(--line2);border-radius:8px;padding:10px">
            <div style="font-size:12px;color:var(--dim)">📞 ANY CALL LOGGED</div>
            <div style="font-size:17px;font-weight:800;color:#ffffff">+1.0 Point</div>
            <div style="font-size:11px;color:var(--dim)">Base point for every dial completed</div>
          </div>
          <div style="background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.3);border-radius:8px;padding:10px">
            <div style="font-size:12px;color:var(--ok)">🎉 BOOKED DEMO (SUCCESS)</div>
            <div style="font-size:17px;font-weight:800;color:var(--ok)">+10.0 Pts Bonus <small style="font-size:11px;color:#a7f3d0">(11 pts total)</small></div>
            <div style="font-size:11px;color:var(--dim)">Contractor locked into 10-min live demo</div>
          </div>
          <div style="background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.3);border-radius:8px;padding:10px">
            <div style="font-size:12px;color:#38bdf8">⏳ CALLBACK SCHEDULED</div>
            <div style="font-size:17px;font-weight:800;color:#38bdf8">+0.5 Pt Bonus <small style="font-size:11px;color:#bae6fd">(1.5 pts total)</small></div>
            <div style="font-size:11px;color:var(--dim)">Owner busy / scheduled specific time</div>
          </div>
          <div style="background:rgba(255,255,255,0.03);border:1px solid var(--line);border-radius:8px;padding:10px">
            <div style="font-size:12px;color:var(--dim)">❌ NO LUCK (VM / NOT INT)</div>
            <div style="font-size:17px;font-weight:800;color:#94a3b8">+0 Bonus <small style="font-size:11px;color:#64748b">(1.0 pt total)</small></div>
            <div style="font-size:11px;color:var(--dim)">Base point logged, keep dialing</div>
          </div>
        </div>
      </div>

      <!-- 3D Podium Display (Silver #2, Gold #1, Bronze #3) -->
      <div class="podium-container" id="leaderboardPodiumContainer">
        <!-- Rendered dynamically -->
      </div>

      <!-- Full Standings Table -->
      <div style="margin-top:28px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px">
          <h3 style="font-size:18px;font-family:var(--font-head);color:#ffffff;display:flex;align-items:center;gap:8px;margin:0">
            <span>📋</span> Complete Closer Standings &amp; Telemetry
          </h3>
          <span style="font-size:12px;font-family:var(--font-mono);color:var(--dim)" id="leaderboardLastUpdated">Updated live</span>
        </div>
        <div class="lb-table-wrap">
          <table class="lb-table">
            <thead>
              <tr>
                <th style="width:70px">Rank</th>
                <th>Closer Rep</th>
                <th>Role</th>
                <th style="text-align:center">Total Calls (1 pt ea)</th>
                <th style="text-align:center">🎉 Demos (+10 pts)</th>
                <th style="text-align:center">⏳ Callbacks (+0.5 pt)</th>
                <th style="text-align:center">❌ No Luck (1 pt)</th>
                <th style="text-align:right">Total Points</th>
                <th style="text-align:center">Medal Standing</th>
              </tr>
            </thead>
            <tbody id="leaderboardTableBody">
              <!-- Rendered dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
`;

if (!html.includes('id="tabLeaderboard"')) {
  html = html.replace('</main>', tabLeaderboardHtml + '\n</main>');
  console.log('5. Injected #tabLeaderboard panel before </main>');
}

// 6. ADD PROFILE STATS DOSSIER IN #accountModal
const modalActiveCardEnd = `<div style="text-align:right">
        <div style="font-size:14px;font-weight:700;color:var(--ok)" id="modalActiveLevel">Level 5</div>
        <div style="font-size:11.5px;color:var(--dim)" id="modalActiveXp">500 / 500 XP</div>
      </div>
    </div>`;

const profileDossierHtml = modalActiveCardEnd + `

    <!-- 📊 CLOSER CALL TRACKER & LEADERBOARD DOSSIER -->
    <div class="profile-stats-dossier" id="profileStatsDossier" style="background:linear-gradient(135deg,rgba(18,24,38,0.98),rgba(30,41,59,0.9));border:1.5px solid rgba(245,158,11,0.4);border-radius:14px;padding:16px;margin-bottom:20px;box-shadow:0 6px 20px rgba(0,0,0,0.4)">
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
      
      <button class="btn btn-gold btn-sm" type="button" onclick="closeAccountModal(); switchTab('tabLeaderboard')" style="width:100%;font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px">
        🏆 View Championship Podium &amp; Full Team Standings ➔
      </button>
    </div>`;

if (!html.includes('id="profileStatsDossier"')) {
  html = html.replace(modalActiveCardEnd, profileDossierHtml);
  console.log('6. Injected Profile Call Tracker Dossier in #accountModal');
}

// 7. UPDATE FILTER LOGIC IN renderLeadsTable
const oldEmpFilterLogic = `// 4c. Team Size / Employee Count filter (Target Small Local Businesses)
      if (currentEmpFilter !== 'all') {
        const emp = lead.employees || 3;
        if (currentEmpFilter === 'sweetSpot' && lead.employeeTier !== 'sweetSpot') return false;
        if (currentEmpFilter === 'smallCrew' && lead.employeeTier !== 'smallCrew') return false;
        if (currentEmpFilter === 'smallBizAll' && (!lead.isSmallLocalBiz && emp > 10)) return false;
        if (currentEmpFilter === 'midShop' && lead.employeeTier !== 'midShop') return false;
        if (currentEmpFilter === 'regional' && lead.employeeTier !== 'regional') return false;
      }`;

const newEmpFilterLogic = `// 4c. Team Size / Employee Count filter (Target Small Local Businesses 2-10 staff)
      if (currentEmpFilter !== 'all') {
        const emp = lead.employees || 3;
        if (currentEmpFilter === 'crew2to4' && (emp < 2 || emp > 4)) return false;
        if (currentEmpFilter === 'crew5to7' && (emp < 5 || emp > 7)) return false;
        if (currentEmpFilter === 'crew8to10' && (emp < 8 || emp > 10)) return false;
      }`;

if (html.includes(oldEmpFilterLogic)) {
  html = html.replace(oldEmpFilterLogic, newEmpFilterLogic);
  console.log('7. Updated renderLeadsTable employee filter logic');
}

// 8. UPDATE updateQuotaHUD EMPLOYEE COUNTS & CALL renderLeaderboardUI
const oldQuotaCounts = `    const sweetCount = batchLeads.filter(l => l.employeeTier === 'sweetSpot').length;
    const crewCount = batchLeads.filter(l => l.employeeTier === 'smallCrew').length;
    const smallTotal = batchLeads.filter(l => l.isSmallLocalBiz || (l.employees && l.employees <= 10)).length;
    const midCount = batchLeads.filter(l => l.employeeTier === 'midShop').length;
    const regCount = batchLeads.filter(l => l.employeeTier === 'regional').length;

    if (kpiFocus) kpiFocus.textContent = \`\${smallTotal} Small Shops\`;
    if (kpiFocusSub) kpiFocusSub.textContent = totalInBatch > 0 ? \`\${Math.round((smallTotal / totalInBatch) * 100)}% are 1-10 staff (Sweet Spot)\` : '1-10 staff';

    const empSw = document.getElementById('empCountSweet');
    const empCr = document.getElementById('empCountCrew');
    const empSmAll = document.getElementById('empCountSmallAll');
    const empMd = document.getElementById('empCountMid');
    const empRg = document.getElementById('empCountReg');

    if (empSw) empSw.textContent = sweetCount;
    if (empCr) empCr.textContent = crewCount;
    if (empSmAll) empSmAll.textContent = smallTotal;
    if (empMd) empMd.textContent = midCount;
    if (empRg) empRg.textContent = regCount;`;

const newQuotaCounts = `    const countAll2to10 = batchLeads.filter(l => (l.employees >= 2 && l.employees <= 10)).length;
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

if (html.includes(oldQuotaCounts)) {
  html = html.replace(oldQuotaCounts, newQuotaCounts);
  console.log('8. Updated updateQuotaHUD employee counts and leaderboard trigger');
}

// 9. INSERT LEADERBOARD ENGINE JAVASCRIPT FUNCTIONS
const jsLeaderboardEngine = `
  // ============================================================
  // 🏆 CLOSER CHAMPIONSHIP LEADERBOARD & PODIUM ENGINE
  // ============================================================
  // Scoring Rules:
  // Base call logged: +1.0 point
  // Booked Demo (Success): +10.0 points bonus (11.0 pts total)
  // Call Back: +0.5 point bonus (1.5 pts total)
  // No Luck: +0 bonus (1.0 pt total)

  window.calculateLeaderboard = function() {
    const closerMap = {};

    // 1. Seed with all known profiles from USER_PROFILES
    if (typeof USER_PROFILES === 'object' && USER_PROFILES) {
      Object.keys(USER_PROFILES).forEach(k => {
        const u = USER_PROFILES[k];
        if (!u) return;
        closerMap[k] = {
          id: k,
          name: u.name || k,
          role: u.role || 'Outbound Closer',
          avatar: u.avatar || '⚔️',
          calls: 0,
          demos: 0,
          callbacks: 0,
          noLuck: 0,
          points: 0.0,
          isFounder: !!u.isFounder
        };
      });
    }

    // Default core closer roster if not already present
    if (!closerMap.luke) closerMap.luke = { id: 'luke', name: 'Luke (Founder)', role: 'Founder & Closer', avatar: '👑', calls: 0, demos: 0, callbacks: 0, noLuck: 0, points: 0.0, isFounder: true };
    if (!closerMap.carter_mccauliss) closerMap.carter_mccauliss = { id: 'carter_mccauliss', name: 'Carter McCauliss', role: 'Certified Closer', avatar: '⚔️', calls: 0, demos: 0, callbacks: 0, noLuck: 0, points: 0.0, isFounder: false };
    if (!closerMap.lucas) closerMap.lucas = { id: 'lucas', name: 'Lucas', role: 'Certified Closer', avatar: '🎯', calls: 0, demos: 0, callbacks: 0, noLuck: 0, points: 0.0, isFounder: false };
    if (!closerMap.james_mccullohs) closerMap.james_mccullohs = { id: 'james_mccullohs', name: 'James McCullohs', role: 'Certified Closer', avatar: '⚔️', calls: 0, demos: 0, callbacks: 0, noLuck: 0, points: 0.0, isFounder: false };

    // 2. Aggregate from CALL_RECORDS
    const callsObj = window.CALL_RECORDS || {};
    for (const [id, rec] of Object.entries(callsObj)) {
      if (!rec || !rec.called) continue;
      const callerStr = (rec.caller || '').toLowerCase();
      let assignedId = null;

      if (callerStr.includes('carter')) assignedId = 'carter_mccauliss';
      else if (callerStr.includes('lucas')) assignedId = 'lucas';
      else if (callerStr.includes('luke')) assignedId = 'luke';
      else if (callerStr.includes('james')) assignedId = 'james_mccullohs';
      else {
        // match closerMap by name
        for (const cid in closerMap) {
          if (callerStr.includes(closerMap[cid].name.toLowerCase())) {
            assignedId = cid;
            break;
          }
        }
      }

      if (!assignedId) {
        const rawName = rec.caller || 'Closer Rep';
        assignedId = rawName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        if (!closerMap[assignedId]) {
          closerMap[assignedId] = {
            id: assignedId,
            name: rawName,
            role: 'Outbound Closer',
            avatar: '⚔️',
            calls: 0,
            demos: 0,
            callbacks: 0,
            noLuck: 0,
            points: 0.0,
            isFounder: false
          };
        }
      }

      const closer = closerMap[assignedId];
      closer.calls += 1;

      const isDemo = rec.outcome === 'Success' || rec.outcome === 'Booked Demo';
      const isCb = rec.outcome === 'Call Back' || rec.outcome === 'Callback Scheduled';

      if (isDemo) closer.demos += 1;
      else if (isCb) closer.callbacks += 1;
      else closer.noLuck += 1;
    }

    // 3. Compute formula points: (calls * 1.0) + (demos * 10.0) + (callbacks * 0.5)
    const list = Object.values(closerMap).map(c => {
      const pts = (c.calls * 1.0) + (c.demos * 10.0) + (c.callbacks * 0.5);
      c.points = parseFloat(pts.toFixed(1));
      return c;
    });

    // 4. Sort: Points DESC, then Calls DESC, then Demos DESC
    list.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.calls !== a.calls) return b.calls - a.calls;
      return b.demos - a.demos;
    });

    // 5. Assign medal & rank
    list.forEach((c, idx) => {
      c.rank = idx + 1;
      if (idx === 0) { c.medal = '🥇'; c.medalTier = 'Gold'; }
      else if (idx === 1) { c.medal = '🥈'; c.medalTier = 'Silver'; }
      else if (idx === 2) { c.medal = '🥉'; c.medalTier = 'Bronze'; }
      else { c.medal = \`#\${idx + 1}\`; c.medalTier = 'Contender'; }
    });

    return list;
  };

  window.renderLeaderboardUI = function() {
    try {
      const standings = window.calculateLeaderboard();
      const activeUser = typeof getActiveUser === 'function' ? getActiveUser() : { id: 'luke', name: 'Luke (Founder)' };
      const activeId = (activeUser && activeUser.id) ? activeUser.id : 'luke';
      const activeNameLower = ((activeUser && activeUser.name) || '').toLowerCase();

      // Find my standing
      let myRankObj = standings.find(s => s.id === activeId || activeNameLower.includes(s.name.toLowerCase()));
      if (!myRankObj) {
        myRankObj = standings[0] || { rank: 1, medal: '🥇', calls: 0, demos: 0, callbacks: 0, noLuck: 0, points: 0.0 };
      }

      // 1. Update Live Podium Strip on Tab 1
      const stripPillsEl = document.getElementById('leadsStripPodiumPills');
      if (stripPillsEl) {
        const top3 = standings.slice(0, 3);
        let pillsHtml = '';
        top3.forEach((c, idx) => {
          const tierClass = idx === 0 ? 'gold' : (idx === 1 ? 'silver' : 'bronze');
          pillsHtml += \`<span class="podium-mini-pill \${tierClass}">\${c.medal} \${c.name.split(' ')[0]}: \${c.points} pts (\${c.calls} calls)</span>\`;
        });
        stripPillsEl.innerHTML = pillsHtml;
      }

      // 2. Update 3D Podium Container on Tab 5
      const podiumContEl = document.getElementById('leaderboardPodiumContainer');
      if (podiumContEl) {
        const gold = standings[0] || { name: 'Luke', role: 'Founder', points: 0, calls: 0, demos: 0, callbacks: 0, noLuck: 0, avatar: '👑' };
        const silver = standings[1] || { name: 'Carter', role: 'Closer', points: 0, calls: 0, demos: 0, callbacks: 0, noLuck: 0, avatar: '⚔️' };
        const bronze = standings[2] || { name: 'Lucas', role: 'Closer', points: 0, calls: 0, demos: 0, callbacks: 0, noLuck: 0, avatar: '🎯' };

        podiumContEl.innerHTML = \`
          <!-- 🥈 2ND PLACE SILVER PODIUM -->
          <div class="podium-card silver">
            <div class="podium-medal">🥈</div>
            <div class="podium-name">\${silver.avatar} \${silver.name}</div>
            <div class="podium-role">\${silver.role}</div>
            <div class="podium-score" style="color:#e2e8f0">\${silver.points.toFixed(1)}</div>
            <div class="podium-score-label">Championship Points</div>
            <div class="podium-stats-grid">
              <div>
                <div class="podium-stat-val">\${silver.calls}</div>
                <div class="podium-stat-lbl">Calls</div>
              </div>
              <div>
                <div class="podium-stat-val" style="color:var(--ok)">\${silver.demos}</div>
                <div class="podium-stat-lbl">Demos</div>
              </div>
              <div>
                <div class="podium-stat-val" style="color:#38bdf8">\${silver.callbacks}</div>
                <div class="podium-stat-lbl">Callbk</div>
              </div>
            </div>
          </div>

          <!-- 🥇 1ST PLACE GOLD PODIUM (ELEVATED) -->
          <div class="podium-card gold">
            <div class="podium-crown">👑</div>
            <div class="podium-medal">🥇</div>
            <div class="podium-name" style="color:var(--accent2);font-size:22px">\${gold.avatar} \${gold.name}</div>
            <div class="podium-role" style="color:#fde68a">\${gold.role} · 🏆 CHAMPION</div>
            <div class="podium-score">\${gold.points.toFixed(1)}</div>
            <div class="podium-score-label">Championship Points</div>
            <div class="podium-stats-grid" style="border-color:rgba(245,158,11,0.3)">
              <div>
                <div class="podium-stat-val" style="font-size:16px">\${gold.calls}</div>
                <div class="podium-stat-lbl">Calls (1pt)</div>
              </div>
              <div>
                <div class="podium-stat-val" style="color:var(--ok);font-size:16px">\${gold.demos}</div>
                <div class="podium-stat-lbl">Demos (+10)</div>
              </div>
              <div>
                <div class="podium-stat-val" style="color:#38bdf8;font-size:16px">\${gold.callbacks}</div>
                <div class="podium-stat-lbl">Callbk (+0.5)</div>
              </div>
            </div>
          </div>

          <!-- 🥉 3RD PLACE BRONZE PODIUM -->
          <div class="podium-card bronze">
            <div class="podium-medal">🥉</div>
            <div class="podium-name">\${bronze.avatar} \${bronze.name}</div>
            <div class="podium-role">\${bronze.role}</div>
            <div class="podium-score" style="color:#fdba74">\${bronze.points.toFixed(1)}</div>
            <div class="podium-score-label">Championship Points</div>
            <div class="podium-stats-grid">
              <div>
                <div class="podium-stat-val">\${bronze.calls}</div>
                <div class="podium-stat-lbl">Calls</div>
              </div>
              <div>
                <div class="podium-stat-val" style="color:var(--ok)">\${bronze.demos}</div>
                <div class="podium-stat-lbl">Demos</div>
              </div>
              <div>
                <div class="podium-stat-val" style="color:#38bdf8">\${bronze.callbacks}</div>
                <div class="podium-stat-lbl">Callbk</div>
              </div>
            </div>
          </div>
        \`;
      }

      // 3. Update Full Standings Table Body
      const tableBodyEl = document.getElementById('leaderboardTableBody');
      if (tableBodyEl) {
        let rowsHtml = '';
        standings.forEach(c => {
          const isMe = c.id === activeId || activeNameLower.includes(c.name.toLowerCase());
          const badgeClass = c.rank === 1 ? 'gold' : (c.rank === 2 ? 'silver' : (c.rank === 3 ? 'bronze' : 'standard'));
          const rowClass = isMe ? 'active-user-row' : '';

          rowsHtml += \`
            <tr class="\${rowClass}">
              <td>
                <span class="rank-badge \${badgeClass}">\${c.medal}</span>
              </td>
              <td>
                <div style="font-weight:700;color:#ffffff;display:flex;align-items:center;gap:6px">
                  <span>\${c.avatar}</span>
                  <span>\${c.name}</span>
                  \${isMe ? '<span style="font-size:10px;background:rgba(245,158,11,0.25);color:var(--accent2);border:1px solid rgba(245,158,11,0.5);padding:1px 6px;border-radius:999px">YOU</span>' : ''}
                </div>
              </td>
              <td style="color:var(--dim);font-size:12.5px">\${c.role}</td>
              <td style="text-align:center;font-weight:700">\${c.calls}</td>
              <td style="text-align:center;font-weight:700;color:var(--ok)">\${c.demos}</td>
              <td style="text-align:center;font-weight:700;color:#38bdf8">\${c.callbacks}</td>
              <td style="text-align:center;color:var(--dim)">\${c.noLuck}</td>
              <td style="text-align:right;font-weight:900;font-size:15px;color:var(--accent2)">\${c.points.toFixed(1)}</td>
              <td style="text-align:center">
                <span class="podium-mini-pill \${badgeClass}" style="font-size:11px;padding:2px 8px">\${c.medal} \${c.medalTier}</span>
              </td>
            </tr>
          \`;
        });
        tableBodyEl.innerHTML = rowsHtml;
      }

      // 4. Update Profile Dossier in #accountModal
      const statCallsEl = document.getElementById('modalStatTotalCalls');
      const statDemosEl = document.getElementById('modalStatDemos');
      const statCbEl = document.getElementById('modalStatCallbacks');
      const statNlEl = document.getElementById('modalStatNoLuck');
      const statPointsEl = document.getElementById('modalStatTotalPoints');
      const modalMedalPill = document.getElementById('modalProfileMedalPill');

      if (statCallsEl) statCallsEl.textContent = myRankObj.calls;
      if (statDemosEl) statDemosEl.textContent = myRankObj.demos;
      if (statCbEl) statCbEl.textContent = myRankObj.callbacks;
      if (statNlEl) statNlEl.textContent = myRankObj.noLuck;
      if (statPointsEl) statPointsEl.textContent = myRankObj.points.toFixed(1);

      if (modalMedalPill) {
        if (myRankObj.rank === 1) {
          modalMedalPill.innerHTML = '🥇 1st Place · GOLD LEADER';
          modalMedalPill.style.borderColor = '#f59e0b';
          modalMedalPill.style.color = '#fbbf24';
          modalMedalPill.style.background = 'rgba(245,158,11,0.2)';
        } else if (myRankObj.rank === 2) {
          modalMedalPill.innerHTML = '🥈 2nd Place · SILVER PODIUM';
          modalMedalPill.style.borderColor = '#cbd5e1';
          modalMedalPill.style.color = '#f8fafc';
          modalMedalPill.style.background = 'rgba(203,213,225,0.2)';
        } else if (myRankObj.rank === 3) {
          modalMedalPill.innerHTML = '🥉 3rd Place · BRONZE PODIUM';
          modalMedalPill.style.borderColor = '#d97706';
          modalMedalPill.style.color = '#fed7aa';
          modalMedalPill.style.background = 'rgba(217,119,6,0.2)';
        } else {
          modalMedalPill.innerHTML = \`⚔️ Rank #\${myRankObj.rank} · \${myRankObj.points.toFixed(1)} Pts\`;
          modalMedalPill.style.borderColor = 'rgba(255,255,255,0.2)';
          modalMedalPill.style.color = 'var(--dim)';
          modalMedalPill.style.background = 'rgba(255,255,255,0.05)';
        }
      }

      // 5. Update Header User Rank to show Podium Medal & Calls
      const hRank = document.getElementById('headerUserRank');
      if (hRank && activeUser && activeUser.id !== 'guest') {
        hRank.textContent = \`\${myRankObj.medal} Rank #\${myRankObj.rank} · \${myRankObj.calls} Calls · \${myRankObj.points.toFixed(1)} Pts\`;
      }
    } catch(err) {
      console.warn('renderLeaderboardUI error:', err);
    }
  };
`;

if (!html.includes('window.calculateLeaderboard = function')) {
  // Insert before window.updateQuotaHUD or after renderTeamCallLogsTab
  const insertAnchor = 'function renderTeamCallLogsTab() {';
  html = html.replace(insertAnchor, jsLeaderboardEngine + '\n\n  ' + insertAnchor);
  console.log('9. Injected JavaScript Leaderboard Engine');
}

// 10. HOOK updateUserUI TO CALL renderLeaderboardUI
const updateUserHookTarget = `updateLeadGateVisibility();
      updateAcademyUI();
      updateDailyGoalsUI();
      renderAccountProfileList();`;

const updateUserHookReplacement = `updateLeadGateVisibility();
      updateAcademyUI();
      updateDailyGoalsUI();
      renderAccountProfileList();
      if (typeof window.renderLeaderboardUI === 'function') {
        window.renderLeaderboardUI();
      }`;

if (html.includes(updateUserHookTarget)) {
  html = html.replace(updateUserHookTarget, updateUserHookReplacement);
  console.log('10. Hooked renderLeaderboardUI into updateUserUI');
}

// Write modified HTML back
fs.writeFileSync(targetPath, html, 'utf8');
console.log('Successfully updated website/cold-call-arena/index.html!');
console.log('New file lines:', fs.readFileSync(targetPath, 'utf8').split('\n').length);
