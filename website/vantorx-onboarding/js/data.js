/* ============================================================
   VANTORX ONBOARDING — data.js (TRADE CONTRACTOR EDITION)
   Legitimate presets: HVAC, Roofing, Plumbing, Electrical,
   Water Damage, and General Contracting services & FAQs.
   ============================================================ */

export const INDUSTRIES = [
  {
    id: 'hvac',
    label: 'HVAC & Air Conditioning',
    icon: '❄️',
    services: [
      'Diagnostic & Emergency AC Inspection — $89 / 45 min',
      'Precision AC Tune-Up & Maintenance — $129 / 60 min',
      'Emergency Capacitor & Compressor Repair — $380 / 90 min',
      'Full Heat Pump / AC System Replacement — $7,500 / 240 min'
    ]
  },
  {
    id: 'roofing',
    label: 'Roofing & Gutters',
    icon: '🏠',
    services: [
      'Free 21-Point Drone Roof Inspection — $0 / 45 min',
      'Emergency Leak Tarping & Storm Shield — $650 / 90 min',
      'Tile & Shingle Leak Repair — $1,250 / 120 min',
      'Architectural Shingle Roof Replacement — $11,500 / 480 min'
    ]
  },
  {
    id: 'plumbing',
    label: 'Plumbing & Drain Services',
    icon: '🔧',
    services: [
      'Emergency Water Leak & Pipe Diagnostic — $99 / 45 min',
      'Clog Snaking & Hydro-Jetting Service — $285 / 60 min',
      'Tankless Water Heater Installation — $2,650 / 180 min',
      'Trenchless Sewer Line Repair & Repipe — $5,800 / 300 min'
    ]
  },
  {
    id: 'electrical',
    label: 'Electrical & Solar',
    icon: '⚡',
    services: [
      'Diagnostic Troubleshooting & Safety Check — $119 / 45 min',
      '200-Amp Main Service Panel Upgrade — $3,200 / 240 min',
      'EV Charger Dedicated Circuit Install — $850 / 120 min',
      'Whole-Home Backup Generator Switch — $4,200 / 300 min'
    ]
  },
  {
    id: 'restoration',
    label: 'Water Damage & Restoration',
    icon: '🌊',
    services: [
      'Emergency Water Extraction (24/7 Rapid) — $1,450 / 120 min',
      'Infrared Moisture & Mold Inspection — $250 / 60 min',
      'Structural Dehumidification & Drying — $2,800 / 180 min',
      'Full Insurance Restoration Assessment — $0 / 60 min'
    ]
  },
  {
    id: 'contracting',
    label: 'General Contracting & Remodeling',
    icon: '🔨',
    services: [
      'In-Home Remodel Consultation & Estimate — $0 / 60 min',
      'Complete Bathroom Renovation — $14,500 / 480 min',
      'Custom Kitchen Cabinet & Countertop — $22,000 / 600 min',
      'Commercial Tenant Buildout Consultation — $0 / 60 min'
    ]
  },
  {
    id: 'other',
    label: 'Other Trade Contractor',
    icon: '🛠️',
    services: [
      'Standard On-Site Diagnostic Estimate — $89 / 45 min',
      'Same-Day Emergency Service Call — $189 / 60 min'
    ]
  }
];

export const PERSONALITIES = [
  { id: 'Professional', icon: '👔', blurb: 'Polished, authoritative, and reassuring — ideal for high-ticket emergency calls and premium contractors.' },
  { id: 'Friendly', icon: '😊', blurb: 'Warm, empathetic, and calming — puts stressed homeowners at ease during water leaks and AC outages.' },
  { id: 'Direct', icon: '⚡', blurb: 'Fast, efficient, and dispatch-focused — qualifies the trade emergency and dispatches technicians in under 60 seconds.' }
];

export const CONNECTIONS = [
  { id: 'calendar', icon: '📅', title: 'Dispatch Calendar', desc: 'Sync with Google Calendar or ServiceTitan so tech slots never double-book.' },
  { id: 'phone', icon: '📞', title: 'Business Telephony Trunk', desc: 'Direct Twilio carrier line with 24/7 Ava call answering and instant rollover.' },
  { id: 'leadflow', icon: '💬', title: 'LeadFlow 90s SMS Speed Engine', desc: 'Every missed call or web form triggers an instant 24-second SMS response.' },
  { id: 'clienthub', icon: '📊', title: 'Client Command Hub', desc: 'Real-time operations portal for call recordings, leads, invoices, and technician dispatch.' },
  { id: 'aeo', icon: '🔍', title: 'AEO Engine™ (AI Search Domination)', desc: 'Engineered llms.txt and schema so ChatGPT, Perplexity, and Apple Intelligence recommend your shop #1.' }
];

export const TESTS = [
  { id: 'info', label: 'Contractor profile & license complete', hint: 'Company name, license number, service area, and direct owner cell verified.' },
  { id: 'services', label: 'Trade services & flat-rate pricing confirmed', hint: 'Diagnostic fees, emergency premiums, and standard installation rates checked.' },
  { id: 'hours', label: 'Emergency dispatch hours & routing locked', hint: 'Regular business hours, after-hours emergency rollover line, on-call technician cell.' },
  { id: 'greeting', label: 'Ava 24/7 voice greeting approved', hint: 'Listened to Ava answer with company name and emergency intake triage.' },
  { id: 'booking', label: 'Diagnostic appointment dispatch tested', hint: 'Simulated customer booking a service appointment directly into calendar.' },
  { id: 'transfer', label: 'Emergency owner warm-transfer tested', hint: 'Ava instantly transferred a simulated burst pipe / AC crisis to owner phone.' },
  { id: 'aeo', label: 'AEO & AI Search schema generated', hint: 'Verified llms.txt and JSON-LD contractor structured data for ChatGPT & Perplexity.' }
];

export function starterFAQs(industryId) {
  const common = [
    { q: 'Where is your service area?', a: 'We service the entire metropolitan and surrounding county areas within a 35-mile radius.' },
    { q: 'Are you licensed and insured?', a: 'Yes, we are fully state-licensed, bonded, and carry full commercial general liability and workers comp insurance.' },
    { q: 'Do you offer emergency after-hours service?', a: 'Yes! We have on-call master technicians dispatched 24 hours a day, 7 days a week for urgent emergencies.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, debit, check, ACH, and tap-to-pay on-site. 0% financing is also available.' }
  ];

  const byId = {
    hvac: [
      { q: 'Do you charge a diagnostic trip fee?', a: 'Our precision diagnostic fee is $89, which is completely waived when you approve the repair.' },
      { q: 'How fast can a technician arrive for an emergency AC breakdown?', a: 'For active cooling emergencies in peak heat, our average emergency dispatch arrival is under 90 minutes.' },
      { q: 'Do you offer financing for full AC unit replacements?', a: 'Yes, we offer zero-down, 0% APR financing terms through our financing partners.' }
    ],
    roofing: [
      { q: 'Do you provide free estimates for roof replacements?', a: 'Yes, we perform a 100% complimentary 21-point roof and attic inspection with high-resolution drone photo documentation.' },
      { q: 'Can you help with insurance storm damage claims?', a: 'Yes, our certified inspectors document all wind and hail damage according to Florida building codes to streamline your claim.' },
      { q: 'Can you tarp my roof immediately to stop active interior leaking?', a: 'Yes, our rapid-response crew can deploy heavy-duty emergency tarps within 2 hours of dispatch.' }
    ],
    plumbing: [
      { q: 'What should I do if a water pipe bursts right now?', a: 'First, locate your main water shutoff valve near the street or garage and turn it clockwise. Ava has just alerted our on-call plumber for immediate dispatch.' },
      { q: 'Do you have equipment to clear severe main sewer line backups?', a: 'Yes, we carry high-definition sewer fiber-optic cameras and commercial 4,000 PSI hydro-jetting rigs.' },
      { q: 'How much is a tankless water heater conversion?', a: 'Standard tankless installations typically range between $2,200 and $3,400 depending on gas or electrical capacity.' }
    ],
    electrical: [
      { q: 'My circuit breaker is buzzing and keeps tripping. Is that dangerous?', a: 'Yes, a buzzing breaker can indicate electrical arcing or heat buildup. We recommend shutting off the breaker switch and having our electrician inspect it today.' },
      { q: 'Do you install Level 2 Tesla and EV chargers?', a: 'Yes, we install dedicated 240-volt 50-amp circuits with permitting and surge protection.' },
      { q: 'How long does a 200-amp service panel upgrade take?', a: 'Most panel upgrades take approximately 4 to 6 hours from power disconnect to final county inspection.' }
    ],
    restoration: [
      { q: 'How quickly can your flood extraction crew arrive?', a: 'Our emergency extraction teams are mobilizable 24/7/365 with truck-mounted water extractors arriving on-site within 45 to 60 minutes.' },
      { q: 'Will you bill my homeowner insurance carrier directly?', a: 'Yes, we work directly with all major insurance carriers and provide line-item Xactimate billing so you have minimal out-of-pocket stress.' }
    ],
    contracting: [
      { q: 'Do you handle permitting and architectural plans?', a: 'Yes, we handle the entire end-to-end permitting, engineering approvals, and inspection process from start to finish.' },
      { q: 'How does your milestone payment schedule work?', a: 'We operate on transparent milestone draws tied directly to completed inspection checkpoints.' }
    ]
  };

  return [...(byId[industryId] || []), ...common];
}

export function sampleGreeting(industryId, businessName, aiName) {
  const b = businessName || 'our shop';
  const map = {
    hvac: `Thank you for calling ${b}! This is ${aiName}. Are you calling for emergency AC repair, or would you like to schedule a service estimate?`,
    roofing: `Thanks for calling ${b}! This is ${aiName}. Are you calling about storm damage or an active leak, or to schedule a free roof inspection?`,
    plumbing: `Thank you for calling ${b}! This is ${aiName}. Do you have an active plumbing emergency, or can I help book a service call today?`,
    electrical: `Thanks for calling ${b}! This is ${aiName}. Are you experiencing an electrical issue, or would you like to schedule an on-site estimate?`,
    restoration: `Thank you for calling ${b} 24/7 Emergency Response. This is ${aiName}. Do you have active water intrusion or flooding at your property right now?`,
    contracting: `Thanks for calling ${b}! This is ${aiName}. How can I assist you with your remodeling or construction project today?`,
    other: `Thank you for calling ${b}! This is ${aiName}. How can I help you with your project today?`
  };
  return map[industryId] || map.other;
}
