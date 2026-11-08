const fs = require('fs');
const path = require('path');

const arenaPath = path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
let html = fs.readFileSync(arenaPath, 'utf8');

const targetToken = '<div class="fl-script-phases-grid">';
const idx = html.indexOf(targetToken);

if (idx !== -1) {
  const floridaDualTabs = `<!-- FLORIDA SCRIPT DUAL TABS -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
        <button type="button" id="flDrawerTab1" onclick="switchFlDrawerTab('tab1')" style="padding:10px 14px;border:none;border-radius:10px;font-size:12.5px;font-weight:900;cursor:pointer;background:rgba(245,158,11,0.95);color:#0b0f19;box-shadow:0 2px 8px rgba(245,158,11,0.3)">
          ⚡ Tab 1: "Transfer Me Back" Hook (Default)
        </button>
        <button type="button" id="flDrawerTab2" onclick="switchFlDrawerTab('tab2')" style="padding:10px 14px;border:1px solid rgba(255,255,255,0.15);border-radius:10px;font-size:12.5px;font-weight:700;cursor:pointer;background:transparent;color:#94a3b8">
          📜 Tab 2: Direct "Drop the Ball" Hook
        </button>
      </div>

      <!-- TAB 1 PANE: "TRANSFER ME BACK" FLORIDA HOOK -->
      <div id="flDrawerPane1" style="display:block;margin-bottom:16px">
        <div style="background:rgba(245,158,11,0.1);border:1.5px solid rgba(245,158,11,0.45);border-radius:12px;padding:14px 18px;margin-bottom:12px">
          <div style="font-size:11px;font-family:var(--font-mono);font-weight:800;color:#fbbf24;text-transform:uppercase;letter-spacing:0.06em">
            ⚡ VERBATIM HOOK — ALWAYS START WITH THIS:
          </div>
          <div style="font-size:17px;font-weight:900;color:#ffffff;margin-top:4px" id="flTransferOpener">
            "Hey, I was just talking to the owner, I'm wondering if you can transfer me back?"
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <!-- Transferred / Owner Picks Up -->
          <div style="background:#0a0e1a;border:1.5px solid #10b981;border-radius:12px;padding:14px">
            <div style="font-size:12px;font-weight:800;color:#34d399;text-transform:uppercase;margin-bottom:8px">
              📞 Transferred / Owner Answers ("Yeah, who's this?")
            </div>
            <div style="font-size:13px;color:#e2e8f0;line-height:1.55" id="flTransferOwnerSpeech">
              "Hey <em class="fl-tag-owner">Dave</em>, appreciate you hopping back on! Look, I'll be super direct—I was looking at <strong class="fl-tag-company">Tampa Bay Precision Plumbing</strong> on Google Maps here in <span class="fl-tag-city">Tampa</span>. You have <em class="fl-tag-rating">4.8★ and 31 reviews</em>, but literally no website link on your profile.<br><br>
              When a homeowner's <span class="fl-tag-trade-issue">pipe bursts or emergency strikes</span> at 8 PM, 80% tap the website button to check pricing. Because you don't have one, Google pushes them to competitors, costing you easily <strong class="fl-tag-loss" style="color:#ef4444">$9,500/mo</strong>.<br><br>
              I already built a mobile preview site for <strong class="fl-tag-company">Tampa Bay Precision Plumbing</strong> that loads in 0.8s with an instant emergency booking form. <strong>Can I text the 30-second preview link to your cell right now?</strong>"
            </div>
          </div>

          <!-- Gatekeeper Pushback -->
          <div style="background:#0a0e1a;border:1.5px solid #f59e0b;border-radius:12px;padding:14px">
            <div style="font-size:12px;font-weight:800;color:#fbbf24;text-transform:uppercase;margin-bottom:8px">
              🛡️ Gatekeeper: "What was this regarding?"
            </div>
            <div style="font-size:13px;color:#e2e8f0;line-height:1.55">
              "Yeah, it was regarding his Google business listing dropping emergency calls to competitors because the website link is missing—<strong>is he out on a job site right now or at his desk?</strong>"<br><br>
              <em>If on site:</em> "Got it! What's the best mobile number to text the 30-second mockup to before he heads home?"<br><br>
              <em>If take a message:</em> "Sure, what's his direct email? I'll send over the 1-page revenue bleed audit for <strong class="fl-tag-company">Tampa Bay Precision Plumbing</strong> so he has it on his phone tonight."
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2 PANE: ORIGINAL 3 PHASES -->
      <div id="flDrawerPane2" style="display:none">
`;

  // Find the end of fl-script-phases-grid
  const gridEndToken = '<!-- OBJECTION CRUSHERS & QUICK SMS ACTION -->';
  const gridEndIdx = html.indexOf(gridEndToken);
  
  if (gridEndIdx !== -1) {
    html = html.substring(0, idx) + floridaDualTabs + html.substring(idx, gridEndIdx) + '</div><!-- END flDrawerPane2 -->\n      ' + html.substring(gridEndIdx);
    console.log('Successfully added Dual Tabs to Florida drawer in index.html!');
  }
}

// Add JS switcher for Florida drawer
const flDrawerJs = `
  window.switchFlDrawerTab = function(tab) {
    const p1 = document.getElementById('flDrawerPane1');
    const p2 = document.getElementById('flDrawerPane2');
    const b1 = document.getElementById('flDrawerTab1');
    const b2 = document.getElementById('flDrawerTab2');

    if (tab === 'tab2') {
      if (p1) p1.style.display = 'none';
      if (p2) p2.style.display = 'block';
      if (b1) { b1.style.background = 'transparent'; b1.style.color = '#94a3b8'; b1.style.boxShadow = 'none'; b1.style.border = '1px solid rgba(255,255,255,0.15)'; }
      if (b2) { b2.style.background = 'rgba(245,158,11,0.95)'; b2.style.color = '#0b0f19'; b2.style.boxShadow = '0 2px 8px rgba(245,158,11,0.3)'; b2.style.border = 'none'; }
    } else {
      if (p1) p1.style.display = 'block';
      if (p2) p2.style.display = 'none';
      if (b1) { b1.style.background = 'rgba(245,158,11,0.95)'; b1.style.color = '#0b0f19'; b1.style.boxShadow = '0 2px 8px rgba(245,158,11,0.3)'; b1.style.border = 'none'; }
      if (b2) { b2.style.background = 'transparent'; b2.style.color = '#94a3b8'; b2.style.boxShadow = 'none'; b2.style.border = '1px solid rgba(255,255,255,0.15)'; }
    }
  };
`;

const scriptEnd = html.lastIndexOf('</script>');
html = html.substring(0, scriptEnd) + flDrawerJs + html.substring(scriptEnd);

fs.writeFileSync(arenaPath, html, 'utf8');
console.log('Saved updated Florida drawer in index.html!');
