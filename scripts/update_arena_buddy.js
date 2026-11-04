const fs = require('fs');

const arenaPath = 'website/cold-call-arena/index.html';
let content = fs.readFileSync(arenaPath, 'utf8');

// 1. DEFAULT_PROFILES: Add buddy profile
const defaultBuddyProfile = `    buddy: {
      id: 'buddy',
      name: 'Buddy (Closer)',
      email: 'buddy@vantorxsolutions.com',
      role: 'Certified Closer & Phone Warrior',
      avatar: '🤝',
      level: 5,
      xp: 1850,
      isFounder: false,
      founderBypass: true,
      autoPassed: true,
      completedUnits: ['1-1','1-2','1-3','1-4','1-5','2-1','2-2','2-3','2-4','2-5','3-1','3-2','3-3','3-4','3-5'],
      unitActivitiesDone: ['1-1','1-2','1-3','1-4','2-1','2-2','2-3','3-1','3-2','3-3'],
      flashcardsRevealed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      daysPassed: [1, 2, 3],
      modulesPassed: [1, 2, 3, 4, 5],
      bossesDefeated: 8,
      dailyDials: 0,
      dailySims: 0,
      createdAt: '2026-10-21T14:00:00.000Z',
      lastActive: new Date().toISOString(),
      lastAction: '🏆 Level 5 Certified Closer · Buddy Auto-Pass Active'
    },
`;

if (!content.includes("buddy: {")) {
  content = content.replace("james_mccullohs: {", defaultBuddyProfile + "    james_mccullohs: {");
}

// 2. USER_PROFILES initial check:
content = content.replace(
  "if (!USER_PROFILES.james_mccullohs) USER_PROFILES.james_mccullohs = DEFAULT_PROFILES.james_mccullohs;",
  "if (!USER_PROFILES.james_mccullohs) USER_PROFILES.james_mccullohs = DEFAULT_PROFILES.james_mccullohs;\n  if (!USER_PROFILES.buddy) USER_PROFILES.buddy = DEFAULT_PROFILES.buddy;"
);

// 3. Remove buddy from mockKeys and deletion checks in both blocks
content = content.replace(
  "const mockKeys = ['buddy', 'rep_buddy_2', 'rep_marcus', 'rep_jake', 'rep_tyler', 'rep_mvpib4wi'];",
  "const mockKeys = ['rep_marcus', 'rep_jake', 'rep_tyler', 'rep_mvpib4wi'];"
);
content = content.replace(
  "const mockKeys = ['buddy', 'rep_buddy_2', 'rep_marcus', 'rep_jake', 'rep_tyler', 'rep_mvpib4wi'];",
  "const mockKeys = ['rep_marcus', 'rep_jake', 'rep_tyler', 'rep_mvpib4wi'];"
);

content = content.replace(
  "kl.includes('marcus') || kl.includes('jake') || kl.includes('tyler') || kl.includes('probe') || kl.includes('buddy') ||\n      nm.includes('marcus') || nm.includes('jake') || nm.includes('tyler') || nm.includes('probe') || nm.includes('buddy') ||",
  "kl.includes('marcus') || kl.includes('jake') || kl.includes('tyler') || kl.includes('probe') ||\n      nm.includes('marcus') || nm.includes('jake') || nm.includes('tyler') || nm.includes('probe') ||"
);

content = content.replace(
  "kl.includes('marcus') || kl.includes('jake') || kl.includes('tyler') || kl.includes('probe') || kl.includes('buddy') ||\n      nm.includes('marcus') || nm.includes('jake') || nm.includes('tyler') || nm.includes('probe') || nm.includes('buddy') ||",
  "kl.includes('marcus') || kl.includes('jake') || kl.includes('tyler') || kl.includes('probe') ||\n      nm.includes('marcus') || nm.includes('jake') || nm.includes('tyler') || nm.includes('probe') ||"
);

// Allow @vantorxsolutions.com email for buddy
content = content.replace(
  "(em.endsWith('@vantorxsolutions.com') && kl !== 'luke' && kl !== 'founder_luke' && kl !== 'lucas' && !kl.includes('lucas'))",
  "(em.endsWith('@vantorxsolutions.com') && kl !== 'luke' && kl !== 'founder_luke' && kl !== 'lucas' && !kl.includes('lucas') && !kl.includes('buddy'))"
);

// 4. Auto-pass buddy Level 5
content = content.replace(
  "em.includes('mccullohs')) {",
  "em.includes('mccullohs') || kl.includes('buddy') || nm.includes('buddy') || em.includes('buddy')) {"
);

// 5. getRepAvatar(caller)
content = content.replace(
  "if (c.includes('james')) return '🛡️';\n    return '👤';",
  "if (c.includes('james')) return '🛡️';\n    if (c.includes('buddy')) return '🤝';\n    return '👤';"
);

// 6. calculateLeaderboard: add buddy closerMap entry
const buddyCloserMapCode = `if (!closerMap.buddy) closerMap.buddy = { id: 'buddy', name: 'Buddy (Closer)', role: 'Certified Closer', avatar: '🤝', calls: 0, demos: 0, callbacks: 0, noLuck: 0, points: 0.0, isFounder: false };`;
if (!content.includes("closerMap.buddy = {")) {
  content = content.replace(
    "if (!closerMap.james_mccullohs) closerMap.james_mccullohs = { id: 'james_mccullohs', name: 'James McCullohs', role: 'Certified Closer', avatar: '⚔️', calls: 0, demos: 0, callbacks: 0, noLuck: 0, points: 0.0, isFounder: false };",
    "if (!closerMap.james_mccullohs) closerMap.james_mccullohs = { id: 'james_mccullohs', name: 'James McCullohs', role: 'Certified Closer', avatar: '🛡️', calls: 0, demos: 0, callbacks: 0, noLuck: 0, points: 0.0, isFounder: false };\n    " + buddyCloserMapCode
  );
}

// 7. calculateLeaderboard aggregation:
content = content.replace(
  "else if (callerStr.includes('james')) assignedId = 'james_mccullohs';",
  "else if (callerStr.includes('james')) assignedId = 'james_mccullohs';\n      else if (callerStr.includes('buddy')) assignedId = 'buddy';"
);

// 8. callerSelect options (ensure Buddy options exist cleanly)
content = content.replace(
  `<option value="James McCullohs">James McCullohs</option>\n                <option value="Buddy 2 (Rep 2)">Buddy 2 (Rep 2)</option>`,
  `<option value="James McCullohs">James McCullohs</option>\n                <option value="Buddy (Closer)">Buddy (Closer)</option>\n                <option value="Buddy 2 (Rep 2)">Buddy 2 (Rep 2)</option>`
);

// 9. Tab 0 Rep Filter Pills: add Buddy button
if (!content.includes('data-caller-filter="buddy"')) {
  content = content.replace(
    `<button class="lead-pill-btn" data-caller-filter="james">🛡️ James (<span id="countCalledJames">0</span>)</button>`,
    `<button class="lead-pill-btn" data-caller-filter="james">🛡️ James (<span id="countCalledJames">0</span>)</button>\n          <button class="lead-pill-btn" data-caller-filter="buddy">🤝 Buddy (<span id="countCalledBuddy">0</span>)</button>`
  );
}

// 10. Tab 0 caller filter in renderLeadsTable:
content = content.replace(
  `if (currentCallerFilter === 'james' && !callerLower.includes('james')) return false;`,
  `if (currentCallerFilter === 'james' && !callerLower.includes('james')) return false;\n        if (currentCallerFilter === 'buddy' && !callerLower.includes('buddy')) return false;`
);

// 11. Tab 1 Rep Filter Pills: add Buddy button
if (!content.includes('data-team-rep="buddy"')) {
  content = content.replace(
    `<button class="lead-pill-btn" data-team-rep="james" onclick="filterTeamCallLogs('james')">🛡️ James (<span id="teamLogBadgeJames">0</span>)</button>`,
    `<button class="lead-pill-btn" data-team-rep="james" onclick="filterTeamCallLogs('james')">🛡️ James (<span id="teamLogBadgeJames">0</span>)</button>\n            <button class="lead-pill-btn" data-team-rep="buddy" onclick="filterTeamCallLogs('buddy')">🤝 Buddy (<span id="teamLogBadgeBuddy">0</span>)</button>`
  );
}

// 12. renderTeamCallLogsTab: count buddy calls
content = content.replace(
  `let jamesCount = 0;`,
  `let jamesCount = 0;\n    let buddyCount = 0;`
);

content = content.replace(
  `else if (callerLower.includes('james')) jamesCount++;`,
  `else if (callerLower.includes('james')) jamesCount++;\n      else if (callerLower.includes('buddy')) buddyCount++;`
);

content = content.replace(
  `const badgeJames = document.getElementById('teamLogBadgeJames');\n    if (badgeJames) badgeJames.textContent = jamesCount;`,
  `const badgeJames = document.getElementById('teamLogBadgeJames');\n    if (badgeJames) badgeJames.textContent = jamesCount;\n    const badgeBuddy = document.getElementById('teamLogBadgeBuddy');\n    if (badgeBuddy) badgeBuddy.textContent = buddyCount;`
);

content = content.replace(
  `const countCalledJamesEl = document.getElementById('countCalledJames');\n    if (countCalledJamesEl) countCalledJamesEl.textContent = jamesCount;`,
  `const countCalledJamesEl = document.getElementById('countCalledJames');\n    if (countCalledJamesEl) countCalledJamesEl.textContent = jamesCount;\n    const countCalledBuddyEl = document.getElementById('countCalledBuddy');\n    if (countCalledBuddyEl) countCalledBuddyEl.textContent = buddyCount;`
);

// 13. Add uploadAllCallsToCloud button in Tab 0 top ticker
if (!content.includes('uploadAllCallsToCloud')) {
  content = content.replace(
    `<button class="btn btn-ghost btn-xs" type="button" onclick="fetchTeamCallsFromCloud(false)" style="font-size:11.5px;color:#38bdf8;border:1px solid rgba(56,189,248,0.3);padding:3px 10px">🔄 Force Sync</button>`,
    `<button class="btn btn-ghost btn-xs" type="button" onclick="uploadAllCallsToCloud()" style="font-size:11.5px;color:#f59e0b;border:1px solid rgba(245,158,11,0.4);padding:3px 10px">☁️ Push Calls to Cloud</button>\n          <button class="btn btn-ghost btn-xs" type="button" onclick="fetchTeamCallsFromCloud(false)" style="font-size:11.5px;color:#38bdf8;border:1px solid rgba(56,189,248,0.3);padding:3px 10px">🔄 Force Sync</button>`
  );

  // Add uploadAllCallsToCloud function definition
  const uploadFnCode = `
  window.uploadAllCallsToCloud = async function() {
    const calls = window.CALL_RECORDS || {};
    const callerName = (typeof activeCaller === 'string' && activeCaller.trim()) ? activeCaller.trim() : 'Luke (Founder)';
    const callEntries = Object.entries(calls).filter(([_, c]) => c && c.called);
    if (callEntries.length === 0) {
      showToast('⚠️ No call records to upload yet. Check off leads or log calls first!');
      return;
    }
    showToast(\`☁️ Uploading \${callEntries.length} call records to cloud...\`);

    const payload = {
      caller: callerName,
      calls: calls
    };

    const endpoints = [];
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
      endpoints.push('/api/lead-calls/lead-call-sync', '/api/audit?action=lead-call-sync');
    }
    endpoints.push(
      'https://www.vantorxsolutions.com/api/lead-calls/lead-call-sync',
      'https://www.vantorxsolutions.com/api/audit?action=lead-call-sync'
    );

    let success = false;
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res && res.ok) {
          const data = await res.json().catch(() => null);
          if (data && data.ok) {
            success = true;
            if (data.calls) mergeCallsFromTeammate(data.calls, false);
            break;
          }
        }
      } catch (_) {}
    }

    if (success) {
      showToast(\`✓ Successfully synced \${callEntries.length} calls to team cloud!\`);
      setTeamSyncStatus(true);
      renderTeamCallLogsTab();
      updateTeamLiveTicker();
      if (typeof window.renderLeaderboardUI === 'function') window.renderLeaderboardUI();
    } else {
      showToast('⚠️ Cloud sync pending. Check network or retry.');
    }
  };
`;
  content = content.replace(
    'window.fetchTeamCallsFromCloud = fetchTeamCallsFromCloud;',
    'window.fetchTeamCallsFromCloud = fetchTeamCallsFromCloud;\n' + uploadFnCode
  );
}

// 14. In fetchTeamCallsFromCloud, trigger leaderboard update on merge
content = content.replace(
  `mergeCallsFromTeammate(data.calls, isBackgroundPoll);\n        setTeamSyncStatus(true);`,
  `mergeCallsFromTeammate(data.calls, isBackgroundPoll);\n        setTeamSyncStatus(true);\n        if (typeof window.renderLeaderboardUI === 'function') window.renderLeaderboardUI();`
);

fs.writeFileSync(arenaPath, content, 'utf8');
console.log('Successfully updated website/cold-call-arena/index.html with full Buddy support & Cloud HUD controls!');
