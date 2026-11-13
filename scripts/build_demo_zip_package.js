// scripts/build_demo_zip_package.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';
const DOWNLOADS_DIR = 'C:\\Users\\hungr\\Downloads';
const DESKTOP_DIR = 'C:\\Users\\hungr\\OneDrive\\Desktop';

const kitDir = path.join(root, 'dist/PRO-TECH_AIR_SERVICES_DEMO_KIT');
if (fs.existsSync(kitDir)) fs.rmSync(kitDir, { recursive: true, force: true });
fs.mkdirSync(kitDir, { recursive: true });

// 1. Copy PDF Presentation
const pdfSource = path.join(root, 'website/demo/PRO-TECH_AIR_SERVICES_DEMO_PRESENTATION.pdf');
const pdfDest = path.join(kitDir, 'PRO-TECH_AIR_SERVICES_DEMO_PRESENTATION.pdf');
fs.copyFileSync(pdfSource, pdfDest);

// 2. Offline HTML presentation
const htmlSource = path.join(root, 'website/demo/pro-tech-presentation.html');
const htmlDest = path.join(kitDir, 'PRO-TECH_OFFLINE_PRESENTATION.html');
fs.copyFileSync(htmlSource, htmlDest);

// 3. Word-for-Word Demo Script
const scriptContent = `================================================================================
PRO-TECH AIR SERVICES LLC — LIVE DEMO SCRIPT (WORD-FOR-WORD)
Client: Carlin Oates, Owner
Address: 540 NW 111st, Miami, FL 33168
Trade: HVAC & Emergency AC Repair
Live Test Line: (561) 813-8602
================================================================================

SLIDE 1: THE EXECUTIVE DOSSIER & HOOK
--------------------------------------------------------------------------------
"Carlin, thank you for jumping on. I put together a quick 8-slide operational 
breakdown specifically for PRO-TECH AIR SERVICES based out of your shop on 
111th Street in Miami.

The entire goal of today is simple: In Miami heat, when an AC dies, it's an 
urgent medical emergency. Homeowners don't wait. We're going to show you how 
to ensure Pro-Tech Air captures every single emergency call in Miami-Dade in 
under 1 second without you being glued to your phone 24/7."


SLIDE 2: THE MIAMI HVAC REALITY & THE BLEED
--------------------------------------------------------------------------------
"Here's the South Florida math: A standard repair — capacitor, freon leak, or 
fan motor — is around $550. A full 3-to-5 ton system replacement in Miami 
averages $8,500.

Right now, when you or your lead guys are on an attic ladder in 130° heat or 
driving I-95, calls hit voicemail. 78% of Miami homeowners hang up the second 
they hear a beep and call the next contractor on Google Maps. Missing just 
3 system replacements a month is $25,500 walking straight to a competitor."


SLIDE 3: PILLAR 1 — THE NEW PRO-TECH AIR MOBILE SITE
--------------------------------------------------------------------------------
"Pillar 1 is your online front door. Most contractor sites take 5 seconds to 
load and hide the phone number. We built a custom mobile architecture for 
PRO-TECH AIR that loads in 0.6 seconds flat.

Right at the top: an emergency 'Tap to Dispatch Tech' button, your Miami-Dade 
service zones (Miami, North Miami, Miami Shores, Aventura, Hialeah), and instant 
trust badges showing you're licensed, insured, and background-checked."


SLIDE 4: PILLAR 2 — MEET AVA (YOUR 24/7 VOICE RECEPTIONIST)
--------------------------------------------------------------------------------
"Pillar 2 is our Voice AI receptionist, AVA. She answers every single call on 
the first ring (0.8 seconds) with a voice that sounds completely human.

She greets them with:
'Thank you for calling Pro-Tech Air Services, Miami's 24/7 AC emergency team. 
Is your AC blowing warm air or leaking, or are you calling for a routine tune-up?'

She qualifies the emergency, gets their address, and texts an instant dispatch 
ticket straight to your cell phone in under 3 seconds."


SLIDE 5: THE LIVE TEST CALL (THE AHA MOMENT)
--------------------------------------------------------------------------------
"Carlin, grab your phone right now. Put it on speaker. Let's call the live 
line together: (561) 813-8602.

Tell her your AC is leaking water into your hallway in Miami. Listen to how fast 
she responds and how she handles the emergency."


SLIDE 6: THE NO-BRAINER BREAKEVEN MATH
--------------------------------------------------------------------------------
"Based on your average ticket size, saving just ONE single $550 repair call a 
month completely covers the entire system. If AVA saves just 4 emergency calls 
a month that would have hit voicemail, that is +$8,800/month in net revenue 
($105,600/year) you keep."


SLIDE 7: THE INVESTMENT & OFFER
--------------------------------------------------------------------------------
"We don't charge per-lead commissions or lock you into long contracts.
- Option 1: The Sub-Second Mobile Website is $997 flat.
- Option 2: AVA 24/7 Voice AI is $397/mo.
- Growth Bundle: Complete Website + 24/7 Ava Voice AI for $997 setup + $297/mo.

If you close just 1 job from this in the next 30 days, you're already in pure 
profit."


SLIDE 8: 48-HOUR ONBOARDING & CLOSE
--------------------------------------------------------------------------------
"You don't need to switch phone carriers or learn new software. We handle 100% 
of the build. If we lock this in today, we calibrate your script tomorrow and 
go live in 48 hours so your phone is 100% covered this weekend.

Carlin, should we get the onboarding started and lock in your Miami territory 
today?"
================================================================================
`;
fs.writeFileSync(path.join(kitDir, 'PRO-TECH_DEMO_WORD_FOR_WORD_SCRIPT.txt'), scriptContent);

// 4. Objection Handling Battle Card
const battleCard = `================================================================================
PRO-TECH AIR SERVICES LLC — OBJECTION HANDLING BATTLE CARD
================================================================================

OBJECTION 1: "I already have someone answering the phones (or my wife/assistant answers)."
COUNTER:
"That's awesome during normal business hours! But what happens at 8:30 PM on a Friday 
night when a homeowner in North Miami has water pouring through their ceiling? Or on 
Sunday afternoon during a 95-degree heatwave? That's when your highest-ticket emergency 
jobs call. Ava doesn't replace your front desk — she protects them after-hours and on 
rollover so you never miss a weekend call."

OBJECTION 2: "Is it a robotic voice? Will customers hate it?"
COUNTER:
"Carlin, that's exactly why we had you call the live line (561) 813-8602. She uses 
advanced human conversational cadence with natural breathing and zero robotic delay. 
Most callers think she's a high-end dispatcher sitting in your Miami office."

OBJECTION 3: "We're not big enough for AI right now."
COUNTER:
"Actually, single-truck and 3-truck shops benefit the MOST from this. Big companies 
have 5 full-time dispatchers on payroll costing $20,000/month. You don't have that 
overhead. With Ava, you get enterprise-level 24/7 dispatching for less than the cost 
of a single tank of gas a week."

OBJECTION 4: "Can we integrate with our dispatch calendar?"
COUNTER:
"Yes 100%. We integrate with ServiceTitan, Housecall Pro, Jobber, FieldEdge, or straight 
Google Calendar. Or if you prefer simplicity, she sends an instant text dispatch 
straight to your cell phone with the customer's name, phone, address, and problem."
================================================================================
`;
fs.writeFileSync(path.join(kitDir, 'PRO-TECH_OBJECTION_HANDLING_BATTLE_CARD.txt'), battleCard);

// 5. Readme Instructions
const readme = `================================================================================
PRO-TECH AIR SERVICES LLC — DEMO PRESENTATION KIT
================================================================================
Contents of this Kit:
1. PRO-TECH_AIR_SERVICES_DEMO_PRESENTATION.pdf
   - High-resolution, 16:9 widescreen presentation deck (8 slides).
   - Perfect for opening in Adobe Acrobat, Edge, Chrome, or Apple Preview to present
     via Zoom, Google Meet, or in person on a tablet or laptop.

2. PRO-TECH_OFFLINE_PRESENTATION.html
   - Fully standalone offline interactive deck.
   - Double-click to open in any web browser without needing internet.
   - Use Left / Right arrow keys to navigate slides.

3. PRO-TECH_DEMO_WORD_FOR_WORD_SCRIPT.txt
   - Word-for-word spoken script for each of the 8 slides.

4. PRO-TECH_OBJECTION_HANDLING_BATTLE_CARD.txt
   - Word-for-word answers to every objection Carlin might raise.

Live Interactive Test Line:
- Phone: (561) 813-8602
- Have Carlin dial this on speaker during Slide 5!
================================================================================
`;
fs.writeFileSync(path.join(kitDir, 'README_DEMO_INSTRUCTIONS.txt'), readme);

// 6. Compress Kit into ZIP
const zipFileName = 'PRO-TECH_AIR_SERVICES_DEMO_KIT.zip';
const repoZipPath = path.join(root, 'website/demo', zipFileName);
const downloadsZipPath = path.join(DOWNLOADS_DIR, zipFileName);
const desktopZipPath = path.join(DESKTOP_DIR, zipFileName);
const artifactZipPath = path.join(ARTIFACT_DIR, zipFileName);

console.log('📦 Compressing Demo Kit into ZIP...');
execSync(`powershell -Command "Compress-Archive -Path '${kitDir}/*' -DestinationPath '${repoZipPath}' -Force"`);

// Copy ZIP to Downloads, Desktop, and Artifact Directory
fs.copyFileSync(repoZipPath, downloadsZipPath);
if (fs.existsSync(DESKTOP_DIR)) fs.copyFileSync(repoZipPath, desktopZipPath);
fs.copyFileSync(repoZipPath, artifactZipPath);

const zipSizeMb = (fs.statSync(repoZipPath).size / (1024 * 1024)).toFixed(2);
console.log(`\n✅ Presentation ZIP Bundle Created (${zipSizeMb} MB):`);
console.log(`  1. Downloads: ${downloadsZipPath}`);
console.log(`  2. Desktop:   ${desktopZipPath}`);
console.log(`  3. Repo:      ${repoZipPath}`);
console.log(`  4. Artifacts: ${artifactZipPath}`);
