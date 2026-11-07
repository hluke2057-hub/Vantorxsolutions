const fs = require('fs');
const path = require('path');

// ==============================================================
// 1. UPDATE website/cold-call-arena/index.html
// ==============================================================
const arenaPath = path.join(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
let rawArena = fs.readFileSync(arenaPath, 'utf8');
const arenaCRLF = rawArena.includes('\r\n');
let arena = rawArena.replace(/\r\n/g, '\n');

// A. CSS for fl-access-gate
const gateCss = `
  /* 🔒 Private Access Code Gate */
  .fl-access-gate {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    min-height: 480px;
  }
  .fl-gate-card {
    max-width: 440px;
    width: 100%;
    background: radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.15) 0%, rgba(13, 18, 29, 0.98) 75%);
    border: 1.5px solid rgba(245, 158, 11, 0.45);
    border-radius: 20px;
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(245, 158, 11, 0.18);
    padding: 36px 28px;
    text-align: center;
  }
  .fl-gate-icon {
    width: 68px;
    height: 68px;
    margin: 0 auto 16px;
    border-radius: 20px;
    background: rgba(245, 158, 11, 0.12);
    border: 1.5px solid rgba(245, 158, 11, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
  }
  .fl-gate-badge {
    display: inline-block;
    background: rgba(245, 158, 11, 0.15);
    border: 1px solid rgba(245, 158, 11, 0.35);
    color: #fbbf24;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 999px;
    margin-bottom: 12px;
  }
  .fl-gate-card h2 {
    font-family: var(--font-head);
    font-size: 24px;
    color: #fff;
    margin-bottom: 8px;
  }
  .fl-gate-subtitle {
    font-size: 13px;
    color: #94a3b8;
    line-height: 1.5;
    margin-bottom: 22px;
  }
  .fl-gate-input-wrap {
    margin-bottom: 18px;
  }
  .fl-gate-input {
    width: 100%;
    background: #07090e;
    border: 1.5px solid rgba(245, 158, 11, 0.35);
    color: #fbbf24;
    font-family: var(--font-mono);
    font-size: 18px;
    letter-spacing: 0.15em;
    text-align: center;
    padding: 12px 16px;
    border-radius: 10px;
    outline: none;
    transition: all 0.2s;
  }
  .fl-gate-input:focus {
    border-color: #fbbf24;
    box-shadow: 0 0 16px rgba(245, 158, 11, 0.3);
  }
  .fl-gate-error {
    color: #ef4444;
    font-size: 12px;
    font-weight: 700;
    margin-top: 8px;
  }
  @keyframes errorShake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-8px); }
    40%, 80% { transform: translateX(8px); }
  }
  .error-shake {
    animation: errorShake 0.4s ease;
    border-color: #ef4444 !important;
  }
</style>`;

arena = arena.replace('</style>', gateCss);

// B. Wrap tabNoWebsite content in flAccessCodeGate and flVaultContent
const oldTabStart = `<div id="tabNoWebsite" class="tab-panel">
    
    <!-- 🔒 PRIVATE SECURITY & EXCLUSIVITY HEADER -->`;

const newTabStart = `<div id="tabNoWebsite" class="tab-panel">
    
    <!-- 🔒 ACCESS CODE LOCK SCREEN (Code: noodle) -->
    <div id="flAccessCodeGate" class="fl-access-gate" style="display:none">
      <div class="fl-gate-card">
        <div class="fl-gate-icon">🔒</div>
        <div class="fl-gate-badge">PRIVATE FOUNDER VAULT</div>
        <h2>Access Code Required</h2>
        <p class="fl-gate-subtitle">This private workbench contains 100 Florida contractor targets with zero website presence and the $1,500 site-flip battlecard. Enter the access code to unlock.</p>
        
        <div class="fl-gate-input-wrap">
          <input type="password" id="flAccessCodeInput" placeholder="Enter Access Code" class="fl-gate-input" autocomplete="off" onkeydown="if(event.key==='Enter') unlockFloridaVault();">
          <div id="flAccessCodeError" class="fl-gate-error" style="display:none">❌ Incorrect access code. Access denied.</div>
        </div>

        <button type="button" class="btn btn-gold" id="btnUnlockFloridaVault" onclick="unlockFloridaVault()" style="width:100%;padding:13px;font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:8px">
          <span>🔑</span> <span>Unlock Vault ➔</span>
        </button>
      </div>
    </div>

    <div id="flVaultContent">
    <!-- 🔒 PRIVATE SECURITY & EXCLUSIVITY HEADER -->`;

arena = arena.replace(oldTabStart, newTabStart);

// Add Lock Vault button to header row
const oldHeaderButtons = `<button type="button" class="btn btn-ghost btn-sm" onclick="resetFloridaFilters()" style="border:1px solid rgba(255,255,255,0.2);color:#cbd5e1">
            <span>🔄</span> <span>Reset Filters</span>
          </button>`;

const newHeaderButtons = `<button type="button" class="btn btn-ghost btn-sm" onclick="resetFloridaFilters()" style="border:1px solid rgba(255,255,255,0.2);color:#cbd5e1">
            <span>🔄</span> <span>Reset Filters</span>
          </button>
          <button type="button" class="btn btn-ghost btn-sm" onclick="lockFloridaVault()" style="border:1px solid rgba(239,68,68,0.4);color:#f87171" title="Lock the Florida Vault">
            <span>🔒</span> <span>Lock Vault</span>
          </button>`;

arena = arena.replace(oldHeaderButtons, newHeaderButtons);

// Close flVaultContent at end of tabNoWebsite
const oldTabEnd = `            <!-- Dynamically populated by renderFloridaLeadsTable() -->
          </tbody>
        </table>
      </div>
    </div>

  </div>`;

const newTabEnd = `            <!-- Dynamically populated by renderFloridaLeadsTable() -->
          </tbody>
        </table>
      </div>
    </div>
    </div><!-- END flVaultContent -->

  </div>`;

arena = arena.replace(oldTabEnd, newTabEnd);

// C. Add JavaScript functions for access code verification
const jsGateCode = `
// ============================================================
// 🔒 ACCESS CODE GATE ENGINE FOR FLORIDA NO-WEBSITE TAB (Code: noodle)
// ============================================================
window.ACCESS_CODE_FLORIDA = 'noodle';

window.unlockFloridaVault = function() {
  const input = document.getElementById('flAccessCodeInput');
  const err = document.getElementById('flAccessCodeError');
  const code = (input ? input.value : '').trim().toLowerCase();

  if (code === window.ACCESS_CODE_FLORIDA) {
    localStorage.setItem('vantorx_fl_vault_unlocked', 'true');
    const gate = document.getElementById('flAccessCodeGate');
    const content = document.getElementById('flVaultContent');
    if (gate) gate.style.display = 'none';
    if (content) content.style.display = 'block';
    if (err) err.style.display = 'none';
    if (typeof window.renderFloridaLeadsTable === 'function') {
      window.renderFloridaLeadsTable();
    }
    showToast('🔓 Vault Unlocked! Welcome to the 100 Florida Targets.');
  } else {
    if (err) {
      err.style.display = 'block';
      err.textContent = '❌ Incorrect access code. Access denied.';
    }
    if (input) {
      input.classList.add('error-shake');
      setTimeout(() => input.classList.remove('error-shake'), 450);
      input.select();
    }
  }
};

window.lockFloridaVault = function() {
  localStorage.removeItem('vantorx_fl_vault_unlocked');
  window.checkFloridaVaultAccess();
  showToast('🔒 Vault Locked. Access code required.');
};

window.checkFloridaVaultAccess = function() {
  const isUnlocked = localStorage.getItem('vantorx_fl_vault_unlocked') === 'true';
  const gate = document.getElementById('flAccessCodeGate');
  const content = document.getElementById('flVaultContent');

  if (isUnlocked) {
    if (gate) gate.style.display = 'none';
    if (content) content.style.display = 'block';
    if (typeof window.renderFloridaLeadsTable === 'function') {
      window.renderFloridaLeadsTable();
    }
  } else {
    if (gate) gate.style.display = 'flex';
    if (content) content.style.display = 'none';
    setTimeout(() => {
      const input = document.getElementById('flAccessCodeInput');
      if (input) {
        input.value = '';
        input.focus();
      }
    }, 120);
  }
};
`;

// Update switchTab to check vault access
arena = arena.replace(
  `if (targetTabId === 'tabNoWebsite' && typeof window.renderFloridaLeadsTable === 'function') {
      window.renderFloridaLeadsTable();
    }`,
  `if (targetTabId === 'tabNoWebsite') {
      if (typeof window.checkFloridaVaultAccess === 'function') {
        window.checkFloridaVaultAccess();
      } else if (typeof window.renderFloridaLeadsTable === 'function') {
        window.renderFloridaLeadsTable();
      }
    }`
);

// Inject jsGateCode right before window.renderFloridaLeadsTable
arena = arena.replace('window.renderFloridaLeadsTable = function() {', jsGateCode + '\nwindow.renderFloridaLeadsTable = function() {');

if (arenaCRLF) arena = arena.replace(/\n/g, '\r\n');
fs.writeFileSync(arenaPath, arena, 'utf8');
console.log('✅ Applied access code protection to cold-call-arena/index.html');

// ==============================================================
// 2. UPDATE website/cold-call-arena/florida-no-website.html
// ==============================================================
const standalonePath = path.join(__dirname, '..', 'website', 'cold-call-arena', 'florida-no-website.html');
let rawStand = fs.readFileSync(standalonePath, 'utf8');
const standCRLF = rawStand.includes('\r\n');
let stand = rawStand.replace(/\r\n/g, '\n');

// Add CSS to standalone
stand = stand.replace('</style>', gateCss);

// Wrap body content in gate + flVaultContent
const standOldBodyStart = `<body>

<div class="container">`;

const standNewBodyStart = `<body>

<div class="container">

  <!-- 🔒 ACCESS CODE LOCK SCREEN (Code: noodle) -->
  <div id="flAccessCodeGate" class="fl-access-gate" style="display:none">
    <div class="fl-gate-card">
      <div class="fl-gate-icon">🔒</div>
      <div class="fl-gate-badge">PRIVATE FOUNDER VAULT</div>
      <h2>Access Code Required</h2>
      <p class="fl-gate-subtitle">This private workbench contains 100 Florida contractor targets with zero website presence and the $1,500 site-flip battlecard. Enter the access code to unlock.</p>
      
      <div class="fl-gate-input-wrap">
        <input type="password" id="flAccessCodeInput" placeholder="Enter Access Code" class="fl-gate-input" autocomplete="off" onkeydown="if(event.key==='Enter') unlockFloridaVault();">
        <div id="flAccessCodeError" class="fl-gate-error" style="display:none">❌ Incorrect access code. Access denied.</div>
      </div>

      <button type="button" class="btn-action" id="btnUnlockFloridaVault" onclick="unlockFloridaVault()" style="width:100%;justify-content:center;padding:13px;font-size:14px;border-radius:10px">
        <span>🔑</span> <span>Unlock Vault ➔</span>
      </button>
    </div>
  </div>

  <div id="flVaultContent">`;

stand = stand.replace(standOldBodyStart, standNewBodyStart);

// Add Lock Vault button to header
const standOldHeaderButtons = `<a href="../../data/florida_100_no_website_leads.csv" download="florida_100_no_website_leads.csv" class="btn-action">
          <span>📥 Download CSV (100 Leads)</span>
        </a>`;

const standNewHeaderButtons = `<a href="../../data/florida_100_no_website_leads.csv" download="florida_100_no_website_leads.csv" class="btn-action">
          <span>📥 Download CSV (100 Leads)</span>
        </a>
        <button type="button" class="btn-action btn-secondary" onclick="lockFloridaVault()" style="border-color:rgba(239,68,68,0.4);color:#f87171">
          <span>🔒 Lock Vault</span>
        </button>`;

stand = stand.replace(standOldHeaderButtons, standNewHeaderButtons);

// Close flVaultContent before </div><!-- Container -->
stand = stand.replace('</div>\n\n<!-- Interactive Mockup Modal -->', '</div><!-- END flVaultContent -->\n\n</div>\n\n<!-- Interactive Mockup Modal -->');

// Add JS for standalone
const standJsCode = `
// Access Code Gate
window.ACCESS_CODE_FLORIDA = 'noodle';

function unlockFloridaVault() {
  const input = document.getElementById('flAccessCodeInput');
  const err = document.getElementById('flAccessCodeError');
  const code = (input ? input.value : '').trim().toLowerCase();

  if (code === window.ACCESS_CODE_FLORIDA) {
    localStorage.setItem('vantorx_fl_vault_unlocked', 'true');
    checkVaultAccess();
    showToast('🔓 Vault Unlocked! Welcome to the 100 Florida Targets.');
  } else {
    if (err) {
      err.style.display = 'block';
      err.textContent = '❌ Incorrect access code. Access denied.';
    }
    if (input) {
      input.classList.add('error-shake');
      setTimeout(() => input.classList.remove('error-shake'), 450);
      input.select();
    }
  }
}

function lockFloridaVault() {
  localStorage.removeItem('vantorx_fl_vault_unlocked');
  checkVaultAccess();
  showToast('🔒 Vault Locked. Access code required.');
}

function checkVaultAccess() {
  const isUnlocked = localStorage.getItem('vantorx_fl_vault_unlocked') === 'true';
  const gate = document.getElementById('flAccessCodeGate');
  const content = document.getElementById('flVaultContent');

  if (isUnlocked) {
    if (gate) gate.style.display = 'none';
    if (content) content.style.display = 'block';
    renderTable(LEADS);
  } else {
    if (gate) gate.style.display = 'flex';
    if (content) content.style.display = 'none';
    setTimeout(() => {
      const input = document.getElementById('flAccessCodeInput');
      if (input) {
        input.value = '';
        input.focus();
      }
    }, 120);
  }
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  checkVaultAccess();
});
`;

stand = stand.replace(
  `// Initial render\ndocument.addEventListener('DOMContentLoaded', () => {\n  renderTable(LEADS);\n});`,
  standJsCode
);

if (standCRLF) stand = stand.replace(/\n/g, '\r\n');
fs.writeFileSync(standalonePath, stand, 'utf8');
console.log('✅ Applied access code protection to florida-no-website.html');
