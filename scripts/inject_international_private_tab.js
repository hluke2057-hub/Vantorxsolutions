// scripts/inject_international_private_tab.js
// Injects the 150 International Local Business Targets into the Private Tab in Cold Call Arena
// Mirrors the Cold Call Arena Main Tab exactly:
// - Quota HUD (0-100 dial pacing, chips)
// - View Switcher (To Call, Callbacks, Called History)
// - Batch/Country Selectors
// - Live World Clock & Time Zone Calling Matrix with US conversion (EST/CST/PST)
// - Interactive 150-Lead Table with live local clocks and "Call Now" status
// - 3-Phase International Teleprompter & Objections
// - CSV Export & Callback Scheduler

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const arenaHtmlPath = path.join(root, 'website', 'cold-call-arena', 'index.html');
const leadsJsonPath = path.join(root, 'data', 'international_150_leads.json');

const leadsData = JSON.parse(fs.readFileSync(leadsJsonPath, 'utf8'));
let html = fs.readFileSync(arenaHtmlPath, 'utf8');

console.log('Original Arena HTML length:', html.length);

// 1. UPDATE TAB BUTTON in .tabs
const oldTabBtnPattern = /<button class="tab-btn"[^>]*id="tabBtnNoWebsite"[^>]*>[\s\S]*?<\/button>/;
const newTabBtnHtml = `<button class="tab-btn" type="button" id="tabBtnNoWebsite" data-tab="tabNoWebsite" onclick="switchTab('tabNoWebsite')" style="border: 1.5px solid rgba(56,189,248,0.7); background: linear-gradient(135deg, rgba(56,189,248,0.22), rgba(16,185,129,0.18)); color: #7dd3fc; font-weight: 800; letter-spacing: 0.02em; box-shadow: 0 0 16px rgba(56,189,248,0.3);">🔒 Private: International Local Business Vault (150 Global Targets · UK, AU, CA, IE, NZ)</button>`;

if (oldTabBtnPattern.test(html)) {
  html = html.replace(oldTabBtnPattern, newTabBtnHtml);
  console.log('✅ Updated tabBtnNoWebsite to International Vault button');
} else {
  console.warn('⚠️ Could not match oldTabBtnPattern, checking if already updated...');
}

// 2. REBUILD #tabNoWebsite PANEL HTML
const tabPanelStart = '<div id="tabNoWebsite" class="tab-panel">';
const tabTeamCallsStart = '<div id="tabTeamCalls" class="tab-panel">';

const startIndex = html.indexOf(tabPanelStart);
const endIndex = html.indexOf(tabTeamCallsStart);

if (startIndex === -1 || endIndex === -1) {
  console.error('❌ Could not locate #tabNoWebsite or #tabTeamCalls boundaries in HTML!');
  process.exit(1);
}

const newPrivateTabPanelHtml = `
  <!-- TAB: 🔒 PRIVATE OWNER WORKBENCH: 150 INTERNATIONAL LOCAL BUSINESS TARGETS (UK, AU, CA, IE, NZ) -->
  <div id="tabNoWebsite" class="tab-panel">
    
    <!-- 🔒 ACCESS CODE LOCK SCREEN (Code: noodle) -->
    <div id="flAccessCodeGate" class="fl-access-gate" style="display:none">
      <div class="fl-gate-card">
        <div class="fl-gate-icon">🔒</div>
        <div class="fl-gate-badge">PRIVATE INTERNATIONAL VAULT · ENGLISH-SPEAKING MARKETS</div>
        <h2>Access Code Required</h2>
        <p class="fl-gate-subtitle">This confidential founder workbench contains 150 international local business targets across the UK, Australia, Canada, Ireland, and New Zealand with zero AI automation and massive web modernization upside. Enter access code to unlock.</p>
        
        <div class="fl-gate-input-wrap">
          <input type="password" id="flAccessCodeInput" placeholder="Enter Access Code" class="fl-gate-input" autocomplete="off" onkeydown="if(event.key==='Enter') unlockFloridaVault();">
          <div id="flAccessCodeError" class="fl-gate-error" style="display:none">❌ Incorrect access code. Access denied.</div>
        </div>

        <button type="button" class="btn btn-gold" id="btnUnlockFloridaVault" onclick="unlockFloridaVault()" style="width:100%;padding:13px;font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:8px">
          <span>🔑</span> <span>Unlock International Vault ➔</span>
        </button>
      </div>
    </div>

    <div id="flVaultContent">
    <div class="lead-cockpit" style="margin-bottom:24px">
      
      <!-- 🔒 PRIVATE FOUNDER HEADER STRIP -->
      <div style="background:linear-gradient(135deg,rgba(15,23,42,0.98),rgba(11,15,22,0.98));border:1.5px solid rgba(56,189,248,0.45);border-radius:20px;padding:20px 24px;margin-bottom:20px;box-shadow:0 12px 35px rgba(0,0,0,0.6)">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:12px">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="font-size:28px">🌍</span>
            <div>
              <div style="display:flex;align-items:center;gap:10px">
                <span style="font-family:var(--font-head);font-size:20px;font-weight:800;color:#ffffff;letter-spacing:0.02em">PRIVATE INTERNATIONAL VAULT: 150 TARGETS</span>
                <span style="font-size:11px;font-family:var(--font-mono);font-weight:800;background:rgba(56,189,248,0.2);border:1px solid #38bdf8;color:#7dd3fc;padding:2px 10px;border-radius:999px">UNSATURATED ENGLISH MARKETS</span>
              </div>
              <div style="font-size:13px;color:#94a3b8;margin-top:2px">
                Targeting high-ticket local service businesses across <strong>UK 🇬🇧, Australia 🇦🇺, Canada 🇨🇦, Ireland 🇮🇪, and New Zealand 🇳🇿</strong> with zero AI phone receptionists and high web modernization budgets.
              </div>
            </div>
          </div>
          
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <button type="button" class="btn btn-gold btn-sm" onclick="exportInternationalLeadsCsv()" style="font-weight:800;display:inline-flex;align-items:center;gap:6px">
              <span>📥</span> <span>Download 150 Leads (.CSV)</span>
            </button>
            <button type="button" class="btn btn-ghost btn-sm" onclick="resetIntlFilters()" style="border:1px solid rgba(255,255,255,0.2);color:#cbd5e1">
              <span>🔄</span> <span>Reset Filters</span>
            </button>
            <button type="button" class="btn btn-ghost btn-sm" onclick="lockFloridaVault()" style="border:1px solid rgba(239,68,68,0.4);color:#f87171" title="Lock the Vault">
              <span>🔒</span> <span>Lock Vault</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 📋 VIEW SWITCHER: QUEUE (TO CALL) VS CALLBACKS VS CALLED HISTORY (MATCHING MAIN TAB) -->
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px;background:linear-gradient(135deg,rgba(15,23,42,0.8),rgba(11,15,22,0.8));border:1px solid rgba(56,189,248,0.3);border-radius:16px;padding:14px 18px">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <button type="button" class="view-toggle-pill active" id="btnIntlViewToCall" onclick="switchIntlLeadView('toCall')" style="display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:12px;font-size:14px;font-weight:800;border:1px solid #38bdf8;background:linear-gradient(135deg,#38bdf8,#0284c7);color:#070a0f;cursor:pointer;transition:all 0.2s">
            <span>📋</span> Dial Queue: To Call (<span id="intlUncalledCountBadge">150</span>)
          </button>
          <button type="button" class="view-toggle-pill" id="btnIntlViewCallbacks" onclick="switchIntlLeadView('callbacks')" style="display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:12px;font-size:14px;font-weight:800;border:1px solid rgba(245,158,11,0.5);background:rgba(245,158,11,0.12);color:#fbbf24;cursor:pointer;transition:all 0.2s">
            <span>⏳</span> Callbacks &amp; Follow-Ups (<span id="intlCallbackCountBadge">0</span>)
          </button>
          <button type="button" class="view-toggle-pill" id="btnIntlViewCalledHistory" onclick="switchIntlLeadView('calledHistory')" style="display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:12px;font-size:14px;font-weight:800;border:1px solid var(--line);background:rgba(255,255,255,0.06);color:#cbd5e1;cursor:pointer;transition:all 0.2s">
            <span>✅</span> Previously Called History (<span id="intlCalledCountBadge">0</span>)
          </button>
        </div>

        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <button class="btn btn-gold btn-sm" id="exportIntlLeadsCsvBtn" onclick="exportInternationalLeadsCsv()">📥 Export CSV</button>
          <button class="btn btn-ghost btn-sm" id="resetIntlCallsBtn" onclick="resetIntlCalls()" style="border:1px solid rgba(248,113,113,0.3);color:#fca5a5" title="Clear checked calls on this browser">🔄 Reset My Calls</button>
        </div>
      </div>

      <!-- 🎯 DAILY BATCH & DIAL QUOTA (MATCHING MAIN TAB) -->
      <div class="daily-batch-banner" style="border-color:rgba(56,189,248,0.4)">
        <div class="batch-hud-grid">
          <div class="batch-title-area">
            <h3><span>🎯</span> <span id="intlBatchHeadingText">ACTIVE INTERNATIONAL DIAL QUEUE: 150 TARGETS (ZERO AI SATURATION)</span></h3>
            <div class="batch-subtitle">
              <span>Today</span> · 150 verified English-speaking international business targets · Instant AI phone receptionist &amp; $1,500 website-flip opportunities
            </div>
          </div>
          <div class="batch-controls">
            <div style="display:flex;align-items:center;gap:6px">
              <span style="font-size:12px;color:var(--dim);font-family:var(--font-mono)">BATCH:</span>
              <select id="intlBatchSelect" class="custom-select" style="font-weight:700" onchange="handleIntlBatchChange()">
                <option value="all" selected>🌍 All 150 International Targets (Global Vault)</option>
                <option value="open_now">⚡ Live Now: Open Local Business Hours Only</option>
                <option value="GB">🇬🇧 United Kingdom (London, Manchester, Leeds · 40 Targets)</option>
                <option value="AU">🇦🇺 Australia (Sydney, Melbourne, Brisbane, Perth · 40 Targets)</option>
                <option value="CA">🇨🇦 Canada (Toronto, Vancouver, Calgary, Edmonton · 35 Targets)</option>
                <option value="IE">🇮🇪 Ireland (Dublin, Cork, Galway, Limerick · 20 Targets)</option>
                <option value="NZ">🇳🇿 New Zealand (Auckland, Wellington, Christchurch · 15 Targets)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Quota Progress Bar -->
        <div class="quota-progress-card" style="border-color:rgba(56,189,248,0.3)">
          <div class="quota-meter-wrap">
            <div class="quota-meter-header">
              <span>🎯 DIAL QUOTA: <strong><span id="intlQuotaCount">0</span> / <span id="intlQuotaTotal">100</span> COMPLETED</strong></span>
              <span>PACING: <strong><span id="intlQuotaPct">0%</span></strong></span>
            </div>
            <div class="quota-bar-track">
              <div class="quota-bar-fill" id="intlQuotaBarFill" style="width:0%;background:linear-gradient(90deg,#38bdf8,#10b981)"></div>
            </div>
          </div>
          <div class="quota-stats-chips">
            <div class="quota-chip" id="intlChipUncalled" style="color:var(--dim)">⏳ 150 To Call</div>
            <div class="quota-chip" id="intlChipCalled" style="color:#6ee7b7">✓ 0 Called</div>
            <div class="quota-chip" id="intlChipDemos" style="color:#38bdf8">🎉 0 Closed / Demos</div>
          </div>
        </div>
      </div>

      <!-- 🌐 TIME ZONE MATRIX & LIVE WORLD CLOCKS (CORE USER FEATURE) -->
      <div id="intlTimeZoneMatrixCard" style="background:linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.95));border:1.5px solid rgba(56,189,248,0.4);border-radius:16px;padding:18px 22px;margin:18px 0;box-shadow:0 10px 30px rgba(0,0,0,0.5)">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:12px">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:24px">⏱️</span>
            <div>
              <div style="font-family:var(--font-head);font-size:16px;font-weight:800;color:#ffffff;display:flex;align-items:center;gap:8px">
                <span>GLOBAL CALLING TIME ZONE MATRIX</span>
                <span style="font-size:11px;font-family:var(--font-mono);font-weight:800;background:rgba(16,185,129,0.2);border:1px solid #10b981;color:#86efac;padding:2px 8px;border-radius:999px">LIVE 24-HR DIALING ENGINE</span>
              </div>
              <div style="font-size:12px;color:#94a3b8">Target country local times converted to US calling windows (EST / CST / PST). Never call outside local work hours.</div>
            </div>
          </div>
          
          <!-- Live US Reference Clocks -->
          <div style="background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.12);padding:6px 14px;border-radius:10px;display:inline-flex;align-items:center;gap:12px;font-family:var(--font-mono);font-size:12px">
            <span style="color:#fbbf24;font-weight:800">🇺🇸 US EST:</span> <span id="clockUsEst" style="color:#ffffff;font-weight:800">--:-- --</span>
            <span style="color:rgba(255,255,255,0.2)">|</span>
            <span style="color:#94a3b8">CST:</span> <span id="clockUsCst" style="color:#e2e8f0">--:-- --</span>
            <span style="color:rgba(255,255,255,0.2)">|</span>
            <span style="color:#94a3b8">PST:</span> <span id="clockUsPst" style="color:#e2e8f0">--:-- --</span>
          </div>
        </div>

        <!-- 5 Region Live Clocks & Converted US Windows -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px" id="intlTimeZoneClockGrid">
          
          <!-- 🇬🇧 UK -->
          <div class="tz-card" id="tzCardUk" style="background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px 14px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span style="font-weight:800;font-size:13.5px;color:#ffffff;display:inline-flex;align-items:center;gap:6px">
                <span>🇬🇧</span> <span>United Kingdom</span>
              </span>
              <span id="badgeTzUk" class="tz-status-badge" style="font-size:10.5px;font-weight:800;padding:2px 7px;border-radius:6px;font-family:var(--font-mono);background:rgba(245,158,11,0.2);color:#fbbf24;border:1px solid rgba(245,158,11,0.5)">🟡 AFTER HOURS</span>
            </div>
            <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:11px;color:#94a3b8">London (GMT):</span>
              <span id="clockUk" style="font-family:var(--font-mono);font-size:14px;font-weight:800;color:#7dd3fc">--:-- --</span>
            </div>
            <div style="font-size:11px;color:#cbd5e1;background:rgba(255,255,255,0.04);padding:5px 8px;border-radius:6px;border-left:2px solid #38bdf8">
              <strong style="color:#fbbf24">Best US Time:</strong> 4:00 AM – 12:00 PM EST<br>
              <span style="font-size:10px;color:#94a3b8">(9:00 AM – 5:00 PM London)</span>
            </div>
          </div>

          <!-- 🇦🇺 Australia -->
          <div class="tz-card" id="tzCardAu" style="background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px 14px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span style="font-weight:800;font-size:13.5px;color:#ffffff;display:inline-flex;align-items:center;gap:6px">
                <span>🇦🇺</span> <span>Australia</span>
              </span>
              <span id="badgeTzAu" class="tz-status-badge" style="font-size:10.5px;font-weight:800;padding:2px 7px;border-radius:6px;font-family:var(--font-mono);background:rgba(16,185,129,0.2);color:#6ee7b7;border:1px solid rgba(16,185,129,0.5)">🟢 CALL NOW</span>
            </div>
            <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:11px;color:#94a3b8">Sydney (AEST):</span>
              <span id="clockAu" style="font-family:var(--font-mono);font-size:14px;font-weight:800;color:#34d399">--:-- --</span>
            </div>
            <div style="font-size:11px;color:#cbd5e1;background:rgba(255,255,255,0.04);padding:5px 8px;border-radius:6px;border-left:2px solid #10b981">
              <strong style="color:#fbbf24">Best US Time:</strong> 5:00 PM – 1:00 AM EST<br>
              <span style="font-size:10px;color:#94a3b8">(9:00 AM – 5:00 PM Sydney next day)</span>
            </div>
          </div>

          <!-- 🇨🇦 Canada -->
          <div class="tz-card" id="tzCardCa" style="background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px 14px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span style="font-weight:800;font-size:13.5px;color:#ffffff;display:inline-flex;align-items:center;gap:6px">
                <span>🇨🇦</span> <span>Canada</span>
              </span>
              <span id="badgeTzCa" class="tz-status-badge" style="font-size:10.5px;font-weight:800;padding:2px 7px;border-radius:6px;font-family:var(--font-mono);background:rgba(245,158,11,0.2);color:#fbbf24;border:1px solid rgba(245,158,11,0.5)">🟡 AFTER HOURS</span>
            </div>
            <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:11px;color:#94a3b8">Toronto (EST):</span>
              <span id="clockCa" style="font-family:var(--font-mono);font-size:14px;font-weight:800;color:#7dd3fc">--:-- --</span>
            </div>
            <div style="font-size:11px;color:#cbd5e1;background:rgba(255,255,255,0.04);padding:5px 8px;border-radius:6px;border-left:2px solid #f59e0b">
              <strong style="color:#fbbf24">Best US Time:</strong> 9:00 AM – 5:00 PM EST<br>
              <span style="font-size:10px;color:#94a3b8">(Direct daytime overlap with US)</span>
            </div>
          </div>

          <!-- 🇮🇪 Ireland -->
          <div class="tz-card" id="tzCardIe" style="background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px 14px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span style="font-weight:800;font-size:13.5px;color:#ffffff;display:inline-flex;align-items:center;gap:6px">
                <span>🇮🇪</span> <span>Ireland</span>
              </span>
              <span id="badgeTzIe" class="tz-status-badge" style="font-size:10.5px;font-weight:800;padding:2px 7px;border-radius:6px;font-family:var(--font-mono);background:rgba(245,158,11,0.2);color:#fbbf24;border:1px solid rgba(245,158,11,0.5)">🟡 AFTER HOURS</span>
            </div>
            <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:11px;color:#94a3b8">Dublin (GMT):</span>
              <span id="clockIe" style="font-family:var(--font-mono);font-size:14px;font-weight:800;color:#7dd3fc">--:-- --</span>
            </div>
            <div style="font-size:11px;color:#cbd5e1;background:rgba(255,255,255,0.04);padding:5px 8px;border-radius:6px;border-left:2px solid #10b981">
              <strong style="color:#fbbf24">Best US Time:</strong> 4:00 AM – 12:00 PM EST<br>
              <span style="font-size:10px;color:#94a3b8">(9:00 AM – 5:00 PM Dublin)</span>
            </div>
          </div>

          <!-- 🇳🇿 New Zealand -->
          <div class="tz-card" id="tzCardNz" style="background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px 14px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span style="font-weight:800;font-size:13.5px;color:#ffffff;display:inline-flex;align-items:center;gap:6px">
                <span>🇳🇿</span> <span>New Zealand</span>
              </span>
              <span id="badgeTzNz" class="tz-status-badge" style="font-size:10.5px;font-weight:800;padding:2px 7px;border-radius:6px;font-family:var(--font-mono);background:rgba(16,185,129,0.2);color:#6ee7b7;border:1px solid rgba(16,185,129,0.5)">🟢 CALL NOW</span>
            </div>
            <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:11px;color:#94a3b8">Auckland (NZDT):</span>
              <span id="clockNz" style="font-family:var(--font-mono);font-size:14px;font-weight:800;color:#34d399">--:-- --</span>
            </div>
            <div style="font-size:11px;color:#cbd5e1;background:rgba(255,255,255,0.04);padding:5px 8px;border-radius:6px;border-left:2px solid #a855f7">
              <strong style="color:#fbbf24">Best US Time:</strong> 4:00 PM – 12:00 AM EST<br>
              <span style="font-size:10px;color:#94a3b8">(10:00 AM – 6:00 PM NZDT next day)</span>
            </div>
          </div>

        </div>

        <!-- Time Zone Filter Pill Strip -->
        <div style="display:flex;align-items:center;gap:8px;margin-top:14px;flex-wrap:wrap">
          <span style="font-size:11px;font-family:var(--font-mono);color:#fbbf24;font-weight:800;text-transform:uppercase">Quick Zone Filter:</span>
          <button type="button" class="lead-pill-btn active" id="btnFilterTzAll" onclick="filterIntlByCountry('all')">🌍 All Countries (150)</button>
          <button type="button" class="lead-pill-btn" id="btnFilterTzOpenNow" onclick="filterIntlOpenNow()" style="background:rgba(16,185,129,0.2);border-color:#10b981;color:#6ee7b7;font-weight:800">
            <span>🟢 Call Now: Currently in Work Hours (<span id="countOpenNow">--</span>)</span>
          </button>
          <button type="button" class="lead-pill-btn" id="btnFilterTzUk" onclick="filterIntlByCountry('United Kingdom')">🇬🇧 UK (40)</button>
          <button type="button" class="lead-pill-btn" id="btnFilterTzAu" onclick="filterIntlByCountry('Australia')">🇦🇺 Australia (40)</button>
          <button type="button" class="lead-pill-btn" id="btnFilterTzCa" onclick="filterIntlByCountry('Canada')">🇨🇦 Canada (35)</button>
          <button type="button" class="lead-pill-btn" id="btnFilterTzIe" onclick="filterIntlByCountry('Ireland')">🇮🇪 Ireland (20)</button>
          <button type="button" class="lead-pill-btn" id="btnFilterTzNz" onclick="filterIntlByCountry('New Zealand')">🇳🇿 New Zealand (15)</button>
        </div>
      </div>

      <!-- High-Level International Leak KPIs (Matching Main Tab) -->
      <div class="kpi-bar">
        <div class="kpi-card" style="border-color:rgba(56,189,248,0.4)">
          <div class="kpi-label">🎯 Active International Targets</div>
          <div class="kpi-val" id="intlKpiTargetCount" style="color:#7dd3fc">150 Businesses</div>
          <div class="kpi-sub">UK · AU · CA · IE · NZ</div>
        </div>
        <div class="kpi-card" style="border-color:rgba(52,211,153,0.35)">
          <div class="kpi-label">👥 100% English-Speaking Markets</div>
          <div class="kpi-val" style="color:#6ee7b7">5 Global Hubs</div>
          <div class="kpi-sub">0 Language Barrier · High Affluence</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">💸 Total Annual AI Leak Detected</div>
          <div class="kpi-val" style="color:#f87171">$4,850,000 / yr</div>
          <div class="kpi-sub">Unattended calls &amp; missing web funnels</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">📊 Avg Opp per Business</div>
          <div class="kpi-val" style="color:#fbbf24">$2,690 / mo</div>
          <div class="kpi-sub">+ $1,500 Upfront Mobile Web Setup</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">🛡️ Market Saturation Index</div>
          <div class="kpi-val" style="color:#34d399">0% Saturation</div>
          <div class="kpi-sub">Blue Ocean First-Mover Advantage</div>
        </div>
      </div>

      <!-- Filters & Search (Matching Main Tab) -->
      <div class="lead-filter-bar">
        <div class="lead-search-box">
          <span class="lead-search-icon">🔍</span>
          <input type="text" class="lead-search-input" id="intlSearchInput" placeholder="Search company, owner, city, country, trade, or phone..." autocomplete="off" oninput="handleIntlFilterChange()">
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <select id="intlCountryFilterSelect" class="custom-select" onchange="handleIntlFilterChange()">
            <option value="all">All Countries (150)</option>
            <option value="United Kingdom">🇬🇧 United Kingdom (40)</option>
            <option value="Australia">🇦🇺 Australia (40)</option>
            <option value="Canada">🇨🇦 Canada (35)</option>
            <option value="Ireland">🇮🇪 Ireland (20)</option>
            <option value="New Zealand">🇳🇿 New Zealand (15)</option>
          </select>
          <select id="intlWindowFilterSelect" class="custom-select" onchange="handleIntlFilterChange()">
            <option value="all">All Calling Windows</option>
            <option value="open">🟢 Currently In Calling Window (Open)</option>
            <option value="closed">🟡 After Hours (Outside Window)</option>
          </select>
          <select id="intlTradeFilterSelect" class="custom-select" onchange="handleIntlFilterChange()">
            <option value="all">All Trades &amp; Niches</option>
            <option value="Plumbing">Plumbing &amp; Heating</option>
            <option value="Roofing">Roofing &amp; Cladding</option>
            <option value="HVAC">HVAC &amp; Air Conditioning</option>
            <option value="Electrical">Electrical Solutions</option>
            <option value="Tree">Tree Surgery &amp; Care</option>
            <option value="Dental">Health &amp; Dental Clinics</option>
          </select>
        </div>
      </div>

      <!-- Status & Offer Strategy Filter Pills (Matching Main Tab) -->
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:14px">
        <div class="lead-pills">
          <button class="lead-pill-btn active" id="intlPillStatusAll" onclick="setIntlStatusFilter('all')">All Status (<span id="intlCountStatusAll">150</span>)</button>
          <button class="lead-pill-btn" id="intlPillStatusUncalled" onclick="setIntlStatusFilter('uncalled')">⏳ Remaining To Call (<span id="intlCountStatusUncalled">150</span>)</button>
          <button class="lead-pill-btn" id="intlPillStatusCallbacks" onclick="setIntlStatusFilter('callbacks')">📞 Callbacks (<span id="intlCountStatusCallbacks">0</span>)</button>
          <button class="lead-pill-btn" id="intlPillStatusCalled" onclick="setIntlStatusFilter('called')">✅ Logged Calls (<span id="intlCountStatusCalled">0</span>)</button>
        </div>

        <div class="lead-pills" id="intlOfferFilters">
          <span style="font-size:11px;font-family:var(--font-mono);color:var(--accent2);text-transform:uppercase;font-weight:700">📦 Offer:</span>
          <button class="lead-pill-btn active" id="intlPillOfferAll" onclick="setIntlOfferFilter('all')">All (150)</button>
          <button class="lead-pill-btn" id="intlPillOfferAva" onclick="setIntlOfferFilter('ava')">🤖 Ava 24/7 AI</button>
          <button class="lead-pill-btn" id="intlPillOfferWeb" onclick="setIntlOfferFilter('web')">🌐 Web Build ($997+)</button>
          <button class="lead-pill-btn" id="intlPillOfferBundle" onclick="setIntlOfferFilter('bundle')">⚡ Full Bundle</button>
        </div>
      </div>

      <!-- 📜 INTERNATIONAL TELEPROMPTER & BATTLECARD SCRIPT -->
      <div class="fl-battlecard-box" id="intlScriptSection" style="margin-bottom:18px">
        <div class="fl-battlecard-header">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:24px">📜</span>
            <div>
              <h3 style="font-family:var(--font-head);font-size:17.5px;font-weight:800;color:#fbbf24;margin:0">
                International Cold Call Teleprompter &amp; Uncontested Battlecard
              </h3>
              <div style="font-size:12px;color:#94a3b8;margin-top:2px">
                Adapted for UK, Australian, Canadian, Irish &amp; NZ local businesses. Capitalizing on zero regional AI saturation.
              </div>
            </div>
          </div>
          <div class="fl-active-target-pill" id="intlActiveTargetPill">
            <span>Targeting:</span> <strong id="intlActiveTargetName">Thames Valley Heating &amp; Gas Ltd (Oliver Hughes)</strong>
          </div>
        </div>

        <!-- 3 Phase Teleprompter Script -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-top:14px">
          <!-- Phase 1: Hook -->
          <div style="background:rgba(15,23,42,0.9);border:1.5px solid rgba(56,189,248,0.4);border-radius:12px;padding:14px">
            <div style="font-size:11px;font-family:var(--font-mono);font-weight:800;color:#38bdf8;text-transform:uppercase;margin-bottom:6px">PHASE 1 · 8 SECONDS · THE DIRECT HOOK</div>
            <div style="font-size:14px;color:#f8fafc;line-height:1.5" id="intlScriptHookText">
              "Hey <strong class="intl-tag-owner" style="color:#fbbf24">Oliver</strong>, I was just looking at your Google reviews for <strong class="intl-tag-company" style="color:#38bdf8">Thames Valley Heating</strong> — I noticed you guys don't have an instant mobile site button and after-hours emergency calls roll straight to voicemail. Are you guys currently turning away emergency calls or is your front desk just slammed?"
            </div>
          </div>

          <!-- Phase 2: The Uncontested Angle -->
          <div style="background:rgba(15,23,42,0.9);border:1.5px solid rgba(245,158,11,0.4);border-radius:12px;padding:14px">
            <div style="font-size:11px;font-family:var(--font-mono);font-weight:800;color:#fbbf24;text-transform:uppercase;margin-bottom:6px">PHASE 2 · 12 SECONDS · THE UNFAIR ADVANTAGE</div>
            <div style="font-size:14px;color:#f8fafc;line-height:1.5" id="intlScriptPitchText">
              "We run automated speed-to-lead systems for high-volume trade contractors in North America, and practically nobody in <strong class="intl-tag-city" style="color:#fbbf24">London</strong> is using this yet. We deploy an AI voice receptionist called AVA that answers on the first ring, qualifies the emergency, and texts booking dispatch directly to your engineers' phones 24/7."
            </div>
          </div>

          <!-- Phase 3: The Close -->
          <div style="background:rgba(15,23,42,0.9);border:1.5px solid rgba(16,185,129,0.4);border-radius:12px;padding:14px">
            <div style="font-size:11px;font-family:var(--font-mono);font-weight:800;color:#34d399;text-transform:uppercase;margin-bottom:6px">PHASE 3 · 10 SECONDS · THE ZERO-RISK OFFER</div>
            <div style="font-size:14px;color:#f8fafc;line-height:1.5" id="intlScriptCloseText">
              "I actually already mocked up an instant mobile preview site and voice demo for <strong class="intl-tag-company" style="color:#34d399">Thames Valley Heating</strong>. Can I shoot the live test link to your mobile right now? If you don't like it, tell me to kick rocks. If you want it, it's <strong class="intl-tag-price" style="color:#34d399">£997 flat</strong> with zero lock-in. What's the best mobile to text?"
            </div>
          </div>
        </div>

        <!-- Objection Crusher Buttons -->
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08)">
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button type="button" class="fl-obj-btn" onclick="toggleIntlObjection('noAiHere')">🛡️ "Nobody Uses AI in Our Area"</button>
            <button type="button" class="fl-obj-btn" onclick="toggleIntlObjection('wordOfMouth')">🛡️ "We Rely on Word of Mouth"</button>
            <button type="button" class="fl-obj-btn" onclick="toggleIntlObjection('tooExpensive')">🛡️ "Websites Cost Too Much"</button>
            <button type="button" class="fl-obj-btn" onclick="toggleIntlObjection('haveFacebook')">🛡️ "We Just Use Facebook"</button>
            <button type="button" class="fl-obj-btn" onclick="toggleIntlObjection('sendEmail')">🛡️ "Send Me An Email"</button>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button type="button" class="btn btn-secondary btn-sm" onclick="copyIntlSmsPitch()"><span>📋</span> <span>Copy SMS Pitch</span></button>
            <button type="button" class="btn btn-gold btn-sm" onclick="openIntlWebPreview()"><span>🌐</span> <span>Open Web Preview</span></button>
          </div>
        </div>

        <!-- Objection Handler Script Box -->
        <div id="intlObjectionDetails" class="fl-objection-reveal-box" style="display:none;margin-top:12px">
          <div class="fl-obj-box-title" id="intlObjTitle">Objection Handler</div>
          <div class="fl-obj-box-script" id="intlObjScript">Rebuttal goes here.</div>
        </div>
      </div>

      <!-- 📊 150 INTERNATIONAL LEADS INTERACTIVE TABLE -->
      <div class="fl-table-container">
        <div class="fl-table-status-bar" style="background:rgba(15,23,42,0.9)">
          <div>
            Showing <strong id="intlShowingCount" style="color:#7dd3fc">150</strong> of 150 International Local Business Targets
          </div>
          <div style="font-size:12px;color:#94a3b8;display:flex;align-items:center;gap:12px">
            <span>🟢 = Currently within 9 AM – 5 PM local work hours</span>
            <span>💡 Click <strong>"📞 Pitch"</strong> to load lead into teleprompter</span>
          </div>
        </div>

        <div class="fl-table-scroll">
          <table class="excel-table fl-table">
            <thead>
              <tr>
                <th style="width:40px">#</th>
                <th>Company &amp; Owner</th>
                <th>Trade &amp; Reviews</th>
                <th>Country &amp; City</th>
                <th>Direct Phone (Click to Dial)</th>
                <th>Local Time &amp; Zone</th>
                <th>Best US Window (EST)</th>
                <th>AI &amp; Web Opportunity</th>
                <th style="min-width:160px">Pitch &amp; Action</th>
                <th style="min-width:140px">Disposition</th>
                <th style="min-width:160px">Call Notes</th>
              </tr>
            </thead>
            <tbody id="intlLeadsTableBody">
              <!-- Dynamically populated by renderInternationalLeadsTable() -->
            </tbody>
          </table>
        </div>
      </div>

    </div><!-- END lead-cockpit -->
    </div><!-- END flVaultContent -->

    <!-- ⏳ INTERNATIONAL CALLBACK MODAL WITH TIME ZONE CONVERTER -->
    <div id="intlCallbackModal" class="leads-locked-card" style="display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:99999;width:90%;max-width:540px;background:#0d121d;border:2px solid #38bdf8;border-radius:18px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,0.85)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:10px">
        <h3 style="font-size:18px;color:#ffffff;display:flex;align-items:center;gap:8px" id="intlCbModalTitle">
          <span>⏳</span> <span>Schedule Callback</span>
        </h3>
        <button type="button" onclick="closeIntlCallbackModal()" style="background:transparent;border:none;color:#94a3b8;font-size:20px;cursor:pointer">&times;</button>
      </div>

      <div style="margin-bottom:12px">
        <div style="font-size:13px;color:#94a3b8" id="intlCbModalSubtitle">Target: Company Name</div>
        <div style="font-size:12px;color:#38bdf8;font-weight:700;margin-top:2px" id="intlCbModalTzInfo">Timezone: Europe/London</div>
      </div>

      <div style="background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px;margin-bottom:14px">
        <label style="display:block;font-size:11px;font-family:var(--font-mono);color:#fbbf24;text-transform:uppercase;font-weight:800;margin-bottom:6px">Select Callback Date &amp; Time:</label>
        <input type="datetime-local" id="intlCbDateTimeInput" style="width:100%;padding:10px;background:#1e293b;border:1px solid #475569;border-radius:8px;color:#ffffff;font-size:14px" onchange="calculateIntlCbTimeConversion()">
        
        <div style="margin-top:10px;padding:8px 10px;background:rgba(56,189,248,0.1);border-radius:6px;font-size:12px;color:#e2e8f0" id="intlCbConvertedDisplay">
          ⏰ <strong>Converted Times:</strong> Select date &amp; time above to see local vs US EST conversion.
        </div>
      </div>

      <div style="margin-bottom:16px">
        <label style="display:block;font-size:11px;font-family:var(--font-mono);color:#cbd5e1;text-transform:uppercase;font-weight:800;margin-bottom:6px">Callback Objective / Notes:</label>
        <textarea id="intlCbNotesInput" rows="3" placeholder="e.g. Owner asked to call back during his lunch break at 1pm London time to review Ava demo..." style="width:100%;padding:10px;background:#1e293b;border:1px solid #475569;border-radius:8px;color:#ffffff;font-size:13px;resize:vertical"></textarea>
      </div>

      <div style="display:flex;gap:10px;justify-content:flex-end">
        <button type="button" class="btn btn-ghost btn-sm" onclick="clearIntlCallback()" style="color:#f87171;border:1px solid rgba(239,68,68,0.4)">Remove Callback</button>
        <button type="button" class="btn btn-gold btn-sm" onclick="saveIntlCallbackFromModal()">💾 Save Callback</button>
      </div>
    </div>

  </div><!-- END tabNoWebsite -->
`;

html = html.substring(0, startIndex) + newPrivateTabPanelHtml + html.substring(endIndex);
console.log('✅ Replaced #tabNoWebsite panel with International Vault');

// 3. INJECT JAVASCRIPT ENGINE FOR 150 INTERNATIONAL LEADS & WORLD CLOCKS
const scriptEngineMarker = '// ============================================================';
const intlScriptBlock = `
// ============================================================
// 🌍 INTERNATIONAL 150 LOCAL BUSINESS LEADS & WORLD CLOCK ENGINE
// ============================================================
window.INTERNATIONAL_150_LEADS = ${JSON.stringify(leadsData, null, 2)};

window.INTL_CURRENT_VIEW = 'toCall'; // 'toCall', 'callbacks', 'calledHistory'
window.INTL_STATUS_FILTER = 'all';
window.INTL_OFFER_FILTER = 'all';
window.INTL_CURRENT_SELECTED_LEAD = window.INTERNATIONAL_150_LEADS[0];
window.CURRENT_INTL_CB_LEAD_ID = null;

// Real-Time Timezone Clock Updater
window.initInternationalWorldClocks = function() {
  function updateClocks() {
    const now = new Date();
    
    // US Clocks
    const clockEstEl = document.getElementById('clockUsEst');
    const clockCstEl = document.getElementById('clockUsCst');
    const clockPstEl = document.getElementById('clockUsPst');
    if (clockEstEl) clockEstEl.textContent = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true });
    if (clockCstEl) clockCstEl.textContent = now.toLocaleTimeString('en-US', { timeZone: 'America/Chicago', hour: 'numeric', minute: '2-digit', hour12: true });
    if (clockPstEl) clockPstEl.textContent = now.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit', hour12: true });

    // Regional Clocks & Calling Windows (9:00 AM - 5:00 PM local)
    const regions = [
      { id: 'Uk', tz: 'Europe/London', clockId: 'clockUk', badgeId: 'badgeTzUk' },
      { id: 'Au', tz: 'Australia/Sydney', clockId: 'clockAu', badgeId: 'badgeTzAu' },
      { id: 'Ca', tz: 'America/Toronto', clockId: 'clockCa', badgeId: 'badgeTzCa' },
      { id: 'Ie', tz: 'Europe/Dublin', clockId: 'clockIe', badgeId: 'badgeTzIe' },
      { id: 'Nz', tz: 'Pacific/Auckland', clockId: 'clockNz', badgeId: 'badgeTzNz' }
    ];

    regions.forEach(r => {
      const cEl = document.getElementById(r.clockId);
      const bEl = document.getElementById(r.badgeId);
      if (cEl) {
        cEl.textContent = now.toLocaleTimeString('en-US', { timeZone: r.tz, hour: 'numeric', minute: '2-digit', hour12: true });
      }
      if (bEl) {
        const hour24 = parseInt(now.toLocaleTimeString('en-US', { timeZone: r.tz, hour: 'numeric', hour12: false }), 10);
        const isOpen = hour24 >= 9 && hour24 < 17;
        if (isOpen) {
          bEl.textContent = '🟢 CALL NOW';
          bEl.style.background = 'rgba(16,185,129,0.2)';
          bEl.style.color = '#6ee7b7';
          bEl.style.borderColor = 'rgba(16,185,129,0.5)';
        } else {
          bEl.textContent = '🟡 AFTER HOURS';
          bEl.style.background = 'rgba(245,158,11,0.2)';
          bEl.style.color = '#fbbf24';
          bEl.style.borderColor = 'rgba(245,158,11,0.5)';
        }
      }
    });

    // Update Live Open Now Count
    let openCount = 0;
    window.INTERNATIONAL_150_LEADS.forEach(l => {
      const h24 = parseInt(now.toLocaleTimeString('en-US', { timeZone: l.timezone, hour: 'numeric', hour12: false }), 10);
      if (h24 >= 9 && h24 < 17) openCount++;
    });
    const openCountEl = document.getElementById('countOpenNow');
    if (openCountEl) openCountEl.textContent = openCount;
  }

  updateClocks();
  if (!window.INTL_CLOCK_INTERVAL) {
    window.INTL_CLOCK_INTERVAL = setInterval(updateClocks, 10000);
  }
};

window.isLeadInCallingWindow = function(lead) {
  try {
    const now = new Date();
    const h24 = parseInt(now.toLocaleTimeString('en-US', { timeZone: lead.timezone, hour: 'numeric', hour12: false }), 10);
    return h24 >= 9 && h24 < 17;
  } catch(e) {
    return false;
  }
};

window.getLeadLocalTimeStr = function(lead) {
  try {
    return new Date().toLocaleTimeString('en-US', { timeZone: lead.timezone, hour: 'numeric', minute: '2-digit', hour12: true });
  } catch(e) {
    return '--:--';
  }
};

// Render Leads Table
window.renderInternationalLeadsTable = function() {
  const tbody = document.getElementById('intlLeadsTableBody');
  if (!tbody) return;

  const query = (document.getElementById('intlSearchInput')?.value || '').toLowerCase().trim();
  const country = document.getElementById('intlCountryFilterSelect')?.value || 'all';
  const winFilter = document.getElementById('intlWindowFilterSelect')?.value || 'all';
  const trade = document.getElementById('intlTradeFilterSelect')?.value || 'all';
  const batch = document.getElementById('intlBatchSelect')?.value || 'all';

  const leads = window.INTERNATIONAL_150_LEADS;
  let filtered = leads.filter(l => {
    // Batch filter
    if (batch !== 'all') {
      if (batch === 'open_now') {
        if (!window.isLeadInCallingWindow(l)) return false;
      } else if (l.countryCode !== batch) {
        return false;
      }
    }

    // Country filter
    if (country !== 'all' && l.country !== country) return false;

    // Window filter
    if (winFilter !== 'all') {
      const isOpen = window.isLeadInCallingWindow(l);
      if (winFilter === 'open' && !isOpen) return false;
      if (winFilter === 'closed' && isOpen) return false;
    }

    // Trade filter
    if (trade !== 'all' && !l.trade.toLowerCase().includes(trade.toLowerCase())) return false;

    // Offer Filter
    if (window.INTL_OFFER_FILTER !== 'all') {
      if (window.INTL_OFFER_FILTER === 'ava' && !l.aiOpportunity.toLowerCase().includes('ava')) return false;
      if (window.INTL_OFFER_FILTER === 'web' && !l.websiteStatus.includes('NO WEBSITE')) return false;
      if (window.INTL_OFFER_FILTER === 'bundle' && !(l.aiOpportunity && l.webOpportunity)) return false;
    }

    // View Switcher Filter (toCall vs callbacks vs calledHistory)
    const savedStatus = localStorage.getItem('vantorx_intl_disp_' + l.id) || 'UNTOUCHED';
    const hasCallback = localStorage.getItem('vantorx_intl_cb_' + l.id);
    if (window.INTL_CURRENT_VIEW === 'callbacks') {
      if (savedStatus !== 'CALLBACK' && !hasCallback) return false;
    } else if (window.INTL_CURRENT_VIEW === 'calledHistory') {
      if (savedStatus === 'UNTOUCHED' && !hasCallback) return false;
    } else {
      // toCall queue: Untouched or remaining
      if (savedStatus !== 'UNTOUCHED') return false;
    }

    // Status filter
    if (window.INTL_STATUS_FILTER !== 'all') {
      if (window.INTL_STATUS_FILTER === 'uncalled' && savedStatus !== 'UNTOUCHED') return false;
      if (window.INTL_STATUS_FILTER === 'callbacks' && savedStatus !== 'CALLBACK' && !hasCallback) return false;
      if (window.INTL_STATUS_FILTER === 'called' && savedStatus === 'UNTOUCHED') return false;
    }

    // Search query
    if (query) {
      const hay = (l.company + ' ' + l.owner + ' ' + l.fullOwner + ' ' + l.city + ' ' + l.country + ' ' + l.trade + ' ' + l.phone + ' ' + l.websiteStatus).toLowerCase();
      if (!hay.includes(query)) return false;
    }

    return true;
  });

  // Calculate HUD Stats
  let uncalledCount = 0;
  let callbacksCount = 0;
  let calledCount = 0;
  let demosClosedCount = 0;

  leads.forEach(l => {
    const s = localStorage.getItem('vantorx_intl_disp_' + l.id) || 'UNTOUCHED';
    const cb = localStorage.getItem('vantorx_intl_cb_' + l.id);
    if (s === 'UNTOUCHED') uncalledCount++;
    else calledCount++;
    if (s === 'CALLBACK' || cb) callbacksCount++;
    if (s === 'CLOSED' || s === 'DEMO') demosClosedCount++;
  });

  // Update Badges & Counters
  const uncalledBadge = document.getElementById('intlUncalledCountBadge'); if (uncalledBadge) uncalledBadge.textContent = uncalledCount;
  const cbBadge = document.getElementById('intlCallbackCountBadge'); if (cbBadge) cbBadge.textContent = callbacksCount;
  const calledBadge = document.getElementById('intlCalledCountBadge'); if (calledBadge) calledBadge.textContent = calledCount;

  const countAllEl = document.getElementById('intlCountStatusAll'); if (countAllEl) countAllEl.textContent = leads.length;
  const countUncalledEl = document.getElementById('intlCountStatusUncalled'); if (countUncalledEl) countUncalledEl.textContent = uncalledCount;
  const countCbEl = document.getElementById('intlCountStatusCallbacks'); if (countCbEl) countCbEl.textContent = callbacksCount;
  const countCalledEl = document.getElementById('intlCountStatusCalled'); if (countCalledEl) countCalledEl.textContent = calledCount;

  const chipUncalled = document.getElementById('intlChipUncalled'); if (chipUncalled) chipUncalled.textContent = '⏳ ' + uncalledCount + ' To Call';
  const chipCalled = document.getElementById('intlChipCalled'); if (chipCalled) chipCalled.textContent = '✓ ' + calledCount + ' Called';
  const chipDemos = document.getElementById('intlChipDemos'); if (chipDemos) chipDemos.textContent = '🎉 ' + demosClosedCount + ' Closed / Demos';

  const quotaCountEl = document.getElementById('intlQuotaCount'); if (quotaCountEl) quotaCountEl.textContent = calledCount;
  const quotaPct = Math.min(100, Math.round((calledCount / 100) * 100));
  const quotaPctEl = document.getElementById('intlQuotaPct'); if (quotaPctEl) quotaPctEl.textContent = quotaPct + '%';
  const quotaBar = document.getElementById('intlQuotaBarFill'); if (quotaBar) quotaBar.style.width = quotaPct + '%';

  const showingCountEl = document.getElementById('intlShowingCount'); if (showingCountEl) showingCountEl.textContent = filtered.length;
  const kpiTargetEl = document.getElementById('intlKpiTargetCount'); if (kpiTargetEl) kpiTargetEl.textContent = filtered.length + ' Businesses';

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="11" style="text-align:center;padding:34px;color:#94a3b8">No matching international leads found. Adjust search, calling window, or view tab.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map((l, idx) => {
    const savedDisp = localStorage.getItem('vantorx_intl_disp_' + l.id) || 'UNTOUCHED';
    const savedNote = localStorage.getItem('vantorx_intl_notes_' + l.id) || '';
    const isSelected = window.INTL_CURRENT_SELECTED_LEAD && window.INTL_CURRENT_SELECTED_LEAD.id === l.id;
    const isOpen = window.isLeadInCallingWindow(l);
    const localTimeStr = window.getLeadLocalTimeStr(l);

    // Callback badge info
    let cbBadgeHtml = '';
    const rawCb = localStorage.getItem('vantorx_intl_cb_' + l.id);
    if (rawCb || savedDisp === 'CALLBACK') {
      let cbTimeStr = 'Callback Set';
      let cbNote = '';
      if (rawCb) {
        try {
          const parsed = JSON.parse(rawCb);
          cbTimeStr = parsed.timeStr || cbTimeStr;
          cbNote = parsed.note || '';
        } catch(e){}
      }
      cbBadgeHtml = \`
        <div style="margin-top:4px">
          <span onclick="openIntlCallbackModal('\${l.id}')" style="cursor:pointer;background:rgba(245,158,11,0.22);border:1px solid rgba(245,158,11,0.6);color:#fbbf24;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:800;display:inline-flex;align-items:center;gap:4px">
            <span>⏳</span> <span>\${cbTimeStr}</span>
          </span>
          \${cbNote ? \`<div style="font-size:10px;color:#cbd5e1;margin-top:2px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${cbNote}</div>\` : ''}
        </div>
      \`;
    }

    return \`
      <tr style="\${isSelected ? 'background:rgba(56,189,248,0.12);' : ''}">
        <td style="font-family:monospace;color:#64748b">\${idx + 1}</td>
        <td>
          <div style="font-weight:800;color:#ffffff;display:flex;align-items:center;gap:6px">
            <span>\${l.company}</span>
            <span style="font-size:10px;background:#1e293b;color:#94a3b8;padding:1px 5px;border-radius:3px">\${l.id}</span>
          </div>
          <div style="font-size:12px;color:#cbd5e1;margin-top:2px">
            👤 <strong>\${l.fullOwner}</strong> <span style="color:#64748b">· \${l.title}</span>
          </div>
        </td>
        <td>
          <div style="font-weight:700;color:#fbbf24;font-size:12.5px">\${l.trade}</div>
          <div style="font-size:11.5px;color:#94a3b8;margin-top:2px">\${l.ratingFull}</div>
        </td>
        <td>
          <div style="font-weight:700;color:#f8fafc;display:flex;align-items:center;gap:5px">
            <span>\${l.flag}</span> <span>\${l.city}</span>
          </div>
          <div style="font-size:11px;color:#94a3b8">\${l.country}</div>
        </td>
        <td>
          <a href="tel:\${l.phone.replace(/[^0-9+]/g, '')}" style="font-family:var(--font-mono);color:#38bdf8;font-weight:800;text-decoration:none;font-size:13px;display:inline-flex;align-items:center;gap:4px">
            <span>📞</span> <span>\${l.phone}</span>
          </a>
        </td>
        <td>
          <div style="font-family:var(--font-mono);font-size:13px;font-weight:800;color:#ffffff">\${localTimeStr}</div>
          <div style="font-size:11px;color:#94a3b8">\${l.tzAbbr} · \${l.timezone.split('/')[1]}</div>
        </td>
        <td>
          <div style="margin-bottom:3px">
            <span style="font-size:10.5px;font-family:var(--font-mono);font-weight:800;padding:2px 7px;border-radius:4px;\${isOpen ? 'background:rgba(16,185,129,0.2);color:#6ee7b7;border:1px solid #10b981' : 'background:rgba(245,158,11,0.2);color:#fbbf24;border:1px solid #f59e0b'}">
              \${isOpen ? '🟢 IN CALL WINDOW' : '🟡 AFTER HOURS'}
            </span>
          </div>
          <div style="font-size:11.5px;color:#e2e8f0;font-weight:700">\${l.bestUsWindow}</div>
          <div style="font-size:10px;color:#94a3b8">\${l.bestUsWindowPst}</div>
        </td>
        <td>
          <div style="font-size:11px;font-weight:800;\${l.websiteStatus.includes('NO WEBSITE') ? 'color:#ef4444' : 'color:#fbbf24'}">
            🌐 \${l.websiteStatus}
          </div>
          <div style="font-size:11px;color:#94a3b8;margin-top:2px">Bleed: <strong style="color:#f87171">\${l.monthlyBleedLocal}</strong></div>
        </td>
        <td>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button type="button" class="btn btn-gold btn-xs" onclick="selectIntlLeadForPitch('\${l.id}')" style="font-weight:800">
              📞 Pitch
            </button>
            <button type="button" class="btn btn-secondary btn-xs" onclick="openIntlCallbackModal('\${l.id}')" style="font-weight:700">
              ⏳ Callback
            </button>
          </div>
          \${cbBadgeHtml}
        </td>
        <td>
          <select onchange="saveIntlDisposition('\${l.id}', this.value)" style="font-size:11.5px;padding:4px 6px;border-radius:6px;background:#1e293b;border:1px solid #475569;color:#ffffff;font-weight:700;width:100%">
            <option value="UNTOUCHED" \${savedDisp === 'UNTOUCHED' ? 'selected' : ''}>⚪ Not Called</option>
            <option value="SPOKE" \${savedDisp === 'SPOKE' ? 'selected' : ''}>🟡 Spoke to Owner</option>
            <option value="CALLBACK" \${savedDisp === 'CALLBACK' ? 'selected' : ''}>⏳ Callback Set</option>
            <option value="DEMO" \${savedDisp === 'DEMO' ? 'selected' : ''}>🔵 Demo Booked</option>
            <option value="CLOSED" \${savedDisp === 'CLOSED' ? 'selected' : ''}>🟢 Closed Deal!</option>
            <option value="NOT_INTERESTED" \${savedDisp === 'NOT_INTERESTED' ? 'selected' : ''}>🔴 Not Interested</option>
          </select>
        </td>
        <td>
          <input type="text" placeholder="Add note..." value="\${savedNote.replace(/"/g, '&quot;')}" onblur="saveIntlNote('\${l.id}', this.value)" style="width:100%;font-size:11px;padding:5px 8px;background:#0f172a;border:1px solid #334155;border-radius:5px;color:#f8fafc" />
        </td>
      </tr>
    \`;
  }).join('');
};

window.switchIntlLeadView = function(view) {
  window.INTL_CURRENT_VIEW = view;
  const pills = ['btnIntlViewToCall', 'btnIntlViewCallbacks', 'btnIntlViewCalledHistory'];
  pills.forEach(p => {
    const el = document.getElementById(p);
    if (el) el.classList.remove('active');
  });

  if (view === 'toCall') document.getElementById('btnIntlViewToCall')?.classList.add('active');
  if (view === 'callbacks') document.getElementById('btnIntlViewCallbacks')?.classList.add('active');
  if (view === 'calledHistory') document.getElementById('btnIntlViewCalledHistory')?.classList.add('active');

  window.renderInternationalLeadsTable();
};

window.handleIntlBatchChange = function() {
  window.renderInternationalLeadsTable();
};

window.handleIntlFilterChange = function() {
  window.renderInternationalLeadsTable();
};

window.setIntlStatusFilter = function(status) {
  window.INTL_STATUS_FILTER = status;
  ['intlPillStatusAll', 'intlPillStatusUncalled', 'intlPillStatusCallbacks', 'intlPillStatusCalled'].forEach(id => {
    document.getElementById(id)?.classList.remove('active');
  });
  if (status === 'all') document.getElementById('intlPillStatusAll')?.classList.add('active');
  if (status === 'uncalled') document.getElementById('intlPillStatusUncalled')?.classList.add('active');
  if (status === 'callbacks') document.getElementById('intlPillStatusCallbacks')?.classList.add('active');
  if (status === 'called') document.getElementById('intlPillStatusCalled')?.classList.add('active');
  window.renderInternationalLeadsTable();
};

window.setIntlOfferFilter = function(offer) {
  window.INTL_OFFER_FILTER = offer;
  ['intlPillOfferAll', 'intlPillOfferAva', 'intlPillOfferWeb', 'intlPillOfferBundle'].forEach(id => {
    document.getElementById(id)?.classList.remove('active');
  });
  if (offer === 'all') document.getElementById('intlPillOfferAll')?.classList.add('active');
  if (offer === 'ava') document.getElementById('intlPillOfferAva')?.classList.add('active');
  if (offer === 'web') document.getElementById('intlPillOfferWeb')?.classList.add('active');
  if (offer === 'bundle') document.getElementById('intlPillOfferBundle')?.classList.add('active');
  window.renderInternationalLeadsTable();
};

window.filterIntlByCountry = function(country) {
  const sel = document.getElementById('intlCountryFilterSelect');
  if (sel) {
    sel.value = country;
    window.renderInternationalLeadsTable();
  }
};

window.filterIntlOpenNow = function() {
  const sel = document.getElementById('intlWindowFilterSelect');
  if (sel) {
    sel.value = 'open';
    window.renderInternationalLeadsTable();
  }
};

window.selectIntlLeadForPitch = function(leadId) {
  const lead = window.INTERNATIONAL_150_LEADS.find(l => l.id === leadId);
  if (!lead) return;
  window.INTL_CURRENT_SELECTED_LEAD = lead;

  const targetNameEl = document.getElementById('intlActiveTargetName');
  if (targetNameEl) targetNameEl.textContent = lead.company + ' (' + lead.fullOwner + ' · ' + lead.city + ', ' + lead.country + ')';

  // Populate dynamic script tags
  document.querySelectorAll('.intl-tag-owner').forEach(el => el.textContent = lead.owner);
  document.querySelectorAll('.intl-tag-company').forEach(el => el.textContent = lead.company);
  document.querySelectorAll('.intl-tag-city').forEach(el => el.textContent = lead.city);
  
  let priceStr = '£997 flat';
  if (lead.countryCode === 'AU') priceStr = '$1,497 AUD flat';
  if (lead.countryCode === 'CA') priceStr = '$1,397 CAD flat';
  if (lead.countryCode === 'IE') priceStr = '€1,197 flat';
  if (lead.countryCode === 'NZ') priceStr = '$1,497 NZD flat';
  document.querySelectorAll('.intl-tag-price').forEach(el => el.textContent = priceStr);

  const scriptSec = document.getElementById('intlScriptSection');
  if (scriptSec) scriptSec.scrollIntoView({ behavior: 'smooth', block: 'start' });

  window.renderInternationalLeadsTable();
  if (typeof showToast === 'function') showToast('📜 Teleprompter loaded for ' + lead.company);
};

window.toggleIntlObjection = function(key) {
  const box = document.getElementById('intlObjectionDetails');
  const title = document.getElementById('intlObjTitle');
  const script = document.getElementById('intlObjScript');
  if (!box || !title || !script) return;

  const lead = window.INTL_CURRENT_SELECTED_LEAD || window.INTERNATIONAL_150_LEADS[0];
  const objections = {
    noAiHere: {
      title: 'Objection: "Nobody uses AI or automated systems in our area..."',
      text: '"Exactly! That is precisely why you will crush every single competitor in ' + lead.city + '. In North America, the guys who adopted AI receptionists in 2024 now dominate their markets because while other contractors let calls roll to voicemail, they answer in under 1 second. You get first-mover advantage before anyone else in ' + lead.city + ' even figures it out."'
    },
    wordOfMouth: {
      title: 'Objection: "We get all our work from word of mouth..."',
      text: '"Word of mouth is the best work you can get, ' + lead.owner + '. But here is what happens: when Mrs. Higgins recommends you to her neighbor, the first thing that neighbor does is Google your company name. When they see no instant mobile site or call after 5pm and hit voicemail, 78% of them immediately call the next guy. Ava and our 0.6s site protect your word of mouth."'
    },
    tooExpensive: {
      title: 'Objection: "Websites cost $5,000 and marketing guys rip us off..."',
      text: '"I agree with you 100% — traditional agencies charge thousands and take 3 months. That is why we built it already. It is 100% ready to deploy today for ' + (lead.countryCode === 'GB' ? '£997' : '$1,497') + ' flat. If you hate it, tell me to kick rocks and keep your money. If you love it, your phone is protected 24/7."'
    },
    haveFacebook: {
      title: 'Objection: "I already have a Facebook page / Checkatrade / directory..."',
      text: "Facebook and directories are great, but you don\'t own them. Facebook shows ads for your direct competitors right next to your profile. A dedicated 0.6s Google Maps landing page with Ava voice booking converts at 35% higher volume with zero competitor ads."
    },
    sendEmail: {
      title: 'Objection: "Just send me an email..."',
      text: "I can definitely send an email, but my email will sit in your spam with 40 other pitches. Instead, let me text the 30-second live preview to your cell right now. Look at it for 10 seconds. If it\'s trash, block my number. What\'s the best mobile to text?"
    }
  };

  const obj = objections[key];
  if (!obj) return;

  title.textContent = obj.title;
  script.textContent = obj.text;
  box.style.display = 'block';
};

window.copyIntlSmsPitch = function() {
  const lead = window.INTL_CURRENT_SELECTED_LEAD || window.INTERNATIONAL_150_LEADS[0];
  const sms = 'Hey ' + lead.owner + ', Luke here with VantorX. Built a 0.6s mobile website + 24/7 Ava Voice AI booking demo for ' + lead.company + ' in ' + lead.city + '. Check the preview site here: https://vantorxsolutions.com/demo?target=' + encodeURIComponent(lead.company) + ' - If you love it, it is yours today flat. Call me back or test Ava live!';
  navigator.clipboard.writeText(sms).then(() => {
    if (typeof showToast === 'function') showToast('📋 Copied SMS pitch to clipboard!');
  });
};

window.openIntlWebPreview = function() {
  const lead = window.INTL_CURRENT_SELECTED_LEAD || window.INTERNATIONAL_150_LEADS[0];
  window.open('/demo?company=' + encodeURIComponent(lead.company), '_blank');
};

window.saveIntlDisposition = function(leadId, status) {
  localStorage.setItem('vantorx_intl_disp_' + leadId, status);
  if (status === 'CALLBACK') {
    window.openIntlCallbackModal(leadId);
  } else {
    window.renderInternationalLeadsTable();
    if (typeof showToast === 'function') showToast('💾 Saved status: ' + status);
  }
};

window.saveIntlNote = function(leadId, note) {
  localStorage.setItem('vantorx_intl_notes_' + leadId, note);
  if (typeof showToast === 'function') showToast('💾 Saved note');
};

// Callback Modal Engine
window.openIntlCallbackModal = function(leadId) {
  const lead = window.INTERNATIONAL_150_LEADS.find(l => l.id === leadId) || window.INTL_CURRENT_SELECTED_LEAD;
  if (!lead) return;
  window.CURRENT_INTL_CB_LEAD_ID = lead.id;

  const modal = document.getElementById('intlCallbackModal');
  const title = document.getElementById('intlCbModalTitle');
  const sub = document.getElementById('intlCbModalSubtitle');
  const tzInfo = document.getElementById('intlCbModalTzInfo');

  if (title) title.innerHTML = '<span>⏳</span> <span>Schedule Callback: ' + lead.company + '</span>';
  if (sub) sub.textContent = 'Owner: ' + lead.fullOwner + ' · ' + lead.city + ', ' + lead.country + ' · ' + lead.phone;
  if (tzInfo) tzInfo.textContent = 'Local Timezone: ' + lead.timezone + ' (' + lead.tzAbbr + ') · Best US Window: ' + lead.bestUsWindow;

  // Preset time to tomorrow 10am local time
  const tomorrow = new Date(Date.now() + 24 * 3600 * 1000);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd = String(tomorrow.getDate()).padStart(2, '0');
  const dtInput = document.getElementById('intlCbDateTimeInput');
  if (dtInput) dtInput.value = \`\${yyyy}-\${mm}-\${dd}T10:00\`;

  window.calculateIntlCbTimeConversion();
  if (modal) modal.style.display = 'block';
};

window.closeIntlCallbackModal = function() {
  const modal = document.getElementById('intlCallbackModal');
  if (modal) modal.style.display = 'none';
};

window.calculateIntlCbTimeConversion = function() {
  const lead = window.INTERNATIONAL_150_LEADS.find(l => l.id === window.CURRENT_INTL_CB_LEAD_ID);
  if (!lead) return;

  const dtInput = document.getElementById('intlCbDateTimeInput');
  const disp = document.getElementById('intlCbConvertedDisplay');
  if (!dtInput || !disp || !dtInput.value) return;

  const dt = new Date(dtInput.value);
  const usEstTime = dt.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true });
  const usEstDate = dt.toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric' });
  const localTime = dt.toLocaleTimeString('en-US', { timeZone: lead.timezone, hour: 'numeric', minute: '2-digit', hour12: true });
  const localDate = dt.toLocaleDateString('en-US', { timeZone: lead.timezone, weekday: 'short', month: 'short', day: 'numeric' });

  disp.innerHTML = \`
    ⏰ <strong>Time Zone Lock:</strong><br>
    • <strong>Target Local Time (\${lead.country}):</strong> \${localDate} at \${localTime} (\${lead.tzAbbr})<br>
    • <strong>Converted US EST:</strong> \${usEstDate} at \${usEstTime} EST (When Luke dials)
  \`;
};

window.saveIntlCallbackFromModal = function() {
  const id = window.CURRENT_INTL_CB_LEAD_ID;
  if (!id) return;

  const dtVal = document.getElementById('intlCbDateTimeInput') ? document.getElementById('intlCbDateTimeInput').value : '';
  const noteVal = document.getElementById('intlCbNotesInput') ? document.getElementById('intlCbNotesInput').value.trim() : '';

  let readableStr = 'Callback Set';
  if (dtVal) {
    const dt = new Date(dtVal);
    readableStr = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' ' +
                  dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  localStorage.setItem('vantorx_intl_disp_' + id, 'CALLBACK');
  localStorage.setItem('vantorx_intl_cb_' + id, JSON.stringify({
    time: dtVal,
    timeStr: readableStr,
    note: noteVal,
    savedAt: Date.now()
  }));

  window.closeIntlCallbackModal();
  window.renderInternationalLeadsTable();
  if (typeof showToast === 'function') showToast('⏳ Callback scheduled: ' + readableStr);
};

window.clearIntlCallback = function() {
  const id = window.CURRENT_INTL_CB_LEAD_ID;
  if (!id) return;
  localStorage.removeItem('vantorx_intl_cb_' + id);
  localStorage.setItem('vantorx_intl_disp_' + id, 'UNTOUCHED');
  window.closeIntlCallbackModal();
  window.renderInternationalLeadsTable();
  if (typeof showToast === 'function') showToast('Removed callback');
};

window.exportInternationalLeadsCsv = function() {
  const leads = window.INTERNATIONAL_150_LEADS;
  const headers = ['ID', 'Company', 'Owner', 'Full Name', 'Title', 'Country', 'City', 'Area', 'Phone', 'Trade', 'Rating', 'Reviews', 'Website Status', 'Local Bleed', 'Annual Leak Est', 'AI Opportunity', 'Web Offer', 'Timezone', 'TZ Abbr', 'Best US Call Window (EST)', 'Disposition', 'Notes'];
  const rows = [headers.join(',')];

  leads.forEach(l => {
    const disp = localStorage.getItem('vantorx_intl_disp_' + l.id) || 'UNTOUCHED';
    const note = localStorage.getItem('vantorx_intl_notes_' + l.id) || '';
    rows.push([
      l.id,
      '"' + l.company.replace(/"/g, '""') + '"',
      '"' + l.owner.replace(/"/g, '""') + '"',
      '"' + l.fullOwner.replace(/"/g, '""') + '"',
      '"' + l.title.replace(/"/g, '""') + '"',
      '"' + l.country + '"',
      '"' + l.city + '"',
      '"' + l.area + '"',
      '"' + l.phone + '"',
      '"' + l.trade + '"',
      '"' + l.rating + '"',
      l.reviews,
      '"' + l.websiteStatus + '"',
      '"' + l.monthlyBleedLocal + '"',
      '"' + l.annualLeakEst + '"',
      '"' + l.aiOpportunity.replace(/"/g, '""') + '"',
      '"' + l.webOpportunity.replace(/"/g, '""') + '"',
      '"' + l.timezone + '"',
      '"' + l.tzAbbr + '"',
      '"' + l.bestUsWindow + '"',
      '"' + disp + '"',
      '"' + note.replace(/"/g, '""') + '"'
    ].join(','));
  });

  const blob = new Blob([rows.join('\\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vantorx_international_150_leads.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  if (typeof showToast === 'function') showToast('📥 Exported 150 International Leads CSV');
};

window.resetIntlCalls = function() {
  if (!confirm('Are you sure you want to reset all call records for the International Leads on this browser?')) return;
  window.INTERNATIONAL_150_LEADS.forEach(l => {
    localStorage.removeItem('vantorx_intl_disp_' + l.id);
    localStorage.removeItem('vantorx_intl_notes_' + l.id);
    localStorage.removeItem('vantorx_intl_cb_' + l.id);
  });
  window.renderInternationalLeadsTable();
  if (typeof showToast === 'function') showToast('🔄 Reset all international call records');
};

window.resetIntlFilters = function() {
  const search = document.getElementById('intlSearchInput'); if (search) search.value = '';
  const country = document.getElementById('intlCountryFilterSelect'); if (country) country.value = 'all';
  const win = document.getElementById('intlWindowFilterSelect'); if (win) win.value = 'all';
  const trade = document.getElementById('intlTradeFilterSelect'); if (trade) trade.value = 'all';
  const batch = document.getElementById('intlBatchSelect'); if (batch) batch.value = 'all';
  window.INTL_CURRENT_VIEW = 'toCall';
  window.INTL_STATUS_FILTER = 'all';
  window.INTL_OFFER_FILTER = 'all';
  window.renderInternationalLeadsTable();
  if (typeof showToast === 'function') showToast('🔄 Filters reset to all 150 leads');
};
`;

// Insert international script block before closing </script>
const endScriptIdx = html.lastIndexOf('</script>');
if (endScriptIdx === -1) {
  console.error('❌ Could not locate </script> tag in HTML!');
  process.exit(1);
}

// Check if switchTab needs to hook into international rendering
html = html.substring(0, endScriptIdx) + '\n\n' + intlScriptBlock + '\n' + html.substring(endScriptIdx);

// Also hook into switchTab when targetTabId === 'tabNoWebsite'
const switchTabFloridaHook = "if (targetTabId === 'tabNoWebsite') {";
if (html.includes(switchTabFloridaHook)) {
  const newHook = `if (targetTabId === 'tabNoWebsite') {
      if (typeof window.initInternationalWorldClocks === 'function') {
        window.initInternationalWorldClocks();
      }
      if (typeof window.renderInternationalLeadsTable === 'function') {
        window.renderInternationalLeadsTable();
      }`;
  html = html.replace(switchTabFloridaHook, newHook);
  console.log('✅ Hooked initInternationalWorldClocks & renderInternationalLeadsTable into switchTab');
}

// Hook into DOMContentLoaded auto-switch
const autoSwitchTarget = "if (hash === '#tabnowebsite' || hash === '#nowebsite' || hash === '#florida' || tabParam === 'tabNoWebsite') {";
if (html.includes(autoSwitchTarget)) {
  const newAutoSwitch = "if (hash === '#tabnowebsite' || hash === '#nowebsite' || hash === '#international' || hash === '#intl' || hash === '#florida' || tabParam === 'tabNoWebsite' || tabParam === 'tabInternational') {";
  html = html.replace(autoSwitchTarget, newAutoSwitch);
  console.log('✅ Updated checkUrlTabHash to support #international and #intl');
}

fs.writeFileSync(arenaHtmlPath, html, 'utf8');
console.log('🎉 Successfully injected International Private Tab into:', arenaHtmlPath);
console.log('New Arena HTML length:', html.length);
