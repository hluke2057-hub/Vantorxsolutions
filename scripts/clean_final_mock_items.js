const fs = require('fs');

// 1. index.html
if (fs.existsSync('index.html')) {
  let idx = fs.readFileSync('index.html', 'utf8');
  idx = idx.replace(/"How much is a haircut\?"/g, '"How much is a 16-SEER AC replacement?"');
  idx = idx.replace(/"Do you take walk-ins\?"/g, '"Do you offer emergency after-hours dispatch?"');
  fs.writeFileSync('index.html', idx, 'utf8');
  console.log('Fixed index.html!');
}

// 2. vantorx-admin connect.js
['website/vantorx-admin/js/pages/connect.js', 'vantorx-admin/js/pages/connect.js'].forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/industry:\s*'Dental'/g, "industry: 'HVAC & Cooling'");
    c = c.replace(/\(312\)\s*555-0142/g, "(561) 813-8602");
    c = c.replace(/frontdesk@lakesidedental\.example/g, "dispatch@titanairfl.com");
    c = c.replace(/lakesidedental\.example/g, "titanairfl.com");
    fs.writeFileSync(f, c, 'utf8');
    console.log('Fixed ' + f);
  }
});

// 3. leadflow config.js
['website/leadflow/js/pages/config.js', 'leadflow/js/pages/config.js'].forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/Barbershop:\s*'[^']+'/g, "'HVAC & Cooling': '❄️'");
    c = c.replace(/'Tattoo Studio':\s*'[^']+'/g, "'Roofing & Gutters': '🏠'");
    c = c.replace(/'Salon \/ Med Spa':\s*'[^']+'/g, "'Plumbing & Drain': '🔧'");
    c = c.replace(/'Gym \/ Fitness':\s*'[^']+'/g, "'Electrical & Solar': '⚡'");
    c = c.replace(/Dental:\s*'[^']+'/g, "'Water Damage Restoration': '🌊'");
    fs.writeFileSync(f, c, 'utf8');
    console.log('Fixed ' + f);
  }
});

// 4. vantorx-receptionist test.js
['website/vantorx-receptionist/js/pages/test.js', 'vantorx-receptionist/js/pages/test.js'].forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(
      /const SCENARIOS = \[[^\]]+\];/s,
      `const SCENARIOS = [
  'AC compressor stopped cooling on 95° Sunday afternoon.',
  'Burst pipe under kitchen sink flooding hardwood floors right now.',
  'Severe storm blew off shingles and water is leaking into ceiling.',
  'How much is a diagnostic inspection for a heat pump?',
  'Do you have an emergency technician available for immediate dispatch?',
  'Can you help with insurance documentation for storm roof damage?',
  'Can I speak with Luke or the master technician on call right now?',
  'Are your technicians state-licensed and fully insured in Florida?',
];`
    );
    fs.writeFileSync(f, c, 'utf8');
    console.log('Fixed ' + f);
  }
});

// 5. website/ai-receptionist.html
if (fs.existsSync('website/ai-receptionist.html')) {
  let c = fs.readFileSync('website/ai-receptionist.html', 'utf8');
  c = c.replace(/No more missed calls during a haircut, a service bay, or after closing/g, 'No more missed calls while on a ladder, in a crawl space, or after hours');
  c = c.replace(/<button type="button" class="choice-btn">Barber<\/button>/g, '<button type="button" class="choice-btn">HVAC & Cooling</button>');
  c = c.replace(/<button type="button" class="choice-btn">Tattoo Artist<\/button>/g, '<button type="button" class="choice-btn">Roofing & Gutters</button>');
  c = c.replace(/<button type="button" class="choice-btn">Salon<\/button>/g, '<button type="button" class="choice-btn">Plumbing & Drains</button>');
  c = c.replace(/<button type="button" class="choice-btn">Med Spa<\/button>/g, '<button type="button" class="choice-btn">Electrical & Solar</button>');
  c = c.replace(/'Barbers':\s*\{[\s\S]*?\},/g, `'HVAC & Roofing': {
    blurb: 'Crews are on ladders or in attics, but the phone does not stop — every missed call is an $8,000 job handed to a competitor.',
    opportunities: ['Answers calls while you are on a ladder or in a crawl space', 'Books emergency diagnostic appointments directly into calendar', 'Answers questions about flat-rate service fees and equipment financing', 'Provides 24/7 after-hours emergency rollover dispatch', 'Transfers active emergency gas/water leaks to on-call tech directly']
  },`);
  fs.writeFileSync('website/ai-receptionist.html', c, 'utf8');
  console.log('Fixed website/ai-receptionist.html');
}

console.log('✅ All clean!');
