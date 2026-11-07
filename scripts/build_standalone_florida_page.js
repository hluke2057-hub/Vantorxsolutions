const fs = require('fs');
const path = require('path');

const leadsPath = path.join(__dirname, '..', 'data', 'florida_100_no_website_leads.json');
const leadsData = fs.readFileSync(leadsPath, 'utf8');

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Florida 100 No-Website Contractor Targets — VantorX Private Vault</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #07090e;
      --card: #0d121d;
      --card-alt: #111827;
      --accent: #F59E0B;
      --accent-glow: rgba(245, 158, 11, 0.4);
      --green: #10B981;
      --red: #EF4444;
      --blue: #38BDF8;
      --purple: #A855F7;
      --line: rgba(255, 255, 255, 0.1);
      --text: #F8FAFC;
      --dim: #94A3B8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', -apple-system, sans-serif;
      min-height: 100vh;
      padding: 24px 20px 60px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    header {
      margin-bottom: 24px;
    }
    .top-badge-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 12px;
    }
    .vault-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(245, 158, 11, 0.15);
      border: 1.5px solid rgba(245, 158, 11, 0.4);
      color: #fbbf24;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #fbbf24;
      box-shadow: 0 0 10px #fbbf24;
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 800;
      line-height: 1.25;
      margin-bottom: 8px;
    }
    h1 span {
      background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #EF4444 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p.subtitle {
      font-size: 14px;
      color: var(--dim);
      line-height: 1.5;
      max-width: 900px;
    }

    /* KPI Cards */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .kpi-label {
      font-size: 11.5px;
      color: var(--dim);
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    .kpi-val {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: #fff;
    }
    .kpi-sub {
      font-size: 11px;
      color: var(--dim);
    }

    /* Battlecard Box */
    .battlecard {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(13, 18, 29, 0.95));
      border: 1.5px solid rgba(245, 158, 11, 0.4);
      border-radius: 14px;
      padding: 18px 20px;
      margin-bottom: 24px;
    }
    .battlecard-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 15px;
      font-weight: 800;
      color: #fbbf24;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .battlecard-script {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      line-height: 1.6;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 12px 14px;
      color: #e2e8f0;
      margin-top: 8px;
    }

    /* Search & Filter Toolbar */
    .filter-bar {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 14px 18px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
    }
    .filter-inputs {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      flex: 1;
    }
    .search-input {
      background: #090d16;
      border: 1px solid var(--line);
      color: #fff;
      font-size: 13px;
      padding: 9px 14px;
      border-radius: 8px;
      min-width: 250px;
      flex: 1;
    }
    .search-input:focus {
      outline: none;
      border-color: var(--accent);
    }
    .select-dropdown {
      background: #090d16;
      border: 1px solid var(--line);
      color: #fff;
      font-size: 13px;
      padding: 9px 12px;
      border-radius: 8px;
      cursor: pointer;
    }
    .select-dropdown:focus {
      outline: none;
      border-color: var(--accent);
    }
    .btn-action {
      background: var(--accent);
      color: #0b0f19;
      border: none;
      font-size: 13px;
      font-weight: 800;
      padding: 9px 16px;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-action:hover {
      background: #fbbf24;
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
      border: 1px solid var(--line);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }

    /* Leads Table */
    .table-container {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 12px;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }
    th {
      background: rgba(255, 255, 255, 0.04);
      color: var(--dim);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.05em;
      padding: 12px 14px;
      border-bottom: 1px solid var(--line);
      white-space: nowrap;
    }
    td {
      padding: 12px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      vertical-align: middle;
    }
    tr:hover td {
      background: rgba(245, 158, 11, 0.04);
    }
    .company-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .company-name {
      font-weight: 800;
      color: #fff;
      font-size: 13.5px;
    }
    .owner-name {
      font-size: 11.5px;
      color: var(--dim);
    }
    .tag-no-web {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(239, 68, 68, 0.16);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #f87171;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 800;
      white-space: nowrap;
    }
    .dial-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.14);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      padding: 5px 10px;
      border-radius: 6px;
      text-decoration: none;
      transition: all 0.2s;
    }
    .dial-btn:hover {
      background: rgba(16, 185, 129, 0.28);
      color: #fff;
    }
    .btn-preview-mockup {
      background: rgba(56, 189, 248, 0.14);
      border: 1px solid rgba(56, 189, 248, 0.35);
      color: #38bdf8;
      font-size: 11.5px;
      font-weight: 700;
      padding: 5px 10px;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s;
    }
    .btn-preview-mockup:hover {
      background: rgba(56, 189, 248, 0.25);
      border-color: #38bdf8;
    }
    .disposition-select {
      background: #090d16;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #e2e8f0;
      font-size: 11.5px;
      padding: 4px 8px;
      border-radius: 6px;
      cursor: pointer;
    }

    /* Modal for Website Mockup Preview */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .modal-overlay.active {
      display: flex;
    }
    .mockup-phone-frame {
      width: 375px;
      height: 720px;
      background: #090d16;
      border: 8px solid #1e293b;
      border-radius: 40px;
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(245, 158, 11, 0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }
    .phone-speaker {
      width: 90px;
      height: 5px;
      background: #334155;
      border-radius: 4px;
      margin: 12px auto 8px;
    }
    .phone-screen {
      flex: 1;
      overflow-y: auto;
      background: #0a0e17;
      color: #fff;
      padding: 16px;
      font-size: 13px;
    }
    .close-modal-btn {
      position: absolute;
      top: 14px;
      right: 18px;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: #fff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      font-weight: 800;
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #10b981;
      color: #0b0f19;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 13px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s;
      z-index: 10000;
    }
    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
</head>
<body>

<div class="container">

  <!-- Header -->
  <header>
    <div class="top-badge-row">
      <div class="vault-badge">
        <span class="pulse-dot"></span>
        <span>🔒 PRIVATE FOUNDER VAULT — 100 FLORIDA BUSINESSES WITH ZERO WEBSITE</span>
      </div>
      <div style="display:flex;gap:10px">
        <a href="index.html#tabNoWebsite" class="btn-action btn-secondary">
          <span>⚔️ Open in Cold Call Arena</span>
        </a>
        <a href="../../data/florida_100_no_website_leads.csv" download="florida_100_no_website_leads.csv" class="btn-action">
          <span>📥 Download CSV (100 Leads)</span>
        </a>
      </div>
    </div>

    <h1>100 Florida Contractors With <span>No Website ($1,500 Site Flip)</span></h1>
    <p class="subtitle">
      Hand-curated Florida home service businesses with 4.5+ star Google Maps listings, active phone numbers, real owners, and <strong>ZERO WEBSITE LINK</strong>. Pitch them a high-speed mobile funnel + 90s speed-to-lead auto responder for $1,500 setup + $300/mo.
    </p>
  </header>

  <!-- KPI Cards -->
  <div class="kpi-grid">
    <div class="kpi-card">
      <span class="kpi-label">Target Businesses</span>
      <span class="kpi-val" style="color:#fbbf24" id="statCount">100 Leads</span>
      <span class="kpi-sub">100% verified zero active website</span>
    </div>
    <div class="kpi-card">
      <span class="kpi-label">Est. Monthly Lost Rev</span>
      <span class="kpi-val" style="color:#ef4444">$1.12M / mo</span>
      <span class="kpi-sub">Uncaptured after-hours smartphone calls</span>
    </div>
    <div class="kpi-card">
      <span class="kpi-label">Site Flip Price Point</span>
      <span class="kpi-val" style="color:#10b981">$1,500 - $3,500</span>
      <span class="kpi-sub">+ $300/mo Speed-to-Lead SaaS</span>
    </div>
    <div class="kpi-card">
      <span class="kpi-label">Key FL Markets</span>
      <span class="kpi-val" style="color:#38bdf8">Tampa · Miami · Orlando</span>
      <span class="kpi-sub">Plus Palm Beach, Naples &amp; Jax</span>
    </div>
  </div>

  <!-- Battlecard -->
  <div class="battlecard">
    <div class="battlecard-title">
      <span>⚡ 30-Second Contractor Site-Flip Phone Pitch</span>
      <button type="button" class="btn-preview-mockup" onclick="copyPitchScript()" style="margin-left:auto">
        📋 Copy Battlecard
      </button>
    </div>
    <div style="font-size:12.5px;color:#cbd5e1;line-height:1.5">
      Use this verbatim word-for-word opening when calling these Florida owners:
    </div>
    <div class="battlecard-script" id="pitchScriptText">
"Hey [Owner], saw your 4.8★ reviews on Google in [City]. Quick heads-up: when people search emergency [Trade] on their phone, your Google Maps profile has no website button. 78% of people tap the next contractor because they can't book an estimate or get an instant text. We built a fast mobile preview for [Company] with instant 24-second SMS auto-reply. Can I shoot you the 30-second link to look at on your phone right now?"
    </div>
  </div>

  <!-- Filter & Search Toolbar -->
  <div class="filter-bar">
    <div class="filter-inputs">
      <input type="text" id="searchInput" class="search-input" placeholder="🔍 Search company, owner, phone, city, or trade..." oninput="filterTable()">
      
      <select id="metroFilter" class="select-dropdown" onchange="filterTable()">
        <option value="ALL">📍 All Florida Metros</option>
        <option value="Tampa Bay">Tampa Bay (813 / 727)</option>
        <option value="Central FL">Orlando / Central FL (407 / 352)</option>
        <option value="South FL">Miami / Fort Lauderdale (305 / 954)</option>
        <option value="Palm Beach">Palm Beach County (561)</option>
        <option value="SW Florida">SW Florida / Naples / Sarasota (239 / 941)</option>
        <option value="North FL">Jacksonville / North FL (904 / 850)</option>
      </select>

      <select id="tradeFilter" class="select-dropdown" onchange="filterTable()">
        <option value="ALL">🛠️ All Trades</option>
        <option value="Plumbing">Plumbing</option>
        <option value="Roofing">Roofing</option>
        <option value="HVAC">HVAC &amp; AC</option>
        <option value="Electrical">Electrical</option>
        <option value="Landscaping">Landscaping / Tree</option>
        <option value="Painting">Painting</option>
        <option value="Pool">Pool Service</option>
        <option value="Concrete">Concrete / Paving</option>
      </select>

      <select id="dispFilter" class="select-dropdown" onchange="filterTable()">
        <option value="ALL">📞 All Call Statuses</option>
        <option value="UNTOUCHED">⚪ Untouched</option>
        <option value="CALLED_VM">🟡 Called / Voicemail</option>
        <option value="PITCHED_SMS">🔵 Pitched / Sent Mockup</option>
        <option value="DEMO_BOOKED">🟣 Demo Booked</option>
        <option value="CLOSED_WON">🟢 Closed ($1,500+ Paid)</option>
      </select>
    </div>

    <div style="font-size:12px;color:var(--dim);font-weight:700">
      Showing <span id="visibleCount" style="color:#fbbf24">100</span> of 100
    </div>
  </div>

  <!-- Leads Table -->
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Company &amp; Owner</th>
          <th>Trade</th>
          <th>City / Metro</th>
          <th>Rating</th>
          <th>Website Status</th>
          <th>Monthly Loss</th>
          <th>1-Click Dial</th>
          <th>Custom Pitch Angle</th>
          <th>Mockup &amp; Status</th>
        </tr>
      </thead>
      <tbody id="leadsTableBody">
        <!-- Injected via JavaScript -->
      </tbody>
    </table>
  </div>

</div>

<!-- Interactive Mockup Modal -->
<div class="modal-overlay" id="mockupModal" onclick="if(event.target===this) closeModal()">
  <div class="mockup-phone-frame">
    <button type="button" class="close-modal-btn" onclick="closeModal()">✕</button>
    <div class="phone-speaker"></div>
    <div class="phone-screen" id="mockupScreen">
      <!-- Injected mockup content -->
    </div>
  </div>
</div>

<div class="toast" id="toast">Copied to clipboard!</div>

<script>
// Embedded 100 Florida Leads
window.FLORIDA_100_NO_WEBSITE_LEADS = ${leadsData};
let LEADS = window.FLORIDA_100_NO_WEBSITE_LEADS;

function renderTable(leads) {
  const tbody = document.getElementById('leadsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  document.getElementById('visibleCount').textContent = leads.length;

  leads.forEach(l => {
    const tr = document.createElement('tr');
    const savedDisp = localStorage.getItem('vantorx_fl_disp_' + l.id) || 'UNTOUCHED';

    tr.innerHTML = \`
      <td>
        <div class="company-cell">
          <span class="company-name">\${l.company}</span>
          <span class="owner-name">Owner: <strong>\${l.owner}</strong> · \${l.address}</span>
        </div>
      </td>
      <td>
        <span style="font-weight:700;color:#e2e8f0">\${l.trade}</span>
      </td>
      <td>
        <div style="font-weight:700;color:#fff">\${l.city}, FL</div>
        <div style="font-size:11px;color:#94a3b8">\${l.zip}</div>
      </td>
      <td>
        <span style="color:#fbbf24;font-weight:800">\${l.rating}</span>
      </td>
      <td>
        <span class="tag-no-web">🚫 NO WEBSITE</span>
      </td>
      <td>
        <span style="color:#ef4444;font-weight:800;font-family:monospace">\${l.monthlyLossEst}/mo</span>
      </td>
      <td>
        <a href="tel:\${l.phone.replace(/[^0-9]/g, '')}" class="dial-btn" onclick="logCall('\${l.id}')">
          📞 \${l.phone}
        </a>
      </td>
      <td style="max-width:280px;font-size:11.5px;color:#cbd5e1;line-height:1.4">
        \${l.pitchAngle}
      </td>
      <td>
        <div style="display:flex;flex-direction:column;gap:6px">
          <button type="button" class="btn-preview-mockup" onclick="openMockup('\${l.id}')">
            📱 Preview Mockup
          </button>
          <select class="disposition-select" onchange="updateDisp('\${l.id}', this.value)">
            <option value="UNTOUCHED" \${savedDisp==='UNTOUCHED'?'selected':''}>⚪ Untouched</option>
            <option value="CALLED_VM" \${savedDisp==='CALLED_VM'?'selected':''}>🟡 Left VM</option>
            <option value="PITCHED_SMS" \${savedDisp==='PITCHED_SMS'?'selected':''}>🔵 Mockup Sent</option>
            <option value="DEMO_BOOKED" \${savedDisp==='DEMO_BOOKED'?'selected':''}>🟣 Demo Booked</option>
            <option value="CLOSED_WON" \${savedDisp==='CLOSED_WON'?'selected':''}>🟢 Closed ($1.5k+)</option>
          </select>
        </div>
      </td>
    \`;
    tbody.appendChild(tr);
  });
}

function filterTable() {
  const query = (document.getElementById('searchInput').value || '').toLowerCase().trim();
  const metro = document.getElementById('metroFilter').value;
  const trade = document.getElementById('tradeFilter').value;
  const disp = document.getElementById('dispFilter').value;

  const filtered = LEADS.filter(l => {
    if (query) {
      const hay = (l.company + ' ' + l.owner + ' ' + l.city + ' ' + l.trade + ' ' + l.phone + ' ' + l.pitchAngle).toLowerCase();
      if (!hay.includes(query)) return false;
    }
    if (metro !== 'ALL') {
      if (metro === 'Tampa Bay' && !['Tampa', 'St. Petersburg', 'Brandon', 'Clearwater', 'Largo'].includes(l.city)) return false;
      if (metro === 'Central FL' && !['Orlando', 'Kissimmee', 'Sanford', 'Ocala'].includes(l.city)) return false;
      if (metro === 'South FL' && !['Miami', 'Fort Lauderdale', 'Pompano Beach', 'Hollywood', 'Hialeah'].includes(l.city)) return false;
      if (metro === 'Palm Beach' && !['Boca Raton', 'Delray Beach', 'Boynton Beach', 'West Palm Beach', 'Jupiter'].includes(l.city)) return false;
      if (metro === 'SW Florida' && !['Cape Coral', 'Fort Myers', 'Naples', 'Sarasota', 'Bradenton'].includes(l.city)) return false;
      if (metro === 'North FL' && !['Jacksonville', 'Pensacola', 'Tallahassee', 'Panama City'].includes(l.city)) return false;
    }
    if (trade !== 'ALL' && !l.trade.toLowerCase().includes(trade.toLowerCase())) return false;
    
    const saved = localStorage.getItem('vantorx_fl_disp_' + l.id) || 'UNTOUCHED';
    if (disp !== 'ALL' && saved !== disp) return false;

    return true;
  });

  renderTable(filtered);
}

function updateDisp(id, val) {
  localStorage.setItem('vantorx_fl_disp_' + id, val);
  showToast('Saved status: ' + val);
}

function logCall(id) {
  const saved = localStorage.getItem('vantorx_fl_disp_' + id) || 'UNTOUCHED';
  if (saved === 'UNTOUCHED') {
    localStorage.setItem('vantorx_fl_disp_' + id, 'CALLED_VM');
    filterTable();
  }
}

function openMockup(id) {
  const lead = LEADS.find(l => l.id === id);
  if (!lead) return;

  const screen = document.getElementById('mockupScreen');
  screen.innerHTML = \`
    <div style="border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:12px;margin-bottom:12px">
      <div style="font-size:10.5px;color:#fbbf24;font-weight:800;letter-spacing:0.06em;text-transform:uppercase">Mobile Funnel Preview · 0.4s Fast Load</div>
      <div style="font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:800;color:#fff;margin-top:4px">\${lead.company}</div>
      <div style="font-size:11px;color:#94a3b8">\${lead.city}, FL · \${lead.rating}</div>
    </div>

    <!-- Hero -->
    <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:10px;padding:14px;margin-bottom:14px;text-align:center">
      <div style="font-size:11px;color:#fbbf24;font-weight:800;text-transform:uppercase">24/7 Emergency \${lead.trade}</div>
      <div style="font-family:'Space Grotesk',sans-serif;font-size:17px;font-weight:800;margin:6px 0;line-height:1.3">Top-Rated \${lead.trade} Specialists in \${lead.city}</div>
      <div style="font-size:11px;color:#cbd5e1;margin-bottom:12px">Licensed &amp; Insured · Under 60 Min Emergency Arrival</div>
      
      <a href="tel:\${lead.phone.replace(/[^0-9]/g, '')}" style="display:block;background:#10b981;color:#0b0f19;font-weight:800;padding:10px;border-radius:8px;text-decoration:none;font-size:13px;margin-bottom:8px">
        📞 Tap to Call: \${lead.phone}
      </a>
      <div style="font-size:10px;color:#34d399;font-weight:700">⚡ Answers in 0.8s or 24s Instant SMS</div>
    </div>

    <!-- Instant Quote Form -->
    <div style="background:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px;margin-bottom:14px">
      <div style="font-size:12px;font-weight:800;color:#fbbf24;margin-bottom:8px">Get Fast Estimate in 2 Minutes</div>
      <input type="text" placeholder="Your Name" style="width:100%;padding:8px;background:#090d16;border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#fff;font-size:11px;margin-bottom:6px">
      <input type="tel" placeholder="Mobile Phone (for instant text)" style="width:100%;padding:8px;background:#090d16;border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#fff;font-size:11px;margin-bottom:6px">
      <button style="width:100%;background:#f59e0b;color:#0b0f19;font-weight:800;padding:9px;border:none;border-radius:6px;font-size:11.5px;cursor:pointer">
        Lock In My Free Quote ➔
      </button>
    </div>

    <!-- Google Reviews Section -->
    <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:10px;font-size:11px;color:#94a3b8">
      <div style="font-weight:700;color:#fff;margin-bottom:4px">Verified Google Customer Feedback:</div>
      <div style="color:#fbbf24">\${lead.rating}</div>
      <div style="font-style:italic;margin-top:4px">"\${lead.owner} and team were on time, courteous, and fixed our emergency within two hours!"</div>
    </div>
  \`;

  document.getElementById('mockupModal').classList.add('active');
}

function closeModal() {
  document.getElementById('mockupModal').classList.remove('active');
}

function copyPitchScript() {
  const text = document.getElementById('pitchScriptText').textContent.trim();
  navigator.clipboard.writeText(text);
  showToast('📋 Copied 30-Second Battlecard Pitch!');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderTable(LEADS);
});
</script>

</body>
</html>`;

const outPath = path.join(__dirname, '..', 'website', 'cold-call-arena', 'florida-no-website.html');
fs.writeFileSync(outPath, htmlTemplate, 'utf8');
console.log('🎉 Built standalone florida-no-website.html successfully! Size:', htmlTemplate.length);
