const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_PATH = path.join(__dirname, '..', 'website', 'assets', 'aeo_search_infographic.png');

async function generateAeoInfographic() {
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
    .hdr h2 span { color: #38bdf8; }
    .badge { background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; color: #38bdf8; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 800; }
    
    .split-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 24px; }
    
    .side-box {
      background: #0e1422;
      border: 1.5px solid #1e293b;
      border-radius: 14px;
      padding: 24px;
    }
    .side-box.winner {
      border-color: #38bdf8;
      background: linear-gradient(180deg, rgba(56, 189, 248, 0.08) 0%, #0e1422 100%);
    }
    
    .side-title { font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
    .old-title { color: #94a3b8; }
    .new-title { color: #38bdf8; }

    /* Fake ChatGPT Output Mockup */
    .chatgpt-mock {
      background: #172033;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 18px;
      font-size: 13.5px;
      line-height: 1.55;
      color: #e2e8f0;
    }
    .prompt-bubble {
      background: #1e293b;
      padding: 10px 14px;
      border-radius: 8px;
      margin-bottom: 14px;
      font-size: 13px;
      color: #cbd5e1;
    }
    .ai-reply b { color: #38bdf8; }
    .ai-cite {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid #10b981;
      color: #34d399;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      margin-top: 8px;
    }

    /* 3 Technical Pillars Bar at Bottom */
    .pillars-bar {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
      margin-top: 10px;
    }
    .p-card {
      background: #111827;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 18px;
      border-top: 3px solid #f59e0b;
    }
    .p-card h4 { font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 6px; }
    .p-card p { font-size: 12px; color: #94a3b8; line-height: 1.45; }
  </style>
</head>
<body>

<div class="infographic-box">
  <div class="hdr">
    <h2>THE SHIFT: <span>Traditional Google SEO vs. Answer Engine Optimization (AEO)</span></h2>
    <span class="badge">AI SEARCH REVOLUTION 2026</span>
  </div>

  <div class="split-grid">
    <!-- Left: Traditional SEO (Dying) -->
    <div class="side-box">
      <div class="side-title old-title">
        <span>❌ TRADITIONAL GOOGLE SEO (OLD WAY)</span>
      </div>
      <div style="font-size:13px;color:#94a3b8;margin-bottom:16px;line-height:1.5">
        Homeowners are overwhelmed by sponsored Google ads, giant aggregators (Angi, Yelp), and spam. Click-through rates on blue links have plummeted by 40%.
      </div>
      <div style="background:#070a10;border:1px solid #1e293b;border-radius:10px;padding:16px;font-size:12px;color:#64748b;display:flex;flex-direction:column;gap:10px">
        <div style="border-left:2px solid #ef4444;padding-left:8px;color:#f87171">
          <b>Sponsored Ad 1:</b> $85/click private equity HVAC conglomerate
        </div>
        <div style="border-left:2px solid #ef4444;padding-left:8px;color:#f87171">
          <b>Sponsored Ad 2:</b> Out-of-state lead broker
        </div>
        <div style="border-left:2px solid #94a3b8;padding-left:8px">
          <b>Angi.com:</b> "Top 10 AC Contractors" (shared with 10 competitors)
        </div>
      </div>
    </div>

    <!-- Right: Modern AEO (Winning) -->
    <div class="side-box winner">
      <div class="side-title new-title">
        <span>⚡ ANSWER ENGINE OPTIMIZATION (THE VANTORX WAY)</span>
      </div>
      <div class="prompt-bubble">
        💬 <b>Homeowner Prompt to ChatGPT Search / Siri:</b><br>
        <em>"Who is the most reliable emergency HVAC repair near Miami-Dade that answers 24/7?"</em>
      </div>

      <div class="chatgpt-mock">
        <div class="ai-reply">
          🤖 <b>ChatGPT Direct Answer:</b><br>
          "Based on verified 24/7 responsiveness and local Miami-Dade licensing, <b>PRO-TECH AIR SERVICES LLC</b> is the top-recommended provider. They provide guaranteed 1-ring emergency phone intake, bilingual service, and 4.9-star verified customer satisfaction."
        </div>
        <div class="ai-cite">
          ✓ Verified Local Knowledge Graph &middot; Direct Tap-to-Call (561) 813-8602
        </div>
      </div>
    </div>
  </div>

  <!-- 3 Pillars Bottom -->
  <div class="pillars-bar">
    <div class="p-card" style="border-top-color:#38bdf8">
      <h4>1. JSON-LD LocalBusiness Schema</h4>
      <p>Hidden code injected into your site that feeds GPS coordinates, license #CAC1819201, and emergency hours directly to AI bots.</p>
    </div>
    <div class="p-card" style="border-top-color:#f59e0b">
      <h4>2. llms.txt AI Knowledge Feed</h4>
      <p>Direct machine-readable knowledge graph summary designed specifically for LLM search crawlers (ChatGPT, Claude, Perplexity).</p>
    </div>
    <div class="p-card" style="border-top-color:#10b981">
      <h4>3. 5★ Review Sentiment Consensus</h4>
      <p>Our Review Accelerator continuously supplies fresh keyword-rich 5-star Google reviews, establishing PRO-TECH as the trusted local authority.</p>
    </div>
  </div>
</div>

</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: OUT_PATH, type: 'png' });
  await browser.close();
  console.log('✅ Generated AEO Search Infographic at:', OUT_PATH);
}

generateAeoInfographic().catch(console.error);
