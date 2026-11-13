const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

async function buildPresentation() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches
  pptx.title = 'PRO-TECH AIR SERVICES LLC x VantorX Solutions Proposal';
  pptx.author = 'Carter Mccullohs';
  pptx.company = 'VantorX Solutions';

  // Theme Colors
  const BG_DARK = '0B0F16';
  const CARD_BG = '172033';
  const BORDER_COLOR = '334155';
  const GOLD = 'F59E0B';
  const GOLD_LIGHT = 'FDE68A';
  const CYAN = '38BDF8';
  const WHITE = 'FFFFFF';
  const TEXT_MUTED = '94A3B8';
  const GREEN = '10B981';
  const RED = 'F43F5E';

  // Asset paths
  const WEB_MOCKUP_PATH = path.join(__dirname, '..', 'website', 'assets', 'pro_tech_website_mockup.png');
  const CRM_MOCKUP_PATH = path.join(__dirname, '..', 'website', 'assets', 'leadflow_crm_ui_mockup.png');
  const AEO_INFOGRAPHIC_PATH = path.join(__dirname, '..', 'website', 'assets', 'aeo_search_infographic.png');
  const REV_INFOGRAPHIC_PATH = path.join(__dirname, '..', 'website', 'assets', 'google_review_accelerator_infographic.png');

  // ==========================================
  // SLIDE 1: TITLE SLIDE (Carter Mccullohs x Carlin Oates)
  // ==========================================
  const s1 = pptx.addSlide();
  s1.background = { color: BG_DARK };

  s1.addText('STRATEGIC GROWTH & 24/7 FRONT-OFFICE INFRASTRUCTURE', {
    x: 0.8, y: 0.6, w: 8.4, h: 0.35,
    fontSize: 11, fontFace: 'Arial', color: CYAN, bold: true, letterSpacing: 2
  });

  s1.addText('PRO-TECH AIR SERVICES LLC', {
    x: 0.8, y: 1.0, w: 8.4, h: 0.9,
    fontSize: 38, fontFace: 'Arial', color: WHITE, bold: true
  });

  s1.addText('24/7 Operations, Speed-to-Lead & High-Converting Web Infrastructure', {
    x: 0.8, y: 1.9, w: 8.4, h: 0.5,
    fontSize: 16, fontFace: 'Arial', color: GOLD_LIGHT
  });

  s1.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 2.7, w: 8.4, h: 2.3,
    fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1.5 }, rectRadius: 0.15
  });

  s1.addText('PROPOSAL DOSSIER & PARTICIPANTS', {
    x: 1.1, y: 2.9, w: 7.8, h: 0.3,
    fontSize: 11, fontFace: 'Arial', color: GOLD, bold: true, letterSpacing: 1.5
  });

  s1.addText([
    { text: 'Prepared By:\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: 'Carter Mccullohs\n', options: { color: WHITE, fontSize: 16, bold: true } },
    { text: 'Founder & Managing Director\n', options: { color: CYAN, fontSize: 12 } },
    { text: 'VantorX Solutions LLC', options: { color: TEXT_MUTED, fontSize: 12 } }
  ], { x: 1.1, y: 3.3, w: 3.6, h: 1.5 });

  s1.addText([
    { text: 'Prepared Specifically For:\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: 'Carlin Oates\n', options: { color: WHITE, fontSize: 16, bold: true } },
    { text: 'Owner, PRO-TECH AIR SERVICES LLC\n', options: { color: GOLD_LIGHT, fontSize: 12 } },
    { text: '540 NW 111st, Miami, FL 33168 · November 13, 2026', options: { color: TEXT_MUTED, fontSize: 12 } }
  ], { x: 5.0, y: 3.3, w: 4.0, h: 1.5 });

  // ==========================================
  // SLIDE 2: THE MIAMI HVAC BLEED & VOICEMAIL REALITY
  // ==========================================
  const s2 = pptx.addSlide();
  s2.background = { color: BG_DARK };

  s2.addText('THE PROBLEM · SOUTH FLORIDA HVAC INDUSTRY REALITY', {
    x: 0.8, y: 0.5, w: 8.4, h: 0.3,
    fontSize: 11, fontFace: 'Arial', color: RED, bold: true, letterSpacing: 1.5
  });

  s2.addText('The Math Behind The "Voicemail Graveyard"', {
    x: 0.8, y: 0.8, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: 'Arial', color: WHITE, bold: true
  });

  s2.addText('In Miami\'s 92° heat & 85% humidity, an AC outage is an emergency panic call. When callers hit voicemail, 85% hang up instantly and hire the next contractor on Google Maps.', {
    x: 0.8, y: 1.4, w: 8.4, h: 0.55,
    fontSize: 13, fontFace: 'Arial', color: TEXT_MUTED
  });

  const metrics = [
    { label: 'AVG EMERGENCY REPAIR', val: '$550', desc: 'Capacitor, coil leak, freon recharge, or blower motor diagnostic.', col: CYAN },
    { label: 'FULL SYSTEM REPLACEMENT', val: '$8,500', desc: 'Complete 3 to 5-ton heat pump or straight-cool condenser & air handler.', col: GOLD },
    { label: '3 MISSED CALLS / MO', val: '-$25,500', desc: 'Direct revenue lost every 30 days when calls roll to voicemail while crew is on site.', col: RED }
  ];

  metrics.forEach((m, idx) => {
    const xPos = 0.8 + idx * 2.9;
    s2.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: 2.1, w: 2.7, h: 2.0,
      fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1.5 }, rectRadius: 0.12
    });

    s2.addText(m.label, {
      x: xPos + 0.15, y: 2.25, w: 2.4, h: 0.25,
      fontSize: 9.5, fontFace: 'Arial', color: m.col, bold: true
    });

    s2.addText(m.val, {
      x: xPos + 0.15, y: 2.55, w: 2.4, h: 0.65,
      fontSize: 32, fontFace: 'Arial', color: m.col, bold: true
    });

    s2.addText(m.desc, {
      x: xPos + 0.15, y: 3.25, w: 2.4, h: 0.75,
      fontSize: 11, fontFace: 'Arial', color: TEXT_MUTED
    });
  });

  s2.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 4.3, w: 8.4, h: 0.9,
    fill: { color: '1E1B4B' }, line: { color: '4338CA', width: 1.5 }, rectRadius: 0.12
  });

  s2.addText([
    { text: '🚨 The Miami Rule: ', options: { bold: true, color: GOLD_LIGHT } },
    { text: 'Homeowners never wait for an HVAC contractor to listen to voicemail at 6:30 PM. ', options: { color: WHITE } },
    { text: 'Whoever answers on Ring 1 wins the job and wins the $8,500 replacement ticket.', options: { bold: true, color: CYAN } }
  ], { x: 1.0, y: 4.4, w: 8.0, h: 0.7, fontSize: 12.5 });

  // ==========================================
  // SLIDE 3: FEATURE 1 INFOGRAPHIC — CUSTOM WEBSITE & ESTIMATOR
  // ==========================================
  const s3 = pptx.addSlide();
  s3.background = { color: BG_DARK };

  s3.addText('FEATURE 1 · HIGH-CONVERTING MOBILE INFRASTRUCTURE (NO PRICES)', {
    x: 0.8, y: 0.45, w: 8.4, h: 0.25,
    fontSize: 11, fontFace: 'Arial', color: CYAN, bold: true, letterSpacing: 1.5
  });

  s3.addText('Sub-Second Custom Website & Ballpark Estimator', {
    x: 0.8, y: 0.75, w: 8.4, h: 0.5,
    fontSize: 26, fontFace: 'Arial', color: WHITE, bold: true
  });

  if (fs.existsSync(WEB_MOCKUP_PATH)) {
    s3.addImage({
      path: WEB_MOCKUP_PATH,
      x: 0.8, y: 1.35, w: 5.2, h: 3.8
    });
  }

  s3.addShape(pptx.ShapeType.roundRect, {
    x: 6.2, y: 1.35, w: 3.0, h: 3.8,
    fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1.5 }, rectRadius: 0.12
  });

  s3.addText('PURPOSE & OPERATIONAL BENEFITS', {
    x: 6.35, y: 1.5, w: 2.7, h: 0.25,
    fontSize: 10, fontFace: 'Arial', color: GOLD, bold: true
  });

  s3.addText([
    { text: '⚡ 0.6s Sub-Second Speed:\n', options: { bold: true, color: WHITE, fontSize: 12 } },
    { text: 'Loads 5x faster than competitors. Google rewards ultra-fast mobile sites with higher organic Maps rank.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '🧮 Interactive Ballpark Estimator:\n', options: { bold: true, color: WHITE, fontSize: 12 } },
    { text: 'Captures homeowner name and phone number before they can leave to look at another contractor.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '📞 1-Tap Emergency Calling:\n', options: { bold: true, color: WHITE, fontSize: 12 } },
    { text: 'Prominent 24/7 emergency buttons trigger immediate call intake.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '🎨 100% Fully Customizable:\n', options: { bold: true, color: CYAN, fontSize: 12 } },
    { text: 'Tailored to Pro-Tech Air\'s brand colors, license badges, truck photos, and Miami service radius.', options: { color: TEXT_MUTED, fontSize: 10.5 } }
  ], { x: 6.35, y: 1.8, w: 2.7, h: 3.2 });

  // ==========================================
  // SLIDE 4: FEATURE 2 INFOGRAPHIC — AVA 24/7 VOICE AI RECEPTIONIST
  // ==========================================
  const s4 = pptx.addSlide();
  s4.background = { color: BG_DARK };

  s4.addText('FEATURE 2 · 24/7/365 AI VOICE RECEPTIONIST (NO PRICES)', {
    x: 0.8, y: 0.45, w: 8.4, h: 0.25,
    fontSize: 11, fontFace: 'Arial', color: CYAN, bold: true, letterSpacing: 1.5
  });

  s4.addText('Ava 24/7 Voice AI: Never Lose Another Call to Voicemail', {
    x: 0.8, y: 0.75, w: 8.4, h: 0.5,
    fontSize: 26, fontFace: 'Arial', color: WHITE, bold: true
  });

  const avaFeats = [
    { title: '1-Ring Instant Pickup 24/7/365', desc: 'No hold music, no robotic menus. Speaks naturally with human-grade conversational flow.' },
    { title: 'Bilingual Spanish & English Detection', desc: 'Detects caller language in 0.4 seconds. Essential for Miami-Dade demographics.' },
    { title: 'Instant Priority SMS Tech Dossier', desc: 'Carlin\'s phone buzzes with caller name, address, and AC issue in <10 seconds.' },
    { title: 'Live Calendar Booking & CRM Sync', desc: 'Schedules emergency inspection slots directly onto Google or Outlook calendar.' }
  ];

  avaFeats.forEach((f, idx) => {
    const yPos = 1.35 + idx * 0.95;
    s4.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: yPos, w: 4.1, h: 0.85,
      fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1.2 }, rectRadius: 0.1
    });

    s4.addText(f.title, {
      x: 0.95, y: yPos + 0.1, w: 3.8, h: 0.3,
      fontSize: 12, fontFace: 'Arial', color: GOLD_LIGHT, bold: true
    });

    s4.addText(f.desc, {
      x: 0.95, y: yPos + 0.4, w: 3.8, h: 0.4,
      fontSize: 10.5, fontFace: 'Arial', color: TEXT_MUTED
    });
  });

  s4.addShape(pptx.ShapeType.roundRect, {
    x: 5.1, y: 1.35, w: 4.1, h: 3.8,
    fill: { color: '030712' }, line: { color: '1E3A8A', width: 1.5 }, rectRadius: 0.12
  });

  s4.addText('REAL-WORLD AVA CONVERSATION LOG (MIAMI, FL)', {
    x: 5.3, y: 1.5, w: 3.7, h: 0.25,
    fontSize: 10, fontFace: 'Arial', color: CYAN, bold: true
  });

  s4.addText([
    { text: 'Ava: ', options: { bold: true, color: CYAN, fontSize: 11.5 } },
    { text: '"Thank you for calling Pro-Tech Air Services, Miami\'s 24/7 air conditioning emergency team. My name is Ava. I see you\'re calling our Miami office — is your AC currently blowing warm air or leaking water, or are you calling to schedule routine maintenance?"\n\n', options: { color: WHITE, fontSize: 11 } },
    { text: 'Homeowner: ', options: { bold: true, color: GOLD, fontSize: 11.5 } },
    { text: '"Water is dripping through our hallway ceiling from the air handler! It\'s 87 degrees inside and getting worse."\n\n', options: { color: WHITE, fontSize: 11 } },
    { text: 'Ava: ', options: { bold: true, color: CYAN, fontSize: 11.5 } },
    { text: '"I understand completely, that is an urgent priority. I have our on-call Miami technician alerted. What is your street address so I can dispatch Carlin\'s crew right away?"', options: { color: WHITE, fontSize: 11 } }
  ], { x: 5.3, y: 1.85, w: 3.7, h: 3.1 });

  // ==========================================
  // SLIDE 5: FEATURE 3 DEMO — DIAL AVA LIVE
  // ==========================================
  const s5 = pptx.addSlide();
  s5.background = { color: BG_DARK };

  s5.addText('INTERACTIVE PROOF · TEST IT RIGHT NOW ON SPEAKERPHONE', {
    x: 0.8, y: 0.5, w: 8.4, h: 0.3,
    fontSize: 11, fontFace: 'Arial', color: GREEN, bold: true, letterSpacing: 1.5
  });

  s5.addText('Don\'t Take My Word For It. Dial AVA Live On Speaker.', {
    x: 0.8, y: 0.8, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: 'Arial', color: WHITE, bold: true
  });

  s5.addShape(pptx.ShapeType.roundRect, {
    x: 1.2, y: 1.6, w: 7.6, h: 3.5,
    fill: { color: CARD_BG }, line: { color: GOLD, width: 2.5 }, rectRadius: 0.2
  });

  s5.addText('LIVE PRODUCTION TEST LINE (ACTIVE 24/7/365)', {
    x: 1.5, y: 1.85, w: 7.0, h: 0.3,
    fontSize: 12, fontFace: 'Arial', color: GOLD, bold: true, align: 'center', letterSpacing: 2
  });

  s5.addText('(561) 813-8602', {
    x: 1.5, y: 2.2, w: 7.0, h: 1.0,
    fontSize: 52, fontFace: 'Arial', color: WHITE, bold: true, align: 'center'
  });

  s5.addText([
    { text: '👉 What to do right now, Carlin:\n', options: { bold: true, color: CYAN, fontSize: 14 } },
    { text: '1. Put your phone on speakerphone and dial the number above.\n', options: { color: WHITE, fontSize: 13 } },
    { text: '2. Tell Ava your AC in Miami is leaking freon and blowing warm air.\n', options: { color: WHITE, fontSize: 13 } },
    { text: '3. Test her in English or Spanish — experience what your customers hear at 9:30 PM tonight.', options: { color: TEXT_MUTED, fontSize: 13 } }
  ], { x: 1.5, y: 3.2, w: 7.0, h: 1.6, align: 'center' });

  // ==========================================
  // SLIDE 6: FEATURE 4 INFOGRAPHIC — LEADFLOW CRM & UI MOCKUP
  // ==========================================
  const s6 = pptx.addSlide();
  s6.background = { color: BG_DARK };

  s6.addText('FEATURE 4 · SPEED-TO-LEAD & CRM ENGINE (NO PRICES)', {
    x: 0.8, y: 0.45, w: 8.4, h: 0.25,
    fontSize: 11, fontFace: 'Arial', color: CYAN, bold: true, letterSpacing: 1.5
  });

  s6.addText('LeadFlow CRM: 45-Second Speed-to-Lead & Live Pipeline UI', {
    x: 0.8, y: 0.75, w: 8.4, h: 0.5,
    fontSize: 25, fontFace: 'Arial', color: WHITE, bold: true
  });

  if (fs.existsSync(CRM_MOCKUP_PATH)) {
    s6.addImage({
      path: CRM_MOCKUP_PATH,
      x: 0.8, y: 1.35, w: 5.4, h: 3.8
    });
  }

  s6.addShape(pptx.ShapeType.roundRect, {
    x: 6.4, y: 1.35, w: 2.8, h: 3.8,
    fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1.5 }, rectRadius: 0.12
  });

  s6.addText('WHAT THE CRM DOES FOR YOU', {
    x: 6.55, y: 1.5, w: 2.5, h: 0.25,
    fontSize: 10, fontFace: 'Arial', color: GOLD, bold: true
  });

  s6.addText([
    { text: '⚡ 45s Missed-Call Auto-SMS:\n', options: { bold: true, color: WHITE, fontSize: 11.5 } },
    { text: 'The moment a call ends, system texts customer immediately so they don\'t call a competitor.\n\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '📊 4-Stage Visual Kanban:\n', options: { bold: true, color: WHITE, fontSize: 11.5 } },
    { text: 'Inbound calls ➔ Dispatched to Truck ➔ In Progress ➔ 5★ Review Dispatched.\n\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '💬 2-Way Texting From Office:\n', options: { bold: true, color: WHITE, fontSize: 11.5 } },
    { text: 'Text customers from your business line directly through phone or desktop.\n\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '📱 Instant SMS Tech Alerts:\n', options: { bold: true, color: CYAN, fontSize: 11.5 } },
    { text: 'Carlin and technicians receive full caller dossiers right on their cell phones.', options: { color: TEXT_MUTED, fontSize: 10 } }
  ], { x: 6.55, y: 1.8, w: 2.5, h: 3.2 });

  // ==========================================
  // SLIDE 7: FEATURE 5 INFOGRAPHIC — AEO & AI SEARCH ENGINE
  // ==========================================
  const s7 = pptx.addSlide();
  s7.background = { color: BG_DARK };

  s7.addText('FEATURE 5 · AI SEARCH DOMINANCE (NO PRICES)', {
    x: 0.8, y: 0.45, w: 8.4, h: 0.25,
    fontSize: 11, fontFace: 'Arial', color: CYAN, bold: true, letterSpacing: 1.5
  });

  s7.addText('AEO Engine™: Answer Engine Optimization vs. Traditional SEO', {
    x: 0.8, y: 0.75, w: 8.4, h: 0.5,
    fontSize: 25, fontFace: 'Arial', color: WHITE, bold: true
  });

  if (fs.existsSync(AEO_INFOGRAPHIC_PATH)) {
    s7.addImage({
      path: AEO_INFOGRAPHIC_PATH,
      x: 0.8, y: 1.35, w: 5.4, h: 3.8
    });
  }

  s7.addShape(pptx.ShapeType.roundRect, {
    x: 6.4, y: 1.35, w: 2.8, h: 3.8,
    fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1.5 }, rectRadius: 0.12
  });

  s7.addText('HOW AEO WORKS FOR PRO-TECH', {
    x: 6.55, y: 1.5, w: 2.5, h: 0.25,
    fontSize: 10, fontFace: 'Arial', color: GOLD, bold: true
  });

  s7.addText([
    { text: '🤖 The AI Shift in 2026:\n', options: { bold: true, color: WHITE, fontSize: 11.5 } },
    { text: '35% of homeowners now ask ChatGPT, Siri, or Perplexity: "Who is the best 24/7 AC repair in Miami?"\n\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '📄 Hidden Schema Injection:\n', options: { bold: true, color: WHITE, fontSize: 11.5 } },
    { text: 'We code JSON-LD schema into your site so AI crawlers know you are open 24/7 and licensed.\n\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '🌐 llms.txt Knowledge Feed:\n', options: { bold: true, color: WHITE, fontSize: 11.5 } },
    { text: 'A machine-readable knowledge graph summary designed specifically for AI models.\n\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '🏆 Direct Recommendation:\n', options: { bold: true, color: CYAN, fontSize: 11.5 } },
    { text: 'ChatGPT directly recommends Pro-Tech Air instead of dumping a list of 10 competitors.', options: { color: TEXT_MUTED, fontSize: 10 } }
  ], { x: 6.55, y: 1.8, w: 2.5, h: 3.2 });

  // ==========================================
  // SLIDE 8: FEATURE 6 INFOGRAPHIC — GOOGLE REVIEW ACCELERATOR
  // ==========================================
  const s8 = pptx.addSlide();
  s8.background = { color: BG_DARK };

  s8.addText('FEATURE 6 · AUTOMATED REPUTATION ACCELERATOR (NO PRICES)', {
    x: 0.8, y: 0.45, w: 8.4, h: 0.25,
    fontSize: 11, fontFace: 'Arial', color: GOLD, bold: true, letterSpacing: 1.5
  });

  s8.addText('Google Review Accelerator: 15–25 Five-Star Reviews / Month', {
    x: 0.8, y: 0.75, w: 8.4, h: 0.5,
    fontSize: 25, fontFace: 'Arial', color: WHITE, bold: true
  });

  if (fs.existsSync(REV_INFOGRAPHIC_PATH)) {
    s8.addImage({
      path: REV_INFOGRAPHIC_PATH,
      x: 0.8, y: 1.35, w: 5.4, h: 3.8
    });
  }

  s8.addShape(pptx.ShapeType.roundRect, {
    x: 6.4, y: 1.35, w: 2.8, h: 3.8,
    fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1.5 }, rectRadius: 0.12
  });

  s8.addText('HOW THE REVIEW ACCELERATOR WORKS', {
    x: 6.55, y: 1.5, w: 2.5, h: 0.25,
    fontSize: 10, fontFace: 'Arial', color: GOLD, bold: true
  });

  s8.addText([
    { text: '⭐ The Contractor Problem:\n', options: { bold: true, color: WHITE, fontSize: 11.5 } },
    { text: '95% of satisfied homeowners forget to leave a review because contractors forget to text them.\n\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '⏱️ Smart 2-Hour Delay:\n', options: { bold: true, color: WHITE, fontSize: 11.5 } },
    { text: 'When job is completed, system automatically waits 2 hours so homeowner is relaxed in cool AC.\n\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '📱 Direct 1-Tap Google Link:\n', options: { bold: true, color: WHITE, fontSize: 11.5 } },
    { text: 'Opens Google Maps with 5 stars pre-selected — zero typing or searching required.\n\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '📈 Maps & AEO Supercharger:\n', options: { bold: true, color: CYAN, fontSize: 11.5 } },
    { text: 'Adds 15–25 real reviews every month, pushing Pro-Tech above all Miami competitors.', options: { color: TEXT_MUTED, fontSize: 10 } }
  ], { x: 6.55, y: 1.8, w: 2.5, h: 3.2 });

  // ==========================================
  // SLIDE 9: SALES PACKAGE 1 — TRADE GROWTH BUNDLE
  // ==========================================
  const s9 = pptx.addSlide();
  s9.background = { color: BG_DARK };

  s9.addText('SALES PACKAGE 1 · CORE OPERATIONAL FOUNDATION', {
    x: 0.8, y: 0.45, w: 8.4, h: 0.25,
    fontSize: 11, fontFace: 'Arial', color: CYAN, bold: true, letterSpacing: 1.5
  });

  s9.addText('Option 1: Trade Growth Bundle (Website + Ava Voice AI)', {
    x: 0.8, y: 0.75, w: 8.4, h: 0.5,
    fontSize: 26, fontFace: 'Arial', color: WHITE, bold: true
  });

  s9.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.4, w: 3.2, h: 3.8,
    fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 2 }, rectRadius: 0.15
  });

  s9.addText('CORE BUNDLE INVESTMENT', {
    x: 1.0, y: 1.6, w: 2.8, h: 0.25,
    fontSize: 10, fontFace: 'Arial', color: CYAN, bold: true
  });

  s9.addText('$397', {
    x: 1.0, y: 1.85, w: 2.8, h: 0.7,
    fontSize: 44, fontFace: 'Arial', color: WHITE, bold: true
  });
  s9.addText('PER MONTH (Zero Long-Term Lock-In)', {
    x: 1.0, y: 2.55, w: 2.8, h: 0.3,
    fontSize: 10.5, fontFace: 'Arial', color: TEXT_MUTED
  });

  s9.addText('+ $1,296 One-Time Setup', {
    x: 1.0, y: 3.0, w: 2.8, h: 0.4,
    fontSize: 15, fontFace: 'Arial', color: GOLD_LIGHT, bold: true
  });
  s9.addText('Covers custom website build & Ava phone voice tuning.', {
    x: 1.0, y: 3.4, w: 2.8, h: 0.45,
    fontSize: 10.5, fontFace: 'Arial', color: TEXT_MUTED
  });

  s9.addShape(pptx.ShapeType.roundRect, {
    x: 1.0, y: 4.1, w: 2.8, h: 0.9,
    fill: { color: '0284C7' }, line: { color: '38BDF8', width: 1 }, rectRadius: 0.1
  });
  s9.addText('FIRST TRANSACTION TOTAL:\n$1,693 DUE TODAY', {
    x: 1.1, y: 4.2, w: 2.6, h: 0.7,
    fontSize: 14, fontFace: 'Arial', color: WHITE, bold: true, align: 'center'
  });

  s9.addShape(pptx.ShapeType.roundRect, {
    x: 4.3, y: 1.4, w: 4.9, h: 3.8,
    fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1.5 }, rectRadius: 0.15
  });

  s9.addText('WHAT PRO-TECH RECEIVES IN OPTION 1:', {
    x: 4.5, y: 1.6, w: 4.5, h: 0.25,
    fontSize: 11, fontFace: 'Arial', color: GOLD, bold: true
  });

  const opt1Items = [
    { text: '✓ Sub-Second 0.6s Custom Mobile Website (100/100 Core Web Vitals)' },
    { text: '✓ Interactive Emergency Ballpark Estimator (Captures leads 24/7)' },
    { text: '✓ Ava 24/7 Voice AI Phone Receptionist (Answers in 1 ring)' },
    { text: '✓ Bilingual Spanish & English Auto-Detection for Miami-Dade' },
    { text: '✓ Instant SMS Tech Dispatch dossier to Carlin\'s phone in <10s' },
    { text: '✓ Live Calendar Booking synced to Google Calendar / Outlook' },
    { text: '✓ 300 Live Monthly Answering Minutes included' },
    { text: '✓ Full Client Hub Access with recordings & audio transcripts' }
  ];

  opt1Items.forEach((item, idx) => {
    s9.addText(item.text, {
      x: 4.5, y: 1.95 + idx * 0.38, w: 4.5, h: 0.35,
      fontSize: 11.5, fontFace: 'Arial', color: WHITE
    });
  });

  // ==========================================
  // SLIDE 10: SALES PACKAGE 2 — ACCELERATE TIER
  // ==========================================
  const s10 = pptx.addSlide();
  s10.background = { color: BG_DARK };

  s10.addText('SALES PACKAGE 2 · FULL FRONT-OFFICE GROWTH ENGINE (RECOMMENDED)', {
    x: 0.8, y: 0.45, w: 8.4, h: 0.25,
    fontSize: 11, fontFace: 'Arial', color: GOLD, bold: true, letterSpacing: 1.5
  });

  s10.addText('Option 2: Accelerate Tier (Full Market Growth Dominance)', {
    x: 0.8, y: 0.75, w: 8.4, h: 0.5,
    fontSize: 26, fontFace: 'Arial', color: WHITE, bold: true
  });

  s10.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.4, w: 3.2, h: 3.8,
    fill: { color: CARD_BG }, line: { color: GOLD, width: 2 }, rectRadius: 0.15
  });

  s10.addText('ACCELERATE BUNDLE INVESTMENT', {
    x: 1.0, y: 1.6, w: 2.8, h: 0.25,
    fontSize: 10, fontFace: 'Arial', color: GOLD, bold: true
  });

  s10.addText('$697', {
    x: 1.0, y: 1.85, w: 2.8, h: 0.7,
    fontSize: 44, fontFace: 'Arial', color: WHITE, bold: true
  });
  s10.addText('PER MONTH (Zero Long-Term Lock-In)', {
    x: 1.0, y: 2.55, w: 2.8, h: 0.3,
    fontSize: 10.5, fontFace: 'Arial', color: TEXT_MUTED
  });

  s10.addText('+ $997 One-Time Setup', {
    x: 1.0, y: 3.0, w: 2.8, h: 0.4,
    fontSize: 15, fontFace: 'Arial', color: GREEN, bold: true
  });
  s10.addText('Discounted setup fee when bundling full growth stack.', {
    x: 1.0, y: 3.4, w: 2.8, h: 0.45,
    fontSize: 10.5, fontFace: 'Arial', color: TEXT_MUTED
  });

  s10.addShape(pptx.ShapeType.roundRect, {
    x: 1.0, y: 4.1, w: 2.8, h: 0.9,
    fill: { color: 'B45309' }, line: { color: GOLD, width: 1.5 }, rectRadius: 0.1
  });
  s10.addText('FIRST TRANSACTION TOTAL:\n$1,694 DUE TODAY (+$1 vs Opt 1!)', {
    x: 1.1, y: 4.2, w: 2.6, h: 0.7,
    fontSize: 13, fontFace: 'Arial', color: WHITE, bold: true, align: 'center'
  });

  s10.addShape(pptx.ShapeType.roundRect, {
    x: 4.3, y: 1.4, w: 4.9, h: 3.8,
    fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1.5 }, rectRadius: 0.15
  });

  s10.addText('WHAT PRO-TECH RECEIVES IN OPTION 2 (EVERYTHING IN OPT 1 + MORE):', {
    x: 4.5, y: 1.6, w: 4.5, h: 0.25,
    fontSize: 10.5, fontFace: 'Arial', color: GOLD, bold: true
  });

  const opt2Items = [
    { text: '⭐ EVERYTHING IN OPTION 1 (Website + Ava Voice AI + Estimator)', col: GOLD_LIGHT, bold: true },
    { text: '🚀 AEO / AI Search Ranking: Rank #1 on ChatGPT, Perplexity & Siri', col: CYAN, bold: true },
    { text: '📈 LeadFlow CRM Pipeline: 45-Second Speed-to-Lead Auto SMS', col: CYAN, bold: true },
    { text: '⭐ Google Review Accelerator: Automated 5-Star SMS (15-25 reviews/mo)', col: CYAN, bold: true },
    { text: '✓ 600 Live Monthly Voice Minutes Included (Double Option 1)', col: WHITE, bold: false },
    { text: '✓ Automated Missed-Call Instant 2-Way Text-Back Engine', col: WHITE, bold: false },
    { text: '✓ Ongoing Managed Hosting, Content Updates & Server Security', col: WHITE, bold: false },
    { text: '✓ VIP Dedicated Support & Quarterly Database Reactivation', col: WHITE, bold: false }
  ];

  opt2Items.forEach((item, idx) => {
    s10.addText(item.text, {
      x: 4.5, y: 1.95 + idx * 0.38, w: 4.5, h: 0.35,
      fontSize: 11, fontFace: 'Arial', color: item.col, bold: item.bold
    });
  });

  // ==========================================
  // SLIDE 11: HEAD-TO-HEAD COMPARISON MATRIX
  // ==========================================
  const s11 = pptx.addSlide();
  s11.background = { color: BG_DARK };

  s11.addText('HEAD-TO-HEAD COMPARISON · COMPLETE DELIVERABLES BREAKDOWN', {
    x: 0.8, y: 0.4, w: 8.4, h: 0.25,
    fontSize: 11, fontFace: 'Arial', color: CYAN, bold: true, letterSpacing: 1.5
  });

  s11.addText('Option 1 vs. Option 2: Feature Matrix', {
    x: 0.8, y: 0.65, w: 8.4, h: 0.45,
    fontSize: 24, fontFace: 'Arial', color: WHITE, bold: true
  });

  const tableData = [
    [
      { text: 'DELIVERABLE / CAPABILITY', options: { bold: true, color: WHITE, fill: '1E293B', fontSize: 10 } },
      { text: 'OPTION 1: AVA + WEBSITE', options: { bold: true, color: CYAN, fill: '1E293B', align: 'center', fontSize: 10 } },
      { text: 'OPTION 2: ACCELERATE TIER (RECOMMENDED)', options: { bold: true, color: GOLD, fill: '1E293B', align: 'center', fontSize: 10 } }
    ],
    [
      { text: 'Sub-Second 0.6s Custom Mobile Website', options: { color: WHITE, fontSize: 9.5 } },
      { text: '✓ Included', options: { color: GREEN, align: 'center', bold: true, fontSize: 9.5 } },
      { text: '✓ Included', options: { color: GREEN, align: 'center', bold: true, fontSize: 9.5 } }
    ],
    [
      { text: 'Interactive Ballpark Repair Estimator Widget', options: { color: WHITE, fontSize: 9.5 } },
      { text: '✓ Included', options: { color: GREEN, align: 'center', bold: true, fontSize: 9.5 } },
      { text: '✓ Included', options: { color: GREEN, align: 'center', bold: true, fontSize: 9.5 } }
    ],
    [
      { text: 'Ava 24/7/365 Bilingual Phone Receptionist (1-Ring)', options: { color: WHITE, fontSize: 9.5 } },
      { text: '✓ Included', options: { color: GREEN, align: 'center', bold: true, fontSize: 9.5 } },
      { text: '✓ Included', options: { color: GREEN, align: 'center', bold: true, fontSize: 9.5 } }
    ],
    [
      { text: 'Instant SMS Priority Tech Dispatch to Carlin\'s Phone', options: { color: WHITE, fontSize: 9.5 } },
      { text: '✓ Included', options: { color: GREEN, align: 'center', bold: true, fontSize: 9.5 } },
      { text: '✓ Included', options: { color: GREEN, align: 'center', bold: true, fontSize: 9.5 } }
    ],
    [
      { text: 'Included Voice AI Minutes / Month', options: { color: WHITE, fontSize: 9.5 } },
      { text: '300 Live Minutes', options: { color: TEXT_MUTED, align: 'center', fontSize: 9.5 } },
      { text: '600 Live Minutes (2X)', options: { color: GOLD_LIGHT, align: 'center', bold: true, fontSize: 9.5 } }
    ],
    [
      { text: 'LeadFlow CRM (45-Sec Missed-Call Auto Text-Back)', options: { color: WHITE, fontSize: 9.5 } },
      { text: '— Not Included', options: { color: TEXT_MUTED, align: 'center', fontSize: 9.5 } },
      { text: '✓ Included', options: { color: GREEN, align: 'center', bold: true, fontSize: 9.5 } }
    ],
    [
      { text: 'Google Review Accelerator (Automated 5★ SMS Reviews)', options: { color: WHITE, fontSize: 9.5 } },
      { text: '— Not Included', options: { color: TEXT_MUTED, align: 'center', fontSize: 9.5 } },
      { text: '✓ 15–25 5★ Reviews/Mo', options: { color: GREEN, align: 'center', bold: true, fontSize: 9.5 } }
    ],
    [
      { text: 'AEO Engine™ (Rank #1 on ChatGPT, Perplexity & Siri)', options: { color: WHITE, fontSize: 9.5 } },
      { text: '— Not Included', options: { color: TEXT_MUTED, align: 'center', fontSize: 9.5 } },
      { text: '✓ Full AI Search Schema', options: { color: GREEN, align: 'center', bold: true, fontSize: 9.5 } }
    ],
    [
      { text: 'Pricing: Monthly Investment / One-Time Setup', options: { color: GOLD_LIGHT, bold: true, fontSize: 10 } },
      { text: '$397/mo + $1,296 Setup', options: { color: WHITE, align: 'center', bold: true, fontSize: 10 } },
      { text: '$697/mo + $997 Setup', options: { color: GOLD, align: 'center', bold: true, fontSize: 10 } }
    ],
    [
      { text: 'FIRST TRANSACTION TOTAL TODAY', options: { color: WHITE, bold: true, fill: '1E3A8A', fontSize: 10.5 } },
      { text: '$1,693 Due Today', options: { color: WHITE, align: 'center', bold: true, fill: '1E3A8A', fontSize: 10.5 } },
      { text: '$1,694 Due Today (+$1 Only!)', options: { color: GOLD_LIGHT, align: 'center', bold: true, fill: '78350F', fontSize: 10.5 } }
    ]
  ];

  s11.addTable(tableData, {
    x: 0.8, y: 1.2, w: 8.4, h: 4.0,
    colW: [4.2, 2.1, 2.1],
    border: { pt: 1, color: '334155' },
    fill: '0F172A'
  });

  // ==========================================
  // SLIDE 12: THE 48-HOUR ZERO-FRICTION ROLLOUT
  // ==========================================
  const s12 = pptx.addSlide();
  s12.background = { color: BG_DARK };

  s12.addText('THE ROLLOUT · 48-HOUR ONBOARDING GUARANTEE', {
    x: 0.8, y: 0.45, w: 8.4, h: 0.25,
    fontSize: 11, fontFace: 'Arial', color: GREEN, bold: true, letterSpacing: 1.5
  });

  s12.addText('How We Go Live In Under 48 Hours With Zero Tech Friction', {
    x: 0.8, y: 0.75, w: 8.4, h: 0.5,
    fontSize: 26, fontFace: 'Arial', color: WHITE, bold: true
  });

  const rolloutPillars = [
    {
      step: '1. PLUGS INTO EXISTING PHONE LINE',
      icon: '📞',
      title: 'No Carrier Changes & Zero New Numbers Needed',
      desc: 'Carlin keeps his exact business phone carrier. We set up simple Conditional Call Forwarding (*71). Ava only picks up when his crew is busy or after hours. No hardware to buy.'
    },
    {
      step: '2. PLUGS INTO EXISTING DOMAIN & TOOLS',
      icon: '🌐',
      title: 'Zero Business Interruption or Email Changes',
      desc: 'We point to your existing web domain without touching your business email. Direct webhook integration connects with ServiceTitan, Jobber, Housecall Pro, Google Calendar, or Outlook.'
    },
    {
      step: '3. THE ONLY DETAIL WE NEED IS PRICING',
      icon: '📋',
      title: '5-Minute Simple Intake (We Do 100% of the Tech Work)',
      desc: 'Carlin only gives us his standard diagnostic fee and emergency service zip codes. Carter and the VantorX engineering team handle all AI prompt training, schema code, and mobile speed optimization.'
    },
    {
      step: '4. THE 48-HOUR HANDSHAKE TEST CALL',
      icon: '🤝',
      title: 'Live Speakerphone Verification Before Going Live',
      desc: 'Within 48 hours, we do a 5-minute test call together. Carlin dials his line, tests Ava live, verifies the SMS lands on his cell, and gives the green light to turn it live!'
    }
  ];

  rolloutPillars.forEach((p, idx) => {
    const yPos = 1.35 + idx * 0.95;
    s12.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: yPos, w: 8.4, h: 0.85,
      fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1.2 }, rectRadius: 0.1
    });

    s12.addText(`${p.icon} ${p.step}`, {
      x: 1.0, y: yPos + 0.08, w: 3.5, h: 0.25,
      fontSize: 10, fontFace: 'Arial', color: GOLD, bold: true
    });

    s12.addText(p.title, {
      x: 1.0, y: yPos + 0.32, w: 3.5, h: 0.45,
      fontSize: 12, fontFace: 'Arial', color: WHITE, bold: true
    });

    s12.addText(p.desc, {
      x: 4.6, y: yPos + 0.12, w: 4.4, h: 0.65,
      fontSize: 10.5, fontFace: 'Arial', color: TEXT_MUTED
    });
  });

  const outDir = path.join(__dirname, '..', 'website', 'demo');
  const pptxFileName = 'PRO-TECH_AIR_SERVICES_PROPOSAL.pptx';
  const pptxFullPath = path.join(outDir, pptxFileName);

  await pptx.writeFile({ fileName: pptxFullPath });
  console.log('✅ Generated 12-slide PPTX file at:', pptxFullPath);

  const desktopPath = path.join('C:\\Users\\hungr\\OneDrive\\Desktop', pptxFileName);
  const downloadsPath = path.join('C:\\Users\\hungr\\Downloads', pptxFileName);
  const artifactsPath = path.join('C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0', pptxFileName);

  fs.copyFileSync(pptxFullPath, desktopPath);
  fs.copyFileSync(pptxFullPath, downloadsPath);
  fs.copyFileSync(pptxFullPath, artifactsPath);

  console.log('✅ Copied 12-slide PPTX to Desktop and Downloads!');
}

buildPresentation().catch(console.error);
