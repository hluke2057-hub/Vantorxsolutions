// scripts/generate_stripe_package_images.js
// Generates 8 high-resolution 1024x1024 square product cards for Stripe
// Outputs to website/assets/stripe-packages/, Desktop, Downloads, and Artifacts

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { execSync } = require('child_process');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';
const DOWNLOADS_DIR = 'C:\\Users\\hungr\\Downloads\\STRIPE_PACKAGE_IMAGES';
const DESKTOP_DIR = 'C:\\Users\\hungr\\OneDrive\\Desktop\\STRIPE_PACKAGE_IMAGES';
const REPO_ASSET_DIR = path.join(root, 'website/assets/stripe-packages');

[DOWNLOADS_DIR, DESKTOP_DIR, REPO_ASSET_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const PACKAGES = [
  {
    id: 'accelerate-tier',
    fileName: 'stripe-package-accelerate.png',
    badge: '⭐ MOST POPULAR BUNDLE',
    badgeColor: '#fbbf24',
    badgeBg: 'rgba(245, 158, 11, 0.2)',
    badgeBorder: '#f59e0b',
    title: 'ACCELERATE TIER',
    subTitle: 'Complete Business Growth & Automation Engine',
    price: '$697',
    pricePeriod: '/ month',
    setup: '+ $997 one-time white-glove setup',
    icon: '⭐',
    primaryColor: '#f59e0b',
    secondaryColor: '#38bdf8',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    features: [
      'Sub-Second Custom Mobile Website with Ballpark Calculator',
      'Ava 24/7 Voice AI Bilingual Phone Receptionist (English/Spanish)',
      'AEO Engine™ Rank #1 on ChatGPT, Perplexity & Siri',
      'LeadFlow CRM with 45-Second Missed-Call Text-Back'
    ]
  },
  {
    id: 'essential-tier',
    fileName: 'stripe-package-essential.png',
    badge: '⚡ 24/7 VOICE AI PHONE RECEPTIONIST',
    badgeColor: '#86efac',
    badgeBg: 'rgba(16, 185, 129, 0.2)',
    badgeBorder: '#10b981',
    title: 'ESSENTIAL TIER',
    subTitle: 'Never Miss An After-Hours Emergency Call Again',
    price: '$397',
    pricePeriod: '/ month',
    setup: '+ $497 one-time setup & training',
    icon: '⚡',
    primaryColor: '#10b981',
    secondaryColor: '#38bdf8',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    features: [
      '1-Ring Instant Bilingual Answering (0.8s Response)',
      'Qualifies Emergency Repairs & Books Directly to Calendar',
      'Dispatches Live SMS Dossiers to Technicians in Under 3 Seconds',
      'No Lock-In Contracts & Simple Carrier (*71) Forwarding'
    ]
  },
  {
    id: 'scale-tier',
    fileName: 'stripe-package-scale.png',
    badge: '🚀 MULTI-TRUCK ENTERPRISE DOMINANCE',
    badgeColor: '#d8b4fe',
    badgeBg: 'rgba(168, 85, 247, 0.2)',
    badgeBorder: '#a855f7',
    title: 'SCALE TIER',
    subTitle: 'Full-Throttle Multi-Rep Commercial Pipeline',
    price: '$1,297',
    pricePeriod: '/ month',
    setup: '+ $1,997 one-time enterprise setup',
    icon: '🚀',
    primaryColor: '#a855f7',
    secondaryColor: '#fbbf24',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    features: [
      'Multi-Truck Intelligent Territory & Tech Dispatching',
      'Dedicated Custom LLM Model Trained on Exact Shop Catalog',
      'Priority AEO Search Domination Across Entire Metro Market',
      'Dedicated Account Engineer & 15-Minute Support SLA'
    ]
  },
  {
    id: 'custom-website',
    fileName: 'stripe-package-website.png',
    badge: '💻 CORE CONVERSION ENGINE',
    badgeColor: '#7dd3fc',
    badgeBg: 'rgba(56, 189, 248, 0.2)',
    badgeBorder: '#38bdf8',
    title: 'CUSTOM MOBILE WEBSITE',
    subTitle: 'Sub-Second Loading High-Converting Funnel',
    price: '$799',
    pricePeriod: 'flat upfront',
    setup: '0 monthly lock-in · 100% turnkey ownership',
    icon: '💻',
    primaryColor: '#38bdf8',
    secondaryColor: '#fbbf24',
    glowColor: 'rgba(56, 189, 248, 0.35)',
    features: [
      '0.6s Mobile Loading Speed (100/100 Google Lighthouse)',
      'Interactive Ballpark Repair Price Calculator',
      '1-Tap Emergency Tech Dispatch Phone Button',
      'Free Managed Hosting & Unlimited Content Updates'
    ]
  },
  {
    id: 'ava-voice-standalone',
    fileName: 'stripe-package-ava-voice.png',
    badge: '🎙️ 24/7/365 VOICE RECEPTIONIST',
    badgeColor: '#6ee7b7',
    badgeBg: 'rgba(52, 211, 153, 0.2)',
    badgeBorder: '#34d399',
    title: 'AVA 24/7 VOICE AI',
    subTitle: 'Autonomous Phone Receptionist & Scheduler',
    price: '$397',
    pricePeriod: '/ month',
    setup: 'Bilingual English/Spanish · Setup in 48 Hours',
    icon: '🎙️',
    primaryColor: '#34d399',
    secondaryColor: '#38bdf8',
    glowColor: 'rgba(52, 211, 153, 0.35)',
    features: [
      'Answers 24/7 in 0.8s with Natural Human Voice',
      'Pre-Qualifies Homeowners Before Scheduling Slots',
      'Direct SMS Tech Dispatch & Calendar Integration',
      'Live Demo Line Available for Instant Testing'
    ]
  },
  {
    id: 'trade-growth-bundle',
    fileName: 'stripe-package-growth-bundle.png',
    badge: '🏆 FOUNDER TRADE GROWTH BUNDLE',
    badgeColor: '#facc15',
    badgeBg: 'rgba(250, 204, 21, 0.2)',
    badgeBorder: '#facc15',
    title: 'TRADE GROWTH BUNDLE',
    subTitle: 'High-Converting Website + 24/7 Ava Voice AI',
    price: '$997',
    pricePeriod: 'setup + $297/mo',
    setup: 'Save $500 Upfront · Complete Front-Office Solution',
    icon: '🏆',
    primaryColor: '#facc15',
    secondaryColor: '#10b981',
    glowColor: 'rgba(250, 204, 21, 0.4)',
    features: [
      'Sub-Second 0.6s Mobile Website Engineered for Tradies',
      'Ava 24/7 Voice AI Phone Receptionist (Day & Weekend Coverage)',
      'Direct Calendar & SMS Dispatch to On-Call Trucks',
      '48-Hour Rapid Onboarding & Ready for Weekend Inquiries'
    ]
  },
  {
    id: 'aeo-engine',
    fileName: 'stripe-package-aeo-engine.png',
    badge: '🧠 AI SEARCH OPTIMIZATION',
    badgeColor: '#c084fc',
    badgeBg: 'rgba(192, 132, 252, 0.2)',
    badgeBorder: '#c084fc',
    title: 'AEO ENGINE™',
    subTitle: 'Rank #1 on ChatGPT, Perplexity & Siri',
    price: '$297',
    pricePeriod: '/ month',
    setup: '+ $297 one-time schema implementation',
    icon: '🧠',
    primaryColor: '#c084fc',
    secondaryColor: '#38bdf8',
    glowColor: 'rgba(192, 132, 252, 0.35)',
    features: [
      'Engineered llms.txt Protocol for AI Search Crawlers',
      'Direct Citation of Your Emergency Phone Number in AI Answers',
      'Top-Ranked Local Recommendation for Trade Inquiries',
      'Zero Paid Ad Spend Required & Permanent Authority'
    ]
  },
  {
    id: 'leadflow-crm',
    fileName: 'stripe-package-leadflow-crm.png',
    badge: '📈 SPEED-TO-LEAD AUTOMATION',
    badgeColor: '#60a5fa',
    badgeBg: 'rgba(96, 165, 250, 0.2)',
    badgeBorder: '#60a5fa',
    title: 'LEADFLOW CRM',
    subTitle: '45-Second Lead Capture & Two-Way SMS Portal',
    price: '$197',
    pricePeriod: '/ month',
    setup: '+ $197 one-time pipeline configuration',
    icon: '📈',
    primaryColor: '#60a5fa',
    secondaryColor: '#34d399',
    glowColor: 'rgba(96, 165, 250, 0.35)',
    features: [
      '45-Second Missed-Call Automated Text-Back',
      'Unified Two-Way SMS Inbox for Owner & Lead Techs',
      'Automated Review Generation & Google Review Booster',
      'Simple Mobile App & Desktop Dispatch Dashboard'
    ]
  }
];

function buildHtml(pkg) {
  const featsHtml = pkg.features.map(f => `
    <li class="feat-item">
      <span class="feat-check">✓</span>
      <span class="feat-text">${f}</span>
    </li>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1024px;
      height: 1024px;
      background: #060912;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }
    
    /* Radial Glow Orbs */
    .glow-orb-1 {
      position: absolute;
      top: -120px;
      right: -120px;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, ${pkg.glowColor} 0%, rgba(0,0,0,0) 70%);
      pointer-events: none;
    }
    .glow-orb-2 {
      position: absolute;
      bottom: -150px;
      left: -150px;
      width: 650px;
      height: 650px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(0,0,0,0) 70%);
      pointer-events: none;
    }

    /* Ambient Hex Pattern */
    .grid-lines {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
      background-size: 48px 48px;
      pointer-events: none;
    }

    /* Main Container Card */
    .card-wrap {
      width: 930px;
      height: 930px;
      background: rgba(13, 19, 33, 0.92);
      border: 2px solid rgba(255, 255, 255, 0.14);
      border-radius: 36px;
      padding: 50px 54px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      z-index: 10;
      box-shadow: 0 35px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.15);
    }

    /* Top Header */
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-icon {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: 900;
      color: #060912;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
    }
    .brand-name {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 0.08em;
      color: #f8fafc;
      text-transform: uppercase;
    }
    .brand-sub {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: #94a3b8;
      text-transform: uppercase;
    }
    .package-tag {
      background: ${pkg.badgeBg};
      border: 1.5px solid ${pkg.badgeBorder};
      color: ${pkg.badgeColor};
      padding: 8px 18px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-family: monospace;
    }

    /* Hero Center Section */
    .hero-center {
      display: flex;
      align-items: center;
      gap: 32px;
      margin: 10px 0;
    }
    .hero-icon-box {
      width: 140px;
      height: 140px;
      border-radius: 28px;
      background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.12), rgba(0,0,0,0.5));
      border: 2px solid ${pkg.primaryColor};
      box-shadow: 0 16px 40px ${pkg.glowColor};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 68px;
      flex-shrink: 0;
      position: relative;
    }
    .hero-titles {
      flex: 1;
    }
    .package-title {
      font-size: 46px;
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.02em;
      color: #ffffff;
      margin-bottom: 6px;
    }
    .package-sub {
      font-size: 17px;
      color: #cbd5e1;
      font-weight: 500;
      line-height: 1.4;
    }

    /* Price Callout Banner */
    .price-box {
      background: rgba(15, 23, 42, 0.85);
      border: 1.5px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 22px 28px;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }
    .price-left {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }
    .price-val {
      font-size: 58px;
      font-weight: 900;
      letter-spacing: -0.03em;
      color: ${pkg.primaryColor};
    }
    .price-period {
      font-size: 22px;
      font-weight: 700;
      color: #94a3b8;
    }
    .price-setup {
      font-size: 14.5px;
      font-weight: 700;
      color: #38bdf8;
      font-family: monospace;
    }

    /* Features Checklist */
    .features-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 13px;
      margin: 4px 0;
    }
    .feat-item {
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(255, 255, 255, 0.035);
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 12px 18px;
      border-radius: 12px;
    }
    .feat-check {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid #10b981;
      color: #34d399;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 14px;
      flex-shrink: 0;
    }
    .feat-text {
      font-size: 16px;
      font-weight: 600;
      color: #f1f5f9;
      line-height: 1.35;
    }

    /* Footer Trust Bar */
    .footer-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 20px;
    }
    .trust-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13.5px;
      font-weight: 700;
      color: #94a3b8;
    }
    .trust-dot {
      color: #10b981;
      font-size: 16px;
    }
    .stripe-verified {
      background: rgba(99, 91, 255, 0.15);
      border: 1px solid rgba(99, 91, 255, 0.4);
      color: #a5b4fc;
      padding: 5px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  </style>
</head>
<body>
  <div class="glow-orb-1"></div>
  <div class="glow-orb-2"></div>
  <div class="grid-lines"></div>

  <div class="card-wrap">
    <div class="card-header">
      <div class="brand-group">
        <div class="brand-icon">V</div>
        <div>
          <div class="brand-name">VantorX Solutions</div>
          <div class="brand-sub">Contractor Growth Infrastructure</div>
        </div>
      </div>
      <div class="package-tag">${pkg.badge}</div>
    </div>

    <div class="hero-center">
      <div class="hero-icon-box">${pkg.icon}</div>
      <div class="hero-titles">
        <div class="package-title">${pkg.title}</div>
        <div class="package-sub">${pkg.subTitle}</div>
      </div>
    </div>

    <div class="price-box">
      <div class="price-left">
        <span class="price-val">${pkg.price}</span>
        <span class="price-period">${pkg.pricePeriod}</span>
      </div>
      <div class="price-setup">${pkg.setup}</div>
    </div>

    <ul class="features-list">
      ${featsHtml}
    </ul>

    <div class="footer-bar">
      <div class="trust-badge">
        <span class="trust-dot">●</span> 100% Done-For-You
      </div>
      <div class="trust-badge">
        <span class="trust-dot">●</span> Zero Lock-In Contracts
      </div>
      <div class="trust-badge">
        <span class="trust-dot">●</span> 7-Day Live Launch
      </div>
      <div class="stripe-verified">
        <span>🔒</span> Stripe Verified Product
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function generateAll() {
  console.log('🚀 Generating 8 High-Resolution (1024x1024) Stripe Product Images...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-device-scale-factor=1']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 1024, deviceScaleFactor: 1 });

  for (let i = 0; i < PACKAGES.length; i++) {
    const pkg = PACKAGES[i];
    const html = buildHtml(pkg);
    await page.setContent(html, { waitUntil: 'load' });
    
    // Allow fonts and shadows to fully paint
    await new Promise(r => setTimeout(r, 250));

    const repoPath = path.join(REPO_ASSET_DIR, pkg.fileName);
    const downloadsPath = path.join(DOWNLOADS_DIR, pkg.fileName);
    const desktopPath = path.join(DESKTOP_DIR, pkg.fileName);
    const artifactPath = path.join(ARTIFACT_DIR, pkg.fileName);

    const buf = await page.screenshot({ type: 'png' });
    fs.writeFileSync(repoPath, buf);
    fs.writeFileSync(downloadsPath, buf);
    fs.writeFileSync(desktopPath, buf);
    fs.writeFileSync(artifactPath, buf);

    console.log(`[${i + 1}/${PACKAGES.length}] ✅ Created: ${pkg.fileName} (${(buf.length / 1024).toFixed(0)} KB)`);
  }

  await browser.close();

  // Create ZIP Bundle containing all 8 images
  const zipFileName = 'STRIPE_PACKAGE_IMAGES.zip';
  const repoZipPath = path.join(REPO_ASSET_DIR, zipFileName);
  const downloadsZipPath = path.join('C:\\Users\\hungr\\Downloads', zipFileName);
  const desktopZipPath = path.join('C:\\Users\\hungr\\OneDrive\\Desktop', zipFileName);
  const artifactZipPath = path.join(ARTIFACT_DIR, zipFileName);

  console.log('📦 Creating STRIPE_PACKAGE_IMAGES.zip bundle...');
  execSync(`powershell -Command "Compress-Archive -Path '${REPO_ASSET_DIR}/*.png' -DestinationPath '${repoZipPath}' -Force"`);

  fs.copyFileSync(repoZipPath, downloadsZipPath);
  fs.copyFileSync(repoZipPath, desktopZipPath);
  fs.copyFileSync(repoZipPath, artifactZipPath);

  console.log('\n🎉 ALL 8 STRIPE PACKAGE IMAGES READY:');
  console.log(`  1. Desktop Folder:   ${DESKTOP_DIR}`);
  console.log(`  2. Desktop ZIP:      ${desktopZipPath}`);
  console.log(`  3. Downloads Folder: ${DOWNLOADS_DIR}`);
  console.log(`  4. Downloads ZIP:    ${downloadsZipPath}`);
  console.log(`  5. Web Assets:       ${REPO_ASSET_DIR}`);
}

generateAll().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});
