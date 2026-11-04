const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../website/cold-call-arena/index.html');
let html = fs.readFileSync(targetPath, 'utf8');

const isCRLF = html.includes('\r\n');
const EOL = isCRLF ? '\r\n' : '\n';

// 1. Insert leadsTabLeaderboardStrip before Nationwide Trade Leads Dispatcher
const search1 = '<h2 style="font-size:22px;margin-bottom:4px;font-family:var(--font-head)">📋 Nationwide Trade Leads Dispatcher';
const p1 = html.indexOf(search1);
if (p1 !== -1) {
  // Find the opening <div style="display:flex;align-items:center;justify-content:space-between before p1
  const divStart = html.lastIndexOf('<div style="display:flex;align-items:center;justify-content:space-between', p1);
  if (divStart !== -1) {
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
      </div>\n\n      `.split('\n').join(EOL);

    html = html.slice(0, divStart) + stripHtml + html.slice(divStart);
    console.log('1. Inserted leadsTabLeaderboardStrip successfully');
  } else {
    console.error('1. Could not find divStart');
  }
} else {
  console.error('1. Could not find search1');
}

// 2. Insert profileStatsDossier after Active Profile Card in #accountModal
const search2 = 'id="modalActiveXp">500 / 500 XP</div>';
const p2 = html.indexOf(search2);
if (p2 !== -1) {
  // Find closing </div>\r\n    </div> of the active profile card
  const cardEndDiv = html.indexOf('</div>' + EOL + '    </div>', p2);
  if (cardEndDiv !== -1) {
    const insertPos = cardEndDiv + ('</div>' + EOL + '    </div>').length;
    const dossierHtml = `\n\n    <!-- 📊 CLOSER CALL TRACKER & LEADERBOARD DOSSIER -->
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
    </div>`.split('\n').join(EOL);

    html = html.slice(0, insertPos) + dossierHtml + html.slice(insertPos);
    console.log('2. Inserted profileStatsDossier successfully');
  } else {
    console.error('2. Could not find cardEndDiv');
  }
} else {
  console.error('2. Could not find search2');
}

fs.writeFileSync(targetPath, html, 'utf8');
console.log('Done insert_strip_and_dossier.js!');
