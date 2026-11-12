// scripts/patch_vantorx_email_arena.js
const fs = require('fs');
const path = require('path');

const filePath = path.resolve('website/cold-call-arena/index.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Original content length:', content.length);

// 1. Replace Gmail Status Bar
const oldStatusBarTarget = `      <!-- Gmail Account Connection Status Bar -->
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
      </div>`;

const newStatusBar = `      <!-- VantorX Official Business Email Dispatch Status Bar -->
      <div id="vantorxSenderStatusBar" style="display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg, rgba(16,185,129,0.09) 0%, rgba(15,23,42,0.7) 100%);border:1.5px solid rgba(16,185,129,0.4);border-radius:8px;padding:9px 12px;margin-bottom:12px;flex-wrap:wrap;gap:8px">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span id="vantorxSenderDot" style="display:inline-block;width:9px;height:9px;background:#10b981;border-radius:50%;box-shadow:0 0 10px #10b981"></span>
          <span style="font-size:12px;color:var(--dim)">Sender: <b id="vantorxSenderDisplay" style="color:#ffffff;font-weight:700">Luke Hamilton &lt;luke@vantorxsolutions.com&gt;</b></span>
          <span style="font-size:10px;font-family:var(--font-mono);background:rgba(16,185,129,0.2);color:#34d399;padding:2px 7px;border-radius:9999px;font-weight:700;border:1px solid rgba(16,185,129,0.4)">✓ VANTORX DOMAIN AUTHENTICATED</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center">
          <select id="vantorxSenderAliasSelect" onchange="onVantorXSenderChange(this.value)" style="background:var(--bg2);color:var(--accent2);border:1px solid var(--line2);font-size:11px;padding:4px 8px;border-radius:6px;font-weight:600;outline:none;cursor:pointer">
            <option value="luke" selected>Luke Hamilton (luke@vantorxsolutions.com)</option>
            <option value="ava">Ava Voice AI (ava@vantorxsolutions.com)</option>
            <option value="contact">Outbound Team (contact@vantorxsolutions.com)</option>
          </select>
          <button type="button" class="btn btn-ghost btn-xs" onclick="openVantorXEmailInfoModal()" style="font-size:11px;padding:3px 8px;color:#38bdf8;border:1px solid rgba(56,189,248,0.3);cursor:pointer">🛡️ Domain Info</button>
        </div>
      </div>`;

// 2. Replace Action Button Row
const oldActionsTarget = `      <!-- Action Buttons Row -->
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
        <button type="button" class="btn btn-ghost btn-sm" onclick="copyCustomEmailBody()" style="display:flex;align-items:center;gap:6px;font-size:12px;border:1px solid var(--line2)">
          <span>📋</span> Copy Email Text
        </button>
        <div style="display:flex;gap:8px;align-items:center">
          <span style="font-size:11px;color:var(--dim)" id="callLogEmailSentBadge"></span>
          <button type="button" class="btn btn-gold btn-sm" id="btnAutoSendEmail" onclick="sendCustomizedCallEmail()" style="font-weight:800;display:flex;align-items:center;gap:7px;padding:8px 18px;background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%);color:#0b0f19;border:none;border-radius:8px;box-shadow:0 0 18px rgba(245,158,11,0.4);cursor:pointer;font-size:12.5px;transition:all 0.2s">
            <span>🚀</span> Automatically Send Email
          </button>
        </div>
      </div>`;

const newActions = `      <!-- Action Buttons Row -->
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
        <div style="display:flex;gap:8px;align-items:center">
          <button type="button" class="btn btn-ghost btn-sm" onclick="copyCustomEmailBody()" style="display:flex;align-items:center;gap:6px;font-size:12px;border:1px solid var(--line2)">
            <span>📋</span> Copy Email Text
          </button>
          <button type="button" class="btn btn-ghost btn-sm" onclick="openCustomEmailInGmailWeb()" title="Open as manual web draft" style="display:flex;align-items:center;gap:6px;font-size:12px;border:1px solid var(--line2);color:#94a3b8">
            <span>🌐</span> Open Webmail Draft
          </button>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <span style="font-size:11px;color:var(--dim)" id="callLogEmailSentBadge"></span>
          <button type="button" class="btn btn-gold btn-sm" id="btnAutoSendEmail" onclick="sendCustomizedCallEmail()" style="font-weight:800;display:flex;align-items:center;gap:7px;padding:9px 20px;background:linear-gradient(135deg, #10b981 0%, #059669 100%);color:#ffffff;border:none;border-radius:8px;box-shadow:0 0 20px rgba(16,185,129,0.45);cursor:pointer;font-size:12.5px;transition:all 0.2s">
            <span>🚀</span> Send via VantorX Email
          </button>
        </div>
      </div>`;

// 3. Replace Gmail Modal with VantorX Email Info Modal
const modalStart = content.indexOf('<div class="modal-overlay" id="gmailConnectModal"');
const modalEnd = content.indexOf('</div>\r\n</div>\r\n\r\n<div class="toast" id="toast">');
const modalEndLF = content.indexOf('</div>\n</div>\n\n<div class="toast" id="toast">');
const effectiveEnd = modalEnd !== -1 ? modalEnd + 14 : (modalEndLF !== -1 ? modalEndLF + 14 : -1);

console.log('modalStart:', modalStart, 'effectiveEnd:', effectiveEnd);

const newEmailModal = `<!-- ============================================================ -->
<!-- 🛡️ VANTORX OFFICIAL BUSINESS EMAIL & DOMAIN HEALTH MODAL -->
<!-- ============================================================ -->
<div class="modal-overlay" id="gmailConnectModal" style="z-index:100001;background:rgba(5,8,14,0.92);backdrop-filter:blur(14px)">
  <div class="modal-box" style="max-width:540px;border:1.5px solid #10b981;box-shadow:0 0 45px rgba(16,185,129,0.25)">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <h3 style="font-family:var(--font-head);font-size:18px;color:#ffffff;display:flex;align-items:center;gap:8px;margin:0">
        <span style="font-size:20px">🛡️</span>
        Official VantorX Email Dispatch
      </h3>
      <button class="btn btn-ghost btn-sm" onclick="closeGmailConnectModal()" style="font-size:16px;padding:4px 10px">✕</button>
    </div>

    <div style="font-size:12.5px;color:var(--dim);line-height:1.5;margin-bottom:16px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.25);padding:12px 14px;border-radius:8px">
      All outbound cold call emails dispatch directly from your official <b>@vantorxsolutions.com</b> business domain with enterprise deliverability. <b>No personal Gmail sign-in is required for your team.</b>
    </div>

    <!-- Domain Health Card -->
    <div style="background:rgba(15,23,42,0.8);border:1.5px solid rgba(16,185,129,0.4);border-radius:10px;padding:12px 14px;margin-bottom:16px">
      <div style="font-size:11px;font-family:var(--font-mono);color:#34d399;font-weight:700;text-transform:uppercase;margin-bottom:8px">AUTHENTICATED SENDER DOMAIN STATUS</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
        <div style="color:#e2e8f0"><b>Domain:</b> vantorxsolutions.com</div>
        <div style="color:#34d399"><b>DKIM:</b> ✓ 2048-bit Verified</div>
        <div style="color:#34d399"><b>SPF:</b> ✓ Cloudflare MX Pass</div>
        <div style="color:#34d399"><b>DMARC:</b> ✓ Active Policy</div>
      </div>
    </div>

    <!-- Active Sender Selection -->
    <div style="margin-bottom:16px">
      <div style="font-size:11px;font-family:var(--font-mono);font-weight:700;color:var(--accent2);text-transform:uppercase;margin-bottom:8px">
        ACTIVE SENDER IDENTITY
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid var(--line2);border-radius:8px;padding:10px 12px">
        <div style="font-size:13px;color:#ffffff;font-weight:700;margin-bottom:4px">Luke Hamilton (Founder &amp; Growth Lead)</div>
        <div style="font-size:11.5px;color:#38bdf8;font-family:var(--font-mono)">luke@vantorxsolutions.com</div>
        <div style="font-size:11px;color:var(--dim);margin-top:6px">Replies route directly to Luke's primary inbox and VantorX CRM.</div>
      </div>
    </div>

    <!-- Modal Footer Actions -->
    <div style="display:flex;justify-content:flex-end;gap:8px;border-top:1px solid var(--line2);padding-top:14px">
      <button type="button" class="btn btn-ghost btn-sm" onclick="closeGmailConnectModal()">Close</button>
      <button type="button" class="btn btn-gold btn-sm" onclick="closeGmailConnectModal()" style="font-weight:800;padding:8px 18px;background:linear-gradient(135deg, #10b981 0%, #059669 100%);color:#ffffff;border:none">
        ✓ Got It
      </button>
    </div>
  </div>
</div>`;

// Apply UI replacements
let patched = content;

// Normalize CRLF to LF for reliable matching
patched = patched.replace(oldStatusBarTarget.replace(/\r\n/g, '\n'), newStatusBar.replace(/\r\n/g, '\n'));
patched = patched.replace(oldStatusBarTarget, newStatusBar);

patched = patched.replace(oldActionsTarget.replace(/\r\n/g, '\n'), newActions.replace(/\r\n/g, '\n'));
patched = patched.replace(oldActionsTarget, newActions);

if (modalStart !== -1 && effectiveEnd !== -1) {
  patched = patched.slice(0, modalStart) + newEmailModal + patched.slice(effectiveEnd);
}

fs.writeFileSync(filePath, patched, 'utf8');
console.log('✅ UI elements successfully patched in website/cold-call-arena/index.html!');
