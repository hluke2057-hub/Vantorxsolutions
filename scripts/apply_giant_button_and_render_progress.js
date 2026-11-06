// scripts/apply_giant_button_and_render_progress.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../website/demo/reel-creator.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add CSS for Giant Button & Rendering HUD Progress Overlay
const cssTarget = '/* Studio Workspace */';
const newCSS = `  /* ============================================================== */
  /* GIANT GENERATE REEL BUTTON CARD & RENDERING PROGRESS OVERLAY    */
  /* ============================================================== */
  .giant-generate-reel-card {
    position: relative;
    cursor: pointer;
    user-select: none;
    background: radial-gradient(circle at 50% 25%, rgba(245, 158, 11, 0.16) 0%, rgba(6, 9, 15, 0.98) 75%);
    border: 2px solid rgba(245, 158, 11, 0.5) !important;
    border-radius: 18px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    min-height: 460px;
    transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 15px 40px -10px rgba(0, 0, 0, 0.8), 0 0 35px -8px rgba(245, 158, 11, 0.3);
    overflow: hidden;
  }
  .giant-generate-reel-card:hover {
    transform: translateY(-4px) scale(1.012);
    border-color: #f59e0b !important;
    box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.9), 0 0 55px -4px rgba(245, 158, 11, 0.5);
    background: radial-gradient(circle at 50% 25%, rgba(245, 158, 11, 0.22) 0%, rgba(6, 9, 15, 0.98) 75%);
  }
  .giant-generate-reel-card:active {
    transform: translateY(2px) scale(0.988);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7), 0 0 25px rgba(245, 158, 11, 0.35);
  }

  .giant-btn-mind-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    background: rgba(245, 158, 11, 0.15);
    border: 1px solid rgba(245, 158, 11, 0.4);
    border-radius: 20px;
    font-size: 11px;
    font-weight: 800;
    color: #fbbf24;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
  }
  .giant-pulse-dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    box-shadow: 0 0 10px #10b981;
    animation: pulseDotAnim 1.4s infinite alternate;
  }
  @keyframes pulseDotAnim {
    0% { transform: scale(0.85); opacity: 0.7; }
    100% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 14px #10b981; }
  }

  .giant-hero-icon-wrap {
    position: relative;
    width: 86px;
    height: 86px;
    margin: 8px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .giant-hero-icon-ring {
    position: absolute;
    inset: 0;
    border: 2px dashed rgba(245, 158, 11, 0.6);
    border-radius: 50%;
    animation: rotateHeroRing 12s linear infinite;
  }
  @keyframes rotateHeroRing {
    100% { transform: rotate(360deg); }
  }
  .giant-hero-icon-glow {
    position: absolute;
    width: 60px;
    height: 60px;
    background: radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(245, 158, 11, 0) 70%);
    border-radius: 50%;
    filter: blur(10px);
  }
  .giant-hero-icon {
    font-size: 42px;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 0 16px rgba(245, 158, 11, 0.8));
    animation: bounceHeroIcon 2s ease-in-out infinite alternate;
  }
  @keyframes bounceHeroIcon {
    0% { transform: translateY(-2px) scale(0.98); }
    100% { transform: translateY(3px) scale(1.05); }
  }

  .giant-btn-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 26px;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 0.02em;
    margin: 2px 0 0;
    background: linear-gradient(180deg, #ffffff 30%, #fde68a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .giant-btn-sub {
    font-size: 12px;
    color: #94a3b8;
    margin: 4px 0 10px;
  }

  .giant-target-card {
    width: 100%;
    background: rgba(10, 15, 26, 0.85);
    border: 1px solid rgba(245, 158, 11, 0.35);
    border-radius: 12px;
    padding: 12px 14px;
    text-align: left;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  }

  .giant-stepper-row {
    display: flex;
    gap: 6px;
    width: 100%;
    justify-content: center;
    margin: 6px 0;
  }
  .giant-step-pill {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 5px 6px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 7px;
    font-size: 10px;
    font-weight: 700;
    color: #64748b;
    font-family: 'JetBrains Mono', monospace;
    transition: all 0.25s ease;
  }
  .giant-step-pill.active {
    background: rgba(245, 158, 11, 0.22);
    border-color: #f59e0b;
    color: #fbbf24;
    box-shadow: 0 0 12px rgba(245, 158, 11, 0.3);
  }

  .giant-action-bar {
    width: 100%;
    background: linear-gradient(90deg, #d97706, #f59e0b, #fbbf24);
    color: #070a0f;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14.5px;
    font-weight: 900;
    letter-spacing: 0.04em;
    padding: 13px 18px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
    margin-top: 6px;
  }

  /* Video Stage Active Rendering HUD Progress Overlay */
  .reel-render-overlay {
    position: absolute;
    inset: 0;
    z-index: 999;
    background: rgba(5, 8, 16, 0.95);
    backdrop-filter: blur(18px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    text-align: center;
    transition: opacity 0.35s ease;
  }
  .render-hud-box {
    width: 100%;
    max-width: 310px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 13px;
  }
  .render-reactor {
    position: relative;
    width: 84px;
    height: 84px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .reactor-outer-spin {
    position: absolute;
    inset: 0;
    border: 3px dashed #f59e0b;
    border-radius: 50%;
    animation: spinReactor 6s linear infinite;
  }
  @keyframes spinReactor {
    100% { transform: rotate(360deg); }
  }
  .reactor-inner-pulse {
    font-size: 38px;
    animation: pulseReactorIcon 1.2s ease-in-out infinite alternate;
  }
  @keyframes pulseReactorIcon {
    0% { transform: scale(0.9); opacity: 0.8; }
    100% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 14px #f59e0b); }
  }
  .render-hud-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 19px;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 0.03em;
    margin: 0;
  }
  .render-hud-sub {
    font-size: 12px;
    color: #94a3b8;
    margin: 0;
    line-height: 1.4;
  }
  .render-progress-track {
    width: 100%;
    height: 10px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(245, 158, 11, 0.35);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.6);
  }
  .render-progress-fill {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #f59e0b, #fbbf24, #10b981);
    border-radius: 10px;
    transition: width 0.12s linear;
    box-shadow: 0 0 16px rgba(245, 158, 11, 0.8);
  }
  .render-telemetry-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: #cbd5e1;
  }
  .render-percent {
    font-weight: 900;
    color: #fbbf24;
    font-size: 13.5px;
  }
  .render-steps-log {
    width: 100%;
    background: rgba(0, 0, 0, 0.55);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 10px 12px;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .step-log-item {
    font-size: 10.5px;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
  }
  .step-log-item.active {
    color: #fbbf24;
    font-weight: 700;
  }
  .step-log-item.done {
    color: #10b981;
    font-weight: 600;
  }

`;

content = content.replace(cssTarget, newCSS + '\n' + cssTarget);
console.log('✓ Added CSS for Giant Button & Render Progress Overlay');

// 2. Replace Box 1 HTML with the Giant Generate Reel Button Card
const box1TargetRegex = /<!-- BOX 1: IDEA INPUT & GENERATE REEL -->[\s\S]*?<!-- BOX 2: READY-TO-POST INSTAGRAM CAPTION -->/;

const newBox1HTML = `<!-- BOX 1: ENTIRE SQUARE IS A GIANT 1-CLICK GENERATE REEL BUTTON -->
    <div class="box-card box-left giant-generate-reel-card" id="btnGiantGenerateReel" onclick="generatePromptAndMakeReel()" role="button" tabindex="0">
      
      <!-- Top Brain Status Badge -->
      <div class="giant-btn-mind-badge">
        <span class="giant-pulse-dot"></span>
        <span id="giantBtnMindLabel">🧠 BUTTON MIND: CYCLING 5 PRODUCTS</span>
      </div>

      <!-- Hero Visual Centerpiece -->
      <div class="giant-hero-icon-wrap">
        <div class="giant-hero-icon-ring"></div>
        <div class="giant-hero-icon-glow"></div>
        <span class="giant-hero-icon" id="giantHeroEmoji">⚡</span>
      </div>

      <!-- Main Headline & Subtitle -->
      <div>
        <h2 class="giant-btn-title">GENERATE NEW REEL</h2>
        <p class="giant-btn-sub">Click anywhere to create &amp; render the next animated video</p>
      </div>

      <!-- Next Target in Mind Card -->
      <div class="giant-target-card">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:10px;color:#94a3b8;font-weight:800;letter-spacing:0.06em;text-transform:uppercase">Next Up in Mind:</span>
          <span id="giantTargetLapBadge" style="font-size:10px;background:rgba(245,158,11,0.2);color:#fbbf24;padding:2px 6px;border-radius:4px;font-family:monospace">Product 1 of 5</span>
        </div>
        <div id="giantNextProductTitle" style="font-size:14.5px;font-weight:800;color:#fbbf24;margin-top:3px">📞 Ava 24/7 Voice AI Phone Receptionist</div>
        <div id="giantNextProductScenario" style="font-size:11px;color:#cbd5e1;margin-top:3px;line-height:1.4">Sunday 98° Heatwave AC Emergency · $9,200 System Save</div>
      </div>

      <!-- 5-Product Mind Stepper Dots -->
      <div class="giant-stepper-row" id="productMindStepper">
        <div class="giant-step-pill active" id="stepPill0"><span>1</span> Ava</div>
        <div class="giant-step-pill" id="stepPill1"><span>2</span> 90s SMS</div>
        <div class="giant-step-pill" id="stepPill2"><span>3</span> Web</div>
        <div class="giant-step-pill" id="stepPill3"><span>4</span> AEO</div>
        <div class="giant-step-pill" id="stepPill4"><span>5</span> Engine</div>
      </div>

      <!-- Big Action Bar -->
      <div class="giant-action-bar">
        <span>⚡</span> <span>CLICK TO GENERATE &amp; RENDER REEL NOW</span>
      </div>

      <!-- Hidden elements for backward-compatibility with downstream functions -->
      <div style="display:none">
        <textarea id="postIdeaInput"></textarea>
        <textarea id="structuredPromptOutput"></textarea>
        <div id="cleanScriptPreview"></div>
        <button id="btnGeneratePromptAndReel"></button>
        <div id="reelGenStatusMsg"></div>
      </div>

    </div>

    <!-- BOX 2: READY-TO-POST INSTAGRAM CAPTION -->`;

content = content.replace(box1TargetRegex, newBox1HTML);
console.log('✓ Replaced Box 1 with Giant 1-Click Generate Reel Button');

// 3. Inject the Active Rendering Progress Overlay inside .video-stage
const videoStageTarget = '<div class="video-stage">';
const renderingOverlayHTML = `<div class="video-stage">
    <!-- 🚀 ACTIVE RENDERING ENGINE PROGRESS OVERLAY -->
    <div id="reelRenderingOverlay" class="reel-render-overlay" style="display:none">
      <div class="render-hud-box">
        <!-- Spinning Hex Reactor -->
        <div class="render-reactor">
          <div class="reactor-outer-spin"></div>
          <div class="reactor-inner-pulse" id="reactorEmoji">🎬</div>
        </div>

        <!-- Status Title & Subtitle -->
        <div>
          <h3 id="renderStatusTitle" class="render-hud-title">CREATING NEW VIRAL REEL</h3>
          <p id="renderStatusSubtitle" class="render-hud-sub">Synthesizing Product Storyboard &amp; Aligning Timeline...</p>
        </div>

        <!-- The Animated Progress Bar -->
        <div class="render-progress-track">
          <div id="renderProgressBar" class="render-progress-fill" style="width: 0%"></div>
        </div>

        <!-- Percentage & Speed Telemetry -->
        <div class="render-telemetry-row">
          <span id="renderPercentText" class="render-percent">0%</span>
          <span class="render-fps" style="color:#94a3b8">60 FPS · 1080×1920 HD</span>
        </div>

        <!-- 5-Step Live Telemetry Log -->
        <div class="render-steps-log" id="renderStepsLog">
          <div class="step-log-item active" id="renderStep1">🧠 Step 1: Synthesizing script &amp; high-converting hook...</div>
          <div class="step-log-item" id="renderStep2">🎙️ Step 2: Calibrating voiceover &amp; millisecond timestamps...</div>
          <div class="step-log-item" id="renderStep3">🎬 Step 3: Rendering 15 motion scenes &amp; 3D warp FX...</div>
          <div class="step-log-item" id="renderStep4">⚡ Step 4: Baking Hormozi kinetic typography &amp; captions...</div>
          <div class="step-log-item" id="renderStep5">✨ Step 5: Finalizing 9:16 master reel &amp; audio sync...</div>
        </div>
      </div>
    </div>`;

content = content.replace(videoStageTarget, renderingOverlayHTML);
console.log('✓ Injected Active Rendering Progress Overlay inside .video-stage');

// 4. Upgrade the Engine Logic (5-Product Mind Queue + Progress Bar Runner + Auto-Play)
const jsStartTarget = '// =============================================================\n// 🚀 VANTORX 5-PRODUCT ROTATION & DYNAMIC REEL CREATION ENGINE';
const jsEndTarget = 'window.generateVideoFromPrompt = async function() {';

const newEngineLogic = `// =============================================================
// 🚀 VANTORX 5-PRODUCT BRAIN QUEUE & ACTIVE RENDER PROGRESS ENGINE
// =============================================================
window.PRODUCTS_MIND_QUEUE = [
  {
    id: 'voice_ai',
    stepIndex: 0,
    emoji: '📞',
    name: 'Ava 24/7 Voice AI Phone Receptionist',
    shortName: 'Ava Voice AI',
    trade: 'HVAC',
    ticket: '$9,200',
    scenarioHeadline: 'Sunday 98° Heatwave AC Failure · $9,200 System Save',
    scenarioDesc: 'Homeowner calls 3 HVAC shops on Sunday afternoon. Two go to dead voicemails. Ava answers in 0.8s, qualifies emergency & dispatches tech via SMS.',
    badge: '📞 24/7 VOICE AI RECEPTIONIST',
    keyword: 'AVA',
    statNumber: '0.8s',
    statTitle: 'SPEED-TO-LEAD LAW',
    statHeadline: 'ANSWERS PHONE IN 0.8 SECONDS',
    statSub: '78% of homeowners hire the first business that answers.',
    solutionTitle: 'Meet Ava: 24/7 Voice AI',
    solutionSub: 'Answers in 0.8s · Live Triage · Dispatches Tech via SMS',
    ctaText: 'COMMENT "AVA" ON THIS REEL NOW',
    hookScript: 'A single beam of laser light travels at 186,000 miles per second. It can reach the moon in under three seconds, and cross nearly two billion miles of deep space in less than three hours. Yet that interplanetary space trip is STILL faster than the average contractor calls back an emergency lead.',
    problemScript: '78% of homeowners hire the first business that answers the phone. When you are on a ladder, under a sink, or eating dinner with your family, every single unanswered call is an {TICKET} job handed straight to your competitor.',
    solutionScript: 'That is why we built Ava. She answers your shop phone in zero-point-eight seconds, qualifies the caller, checks your schedule, and dispatches the job to your technician phone before the customer can even open another Google tab.',
    proofScript: 'Stop bleeding thousands on dead voicemails. Instant speed-to-lead captures high-ticket jobs while your competitors are still listening to answering machines.',
    ctaScript: 'Call the demo number on your screen right now at (561) 813-8602 to hear Ava answer live, or comment "AVA" below and we will DM you the free interactive link.'
  },
  {
    id: 'speed_to_lead',
    stepIndex: 1,
    emoji: '⏱️',
    name: '90-Second SMS Speed-to-Lead Auto-Responder',
    shortName: '90s SMS Speed-to-Lead',
    trade: 'ROOFING',
    ticket: '$14,000',
    scenarioHeadline: 'Post-Storm Emergency Roof Leak · $14,000 Shingle Replacement',
    scenarioDesc: 'Torrential rain leaks through living room ceiling. In 24 seconds, instant automated two-way SMS engages homeowner & locks the inspection.',
    badge: '⏱️ 90s SMS SPEED-TO-LEAD ENGINE',
    keyword: 'SPEED',
    statNumber: '24s',
    statTitle: 'THE SPEED-TO-LEAD RULE',
    statHeadline: 'INSTANT TWO-WAY SMS IN 24 SECONDS',
    statSub: 'Leads contacted within 90 seconds are 391% more likely to close.',
    solutionTitle: 'VantorX 90s SMS Speed Engine',
    solutionSub: 'Instant 24s Two-Way SMS · Zero Lead Left Behind · Auto Calendar',
    ctaText: 'COMMENT "SPEED" ON THIS REEL NOW',
    hookScript: 'If your business takes 30 minutes to call back a homeowner who filled out an online estimate form, you already lost the job. 82% of homeowners submit quote requests to three contractors at once, and the first one to text wins the contract.',
    problemScript: 'While you are running jobs in the field, online estimate requests sit unnoticed in an email inbox for hours. By the time you call back, the customer already signed an {TICKET} agreement with your competitor.',
    solutionScript: 'The VantorX 90-Second Speed Engine engages online leads instantly via two-way SMS in under 24 seconds. It qualifies the project scope, captures job photos, and locks in the on-site estimate slot before your competitor even opens their email.',
    proofScript: 'Speed to lead is the highest ROI leverage in the trade industry. Turning a 3-hour callback into a 24-second text triples your booked jobs overnight.',
    ctaScript: 'Test the speed yourself right now: dial (561) 813-8602 or comment "SPEED" below and our automated engine will text your phone the live speed-to-lead audit.'
  },
  {
    id: 'mobile_web',
    stepIndex: 2,
    emoji: '📱',
    name: 'Mobile-First High-Converting Contractor Website',
    shortName: 'Mobile Fast Funnel Web',
    trade: 'PLUMBING',
    ticket: '$8,500',
    scenarioHeadline: 'Sunday Night Sewer Disaster · $8,500 Trenchless Repipe',
    scenarioDesc: 'Homeowner searches plumbing on smartphone. Competitor sites load in 6s and bounce. VantorX site loads in 0.4s with 1-tap emergency booking funnel.',
    badge: '📱 0.4s FAST MOBILE FUNNEL WEBSITE',
    keyword: 'WEB',
    statNumber: '0.4s',
    statTitle: 'MOBILE CONVERSION LAW',
    statHeadline: 'SUB-SECOND 0.4s PAGE LOAD SPEED',
    statSub: '84% of emergency trade searches happen on smartphones.',
    solutionTitle: 'VantorX High-Converting Mobile Funnel',
    solutionSub: 'Sub-0.5s Load Time · 1-Tap Emergency Call · 4.2x Conversion',
    ctaText: 'COMMENT "WEB" ON THIS REEL NOW',
    hookScript: 'Most contractor websites load like it is 2008. If a homeowner has a pipe bursting or an AC unit smoking in 98-degree heat, and your website takes four seconds to load on their phone, more than half of them tap the back button immediately.',
    problemScript: 'You are spending thousands on Google Ads or truck wraps, but sending traffic to a clunky, slow website where buttons do not click and contact forms do not work on mobile. That is costing you {TICKET} jobs every single week.',
    solutionScript: 'VantorX builds mobile-first contractor funnels that load in 0.4 seconds. Built with 1-tap emergency dispatch buttons, transparent pricing calculators, and instant quote submission that converts mobile visitors into booked revenue at four times the industry average.',
    proofScript: 'When your site loads instantly and makes booking effortless, homeowners stop searching. You dominate your local market while other shops wonder why their ads are not converting.',
    ctaScript: 'Want to see how your current website scores on mobile speed? Call our team at (561) 813-8602 or comment "WEB" below for a free mobile conversion teardown.'
  },
  {
    id: 'aeo_search',
    stepIndex: 3,
    emoji: '🔍',
    name: 'Answer Engine Optimization (AEO) & AI Search Dominance',
    shortName: 'AEO AI Search Engine',
    trade: 'ELECTRICAL',
    ticket: '$6,800',
    scenarioHeadline: 'Homeowner Asks ChatGPT for 200A Panel Upgrade · Recommended #1',
    scenarioDesc: 'High-income homeowner asks AI assistant for top electrical contractor in their city. VantorX AEO schema feeds ChatGPT the #1 authority recommendation.',
    badge: '🔍 AEO · #1 ON CHATGPT & GOOGLE MAPS',
    keyword: 'RANK',
    statNumber: '#1',
    statTitle: 'THE AI SEARCH REVOLUTION',
    statHeadline: 'RECOMMENDED FIRST ON CHATGPT & PERPLEXITY',
    statSub: 'Homeowners now ask AI: Who is the best contractor near me?',
    solutionTitle: 'VantorX AEO Dominance Engine',
    solutionSub: 'Structured Schema · AI Engine Citations · Local 3-Pack Dominance',
    ctaText: 'COMMENT "RANK" ON THIS REEL NOW',
    hookScript: 'Google SEO is changing forever. Millions of high-income homeowners are no longer scrolling through ten blue links. They are opening ChatGPT, Apple Intelligence, and Perplexity and asking: who is the highest rated emergency contractor near me right now?',
    problemScript: 'Traditional SEO agencies build slow blogs that nobody reads. If your business is not structured for Answer Engine Optimization, AI assistants will recommend your competitor and leave your shop completely invisible for {TICKET} installations.',
    solutionScript: 'The VantorX AEO Engine injects machine-readable schema, verified entity citations, and real-time review signals that force ChatGPT, Perplexity, and Google Maps to recommend your business as the number-one authority in your service territory.',
    proofScript: 'Be the first contractor recommended when homeowners ask conversational AI for help. Early adopters of AEO are locking down the highest ticket commercial and residential jobs before anyone else catches on.',
    ctaScript: 'Check if your company shows up on ChatGPT right now. Call our direct line at (561) 813-8602 or comment "RANK" below and we will send you a personalized AEO territory scan.'
  },
  {
    id: 'growth_bundle',
    stepIndex: 4,
    emoji: '🚀',
    name: 'All-In-One Revenue Growth Engine',
    shortName: 'All-In-One Growth Engine',
    trade: 'CONTRACTOR',
    ticket: '$18,500',
    scenarioHeadline: 'Full 4-Pillar Stack Replaces 4 Fragmented Tools · $18k/Mo Added',
    scenarioDesc: 'Unifies 24/7 Voice AI, 90s SMS Speed-to-Lead, 0.4s Fast Mobile Funnel, and AEO AI Search into one automated lead-capturing revenue machine.',
    badge: '🚀 COMPLETE CONTRACTOR REVENUE ENGINE',
    keyword: 'GROWTH',
    statNumber: '4X',
    statTitle: 'FULL STACK REVENUE ACCELERATION',
    statHeadline: 'VOICE AI + SMS + MOBILE WEB + AEO UNIFIED',
    statSub: 'Zero leak architecture: captures every single phone, form, and search lead.',
    solutionTitle: 'VantorX Complete Growth Engine',
    solutionSub: 'Ava Voice AI + 90s SMS + Sub-0.5s Web + AEO Bundled',
    ctaText: 'COMMENT "GROWTH" ON THIS REEL NOW',
    hookScript: 'Why are blue-collar business owners paying four different software companies for tools that do not talk to each other? You have an answering service dropping calls, a slow website losing visitors, and uncontacted web forms rotting in an inbox.',
    problemScript: 'A single cracked water line, dead AC compressor, or storm-damaged roof is worth {TICKET}. When your tech stack is fragmented, you bleed over one hundred thousand dollars a year in preventable missed opportunities.',
    solutionScript: 'The VantorX Growth Engine unites all four pillars: Ava 24/7 Voice AI answering in 0.8s, automated 90-second two-way SMS, a sub-second mobile funnel, and AEO AI search dominance. It turns your business into an automated lead-capturing machine that runs 24 hours a day, 365 days a year.',
    proofScript: 'Contractors using the full VantorX engine consistently add twenty to fifty thousand dollars in monthly booked revenue without spending an extra dime on paid advertising.',
    ctaScript: 'Experience the full engine live: call (561) 813-8602 right now to test Ava on your own phone, or comment "GROWTH" below and our team will send you the interactive blueprint.'
  }
];

window.PRODUCT_ROTATION_INDEX = 0;
window.IS_RENDERING_REEL = false;

// Initialize with First Product
window.ACTIVE_SCENARIO = {
  productId: window.PRODUCTS_MIND_QUEUE[0].id,
  productName: window.PRODUCTS_MIND_QUEUE[0].name,
  badge: window.PRODUCTS_MIND_QUEUE[0].badge,
  trade: window.PRODUCTS_MIND_QUEUE[0].trade,
  ticket: window.PRODUCTS_MIND_QUEUE[0].ticket,
  keyword: window.PRODUCTS_MIND_QUEUE[0].keyword,
  statValue: window.PRODUCTS_MIND_QUEUE[0].statNumber,
  statTitle: window.PRODUCTS_MIND_QUEUE[0].statTitle,
  statHeadline: window.PRODUCTS_MIND_QUEUE[0].statHeadline,
  statSub: window.PRODUCTS_MIND_QUEUE[0].statSub,
  solutionTitle: window.PRODUCTS_MIND_QUEUE[0].solutionTitle,
  solutionSub: window.PRODUCTS_MIND_QUEUE[0].solutionSub,
  ctaText: window.PRODUCTS_MIND_QUEUE[0].ctaText,
  demoCall: '(561) 813-8602'
};

// Update Giant Button UI to reflect which product is up next in mind
function updateGiantButtonMindState(prod, nextProd) {
  const titleEl = document.getElementById('giantNextProductTitle');
  if (titleEl) titleEl.textContent = \`\${prod.emoji} \${prod.name}\`;

  const scenEl = document.getElementById('giantNextProductScenario');
  if (scenEl) scenEl.textContent = prod.scenarioHeadline;

  const emojiEl = document.getElementById('giantHeroEmoji');
  if (emojiEl) emojiEl.textContent = prod.emoji;

  const lapEl = document.getElementById('giantTargetLapBadge');
  if (lapEl) {
    const lapNum = Math.floor(window.PRODUCT_ROTATION_INDEX / 5) + 1;
    lapEl.textContent = \`Product \${prod.stepIndex + 1} of 5 (Lap \${lapNum})\`;
  }

  // Update Stepper Dots
  for (let i = 0; i < 5; i++) {
    const pill = document.getElementById('stepPill' + i);
    if (pill) {
      if (i === prod.stepIndex) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    }
  }
}

// Generate Word Timestamps from script
function generateTimestampsForNarration(scriptText, totalDurationSeconds) {
  const words = scriptText.trim().split(/\\s+/).map(w => w.replace(/[^a-zA-Z0-9$%,.?!'-]/g, '')).filter(Boolean);
  if (!words.length) return [];

  const targetDuration = totalDurationSeconds || 58.5;
  const avgDurationPerWord = targetDuration / words.length;
  let currentStart = 0.05;

  return words.map((word) => {
    let wDuration = avgDurationPerWord;
    if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) {
      wDuration *= 1.45;
    } else if (word.endsWith(',')) {
      wDuration *= 1.25;
    }

    const start = parseFloat(currentStart.toFixed(3));
    const end = parseFloat((currentStart + wDuration).toFixed(3));
    currentStart += wDuration;

    return {
      word: word,
      start: start,
      end: end,
      duration: parseFloat((end - start).toFixed(3))
    };
  });
}

// Core Build Function for Active Product
function buildReelAssetsForProduct(prod) {
  window.ACTIVE_SCENARIO = {
    productId: prod.id,
    productName: prod.name,
    badge: prod.badge,
    trade: prod.trade,
    ticket: prod.ticket,
    keyword: prod.keyword,
    statValue: prod.statNumber,
    statTitle: prod.statTitle,
    statHeadline: prod.statHeadline,
    statSub: prod.statSub,
    solutionTitle: prod.solutionTitle,
    solutionSub: prod.solutionSub,
    ctaText: prod.ctaText,
    demoCall: '(561) 813-8602'
  };

  const hookScript = prod.hookScript;
  const problemScript = prod.problemScript.replace('{TICKET}', prod.ticket);
  const solutionScript = prod.solutionScript;
  const proofScript = prod.proofScript;
  const ctaScript = prod.ctaScript;

  const narrationScript = \`\${hookScript}

\${problemScript}

\${solutionScript}

\${proofScript}

\${ctaScript}\`;

  const structuredPrompt = \`[VIRAL REEL STORYBOARD PROMPT — VANTORX \${prod.shortName.toUpperCase()}]
TARGET AUDIENCE: High-Ticket \${prod.trade} Contractors & Blue-Collar Business Owners
PRODUCT ANGLE: \${prod.name} (\${prod.badge})
CORE METRIC: \${prod.statHeadline} (\${prod.statNumber})
TICKET RESCUE: \${prod.ticket} Average Job Loss Prevented
CTA TRIGGER: Comment "\${prod.keyword}" or Call (561) 813-8602

1. [HOOK (0:00 - 0:08)]:
"\${hookScript}"

2. [PROBLEM & REVENUE BLEED (0:08 - 0:22)]:
"\${problemScript}"

3. [\${prod.shortName.toUpperCase()} REVEAL & MECHANISM (0:22 - 0:40)]:
"\${solutionScript}"

4. [PROOF & MULTIPLIER (0:40 - 0:50)]:
"\${proofScript}"

5. [DIRECT RESPONSE CALL TO ACTION (0:50 - 0:59)]:
"\${ctaScript}"\`;

  // Dynamic Word Timestamps
  window.WORD_TIMESTAMPS = generateTimestampsForNarration(narrationScript, 58.5);

  // Box 2 Instagram Caption
  const instagramCaption = \`78% of homeowners hire the FIRST contractor who answers their call or texts them back. ⚡

If your shop misses an emergency \${prod.trade.toLowerCase()} lead on a weekend, that homeowner doesn't wait for your voicemail. They immediately tap the next contractor on Google.

That single unanswered inquiry just handed an \${prod.ticket} job straight to your competitor down the road.

❌ The Old Way:
• Calls rolling into a voicemail graveyard while you are on a ladder
• Online quote requests sitting in an email inbox for 4 hours
• Slow mobile website losing 60% of smartphone visitors before it even loads

⚡ The VantorX Way with \${prod.shortName}:
• \${prod.solutionSub.split('·')[0].trim()}
• \${prod.solutionSub.split('·')[1] ? prod.solutionSub.split('·')[1].trim() : 'Instant Lead Qualification & Photos'}
• \${prod.solutionSub.split('·')[2] ? prod.solutionSub.split('·')[2].trim() : 'Tech SMS Dispatch in under 24s'}
• Closes high-ticket jobs before your competitors even know a lead came in

📞 TEST OUR LIVE FLORIDA DEMO RIGHT NOW:
Call our interactive contractor line: (561) 813-8602

💬 Want the interactive demo link sent straight to your Instagram DMs?
Comment "\${prod.keyword}" below and our automated engine will message you privately in 2 seconds! 🚀

#\${prod.trade.toLowerCase()} #contractor #speedtolead #bluecollar #voiceai #contractorgrowth #tradesmen #servicebusiness #vantorx #\${prod.keyword.toLowerCase()}\`;

  // Update DOM elements
  const igCaptionBox = document.getElementById('igCaptionText');
  if (igCaptionBox) igCaptionBox.textContent = instagramCaption;

  const scriptPreview = document.getElementById('cleanScriptPreview');
  if (scriptPreview) scriptPreview.textContent = narrationScript;

  const promptOutput = document.getElementById('structuredPromptOutput');
  if (promptOutput) promptOutput.value = structuredPrompt;
}

// -------------------------------------------------------------
// PROGRESS BAR ANIMATOR & ENGINE CONTROLLER
// -------------------------------------------------------------
function animateRenderProgressBar(durationMs, onProgress, onComplete) {
  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / durationMs);
    const percent = Math.floor(progress * 100);

    onProgress(percent);

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      onComplete();
    }
  }

  requestAnimationFrame(frame);
}

// -------------------------------------------------------------
// BIG 1-CLICK GENERATE REEL HANDLER: Scrolls down & runs progress bar!
// -------------------------------------------------------------
window.generatePromptAndMakeReel = async function() {
  if (window.IS_RENDERING_REEL) return;
  window.IS_RENDERING_REEL = true;

  // 1. Get current product from Mind Queue
  const currentProd = window.PRODUCTS_MIND_QUEUE[window.PRODUCT_ROTATION_INDEX % window.PRODUCTS_MIND_QUEUE.length];

  // 2. Advance rotation index for the NEXT click
  window.PRODUCT_ROTATION_INDEX++;
  const nextProd = window.PRODUCTS_MIND_QUEUE[window.PRODUCT_ROTATION_INDEX % window.PRODUCTS_MIND_QUEUE.length];

  // 3. Update Giant Button UI to show next target
  updateGiantButtonMindState(nextProd);

  // 4. Smoothly scroll down to the video stage so the user sees the creation
  const stage = document.querySelector('.video-stage');
  if (stage) {
    stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // 5. Activate the Rendering HUD Progress Overlay over the canvas
  const overlay = document.getElementById('reelRenderingOverlay');
  const progressBar = document.getElementById('renderProgressBar');
  const percentText = document.getElementById('renderPercentText');
  const titleEl = document.getElementById('renderStatusTitle');
  const subEl = document.getElementById('renderStatusSubtitle');
  const reactorEmoji = document.getElementById('reactorEmoji');

  if (overlay) {
    overlay.style.display = 'flex';
    overlay.style.opacity = '1';
  }

  if (titleEl) titleEl.textContent = \`CREATING: \${currentProd.shortName.toUpperCase()}\`;
  if (subEl) subEl.textContent = \`Rendering \${currentProd.trade} High-Ticket Storyboard (\${currentProd.ticket})...\`;
  if (reactorEmoji) reactorEmoji.textContent = currentProd.emoji;

  // Reset steps log
  const stepItems = [
    document.getElementById('renderStep1'),
    document.getElementById('renderStep2'),
    document.getElementById('renderStep3'),
    document.getElementById('renderStep4'),
    document.getElementById('renderStep5')
  ];

  stepItems.forEach((item, idx) => {
    if (item) {
      item.className = 'step-log-item' + (idx === 0 ? ' active' : '');
    }
  });

  // 6. Build the dynamic assets (script, captions, timestamps, scene config)
  buildReelAssetsForProduct(currentProd);

  // Update Scene Top Label in UI
  const sceneLabel = document.getElementById('currentSceneLabel');
  if (sceneLabel) {
    sceneLabel.textContent = \`Scene 1: \${currentProd.badge}\`;
  }

  // 7. Run animated progress bar over 2.6 seconds
  animateRenderProgressBar(
    2600,
    (percent) => {
      if (progressBar) progressBar.style.width = percent + '%';
      if (percentText) percentText.textContent = percent + '%';

      // Step telemetry triggers
      if (percent >= 20 && stepItems[0] && stepItems[1]) {
        stepItems[0].className = 'step-log-item done';
        stepItems[1].className = 'step-log-item active';
      }
      if (percent >= 45 && stepItems[1] && stepItems[2]) {
        stepItems[1].className = 'step-log-item done';
        stepItems[2].className = 'step-log-item active';
      }
      if (percent >= 70 && stepItems[2] && stepItems[3]) {
        stepItems[2].className = 'step-log-item done';
        stepItems[3].className = 'step-log-item active';
      }
      if (percent >= 90 && stepItems[3] && stepItems[4]) {
        stepItems[3].className = 'step-log-item done';
        stepItems[4].className = 'step-log-item active';
      }
    },
    () => {
      // 100% Complete!
      if (stepItems[4]) stepItems[4].className = 'step-log-item done';
      if (percentText) {
        percentText.textContent = '100% READY!';
        percentText.style.color = '#10b981';
      }
      if (titleEl) titleEl.textContent = '✨ REEL RENDERED & READY!';

      // Smooth fade out and launch playback of brand new reel
      setTimeout(() => {
        if (overlay) {
          overlay.style.opacity = '0';
          setTimeout(() => {
            overlay.style.display = 'none';
          }, 350);
        }

        // Reset and launch the new reel animation from 0.0s!
        currentTime = 0;
        resetSfxFlags();
        if (!isPlaying) {
          togglePlay();
        } else {
          if (uploadedAudioElement) {
            uploadedAudioElement.currentTime = 0;
          }
          playStartTime = performance.now();
        }

        window.IS_RENDERING_REEL = false;
      }, 450);
    }
  );
};

// Initialize Box 2 and Mind State on load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    buildReelAssetsForProduct(window.PRODUCTS_MIND_QUEUE[0]);
  });
}
`;

const jsStartIndex = content.indexOf(jsStartTarget);
const jsEndIndex = content.indexOf(jsEndTarget);

if (jsStartIndex !== -1 && jsEndIndex !== -1) {
  content = content.substring(0, jsStartIndex) + newEngineLogic + '\n\n' + content.substring(jsEndIndex);
  console.log('✓ Successfully spliced Brain Queue & Rendering HUD Progress Engine');
} else {
  console.error('Failed to locate JS replacement boundaries:', { jsStartIndex, jsEndIndex });
  process.exit(1);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Successfully written upgraded website/demo/reel-creator.html');
