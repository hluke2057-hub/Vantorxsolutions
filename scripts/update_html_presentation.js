const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const HTML_PATH = path.join(__dirname, '..', 'website', 'demo', 'pro-tech-presentation.html');
const PDF_OUT = path.join(__dirname, '..', 'website', 'demo', 'PRO-TECH_AIR_SERVICES_DEMO_PRESENTATION.pdf');

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VantorX Solutions x PRO-TECH AIR SERVICES LLC — Proposal</title>
<meta name="description" content="Custom 24/7 front-office operations, mobile website, and Ava Voice AI proposal prepared specifically for Carlin Oates, PRO-TECH AIR SERVICES LLC (Miami, FL) by Carter Mccullohs.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230B0F16'/%3E%3Ctext x='32' y='45' font-size='38' font-family='Arial' font-weight='700' text-anchor='middle' fill='%23F59E0B'%3EV%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet">
<style>
:root {
  --bg-dark: #070a10;
  --bg-card: #0e1422;
  --bg-card-hover: #151d32;
  --border: #1e293b;
  --border-focus: #38bdf8;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --gold: #f59e0b;
  --gold-light: #fde68a;
  --cyan: #38bdf8;
  --emerald: #10b981;
  --rose: #f43f5e;
  --font-body: 'Plus Jakarta Sans', sans-serif;
  --font-head: 'Space Grotesk', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: var(--bg-dark);
  color: var(--text-main);
  font-family: var(--font-body);
  overflow-x: hidden;
  line-height: 1.5;
}

/* Widescreen 16:9 Presentation Deck Container */
.deck-container {
  max-width: 1380px;
  margin: 0 auto;
  padding: 24px 20px 80px;
}

/* Sticky Presentation Top Bar */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: rgba(14, 20, 34, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: 14px;
  margin-bottom: 24px;
  position: sticky;
  top: 12px;
  z-index: 100;
}
.brand-mark {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo-icon {
  width: 36px;
  height: 36px;
  background: radial-gradient(circle, #1e293b 0%, #0b0f16 100%);
  border: 2px solid var(--gold);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: var(--gold);
  font-size: 20px;
}
.brand-name {
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 18px;
  color: #fff;
}
.brand-name span { color: var(--gold); }
.slide-indicator {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--cyan);
  background: rgba(56, 189, 248, 0.1);
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(56, 189, 248, 0.3);
}
.deck-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}
.nav-btn {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all .2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.nav-btn:hover {
  background: var(--bg-card-hover);
  border-color: var(--cyan);
  color: var(--cyan);
}
.btn-gold {
  background: linear-gradient(135deg, var(--gold), #d97706);
  color: #070a10 !important;
  border: none;
}
.btn-gold:hover {
  box-shadow: 0 0 16px rgba(245, 158, 11, 0.4);
}

/* Slide Base — Optimized to fill 16:9 frame with NO dead blank space */
.slide {
  background: radial-gradient(circle at 50% 0%, #151d32 0%, #070a10 75%);
  border: 1.5px solid var(--border);
  border-radius: 24px;
  padding: 44px 50px;
  margin-bottom: 32px;
  min-height: 740px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  box-shadow: 0 20px 50px rgba(0,0,0,0.4);
}

.slide-tag {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 8px;
  color: var(--cyan);
}
.slide-title {
  font-family: var(--font-head);
  font-size: clamp(30px, 3.2vw, 42px);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
  line-height: 1.15;
}
.slide-title span {
  background: linear-gradient(135deg, var(--gold-light), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.slide-subtitle {
  font-size: 16px;
  color: var(--text-muted);
  max-width: 980px;
  margin-bottom: 24px;
  line-height: 1.5;
}

/* High-Density Card Grids (Fills blank space) */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }

.card {
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  transition: all .2s;
}
.card.highlight {
  border-color: var(--gold);
  background: linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, rgba(14, 20, 34, 0.95) 100%);
}

.metric-huge {
  font-family: var(--font-head);
  font-size: 44px;
  font-weight: 900;
  line-height: 1;
  margin: 10px 0;
}

/* Comparison Table */
.comp-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  background: var(--bg-card);
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--border);
}
.comp-table th {
  background: #172033;
  padding: 14px 18px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-align: left;
  border-bottom: 1.5px solid var(--border);
}
.comp-table td {
  padding: 13px 18px;
  font-size: 13.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.comp-table tr:last-child td {
  border-bottom: none;
}
.text-center { text-align: center; }
.text-right { text-align: right; }

/* Audio Waveform Simulator for Ava */
.waveform-box {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 38px;
  padding: 0 14px;
  background: #030712;
  border-radius: 8px;
  border: 1px solid var(--border);
}
.w-bar {
  flex: 1;
  background: var(--cyan);
  border-radius: 2px;
  transition: height .15s ease;
}

/* Print/PDF Export Mode */
@media print {
  body { background: #070a10 !important; -webkit-print-color-adjust: exact; }
  .top-nav { display: none !important; }
  .slide { page-break-after: always; margin-bottom: 0 !important; border-radius: 0 !important; min-height: 100vh !important; }
}
</style>
</head>
<body>

<div class="deck-container">

  <!-- Sticky Presentation Controls -->
  <header class="top-nav">
    <div class="brand-mark">
      <div class="logo-icon">V</div>
      <div class="brand-name">Vantor<span>X</span> <small style="font-size:12px;color:var(--text-muted);font-weight:600">Operations Pitch Deck</small></div>
    </div>

    <div class="deck-controls">
      <span class="slide-indicator">Slide <span id="curSlide">1</span> of 9</span>
      <a href="/demo/PRO-TECH_AIR_SERVICES_PROPOSAL.pptx" download class="nav-btn btn-gold">📊 Download Google Slides (.pptx)</a>
      <a href="/demo/PRO-TECH_AIR_SERVICES_DEMO_PRESENTATION.pdf" download class="nav-btn">📄 Download PDF</a>
      <button class="nav-btn" onclick="window.print()">🖨️ Print / Present</button>
    </div>
  </header>

  <!-- ======================================================= -->
  <!-- SLIDE 1: TITLE SLIDE (Carter Mccullohs x Carlin Oates) -->
  <!-- ======================================================= -->
  <section class="slide" id="slide-1">
    <div>
      <div class="slide-tag">STRATEGIC GROWTH &amp; 24/7 FRONT-OFFICE PROPOSAL</div>
      <h1 class="slide-title" style="font-size:clamp(36px, 4vw, 54px)">PRO-TECH AIR SERVICES LLC</h1>
      <p class="slide-subtitle" style="font-size:19px;color:var(--gold-light)">
        24/7 Operations, Speed-to-Lead &amp; High-Converting Web Infrastructure for Miami-Dade
      </p>
    </div>

    <div class="card" style="background:#0e1422;border:2px solid var(--border);padding:32px;margin:24px 0">
      <div style="font-size:12px;font-family:var(--font-mono);color:var(--gold);font-weight:800;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:18px">
        PROPOSAL DOSSIER &amp; PARTICIPANTS
      </div>

      <div class="grid-2" style="gap:36px">
        <div style="border-left:4px solid var(--cyan);padding-left:18px">
          <div style="font-size:13px;color:var(--text-muted)">Prepared By:</div>
          <div style="font-size:24px;font-weight:800;color:#fff;margin:4px 0">Carter Mccullohs</div>
          <div style="font-size:14px;color:var(--cyan);font-weight:700">Founder &amp; Managing Director</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:4px">VantorX Solutions LLC &middot; Digital Operations for Trades</div>
        </div>

        <div style="border-left:4px solid var(--gold);padding-left:18px">
          <div style="font-size:13px;color:var(--text-muted)">Prepared Specifically For:</div>
          <div style="font-size:24px;font-weight:800;color:#fff;margin:4px 0">Carlin Oates</div>
          <div style="font-size:14px;color:var(--gold-light);font-weight:700">Owner, PRO-TECH AIR SERVICES LLC</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:4px">540 NW 111st, Miami, FL 33168 &middot; Date: November 13, 2026</div>
        </div>
      </div>
    </div>

    <div class="grid-3">
      <div class="card" style="padding:16px 20px">
        <div style="font-size:11px;font-family:var(--font-mono);color:var(--cyan);font-weight:800">PRIMARY TRADE</div>
        <div style="font-size:16px;font-weight:800;color:#fff;margin-top:4px">HVAC &amp; AC Emergency Repair</div>
      </div>
      <div class="card" style="padding:16px 20px">
        <div style="font-size:11px;font-family:var(--font-mono);color:var(--gold);font-weight:800">TARGET TERRITORY</div>
        <div style="font-size:16px;font-weight:800;color:#fff;margin-top:4px">Miami-Dade &amp; South Florida</div>
      </div>
      <div class="card" style="padding:16px 20px">
        <div style="font-size:11px;font-family:var(--font-mono);color:var(--emerald);font-weight:800">BLENDED AVG TICKET</div>
        <div style="font-size:16px;font-weight:800;color:var(--emerald);margin-top:4px">$2,200 (Service to System)</div>
      </div>
    </div>
  </section>

  <!-- ======================================================= -->
  <!-- SLIDE 2: THE MIAMI HVAC BLEED CALCULATOR (Large Fonts) -->
  <!-- ======================================================= -->
  <section class="slide" id="slide-2">
    <div>
      <div class="slide-tag" style="color:var(--rose)">THE PROBLEM &middot; SOUTH FLORIDA HVAC REALITY</div>
      <h2 class="slide-title">The Math Behind <span>The Voicemail Graveyard</span></h2>
      <p class="slide-subtitle">
        In Miami's 92° heat &amp; 85% humidity, an AC outage is not a routine call &mdash; it's an urgent emergency panic call. Homeowners refuse to wait.
      </p>
    </div>

    <div class="grid-3" style="gap:24px;margin:16px 0">
      <div class="card" style="border-top:4px solid var(--cyan)">
        <div style="font-size:12px;font-family:var(--font-mono);color:var(--cyan);font-weight:800">AVG SERVICE REPAIR</div>
        <div class="metric-huge" style="color:#fff">$550</div>
        <div style="font-size:13.5px;color:var(--text-muted);line-height:1.45">Capacitors, fan motors, freon leaks, drain line clears, and weekend diagnostic fees.</div>
      </div>

      <div class="card highlight" style="border-top:4px solid var(--gold)">
        <div style="font-size:12px;font-family:var(--font-mono);color:var(--gold);font-weight:800">FULL SYSTEM REPLACEMENT</div>
        <div class="metric-huge" style="color:var(--gold)">$8,500</div>
        <div style="font-size:13.5px;color:var(--text-muted);line-height:1.45">Complete 3 to 5-ton heat pump or straight-cool condenser &amp; air handler replacement.</div>
      </div>

      <div class="card" style="border-top:4px solid var(--rose);background:rgba(244,63,94,0.08)">
        <div style="font-size:12px;font-family:var(--font-mono);color:var(--rose);font-weight:800">3 MISSED CALLS / MONTH</div>
        <div class="metric-huge" style="color:var(--rose)">-$25,500</div>
        <div style="font-size:13.5px;color:var(--text-muted);line-height:1.45">Direct revenue lost every 30 days when emergency calls roll to voicemail while crew is on a job.</div>
      </div>
    </div>

    <div class="card" style="background:#1e1b4b;border:2px solid #4338ca;padding:22px 28px">
      <div style="font-weight:800;color:var(--gold-light);font-size:16px;display:flex;align-items:center;gap:10px">
        <span>🚨</span> <span>The Miami Voicemail Rule:</span>
      </div>
      <div style="font-size:14.5px;color:#e2e8f0;margin-top:6px;line-height:1.5">
        Homeowners never wait for an HVAC contractor to listen to voicemail at 6:30 PM. The moment they hear your beep, they immediately hang up and click the next sponsored ad on Google Maps. <strong>Whoever answers on Ring 1 wins the $8,500 job.</strong>
      </div>
    </div>
  </section>

  <!-- ======================================================= -->
  <!-- SLIDE 3: PERSONALIZED PRO-TECH WEBSITE CONCEPT (Mockup) -->
  <!-- ======================================================= -->
  <section class="slide" id="slide-3">
    <div>
      <div class="slide-tag">PILLAR 1 &middot; SUB-SECOND MOBILE CONVERSION ARCHITECTURE</div>
      <h2 class="slide-title">What Carlin's <span>Custom Pro-Tech Website</span> Looks Like</h2>
      <p class="slide-subtitle">
        Most contractor sites take 4 to 6 seconds to load and hide the phone number. Our custom architecture loads in 0.6s with classic clean HVAC white &amp; royal blue accents.
      </p>
    </div>

    <div class="grid-2" style="grid-template-columns: 1.35fr 0.85fr;gap:28px;align-items:center;margin:10px 0">
      <!-- Mockup Image Preview -->
      <div style="background:#000;border:2px solid var(--border);border-radius:18px;overflow:hidden;box-shadow:0 15px 40px rgba(0,0,0,0.5)">
        <img src="/assets/pro_tech_website_mockup.png" alt="Pro-Tech Air Services Website Mockup" style="width:100%;height:auto;display:block">
      </div>

      <!-- Feature Details -->
      <div class="card" style="padding:26px">
        <div style="font-size:11px;font-family:var(--font-mono);color:var(--gold);font-weight:800;margin-bottom:12px;text-transform:uppercase">
          BUILT FOR SOUTH FLORIDA CONVERSION
        </div>

        <div style="display:flex;flex-direction:column;gap:16px">
          <div>
            <div style="font-size:16px;font-weight:800;color:#fff">⚡ Sub-Second 0.6s Load Speed</div>
            <div style="font-size:13px;color:var(--text-muted);margin-top:3px">Loads instantly on 5G phones when a homeowner is standing in an 88° house.</div>
          </div>

          <div>
            <div style="font-size:16px;font-weight:800;color:#fff">🧮 Interactive Ballpark Cost Estimator</div>
            <div style="font-size:13px;color:var(--text-muted);margin-top:3px">Allows Miami homeowners to select their issue, get price expectations, and enter their phone number before leaving.</div>
          </div>

          <div>
            <div style="font-size:16px;font-weight:800;color:#fff">📞 1-Tap Emergency Calling</div>
            <div style="font-size:13px;color:var(--text-muted);margin-top:3px">Large floating 24/7 emergency dispatch button triggers Ava or Carlin's line in 1 click.</div>
          </div>

          <div style="background:rgba(56,189,248,0.1);border:1.5px solid var(--cyan);padding:14px;border-radius:10px">
            <div style="font-size:14px;font-weight:800;color:var(--cyan)">🎨 100% Fully Customizable:</div>
            <div style="font-size:12.5px;color:#cbd5e1;margin-top:3px">
              Colors, logos, truck graphics, warranty badges, and diagnostic pricing can be customized to Carlin's exact preferences.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="font-size:12px;color:var(--text-muted);text-align:center">
      Live high-converting responsive layout &middot; Fully compliant with Google Core Web Vitals Grade A
    </div>
  </section>

  <!-- ======================================================= -->
  <!-- SLIDE 4: AVA 24/7 VOICE AI PHONE RECEPTIONIST (Kept)  -->
  <!-- ======================================================= -->
  <section class="slide" id="slide-4">
    <div>
      <div class="slide-tag">PILLAR 2 &middot; 24/7/365 AI VOICE RECEPTIONIST</div>
      <h2 class="slide-title">Never Lose Another <span>Emergency Job</span> to Missed Calls</h2>
      <p class="slide-subtitle">
        Ava is not an answering service. She is an intelligent voice receptionist trained specifically on South Florida HVAC emergencies.
      </p>
    </div>

    <div class="grid-2" style="gap:28px;margin:16px 0">
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="card" style="border-left:4px solid var(--cyan)">
          <div style="font-size:16px;font-weight:800;color:#fff">1-Ring Instant Pickup 24/7/365</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:4px">No hold times, no robotic phone menus. Human-grade conversational flow.</div>
        </div>

        <div class="card" style="border-left:4px solid var(--gold)">
          <div style="font-size:16px;font-weight:800;color:#fff">Bilingual Spanish &amp; English</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:4px">Auto-detects caller language in 0.4 seconds. Crucial for Miami-Dade.</div>
        </div>

        <div class="card" style="border-left:4px solid var(--emerald)">
          <div style="font-size:16px;font-weight:800;color:#fff">Instant Priority SMS Tech Alert</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:4px">Carlin's phone buzzes with caller name, address, and AC issue in &lt;10 seconds.</div>
        </div>

        <div class="card" style="border-left:4px solid #a855f7">
          <div style="font-size:16px;font-weight:800;color:#fff">Live Calendar Booking &amp; CRM Sync</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:4px">Schedules emergency diagnostic slots directly onto Google or Outlook calendar.</div>
        </div>
      </div>

      <!-- Real Transcript Card -->
      <div class="card" style="background:#030712;border:2px solid #1e3a8a;display:flex;flex-direction:column;justify-content:space-between">
        <div>
          <div style="font-size:11px;font-family:var(--font-mono);color:var(--cyan);font-weight:800;margin-bottom:12px;text-transform:uppercase">
            LIVE TRANSCRIPT SIMULATOR (MIAMI, FL)
          </div>
          <div style="font-size:13.5px;line-height:1.55;color:#e2e8f0;display:flex;flex-direction:column;gap:12px">
            <div>
              <b style="color:var(--cyan)">Ava:</b> <em>"Thank you for calling Pro-Tech Air Services, Miami's 24/7 air conditioning emergency team. My name is Ava. I see you're calling our Miami office &mdash; is your AC currently blowing warm air or leaking water, or are you calling to schedule routine maintenance?"</em>
            </div>
            <div>
              <b style="color:var(--gold)">Homeowner:</b> <em>"Water is dripping through our hallway ceiling from the air handler! It's 87 degrees inside and getting worse."</em>
            </div>
            <div>
              <b style="color:var(--cyan)">Ava:</b> <em>"I understand completely, that is an urgent priority. I have our on-call Miami technician alerted. What is your street address so I can dispatch Carlin's crew right away?"</em>
            </div>
          </div>
        </div>

        <div style="margin-top:20px;border-top:1px solid #1e293b;padding-top:14px;display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:12px;color:var(--text-muted)">0.8s Ultra-Low Latency Voice AI</span>
          <span style="font-size:12px;color:var(--emerald);font-weight:700">✓ 100% Call Capture</span>
        </div>
      </div>
    </div>

    <div style="text-align:center;font-size:13px;color:var(--text-muted)">
      Ava operates 365 days a year &middot; Never calls in sick &middot; Answers unlimited simultaneous calls
    </div>
  </section>

  <!-- ======================================================= -->
  <!-- SLIDE 5: INTERACTIVE PROOF — DIAL AVA LIVE (Kept)     -->
  <!-- ======================================================= -->
  <section class="slide" id="slide-5">
    <div>
      <div class="slide-tag" style="color:var(--emerald)">INTERACTIVE PROOF &middot; TEST IT RIGHT NOW</div>
      <h2 class="slide-title">Don't Take My Word For It. <span>Dial AVA Live.</span></h2>
      <p class="slide-subtitle">
        Carlin, grab your phone right now. Put it on speaker. Let's make a real test call to the VantorX Voice AI Engine so you can experience what your customers will hear at 9:00 PM tonight.
      </p>
    </div>

    <div class="card highlight" style="max-width:860px;margin:20px auto;text-align:center;padding:44px 36px;border:2.5px solid var(--gold);box-shadow:0 0 50px rgba(245, 158, 11, 0.25)">
      <div style="font-size:13px;font-family:var(--font-mono);color:var(--gold);font-weight:800;letter-spacing:0.12em;text-transform:uppercase">
        LIVE PRODUCTION DIALER LINE:
      </div>
      <div class="metric-huge" style="font-size:clamp(44px, 6vw, 68px);color:#fff;margin:16px 0;letter-spacing:0.02em">
        (561) 813-8602
      </div>
      <div style="font-size:16px;color:#cbd5e1;max-width:620px;margin:0 auto 24px;line-height:1.5">
        Call on speakerphone. Tell Ava your AC in Miami is leaking water all over your hallway. Test her in English or Spanish. Watch how she handles the emergency and books you in.
      </div>
      <div style="display:inline-flex;align-items:center;gap:12px;background:rgba(16,185,129,0.18);border:1.5px solid #10b981;color:#6ee7b7;padding:10px 24px;border-radius:999px;font-size:14px;font-weight:800">
        <span style="width:10px;height:10px;border-radius:50%;background:#10b981;display:inline-block"></span>
        <span>LINE ACTIVE 24/7/365 &middot; ZERO DELAY</span>
      </div>
    </div>

    <div style="text-align:center;font-size:13px;color:var(--text-muted)">
      Experience human-grade voice response with real-time appointment booking and immediate SMS tech alerts.
    </div>
  </section>

  <!-- ======================================================= -->
  <!-- SLIDE 6: OPTION 1 — TRADE GROWTH BUNDLE (Dedicated)   -->
  <!-- ======================================================= -->
  <section class="slide" id="slide-6">
    <div>
      <div class="slide-tag">SALES OPTION 1 &middot; CORE OPERATIONAL FOUNDATION</div>
      <h2 class="slide-title">Option 1: <span>Trade Growth Bundle</span> (Website + Ava AI)</h2>
      <p class="slide-subtitle">
        The complete front-office essentials: A sub-second custom mobile website combined with 24/7 bilingual Ava Voice AI phone answering.
      </p>
    </div>

    <div class="grid-2" style="grid-template-columns: 0.85fr 1.15fr;gap:28px;margin:16px 0">
      <!-- Pricing Box -->
      <div class="card" style="border:2px solid var(--border);padding:32px;display:flex;flex-direction:column;justify-content:space-between">
        <div>
          <div style="font-size:11px;font-family:var(--font-mono);color:var(--cyan);font-weight:800;letter-spacing:0.1em">OPTION 1 INVESTMENT</div>
          <div class="metric-huge" style="color:#fff;font-size:52px">$397</div>
          <div style="font-size:13px;color:var(--text-muted);font-weight:600">PER MONTH &middot; ZERO LOCK-IN CONTRACTS</div>

          <div style="margin-top:24px;border-top:1px solid var(--border);padding-top:18px">
            <div style="font-size:18px;font-weight:800;color:var(--gold-light)">+ $1,296 One-Time Fee</div>
            <div style="font-size:12.5px;color:var(--text-muted);margin-top:4px">Full custom mobile website design, ballpark calculator build &amp; Ava phone line provisioning.</div>
          </div>
        </div>

        <div style="background:#0284c7;border:1px solid var(--cyan);border-radius:12px;padding:16px;text-align:center;margin-top:24px">
          <div style="font-size:11px;font-weight:800;color:#e0f2fe;text-transform:uppercase;letter-spacing:0.08em">FIRST TRANSACTION TOTAL</div>
          <div style="font-size:26px;font-weight:900;color:#fff;margin:4px 0">$1,693 DUE TODAY</div>
          <div style="font-size:11px;color:#e0f2fe">Covers entire custom build + first month active operations</div>
        </div>
      </div>

      <!-- Feature Checklist -->
      <div class="card" style="padding:32px">
        <div style="font-size:12px;font-family:var(--font-mono);color:var(--gold);font-weight:800;margin-bottom:16px;text-transform:uppercase">
          WHAT PRO-TECH RECEIVES IN OPTION 1:
        </div>

        <div style="display:flex;flex-direction:column;gap:13px;font-size:14px">
          <div><b style="color:#fff">✓ Sub-Second 0.6s Custom Mobile Website</b> (100/100 Core Web Vitals)</div>
          <div><b style="color:#fff">✓ Interactive Emergency Ballpark Estimator</b> (Captures leads 24/7)</div>
          <div><b style="color:#fff">✓ Ava 24/7 Voice AI Phone Receptionist</b> (Answers on Ring 1)</div>
          <div><b style="color:#fff">✓ Bilingual Spanish &amp; English Auto-Detection</b> for Miami-Dade</div>
          <div><b style="color:#fff">✓ Instant SMS Tech Dispatch Dossier</b> to Carlin's phone in &lt;10s</div>
          <div><b style="color:#fff">✓ Live Calendar Booking Sync</b> to Google Calendar / Outlook</div>
          <div><b style="color:#fff">✓ 300 Live Monthly Answering Minutes</b> included</div>
          <div><b style="color:#fff">✓ Full Client Hub Access</b> with recordings &amp; audio transcripts</div>
          <div><b style="color:#fff">✓ Zero Long-Term Contracts</b> &mdash; Month-to-month flexibility</div>
        </div>

        <div style="margin-top:24px">
          <a href="https://buy.stripe.com/bJe9AT9um17x3plbyggw004" target="_blank" rel="noopener" class="nav-btn btn-gold" style="width:100%;text-align:center;justify-content:center;padding:12px">
            Lock In Option 1 ($1,693 First Transaction) 💳
          </a>
        </div>
      </div>
    </div>

    <div style="text-align:center;font-size:13px;color:var(--text-muted)">
      Ideal for contractors looking for 24/7 call protection and a high-converting mobile web foundation.
    </div>
  </section>

  <!-- ======================================================= -->
  <!-- SLIDE 7: OPTION 2 — ACCELERATE TIER (Dedicated)        -->
  <!-- ======================================================= -->
  <section class="slide" id="slide-7">
    <div>
      <div class="slide-tag" style="color:var(--gold)">SALES OPTION 2 &middot; FULL FRONT-OFFICE GROWTH ENGINE (RECOMMENDED)</div>
      <h2 class="slide-title">Option 2: <span>Accelerate Tier</span> (Full Market Dominance)</h2>
      <p class="slide-subtitle">
        Everything in Option 1 plus Answer Engine Optimization (AEO), LeadFlow CRM with 45s SMS speed-to-lead, and the automated Google Review Accelerator.
      </p>
    </div>

    <div class="grid-2" style="grid-template-columns: 0.85fr 1.15fr;gap:28px;margin:16px 0">
      <!-- Pricing Box -->
      <div class="card highlight" style="border:2px solid var(--gold);padding:32px;display:flex;flex-direction:column;justify-content:space-between">
        <div>
          <div style="font-size:11px;font-family:var(--font-mono);color:var(--gold);font-weight:800;letter-spacing:0.1em">ACCELERATE BUNDLE INVESTMENT</div>
          <div class="metric-huge" style="color:#fff;font-size:52px">$697</div>
          <div style="font-size:13px;color:var(--text-muted);font-weight:600">PER MONTH &middot; COMPLETE GROWTH STACK</div>

          <div style="margin-top:24px;border-top:1px solid var(--border);padding-top:18px">
            <div style="font-size:18px;font-weight:800;color:var(--emerald)">+ $997 One-Time Setup</div>
            <div style="font-size:12.5px;color:var(--text-muted);margin-top:4px">Discounted setup fee when bundling full front-office infrastructure.</div>
          </div>
        </div>

        <div style="background:#b45309;border:1.5px solid var(--gold);border-radius:12px;padding:16px;text-align:center;margin-top:24px">
          <div style="font-size:11px;font-weight:800;color:#fef3c7;text-transform:uppercase;letter-spacing:0.08em">FIRST TRANSACTION TOTAL</div>
          <div style="font-size:26px;font-weight:900;color:#fff;margin:4px 0">$1,694 DUE TODAY</div>
          <div style="font-size:11.5px;color:#fef3c7;font-weight:700">Notice: Exactly $1 difference vs Option 1 today!</div>
        </div>
      </div>

      <!-- Feature Checklist -->
      <div class="card" style="padding:32px">
        <div style="font-size:12px;font-family:var(--font-mono);color:var(--gold);font-weight:800;margin-bottom:16px;text-transform:uppercase">
          WHAT PRO-TECH RECEIVES IN OPTION 2:
        </div>

        <div style="display:flex;flex-direction:column;gap:12px;font-size:13.5px">
          <div style="color:var(--gold-light);font-weight:800">⭐ EVERYTHING IN OPTION 1 (Website + Ava AI + Ballpark Estimator)</div>
          <div><b style="color:var(--cyan)">🚀 AEO Engine™ (AI Search Rank):</b> Structured to rank PRO-TECH #1 on ChatGPT, Perplexity, Claude &amp; Siri.</div>
          <div><b style="color:var(--cyan)">📈 LeadFlow CRM Pipeline:</b> 45-second speed-to-lead missed-call auto text-back &amp; 2-way SMS chat.</div>
          <div><b style="color:var(--cyan)">⭐ Google Review Accelerator:</b> Automated post-job SMS generating 15&ndash;25 5-star Google reviews/month.</div>
          <div><b style="color:#fff">✓ 600 Live Monthly Voice Minutes:</b> Double the minutes of Option 1.</div>
          <div><b style="color:#fff">✓ Automated Missed-Call Auto Text-Back:</b> Recovers calls when trucks are busy.</div>
          <div><b style="color:#fff">✓ Ongoing Managed Hosting &amp; Content Updates:</b> Full server maintenance &amp; security.</div>
          <div><b style="color:#fff">✓ VIP Priority Support &amp; SLA:</b> Direct line to engineering team.</div>
        </div>

        <div style="margin-top:24px">
          <a href="https://buy.stripe.com/28EeVddKC7vVf830TCgw002" target="_blank" rel="noopener" class="nav-btn btn-gold" style="width:100%;text-align:center;justify-content:center;padding:12px;box-shadow:0 0 25px rgba(245,158,11,0.5)">
            Lock In Accelerate Tier ($1,694 First Transaction) &rarr;
          </a>
        </div>
      </div>
    </div>

    <div style="text-align:center;font-size:13px;color:var(--text-muted)">
      Recommended for Carlin: Gives Pro-Tech complete AI search dominance and automated 5-star review growth.
    </div>
  </section>

  <!-- ======================================================= -->
  <!-- SLIDE 8: HEAD-TO-HEAD PACKAGE COMPARISON MATRIX        -->
  <!-- ======================================================= -->
  <section class="slide" id="slide-8">
    <div>
      <div class="slide-tag">PACKAGE COMPARISON &middot; COMPLETE EXHAUSTIVE MATRIX</div>
      <h2 class="slide-title">Option 1 vs. Option 2: <span>Side-by-Side Breakdown</span></h2>
      <p class="slide-subtitle">
        Review every deliverable so Carlin knows exactly what is included in each package.
      </p>
    </div>

    <table class="comp-table">
      <thead>
        <tr>
          <th style="width:44%">Deliverable / Feature</th>
          <th class="text-center" style="width:28%;color:var(--cyan)">Option 1: Ava + Website</th>
          <th class="text-center" style="width:28%;color:var(--gold)">Option 2: Accelerate (Recommended)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Sub-Second 0.6s Custom Mobile Website</b> (100/100 Core Web Vitals)</td>
          <td class="text-center" style="color:var(--emerald);font-weight:800">✓ Included</td>
          <td class="text-center" style="color:var(--emerald);font-weight:800">✓ Included</td>
        </tr>
        <tr>
          <td><b>Interactive Emergency Ballpark Estimator Widget</b></td>
          <td class="text-center" style="color:var(--emerald);font-weight:800">✓ Included</td>
          <td class="text-center" style="color:var(--emerald);font-weight:800">✓ Included</td>
        </tr>
        <tr>
          <td><b>Ava 24/7/365 Bilingual Voice AI</b> (1-Ring Spanish/English Pickup)</td>
          <td class="text-center" style="color:var(--emerald);font-weight:800">✓ Included</td>
          <td class="text-center" style="color:var(--emerald);font-weight:800">✓ Included</td>
        </tr>
        <tr>
          <td><b>Instant SMS Priority Tech Dispatch</b> to Carlin's Truck</td>
          <td class="text-center" style="color:var(--emerald);font-weight:800">✓ Included</td>
          <td class="text-center" style="color:var(--emerald);font-weight:800">✓ Included</td>
        </tr>
        <tr>
          <td><b>Included Monthly Voice Minutes</b></td>
          <td class="text-center" style="color:var(--text-muted)">300 Minutes</td>
          <td class="text-center" style="color:var(--gold-light);font-weight:800">600 Minutes (2X)</td>
        </tr>
        <tr>
          <td><b>LeadFlow CRM Pipeline &amp; 45s Speed-to-Lead Auto SMS</b></td>
          <td class="text-center" style="color:var(--text-muted)">&mdash;</td>
          <td class="text-center" style="color:var(--emerald);font-weight:800">✓ Included</td>
        </tr>
        <tr>
          <td><b>Google Review Accelerator</b> (Automated 15&ndash;25 5★ Reviews/Mo)</td>
          <td class="text-center" style="color:var(--text-muted)">&mdash;</td>
          <td class="text-center" style="color:var(--emerald);font-weight:800">✓ Included</td>
        </tr>
        <tr>
          <td><b>AEO Engine™</b> (Rank #1 on ChatGPT, Perplexity &amp; Siri)</td>
          <td class="text-center" style="color:var(--text-muted)">&mdash;</td>
          <td class="text-center" style="color:var(--emerald);font-weight:800">✓ Included</td>
        </tr>
        <tr>
          <td><b>Ongoing Managed Hosting, Updates &amp; Security</b></td>
          <td class="text-center" style="color:var(--text-muted)">Standard</td>
          <td class="text-center" style="color:var(--gold);font-weight:800">VIP Priority Support</td>
        </tr>
        <tr style="background:rgba(255,255,255,0.03)">
          <td><b style="color:var(--gold-light)">Monthly Ongoing Investment</b></td>
          <td class="text-center"><b style="color:#fff;font-size:15px">$397 / month</b></td>
          <td class="text-center"><b style="color:var(--gold);font-size:15px">$697 / month</b></td>
        </tr>
        <tr style="background:rgba(255,255,255,0.03)">
          <td><b style="color:var(--gold-light)">One-Time Setup &amp; Build Fee</b></td>
          <td class="text-center"><b style="color:#fff;font-size:15px">$1,296 Setup</b></td>
          <td class="text-center"><b style="color:var(--emerald);font-size:15px">$997 Setup (Discounted)</b></td>
        </tr>
        <tr style="background:#172554">
          <td><b style="color:#fff;font-size:15px">FIRST TRANSACTION TOTAL DUE TODAY</b></td>
          <td class="text-center"><b style="color:#fff;font-size:17px">$1,693</b></td>
          <td class="text-center" style="background:#78350f"><b style="color:var(--gold-light);font-size:18px">$1,694 (+$1 Only!)</b></td>
        </tr>
      </tbody>
    </table>

    <div class="grid-2" style="gap:20px;margin-top:10px">
      <a href="https://buy.stripe.com/bJe9AT9um17x3plbyggw004" target="_blank" rel="noopener" class="nav-btn" style="text-align:center;justify-content:center;padding:10px">
        Choose Option 1: Ava + Website ($1,693) 💳
      </a>
      <a href="https://buy.stripe.com/28EeVddKC7vVf830TCgw002" target="_blank" rel="noopener" class="nav-btn btn-gold" style="text-align:center;justify-content:center;padding:10px">
        Choose Option 2: Accelerate Tier ($1,694) &rarr;
      </a>
    </div>
  </section>

  <!-- ======================================================= -->
  <!-- SLIDE 9: THE 48-HOUR ZERO-FRICTION ROLLOUT (Upgraded)  -->
  <!-- ======================================================= -->
  <section class="slide" id="slide-9">
    <div>
      <div class="slide-tag" style="color:var(--emerald)">THE ROLLOUT &middot; 48-HOUR ONBOARDING GUARANTEE</div>
      <h2 class="slide-title">How We Go Live In <span>Under 48 Hours</span> With Zero Friction</h2>
      <p class="slide-subtitle">
        You don't have to change phone companies, switch email, or take time away from jobs. We plug seamlessly into your existing setup.
      </p>
    </div>

    <div class="grid-2" style="gap:20px;margin:16px 0">
      <div class="card" style="border-left:4px solid var(--cyan)">
        <div style="font-size:11px;font-family:var(--font-mono);color:var(--gold);font-weight:800;text-transform:uppercase">
          1. PLUGS INTO EXISTING PHONE LINE
        </div>
        <div style="font-size:16px;font-weight:800;color:#fff;margin:6px 0">Zero New Numbers or Hardware to Buy</div>
        <div style="font-size:13.5px;color:var(--text-muted);line-height:1.45">
          Carlin keeps his exact business phone carrier. We set up simple Conditional Call Forwarding (*71). Ava only picks up when his crew is busy or after hours.
        </div>
      </div>

      <div class="card" style="border-left:4px solid var(--gold)">
        <div style="font-size:11px;font-family:var(--font-mono);color:var(--gold);font-weight:800;text-transform:uppercase">
          2. PLUGS INTO EXISTING DOMAIN &amp; CRM
        </div>
        <div style="font-size:16px;font-weight:800;color:#fff;margin:6px 0">Zero Email Disruption or Data Transfer</div>
        <div style="font-size:13.5px;color:var(--text-muted);line-height:1.45">
          We point to your web domain without touching your business email. Direct webhook integration connects with ServiceTitan, Jobber, Housecall Pro, or Google Calendar.
        </div>
      </div>

      <div class="card" style="border-left:4px solid var(--emerald)">
        <div style="font-size:11px;font-family:var(--font-mono);color:var(--gold);font-weight:800;text-transform:uppercase">
          3. THE ONLY DETAIL WE NEED IS PRICING
        </div>
        <div style="font-size:16px;font-weight:800;color:#fff;margin:6px 0">5-Minute Simple Intake (We Do 100% of the Work)</div>
        <div style="font-size:13.5px;color:var(--text-muted);line-height:1.45">
          Carlin only gives us his standard diagnostic fee and service radius. Carter and the VantorX engineering team handle all AI prompt training, schema code, and mobile speed optimization.
        </div>
      </div>

      <div class="card" style="border-left:4px solid #a855f7">
        <div style="font-size:11px;font-family:var(--font-mono);color:var(--gold);font-weight:800;text-transform:uppercase">
          4. THE 48-HOUR HANDSHAKE TEST CALL
        </div>
        <div style="font-size:16px;font-weight:800;color:#fff;margin:6px 0">Live Speakerphone Verification Before Going Live</div>
        <div style="font-size:13.5px;color:var(--text-muted);line-height:1.45">
          Within 48 hours, we do a 5-minute test call together. Carlin dials his line, tests Ava live, verifies the SMS lands on his cell, and gives the green light to turn it live!
        </div>
      </div>
    </div>

    <!-- Final Call to Action Box -->
    <div class="card highlight" style="text-align:center;padding:24px;border:2px solid var(--gold)">
      <div style="font-size:18px;font-weight:800;color:#fff">
        Ready to lock in Carlin's Miami territory?
      </div>
      <div style="font-size:13.5px;color:var(--text-muted);margin:6px 0 16px">
        Choose your package below &mdash; launch within 48 hours with guaranteed 24/7 call capture.
      </div>
      <div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap">
        <a href="https://buy.stripe.com/bJe9AT9um17x3plbyggw004" target="_blank" rel="noopener" class="nav-btn">
          Option 1: Ava + Website ($1,693) 💳
        </a>
        <a href="https://buy.stripe.com/28EeVddKC7vVf830TCgw002" target="_blank" rel="noopener" class="nav-btn btn-gold" style="box-shadow:0 0 20px rgba(245,158,11,0.5)">
          Option 2: Accelerate Tier ($1,694) &rarr;
        </a>
      </div>
    </div>
  </section>

</div>

<script>
// Slide scroll tracking
window.addEventListener('scroll', function() {
  const slides = document.querySelectorAll('.slide');
  let cur = 1;
  slides.forEach((s, idx) => {
    const rect = s.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom >= 100) {
      cur = idx + 1;
    }
  });
  const el = document.getElementById('curSlide');
  if (el) el.innerText = cur;
});
</script>
</body>
</html>`;

fs.writeFileSync(HTML_PATH, fullHtml, 'utf8');
console.log('✅ Updated pro-tech-presentation.html with 9 full-bleed slides!');

// Export PDF using Puppeteer
async function exportPdf() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: PDF_OUT,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });

  await browser.close();
  console.log('✅ Generated PDF presentation at:', PDF_OUT);

  // Copy PDF to Desktop and Downloads
  const pdfDesk = 'C:\\Users\\hungr\\OneDrive\\Desktop\\PRO-TECH_AIR_SERVICES_DEMO_PRESENTATION.pdf';
  const pdfDown = 'C:\\Users\\hungr\\Downloads\\PRO-TECH_AIR_SERVICES_DEMO_PRESENTATION.pdf';
  const pdfArt = 'C:\\Users\\hungr\\.gemini\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0\\PRO-TECH_AIR_SERVICES_DEMO_PRESENTATION.pdf';

  fs.copyFileSync(PDF_OUT, pdfDesk);
  fs.copyFileSync(PDF_OUT, pdfDown);
  fs.copyFileSync(PDF_OUT, pdfArt);
  console.log('✅ Copied PDF to Desktop and Downloads!');
}

exportPdf().catch(console.error);
