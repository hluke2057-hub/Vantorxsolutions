// scripts/inject_private_tab_and_leads.js
// Injects 250 Leads into Private Tab, renames tab button to "Private",
// adds 🌙 Night Grind filter (10 PM - 3 AM US), adds Singapore & Perth clocks.

const fs = require('fs');
const path = require('path');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const indexPath = path.join(root, 'website/cold-call-arena/index.html');
const leadsPath = path.join(root, 'data/private_250_leads.json');

const leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
console.log(`Loaded ${leads.length} leads from private_250_leads.json.`);

let html = fs.readFileSync(indexPath, 'utf8');

// 1. Rename tab button at line 1481 to discreet "Private"
const oldTabBtnRegex = /<button class="tab-btn" type="button" id="tabBtnNoWebsite" data-tab="tabNoWebsite" onclick="switchTab\('tabNoWebsite'\)"[^>]*>[\s\S]*?<\/button>/;
const newTabBtn = `<button class="tab-btn" type="button" id="tabBtnNoWebsite" data-tab="tabNoWebsite" onclick="switchTab('tabNoWebsite')" style="border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.06); color: #cbd5e1; font-weight: 700; letter-spacing: 0.02em;">🔒 Private</button>`;

if (oldTabBtnRegex.test(html)) {
  html = html.replace(oldTabBtnRegex, newTabBtn);
  console.log('✅ Replaced tab button with discreet "🔒 Private"');
} else {
  console.log('⚠️ Could not find old tab button regex');
}

// 2. Update Gate Screen to discreet "Private Workbench"
html = html.replace(
  '<div class="fl-gate-badge">PRIVATE INTERNATIONAL VAULT · ENGLISH-SPEAKING MARKETS</div>',
  '<div class="fl-gate-badge">PRIVATE WORKBENCH · CONFIDENTIAL ACCESS</div>'
);
html = html.replace(
  'This confidential founder workbench contains 150 international local business targets across the UK, Australia, Canada, Ireland, and New Zealand with zero AI automation and massive web modernization upside. Enter access code to unlock.',
  'This confidential workbench contains 250 verified high-ticket local business targets (including 155 night-grind targets across Australia, Singapore & New Zealand) with zero AI automation and massive web modernization upside. Enter access code to unlock.'
);
html = html.replace(
  '<span>Unlock International Vault ➔</span>',
  '<span>Unlock Private Workbench ➔</span>'
);

// 3. Update Unlocked Header
html = html.replace(
  'PRIVATE INTERNATIONAL VAULT: 150 TARGETS',
  'PRIVATE WORKBENCH: 250 TARGETS'
);
html = html.replace(
  'UNSATURATED ENGLISH MARKETS',
  '🌙 155 NIGHT GRIND TARGETS (10 PM – 3 AM US EST)'
);
html = html.replace(
  'Targeting high-ticket local service businesses across <strong>UK 🇬🇧, Australia 🇦🇺, Canada 🇨🇦, Ireland 🇮🇪, and New Zealand 🇳🇿</strong> with zero AI phone receptionists and high web modernization budgets.',
  'Targeting 250 verified English-speaking local businesses across <strong>Australia 🇦🇺 (85), Singapore 🇸🇬 (40), UK 🇬🇧 (40), Canada 🇨🇦 (35), New Zealand 🇳🇿 (30), and Ireland 🇮🇪 (20)</strong>. <strong>155 targets are prime for Night Grinding between 10:00 PM – 3:00 AM US EST!</strong>'
);
html = html.replace(
  'Download 150 Leads (.CSV)',
  'Download 250 Leads (.CSV)'
);

// 4. Update View Switcher Counts
html = html.replace(
  'Dial Queue: To Call (<span id="intlUncalledCountBadge">150</span>)',
  'Dial Queue: To Call (<span id="intlUncalledCountBadge">250</span>)'
);

// 5. Update Daily Batch Heading & Options
html = html.replace(
  'ACTIVE INTERNATIONAL DIAL QUEUE: 150 TARGETS (ZERO AI SATURATION)',
  'ACTIVE PRIVATE DIAL QUEUE: 250 TARGETS (155 NIGHT GRIND)'
);
html = html.replace(
  '150 verified English-speaking international business targets',
  '250 verified English-speaking business targets (Australia, Singapore, UK, Canada, NZ, Ireland)'
);

const oldBatchSelectRegex = /<select id="intlBatchSelect" class="custom-select"[\s\S]*?<\/select>/;
const newBatchSelect = `<select id="intlBatchSelect" class="custom-select" style="font-weight:700" onchange="handleIntlBatchChange()">
                <option value="all" selected>🌍 All 250 Private Targets (Full Vault)</option>
                <option value="night_grind">🌙 Night Grind (10 PM - 3 AM US) — Australia, Singapore, NZ (155 Targets)</option>
                <option value="open_now">⚡ Live Now: Open Local Business Hours Only</option>
                <option value="AU">🇦🇺 Australia (Perth, Sydney, Brisbane, Adelaide · 85 Targets)</option>
                <option value="SG">🇸🇬 Singapore (Orchard, Jurong, Tampines · 40 Targets)</option>
                <option value="GB">🇬🇧 United Kingdom (London, Manchester, Leeds · 40 Targets)</option>
                <option value="CA">🇨🇦 Canada (Toronto, Vancouver, Calgary, Edmonton · 35 Targets)</option>
                <option value="NZ">🇳🇿 New Zealand (Auckland, Wellington, Christchurch · 30 Targets)</option>
                <option value="IE">🇮🇪 Ireland (Dublin, Cork, Galway, Limerick · 20 Targets)</option>
              </select>`;

if (oldBatchSelectRegex.test(html)) {
  html = html.replace(oldBatchSelectRegex, newBatchSelect);
  console.log('✅ Updated intlBatchSelect');
}

// 6. Update Quota chip
html = html.replace(
  '⏳ 150 To Call',
  '⏳ 250 To Call'
);

// 7. Update Clock Grid to include Singapore & Perth
const oldClockGridRegex = /<div style="display:grid;grid-template-columns:repeat\(auto-fit,minmax\(240px,1fr\)\);gap:12px" id="intlTimeZoneClockGrid">[\s\S]*?<\/div>\s*<\/div>\s*<!-- Time Zone Filter Pill Strip -->/;

const newClockGrid = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px" id="intlTimeZoneClockGrid">
          
          <!-- 🇦🇺 Australia (Perth - AWST) 🌙 NIGHT GRIND PRIME -->
          <div class="tz-card" id="tzCardPerth" style="background:rgba(245,158,11,0.08);border:1.5px solid rgba(245,158,11,0.5);border-radius:12px;padding:12px 14px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span style="font-weight:800;font-size:13.5px;color:#ffffff;display:inline-flex;align-items:center;gap:6px">
                <span>🇦🇺</span> <span>Perth (AWST)</span>
              </span>
              <span id="badgeTzPerth" class="tz-status-badge" style="font-size:10.5px;font-weight:800;padding:2px 7px;border-radius:6px;font-family:var(--font-mono);background:rgba(16,185,129,0.2);color:#6ee7b7;border:1px solid rgba(16,185,129,0.5)">🟢 CALL NOW</span>
            </div>
            <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:11px;color:#94a3b8">Perth (UTC+8):</span>
              <span id="clockPerth" style="font-family:var(--font-mono);font-size:14px;font-weight:800;color:#fbbf24">--:-- --</span>
            </div>
            <div style="font-size:11px;color:#cbd5e1;background:rgba(255,255,255,0.04);padding:5px 8px;border-radius:6px;border-left:2px solid #f59e0b">
              <strong style="color:#fbbf24">🌙 Night Grind:</strong> 8:00 PM – 4:00 AM EST<br>
              <span style="font-size:10px;color:#94a3b8">(10 PM - 3 AM EST is 11 AM - 4 PM Perth!)</span>
            </div>
          </div>

          <!-- 🇸🇬 Singapore (SGT) 🌙 NIGHT GRIND PRIME -->
          <div class="tz-card" id="tzCardSg" style="background:rgba(56,189,248,0.08);border:1.5px solid rgba(56,189,248,0.5);border-radius:12px;padding:12px 14px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span style="font-weight:800;font-size:13.5px;color:#ffffff;display:inline-flex;align-items:center;gap:6px">
                <span>🇸🇬</span> <span>Singapore (SGT)</span>
              </span>
              <span id="badgeTzSg" class="tz-status-badge" style="font-size:10.5px;font-weight:800;padding:2px 7px;border-radius:6px;font-family:var(--font-mono);background:rgba(16,185,129,0.2);color:#6ee7b7;border:1px solid rgba(16,185,129,0.5)">🟢 CALL NOW</span>
            </div>
            <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:11px;color:#94a3b8">Singapore (UTC+8):</span>
              <span id="clockSg" style="font-family:var(--font-mono);font-size:14px;font-weight:800;color:#38bdf8">--:-- --</span>
            </div>
            <div style="font-size:11px;color:#cbd5e1;background:rgba(255,255,255,0.04);padding:5px 8px;border-radius:6px;border-left:2px solid #38bdf8">
              <strong style="color:#fbbf24">🌙 Night Grind:</strong> 8:00 PM – 4:00 AM EST<br>
              <span style="font-size:10px;color:#94a3b8">(10 PM - 3 AM EST is 11 AM - 4 PM SGT!)</span>
            </div>
          </div>

          <!-- 🇦🇺 Australia (Sydney / Melbourne - AEST/AEDT) -->
          <div class="tz-card" id="tzCardAu" style="background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px 14px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span style="font-weight:800;font-size:13.5px;color:#ffffff;display:inline-flex;align-items:center;gap:6px">
                <span>🇦🇺</span> <span>Sydney/Melbourne</span>
              </span>
              <span id="badgeTzAu" class="tz-status-badge" style="font-size:10.5px;font-weight:800;padding:2px 7px;border-radius:6px;font-family:var(--font-mono);background:rgba(16,185,129,0.2);color:#6ee7b7;border:1px solid rgba(16,185,129,0.5)">🟢 CALL NOW</span>
            </div>
            <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:11px;color:#94a3b8">Sydney (AEDT):</span>
              <span id="clockAu" style="font-family:var(--font-mono);font-size:14px;font-weight:800;color:#34d399">--:-- --</span>
            </div>
            <div style="font-size:11px;color:#cbd5e1;background:rgba(255,255,255,0.04);padding:5px 8px;border-radius:6px;border-left:2px solid #10b981">
              <strong style="color:#fbbf24">🌙 Night Grind:</strong> 5:00 PM – 1:30 AM EST<br>
              <span style="font-size:10px;color:#94a3b8">(9:00 AM – 5:30 PM Sydney next day)</span>
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
              <span id="clockNz" style="font-family:var(--font-mono);font-size:14px;font-weight:800;color:#a855f7">--:-- --</span>
            </div>
            <div style="font-size:11px;color:#cbd5e1;background:rgba(255,255,255,0.04);padding:5px 8px;border-radius:6px;border-left:2px solid #a855f7">
              <strong style="color:#fbbf24">Evening / Night:</strong> 4:00 PM – 11:30 PM EST<br>
              <span style="font-size:10px;color:#94a3b8">(10:00 AM – 5:30 PM NZDT next day)</span>
            </div>
          </div>

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
              <strong style="color:#fbbf24">Morning US Time:</strong> 4:00 AM – 12:00 PM EST<br>
              <span style="font-size:10px;color:#94a3b8">(9:00 AM – 5:00 PM London)</span>
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
              <strong style="color:#fbbf24">Daytime US:</strong> 9:00 AM – 5:00 PM EST<br>
              <span style="font-size:10px;color:#94a3b8">(Direct daytime overlap with US)</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Time Zone Filter Pill Strip -->`;

if (oldClockGridRegex.test(html)) {
  html = html.replace(oldClockGridRegex, newClockGrid);
  console.log('✅ Updated intlTimeZoneClockGrid with Perth and Singapore');
}

// 8. Update Time Zone Filter Pill Strip
const oldPillStripRegex = /<!-- Time Zone Filter Pill Strip -->[\s\S]*?<div style="display:flex;align-items:center;gap:8px;margin-top:14px;flex-wrap:wrap">[\s\S]*?<\/div>/;
const newPillStrip = `<!-- Time Zone Filter Pill Strip -->
        <div style="display:flex;align-items:center;gap:8px;margin-top:14px;flex-wrap:wrap">
          <span style="font-size:11px;font-family:var(--font-mono);color:#fbbf24;font-weight:800;text-transform:uppercase">Quick Filter:</span>
          <button type="button" class="lead-pill-btn active" id="btnFilterTzAll" onclick="filterIntlByCountry('all')">🌍 All Countries (250)</button>
          <button type="button" class="lead-pill-btn" id="btnFilterNightGrind" onclick="filterIntlNightGrind()" style="background:linear-gradient(135deg,rgba(245,158,11,0.25),rgba(217,119,6,0.25));border:1.5px solid #f59e0b;color:#fbbf24;font-weight:800;box-shadow:0 0 14px rgba(245,158,11,0.3)">
            <span>🌙 Night Grind (10 PM - 3 AM US) (155)</span>
          </button>
          <button type="button" class="lead-pill-btn" id="btnFilterTzOpenNow" onclick="filterIntlOpenNow()" style="background:rgba(16,185,129,0.2);border-color:#10b981;color:#6ee7b7;font-weight:800">
            <span>🟢 Call Now: Currently in Work Hours (<span id="countOpenNow">--</span>)</span>
          </button>
          <button type="button" class="lead-pill-btn" id="btnFilterTzAu" onclick="filterIntlByCountry('Australia')">🇦🇺 Australia (85)</button>
          <button type="button" class="lead-pill-btn" id="btnFilterTzSg" onclick="filterIntlByCountry('Singapore')">🇸🇬 Singapore (40)</button>
          <button type="button" class="lead-pill-btn" id="btnFilterTzUk" onclick="filterIntlByCountry('United Kingdom')">🇬🇧 UK (40)</button>
          <button type="button" class="lead-pill-btn" id="btnFilterTzCa" onclick="filterIntlByCountry('Canada')">🇨🇦 Canada (35)</button>
          <button type="button" class="lead-pill-btn" id="btnFilterTzNz" onclick="filterIntlByCountry('New Zealand')">🇳🇿 New Zealand (30)</button>
          <button type="button" class="lead-pill-btn" id="btnFilterTzIe" onclick="filterIntlByCountry('Ireland')">🇮🇪 Ireland (20)</button>
        </div>`;

if (oldPillStripRegex.test(html)) {
  html = html.replace(oldPillStripRegex, newPillStrip);
  console.log('✅ Updated Time Zone Filter Pill Strip with Night Grind & Singapore');
}

// 9. Update KPI Numbers
html = html.replace('150 Businesses', '250 Businesses');
html = html.replace('UK · AU · CA · IE · NZ', 'AU (85) · SG (40) · UK (40) · CA (35) · NZ (30) · IE (20)');
html = html.replace('5 Global Hubs', '6 Global Hubs');
html = html.replace('$4,850,000 / yr', '$8,150,000 / yr');

// 10. Update intlCountryFilterSelect
const oldCountrySelectRegex = /<select id="intlCountryFilterSelect" class="custom-select" onchange="handleIntlFilterChange\(\)">[\s\S]*?<\/select>/;
const newCountrySelect = `<select id="intlCountryFilterSelect" class="custom-select" onchange="handleIntlFilterChange()">
            <option value="all">All Countries (250)</option>
            <option value="night_grind">🌙 Night Grind (10 PM - 3 AM US) (155)</option>
            <option value="Australia">🇦🇺 Australia (85)</option>
            <option value="Singapore">🇸🇬 Singapore (40)</option>
            <option value="United Kingdom">🇬🇧 United Kingdom (40)</option>
            <option value="Canada">🇨🇦 Canada (35)</option>
            <option value="New Zealand">🇳🇿 New Zealand (30)</option>
            <option value="Ireland">🇮🇪 Ireland (20)</option>
          </select>`;

if (oldCountrySelectRegex.test(html)) {
  html = html.replace(oldCountrySelectRegex, newCountrySelect);
  console.log('✅ Updated intlCountryFilterSelect');
}

// 11. Update Status Pills (150 -> 250)
html = html.replace('All Status (<span id="intlCountStatusAll">150</span>)', 'All Status (<span id="intlCountStatusAll">250</span>)');
html = html.replace('Remaining To Call (<span id="intlCountStatusUncalled">150</span>)', 'Remaining To Call (<span id="intlCountStatusUncalled">250</span>)');

// 12. Replace the embedded window.INTERNATIONAL_150_LEADS = [...] with full 250 leads
const leadDataStartMarker = '// ============================================================\n// INTERNATIONAL 150 LEADS DATASET (100% ENGLISH SPEAKING)\n// ============================================================\nwindow.INTERNATIONAL_150_LEADS = ';

const leadDataEndMarker = ';\n\n// Active Workbench State Variables';

const startIdx = html.indexOf(leadDataStartMarker);
const endIdx = html.indexOf(leadDataEndMarker, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const before = html.substring(0, startIdx + leadDataStartMarker.length);
  const after = html.substring(endIdx);
  html = before + JSON.stringify(leads, null, 2) + after;
  console.log(`✅ Successfully injected ${leads.length} leads into window.INTERNATIONAL_150_LEADS!`);
} else {
  console.error('❌ Could not find lead dataset boundaries');
}

// 13. Update JavaScript helper functions: filterIntlNightGrind & updateIntlWorldClocks
const oldClockJsRegex = /window\.updateIntlWorldClocks = function\(\) \{[\s\S]*?setInterval\(window\.updateIntlWorldClocks, 1000\);/;
const newClockJs = `window.updateIntlWorldClocks = function() {
  const now = new Date();

  // US Clocks
  const optUs = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  const elUsEst = document.getElementById('clockUsEst');
  const elUsCst = document.getElementById('clockUsCst');
  const elUsPst = document.getElementById('clockUsPst');
  if (elUsEst) elUsEst.textContent = now.toLocaleTimeString('en-US', { ...optUs, timeZone: 'America/New_York' });
  if (elUsCst) elUsCst.textContent = now.toLocaleTimeString('en-US', { ...optUs, timeZone: 'America/Chicago' });
  if (elUsPst) elUsPst.textContent = now.toLocaleTimeString('en-US', { ...optUs, timeZone: 'America/Los_Angeles' });

  // Regional Clocks
  const elUk = document.getElementById('clockUk');
  const elAu = document.getElementById('clockAu');
  const elPerth = document.getElementById('clockPerth');
  const elSg = document.getElementById('clockSg');
  const elCa = document.getElementById('clockCa');
  const elIe = document.getElementById('clockIe');
  const elNz = document.getElementById('clockNz');

  if (elUk) elUk.textContent = now.toLocaleTimeString('en-GB', { ...optUs, timeZone: 'Europe/London' });
  if (elAu) elAu.textContent = now.toLocaleTimeString('en-AU', { ...optUs, timeZone: 'Australia/Sydney' });
  if (elPerth) elPerth.textContent = now.toLocaleTimeString('en-AU', { ...optUs, timeZone: 'Australia/Perth' });
  if (elSg) elSg.textContent = now.toLocaleTimeString('en-SG', { ...optUs, timeZone: 'Asia/Singapore' });
  if (elCa) elCa.textContent = now.toLocaleTimeString('en-CA', { ...optUs, timeZone: 'America/Toronto' });
  if (elIe) elIe.textContent = now.toLocaleTimeString('en-IE', { ...optUs, timeZone: 'Europe/Dublin' });
  if (elNz) elNz.textContent = now.toLocaleTimeString('en-NZ', { ...optUs, timeZone: 'Pacific/Auckland' });

  // Update Badges & Open Counts
  function setStatus(badgeId, timeZone) {
    const el = document.getElementById(badgeId);
    if (!el) return;
    const hour = parseInt(now.toLocaleTimeString('en-US', { timeZone, hour: 'numeric', hour12: false }), 10);
    const isOpen = hour >= 9 && hour < 17; // 9am - 5pm work hours
    if (isOpen) {
      el.textContent = '🟢 CALL NOW';
      el.style.background = 'rgba(16,185,129,0.2)';
      el.style.color = '#6ee7b7';
      el.style.borderColor = 'rgba(16,185,129,0.5)';
    } else {
      el.textContent = '🟡 AFTER HOURS';
      el.style.background = 'rgba(245,158,11,0.2)';
      el.style.color = '#fbbf24';
      el.style.borderColor = 'rgba(245,158,11,0.5)';
    }
  }

  setStatus('badgeTzUk', 'Europe/London');
  setStatus('badgeTzAu', 'Australia/Sydney');
  setStatus('badgeTzPerth', 'Australia/Perth');
  setStatus('badgeTzSg', 'Asia/Singapore');
  setStatus('badgeTzCa', 'America/Toronto');
  setStatus('badgeTzIe', 'Europe/Dublin');
  setStatus('badgeTzNz', 'Pacific/Auckland');

  // Count open now
  const openCountEl = document.getElementById('countOpenNow');
  if (openCountEl && Array.isArray(window.INTERNATIONAL_150_LEADS)) {
    let openCount = 0;
    window.INTERNATIONAL_150_LEADS.forEach(l => {
      const h24 = parseInt(now.toLocaleTimeString('en-US', { timeZone: l.timezone, hour: 'numeric', hour12: false }), 10);
      if (h24 >= 9 && h24 < 17) openCount++;
    });
    openCountEl.textContent = openCount;
  }
};
setInterval(window.updateIntlWorldClocks, 1000);`;

if (oldClockJsRegex.test(html)) {
  html = html.replace(oldClockJsRegex, newClockJs);
  console.log('✅ Updated window.updateIntlWorldClocks');
}

// 14. Add window.filterIntlNightGrind & update handleIntlFilterChange
const oldFilterChangeRegex = /if \(countryVal !== 'all'\) \{[\s\S]*?filtered = filtered\.filter\(l => l\.country === countryVal\);\s*\}/;
const newFilterChange = `if (countryVal === 'night_grind') {
    filtered = filtered.filter(l => l.country === 'Australia' || l.country === 'Singapore' || l.country === 'New Zealand');
  } else if (countryVal !== 'all') {
    filtered = filtered.filter(l => l.country === countryVal);
  }`;

if (oldFilterChangeRegex.test(html)) {
  html = html.replace(oldFilterChangeRegex, newFilterChange);
  console.log('✅ Updated handleIntlFilterChange with night_grind filter');
}

// Add window.filterIntlNightGrind
if (!html.includes('window.filterIntlNightGrind =')) {
  const insertMarker = 'window.filterIntlByCountry = function(country) {';
  const nightGrindFunc = `window.filterIntlNightGrind = function() {
  window.INTL_COUNTRY_FILTER = 'night_grind';
  const sel = document.getElementById('intlCountryFilterSelect');
  if (sel) sel.value = 'night_grind';
  const batchSel = document.getElementById('intlBatchSelect');
  if (batchSel) batchSel.value = 'night_grind';

  document.querySelectorAll('.tz-filter-pill, .lead-pill-btn').forEach(btn => btn.classList.remove('active'));
  const btn = document.getElementById('btnFilterNightGrind');
  if (btn) btn.classList.add('active');

  window.renderInternationalLeadsTable();
  if (typeof showToast === 'function') showToast('🌙 Showing 155 Night Grind Targets (AU, SG, NZ)');
};

`;
  html = html.replace(insertMarker, nightGrindFunc + insertMarker);
  console.log('✅ Injected window.filterIntlNightGrind');
}

// Update batch change to support night_grind
html = html.replace(
  "if (val === 'open_now') {",
  `if (val === 'night_grind') {
    window.filterIntlNightGrind();
    return;
  }
  if (val === 'open_now') {`
);

// Update download CSV name in export function
html = html.replace("a.download = 'vantorx_international_150_leads.csv';", "a.download = 'vantorx_private_250_leads.csv';");
html = html.replace("Exported 150 International Leads CSV", "Exported 250 Private Leads CSV");

fs.writeFileSync(indexPath, html, 'utf8');
console.log('🎉 Successfully updated website/cold-call-arena/index.html!');
