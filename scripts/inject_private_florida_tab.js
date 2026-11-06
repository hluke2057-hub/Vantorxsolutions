const fs = require('fs');
const path = require('path');
const vm = require('vm');

const arenaHtmlPath = path.join(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
const leadsJsonPath = path.join(__dirname, '..', 'data', 'florida_100_no_website_leads.json');

const leadsData = JSON.parse(fs.readFileSync(leadsJsonPath, 'utf8'));
let html = fs.readFileSync(arenaHtmlPath, 'utf8');

console.log('Original Arena HTML length:', html.length);

// 1. ADD TAB BUTTON in .tabs if not already present
if (!html.includes('id="tabBtnNoWebsite"')) {
  const tabButtonHtml = `    <button class="tab-btn" type="button" id="tabBtnNoWebsite" data-tab="tabNoWebsite" onclick="switchTab('tabNoWebsite')" style="border: 1.5px solid rgba(245,158,11,0.6); background: linear-gradient(135deg, rgba(245,158,11,0.22), rgba(239,68,68,0.14)); color: #fbbf24; font-weight: 800; letter-spacing: 0.02em; box-shadow: 0 0 14px rgba(245,158,11,0.25);">🔒 Private: Florida No-Website Targets (100 FL Businesses)</button>\n`;
  const tabsTarget = `<button class="tab-btn" type="button" id="tabBtnAcademy" data-tab="tabAcademy" onclick="switchTab('tabAcademy')">🎓 Closer Training &amp; Objections</button>`;
  
  if (html.includes(tabsTarget)) {
    html = html.replace(tabsTarget, () => tabsTarget + '\n' + tabButtonHtml);
    console.log('✅ Injected tabBtnNoWebsite into .tabs navigation');
  } else {
    console.error('❌ Could not find tabsTarget in HTML');
  }
}

// 2. ADD TAB PANEL #tabNoWebsite before #tabTeamCalls
if (!html.includes('id="tabNoWebsite"')) {
  const teamCallsTarget = '<div id="tabTeamCalls" class="tab-panel">';
  
  const floridaPanelHtml = `
  <!-- TAB: 🔒 PRIVATE OWNER WORKBENCH: 100 FLORIDA NO-WEBSITE CONTRACTORS -->
  <div id="tabNoWebsite" class="tab-panel">
    
    <!-- 🔒 PRIVATE SECURITY & EXCLUSIVITY HEADER -->
    <div class="fl-owner-header-card">
      <div class="fl-owner-top-row">
        <div class="fl-owner-badge">
          <span class="fl-pulse-dot"></span>
          <span>🔒 CONFIDENTIAL OWNER WORKBENCH · EXCLUSIVE TO LUKE</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <button type="button" class="btn btn-gold btn-sm" onclick="exportFloridaLeadsCsv()" style="font-weight:800;display:inline-flex;align-items:center;gap:6px">
            <span>📥</span> <span>Download 100 FL Leads (.CSV)</span>
          </button>
          <button type="button" class="btn btn-ghost btn-sm" onclick="resetFloridaFilters()" style="border:1px solid rgba(255,255,255,0.2);color:#cbd5e1">
            <span>🔄</span> <span>Reset Filters</span>
          </button>
        </div>
      </div>

      <h1 class="fl-owner-title">100 Florida Trade Contractors with ZERO Website Presence</h1>
      <p class="fl-owner-sub">
        Every business below has <strong>verified 4.5★ to 5.0★ Google reviews</strong> and active local phone lines, but <strong>NO website</strong> on Google Maps or online. They lose over 50% of mobile inquiries to competitors. Pitching them an instant, mobile-optimized contractor site is the highest-converting offer in Florida local B2B.
      </p>

      <!-- METRICS RIBBON -->
      <div class="fl-metrics-grid">
        <div class="fl-metric-card">
          <div class="fl-metric-num" id="flStatTotalCount">100</div>
          <div class="fl-metric-label">Florida Targets (0 Websites)</div>
        </div>
        <div class="fl-metric-card">
          <div class="fl-metric-num" style="color:#ef4444">$1,420,000</div>
          <div class="fl-metric-label">Est. Monthly Lost Rev (All 100)</div>
        </div>
        <div class="fl-metric-card">
          <div class="fl-metric-num" style="color:#fbbf24">4.83★</div>
          <div class="fl-metric-label">Avg Google Reputation</div>
        </div>
        <div class="fl-metric-card">
          <div class="fl-metric-num" style="color:#34d399">$997 / $2.5k</div>
          <div class="fl-metric-label">Target Website Offer</div>
        </div>
        <div class="fl-metric-card">
          <div class="fl-metric-num" style="color:#38bdf8" id="flStatClosedCount">0</div>
          <div class="fl-metric-label">Sites Closed Today</div>
        </div>
      </div>
    </div>

    <!-- 🎯 "EASY AS FUCK" COLD CALL WEBSITE PITCH BATTLECARD & TELEPROMPTER -->
    <div class="fl-battlecard-box" id="flPitchBattlecardSection">
      <div class="fl-battlecard-header">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:22px">📜</span>
          <div>
            <h3 style="font-family:var(--font-head);font-size:17.5px;font-weight:800;color:#fbbf24;margin:0">
              The 30-Second "Zero-Resistance" Website Cold Call Pitch
            </h3>
            <div style="font-size:12px;color:#94a3b8;margin-top:2px">
              Word-for-word Florida contractor script with live dynamic tags &amp; instant objection crushers.
            </div>
          </div>
        </div>
        <div class="fl-active-target-pill" id="flActiveTargetPill">
          <span>Targeting:</span> <strong id="flActiveTargetName">Tampa Bay Precision Plumbing (Dave Miller)</strong>
        </div>
      </div>

      <!-- SCRIPT GRID: 3 PHASES -->
      <div class="fl-script-phases-grid">
        <!-- Phase 1: Hook -->
        <div class="fl-phase-card">
          <div class="fl-phase-header">
            <span class="fl-phase-tag">PHASE 1 · 10 SECONDS</span>
            <span class="fl-phase-name">The "Drop the Ball" Hook</span>
          </div>
          <div class="fl-phase-text" id="flScriptHookText">
            "Hey <em class="fl-tag-owner">Dave</em>, Luke over at VantorX. Look, I'll be blunt — I was looking at <strong class="fl-tag-company">Tampa Bay Precision Plumbing</strong> on Google Maps here in <span class="fl-tag-city">Tampa</span>. You have <em class="fl-tag-rating">4.8★ and 31 reviews</em>, but you literally don't have a website link. Were you guys doing that on purpose, or did someone drop the ball on your online profile?"
          </div>
          <div class="fl-phase-delivery">
            💡 <em>Delivery:</em> Casual, direct, zero sales pitch tone. 90% of owners answer: "We just haven't gotten around to it" or "We get all our work word-of-mouth."
          </div>
        </div>

        <!-- Phase 2: The Bleed -->
        <div class="fl-phase-card">
          <div class="fl-phase-header">
            <span class="fl-phase-tag" style="color:#ef4444;border-color:rgba(239,68,68,0.4)">PHASE 2 · 10 SECONDS</span>
            <span class="fl-phase-name">The Revenue Bleed</span>
          </div>
          <div class="fl-phase-text" id="flScriptBleedText">
            "Here's why I'm calling: right now when a homeowner's <span class="fl-tag-trade-issue">water heater bursts or sewer backs up</span> at 8 PM, 80% tap the website button on their phone to check emergency pricing. Because you don't have one, Google pushes them straight to your competitor down the road. You're easily losing <strong class="fl-tag-loss" style="color:#ef4444">$9,500</strong> every single month in emergency jobs."
          </div>
          <div class="fl-phase-delivery">
            💡 <em>Delivery:</em> Firm and factual. Mention their exact trade and estimated monthly loss.
          </div>
        </div>

        <!-- Phase 3: The Close -->
        <div class="fl-phase-card">
          <div class="fl-phase-header">
            <span class="fl-phase-tag" style="color:#10b981;border-color:rgba(16,185,129,0.4)">PHASE 3 · 10 SECONDS</span>
            <span class="fl-phase-name">The Zero-Resistance Close</span>
          </div>
          <div class="fl-phase-text" id="flScriptCloseText">
            "I actually already built a mobile preview site for <strong class="fl-tag-company">Tampa Bay Precision Plumbing</strong> that loads in 0.8 seconds with an instant emergency booking form. Can I text the demo link to your cell right now? If you hate it, tell me to kick rocks and you'll never hear from me again. If you love it, it's yours today for <strong style="color:#34d399">$997 flat</strong>. What's the best cell to text that to?"
          </div>
          <div class="fl-phase-delivery">
            💡 <em>Delivery:</em> Relaxed confidence. Offer zero risk: "If you hate it, tell me to kick rocks."
          </div>
        </div>
      </div>

      <!-- OBJECTION CRUSHERS & QUICK SMS ACTION -->
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.08)">
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" class="fl-obj-btn" onclick="toggleFloridaObjection('wordOfMouth')">
            🛡️ "Word of Mouth"
          </button>
          <button type="button" class="fl-obj-btn" onclick="toggleFloridaObjection('tooExpensive')">
            🛡️ "Websites Cost $5,000"
          </button>
          <button type="button" class="fl-obj-btn" onclick="toggleFloridaObjection('facebookPage')">
            🛡️ "I Have Facebook"
          </button>
          <button type="button" class="fl-obj-btn" onclick="toggleFloridaObjection('sendEmail')">
            🛡️ "Send Me an Email"
          </button>
        </div>

        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button type="button" class="btn btn-secondary btn-sm" onclick="copyFloridaSmsPitch()" style="font-weight:700">
            <span>📋</span> <span>Copy SMS Demo Pitch</span>
          </button>
          <button type="button" class="btn btn-gold btn-sm" onclick="openCurrentTargetSiteDemo()" style="font-weight:800;box-shadow:0 0 12px rgba(245,158,11,0.3)">
            <span>🌐</span> <span>Open Live Website Preview</span>
          </button>
        </div>
      </div>

      <!-- OBJECTION CONTENT BOX (EXPANDABLE) -->
      <div id="flObjectionDetails" class="fl-objection-reveal-box" style="display:none">
        <div class="fl-obj-box-title" id="flObjTitle">Objection Handler</div>
        <div class="fl-obj-box-script" id="flObjScript">Objection rebuttal script goes here.</div>
      </div>
    </div>

    <!-- 🔍 FILTER & SEARCH BAR -->
    <div class="fl-filter-strip">
      <div class="fl-search-wrap">
        <span class="fl-search-icon">🔍</span>
        <input type="text" id="flSearchInput" class="fl-search-input" placeholder="Search by Contractor Name, Owner, City, Trade, Phone, or Zip..." oninput="handleFloridaFilterChange()" />
      </div>

      <div class="fl-filter-dropdowns">
        <!-- Metro Region -->
        <select id="flMetroSelect" class="fl-select" onchange="handleFloridaFilterChange()">
          <option value="ALL">🌴 All Florida Regions (100 Targets)</option>
          <option value="Tampa Bay">⚡ Tampa Bay / St. Pete (813 / 727)</option>
          <option value="Central FL">🚀 Orlando / Central FL (407 / 352)</option>
          <option value="South FL">☀️ Miami / Fort Lauderdale (305 / 954)</option>
          <option value="Palm Beach">🏖️ Palm Beach / Boca Raton (561)</option>
          <option value="SW Florida">🌊 Cape Coral / Naples / Sarasota (239 / 941)</option>
          <option value="North FL">⚓ Jacksonville / Tallahassee (904 / 850)</option>
        </select>

        <!-- Trade -->
        <select id="flTradeSelect" class="fl-select" onchange="handleFloridaFilterChange()">
          <option value="ALL">🔧 All Trades (Roofing, Plumbing, HVAC...)</option>
          <option value="Plumbing">Plumbing (11)</option>
          <option value="Roofing">Roofing (10)</option>
          <option value="HVAC">HVAC &amp; AC Repair (12)</option>
          <option value="Electrical">Electrical (11)</option>
          <option value="Tree Service">Tree Service (9)</option>
          <option value="Garage Doors">Garage Doors (7)</option>
          <option value="Pavers">Pavers &amp; Hardscaping (7)</option>
          <option value="Septic">Septic &amp; Sewer (4)</option>
          <option value="Pressure Washing">Pressure Washing (3)</option>
        </select>

        <!-- Disposition Filter -->
        <select id="flDispositionSelect" class="fl-select" onchange="handleFloridaFilterChange()">
          <option value="ALL">All Call Statuses</option>
          <option value="UNTOUCHED">⚪ Not Called Yet</option>
          <option value="SPOKE">🟡 Spoke to Owner</option>
          <option value="SENT_DEMO">🔵 Sent Demo SMS</option>
          <option value="CLOSED">🟢 Closed $997 Site!</option>
          <option value="NOT_INTERESTED">🔴 Not Interested</option>
        </select>
      </div>
    </div>

    <!-- 📊 100 FLORIDA LEADS INTERACTIVE TABLE -->
    <div class="fl-table-container">
      <div class="fl-table-status-bar">
        <div>
          Showing <strong id="flShowingCount" style="color:#fbbf24">100</strong> of 100 Florida Targets without Websites
        </div>
        <div style="font-size:12px;color:#94a3b8">
          💡 Click <strong>"📞 Pitch"</strong> to populate teleprompter · Click <strong>"🌐 Live Preview"</strong> to launch demo mockup
        </div>
      </div>

      <div class="fl-table-scroll">
        <table class="excel-table fl-table">
          <thead>
            <tr>
              <th style="width:45px">#</th>
              <th>Company &amp; Owner</th>
              <th>Trade &amp; Google Rating</th>
              <th>Florida Metro / City</th>
              <th>Verified Phone (Direct)</th>
              <th>Status</th>
              <th>Est. Monthly Bleed</th>
              <th style="min-width:180px">Pitch &amp; Demo Actions</th>
              <th style="min-width:140px">Disposition</th>
              <th style="min-width:160px">Call Notes</th>
            </tr>
          </thead>
          <tbody id="flLeadsTableBody">
            <!-- Dynamically populated by renderFloridaLeadsTable() -->
          </tbody>
        </table>
      </div>
    </div>

  </div>
  \n`;

  if (html.includes(teamCallsTarget)) {
    html = html.replace(teamCallsTarget, () => floridaPanelHtml + teamCallsTarget);
    console.log('✅ Injected #tabNoWebsite panel before #tabTeamCalls');
  } else {
    console.error('❌ Could not find teamCallsTarget in HTML');
  }
}

// 3. ADD MODAL #flSiteDemoModal before </body>
if (!html.includes('id="flSiteDemoModal"')) {
  const modalHtml = `
<!-- ============================================================== -->
<!-- 🌐 LIVE CONTRACTOR WEBSITE PREVIEW MODAL (INTERACTIVE DEMO)     -->
<!-- ============================================================== -->
<div id="flSiteDemoModal" class="fl-modal-backdrop" style="display:none" onclick="if(event.target===this)closeContractorSiteDemo()">
  <div class="fl-modal-window">
    
    <!-- Modal Control Bar -->
    <div class="fl-modal-bar">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:18px">🌐</span>
        <div>
          <h3 id="flModalSiteTitle" style="font-family:var(--font-head);font-size:16px;font-weight:800;color:#ffffff;margin:0">
            Tampa Bay Precision Plumbing — Mobile Demo
          </h3>
          <div style="font-size:11px;color:#94a3b8" id="flModalSiteMeta">
            0.8s Ultra-Fast Mobile Landing Page · 1-Tap Emergency Lead Booking · Florida Trade Certified
          </div>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:10px">
        <!-- View Toggle: Mobile vs Desktop -->
        <div class="fl-device-toggle">
          <button type="button" class="fl-device-btn active" id="btnDeviceMobile" onclick="setDemoDeviceMode('mobile')">📱 iPhone Mobile</button>
          <button type="button" class="fl-device-btn" id="btnDeviceDesktop" onclick="setDemoDeviceMode('desktop')">💻 Desktop 1080p</button>
        </div>

        <button type="button" class="btn btn-gold btn-sm" onclick="copyFloridaSmsPitch()" style="font-weight:700">
          <span>📋</span> <span>Copy SMS Link</span>
        </button>

        <button type="button" class="fl-modal-close" onclick="closeContractorSiteDemo()" title="Close Preview">✕</button>
      </div>
    </div>

    <!-- Modal Content Stage -->
    <div class="fl-modal-stage" id="flModalStage">
      
      <!-- Responsive Contractor Website Container -->
      <div class="fl-site-frame mode-mobile" id="flSiteFrame">
        
        <!-- Site Header -->
        <header class="demo-site-header">
          <div class="demo-brand">
            <span class="demo-logo-icon" id="demoSiteTradeIcon">🔧</span>
            <div>
              <div class="demo-site-name" id="demoSiteName">Tampa Bay Precision Plumbing</div>
              <div class="demo-site-city" id="demoSiteCity">Tampa, FL · Licensed &amp; Insured</div>
            </div>
          </div>
          <a href="#" id="demoSiteCallBtn" class="demo-header-call-btn">
            <span>📞 Call</span> <span id="demoSiteHeaderPhone">(813) 449-2180</span>
          </a>
        </header>

        <!-- Emergency Banner -->
        <div class="demo-emergency-banner">
          <span>🚨 24/7 RAPID DISPATCH:</span> Average Arrival Time Under 45 Mins in <span id="demoSiteBannerCity">Tampa</span>
        </div>

        <!-- Site Hero Section -->
        <section class="demo-hero">
          <div class="demo-rating-pill" id="demoSiteRating">
            ⭐ 4.8 / 5.0 (31 Google Reviews) · Verified Florida Trade Pro
          </div>
          <h1 class="demo-hero-title" id="demoSiteHeroTitle">
            Tampa's Premier Emergency Plumbing Specialists
          </h1>
          <p class="demo-hero-sub" id="demoSiteHeroSub">
            Fast, reliable service when disaster strikes. Licensed master plumbers, upfront pricing, zero overtime charges on weekends.
          </p>

          <div style="display:flex;gap:10px;justify-content:center;margin-top:16px;flex-wrap:wrap">
            <a href="#" id="demoHeroCallBtn" class="demo-cta-primary">
              ⚡ Call Now: <span id="demoHeroPhone">(813) 449-2180</span>
            </a>
            <a href="#quoteForm" class="demo-cta-secondary">
              📅 Book Online (90s Callback)
            </a>
          </div>
        </section>

        <!-- Quick Trust Badges -->
        <div class="demo-trust-row">
          <div class="demo-trust-item"><span>⚡</span> <span>0.8s Load Speed</span></div>
          <div class="demo-trust-item"><span>🛡️</span> <span>FL State Licensed</span></div>
          <div class="demo-trust-item"><span>⭐</span> <span>100% Guaranteed</span></div>
          <div class="demo-trust-item"><span>💬</span> <span>SMS Lead Alerts</span></div>
        </div>

        <!-- Interactive Lead Capture Form -->
        <section class="demo-quote-section" id="quoteForm">
          <div class="demo-quote-card">
            <div class="demo-quote-badge">⚡ 90-SECOND RESPONSE GUARANTEE</div>
            <h3 style="color:#ffffff;font-size:18px;margin:4px 0 6px">Request Fast Service Quote</h3>
            <p style="color:#94a3b8;font-size:12px;margin-bottom:14px">Get an immediate call &amp; dispatch confirmation from our team.</p>

            <form onsubmit="event.preventDefault(); alert('Demo Form Submitted! In live mode, this sends an instant SMS to the contractor and rings Ava Voice AI.');" style="display:flex;flex-direction:column;gap:10px">
              <input type="text" placeholder="Your Name" value="Homeowner (Demo)" class="demo-input" required />
              <input type="tel" placeholder="Your Cell Phone Number" value="(813) 555-0199" class="demo-input" required />
              <input type="text" placeholder="Service Address (Tampa, FL)" value="3820 W Gandy Blvd" class="demo-input" required />
              <select class="demo-input">
                <option>Emergency Repair Needed ASAP</option>
                <option>Free Replacement Quote</option>
                <option>Scheduled Inspection</option>
              </select>
              <button type="submit" class="demo-submit-btn">
                🚀 SEND SERVICE REQUEST (90S RESPONSE)
              </button>
            </form>
          </div>
        </section>

        <!-- Site Footer -->
        <footer class="demo-site-footer">
          <div style="font-weight:700;color:#cbd5e1" id="demoFooterName">Tampa Bay Precision Plumbing</div>
          <div style="font-size:11px;color:#64748b;margin-top:4px">
            Powered by VantorX High-Velocity Mobile Infrastructure · Built for Florida Contractors
          </div>
        </footer>

      </div>

    </div>

  </div>
</div>
`;

  const bodyCloseTarget = `</body>`;
  if (html.includes(bodyCloseTarget)) {
    html = html.replace(bodyCloseTarget, () => modalHtml + '\n' + bodyCloseTarget);
    console.log('✅ Injected #flSiteDemoModal into cold-call-arena/index.html');
  } else {
    console.error('❌ Could not find bodyCloseTarget in HTML');
  }
}

// 4. ADD CSS STYLES for Private Tab & Modal
if (!html.includes('.fl-owner-header-card')) {
  const floridaCss = `
<style>
/* ============================================================== */
/* 🔒 PRIVATE TAB: 100 FLORIDA NO-WEBSITE CONTRACTORS STYLING     */
/* ============================================================== */
.fl-owner-header-card {
  background: linear-gradient(135deg, rgba(20, 27, 45, 0.98), rgba(15, 23, 42, 0.98));
  border: 1.5px solid rgba(245, 158, 11, 0.4);
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 22px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(245, 158, 11, 0.1);
  position: relative;
}
.fl-owner-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}
.fl-owner-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(245, 158, 11, 0.16);
  border: 1px solid rgba(245, 158, 11, 0.5);
  color: #fbbf24;
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 999px;
  letter-spacing: 0.05em;
}
.fl-pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 8px #fbbf24;
  animation: pulse 1.4s infinite alternate;
}
.fl-owner-title {
  font-family: var(--font-head);
  font-size: 24px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px;
  letter-spacing: -0.01em;
}
.fl-owner-sub {
  font-size: 13.5px;
  color: #94a3b8;
  max-width: 900px;
  line-height: 1.5;
  margin: 0 0 18px;
}
.fl-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}
.fl-metric-card {
  background: rgba(15, 21, 34, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px 16px;
  text-align: center;
}
.fl-metric-num {
  font-family: var(--font-head);
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
}
.fl-metric-label {
  font-size: 11px;
  color: #94a3b8;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-top: 2px;
}

/* Battlecard & Script Box */
.fl-battlecard-box {
  background: var(--bg2);
  border: 1.5px solid rgba(245, 158, 11, 0.3);
  border-radius: 16px;
  padding: 22px;
  margin-bottom: 22px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
}
.fl-battlecard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 16px;
}
.fl-active-target-pill {
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.35);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12.5px;
  color: #cbd5e1;
}
.fl-active-target-pill strong {
  color: #fbbf24;
}
.fl-script-phases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 14px;
}
.fl-phase-card {
  background: rgba(15, 21, 34, 0.7);
  border: 1px solid var(--line2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}
.fl-phase-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.fl-phase-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 800;
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.4);
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}
.fl-phase-name {
  font-size: 12.5px;
  font-weight: 700;
  color: #ffffff;
}
.fl-phase-text {
  font-size: 14px;
  line-height: 1.55;
  color: #e2e8f0;
  flex: 1;
}
.fl-phase-text em {
  font-style: normal;
  color: #fbbf24;
  font-weight: 700;
}
.fl-phase-text strong {
  color: #38bdf8;
  font-weight: 700;
}
.fl-phase-delivery {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 10px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  padding-top: 8px;
  font-style: italic;
}
.fl-obj-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}
.fl-obj-btn:hover {
  background: rgba(245, 158, 11, 0.15);
  border-color: #fbbf24;
  color: #fbbf24;
}
.fl-objection-reveal-box {
  background: rgba(15, 21, 34, 0.95);
  border: 1px solid rgba(245, 158, 11, 0.4);
  border-radius: 10px;
  padding: 14px;
  margin-top: 12px;
}
.fl-obj-box-title {
  font-size: 12px;
  font-weight: 800;
  color: #fbbf24;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.fl-obj-box-script {
  font-size: 13.5px;
  color: #ffffff;
  line-height: 1.55;
}

/* Filter Strip */
.fl-filter-strip {
  background: var(--bg2);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.fl-search-wrap {
  position: relative;
  flex: 1;
  min-width: 260px;
}
.fl-search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  color: #64748b;
}
.fl-search-input {
  width: 100%;
  box-sizing: border-box;
  background: var(--bg);
  border: 1px solid var(--line2);
  border-radius: 8px;
  padding: 9px 12px 9px 34px;
  color: #ffffff;
  font-size: 13.5px;
}
.fl-search-input:focus {
  outline: none;
  border-color: #fbbf24;
}
.fl-filter-dropdowns {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.fl-select {
  background: var(--bg);
  border: 1px solid var(--line2);
  color: #ffffff;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 12.5px;
  cursor: pointer;
}
.fl-select:focus {
  outline: none;
  border-color: #fbbf24;
}

/* Table Container & Styling */
.fl-table-container {
  background: var(--bg2);
  border: 1px solid var(--line2);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.35);
}
.fl-table-status-bar {
  padding: 12px 18px;
  background: rgba(15, 21, 34, 0.95);
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 13px;
  color: #cbd5e1;
}
.fl-table-scroll {
  overflow-x: auto;
  max-height: 700px;
}
.fl-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.fl-table th {
  position: sticky;
  top: 0;
  background: #0f172a;
  z-index: 10;
  padding: 10px 12px;
  text-align: left;
  font-family: var(--font-mono);
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid var(--line);
}
.fl-table td {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: middle;
}
.fl-table tr:hover td {
  background: rgba(245, 158, 11, 0.04);
}
.fl-badge-noweb {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #f87171;
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.03em;
}
.fl-tel-link {
  color: #38bdf8;
  font-family: var(--font-mono);
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.fl-tel-link:hover {
  text-decoration: underline;
  color: #fbbf24;
}
.fl-btn-action {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #fbbf24;
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}
.fl-btn-action:hover {
  background: #f59e0b;
  color: #070a0f;
}
.fl-disposition-select {
  background: var(--bg);
  border: 1px solid var(--line2);
  color: #ffffff;
  padding: 4px 6px;
  border-radius: 6px;
  font-size: 11.5px;
  cursor: pointer;
}
.fl-note-input {
  width: 100%;
  box-sizing: border-box;
  background: var(--bg);
  border: 1px solid var(--line);
  color: #cbd5e1;
  font-size: 11px;
  padding: 4px 6px;
  border-radius: 4px;
}
.fl-note-input:focus {
  outline: none;
  border-color: #fbbf24;
  color: #ffffff;
}

/* Modal Styling */
.fl-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.fl-modal-window {
  background: #0f172a;
  border: 1.5px solid rgba(245, 158, 11, 0.4);
  border-radius: 20px;
  width: 100%;
  max-width: 960px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(245, 158, 11, 0.2);
}
.fl-modal-bar {
  background: rgba(15, 23, 42, 0.98);
  border-bottom: 1px solid var(--line);
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.fl-device-toggle {
  display: flex;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--line2);
  border-radius: 8px;
  padding: 2px;
}
.fl-device-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
}
.fl-device-btn.active {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}
.fl-modal-close {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fl-modal-close:hover {
  background: #ef4444;
  border-color: #ef4444;
}
.fl-modal-stage {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  justify-content: center;
  background: #020617;
}

/* Site Frame Mockup */
.fl-site-frame {
  background: #0b0f19;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8);
  transition: all 0.25s ease;
}
.fl-site-frame.mode-mobile {
  width: 380px;
  border: 8px solid #1e293b;
  border-radius: 36px;
}
.fl-site-frame.mode-desktop {
  width: 100%;
  max-width: 860px;
  border: 2px solid #1e293b;
}

/* Mockup Elements */
.demo-site-header {
  background: rgba(15, 23, 42, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.demo-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.demo-logo-icon {
  width: 32px;
  height: 32px;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid #f59e0b;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.demo-site-name {
  font-weight: 800;
  font-size: 13.5px;
  color: #ffffff;
}
.demo-site-city {
  font-size: 10.5px;
  color: #94a3b8;
}
.demo-header-call-btn {
  background: #10b981;
  color: #070a0f;
  font-weight: 800;
  font-size: 11px;
  padding: 6px 10px;
  border-radius: 6px;
  text-decoration: none;
  white-space: nowrap;
}
.demo-emergency-banner {
  background: linear-gradient(90deg, #dc2626, #ea580c);
  color: #ffffff;
  font-size: 10.5px;
  font-weight: 800;
  padding: 6px 12px;
  text-align: center;
  letter-spacing: 0.04em;
}
.demo-hero {
  padding: 24px 18px;
  text-align: center;
  background: radial-gradient(circle at top, rgba(245, 158, 11, 0.12), transparent 70%);
}
.demo-rating-pill {
  display: inline-block;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #fbbf24;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
  margin-bottom: 12px;
}
.demo-hero-title {
  font-family: var(--font-head);
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px;
  line-height: 1.3;
}
.demo-hero-sub {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0 0 16px;
}
.demo-cta-primary {
  background: #f59e0b;
  color: #070a0f;
  font-weight: 800;
  font-size: 12px;
  padding: 10px 16px;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.demo-cta-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-weight: 700;
  font-size: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  text-decoration: none;
}
.demo-trust-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 10px;
}
.demo-trust-item {
  font-size: 10.5px;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 4px;
}
.demo-quote-section {
  padding: 20px 18px;
}
.demo-quote-card {
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 14px;
  padding: 16px;
  text-align: center;
}
.demo-quote-badge {
  font-size: 10px;
  font-family: var(--font-mono);
  font-weight: 800;
  color: #10b981;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}
.demo-input {
  width: 100%;
  box-sizing: border-box;
  background: #020617;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
}
.demo-input:focus {
  outline: none;
  border-color: #f59e0b;
}
.demo-submit-btn {
  background: linear-gradient(90deg, #f59e0b, #d97706);
  color: #070a0f;
  font-weight: 800;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  letter-spacing: 0.03em;
}
.demo-site-footer {
  background: #020617;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 14px 16px;
  text-align: center;
}
</style>
`;
  html = html.replace('</head>', () => floridaCss + '\n</head>');
  console.log('✅ Injected Florida Private Tab CSS into <head>');
}

// 5. INJECT JAVASCRIPT LOGIC AND DATA before window.resetUiZoom
if (!html.includes('window.FLORIDA_100_NO_WEBSITE_LEADS')) {
  const floridaJs = `
  // ==============================================================
  // 🔒 PRIVATE OWNER DATA: 100 FLORIDA NO-WEBSITE TRADE LEADS
  // ==============================================================
  window.FLORIDA_100_NO_WEBSITE_LEADS = ${JSON.stringify(leadsData, null, 2)};
  window.FL_CURRENT_SELECTED_LEAD = window.FLORIDA_100_NO_WEBSITE_LEADS[0];

  const FL_OBJECTIONS = {
    wordOfMouth: {
      title: "Objection: 'I get all my business by word-of-mouth / I don't need a website'",
      script: "Dave, that's literally why you have 4.8 stars, and that's awesome. But when your best client recommends you to their neighbor, that neighbor STILL Googles 'Tampa Bay Precision Plumbing' on their phone to get your number or send your link to their husband. When they see NO website link, they assume you might be retired or out of business, and they call the next guy down the street. A clean 1-page mobile site protects your word-of-mouth and stops the bleed."
    },
    tooExpensive: {
      title: "Objection: 'Websites cost $3,000 to $5,000, I'm not spending that right now'",
      script: "Traditional agencies charge $5,000 and drag it out for 4 months because they have 10 account managers. Because we build exclusively for Florida trades, it is flat $997 out the door — zero hidden agency fees. One emergency water heater repipe or sewer snaking pays for the entire site in 24 hours. And it is already 90% built right now on my screen."
    },
    facebookPage: {
      title: "Objection: 'I already have a Facebook page or Yelp listing'",
      script: "Facebook is great for friends, Dave. But when a homeowner's AC compressor dies on a 98-degree Sunday afternoon, nobody opens Facebook to search for an HVAC contractor — they open Google Maps. And Google actively de-ranks profiles that lack a dedicated domain website. Having your own mobile-first site puts you directly into Google's Local 3-Pack where 82% of calls originate."
    },
    sendEmail: {
      title: "Objection: 'Just send me an email with the information'",
      script: "Contractors get 400 spam emails a week, Dave, and you're busy running calls. I have the live preview of Tampa Bay Precision Plumbing open on my screen right now. Let me text you the 1-click preview link from my direct cell while I have you on the line. Take 15 seconds to look at it on your phone — if you hate it, tell me to kick rocks. What's the best cell to text that to?"
    }
  };

  // Render Leads Table
  window.renderFloridaLeadsTable = function() {
    const tbody = document.getElementById('flLeadsTableBody');
    if (!tbody) return;

    const query = (document.getElementById('flSearchInput')?.value || '').toLowerCase().trim();
    const metro = document.getElementById('flMetroSelect')?.value || 'ALL';
    const trade = document.getElementById('flTradeSelect')?.value || 'ALL';
    const disposition = document.getElementById('flDispositionSelect')?.value || 'ALL';

    const leads = window.FLORIDA_100_NO_WEBSITE_LEADS;
    let filtered = leads.filter(l => {
      // Search query
      if (query) {
        const hay = (l.company + ' ' + l.owner + ' ' + l.city + ' ' + l.trade + ' ' + l.phone + ' ' + l.zip + ' ' + l.pitchAngle).toLowerCase();
        if (!hay.includes(query)) return false;
      }
      // Metro
      if (metro !== 'ALL') {
        if (metro === 'Tampa Bay' && !['Tampa', 'St. Petersburg', 'Brandon', 'Clearwater', 'Largo'].includes(l.city)) return false;
        if (metro === 'Central FL' && !['Orlando', 'Kissimmee', 'Sanford', 'Ocala'].includes(l.city)) return false;
        if (metro === 'South FL' && !['Miami', 'Fort Lauderdale', 'Pompano Beach', 'Hollywood', 'Hialeah'].includes(l.city)) return false;
        if (metro === 'Palm Beach' && !['Boca Raton', 'Delray Beach', 'Boynton Beach', 'West Palm Beach', 'Jupiter', 'Tequesta'].includes(l.city)) return false;
        if (metro === 'SW Florida' && !['Cape Coral', 'Fort Myers', 'Naples', 'Sarasota', 'Bradenton'].includes(l.city)) return false;
        if (metro === 'North FL' && !['Jacksonville', 'Pensacola', 'Tallahassee', 'Panama City'].includes(l.city)) return false;
      }
      // Trade
      if (trade !== 'ALL' && !l.trade.toLowerCase().includes(trade.toLowerCase())) return false;

      // Disposition
      const savedStatus = localStorage.getItem('vantorx_fl_disp_' + l.id) || 'UNTOUCHED';
      if (disposition !== 'ALL' && savedStatus !== disposition) return false;

      return true;
    });

    const showingCountEl = document.getElementById('flStatTotalCount');
    if (showingCountEl) showingCountEl.textContent = leads.length;
    const showEl = document.getElementById('flShowingCount');
    if (showEl) showEl.textContent = filtered.length;

    // Count closed
    let closedCount = 0;
    leads.forEach(l => {
      if (localStorage.getItem('vantorx_fl_disp_' + l.id) === 'CLOSED') closedCount++;
    });
    const closedCountEl = document.getElementById('flStatClosedCount');
    if (closedCountEl) closedCountEl.textContent = closedCount;

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:30px;color:#94a3b8">No matching Florida contractors found. Adjust your search or filters.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map((l, idx) => {
      const savedDisp = localStorage.getItem('vantorx_fl_disp_' + l.id) || 'UNTOUCHED';
      const savedNote = localStorage.getItem('vantorx_fl_notes_' + l.id) || '';
      const isSelected = window.FL_CURRENT_SELECTED_LEAD && window.FL_CURRENT_SELECTED_LEAD.id === l.id;

      return \`
        <tr style="\${isSelected ? 'background:rgba(245,158,11,0.12);' : ''}">
          <td style="font-family:monospace;color:#64748b">\${idx + 1}</td>
          <td>
            <div style="font-weight:800;color:#ffffff">\${l.company}</div>
            <div style="font-size:11px;color:#94a3b8">Owner: <strong style="color:#fbbf24">\${l.owner}</strong> (\${l.employees} staff)</div>
          </td>
          <td>
            <div style="font-weight:700;color:#38bdf8">\${l.trade}</div>
            <div style="font-size:11px;color:#fbbf24">\${l.rating}</div>
          </td>
          <td>
            <div style="font-weight:600;color:#cbd5e1">\${l.city}, FL \${l.zip}</div>
            <div style="font-size:10.5px;color:#64748b">\${l.address}</div>
          </td>
          <td>
            <a href="tel:\${l.phone.replace(/[^0-9]/g, '')}" class="fl-tel-link" onclick="handleFloridaDialClick('\${l.id}', '\${l.phone}')">
              <span>📞</span> <span>\${l.phone}</span>
            </a>
            <button type="button" onclick="copyFloridaPhone('\${l.phone}')" style="background:none;border:none;color:#64748b;font-size:10px;cursor:pointer;margin-left:4px" title="Copy Number">📋</button>
          </td>
          <td>
            <span class="fl-badge-noweb">🚨 NO WEBSITE</span>
            <div style="font-size:10px;color:#64748b;margin-top:2px">Maps &amp; Phone Only</div>
          </td>
          <td>
            <strong style="color:#ef4444;font-family:monospace;font-size:13.5px">\${l.monthlyLossEst}/mo</strong>
            <div style="font-size:10px;color:#94a3b8">Bounced traffic</div>
          </td>
          <td>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              <button type="button" class="fl-btn-action" onclick="selectFloridaTarget('\${l.id}')">
                📞 Pitch
              </button>
              <button type="button" class="fl-btn-action" style="background:rgba(56,189,248,0.15);border-color:#38bdf8;color:#38bdf8" onclick="openContractorSiteDemo('\${l.id}')">
                🌐 Live Preview
              </button>
            </div>
          </td>
          <td>
            <select class="fl-disposition-select" onchange="updateFloridaDisposition('\${l.id}', this.value)">
              <option value="UNTOUCHED" \${savedDisp==='UNTOUCHED'?'selected':''}>⚪ Not Called</option>
              <option value="SPOKE" \${savedDisp==='SPOKE'?'selected':''}>🟡 Spoke to Owner</option>
              <option value="SENT_DEMO" \${savedDisp==='SENT_DEMO'?'selected':''}>🔵 Sent Demo SMS</option>
              <option value="CLOSED" \${savedDisp==='CLOSED'?'selected':''}>🟢 Closed $997 Site!</option>
              <option value="NOT_INTERESTED" \${savedDisp==='NOT_INTERESTED'?'selected':''}>🔴 Not Interested</option>
            </select>
          </td>
          <td>
            <input type="text" class="fl-note-input" placeholder="Quick call notes..." value="\${savedNote.replace(/"/g, '&quot;')}" onchange="saveFloridaNote('\${l.id}', this.value)" />
          </td>
        </tr>
      \`;
    }).join('');
  };

  window.handleFloridaFilterChange = function() {
    window.renderFloridaLeadsTable();
  };

  window.resetFloridaFilters = function() {
    const s = document.getElementById('flSearchInput'); if (s) s.value = '';
    const m = document.getElementById('flMetroSelect'); if (m) m.value = 'ALL';
    const t = document.getElementById('flTradeSelect'); if (t) t.value = 'ALL';
    const d = document.getElementById('flDispositionSelect'); if (d) d.value = 'ALL';
    window.renderFloridaLeadsTable();
    showToast('✓ Florida Lead Filters Reset to Default (All 100)');
  };

  window.selectFloridaTarget = function(leadId) {
    const lead = window.FLORIDA_100_NO_WEBSITE_LEADS.find(l => l.id === leadId);
    if (!lead) return;
    window.FL_CURRENT_SELECTED_LEAD = lead;

    // Update Banner
    const targetNameEl = document.getElementById('flActiveTargetName');
    if (targetNameEl) targetNameEl.textContent = lead.company + ' (' + lead.owner + ' · ' + lead.trade + ' · ' + lead.city + ')';

    // Update Scripts
    const hookEl = document.getElementById('flScriptHookText');
    if (hookEl) {
      hookEl.innerHTML = '"Hey <em class="fl-tag-owner">' + lead.owner + '</em>, Luke over at VantorX. Look, I\\'ll be blunt — I was looking at <strong class="fl-tag-company">' + lead.company + '</strong> on Google Maps here in <span class="fl-tag-city">' + lead.city + '</span>. You have <em class="fl-tag-rating">' + lead.rating + '</em>, but you literally don\\'t have a website link. Were you guys doing that on purpose, or did someone drop the ball on your online profile?"';
    }

    const bleedEl = document.getElementById('flScriptBleedText');
    if (bleedEl) {
      const issue = lead.trade === 'Roofing' ? 'roof starts leaking or hurricane damage occurs' : (lead.trade === 'Plumbing' ? 'water heater bursts or sewer backs up' : 'system goes down');
      bleedEl.innerHTML = '"Here\\'s why I\\'m calling: right now when a homeowner\\'s <span class="fl-tag-trade-issue">' + issue + '</span> at 8 PM, 80% tap the website button on their phone to check emergency pricing. Because you don\\'t have one, Google pushes them straight to your competitor down the road. You\\'re easily losing <strong class="fl-tag-loss" style="color:#ef4444">' + lead.monthlyLossEst + '</strong> every single month in emergency jobs."';
    }

    const closeEl = document.getElementById('flScriptCloseText');
    if (closeEl) {
      closeEl.innerHTML = '"I actually already built a mobile preview site for <strong class="fl-tag-company">' + lead.company + '</strong> that loads in 0.8 seconds with an instant emergency booking form. Can I text the demo link to your cell right now? If you hate it, tell me to kick rocks and you\\'ll never hear from me again. If you love it, it\\'s yours today for <strong style="color:#34d399">$997 flat</strong>. What\\'s the best cell to text that to?"';
    }

    // Scroll smoothly to battlecard
    const battlecard = document.getElementById('flPitchBattlecardSection');
    if (battlecard) battlecard.scrollIntoView({ behavior: 'smooth', block: 'start' });

    window.renderFloridaLeadsTable();
    showToast('🎯 Loaded ' + lead.company + ' into Teleprompter');
  };

  window.toggleFloridaObjection = function(key) {
    const box = document.getElementById('flObjectionDetails');
    const titleEl = document.getElementById('flObjTitle');
    const scriptEl = document.getElementById('flObjScript');
    if (!box || !titleEl || !scriptEl) return;

    const obj = FL_OBJECTIONS[key];
    if (!obj) return;

    if (box.style.display !== 'none' && box.dataset.currentKey === key) {
      box.style.display = 'none';
      return;
    }

    box.dataset.currentKey = key;
    titleEl.textContent = obj.title;
    
    // Inject current lead name if available
    let s = obj.script;
    if (window.FL_CURRENT_SELECTED_LEAD) {
      s = s.replace(/Dave/g, window.FL_CURRENT_SELECTED_LEAD.owner);
      s = s.replace(/Tampa Bay Precision Plumbing/g, window.FL_CURRENT_SELECTED_LEAD.company);
    }
    scriptEl.textContent = s;
    box.style.display = 'block';
  };

  window.handleFloridaDialClick = function(leadId, phone) {
    const lead = window.FLORIDA_100_NO_WEBSITE_LEADS.find(l => l.id === leadId);
    showToast('📞 Initiating Call to ' + (lead ? lead.company : phone));
    if (typeof recordCallActivity === 'function') {
      recordCallActivity(leadId, lead ? lead.company : 'FL Contractor', phone, 'DIALED', 'Owner dial via Florida Private Tab');
    }
  };

  window.copyFloridaPhone = function(phone) {
    navigator.clipboard.writeText(phone.replace(/[^0-9]/g, ''));
    showToast('✓ Phone copied: ' + phone);
  };

  window.updateFloridaDisposition = function(leadId, status) {
    localStorage.setItem('vantorx_fl_disp_' + leadId, status);
    if (status === 'CLOSED') {
      showToast('🎉 CONGRATS LUKE! Closed $997 Contractor Website Deal!');
    } else {
      showToast('✓ Disposition updated: ' + status);
    }
    window.renderFloridaLeadsTable();
  };

  window.saveFloridaNote = function(leadId, note) {
    localStorage.setItem('vantorx_fl_notes_' + leadId, note);
    showToast('✓ Note saved');
  };

  window.copyFloridaSmsPitch = function(leadId) {
    const lead = leadId ? window.FLORIDA_100_NO_WEBSITE_LEADS.find(l => l.id === leadId) : window.FL_CURRENT_SELECTED_LEAD;
    if (!lead) return;

    const smsText = 'Hey ' + lead.owner + ', this is Luke from VantorX who just called you. Here is the fast mobile website preview I built for ' + lead.company + ' with your ' + lead.rating + ' reviews and 1-tap quote booking: https://vantorx.com/demo/preview?c=' + encodeURIComponent(lead.company) + ' - take 15 seconds to look at it on your phone!';
    navigator.clipboard.writeText(smsText);
    showToast('📋 Copied SMS Demo Pitch to Clipboard for ' + lead.owner);
  };

  // Demo Modal Logic
  window.openContractorSiteDemo = function(leadId) {
    const lead = window.FLORIDA_100_NO_WEBSITE_LEADS.find(l => l.id === leadId) || window.FL_CURRENT_SELECTED_LEAD;
    if (!lead) return;
    window.FL_CURRENT_SELECTED_LEAD = lead;

    const modal = document.getElementById('flSiteDemoModal');
    if (!modal) return;

    document.getElementById('flModalSiteTitle').textContent = lead.company + ' — Live Responsive Preview';
    document.getElementById('demoSiteName').textContent = lead.company;
    document.getElementById('demoSiteCity').textContent = lead.city + ', FL · Licensed & Insured';
    document.getElementById('demoSiteHeaderPhone').textContent = lead.phone;
    document.getElementById('demoSiteCallBtn').href = 'tel:' + lead.phone.replace(/[^0-9]/g, '');
    document.getElementById('demoSiteBannerCity').textContent = lead.city;
    document.getElementById('demoSiteRating').textContent = '⭐ ' + lead.rating + ' · Verified Florida Trade Pro';
    document.getElementById('demoSiteHeroTitle').textContent = lead.city + '\\'s Premier Emergency ' + lead.trade + ' Specialists';
    document.getElementById('demoSiteHeroSub').textContent = lead.pitchAngle;
    document.getElementById('demoHeroPhone').textContent = lead.phone;
    document.getElementById('demoHeroCallBtn').href = 'tel:' + lead.phone.replace(/[^0-9]/g, '');
    document.getElementById('demoFooterName').textContent = lead.company + ' · ' + lead.city + ', FL';

    // Trade icons
    const icons = { Roofing: '🏠', Plumbing: '🔧', HVAC: '❄️', Electrical: '⚡', 'Tree Service': '🌳', 'Garage Doors': '🚪', Pavers: '🧱', Septic: '🚰' };
    const icon = icons[lead.trade] || '🛠️';
    document.getElementById('demoSiteTradeIcon').textContent = icon;

    modal.style.display = 'flex';
  };

  window.openCurrentTargetSiteDemo = function() {
    if (window.FL_CURRENT_SELECTED_LEAD) {
      window.openContractorSiteDemo(window.FL_CURRENT_SELECTED_LEAD.id);
    }
  };

  window.closeContractorSiteDemo = function() {
    const modal = document.getElementById('flSiteDemoModal');
    if (modal) modal.style.display = 'none';
  };

  window.setDemoDeviceMode = function(mode) {
    const frame = document.getElementById('flSiteFrame');
    const btnMobile = document.getElementById('btnDeviceMobile');
    const btnDesktop = document.getElementById('btnDeviceDesktop');
    if (!frame) return;

    if (mode === 'desktop') {
      frame.classList.remove('mode-mobile');
      frame.classList.add('mode-desktop');
      if (btnDesktop) btnDesktop.classList.add('active');
      if (btnMobile) btnMobile.classList.remove('active');
    } else {
      frame.classList.remove('mode-desktop');
      frame.classList.add('mode-mobile');
      if (btnMobile) btnMobile.classList.add('active');
      if (btnDesktop) btnDesktop.classList.remove('active');
    }
  };

  window.exportFloridaLeadsCsv = function() {
    const leads = window.FLORIDA_100_NO_WEBSITE_LEADS;
    const headers = ['ID', 'Company', 'Owner', 'Phone', 'Trade', 'Address', 'City', 'State', 'Zip', 'Rating', 'Employees', 'Website_Status', 'Monthly_Loss_Est', 'Pitch_Angle', 'Disposition', 'Notes'];
    const rows = leads.map(l => {
      const disp = localStorage.getItem('vantorx_fl_disp_' + l.id) || 'UNTOUCHED';
      const notes = localStorage.getItem('vantorx_fl_notes_' + l.id) || '';
      return [
        l.id,
        '"' + l.company.replace(/"/g, '""') + '"',
        '"' + l.owner.replace(/"/g, '""') + '"',
        '"' + l.phone + '"',
        '"' + l.trade + '"',
        '"' + l.address.replace(/"/g, '""') + '"',
        '"' + l.city + '"',
        l.state,
        l.zip,
        '"' + l.rating + '"',
        l.employees,
        '"' + l.websiteStatus + '"',
        '"' + l.monthlyLossEst + '"',
        '"' + l.pitchAngle.replace(/"/g, '""') + '"',
        disp,
        '"' + notes.replace(/"/g, '""') + '"'
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers.join(','), ...rows].join('\\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'florida_100_no_website_leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 Downloaded 100 Florida No-Website Leads CSV');
  };
`;

  const resetTarget = `  window.resetUiZoom = function() {`;
  if (html.includes(resetTarget)) {
    html = html.replace(resetTarget, () => floridaJs + '\n' + resetTarget);
    console.log('✅ Injected Florida Private Tab JavaScript Logic');
  } else {
    console.error('❌ Could not find resetTarget in HTML');
  }

  // Also hook into switchTab so when switching to tabNoWebsite, it renders
  const switchTarget = `if ((targetTabId === 'tabLeaderboard' || targetTabId === 'tabLeads') && typeof window.renderLeaderboardUI === 'function') {`;
  const switchReplacer = `if (targetTabId === 'tabNoWebsite' && typeof window.renderFloridaLeadsTable === 'function') {\n      window.renderFloridaLeadsTable();\n    }\n    ` + switchTarget;
  if (html.includes(switchTarget)) {
    html = html.replace(switchTarget, () => switchReplacer);
    console.log('✅ Injected tabNoWebsite handler into switchTab()');
  }
}

// 6. Test compilation with Node VM before saving
const scriptMatch = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi);
console.log('Validating script tags with vm.Script...');
for (const s of scriptMatch) {
  const code = s.replace(/<script[\s\S]*?>/i, '').replace(/<\/script>/i, '');
  try {
    new vm.Script(code);
  } catch (err) {
    console.error('FATAL: Script tag compilation failed:', err.message);
    process.exit(1);
  }
}
console.log('✅ All script tags compiled cleanly in Node.js VM!');

fs.writeFileSync(arenaHtmlPath, html, 'utf8');
console.log('✅ Successfully wrote updated cold-call-arena/index.html! New length:', html.length);
