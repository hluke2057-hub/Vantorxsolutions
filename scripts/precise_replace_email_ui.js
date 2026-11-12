// scripts/precise_replace_email_ui.js
const fs = require('fs');
const path = require('path');

const file = path.resolve('website/cold-call-arena/index.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Locate gmailStatusBar
const barIdx = content.indexOf('id="gmailStatusBar"');
if (barIdx === -1) {
  console.log('gmailStatusBar not found');
} else {
  const startDiv = content.lastIndexOf('<div', barIdx);
  const endDiv = content.indexOf('<!-- Recipient Input Row -->', barIdx);
  console.log('Found status bar region:', startDiv, 'to', endDiv);

  const replacement = `<!-- VantorX Official Business Email Dispatch Status Bar -->
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
      </div>\r\n\r\n      `;

  content = content.slice(0, startDiv) + replacement + content.slice(endDiv);
}

// 2. Locate btnAutoSendEmail region
const btnIdx = content.indexOf('id="btnAutoSendEmail"');
if (btnIdx === -1) {
  console.log('btnAutoSendEmail not found');
} else {
  const rowStart = content.lastIndexOf('<!-- Action Buttons Row -->', btnIdx);
  const rowEnd = content.indexOf('<!-- Actions -->', btnIdx);
  console.log('Found actions row region:', rowStart, 'to', rowEnd);

  const replacementRow = `<!-- Action Buttons Row -->
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
      </div>\r\n    </div>\r\n\r\n    `;

  content = content.slice(0, rowStart) + replacementRow + content.slice(rowEnd);
}

fs.writeFileSync(file, content, 'utf8');
console.log('✓ Successfully wrote precise replacements!');
