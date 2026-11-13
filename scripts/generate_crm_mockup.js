const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_PATH = path.join(__dirname, '..', 'website', 'assets', 'leadflow_crm_ui_mockup.png');

async function generateCrmMockup() {
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
    body { background: #070a10; color: #f8fafc; padding: 20px; }
    
    .crm-window {
      width: 1360px;
      margin: 0 auto;
      background: #0b0f19;
      border: 1.5px solid #1e293b;
      border-radius: 16px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(56, 189, 248, 0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 820px;
    }
    
    /* Top Bar */
    .top-bar {
      background: #0e1422;
      padding: 14px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #1e293b;
    }
    .brand-group { display: flex; align-items: center; gap: 14px; }
    .crm-logo-badge {
      width: 38px; height: 38px;
      background: linear-gradient(135deg, #0284c7, #0369a1);
      border-radius: 8px;
      color: #fff; font-weight: 900; font-size: 18px;
      display: flex; align-items: center; justify-content: center;
      border: 1px solid #38bdf8;
    }
    .crm-title h2 { font-size: 17px; font-weight: 800; color: #fff; }
    .crm-title span { font-size: 11px; font-family: monospace; color: #38bdf8; letter-spacing: 0.1em; }
    
    .kpi-pills { display: flex; gap: 14px; }
    .kpi-pill {
      background: #172033;
      border: 1px solid #334155;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 12px;
      display: flex; align-items: center; gap: 8px;
    }
    .kpi-pill b { color: #f59e0b; }
    
    .live-status {
      display: flex; align-items: center; gap: 8px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid #10b981;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      color: #34d399;
    }
    .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; }

    /* Main CRM Split View: Left Kanban Columns, Right Live Chat & Tech Dispatch */
    .crm-body {
      display: grid;
      grid-template-columns: 2.1fr 1fr;
      flex: 1;
      background: #070a10;
      overflow: hidden;
    }

    /* Kanban Board */
    .kanban-area {
      padding: 20px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      border-right: 1px solid #1e293b;
      overflow-y: auto;
    }
    
    .k-col {
      background: #0e1422;
      border: 1px solid #1e293b;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      padding: 12px;
    }
    .col-hdr {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #1e293b;
    }
    .col-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
    .col-cnt { background: #1e293b; color: #94a3b8; font-size: 11px; font-weight: 800; padding: 2px 7px; border-radius: 999px; }

    .c-blue { color: #38bdf8; }
    .c-purple { color: #c084fc; }
    .c-yellow { color: #fbbf24; }
    .c-green { color: #34d399; }

    /* Kanban Card */
    .lead-card {
      background: #151d32;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 10px;
      transition: all .2s;
    }
    .lead-card.urgent { border-left: 4px solid #f43f5e; }
    .lead-card.active-deal { border-left: 4px solid #10b981; }
    .lead-card.scheduled { border-left: 4px solid #38bdf8; }

    .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .lead-name { font-size: 13.5px; font-weight: 800; color: #fff; }
    .lead-time { font-size: 10.5px; color: #94a3b8; font-family: monospace; }

    .lead-issue { font-size: 12px; color: #cbd5e1; margin-bottom: 8px; line-height: 1.35; }
    .lead-phone { font-size: 11.5px; color: #38bdf8; font-family: monospace; font-weight: 700; }
    
    .card-meta {
      display: flex; justify-content: space-between; align-items: center;
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px solid rgba(255,255,255,0.06);
      font-size: 11px;
    }
    .badge-speed { background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 2px 6px; border-radius: 4px; font-weight: 700; }
    .badge-rev { background: rgba(16, 185, 129, 0.15); color: #34d399; padding: 2px 6px; border-radius: 4px; font-weight: 700; }

    /* Right Sidebar: 45-Second Speed-to-Lead Live Feed & 2-Way SMS */
    .sidebar-area {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: #0a0e18;
    }
    .sb-hdr { font-size: 13px; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.1em; display: flex; align-items: center; gap: 8px; }

    .sms-stream-box {
      background: #111827;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .sms-msg {
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 12px;
      line-height: 1.4;
    }
    .msg-system {
      background: rgba(56, 189, 248, 0.12);
      border-left: 3px solid #38bdf8;
      color: #e0f2fe;
    }
    .msg-out {
      background: #1e293b;
      color: #f1f5f9;
      border-left: 3px solid #f59e0b;
    }
    .msg-in {
      background: #0f172a;
      color: #94a3b8;
      border: 1px solid #334155;
    }

    /* Review Boost Card */
    .review-boost-card {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%);
      border: 1.5px solid #10b981;
      border-radius: 12px;
      padding: 16px;
    }
    .rb-title { font-size: 13px; font-weight: 800; color: #34d399; margin-bottom: 6px; }
    .rb-desc { font-size: 11.5px; color: #cbd5e1; line-height: 1.4; }
  </style>
</head>
<body>

<div class="crm-window">
  <!-- Top Bar -->
  <div class="top-bar">
    <div class="brand-group">
      <div class="crm-logo-badge">⚡</div>
      <div class="crm-title">
        <h2>LeadFlow CRM &middot; PRO-TECH AIR SERVICES</h2>
        <span>PIPELINE ENGINE &middot; 45s SPEED-TO-LEAD AUTOMATION</span>
      </div>
    </div>

    <div class="kpi-pills">
      <div class="kpi-pill">⚡ Speed-to-Lead: <b>38s Avg</b></div>
      <div class="kpi-pill">📞 Calls Captured Today: <b>14 / 14 (100%)</b></div>
      <div class="kpi-pill">⭐ Reviews Generated: <b>+22 This Month</b></div>
    </div>

    <div class="live-status">
      <div class="pulse-dot"></div>
      <span>SYSTEM LIVE · AUTOPILOT ACTIVE</span>
    </div>
  </div>

  <!-- Body -->
  <div class="crm-body">
    <!-- 4 Kanban Columns -->
    <div class="kanban-area">
      <!-- Col 1: Inbound Lead -->
      <div class="k-col">
        <div class="col-hdr">
          <span class="col-title c-blue">1. Inbound Calls (Ava)</span>
          <span class="col-cnt">4</span>
        </div>

        <div class="lead-card urgent">
          <div class="card-top">
            <span class="lead-name">Maria Gonzalez</span>
            <span class="lead-time">4m ago</span>
          </div>
          <div class="lead-issue">🚨 AC blowing warm air, condo at 84°. Needs urgent diagnostic today.</div>
          <div class="lead-phone">📞 (305) 849-2910</div>
          <div class="card-meta">
            <span class="badge-speed">Bilingual EN/ES</span>
            <span style="color:#f43f5e;font-weight:700">Urgent Dispatch</span>
          </div>
        </div>

        <div class="lead-card">
          <div class="card-top">
            <span class="lead-name">Robert Sterling</span>
            <span class="lead-time">18m ago</span>
          </div>
          <div class="lead-issue">Routine maintenance & coil cleaning quote requested via website.</div>
          <div class="lead-phone">📞 (786) 392-1044</div>
          <div class="card-meta">
            <span class="badge-speed">Web Estimator</span>
            <span style="color:#94a3b8">Single Family</span>
          </div>
        </div>
      </div>

      <!-- Col 2: Qualified & Dispatched -->
      <div class="k-col">
        <div class="col-hdr">
          <span class="col-title c-purple">2. Dispatched to Tech</span>
          <span class="col-cnt">3</span>
        </div>

        <div class="lead-card scheduled">
          <div class="card-top">
            <span class="lead-name">Jorge Martinez</span>
            <span class="lead-time">32m ago</span>
          </div>
          <div class="lead-issue">Water leaking through drywall ceiling. Assigned to Carlin's Truck 1.</div>
          <div class="lead-phone">📞 (561) 902-8841</div>
          <div class="card-meta">
            <span class="badge-speed">SMS Dossier Sent</span>
            <span style="color:#38bdf8;font-weight:700">En Route</span>
          </div>
        </div>

        <div class="lead-card">
          <div class="card-top">
            <span class="lead-name">Elena Rostova</span>
            <span class="lead-time">1h ago</span>
          </div>
          <div class="lead-issue">Capacitor hum, fan not spinning. Booked 2:30 PM slot.</div>
          <div class="lead-phone">📞 (305) 412-7789</div>
          <div class="card-meta">
            <span class="badge-speed">Calendar Synced</span>
            <span style="color:#c084fc">Assigned</span>
          </div>
        </div>
      </div>

      <!-- Col 3: Walkthrough & Won -->
      <div class="k-col">
        <div class="col-hdr">
          <span class="col-title c-yellow">3. Jobs In Progress</span>
          <span class="col-cnt">2</span>
        </div>

        <div class="lead-card active-deal">
          <div class="card-top">
            <span class="lead-name">David Vance</span>
            <span class="lead-time">2h ago</span>
          </div>
          <div class="lead-issue">Full 4-Ton Heat Pump Replacement quote approved ($8,400 ticket).</div>
          <div class="lead-phone">📞 (305) 551-9204</div>
          <div class="card-meta">
            <span class="badge-rev">$8,400 System</span>
            <span style="color:#10b981;font-weight:700">Installing</span>
          </div>
        </div>

        <div class="lead-card">
          <div class="card-top">
            <span class="lead-name">Chloe Henderson</span>
            <span class="lead-time">3h ago</span>
          </div>
          <div class="lead-issue">Blower motor replaced. Diagnostic fee paid on site.</div>
          <div class="lead-phone">📞 (786) 662-8110</div>
          <div class="card-meta">
            <span class="badge-rev">$620 Repair</span>
            <span style="color:#fbbf24">Wrapping Up</span>
          </div>
        </div>
      </div>

      <!-- Col 4: Review Dispatched -->
      <div class="k-col">
        <div class="col-hdr">
          <span class="col-title c-green">4. 5★ Review Boosted</span>
          <span class="col-cnt">5</span>
        </div>

        <div class="lead-card">
          <div class="card-top">
            <span class="lead-name">Frank Castillo</span>
            <span class="lead-time">Today</span>
          </div>
          <div class="lead-issue">⭐⭐⭐⭐⭐ "Carlin arrived in 30 mins! Saved us on Sunday night."</div>
          <div class="lead-phone">Google Review #182</div>
          <div class="card-meta">
            <span class="badge-rev">✓ Review Live</span>
            <span style="color:#34d399">Google Maps</span>
          </div>
        </div>

        <div class="lead-card">
          <div class="card-top">
            <span class="lead-name">Samantha Reed</span>
            <span class="lead-time">Yesterday</span>
          </div>
          <div class="lead-issue">⭐⭐⭐⭐⭐ "Ava answered on ring 1, super smooth experience!"</div>
          <div class="lead-phone">Google Review #181</div>
          <div class="card-meta">
            <span class="badge-rev">✓ Review Live</span>
            <span style="color:#34d399">Google Maps</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Sidebar: Live 2-Way SMS Thread -->
    <div class="sidebar-area">
      <div class="sb-hdr">💬 Live Speed-to-Lead Feed</div>

      <div class="sms-stream-box">
        <div class="sms-msg msg-system">
          <b>⚡ 42-Second Missed-Call Auto Text:</b><br>
          <em>"Hey Maria, saw you called Pro-Tech Air! Are you having an AC emergency?"</em>
        </div>

        <div class="sms-msg msg-in">
          <b>Homeowner (305-849-2910):</b><br>
          <em>"Yes, it's 85 degrees inside and blowing warm air. Can someone come out?"</em>
        </div>

        <div class="sms-msg msg-out">
          <b>Pro-Tech On-Call Tech (SMS):</b><br>
          <em>"On it Maria! Our truck is in North Miami now. We will be at your address by 11:15 AM."</em>
        </div>
      </div>

      <div class="review-boost-card">
        <div class="rb-title">⭐ Automated Google Review Accelerator</div>
        <div class="rb-desc">
          When Carlin marks any job "Done", Twilio fires a personalized 1-tap review link 2 hours later. Averages <b>15 to 25 verified 5-star Google reviews</b> every month on complete autopilot.
        </div>
      </div>
    </div>
  </div>
</div>

</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: OUT_PATH, type: 'png' });
  await browser.close();
  console.log('✅ Generated LeadFlow CRM mockup at:', OUT_PATH);
}

generateCrmMockup().catch(console.error);
