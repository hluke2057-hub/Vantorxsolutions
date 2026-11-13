const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_PATH = path.join(__dirname, '..', 'website', 'assets', 'google_review_accelerator_infographic.png');

async function generateReviewInfographic() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 860, deviceScaleFactor: 2 });

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; }
    body { background: #070a10; color: #f8fafc; padding: 24px; }
    
    .infographic-box {
      width: 1350px;
      margin: 0 auto;
      background: #0b0f19;
      border: 1.5px solid #1e293b;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
    }
    
    .hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid #1e293b; padding-bottom: 16px; }
    .hdr h2 { font-size: 24px; font-weight: 900; color: #fff; }
    .hdr h2 span { color: #f59e0b; }
    .badge { background: rgba(245, 158, 11, 0.15); border: 1px solid #f59e0b; color: #f59e0b; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 800; }

    /* 4-Step Visual Flow Diagram */
    .flow-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 28px;
      position: relative;
    }
    
    .step-card {
      background: #0e1422;
      border: 1.5px solid #1e293b;
      border-radius: 14px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .step-num {
      width: 32px; height: 32px;
      background: #172033;
      border: 1.5px solid #38bdf8;
      border-radius: 50%;
      color: #38bdf8;
      font-weight: 900;
      font-size: 14px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 12px;
    }
    .step-card:nth-child(4) .step-num { border-color: #10b981; color: #10b981; }
    
    .step-title { font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 8px; }
    .step-desc { font-size: 12.5px; color: #94a3b8; line-height: 1.45; }

    /* Visual Demo Split: Left SMS Mockup, Right Live Google Review Result */
    .demo-split {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 24px;
      background: #111827;
      border: 1px solid #1e293b;
      border-radius: 14px;
      padding: 24px;
    }

    .sms-phone-mock {
      background: #070a10;
      border: 1.5px solid #334155;
      border-radius: 14px;
      padding: 18px;
    }
    .mock-tag { font-size: 11px; font-family: monospace; color: #38bdf8; font-weight: 700; margin-bottom: 10px; }
    .bubble {
      background: #1e293b;
      color: #f1f5f9;
      padding: 14px 16px;
      border-radius: 12px;
      font-size: 13.5px;
      line-height: 1.5;
      border-left: 4px solid #f59e0b;
    }
    .bubble b { color: #fde68a; }
    .bubble a { color: #38bdf8; text-decoration: underline; font-weight: 700; }

    .review-result-card {
      background: #070a10;
      border: 1.5px solid #10b981;
      border-radius: 14px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .stars { font-size: 22px; color: #f59e0b; margin-bottom: 8px; }
    .quote { font-size: 14px; color: #e2e8f0; font-style: italic; line-height: 1.5; }
    .author { font-size: 12px; font-weight: 700; color: #34d399; margin-top: 12px; display: flex; align-items: center; gap: 6px; }
  </style>
</head>
<body>

<div class="infographic-box">
  <div class="hdr">
    <h2>GOOGLE REVIEW ACCELERATOR: <span>Automated 5-Star Social Proof Engine</span></h2>
    <span class="badge">15–25 NEW 5★ REVIEWS / MONTH</span>
  </div>

  <!-- 4-Step Flow -->
  <div class="flow-grid">
    <div class="step-card">
      <div class="step-num">1</div>
      <div class="step-title">Job Marked Done</div>
      <div class="step-desc">Carlin or technician completes the repair ticket on site. CRM detects status change automatically.</div>
    </div>

    <div class="step-card">
      <div class="step-num">2</div>
      <div class="step-title">Smart 2-Hour Delay</div>
      <div class="step-desc">System waits 2 hours so the homeowner has time to enjoy their cold AC and feel completely satisfied.</div>
    </div>

    <div class="step-card">
      <div class="step-num">3</div>
      <div class="step-title">Automated 1-Tap SMS</div>
      <div class="step-desc">Twilio fires a personalized text from Carlin with a direct link that opens Google Maps with 5 stars pre-selected.</div>
    </div>

    <div class="step-card" style="border-color:#10b981;background:rgba(16,185,129,0.06)">
      <div class="step-num">4</div>
      <div class="step-title" style="color:#34d399">#1 Google Ranking</div>
      <div class="step-desc">Fresh keyword-rich reviews flood your Google Business Profile, pushing Pro-Tech above all local competitors.</div>
    </div>
  </div>

  <!-- Live Demonstration Split -->
  <div class="demo-split">
    <div class="sms-phone-mock">
      <div class="mock-tag">📱 THE AUTOMATED SMS RECEIVED BY HOMEOWNER:</div>
      <div class="bubble">
        <em>"Hey Maria, Carlin with <b>Pro-Tech Air Services</b> here! Glad our crew could get your AC blowing ice-cold today. If you have 30 seconds, could you tap the link below and drop us a quick Google review? It helps our local family crew tremendously:<br><br>
        <a>https://g.page/r/ProTechAirMiami/review</a>"</em>
      </div>
    </div>

    <div class="review-result-card">
      <div>
        <div style="font-size:11px;font-family:monospace;color:#10b981;font-weight:800;margin-bottom:6px">✓ POSTED TO GOOGLE MAPS IN 1 TAP</div>
        <div class="stars">⭐⭐⭐⭐⭐</div>
        <div class="quote">"Carlin and Pro-Tech Air saved our home! Our AC broke on a hot Saturday evening in Miami. Ava answered in one ring, sent a tech out in 45 minutes, and had our capacitor fixed immediately. Best AC company in Miami!"</div>
      </div>
      <div class="author">
        <span>✓ Verified Miami Homeowner</span> &middot; <span>Local Guide</span>
      </div>
    </div>
  </div>
</div>

</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: OUT_PATH, type: 'png' });
  await browser.close();
  console.log('✅ Generated Review Accelerator Infographic at:', OUT_PATH);
}

generateReviewInfographic().catch(console.error);
