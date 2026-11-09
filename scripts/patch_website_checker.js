// scripts/patch_website_checker.js
const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
const floridaHtmlPath = path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'florida-no-website.html');

console.log('Reading files...');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
let floridaHtml = fs.readFileSync(floridaHtmlPath, 'utf8');

// ==============================================================
// 1. UPDATE website/cold-call-arena/index.html
// ==============================================================

// A) Add button in active-lead-header in tabScript
if (!indexHtml.includes('id="btnCheckLeadWebsite"')) {
  const targetHeader = `<button class="btn btn-ghost btn-sm" id="prompterToggleCallBtn" style="border:1px solid rgba(52,211,153,0.5);color:#6ee7b7">✓ Mark as Called</button>`;
  const replacement = `${targetHeader}
            <button type="button" class="btn btn-ghost btn-sm" id="btnCheckLeadWebsite" onclick="checkActiveLeadWebsite()" style="border:1.5px solid #38bdf8;color:#38bdf8;font-weight:800;background:rgba(56,189,248,0.12)" title="Verify whether prospect has an active website or is missing Google Maps presence">🔍 Check Website (Maps &amp; Google)</button>`;
  indexHtml = indexHtml.replace(targetHeader, replacement);
  console.log('Added btnCheckLeadWebsite to active lead header in index.html');
}

// B) Add check button in flActiveTargetPill in tabNoWebsite
if (!indexHtml.includes('checkSelectedFloridaWebsite()')) {
  const targetPill = `<div class="fl-active-target-pill" id="flActiveTargetPill">
          <span>Targeting:</span> <strong id="flActiveTargetName">Tampa Bay Precision Plumbing (Dave Miller)</strong>
        </div>`;
  const replacementPill = `<div class="fl-active-target-pill" id="flActiveTargetPill">
          <span>Targeting:</span> <strong id="flActiveTargetName">Tampa Bay Precision Plumbing (Dave Miller)</strong>
          <button type="button" onclick="checkSelectedFloridaWebsite()" style="margin-left:10px;background:rgba(56,189,248,0.15);border:1px solid #38bdf8;color:#38bdf8;font-size:11.5px;font-weight:800;padding:4px 9px;border-radius:6px;cursor:pointer" title="Verify Google Maps and web search for active target">🔍 Check Website Status</button>
        </div>`;
  indexHtml = indexHtml.replace(targetPill, replacementPill);
  console.log('Added check button to flActiveTargetPill in index.html');
}

// C) Add button in fl-table-status-bar
if (!indexHtml.includes('openWebsiteCheckerModal()')) {
  const targetStatusBar = `<div class="fl-table-status-bar">
        <div>
          Showing <strong id="flShowingCount" style="color:#fbbf24">100</strong> of 100 Florida Targets without Websites
        </div>`;
  const replacementStatusBar = `<div class="fl-table-status-bar">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <div>Showing <strong id="flShowingCount" style="color:#fbbf24">100</strong> of 100 Florida Targets without Websites</div>
          <button type="button" onclick="openWebsiteCheckerModal()" style="background:rgba(56,189,248,0.18);border:1px solid #38bdf8;color:#38bdf8;font-size:11.5px;font-weight:800;padding:4px 10px;border-radius:7px;cursor:pointer;display:inline-flex;align-items:center;gap:6px">
            <span>🔍</span> <span>Open Website Checker Tool</span>
          </button>
        </div>`;
  indexHtml = indexHtml.replace(targetStatusBar, replacementStatusBar);
  console.log('Added checker tool button to fl-table-status-bar in index.html');
}

// D) Enhance renderFloridaLeadsTable in index.html
const oldRowRenderRegex = /<td>\s*<span class="fl-badge-noweb">🚨 NO WEBSITE<\/span>[\s\S]*?<div style="display:flex;gap:6px;flex-wrap:wrap">[\s\S]*?🌐 Live Preview[\s\S]*?<\/button>\s*<\/div>/;

const newRowRender = `<td>
            \${(() => {
              const savedWeb = localStorage.getItem('vantorx_fl_website_' + l.id);
              const isVerifiedZero = localStorage.getItem('vantorx_fl_zero_verified_' + l.id) === 'true';
              if (savedWeb && savedWeb !== 'None') {
                const clean = savedWeb.startsWith('http') ? savedWeb : 'https://' + savedWeb;
                return \`<span class="fl-badge-hasweb" style="background:rgba(52,211,153,0.18);color:#34d399;border:1px solid rgba(52,211,153,0.5);border-radius:6px;padding:3px 7px;font-size:11px;font-weight:800;display:inline-block">🌐 HAS SITE</span>
                        <div style="font-size:10px;color:#94a3b8;margin-top:2px;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><a href="\${clean}" target="_blank" style="color:#38bdf8">\${savedWeb}</a></div>
                        <div style="font-size:9.5px;color:#64748b;margin-top:1px"><a href="javascript:void(0)" onclick="openWebsiteCheckerModal('\${l.id}')" style="color:#fbbf24">Edit/Check</a></div>\`;
              }
              if (isVerifiedZero) {
                return \`<span class="fl-badge-noweb" style="background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.5);border-radius:6px;padding:3px 7px;font-size:11px;font-weight:800;display:inline-block">🛡️ VERIFIED NO SITE</span>
                        <div style="font-size:10px;color:#34d399;margin-top:2px">✓ Confirmed No Map Link</div>
                        <div style="font-size:9.5px"><a href="javascript:void(0)" onclick="openWebsiteCheckerModal('\${l.id}')" style="color:#38bdf8">Re-verify</a></div>\`;
              }
              return \`<span class="fl-badge-noweb">🚨 NO WEBSITE</span>
                      <div style="font-size:10px;color:#94a3b8;margin-top:2px"><a href="javascript:void(0)" onclick="openWebsiteCheckerModal('\${l.id}')" style="color:#38bdf8;text-decoration:none;font-weight:700">🔍 Verify (Maps)</a></div>\`;
            })()}
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
              <button type="button" class="fl-btn-action" style="background:rgba(245,158,11,0.15);border-color:#f59e0b;color:#fbbf24" onclick="openWebsiteCheckerModal('\${l.id}')" title="Verify Google Maps and Google Search existence">
                🔍 Check Site
              </button>
            </div>`;

if (oldRowRenderRegex.test(indexHtml)) {
  indexHtml = indexHtml.replace(oldRowRenderRegex, newRowRender);
  console.log('Enhanced Florida leads table row rendering in index.html');
} else {
  console.log('Regex did not match Florida row render in index.html, checking manual fallback...');
}

// E) Add Website Checker Modal HTML and JavaScript to index.html
const websiteCheckerModalHtml = `
<!-- ============================================================== -->
<!-- 🔍 LIVE WEBSITE CHECKER & GOOGLE MAPS VERIFICATION MODAL        -->
<!-- ============================================================== -->
<div class="modal-overlay" id="websiteCheckerModal" style="z-index:999999;background:rgba(5,8,14,0.95);backdrop-filter:blur(16px)">
  <div class="modal-box" style="max-width:680px;border:1.5px solid rgba(56,189,248,0.55);box-shadow:0 0 60px rgba(0,0,0,0.95),0 0 30px rgba(56,189,248,0.25);border-radius:20px;padding:26px;color:#fff">
    
    <!-- Modal Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.1)">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:26px">🔍</span>
        <div>
          <h3 style="font-family:var(--font-head);font-size:19px;font-weight:800;color:#ffffff;margin:0">
            Website Presence &amp; Google Maps Verifier
          </h3>
          <span style="font-size:11.5px;color:#94a3b8">
            Check in real-time whether this contractor has a website or if their Google Maps profile has zero link
          </span>
        </div>
      </div>
      <button type="button" class="btn btn-ghost btn-sm" onclick="closeWebsiteCheckerModal()" style="font-size:16px;padding:4px 8px;border-radius:6px">✕</button>
    </div>

    <!-- Active Target Card -->
    <div style="background:rgba(15,23,42,0.85);border:1px solid rgba(56,189,248,0.3);border-radius:12px;padding:14px;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div style="font-size:11px;font-family:var(--font-mono);color:#38bdf8;font-weight:800;text-transform:uppercase;letter-spacing:0.04em">
          TARGET BUSINESS FOR CALL:
        </div>
        <div id="webCheckStatusPill" style="font-size:11px;font-weight:800;padding:3px 8px;border-radius:6px;background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.4)">
          🚨 Catalog: NO WEBSITE LINKED
        </div>
      </div>
      
      <div style="margin-top:6px">
        <input type="text" id="webCheckCompanyInput" style="width:100%;font-size:17px;font-weight:900;color:#ffffff;background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:6px 10px" placeholder="Company Name..." oninput="updateWebCheckLinks()" />
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;font-size:12px;color:#cbd5e1">
        <div>👤 Owner: <strong style="color:#fbbf24" id="webCheckOwner">Dave Miller</strong></div>
        <div>📍 City/Trade: <span style="color:#38bdf8" id="webCheckLocation">Tampa, FL · Plumbing</span></div>
        <div>📞 Phone: <span style="font-family:monospace;color:#34d399;font-weight:700" id="webCheckPhone">(813) 449-2180</span></div>
        <div>⭐ Google Reviews: <span style="color:#fbbf24" id="webCheckRating">4.8★ (31 reviews)</span></div>
      </div>
    </div>

    <!-- 4 INSTANT 1-CLICK VERIFICATION LAUNCHERS -->
    <div style="font-size:11px;font-family:var(--font-mono);font-weight:800;color:#fbbf24;text-transform:uppercase;margin-bottom:8px;letter-spacing:0.04em">
      ⚡ 4 WAYS TO VERIFY IF THEY HAVE A WEBSITE (1-CLICK):
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      <!-- 1. Google Maps Check (The Exact Lead Bleed) -->
      <a id="btnCheckGoogleMaps" href="#" target="_blank" class="btn btn-ghost" style="padding:12px;border:1.5px solid rgba(56,189,248,0.5);color:#38bdf8;background:rgba(56,189,248,0.08);display:flex;align-items:flex-start;gap:10px;text-decoration:none;border-radius:10px">
        <span style="font-size:22px">🗺️</span>
        <div style="text-align:left">
          <div style="font-size:13px;font-weight:900">1. Check Google Maps</div>
          <div style="font-size:10.5px;color:#cbd5e1;line-height:1.35;margin-top:2px">
            See if "Website" button exists or is missing on their Google Maps listing.
          </div>
        </div>
      </a>

      <!-- 2. Google Search for Domain -->
      <a id="btnCheckGoogleSearch" href="#" target="_blank" class="btn btn-ghost" style="padding:12px;border:1.5px solid rgba(245,158,11,0.5);color:#fbbf24;background:rgba(245,158,11,0.08);display:flex;align-items:flex-start;gap:10px;text-decoration:none;border-radius:10px">
        <span style="font-size:22px">🔎</span>
        <div style="text-align:left">
          <div style="font-size:13px;font-weight:900">2. Scan Google for Domain</div>
          <div style="font-size:10.5px;color:#cbd5e1;line-height:1.35;margin-top:2px">
            Searches exact business name + city for any active .com, .net, or old Wix site.
          </div>
        </div>
      </a>

      <!-- 3. Facebook Business Page Check -->
      <a id="btnCheckFacebook" href="#" target="_blank" class="btn btn-ghost" style="padding:12px;border:1.5px solid rgba(59,130,246,0.5);color:#60a5fa;background:rgba(59,130,246,0.08);display:flex;align-items:flex-start;gap:10px;text-decoration:none;border-radius:10px">
        <span style="font-size:22px">📘</span>
        <div style="text-align:left">
          <div style="font-size:13px;font-weight:900">3. Check Facebook Page</div>
          <div style="font-size:10.5px;color:#cbd5e1;line-height:1.35;margin-top:2px">
            Checks if they only have a Facebook page instead of an actual mobile website.
          </div>
        </div>
      </a>

      <!-- 4. SunBiz Corporate Records (Florida) -->
      <a id="btnCheckSunbiz" href="#" target="_blank" class="btn btn-ghost" style="padding:12px;border:1.5px solid rgba(168,85,247,0.5);color:#d8b4fe;background:rgba(168,85,247,0.08);display:flex;align-items:flex-start;gap:10px;text-decoration:none;border-radius:10px">
        <span style="font-size:22px">🏛️</span>
        <div style="text-align:left">
          <div style="font-size:13px;font-weight:900">4. Check FL SunBiz Registry</div>
          <div style="font-size:10.5px;color:#cbd5e1;line-height:1.35;margin-top:2px">
            State corporate filing lookup: verifies owner name, LLC filing &amp; official address.
          </div>
        </div>
      </a>
    </div>

    <!-- DOMAIN PING & DIRECT URL TESTER -->
    <div style="background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px 14px;margin-bottom:16px">
      <div style="font-size:11px;font-family:var(--font-mono);font-weight:800;color:#38bdf8;text-transform:uppercase;margin-bottom:6px">
        🌐 Test Suspected Domain / URL:
      </div>
      <div style="display:flex;gap:8px">
        <input type="text" id="webCheckDomainInput" placeholder="e.g. tampabayprecisionplumbing.com" style="flex:1;background:#0b0f19;border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:6px;padding:7px 10px;font-size:12px" />
        <button type="button" class="btn btn-gold btn-sm" onclick="testSuspectedDomain()" style="padding:6px 14px;font-size:12px">🚀 Test / Open</button>
        <button type="button" class="btn btn-ghost btn-sm" onclick="checkWhoisDomain()" style="border:1px solid rgba(255,255,255,0.2);color:#cbd5e1;padding:6px 12px;font-size:12px">📋 WHOIS</button>
      </div>
      <div id="domainTestFeedback" style="font-size:11px;color:#94a3b8;margin-top:5px">
        Enter any domain they mention to verify if it is live, dead, or parked.
      </div>
    </div>

    <!-- 🎯 "JUST IN CASE" CALL OBJECTION CHEAT-SHEET -->
    <div style="background:rgba(245,158,11,0.08);border:1.5px solid rgba(245,158,11,0.35);border-radius:12px;padding:12px 14px;margin-bottom:16px">
      <div style="font-size:11px;font-family:var(--font-mono);font-weight:900;color:#fbbf24;text-transform:uppercase;margin-bottom:6px">
        🎯 IF THE OWNER SAYS: "WHAT DO YOU MEAN? I HAVE A WEBSITE!"
      </div>
      <div style="font-size:12.5px;color:#e2e8f0;line-height:1.5">
        <strong>Say this verbatim:</strong><br>
        <em>"Right, and that's exactly why I'm calling! I was looking at <span id="cheatSheetCompany">your business</span> on Google Maps here in <span id="cheatSheetCity">town</span>. You have great reviews, but there is <strong>literally NO website button linked to your Google Maps profile</strong>. When 80% of emergency customers search on their iPhone, they tap the website button. Because it's missing, Google routes them straight to the contractor next to you. Did your web guy forget to connect it?"</em>
      </div>
    </div>

    <!-- SAVE STATUS BUTTONS -->
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;border-top:1px solid rgba(255,255,255,0.1);padding-top:14px">
      <div style="display:flex;align-items:center;gap:8px">
        <button type="button" class="btn btn-ghost btn-sm" onclick="saveVerifiedNoWebsiteStatus()" style="border:1px solid #10b981;color:#34d399;font-weight:800;background:rgba(16,185,129,0.1)">
          🛡️ Confirm Zero Website on Maps
        </button>
        <button type="button" class="btn btn-ghost btn-sm" onclick="promptSaveFoundWebsite()" style="border:1px solid #38bdf8;color:#38bdf8;font-weight:800;background:rgba(56,189,248,0.1)">
          🌐 Mark as "Has Website" (Save URL)
        </button>
      </div>
      <button type="button" class="btn btn-gold" onclick="closeWebsiteCheckerModal()" style="padding:7px 18px;font-size:12.5px;font-weight:800">
        Done
      </button>
    </div>

  </div>
</div>
`;

// Insert the modal HTML before </body> in index.html
if (!indexHtml.includes('id="websiteCheckerModal"')) {
  indexHtml = indexHtml.replace('</body>', `${websiteCheckerModalHtml}\n</body>`);
  console.log('Added websiteCheckerModal HTML before </body> in index.html');
}

// F) Add JavaScript functions in index.html script tag
const websiteCheckerScript = `
  // ==============================================================
  // 🔍 WEBSITE PRESENCE & GOOGLE MAPS VERIFICATION SYSTEM
  // ==============================================================
  window.CURRENT_CHECKING_LEAD = null;

  window.openWebsiteCheckerModal = function(leadOrId) {
    let lead = null;
    if (typeof leadOrId === 'string') {
      lead = (window.FLORIDA_100_NO_WEBSITE_LEADS && window.FLORIDA_100_NO_WEBSITE_LEADS.find(l => l.id === leadOrId))
          || (window.LEADS_DATA && window.LEADS_DATA.find(l => l.id === leadOrId));
    } else if (leadOrId && typeof leadOrId === 'object') {
      lead = leadOrId;
    } else {
      lead = window.FL_CURRENT_SELECTED_LEAD 
          || (typeof activeLead !== 'undefined' ? activeLead : null)
          || (window.FLORIDA_100_NO_WEBSITE_LEADS ? window.FLORIDA_100_NO_WEBSITE_LEADS[0] : null);
    }

    window.CURRENT_CHECKING_LEAD = lead;
    const company = lead ? lead.company : 'Florida Contractor';
    const owner = lead ? lead.owner : 'Owner';
    const city = lead ? lead.city : 'Florida';
    const trade = lead ? lead.trade : 'Home Services';
    const phone = lead ? lead.phone : 'N/A';
    const rating = lead ? (lead.rating || '4.8★') : '4.8★';
    const address = lead ? (lead.address || '') : '';

    const companyInput = document.getElementById('webCheckCompanyInput');
    if (companyInput) companyInput.value = company;
    const ownerEl = document.getElementById('webCheckOwner');
    if (ownerEl) ownerEl.textContent = owner;
    const locEl = document.getElementById('webCheckLocation');
    if (locEl) locEl.textContent = city + ' · ' + trade;
    const phoneEl = document.getElementById('webCheckPhone');
    if (phoneEl) phoneEl.textContent = phone;
    const ratingEl = document.getElementById('webCheckRating');
    if (ratingEl) ratingEl.textContent = rating;
    const cheatComp = document.getElementById('cheatSheetCompany');
    if (cheatComp) cheatComp.textContent = company;
    const cheatCity = document.getElementById('cheatSheetCity');
    if (cheatCity) cheatCity.textContent = city;

    // Smart domain guess
    const guessedDomain = company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    const domInput = document.getElementById('webCheckDomainInput');
    const savedWeb = lead ? localStorage.getItem('vantorx_fl_website_' + lead.id) : null;
    if (domInput) domInput.value = savedWeb && savedWeb !== 'None' ? savedWeb : guessedDomain;

    const feedback = document.getElementById('domainTestFeedback');
    if (feedback) feedback.innerHTML = 'Enter any domain or click <strong>"Check Google Maps"</strong> to inspect their profile in real-time.';

    window.updateWebCheckLinks();

    const m = document.getElementById('websiteCheckerModal');
    if (m) m.classList.add('active');
  };

  window.closeWebsiteCheckerModal = function() {
    const m = document.getElementById('websiteCheckerModal');
    if (m) m.classList.remove('active');
  };

  window.checkActiveLeadWebsite = function() {
    const l = (typeof activeLead !== 'undefined' ? activeLead : null) 
           || (window.FL_CURRENT_SELECTED_LEAD ? window.FL_CURRENT_SELECTED_LEAD : null);
    window.openWebsiteCheckerModal(l);
  };

  window.checkSelectedFloridaWebsite = function() {
    const l = window.FL_CURRENT_SELECTED_LEAD || (window.FLORIDA_100_NO_WEBSITE_LEADS ? window.FLORIDA_100_NO_WEBSITE_LEADS[0] : null);
    window.openWebsiteCheckerModal(l);
  };

  window.updateWebCheckLinks = function() {
    const lead = window.CURRENT_CHECKING_LEAD;
    const compVal = document.getElementById('webCheckCompanyInput')?.value || (lead ? lead.company : 'Contractor');
    const city = lead ? lead.city : 'Florida';
    const address = lead ? (lead.address || '') : '';

    // 1. Google Maps
    const mapsQuery = encodeURIComponent(compVal + ' ' + address + ' ' + city + ' FL');
    const gmBtn = document.getElementById('btnCheckGoogleMaps');
    if (gmBtn) gmBtn.href = \`https://www.google.com/maps/search/?api=1&query=\${mapsQuery}\`;

    // 2. Google Search
    const gSearchQuery = encodeURIComponent(\`"\${compVal}" \${city} FL website OR .com\`);
    const gsBtn = document.getElementById('btnCheckGoogleSearch');
    if (gsBtn) gsBtn.href = \`https://www.google.com/search?q=\${gSearchQuery}\`;

    // 3. Facebook
    const fbQuery = encodeURIComponent(\`"\${compVal}" \${city} FL site:facebook.com\`);
    const fbBtn = document.getElementById('btnCheckFacebook');
    if (fbBtn) fbBtn.href = \`https://www.google.com/search?q=\${fbQuery}\`;

    // 4. SunBiz
    const sbQuery = encodeURIComponent(compVal);
    const sbBtn = document.getElementById('btnCheckSunbiz');
    if (sbBtn) sbBtn.href = \`https://search.sunbiz.org/Inquiry/CorporationSearch/ByName?searchNameOrder=\${sbQuery}\`;
  };

  window.testSuspectedDomain = function() {
    const dInput = document.getElementById('webCheckDomainInput');
    let dom = (dInput?.value || '').trim();
    if (!dom) return;
    if (!dom.startsWith('http://') && !dom.startsWith('https://')) {
      dom = 'https://' + dom;
    }
    const feedback = document.getElementById('domainTestFeedback');
    if (feedback) {
      feedback.innerHTML = \`<span style="color:#38bdf8">🌐 Opening test tab for: <a href="\${dom}" target="_blank" style="color:#fbbf24">\${dom}</a>. Check if it loads, errors (DNS_PROBE_FINISHED_NXDOMAIN), or redirects to a parked registrar page.</span>\`;
    }
    window.open(dom, '_blank', 'noopener,noreferrer');
  };

  window.checkWhoisDomain = function() {
    const dInput = document.getElementById('webCheckDomainInput');
    let dom = (dInput?.value || '').trim().replace(/^https?:\\/\\//, '').replace(/^www\\./, '').split('/')[0];
    if (!dom) return;
    window.open(\`https://who.is/whois/\${encodeURIComponent(dom)}\`, '_blank', 'noopener,noreferrer');
  };

  window.saveVerifiedNoWebsiteStatus = function() {
    const lead = window.CURRENT_CHECKING_LEAD;
    if (!lead) return;
    localStorage.setItem('vantorx_fl_zero_verified_' + lead.id, 'true');
    localStorage.removeItem('vantorx_fl_website_' + lead.id);
    if (typeof window.renderFloridaLeadsTable === 'function') {
      window.renderFloridaLeadsTable();
    }
    const statusPill = document.getElementById('webCheckStatusPill');
    if (statusPill) {
      statusPill.innerHTML = '🛡️ CONFIRMED: ZERO WEBSITE ON MAPS';
      statusPill.style.background = 'rgba(16,185,129,0.2)';
      statusPill.style.color = '#34d399';
      statusPill.style.borderColor = 'rgba(16,185,129,0.5)';
    }
    showToast('✓ Confirmed: Marked as ZERO website on Google Maps profile');
  };

  window.promptSaveFoundWebsite = function() {
    const lead = window.CURRENT_CHECKING_LEAD;
    if (!lead) return;
    const dInput = document.getElementById('webCheckDomainInput');
    const existing = (dInput?.value || '').trim();
    const url = prompt('Enter the verified website URL discovered for ' + lead.company + ':', existing);
    if (url && url.trim()) {
      localStorage.setItem('vantorx_fl_website_' + lead.id, url.trim());
      localStorage.removeItem('vantorx_fl_zero_verified_' + lead.id);
      if (typeof window.renderFloridaLeadsTable === 'function') {
        window.renderFloridaLeadsTable();
      }
      const statusPill = document.getElementById('webCheckStatusPill');
      if (statusPill) {
        statusPill.innerHTML = '🌐 HAS WEBSITE: ' + url.trim();
        statusPill.style.background = 'rgba(56,189,248,0.2)';
        statusPill.style.color = '#38bdf8';
        statusPill.style.borderColor = 'rgba(56,189,248,0.5)';
      }
      showToast('✓ Saved Website URL: ' + url.trim());
    }
  };
`;

if (!indexHtml.includes('window.openWebsiteCheckerModal = function')) {
  indexHtml = indexHtml.replace('window.openEnrichmentModal = function', `${websiteCheckerScript}\n  window.openEnrichmentModal = function`);
  console.log('Injected Website Checker JavaScript functions into index.html');
}

fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('Successfully updated website/cold-call-arena/index.html');

// ==============================================================
// 2. UPDATE website/cold-call-arena/florida-no-website.html
// ==============================================================

// A) Add button in top-badge-row in florida-no-website.html
if (!floridaHtml.includes('openWebsiteCheckerModal()')) {
  const targetBadgeRow = `<div style="display:flex;gap:10px">
        <a href="index.html#tabNoWebsite" class="btn-action btn-secondary">`;
  const replacementBadgeRow = `<div style="display:flex;gap:10px">
        <button type="button" class="btn-action" onclick="openWebsiteCheckerModal()" style="background:rgba(56,189,248,0.2);border:1px solid #38bdf8;color:#38bdf8;cursor:pointer">
          <span>🔍</span> <span>Check Any Business Website</span>
        </button>
        <a href="index.html#tabNoWebsite" class="btn-action btn-secondary">`;
  floridaHtml = floridaHtml.replace(targetBadgeRow, replacementBadgeRow);
  console.log('Added check button to top-badge-row in florida-no-website.html');
}

// B) Add button in battlecard-title
if (!floridaHtml.includes('checkSelectedFloridaWebsite()')) {
  const targetBcTitle = `<div class="battlecard-title">
      <span>⚡ 30-Second Contractor Site-Flip Phone Pitch</span>
      <button type="button" class="btn-preview-mockup" onclick="copyPitchScript()" style="margin-left:auto">
        📋 Copy Battlecard
      </button>
    </div>`;
  const replacementBcTitle = `<div class="battlecard-title">
      <span>⚡ 30-Second Contractor Site-Flip Phone Pitch</span>
      <div style="margin-left:auto;display:flex;gap:8px">
        <button type="button" class="btn-preview-mockup" onclick="checkSelectedFloridaWebsite()" style="background:rgba(56,189,248,0.18);border:1px solid #38bdf8;color:#38bdf8;cursor:pointer">
          🔍 Check Website Status (Maps &amp; Google)
        </button>
        <button type="button" class="btn-preview-mockup" onclick="copyPitchScript()">
          📋 Copy Battlecard
        </button>
      </div>
    </div>`;
  floridaHtml = floridaHtml.replace(targetBcTitle, replacementBcTitle);
  console.log('Added check button to battlecard-title in florida-no-website.html');
}

// C) Enhance renderTable in florida-no-website.html
const flOldRowRegex = /<td>\s*<span class="tag-no-web">🚫 NO WEBSITE<\/span>\s*<\/td>[\s\S]*?<div style="display:flex;flex-direction:column;gap:6px">\s*<button type="button" class="btn-preview-mockup" onclick="openMockup\('\${l\.id}'\)">\s*📱 Preview Mockup\s*<\/button>/;

const flNewRowRender = `<td>
        \${(() => {
          const savedWeb = localStorage.getItem('vantorx_fl_website_' + l.id);
          const isVerifiedZero = localStorage.getItem('vantorx_fl_zero_verified_' + l.id) === 'true';
          if (savedWeb && savedWeb !== 'None') {
            const clean = savedWeb.startsWith('http') ? savedWeb : 'https://' + savedWeb;
            return \`<span style="background:rgba(52,211,153,0.18);color:#34d399;border:1px solid rgba(52,211,153,0.5);border-radius:6px;padding:3px 7px;font-size:11px;font-weight:800;display:inline-block">🌐 HAS SITE</span>
                    <div style="font-size:10px;color:#94a3b8;margin-top:2px;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><a href="\${clean}" target="_blank" style="color:#38bdf8">\${savedWeb}</a></div>
                    <div style="font-size:9.5px;color:#64748b;margin-top:1px"><a href="javascript:void(0)" onclick="openWebsiteCheckerModal('\${l.id}')" style="color:#fbbf24">Edit/Check</a></div>\`;
          }
          if (isVerifiedZero) {
            return \`<span class="tag-no-web" style="background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.5)">🛡️ VERIFIED NO SITE</span>
                    <div style="font-size:10px;color:#34d399;margin-top:2px">✓ Confirmed No Map Link</div>
                    <div style="font-size:9.5px"><a href="javascript:void(0)" onclick="openWebsiteCheckerModal('\${l.id}')" style="color:#38bdf8">Re-verify</a></div>\`;
          }
          return \`<span class="tag-no-web">🚫 NO WEBSITE</span>
                  <div style="font-size:10px;color:#94a3b8;margin-top:2px"><a href="javascript:void(0)" onclick="openWebsiteCheckerModal('\${l.id}')" style="color:#38bdf8;text-decoration:none;font-weight:700">🔍 Verify (Maps)</a></div>\`;
        })()}
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
          <div style="display:flex;gap:6px">
            <button type="button" class="btn-preview-mockup" onclick="openMockup('\${l.id}')" style="flex:1">
              📱 Mockup
            </button>
            <button type="button" class="btn-preview-mockup" onclick="openWebsiteCheckerModal('\${l.id}')" style="background:rgba(245,158,11,0.15);border-color:#f59e0b;color:#fbbf24" title="Check Website Presence">
              🔍 Check
            </button>
          </div>`;

if (flOldRowRegex.test(floridaHtml)) {
  floridaHtml = floridaHtml.replace(flOldRowRegex, flNewRowRender);
  console.log('Enhanced renderTable row in florida-no-website.html');
}

// D) Add Website Checker Modal HTML to florida-no-website.html before </body>
if (!floridaHtml.includes('id="websiteCheckerModal"')) {
  floridaHtml = floridaHtml.replace('</body>', `${websiteCheckerModalHtml}\n</body>`);
  console.log('Added websiteCheckerModal HTML to florida-no-website.html');
}

// E) Add Javascript functions to florida-no-website.html
if (!floridaHtml.includes('window.openWebsiteCheckerModal = function')) {
  floridaHtml = floridaHtml.replace('function switchFlScriptTab', `${websiteCheckerScript}\nfunction switchFlScriptTab`);
  console.log('Added Website Checker JavaScript functions to florida-no-website.html');
}

fs.writeFileSync(floridaHtmlPath, floridaHtml, 'utf8');
console.log('Successfully updated website/cold-call-arena/florida-no-website.html');
console.log('Done!');
