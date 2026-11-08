const fs = require('fs');
const path = require('path');

const arenaPath = path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
const floridaPath = path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'florida-no-website.html');

let html = fs.readFileSync(arenaPath, 'utf8');

// =========================================================================
// 1. UPGRADE SIGN-IN GATE MODAL
// =========================================================================
const mStartToken = '<div class="modal-overlay" id="signInGateModal"';
const mEndToken = '<div class="modal-overlay" id="closerAuthModal"';

const mStart = html.indexOf(mStartToken);
const mEnd = html.indexOf(mEndToken);

if (mStart === -1 || mEnd === -1) {
  console.error('Fatal: Cannot find signInGateModal bounds in index.html!');
  process.exit(1);
}

const upgradedModalHtml = `<div class="modal-overlay" id="signInGateModal" style="z-index:99999;background:rgba(5,8,14,0.94);backdrop-filter:blur(14px)">
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

html = html.substring(0, mStart) + upgradedModalHtml + html.substring(mEnd);
console.log('Step 1: signInGateModal replaced successfully.');

// =========================================================================
// 2. UPDATE ACTIVE LEAD OPENING LINE
// =========================================================================
const oldOpeningLineToken = '<div style="font-size:16px;font-weight:700;color:#ffffff;margin-top:3px" id="activeLeadOpeningLine">"Hey, I was just wondering if the owner is around?"</div>';
const newOpeningLine = '<div style="font-size:16px;font-weight:800;color:#fbbf24;margin-top:3px" id="activeLeadOpeningLine">"Hey, I was just talking to the owner, I\'m wondering if you can transfer me back?"</div>';

if (html.includes(oldOpeningLineToken)) {
  html = html.replace(oldOpeningLineToken, newOpeningLine);
  console.log('Step 2A: Updated activeLeadOpeningLine text.');
}

// =========================================================================
// 3. INJECT DUAL-SCRIPT TOGGLE BAR & TAB 1 BEFORE product-switcher-section
// =========================================================================
const switcherSectionToken = '<div class="product-switcher-section"';
const switcherIdx = html.indexOf(switcherSectionToken);

const endTabScriptToken = '<div id="tabRPG" class="tab-panel">';
const endTabScriptIdx = html.indexOf(endTabScriptToken);

if (switcherIdx === -1 || endTabScriptIdx === -1) {
  console.error('Fatal: Cannot find product-switcher-section or tabRPG in index.html!');
  process.exit(1);
}

// Find the last </div> before tabRPG that closes tabScript
const closingOfTabScript = html.lastIndexOf('</div>', endTabScriptIdx);

const dualScriptHeaderAndTab1 = `<!-- 📜 DUAL-SCRIPT TOGGLE BAR (TAB 1 VS TAB 2) -->
      <div class="dual-script-toggle-bar" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px;background:rgba(11,15,25,0.95);border:1.5px solid rgba(245,158,11,0.5);border-radius:14px;padding:6px;box-shadow:0 0 25px rgba(245,158,11,0.2)">
        <button type="button" id="btnScriptTab1" onclick="switchScriptTab('tab1')" style="padding:12px 14px;border:none;border-radius:10px;font-size:13.5px;font-weight:900;cursor:pointer;background:rgba(245,158,11,0.95);color:#0b0f19;box-shadow:0 2px 10px rgba(245,158,11,0.35);transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:6px">
          ⚡ Tab 1: "Transfer Me Back" Hook (Default &amp; Recommended)
        </button>
        <button type="button" id="btnScriptTab2" onclick="switchScriptTab('tab2')" style="padding:12px 14px;border:none;border-radius:10px;font-size:13.5px;font-weight:700;cursor:pointer;background:transparent;color:#94a3b8;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:6px">
          📜 Tab 2: Direct Value Hook &amp; Diagnostic (Previous Script)
        </button>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 1 CONTENT: "TRANSFER ME BACK" HOOK & TWO-SIDED FLOW  -->
      <!-- ======================================================== -->
      <div id="scriptTabPane1" class="script-tab-pane" style="display:block">
        <!-- Prominent Golden Hook Banner -->
        <div style="background:linear-gradient(135deg,rgba(245,158,11,0.18),rgba(239,68,68,0.12));border:2px solid #f59e0b;border-radius:14px;padding:18px 22px;margin-bottom:18px;box-shadow:0 8px 30px rgba(0,0,0,0.6)">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:6px">
            <span style="font-size:11.5px;font-family:var(--font-mono);font-weight:900;color:#fbbf24;letter-spacing:0.08em;text-transform:uppercase">⚡ VERBATIM HOOK — ALWAYS START WITH THIS LINE:</span>
            <span style="background:rgba(245,158,11,0.2);color:#fbbf24;border:1px solid rgba(245,158,11,0.5);font-size:11px;font-weight:800;padding:3px 8px;border-radius:6px">🎯 88% Gatekeeper Pass Rate</span>
          </div>
          <div style="font-size:20px;font-weight:900;color:#ffffff;line-height:1.4;margin:6px 0;letter-spacing:0.01em">
            "Hey, I was just talking to the owner, I'm wondering if you can transfer me back?"
          </div>
          <div style="font-size:12.5px;color:#cbd5e1;line-height:1.5;margin-top:6px">
            💡 <em>Psychological Mechanic:</em> Assumes immediate familiarity and prior connection. Treating the receptionist/dispatcher as an ally rather than an obstacle completely disarms sales defenses.
          </div>
        </div>

        <!-- TWO-SIDED BRANCHING GRID: BOTH PATHS OF WHAT THEY SAY -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:18px;margin-bottom:20px">
          
          <!-- SIDE A: WHEN TRANSFERRED / OWNER PICKS UP -->
          <div style="background:#0a0f1d;border:2px solid #10b981;border-radius:14px;padding:20px;box-shadow:0 10px 35px rgba(0,0,0,0.7)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding-bottom:10px;border-bottom:1.5px solid rgba(16,185,129,0.3)">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:22px">📞</span>
                <div>
                  <h4 style="font-size:15px;font-weight:900;color:#34d399;margin:0">SIDE A: TRANSFERRED / OWNER ANSWERS</h4>
                  <span style="font-size:11px;color:var(--dim)">"Hello / Yeah, what's up? / Who's this?"</span>
                </div>
              </div>
              <span style="background:rgba(16,185,129,0.18);color:#6ee7b7;border:1px solid rgba(16,185,129,0.5);font-size:11px;font-weight:800;padding:3px 8px;border-radius:6px">Decision Maker Track</span>
            </div>

            <!-- Step A1: Rapid Bridge & Familiarity Pivot -->
            <div class="script-phase" style="margin-bottom:14px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.25);border-radius:10px;padding:14px">
              <div class="phase-tag" style="color:#6ee7b7;font-weight:800;font-size:11.5px;margin-bottom:6px">Step A1: Rapid Bridge &amp; The Weekend Leak Hook</div>
              <div class="script-line" style="font-size:14px;line-height:1.6;color:#ffffff">
                "Hey <span class="dyn-owner">[Owner's First Name]</span>, appreciate you hopping back on with me! Quick question for you—when an emergency <span class="dyn-trade">HVAC</span> call comes in for <span class="dyn-company">[Company Name]</span> on a weekend at 8 PM and rolls to voicemail, <strong>where do you think that <span class="dyn-exact-ticket">$8,000</span> emergency job goes?</strong>"
              </div>
              <div class="delivery-tip" style="margin-top:8px;font-size:11.5px;color:#94a3b8">
                🤫 <em>Delivery:</em> STOP TALKING. Let him admit it rolls to voicemail or rings his cell during family dinner.
              </div>
            </div>

            <!-- Step A2: The Revenue Bleed Diagnosis -->
            <div class="script-phase" style="margin-bottom:14px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.25);border-radius:10px;padding:14px">
              <div class="phase-tag" style="color:#f87171;font-weight:800;font-size:11.5px;margin-bottom:6px">Step A2: The 78% Rule &amp; Revenue Bleed</div>
              <div class="script-line" style="font-size:14px;line-height:1.6;color:#ffffff">
                "Exactly. And 78% of Florida homeowners hire the FIRST contractor who answers or texts back within 60 seconds. When they hit voicemail, they tap the next competitor on Google in 3 seconds.<br><br>
                For a crew your size with <span class="dyn-emp-count">5 trucks</span>, dropping just one or two emergency calls a month bleeds over <strong style="color:#f87171"><span class="dyn-loss">$102,000 a year</span></strong> straight to your competitors down the street."
              </div>
            </div>

            <!-- Step A3: The Ava Voice AI Solution & Instant Math -->
            <div class="script-phase" style="margin-bottom:14px;background:rgba(56,189,248,0.06);border:1px solid rgba(56,189,248,0.25);border-radius:10px;padding:14px">
              <div class="phase-tag" style="color:#38bdf8;font-weight:800;font-size:11.5px;margin-bottom:6px">Step A3: The Ava Solution &amp; 1-Job Payback Math</div>
              <div class="script-line" style="font-size:14px;line-height:1.6;color:#ffffff">
                "That's why we built <em>Ava</em>. She's a Florida-trained Voice AI receptionist that answers in 0.8 seconds 24/7, qualifies the emergency, quotes your standard service fee, and dispatches an instant SMS alert to your techs.<br><br>
                You keep your exact same phone number via simple <strong>*71 rollover</strong>—no porting, zero contracts. Capturing just ONE single job pays for Ava for the whole year and puts <strong style="color:#34d399"><span class="dyn-savings">+$93,636</span> net profit</strong> in your pocket."
              </div>
            </div>

            <!-- Step A4: The Master 10-Min Live Demo Close -->
            <div class="script-phase" style="background:rgba(245,158,11,0.08);border:1.5px solid rgba(245,158,11,0.45);border-radius:10px;padding:14px">
              <div class="phase-tag" style="color:#fbbf24;font-weight:900;font-size:12px;margin-bottom:6px">Step A4: Master 10-Min Demo Close &amp; Alternative Choice</div>
              <div class="script-line" style="font-size:14.5px;line-height:1.6;color:#ffffff">
                "<strong>So rather than watch another $8k job roll to your competitors this weekend, let's do a quick 10-minute live test on your own phone this week so you can hear Ava answer live for <span class="dyn-company">[Company Name]</span>. Would Tuesday at 2 PM or Thursday at 10 AM work better for you?</strong>"
              </div>
            </div>
          </div>

          <!-- SIDE B: GATEKEEPER PUSHBACK / QUESTIONS -->
          <div style="background:#0a0f1d;border:2px solid #f59e0b;border-radius:14px;padding:20px;box-shadow:0 10px 35px rgba(0,0,0,0.7)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding-bottom:10px;border-bottom:1.5px solid rgba(245,158,11,0.3)">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:22px">🛡️</span>
                <div>
                  <h4 style="font-size:15px;font-weight:900;color:#fbbf24;margin:0">SIDE B: GATEKEEPER QUESTIONS &amp; OBJECTIONS</h4>
                  <span style="font-size:11px;color:var(--dim)">"What was this regarding? / He's not available / Who is this?"</span>
                </div>
              </div>
              <span style="background:rgba(245,158,11,0.18);color:#fbbf24;border:1px solid rgba(245,158,11,0.5);font-size:11px;font-weight:800;padding:3px 8px;border-radius:6px">Gatekeeper Bypass</span>
            </div>

            <!-- Step B1: Casual Teammate Reversal -->
            <div class="script-phase" style="margin-bottom:14px;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.25);border-radius:10px;padding:14px">
              <div class="phase-tag" style="color:#fbbf24;font-weight:800;font-size:11.5px;margin-bottom:6px">Gatekeeper: "What was this regarding?" / "Who is this?"</div>
              <div class="script-line" style="font-size:14px;line-height:1.6;color:#ffffff">
                "Yeah, it was regarding his emergency dispatch line dropping calls on weekends—<strong>is he out on a job site right now or at his desk?</strong>"
              </div>
              <div class="delivery-tip" style="margin-top:8px;font-size:11.5px;color:#94a3b8">
                💡 <em>Tone:</em> Relaxed, low-energy, insider language. Sounds like a dispatcher or software tech rather than a telemarketer.
              </div>
            </div>

            <!-- Step B2: He's on a Job Site / On a Ladder -->
            <div class="script-phase" style="margin-bottom:14px;background:rgba(56,189,248,0.06);border:1px solid rgba(56,189,248,0.25);border-radius:10px;padding:14px">
              <div class="phase-tag" style="color:#38bdf8;font-weight:800;font-size:11.5px;margin-bottom:6px">Gatekeeper: "He's out in the field / on a job site"</div>
              <div class="script-line" style="font-size:14px;line-height:1.6;color:#ffffff">
                "Got it, totally understand, he's busy in the field. <strong>What's the best direct mobile number to ping him on so he doesn't miss this lead report before he leaves the site?</strong>"
              </div>
            </div>

            <!-- Step B3: He's Not Available / Take a Message / Send Email -->
            <div class="script-phase" style="margin-bottom:14px;background:rgba(168,85,247,0.06);border:1px solid rgba(168,85,247,0.25);border-radius:10px;padding:14px">
              <div class="phase-tag" style="color:#c084fc;font-weight:800;font-size:11.5px;margin-bottom:6px">Gatekeeper: "He's not in / Can I take a message?"</div>
              <div class="script-line" style="font-size:14px;line-height:1.6;color:#ffffff">
                "No problem at all! I put together a quick 1-page missed-call revenue audit for <span class="dyn-company">[Company Name]</span> showing how much is leaking to competitors in <span class="dyn-city">[City]</span>.<br><br>
                <strong>What's the best direct email to shoot that to so he can look at it tonight?</strong> ... Awesome, and what's your name by the way? Appreciate your help, [Gatekeeper Name]!"
              </div>
            </div>

            <!-- Step B4: "Is This a Sales Call?" -->
            <div class="script-phase" style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.25);border-radius:10px;padding:14px">
              <div class="phase-tag" style="color:#f87171;font-weight:800;font-size:11.5px;margin-bottom:6px">Gatekeeper: "Is this a sales call?"</div>
              <div class="script-line" style="font-size:14px;line-height:1.6;color:#ffffff">
                "Not at all—we already audited their emergency call-handling for <span class="dyn-trade">[Trade]</span> in <span class="dyn-city">[City]</span>. Just seeing if he wanted the lead report before we give the territory slot to another contractor in <span class="dyn-city">[City]</span>. Can you buzz him real quick?"
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 2 CONTAINER: PREVIOUS SCRIPT & MULTI-PRODUCT PANELS  -->
      <!-- ======================================================== -->
      <div id="scriptTabPane2" class="script-tab-pane" style="display:none">
`;

html = html.substring(0, switcherIdx) + dualScriptHeaderAndTab1 + html.substring(switcherIdx, closingOfTabScript) + '</div><!-- END scriptTabPane2 -->\n    ' + html.substring(closingOfTabScript);
console.log('Step 3: Inserted Dual-Script Toggle Bar, Tab 1 ("Transfer Me Back" Hook) and wrapped Tab 2.');

// =========================================================================
// 4. ADD JS ENGINE HANDLERS
// =========================================================================
const jsHandlers = `
  // ============================================================
  // 🔑 GATE TABS & DUAL-SCRIPT TOGGLE ENGINE
  // ============================================================
  window.switchGateTab = function(tab) {
    const paneSignIn = document.getElementById('gatePaneSignIn');
    const paneRegister = document.getElementById('gatePaneRegister');
    const btnSignIn = document.getElementById('gateTabBtnSignIn');
    const btnRegister = document.getElementById('gateTabBtnRegister');

    if (tab === 'register') {
      if (paneSignIn) paneSignIn.style.display = 'none';
      if (paneRegister) paneRegister.style.display = 'block';
      if (btnSignIn) {
        btnSignIn.style.background = 'transparent';
        btnSignIn.style.color = '#94a3b8';
        btnSignIn.style.boxShadow = 'none';
      }
      if (btnRegister) {
        btnRegister.style.background = 'rgba(245,158,11,0.95)';
        btnRegister.style.color = '#0b0f19';
        btnRegister.style.boxShadow = '0 2px 8px rgba(245,158,11,0.3)';
      }
      const nameInput = document.getElementById('gateNameInput');
      if (nameInput) nameInput.focus();
    } else {
      if (paneSignIn) paneSignIn.style.display = 'block';
      if (paneRegister) paneRegister.style.display = 'none';
      if (btnSignIn) {
        btnSignIn.style.background = 'rgba(245,158,11,0.95)';
        btnSignIn.style.color = '#0b0f19';
        btnSignIn.style.boxShadow = '0 2px 8px rgba(245,158,11,0.3)';
      }
      if (btnRegister) {
        btnRegister.style.background = 'transparent';
        btnRegister.style.color = '#94a3b8';
        btnRegister.style.boxShadow = 'none';
      }
      const pinInput = document.getElementById('gateCloserPinInput');
      if (pinInput) pinInput.focus();
    }
  };

  window.switchScriptTab = function(tab) {
    const pane1 = document.getElementById('scriptTabPane1');
    const pane2 = document.getElementById('scriptTabPane2');
    const btn1 = document.getElementById('btnScriptTab1');
    const btn2 = document.getElementById('btnScriptTab2');

    if (tab === 'tab2') {
      if (pane1) pane1.style.display = 'none';
      if (pane2) pane2.style.display = 'block';
      if (btn1) {
        btn1.style.background = 'transparent';
        btn1.style.color = '#94a3b8';
        btn1.style.boxShadow = 'none';
      }
      if (btn2) {
        btn2.style.background = 'rgba(245,158,11,0.95)';
        btn2.style.color = '#0b0f19';
        btn2.style.boxShadow = '0 2px 10px rgba(245,158,11,0.35)';
      }
      if (typeof showToast === 'function') showToast('📜 Tab 2: Direct Value Hook & Multi-Product Playbook Active');
    } else {
      if (pane1) pane1.style.display = 'block';
      if (pane2) pane2.style.display = 'none';
      if (btn1) {
        btn1.style.background = 'rgba(245,158,11,0.95)';
        btn1.style.color = '#0b0f19';
        btn1.style.boxShadow = '0 2px 10px rgba(245,158,11,0.35)';
      }
      if (btn2) {
        btn2.style.background = 'transparent';
        btn2.style.color = '#94a3b8';
        btn2.style.boxShadow = 'none';
      }
      if (typeof showToast === 'function') showToast('⚡ Tab 1: "Transfer Me Back" Hook Active (Recommended)');
    }
  };
`;

const lastScriptIdx = html.lastIndexOf('</script>');
html = html.substring(0, lastScriptIdx) + jsHandlers + html.substring(lastScriptIdx);

// Save updated index.html
fs.writeFileSync(arenaPath, html, 'utf8');
console.log('Successfully written upgraded index.html!');

// =========================================================================
// 5. UPDATE FLORIDA NO-WEBSITE (florida-no-website.html)
// =========================================================================
if (fs.existsSync(floridaPath)) {
  let flHtml = fs.readFileSync(floridaPath, 'utf8');
  const flPitchOldToken = '<div class="battlecard-script" id="pitchScriptText">';
  const flPitchOldIdx = flHtml.indexOf(flPitchOldToken);
  
  if (flPitchOldIdx !== -1) {
    const flBattleCardOldEnd = flHtml.indexOf('</div>', flPitchOldIdx + flPitchOldToken.length);
    const flDualScriptHtml = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <button type="button" id="flBtnScriptTab1" onclick="switchFlScriptTab('tab1')" style="padding:8px 12px;border:none;border-radius:8px;font-size:12px;font-weight:900;cursor:pointer;background:rgba(245,158,11,0.95);color:#0b0f19">
        ⚡ Tab 1: "Transfer Me Back" Hook (Default)
      </button>
      <button type="button" id="flBtnScriptTab2" onclick="switchFlScriptTab('tab2')" style="padding:8px 12px;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;background:transparent;color:#94a3b8;border:1px solid rgba(255,255,255,0.15)">
        📜 Tab 2: Direct Google Reviews Hook
      </button>
    </div>
    <div class="battlecard-script" id="pitchScriptText" style="display:block">
"Hey, I was just talking to the owner, I'm wondering if you can transfer me back?"

[IF TRANSFERRED / OWNER PICKS UP]:
"Hey [Owner], appreciate you hopping back on! Look, I'll be blunt—I was looking at [Company] on Google Maps in [City]. You've got [Rating] reviews, but you literally don't have a website button. When people search emergency [Trade] on their phone, 78% tap the next contractor because they can't book an estimate or get an instant text. We built a fast mobile preview for [Company] with instant 24-second SMS auto-reply. Can I shoot you the 30-second link to look at on your phone right now?"

[IF GATEKEEPER ASKS "WHAT WAS THIS REGARDING?"]:
"Yeah, it was regarding his Google profile missing its emergency booking link and sending leads to competitors—is he out on a job site right now or at his desk?"
    </div>
    <div class="battlecard-script" id="pitchScriptText2" style="display:none">
"Hey [Owner], saw your 4.8★ reviews on Google in [City]. Quick heads-up: when people search emergency [Trade] on their phone, your Google Maps profile has no website button. 78% of people tap the next contractor because they can't book an estimate or get an instant text. We built a fast mobile preview for [Company] with instant 24-second SMS auto-reply. Can I shoot you the 30-second link to look at on your phone right now?"
    </div>`;

    flHtml = flHtml.substring(0, flPitchOldIdx) + flDualScriptHtml + flHtml.substring(flBattleCardOldEnd + 6);
    
    const flJsHelper = `
function switchFlScriptTab(tab) {
  const p1 = document.getElementById('pitchScriptText');
  const p2 = document.getElementById('pitchScriptText2');
  const b1 = document.getElementById('flBtnScriptTab1');
  const b2 = document.getElementById('flBtnScriptTab2');
  if (tab === 'tab2') {
    if (p1) p1.style.display = 'none';
    if (p2) p2.style.display = 'block';
    if (b1) { b1.style.background = 'transparent'; b1.style.color = '#94a3b8'; b1.style.border = '1px solid rgba(255,255,255,0.15)'; }
    if (b2) { b2.style.background = 'rgba(245,158,11,0.95)'; b2.style.color = '#0b0f19'; b2.style.border = 'none'; }
  } else {
    if (p1) p1.style.display = 'block';
    if (p2) p2.style.display = 'none';
    if (b1) { b1.style.background = 'rgba(245,158,11,0.95)'; b1.style.color = '#0b0f19'; b1.style.border = 'none'; }
    if (b2) { b2.style.background = 'transparent'; b2.style.color = '#94a3b8'; b2.style.border = '1px solid rgba(255,255,255,0.15)'; }
  }
}
`;
    const flLastScript = flHtml.lastIndexOf('</script>');
    flHtml = flHtml.substring(0, flLastScript) + flJsHelper + flHtml.substring(flLastScript);
    fs.writeFileSync(floridaPath, flHtml, 'utf8');
    console.log('Step 5: Updated florida-no-website.html with Dual Script Tabs.');
  }
}

console.log('All upgrades executed successfully!');
