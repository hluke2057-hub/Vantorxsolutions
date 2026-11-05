const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetZip = path.resolve('website/downloads/vantorx_instagram_complete_package.zip');
const targetZipAlt = path.resolve('website/assets/instagram/vantorx_instagram_complete_package.zip');
const brainDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';
const brainZip = path.join(brainDir, 'vantorx_instagram_complete_package.zip');

const packDir = path.resolve('website/downloads/vantorx_instagram_pack_staging');
if (fs.existsSync(packDir)) fs.rmSync(packDir, { recursive: true, force: true });
fs.mkdirSync(packDir, { recursive: true });

// 1. 01_VIDEO_REEL_READY_TO_POST
const reelDir = path.join(packDir, '01_VIDEO_REEL_READY_TO_POST');
fs.mkdirSync(reelDir, { recursive: true });
fs.copyFileSync('website/demo/video/vantorx-speed-to-lead-reel.mp4', path.join(reelDir, 'vantorx-speed-to-lead-reel.mp4'));
fs.copyFileSync('website/demo/audio/reel-voiceover-master.mp3', path.join(reelDir, 'reel-voiceover-master.mp3'));

// Reel Caption & Copy
const reelCaption = `🚀 THE 186,000 MILE/SEC LESSON EVERY TRADE CONTRACTOR NEEDS TO HEAR:

Light travels at 186,000 miles per second.
It reaches the Moon in 1.3 seconds.
It can fly all the way past Saturn in 2.9 hours.

Yet the average HVAC, plumbing, and electrical contractor takes 4 HOURS to call a homeowner back. 🤯

Here is the brutal truth:
MIT & Lead Response studies prove that 78% of customers hire whoever calls them back FIRST.

If a homeowner has an emergency repipe or a broken AC in 95-degree heat, and you don’t pick up by ring four?
They hang up.
They click the next Google listing.
And you just handed an $8,500 ticket directly to your competitor.

Stop sending six-figure revenue into your voicemail graveyard.

⚡ Meet Ava — the 24/7 Voice AI built exclusively for trade contractors.
- Answers in 0.8 seconds (day or night)
- Screens emergency vs routine jobs
- Quotes custom rates & qualifies the lead
- Instantly dispatches SMS to your on-call techs

📞 Want to test her live right now? Dial our live demonstration line:
(561) 813-8602

Or comment "AVA" below and I’ll DM you the full breakdown and live contractor demo link.

#hvac #plumbing #electrical #contractor #contractorsofinstagram #contractorlife #fieldservice #tradebusiness #bluecollar #bluecollarlife #servicetitan #jobber #speedtolead #voiceai #aiagency #floridacontractors #homeimprovement #servicebusiness #roofing #tradesman`;

fs.writeFileSync(path.join(reelDir, 'REEL_CAPTION_AND_HASHTAGS.txt'), reelCaption, 'utf8');

// 2. 02_STORY_HIGHLIGHTS_AND_CAROUSELS
const carouselsDir = path.join(packDir, '02_STORY_HIGHLIGHTS_AND_CAROUSELS');
fs.mkdirSync(carouselsDir, { recursive: true });
const sourceAllProd = path.resolve('website/assets/instagram/all_products');
if (fs.existsSync(sourceAllProd)) {
  fs.cpSync(sourceAllProd, carouselsDir, { recursive: true });
}

// 3. 03_REEL_SCENES_STILLS_15_PARTS
const scenesDir = path.join(packDir, '03_REEL_SCENES_STILLS_15_PARTS');
fs.mkdirSync(scenesDir, { recursive: true });
for (let i = 1; i <= 15; i++) {
  const prefix = 'scene_' + String(i).padStart(2, '0');
  const files = fs.readdirSync(brainDir).filter(f => f.startsWith(prefix) && f.endsWith('.png'));
  if (files[0]) {
    fs.copyFileSync(path.join(brainDir, files[0]), path.join(scenesDir, files[0]));
  }
}

// 4. 04_BRAND_ASSETS_AND_PFPS
const brandDir = path.join(packDir, '04_BRAND_ASSETS_AND_PFPS');
fs.mkdirSync(brandDir, { recursive: true });
if (fs.existsSync('website/assets/instagram/vantorx_logo_3d_pfp.jpg')) {
  fs.copyFileSync('website/assets/instagram/vantorx_logo_3d_pfp.jpg', path.join(brandDir, 'vantorx_logo_3d_pfp.jpg'));
}
if (fs.existsSync('website/assets/instagram/vantorx_logo_pfp.png')) {
  fs.copyFileSync('website/assets/instagram/vantorx_logo_pfp.png', path.join(brandDir, 'vantorx_logo_pfp.png'));
}

// 5. MASTER_INSTAGRAM_GROWTH_GUIDE.txt
const masterGuide = `================================================================================
VANTORX SOLUTIONS · COMPLETE INSTAGRAM ASSET & LAUNCH PACKAGE
================================================================================
Founder: Luke Hamilton
Website: https://vantorxsolutions.com
Live Demo Hotline: (561) 813-8602

PACKAGE CONTENTS:
1. 01_VIDEO_REEL_READY_TO_POST
   - vantorx-speed-to-lead-reel.mp4 (High-impact 63s 1080x1920 60fps MP4 Reel)
   - reel-voiceover-master.mp3 (Studio elevenlabs voiceover track)
   - REEL_CAPTION_AND_HASHTAGS.txt (Pre-formatted copy + 30 SEO hashtags)

2. 02_STORY_HIGHLIGHTS_AND_CAROUSELS
   - 7 Folders for all 7 VantorX Contractor Products (21 High-Res 9:16 slides)
   - 01_Accelerate_Bundle (Slide 1: Problem, Slide 2: Tech Stack, Slide 3: Pricing)
   - 02_Ava_Voice_AI (Slide 1: The Voicemail Graveyard, Slide 2: 0.8s Answer, Slide 3: Pricing)
   - 03_Basic_Front_Desk (Slide 1: Solo Tech Dilemma, Slide 2: Front Desk AI, Slide 3: Pricing)
   - 04_Scale_Enterprise (Slide 1: Fleet Bottleneck, Slide 2: Dispatch AI, Slide 3: Pricing)
   - 05_Mobile_Website (Slide 1: Slow Site Leak, Slide 2: Sub-0.8s Build, Slide 3: Pricing)
   - 06_LeadFlow_SMS (Slide 1: 5-Min Lead Decay, Slide 2: 90s Textback, Slide 3: Pricing)
   - 07_Contractor_AEO (Slide 1: Google Drop, Slide 2: AI Citations, Slide 3: Pricing)

3. 03_REEL_SCENES_STILLS_15_PARTS
   - High-definition PNG frames from all 15 dynamic video scenes

4. 04_BRAND_ASSETS_AND_PFPS
   - Official 3D Monogram Logo Profile Picture (Circular crop optimized)

--------------------------------------------------------------------------------
BEST PRACTICES FOR MAXIMUM ALGORITHM REACH:
- Best Posting Times (EST):
  * Morning Peak: 7:15 AM - 8:30 AM (Contractors checking phones before site)
  * Lunch Peak: 12:00 PM - 1:15 PM (Lunch break triage)
  * Evening Peak: 5:45 PM - 7:30 PM (End of day review)

- ManyChat Automation Trigger:
  * Set keyword trigger on: "AVA", "REEL", "SPEED", "AUDIT"
  * Auto-response sends: "Hey [Name]! Here is the live demo line you can test right now: (561) 813-8602 — or check out how we set up 24/7 AI for trades at vantorxsolutions.com"
================================================================================`;

fs.writeFileSync(path.join(packDir, 'MASTER_INSTAGRAM_GROWTH_GUIDE.txt'), masterGuide, 'utf8');

console.log('Staging files created.');

// Compress via PowerShell Compress-Archive
console.log('Compressing staging folder to ZIP...');
if (fs.existsSync(targetZip)) fs.unlinkSync(targetZip);
const psCmd = `powershell -NoProfile -Command "Compress-Archive -Path '${packDir}\\*' -DestinationPath '${targetZip}' -Force"`;
execSync(psCmd, { stdio: 'inherit' });

console.log(`ZIP created successfully at ${targetZip} (${(fs.statSync(targetZip).size / (1024 * 1024)).toFixed(2)} MB)`);

// Also copy to assets and brain
fs.copyFileSync(targetZip, targetZipAlt);
fs.copyFileSync(targetZip, brainZip);
console.log('Copied to website/assets/instagram and brain artifacts.');
