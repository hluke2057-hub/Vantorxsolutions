// scripts/apply_gmail_and_killer_email_templates.js
const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../website/cold-call-arena/index.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log('--- APPLYING GMAIL SIGN-IN & HIGH-IMPACT PRODUCT EMAILS TO COLD CALL ARENA ---');

// 1. Ensure Google Identity Services script in <head>
if (!content.includes('accounts.google.com/gsi/client')) {
  content = content.replace('</head>', '  <script src="https://accounts.google.com/gsi/client" async defer></script>\n</head>');
  console.log('✓ Added Google Identity Services script to <head>');
}

// 2. Inject Gmail Account Status Bar into call-log-email-card
const oldEmailHeader = `<div style="font-size:11.5px;font-family:var(--font-mono);font-weight:800;color:var(--accent2);text-transform:uppercase;display:flex;align-items:center;gap:6px">
          <span>✉️</span> 3. CUSTOMIZED COMPANY EMAIL &amp; AUTO-SEND:
        </div>`;

const newEmailHeader = `<div style="font-size:11.5px;font-family:var(--font-mono);font-weight:800;color:var(--accent2);text-transform:uppercase;display:flex;align-items:center;gap:6px">
          <span>✉️</span> 3. CUSTOMIZED COMPANY EMAIL &amp; AUTO-SEND:
        </div>
      </div>

      <!-- Gmail Account Connection Status Bar -->
      <div id="gmailStatusBar" style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);border:1px solid var(--line2);border-radius:8px;padding:8px 12px;margin-bottom:12px;flex-wrap:wrap;gap:8px">
        <div style="display:flex;align-items:center;gap:8px">
          <span id="gmailStatusDot" style="font-size:14px">🔴</span>
          <span style="font-size:12px;color:var(--dim)">Gmail Account: <b id="gmailStatusText" style="color:#ffffff">Not Signed In</b></span>
        </div>
        <div style="display:flex;gap:6px;align-items:center">
          <button type="button" class="btn btn-secondary btn-xs" id="btnConnectGmail" onclick="openGmailConnectModal()" style="display:flex;align-items:center;gap:5px;font-size:11px;padding:4px 10px;background:#ffffff;color:#0b0f19;font-weight:700;border-radius:6px;cursor:pointer">
            <svg width="12" height="12" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            Sign in with Gmail
          </button>
          <button type="button" class="btn btn-ghost btn-xs" id="btnDisconnectGmail" onclick="disconnectGmail()" style="display:none;font-size:11px;padding:3px 8px;color:#fca5a5;border:1px solid rgba(239,68,68,0.3);cursor:pointer">Disconnect</button>
        </div>
      </div>
      <div>`;

if (content.includes(oldEmailHeader) && !content.includes('id="gmailStatusBar"')) {
  // Replace the closing div of that header block too
  const oldHeaderBlock = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px">
        <div style="font-size:11.5px;font-family:var(--font-mono);font-weight:800;color:var(--accent2);text-transform:uppercase;display:flex;align-items:center;gap:6px">
          <span>✉️</span> 3. CUSTOMIZED COMPANY EMAIL &amp; AUTO-SEND:
        </div>`;
  content = content.replace(oldHeaderBlock, `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px">
        <div style="font-size:11.5px;font-family:var(--font-mono);font-weight:800;color:var(--accent2);text-transform:uppercase;display:flex;align-items:center;gap:6px">
          <span>✉️</span> 3. CUSTOMIZED COMPANY EMAIL &amp; AUTO-SEND:
        </div>
      </div>

      <!-- Gmail Account Connection Status Bar -->
      <div id="gmailStatusBar" style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);border:1px solid var(--line2);border-radius:8px;padding:8px 12px;margin-bottom:12px;flex-wrap:wrap;gap:8px">
        <div style="display:flex;align-items:center;gap:8px">
          <span id="gmailStatusDot" style="font-size:14px">🔴</span>
          <span style="font-size:12px;color:var(--dim)">Gmail Account: <b id="gmailStatusText" style="color:#ffffff">Not Signed In</b></span>
        </div>
        <div style="display:flex;gap:6px;align-items:center">
          <button type="button" class="btn btn-secondary btn-xs" id="btnConnectGmail" onclick="openGmailConnectModal()" style="display:flex;align-items:center;gap:5px;font-size:11px;padding:4px 10px;background:#ffffff;color:#0b0f19;font-weight:700;border-radius:6px;cursor:pointer">
            <svg width="12" height="12" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            Sign in with Gmail
          </button>
          <button type="button" class="btn btn-ghost btn-xs" id="btnDisconnectGmail" onclick="disconnectGmail()" style="display:none;font-size:11px;padding:3px 8px;color:#fca5a5;border:1px solid rgba(239,68,68,0.3);cursor:pointer">Disconnect</button>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-bottom:10px">`);
  console.log('✓ Injected Gmail Status Bar into Call Log Modal');
}

// 3. Update Email Action Buttons row to include "Open in Gmail Web"
const oldActionRow = `<button type="button" class="btn btn-ghost btn-sm" onclick="copyCustomEmailBody()" style="display:flex;align-items:center;gap:6px;font-size:12px;border:1px solid var(--line2)">
          <span>📋</span> Copy Email Text
        </button>`;

const newActionRow = `<div style="display:flex;gap:6px;align-items:center">
          <button type="button" class="btn btn-ghost btn-sm" onclick="copyCustomEmailBody()" style="display:flex;align-items:center;gap:6px;font-size:12px;border:1px solid var(--line2)">
            <span>📋</span> Copy Text
          </button>
          <button type="button" class="btn btn-ghost btn-sm" onclick="openCustomEmailInGmailWeb()" title="Open pre-filled in Gmail Web" style="display:flex;align-items:center;gap:6px;font-size:12px;border:1px solid rgba(56,189,248,0.35);color:#7dd3fc">
            <svg width="13" height="13" viewBox="0 0 24 24"><path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            Open in Gmail Web
          </button>
        </div>`;

if (content.includes(oldActionRow)) {
  content = content.replace(oldActionRow, newActionRow);
  console.log('✓ Added "Open in Gmail Web" button to action row');
}

// 4. Inject Gmail Connect Modal HTML right after callLogModal
const gmailModalHTML = `
<!-- ============================================================ -->
<!-- 🔑 GMAIL INTEGRATION & AUTOMATIC SENDER MODAL -->
<!-- ============================================================ -->
<div class="modal-overlay" id="gmailConnectModal" style="z-index:100001;background:rgba(5,8,14,0.92);backdrop-filter:blur(14px)">
  <div class="modal-box" style="max-width:540px;border:1.5px solid #38bdf8;box-shadow:0 0 45px rgba(56,189,248,0.25)">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <h3 style="font-family:var(--font-head);font-size:18px;color:#ffffff;display:flex;align-items:center;gap:8px;margin:0">
        <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
        Connect Your Gmail Account
      </h3>
      <button class="btn btn-ghost btn-sm" onclick="closeGmailConnectModal()" style="font-size:16px;padding:4px 10px">✕</button>
    </div>

    <div style="font-size:12.5px;color:var(--dim);line-height:1.5;margin-bottom:16px;background:rgba(56,189,248,0.06);border:1px solid rgba(56,189,248,0.2);padding:10px 14px;border-radius:8px">
      Sign in with your Google account to automatically dispatch customized contractor emails directly from your real Gmail without opening external apps or copying text.
    </div>

    <!-- Active Connected Card -->
    <div id="gmailActiveCard" style="display:none;background:rgba(16,185,129,0.1);border:1.5px solid rgba(16,185,129,0.4);border-radius:10px;padding:12px;margin-bottom:16px">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:11px;font-family:var(--font-mono);color:#34d399;font-weight:700;text-transform:uppercase">ACTIVE CONNECTED ACCOUNT</div>
          <div id="gmailActiveEmailDisplay" style="font-size:14px;font-weight:700;color:#ffffff;margin-top:3px">user@gmail.com</div>
        </div>
        <button type="button" class="btn btn-ghost btn-sm" onclick="disconnectGmail()" style="color:#f87171;border-color:rgba(239,68,68,0.3);font-size:11px">Disconnect</button>
      </div>
    </div>

    <!-- 1-Click Google OAuth Sign In Button -->
    <div style="margin-bottom:18px">
      <div style="font-size:11px;font-family:var(--font-mono);font-weight:700;color:var(--accent2);text-transform:uppercase;margin-bottom:8px">
        METHOD 1: INSTANT GOOGLE SIGN-IN (OAUTH)
      </div>
      <button type="button" id="btnGoogleOAuthTrigger" onclick="triggerGoogleOAuthSignIn()" style="width:100%;display:flex;align-items:center;justify-content:center;gap:10px;background:#ffffff;color:#0b0f19;border:none;border-radius:8px;padding:11px 16px;font-family:var(--font-sans);font-weight:700;font-size:13.5px;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,0.3);transition:all 0.15s">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
        Sign in with Google Account
      </button>
      <div style="font-size:11px;color:var(--dim);margin-top:6px;text-align:center">Grants secure permission to send outbound cold call follow-ups via Gmail API.</div>
    </div>

    <!-- Method 2: Manual Gmail Address & Preferences -->
    <div style="border-top:1px solid var(--line2);padding-top:14px;margin-bottom:16px">
      <div style="font-size:11px;font-family:var(--font-mono);font-weight:700;color:var(--accent2);text-transform:uppercase;margin-bottom:8px">
        METHOD 2: DIRECT GMAIL ADDRESS &amp; PREFERENCES
      </div>
      <div style="margin-bottom:10px">
        <label for="gmailInputAccount" style="display:block;font-size:11px;color:var(--dim);margin-bottom:4px;font-weight:700">YOUR SENDER GMAIL ADDRESS:</label>
        <input type="email" id="gmailInputAccount" placeholder="e.g. luke@vantorxsolutions.com or yourname@gmail.com" style="width:100%;background:var(--bg2);border:1.5px solid var(--line2);color:#ffffff;font-size:13px;padding:8px 12px;border-radius:8px;outline:none">
      </div>

      <div style="margin-bottom:12px">
        <label for="gmailOAuthTokenInput" style="display:block;font-size:11px;color:var(--dim);margin-bottom:4px;font-weight:700">GOOGLE OAUTH TOKEN / APP KEY (OPTIONAL FOR BACKGROUND SEND):</label>
        <input type="password" id="gmailOAuthTokenInput" placeholder="Paste active Bearer token or leave blank for 1-click web compose" style="width:100%;background:var(--bg2);border:1px solid var(--line2);color:#ffffff;font-size:12px;padding:8px 12px;border-radius:8px;outline:none;font-family:var(--font-mono)">
      </div>

      <div style="background:rgba(255,255,255,0.02);border:1px solid var(--line2);border-radius:8px;padding:10px 12px">
        <div style="font-size:11px;font-weight:700;color:#ffffff;margin-bottom:6px">DEFAULT SENDER ACTION:</div>
        <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--ink);cursor:pointer;margin-bottom:4px">
          <input type="radio" name="gmailSendMode" value="api" id="modeGmailApi" checked>
          <span><b>Direct Gmail API</b> (Sends automatically in background)</span>
        </label>
        <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--ink);cursor:pointer">
          <input type="radio" name="gmailSendMode" value="web" id="modeGmailWeb">
          <span><b>Gmail Web Compose</b> (Opens pre-filled in your browser Gmail tab)</span>
        </label>
      </div>
    </div>

    <!-- Modal Footer Actions -->
    <div style="display:flex;justify-content:flex-end;gap:8px;border-top:1px solid var(--line2);padding-top:14px">
      <button type="button" class="btn btn-ghost btn-sm" onclick="closeGmailConnectModal()">Close</button>
      <button type="button" class="btn btn-gold btn-sm" onclick="saveManualGmailConfig()" style="font-weight:800;padding:8px 18px">
        💾 Save Gmail Settings
      </button>
    </div>
  </div>
</div>
`;

if (!content.includes('id="gmailConnectModal"')) {
  // Insert right after callLogModal closing
  const callLogCloseTarget = '    </div>\n  </div>\n</div>\n\n<div class="toast" id="toast">';
  if (content.includes(callLogCloseTarget)) {
    content = content.replace(callLogCloseTarget, '    </div>\n  </div>\n</div>\n' + gmailModalHTML + '\n<div class="toast" id="toast">');
    console.log('✓ Injected gmailConnectModal HTML');
  } else {
    // Alternate insertion before toast
    content = content.replace('<div class="toast" id="toast">', gmailModalHTML + '\n<div class="toast" id="toast">');
    console.log('✓ Injected gmailConnectModal HTML before toast');
  }
}

// 5. Replace generateCustomEmailContent with comprehensive product & revenue breakdown
const oldGenCodeStart = 'window.generateCustomEmailContent = function(lead, outcome) {';
const oldGenCodeEnd = 'window.setCallLogEmailTemplate = function(templateType) {';

const newGenCode = `window.generateCustomEmailContent = function(lead, outcome) {
    if (!lead) return { subject: '', body: '' };
    const lossMo = Number(lead.monthlyLoss || 8500).toLocaleString();
    const trade = lead.trade || 'Trade';
    const city = lead.city || 'Florida';
    const owner = lead.owner || 'Business Owner';
    const company = lead.company || 'your team';
    const employees = lead.employees || 3;
    const callerName = activeCaller || 'Luke Hamilton';
    const myEmail = localStorage.getItem('vantorx_gmail_user') || 'luke@vantorxsolutions.com';

    let subject = '';
    let body = '';

    if (outcome === 'Success') {
      subject = \`Confirmed: VantorX Voice AI & Revenue System Demo for \${company}\`;
      body = \`Hey \${owner},

Great connecting with you today!

Confirming our upcoming live system demo for \${company}. On our call, we will walk through the exact VantorX AI system we use to help Florida \${trade} contractors capture 15 to 30+ new high-ticket clients every month and recover $40,000+ in previously lost after-hours revenue across \${city}.

HERE IS WHAT WE WILL COVER & DEMO LIVE:
1. Ava 24/7 Voice AI Receptionist:
Experience how Ava answers inbound calls in 0.8 seconds (1st ring), qualifies the emergency, filters out tire-kickers, and schedules appointments directly into your calendar.

2. Instant Technician SMS Dispatch:
How your on-call technicians receive customer job details, addresses, and call recordings texted to their cell phones in under 5 seconds.

3. Software & Calendar Integration:
Seamless 2-way sync with ServiceTitan, Housecall Pro, Jobber, or Google Calendar — no new workflow or manual data entry for your office staff.

4. The Revenue Recovery Math:
The breakdown showing how converting 18 to 30 after-hours calls that currently drop to voicemail will inject an additional $35,000 to $85,000+ per month in gross billings for \${company}.

Before we connect, feel free to test Ava live right now on your phone by calling our live demo line at (561) 813-8602.

Looking forward to speaking with you!

Best regards,
\${callerName}
Founder, VantorX Solutions
Direct: (561) 813-8602
Email: \${myEmail}
https://www.vantorxsolutions.com\`;
    } else if (outcome === 'Call Back') {
      subject = \`Following up regarding our quick call — \${company} (+15 to 30 clients/mo)\`;
      body = \`Hey \${owner},

Following up on our quick call earlier. I know you're busy running jobs on-site with your crew at \${company}, so I look forward to connecting at our scheduled time.

To give you a quick 45-second executive summary of what VantorX does for Florida \${trade} contractors:

We eliminate missed-call revenue bleed by deploying Ava — our autonomous 24/7 Voice AI receptionist that answers every call on the 1st ring (0.8 seconds), 24/7/365. She qualifies emergency callers, books appointments directly into your calendar, and texts your on-call technician the address and job details immediately.

WHAT THIS GENERATES FOR \${company}:
• 15 to 30+ new high-ticket paying clients booked every single month.
• $40,000 to $85,000+ in retained gross revenue from calls that previously hit dead voicemail.
• Zero extra marketing dollars spent — you monetize the high-intent calls you are already paying Google and LSA to generate.

You can test Ava live right now on your phone by dialing (561) 813-8602.

Talk with you soon!

Best regards,
\${callerName}
VantorX Solutions | (561) 813-8602
https://www.vantorxsolutions.com\`;
    } else if (outcome === 'Short') {
      subject = \`Quick question: missed after-hours calls at \${company}\`;
      body = \`Hey \${owner},

Left you a brief voicemail regarding \${company}. For Florida \${trade} contractors, missed after-hours calls typically leak $35,000 to $80,000 a month to whichever competitor answers first.

We deployed Ava, a 24/7 Voice AI that answers in 0.8 seconds, books the job into your calendar, and texts your tech the customer details instantly — consistently bringing in 15 to 30+ new booked clients every month with zero extra ad spend.

Can I send you a 60-second video of Ava handling a simulated call for \${company}? You can also test her live right now at (561) 813-8602.

Best,
\${callerName}
VantorX Solutions | (561) 813-8602\`;
    } else {
      // Default: 'No Luck' / Voicemail follow-up (Comprehensive Product & Revenue Breakdown)
      subject = \`After-hours calls at \${company} — Recovering $45k/mo & 20+ missed clients\`;
      body = \`Hey \${owner},

I just left a brief voicemail at \${company} regarding your inbound call capture across \${city}.

HERE IS THE REALITY FOR FLORIDA \${trade.toUpperCase()} CONTRACTORS:
Every month, an average of 18 to 35+ emergency calls drop to voicemail when your crew is on jobsites, driving, or after 5:00 PM. In our industry, 78% of homeowners never leave a message — they simply hang up and hire whichever competitor answers first.

At an average \${trade} ticket of $1,800 to $4,500, that is $35,000 to $85,000+ in pure revenue walking straight out the door every single month.

HERE IS WHAT VANTORX DOES FOR \${company}:

1. Ava 24/7 Autonomous Voice AI:
Answers every inbound call on the 1st ring (0.8 seconds), 24 hours a day, 365 days a year. She speaks fluent, natural English and Spanish, calms stressed customers, diagnoses the emergency, and qualifies their job details.

2. Instant Technician SMS Dispatch & Calendar Booking:
Ava instantly syncs with your schedule (ServiceTitan, Housecall Pro, Jobber, or Google Calendar) and texts your on-call technician the customer's name, phone, address, and job notes within 5 seconds.

3. Speed-to-Lead Inbound Rescue (<30 Seconds):
When web or Google LSA leads come in, Ava instantly calls the customer before they can open another tab to call your competitors.

4. Automated 5-Star Google Review Engine:
Automatically texts satisfied customers post-job to collect reviews and build local map-pack dominance.

THE BOTTOM-LINE NUMBERS FOR \${company}:
• 15 to 30+ additional high-ticket booked clients every single month.
• $35,000 to $85,000+ in recovered gross revenue previously lost to dead voicemail.
• Zero extra ad spend — you monetize the callers you are already paying to reach.

TEST AVA LIVE ON YOUR PHONE:
Dial our live demo line anytime at (561) 813-8602 to hear Ava answer on ring one.

Are you available for a quick 5-minute walkthrough this Thursday or Friday to see how this plugs into \${company}?

Best regards,
\${callerName}
Founder, VantorX Solutions
Direct: (561) 813-8602
Email: \${myEmail}
https://www.vantorxsolutions.com\`;
    }

    return { subject, body };
  };

  `;

const startIdx = content.indexOf(oldGenCodeStart);
const endIdx = content.indexOf(oldGenCodeEnd);
if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + newGenCode + content.substring(endIdx);
  console.log('✓ Upgraded generateCustomEmailContent with comprehensive product & revenue breakdown');
} else {
  console.warn('Could not locate exact generateCustomEmailContent bounds; searching alternatives...');
}

// 6. Replace sendCustomizedCallEmail & Inject Gmail controller functions
const oldSendStart = 'window.sendCustomizedCallEmail = function() {';
const oldSendEnd = 'window.copyCustomEmailBody = function() {';

const newSendAndGmailCode = `// ============================================================
  // 🔑 GMAIL AUTHENTICATION & AUTOMATIC SENDING ENGINE
  // ============================================================
  let googleTokenClient = null;

  window.openGmailConnectModal = function() {
    const modal = document.getElementById('gmailConnectModal');
    if (!modal) return;
    modal.style.display = 'flex';

    const savedUser = localStorage.getItem('vantorx_gmail_user') || '';
    const savedToken = localStorage.getItem('vantorx_gmail_token') || '';
    const savedMode = localStorage.getItem('vantorx_gmail_mode') || 'api';

    const userInp = document.getElementById('gmailInputAccount');
    const tokenInp = document.getElementById('gmailOAuthTokenInput');
    const activeCard = document.getElementById('gmailActiveCard');
    const activeDisplay = document.getElementById('gmailActiveEmailDisplay');

    if (userInp) userInp.value = savedUser;
    if (tokenInp) tokenInp.value = savedToken;
    if (document.getElementById('modeGmailApi')) document.getElementById('modeGmailApi').checked = (savedMode === 'api');
    if (document.getElementById('modeGmailWeb')) document.getElementById('modeGmailWeb').checked = (savedMode === 'web');

    if (savedUser && activeCard) {
      activeCard.style.display = 'block';
      if (activeDisplay) activeDisplay.textContent = savedUser + (savedToken ? ' (Direct API Active ⚡)' : ' (Web Mode)');
    } else if (activeCard) {
      activeCard.style.display = 'none';
    }
  };

  window.closeGmailConnectModal = function() {
    const modal = document.getElementById('gmailConnectModal');
    if (modal) modal.style.display = 'none';
  };

  window.saveManualGmailConfig = function() {
    const userInp = document.getElementById('gmailInputAccount');
    const tokenInp = document.getElementById('gmailOAuthTokenInput');
    const email = (userInp?.value || '').trim();
    const token = (tokenInp?.value || '').trim();
    const mode = document.querySelector('input[name="gmailSendMode"]:checked')?.value || 'api';

    if (email && (!email.includes('@') || !email.includes('.'))) {
      showToast('⚠️ Please enter a valid Gmail address!');
      return;
    }

    if (email) localStorage.setItem('vantorx_gmail_user', email);
    else localStorage.removeItem('vantorx_gmail_user');

    if (token) localStorage.setItem('vantorx_gmail_token', token);
    else localStorage.removeItem('vantorx_gmail_token');

    localStorage.setItem('vantorx_gmail_mode', mode);

    updateGmailStatusUI();
    closeGmailConnectModal();
    showToast(email ? \`✓ Gmail account connected: \${email}\` : '✓ Gmail settings updated');
  };

  window.disconnectGmail = function() {
    localStorage.removeItem('vantorx_gmail_user');
    localStorage.removeItem('vantorx_gmail_token');
    localStorage.removeItem('vantorx_gmail_mode');
    updateGmailStatusUI();
    const activeCard = document.getElementById('gmailActiveCard');
    if (activeCard) activeCard.style.display = 'none';
    const userInp = document.getElementById('gmailInputAccount');
    if (userInp) userInp.value = '';
    const tokenInp = document.getElementById('gmailOAuthTokenInput');
    if (tokenInp) tokenInp.value = '';
    showToast('Gmail account disconnected');
  };

  window.updateGmailStatusUI = function() {
    const user = localStorage.getItem('vantorx_gmail_user');
    const token = localStorage.getItem('vantorx_gmail_token');
    const dot = document.getElementById('gmailStatusDot');
    const text = document.getElementById('gmailStatusText');
    const btnConnect = document.getElementById('btnConnectGmail');
    const btnDisconnect = document.getElementById('btnDisconnectGmail');

    if (user) {
      if (dot) dot.textContent = '🟢';
      if (text) text.innerHTML = \`<span style="color:#34d399">\${user}</span>\`;
      if (btnConnect) {
        btnConnect.innerHTML = '⚙️ Settings';
        btnConnect.style.background = 'rgba(255,255,255,0.1)';
        btnConnect.style.color = '#ffffff';
      }
      if (btnDisconnect) btnDisconnect.style.display = 'inline-flex';
    } else {
      if (dot) dot.textContent = '🔴';
      if (text) text.innerHTML = '<span style="color:#94a3b8">Not Signed In</span>';
      if (btnConnect) {
        btnConnect.innerHTML = \`<svg width="12" height="12" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg> Sign in with Gmail\`;
        btnConnect.style.background = '#ffffff';
        btnConnect.style.color = '#0b0f19';
      }
      if (btnDisconnect) btnDisconnect.style.display = 'none';
    }
  };

  window.triggerGoogleOAuthSignIn = function() {
    try {
      if (window.google && google.accounts && google.accounts.oauth2) {
        if (!googleTokenClient) {
          googleTokenClient = google.accounts.oauth2.initTokenClient({
            client_id: localStorage.getItem('vantorx_google_client_id') || '407408718192.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email',
            callback: async (tokenResp) => {
              if (tokenResp.error) {
                console.error('Google Auth Error:', tokenResp);
                showToast('⚠️ Google sign-in cancelled or failed');
                return;
              }
              const accessToken = tokenResp.access_token;
              localStorage.setItem('vantorx_gmail_token', accessToken);
              // Fetch user email
              try {
                const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { 'Authorization': \`Bearer \${accessToken}\` }
                });
                if (profileRes.ok) {
                  const profile = await profileRes.json();
                  if (profile.email) localStorage.setItem('vantorx_gmail_user', profile.email);
                }
              } catch (e) {
                console.warn('Could not fetch user profile:', e);
              }
              localStorage.setItem('vantorx_gmail_mode', 'api');
              updateGmailStatusUI();
              closeGmailConnectModal();
              showToast(\`✓ Signed into Gmail as \${localStorage.getItem('vantorx_gmail_user') || 'Google Account'}!\`);
            }
          });
        }
        googleTokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        // Fallback if google script hasn't loaded: prompt for email address
        const promptEmail = prompt('Enter your Gmail address to connect:', localStorage.getItem('vantorx_gmail_user') || 'luke@vantorxsolutions.com');
        if (promptEmail && promptEmail.includes('@')) {
          localStorage.setItem('vantorx_gmail_user', promptEmail.trim());
          localStorage.setItem('vantorx_gmail_mode', 'api');
          updateGmailStatusUI();
          closeGmailConnectModal();
          showToast(\`✓ Gmail connected: \${promptEmail.trim()}\`);
        }
      }
    } catch (err) {
      console.error('OAuth trigger error:', err);
      showToast('⚠️ Google Identity service initializing — please try again in a second');
    }
  };

  window.openCustomEmailInGmailWeb = function() {
    const recipient = (document.getElementById('callLogEmailRecipient')?.value || '').trim();
    const subject = (document.getElementById('callLogEmailSubject')?.value || '').trim();
    const bodyText = (document.getElementById('callLogEmailBody')?.value || '').trim();
    if (!recipient) {
      showToast('⚠️ Please enter a recipient email address first!');
      return;
    }
    const gmailUrl = \`https://mail.google.com/mail/?view=cm&fs=1&to=\${encodeURIComponent(recipient)}&su=\${encodeURIComponent(subject)}&body=\${encodeURIComponent(bodyText)}\`;
    window.open(gmailUrl, '_blank');
    showToast(\`🌐 Opened Gmail Web for \${recipient}\`);
  };

  // Helper: Send directly via Gmail REST API
  async function dispatchGmailApiCall(accessToken, toEmail, subject, bodyText) {
    const utf8Subject = \`=?utf-8?B?\${btoa(unescape(encodeURIComponent(subject)))}?=\`;
    const emailLines = [
      \`To: \${toEmail}\`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
      \`Subject: \${utf8Subject}\`,
      '',
      bodyText
    ];
    const rawContent = emailLines.join('\\r\\n');
    const base64Url = btoa(unescape(encodeURIComponent(rawContent)))
      .replace(/\\+/g, '-')
      .replace(/\\//g, '_')
      .replace(/=+$/, '');

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${accessToken}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw: base64Url })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || \`Gmail API returned HTTP \${res.status}\`);
    }
    return await res.json();
  }

  // Master Automatic Send Email Function
  window.sendCustomizedCallEmail = async function() {
    if (!activeLogLeadId) return;
    const lead = LEADS_DATA.find(l => l.id === activeLogLeadId);
    const recipientInput = document.getElementById('callLogEmailRecipient');
    const recipient = (recipientInput?.value || '').trim();

    if (!recipient || !recipient.includes('@') || !recipient.includes('.')) {
      if (recipientInput) {
        recipientInput.style.borderColor = '#ef4444';
        recipientInput.style.boxShadow = '0 0 12px rgba(239,68,68,0.5)';
        recipientInput.focus();
      }
      showToast('⚠️ Please enter a valid recipient email address above!');
      return;
    }

    const subject = (document.getElementById('callLogEmailSubject')?.value || '').trim();
    const bodyText = (document.getElementById('callLogEmailBody')?.value || '').trim();
    const sendBtn = document.getElementById('btnAutoSendEmail');
    const sentBadge = document.getElementById('callLogEmailSentBadge');

    const gmailUser = localStorage.getItem('vantorx_gmail_user');
    const gmailToken = localStorage.getItem('vantorx_gmail_token');
    const sendMode = localStorage.getItem('vantorx_gmail_mode') || 'api';

    // 1. Copy to clipboard as permanent safety backup
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(\`To: \${recipient}\\nSubject: \${subject}\\n\\n\${bodyText}\`).catch(() => {});
    }

    // 2. Direct Gmail API Automatic Dispatch if Token is Present
    if (gmailToken && sendMode === 'api') {
      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span>⏳</span> Sending via Gmail...';
      }
      try {
        await dispatchGmailApiCall(gmailToken, recipient, subject, bodyText);
        if (sentBadge) {
          sentBadge.textContent = \`✓ Sent from \${gmailUser || 'Gmail'}!\`;
          sentBadge.style.color = '#10b981';
        }
        showToast(\`🚀 Sent directly from your Gmail (\${gmailUser}) to \${recipient}!\`);
      } catch (err) {
        console.warn('Gmail API error, falling back to Gmail Web compose:', err);
        // Fallback to Gmail Web
        openCustomEmailInGmailWeb();
        if (sentBadge) {
          sentBadge.textContent = \`✓ Dispatched via Gmail Web\`;
          sentBadge.style.color = '#38bdf8';
        }
      } finally {
        if (sendBtn) {
          sendBtn.disabled = false;
          sendBtn.innerHTML = '<span>🚀</span> Automatically Send Email';
        }
      }
    } else {
      // Direct Gmail Web Compose Dispatch
      openCustomEmailInGmailWeb();
      if (sentBadge) {
        sentBadge.textContent = \`✓ Opened in Gmail (\${recipient})\`;
        sentBadge.style.color = '#10b981';
      }
      showToast(\`🚀 Pre-filled in Gmail Web for \${recipient}! Click Send.\`);
    }

    // 3. Update call record tracking
    if (!CALL_RECORDS[activeLogLeadId]) CALL_RECORDS[activeLogLeadId] = {};
    CALL_RECORDS[activeLogLeadId].email = recipient;
    CALL_RECORDS[activeLogLeadId].emailSent = true;
    CALL_RECORDS[activeLogLeadId].emailSentTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append to notes
    const notesEl = document.getElementById('callLogModalNotes');
    if (notesEl) {
      const emailNote = \`[✉️ Email sent to \${recipient} (\${activeLogEmailTemplate})]\`;
      if (!notesEl.value.includes(emailNote)) {
        notesEl.value = notesEl.value.trim().length > 0 ? \`\${notesEl.value.trim()} — \${emailNote}\` : emailNote;
      }
    }
  };

  `;

const sendStartIdx = content.indexOf(oldSendStart);
const sendEndIdx = content.indexOf(oldSendEnd);
if (sendStartIdx !== -1 && sendEndIdx !== -1) {
  content = content.substring(0, sendStartIdx) + newSendAndGmailCode + content.substring(sendEndIdx);
  console.log('✓ Upgraded sendCustomizedCallEmail and injected Gmail engine');
} else {
  console.warn('Could not locate exact sendCustomizedCallEmail bounds; searching alternatives...');
}

// 7. Ensure openCallLogModal calls updateGmailStatusUI()
const oldModalOpenTarget = 'selectCallLogOutcome(currentOutcome);\n\n    // Populate Email Card';
if (content.includes(oldModalOpenTarget)) {
  content = content.replace(oldModalOpenTarget, 'selectCallLogOutcome(currentOutcome);\n\n    // Update Gmail Status UI\n    updateGmailStatusUI();\n\n    // Populate Email Card');
  console.log('✓ Added updateGmailStatusUI() call to openCallLogModal');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ SAVED UPDATED WEBSITE/COLD-CALL-ARENA/INDEX.HTML SUCCESSFULLY!');
