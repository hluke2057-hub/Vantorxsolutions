const fs = require('fs');
const path = require('path');

const arenaPath = path.join(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
let content = fs.readFileSync(arenaPath, 'utf8');
const isCrlf = content.includes('\r\n');
const eol = isCrlf ? '\r\n' : '\n';

console.log('Beginning 50/50 view and product split upgrade...');

// ============================================================
// 1. UPDATE LEADS_DATA WITH ALTERNATING PRODUCT CYCLE
// ============================================================
const PRODUCT_SEQUENCE = [
  {
    product: 'bundle',
    service: 'Accelerate Growth Engine: 24/7 Ava Voice AI + 90s SMS Speed-to-Lead + Custom Mobile Website + AEO',
    painPoint: 'Multi-leak bleed: after-hours voicemail, slow web reply, and outdated mobile conversion'
  },
  {
    product: 'basic',
    service: 'Basic Package: AI Front Desk (24/7 Ava Voice AI Receptionist & Emergency Triage)',
    painPoint: 'Missed after-hours emergency calls rolling to voicemail while working on job sites'
  },
  {
    product: 'scale',
    service: 'Scale Enterprise Tier: Multi-Crew Autonomous Infrastructure, Bilingual Dispatch & CRM Integration',
    painPoint: 'Dispatch lines jammed during peak seasonal spikes causing high-value commercial leaks'
  },
  {
    product: 'ava',
    service: 'Ava 24/7 Voice AI Receptionist (<1s instant pickup & technician SMS dispatch)',
    painPoint: 'Losing $8,000 weekend emergency service calls to competitors on Google Maps'
  },
  {
    product: 'website',
    service: 'Custom High-Converting Mobile Website (<1s load time, tap-to-call & instant booking)',
    painPoint: 'Mobile website loading delay over 5s with high bounce rate and no sticky tap-to-call'
  },
  {
    product: 'speed',
    service: 'LeadFlow 90-Second SMS Speed-to-Lead and Missed-Call Recovery Engine',
    painPoint: '78% of homeowners buy from whoever replies first; estimate forms sit un-replied for hours'
  },
  {
    product: 'aeo',
    service: 'AEO Engine™ & Google Review Dominance (Siri, ChatGPT & Google Map Pack Top 3)',
    painPoint: 'Competitors dominate top 3 Google Map pack and Siri/ChatGPT AI recommendations'
  }
];

// Extract LEADS_DATA array
const leadsStartStr = '  const LEADS_DATA = [';
const startIndex = content.indexOf(leadsStartStr);
const soundEngineIndex = content.indexOf('// Sound Engine', startIndex);

if (startIndex === -1 || soundEngineIndex === -1) {
  throw new Error('Could not find LEADS_DATA boundaries leading up to Sound Engine in index.html');
}

const arrayEndIndex = content.lastIndexOf('];', soundEngineIndex) + 2;
const leadsBlock = content.substring(startIndex, arrayEndIndex);

const parseFn = new Function(leadsBlock + '; return LEADS_DATA;');
const leads = parseFn();
console.log(`Loaded ${leads.length} leads from inline LEADS_DATA`);

// Cycle products across leads
leads.forEach((lead, i) => {
  const prodSpec = PRODUCT_SEQUENCE[i % PRODUCT_SEQUENCE.length];
  lead.product = prodSpec.product;
  lead.service = prodSpec.service;
  lead.painPoint = prodSpec.painPoint;
});

// Serialize leads back
const formattedLeads = leads.map(l => '    ' + JSON.stringify(l)).join(',\n');
const newLeadsBlock = `  const LEADS_DATA = [\n${formattedLeads}\n  ];`;

// Replace LEADS_DATA in content
content = content.substring(0, startIndex) + newLeadsBlock + content.substring(arrayEndIndex);
console.log('✓ Successfully cycled products across LEADS_DATA');

// Also update data/normalized_lead_targets.json & data/real_verified_leads.json if they exist
const normPath = path.join(__dirname, '..', 'data', 'normalized_lead_targets.json');
const realPath = path.join(__dirname, '..', 'data', 'real_verified_leads.json');
[normPath, realPath].forEach(fp => {
  if (fs.existsSync(fp)) {
    try {
      const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
      data.forEach((lead, i) => {
        const prodSpec = PRODUCT_SEQUENCE[i % PRODUCT_SEQUENCE.length];
        lead.product = prodSpec.product;
        lead.service = prodSpec.service;
        lead.painPoint = prodSpec.painPoint;
      });
      fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✓ Synchronized ${path.basename(fp)}`);
    } catch(e) {
      console.warn(`Could not sync ${path.basename(fp)}:`, e.message);
    }
  }
});

// ============================================================
// 2. UPGRADE scriptPanel_website WITH 50/50 SPLIT GRID
// ============================================================
const websiteStartMarker = '<div id="scriptPanel_website" class="product-script-panel">';
const websiteEndMarker = '<div class="script-section-header">' + eol + '          <h3><span>🛡️</span> Stage 2: In-Line Objection Battlecards (Custom Websites)</h3>';

const newWebsiteContent = `<div id="scriptPanel_website" class="product-script-panel">
        
        <!-- Package Strategy Banner -->
        <div style="background:linear-gradient(135deg,rgba(56,189,248,0.12),rgba(14,165,233,0.12));border:1px solid rgba(56,189,248,0.4);border-radius:12px;padding:16px 20px;margin-bottom:18px">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
            <div style="font-size:14px;font-weight:800;color:#38bdf8;letter-spacing:0.5px">🌐 CUSTOM CONTRACTOR WEBSITE PLAYBOOK ($799 FLAT UPFRONT · ZERO MONTHLY LOCK-IN)</div>
            <span style="font-size:11px;font-family:var(--font-mono);background:#38bdf8;color:#000;font-weight:800;padding:3px 8px;border-radius:4px">&lt;1s LOAD TIME · MOBILE CONVERSION MACHINE</span>
          </div>
          <p style="font-size:12.5px;color:#cbd5e1;margin:8px 0 0;line-height:1.5">
            Bespoke mobile-first Webflow website engineered for sub-second load times, click-to-call buttons, emergency quote forms, and high visitor-to-phone-call conversion. 74% of homeowners search from a phone; an outdated site leaks high-ticket jobs.
          </p>
        </div>

        <!-- Section Header -->
        <div class="script-section-header" style="margin-top:0">
          <h3><span>🌐</span> Primary Pitch: High-Converting Mobile Website ($799 Flat Upfront)</h3>
          <span style="font-size:11px;font-family:var(--font-mono);background:rgba(56,189,248,0.2);color:#38bdf8;padding:2px 8px;border-radius:4px;border:1px solid rgba(56,189,248,0.4)">Stops 5s Mobile Bounce</span>
        </div>

        <!-- Split View Controls Fork -->
        <div class="split-view-controls" style="display:flex;align-items:center;justify-content:space-between;margin:16px 0 18px;flex-wrap:wrap;gap:10px;background:rgba(15,21,34,0.6);border:1px solid var(--line2);padding:10px 16px;border-radius:12px">
          <div style="font-size:13px;font-weight:700;color:var(--ink);display:flex;align-items:center;gap:8px">
            <span style="color:var(--accent2);font-size:16px">⚡</span>
            <span>CALL ROUTING FORK:</span>
            <span style="color:var(--dim);font-size:12px;font-weight:400">Split down the middle for instant reaction (Custom Website $799 flat upfront)</span>
          </div>
          <div class="split-view-selector">
            <button class="split-view-btn active" type="button" onclick="setSplitView('split', this)">👁️ Split View 50/50</button>
            <button class="split-view-btn" type="button" onclick="setSplitView('owner', this)">🟢 Yes: It's The Owner</button>
            <button class="split-view-btn" type="button" onclick="setSplitView('not-owner', this)">🟡 No: Not The Owner</button>
          </div>
        </div>

        <!-- SPLIT-DOWN-THE-MIDDLE GRID -->
        <div class="script-split-grid">
          <!-- LEFT COLUMN: YES — IT'S THE OWNER -->
          <div class="script-col script-col-owner col-owner-track">
            <div class="script-col-header">
              <h4 style="color:#6ee7b7"><span>🟢</span> YES — IT'S THE OWNER</h4>
              <span class="col-badge" style="background:rgba(52,211,153,0.15);color:#6ee7b7;border:1px solid rgba(52,211,153,0.4)">Direct Decision Maker Track</span>
            </div>

            <!-- Step 1: Permission Opener -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span>Step 1: Permission Opener (0:00 - 0:08)</span><span style="color:var(--ok)">✓ 70% Win Rate</span></div>
              <div class="script-line">
                "Hey <span class="dyn-owner">[Owner's First Name]</span>, Luke from VantorX. I know you weren't expecting my call — <strong>got 20 seconds or should I hang up?</strong>"
              </div>
              <div class="delivery-tip">
                💡 <em>Delivery Tip:</em> Lower your pitch, speak calmly, and STOP TALKING.
              </div>
            </div>

            <!-- Step 2: The Mobile Bounce & Lost Bids Leak Hook -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span>Step 2: Mobile Bounce &amp; Lost Bids Leak (<span class="dyn-loss">$15k-$25k/mo</span>)</span><span style="color:var(--ok)">✓ Expose Leaks</span></div>
              <div class="script-line">
                "I'll be brief: I pulled up your website on my iPhone in <span class="dyn-city">[City]</span>. In <span class="dyn-trade">[Trade]</span>, over 74% of homeowners search for emergency service on their smartphone.<br><br>
                Your mobile site takes over 5 seconds to load and there's no sticky 'Tap to Call' or instant estimate button. When people wait 5 seconds, 60% tap back to Google and hire your competitor.<br><br>
                That bounce delay is leaking an estimated <strong style="color:#fca5a5"><span class="dyn-loss">$15,000 to $25,000 a month</span></strong> in lost jobs. <strong>Who handles your website right now?</strong>"
              </div>
              <div class="delivery-tip">
                💡 <em>The Golden Pause:</em> Let them admit who built it or that they know it's outdated.
              </div>
            </div>

            <!-- Step 3: The 1-Second High-Converting Overhaul Solution -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span>Step 3: The 1-Second Overhaul (0:25 - 0:45)</span><span>$799 Flat Upfront · Zero Retainers</span></div>
              <div class="script-line">
                "That's exactly why we build custom, lightning-fast mobile websites specifically for Florida contractors. It loads in under 1 second, showcases your real 5-star job photos, and has prominent 1-tap emergency booking buttons.<br><br>
                We do 100% of the copywriting, mobile optimization, and hosting setup for a <strong>flat $799 upfront with zero monthly retainers</strong>, launched in 5 business days."
              </div>
              <div class="script-savings-math-cue">
                <div style="font-size:11px;font-family:var(--font-mono);font-weight:700;color:#a7f3d0;text-transform:uppercase;margin-bottom:3px">🧮 The Savings Math to Say Next (If Asked):</div>
                <div class="dyn-script-savings-math">"And here's the math: agencies charge $6,000 upfront plus $150/hr retainers. Our entire custom build is $799 flat. In your trade, catching literally ONE single extra job from your mobile visitors pays for the website for life, and every job after that is pure profit."</div>
              </div>
            </div>

            <!-- Step 4: Book The 10-Min Live Demo Close & Time Choice -->
            <div class="script-phase" style="border-color:rgba(245,158,11,0.5);background:rgba(245,158,11,0.06);margin-bottom:0">
              <div class="phase-tag"><span style="color:var(--accent2);font-weight:800">Step 4: Book The 10-Min Live Demo Close &amp; Time Choice</span><span style="color:var(--accent)">★ Master Close</span></div>
              <div class="script-line" style="font-size:15px;line-height:1.6">
                "<strong>So if you want to stop losing high-ticket jobs to mobile bounce, let's book a quick 10-minute live demo on Zoom tomorrow.</strong> I'll share my screen and show you <span class="dyn-company">[Company Name]</span>'s mobile speed score side-by-side with our high-converting contractor wireframe.<br><br>
                Are you usually easier to catch in the morning before crews roll out, or later in the afternoon around 4:30?"
              </div>
              <div class="delivery-tip">
                💡 <em>Alternative Choice:</em> Never ask <em>"Do you want to see it?"</em>. Lock morning vs 4:30 PM.
              </div>
            </div>

            <!-- Step 5: The Friction-Killer Line -->
            <div class="script-phase" style="border-color:rgba(56,189,248,0.4);background:rgba(56,189,248,0.04);margin-bottom:0">
              <div class="phase-tag"><span style="color:#7dd3fc;font-weight:700">Step 5: Friction-Killer Video Audit Line</span><span style="color:#7dd3fc">Zero Risk Proof</span></div>
              <div class="script-line">
                "Tell you what: I'll record a quick 2-minute video audit of your current mobile site on my iPhone showing the 3 speed bottlenecks and text it directly to your cell. What's the best direct number?"
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: NO — NOT THE OWNER -->
          <div class="script-col script-col-not-owner col-not-owner-track">
            <div class="script-col-header">
              <h4 style="color:#fde047"><span>🟡</span> NO — NOT THE OWNER</h4>
              <span class="col-badge" style="background:rgba(245,158,11,0.15);color:#fde047;border:1px solid rgba(245,158,11,0.4)">Dispatcher / Gatekeeper Track</span>
            </div>

            <!-- Step 1: Casual Peer Opener -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span>Step 1: Casual Local Peer Opener</span><span>0:00 - 0:05</span></div>
              <div class="script-line" style="font-size:16px">
                "Hey, I was just wondering if the owner is around?"
              </div>
              <div class="delivery-tip">
                💡 <em>Tone:</em> Authority and calm local contractor demeanor.
              </div>
            </div>

            <!-- Step 2: Praise The Assistant Reframe -->
            <div class="script-phase" style="margin-bottom:0;border-color:rgba(245,158,11,0.35);background:rgba(245,158,11,0.05)">
              <div class="phase-tag"><span style="color:var(--accent2)">Step 2: The Assistant Praise Reframe</span><span>When told he's out/busy</span></div>
              <div class="script-line" style="font-size:16px">
                "Oh gotcha, no problem! You're the one actually running the show and handling client inquiries while he's out on jobs."
              </div>
              <div class="delivery-tip">
                💡 <em>Elevate Front Desk:</em> Elevates them to a respected partner. Guard drops immediately.
              </div>
            </div>

            <!-- Step 3: Operational Question -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span>Step 3: Operational Dispatch Question</span><span>Expose The Web Leak</span></div>
              <div class="script-line" style="font-size:16px">
                "Quick question for you then: when homeowners in <span class="dyn-city">[City]</span> fill out quote forms on your website, do those come straight to your inbox, or does <span class="dyn-owner">[Owner's First Name]</span> check them on his phone?"
              </div>
              <div class="delivery-tip">
                💡 <em>Listen Closely:</em> Discover who monitors web inquiries and how long delays are.
              </div>
            </div>

            <!-- Step 4: Extract Direct Cell Phone -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span style="color:#6ee7b7">Step 4: Extract Direct Cell Phone</span><span style="color:var(--ok)">Key Objective</span></div>
              <div class="script-line" style="font-size:16px">
                "Understood! I noticed a mobile speed issue on your site that causes customer quote requests to drop off before they submit.<br><br>
                <strong>What's the best direct cell to text <span class="dyn-owner">[Owner's First Name]</span> a quick 2-minute video audit of the issue so he can see it between jobs?</strong>"
              </div>
            </div>

            <!-- Step 5: Handling "Can I take a message?" or "Send an email" -->
            <div class="script-phase" style="margin-bottom:0;border-color:rgba(239,68,68,0.35);background:rgba(239,68,68,0.05)">
              <div class="phase-tag"><span style="color:#fca5a5">Step 5: When Asked "Can I Take a Message / Send Email?"</span><span>Bypass</span></div>
              <div class="script-line" style="font-size:14.5px;line-height:1.5">
                "Emails get buried behind dozens of invoices. Let me shoot his cell a quick 1-line text with the 2-minute video link so he can see the mobile speed test firsthand.<br><br>
                What's his cell number so I can text that over?"
              </div>
            </div>
          </div>
        </div>

        `;

if (content.includes(websiteStartMarker)) {
  const webIdx1 = content.indexOf(websiteStartMarker);
  const webIdx2 = content.indexOf(websiteEndMarker);
  if (webIdx1 !== -1 && webIdx2 !== -1) {
    content = content.substring(0, webIdx1) + newWebsiteContent + content.substring(webIdx2);
    console.log('✓ Successfully upgraded scriptPanel_website to 50/50 Split View');
  }
}

// ============================================================
// 3. UPGRADE scriptPanel_speed WITH 50/50 SPLIT GRID
// ============================================================
const speedStartMarker = '<div id="scriptPanel_speed" class="product-script-panel">';
const speedEndMarker = '<div class="script-section-header">' + eol + '          <h3><span>🛡️</span> Stage 2: In-Line Objection Battlecards (Speed-to-Lead)</h3>';

const newSpeedContent = `<div id="scriptPanel_speed" class="product-script-panel">
        
        <!-- Package Strategy Banner -->
        <div style="background:linear-gradient(135deg,rgba(245,158,11,0.12),rgba(234,179,8,0.12));border:1px solid rgba(245,158,11,0.4);border-radius:12px;padding:16px 20px;margin-bottom:18px">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
            <div style="font-size:14px;font-weight:800;color:var(--accent2);letter-spacing:0.5px">⚡ LEADFLOW 90s SMS SPEED-TO-LEAD PLAYBOOK ($197/MO + $197 SETUP FEE)</div>
            <span style="font-size:11px;font-family:var(--font-mono);background:var(--accent);color:#000;font-weight:800;padding:3px 8px;border-radius:4px">78% CONVERSION RULE · INSTANT SMS RESPONSE</span>
          </div>
          <p style="font-size:12.5px;color:#cbd5e1;margin:8px 0 0;line-height:1.5">
            Automated SMS response engine that texts homeowners within 90 seconds of receiving a web form or missed call, booking the appointment before they call competitors. 78% of homeowners buy from whoever responds first.
          </p>
        </div>

        <!-- Section Header -->
        <div class="script-section-header" style="margin-top:0">
          <h3><span>⚡</span> Primary Pitch: 90-Second SMS Speed-to-Lead ($197/mo + $197 Setup)</h3>
          <span style="font-size:11px;font-family:var(--font-mono);background:rgba(245,158,11,0.2);color:var(--accent2);padding:2px 8px;border-radius:4px;border:1px solid rgba(245,158,11,0.4)">Stops Ghosted Web Leads</span>
        </div>

        <!-- Split View Controls Fork -->
        <div class="split-view-controls" style="display:flex;align-items:center;justify-content:space-between;margin:16px 0 18px;flex-wrap:wrap;gap:10px;background:rgba(15,21,34,0.6);border:1px solid var(--line2);padding:10px 16px;border-radius:12px">
          <div style="font-size:13px;font-weight:700;color:var(--ink);display:flex;align-items:center;gap:8px">
            <span style="color:var(--accent2);font-size:16px">⚡</span>
            <span>CALL ROUTING FORK:</span>
            <span style="color:var(--dim);font-size:12px;font-weight:400">Split down the middle for instant reaction (LeadFlow 90s SMS $197/mo + $197 setup)</span>
          </div>
          <div class="split-view-selector">
            <button class="split-view-btn active" type="button" onclick="setSplitView('split', this)">👁️ Split View 50/50</button>
            <button class="split-view-btn" type="button" onclick="setSplitView('owner', this)">🟢 Yes: It's The Owner</button>
            <button class="split-view-btn" type="button" onclick="setSplitView('not-owner', this)">🟡 No: Not The Owner</button>
          </div>
        </div>

        <!-- SPLIT-DOWN-THE-MIDDLE GRID -->
        <div class="script-split-grid">
          <!-- LEFT COLUMN: YES — IT'S THE OWNER -->
          <div class="script-col script-col-owner col-owner-track">
            <div class="script-col-header">
              <h4 style="color:#6ee7b7"><span>🟢</span> YES — IT'S THE OWNER</h4>
              <span class="col-badge" style="background:rgba(52,211,153,0.15);color:#6ee7b7;border:1px solid rgba(52,211,153,0.4)">Direct Decision Maker Track</span>
            </div>

            <!-- Step 1: Permission Opener -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span>Step 1: Permission Opener (0:00 - 0:08)</span><span style="color:var(--ok)">✓ 70% Win Rate</span></div>
              <div class="script-line">
                "Hey <span class="dyn-owner">[Owner's First Name]</span>, Luke from VantorX. I know you were not expecting my call — <strong>got 20 seconds or should I hang up?</strong>"
              </div>
              <div class="delivery-tip">
                💡 <em>Delivery Tip:</em> Lower your pitch, speak calmly, and STOP TALKING.
              </div>
            </div>

            <!-- Step 2: The 78% First-Responder Statistic Hook -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span>Step 2: The 78% First-Responder Hook (<span class="dyn-loss">$10k-$20k/mo</span>)</span><span style="color:var(--ok)">✓ Ghosted Leads Leak</span></div>
              <div class="script-line">
                "MIT and Harvard studies proved that <strong>78% of homeowners buy from the contractor who replies FIRST</strong>. In <span class="dyn-city">[City]</span>, when a lead submits an estimate request or misses a call while you're on a job site, waiting even 15 minutes drops conversion by 80%.<br><br>
                Right now, when someone reaches out while you're driving or running tools, <strong>how fast do they get an SMS reply?</strong>"
              </div>
              <div class="delivery-tip">
                💡 <em>The Golden Pause:</em> Let them admit delays or that they text back hours later when done for the day.
              </div>
            </div>

            <!-- Step 3: The 90-Second Instant Text-Back Solution -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span>Step 3: The 90-Second Auto-Text Solution</span><span>$197/mo + $197 Setup</span></div>
              <div class="script-line">
                "That's exactly why we built LeadFlow 90s Speed-to-Lead. The second an estimate form is submitted or a call is missed, our system fires a personalized text in under 90 seconds:<br><br>
                <em>'Hey! <span class="dyn-owner">[Owner's First Name]</span> with <span class="dyn-company">[Company]</span> here, just finishing up with a homeowner on a job. What issue are you experiencing?'</em><br><br>
                It qualifies the job, collects photos, and books their appointment before they ever call your competitor. It is <strong>$197 a month plus a one-time $197 setup fee</strong> with zero contracts."
              </div>
              <div class="script-savings-math-cue">
                <div style="font-size:11px;font-family:var(--font-mono);font-weight:700;color:#a7f3d0;text-transform:uppercase;margin-bottom:3px">🧮 The Savings Math to Say Next (If Asked):</div>
                <div class="dyn-script-savings-math">"And here's the math: at $197/mo ($2,364/yr), recovering literally ONE single quote all year pays for the entire service for 12 months. Everything else is pure found revenue."</div>
              </div>
            </div>

            <!-- Step 4: Book The 10-Min Live Demo Close & Time Choice -->
            <div class="script-phase" style="border-color:rgba(245,158,11,0.5);background:rgba(245,158,11,0.06);margin-bottom:0">
              <div class="phase-tag"><span style="color:var(--accent2);font-weight:800">Step 4: Book The 10-Min Live Demo Close &amp; Time Choice</span><span style="color:var(--accent)">★ Master Close</span></div>
              <div class="script-line" style="font-size:15px;line-height:1.6">
                "<strong>Let's book a quick 10-minute live demo on Zoom tomorrow.</strong> I'll trigger a real test lead into our system right in front of you so you can see how fast it qualifies and books homeowners on your calendar before competitors can dial.<br><br>
                Are you usually easier to catch in the morning before crews roll out, or later in the afternoon around 4:30?"
              </div>
              <div class="delivery-tip">
                💡 <em>Alternative Choice:</em> Offer morning or 4:30 PM.
              </div>
            </div>

            <!-- Step 5: Friction-Killer Line -->
            <div class="script-phase" style="border-color:rgba(56,189,248,0.4);background:rgba(56,189,248,0.04);margin-bottom:0">
              <div class="phase-tag"><span style="color:#7dd3fc;font-weight:700">Step 5: Instant Live Test Text</span><span style="color:#7dd3fc">Zero Risk Proof</span></div>
              <div class="script-line">
                "Tell you what: let me trigger a live test SMS to your cell right now so you can feel how fast 90-second response really is. What's the best direct cell?"
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: NO — NOT THE OWNER -->
          <div class="script-col script-col-not-owner col-not-owner-track">
            <div class="script-col-header">
              <h4 style="color:#fde047"><span>🟡</span> NO — NOT THE OWNER</h4>
              <span class="col-badge" style="background:rgba(245,158,11,0.15);color:#fde047;border:1px solid rgba(245,158,11,0.4)">Dispatcher / Gatekeeper Track</span>
            </div>

            <!-- Step 1: Casual Peer Opener -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span>Step 1: Casual Local Peer Opener</span><span>0:00 - 0:05</span></div>
              <div class="script-line" style="font-size:16px">
                "Hey, I was just wondering if the owner is around?"
              </div>
              <div class="delivery-tip">
                💡 <em>Tone:</em> Authority and direct peer demeanor.
              </div>
            </div>

            <!-- Step 2: Praise The Dispatcher Reframe -->
            <div class="script-phase" style="margin-bottom:0;border-color:rgba(245,158,11,0.35);background:rgba(245,158,11,0.05)">
              <div class="phase-tag"><span style="color:var(--accent2)">Step 2: The Dispatcher Praise Reframe</span><span>When told he's out/busy</span></div>
              <div class="script-line" style="font-size:16px">
                "Oh gotcha, no problem! You're the one actually running the show and keeping up with customer leads while he's out."
              </div>
              <div class="delivery-tip">
                💡 <em>Elevate Front Desk:</em> Elevates them to a respected manager. Guard drops immediately.
              </div>
            </div>

            <!-- Step 3: Operational Question -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span>Step 3: Operational Dispatch Question</span><span>Expose The SMS Lag</span></div>
              <div class="script-line" style="font-size:16px">
                "Quick question for you then: when leads submit quote requests on your website while you're swamped on other calls, how many hours usually pass before someone can text them back?"
              </div>
              <div class="delivery-tip">
                💡 <em>Listen Closely:</em> Dispatchers vent about playing phone tag and leads ghosting.
              </div>
            </div>

            <!-- Step 4: Extract Direct Cell Phone -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span style="color:#6ee7b7">Step 4: Extract Direct Cell Phone</span><span style="color:var(--ok)">Key Objective</span></div>
              <div class="script-line" style="font-size:16px">
                "Got it. We build 90-second SMS speed-to-lead engines so you guys don't lose jobs to the first guy who replies.<br><br>
                <strong>What's the best direct cell to reach <span class="dyn-owner">[Owner's First Name]</span> on, or when does he usually check in with you?</strong>"
              </div>
            </div>

            <!-- Step 5: Handling "Can I take a message?" or "Send an email" -->
            <div class="script-phase" style="margin-bottom:0;border-color:rgba(239,68,68,0.35);background:rgba(239,68,68,0.05)">
              <div class="phase-tag"><span style="color:#fca5a5">Step 5: When Asked "Can I Take a Message / Send Email?"</span><span>Bypass</span></div>
              <div class="script-line" style="font-size:14.5px;line-height:1.5">
                "Emails get buried behind dozens of messages. Let me shoot his cell a quick 1-line text with our 90s speed-to-lead demo so he can test it firsthand.<br><br>
                What's his cell number so I can send that over?"
              </div>
            </div>
          </div>
        </div>

        `;

if (content.includes(speedStartMarker)) {
  const speedIdx1 = content.indexOf(speedStartMarker);
  const speedIdx2 = content.indexOf(speedEndMarker);
  if (speedIdx1 !== -1 && speedIdx2 !== -1) {
    content = content.substring(0, speedIdx1) + newSpeedContent + content.substring(speedIdx2);
    console.log('✓ Successfully upgraded scriptPanel_speed to 50/50 Split View');
  }
}

// ============================================================
// 4. UPGRADE scriptPanel_aeo WITH 50/50 SPLIT GRID
// ============================================================
const aeoStartMarker = '<div id="scriptPanel_aeo" class="product-script-panel">';
const aeoEndMarker = '<div class="script-section-header">' + eol + '          <h3><span>🛡️</span> Stage 2: In-Line Objection Battlecards (AEO &amp; Reviews)</h3>';

const newAeoContent = `<div id="scriptPanel_aeo" class="product-script-panel">
        
        <!-- Package Strategy Banner -->
        <div style="background:linear-gradient(135deg,rgba(168,85,247,0.12),rgba(245,158,11,0.12));border:1px solid rgba(168,85,247,0.4);border-radius:12px;padding:16px 20px;margin-bottom:18px">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:gap:8px">
            <div style="font-size:14px;font-weight:800;color:#c084fc;letter-spacing:0.5px">⭐ AEO ENGINE™ &amp; GOOGLE REVIEW DOMINANCE PLAYBOOK ($297/MO + $297 SETUP)</div>
            <span style="font-size:11px;font-family:var(--font-mono);background:#c084fc;color:#000;font-weight:800;padding:3px 8px;border-radius:4px">TOP 3 MAP PACK · SIRI &amp; CHATGPT #1 ANSWER</span>
          </div>
          <p style="font-size:12.5px;color:#cbd5e1;margin:8px 0 0;line-height:1.5">
            Optimizes Google Business Profile, Apple Maps, and AI search (ChatGPT, Perplexity, Gemini) so your trade business is the #1 recommended answer for local jobs. Includes automated 1-tap SMS review generation with negative feedback shielding.
          </p>
        </div>

        <!-- Section Header -->
        <div class="script-section-header" style="margin-top:0">
          <h3><span>⭐</span> Primary Pitch: AEO Engine™ &amp; Reviews ($297/mo + $297 Setup)</h3>
          <span style="font-size:11px;font-family:var(--font-mono);background:rgba(168,85,247,0.2);color:#c084fc;padding:2px 8px;border-radius:4px;border:1px solid rgba(168,85,247,0.4)">Map Pack &amp; AI Citation Gap</span>
        </div>

        <!-- Split View Controls Fork -->
        <div class="split-view-controls" style="display:flex;align-items:center;justify-content:space-between;margin:16px 0 18px;flex-wrap:wrap;gap:10px;background:rgba(15,21,34,0.6);border:1px solid var(--line2);padding:10px 16px;border-radius:12px">
          <div style="font-size:13px;font-weight:700;color:var(--ink);display:flex;align-items:center;gap:8px">
            <span style="color:var(--accent2);font-size:16px">⚡</span>
            <span>CALL ROUTING FORK:</span>
            <span style="color:var(--dim);font-size:12px;font-weight:400">Split down the middle for instant reaction (AEO &amp; Reviews $297/mo + $297 setup)</span>
          </div>
          <div class="split-view-selector">
            <button class="split-view-btn active" type="button" onclick="setSplitView('split', this)">👁️ Split View 50/50</button>
            <button class="split-view-btn" type="button" onclick="setSplitView('owner', this)">🟢 Yes: It's The Owner</button>
            <button class="split-view-btn" type="button" onclick="setSplitView('not-owner', this)">🟡 No: Not The Owner</button>
          </div>
        </div>

        <!-- SPLIT-DOWN-THE-MIDDLE GRID -->
        <div class="script-split-grid">
          <!-- LEFT COLUMN: YES — IT'S THE OWNER -->
          <div class="script-col script-col-owner col-owner-track">
            <div class="script-col-header">
              <h4 style="color:#6ee7b7"><span>🟢</span> YES — IT'S THE OWNER</h4>
              <span class="col-badge" style="background:rgba(52,211,153,0.15);color:#6ee7b7;border:1px solid rgba(52,211,153,0.4)">Direct Decision Maker Track</span>
            </div>

            <!-- Step 1: Permission Opener -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span>Step 1: Permission Opener (0:00 - 0:08)</span><span style="color:var(--ok)">✓ 70% Win Rate</span></div>
              <div class="script-line">
                "Hey <span class="dyn-owner">[Owner's First Name]</span>, Luke from VantorX. I know you were not expecting my call — <strong>got 20 seconds or should I hang up?</strong>"
              </div>
              <div class="delivery-tip">
                💡 <em>Delivery Tip:</em> Lower your pitch, speak calmly, and STOP TALKING.
              </div>
            </div>

            <!-- Step 2: The Map Pack & AI Citation Gap Hook -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span>Step 2: Map Pack &amp; AI Citation Gap (<span class="dyn-loss">$10k-$20k/mo</span>)</span><span style="color:var(--ok)">✓ Organic Loss</span></div>
              <div class="script-line">
                "I was looking at Google Maps in <span class="dyn-city">[City]</span>. Your top competitor has 148 reviews and sits in the top 3 map pack. When homeowners ask Siri, ChatGPT, or Google for the best emergency contractor, AI recommends your competitor because of their review velocity and structured data.<br><br>
                That visibility gap is costing you an estimated <strong style="color:#fca5a5"><span class="dyn-loss">$10,000 to $20,000 a month</span></strong> in lost inbound calls. <strong>Where are you getting your review requests out right now?</strong>"
              </div>
              <div class="delivery-tip">
                💡 <em>The Golden Pause:</em> Let them admit they ask verbally or don't have an automated review system.
              </div>
            </div>

            <!-- Step 3: The AEO & Automated Reviews Solution -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span>Step 3: AEO Engine™ &amp; Review Dominance</span><span>$297/mo + $297 Setup</span></div>
              <div class="script-line">
                "That's exactly why we built the <strong>AEO Engine™ ($297/mo plus a $297 setup fee)</strong>. We optimize your Google Business Profile, publish llms.txt &amp; schema markup so Apple Intelligence and ChatGPT name you #1, and turn on automated 1-tap SMS review requests 1 hour after invoices are paid.<br><br>
                Plus, our intelligent sentiment shield routes unhappy customers to a private manager alert so only 5-star reviews reach Google. Zero contracts, cancel anytime."
              </div>
              <div class="script-savings-math-cue">
                <div style="font-size:11px;font-family:var(--font-mono);font-weight:700;color:#a7f3d0;text-transform:uppercase;margin-bottom:3px">🧮 The Savings Math to Say Next (If Asked):</div>
                <div class="dyn-script-savings-math">"And here's the math: traditional SEO agencies charge $2,000/mo on 12-month retainers for PDFs. We are $297/mo. Just ONE single organic emergency job pushed from Google Maps or Siri covers the entire service for the whole year."</div>
              </div>
            </div>

            <!-- Step 4: Book The 10-Min Live Demo Close & Time Choice -->
            <div class="script-phase" style="border-color:rgba(245,158,11,0.5);background:rgba(245,158,11,0.06);margin-bottom:0">
              <div class="phase-tag"><span style="color:var(--accent2);font-weight:800">Step 4: Book The 10-Min Live Demo Close &amp; Time Choice</span><span style="color:var(--accent)">★ Master Close</span></div>
              <div class="script-line" style="font-size:15px;line-height:1.6">
                "<strong>Let's book a quick 10-minute live demo on Zoom tomorrow.</strong> I'll share my screen and show you live queries on Siri, ChatGPT, and Google Maps showing exactly why your competitors are taking the top 3 spots in <span class="dyn-city">[City]</span> and how we flip that in 14 days.<br><br>
                Are you usually easier to catch in the morning before crews roll out, or later in the afternoon around 4:30?"
              </div>
              <div class="delivery-tip">
                💡 <em>Alternative Choice:</em> Offer morning or 4:30 PM.
              </div>
            </div>

            <!-- Step 5: Friction-Killer Line -->
            <div class="script-phase" style="border-color:rgba(56,189,248,0.4);background:rgba(56,189,248,0.04);margin-bottom:0">
              <div class="phase-tag"><span style="color:#7dd3fc;font-weight:700">Step 5: Instant Citation Audit Text</span><span style="color:#7dd3fc">Zero Risk Proof</span></div>
              <div class="script-line">
                "Tell you what: I'll run our instant AI citation check on <span class="dyn-company">[Company Name]</span> right now and text the screenshot to your cell so you can see where you stand. What's the best direct number?"
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: NO — NOT THE OWNER -->
          <div class="script-col script-col-not-owner col-not-owner-track">
            <div class="script-col-header">
              <h4 style="color:#fde047"><span>🟡</span> NO — NOT THE OWNER</h4>
              <span class="col-badge" style="background:rgba(245,158,11,0.15);color:#fde047;border:1px solid rgba(245,158,11,0.4)">Dispatcher / Gatekeeper Track</span>
            </div>

            <!-- Step 1: Casual Peer Opener -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span>Step 1: Casual Local Peer Opener</span><span>0:00 - 0:05</span></div>
              <div class="script-line" style="font-size:16px">
                "Hey, I was just wondering if the owner is around?"
              </div>
              <div class="delivery-tip">
                💡 <em>Tone:</em> Authoritative local peer contractor.
              </div>
            </div>

            <!-- Step 2: Praise The Dispatcher Reframe -->
            <div class="script-phase" style="margin-bottom:0;border-color:rgba(245,158,11,0.35);background:rgba(245,158,11,0.05)">
              <div class="phase-tag"><span style="color:var(--accent2)">Step 2: The Dispatcher Praise Reframe</span><span>When told he's out/busy</span></div>
              <div class="script-line" style="font-size:16px">
                "Oh gotcha, no problem! You're the one actually running the show and handling all the incoming customer calls."
              </div>
              <div class="delivery-tip">
                💡 <em>Elevate Front Desk:</em> Elevates them to a respected partner. Guard drops immediately.
              </div>
            </div>

            <!-- Step 3: Operational Question -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span>Step 3: Operational Dispatch Question</span><span>Expose The Review Gap</span></div>
              <div class="script-line" style="font-size:16px">
                "Quick question for you then: when homeowners in <span class="dyn-city">[City]</span> ask Siri or ChatGPT for emergency service, your top competitors get recommended first. Does <span class="dyn-owner">[Owner's First Name]</span> manage your Google reviews and online listings, or do you handle that?"
              </div>
              <div class="delivery-tip">
                💡 <em>Listen Closely:</em> Discover who is in charge of customer satisfaction and reviews.
              </div>
            </div>

            <!-- Step 4: Extract Direct Cell Phone -->
            <div class="script-phase" style="margin-bottom:0">
              <div class="phase-tag"><span style="color:#6ee7b7">Step 4: Extract Direct Cell Phone</span><span style="color:var(--ok)">Key Objective</span></div>
              <div class="script-line" style="font-size:16px">
                "Got it. We optimize local contractors for Google Maps, Siri, and ChatGPT so you take the #1 recommendation spot.<br><br>
                <strong>What's the best direct cell to text <span class="dyn-owner">[Owner's First Name]</span> a 1-page search visibility audit, or when does he usually check in with the office?</strong>"
              </div>
            </div>

            <!-- Step 5: Handling "Can I take a message?" or "Send an email" -->
            <div class="script-phase" style="margin-bottom:0;border-color:rgba(239,68,68,0.35);background:rgba(239,68,68,0.05)">
              <div class="phase-tag"><span style="color:#fca5a5">Step 5: When Asked "Can I Take a Message / Send Email?"</span><span>Bypass</span></div>
              <div class="script-line" style="font-size:14.5px;line-height:1.5">
                "Emails get buried behind dozens of messages. Let me shoot his cell a quick 1-line text with the 1-page search visibility audit so he can see the Google Maps rank gap firsthand.<br><br>
                What's his cell number so I can send that over?"
              </div>
            </div>
          </div>
        </div>

        `;

const aeoIdx1 = content.indexOf(aeoStartMarker);
const aeoIdx2 = content.indexOf(aeoEndMarker);
if (aeoIdx1 === -1 || aeoIdx2 === -1) {
  throw new Error('Could not find scriptPanel_aeo markers in index.html');
}
content = content.substring(0, aeoIdx1) + newAeoContent + content.substring(aeoIdx2);
console.log('✓ Successfully upgraded scriptPanel_aeo to 50/50 Split View');

// ============================================================
// 5. UPDATE getLeadOfferStrategy SO IT MATCHES PRODUCT ACCURATELY
// ============================================================
const getStratStartMarker = '  function getLeadOfferStrategy(lead) {';
const getStratEndMarker = '  function getProductBadgeHtml(prod) {';

const newGetStratContent = `  function getLeadOfferStrategy(lead) {
    const p = (lead.product || 'bundle').toLowerCase();

    if (p === 'basic' || p === 'essential') {
      return {
        pkgKey: 'essential',
        scriptKey: 'basic',
        pkgName: 'Basic Package: AI Front Desk ($397/mo + $497 setup)',
        pkgBadge: '<span class="badge-prod badge-pkg-essential" title="Basic AI Front Desk ($397/mo + $497 setup fee)">⚡ Basic ($397/mo)</span>',
        pkgBadgeClass: 'badge-pkg-essential',
        pkgTagline: 'Core AI Phone Receptionist & Emergency Triage',
        pkgDescription: '24/7 Ava Voice AI answering all incoming after-hours and overflow calls, qualifying emergency vs routine jobs, taking customer details, and dispatching instant SMS to owner.',
        fallbackKey: 'speed',
        fallbackName: 'LeadFlow 90s SMS ($197/mo + $197 setup)',
        fallbackPrice: '$197/mo',
        fallbackBadge: '<span class="badge-prod-sub badge-prod-sub-speed">⚡ Speed ($197/mo)</span>',
        fallbackBadgeClass: 'badge-prod-sub-speed',
        fallbackTagline: '90-Second SMS Speed-to-Lead',
        fallbackDescription: 'Automated SMS response engine that texts homeowners within 90 seconds of receiving a web form or missed call.'
      };
    } else if (p === 'scale') {
      return {
        pkgKey: 'scale',
        scriptKey: 'scale',
        pkgName: 'Scale Enterprise Tier ($1,297/mo + $1,997 setup)',
        pkgBadge: '<span class="badge-prod badge-pkg-scale" title="Scale Enterprise Tier ($1,297/mo + $1,997 setup fee)">🚀 Scale ($1,297/mo)</span>',
        pkgBadgeClass: 'badge-pkg-scale',
        pkgTagline: 'Multi-Crew Commercial Revenue Machine',
        pkgDescription: 'Multi-line & multi-location Ava Voice AI, direct 2-way CRM dispatch (ServiceTitan / Housecall Pro / Jobber), automated review generation, dedicated priority phone lines, and enterprise SLA.',
        fallbackKey: 'bundle',
        fallbackName: 'Accelerate Package ($697/mo + $997 setup)',
        fallbackPrice: '$697/mo',
        fallbackBadge: '<span class="badge-prod badge-pkg-accelerate">⭐ Accelerate ($697/mo)</span>',
        fallbackBadgeClass: 'badge-pkg-accelerate',
        fallbackTagline: 'Complete AI Front-Office Infrastructure',
        fallbackDescription: '24/7 Ava Voice AI Receptionist + 90s SMS Speed-to-Lead + Custom Mobile Website + Local AEO.'
      };
    } else if (p === 'website') {
      return {
        pkgKey: 'website',
        scriptKey: 'website',
        pkgName: 'Custom Website Design ($799 flat upfront)',
        pkgBadge: '<span class="badge-prod-sub badge-prod-sub-website" title="Custom Website Design ($799 flat upfront)">🌐 Website ($799 flat)</span>',
        pkgBadgeClass: 'badge-prod-sub-website',
        pkgTagline: 'High-Converting Contractor Website',
        pkgDescription: 'Bespoke mobile-first Webflow website engineered for sub-second load times, click-to-call buttons, emergency quote forms, and high visitor-to-phone-call conversion.',
        fallbackKey: 'aeo',
        fallbackName: 'AEO Engine™ ($297/mo + $297 setup)',
        fallbackPrice: '$297/mo',
        fallbackBadge: '<span class="badge-prod-sub badge-prod-sub-aeo">⭐ AEO ($297/mo)</span>',
        fallbackBadgeClass: 'badge-prod-sub-aeo',
        fallbackTagline: 'AI Answer Engine Optimization & Reviews',
        fallbackDescription: 'Optimizes Google Business Profile, Apple Maps, and AI search so your trade business is the #1 recommended answer.'
      };
    } else if (p === 'speed') {
      return {
        pkgKey: 'speed',
        scriptKey: 'speed',
        pkgName: 'LeadFlow 90s SMS Speed-to-Lead ($197/mo + $197 setup)',
        pkgBadge: '<span class="badge-prod-sub badge-prod-sub-speed" title="LeadFlow 90s SMS ($197/mo + $197 setup fee)">⚡ Speed ($197/mo)</span>',
        pkgBadgeClass: 'badge-prod-sub-speed',
        pkgTagline: '90-Second SMS Speed-to-Lead',
        pkgDescription: 'Automated SMS response engine that texts homeowners within 90 seconds of receiving a web form or missed call, booking the appointment before they call competitors.',
        fallbackKey: 'ava',
        fallbackName: 'Ava 24/7 AI Receptionist ($397/mo + $497 setup)',
        fallbackPrice: '$397/mo',
        fallbackBadge: '<span class="badge-prod-sub badge-prod-sub-ava">🤖 Ava ($397/mo)</span>',
        fallbackBadgeClass: 'badge-prod-sub-ava',
        fallbackTagline: '24/7 Voice AI Receptionist',
        fallbackDescription: 'Human-sounding 24/7 Voice AI receptionist answering calls in <1s 24/7/365, diagnosing emergencies, taking caller info, and dispatching SMS alerts.'
      };
    } else if (p === 'aeo') {
      return {
        pkgKey: 'aeo',
        scriptKey: 'aeo',
        pkgName: 'AEO Engine™ & Google Review Dominance ($297/mo + $297 setup)',
        pkgBadge: '<span class="badge-prod-sub badge-prod-sub-aeo" title="AEO Engine™ & Google Review Dominance ($297/mo + $297 setup)">⭐ AEO ($297/mo)</span>',
        pkgBadgeClass: 'badge-prod-sub-aeo',
        pkgTagline: 'AI Answer Engine Optimization & Reviews',
        pkgDescription: 'Optimizes Google Business Profile, Apple Maps, and AI search (ChatGPT, Perplexity, Gemini) so your trade business is the #1 recommended answer for local jobs.',
        fallbackKey: 'website',
        fallbackName: 'Custom Website Design ($799 flat)',
        fallbackPrice: '$799 flat',
        fallbackBadge: '<span class="badge-prod-sub badge-prod-sub-website">🌐 Website ($799 flat)</span>',
        fallbackBadgeClass: 'badge-prod-sub-website',
        fallbackTagline: 'High-Converting Contractor Website',
        fallbackDescription: 'Bespoke mobile-first Webflow website engineered for sub-second load times and click-to-call buttons.'
      };
    } else if (p === 'ava') {
      return {
        pkgKey: 'ava',
        scriptKey: 'ava',
        pkgName: 'Ava 24/7 Voice AI Receptionist ($397/mo + $497 setup)',
        pkgBadge: '<span class="badge-prod-sub badge-prod-sub-ava" title="Ava 24/7 Voice AI Receptionist ($397/mo + $497 setup)">🤖 Ava ($397/mo)</span>',
        pkgBadgeClass: 'badge-prod-sub-ava',
        pkgTagline: '24/7 Voice AI Receptionist',
        pkgDescription: 'Human-sounding 24/7 Voice AI receptionist answering calls in <1s 24/7/365, diagnosing emergencies, taking caller info, and dispatching SMS alerts directly to your technicians.',
        fallbackKey: 'speed',
        fallbackName: 'LeadFlow 90s SMS ($197/mo + $197 setup)',
        fallbackPrice: '$197/mo',
        fallbackBadge: '<span class="badge-prod-sub badge-prod-sub-speed">⚡ Speed ($197/mo)</span>',
        fallbackBadgeClass: 'badge-prod-sub-speed',
        fallbackTagline: '90-Second SMS Speed-to-Lead',
        fallbackDescription: 'Automated SMS response engine that texts homeowners within 90 seconds of receiving a web form or missed call.'
      };
    } else {
      // Default: bundle / accelerate
      return {
        pkgKey: 'accelerate',
        scriptKey: 'bundle',
        pkgName: 'Accelerate Growth Engine ($697/mo + $997 setup)',
        pkgBadge: '<span class="badge-prod badge-pkg-accelerate" title="Primary Package: Accelerate Tier ($697/mo + $997 setup fee)">⭐ Accelerate ($697/mo)</span>',
        pkgBadgeClass: 'badge-pkg-accelerate',
        pkgTagline: 'Complete AI Front-Office Infrastructure',
        pkgDescription: '24/7 Ava Voice AI Receptionist (<1s instant pickup, emergency triage & tech dispatch) + 90s LeadFlow SMS Speed-to-Lead web responder + Custom ultra-fast (<1s load time) mobile Webflow website + Local AEO & Google ranking setup.',
        fallbackKey: 'ava',
        fallbackName: 'Ava 24/7 AI Receptionist ($397/mo + $497 setup)',
        fallbackPrice: '$397/mo',
        fallbackBadge: '<span class="badge-prod-sub badge-prod-sub-ava">🤖 Ava ($397/mo)</span>',
        fallbackBadgeClass: 'badge-prod-sub-ava',
        fallbackTagline: '24/7 Voice AI Receptionist',
        fallbackDescription: 'Human-sounding 24/7 Voice AI receptionist answering calls in <1s 24/7/365, diagnosing emergencies, taking caller info, and dispatching SMS alerts directly to your technicians.'
      };
    }
  }

  window.getLeadOfferStrategy = getLeadOfferStrategy;
`;

const stratIdx1 = content.indexOf(getStratStartMarker);
const stratIdx2 = content.indexOf(getStratEndMarker);
if (stratIdx1 === -1 || stratIdx2 === -1) {
  throw new Error('Could not find getLeadOfferStrategy markers in index.html');
}
content = content.substring(0, stratIdx1) + newGetStratContent + content.substring(stratIdx2);
console.log('✓ Successfully updated getLeadOfferStrategy');

// ============================================================
// 6. UPDATE setSplitView CONTROLLER FOR ROBUST 50/50 SIZING
// ============================================================
const setSplitMarker = '  // Split View Controller: Split 50/50, Owner Only, Not Owner Only';
const setSplitEndMarker = '  // Product Switcher Specifications';

const newSetSplitContent = `  // Split View Controller: Split 50/50, Owner Only, Not Owner Only
  window.setSplitView = function(mode, clickedBtn) {
    const parentPanel = clickedBtn ? clickedBtn.closest('.product-script-panel') : document.querySelector('.product-script-panel.active');
    if (!parentPanel) return;

    const btns = parentPanel.querySelectorAll('.split-view-btn');
    btns.forEach(b => b.classList.remove('active'));

    if (clickedBtn) {
      clickedBtn.classList.add('active');
    } else {
      if (mode === 'owner' && btns[1]) btns[1].classList.add('active');
      else if (mode === 'not-owner' && btns[2]) btns[2].classList.add('active');
      else if (btns[0]) btns[0].classList.add('active');
    }

    const grid = parentPanel.querySelector('.script-split-grid');
    const colOwner = parentPanel.querySelector('.col-owner-track');
    const colNotOwner = parentPanel.querySelector('.col-not-owner-track');

    if (mode === 'owner') {
      if (colOwner) { colOwner.style.display = 'flex'; colOwner.style.flex = '1'; }
      if (colNotOwner) colNotOwner.style.display = 'none';
      if (grid) grid.style.gridTemplateColumns = '1fr';
    } else if (mode === 'not-owner') {
      if (colOwner) colOwner.style.display = 'none';
      if (colNotOwner) { colNotOwner.style.display = 'flex'; colNotOwner.style.flex = '1'; }
      if (grid) grid.style.gridTemplateColumns = '1fr';
    } else {
      // 50/50 Balanced Split View
      if (colOwner) {
        colOwner.style.display = 'flex';
        colOwner.style.flex = '1';
        colOwner.style.minWidth = '0';
      }
      if (colNotOwner) {
        colNotOwner.style.display = 'flex';
        colNotOwner.style.flex = '1';
        colNotOwner.style.minWidth = '0';
      }
      if (grid) {
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = window.innerWidth > 980 ? '1fr 1fr' : '1fr';
        grid.style.gap = '20px';
      }
    }
  };
`;

const splitIdx1 = content.indexOf(setSplitMarker);
const splitIdx2 = content.indexOf(setSplitEndMarker);
if (splitIdx1 === -1 || splitIdx2 === -1) {
  throw new Error('Could not find setSplitView markers in index.html');
}
content = content.substring(0, splitIdx1) + newSetSplitContent + content.substring(splitIdx2);
console.log('✓ Successfully enhanced setSplitView function');

// ============================================================
// 7. ENSURE switchProductScript AND loadLeadIntoTeleprompter ENFORCE 50/50
// ============================================================
// In switchProductScript: add setSplitView('split');
const switchTarget = "else panel.classList.remove('active');\n    });";
const switchTargetCrlf = "else panel.classList.remove('active');\r\n    });";
if (content.includes(switchTargetCrlf)) {
  content = content.replace(switchTargetCrlf, "else panel.classList.remove('active');\r\n    });\r\n    setSplitView('split');");
} else if (content.includes(switchTarget)) {
  content = content.replace(switchTarget, "else panel.classList.remove('active');\n    });\n    setSplitView('split');");
}

// In loadLeadIntoTeleprompter: ensure switchProductScript gets targetScript and setSplitView('split') runs
const loadLeadScriptSection = `    // 6. Switch to the Lead's Exact Product Script
    const p = (lead.product || '').toLowerCase();
    if (p === 'website') {
      switchProductScript('website');
    } else if (p === 'speed') {
      switchProductScript('speed');
    } else if (p === 'aeo') {
      switchProductScript('aeo');
    } else if (p === 'ava') {
      switchProductScript('ava');
    } else if (p === 'scale' || strat.pkgKey === 'scale') {
      switchProductScript('scale');
    } else if (p === 'basic' || p === 'essential' || strat.pkgKey === 'essential') {
      switchProductScript('basic');
    } else {
      switchProductScript('bundle');
    }`;

const newLoadLeadScriptSection = `    // 6. Switch to the Lead's Exact Product Script
    const p = (lead.product || 'bundle').toLowerCase();
    let targetScript = 'bundle';
    if (p === 'website') targetScript = 'website';
    else if (p === 'speed') targetScript = 'speed';
    else if (p === 'aeo') targetScript = 'aeo';
    else if (p === 'ava') targetScript = 'ava';
    else if (p === 'scale' || strat.pkgKey === 'scale') targetScript = 'scale';
    else if (p === 'basic' || p === 'essential' || strat.pkgKey === 'essential') targetScript = 'basic';
    else targetScript = 'bundle';

    switchProductScript(targetScript);
    setSplitView('split');`;

content = content.replace(loadLeadScriptSection, newLoadLeadScriptSection);

// In switchTab: when switching to tabScript, enforce 50/50 view
if (!content.includes("targetTabId === 'tabScript' && typeof window.setSplitView === 'function'")) {
  const switchTabTarget = "if ((targetTabId === 'tabLeaderboard' || targetTabId === 'tabLeads') && typeof window.renderLeaderboardUI === 'function') {";
  const newSwitchTabTarget = `if (targetTabId === 'tabScript' && typeof window.setSplitView === 'function') {
      window.setSplitView('split');
    }
    if ((targetTabId === 'tabLeaderboard' || targetTabId === 'tabLeads') && typeof window.renderLeaderboardUI === 'function') {`;
  content = content.replace(switchTabTarget, newSwitchTabTarget);
}

// In filter: make sure currentProductFilter handles both primary and fallback keys
const oldFilterCheck = `      if (currentProductFilter !== 'all') {
        const strat = getLeadOfferStrategy(lead);
        if (currentProductFilter.startsWith('pkg-')) {
          const reqPkg = currentProductFilter.replace('pkg-', '');
          if (strat.pkgKey !== reqPkg) return false;
        } else {
          if (strat.fallbackKey !== currentProductFilter) return false;
        }
      }`;

const newFilterCheck = `      if (currentProductFilter !== 'all') {
        const strat = getLeadOfferStrategy(lead);
        if (currentProductFilter.startsWith('pkg-')) {
          const reqPkg = currentProductFilter.replace('pkg-', '');
          if (strat.pkgKey !== reqPkg && strat.scriptKey !== reqPkg && lead.product !== reqPkg) return false;
        } else {
          if (strat.fallbackKey !== currentProductFilter && lead.product !== currentProductFilter && strat.scriptKey !== currentProductFilter) return false;
        }
      }`;

content = content.replace(oldFilterCheck, newFilterCheck);

// Write the updated file
fs.writeFileSync(arenaPath, content, 'utf8');
console.log('✓ Successfully wrote updated website/cold-call-arena/index.html');
