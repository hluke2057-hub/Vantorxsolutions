// scripts/upgrade_reel_creator_full.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../website/demo/reel-creator.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Upgrade the Idea Input & Presets section in Box 1
const oldBox1HeaderAndPresets = `      <!-- Quick Preset Pills -->
      <div class="idea-presets-row">
        <button type="button" class="preset-pill active" onclick="applyTradePreset('hvac')">
          <span>❄️</span> <span>HVAC Heat ($9.2k)</span>
        </button>
        <button type="button" class="preset-pill" onclick="applyTradePreset('plumbing')">
          <span>🚰</span> <span>Sewer Backup ($8.5k)</span>
        </button>
        <button type="button" class="preset-pill" onclick="applyTradePreset('roofing')">
          <span>🏠</span> <span>Roof Leak ($14k)</span>
        </button>
        <button type="button" class="preset-pill" onclick="applyTradePreset('electrical')">
          <span>⚡</span> <span>Panel Upgrade ($6k)</span>
        </button>
        <button type="button" class="preset-pill" onclick="applyTradePreset('speed')">
          <span>⏱️</span> <span>90s Speed-to-Lead</span>
        </button>
      </div>`;

const newBox1HeaderAndPresets = `      <!-- Product Mode Selector & Rotation Bar -->
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:4px">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em">Product Mode:</span>
          <span id="rotationCounterBadge" style="font-size:10.5px;padding:3px 8px;border-radius:6px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.35);color:#fbbf24;font-family:monospace">🔄 Auto-Rotate: Active (Cycles 5 Products)</span>
        </div>

        <div class="idea-presets-row" id="productSelectorRow">
          <button type="button" class="preset-pill active" id="btnProductAutoRotate" onclick="selectProductMode('auto')">
            <span>🔄</span> <span>Auto-Rotate (All 5)</span>
          </button>
          <button type="button" class="preset-pill" id="btnProductVoiceAi" onclick="selectProductMode('voice_ai')">
            <span>📞</span> <span>Ava Voice AI</span>
          </button>
          <button type="button" class="preset-pill" id="btnProductSpeed" onclick="selectProductMode('speed_to_lead')">
            <span>⏱️</span> <span>90s SMS Speed</span>
          </button>
          <button type="button" class="preset-pill" id="btnProductWeb" onclick="selectProductMode('mobile_web')">
            <span>📱</span> <span>Fast Web Funnel</span>
          </button>
          <button type="button" class="preset-pill" id="btnProductAeo" onclick="selectProductMode('aeo_search')">
            <span>🔍</span> <span>AEO AI Search</span>
          </button>
          <button type="button" class="preset-pill" id="btnProductBundle" onclick="selectProductMode('growth_bundle')">
            <span>🚀</span> <span>Growth Engine</span>
          </button>
        </div>

        <!-- Quick Idea Starters & Random Idea Trigger -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px">
          <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em">Idea Starters & Situations:</span>
          <button type="button" onclick="generateRandomContractorSituation()" style="background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.35);color:#38bdf8;font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:4px">
            <span>🎲</span> <span>Surprise Me / New Scenario</span>
          </button>
        </div>

        <div class="idea-presets-row" style="gap:6px">
          <button type="button" class="preset-pill" style="font-size:11px;padding:4px 9px" onclick="applyTradePreset('hvac')">
            <span>❄️</span> <span>HVAC Heat ($9.2k)</span>
          </button>
          <button type="button" class="preset-pill" style="font-size:11px;padding:4px 9px" onclick="applyTradePreset('plumbing')">
            <span>🚰</span> <span>Sewer Flood ($8.5k)</span>
          </button>
          <button type="button" class="preset-pill" style="font-size:11px;padding:4px 9px" onclick="applyTradePreset('roofing')">
            <span>🏠</span> <span>Roof Storm ($14k)</span>
          </button>
          <button type="button" class="preset-pill" style="font-size:11px;padding:4px 9px" onclick="applyTradePreset('electrical')">
            <span>⚡</span> <span>Panel Burn ($6k)</span>
          </button>
          <button type="button" class="preset-pill" style="font-size:11px;padding:4px 9px" onclick="clearIdeaForCustomInput()">
            <span>✏️</span> <span>Custom Freeform Idea</span>
          </button>
        </div>

        <!-- Active Product Indicator Bar -->
        <div id="activeProductIndicator" style="display:flex;align-items:center;justify-content:space-between;padding:7px 11px;background:rgba(15,23,42,0.85);border:1px solid rgba(245,158,11,0.3);border-radius:8px;font-size:11.5px;color:#cbd5e1">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:14px">🎬</span>
            <span>Current Reel Product: <strong id="currentProductLabel" style="color:#fbbf24">Ava 24/7 Voice AI Receptionist</strong></span>
          </div>
          <span id="currentProductKeywordBadge" style="background:#f59e0b;color:#070a0f;font-weight:800;font-size:10.5px;padding:2px 7px;border-radius:4px;font-family:monospace">DM: "AVA"</span>
        </div>
      </div>`;

if (content.includes(oldBox1HeaderAndPresets)) {
  content = content.replace(oldBox1HeaderAndPresets, newBox1HeaderAndPresets);
  console.log('✓ Box 1 HTML upgraded with Product Selector & Rotation Bar');
} else {
  console.warn('Could not find oldBox1HeaderAndPresets exactly, searching for alternative match...');
  const match = content.match(/<!-- Quick Preset Pills -->[\s\S]*?<\/div>\s*<\/div>/);
  if (match) {
    content = content.replace(match[0], newBox1HeaderAndPresets);
    console.log('✓ Replaced via regex match');
  } else {
    console.error('Failed to locate preset pills in Box 1 HTML');
  }
}

// 2. Upgrade the JavaScript Logic (Product Rotation, Custom Script Builder, Word Timestamps & Canvas Sync)
const jsStartTarget = 'window.TRADE_PRESETS = {';
const jsEndTarget = 'window.generateVideoFromPrompt = async function() {';

const newEngineLogic = `// =============================================================
// 🚀 VANTORX 5-PRODUCT ROTATION & DYNAMIC REEL CREATION ENGINE
// =============================================================
window.VANTORX_PRODUCTS = [
  {
    id: 'voice_ai',
    name: 'Ava 24/7 Voice AI Phone Receptionist',
    shortName: 'Ava Voice AI',
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
    name: '90-Second SMS Speed-to-Lead Auto-Responder',
    shortName: '90s SMS Speed-to-Lead',
    badge: '⏱️ 90s SMS SPEED-TO-LEAD ENGINE',
    keyword: 'SPEED',
    statNumber: '24s',
    statTitle: 'SPEED-TO-LEAD LAW',
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
    name: 'Mobile-First High-Converting Contractor Website',
    shortName: 'Mobile Fast Funnel Web',
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
    name: 'Answer Engine Optimization (AEO) & AI Search Dominance',
    shortName: 'AEO AI Search Engine',
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
    name: 'All-In-One Revenue Growth Engine',
    shortName: 'All-In-One Growth Engine',
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
window.SELECTED_PRODUCT_MODE = 'auto'; // 'auto' | 'voice_ai' | 'speed_to_lead' | 'mobile_web' | 'aeo_search' | 'growth_bundle'

// Set default active scenario
window.ACTIVE_SCENARIO = {
  productId: 'voice_ai',
  productName: 'Ava 24/7 Voice AI Phone Receptionist',
  badge: '📞 24/7 VOICE AI RECEPTIONIST',
  trade: 'HVAC',
  ticket: '$9,200',
  keyword: 'AVA',
  statValue: '0.8s',
  statTitle: 'SPEED-TO-LEAD LAW',
  statHeadline: 'ANSWERS PHONE IN 0.8 SECONDS',
  statSub: '78% of homeowners hire the first business that answers.',
  solutionTitle: 'Meet Ava: 24/7 Voice AI',
  solutionSub: 'Answers in 0.8s · Live Triage · Dispatches Tech via SMS',
  ctaText: 'COMMENT "AVA" ON THIS REEL NOW',
  demoCall: '(561) 813-8602'
};

// Trade Presets & Scenarios Library
window.TRADE_PRESETS = {
  hvac: {
    name: 'Sunday 98° Heatwave AC Failure',
    idea: 'Florida summer 98-degree heatwave. Homeowner AC compressor blows out on a Sunday afternoon. They call 3 local HVAC contractors. Two go straight to dead voicemails. Ava answers for Titan Air in 0.8 seconds, books a $9,200 full system replacement, and dispatches the lead to the technician phone in 24 seconds.',
    ticket: '$9,200',
    trade: 'HVAC',
    pain: 'Sunday 98-degree AC failure',
    keyword: 'HEAT',
    demoCall: '(561) 813-8602'
  },
  plumbing: {
    name: 'Sunday Sewer / Burst Pipe Disaster',
    idea: 'Sunday night 9:30 PM sewer backup flooding the master bathroom. Homeowner panics and calls local plumbing shops. While others send callers to voicemail, Ava answers for Apex Plumbing in 0.8 seconds, triages the emergency, books an $8,500 trenchless sewer repipe, and alerts the on-call plumber.',
    ticket: '$8,500',
    trade: 'PLUMBING',
    pain: 'Sunday night sewer line flood',
    keyword: 'FLOW',
    demoCall: '(561) 813-8602'
  },
  roofing: {
    name: 'Hurricane Storm Shingle Leak',
    idea: 'Post-tropical storm torrential rain causes roof leaks into the living room ceiling. Homeowner calls 4 roofing contractors. Ava answers instantly for Vertex Roofing, quotes emergency tarping, captures insurance details, books a $14,000 architectural shingle replacement, and closes the tab.',
    ticket: '$14,000',
    trade: 'ROOFING',
    pain: 'Hurricane roof leak & ceiling collapse',
    keyword: 'ROOF',
    demoCall: '(561) 813-8602'
  },
  electrical: {
    name: 'Solo Electrician on Scissor Lift Missing $6K Bids',
    idea: 'Solo electrical contractor is 20 feet up on a commercial scissor lift rewiring an electrical panel. His phone rings 5 times with a $6,000 EV charger and panel upgrade lead. Ava answers in 0.8s, qualifies the service entrance, and puts the job directly onto his calendar.',
    ticket: '$6,000',
    trade: 'ELECTRICAL',
    pain: 'Electrician on ladder missing high-ticket calls',
    keyword: 'POWER',
    demoCall: '(561) 813-8602'
  },
  speed: {
    name: 'The 90-Second Speed-to-Lead Stat',
    idea: '78% of homeowners hire the first contractor who picks up the phone. A beam of laser light travels 186,000 miles per second to the moon and back faster than the average contractor checks their voicemail. Ava eliminates the delay with instant 0.8-second voice AI.',
    ticket: '$8,500',
    trade: 'CONTRACTOR',
    pain: 'Losing 78% of customers to voicemail delay',
    keyword: 'AVA',
    demoCall: '(561) 813-8602'
  }
};

window.RANDOM_SCENARIOS = [
  { trade: 'HVAC', ticket: '$9,200', text: 'Sunday afternoon heatwave in Texas. Homeowner AC fan motor seizes up during a family reunion. Two local AC companies roll to voicemail. Ava answers for Precision Air in 0.8s, books a $9,200 changeout, and texts the on-call tech.' },
  { trade: 'PLUMBING', ticket: '$8,500', text: '11:00 PM mainline sewer backup in a residential home. Homeowner calls three emergency plumbers. Ava answers on the second ring, qualifies the emergency, quotes initial diagnostic dispatch, and locks down the $8,500 trenchless sewer job.' },
  { trade: 'ROOFING', ticket: '$14,500', text: 'Hailstorm damages 40 homes in a neighborhood. Homeowners flood phone lines requesting inspections. Ava answers every call simultaneously, captures address & roof age, and books $14,500 full roof replacements without dropping a single caller.' },
  { trade: 'ELECTRICAL', ticket: '$6,800', text: 'Homeowner installing a Tesla charger needs a 200-amp main electrical service panel upgrade. Submitted estimate forms to 3 electrical shops. VantorX 90-second SMS engages them in 18 seconds and secures the $6,800 job.' },
  { trade: 'COMMERCIAL HVAC', ticket: '$18,000', text: 'Restaurant walk-in cooler fails on Friday evening. Owner searches ChatGPT for emergency commercial refrigeration. VantorX AEO delivers the top listing, Ava answers instantly, and dispatches commercial tech.' },
  { trade: 'WATER RESTORATION', ticket: '$12,000', text: 'Washing machine hose ruptures flooding two floors of a luxury condo. Ava answers at 3:00 AM, instructs homeowner on main water shutoff, and books a $12,000 emergency extraction and dryout.' }
];

window.selectProductMode = function(mode) {
  window.SELECTED_PRODUCT_MODE = mode;
  document.querySelectorAll('#productSelectorRow .preset-pill').forEach(el => el.classList.remove('active'));

  const btnMap = {
    'auto': 'btnProductAutoRotate',
    'voice_ai': 'btnProductVoiceAi',
    'speed_to_lead': 'btnProductSpeed',
    'mobile_web': 'btnProductWeb',
    'aeo_search': 'btnProductAeo',
    'growth_bundle': 'btnProductBundle'
  };

  const activeBtn = document.getElementById(btnMap[mode]);
  if (activeBtn) activeBtn.classList.add('active');

  const badge = document.getElementById('rotationCounterBadge');
  if (badge) {
    if (mode === 'auto') {
      badge.textContent = \`🔄 Auto-Rotate: Active (Next: Product \${(window.PRODUCT_ROTATION_INDEX % 5) + 1} of 5)\`;
      badge.style.background = 'rgba(245,158,11,0.15)';
      badge.style.color = '#fbbf24';
    } else {
      const prod = window.VANTORX_PRODUCTS.find(p => p.id === mode);
      badge.textContent = \`🔒 Locked: \${prod ? prod.shortName : mode}\`;
      badge.style.background = 'rgba(56,189,248,0.15)';
      badge.style.color = '#38bdf8';
    }
  }

  // Update current preview
  updateActiveProductDisplay(getActiveProduct());
  generateViralPromptFromIdea();
};

function getActiveProduct() {
  if (window.SELECTED_PRODUCT_MODE === 'auto') {
    return window.VANTORX_PRODUCTS[window.PRODUCT_ROTATION_INDEX % window.VANTORX_PRODUCTS.length];
  }
  return window.VANTORX_PRODUCTS.find(p => p.id === window.SELECTED_PRODUCT_MODE) || window.VANTORX_PRODUCTS[0];
}

function updateActiveProductDisplay(prod) {
  const lbl = document.getElementById('currentProductLabel');
  if (lbl) lbl.textContent = prod.name;
  const kw = document.getElementById('currentProductKeywordBadge');
  if (kw) kw.textContent = \`DM: "\${prod.keyword}"\`;
}

window.generateRandomContractorSituation = function() {
  const rand = window.RANDOM_SCENARIOS[Math.floor(Math.random() * window.RANDOM_SCENARIOS.length)];
  const input = document.getElementById('postIdeaInput');
  if (input) input.value = rand.text;
  generateViralPromptFromIdea();
};

window.clearIdeaForCustomInput = function() {
  const input = document.getElementById('postIdeaInput');
  if (input) {
    input.value = '';
    input.focus();
    input.placeholder = 'Type ANY contractor scenario or offer here... (e.g. Commercial refrigeration dies on Friday night, homeowner calls 3 shops, Ava books $18k replacement)...';
  }
};

window.applyTradePreset = function(key) {
  const p = window.TRADE_PRESETS[key];
  if (!p) return;
  const input = document.getElementById('postIdeaInput');
  if (input) input.value = p.idea;
  generateViralPromptFromIdea();
};

// Helper: Generate Word-by-Word Timestamps for Kinetic Typography
function generateTimestampsForNarration(scriptText, totalDurationSeconds) {
  const words = scriptText.trim().split(/\\s+/).map(w => w.replace(/[^a-zA-Z0-9$%,.?!'-]/g, '')).filter(Boolean);
  if (!words.length) return [];

  const targetDuration = totalDurationSeconds || 58.5;
  const avgDurationPerWord = targetDuration / words.length;
  let currentStart = 0.05;

  return words.map((word, idx) => {
    // Add small cadence variations based on punctuation
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

// -------------------------------------------------------------
// MAIN GENERATOR: Builds dynamic prompt, voiceover, word timestamps & Instagram caption
// -------------------------------------------------------------
window.generateViralPromptFromIdea = function() {
  const input = document.getElementById('postIdeaInput');
  const idea = input ? input.value.trim() : '';

  const prod = getActiveProduct();
  updateActiveProductDisplay(prod);

  // Parse Idea for dynamic elements
  let ticket = '$8,500';
  let trade = 'CONTRACTOR';

  if (idea) {
    const ticketMatch = idea.match(/\\$[0-9,]+/);
    if (ticketMatch) ticket = ticketMatch[0];

    const lower = idea.toLowerCase();
    if (lower.includes('plumb') || lower.includes('sewer') || lower.includes('drain') || lower.includes('water heater') || lower.includes('pipe')) {
      trade = 'PLUMBING';
    } else if (lower.includes('roof') || lower.includes('shingle') || lower.includes('tarp') || lower.includes('storm')) {
      trade = 'ROOFING';
    } else if (lower.includes('electric') || lower.includes('panel') || lower.includes('wire') || lower.includes('charger') || lower.includes('breaker')) {
      trade = 'ELECTRICAL';
    } else if (lower.includes('hvac') || lower.includes('ac') || lower.includes('heat') || lower.includes('cooler') || lower.includes('air conditioning')) {
      trade = 'HVAC';
    } else if (lower.includes('restoration') || lower.includes('flood') || lower.includes('mold')) {
      trade = 'RESTORATION';
    }
  } else {
    // Fallback if textarea is blank
    ticket = '$9,200';
    trade = 'HVAC';
  }

  // Populate Active Scenario Global
  window.ACTIVE_SCENARIO = {
    productId: prod.id,
    productName: prod.name,
    badge: prod.badge,
    trade: trade,
    ticket: ticket,
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

  // Build Narration Script tailored to the Product and Idea
  const hookScript = prod.hookScript;
  const problemScript = prod.problemScript.replace('{TICKET}', ticket);
  const solutionScript = prod.solutionScript;
  const proofScript = prod.proofScript;
  const ctaScript = prod.ctaScript;

  const narrationScript = \`\${hookScript}

\${problemScript}

\${solutionScript}

\${proofScript}

\${ctaScript}\`;

  // Build 15-Scene Vertical Storyboard Prompt
  const structuredPrompt = \`[VIRAL REEL STORYBOARD PROMPT — VANTORX \${prod.shortName.toUpperCase()}]
TARGET AUDIENCE: High-Ticket \${trade} Contractors & Blue-Collar Business Owners
PRODUCT ANGLE: \${prod.name} (\${prod.badge})
CORE METRIC: \${prod.statHeadline} (\${prod.statNumber})
TICKET RESCUE: \${ticket} Average Job Loss Prevented
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

  // Build Dynamic Word Timestamps for Kinetic Typography
  const newWordTimestamps = generateTimestampsForNarration(narrationScript, 58.5);
  window.WORD_TIMESTAMPS = newWordTimestamps;

  // Build High-Converting Ready-to-Post Instagram Caption
  const instagramCaption = \`78% of homeowners hire the FIRST contractor who answers their call or texts them back. ⚡

If your shop misses an emergency \${trade.toLowerCase()} lead on a weekend, that homeowner doesn't wait for your voicemail. They immediately tap the next contractor on Google.

That single unanswered inquiry just handed an \${ticket} job straight to your competitor down the road.

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

#\${trade.toLowerCase()} #contractor #speedtolead #bluecollar #voiceai #contractorgrowth #tradesmen #servicebusiness #vantorx #\${prod.keyword.toLowerCase()}\`;

  // Update UI Elements
  const promptOutput = document.getElementById('structuredPromptOutput');
  if (promptOutput) promptOutput.value = structuredPrompt;

  const scriptPreview = document.getElementById('cleanScriptPreview');
  if (scriptPreview) scriptPreview.textContent = narrationScript;

  const igCaptionBox = document.getElementById('igCaptionText');
  if (igCaptionBox) igCaptionBox.textContent = instagramCaption;

  const wordStats = document.getElementById('promptWordStats');
  const words = narrationScript.trim().split(/\\s+/).length;
  if (wordStats) wordStats.textContent = \`\${words} words • ~59s video • Product: \${prod.shortName} • \${ticket} \${trade}\`;
};

// -------------------------------------------------------------
// BIG 1-CLICK GENERATE PROMPT & MAKE REEL
// -------------------------------------------------------------
window.generatePromptAndMakeReel = async function() {
  const btn = document.getElementById('btnGeneratePromptAndReel');
  const statusMsg = document.getElementById('reelGenStatusMsg');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>⚡</span> <span>Generating \${getActiveProduct().shortName} Reel...</span>';
  }

  // 1. Advance rotation if in Auto-Rotate mode
  if (window.SELECTED_PRODUCT_MODE === 'auto') {
    window.PRODUCT_ROTATION_INDEX = (window.PRODUCT_ROTATION_INDEX + 1) % window.VANTORX_PRODUCTS.length;
    const badge = document.getElementById('rotationCounterBadge');
    if (badge) {
      badge.textContent = \`🔄 Auto-Rotate: Active (Product \${(window.PRODUCT_ROTATION_INDEX % 5) + 1} of 5)\`;
    }
  }

  // 2. Generate Prompt, Narration, Kinetic Timestamps & Caption for Active Product
  generateViralPromptFromIdea();

  const prod = getActiveProduct();

  // 3. Update Scene Top Label in UI
  const sceneLabel = document.getElementById('currentSceneLabel');
  if (sceneLabel) {
    sceneLabel.textContent = \`Scene 1: \${prod.badge}\`;
  }

  // 4. Start making and animating the new reel in the reel spot!
  try {
    if (statusMsg) {
      statusMsg.style.display = 'flex';
      statusMsg.innerHTML = \`<span>🎬</span> <span><strong>Brand New Reel Generated for \${prod.shortName}!</strong> Playing new customized reel with live kinetic captions below...</span>\`;
    }

    // Scroll smoothly to video stage / reel spot
    const stage = document.querySelector('.video-stage');
    if (stage) {
      stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Reset and start playback of the reel
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
  } catch(e) {
    console.warn('Reel playback notice:', e);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span>⚡</span> <span>Generate Prompt &amp; Create Reel</span>';
    }
  }
};
`;

const jsStartIndex = content.indexOf(jsStartTarget);
const jsEndIndex = content.indexOf(jsEndTarget);

if (jsStartIndex !== -1 && jsEndIndex !== -1) {
  content = content.substring(0, jsStartIndex) + newEngineLogic + '\n\n' + content.substring(jsEndIndex);
  console.log('✓ Successfully replaced JavaScript engine logic with 5-Product Rotation & Dynamic Generator');
} else {
  console.error('Failed to locate JS replacement boundaries:', { jsStartIndex, jsEndIndex });
}

// 3. Make Canvas Scenes dynamically render ACTIVE_SCENARIO variables
// In Scene 1: Top Pill
content = content.replace(
  "renderTopPill('⚡ SPEED OF LIGHT: 186,000 MILES/SEC');",
  "renderTopPill((window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.badge) ? window.ACTIVE_SCENARIO.badge : '⚡ SPEED OF LIGHT: 186,000 MILES/SEC');"
);

// In Scene 5: Stat Slam
content = content.replace(
  "renderTopPill('🏆 SPEED-TO-LEAD LAW');",
  "renderTopPill((window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.statTitle) ? ('🏆 ' + window.ACTIVE_SCENARIO.statTitle) : '🏆 SPEED-TO-LEAD LAW');"
);
content = content.replace(
  "ctx.fillText('78%', 0, 30);",
  "ctx.fillText((window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.statValue) ? window.ACTIVE_SCENARIO.statValue : '78%', 0, 30);"
);
content = content.replace(
  "ctx.fillText('HIRE THE FIRST BUSINESS THAT PICKS UP', W / 2, descY + 38);",
  "ctx.fillText((window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.statHeadline) ? window.ACTIVE_SCENARIO.statHeadline : 'HIRE THE FIRST BUSINESS THAT PICKS UP', W / 2, descY + 38);"
);
content = content.replace(
  "ctx.fillText('Homeowners do NOT wait for voicemails.', W / 2, descY + 68);",
  "ctx.fillText((window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.statSub) ? window.ACTIVE_SCENARIO.statSub : 'Homeowners do NOT wait for voicemails.', W / 2, descY + 68);"
);

// In Scene 9: Solution Reveal
content = content.replace(
  "renderTopPill('⚡ MEET AVA · 0.8s VOICE AI RECEPTIONIST');",
  "renderTopPill((window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.solutionTitle) ? ('⚡ ' + window.ACTIVE_SCENARIO.solutionTitle.toUpperCase()) : '⚡ MEET AVA · 0.8s VOICE AI RECEPTIONIST');"
);

// In Scene 15: ManyChat DM & CTA Button
content = content.replace(
  "ctx.fillText('COMMENT \"AVA\" ON THIS REEL NOW', W / 2, btnY + 32);",
  "ctx.fillText((window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.ctaText) ? window.ACTIVE_SCENARIO.ctaText : 'COMMENT \"AVA\" ON THIS REEL NOW', W / 2, btnY + 32);"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Successfully wrote upgraded website/demo/reel-creator.html');
