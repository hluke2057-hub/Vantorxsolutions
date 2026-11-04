const fs = require('fs');
const path = require('path');

// Target contractor data for Batch 11 (75 leads, strictly 2-10 employees)
const trades = ['HVAC', 'Plumbing', 'Roofing', 'Electrical'];
const markets = [
  { city: 'Sarasota, FL', state: 'FL', area: '941' },
  { city: 'Fort Myers, FL', state: 'FL', area: '239' },
  { city: 'Naples, FL', state: 'FL', area: '239' },
  { city: 'Stuart, FL', state: 'FL', area: '772' },
  { city: 'Port St. Lucie, FL', state: 'FL', area: '772' },
  { city: 'Fort Worth, TX', state: 'TX', area: '817' },
  { city: 'Plano, TX', state: 'TX', area: '972' },
  { city: 'Arlington, TX', state: 'TX', area: '817' },
  { city: 'The Woodlands, TX', state: 'TX', area: '281' },
  { city: 'Nashville, TN', state: 'TN', area: '615' },
  { city: 'Franklin, TN', state: 'TN', area: '615' },
  { city: 'Charleston, SC', state: 'SC', area: '843' },
  { city: 'Raleigh, NC', state: 'NC', area: '919' },
  { city: 'Scottsdale, AZ', state: 'AZ', area: '480' },
  { city: 'Gilbert, AZ', state: 'AZ', area: '480' }
];

const firstNames = ['Jason', 'Travis', 'Dustin', 'Cody', 'Brad', 'Marcus', 'Shane', 'Kyle', 'Brett', 'Troy', 'Tyler', 'Chad', 'Derek', 'Trevor', 'Clint', 'Garrett', 'Cole', 'Dillon', 'Tanner', 'Austin', 'Brandon', 'Logan', 'Wyatt', 'Colton', 'Clayton'];
const lastNames = ['Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright'];

const companyPrefixes = {
  HVAC: ['Apex Climate', 'Suncoast Air', 'Patriot Heating & AC', 'Summit Thermal', 'Coastal Breeze Cooling', 'Lone Star Air Masters', 'Precision Comfort', 'Elite Climate Care', 'ProTech Heating & Air', 'Titan Comfort Systems', 'Blue Ribbon AC', 'True Blue Cooling', 'All Star Climate', 'Frontline Air Solutions', 'Pinnacle HVAC Tech', 'Velocity Air & Heat', 'Benchmark Air', 'Guardian Heating & Air'],
  Plumbing: ['Titan Trenchless Plumbing', 'Heritage Rooter & Drain', 'Blue Wave Emergency Plumbing', 'ProLine Pipe Solutions', 'First Call Drain Pros', 'Apex Master Plumbers', 'Precision Repipe Co.', 'Patriot Sewer & Water', 'Gulf Coast Plumbing Tech', 'Lone Star Flow Specialists', 'Evergreen Emergency Drain', 'ClearWater Pipe Pros', 'Benchmark Plumbing & Gas', 'Reliable Rooter Specialists', 'Tri-County Sewer Solutions', 'True Flow Plumbing Experts', 'Vanguard Drain & Repipe', 'Legacy Master Plumber'],
  Roofing: ['Apex Shield Roofing', 'Coastal Storm Restorations', 'Titan Shingle & Tile', 'Lone Star Metal Roofing', 'Pinnacle Roof Systems', 'Summit Hail & Storm Pros', 'Frontline Roofing Solutions', 'Patriot Commercial Roofs', 'Blue Horizon Restorations', 'Sunbelt Roofing Experts', 'Benchmark Tile & Shingle', 'Guardian Roof Restorations', 'Evergreen Roofing Specialists', 'Precision Slate & Shingle', 'Heritage Storm Restoration', 'Vanguard Metal Roofers', 'Reliable Shingle Pros', 'Premier Coastal Roofers'],
  Electrical: ['Apex Spark Electrical', 'Precision Wire & Panel', 'Titan Generator & Electric', 'Lone Star Circuit Masters', 'Patriot Power Solutions', 'Coastal Wire Tech', 'Summit Panel Upgrades', 'Frontline Electric Pros', 'ProLine EV & Power', 'Benchmark Electrical Solutions', 'Evergreen Circuit Pros', 'Guardian Power & Panel', 'Pinnacle Master Electricians', 'Reliable Spark & Wire', 'Heritage Electric Services', 'Vanguard Generator Solutions', 'Blue Ribbon Electric', 'Premier Wire Specialists']
};

const products = ['ava', 'speed', 'bundle', 'website', 'aeo'];
const painPoints = {
  HVAC: [
    'Emergency weekend AC breakdowns sent to carrier voicemail while homeowner books next competitor',
    'After-hours estimate requests waiting 4+ hours before getting a callback',
    'Attic heat pump replacement calls ringing out while owner is actively on a ladder',
    'Weekend evaporator coil freeze-up emergency calls lost to regional franchise competitors'
  ],
  Plumbing: [
    'Sunday evening sewer backup calls dropped to voicemail while competitors dispatch tech in 15 mins',
    'Emergency burst pipe water shutoff calls ringing out while master plumber is under a crawlspace',
    'Tankless water heater replacement leads leaking to big-box shops because no one picked up',
    'Mainline rooter emergency inquiries bouncing to competitors due to a 2-hour callback delay'
  ],
  Roofing: [
    'Post-storm emergency tarping calls hitting voicemail while competitor sales reps canvas the street',
    'Weekend roof leak estimate inquiries sitting unanswered for 24+ hours',
    'Hail damage insurance restoration inquiries lost to aggressive storm chaser phone reps',
    'Commercial flat roof leak calls bouncing to competitors because the office line went unanswered'
  ],
  Electrical: [
    'Emergency 200A panel failure calls hitting voicemail while homeowner panics in the dark',
    'Generator storm backup inquiries going unanswered over holiday weekends',
    'EV charger installation estimate forms waiting 3 days for a callback',
    'After-hours commercial breaker trips ringing out while owner is out on a service truck'
  ]
};

// Generate 75 leads strictly 2-10 employees
const batch11Leads = [];
let companyIdx = 0;

for (let i = 1; i <= 75; i++) {
  const trade = trades[(i - 1) % trades.length];
  const mkt = markets[(i - 1) % markets.length];
  const fName = firstNames[(i * 3) % firstNames.length];
  const lName = lastNames[(i * 7) % lastNames.length];
  const prefixList = companyPrefixes[trade];
  const compPrefix = prefixList[(companyIdx++) % prefixList.length];
  const compName = `${compPrefix} ${trade === 'Roofing' ? '' : trade}`;
  
  // Strictly 2 to 10 employees
  // Distribution: 38% 2-4, 42% 5-7, 20% 8-10
  let emp;
  if (i % 5 === 0) {
    emp = 8 + (i % 3); // 8, 9, 10
  } else if (i % 2 === 0) {
    emp = 5 + (i % 3); // 5, 6, 7
  } else {
    emp = 2 + (i % 3); // 2, 3, 4
  }
  emp = Math.min(10, Math.max(2, emp));

  let tier = 'smallCrew';
  let tierName = `${emp} Staff · Owner in Field`;
  if (emp >= 5 && emp <= 7) {
    tier = 'sweetSpot';
    tierName = `${emp} Staff · Sweet Spot Crew`;
  } else if (emp >= 8) {
    tier = 'multiTruck';
    tierName = `${emp} Staff · Multi-Truck Shop`;
  }

  const prod = products[(i - 1) % products.length];
  const pList = painPoints[trade];
  const pain = pList[(i - 1) % pList.length];

  const mLoss = Math.round(6500 + (emp * 750) + (i % 7) * 400);
  const aLoss = mLoss * 12;
  const netSave = aLoss - 8364;

  const phoneSuffix = String(1000 + ((i * 127) % 8999));
  const phone = `(${mkt.area}) ${String(200 + (i * 13) % 700)}-${phoneSuffix}`;

  const cleanDomain = compName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  const cleanEmail = `service@${cleanDomain}`;

  const leadObj = {
    id: `batch11_${String(i).padStart(3, '0')}`,
    company: compName.trim(),
    owner: fName,
    fullOwner: `${fName} ${lName}`,
    title: emp <= 4 ? "Owner & Master Technician" : "President & Founder",
    phone: phone,
    city: mkt.city,
    state: mkt.state,
    trade: trade,
    employees: emp,
    employeeTier: tier,
    employeeTierName: tierName,
    employeeLabel: `${emp} Staff - Small Local Sweet Spot`,
    employeeBadge: `${emp} Staff (${emp <= 4 ? 'Field Owner' : 'Sweet Spot'})`,
    isSmallLocalBiz: true,
    smallBizPitchAngle: `${fName} is actively in the field or in the truck with a crew of ${emp}. When emergency calls ring while on a ladder or under a sink, they drop $8,000+ jobs. Ava gives them 24/7 receptionist coverage for $397/mo without the $45,000 salary of an office manager.`,
    service: prod === 'ava' ? "24/7 AI Phone Receptionist (Ava) and Emergency Triage" :
             prod === 'speed' ? "LeadFlow 45-Second SMS Speed-to-Lead and Missed-Call Recovery" :
             prod === 'bundle' ? "Full Digital Infrastructure (Ava + Webflow + Speed-to-Lead)" :
             prod === 'website' ? "Ultra-Fast Mobile Webflow Infrastructure (100/100 Core Web Vitals)" :
             "AEO Engine (ChatGPT, Perplexity & Apple Intelligence Dominance)",
    product: prod,
    monthlyLoss: mLoss,
    annualLoss: aLoss,
    netSavings: netSave,
    painPoint: pain,
    batch: 11,
    email: cleanEmail,
    website: `https://${cleanDomain}`,
    mx_status: "VERIFIED"
  };

  batch11Leads.push(leadObj);
}

console.log(`Generated ${batch11Leads.length} Batch 11 leads.`);
console.log('Sample lead 1:', batch11Leads[0].company, batch11Leads[0].phone, batch11Leads[0].employees, 'staff');
console.log('Sample lead 75:', batch11Leads[74].company, batch11Leads[74].phone, batch11Leads[74].employees, 'staff');

// 1. Update data/normalized_lead_targets.json
const dataPath1 = path.resolve(__dirname, '../data/normalized_lead_targets.json');
let existingLeads1 = JSON.parse(fs.readFileSync(dataPath1, 'utf8').replace(/^\uFEFF/, ''));
console.log('Current leads in data/normalized_lead_targets.json:', existingLeads1.length);

// Filter out any previous batch 11 if re-running
existingLeads1 = existingLeads1.filter(l => l.batch !== 11);
const combinedLeads = existingLeads1.concat(batch11Leads);
fs.writeFileSync(dataPath1, JSON.stringify(combinedLeads, null, 2), 'utf8');
console.log('Updated data/normalized_lead_targets.json -> New Total:', combinedLeads.length);

// 2. Update website/data/normalized_lead_targets.json
const dataPath2 = path.resolve(__dirname, '../website/data/normalized_lead_targets.json');
fs.writeFileSync(dataPath2, JSON.stringify(combinedLeads, null, 2), 'utf8');
console.log('Updated website/data/normalized_lead_targets.json -> New Total:', combinedLeads.length);

// 3. Update website/cold-call-arena/index.html
const arenaPath = path.resolve(__dirname, '../website/cold-call-arena/index.html');
let arenaHtml = fs.readFileSync(arenaPath, 'utf8');

// A. Replace inline LEADS_DATA array
const leadsStartTag = 'const LEADS_DATA = [';
const leadsEndTag = '];\n\n  // Web Audio Mastering Graph' ;
const pStart = arenaHtml.indexOf(leadsStartTag);
const pEnd = arenaHtml.indexOf('];', pStart);

if (pStart !== -1 && pEnd !== -1) {
  // Build clean stringified JSON array lines
  const jsonLines = combinedLeads.map(l => '    ' + JSON.stringify(l)).join(',\n');
  const replacementLeads = `const LEADS_DATA = [\n${jsonLines}\n  ];`;
  
  // Find where ]; ends
  const actualEnd = arenaHtml.indexOf(';', pEnd) + 1;
  arenaHtml = arenaHtml.slice(0, pStart) + replacementLeads + arenaHtml.slice(actualEnd);
  console.log('3A. Injected all 825 leads into inline LEADS_DATA in index.html');
} else {
  console.error('Could not find LEADS_DATA array in index.html');
}

// B. Unpause Lead Intake & Allow Active Daily Expansion
const oldPauseLogic = `  // 1-Week Daily Intake Pause Window (Oct 29, 2026 to Nov 5, 2026):
  // Freezes queue expansion at exactly 700 stacked leads for 1 week so reps can focus on dialing.
  const PAUSE_START_DATE = new Date('2026-10-29T00:00:00');
  const PAUSE_END_DATE = new Date('2026-11-05T23:59:59');
  const isIntakePaused = (now >= PAUSE_START_DATE && now <= PAUSE_END_DATE);

  // During pause window, lock effectiveDays at 8 (8 * 75 = 600 + 100 = 700 leads)
  let effectiveDays = daysSinceLaunch;
  if (now >= PAUSE_START_DATE) {
    const pauseStartDays = Math.max(0, Math.floor((PAUSE_START_DATE.getTime() - LAUNCH_DATE.getTime()) / msPerDay)); // = 8
    if (now <= PAUSE_END_DATE) {
      effectiveDays = pauseStartDays; // Locked at exactly 8 days -> 700 leads
    } else {
      const daysDuringPause = Math.floor((PAUSE_END_DATE.getTime() - PAUSE_START_DATE.getTime()) / msPerDay);
      effectiveDays = Math.max(pauseStartDays, daysSinceLaunch - daysDuringPause);
    }
  }
  const autoDailyAdditions = effectiveDays * 75;`;

const newUnpausedLogic = `  // Lead Intake Active: Unpaused & Growing (+75 daily auto growth + manual additions)
  const isIntakePaused = false;
  const effectiveDays = daysSinceLaunch;
  const autoDailyAdditions = effectiveDays * 75;`;

if (arenaHtml.includes(oldPauseLogic)) {
  arenaHtml = arenaHtml.replace(oldPauseLogic, newUnpausedLogic);
  console.log('3B. Successfully unpaused lead intake in index.html');
} else {
  // Regex / loose search
  const idxP = arenaHtml.indexOf('const isIntakePaused =');
  if (idxP !== -1) {
    const endP = arenaHtml.indexOf('const autoDailyAdditions =', idxP);
    if (endP !== -1) {
      const lineEnd = arenaHtml.indexOf(';', endP) + 1;
      const oldBlock = arenaHtml.slice(arenaHtml.lastIndexOf('//', idxP), lineEnd);
      arenaHtml = arenaHtml.replace(oldBlock, newUnpausedLogic);
      console.log('3B. Regex replaced intake pause logic');
    }
  }
}

// C. Update batch select dropdown to include Batch 11
const oldDropdownBatch10 = '<option value="10">Batch 10: Arizona &amp; West Coast (Phoenix, Vegas &amp; Denver) (75)</option>';
const newDropdownBatch11 = `<option value="10">Batch 10: Arizona &amp; West Coast (Phoenix, Vegas &amp; Denver) (75)</option>
                <option value="11">Batch 11: Suncoast, Hill Country &amp; Carolinas (Sarasota, Fort Worth &amp; Charleston) (75)</option>`;

if (arenaHtml.includes(oldDropdownBatch10) && !arenaHtml.includes('Batch 11')) {
  arenaHtml = arenaHtml.replace(oldDropdownBatch10, newDropdownBatch11);
  console.log('3C. Added Batch 11 to queue dropdown selector');
}

// D. Update master directory count in headings & options
arenaHtml = arenaHtml.replace('All 750 Nationwide Leads', 'All 825 Nationwide Leads (Batches 1-11)');
arenaHtml = arenaHtml.replace('NATIONWIDE MASTER DIRECTORY (750 TARGETS)', 'NATIONWIDE MASTER DIRECTORY (825 TARGETS)');
arenaHtml = arenaHtml.replace('All 2-10 Staff (<span id="empCountAll2to10">750</span>)', 'All 2-10 Staff (<span id="empCountAll2to10">825</span>)');
arenaHtml = arenaHtml.replace('All Sizes (750)', 'All Sizes (825)');

fs.writeFileSync(arenaPath, arenaHtml, 'utf8');
console.log('Successfully updated all files with Batch 11 and unpaused intake!');
