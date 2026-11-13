const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_PATH = path.join(__dirname, '..', 'website', 'assets', 'pro_tech_website_mockup.png');

async function generateMockup() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; }
    body { background: #f1f5f9; color: #1e293b; }
    
    /* Browser Chrome Frame */
    .browser-frame {
      width: 1200px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 25px 60px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(15, 23, 42, 0.08);
      overflow: hidden;
    }
    
    .browser-bar {
      background: #e2e8f0;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 14px;
      border-bottom: 1px solid #cbd5e1;
    }
    .dots { display: flex; gap: 8px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #f59e0b; }
    .dot-green { background: #10b981; }
    .url-bar {
      flex: 1;
      background: #ffffff;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      color: #475569;
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid #cbd5e1;
    }
    
    /* Top Announcement Bar */
    .top-strip {
      background: #0f172a;
      color: #94a3b8;
      font-size: 13px;
      padding: 8px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .top-strip b { color: #38bdf8; }
    
    /* Main Navbar */
    .navbar {
      background: #ffffff;
      padding: 16px 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
    }
    .logo-area { display: flex; align-items: center; gap: 12px; }
    .logo-badge {
      width: 46px; height: 46px;
      background: linear-gradient(135deg, #0284c7, #0369a1);
      border-radius: 10px;
      color: #ffffff;
      font-weight: 900;
      font-size: 24px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
    }
    .logo-text h1 { font-size: 20px; font-weight: 900; color: #0f172a; letter-spacing: -0.02em; }
    .logo-text span { font-size: 11px; font-weight: 700; color: #0284c7; letter-spacing: 0.12em; text-transform: uppercase; }
    
    .nav-links { display: flex; gap: 24px; font-weight: 600; font-size: 14px; color: #334155; }
    
    .cta-phone {
      display: flex; align-items: center; gap: 12px;
      background: #f0fdf4;
      border: 1.5px solid #86efac;
      padding: 8px 18px;
      border-radius: 999px;
    }
    .phone-text span { font-size: 11px; font-weight: 800; color: #15803d; text-transform: uppercase; }
    .phone-text h4 { font-size: 17px; font-weight: 900; color: #0f172a; }
    
    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
      padding: 44px 36px;
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 36px;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .trust-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #e0f2fe;
      border: 1px solid #7dd3fc;
      color: #0369a1;
      font-size: 12px;
      font-weight: 800;
      padding: 5px 14px;
      border-radius: 999px;
      margin-bottom: 14px;
    }
    
    .hero h2 {
      font-size: 38px;
      font-weight: 900;
      color: #0f172a;
      line-height: 1.15;
      margin-bottom: 14px;
      letter-spacing: -0.02em;
    }
    .hero h2 span { color: #0284c7; }
    
    .hero p {
      font-size: 15px;
      color: #475569;
      line-height: 1.5;
      margin-bottom: 22px;
    }
    
    .hero-badges { display: flex; gap: 14px; margin-bottom: 24px; }
    .h-badge {
      display: flex; align-items: center; gap: 8px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      color: #1e293b;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04);
    }
    
    .hero-actions { display: flex; gap: 14px; }
    .btn-blue {
      background: #0284c7;
      color: #ffffff;
      padding: 14px 26px;
      border-radius: 10px;
      font-weight: 800;
      font-size: 15px;
      border: none;
      box-shadow: 0 6px 18px rgba(2, 132, 199, 0.35);
    }
    .btn-outline {
      background: #ffffff;
      color: #0f172a;
      border: 2px solid #cbd5e1;
      padding: 14px 22px;
      border-radius: 10px;
      font-weight: 800;
      font-size: 14px;
    }
    
    /* Emergency Ballpark Estimator Card */
    .estimator-card {
      background: #ffffff;
      border: 2px solid #0284c7;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 15px 35px rgba(2, 132, 199, 0.15);
    }
    .est-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .est-hdr h3 { font-size: 18px; font-weight: 900; color: #0f172a; }
    .est-badge { background: #fee2e2; color: #dc2626; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; }
    
    .est-row { margin-bottom: 14px; }
    .est-label { font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px; }
    .est-select {
      width: 100%;
      padding: 10px 14px;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      background: #f8fafc;
    }
    
    .est-result {
      background: #f0fdf4;
      border: 1.5px solid #86efac;
      padding: 14px;
      border-radius: 10px;
      margin-top: 16px;
      text-align: center;
    }
    .est-res-sub { font-size: 12px; color: #166534; font-weight: 700; }
    .est-res-price { font-size: 26px; font-weight: 900; color: #15803d; margin: 4px 0; }
    
    /* 3 Service Blocks */
    .services-strip {
      padding: 28px 36px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      background: #ffffff;
    }
    .srv-card {
      border: 1px solid #e2e8f0;
      padding: 18px;
      border-radius: 12px;
      background: #f8fafc;
      border-left: 4px solid #0284c7;
    }
    .srv-card h4 { font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
    .srv-card p { font-size: 12.5px; color: #64748b; line-height: 1.4; }
  </style>
</head>
<body>

<div class="browser-frame">
  <!-- Fake Browser Chrome -->
  <div class="browser-bar">
    <div class="dots">
      <div class="dot dot-red"></div>
      <div class="dot dot-yellow"></div>
      <div class="dot dot-green"></div>
    </div>
    <div class="url-bar">
      <span>🔒 https://www.protechairmiami.com</span>
      <span style="margin-left:auto;color:#10b981;font-weight:700">⚡ 0.6s Load Time (Grade A)</span>
    </div>
  </div>

  <!-- Announcement Bar -->
  <div class="top-strip">
    <div>📍 <b>Serving Miami-Dade & South Florida:</b> 540 NW 111st, Miami, FL 33168</div>
    <div>⭐⭐⭐⭐⭐ <b>4.9/5 Rating</b> (180+ Verified Miami Reviews) · Lic #CAC1819201</div>
  </div>

  <!-- Main Navbar -->
  <div class="navbar">
    <div class="logo-area">
      <div class="logo-badge">❄️</div>
      <div class="logo-text">
        <h1>PRO-TECH AIR</h1>
        <span>SERVICES LLC &middot; MIAMI, FL</span>
      </div>
    </div>

    <div class="nav-links">
      <div>AC Repair</div>
      <div>Replacements</div>
      <div>Commercial HVAC</div>
      <div>Maintenance</div>
      <div>Reviews</div>
    </div>

    <div class="cta-phone">
      <div style="font-size:24px">📞</div>
      <div class="phone-text">
        <span>24/7 LIVE EMERGENCY DISPATCH</span>
        <h4>(561) 813-8602</h4>
      </div>
    </div>
  </div>

  <!-- Hero Section -->
  <div class="hero">
    <div>
      <div class="trust-pill">⚡ FAST 45-MINUTE TECH ARRIVAL &middot; ZERO VOICEMAILS</div>
      <h2>Miami's Premier 24/7 <span>AC Emergency & Repair</span> Specialists</h2>
      <p>Beat the South Florida heat. Carlin Oates and the Pro-Tech Air crew provide immediate diagnostics, precision coil repairs, and full system heat pump replacements with guaranteed flat-rate pricing.</p>
      
      <div class="hero-badges">
        <div class="h-badge">✓ 1-Ring Call Pickup</div>
        <div class="h-badge">✓ Bilingual Techs (EN/ES)</div>
        <div class="h-badge">✓ $0 Diagnostic w/ Repair</div>
      </div>

      <div class="hero-actions">
        <button class="btn-blue">🚨 Call 24/7 Emergency Dispatch</button>
        <button class="btn-outline">Calculate Repair Estimate</button>
      </div>
    </div>

    <!-- Live Interactive Estimator Card -->
    <div class="estimator-card">
      <div class="est-hdr">
        <h3>Instant Ballpark Estimator</h3>
        <span class="est-badge">LIVE TOOL</span>
      </div>

      <div class="est-row">
        <div class="est-label">SELECT YOUR AC ISSUE</div>
        <div class="est-select">❄️ AC Blowing Warm Air / Leaking Freon</div>
      </div>

      <div class="est-row">
        <div class="est-label">PROPERTY TYPE</div>
        <div class="est-select">🏡 Single Family Home (Miami-Dade)</div>
      </div>

      <div class="est-result">
        <div class="est-res-sub">ESTIMATED BALLPARK REPAIR:</div>
        <div class="est-res-price">$350 – $650</div>
        <div style="font-size:11px;color:#475569">Includes on-site diagnostic + immediate parts replacement</div>
      </div>
    </div>
  </div>

  <!-- 3 Pillars Bottom Strip -->
  <div class="services-strip">
    <div class="srv-card">
      <h4>🚨 24/7 Emergency AC Repairs</h4>
      <p>Immediate 1-ring dispatch for dead compressors, bad capacitors, and clogged drains.</p>
    </div>
    <div class="srv-card">
      <h4>⚡ High-Efficiency Replacements</h4>
      <p>Top-rated 3 to 5-ton Rheem, Carrier & Trane systems installed with 10-year warranty.</p>
    </div>
    <div class="srv-card">
      <h4>📋 Seasonal Tune-Ups & Freon</h4>
      <p>Comprehensive 21-point coil inspection and duct sanitation to keep electric bills low.</p>
    </div>
  </div>
</div>

</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: OUT_PATH, type: 'png' });
  await browser.close();
  console.log('✅ Generated PRO-TECH website mockup at:', OUT_PATH);
}

generateMockup().catch(console.error);
