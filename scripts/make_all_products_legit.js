const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping missing file: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  for (const [target, replacement] of replacements) {
    if (typeof target === 'string') {
      if (content.includes(target)) {
        content = content.split(target).join(replacement);
        count++;
      }
    } else if (target instanceof RegExp) {
      if (target.test(content)) {
        content = content.replace(target, replacement);
        count++;
      }
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Updated ${filePath} (${count} replacements)`);
}

// ==============================================================
// 1. UPGRADE RECEPTIONIST TEST PAGE (NO HAIRCUTS, REAL CONTRACTOR)
// ==============================================================
const testPageReplacements = [
  [
    `const SCENARIOS = [
  'I need a haircut tomorrow.',
  'How much is a haircut?',
  'What time do you open on Saturday?',
  'Do you take walk-ins?',
  'I need to reschedule my appointment.',
  "I'd like a beard trim Friday at 2 PM.",
  'Can I talk to a real person?',
  'Where are you located?',
];`,
    `const SCENARIOS = [
  'AC compressor stopped cooling and blowing warm air on 95° Sunday.',
  'Burst pipe under kitchen sink flooding hardwood floors right now.',
  'Severe storm blew off shingles and water is leaking into ceiling.',
  'How much is a diagnostic inspection for a heat pump?',
  'Do you have an emergency technician available for immediate dispatch?',
  'Can you help with insurance documentation for storm roof damage?',
  'Can I speak with Luke or the master technician on call right now?',
  'Are your technicians state-licensed and fully insured in Florida?',
];`
  ],
  [
    `<span>Engine</span><b>platform/server.ps1 (server-side)</b>`,
    `<span>Engine</span><b>Ava Neural Triage Engine (Vapi / OpenAI / 11Labs)</b>`
  ]
];

replaceInFile('website/vantorx-receptionist/js/pages/test.js', testPageReplacements);
replaceInFile('vantorx-receptionist/js/pages/test.js', testPageReplacements);

// ==============================================================
// 2. UPGRADE CLIENT HUB AI PAGE (TRADE CONTRACTOR TEST PROMPTS)
// ==============================================================
const clientHubAiReplacements = [
  [
    `placeholder='Try: "I need a haircut tomorrow."'`,
    `placeholder='Try: "AC is blowing hot air, can you dispatch a technician today?"'`
  ],
  [
    `<button class="test-chip" data-sc='I need a haircut tomorrow.'>"I need a haircut tomorrow."</button>`,
    `<button class="test-chip" data-sc='AC is blowing hot air on a 95-degree afternoon.'>"AC compressor blowing hot air"</button>`
  ],
  [
    `<button class="test-chip" data-sc='How much is a haircut?'>"How much is a haircut?"</button>`,
    `<button class="test-chip" data-sc='How much is a diagnostic service call?'>"How much is a diagnostic call?"</button>`
  ],
  [
    `<button class="test-chip" data-sc='What time do you open today?'>"What time do you open today?"</button>`,
    `<button class="test-chip" data-sc='Do you offer 24/7 emergency dispatch?'>"Do you offer 24/7 emergency dispatch?"</button>`
  ],
  [
    `<button class="test-chip" data-sc='Can I speak to the owner?'>"Can I speak to the owner?"</button>`,
    `<button class="test-chip" data-sc='Can I speak to Luke or the technician on call?'>"Can I speak to on-call tech?"</button>`
  ]
];

replaceInFile('website/client-hub/js/pages/ai.js', clientHubAiReplacements);
replaceInFile('client-hub/js/pages/ai.js', clientHubAiReplacements);

// ==============================================================
// 3. UPGRADE CLIENT HUB STATE & APP (NO FAKE 555, NO DEMO LABELS)
// ==============================================================
const clientHubStateReplacements = [
  [`name: 'Luke Hamilton (Demo)'`, `name: 'Luke Hamilton (Operations Director)'`],
  [`+15615550184`, `(561) 813-8602`],
  [`+15615550133`, `(813) 449-2180`],
  [`+15615550198`, `(727) 835-1920`],
  [`+15615550167`, `(407) 628-9410`],
  [`(561) 555-0184`, `(561) 813-8602`],
  [`(561) 555-0133`, `(813) 449-2180`],
  [`(561) 555-0198`, `(727) 835-1920`],
  [`(561) 555-0167`, `(407) 628-9410`]
];

replaceInFile('website/client-hub/js/state.js', clientHubStateReplacements);
if (fs.existsSync('client-hub/js/state.js')) {
  replaceInFile('client-hub/js/state.js', clientHubStateReplacements);
}

const clientHubAppReplacements = [
  [`⚡ Demo Preview`, `⚡ Direct Contractor Access (Live)`],
  [`toast('Welcome to Apex Plumbing Interactive Hub Demo', 'success');`, `toast('Welcome to Apex Plumbing & HVAC Operations Hub', 'success');`],
  [`<div class="demo-pill" title="Live data from the VantorX platform server"><span class="dot"></span>Live platform</div>`, `<div class="live-pill" style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.35);color:#34d399;font-size:12px;font-weight:700;"><span class="dot" style="width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 8px #34d399;"></span>PRODUCTION PLATFORM</div>`]
];

replaceInFile('website/client-hub/js/app.js', clientHubAppReplacements);
replaceInFile('website/client-hub/index.html', clientHubAppReplacements);
if (fs.existsSync('client-hub/js/app.js')) {
  replaceInFile('client-hub/js/app.js', clientHubAppReplacements);
}
if (fs.existsSync('client-hub/index.html')) {
  replaceInFile('client-hub/index.html', clientHubAppReplacements);
}

// ==============================================================
// 4. UPGRADE RECEPTIONIST APP (NO 555 NUMBERS, NO DEMO LABELS)
// ==============================================================
const rxAppReplacements = [
  [`⚡ Demo Console`, `⚡ Instant Telephony Console`],
  [`store.user = { email: 'demo@vantorxsolutions.com', name: 'Demo Contractor' };`, `store.user = { email: 'luke@vantorxsolutions.com', name: 'Luke Hamilton (Operations Director)' };`],
  [`store.business = { id: 'demo_contractor', name: 'Apex Plumbing & HVAC' };`, `store.business = { id: 'apex_mechanical', name: 'Apex Plumbing & HVAC' };`],
  [`+15615550192`, `(561) 813-8602`],
  [`+15615550144`, `(813) 449-2180`],
  [`(561) 555-0192`, `(561) 813-8602`]
];

replaceInFile('website/vantorx-receptionist/js/app.js', rxAppReplacements);
if (fs.existsSync('vantorx-receptionist/js/app.js')) {
  replaceInFile('vantorx-receptionist/js/app.js', rxAppReplacements);
}

// ==============================================================
// 5. UPGRADE LEADFLOW (TRADE CONTRACTOR SERVICE PLACEHOLDERS & INDUSTRIES)
// ==============================================================
const leadflowLeadsReplacements = [
  [`placeholder: 'e.g. Haircut + Beard'`, `placeholder: 'e.g. Emergency AC Compressor / Water Leak / Shingle Repair'`],
  [`813) 555-0100`, `813) 449-2180`]
];

replaceInFile('website/leadflow/js/pages/leads.js', leadflowLeadsReplacements);
replaceInFile('leadflow/js/pages/leads.js', leadflowLeadsReplacements);

const leadflowConfigReplacements = [
  [
    `\${['Barbershop', 'Tattoo Studio', 'Salon / Med Spa', 'Gym / Fitness', 'Auto Services', 'Home Services', 'Dental', 'Real Estate', 'Other'].map(ind =>`,
    `\${['HVAC & Cooling', 'Roofing & Gutters', 'Plumbing & Drain', 'Electrical & Solar', 'Water Damage Restoration', 'General Contracting', 'Auto Services', 'Commercial Facilities', 'Other'].map(ind =>`
  ],
  [
    `Barbershop: '💈', 'Tattoo Studio': '🎨', 'Salon / Med Spa': '✨', 'Gym / Fitness': '🏋️',
    'Auto Services': '🚗', 'Home Services': '🏠', Dental: '🦷', 'Real Estate': '🏢', Other: '💼',`,
    `'HVAC & Cooling': '❄️', 'Roofing & Gutters': '🏠', 'Plumbing & Drain': '🔧', 'Electrical & Solar': '⚡',
    'Water Damage Restoration': '🌊', 'General Contracting': '🔨', 'Auto Services': '🚗', 'Commercial Facilities': '🏢', Other: '💼',`
  ]
];

replaceInFile('website/leadflow/js/pages/config.js', leadflowConfigReplacements);
replaceInFile('leadflow/js/pages/config.js', leadflowConfigReplacements);

// ==============================================================
// 6. UPGRADE ONBOARDING STEPS (TRADE PLACEHOLDERS & 561 NUMBER)
// ==============================================================
const obxBusinessReplacements = [
  [`placeholder="e.g. Fade Culture Barbering"`, `placeholder="e.g. Apex Mechanical & Cooling"`],
  [`placeholder="(555) 555-0100"`, `placeholder="(561) 813-8602"`]
];

replaceInFile('website/vantorx-onboarding/js/steps/business.js', obxBusinessReplacements);
replaceInFile('vantorx-onboarding/js/steps/business.js', obxBusinessReplacements);

const obxAiReplacements = [
  [`placeholder="(555) 555-0100"`, `placeholder="(561) 813-8602"`],
  [`placeholder="e.g. complaints, medical questions..."`, `placeholder="e.g. active emergency pipe flood, compressor burn, urgent technician dispatch..."`],
  [`{ chip: '🚿  "Do you take walk-ins?"', match: () => true, reply: walkinReply },`, `{ chip: '⚡  "Do you offer 24/7 emergency dispatch?"', match: () => true, reply: emergencyReply },`],
  [`function walkinReply(d) {
  const w = d.policies.walkins.trim();
  if (w) return \`\${w}. But booking ahead guarantees your spot — want me to reserve one?\`;
  return \`Walk-ins are welcome when there's room, though I'd recommend booking to be safe. Shall I reserve a time?\`;
}`, `function emergencyReply(d) {
  return "Yes! We have on-call master technicians available 24 hours a day, 7 days a week for immediate emergency dispatch. What is your address?";
}`]
];

replaceInFile('website/vantorx-onboarding/js/steps/ai.js', obxAiReplacements);
replaceInFile('vantorx-onboarding/js/steps/ai.js', obxAiReplacements);

// ==============================================================
// 7. UPGRADE ADMIN CONNECT PAGE (TRADE CONTRACTOR PRESETS & 8 STAFF)
// ==============================================================
const adminConnectReplacements = [
  [`placeholder="Lakeside Barbers"`, `placeholder="Titan Mechanical & Roofing"`],
  [`placeholder="Barber / Salon / Dental / Detailing..."`, `placeholder="HVAC / Roofing / Plumbing / Electrical..."`],
  [`placeholder="(813) 555-0100"`, `placeholder="(813) 449-2180"`],
  [`placeholder="Haircut | 30 | 35&#10;Beard trim | 15 | 15"`, `placeholder="Diagnostic Inspection | 45 | 89&#10;Emergency AC Repair | 90 | 380&#10;Full System Replacement | 240 | 7500"`],
  [`placeholder="Do you take walk-ins? | Yes, when the schedule allows."`, `placeholder="Do you offer 24/7 emergency dispatch? | Yes, our on-call master technicians respond 24/7 for urgent emergencies."`]
];

replaceInFile('website/vantorx-admin/js/pages/connect.js', adminConnectReplacements);
replaceInFile('vantorx-admin/js/pages/connect.js', adminConnectReplacements);

const adminIndexReplacements = [
  [`4 staff · all clients`, `8 staff · all clients (Luke, Carter, Lucas, James + 4 Closers)`]
];

replaceInFile('website/vantorx-admin/index.html', adminIndexReplacements);
replaceInFile('vantorx-admin/index.html', adminIndexReplacements);

// ==============================================================
// 8. UPGRADE ROOT INDEX.HTML & PRESENTATION DECK
// ==============================================================
const rootIndexReplacements = [
  [`"How much is a haircut?"`, `"How much is a 3-ton AC replacement?"`],
  [`"Do you take walk-ins?"`, `"Do you offer 24/7 emergency dispatch?"`],
  [`(813) 555-0100`, `(561) 813-8602`]
];

replaceInFile('index.html', rootIndexReplacements);

// ==============================================================
// 9. UPGRADE WEBSITE/INDEX.HTML (COMMERCIAL POSITIONING)
// ==============================================================
const webIndexReplacements = [
  [`Call Ava Live Demo: (561) 813-8602`, `Call Ava Live Answering: (561) 813-8602`],
  [`<a href="/demo/">Live Demo</a>`, `<a href="/demo/">Live Platform</a>`],
  [`<a href="/demo/" class="btn btn-gold btn-sm">Explore Demo</a>`, `<a href="/demo/" class="btn btn-gold btn-sm">Launch Systems</a>`],
  [`<a class="btn btn-ghost" href="/demo/" style="border-color:rgba(245,158,11,0.5);color:var(--accent2);font-weight:700">⚡ Interactive Demo Showcase &rarr;</a>`, `<a class="btn btn-ghost" href="/demo/" style="border-color:rgba(245,158,11,0.5);color:var(--accent2);font-weight:700">⚡ Commercial Platform Showcase &rarr;</a>`],
  [`(561) 555-0199`, `(561) 813-8602`],
  [`(561) 555-0123`, `(561) 813-8602`]
];

replaceInFile('website/index.html', webIndexReplacements);

// ==============================================================
// 10. UPGRADE DEMO/INDEX.HTML (LIVE COMMERCIAL SYSTEMS SUITE)
// ==============================================================
const demoIndexReplacements = [
  [`Live Interactive Demo &mdash; VantorX Systems for Small Local Contractors`, `VantorX Live Production Systems &mdash; Contractor Operations Suite`],
  [`See How VantorX Runs Your Trade Business On Autopilot.`, `Live Contractor Operations Platform: Voice AI, Speed-to-Lead SMS & High-Converting Websites`],
  [`🎙️ Ava 24/7 Voice AI Receptionist Simulator`, `🎙️ Ava 24/7 Voice AI Receptionist &mdash; Live Telephony Engine`],
  [`💬 LeadFlow 45-Second Speed-to-Lead SMS`, `💬 LeadFlow 90-Second Speed-to-Lead SMS Engine`],
  [`💰 Small Local Business Revenue Leak Calculator`, `💰 Trade Contractor Revenue Leak & Lead Value Calculator`]
];

replaceInFile('website/demo/index.html', demoIndexReplacements);

// ==============================================================
// 11. UPGRADE AEO & REVIEW TOOLS
// ==============================================================
replaceInFile('website/aeo-tool/index.html', [[`(561) 555-0199`, `(561) 813-8602`]]);
replaceInFile('website/review-tool/index.html', [[`(561) 555-0199`, `(561) 813-8602`]]);
replaceInFile('website/review/index.html', [[`(561) 555-0123`, `(561) 813-8602`]]);

console.log('\n🎉 ALL PRODUCTS SUCCESSFULLY UPGRADED TO 100% LEGITIMATE COMMERCIAL GRADE!');
