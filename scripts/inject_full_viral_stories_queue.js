// scripts/inject_full_viral_stories_queue.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../website/demo/reel-creator.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Target the PRODUCTS_MIND_QUEUE and buildReelAssetsForProduct section
const queueStartTarget = 'window.PRODUCTS_MIND_QUEUE = [';
const queueEndTarget = 'function animateRenderProgressBar(durationMs, onProgress, onComplete) {';

const queueStartIndex = content.indexOf(queueStartTarget);
const queueEndIndex = content.indexOf(queueEndTarget);

if (queueStartIndex === -1 || queueEndIndex === -1) {
  console.error('Failed to locate queue boundaries', { queueStartIndex, queueEndIndex });
  process.exit(1);
}

const newQueueLogic = `window.PRODUCTS_MIND_QUEUE = [
  // --- LAP 1: THE FIRST 5 UNIQUE STORIES & PRODUCTS ---
  {
    id: 'voice_ai_cosmic',
    stepIndex: 0,
    emoji: '⚡',
    storyType: 'cosmic_light',
    storyTitle: 'Speed of Light & 2B Miles to Saturn',
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
    contrastLine1: 'AN INTERPLANETARY SPACE TRIP',
    contrastLine2: 'IS FASTER THAN A CONTRACTOR VOICEMAIL',
    hookScript: 'A single beam of laser light travels at 186,000 miles per second. It can reach the moon in under three seconds, and cross nearly two billion miles of deep space to Saturn in less than three hours. Yet that interplanetary space trip is STILL faster than the average contractor calls back an emergency lead.',
    problemScript: '78% of homeowners hire the first business that answers the phone. When you are on a ladder, under a sink, or eating dinner with your family, every single unanswered call is an {TICKET} job handed straight to your competitor.',
    solutionScript: 'That is why we built Ava. She answers your shop phone in zero-point-eight seconds, qualifies the caller, checks your schedule, and dispatches the job to your technician phone before the customer can even open another Google tab.',
    proofScript: 'Stop bleeding thousands on dead voicemails. Instant speed-to-lead captures high-ticket jobs while your competitors are still listening to answering machines.',
    ctaScript: 'Call the demo number on your screen right now at (561) 813-8602 to hear Ava answer live, or comment "AVA" below and we will DM you the free interactive link.'
  },
  {
    id: 'speed_to_lead_falcon',
    stepIndex: 1,
    emoji: '🦅',
    storyType: 'falcon_dive',
    storyTitle: 'Peregrine Falcon: 242 MPH & 15ms Reflex',
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
    contrastLine1: 'A FALCON DIVES AT 242 MILES PER HOUR',
    contrastLine2: 'WITH FASTER REFLEXES THAN A CONTRACTOR REPLYING TO LEADS',
    hookScript: 'The Peregrine Falcon is the fastest living creature on Earth. When diving for prey, it reaches an astonishing 242 miles per hour, and its neural reflex arc fires in under 15 milliseconds. Yet that apex predator dive is STILL faster than the average roofing contractor responds to an online quote form.',
    problemScript: '82% of homeowners submit quote requests to three contractors at once. If your response takes 30 minutes, they already signed an {TICKET} architectural shingle agreement with your competitor down the street.',
    solutionScript: 'The VantorX 90-Second Speed Engine engages online leads instantly via two-way SMS in under 24 seconds. It qualifies the project scope, captures roof damage photos, and locks in the on-site estimate slot before your competitor even opens their email.',
    proofScript: 'Speed to lead is the highest ROI leverage in the trade industry. Turning a 3-hour callback into a 24-second text triples your booked jobs overnight.',
    ctaScript: 'Test the speed yourself right now: dial (561) 813-8602 or comment "SPEED" below and our automated engine will text your phone the live speed-to-lead audit.'
  },
  {
    id: 'mobile_web_f1',
    stepIndex: 2,
    emoji: '🏎️',
    storyType: 'f1_pitstop',
    storyTitle: 'Formula 1: 1.80s Pit Stop World Record',
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
    contrastLine1: 'AN F1 PIT CREW SWAPS 4 TIRES IN 1.8 SECONDS',
    contrastLine2: 'FASTER THAN A CONTRACTOR WEBSITE LOADS ON SMARTPHONES',
    hookScript: 'McLaren Formula 1 pit crew changed all four tires on a race car in 1.80 seconds flat. In less time than two human heartbeats, twenty mechanics swapped four wheels with surgical precision. Yet that Formula 1 pit stop is STILL faster than the average contractor website loads on a smartphone.',
    problemScript: 'Most contractor websites take four to six seconds to load on mobile. When a homeowner has water flooding their hallway, they will NOT wait for slow images to buffer. They tap back and book an {TICKET} job with the next plumber on the list.',
    solutionScript: 'VantorX builds mobile-first contractor funnels that load in 0.4 seconds. Built with 1-tap emergency dispatch buttons, transparent pricing calculators, and instant quote submission that converts mobile visitors into booked revenue at four times the industry average.',
    proofScript: 'When your site loads instantly and makes booking effortless, homeowners stop searching. You dominate your local market while other shops wonder why their ads are not converting.',
    ctaScript: 'Want to see how your current website scores on mobile speed? Call our team at (561) 813-8602 or comment "WEB" below for a free mobile conversion teardown.'
  },
  {
    id: 'aeo_brain',
    stepIndex: 3,
    emoji: '🧠',
    storyType: 'brain_ai',
    storyTitle: '86B Brain Neurons & ChatGPT Search Revolution',
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
    contrastLine1: 'YOUR BRAIN PROCESSES SIGHT IN 13 MILLISECONDS',
    contrastLine2: 'AND NOW HOMEOWNERS ASK AI WHO TO HIRE',
    hookScript: 'Your brain contains 86 billion neurons and processes visual images in just 13 milliseconds—30 times faster than the blink of an eye. And right now, AI models like ChatGPT process 100 trillion parameters in milliseconds to answer questions for homeowners.',
    problemScript: 'Traditional SEO agencies build slow blogs that nobody reads. If your business is not structured for Answer Engine Optimization, AI assistants will recommend your competitor and leave your shop completely invisible for {TICKET} installations.',
    solutionScript: 'The VantorX AEO Engine injects machine-readable schema, verified entity citations, and real-time review signals that force ChatGPT, Perplexity, and Google Maps to recommend your business as the number-one authority in your service territory.',
    proofScript: 'Be the first contractor recommended when homeowners ask conversational AI for help. Early adopters of AEO are locking down the highest ticket commercial and residential jobs before anyone else catches on.',
    ctaScript: 'Check if your company shows up on ChatGPT right now. Call our direct line at (561) 813-8602 or comment "RANK" below and we will send you a personalized AEO territory scan.'
  },
  {
    id: 'growth_apollo',
    stepIndex: 4,
    emoji: '🚀',
    storyType: 'saturn_rocket',
    storyTitle: 'Apollo 11: 4 Kilobytes of Memory Landed on Moon',
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
    contrastLine1: 'NASA REACHED THE MOON WITH 4 KILOBYTES OF RAM',
    contrastLine2: 'YET CONTRACTORS PAY FOR 4 TOOLS THAT CANNOT TALK TO EACH OTHER',
    hookScript: 'The Apollo 11 guidance computer that landed astronauts on the moon had only 4 kilobytes of RAM—millions of times less computing power than a single modern smartphone. Yet it steered a 3,000-ton rocket across 240,000 miles of deep space without failing once.',
    problemScript: 'A single cracked water line, dead AC compressor, or storm-damaged roof is worth {TICKET}. When your tech stack is fragmented with four different tools that do not talk to each other, you bleed over one hundred thousand dollars a year in preventable missed opportunities.',
    solutionScript: 'The VantorX Growth Engine unites all four pillars: Ava 24/7 Voice AI answering in 0.8s, automated 90-second two-way SMS, a sub-second mobile funnel, and AEO AI search dominance. It turns your business into an automated lead-capturing machine that runs 24 hours a day, 365 days a year.',
    proofScript: 'Contractors using the full VantorX engine consistently add twenty to fifty thousand dollars in monthly booked revenue without spending an extra dime on paid advertising.',
    ctaScript: 'Experience the full engine live: call (561) 813-8602 right now to test Ava on your own phone, or comment "GROWTH" below and our team will send you the interactive blueprint.'
  },

  // --- LAP 2: SAME PRODUCTS BUT BRAND-NEW STORIES & HOOKS! ---
  {
    id: 'voice_ai_lightning',
    stepIndex: 0,
    emoji: '⚡',
    storyType: 'lightning_strike',
    storyTitle: 'Lightning: 1 Billion Volts in 30 Microseconds',
    name: 'Ava 24/7 Voice AI Phone Receptionist',
    shortName: 'Ava Voice AI',
    trade: 'ELECTRICAL',
    ticket: '$7,400',
    scenarioHeadline: 'Main Electrical Panel Burnout at 2 AM · $7,400 Emergency Replacement',
    scenarioDesc: 'Homeowner smells burning plastic from main breaker panel during thunderstorm. Ava answers in 0.8s, verifies emergency & dispatches master electrician.',
    badge: '📞 24/7 VOICE AI RECEPTIONIST',
    keyword: 'AVA',
    statNumber: '0.8s',
    statTitle: 'THE 0.8-SECOND PRINCIPLE',
    statHeadline: 'INSTANT TRIAGE BEFORE DISASTER STRIKES',
    statSub: 'Emergency electrical calls roll to voicemail 85% of the time.',
    solutionTitle: 'Meet Ava: 24/7 Voice AI',
    solutionSub: 'Answers in 0.8s · Live Electrical Triage · Instant Dispatch',
    ctaText: 'COMMENT "AVA" ON THIS REEL NOW',
    contrastLine1: 'LIGHTNING HITS IN 30 MICROSECONDS',
    contrastLine2: 'YET CONTRACTORS DELAY CALLS FOR 6 HOURS',
    hookScript: 'A single bolt of cloud-to-ground lightning delivers over one billion volts of electricity at 220,000 miles per hour, heating the air to 50,000 degrees Fahrenheit—five times hotter than the surface of the sun. Yet that instantaneous atmospheric blast is STILL faster than the average contractor checks their phone.',
    problemScript: 'When an electrical panel sparks or main power blows at night, homeowners are terrified. If your phone rolls to voicemail, they immediately call the next electrician on Google and you lose a {TICKET} job forever.',
    solutionScript: 'Ava answers your phone in 0.8 seconds, captures the caller address and breaker panel brand, checks your tech on-call schedule, and dispatches the emergency in under thirty seconds.',
    proofScript: 'Contractors using Ava never lose another high-ticket night or weekend emergency. You capture 100% of incoming revenue while you sleep soundly.',
    ctaScript: 'Test Ava right now on your own phone: dial (561) 813-8602 or comment "AVA" below and we will DM you the interactive simulator link.'
  },
  {
    id: 'speed_to_lead_niagara',
    stepIndex: 1,
    emoji: '🌊',
    storyType: 'niagara_torrent',
    storyTitle: 'Niagara Falls: 750,000 Gallons Per Second',
    name: '90-Second SMS Speed-to-Lead Auto-Responder',
    shortName: '90s SMS Speed-to-Lead',
    trade: 'PLUMBING',
    ticket: '$9,500',
    scenarioHeadline: 'Mainline Sewer Pipe Rupture · $9,500 Emergency Trenchless Job',
    scenarioDesc: 'Homeowner basement flooding at 600 gallons an hour. While other shops check emails hours later, VantorX instant SMS responds in 24 seconds with tech dispatch ETA.',
    badge: '⏱️ 90s SMS SPEED-TO-LEAD ENGINE',
    keyword: 'SPEED',
    statNumber: '24s',
    statTitle: 'THE HYDRAULIC SPEED RULE',
    statHeadline: '24-SECOND SMS BEFORE HOME FLOODS',
    statSub: 'Homeowners in a flood call until someone answers or texts.',
    solutionTitle: 'VantorX 90s SMS Speed Engine',
    solutionSub: 'Instant 24s Two-Way SMS · Water Shutoff Guide · Tech Alert',
    ctaText: 'COMMENT "SPEED" ON THIS REEL NOW',
    contrastLine1: 'NIAGARA FALLS FLOWS AT 750,000 GALLONS PER SECOND',
    contrastLine2: 'AND A BURST PIPE PUMPS 600 GALLONS AN HOUR',
    hookScript: 'Over 750,000 gallons of water crash over Niagara Falls every single second—enough roaring hydraulic force to fill 1,200 Olympic swimming pools every single minute. Yet that catastrophic water volume moves with more urgency than the average contractor responding to a flooded homeowner.',
    problemScript: 'A burst 1-inch main water line pumps 600 gallons of water an hour into a finished basement. In a flood emergency, homeowners will NOT wait. If you do not reply in 90 seconds, you just lost a {TICKET} emergency trenchless repipe.',
    solutionScript: 'The VantorX 90-Second Speed Engine engages panicked homeowners in 24 seconds flat. It texts emergency water shutoff instructions, captures photos of the break, and confirms the diagnostic dispatch before your competitor even checks their phone.',
    proofScript: 'When you are the first to text during a high-ticket water disaster, you win the job 100% of the time.',
    ctaScript: 'See how fast the speed engine works: dial (561) 813-8602 or comment "SPEED" below and we will text your cell phone the interactive plumbing demonstration.'
  }
];

window.PRODUCT_ROTATION_INDEX = 0;
window.IS_RENDERING_REEL = false;

// Initialize with First Story
window.ACTIVE_STORY = window.PRODUCTS_MIND_QUEUE[0];
window.ACTIVE_SCENARIO = {
  productId: window.ACTIVE_STORY.id,
  productName: window.ACTIVE_STORY.name,
  badge: window.ACTIVE_STORY.badge,
  trade: window.ACTIVE_STORY.trade,
  ticket: window.ACTIVE_STORY.ticket,
  keyword: window.ACTIVE_STORY.keyword,
  statValue: window.ACTIVE_STORY.statNumber,
  statTitle: window.ACTIVE_STORY.statTitle,
  statHeadline: window.ACTIVE_STORY.statHeadline,
  statSub: window.ACTIVE_STORY.statSub,
  solutionTitle: window.ACTIVE_STORY.solutionTitle,
  solutionSub: window.ACTIVE_STORY.solutionSub,
  ctaText: window.ACTIVE_STORY.ctaText,
  demoCall: '(561) 813-8602'
};

// Update Giant Button UI to reflect next target and story
function updateGiantButtonMindState(prod) {
  const titleEl = document.getElementById('giantNextProductTitle');
  if (titleEl) titleEl.textContent = \`\${prod.emoji} \${prod.name}\`;

  const scenEl = document.getElementById('giantNextProductScenario');
  if (scenEl) scenEl.textContent = \`\${prod.storyTitle} · \${prod.scenarioHeadline}\`;

  const emojiEl = document.getElementById('giantHeroEmoji');
  if (emojiEl) emojiEl.textContent = prod.emoji;

  const lapEl = document.getElementById('giantTargetLapBadge');
  if (lapEl) {
    const lapNum = Math.floor(window.PRODUCT_ROTATION_INDEX / 5) + 1;
    const stepInLap = (prod.stepIndex % 5) + 1;
    lapEl.textContent = \`Product \${stepInLap} of 5 (Lap \${lapNum}) · \${prod.storyType}\`;
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

// Core Build Function for Active Product & Story
function buildReelAssetsForProduct(prod) {
  window.ACTIVE_STORY = prod;
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
FUN FACT STORY: \${prod.storyTitle} (\${prod.emoji})
TARGET AUDIENCE: High-Ticket \${prod.trade} Contractors & Blue-Collar Business Owners
PRODUCT ANGLE: \${prod.name} (\${prod.badge})
CORE METRIC: \${prod.statHeadline} (\${prod.statNumber})
TICKET RESCUE: \${prod.ticket} Average Job Loss Prevented
CTA TRIGGER: Comment "\${prod.keyword}" or Call (561) 813-8602

1. [FUN FACT HOOK (0:00 - 0:08)]:
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
`;

content = content.substring(0, queueStartIndex) + newQueueLogic + '\n' + content.substring(queueEndIndex);
console.log('✓ Injected Lap 1 & Lap 2 Multi-Story Queue into Engine');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Successfully saved updated website/demo/reel-creator.html');
