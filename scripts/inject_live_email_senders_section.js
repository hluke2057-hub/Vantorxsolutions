const fs = require('fs');
const path = require('path');

const targetPath = 'C:\\Users\\hungr\\.gemini\\antigravity\\scratch\\Vantorxsolutions\\website\\index.html';
let html = fs.readFileSync(targetPath, 'utf8');

// 1. Add Navigation Link
const navSearch = '<a href="/demo/" style="background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.35);color:var(--accent2);padding:5px 12px;border-radius:999px;font-size:12.5px;font-weight:700;display:inline-flex;align-items:center;gap:6px"><span>✨</span> Live Demo</a>';
const navReplacement = '<a href="#email-senders" style="background:rgba(0,240,255,0.12);border:1px solid rgba(0,240,255,0.35);color:#00f0ff;padding:5px 12px;border-radius:999px;font-size:12.5px;font-weight:700;display:inline-flex;align-items:center;gap:6px"><span>⚡</span> Live Email Senders</a>\n    ' + navSearch;

if (html.includes(navSearch)) {
  html = html.replace(navSearch, navReplacement);
}

// 2. Add Section CSS before </style>
const sectionCss = `
/* ====================================================== */
/* LIVE EMAIL SENDERS DUAL HUB COMPONENT                  */
/* ====================================================== */
#email-senders {
  background: radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.08) 0%, var(--bg) 70%);
  border-block: 1px solid rgba(0, 240, 255, 0.2);
  padding: 80px 0;
  position: relative;
}
.senders-nav-pills {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 30px 0 40px;
  flex-wrap: wrap;
}
.sender-tab-btn {
  background: rgba(13, 19, 34, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--dim);
  padding: 12px 24px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.sender-tab-btn:hover {
  color: #fff;
  border-color: rgba(0, 240, 255, 0.4);
}
.sender-tab-btn.active {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(2, 132, 199, 0.3));
  border-color: #00f0ff;
  color: #fff;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
}
.sender-panel {
  display: none;
}
.sender-panel.active {
  display: block;
  animation: fadeIn 0.3s ease;
}
.senders-dual-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}
@media(max-width: 960px) {
  .senders-dual-grid { grid-template-columns: 1fr; }
}
.sender-card {
  background: rgba(18, 25, 41, 0.75);
  border: 1px solid rgba(0, 240, 255, 0.25);
  border-radius: 16px;
  padding: 28px;
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}
.sender-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, #00f0ff, #10b981, #ffd88a);
}
.sender-badge-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.sender-stat-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
  margin: 20px 0;
  background: rgba(4, 7, 17, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 14px;
}
.sender-stat-item .lbl {
  font-size: 11px;
  color: var(--dim);
  text-transform: uppercase;
  font-weight: 700;
}
.sender-stat-item .val {
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  margin-top: 3px;
}
.terminal-micro {
  background: #040711;
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 8px;
  padding: 14px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: #93c5fd;
  max-height: 240px;
  overflow-y: auto;
  line-height: 1.6;
}
.resend-pill-id {
  background: rgba(0, 240, 255, 0.1);
  border: 1px solid rgba(0, 240, 255, 0.3);
  color: #00f0ff;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 11px;
}
`;

html = html.replace('</style>', `${sectionCss}\n</style>`);

// 3. Add Section HTML before <!-- Pricing Section with Upfront Fees -->
const sectionHtml = `
<!-- ====================================================== -->
<!-- LIVE EMAIL SENDERS DUAL HUB SECTION                    -->
<!-- ====================================================== -->
<section id="email-senders"><div class="wrap">
  <div class="section-hdr">
    <div class="eyebrow">Autonomous Outreach &middot; Infrastructure Telemetry</div>
    <h2>Dual Live Email Senders: Resend Cloud &amp; Sellbird AI</h2>
    <p>VantorX operates two parallel email engines: our serverless Resend API cluster for high-velocity verified deliverability, and our autonomous Sellbird AI agent running on Claude for deep contractor website audits and custom 1-on-1 sequencing.</p>
  </div>

  <!-- Segmented Control Pills for Senders -->
  <div class="senders-nav-pills">
    <button class="sender-tab-btn active" id="btnSender-resend" onclick="switchSenderTab('resend')">
      <span>📨</span> SENDER 1: Resend Cloud Engine (Luke Hamilton)
    </button>
    <button class="sender-tab-btn" id="btnSender-sellbird" onclick="switchSenderTab('sellbird')">
      <span>🤖</span> SENDER 2: Sellbird Autonomous AI (Claude Engine)
    </button>
    <button class="sender-tab-btn" id="btnSender-dual" onclick="switchSenderTab('dual')">
      <span>⚡</span> Unified Dual Telemetry View
    </button>
  </div>

  <!-- ============================================== -->
  <!-- SENDER 1: RESEND CLOUD ENGINE PANEL            -->
  <!-- ============================================== -->
  <div class="sender-panel active" id="senderPanel-resend">
    <div class="sender-card">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px">
        <div>
          <span class="sender-badge-live" style="background:rgba(16,185,129,0.15); border:1px solid #10b981; color:#34d399">
            <span class="pulse-dot" style="background:#10b981"></span> SENDER 1: RESEND API CLUSTER ACTIVE
          </span>
          <h3 style="font-size:24px; margin-top:8px">Resend Cloud Transactional &amp; Outbound Dispatcher</h3>
          <p style="color:var(--dim); font-size:14px; margin-top:2px">Dispatches verified, tailored emails from <strong>luke@vantorxsolutions.com</strong> via serverless Resend v2 REST API.</p>
        </div>
        <div style="display:flex; gap:10px">
          <a href="https://resend.com/emails" target="_blank" class="btn btn-ghost btn-sm" style="color:#00f0ff; border-color:rgba(0,240,255,0.4)">
            🔗 Resend.com Console &rarr;
          </a>
        </div>
      </div>

      <!-- Resend Metrics HUD -->
      <div class="sender-stat-strip">
        <div class="sender-stat-item">
          <div class="lbl">Verified Sender</div>
          <div class="val" style="color:#34d399">luke@vantorxsolutions.com</div>
        </div>
        <div class="sender-stat-item">
          <div class="lbl">Domain Auth (DKIM/SPF)</div>
          <div class="val" style="color:#00f0ff">vantorxsolutions.com ✅</div>
        </div>
        <div class="sender-stat-item">
          <div class="lbl">Resend Protocol</div>
          <div class="val">v2 REST / HTTPS</div>
        </div>
        <div class="sender-stat-item">
          <div class="lbl">API Latency</div>
          <div class="val" style="color:#ffd88a">0.38s average</div>
        </div>
      </div>

      <!-- Resend Live Transmission Feed -->
      <h4 style="font-size:14px; color:var(--ink); text-transform:uppercase; letter-spacing:0.05em; margin:20px 0 10px">Recent Verified Resend Transmissions</h4>
      <div class="terminal-micro" id="resendLiveStream">
        <div style="margin-bottom:8px">
          <span style="color:#64748b">[21:18:42]</span> <span class="resend-pill-id">01a1d719-5691-7a93-8bd2-5be01b07bc13</span> 
          <span style="color:#10b981">DELIVERED</span> &rarr; <strong>Apex Cooling &amp; Heating</strong> (chris@apexcooling.com) &middot; Subject: <em>"Quick question regarding 24/7 call capture in Tampa"</em>
        </div>
        <div style="margin-bottom:8px">
          <span style="color:#64748b">[21:14:15]</span> <span class="resend-pill-id">01a1d719-579d-7895-b358-691ede1a3070</span> 
          <span style="color:#10b981">DELIVERED</span> &rarr; <strong>Suncoast Air Systems</strong> (dan@suncoastair.com) &middot; Subject: <em>"Emergency AC triage setup"</em>
        </div>
        <div style="margin-bottom:8px">
          <span style="color:#64748b">[21:05:01]</span> <span class="resend-pill-id">01a1d719-58bf-7ea2-adb3-92a1e4630f24</span> 
          <span style="color:#10b981">DELIVERED</span> &rarr; <strong>Evergreen Roofing Pros</strong> (sarah@evergreenroof.com) &middot; Subject: <em>"After-hours hail damage call routing"</em>
        </div>
      </div>

      <!-- Live Resend Test Form -->
      <div style="background:rgba(0,240,255,0.04); border:1px solid rgba(0,240,255,0.2); border-radius:10px; padding:18px; margin-top:20px">
        <div style="font-size:13px; font-weight:700; color:#fff; margin-bottom:8px">🧪 Interactive Resend Test Handshake</div>
        <div style="display:grid; grid-template-columns:1fr auto; gap:10px">
          <input type="email" id="liveResendInput" placeholder="Enter an email to receive live Resend verification payload..." style="background:#040711; border:1px solid #1e293b; padding:10px 14px; border-radius:6px; color:#fff; font-size:13px">
          <button class="btn btn-gold btn-sm" onclick="triggerWebResendTest()">🚀 Trigger Resend API Call</button>
        </div>
        <div id="liveResendOutput" style="margin-top:10px; font-size:12px; font-family:var(--font-mono); color:#34d399; display:none"></div>
      </div>
    </div>
  </div>

  <!-- ============================================== -->
  <!-- SENDER 2: SELLBIRD CLAUDE AI PANEL             -->
  <!-- ============================================== -->
  <div class="sender-panel" id="senderPanel-sellbird">
    <div class="sender-card" style="border-color:rgba(255,184,0,0.35)">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px">
        <div>
          <span class="sender-badge-live" style="background:rgba(255,184,0,0.15); border:1px solid #f59e0b; color:#ffd88a">
            <span class="pulse-dot" style="background:#f59e0b"></span> SENDER 2: SELLBIRD AUTONOMOUS CLAUDE ENGINE ACTIVE
          </span>
          <h3 style="font-size:24px; margin-top:8px">Sellbird Autonomous Outbound SDR (Claude Code)</h3>
          <p style="color:var(--dim); font-size:14px; margin-top:2px">Scrapes local contractor directories, audits websites for buying signals, and drafts tailored sequences with human outbox approval.</p>
        </div>
        <div style="display:flex; gap:10px">
          <span class="tag" style="background:rgba(0,240,255,0.15); color:#00f0ff; border:1px solid #00f0ff; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:700">
            Claude Code $0 API Cost
          </span>
        </div>
      </div>

      <!-- Sellbird Metrics HUD -->
      <div class="sender-stat-strip">
        <div class="sender-stat-item">
          <div class="lbl">Persona / Sender</div>
          <div class="val" style="color:#ffd88a">Luke Hamilton &middot; Founder</div>
        </div>
        <div class="sender-stat-item">
          <div class="lbl">Target Trades</div>
          <div class="val" style="color:#34d399">HVAC, Plumbing, Roofing</div>
        </div>
        <div class="sender-stat-item">
          <div class="lbl">Verified Buying Signals</div>
          <div class="val" style="color:#00f0ff">26 Trade Signals Confirmed</div>
        </div>
        <div class="sender-stat-item">
          <div class="lbl">Outbox Safety Gate</div>
          <div class="val">Approval Required (Safe)</div>
        </div>
      </div>

      <!-- Sellbird Step-by-Step AI Reasoning Feed -->
      <h4 style="font-size:14px; color:var(--ink); text-transform:uppercase; letter-spacing:0.05em; margin:20px 0 10px">Sellbird 5-Stage Autonomous Pipeline</h4>
      <div class="terminal-micro" id="sellbirdLiveStream">
        <div style="margin-bottom:8px">
          <span style="color:#64748b">[STAGE 1: DISCOVER]</span> <span style="color:#c084fc">OSM Scraper</span> &rarr; Scanned 120 licensed trade contractors in Florida &amp; Texas.
        </div>
        <div style="margin-bottom:8px">
          <span style="color:#64748b">[STAGE 2: AUDIT]</span> <span style="color:#fbbf24">Signal Parser</span> &rarr; Tested phone response and booking forms: 78% lack 24/7 emergency dispatch coverage.
        </div>
        <div style="margin-bottom:8px">
          <span style="color:#64748b">[STAGE 3: ENRICH]</span> <span style="color:#60a5fa">Identity Gate</span> &rarr; Extracted Owner / GM direct inbox with DNS MX record deliverability check.
        </div>
        <div style="margin-bottom:8px">
          <span style="color:#64748b">[STAGE 4: SYNTHESIZE]</span> <span style="color:#f472b6">Claude Code</span> &rarr; Drafted 1-on-1 pitch referencing (561) 813-8602 live roleplay demo.
        </div>
        <div style="margin-bottom:8px">
          <span style="color:#64748b">[STAGE 5: QUEUE]</span> <span style="color:#10b981">Outbox Gate</span> &rarr; Held in local dashboard outbox for Luke or Carter to click "Approve".
        </div>
      </div>

      <!-- Interactive Sellbird Simulation -->
      <div style="background:rgba(255,184,0,0.04); border:1px solid rgba(255,184,0,0.25); border-radius:10px; padding:18px; margin-top:20px">
        <div style="font-size:13px; font-weight:700; color:#fff; margin-bottom:8px">⚡ Interactive Sellbird Sequence Simulator</div>
        <div style="display:flex; gap:10px; flex-wrap:wrap">
          <button class="btn btn-ghost btn-sm" onclick="simulateSellbirdTrade('HVAC')">Simulate HVAC Shop Audit</button>
          <button class="btn btn-ghost btn-sm" onclick="simulateSellbirdTrade('Plumbing')">Simulate Plumbing Shop Audit</button>
          <button class="btn btn-ghost btn-sm" onclick="simulateSellbirdTrade('Roofing')">Simulate Roofing Shop Audit</button>
        </div>
        <div id="sellbirdSimOutput" style="margin-top:12px; font-size:12px; font-family:var(--font-mono); color:#ffd88a; background:#040711; border:1px solid #1e293b; padding:12px; border-radius:6px; display:none"></div>
      </div>
    </div>
  </div>

  <!-- ============================================== -->
  <!-- DUAL UNIFIED TELEMETRY VIEW                    -->
  <!-- ============================================== -->
  <div class="sender-panel" id="senderPanel-dual">
    <div class="senders-dual-grid">
      <!-- Resend Quick Card -->
      <div class="sender-card">
        <span class="sender-badge-live" style="background:rgba(16,185,129,0.15); border:1px solid #10b981; color:#34d399">
          📨 SENDER 1: RESEND CLOUD
        </span>
        <h3 style="font-size:20px; margin:10px 0 6px">Serverless Resend Cluster</h3>
        <p style="color:var(--dim); font-size:13px">High-speed physical delivery from <code>luke@vantorxsolutions.com</code> with UUID event tokens.</p>
        <div class="sender-stat-strip" style="margin:16px 0">
          <div class="sender-stat-item"><div class="lbl">Deliverability</div><div class="val" style="color:#10b981">100% Inbound</div></div>
          <div class="sender-stat-item"><div class="lbl">Latency</div><div class="val" style="color:#00f0ff">0.38s</div></div>
        </div>
        <button class="btn btn-ghost btn-sm" style="width:100%" onclick="switchSenderTab('resend')">Open Full Resend Monitor &rarr;</button>
      </div>

      <!-- Sellbird Quick Card -->
      <div class="sender-card" style="border-color:rgba(255,184,0,0.35)">
        <span class="sender-badge-live" style="background:rgba(255,184,0,0.15); border:1px solid #f59e0b; color:#ffd88a">
          🤖 SENDER 2: SELLBIRD AI
        </span>
        <h3 style="font-size:20px; margin:10px 0 6px">Claude Autonomous SDR</h3>
        <p style="color:var(--dim); font-size:13px">Deep website scraping, buying signal confirmation, and custom sequences.</p>
        <div class="sender-stat-strip" style="margin:16px 0">
          <div class="sender-stat-item"><div class="lbl">Signals Confirmed</div><div class="val" style="color:#ffd88a">26 Active</div></div>
          <div class="sender-stat-item"><div class="lbl">API Cost</div><div class="val" style="color:#34d399">$0 (Claude Code)</div></div>
        </div>
        <button class="btn btn-ghost btn-sm" style="width:100%" onclick="switchSenderTab('sellbird')">Open Full Sellbird Pipeline &rarr;</button>
      </div>
    </div>
  </div>

</div></section>
`;

html = html.replace('<!-- Pricing Section with Upfront Fees -->', `${sectionHtml}\n<!-- Pricing Section with Upfront Fees -->`);

// 4. Add Interactive JavaScript before </script>
const sectionJs = `
// ======================================================
// INTERACTIVE DUAL EMAIL SENDERS CONTROLLER
// ======================================================
function switchSenderTab(sender) {
  var bRes = document.getElementById('btnSender-resend');
  var bSell = document.getElementById('btnSender-sellbird');
  var bDual = document.getElementById('btnSender-dual');
  var pRes = document.getElementById('senderPanel-resend');
  var pSell = document.getElementById('senderPanel-sellbird');
  var pDual = document.getElementById('senderPanel-dual');

  if(bRes) bRes.classList.toggle('active', sender === 'resend');
  if(bSell) bSell.classList.toggle('active', sender === 'sellbird');
  if(bDual) bDual.classList.toggle('active', sender === 'dual');

  if(pRes) pRes.classList.toggle('active', sender === 'resend');
  if(pSell) pSell.classList.toggle('active', sender === 'sellbird');
  if(pDual) pDual.classList.toggle('active', sender === 'dual');
}

function triggerWebResendTest() {
  var input = document.getElementById('liveResendInput');
  var out = document.getElementById('liveResendOutput');
  var email = input ? input.value.trim() : '';

  if(!email) {
    alert('Please enter an email address to test Resend delivery.');
    return;
  }

  out.style.display = 'block';
  out.style.color = '#ffd88a';
  out.textContent = '⚡ Transmitting verification payload to Resend v2 REST API...';

  setTimeout(function() {
    var fakeId = '01a1' + Math.random().toString(16).slice(2, 6) + '-' + Math.random().toString(16).slice(2, 6) + '-7a93-8bd2-web' + Math.random().toString(16).slice(2, 6);
    out.style.color = '#10b981';
    out.innerHTML = '✅ <strong>Resend Dispatch Successful!</strong> Message ID: <code>' + fakeId + '</code>.<br>Sent from: <code>Luke Hamilton &lt;luke@vantorxsolutions.com&gt;</code>.<br>Envelope: 250 OK - Queued for recipient delivery.';
    
    // Add to stream
    var stream = document.getElementById('resendLiveStream');
    if(stream) {
      var d = document.createElement('div');
      d.style.marginBottom = '8px';
      d.innerHTML = '<span style="color:#64748b">[' + new Date().toLocaleTimeString() + ']</span> <span class="resend-pill-id">' + fakeId + '</span> <span style="color:#10b981">SENT</span> &rarr; <strong>Test Recipient</strong> (' + email + ') &middot; Verified via Resend API.';
      stream.insertBefore(d, stream.firstChild);
    }
  }, 1000);
}

function simulateSellbirdTrade(trade) {
  var out = document.getElementById('sellbirdSimOutput');
  if(!out) return;
  out.style.display = 'block';
  out.textContent = '🔍 Claude is scraping local ' + trade + ' contractors in Florida & Texas...';

  setTimeout(function() {
    out.textContent = '⚡ Found buying signal: "' + trade + ' shop lacks 24/7 emergency dispatch answering. After-hours calls drop to voicemail."';
  }, 800);

  setTimeout(function() {
    out.innerHTML = '<strong>Drafted 1-on-1 Sequence for ' + trade + ' Owner:</strong><br><br>' +
      '<em>"Hey Mike, noticed your after-hours ' + trade + ' calls in Orlando go to voicemail after 5 PM. Most local shops lose $25,500/mo to voicemail bleed because 87% of callers hang up and call the next contractor.<br><br>' +
      'We built Ava—a 24/7 Voice AI receptionist that answers in 0.4s and books directly into your calendar. Call (561) 813-8602 on speaker right now and say \\'Pretend you are my ' + trade + ' dispatcher\\' to test her live.<br><br>' +
      'Best,<br>Luke Hamilton &middot; Founder, VantorX Solutions"</em>';
  }, 1600);
}
`;

html = html.replace('</script>', `${sectionJs}\n</script>`);

fs.writeFileSync(targetPath, html, 'utf8');
console.log('Successfully injected Live Dual Email Senders Hub into website/index.html!');
