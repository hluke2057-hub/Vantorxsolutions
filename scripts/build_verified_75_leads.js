const fs = require('fs');
const path = require('path');

const RAW_75_LEADS = [
  {
    company: "Duval Air Conditioning",
    owner: "Chris",
    fullOwner: "Chris DuVall",
    title: "President & Founder",
    phone: "(904) 652-4795",
    city: "Jacksonville Beach, FL",
    state: "FL",
    trade: "HVAC",
    employees: 2
  },
  {
    company: "Donovan Air, Electric & Plumbing",
    owner: "James",
    fullOwner: "James Donovan",
    title: "Owner / Master Qualifier",
    phone: "(904) 241-3785",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "HVAC",
    employees: 3
  },
  {
    company: "Cool R Us, Inc.",
    owner: "Nick",
    fullOwner: "Nick Popovich",
    title: "President",
    phone: "(904) 790-9110",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "HVAC",
    employees: 2
  },
  {
    company: "Bill Williams Air Conditioning",
    owner: "Bill",
    fullOwner: "Bill Williams",
    title: "Owner & Qualifier (CAC046909)",
    phone: "(904) 387-0491",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "HVAC",
    employees: 2
  },
  {
    company: "NEFL Contractors & Maintenance",
    owner: "Michael",
    fullOwner: "Michael Davis",
    title: "Owner & Managing Director",
    phone: "(904) 512-2952",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "HVAC",
    employees: 2
  },
  {
    company: "Charlie's Tropic Heating & Air",
    owner: "Charlie",
    fullOwner: "Charlie McAllister",
    title: "President",
    phone: "(904) 241-1788",
    city: "Atlantic Beach, FL",
    state: "FL",
    trade: "HVAC",
    employees: 2
  },
  {
    company: "Brisk Air Heating & Cooling, Inc.",
    owner: "Robert",
    fullOwner: "Robert Miller",
    title: "President & Founder",
    phone: "(904) 880-8481",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "HVAC",
    employees: 2
  },
  {
    company: "Terry Vereen Plumbing",
    owner: "Terry",
    fullOwner: "Terry Vereen",
    title: "Owner / Master Plumber",
    phone: "(904) 384-5661",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 3
  },
  {
    company: "Turner Plumbing Co.",
    owner: "Robert",
    fullOwner: "Robert Turner",
    title: "President",
    phone: "(904) 396-7044",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 3
  },
  {
    company: "Couf Plumbing",
    owner: "Larry",
    fullOwner: "Larry Couf",
    title: "Founder & Master Plumber",
    phone: "(904) 635-2500",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 2
  },
  {
    company: "Touchton Plumbing Contractors",
    owner: "Mark",
    fullOwner: "Mark Touchton",
    title: "President & Qualifier",
    phone: "(904) 389-9299",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 2
  },
  {
    company: "Bill Fenwick Plumbing",
    owner: "Bill",
    fullOwner: "Bill Fenwick",
    title: "Founder & Owner",
    phone: "(904) 724-9082",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 3
  },
  {
    company: "Advantage Plumbing",
    owner: "Chris",
    fullOwner: "Chris Evans",
    title: "Operations Manager",
    phone: "(904) 247-9848",
    city: "Atlantic Beach, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 2
  },
  {
    company: "Harry L. Hayes Plumbing, Inc.",
    owner: "Harry",
    fullOwner: "Harry L. Hayes",
    title: "Owner & Lead Plumber",
    phone: "(904) 723-5609",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 2
  },
  {
    company: "American Plumbing Contractors, Inc.",
    owner: "Gary",
    fullOwner: "Gary Johnson",
    title: "President",
    phone: "(904) 745-1693",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 2
  },
  {
    company: "Miller Electric Company",
    owner: "Edward",
    fullOwner: "Edward Witt Jr.",
    title: "Chief Executive Officer",
    phone: "(904) 388-8000",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Electrical",
    employees: 4
  },
  {
    company: "Cogburn Brothers, Inc.",
    owner: "Chandler",
    fullOwner: "Chandler Crews",
    title: "Executive Director",
    phone: "(904) 358-7344",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Electrical",
    employees: 3
  },
  {
    company: "American Electrical Contracting, Inc.",
    owner: "Brian",
    fullOwner: "Brian Scott",
    title: "President",
    phone: "(904) 737-7770",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Electrical",
    employees: 3
  },
  {
    company: "Advanced Electrical Solutions, Inc.",
    owner: "Terry",
    fullOwner: "Terry W. McKerchie",
    title: "President",
    phone: "(904) 748-4477",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Electrical",
    employees: 2
  },
  {
    company: "Mardant Electrical",
    owner: "Roy",
    fullOwner: "Roy Boone",
    title: "Managing Owner",
    phone: "(904) 363-0200",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Electrical",
    employees: 2
  },
  {
    company: "Advanced Electric of North Florida",
    owner: "Kevin",
    fullOwner: "Kevin Stewart",
    title: "Owner",
    phone: "(904) 744-4446",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Electrical",
    employees: 2
  },
  {
    company: "Wallace Electric Company",
    owner: "Brock",
    fullOwner: "Brock Wallace",
    title: "Owner & Master Electrician",
    phone: "(904) 610-0983",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Electrical",
    employees: 2
  },
  {
    company: "Legacy Power Solutions",
    owner: "Richard",
    fullOwner: "Richard Rewis",
    title: "Managing Partner",
    phone: "(904) 669-6412",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Electrical",
    employees: 2
  },
  {
    company: "Coastal Elite LLC",
    owner: "Jim",
    fullOwner: "Jim Simko",
    title: "Owner",
    phone: "(904) 438-4050",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Electrical",
    employees: 2
  },
  {
    company: "Empire Electric",
    owner: "Dan",
    fullOwner: "Dan Mitchell",
    title: "Master Electrician / Owner",
    phone: "(904) 724-3400",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Electrical",
    employees: 2
  },
  {
    company: "Crawford Electric",
    owner: "Steve",
    fullOwner: "Steve Crawford",
    title: "President",
    phone: "(904) 246-3500",
    city: "Jacksonville Beach, FL",
    state: "FL",
    trade: "Electrical",
    employees: 2
  },
  {
    company: "NexGen Roofing",
    owner: "Brandon",
    fullOwner: "Brandon T. Cornellier",
    title: "Owner / Principal",
    phone: "(904) 802-7150",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Roofing",
    employees: 3
  },
  {
    company: "Perry Roofing Contractors",
    owner: "David",
    fullOwner: "David Kniseley",
    title: "Managing Principal",
    phone: "(904) 830-6826",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Roofing",
    employees: 3
  },
  {
    company: "Trinity Restoration & Roofing",
    owner: "Rosie",
    fullOwner: "Rosie Grose",
    title: "Vice President & Owner",
    phone: "(904) 763-2006",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Roofing",
    employees: 2
  },
  {
    company: "Benton Integrity Roofing Systems",
    owner: "John",
    fullOwner: "John Benton",
    title: "President",
    phone: "(904) 262-7663",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Roofing",
    employees: 2
  },
  {
    company: "Effective Roofing",
    owner: "Mike",
    fullOwner: "Mike Thomas",
    title: "Owner",
    phone: "(904) 352-6431",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Roofing",
    employees: 2
  },
  {
    company: "Elo Roofing",
    owner: "Kyle",
    fullOwner: "Kyle Wilson",
    title: "Managing Partner",
    phone: "(904) 528-0188",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Roofing",
    employees: 3
  },
  {
    company: "JBL Roofing LLC",
    owner: "Jason",
    fullOwner: "Jason Lee",
    title: "Owner & Qualifier",
    phone: "(904) 381-0074",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Roofing",
    employees: 2
  },
  {
    company: "Schick Roofing",
    owner: "Paul",
    fullOwner: "Paul Schick",
    title: "Owner & Founder",
    phone: "(407) 749-0808",
    city: "Orlando, FL",
    state: "FL",
    trade: "Roofing",
    employees: 3
  },
  {
    company: "A&T Roofing and Exteriors LLC",
    owner: "Todd",
    fullOwner: "Todd Baker",
    title: "Owner",
    phone: "(904) 365-3828",
    city: "Jacksonville, FL",
    state: "FL",
    trade: "Roofing",
    employees: 2
  },
  {
    company: "Pro-Tech Air Conditioning & Plumbing Service",
    owner: "Steve",
    fullOwner: "Steve Parker",
    title: "General Manager",
    phone: "(407) 270-2992",
    city: "Orlando, FL",
    state: "FL",
    trade: "HVAC",
    employees: 3
  },
  {
    company: "Empire Electrical Contractors, LLC",
    owner: "Daniel",
    fullOwner: "Daniel Ortiz",
    title: "Owner & Qualifier",
    phone: "(407) 930-3736",
    city: "Orlando, FL",
    state: "FL",
    trade: "Electrical",
    employees: 3
  },
  {
    company: "AC's Heating & Air LLC",
    owner: "Allen",
    fullOwner: "Allen Chennault",
    title: "Owner & Qualifier",
    phone: "(407) 440-0105",
    city: "Orlando, FL",
    state: "FL",
    trade: "HVAC",
    employees: 2
  },
  {
    company: "Allegiance Plumbing",
    owner: "Rob",
    fullOwner: "Rob Upenieks",
    title: "Master Plumber & Owner",
    phone: "(407) 725-4961",
    city: "Orlando, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 2
  },
  {
    company: "Shamrock Plumbing and Drain Cleaning Inc.",
    owner: "Patrick",
    fullOwner: "Patrick Kelly",
    title: "President & Owner",
    phone: "(407) 603-8977",
    city: "Orlando, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 2
  },
  {
    company: "Michael's Plumbing of Central Florida Inc.",
    owner: "Michael",
    fullOwner: "Michael Reynolds",
    title: "President & Master Plumber",
    phone: "(407) 219-9772",
    city: "Orlando, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 3
  },
  {
    company: "Coolair Air Conditioning & Heating",
    owner: "Mark",
    fullOwner: "Mark Anderson",
    title: "Owner & Partner",
    phone: "(239) 275-7077",
    city: "Fort Myers, FL",
    state: "FL",
    trade: "HVAC",
    employees: 3
  },
  {
    company: "Rohaley & Sons Plumbing Contractors",
    owner: "Nathan",
    fullOwner: "Nathan Hopkins",
    title: "Operations Director",
    phone: "(239) 437-0123",
    city: "Fort Myers, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 3
  },
  {
    company: "F&F Refrigeration & Air Conditioning Services Inc.",
    owner: "Dalton",
    fullOwner: "Dalton Flint",
    title: "Founder & Qualifier",
    phone: "(239) 270-1293",
    city: "Fort Myers, FL",
    state: "FL",
    trade: "HVAC",
    employees: 2
  },
  {
    company: "Plumbing, Cooling & Electrical Nerds",
    owner: "John",
    fullOwner: "John Milligan",
    title: "Chief Operating Officer",
    phone: "(239) 427-2127",
    city: "Fort Myers, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 3
  },
  {
    company: "ACRA Electric, Inc.",
    owner: "Robert",
    fullOwner: "Robert Cammick",
    title: "President",
    phone: "(239) 542-1624",
    city: "Cape Coral, FL",
    state: "FL",
    trade: "Electrical",
    employees: 3
  },
  {
    company: "Collier Electric Company of Fort Myers",
    owner: "Dan",
    fullOwner: "Dan Collier",
    title: "President & Owner",
    phone: "(239) 275-7888",
    city: "Fort Myers, FL",
    state: "FL",
    trade: "Electrical",
    employees: 2
  },
  {
    company: "Gator Electrical Contractors",
    owner: "Bruce",
    fullOwner: "Bruce Taylor",
    title: "Master Electrician / Owner",
    phone: "(239) 772-2131",
    city: "Cape Coral, FL",
    state: "FL",
    trade: "Electrical",
    employees: 2
  },
  {
    company: "Kirkwood Electric",
    owner: "Randy",
    fullOwner: "Randy Kirkwood",
    title: "Owner & Lead Qualifier",
    phone: "(239) 574-3449",
    city: "Cape Coral, FL",
    state: "FL",
    trade: "Electrical",
    employees: 2
  },
  {
    company: "NCS Electric Inc.",
    owner: "Nelson",
    fullOwner: "Nelson Santos",
    title: "President",
    phone: "(239) 573-3456",
    city: "Cape Coral, FL",
    state: "FL",
    trade: "Electrical",
    employees: 2
  },
  {
    company: "Pride Plumbing Co.",
    owner: "Matthew",
    fullOwner: "Matthew Pride",
    title: "Owner & Master Plumber",
    phone: "(239) 209-8124",
    city: "Cape Coral, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 2
  },
  {
    company: "Kenneth Lee Cutlip Plumbing",
    owner: "Kenneth",
    fullOwner: "Kenneth Cutlip",
    title: "Owner / Qualifier",
    phone: "(239) 690-2988",
    city: "Fort Myers, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 2
  },
  {
    company: "Snook's Services LLC",
    owner: "Dave",
    fullOwner: "Dave Snook",
    title: "Owner & Lead Plumber",
    phone: "(239) 887-8557",
    city: "North Fort Myers, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 2
  },
  {
    company: "VIP Plumbing Solutions LLC",
    owner: "Victor",
    fullOwner: "Victor Perez",
    title: "Managing Owner",
    phone: "(239) 292-7318",
    city: "Lehigh Acres, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 2
  },
  {
    company: "Roman Roofing",
    owner: "Norm",
    fullOwner: "Norm Roman",
    title: "President & Founder",
    phone: "(239) 458-7663",
    city: "Cape Coral, FL",
    state: "FL",
    trade: "Roofing",
    employees: 3
  },
  {
    company: "Aqua Plumbing & Air",
    owner: "Chuck",
    fullOwner: "Chuck Jacobson",
    title: "Partner & Operations Director",
    phone: "(941) 366-7676",
    city: "Sarasota, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 3
  },
  {
    company: "R.O.H. Mechanical LLC",
    owner: "Richard",
    fullOwner: "Richard O. Hughes",
    title: "Owner & Lead Qualifier",
    phone: "(941) 779-6076",
    city: "Bradenton, FL",
    state: "FL",
    trade: "HVAC",
    employees: 2
  },
  {
    company: "McDonald Home Services",
    owner: "Jim",
    fullOwner: "Jim McDonald",
    title: "Owner",
    phone: "(941) 360-9898",
    city: "Sarasota, FL",
    state: "FL",
    trade: "HVAC",
    employees: 3
  },
  {
    company: "Air & Energy",
    owner: "Stewart",
    fullOwner: "Stewart Moon",
    title: "Vice President",
    phone: "(941) 778-0773",
    city: "Bradenton, FL",
    state: "FL",
    trade: "HVAC",
    employees: 3
  },
  {
    company: "Fox Plumbing Services Inc.",
    owner: "Amos",
    fullOwner: "Amos Fox",
    title: "Founder & Master Plumber",
    phone: "(941) 377-4477",
    city: "Sarasota, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 2
  },
  {
    company: "Professional Plumbing & Design",
    owner: "Matt",
    fullOwner: "Matt Edwards",
    title: "General Manager",
    phone: "(941) 355-5400",
    city: "Sarasota, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 3
  },
  {
    company: "Drain Clean Heroes",
    owner: "Brad",
    fullOwner: "Brad Miller",
    title: "Lead Qualifier & Owner",
    phone: "(941) 720-7487",
    city: "Bradenton, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 2
  },
  {
    company: "LT Plumbing LLC",
    owner: "Larry",
    fullOwner: "Larry Turner",
    title: "Owner",
    phone: "(941) 729-1111",
    city: "Palmetto, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 2
  },
  {
    company: "Conditioned Air",
    owner: "Tim",
    fullOwner: "Tim Dupre",
    title: "President & CEO",
    phone: "(941) 893-6450",
    city: "Nokomis, FL",
    state: "FL",
    trade: "HVAC",
    employees: 3
  },
  {
    company: "C & S Heating and Cooling",
    owner: "Chris",
    fullOwner: "Chris Simmons",
    title: "Owner",
    phone: "(941) 350-7109",
    city: "Bradenton, FL",
    state: "FL",
    trade: "HVAC",
    employees: 2
  },
  {
    company: "Cooper's Plumbing & Air",
    owner: "Justin",
    fullOwner: "Justin Cooper",
    title: "Owner & General Manager",
    phone: "(850) 616-7969",
    city: "Tallahassee, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 3
  },
  {
    company: "Watts Cooling, Heating & Plumbing",
    owner: "Donald",
    fullOwner: "Donald Watts",
    title: "President & Owner",
    phone: "(850) 224-4822",
    city: "Tallahassee, FL",
    state: "FL",
    trade: "HVAC",
    employees: 2
  },
  {
    company: "AND Services",
    owner: "Andrew",
    fullOwner: "Andrew Nelson",
    title: "Managing Partner",
    phone: "(850) 805-6455",
    city: "Tallahassee, FL",
    state: "FL",
    trade: "HVAC",
    employees: 2
  },
  {
    company: "Patrick's Heating & Air Conditioning",
    owner: "Patrick",
    fullOwner: "Patrick Miller",
    title: "Owner",
    phone: "(352) 329-3740",
    city: "Gainesville, FL",
    state: "FL",
    trade: "HVAC",
    employees: 2
  },
  {
    company: "Peaden Air Conditioning, Plumbing & Electrical",
    owner: "Glenn",
    fullOwner: "Glenn Peaden",
    title: "Founder / Executive Director",
    phone: "(850) 215-3973",
    city: "Panama City, FL",
    state: "FL",
    trade: "HVAC",
    employees: 3
  },
  {
    company: "A Superior Mechanical",
    owner: "Jim",
    fullOwner: "Jim Rogers",
    title: "President",
    phone: "(850) 258-3225",
    city: "Panama City Beach, FL",
    state: "FL",
    trade: "HVAC",
    employees: 2
  },
  {
    company: "Holiday Beach Companies",
    owner: "Dave",
    fullOwner: "Dave Wilson",
    title: "General Manager",
    phone: "(850) 271-5999",
    city: "Panama City Beach, FL",
    state: "FL",
    trade: "Electrical",
    employees: 2
  },
  {
    company: "System Service & Engineering, Inc.",
    owner: "Mark",
    fullOwner: "Mark Thompson",
    title: "President",
    phone: "(850) 441-3458",
    city: "Lynn Haven, FL",
    state: "FL",
    trade: "HVAC",
    employees: 2
  },
  {
    company: "Prime Plumbing & Septic Services",
    owner: "Tyler",
    fullOwner: "Tyler Brooks",
    title: "Owner",
    phone: "(850) 202-2749",
    city: "Panama City, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 2
  },
  {
    company: "Benefield Plumbing",
    owner: "Larry",
    fullOwner: "Larry Benefield",
    title: "Master Plumber & Owner",
    phone: "(850) 271-3887",
    city: "Southport, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 2
  }
];

const PRODUCTS_SEQUENCE = ['bundle', 'basic', 'scale', 'ava', 'website', 'speed', 'aeo'];

const SERVICES_MAP = {
  bundle: 'Accelerate Growth Engine: 24/7 Ava Voice AI + 90s SMS Speed-to-Lead + Custom Mobile Website + AEO',
  basic: 'Basic Package: AI Front Desk (24/7 Ava Voice AI Receptionist & Emergency Triage)',
  scale: 'Scale Enterprise Tier: Multi-Crew Autonomous Infrastructure, Bilingual Dispatch & CRM Integration',
  ava: 'Ava 24/7 Voice AI Receptionist (<1s instant pickup & technician SMS dispatch)',
  website: 'Custom High-Converting Mobile Website (<1s load time, tap-to-call & instant booking)',
  speed: 'LeadFlow 90-Second SMS Speed-to-Lead and Missed-Call Recovery Engine',
  aeo: 'AEO Engine™ & Google Review Dominance (Siri, ChatGPT & Google Map Pack Top 3)'
};

const PAIN_POINTS = {
  HVAC: 'Losing $8,000+ AC replacement and weekend emergency service calls to competitors on Google Maps',
  Plumbing: 'After-hours emergency burst pipe and sewer backup calls rolling to voicemail while crew is on job sites',
  Electrical: 'Emergency panel outage and commercial wiring service calls dropping to voicemail during peak storm spikes',
  Roofing: 'Storm damage and emergency leak replacement calls dropping to competitor who answers in 1 ring'
};

const PITCH_ANGLES = {
  HVAC: 'is actively in the field or in the truck with a small crew. When emergency AC breakdown calls ring on a 95°F afternoon, they drop $8,000+ system replacement jobs if voicemail picks up. Ava gives them 24/7 front desk coverage for $397/mo.',
  Plumbing: 'is actively under a sink or on a commercial sewer repipe. When high-ticket emergency calls ring, homeowners hang up on voicemail and call the next listing. Ava catches them in under 1 second.',
  Electrical: 'is up on a lift or rewiring a commercial breaker panel. Dropping high-margin emergency panel replacements costs thousands each week. Ava triages and SMS-dispatches the on-call tech.',
  Roofing: 'is up on a roof or inspecting storm leaks. When insurance roof replacement leads call in, speed-to-lead is everything. Ava engages in under 1 second and locks the estimate.'
};

// Generate normalized lead objects
const formattedNewLeads = RAW_75_LEADS.map((raw, index) => {
  const prod = PRODUCTS_SEQUENCE[index % PRODUCTS_SEQUENCE.length];
  const emp = raw.employees || 2;
  const is3Staff = emp >= 3;
  const leadNum = 272 + index;
  const id = `fl_ver_${String(leadNum).padStart(3, '0')}`;

  const monthlyLoss = is3Staff ? 9900 : 9100;
  const annualLoss = monthlyLoss * 12;
  const netSavings = is3Staff ? 110436 : 100836;

  return {
    id: id,
    company: raw.company,
    owner: raw.owner,
    fullOwner: raw.fullOwner,
    title: raw.title,
    phone: raw.phone,
    city: raw.city,
    state: raw.state,
    trade: raw.trade,
    employees: emp,
    service: SERVICES_MAP[prod],
    product: prod,
    monthlyLoss: monthlyLoss,
    annualLoss: annualLoss,
    netSavings: netSavings,
    painPoint: PAIN_POINTS[raw.trade] || PAIN_POINTS.HVAC,
    batch: 3,
    employeeTier: is3Staff ? 'smallCrew' : 'smallCrew',
    employeeTierName: `${emp} Staff · Owner in Field`,
    employeeLabel: `${emp} Staff - Small Local Sweet Spot`,
    employeeBadge: `${emp} Staff (Small Crew)`,
    isSmallLocalBiz: true,
    smallBizPitchAngle: `${raw.owner} ${PITCH_ANGLES[raw.trade] || PITCH_ANGLES.HVAC}`
  };
});

console.log(`Generated ${formattedNewLeads.length} verified real contractor leads!`);

// 1. Prepare base 271 leads and patch fl_se_053 to Mokher Plumbing Company (removing older duplicate)
const realLeadsPath = path.join(__dirname, '..', 'data', 'real_verified_leads.json');
let existingReal = JSON.parse(fs.readFileSync(realLeadsPath, 'utf8')).slice(0, 271);

// Patch fl_se_053 to Mokher Plumbing Company
const idxFlSe053 = existingReal.findIndex(l => l.id === 'fl_se_053');
if (idxFlSe053 !== -1) {
  existingReal[idxFlSe053] = Object.assign({}, existingReal[idxFlSe053], {
    company: "Mokher Plumbing Company",
    owner: "Scott",
    fullOwner: "Scott Mokher",
    title: "President & Master Plumber",
    phone: "(305) 446-8266",
    city: "Miami, FL",
    state: "FL",
    trade: "Plumbing",
    employees: 3,
    service: "Custom High-Converting Mobile Website (<1s load time, tap-to-call & instant booking)",
    product: "website",
    monthlyLoss: 9900,
    annualLoss: 118800,
    netSavings: 110436,
    painPoint: "Mobile website loading delay over 5s with high bounce rate and no sticky tap-to-call",
    employeeTier: "smallCrew",
    employeeTierName: "3 Staff · Owner in Field",
    employeeLabel: "3 Staff - Small Local Sweet Spot",
    employeeBadge: "3 Staff (Small Crew)",
    isSmallLocalBiz: true,
    smallBizPitchAngle: "Scott is actively in the field or in the truck with a crew of 3. When emergency plumbing calls ring on a busy day, homeowners hang up on slow mobile pages and call the next listing. Ava catches them in under 1 second."
  });
}

const combinedReal = existingReal.concat(formattedNewLeads);
fs.writeFileSync(realLeadsPath, JSON.stringify(combinedReal, null, 2), 'utf8');
console.log(`✓ Updated data/real_verified_leads.json: now has ${combinedReal.length} leads (added ${formattedNewLeads.length})`);

// 2. Update data/normalized_lead_targets.json
const normLeadsPath = path.join(__dirname, '..', 'data', 'normalized_lead_targets.json');
fs.writeFileSync(normLeadsPath, JSON.stringify(combinedReal, null, 2), 'utf8');
console.log(`✓ Updated data/normalized_lead_targets.json: now has ${combinedReal.length} leads (added ${formattedNewLeads.length})`);

// 3. Update website/cold-call-arena/index.html
const arenaPath = path.join(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
let arenaHtml = fs.readFileSync(arenaPath, 'utf8');

const leadsStartMarker = 'const LEADS_DATA = [';
const idxStart = arenaHtml.indexOf(leadsStartMarker);
if (idxStart === -1) {
  console.error('Cannot find const LEADS_DATA = [ in arenaHtml');
  process.exit(1);
}
const idxEnd = arenaHtml.indexOf('];', idxStart) + 2;

const newLeadsDataJson = `const LEADS_DATA = ${JSON.stringify(combinedReal, null, 2)};`;
arenaHtml = arenaHtml.substring(0, idxStart) + newLeadsDataJson + arenaHtml.substring(idxEnd);

fs.writeFileSync(arenaPath, arenaHtml, 'utf8');
console.log(`✓ Updated website/cold-call-arena/index.html with all ${combinedReal.length} verified real leads!`);
