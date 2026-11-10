// scripts/generate_luke_course_pdf.js
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';
const OUT_LOCAL = path.resolve('website/fitness/Luke_Hamilton_155_to_180_Master_Course.pdf');
const OUT_ARTIFACT = path.join(ARTIFACT_DIR, 'Luke_Hamilton_155_to_180_Master_Course.pdf');

// Helper: load image as Base64 data URL
function getBase64Image(filename) {
  const p = path.resolve('website/fitness/images', filename);
  if (fs.existsSync(p)) {
    return 'data:image/jpeg;base64,' + fs.readFileSync(p).toString('base64');
  }
  return '';
}

const imgBefore1 = getBase64Image('luke_before_155_bathroom.jpg');
const imgBefore2 = getBase64Image('luke_before_155_shirt_lift.jpg');
const imgAfterAbs = getBase64Image('luke_after_180_shredded_abs.jpg');
const imgAfterDelts = getBase64Image('luke_after_180_gym_delts.jpg');
const imgAfterFull = getBase64Image('luke_after_180_full_physique.jpg');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Luke Hamilton - The 155 to 180 lbs Aesthetic Muscle Protocol</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&family=Space+Grotesk:wght@600;700;800;900&display=swap');

    @page {
      size: A4 portrait;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #05070d;
      color: #f1f5f9;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm 20mm 22mm 20mm;
      position: relative;
      page-break-after: always;
      background: #05070d;
      overflow: hidden;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    /* Ambient Background Glow */
    .bg-glow {
      position: absolute;
      top: 0;
      right: 0;
      width: 140mm;
      height: 140mm;
      background: radial-gradient(circle, rgba(163, 230, 53, 0.08) 0%, rgba(56, 189, 248, 0.03) 50%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      padding-bottom: 5mm;
      margin-bottom: 7mm;
      position: relative;
      z-index: 2;
    }

    .header-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9pt;
      font-weight: 700;
      color: #a3e635;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .header-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      color: #94a3b8;
    }

    .footer-bar {
      position: absolute;
      bottom: 12mm;
      left: 20mm;
      right: 20mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 3mm;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      color: #64748b;
      z-index: 2;
    }

    h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 26pt;
      font-weight: 900;
      line-height: 1.15;
      color: #ffffff;
      margin-bottom: 3mm;
    }

    h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 15pt;
      font-weight: 800;
      color: #38bdf8;
      margin-top: 5mm;
      margin-bottom: 3mm;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 12pt;
      font-weight: 700;
      color: #ffffff;
      margin-top: 4mm;
      margin-bottom: 2mm;
    }

    p {
      color: #cbd5e1;
      font-size: 10pt;
      line-height: 1.55;
      margin-bottom: 3.5mm;
    }

    .highlight {
      color: #a3e635;
      font-weight: 700;
    }

    .gold {
      color: #facc15;
      font-weight: 700;
    }

    .cyan {
      color: #38bdf8;
      font-weight: 700;
    }

    /* Cards & Boxes */
    .card {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 4mm 5mm;
      margin-bottom: 4.5mm;
      position: relative;
      z-index: 1;
    }

    .card-gold {
      border: 1.5px solid rgba(250, 204, 21, 0.4);
      background: linear-gradient(180deg, rgba(250, 204, 21, 0.06) 0%, rgba(15, 23, 42, 0.8) 100%);
    }

    .card-lime {
      border: 1.5px solid rgba(163, 230, 53, 0.4);
      background: linear-gradient(180deg, rgba(163, 230, 53, 0.06) 0%, rgba(15, 23, 42, 0.8) 100%);
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 2mm;
      margin-bottom: 4mm;
      font-size: 8.5pt;
    }

    th {
      background: rgba(255, 255, 255, 0.06);
      color: #38bdf8;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8pt;
      padding: 6px 8px;
      text-align: left;
      border-bottom: 1.5px solid rgba(56, 189, 248, 0.3);
    }

    td {
      padding: 5.5px 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      color: #e2e8f0;
    }

    tr:nth-child(even) td {
      background: rgba(255, 255, 255, 0.02);
    }

    .badge-sets {
      display: inline-block;
      background: rgba(163, 230, 53, 0.15);
      border: 1px solid rgba(163, 230, 53, 0.4);
      color: #a3e635;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 7.5pt;
      padding: 2px 6px;
      border-radius: 4px;
    }

    /* Photo Galleries */
    .photo-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4mm;
      margin: 4mm 0;
    }

    .photo-grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 3.5mm;
      margin: 4mm 0;
    }

    .photo-card {
      background: #000000;
      border: 1.5px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .photo-card img {
      width: 100%;
      height: 52mm;
      object-fit: cover;
      display: block;
    }

    .photo-caption {
      padding: 2mm 3mm;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      font-weight: 700;
      background: #0b0f17;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* COVER PAGE SPECIFICS */
    .cover-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 255mm;
      position: relative;
      z-index: 2;
    }

    .cover-hero-img {
      width: 100%;
      height: 125mm;
      object-fit: cover;
      border-radius: 12px;
      border: 2px solid rgba(163, 230, 53, 0.4);
      box-shadow: 0 15px 40px rgba(0,0,0,0.8);
      margin: 6mm 0;
    }

    .cover-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(163, 230, 53, 0.15);
      border: 1px solid rgba(163, 230, 53, 0.4);
      color: #a3e635;
      padding: 3px 10px;
      border-radius: 9999px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 800;
      font-size: 8pt;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 4mm;
    }
  </style>
</head>
<body>

  <!-- ========================================== -->
  <!-- PAGE 1: COVER PAGE -->
  <!-- ========================================== -->
  <div class="page">
    <div class="bg-glow"></div>
    <div class="cover-container">
      <div>
        <div class="cover-badge">⚡ OFFICIAL WORKOUT BLUEPRINT</div>
        <h1 style="font-size: 32pt; margin-bottom: 2mm;">THE 155 ➔ 180 LBS<br><span style="color: #a3e635;">AESTHETIC MUSCLE</span> PROTOCOL</h1>
        <div style="font-family: 'Space Grotesk', sans-serif; font-size: 13pt; color: #94a3b8; font-weight: 700;">
          The "2-Set Mechanical Failure &amp; Progressive Overload" Master Blueprint
        </div>
      </div>

      <!-- Hero Photo -->
      <img src="${imgAfterFull}" class="cover-hero-img" alt="Luke Hamilton 180 lbs Aesthetic Physique">

      <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 4.5mm 6mm;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 11pt; font-weight: 800; color: #ffffff;">LUKE HAMILTON</div>
            <div style="font-size: 8.5pt; color: #38bdf8; font-family: 'JetBrains Mono', monospace;">Verified Natural Transformation • 155 lbs ➔ 180 lbs</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12pt; font-weight: 900; color: #facc15; font-family: 'JetBrains Mono', monospace;">+25 LBS LEAN MASS</div>
            <div style="font-size: 8pt; color: #94a3b8; font-family: 'JetBrains Mono', monospace;">8-PACK ABS MAINTAINED</div>
          </div>
        </div>
      </div>

      <div class="footer-bar" style="position: static; border-top: none; padding: 0;">
        <span>THE AESTHETIC BLUEPRINT</span>
        <span>CONFIDENTIAL MASTER COPY</span>
        <span>PAGE 01 / 05</span>
      </div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 2: THE GOLDEN LAW & VISUAL PROOF -->
  <!-- ========================================== -->
  <div class="page">
    <div class="bg-glow"></div>
    <div class="header-bar">
      <span class="header-title">PART I: THE FOUNDATION &amp; PROOF</span>
      <span class="header-tag">LUKE HAMILTON PROTOCOL</span>
    </div>

    <h2>📸 The Visual Proof: 155 lbs Baseline vs. 180 lbs Shredded</h2>
    <p>
      The foundation of this system is undeniable real-world execution. Most fitness coaches push "dirty bulking" where you gain 20 lbs of belly fat and lose your jawline, or "junk volume" workouts where you spend 2.5 hours exhausting yourself with zero measurable strength gains.
    </p>

    <div class="photo-grid-3">
      <div class="photo-card" style="border-color: rgba(239,68,68,0.4);">
        <img src="${imgBefore1}" alt="Luke 155 lbs Bathroom">
        <div class="photo-caption" style="color: #f87171;">START: 155 LBS (BASELINE)</div>
      </div>
      <div class="photo-card" style="border-color: rgba(56,189,248,0.4);">
        <img src="${imgAfterAbs}" alt="Luke 180 lbs Shredded Abs">
        <div class="photo-caption" style="color: #38bdf8;">180 LBS (8-PACK ABS)</div>
      </div>
      <div class="photo-card" style="border-color: rgba(163,230,53,0.4);">
        <img src="${imgAfterDelts}" alt="Luke 180 lbs Capped Delts">
        <div class="photo-caption" style="color: #a3e635;">180 LBS (3D BOULDER DELTS)</div>
      </div>
    </div>

    <div class="card card-gold">
      <h3 style="color: #facc15; margin-top: 0; font-size: 12pt;">⚡ The Unbreakable Law: Progressive Overload</h3>
      <p style="margin-bottom: 2mm; font-size: 10.5pt; color: #ffffff; font-weight: 700;">
        "Adding weight is progressive overload. Every single exercise is performed for exactly 2 working sets taken to absolute mechanical failure."
      </p>
      <p style="margin-bottom: 0; font-size: 9pt; color: #cbd5e1;">
        If you hit your target reps on Set 1, you <span class="highlight">MUST add 5 lbs</span> next week. Your muscle fibers only adapt and grow when exposed to mechanical tension they have never experienced before.
      </p>
    </div>

    <h2>🔬 Why 2 Sets Beat 20 Junk Sets (The Science)</h2>
    <p>
      When you take a set to true mechanical failure (RPE 10 / 0 reps in reserve), your central nervous system is forced to recruit <span class="cyan">100% of high-threshold motor units</span>. Research proves that sets 1 and 2 deliver 90%+ of the hyper-trophic stimulus. Doing 5 or 6 sets just creates excessive joint inflammation, raises cortisol, and extends recovery time from 48 hours to 6 days.
    </p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin-top: 3mm;">
      <div class="card" style="border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.05);">
        <div style="font-weight: 800; font-size: 9.5pt; color: #f87171; margin-bottom: 2mm;">❌ 20 JUNK SET METHOD</div>
        <ul style="font-size: 8.5pt; color: #cbd5e1; padding-left: 4mm; line-height: 1.5;">
          <li>2+ hours wasted in the gym</li>
          <li>High joint &amp; tendon wear</li>
          <li>Excess systemic fatigue &amp; cortisol</li>
          <li>Unclear logbook progression</li>
        </ul>
      </div>

      <div class="card" style="border-color: rgba(163,230,53,0.3); background: rgba(163,230,53,0.05);">
        <div style="font-weight: 800; font-size: 9.5pt; color: #a3e635; margin-bottom: 2mm;">✅ LUKE'S 2-SET FAILURE SYSTEM</div>
        <ul style="font-size: 8.5pt; color: #cbd5e1; padding-left: 4mm; line-height: 1.5;">
          <li>45–50 minutes max per workout</li>
          <li>100% high-threshold muscle stimulation</li>
          <li>Rapid CNS recovery between sessions</li>
          <li>Exact poundage tracked every workout</li>
        </ul>
      </div>
    </div>

    <div class="footer-bar">
      <span>THE AESTHETIC BLUEPRINT</span>
      <span>PART I: THE FOUNDATION</span>
      <span>PAGE 02 / 05</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 3: THE TRAINING SPLIT (PUSH & PULL) -->
  <!-- ========================================== -->
  <div class="page">
    <div class="bg-glow"></div>
    <div class="header-bar">
      <span class="header-title">PART II: WORKOUT ROUTINE (PUSH &amp; PULL)</span>
      <span class="header-tag">LUKE HAMILTON PROTOCOL</span>
    </div>

    <h2>🔴 DAY 1: PUSH PROTOCOL (Chest, Shoulders, Triceps)</h2>
    <p style="margin-bottom: 2mm;">
      <span class="badge-sets">2 SETS TO FAILURE ALL</span> Warm up with 2 non-fatiguing ramp-up sets (50% x 8, 75% x 3), then execute 2 all-out working sets to absolute mechanical failure.
    </p>

    <table>
      <thead>
        <tr>
          <th>Exercise</th>
          <th>Target Muscle</th>
          <th style="text-align: center;">Working Sets</th>
          <th style="text-align: center;">Rep Target</th>
          <th>Execution &amp; Form Cue</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Flat Chest Press</b> (DB or Machine)</td>
          <td>Mid / Lower Pectorals</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">6–8 reps</td>
          <td>3-sec eccentric down, deep chest stretch at bottom, explosive press</td>
        </tr>
        <tr>
          <td><b>Incline Chest Press</b> (Smith / DB)</td>
          <td>Clavicular Upper Pecs</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">6–9 reps</td>
          <td>30° bench angle; drive elbows inward toward chin for upper shelf</td>
        </tr>
        <tr>
          <td><b>Pec Deck Flye</b></td>
          <td>Inner Sternal Pecs</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">8–10 reps</td>
          <td>Soft bend in elbows; hold peak contraction for 1 full second</td>
        </tr>
        <tr>
          <td><b>DB Lateral Raises</b></td>
          <td>Lateral Deltoid Head</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">10–12 reps</td>
          <td>Lean forward 10°, lead with elbows; 5-sec isometric hold on last rep</td>
        </tr>
        <tr>
          <td><b>Cable Lateral Raises</b> (Single Arm)</td>
          <td>Constant Tension Delts</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">10–12 reps</td>
          <td>Set cable at wrist height behind back; maintain smooth continuous tension</td>
        </tr>
        <tr>
          <td><b>Skull Crushers</b> (EZ Bar / DB)</td>
          <td>Triceps Long Head</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">8–10 reps</td>
          <td>Lower bar behind head (not forehead) for maximum long head stretch</td>
        </tr>
        <tr>
          <td><b>Tricep Rope Pushdown</b></td>
          <td>Lateral Triceps</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">10–12 reps</td>
          <td>Flare rope apart at bottom, lock elbows to your ribcage</td>
        </tr>
        <tr>
          <td><b>Tricep Pushdown Bar</b></td>
          <td>Heavy Overload Triceps</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">6–8 reps</td>
          <td>Straight bar, lean slightly forward, full strict lockout</td>
        </tr>
      </tbody>
    </table>

    <h2>🔵 DAY 2: PULL PROTOCOL (Back, Rear Delts, Biceps)</h2>
    <p style="margin-bottom: 2mm;">
      <span class="badge-sets">2 SETS TO FAILURE ALL</span> Focus on initiating every pull by driving your elbows down and back, not yanking with your hands.
    </p>

    <table>
      <thead>
        <tr>
          <th>Exercise</th>
          <th>Target Muscle</th>
          <th style="text-align: center;">Working Sets</th>
          <th style="text-align: center;">Rep Target</th>
          <th>Execution &amp; Form Cue</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Lat Pulldowns</b> (Close/Neutral)</td>
          <td>Upper Lat Width / V-Taper</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">8–10 reps</td>
          <td>Pull elbows straight into back pockets, lean back 10°</td>
        </tr>
        <tr>
          <td><b>Lat Pullovers</b> (Cable / DB)</td>
          <td>Lat Sweep Isolation</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">10–12 reps</td>
          <td>Soft elbows, sweep bar in a wide arc down to thighs</td>
        </tr>
        <tr>
          <td><b>T-Bar Row</b></td>
          <td>Mid-Back &amp; Rhomboids</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">6–8 reps</td>
          <td>45° hip hinge; pull to belly button, squeeze shoulder blades 1-sec</td>
        </tr>
        <tr>
          <td><b>Unilateral Row Machine</b></td>
          <td>Single-Side Lat Stretch</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">8–10 reps</td>
          <td>Allow torso to rotate slightly forward for extreme lat stretch</td>
        </tr>
        <tr>
          <td><b>Hyperextensions</b></td>
          <td>Spinal Erectors / Glutes</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">10–12 reps</td>
          <td>Neutral spine; hold 45 lb plate across chest, squeeze at top</td>
        </tr>
        <tr>
          <td><b>Reverse Pec Deck</b></td>
          <td>Rear Deltoid Head</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">12–15 reps</td>
          <td>Drive knuckles back in wide circle; do not squeeze shoulder blades</td>
        </tr>
        <tr>
          <td><b>Cable Curl</b></td>
          <td>Bicep Peak / Short Head</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">8–10 reps</td>
          <td>Elbows pinned slightly in front of torso, strict supination</td>
        </tr>
        <tr>
          <td><b>Cable Hammer Curl</b> (Rope)</td>
          <td>Brachialis / Forearm Thickness</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">10–12 reps</td>
          <td>Neutral thumbs-up grip; builds 3D arm width from the front</td>
        </tr>
      </tbody>
    </table>

    <div class="footer-bar">
      <span>THE AESTHETIC BLUEPRINT</span>
      <span>PART II: PUSH &amp; PULL</span>
      <span>PAGE 03 / 05</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 4: LEGS, ABS & RECOVERY -->
  <!-- ========================================== -->
  <div class="page">
    <div class="bg-glow"></div>
    <div class="header-bar">
      <span class="header-title">PART III: LEGS, ABS &amp; RECOVERY</span>
      <span class="header-tag">LUKE HAMILTON PROTOCOL</span>
    </div>

    <h2>🟢 DAY 3: LEGS PROTOCOL (Quads, Hamstrings, Adductors, Calves)</h2>
    <p style="margin-bottom: 2mm;">
      <span class="badge-sets">2 SETS TO FAILURE ALL</span> Legs trigger the largest systemic growth hormone response. Every set must be executed with deep controlled range of motion.
    </p>

    <table>
      <thead>
        <tr>
          <th>Exercise</th>
          <th>Target Muscle</th>
          <th style="text-align: center;">Sets</th>
          <th style="text-align: center;">Reps</th>
          <th>Execution &amp; Form Cue</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Hack Squat</b></td>
          <td>Quad Teardrop &amp; Sweep</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">6–9 reps</td>
          <td>Feet low on platform for maximum knee flexion; 3-sec descent below parallel</td>
        </tr>
        <tr>
          <td><b>Romanian Deadlifts (RDLs)</b></td>
          <td>Hamstrings &amp; Glutes</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">8–10 reps</td>
          <td>Push hips straight back like touching a wall; stop when hips stop moving</td>
        </tr>
        <tr>
          <td><b>Hip Abductor Machine</b></td>
          <td>Gluteus Medius / Hip Shelf</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">12–15 reps</td>
          <td>Lean slightly forward, push knees outward hard, hold 1-sec at spread</td>
        </tr>
        <tr>
          <td><b>Hip Adductor Machine</b></td>
          <td>Inner Thigh Density</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">12–15 reps</td>
          <td>Control eccentric stretch outwards; squeeze pads together and pause</td>
        </tr>
        <tr>
          <td><b>Leg Extension</b></td>
          <td>Rectus Femoris Quad Peak</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">10–12 reps</td>
          <td>Pause at top lockout for 1 full second; fight the negative down</td>
        </tr>
        <tr>
          <td><b>Lying / Seated Leg Curl</b></td>
          <td>Hamstring Belly</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">8–10 reps</td>
          <td>Keep toes dorsiflexed; do not let hips lift off bench during contraction</td>
        </tr>
        <tr>
          <td><b>Standing Calf Raises</b></td>
          <td>Gastrocnemius Calf Meat</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td style="text-align: center;">12–15 reps</td>
          <td>2-sec dead stop at absolute bottom stretch; explode up on big toes</td>
        </tr>
      </tbody>
    </table>

    <h2>🟡 ABS PROTOCOL (3x Per Week)</h2>
    <p style="margin-bottom: 2mm;">
      Perform at the end of workouts or on rest days: <span class="highlight">2 sets to absolute failure</span>.
    </p>

    <table>
      <thead>
        <tr>
          <th>Exercise</th>
          <th>Target Area</th>
          <th style="text-align: center;">Sets</th>
          <th>Technique &amp; Execution Cue</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Cable / Decline Ab Crunches</b></td>
          <td>Upper &amp; Mid 6-Pack Core</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td>Round your spine into a tight ball; exhale all air at peak crunch</td>
        </tr>
        <tr>
          <td><b>Hanging / Captain's Chair Leg Raises</b></td>
          <td>Lower Ab Pouch &amp; Compression</td>
          <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
          <td>Do not just swing legs; curl your pelvis UP toward your ribcage</td>
        </tr>
      </tbody>
    </table>

    <div class="card card-lime" style="margin-top: 3mm;">
      <h3 style="color: #a3e635; margin-top: 0; font-size: 11pt;">🧠 Central Nervous System &amp; Sleep Matrix</h3>
      <p style="font-size: 9pt; margin-bottom: 0;">
        Muscle growth does not happen during the workout — it happens during deep stage 3 and REM sleep when growth hormone surges. Aim for <span class="highlight">7.5 to 8.5 hours of uninterrupted sleep</span>. Supplement stack: 5g Creatine Monohydrate daily, 400mg Magnesium Glycinate before bed, and electrolytes with pre-workout.
      </p>
    </div>

    <div class="footer-bar">
      <span>THE AESTHETIC BLUEPRINT</span>
      <span>PART III: LEGS &amp; ABS</span>
      <span>PAGE 04 / 05</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 5: LEAN BULK DIET & LOGBOOK TRACKER -->
  <!-- ========================================== -->
  <div class="page">
    <div class="bg-glow"></div>
    <div class="header-bar">
      <span class="header-title">PART IV: LEAN BULK NUTRITION &amp; LOGBOOK</span>
      <span class="header-tag">LUKE HAMILTON PROTOCOL</span>
    </div>

    <h2>🥩 The 155 ➔ 180 Lean Mass Nutrition Matrix</h2>
    <p>
      Gaining 25 lbs of dense muscle without gaining belly fat requires a calibrated caloric surplus. If you eat 1,000 extra calories a day, 80% goes to body fat. If you eat a controlled <span class="highlight">+350–500 kcal surplus</span>, 90%+ is partitioned directly into myofibrillar muscle tissue.
    </p>

    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3.5mm; margin-bottom: 4mm;">
      <div class="card" style="border-color: rgba(56,189,248,0.4); text-align: center; padding: 3.5mm;">
        <div style="font-size: 8pt; color: #94a3b8; font-family: 'JetBrains Mono', monospace;">DAILY PROTEIN</div>
        <div style="font-size: 16pt; font-weight: 900; color: #38bdf8; margin: 1mm 0;">180g – 195g</div>
        <div style="font-size: 7.5pt; color: #cbd5e1;">Chicken, 93/7 beef, eggs, Greek yogurt, whey isolate</div>
      </div>

      <div class="card" style="border-color: rgba(163,230,53,0.4); text-align: center; padding: 3.5mm;">
        <div style="font-size: 8pt; color: #94a3b8; font-family: 'JetBrains Mono', monospace;">COMPLEX CARBS</div>
        <div style="font-size: 16pt; font-weight: 900; color: #a3e635; margin: 1mm 0;">340g – 380g</div>
        <div style="font-size: 7.5pt; color: #cbd5e1;">Jasmine rice, oats, sweet potatoes, cream of rice</div>
      </div>

      <div class="card" style="border-color: rgba(250,204,21,0.4); text-align: center; padding: 3.5mm;">
        <div style="font-size: 8pt; color: #94a3b8; font-family: 'JetBrains Mono', monospace;">HEALTHY FATS</div>
        <div style="font-size: 16pt; font-weight: 900; color: #facc15; margin: 1mm 0;">65g – 75g</div>
        <div style="font-size: 7.5pt; color: #cbd5e1;">Olive oil, natural peanut butter, avocados, whole eggs</div>
      </div>
    </div>

    <div class="card" style="border-color: rgba(255,255,255,0.15); margin-bottom: 4mm;">
      <h3 style="margin-top: 0; font-size: 11pt;">🏆 Luke's 3 Non-Negotiable Nutrition Rules:</h3>
      <p style="margin-bottom: 1.5mm; font-size: 9pt;"><span class="highlight">1. 85% Whole Clean Foods:</span> Fast food spikes estrogen and causes water retention. Whole clean foods fuel skin-splitting muscle pumps and vascularity.</p>
      <p style="margin-bottom: 1.5mm; font-size: 9pt;"><span class="cyan">2. 1 Full Gallon of Water Daily:</span> Muscle is 70% water. Dehydration drops strength by 15% immediately.</p>
      <p style="margin-bottom: 0; font-size: 9pt;"><span class="gold">3. 10,000 Steps Daily:</span> Never skip your daily walk. It keeps your insulin sensitivity high so surplus calories are pushed into muscle glycogen rather than lower belly fat.</p>
    </div>

    <h2>📓 Weekly Progressive Overload Logbook Sheet</h2>
    <p style="margin-bottom: 2mm;">
      Print this sheet or log it in your notes app. <span class="highlight">Every session, your goal is to beat the numbers from the previous week.</span>
    </p>

    <table>
      <thead>
        <tr>
          <th>Exercise</th>
          <th style="text-align: center;">Week 1 Target</th>
          <th style="text-align: center;">Week 2 Target</th>
          <th style="text-align: center;">Week 3 Target</th>
          <th style="text-align: center;">Week 4 Target</th>
          <th>Next Action Cue</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Flat Chest Press</b></td>
          <td style="text-align: center;">185 lbs x 8</td>
          <td style="text-align: center;">190 lbs x 7</td>
          <td style="text-align: center;">190 lbs x 8</td>
          <td style="text-align: center;">195 lbs x 6</td>
          <td><span class="highlight">+5 lbs when hitting 8 reps</span></td>
        </tr>
        <tr>
          <td><b>Hack Squat</b></td>
          <td style="text-align: center;">315 lbs x 8</td>
          <td style="text-align: center;">325 lbs x 7</td>
          <td style="text-align: center;">325 lbs x 9</td>
          <td style="text-align: center;">335 lbs x 7</td>
          <td><span class="highlight">+10 lbs when hitting 9 reps</span></td>
        </tr>
        <tr>
          <td><b>T-Bar Row</b></td>
          <td style="text-align: center;">135 lbs x 9</td>
          <td style="text-align: center;">145 lbs x 7</td>
          <td style="text-align: center;">145 lbs x 8</td>
          <td style="text-align: center;">150 lbs x 7</td>
          <td><span class="highlight">+5 lbs when hitting 8 reps</span></td>
        </tr>
        <tr>
          <td><b>Incline Chest Press</b></td>
          <td style="text-align: center;">155 lbs x 8</td>
          <td style="text-align: center;">160 lbs x 7</td>
          <td style="text-align: center;">160 lbs x 8</td>
          <td style="text-align: center;">165 lbs x 6</td>
          <td><span class="highlight">+5 lbs when hitting 8 reps</span></td>
        </tr>
        <tr>
          <td><b>DB Lateral Raises</b></td>
          <td style="text-align: center;">25 lbs x 12</td>
          <td style="text-align: center;">25 lbs x 12+</td>
          <td style="text-align: center;">30 lbs x 10</td>
          <td style="text-align: center;">30 lbs x 12</td>
          <td><span class="highlight">+5 lbs after 12 strict reps</span></td>
        </tr>
      </tbody>
    </table>

    <div style="text-align: center; margin-top: 4mm;">
      <div style="font-family: 'Space Grotesk', sans-serif; font-size: 11pt; font-weight: 800; color: #ffffff;">
        CONSISTENCY + TRUE FAILURE = UNSTOPPABLE GROWTH
      </div>
      <div style="font-size: 8.5pt; color: #94a3b8; font-family: 'JetBrains Mono', monospace; margin-top: 1mm;">
        For 1-on-1 Mentorship &amp; Form Audits: hluke2057@gmail.com
      </div>
    </div>

    <div class="footer-bar">
      <span>THE AESTHETIC BLUEPRINT</span>
      <span>PART IV: NUTRITION &amp; LOGBOOK</span>
      <span>PAGE 05 / 05</span>
    </div>
  </div>

</body>
</html>
`;

(async () => {
  console.log('--- GENERATING LUKE HAMILTON MASTER COURSE PDF ---');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // Generate high-resolution print PDF
  await page.pdf({
    path: OUT_LOCAL,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' }
  });

  // Sync to Brain Artifact Directory
  fs.copyFileSync(OUT_LOCAL, OUT_ARTIFACT);

  const stats = fs.statSync(OUT_LOCAL);
  console.log(`✅ SUCCESS! Generated Course PDF: ${OUT_LOCAL} (${(stats.size / 1024).toFixed(1)} KB)`);
  console.log(`Synced to Artifact Directory: ${OUT_ARTIFACT}`);

  await browser.close();
})();
