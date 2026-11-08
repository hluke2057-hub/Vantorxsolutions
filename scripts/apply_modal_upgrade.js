const fs = require('fs');
const path = require('path');

const arenaPath = path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
let html = fs.readFileSync(arenaPath, 'utf8');

// 1. UPDATE SIGN-IN GATE MODAL
// Replace the old signInGateModal with the enhanced dual-tab sign-in modal containing the prominent "Complete Sign In" button
const oldModalStart = '<!-- 🚀 Closer Sign In & Welcome Gate Modal -->';
const oldModalEnd = '<!-- 🔑 Closer Security PIN Verification Modal -->';

const idxStart = html.indexOf(oldModalStart);
const idxEnd = html.indexOf(oldModalEnd);

if (idxStart === -1 || idxEnd === -1) {
  console.error('Could not find signInGateModal bounds!');
  process.exit(1);
}

const upgradedModalHtml = `<!-- 🚀 Closer Sign In & Welcome Gate Modal -->
<div class="modal-overlay" id="signInGateModal" style="z-index:99999;background:rgba(5,8,14,0.94);backdrop-filter:blur(14px)">
  <div class="modal-box" style="max-width:460px;border:1.5px solid rgba(245,158,11,0.5);box-shadow:0 0 50px rgba(0,0,0,0.9),0 0 30px rgba(245,158,11,0.25);border-radius:18px;padding:24px">
    <div style="text-align:center;margin-bottom:18px">
      <div style="width:60px;height:60px;margin:0 auto 12px;border-radius:16px;background:rgba(245,158,11,0.15);border:1.5px solid rgba(245,158,11,0.4);display:flex;align-items:center;justify-content:center;font-size:30px">⚔️</div>
      <h2 style="font-family:var(--font-head);font-size:23px;color:#ffffff;margin:0 0 6px">Sign In to Closer Cockpit</h2>
      <p style="font-size:13px;color:var(--dim);margin:0">Secure closer access with PIN authentication.</p>
    </div>

    <!-- Dual Tab Selector for Sign-In vs Register -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;background:rgba(0,0,0,0.45);padding:4px;border-radius:10px;margin-bottom:18px;border:1px solid rgba(255,255,255,0.08)">
      <button type="button" id="gateTabBtnSignIn" onclick="switchGateTab('signin')" style="padding:10px;border:none;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;background:rgba(245,158,11,0.95);color:#0b0f19;box-shadow:0 2px 8px rgba(245,158,11,0.3);transition:all 0.2s">
        🔑 Sign In
      </button>
      <button type="button" id="gateTabBtnRegister" onclick="switchGateTab('register')" style="padding:10px;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;background:transparent;color:#94a3b8;transition:all 0.2s">
        ✨ Register New Rep
      </button>
    </div>

    <!-- TAB 1: 🔑 SIGN IN PANE -->
    <div id="gatePaneSignIn" style="display:block">
      <div style="background:rgba(245,158,11,0.08);border:1.5px solid rgba(245,158,11,0.35);border-radius:12px;padding:16px;margin-bottom:16px">
        <div style="margin-bottom:12px">
          <label style="display:block;font-size:11px;font-weight:800;color:var(--accent2);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:6px">Select Account</label>
          <select id="gateCloserSelect" class="custom-select" style="width:100%;font-size:13.5px;padding:10px 12px;font-weight:700" onchange="onGateCloserSelectChange(this.value)">
            <option value="luke">👑 Luke (Founder)</option>
            <option value="carter_mccauliss">⚔️ Carter McCauliss</option>
            <option value="lucas">⚡ Lucas (Closer)</option>
          </select>
        </div>

        <div style="text-align:center;font-size:10.5px;font-family:var(--font-mono);color:var(--dim);margin:8px 0;letter-spacing:0.05em">
          — OR ENTER YOUR NAME / EMAIL —
        </div>

        <div style="margin-bottom:12px">
          <input type="text" id="gateSignInDirectInput" placeholder="Enter your Name or Email" class="custom-select" style="width:100%;font-size:13px;padding:9px 12px">
        </div>

        <div style="margin-bottom:12px">
          <label style="display:block;font-size:11px;font-weight:800;color:var(--accent2);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:6px">4-Digit Security PIN or Passcode</label>
          <input type="password" id="gateCloserPinInput" placeholder="Enter Security PIN (••••)" class="custom-select" style="width:100%;font-size:16px;text-align:center;letter-spacing:0.25em;padding:10px 12px;font-family:var(--font-mono)" maxlength="20" autocomplete="current-password" onkeydown="if(event.key==='Enter') handleGateCloserLogin();">
          <div id="gateCloserPinError" style="display:none;color:#f87171;font-size:11.5px;font-weight:700;margin-top:6px;text-align:center">
            ❌ Incorrect PIN for this closer. Access denied.
          </div>
        </div>

        <!-- THE PROMINENT COMPLETE SIGN-IN BUTTON -->
        <button type="button" class="btn btn-gold" id="btnCompleteSignIn" onclick="handleGateCloserLogin()" style="width:100%;padding:14px;font-size:15px;font-weight:900;letter-spacing:0.04em;text-transform:uppercase;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 0 25px rgba(245,158,11,0.45);border-radius:10px;cursor:pointer">
          🔑 Complete Sign In &amp; Enter Arena ➔
        </button>
      </div>

      <div style="text-align:center;margin-top:12px;font-size:12px;color:var(--dim)">
        New closer joining the team? <a href="javascript:void(0)" onclick="switchGateTab('register')" style="color:var(--accent2);font-weight:700;text-decoration:underline">Register New Rep Account ➔</a>
      </div>
    </div>

    <!-- TAB 2: ✨ REGISTER NEW CLOSER PANE -->
    <div id="gatePaneRegister" style="display:none">
      <form id="signInGateForm" onsubmit="handleSignInGateSubmit(event)">
        <div style="margin-bottom:12px">
          <label style="display:block;font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;margin-bottom:4px">Your Full Name</label>
          <input type="text" id="gateNameInput" placeholder="e.g. Roman Vance" class="custom-select" style="width:100%;font-size:13.5px;padding:9px 12px" autocomplete="name">
        </div>

        <div style="margin-bottom:12px">
          <label style="display:block;font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;margin-bottom:4px">Your Personal Email</label>
          <input type="email" id="gateEmailInput" placeholder="e.g. roman@gmail.com" class="custom-select" style="width:100%;font-size:13.5px;padding:9px 12px" autocomplete="email">
        </div>

        <div style="margin-bottom:12px">
          <label style="display:block;font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;margin-bottom:4px">Role Track</label>
          <select id="gateRoleSelect" class="custom-select" style="width:100%;font-size:13px;padding:9px 12px">
            <option value="Outbound Closer">Outbound Closer (3-Day Certification Track)</option>
            <option value="Appointment Setter">Appointment Setter (Speed-to-Lead)</option>
            <option value="Sales Rep (Commission)">Sales Rep (Commission)</option>
          </select>
        </div>

        <div style="margin-bottom:12px">
          <label style="display:block;font-size:11px;font-weight:700;color:var(--dim);text-transform:uppercase;margin-bottom:4px">Create 4-Digit Security PIN</label>
          <input type="password" id="gateNewPinInput" placeholder="Set 4-digit PIN (e.g. 1234)" class="custom-select" style="width:100%;font-size:14px;padding:9px 12px;letter-spacing:0.15em;text-align:center;font-family:var(--font-mono)" maxlength="10" autocomplete="new-password">
        </div>

        <div style="margin-bottom:16px;background:rgba(245,158,11,0.08);border:1.5px dashed rgba(245,158,11,0.45);border-radius:10px;padding:12px">
          <label style="display:flex;align-items:center;justify-content:space-between;font-size:11px;font-weight:800;color:var(--accent2);text-transform:uppercase;margin-bottom:4px">
            <span>🔑 Team Invite Access Code</span>
            <span style="font-size:10px;font-family:var(--font-mono);color:#f59e0b">Code: noodle</span>
          </label>
          <input type="password" id="gateAccessCodeInput" placeholder="Enter Team Code (e.g. noodle or VANTORX2026)" class="custom-select" style="width:100%;font-size:14px;padding:9px 12px;letter-spacing:0.15em;text-align:center;font-family:var(--font-mono);border-color:rgba(245,158,11,0.5)" autocomplete="off">
          <div style="font-size:11px;color:var(--dim);margin-top:5px;text-align:center">Given by Luke. Enter <strong>noodle</strong> or <strong>VANTORX2026</strong>.</div>
        </div>

        <!-- THE PROMINENT COMPLETE REGISTRATION BUTTON -->
        <button type="submit" class="btn btn-gold" id="btnCompleteRegistration" style="width:100%;padding:14px;font-size:15px;font-weight:900;letter-spacing:0.04em;text-transform:uppercase;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 0 25px rgba(245,158,11,0.45);border-radius:10px;cursor:pointer">
          ✨ Complete Sign In &amp; Register ➔
        </button>
      </form>

      <div style="text-align:center;margin-top:12px;font-size:12px;color:var(--dim)">
        Already have an account? <a href="javascript:void(0)" onclick="switchGateTab('signin')" style="color:var(--accent2);font-weight:700;text-decoration:underline">Sign In Here ➔</a>
      </div>
    </div>

    <div style="text-align:center;padding-top:12px;margin-top:14px;border-top:1px solid var(--line)">
      <button type="button" class="btn btn-ghost btn-sm" onclick="promptFounderLogin()" style="font-size:11.5px;color:var(--dim)">
        👑 Founder Direct Sign In (Luke)
      </button>
    </div>
  </div>
</div>

`;

html = html.substring(0, idxStart) + upgradedModalHtml + html.substring(idxEnd);
console.log('Upgraded signInGateModal successfully!');

fs.writeFileSync(arenaPath, html, 'utf8');
console.log('Saved cold-call-arena/index.html');
