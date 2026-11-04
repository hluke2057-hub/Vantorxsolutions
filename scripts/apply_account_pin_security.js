const fs = require('fs');
const path = require('path');

const arenaPath = path.join(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
let arenaHtml = fs.readFileSync(arenaPath, 'utf8');

// ============================================================
// 1. UPDATE SIGN IN GATE MODAL & ADD CLOSER AUTH MODAL
// ============================================================
const oldSignInGateStart = '<!-- 🚪 Closer Sign In & Welcome Gate Modal -->';
const oldSignInGateEnd = '<!-- 👤 Account Switcher / Sign Up Modal -->';

const idxGateStart = arenaHtml.indexOf(oldSignInGateStart);
const idxGateEnd = arenaHtml.indexOf(oldSignInGateEnd);

if (idxGateStart === -1 || idxGateEnd === -1) {
  console.error('Failed to locate signInGateModal boundaries in arenaHtml!');
  process.exit(1);
}

const newSignInGateAndAuthModal = `<!-- 🚪 Closer Sign In & Welcome Gate Modal -->
<div class="modal-overlay" id="signInGateModal" style="z-index:99999;background:rgba(5,8,14,0.94);backdrop-filter:blur(14px)">
  <div class="modal-box" style="max-width:440px;border:1px solid rgba(245,158,11,0.4);box-shadow:0 0 50px rgba(0,0,0,0.9),0 0 25px rgba(245,158,11,0.18)">
    <div style="text-align:center;margin-bottom:18px">
      <div style="width:56px;height:56px;margin:0 auto 12px;border-radius:14px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.4);display:flex;align-items:center;justify-content:center;font-size:28px">⚔️</div>
      <h2 style="font-family:var(--font-head);font-size:22px;color:#ffffff;margin:0 0 6px">Sign In to Closer Cockpit</h2>
      <p style="font-size:13px;color:var(--dim);margin:0">Secure closer access with PIN authentication.</p>
    </div>

    <!-- 🔒 Closer Sign-In With PIN Verification -->
    <div style="background:rgba(245,158,11,0.08);border:1.5px solid rgba(245,158,11,0.35);border-radius:12px;padding:14px;margin-bottom:18px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <span style="font-size:11px;font-weight:800;letter-spacing:0.06em;color:var(--accent2);text-transform:uppercase">🔒 Closer Account Sign-In</span>
        <span style="font-size:10.5px;font-family:var(--font-mono);color:var(--dim)">PIN Required</span>
      </div>
      
      <div style="margin-bottom:10px">
        <label style="display:block;font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;margin-bottom:4px">Select Account</label>
        <select id="gateCloserSelect" class="custom-select" style="width:100%;font-size:13.5px;padding:10px 12px;font-weight:700">
          <option value="luke">👑 Luke (Founder)</option>
          <option value="carter_mccauliss">⚔️ Carter McCauliss</option>
          <option value="lucas">🎯 Lucas (Closer)</option>
        </select>
      </div>

      <div style="margin-bottom:12px">
        <label style="display:block;font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;margin-bottom:4px">4-Digit Security PIN or Passcode</label>
        <input type="password" id="gateCloserPinInput" placeholder="Enter Security PIN (••••)" class="custom-select" style="width:100%;font-size:15px;text-align:center;letter-spacing:0.2em;padding:10px 12px;font-family:var(--font-mono)" maxlength="20" autocomplete="current-password" onkeydown="if(event.key==='Enter') handleGateCloserLogin();">
        <div id="gateCloserPinError" style="display:none;color:#f87171;font-size:11.5px;font-weight:700;margin-top:6px;text-align:center">
          ❌ Incorrect PIN for this closer. Access denied.
        </div>
      </div>

      <button type="button" class="btn btn-gold" id="btnGateUnlockCloser" onclick="handleGateCloserLogin()" style="width:100%;padding:11px;font-size:13.5px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:6px">
        🔑 Authenticate &amp; Unlock Cockpit ➔
      </button>
    </div>

    <!-- Divider -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
      <div style="flex:1;height:1px;background:var(--line)"></div>
      <span style="font-size:10px;font-family:var(--font-mono);color:var(--dim);text-transform:uppercase;letter-spacing:0.06em">OR REGISTER NEW CLOSER</span>
      <div style="flex:1;height:1px;background:var(--line)"></div>
    </div>

    <form id="signInGateForm" onsubmit="handleSignInGateSubmit(event)">
      <div style="margin-bottom:12px">
        <label style="display:block;font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;margin-bottom:4px">Your Full Name</label>
        <input type="text" id="gateNameInput" placeholder="e.g. Roman Vance" class="custom-select" style="width:100%;font-size:13.5px;padding:9px 12px" required autocomplete="name">
      </div>

      <div style="margin-bottom:12px">
        <label style="display:block;font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;margin-bottom:4px">Your Personal Email</label>
        <input type="email" id="gateEmailInput" placeholder="e.g. roman@gmail.com" class="custom-select" style="width:100%;font-size:13.5px;padding:9px 12px" required autocomplete="email">
      </div>

      <div style="margin-bottom:12px">
        <label style="display:block;font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;margin-bottom:4px">Role Track</label>
        <select id="gateRoleSelect" class="custom-select" style="width:100%;font-size:13px;padding:9px 12px">
          <option value="Outbound Closer">Outbound Closer (3-Day Certification Track)</option>
          <option value="Appointment Setter">Appointment Setter (Speed-to-Lead)</option>
          <option value="Sales Rep (Commission)">Sales Rep (Commission)</option>
        </select>
      </div>

      <div style="margin-bottom:16px">
        <label style="display:block;font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;margin-bottom:4px">Create 4-Digit Security PIN</label>
        <input type="password" id="gateNewPinInput" placeholder="Set 4-digit PIN (e.g. 1234)" class="custom-select" style="width:100%;font-size:14px;padding:9px 12px;letter-spacing:0.15em;text-align:center;font-family:var(--font-mono)" maxlength="10" required autocomplete="new-password">
      </div>

      <button type="submit" class="btn btn-secondary" id="btnGateSignIn" style="width:100%;padding:11px;font-size:13.5px;font-weight:700;margin-bottom:12px">
        Register New Closer &amp; Start Academy ➔
      </button>

      <div style="text-align:center;padding-top:8px;border-top:1px solid var(--line)">
        <button type="button" class="btn btn-ghost btn-sm" onclick="promptFounderLogin()" style="font-size:11px;color:var(--dim)">
          👑 Founder Direct Sign In (Luke)
        </button>
      </div>
    </form>
  </div>
</div>

<!-- 🔒 Closer Security PIN Verification Modal -->
<div class="modal-overlay" id="closerAuthModal" style="z-index:100000;background:rgba(5,8,14,0.96);backdrop-filter:blur(16px)">
  <div class="modal-box" style="max-width:390px;border:1.5px solid rgba(245,158,11,0.5);box-shadow:0 0 50px rgba(0,0,0,0.95), 0 0 25px rgba(245,158,11,0.25);text-align:center;padding:24px 20px">
    <div style="width:58px;height:58px;margin:0 auto 12px;border-radius:16px;background:rgba(245,158,11,0.12);border:1.5px solid rgba(245,158,11,0.4);display:flex;align-items:center;justify-content:center;font-size:28px" id="closerAuthAvatar">
      🔒
    </div>
    <div style="font-size:11px;font-family:var(--font-mono);font-weight:800;color:var(--accent2);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px">
      SECURITY AUTHENTICATION
    </div>
    <h3 style="font-family:var(--font-head);font-size:19px;color:#ffffff;margin:0 0 6px" id="closerAuthTitle">
      Enter Closer PIN
    </h3>
    <p style="font-size:12px;color:var(--dim);margin:0 0 16px" id="closerAuthDesc">
      Enter 4-digit security PIN for this account to proceed.
    </p>

    <div style="margin-bottom:14px">
      <input type="password" id="closerAuthPinInput" placeholder="••••" maxlength="20" class="custom-select" style="text-align:center;font-size:24px;letter-spacing:0.3em;padding:10px 14px;background:#06090e;border:1.5px solid rgba(245,158,11,0.4);border-radius:10px;width:100%;color:#ffffff;font-family:var(--font-mono)" autocomplete="current-password" autofocus onkeydown="if(event.key==='Enter') submitCloserAuth(); else if(event.key==='Escape') cancelCloserAuth();">
      <div id="closerAuthError" style="display:none;color:#f87171;font-size:11.5px;font-weight:700;margin-top:8px">
        ❌ Incorrect PIN. Access Denied.
      </div>
    </div>

    <!-- Quick Virtual Keypad -->
    <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;max-width:240px;margin:0 auto 18px">
      <button type="button" class="btn btn-ghost" onclick="closerAuthNumpad('1')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);border-radius:8px">1</button>
      <button type="button" class="btn btn-ghost" onclick="closerAuthNumpad('2')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);border-radius:8px">2</button>
      <button type="button" class="btn btn-ghost" onclick="closerAuthNumpad('3')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);border-radius:8px">3</button>
      <button type="button" class="btn btn-ghost" onclick="closerAuthNumpad('4')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);border-radius:8px">4</button>
      <button type="button" class="btn btn-ghost" onclick="closerAuthNumpad('5')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);border-radius:8px">5</button>
      <button type="button" class="btn btn-ghost" onclick="closerAuthNumpad('6')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);border-radius:8px">6</button>
      <button type="button" class="btn btn-ghost" onclick="closerAuthNumpad('7')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);border-radius:8px">7</button>
      <button type="button" class="btn btn-ghost" onclick="closerAuthNumpad('8')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);border-radius:8px">8</button>
      <button type="button" class="btn btn-ghost" onclick="closerAuthNumpad('9')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);border-radius:8px">9</button>
      <button type="button" class="btn btn-ghost" onclick="closerAuthNumpad('clear')" style="padding:10px;font-size:11px;font-weight:700;font-family:var(--font-mono);border-radius:8px;color:#f87171">CLR</button>
      <button type="button" class="btn btn-ghost" onclick="closerAuthNumpad('0')" style="padding:10px;font-size:16px;font-weight:700;font-family:var(--font-mono);border-radius:8px">0</button>
      <button type="button" class="btn btn-ghost" onclick="closerAuthNumpad('back')" style="padding:10px;font-size:14px;font-weight:700;font-family:var(--font-mono);border-radius:8px;color:var(--dim)">⌫</button>
    </div>

    <div style="display:flex;gap:10px">
      <button type="button" class="btn btn-ghost" onclick="cancelCloserAuth()" style="flex:1;padding:10px;font-size:13px">
        Cancel
      </button>
      <button type="button" class="btn btn-gold" id="btnCloserAuthSubmit" onclick="submitCloserAuth()" style="flex:1;padding:10px;font-size:13px;font-weight:700">
        Unlock ➔
      </button>
    </div>
  </div>
</div>

`;

arenaHtml = arenaHtml.substring(0, idxGateStart) + newSignInGateAndAuthModal + arenaHtml.substring(idxGateEnd);
console.log('✓ Successfully replaced signInGateModal and inserted closerAuthModal in arenaHtml');

// ============================================================
// 2. ADD SECURITY & CHANGE PIN TO ACCOUNT MODAL
// ============================================================
const oldFounderBypassStart = '<!-- Founder God Mode / Bypass Toggle -->';
const idxFounderBypass = arenaHtml.indexOf(oldFounderBypassStart);

if (idxFounderBypass !== -1) {
  const securityCard = `<!-- 🔒 Closer Security & Account PIN Card -->
    <div style="background:rgba(18,24,38,0.95);border:1.5px solid rgba(245,158,11,0.3);border-radius:12px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:22px">🔒</span>
        <div>
          <div style="font-size:13px;font-weight:700;color:#ffffff">Closer Account Protection</div>
          <div style="font-size:11px;color:var(--dim)">PIN security active · Prevent unauthenticated profile switching</div>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm" type="button" onclick="changeAccountPin()" style="font-size:11.5px;padding:5px 12px;border-color:rgba(245,158,11,0.4);color:var(--accent2);font-weight:700">
        🔑 Change My PIN
      </button>
    </div>

    `;
  arenaHtml = arenaHtml.substring(0, idxFounderBypass) + securityCard + arenaHtml.substring(idxFounderBypass);
  console.log('✓ Successfully added Security Card to accountModal');
}

// Add newRepPin to create account form
const oldCreateFormFields = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
        <input type="text" id="newRepName" placeholder="Full Name (e.g. Jason Miller)" class="custom-select" style="width:100%" required>
        <input type="email" id="newRepEmail" placeholder="Email (e.g. jason@gmail.com)" class="custom-select" style="width:100%" required>
      </div>`;

const newCreateFormFields = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
        <input type="text" id="newRepName" placeholder="Full Name (e.g. Jason Miller)" class="custom-select" style="width:100%" required>
        <input type="email" id="newRepEmail" placeholder="Email (e.g. jason@gmail.com)" class="custom-select" style="width:100%" required>
      </div>
      <div style="margin-bottom:10px">
        <input type="password" id="newRepPin" placeholder="4-Digit Security PIN (e.g. 5555)" class="custom-select" style="width:100%;letter-spacing:0.1em;text-align:center;font-family:var(--font-mono)" maxlength="10">
      </div>`;

if (arenaHtml.includes(oldCreateFormFields)) {
  arenaHtml = arenaHtml.replace(oldCreateFormFields, newCreateFormFields);
  console.log('✓ Successfully added newRepPin field to accountModal create form');
}

// ============================================================
// 3. UPDATE DEFAULT_PROFILES & MIGRATIONS WITH PINS
// ============================================================
// In DEFAULT_PROFILES:
// Add pin: '7777', passcode: 'vantorx2026' to luke
const oldLukeDef = `    luke: {
      id: 'luke',
      name: 'Luke (Founder)',
      role: 'Founder & Closer',`;

const newLukeDef = `    luke: {
      id: 'luke',
      name: 'Luke (Founder)',
      pin: '7777',
      passcode: 'vantorx2026',
      role: 'Founder & Closer',`;

arenaHtml = arenaHtml.replace(oldLukeDef, newLukeDef);

// Add pin: '2026', passcode: 'carter2026' to carter_mccauliss
const oldCarterDef = `    carter_mccauliss: {
      id: 'carter_mccauliss',
      name: 'Carter McCauliss',
      email: 'cartermccauliss@gmail.com',
      role: 'Certified Closer & Phone Warrior',`;

const newCarterDef = `    carter_mccauliss: {
      id: 'carter_mccauliss',
      name: 'Carter McCauliss',
      email: 'cartermccauliss@gmail.com',
      pin: '2026',
      passcode: 'carter2026',
      role: 'Certified Closer & Phone Warrior',`;

arenaHtml = arenaHtml.replace(oldCarterDef, newCarterDef);

// Add pin: '3030', passcode: 'lucas2026' to lucas
const oldLucasDef = `    lucas: {
      id: 'lucas',
      name: 'Lucas',
      email: 'lucas@vantorxsolutions.com',
      phone: '(330) 322-1452',
      role: 'Certified Closer & Phone Warrior',`;

const newLucasDef = `    lucas: {
      id: 'lucas',
      name: 'Lucas',
      email: 'lucas@vantorxsolutions.com',
      phone: '(330) 322-1452',
      pin: '3030',
      passcode: 'lucas2026',
      role: 'Certified Closer & Phone Warrior',`;

arenaHtml = arenaHtml.replace(oldLucasDef, newLucasDef);

// In migrations: Ensure PINs are populated on existing stored profiles
const oldProfileInit = `  if (!USER_PROFILES.luke) USER_PROFILES.luke = DEFAULT_PROFILES.luke;
  if (!USER_PROFILES.carter_mccauliss) USER_PROFILES.carter_mccauliss = DEFAULT_PROFILES.carter_mccauliss;
  if (!USER_PROFILES.lucas) USER_PROFILES.lucas = DEFAULT_PROFILES.lucas;`;

const newProfileInit = `  if (!USER_PROFILES.luke) USER_PROFILES.luke = DEFAULT_PROFILES.luke;
  if (!USER_PROFILES.carter_mccauliss) USER_PROFILES.carter_mccauliss = DEFAULT_PROFILES.carter_mccauliss;
  if (!USER_PROFILES.lucas) USER_PROFILES.lucas = DEFAULT_PROFILES.lucas;
  
  // Ensure security PINs exist on all core profiles
  if (USER_PROFILES.luke) {
    USER_PROFILES.luke.pin = USER_PROFILES.luke.pin || '7777';
    USER_PROFILES.luke.passcode = USER_PROFILES.luke.passcode || 'vantorx2026';
  }
  if (USER_PROFILES.carter_mccauliss) {
    USER_PROFILES.carter_mccauliss.pin = USER_PROFILES.carter_mccauliss.pin || '2026';
    USER_PROFILES.carter_mccauliss.passcode = USER_PROFILES.carter_mccauliss.passcode || 'carter2026';
  }
  if (USER_PROFILES.lucas) {
    USER_PROFILES.lucas.pin = USER_PROFILES.lucas.pin || '3030';
    USER_PROFILES.lucas.passcode = USER_PROFILES.lucas.passcode || 'lucas2026';
  }
  Object.keys(USER_PROFILES).forEach(k => {
    if (!USER_PROFILES[k].pin) {
      USER_PROFILES[k].pin = '1234';
    }
  });`;

arenaHtml = arenaHtml.replace(oldProfileInit, newProfileInit);
console.log('✓ Successfully updated DEFAULT_PROFILES & migration logic with PINs');

// ============================================================
// 4. ADD VERIFICATION ENGINE, AUTH MODAL CONTROLLERS & REVISE LOGIN LOGIC
// ============================================================
// Replace loginAsRep and handleSignInGateSubmit up to promptFounderLogin
const oldLoginBlockStart = '  window.loginAsRep = function(uid) {';
const oldLoginBlockEnd = '  window.logoutCloser = function() {';

const idxLoginStart = arenaHtml.indexOf(oldLoginBlockStart);
const idxLoginEnd = arenaHtml.indexOf(oldLoginBlockEnd);

if (idxLoginStart === -1 || idxLoginEnd === -1) {
  console.error('Failed to locate loginAsRep / logoutCloser boundaries in arenaHtml!');
  process.exit(1);
}

const newLoginAndAuthCode = `  // ============================================================
  // 🔒 CLOSER SECURITY PIN AUTHENTICATION & GATE ENGINE
  // ============================================================
  let _authPending = null;

  window.verifyCloserPin = function(uid, pin) {
    if (!pin) return false;
    const clean = pin.toString().trim().toLowerCase();
    const u = USER_PROFILES[uid];
    if (!u) return false;

    // Luke (Founder)
    if (uid === 'luke' || u.isFounder) {
      if (clean === '7777' || clean === 'vantorx2026' || clean === 'luke' || clean === 'founder' || clean === 'luke@vantorxsolutions.com') return true;
      if (u.pin && clean === u.pin.toString().trim().toLowerCase()) return true;
      if (u.passcode && clean === u.passcode.toString().trim().toLowerCase()) return true;
      return false;
    }

    // Carter McCauliss
    if (uid === 'carter_mccauliss' || uid === 'carter') {
      if (clean === '2026' || clean === 'carter2026' || clean === 'cartermccauliss@gmail.com') return true;
      if (u.pin && clean === u.pin.toString().trim().toLowerCase()) return true;
      if (u.passcode && clean === u.passcode.toString().trim().toLowerCase()) return true;
      return false;
    }

    // Lucas
    if (uid === 'lucas') {
      if (clean === '3030' || clean === 'lucas2026' || clean === 'lucas@vantorxsolutions.com') return true;
      if (u.pin && clean === u.pin.toString().trim().toLowerCase()) return true;
      if (u.passcode && clean === u.passcode.toString().trim().toLowerCase()) return true;
      return false;
    }

    // Custom sales reps
    if (u.pin && clean === u.pin.toString().trim().toLowerCase()) return true;
    if (u.passcode && clean === u.passcode.toString().trim().toLowerCase()) return true;
    return false;
  };

  window.promptCloserAuth = function(targetUid, onSuccess, onCancel) {
    const target = USER_PROFILES[targetUid];
    if (!target) {
      showToast('❌ Closer profile not found.');
      if (onCancel) onCancel();
      return;
    }

    _authPending = { targetUid, onSuccess, onCancel };

    const modal = document.getElementById('closerAuthModal');
    const avatarEl = document.getElementById('closerAuthAvatar');
    const titleEl = document.getElementById('closerAuthTitle');
    const descEl = document.getElementById('closerAuthDesc');
    const inputEl = document.getElementById('closerAuthPinInput');
    const errorEl = document.getElementById('closerAuthError');

    if (avatarEl) avatarEl.textContent = target.avatar || '👤';
    if (titleEl) titleEl.textContent = \`Unlock \${target.name}'s Account\`;
    if (descEl) descEl.textContent = \`Enter 4-digit security PIN for \${target.name} to switch.\`;
    if (inputEl) {
      inputEl.value = '';
      setTimeout(() => inputEl.focus(), 80);
    }
    if (errorEl) {
      errorEl.style.display = 'none';
      errorEl.textContent = '';
    }

    if (modal) modal.classList.add('active');
  };

  window.closerAuthNumpad = function(val) {
    const inputEl = document.getElementById('closerAuthPinInput');
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

  window.submitCloserAuth = function() {
    if (!_authPending) return;
    const inputEl = document.getElementById('closerAuthPinInput');
    const errorEl = document.getElementById('closerAuthError');
    const enteredPin = inputEl ? inputEl.value : '';
    const targetUid = _authPending.targetUid;
    const target = USER_PROFILES[targetUid];

    if (!window.verifyCloserPin(targetUid, enteredPin)) {
      if (errorEl) {
        errorEl.textContent = \`❌ Incorrect PIN for \${target ? target.name : 'this closer'}. Access Denied.\`;
        errorEl.style.display = 'block';
      }
      if (inputEl) {
        inputEl.value = '';
        inputEl.focus();
      }
      playSound('wrong');
      showToast(\`❌ Access Denied: Incorrect PIN for \${target ? target.name : 'closer'}.\`);
      return;
    }

    // Success!
    const modal = document.getElementById('closerAuthModal');
    if (modal) modal.classList.remove('active');
    const cb = _authPending.onSuccess;
    _authPending = null;
    if (cb) cb();
  };

  window.cancelCloserAuth = function() {
    const modal = document.getElementById('closerAuthModal');
    if (modal) modal.classList.remove('active');
    if (_authPending && _authPending.onCancel) {
      _authPending.onCancel();
    }
    _authPending = null;
    // Re-sync quickRepSelect
    const repSelectEl = document.getElementById('quickRepSelect');
    if (repSelectEl && activeUserId) repSelectEl.value = activeUserId;
  };

  window.openSignInGate = function() {
    const modal = document.getElementById('signInGateModal');
    if (modal) {
      modal.classList.add('active');
      // Populate gate closer select with available profiles
      const selectEl = document.getElementById('gateCloserSelect');
      if (selectEl) {
        selectEl.innerHTML = '';
        Object.keys(USER_PROFILES).forEach(uid => {
          const u = USER_PROFILES[uid];
          if (!u || uid === 'buddy' || uid === 'james' || uid === 'james_mccullohs') return;
          const opt = document.createElement('option');
          opt.value = uid;
          opt.textContent = \`\${u.avatar || '👤'} \${u.name}\`;
          selectEl.appendChild(opt);
        });
      }
      const pinInput = document.getElementById('gateCloserPinInput');
      if (pinInput) {
        pinInput.value = '';
        setTimeout(() => pinInput.focus(), 100);
      }
      const errEl = document.getElementById('gateCloserPinError');
      if (errEl) errEl.style.display = 'none';
    }
  };

  window.closeSignInGate = function() {
    const modal = document.getElementById('signInGateModal');
    if (modal) modal.classList.remove('active');
  };

  window.onGateCloserSelectChange = function(uid) {
    const pinInput = document.getElementById('gateCloserPinInput');
    const errEl = document.getElementById('gateCloserPinError');
    if (pinInput) {
      pinInput.value = '';
      pinInput.focus();
    }
    if (errEl) errEl.style.display = 'none';
  };

  window.handleGateCloserLogin = function() {
    const selectEl = document.getElementById('gateCloserSelect');
    const pinInput = document.getElementById('gateCloserPinInput');
    const errEl = document.getElementById('gateCloserPinError');

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

    if (!window.verifyCloserPin(uid, pin)) {
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
    }

    // Successful closer login
    const target = USER_PROFILES[uid];
    if (uid === 'carter_mccauliss' || uid === 'lucas' || target.autoPassed) {
      grantCoursePass(target);
    }
    activeUserId = uid;
    localStorage.setItem('vantorx_active_user_id_v2', uid);
    saveUserProfiles();
    window.closeSignInGate();
    updateUserUI();
    if (window.selectLmsUnit) window.selectLmsUnit('1-1');
    if (typeof window.renderLeaderboardUI === 'function') window.renderLeaderboardUI();
    renderLeadsTable();
    playSound('levelup');
    showToast(\`🏆 Welcome back, \${target.name}! Cockpit unlocked & authenticated.\`);
    syncRepToCloud(target, 'certified', \`Closer sign-in as \${target.name} (PIN authenticated)\`);
  };

  // Secure loginAsRep: prompts for PIN if not already authenticated
  window.loginAsRep = function(uid, optPin) {
    if (optPin && window.verifyCloserPin(uid, optPin)) {
      executeCloserLogin(uid);
      return;
    }
    // Must authenticate via PIN
    window.promptCloserAuth(uid, () => {
      executeCloserLogin(uid);
    });
  };

  function executeCloserLogin(uid) {
    if (!USER_PROFILES[uid]) {
      if (DEFAULT_PROFILES[uid]) {
        USER_PROFILES[uid] = JSON.parse(JSON.stringify(DEFAULT_PROFILES[uid]));
      } else {
        showToast('❌ User profile not found.');
        return;
      }
    }
    const u = USER_PROFILES[uid];
    if (uid === 'carter_mccauliss' || uid === 'lucas' || u.autoPassed) {
      grantCoursePass(u);
    }
    activeUserId = uid;
    localStorage.setItem('vantorx_active_user_id_v2', uid);
    saveUserProfiles();
    window.closeSignInGate();
    updateUserUI();
    if (window.selectLmsUnit) window.selectLmsUnit('1-1');
    if (typeof window.renderLeaderboardUI === 'function') window.renderLeaderboardUI();
    renderLeadsTable();
    playSound('levelup');
    showToast(\`🏆 Welcome back, \${u.name}! Cockpit unlocked.\`);
    syncRepToCloud(u, 'certified', \`Closer sign-in as \${u.name} (PIN authenticated)\`);
  }

  window.handleSignInGateSubmit = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const nameInput = document.getElementById('gateNameInput');
    const emailInput = document.getElementById('gateEmailInput');
    const roleSelect = document.getElementById('gateRoleSelect');
    const pinInput = document.getElementById('gateNewPinInput');

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

    const emailLower = email.toLowerCase();
    const nameLower = name.toLowerCase();

    // Check if trying to sign into an existing core closer account by typing their name
    if (nameLower.includes('carter') || emailLower.includes('carter')) {
      showToast('Carter McCauliss account already exists. Please enter PIN in the account section above.');
      const gateCloserSelect = document.getElementById('gateCloserSelect');
      if (gateCloserSelect) gateCloserSelect.value = 'carter_mccauliss';
      const gateCloserPinInput = document.getElementById('gateCloserPinInput');
      if (gateCloserPinInput) gateCloserPinInput.focus();
      return;
    }
    if (nameLower.includes('lucas') || emailLower.includes('lucas')) {
      showToast('Lucas account already exists. Please enter PIN in the account section above.');
      const gateCloserSelect = document.getElementById('gateCloserSelect');
      if (gateCloserSelect) gateCloserSelect.value = 'lucas';
      const gateCloserPinInput = document.getElementById('gateCloserPinInput');
      if (gateCloserPinInput) gateCloserPinInput.focus();
      return;
    }
    if (emailLower === 'luke@vantorxsolutions.com' || nameLower === 'luke hamilton' || nameLower === 'luke') {
      showToast('Founder account detected. Please select Luke above and enter your founder PIN (7777).');
      const gateCloserSelect = document.getElementById('gateCloserSelect');
      if (gateCloserSelect) gateCloserSelect.value = 'luke';
      const gateCloserPinInput = document.getElementById('gateCloserPinInput');
      if (gateCloserPinInput) gateCloserPinInput.focus();
      return;
    }

    // Match existing rep by email or name if already in USER_PROFILES
    let foundUid = null;
    Object.keys(USER_PROFILES).forEach(uid => {
      const u = USER_PROFILES[uid];
      if (u && ((u.email && u.email.toLowerCase() === emailLower) || (u.name && u.name.toLowerCase() === name.toLowerCase()))) {
        if (uid !== 'luke' && uid !== 'buddy' && uid !== 'founder_luke') {
          foundUid = uid;
        }
      }
    });

    if (foundUid) {
      // Must authenticate with their PIN
      if (!window.verifyCloserPin(foundUid, pin)) {
        showToast(\`❌ Existing account found for \${USER_PROFILES[foundUid].name}. Incorrect PIN.\`);
        return;
      }
      activeUserId = foundUid;
      localStorage.setItem('vantorx_active_user_id_v2', foundUid);
      saveUserProfiles();
      window.closeSignInGate();
      updateUserUI();
      playSound('levelup');
      showToast(\`✓ Welcome back, \${USER_PROFILES[foundUid].name}!\`);
      return;
    }

    // Create new closer profile with entered PIN
    const uid = 'rep_' + Date.now().toString(36);
    const avatars = ['⚔️', '⚡', '🎯', '🔥', '🛡️', '🚀'];
    const chosenAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    USER_PROFILES[uid] = {
      id: uid,
      name: name,
      email: email,
      role: role,
      pin: pin,
      avatar: chosenAvatar,
      level: 1,
      xp: 0,
      isFounder: false,
      founderBypass: false,
      autoPassed: false,
      completedUnits: [],
      unitActivitiesDone: [],
      flashcardsRevealed: [],
      quizAnswers: {},
      daysPassed: [],
      modulesPassed: [],
      bossesDefeated: 0,
      dailyDials: 0,
      dailySims: 0,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      lastAction: 'Account Created · Starting Closer Academy Day 1',
      medals: {
        daily: { gold: 0, silver: 0, bronze: 0 },
        weekly: { gold: 0, silver: 0, bronze: 0 },
        monthly: { gold: 0, silver: 0, bronze: 0 },
        history: []
      }
    };

    activeUserId = uid;
    localStorage.setItem('vantorx_active_user_id_v2', uid);
    saveUserProfiles();
    syncRepToCloud(USER_PROFILES[uid], 'account_created', \`New sales closer registered: \${name} (\${email}) as \${role} (PIN secured)\`);
    window.closeSignInGate();
    updateUserUI();
    if (window.selectLmsUnit) window.selectLmsUnit('1-1');
    playSound('levelup');
    showToast(\`✓ Welcome, \${name}! Account created and PIN secured. Complete Day 1 to level up!\`);
  };

  window.promptFounderLogin = function() {
    window.promptCloserAuth('luke', () => {
      activeUserId = 'luke';
      localStorage.setItem('vantorx_active_user_id_v2', 'luke');
      saveUserProfiles();
      window.closeSignInGate();
      updateUserUI();
      playSound('levelup');
      showToast('👑 Welcome back, Luke! Founder Cockpit & God Mode active.');
    });
  };

  window.changeAccountPin = function() {
    const user = getActiveUser();
    if (!user || user === GUEST_PROFILE) {
      showToast('Please sign in first.');
      return;
    }
    const oldPin = prompt(\`Enter current security PIN for \${user.name}:\`);
    if (oldPin === null) return;
    if (!window.verifyCloserPin(activeUserId, oldPin)) {
      showToast('❌ Current PIN incorrect. Cannot change PIN.');
      playSound('wrong');
      return;
    }
    const newPin = prompt(\`Enter new 4-digit security PIN for \${user.name}:\`);
    if (!newPin || newPin.trim().length < 4) {
      showToast('❌ PIN must be at least 4 digits.');
      return;
    }
    user.pin = newPin.trim();
    saveUserProfiles();
    showToast(\`✓ Security PIN updated successfully for \${user.name}!\`);
  };

`;

arenaHtml = arenaHtml.substring(0, idxLoginStart) + newLoginAndAuthCode + arenaHtml.substring(idxLoginEnd);
console.log('✓ Successfully replaced loginAsRep, handleSignInGateSubmit, promptFounderLogin with secure PIN engine');

// ============================================================
// 5. UPDATE quickSwitchCaller TO REQUIRE PIN VERIFICATION
// ============================================================
const oldQuickSwitchStart = '  window.quickSwitchCaller = function(uid) {';
const oldQuickSwitchEnd = '  window.activateFounderBypass = function() {';

const idxQsStart = arenaHtml.indexOf(oldQuickSwitchStart);
const idxQsEnd = arenaHtml.indexOf(oldQuickSwitchEnd);

if (idxQsStart === -1 || idxQsEnd === -1) {
  console.error('Failed to locate quickSwitchCaller boundaries in arenaHtml!');
  process.exit(1);
}

const newQuickSwitchCode = `  window.quickSwitchCaller = function(uid) {
    if (!uid || uid === activeUserId) return;
    const previousUid = activeUserId;
    const target = USER_PROFILES[uid];
    if (!target) {
      showToast('❌ Closer account not found.');
      const repSelectEl = document.getElementById('quickRepSelect');
      if (repSelectEl && previousUid) repSelectEl.value = previousUid;
      return;
    }

    // Require PIN verification before switching into any account!
    window.promptCloserAuth(uid, () => {
      // Verified! Complete switch
      activeUserId = uid;
      localStorage.setItem('vantorx_active_user_id_v2', uid);
      if (uid === 'carter_mccauliss' || uid === 'lucas' || target.autoPassed) {
        grantCoursePass(target);
      }
      saveUserProfiles();
      window.closeSignInGate();
      updateUserUI();
      if (window.selectLmsUnit) window.selectLmsUnit('1-1');
      if (typeof window.renderLeaderboardUI === 'function') window.renderLeaderboardUI();
      renderLeadsTable();
      playSound('levelup');
      showToast(\`✓ Authenticated as \${target.name}!\`);
      syncRepToCloud(target, 'certified', \`Switched active caller to \${target.name} (PIN verified)\`);
    }, () => {
      // Cancelled or denied: revert dropdown to activeUserId
      const repSelectEl = document.getElementById('quickRepSelect');
      if (repSelectEl && previousUid) repSelectEl.value = previousUid;
    });
  };

`;

arenaHtml = arenaHtml.substring(0, idxQsStart) + newQuickSwitchCode + arenaHtml.substring(idxQsEnd);
console.log('✓ Successfully updated quickSwitchCaller with PIN authentication');

// ============================================================
// 6. UPDATE renderAccountProfileList TO REQUIRE PIN ON SWITCH
// ============================================================
const oldRowClick = `      if (isFounder) {
        row.addEventListener('click', () => {
          window.quickSwitchCaller(uid);
          const accountModal = document.getElementById('accountModal');
          if (accountModal) accountModal.classList.remove('active');
        });
      }`;

const newRowClick = `      if (isFounder) {
        row.addEventListener('click', () => {
          if (uid === activeUserId) return;
          window.promptCloserAuth(uid, () => {
            window.quickSwitchCaller(uid);
            const accountModal = document.getElementById('accountModal');
            if (accountModal) accountModal.classList.remove('active');
          });
        });
      }`;

if (arenaHtml.includes(oldRowClick)) {
  arenaHtml = arenaHtml.replace(oldRowClick, newRowClick);
  console.log('✓ Successfully updated renderAccountProfileList row click to require PIN verification');
}

// ============================================================
// 7. UPDATE createNewAccountFromModal WITH PIN
// ============================================================
const oldCreateModalStart = '  window.createNewAccountFromModal = function() {';
const oldCreateModalEnd = '  const btnToggleFounderBypass = document.getElementById(\'btnToggleFounderBypass\');';

const idxCreateStart = arenaHtml.indexOf(oldCreateModalStart);
const idxCreateEnd = arenaHtml.indexOf(oldCreateModalEnd);

if (idxCreateStart !== -1 && idxCreateEnd !== -1) {
  const newCreateModalCode = `  window.createNewAccountFromModal = function() {
    const nameInput = document.getElementById('newRepName');
    const emailInput = document.getElementById('newRepEmail');
    const roleSelect = document.getElementById('newRepRole');
    const pinInput = document.getElementById('newRepPin');
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const role = roleSelect ? roleSelect.value : 'Outbound Closer';
    const pin = pinInput && pinInput.value.trim() ? pinInput.value.trim() : '1234';

    if (!name) {
      showToast('Please enter a name for the new sales rep account.');
      return;
    }
    if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.');
      return;
    }

    const nameLower = name.toLowerCase();
    const emailLower = email.toLowerCase();

    // Prevent usurping Carter or Lucas without PIN
    if (nameLower.includes('carter') || emailLower.includes('carter')) {
      showToast('Carter McCauliss account already exists. Please switch using his PIN (2026).');
      return;
    }
    if (nameLower.includes('lucas') || emailLower.includes('lucas')) {
      showToast('Lucas account already exists. Please switch using his PIN (3030).');
      return;
    }
    if (nameLower.includes('luke') || emailLower.includes('luke')) {
      showToast('Founder account already exists. Please switch using founder PIN (7777).');
      return;
    }

    const uid = 'rep_' + Date.now().toString(36);
    const avatars = ['⚡', '⚔️', '🎯', '🔥', '🛡️', '🚀'];
    const chosenAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    USER_PROFILES[uid] = {
      id: uid,
      name: name,
      email: email,
      role: role,
      pin: pin,
      avatar: chosenAvatar,
      level: 1,
      xp: 0,
      isFounder: false,
      founderBypass: false,
      autoPassed: false,
      completedUnits: [],
      unitActivitiesDone: [],
      flashcardsRevealed: [],
      quizAnswers: {},
      daysPassed: [],
      modulesPassed: [],
      bossesDefeated: 0,
      dailyDials: 0,
      dailySims: 0,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      lastAction: 'Account Created · Starting Day 1 of Closer Academy',
      medals: {
        daily: { gold: 0, silver: 0, bronze: 0 },
        weekly: { gold: 0, silver: 0, bronze: 0 },
        monthly: { gold: 0, silver: 0, bronze: 0 },
        history: []
      }
    };

    activeUserId = uid;
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (pinInput) pinInput.value = '';
    saveUserProfiles();
    syncRepToCloud(USER_PROFILES[uid], 'account_created', \`New closer account registered: \${name} (\${email}) as \${role} (PIN secured)\`);
    if (window.selectLmsUnit) window.selectLmsUnit('1-1');
    updateUserUI();
    if (window.updateAcademyUI) window.updateAcademyUI();
    playSound('levelup');
    showToast(\`✓ Account created for \${name}! Security PIN set. Complete the 3-day course to earn Level 5.\`);
    const accountModal = document.getElementById('accountModal');
    if (accountModal) accountModal.classList.remove('active');
    window.switchTab('tabAcademy');
  };

`;
  arenaHtml = arenaHtml.substring(0, idxCreateStart) + newCreateModalCode + arenaHtml.substring(idxCreateEnd);
  console.log('✓ Successfully updated createNewAccountFromModal with PIN support & usurping prevention');
}

// Write updated HTML back to file
fs.writeFileSync(arenaPath, arenaHtml, 'utf8');
console.log('✓ Arena HTML successfully updated with complete PIN security system!');
