const fs = require('fs');
const path = require('path');

const arenaPath = path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
const flHtmlPath = path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'florida-no-website.html');
const flJsonPath = path.resolve(__dirname, '..', 'data', 'florida_100_no_website_leads.json');

const enrichedFlLeads = JSON.parse(fs.readFileSync(flJsonPath, 'utf8'));

console.log('Enriched Florida leads loaded:', enrichedFlLeads.length);

let arenaHtml = fs.readFileSync(arenaPath, 'utf8');

// 1. ADD 5-ENGINE ENRICHMENT TOOLBAR TO ACTIVE LEAD BANNER IN TELEPROMPTER
const bannerSearchToken = '<button class="btn btn-ghost btn-sm" id="clearActiveLeadBtn">❌ Clear Lead</button>';
const enrichmentToolbarHtml = `<button class="btn btn-ghost btn-sm" id="clearActiveLeadBtn">❌ Clear Lead</button>
          </div>
        </div>

        <!-- 🔍 5-ENGINE EMAIL FINDER & ENRICHMENT QUICK LAUNCHER -->
        <div class="lead-enrichment-toolbar" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:8px 12px;background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.08);border-radius:8px;margin-top:10px">
          <span style="font-size:11px;font-family:var(--font-mono);color:var(--accent2);font-weight:800;letter-spacing:0.04em">🔍 FIND EMAILS (5 ENGINES):</span>
          <a id="btnHunterSearch" href="https://hunter.io" target="_blank" class="btn btn-ghost btn-xs" style="border:1px solid rgba(245,158,11,0.4);color:#fbbf24;font-size:10.5px;padding:3px 8px;text-decoration:none" title="Search domain on Hunter.io">🦊 Hunter.io</a>
          <a id="btnApolloSearch" href="https://app.apollo.io" target="_blank" class="btn btn-ghost btn-xs" style="border:1px solid rgba(56,189,248,0.4);color:#7dd3fc;font-size:10.5px;padding:3px 8px;text-decoration:none" title="Search owner & company on Apollo.io">🏛️ Apollo.io</a>
          <a id="btnSnovSearch" href="https://snov.io" target="_blank" class="btn btn-ghost btn-xs" style="border:1px solid rgba(168,85,247,0.4);color:#d8b4fe;font-size:10.5px;padding:3px 8px;text-decoration:none" title="Find email on Snov.io">❄️ Snov.io</a>
          <a id="btnRocketReachSearch" href="https://rocketreach.co" target="_blank" class="btn btn-ghost btn-xs" style="border:1px solid rgba(52,211,153,0.4);color:#6ee7b7;font-size:10.5px;padding:3px 8px;text-decoration:none" title="Lookup on RocketReach">🚀 RocketReach</a>
          <a id="btnContactOutSearch" href="https://contactout.com" target="_blank" class="btn btn-ghost btn-xs" style="border:1px solid rgba(244,63,94,0.4);color:#fda4af;font-size:10.5px;padding:3px 8px;text-decoration:none" title="Find contact on ContactOut">📇 ContactOut</a>
          <button type="button" class="btn btn-ghost btn-xs" onclick="openEnrichmentModal()" style="border:1px solid rgba(245,158,11,0.6);color:#fbbf24;font-size:10.5px;padding:3px 8px;margin-left:auto">⚡ Open Multi-Engine Finder</button>
        </div>`;

if (arenaHtml.includes(bannerSearchToken) && !arenaHtml.includes('btnHunterSearch')) {
  arenaHtml = arenaHtml.replace(bannerSearchToken + '\n        </div>', enrichmentToolbarHtml);
  console.log('1. Added 5-Engine Enrichment Toolbar to Active Lead Banner.');
}

// 2. UPDATE window.FLORIDA_100_NO_WEBSITE_LEADS IN index.html
const flArrayStartToken = 'window.FLORIDA_100_NO_WEBSITE_LEADS = [';
const flArrayEndToken = 'window.FL_CURRENT_SELECTED_LEAD = window.FLORIDA_100_NO_WEBSITE_LEADS[0];';

const flStartIdx = arenaHtml.indexOf(flArrayStartToken);
const flEndIdx = arenaHtml.indexOf(flArrayEndToken);

if (flStartIdx !== -1 && flEndIdx !== -1) {
  const replacement = `window.FLORIDA_100_NO_WEBSITE_LEADS = ${JSON.stringify(enrichedFlLeads, null, 2)};\n  `;
  arenaHtml = arenaHtml.substring(0, flStartIdx) + replacement + arenaHtml.substring(flEndIdx);
  console.log('2. Injected enriched Florida leads with emails and 5-engine links into index.html.');
}

// 3. INJECT DYNAMIC LINK UPDATES IN loadLeadIntoTeleprompter
const loadLeadTagSearch = `document.querySelectorAll('.dyn-owner').forEach(el => el.textContent = lead.owner);`;
const enrichmentLinksCode = `// Update 5-Engine Email Finder Links (Hunter, Apollo, Snov, RocketReach, ContactOut)
    const dom = lead.website && lead.website.startsWith('http') ? lead.website.replace(/^https?:\\/\\//, '').replace(/^www\\./, '').split('/')[0] : '';
    const q = encodeURIComponent(\`\${lead.owner} \${lead.company}\`);
    const domQ = encodeURIComponent(dom || lead.company);
    const hBtn = document.getElementById('btnHunterSearch'); if (hBtn) hBtn.href = \`https://hunter.io/try/search/\${domQ}\`;
    const aBtn = document.getElementById('btnApolloSearch'); if (aBtn) aBtn.href = \`https://app.apollo.io/#/people?qKeywords=\${q}&page=1\`;
    const sBtn = document.getElementById('btnSnovSearch'); if (sBtn) sBtn.href = \`https://snov.io/email-finder?query=\${domQ}\`;
    const rBtn = document.getElementById('btnRocketReachSearch'); if (rBtn) rBtn.href = \`https://rocketreach.co/person?name=\${encodeURIComponent(lead.owner)}&company=\${encodeURIComponent(lead.company)}\`;
    const cBtn = document.getElementById('btnContactOutSearch'); if (cBtn) cBtn.href = \`https://contactout.com/search?q=\${q}\`;

    document.querySelectorAll('.dyn-owner').forEach(el => el.textContent = lead.owner);`;

if (arenaHtml.includes(loadLeadTagSearch) && !arenaHtml.includes('btnHunterSearch.href')) {
  arenaHtml = arenaHtml.replace(loadLeadTagSearch, enrichmentLinksCode);
  console.log('3. Injected dynamic 5-engine link updating into loadLeadIntoTeleprompter.');
}

// 4. ADD MULTI-ENGINE ENRICHMENT MODAL IN index.html
const modalHtml = `
<!-- 🔍 Multi-Engine Email Enrichment Modal (Hunter, Apollo, Snov, RocketReach, ContactOut) -->
<div class="modal-overlay" id="enrichmentModal" style="z-index:99999;background:rgba(5,8,14,0.94);backdrop-filter:blur(14px)">
  <div class="modal-box" style="max-width:620px;border:1.5px solid rgba(245,158,11,0.5);box-shadow:0 0 50px rgba(0,0,0,0.9),0 0 30px rgba(245,158,11,0.25);border-radius:18px;padding:24px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.1)">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:26px">🔍</span>
        <div>
          <h3 style="font-family:var(--font-head);font-size:19px;color:#ffffff;margin:0">Multi-Engine Email Finder</h3>
          <span style="font-size:11px;color:var(--dim)">Hunter.io · Apollo.io · Snov.io · RocketReach · ContactOut</span>
        </div>
      </div>
      <button type="button" class="btn btn-ghost btn-sm" onclick="closeEnrichmentModal()" style="font-size:16px;padding:4px 8px">✕</button>
    </div>

    <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:14px;margin-bottom:16px">
      <div style="font-size:11px;font-family:var(--font-mono);color:var(--accent2);font-weight:800;text-transform:uppercase;margin-bottom:4px">Target Profile:</div>
      <div style="font-size:16px;font-weight:800;color:#ffffff" id="enrichModalLeadCompany">Palm Air Air Conditioning, Inc.</div>
      <div style="font-size:12.5px;color:#cbd5e1;margin-top:2px">
        Owner: <strong style="color:#fbbf24" id="enrichModalLeadOwner">Everett Hill</strong> · <span id="enrichModalLeadTrade">HVAC</span> · <span id="enrichModalLeadCity">Boca Raton, FL</span>
      </div>
      <div style="font-size:13px;color:#34d399;font-weight:700;margin-top:6px;display:flex;align-items:center;gap:6px">
        <span>✉️ Primary Enriched Email:</span>
        <span id="enrichModalLeadEmail" style="font-family:var(--font-mono)">service@palmairac.com</span>
        <button type="button" class="btn btn-ghost btn-xs" onclick="copyEnrichedEmail()" style="font-size:10px;padding:2px 6px">📋 Copy</button>
      </div>
    </div>

    <div style="font-size:12px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:10px">1-Click Deep Search On Live Platforms:</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px">
      <a id="modalHunterLink" href="https://hunter.io" target="_blank" class="btn btn-ghost" style="padding:10px;border:1px solid rgba(245,158,11,0.4);color:#fbbf24;display:flex;align-items:center;gap:8px;text-decoration:none;border-radius:10px">
        <span style="font-size:18px">🦊</span>
        <div style="text-align:left">
          <div style="font-size:12.5px;font-weight:800">Hunter.io</div>
          <div style="font-size:10px;color:var(--dim)">Domain Search &amp; Mail Patterns</div>
        </div>
      </a>
      <a id="modalApolloLink" href="https://app.apollo.io" target="_blank" class="btn btn-ghost" style="padding:10px;border:1px solid rgba(56,189,248,0.4);color:#7dd3fc;display:flex;align-items:center;gap:8px;text-decoration:none;border-radius:10px">
        <span style="font-size:18px">🏛️</span>
        <div style="text-align:left">
          <div style="font-size:12.5px;font-weight:800">Apollo.io</div>
          <div style="font-size:10px;color:var(--dim)">Owner Direct Match</div>
        </div>
      </a>
      <a id="modalSnovLink" href="https://snov.io" target="_blank" class="btn btn-ghost" style="padding:10px;border:1px solid rgba(168,85,247,0.4);color:#d8b4fe;display:flex;align-items:center;gap:8px;text-decoration:none;border-radius:10px">
        <span style="font-size:18px">❄️</span>
        <div style="text-align:left">
          <div style="font-size:12.5px;font-weight:800">Snov.io</div>
          <div style="font-size:10px;color:var(--dim)">Email Finder &amp; Verifier</div>
        </div>
      </a>
      <a id="modalRocketReachLink" href="https://rocketreach.co" target="_blank" class="btn btn-ghost" style="padding:10px;border:1px solid rgba(52,211,153,0.4);color:#6ee7b7;display:flex;align-items:center;gap:8px;text-decoration:none;border-radius:10px">
        <span style="font-size:18px">🚀</span>
        <div style="text-align:left">
          <div style="font-size:12.5px;font-weight:800">RocketReach</div>
          <div style="font-size:10px;color:var(--dim)">Professional Profiles</div>
        </div>
      </a>
      <a id="modalContactOutLink" href="https://contactout.com" target="_blank" class="btn btn-ghost" style="padding:10px;border:1px solid rgba(244,63,94,0.4);color:#fda4af;display:flex;align-items:center;gap:8px;text-decoration:none;border-radius:10px;grid-column:span 2">
        <span style="font-size:18px">📇</span>
        <div style="text-align:left">
          <div style="font-size:12.5px;font-weight:800">ContactOut</div>
          <div style="font-size:10px;color:var(--dim)">Direct Personal &amp; Business Phone/Emails</div>
        </div>
      </a>
    </div>

    <div style="text-align:right">
      <button type="button" class="btn btn-gold" onclick="closeEnrichmentModal()" style="padding:8px 18px;font-size:13px;font-weight:800">Done</button>
    </div>
  </div>
</div>
`;

if (!arenaHtml.includes('id="enrichmentModal"')) {
  const bodyClose = arenaHtml.lastIndexOf('</body>');
  arenaHtml = arenaHtml.substring(0, bodyClose) + modalHtml + arenaHtml.substring(bodyClose);
  console.log('4. Injected Multi-Engine Enrichment Modal into index.html.');
}

// 5. ADD MODAL JS HANDLERS
const modalJs = `
  window.openEnrichmentModal = function(lead) {
    const l = lead || activeLead || (window.FLORIDA_100_NO_WEBSITE_LEADS ? window.FLORIDA_100_NO_WEBSITE_LEADS[0] : null);
    if (!l) return;
    const cEl = document.getElementById('enrichModalLeadCompany'); if (cEl) cEl.textContent = l.company;
    const oEl = document.getElementById('enrichModalLeadOwner'); if (oEl) oEl.textContent = l.owner;
    const tEl = document.getElementById('enrichModalLeadTrade'); if (tEl) tEl.textContent = l.trade;
    const ciEl = document.getElementById('enrichModalLeadCity'); if (ciEl) ciEl.textContent = l.city || 'Florida';
    const eEl = document.getElementById('enrichModalLeadEmail'); if (eEl) eEl.textContent = l.email || 'Searching patterns...';

    const dom = l.website && l.website.startsWith('http') ? l.website.replace(/^https?:\\/\\//, '').replace(/^www\\./, '').split('/')[0] : '';
    const q = encodeURIComponent(\`\${l.owner} \${l.company}\`);
    const domQ = encodeURIComponent(dom || l.company);

    const mh = document.getElementById('modalHunterLink'); if (mh) mh.href = \`https://hunter.io/try/search/\${domQ}\`;
    const ma = document.getElementById('modalApolloLink'); if (ma) ma.href = \`https://app.apollo.io/#/people?qKeywords=\${q}&page=1\`;
    const ms = document.getElementById('modalSnovLink'); if (ms) ms.href = \`https://snov.io/email-finder?query=\${domQ}\`;
    const mr = document.getElementById('modalRocketReachLink'); if (mr) mr.href = \`https://rocketreach.co/person?name=\${encodeURIComponent(l.owner)}&company=\${encodeURIComponent(l.company)}\`;
    const mc = document.getElementById('modalContactOutLink'); if (mc) mc.href = \`https://contactout.com/search?q=\${q}\`;

    const m = document.getElementById('enrichmentModal');
    if (m) m.classList.add('active');
  };

  window.closeEnrichmentModal = function() {
    const m = document.getElementById('enrichmentModal');
    if (m) m.classList.remove('active');
  };

  window.copyEnrichedEmail = function() {
    const eEl = document.getElementById('enrichModalLeadEmail');
    if (eEl && eEl.textContent) {
      navigator.clipboard.writeText(eEl.textContent.trim());
      showToast('📋 Copied: ' + eEl.textContent.trim());
    }
  };
`;

const lastScript = arenaHtml.lastIndexOf('</script>');
arenaHtml = arenaHtml.substring(0, lastScript) + modalJs + arenaHtml.substring(lastScript);

fs.writeFileSync(arenaPath, arenaHtml, 'utf8');
console.log('5. Saved cold-call-arena/index.html with full email enrichment suite.');

// Also update florida-no-website.html
if (fs.existsSync(flHtmlPath)) {
  let flHtml = fs.readFileSync(flHtmlPath, 'utf8');
  const flArrayStart = 'let LEADS = window.FLORIDA_100_NO_WEBSITE_LEADS;';
  if (flHtml.includes('window.FLORIDA_100_NO_WEBSITE_LEADS = [')) {
    const startIdx = flHtml.indexOf('window.FLORIDA_100_NO_WEBSITE_LEADS = [');
    const endIdx = flHtml.indexOf('];', startIdx);
    if (startIdx !== -1 && endIdx !== -1) {
      flHtml = flHtml.substring(0, startIdx) + `window.FLORIDA_100_NO_WEBSITE_LEADS = ${JSON.stringify(enrichedFlLeads, null, 2)}` + flHtml.substring(endIdx);
      fs.writeFileSync(flHtmlPath, flHtml, 'utf8');
      console.log('6. Updated florida-no-website.html with enriched leads.');
    }
  }
}

console.log('Enrichment UI integration complete!');
