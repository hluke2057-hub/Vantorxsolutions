// scripts/patch_arena_simplification.js
const fs = require('fs');
const path = require('path');

const arenaPath = path.resolve('website/cold-call-arena/index.html');
let content = fs.readFileSync(arenaPath, 'utf8');

console.log('Original file size:', content.length);

// 1. Clear SEED_CALL_RECORDS
const seedStart = content.indexOf('const SEED_CALL_RECORDS = {');
const seedEnd = content.indexOf('const LEGACY_ID_MAP = {');
if (seedStart !== -1 && seedEnd !== -1) {
  const replacement = 'const SEED_CALL_RECORDS = {};\r\n\r\n  // Legacy ID mapping (maps old 825 directory IDs to verified 346 lead IDs)\r\n  ';
  content = content.slice(0, seedStart) + replacement + content.slice(seedEnd);
  console.log('✓ Cleared SEED_CALL_RECORDS');
} else {
  console.warn('⚠️ Could not locate SEED_CALL_RECORDS block');
}

// 2. Patch CALL_RECORDS initialization to clean mock calls
const callRecInitOld = `    if (_storedCalls && typeof _storedCalls === 'object' && Object.keys(_storedCalls).length > 0) {
      CALL_RECORDS = { ...SEED_CALL_RECORDS, ..._storedCalls };
    } else {
      CALL_RECORDS = { ...SEED_CALL_RECORDS };
    }`;

const callRecInitNew = `    if (_storedCalls && typeof _storedCalls === 'object' && Object.keys(_storedCalls).length > 0) {
      CALL_RECORDS = { ..._storedCalls };
      // Purge legacy mock calls from local storage
      const mockLeadIds = ['pb_001', 'pb_002', 'pb_003', 'pb_004', 'pb_005', 'pb_006', 'pb_007', 'pb_008', 'pb_009', 'pb_010', 'pb_011', 'pb_012', 'pb_013', 'pb_014', 'pb_015', 'pb_016', 'pb_017', 'pb_018', 'pb_019'];
      mockLeadIds.forEach(sid => {
        if (CALL_RECORDS[sid] && (CALL_RECORDS[sid].notes?.includes('front desk') || CALL_RECORDS[sid].notes?.includes('Booked 15-min live demo') || CALL_RECORDS[sid].updatedAt?.startsWith('2026-11-01') || CALL_RECORDS[sid].updatedAt?.startsWith('2026-11-04'))) {
          delete CALL_RECORDS[sid];
        }
      });
    } else {
      CALL_RECORDS = {};
    }`;

if (content.includes(callRecInitOld)) {
  content = content.replace(callRecInitOld, callRecInitNew);
  console.log('✓ Patched CALL_RECORDS initialization with mock purge');
} else {
  // Try CRLF normalize
  const normOld = callRecInitOld.replace(/\n/g, '\r\n');
  const normNew = callRecInitNew.replace(/\n/g, '\r\n');
  if (content.includes(normOld)) {
    content = content.replace(normOld, normNew);
    console.log('✓ Patched CALL_RECORDS initialization with mock purge (CRLF)');
  } else {
    console.warn('⚠️ Could not find callRecInitOld');
  }
}

// 3. Patch isDateInPeriod (strict date filtering)
const oldIsDateInPeriod = `  function isDateInPeriod(dateStr, period) {
    if (!dateStr) return true;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return true;
    const now = new Date();

    if (period === 'daily') {
      return d.toDateString() === now.toDateString();
    }
    if (period === 'weekly') {
      const day = now.getDay();
      const diffToMon = day === 0 ? -6 : 1 - day;
      const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMon, 0, 0, 0, 0);
      const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6, 23, 59, 59, 999);
      return d >= monday && d <= sunday;
    }
    if (period === 'monthly') {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }
    return true;
  }`;

const newIsDateInPeriod = `  function isDateInPeriod(dateStr, period) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    const now = new Date();

    if (period === 'daily') {
      return d.toDateString() === now.toDateString();
    }
    if (period === 'weekly') {
      const day = now.getDay();
      const diffToMon = day === 0 ? -6 : 1 - day;
      const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMon, 0, 0, 0, 0);
      const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6, 23, 59, 59, 999);
      return d >= monday && d <= sunday;
    }
    if (period === 'monthly') {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }
    return true;
  }`;

if (content.includes(oldIsDateInPeriod.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldIsDateInPeriod.replace(/\n/g, '\r\n'), newIsDateInPeriod.replace(/\n/g, '\r\n'));
  console.log('✓ Patched isDateInPeriod');
} else if (content.includes(oldIsDateInPeriod)) {
  content = content.replace(oldIsDateInPeriod, newIsDateInPeriod);
  console.log('✓ Patched isDateInPeriod (LF)');
} else {
  console.warn('⚠️ Could not find oldIsDateInPeriod');
}

// 4. Patch calculateLeaderboard (no Luke fallback, skip booted reps)
const oldCalcLeaderboardPart = `      if (callerStr.includes('carter')) assignedId = 'carter_mccauliss';
      else if (callerStr.includes('lucas')) assignedId = 'lucas';
      else if (callerStr.includes('luke')) assignedId = 'luke';
      else {
        for (const cid in closerMap) {
          if (callerStr.includes(closerMap[cid].name.toLowerCase())) {
            assignedId = cid;
            break;
          }
        }
      }

      if (!assignedId) assignedId = 'luke';`;

const newCalcLeaderboardPart = `      if (callerStr.includes('carter')) assignedId = 'carter_mccauliss';
      else if (callerStr.includes('lucas')) assignedId = 'lucas';
      else if (callerStr.includes('luke')) assignedId = 'luke';
      else {
        for (const cid in closerMap) {
          const cName = (closerMap[cid].name || '').toLowerCase().trim();
          if (cName && (callerStr === cName || callerStr.includes(cName) || cName.includes(callerStr))) {
            assignedId = cid;
            break;
          }
        }
      }

      // STRICT: Never default unknown calls to Luke! If unassigned or booted, ignore.
      if (!assignedId || !closerMap[assignedId]) continue;`;

if (content.includes(oldCalcLeaderboardPart.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldCalcLeaderboardPart.replace(/\n/g, '\r\n'), newCalcLeaderboardPart.replace(/\n/g, '\r\n'));
  console.log('✓ Patched calculateLeaderboard caller assignment');
} else if (content.includes(oldCalcLeaderboardPart)) {
  content = content.replace(oldCalcLeaderboardPart, newCalcLeaderboardPart);
  console.log('✓ Patched calculateLeaderboard caller assignment (LF)');
} else {
  console.warn('⚠️ Could not find oldCalcLeaderboardPart');
}

// Also in calculateLeaderboard: skip booted reps when seeding closerMap
const oldSeedCloser = `        const kl = k.toLowerCase();
        if (kl.includes('buddy') || kl.includes('james')) return;`;

const newSeedCloser = `        const kl = k.toLowerCase();
        if (kl.includes('buddy') || kl.includes('james')) return;
        if (u.status === 'revoked' || u.isBooted === true) return; // Skip booted closers`;

if (content.includes(oldSeedCloser.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldSeedCloser.replace(/\n/g, '\r\n'), newSeedCloser.replace(/\n/g, '\r\n'));
  console.log('✓ Patched closerMap seeding to skip booted reps');
} else if (content.includes(oldSeedCloser)) {
  content = content.replace(oldSeedCloser, newSeedCloser);
  console.log('✓ Patched closerMap seeding (LF)');
}

// 5. Update verifyCloserPin to check booted status
const oldVerifyPin = `  window.verifyCloserPin = function(uid, pin) {
    if (!pin) return false;
    const clean = pin.toString().trim().toLowerCase();
    const u = USER_PROFILES[uid];
    if (!u) return false;`;

const newVerifyPin = `  window.verifyCloserPin = function(uid, pin) {
    if (!pin) return false;
    const clean = pin.toString().trim().toLowerCase();
    const u = USER_PROFILES[uid];
    if (!u) return false;

    // Check if account has been booted / revoked by Luke
    if (u.status === 'revoked' || u.isBooted === true) {
      return 'BOOTED';
    }`;

if (content.includes(oldVerifyPin.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldVerifyPin.replace(/\n/g, '\r\n'), newVerifyPin.replace(/\n/g, '\r\n'));
  console.log('✓ Patched verifyCloserPin with BOOTED check');
} else if (content.includes(oldVerifyPin)) {
  content = content.replace(oldVerifyPin, newVerifyPin);
  console.log('✓ Patched verifyCloserPin with BOOTED check (LF)');
} else {
  console.warn('⚠️ Could not find oldVerifyPin');
}

// 6. Update handleGateCloserLogin to handle BOOTED status
const oldHandleGateLogin = `    if (!window.verifyCloserPin(uid, pin)) {
      const u = USER_PROFILES[uid];
      const targetName = u ? u.name : 'this closer';
      if (errEl) {
        errEl.textContent = \`❌ Incorrect PIN for \${targetName}. Access denied.\`;
        errEl.style.display = 'block';
      }
      if (pinInput) {
        pinInput.value = '';
        pinInput.focus();
      }
      playSound('wrong');
      showToast(\`❌ Access Denied: Incorrect PIN for \${targetName}.\`);
      return;
    }`;

const newHandleGateLogin = `    const verifyStatus = window.verifyCloserPin(uid, pin);
    if (verifyStatus === 'BOOTED') {
      if (errEl) {
        errEl.textContent = '🚫 ACCESS REVOKED: This account has been deactivated by Luke (Founder).';
        errEl.style.display = 'block';
      }
      playSound('wrong');
      showToast('🚫 ACCESS REVOKED: Account deactivated by Luke.');
      return;
    }

    if (!verifyStatus) {
      const u = USER_PROFILES[uid];
      const targetName = u ? u.name : 'this closer';
      if (errEl) {
        errEl.textContent = \`❌ Incorrect PIN for \${targetName}. Access denied.\`;
        errEl.style.display = 'block';
      }
      if (pinInput) {
        pinInput.value = '';
        pinInput.focus();
      }
      playSound('wrong');
      showToast(\`❌ Access Denied: Incorrect PIN for \${targetName}.\`);
      return;
    }`;

if (content.includes(oldHandleGateLogin.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldHandleGateLogin.replace(/\n/g, '\r\n'), newHandleGateLogin.replace(/\n/g, '\r\n'));
  console.log('✓ Patched handleGateCloserLogin with BOOTED check');
} else if (content.includes(oldHandleGateLogin)) {
  content = content.replace(oldHandleGateLogin, newHandleGateLogin);
  console.log('✓ Patched handleGateCloserLogin (LF)');
} else {
  console.warn('⚠️ Could not find oldHandleGateLogin');
}

// 7. Update handleSignInGateSubmit to enforce invite access code
const oldGateSubmitCheck = `    // Create new closer profile with entered PIN
    const uid = 'rep_' + Date.now().toString(36);`;

const newGateSubmitCheck = `    // VERIFY TEAM INVITE ACCESS CODE
    const accessCodeInput = document.getElementById('gateAccessCodeInput');
    const enteredAccessCode = (accessCodeInput ? accessCodeInput.value : '').trim();
    const authorizedCode = (localStorage.getItem('vantorx_team_invite_code') || 'VANTORX2026').trim();

    if (!enteredAccessCode || enteredAccessCode.toUpperCase() !== authorizedCode.toUpperCase()) {
      showToast('❌ Access Code Required: You must enter the authorized invite code provided by Luke to join the team.');
      playSound('wrong');
      if (accessCodeInput) {
        accessCodeInput.focus();
        accessCodeInput.style.borderColor = '#ef4444';
      }
      return;
    }

    // Create new closer profile with entered PIN
    const uid = 'rep_' + Date.now().toString(36);`;

if (content.includes(oldGateSubmitCheck.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldGateSubmitCheck.replace(/\n/g, '\r\n'), newGateSubmitCheck.replace(/\n/g, '\r\n'));
  console.log('✓ Patched handleSignInGateSubmit with invite access code check');
} else if (content.includes(oldGateSubmitCheck)) {
  content = content.replace(oldGateSubmitCheck, newGateSubmitCheck);
  console.log('✓ Patched handleSignInGateSubmit (LF)');
} else {
  console.warn('⚠️ Could not find oldGateSubmitCheck');
}

// 8. Update queue auto growth to +100 daily
const oldQueueGrowth = `  const autoDailyAdditions = effectiveDays * 75; // autoDailyAdditions = daysSinceLaunch * 75;

  let manualAdditions = 0;
  try {
    manualAdditions = parseInt(localStorage.getItem('vantorx_manual_lead_additions') || '0', 10);
  } catch(e) {
    manualAdditions = 0;
  }

  function getActiveQueueLimit() {
    return Math.min(LEADS_DATA.length, BASE_QUEUE_SIZE + autoDailyAdditions + manualAdditions);
  }

  function getTodayFreshRange() {
    const limit = getActiveQueueLimit();
    const start = Math.max(0, limit - 75);
    return { start, end: limit };
  }`;

const newQueueGrowth = `  const autoDailyAdditions = effectiveDays * 100;

  let manualAdditions = 0;
  try {
    manualAdditions = parseInt(localStorage.getItem('vantorx_manual_lead_additions') || '0', 10);
  } catch(e) {
    manualAdditions = 0;
  }

  function getActiveQueueLimit() {
    return Math.min(LEADS_DATA.length, BASE_QUEUE_SIZE + autoDailyAdditions + manualAdditions);
  }

  function getTodayFreshRange() {
    const limit = getActiveQueueLimit();
    const start = Math.max(0, limit - 100);
    return { start, end: limit };
  }

  window.expandQueue100Leads = function() {
    manualAdditions += 100;
    try {
      localStorage.setItem('vantorx_manual_lead_additions', manualAdditions.toString());
    } catch(e) {}
    renderLeadsTable();
    updateQuotaHUD();
    showToast(\`✓ +100 Verified Leads added to active queue! (Active queue: \${getActiveQueueLimit()} leads)\`);
  };`;

if (content.includes(oldQueueGrowth.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldQueueGrowth.replace(/\n/g, '\r\n'), newQueueGrowth.replace(/\n/g, '\r\n'));
  console.log('✓ Patched queue growth to +100 leads daily');
} else if (content.includes(oldQueueGrowth)) {
  content = content.replace(oldQueueGrowth, newQueueGrowth);
  console.log('✓ Patched queue growth to +100 (LF)');
} else {
  console.warn('⚠️ Could not find oldQueueGrowth');
}

// 9. Update renderAccountProfileList and add boot/reinstate functions
const oldRenderAccountProfileList = `  function renderAccountProfileList() {
    const list = document.getElementById('accountProfileList');
    if (!list) return;
    list.innerHTML = '';
    const activeU = getActiveUser();
    const isFounder = activeU && (activeU.isFounder === true || activeUserId === 'luke');

    const lbl = document.getElementById('accountModalListLabel');
    if (lbl) {
      lbl.textContent = isFounder ? 'ALL SALES TEAM ROSTER:' : 'YOUR CLOSER PROFILE:';
    }

    let uidsToRender = [];
    if (isFounder) {
      uidsToRender = Object.keys(USER_PROFILES);
    } else if (activeUserId && USER_PROFILES[activeUserId]) {
      uidsToRender = [activeUserId];
    }

    uidsToRender.forEach(uid => {
      const u = USER_PROFILES[uid];
      if (!u) return;
      if (!isFounder && (uid === 'buddy' || uid === 'rep_buddy_2' || uid === 'luke' || uid === 'founder_luke')) return;

      const isCur = uid === activeUserId;
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.background = isCur ? 'rgba(245,158,11,0.14)' : 'var(--bg)';
      row.style.border = isCur ? '1.5px solid var(--accent)' : '1px solid var(--line)';
      row.style.borderRadius = '8px';
      row.style.padding = '8px 12px';
      row.style.cursor = isFounder ? 'pointer' : 'default';

      const isCert = (u.daysPassed && u.daysPassed.length >= 3) || u.autoPassed || u.isFounder || u.level >= 5;
      const pct = Math.min(100, Math.round(((u.completedUnits || []).length / 15) * 100));
      row.innerHTML = \`
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:18px">\${u.avatar || '👤'}</span>
          <div>
            <div style="font-size:13px;font-weight:700;color:#ffffff">\${u.name} \${isCur ? '<span style="font-size:10px;color:var(--accent2)">(Active)</span>' : ''}</div>
            <div style="font-size:11px;color:var(--dim)">\${u.role}\${u.email ? ' · ' + u.email : ''}</div>
            <div style="font-size:10.5px;color:\${isCert ? 'var(--ok)' : 'var(--accent2)'};margin-top:2px">
              \${isCert ? '🏆 Level 5 Certified' : \`Level \${u.level} · \${pct}% Course Complete (\${(u.daysPassed || []).length}/3 Days)\`} · ⚔️ \${u.bossesDefeated || 0} Bosses
            </div>
          </div>
        </div>
        \${isFounder ? \`<button class="btn btn-ghost btn-sm" style="font-size:11.5px;padding:4px 8px">\${isCur ? '✓ Using' : 'Switch ➔'}</button>\` : \`<span style="font-size:11.5px;color:var(--ok);font-weight:700">✓ Your Account</span>\`}
      \`;

      if (isFounder) {
        row.addEventListener('click', () => {
          if (uid === activeUserId) return;
          const accountModal = document.getElementById('accountModal');
          if (accountModal) accountModal.classList.remove('active');
          window.quickSwitchCaller(uid);
        });
      }

      list.appendChild(row);
    });
  }`;

const newRenderAccountProfileList = `  window.bootTeamRep = function(uid) {
    const u = USER_PROFILES[uid];
    if (!u) return;
    if (uid === 'luke' || uid === 'founder_luke' || u.isFounder) {
      showToast('⚠️ Cannot revoke the Founder account.');
      return;
    }
    const confirmed = confirm(\`⚠️ Are you sure you want to boot \${u.name}?\\n\\nThis will immediately revoke their access and lock them out of the Cold Call Arena.\`);
    if (!confirmed) return;

    u.status = 'revoked';
    u.isBooted = true;
    u.revokedAt = new Date().toISOString();
    saveUserProfiles();
    syncRepToCloud(u, 'revoked', \`Closer access revoked by Luke\`);
    renderAccountProfileList();
    if (typeof window.renderLeaderboardUI === 'function') window.renderLeaderboardUI();
    showToast(\`🚫 \${u.name} has been booted and locked out of the arena.\`);
  };

  window.reinstateTeamRep = function(uid) {
    const u = USER_PROFILES[uid];
    if (!u) return;
    u.status = 'active';
    u.isBooted = false;
    delete u.revokedAt;
    saveUserProfiles();
    syncRepToCloud(u, 'reinstated', \`Closer access reinstated by Luke\`);
    renderAccountProfileList();
    if (typeof window.renderLeaderboardUI === 'function') window.renderLeaderboardUI();
    showToast(\`✓ \${u.name}'s closer access has been reinstated!\`);
  };

  window.saveAdminInviteCode = function() {
    const input = document.getElementById('adminTeamInviteCodeInput');
    if (!input) return;
    const newCode = input.value.trim();
    if (!newCode || newCode.length < 4) {
      showToast('❌ Invite code must be at least 4 characters.');
      return;
    }
    localStorage.setItem('vantorx_team_invite_code', newCode);
    showToast(\`✓ Team Invite Access Code updated to: \${newCode}\`);
  };

  function renderAccountProfileList() {
    const list = document.getElementById('accountProfileList');
    const adminContainer = document.getElementById('adminTeamManagementContainer');
    const repSelfContainer = document.getElementById('repSelfAccountContainer');
    const activeU = getActiveUser();
    const isFounder = activeU && (activeU.isFounder === true || activeUserId === 'luke');

    // 1. Founder vs Rep View Isolation
    if (adminContainer && repSelfContainer) {
      if (isFounder) {
        adminContainer.style.display = 'block';
        repSelfContainer.style.display = 'none';
        const inviteInput = document.getElementById('adminTeamInviteCodeInput');
        if (inviteInput) {
          inviteInput.value = localStorage.getItem('vantorx_team_invite_code') || 'VANTORX2026';
        }
      } else {
        adminContainer.style.display = 'none';
        repSelfContainer.style.display = 'block';
        const selfAvatar = document.getElementById('repSelfAvatar');
        const selfName = document.getElementById('repSelfName');
        const selfEmail = document.getElementById('repSelfEmail');
        if (selfAvatar) selfAvatar.textContent = activeU.avatar || '⚔️';
        if (selfName) selfName.textContent = activeU.name;
        if (selfEmail) selfEmail.textContent = activeU.email || \`\${activeU.name.toLowerCase().replace(/\\s+/g, '')}@vantorxsolutions.com\`;
        return; // Non-admin reps only see their own account!
      }
    }

    if (!list) return;
    list.innerHTML = '';

    const uidsToRender = Object.keys(USER_PROFILES);

    uidsToRender.forEach(uid => {
      const u = USER_PROFILES[uid];
      if (!u) return;
      if (uid === 'buddy' || uid === 'rep_buddy_2' || uid === 'founder_luke') return;

      const isCur = uid === activeUserId;
      const isBooted = u.status === 'revoked' || u.isBooted === true;
      const isSelfFounder = uid === 'luke' || u.isFounder;

      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.background = isCur ? 'rgba(245,158,11,0.14)' : (isBooted ? 'rgba(239,68,68,0.08)' : 'var(--bg)');
      row.style.border = isCur ? '1.5px solid var(--accent)' : (isBooted ? '1px solid rgba(239,68,68,0.4)' : '1px solid var(--line)');
      row.style.borderRadius = '8px';
      row.style.padding = '8px 12px';
      row.style.gap = '10px';

      const callsCount = Object.values(window.CALL_RECORDS || {}).filter(c => c && c.called && (c.caller || '').toLowerCase().includes(u.name.toLowerCase())).length;

      row.innerHTML = \`
        <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0">
          <span style="font-size:18px">\${u.avatar || '👤'}</span>
          <div style="min-width:0;flex:1">
            <div style="display:flex;align-items:center;gap:6px">
              <span style="font-size:13px;font-weight:700;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">\${u.name}</span>
              \${isCur ? '<span style="font-size:10px;color:var(--accent2);font-weight:700">(Active)</span>' : ''}
              \${isBooted ? '<span style="font-size:10px;color:#f87171;font-weight:800;background:rgba(239,68,68,0.2);padding:2px 6px;border-radius:4px">🔴 REVOKED</span>' : '<span style="font-size:10px;color:#34d399;font-weight:800;background:rgba(52,211,153,0.15);padding:2px 6px;border-radius:4px">🟢 ACTIVE</span>'}
            </div>
            <div style="font-size:11px;color:var(--dim)">\${u.role}\${u.email ? ' · ' + u.email : ''} · PIN: \${isSelfFounder ? '••••' : (u.pin || '2026')}</div>
            <div style="font-size:10.5px;color:var(--dim);margin-top:2px">
              📞 \${callsCount} calls logged · 🏅 Level \${u.level || 1}
            </div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          \${!isSelfFounder ? (
            isBooted ? 
            \`<button class="btn btn-ghost btn-xs" type="button" onclick="reinstateTeamRep('\${uid}')" style="font-size:11px;color:#34d399;border:1px solid rgba(52,211,153,0.4);padding:3px 8px">🟢 Reinstate</button>\` :
            \`<button class="btn btn-ghost btn-xs" type="button" onclick="bootTeamRep('\${uid}')" style="font-size:11px;color:#f87171;border:1px solid rgba(239,68,68,0.4);padding:3px 8px" title="Immediately revoke access and lock out rep">🔴 Boot Rep</button>\`
          ) : '<span style="font-size:11px;color:var(--accent2);font-weight:700">👑 Founder</span>'}
          \${(!isCur && !isBooted) ? \`<button class="btn btn-ghost btn-xs" type="button" onclick="closeAccountModal(); quickSwitchCaller('\${uid}')" style="font-size:11px;padding:3px 8px">Switch ➔</button>\` : ''}
        </div>
      \`;
      list.appendChild(row);
    });
  }`;

if (content.includes(oldRenderAccountProfileList.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldRenderAccountProfileList.replace(/\n/g, '\r\n'), newRenderAccountProfileList.replace(/\n/g, '\r\n'));
  console.log('✓ Patched renderAccountProfileList with isolation and boot/reinstate');
} else if (content.includes(oldRenderAccountProfileList)) {
  content = content.replace(oldRenderAccountProfileList, newRenderAccountProfileList);
  console.log('✓ Patched renderAccountProfileList (LF)');
} else {
  console.warn('⚠️ Could not find oldRenderAccountProfileList');
}

// 10. Update updateUserUI to handle booted sessions and rep badge display
const oldUserUIActiveCaller = `      callerSelectEl = callerSelectEl || document.getElementById('callerSelect');
      if (callerSelectEl) {
        let found = false;
        for (let i = 0; i < callerSelectEl.options.length; i++) {
          if (callerSelectEl.options[i].value === user.name) found = true;
        }
        if (!found && !isLoggedOut) {
          const o = document.createElement('option');
          o.value = user.name;
          o.textContent = user.name;
          callerSelectEl.appendChild(o);
        }
        callerSelectEl.value = user.name;
      }
      activeCaller = user.name;
      try { localStorage.setItem('vantorx_active_caller', activeCaller); } catch(e) {}`;

const newUserUIActiveCaller = `      // Update Active Rep badge
      const repAvatarEl = document.getElementById('activeRepAvatar');
      const repNameEl = document.getElementById('activeRepNameDisplay');
      if (repAvatarEl) repAvatarEl.textContent = user.avatar || (isFounder ? '👑' : '⚔️');
      if (repNameEl) repNameEl.textContent = isLoggedOut ? 'Sign In Required' : user.name;

      activeCaller = user.name;
      try { localStorage.setItem('vantorx_active_caller', activeCaller); } catch(e) {}`;

if (content.includes(oldUserUIActiveCaller.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldUserUIActiveCaller.replace(/\n/g, '\r\n'), newUserUIActiveCaller.replace(/\n/g, '\r\n'));
  console.log('✓ Patched updateUserUI active caller badge');
} else if (content.includes(oldUserUIActiveCaller)) {
  content = content.replace(oldUserUIActiveCaller, newUserUIActiveCaller);
  console.log('✓ Patched updateUserUI active caller badge (LF)');
} else {
  console.warn('⚠️ Could not find oldUserUIActiveCaller');
}

// 11. Update updateLeadGateVisibility to always unlock for active authenticated users
const oldLeadGateVisibility = `  function updateLeadGateVisibility() {
    const user = getActiveUser();
    const isUnlocked = user.level >= 5 || user.founderBypass === true;
    const gateCard = document.getElementById('leadsLockedGate');
    const tableContainer = document.getElementById('leadsTableContainer');

    if (gateCard && tableContainer) {
      if (isUnlocked) {
        gateCard.style.display = 'none';
        tableContainer.style.display = 'block';
      } else {
        gateCard.style.display = 'block';
        tableContainer.style.display = 'none';`;

const newLeadGateVisibility = `  function updateLeadGateVisibility() {
    const user = getActiveUser();
    // Simplified: always unlocked for all authenticated active team members
    const isUnlocked = true;
    const gateCard = document.getElementById('leadsLockedGate');
    const tableContainer = document.getElementById('leadsTableContainer');

    if (gateCard && tableContainer) {
      if (isUnlocked) {
        gateCard.style.display = 'none';
        tableContainer.style.display = 'block';
      } else {
        gateCard.style.display = 'none';
        tableContainer.style.display = 'block';`;

if (content.includes(oldLeadGateVisibility.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldLeadGateVisibility.replace(/\n/g, '\r\n'), newLeadGateVisibility.replace(/\n/g, '\r\n'));
  console.log('✓ Patched updateLeadGateVisibility (unlocked for all authenticated reps)');
} else if (content.includes(oldLeadGateVisibility)) {
  content = content.replace(oldLeadGateVisibility, newLeadGateVisibility);
  console.log('✓ Patched updateLeadGateVisibility (LF)');
} else {
  console.warn('⚠️ Could not find oldLeadGateVisibility');
}

// 12. Update default currentBatch and today100 filtering
const oldCurrentBatchInit = `let currentBatch = 'all';`;
const newCurrentBatchInit = `let currentBatch = 'today100';`;

if (content.includes(oldCurrentBatchInit)) {
  content = content.replace(oldCurrentBatchInit, newCurrentBatchInit);
  console.log('✓ Set default currentBatch to today100');
}

// Also in renderLeadsTable: support today100
const oldBatchCheck = `        if (currentBatch === 'activeQueue') {
          if (index >= activeLimit) return false;
        } else if (currentBatch === 'todayFresh') {
          if (index < freshRange.start || index >= freshRange.end) return false;
        }`;

const newBatchCheck = `        if (currentBatch === 'activeQueue') {
          if (index >= activeLimit) return false;
        } else if (currentBatch === 'todayFresh' || currentBatch === 'today100') {
          if (index < freshRange.start || index >= freshRange.end) return false;
        }`;

if (content.includes(oldBatchCheck.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldBatchCheck.replace(/\n/g, '\r\n'), newBatchCheck.replace(/\n/g, '\r\n'));
  console.log('✓ Patched renderLeadsTable today100 batch check');
} else if (content.includes(oldBatchCheck)) {
  content = content.replace(oldBatchCheck, newBatchCheck);
  console.log('✓ Patched renderLeadsTable today100 batch check (LF)');
}

fs.writeFileSync(arenaPath, content, 'utf8');
console.log('Finished patching arena! New file size:', content.length);
