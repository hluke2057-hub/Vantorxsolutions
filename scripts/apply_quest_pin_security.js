const fs = require('fs');
const path = require('path');

const questPath = path.join(__dirname, '..', 'website', 'cold-call-quest', 'index.html');
let q = fs.readFileSync(questPath, 'utf8');

// 1. Locate questSignInModal
const startModal = q.indexOf('<div class="modal-overlay" id="questSignInModal"');
const endModal = q.indexOf('<!-- 👤 SALES REP ACCOUNT & TELEMETRY ROSTER MODAL -->', startModal);

console.log('startModal:', startModal, 'endModal:', endModal);
if (startModal === -1 || endModal === -1) {
  console.error('Cannot find questSignInModal bounds');
  process.exit(1);
}

const newModal = `<div class="modal-overlay" id="questSignInModal" style="z-index:99999;background:rgba(5,8,14,0.94);backdrop-filter:blur(14px)">
  <div class="modal-card" style="max-width:440px;border:1px solid rgba(245,158,11,0.4);box-shadow:0 0 50px rgba(0,0,0,0.9),0 0 25px rgba(245,158,11,0.18)">
    <div style="text-align:center;margin-bottom:18px">
      <div style="width:56px;height:56px;margin:0 auto 12px;border-radius:14px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.4);display:flex;align-items:center;justify-content:center;font-size:28px">⚔️</div>
      <h2 style="font-family:var(--font-head);font-size:22px;color:#ffffff;margin:0 0 6px">Sign In to Cold Call RPG</h2>
      <p style="font-size:13px;color:var(--dim);margin:0">Secure closer combat access with PIN authentication.</p>
    </div>

    <!-- 🔒 Closer Sign-In With PIN Verification -->
    <div style="background:rgba(245,158,11,0.08);border:1.5px solid rgba(245,158,11,0.35);border-radius:12px;padding:14px;margin-bottom:18px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <span style="font-size:11px;font-weight:800;letter-spacing:0.06em;color:var(--accent2);text-transform:uppercase">🔒 Closer Account Sign-In</span>
        <span style="font-size:10.5px;font-family:var(--font-mono);color:var(--dim)">PIN Required</span>
      </div>
      
      <div style="margin-bottom:10px">
        <label style="display:block;font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;margin-bottom:4px">Select Account</label>
        <select id="questGateCloserSelect" class="custom-select" style="width:100%;font-size:13.5px;padding:10px 12px;font-weight:700" onchange="onQuestGateCloserSelectChange(this.value)">
          <option value="luke">👑 Luke the Closer (Founder)</option>
          <option value="carter_mccauliss">⚔️ Carter McCauliss</option>
          <option value="lucas">🎯 Lucas (Closer)</option>
        </select>
      </div>

      <div style="margin-bottom:12px">
        <label style="display:block;font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;margin-bottom:4px">4-Digit Security PIN or Passcode</label>
        <input type="password" id="questGateCloserPinInput" placeholder="Enter Security PIN (••••)" class="custom-select" style="width:100%;font-size:15px;text-align:center;letter-spacing:0.2em;padding:10px 12px;font-family:var(--font-mono)" maxlength="20" autocomplete="current-password" onkeydown="if(event.key==='Enter') handleQuestGateCloserLogin();">
        <div id="questGateCloserPinError" style="display:none;color:#f87171;font-size:11.5px;font-weight:700;margin-top:6px;text-align:center">
          ❌ Incorrect PIN for this closer. Access denied.
        </div>
      </div>

      <button type="button" class="hud-btn gold" id="btnQuestUnlockCloser" onclick="handleQuestGateCloserLogin()" style="width:100%;padding:11px;font-size:13.5px;font-weight:800;justify-content:center">
        🔑 Authenticate &amp; Unlock Quest ➔
      </button>
    </div>

    <!-- Divider -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
      <div style="flex:1;height:1px;background:var(--line)"></div>
      <span style="font-size:10px;font-family:var(--font-mono);color:var(--dim);text-transform:uppercase;letter-spacing:0.06em">OR REGISTER NEW CLOSER</span>
      <div style="flex:1;height:1px;background:var(--line)"></div>
    </div>

    <form id="questSignInGateForm" onsubmit="handleQuestSignInGateSubmit(event)">
      <div style="margin-bottom:12px">
        <label style="display:block;font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;margin-bottom:4px">Your Full Name</label>
        <input type="text" id="questGateNameInput" placeholder="e.g. Roman Vance" class="custom-select" style="width:100%;font-size:13.5px;padding:9px 12px" required autocomplete="name">
      </div>

      <div style="margin-bottom:12px">
        <label style="display:block;font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;margin-bottom:4px">Your Personal Email</label>
        <input type="email" id="questGateEmailInput" placeholder="e.g. roman@gmail.com" class="custom-select" style="width:100%;font-size:13.5px;padding:9px 12px" required autocomplete="email">
      </div>

      <div style="margin-bottom:12px">
        <label style="display:block;font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;margin-bottom:4px">Role Track</label>
        <select id="questGateRoleSelect" class="custom-select" style="width:100%;font-size:13px;padding:9px 12px">
          <option value="Outbound Closer">Outbound Closer (3-Day Certification Track)</option>
          <option value="Appointment Setter">Appointment Setter (Speed-to-Lead)</option>
          <option value="Sales Rep (Commission)">Sales Rep (Commission)</option>
        </select>
      </div>

      <div style="margin-bottom:16px">
        <label style="display:block;font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;margin-bottom:4px">Create 4-Digit Security PIN</label>
        <input type="password" id="questGateNewPinInput" placeholder="Set 4-digit PIN (e.g. 1234)" class="custom-select" style="width:100%;font-size:14px;padding:9px 12px;letter-spacing:0.15em;text-align:center;font-family:var(--font-mono)" maxlength="10" required autocomplete="new-password">
      </div>

      <button type="submit" class="hud-btn" id="btnQuestGateSignIn" style="width:100%;padding:11px;font-size:13.5px;font-weight:700;margin-bottom:12px;justify-content:center">
        Enter Cold Call RPG Combat ➔
      </button>

      <div style="text-align:center;padding-top:8px;border-top:1px solid var(--line)">
        <button type="button" class="hud-btn" onclick="promptFounderQuestLogin()" style="font-size:11px;color:var(--dim);border-color:transparent;background:transparent;padding:4px 8px">
          👑 Founder Direct Sign In (Luke)
        </button>
      </div>
    </form>
  </div>
</div>

<!-- 🔒 Quest Closer Security PIN Verification Modal -->
<div class="modal-overlay" id="questCloserAuthModal" style="z-index:100000;background:rgba(5,8,14,0.96);backdrop-filter:blur(16px)">
  <div class="modal-card" style="max-width:390px;border:1.5px solid rgba(245,158,11,0.5);box-shadow:0 0 50px rgba(0,0,0,0.95), 0 0 25px rgba(245,158,11,0.25);text-align:center;padding:24px 20px">
    <div style="width:58px;height:58px;margin:0 auto 12px;border-radius:16px;background:rgba(245,158,11,0.12);border:1.5px solid rgba(245,158,11,0.4);display:flex;align-items:center;justify-content:center;font-size:28px" id="questCloserAuthAvatar">
      🔒
    </div>
    <div style="font-size:11px;font-family:var(--font-mono);font-weight:800;color:var(--accent2);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px">
      SECURITY AUTHENTICATION
    </div>
    <h3 style="font-family:var(--font-head);font-size:19px;color:#ffffff;margin:0 0 6px" id="questCloserAuthTitle">
      Enter Closer PIN
    </h3>
    <p style="font-size:12px;color:var(--dim);margin:0 0 16px" id="questCloserAuthDesc">
      Enter 4-digit security PIN for this account to proceed.
    </p>

    <div style="margin-bottom:14px">
      <input type="password" id="questCloserAuthPinInput" placeholder="••••" maxlength="20" class="custom-select" style="text-align:center;font-size:24px;letter-spacing:0.3em;padding:10px 14px;background:#06090e;border:1.5px solid rgba(245,158,11,0.4);border-radius:10px;width:100%;color:#ffffff;font-family:var(--font-mono)" autocomplete="current-password" autofocus onkeydown="if(event.key==='Enter') submitQuestCloserAuth(); else if(event.key==='Escape') cancelQuestCloserAuth();">
      <div id="questCloserAuthError" style="display:none;color:#f87171;font-size:11.5px;font-weight:700;margin-top:8px">
        ❌ Incorrect PIN. Access Denied.
      </div>
    </div>

    <!-- Quick Virtual Keypad -->
    <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;max-width:240px;margin:0 auto 18px">
      <button type="button" class="hud-btn" onclick="questCloserAuthNumpad('1')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);justify-content:center">1</button>
      <button type="button" class="hud-btn" onclick="questCloserAuthNumpad('2')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);justify-content:center">2</button>
      <button type="button" class="hud-btn" onclick="questCloserAuthNumpad('3')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);justify-content:center">3</button>
      <button type="button" class="hud-btn" onclick="questCloserAuthNumpad('4')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);justify-content:center">4</button>
      <button type="button" class="hud-btn" onclick="questCloserAuthNumpad('5')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);justify-content:center">5</button>
      <button type="button" class="hud-btn" onclick="questCloserAuthNumpad('6')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);justify-content:center">6</button>
      <button type="button" class="hud-btn" onclick="questCloserAuthNumpad('7')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);justify-content:center">7</button>
      <button type="button" class="hud-btn" onclick="questCloserAuthNumpad('8')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);justify-content:center">8</button>
      <button type="button" class="hud-btn" onclick="questCloserAuthNumpad('9')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);justify-content:center">9</button>
      <button type="button" class="hud-btn" onclick="questCloserAuthNumpad('clear')" style="padding:10px;font-size:11px;font-weight:700;font-family:var(--font-mono);color:#f87171;justify-content:center">CLR</button>
      <button type="button" class="hud-btn" onclick="questCloserAuthNumpad('0')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);justify-content:center">0</button>
      <button type="button" class="hud-btn" onclick="questCloserAuthNumpad('back')" style="padding:10px;font-size:14px;font-weight:700;font-family:var(--font-mono);color:var(--dim);justify-content:center">⌫</button>
    </div>

    <div style="display:flex;gap:10px">
      <button type="button" class="hud-btn" onclick="cancelQuestCloserAuth()" style="flex:1;padding:10px;font-size:13px;justify-content:center">
        Cancel
      </button>
      <button type="button" class="hud-btn gold" id="btnQuestCloserAuthSubmit" onclick="submitQuestCloserAuth()" style="flex:1;padding:10px;font-size:13px;font-weight:700;justify-content:center">
        Unlock ➔
      </button>
    </div>
  </div>
</div>

`;

q = q.substring(0, startModal) + newModal + q.substring(endModal);
console.log('✓ Updated quest modal');

// 2. Locate JS login functions
const startJs = q.indexOf('window.openQuestSignInGate = function()');
const endFounder = q.indexOf('window.promptFounderQuestLogin = function()', startJs);
const endJs = q.indexOf('};', endFounder) + 2;

console.log('startJs:', startJs, 'endJs:', endJs);

const newJs = `window.openQuestSignInGate = function() {
    const modal = document.getElementById('questSignInModal');
    if (modal) {
      modal.classList.add('open');
      const selectEl = document.getElementById('questGateCloserSelect');
      if (selectEl) {
        selectEl.innerHTML = '';
        let profiles = {};
        try { profiles = JSON.parse(localStorage.getItem('vantorx_user_profiles_v2') || '{}'); } catch(e) {}
        const core = [
          { id: 'luke', name: '👑 Luke the Closer (Founder)' },
          { id: 'carter_mccauliss', name: '⚔️ Carter McCauliss' },
          { id: 'lucas', name: '🎯 Lucas (Closer)' }
        ];
        core.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.id;
          opt.textContent = c.name;
          selectEl.appendChild(opt);
        });
        Object.keys(profiles).forEach(uid => {
          if (uid === 'luke' || uid === 'carter_mccauliss' || uid === 'lucas' || uid === 'buddy' || uid === 'james' || uid === 'james_mccullohs') return;
          const u = profiles[uid];
          if (!u || !u.name) return;
          const opt = document.createElement('option');
          opt.value = uid;
          opt.textContent = \`\${u.avatar || '👤'} \${u.name}\`;
          selectEl.appendChild(opt);
        });
      }
      const pinInput = document.getElementById('questGateCloserPinInput');
      if (pinInput) {
        pinInput.value = '';
        setTimeout(() => pinInput.focus(), 100);
      }
      const errEl = document.getElementById('questGateCloserPinError');
      if (errEl) errEl.style.display = 'none';
    }
  };

  window.closeQuestSignInGate = function() {
    const modal = document.getElementById('questSignInModal');
    if (modal) modal.classList.remove('open');
  };

  window.onQuestGateCloserSelectChange = function(uid) {
    const pinInput = document.getElementById('questGateCloserPinInput');
    const errEl = document.getElementById('questGateCloserPinError');
    if (pinInput) {
      pinInput.value = '';
      pinInput.focus();
    }
    if (errEl) errEl.style.display = 'none';
  };

  window.verifyQuestCloserPin = function(uid, pin) {
    if (!pin) return false;
    const clean = pin.toString().trim().toLowerCase();
    let profiles = {};
    try { profiles = JSON.parse(localStorage.getItem('vantorx_user_profiles_v2') || '{}'); } catch(e) {}
    const u = profiles[uid];

    if (uid === 'luke') {
      return (clean === '7777' || clean === 'vantorx2026' || clean === 'luke' || clean === 'founder');
    }
    if (uid === 'carter_mccauliss' || uid === 'carter') {
      return (clean === '2026' || clean === 'carter2026');
    }
    if (uid === 'lucas') {
      return (clean === '3030' || clean === 'lucas2026');
    }
    if (u) {
      if (u.pin && clean === u.pin.toString().trim().toLowerCase()) return true;
      if (u.passcode && clean === u.passcode.toString().trim().toLowerCase()) return true;
    }
    return false;
  };

  let _questAuthPending = null;

  window.promptQuestCloserAuth = function(targetUid, onSuccess, onCancel) {
    let profiles = {};
    try { profiles = JSON.parse(localStorage.getItem('vantorx_user_profiles_v2') || '{}'); } catch(e) {}
    const target = profiles[targetUid] || { name: targetUid, avatar: '👤' };

    _questAuthPending = { targetUid, onSuccess, onCancel };

    const modal = document.getElementById('questCloserAuthModal');
    const avatarEl = document.getElementById('questCloserAuthAvatar');
    const titleEl = document.getElementById('questCloserAuthTitle');
    const descEl = document.getElementById('questCloserAuthDesc');
    const inputEl = document.getElementById('questCloserAuthPinInput');
    const errorEl = document.getElementById('questCloserAuthError');

    if (avatarEl) avatarEl.textContent = target.avatar || '👤';
    if (titleEl) titleEl.textContent = \`Unlock \${target.name}'s Account\`;
    if (descEl) descEl.textContent = \`Enter 4-digit security PIN for \${target.name} to proceed.\`;
    if (inputEl) {
      inputEl.value = '';
      setTimeout(() => inputEl.focus(), 80);
    }
    if (errorEl) {
      errorEl.style.display = 'none';
      errorEl.textContent = '';
    }

    if (modal) modal.classList.add('open');
  };

  window.questCloserAuthNumpad = function(val) {
    const inputEl = document.getElementById('questCloserAuthPinInput');
    if (!inputEl) return;
    if (val === 'clear') {
      inputEl.value = '';
    } else if (val === 'back') {
      inputEl.value = inputEl.value.slice(0, -1);
    } else {
      inputEl.value += val;
    }
    inputEl.focus();
  };

  window.submitQuestCloserAuth = function() {
    if (!_questAuthPending) return;
    const inputEl = document.getElementById('questCloserAuthPinInput');
    const errorEl = document.getElementById('questCloserAuthError');
    const enteredPin = inputEl ? inputEl.value : '';
    const targetUid = _questAuthPending.targetUid;

    let profiles = {};
    try { profiles = JSON.parse(localStorage.getItem('vantorx_user_profiles_v2') || '{}'); } catch(e) {}
    const target = profiles[targetUid] || { name: targetUid };

    if (!window.verifyQuestCloserPin(targetUid, enteredPin)) {
      if (errorEl) {
        errorEl.textContent = \`❌ Incorrect PIN for \${target.name}. Access Denied.\`;
        errorEl.style.display = 'block';
      }
      if (inputEl) {
        inputEl.value = '';
        inputEl.focus();
      }
      showToast(\`❌ Access Denied: Incorrect PIN for \${target.name}.\`);
      return;
    }

    // Success!
    const modal = document.getElementById('questCloserAuthModal');
    if (modal) modal.classList.remove('open');
    const cb = _questAuthPending.onSuccess;
    _questAuthPending = null;
    if (cb) cb();
  };

  window.cancelQuestCloserAuth = function() {
    const modal = document.getElementById('questCloserAuthModal');
    if (modal) modal.classList.remove('open');
    if (_questAuthPending && _questAuthPending.onCancel) {
      _questAuthPending.onCancel();
    }
    _questAuthPending = null;
  };

  window.handleQuestGateCloserLogin = function() {
    const selectEl = document.getElementById('questGateCloserSelect');
    const pinInput = document.getElementById('questGateCloserPinInput');
    const errEl = document.getElementById('questGateCloserPinError');

    const uid = selectEl ? selectEl.value : 'luke';
    const pin = pinInput ? pinInput.value.trim() : '';

    if (!pin) {
      if (errEl) {
        errEl.textContent = 'Please enter your 4-digit security PIN.';
        errEl.style.display = 'block';
      }
      if (pinInput) pinInput.focus();
      return;
    }

    if (!window.verifyQuestCloserPin(uid, pin)) {
      if (errEl) {
        errEl.textContent = '❌ Incorrect PIN for this closer. Access denied.';
        errEl.style.display = 'block';
      }
      if (pinInput) {
        pinInput.value = '';
        pinInput.focus();
      }
      showToast('❌ Access Denied: Incorrect PIN.');
      return;
    }

    window.loginAsQuestRep(uid, pin);
  };

  window.loginAsQuestRep = function(uid, optPin) {
    if (!optPin || !window.verifyQuestCloserPin(uid, optPin)) {
      window.promptQuestCloserAuth(uid, () => {
        window.loginAsQuestRep(uid, 'verified');
      });
      return;
    }

    let profiles = {};
    try {
      profiles = JSON.parse(localStorage.getItem('vantorx_user_profiles_v2') || '{}');
    } catch(e) {}

    if (uid === 'luke') {
      profiles.luke = profiles.luke || { id: 'luke', name: 'Luke the Closer', role: 'Founder & Master Closer', email: 'luke@vantorxsolutions.com', avatar: '👑', level: 5, xp: 1850, bossesDefeated: 8, streak: 5 };
      localStorage.setItem('vantorx_user_profiles_v2', JSON.stringify(profiles));
      localStorage.setItem('vantorx_active_user_id_v2', 'luke');
      window.closeQuestSignInGate();
      initQuestProfile();
      showToast('👑 Welcome back, Luke! Founder God Mode Active.');
      return;
    }

    if (uid === 'carter_mccauliss' || uid === 'carter') {
      uid = 'carter_mccauliss';
      if (!profiles.carter_mccauliss) {
        profiles.carter_mccauliss = {
          id: 'carter_mccauliss',
          name: 'Carter McCauliss',
          role: 'Certified Closer & Phone Warrior',
          email: 'cartermccauliss@gmail.com',
          avatar: '⚔️'
        };
      }
      profiles.carter_mccauliss.level = 5;
      profiles.carter_mccauliss.xp = 1850;
      profiles.carter_mccauliss.autoPassed = true;
      profiles.carter_mccauliss.founderBypass = true;
      profiles.carter_mccauliss.bossesDefeated = 8;
      profiles.carter_mccauliss.streak = 5;
      profiles.carter_mccauliss.completedUnits = ['1-1','1-2','1-3','1-4','1-5','2-1','2-2','2-3','2-4','2-5','3-1','3-2','3-3','3-4','3-5'];
      profiles.carter_mccauliss.daysPassed = [1, 2, 3];
      profiles.carter_mccauliss.lastAction = '🏆 Level 5 Certified · Carter McCauliss Auto-Pass Active';
      profiles.carter_mccauliss.lastActive = new Date().toISOString();
      localStorage.setItem('vantorx_user_profiles_v2', JSON.stringify(profiles));
      localStorage.setItem('vantorx_active_user_id_v2', 'carter_mccauliss');
      window.closeQuestSignInGate();
      initQuestProfile();
      syncQuestToCloud('certified', 'Restored Level 5 Certification for Carter McCauliss', profiles.carter_mccauliss);
      showToast('🏆 Welcome back, Carter! Level 5 Certification & 8 Bosses Slayed unlocked!');
      return;
    }

    if (uid === 'lucas') {
      if (!profiles.lucas) {
        profiles.lucas = {
          id: 'lucas',
          name: 'Lucas',
          role: 'Certified Closer & Phone Warrior',
          email: 'lucas@vantorxsolutions.com',
          avatar: '🎯'
        };
      }
      profiles.lucas.level = 5;
      profiles.lucas.xp = 1850;
      profiles.lucas.autoPassed = true;
      profiles.lucas.founderBypass = true;
      profiles.lucas.bossesDefeated = 8;
      profiles.lucas.streak = 5;
      profiles.lucas.completedUnits = ['1-1','1-2','1-3','1-4','1-5','2-1','2-2','2-3','2-4','2-5','3-1','3-2','3-3','3-4','3-5'];
      profiles.lucas.daysPassed = [1, 2, 3];
      profiles.lucas.lastAction = '🏆 Level 5 Certified · Lucas Auto-Pass Active';
      profiles.lucas.lastActive = new Date().toISOString();
      localStorage.setItem('vantorx_user_profiles_v2', JSON.stringify(profiles));
      localStorage.setItem('vantorx_active_user_id_v2', 'lucas');
      window.closeQuestSignInGate();
      initQuestProfile();
      syncQuestToCloud('certified', 'Restored Level 5 Certification for Lucas', profiles.lucas);
      showToast('🏆 Welcome back, Lucas! Level 5 Certification & 8 Bosses Slayed unlocked!');
      return;
    }

    if (profiles[uid]) {
      localStorage.setItem('vantorx_active_user_id_v2', uid);
      window.closeQuestSignInGate();
      initQuestProfile();
      showToast(\`✓ Authenticated as \${profiles[uid].name}!\`);
    }
  };

  window.handleQuestSignInGateSubmit = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const nameInput = document.getElementById('questGateNameInput');
    const emailInput = document.getElementById('questGateEmailInput');
    const roleSelect = document.getElementById('questGateRoleSelect');
    const pinInput = document.getElementById('questGateNewPinInput');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const role = roleSelect ? roleSelect.value : 'Outbound Closer';
    const pin = pinInput ? pinInput.value.trim() : '';

    if (!name) {
      showToast('Please enter your full name.');
      return;
    }
    if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      showToast('Please enter a valid personal email.');
      return;
    }
    if (!pin || pin.length < 4) {
      showToast('Please create a 4-digit security PIN.');
      if (pinInput) pinInput.focus();
      return;
    }

    const nameLower = name.toLowerCase();
    const emailLower = email.toLowerCase();

    // Prevent usurping Carter or Lucas without PIN
    if (nameLower.includes('carter') || emailLower.includes('carter')) {
      showToast('Carter McCauliss account already exists. Please enter PIN in the account section above.');
      return;
    }
    if (nameLower.includes('lucas') || emailLower.includes('lucas')) {
      showToast('Lucas account already exists. Please enter PIN in the account section above.');
      return;
    }
    if (nameLower.includes('luke') || emailLower.includes('luke')) {
      showToast('Founder account detected. Please sign in with founder PIN (7777).');
      return;
    }

    const uid = 'rep_' + Date.now().toString(36);
    let profiles = {};
    try {
      profiles = JSON.parse(localStorage.getItem('vantorx_user_profiles_v2') || '{}');
    } catch(e) {}

    const avatars = ['⚔️', '⚡', '🎯', '🔥', '🛡️', '🚀'];
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

    profiles[uid] = {
      id: uid,
      name: name,
      email: email,
      role: role,
      pin: pin,
      avatar: avatar,
      level: 1,
      xp: 0,
      bossesDefeated: 0,
      dealsClosed: 0,
      streak: 0,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      lastAction: 'Registered for Cold Call RPG'
    };

    localStorage.setItem('vantorx_user_profiles_v2', JSON.stringify(profiles));
    localStorage.setItem('vantorx_active_user_id_v2', uid);
    window.closeQuestSignInGate();
    initQuestProfile();
    syncQuestToCloud('account_created', \`New sales closer registered: \${name} (\${email}) as \${role} (PIN secured)\`, profiles[uid]);
    showToast(\`✓ Welcome, \${name}! Your closer combat track is active and PIN secured.\`);
  };

  window.promptFounderQuestLogin = function() {
    window.promptQuestCloserAuth('luke', () => {
      window.loginAsQuestRep('luke', '7777');
    });
  };`;

q = q.substring(0, startJs) + newJs + q.substring(endJs);
console.log('✓ Updated quest JS login functions');

// 3. Update selectActiveQuestRep to require PIN
const searchSelect = `function selectActiveQuestRep(id, profile) {
    if (id === 'carter_mccauliss' || id === 'carter') {
      return window.loginAsQuestRep('carter_mccauliss');
    }
    if (id === 'lucas') {
      return window.loginAsQuestRep('lucas');
    }
    if (id === 'james_mccullohs' || id === 'james') {
      return window.loginAsQuestRep('james_mccullohs');
    }
    const curId = localStorage.getItem('vantorx_active_user_id_v2');
    if (id === curId) return;

    localStorage.setItem('vantorx_active_user_id_v2', id);
    initQuestProfile();
    renderQuestRepList();
    showToast(\`✓ Switched active closer combatant to: \${profile.name}\`);
  }`;

const replaceSelect = `function selectActiveQuestRep(id, profile) {
    const curId = localStorage.getItem('vantorx_active_user_id_v2');
    if (id === curId) return;

    window.promptQuestCloserAuth(id, () => {
      window.loginAsQuestRep(id, 'verified');
      renderQuestRepList();
    });
  }`;

if (q.includes(searchSelect)) {
  q = q.replace(searchSelect, replaceSelect);
  console.log('✓ Updated selectActiveQuestRep');
} else {
  console.log('Normalizing CRLF for selectActiveQuestRep...');
  const qNorm = q.replace(/\r\n/g, '\n');
  const sNorm = searchSelect.replace(/\r\n/g, '\n');
  const rNorm = replaceSelect.replace(/\r\n/g, '\n');
  if (qNorm.includes(sNorm)) {
    q = qNorm.replace(sNorm, rNorm);
    console.log('✓ Updated normalized selectActiveQuestRep');
  } else {
    console.warn('Could not find selectActiveQuestRep pattern');
  }
}

fs.writeFileSync(questPath, q, 'utf8');
console.log('✓ Finished updating cold-call-quest HTML with PIN security!');
