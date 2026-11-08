const fs = require('fs');
const path = require('path');

const arenaPath = path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
let html = fs.readFileSync(arenaPath, 'utf8');

// 1. Add 5-Engine Enrichment Toolbar right after the button container in activeLeadBanner
if (!html.includes('id="btnHunterSearch"')) {
  const targetRegex = /(<button class="btn btn-ghost btn-sm" id="clearActiveLeadBtn">[\s\S]*?<\/button>\s*<\/div>\s*<\/div>)/;
  const replacement = `$1

        <!-- 🔍 5-ENGINE EMAIL FINDER & ENRICHMENT QUICK LAUNCHER -->
        <div class="lead-enrichment-toolbar" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:8px 12px;background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.08);border-radius:8px;margin-top:10px">
          <span style="font-size:11px;font-family:var(--font-mono);color:var(--accent2);font-weight:800;letter-spacing:0.04em">🔍 FIND EMAILS (5 ENGINES):</span>
          <a id="btnHunterSearch" href="https://hunter.io" target="_blank" class="btn btn-ghost btn-xs" style="border:1px solid rgba(245,158,11,0.4);color:#fbbf24;font-size:10.5px;padding:3px 8px;text-decoration:none" title="Search domain on Hunter.io">🦊 Hunter.io</a>
          <a id="btnApolloSearch" href="https://app.apollo.io" target="_blank" class="btn btn-ghost btn-xs" style="border:1px solid rgba(56,189,248,0.4);color:#7dd3fc;font-size:10.5px;padding:3px 8px;text-decoration:none" title="Search owner & company on Apollo.io">🏛️ Apollo.io</a>
          <a id="btnSnovSearch" href="https://snov.io" target="_blank" class="btn btn-ghost btn-xs" style="border:1px solid rgba(168,85,247,0.4);color:#d8b4fe;font-size:10.5px;padding:3px 8px;text-decoration:none" title="Find email on Snov.io">❄️ Snov.io</a>
          <a id="btnRocketReachSearch" href="https://rocketreach.co" target="_blank" class="btn btn-ghost btn-xs" style="border:1px solid rgba(52,211,153,0.4);color:#6ee7b7;font-size:10.5px;padding:3px 8px;text-decoration:none" title="Lookup on RocketReach">🚀 RocketReach</a>
          <a id="btnContactOutSearch" href="https://contactout.com" target="_blank" class="btn btn-ghost btn-xs" style="border:1px solid rgba(244,63,94,0.4);color:#fda4af;font-size:10.5px;padding:3px 8px;text-decoration:none" title="Find contact on ContactOut">📇 ContactOut</a>
          <button type="button" class="btn btn-ghost btn-xs" onclick="openEnrichmentModal()" style="border:1px solid rgba(245,158,11,0.6);color:#fbbf24;font-size:10.5px;padding:3px 8px;margin-left:auto">⚡ Open Multi-Engine Finder</button>
        </div>`;
  html = html.replace(targetRegex, replacement);
  console.log('1. Added 5-engine toolbar to activeLeadBanner via regex.');
}

// 2. Fix activeLead reference in window.openEnrichmentModal
html = html.replace(
  /window\.openEnrichmentModal\s*=\s*function\(\s*lead\s*\)\s*\{[\s\S]*?const l = lead \|\| activeLead \|\|/g,
  `window.openEnrichmentModal = function(lead) {
    const l = lead || (typeof activeLead !== 'undefined' ? activeLead : null) || (window.LEADS_DATA ? window.LEADS_DATA[0] : null) || (window.FLORIDA_100_NO_WEBSITE_LEADS ? window.FLORIDA_100_NO_WEBSITE_LEADS[0] : null);`
);
console.log('2. Fixed openEnrichmentModal lead reference.');

fs.writeFileSync(arenaPath, html, 'utf8');
console.log('Saved fix_enrichment_ui.js updates successfully!');
