// scripts/generate_roman_course_pdf.js
// 100% Branded & Created by Roman | No Cut Agreement inside Course PDF | Plus Standalone Signable Agreement PDF for Roman
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

const OUT_COURSE_LOCAL = path.resolve('website/fitness/Roman_155_to_180_Master_Hypertrophy_Course.pdf');
const OUT_COURSE_ARTIFACT = path.join(ARTIFACT_DIR, 'Roman_155_to_180_Master_Hypertrophy_Course.pdf');

const OUT_AGREEMENT_LOCAL = path.resolve('website/fitness/Roman_Course_Partnership_Sign_Agreement.pdf');
const OUT_AGREEMENT_ARTIFACT = path.join(ARTIFACT_DIR, 'Roman_Course_Partnership_Sign_Agreement.pdf');

function getBase64Image(filename) {
  const p = path.resolve('website/fitness/images', filename);
  if (fs.existsSync(p)) {
    return 'data:image/jpeg;base64,' + fs.readFileSync(p).toString('base64');
  }
  return '';
}

const imgBefore1 = getBase64Image('luke_before_155_bathroom.jpg');
const imgAfterAbs = getBase64Image('luke_after_180_shredded_abs.jpg');
const imgAfterDelts = getBase64Image('luke_after_180_gym_delts.jpg');
const imgHero = getBase64Image('luke_and_roman_gym_training.jpg');

const courseHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Created by Roman - The 155 to 180 lbs Hypertrophy Protocol</title>
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
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 10.5pt;
      line-height: 1.48;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      padding: 16mm 18mm 18mm 18mm;
      position: relative;
      page-break-after: always;
      background: #05070d;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .page:last-child {
      page-break-after: avoid;
    }

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
      padding-bottom: 3.5mm;
      margin-bottom: 4mm;
      position: relative;
      z-index: 2;
    }

    .header-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      font-weight: 700;
      color: #a3e635;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .header-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      color: #94a3b8;
    }

    .footer-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 2.5mm;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      color: #64748b;
      position: relative;
      z-index: 2;
    }

    h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 25pt;
      font-weight: 900;
      line-height: 1.15;
      color: #ffffff;
      margin-bottom: 2mm;
    }

    h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 13pt;
      font-weight: 800;
      color: #38bdf8;
      margin-top: 3.5mm;
      margin-bottom: 2mm;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 11pt;
      font-weight: 700;
      color: #ffffff;
      margin-top: 2.5mm;
      margin-bottom: 1.5mm;
    }

    p {
      color: #cbd5e1;
      font-size: 9.2pt;
      line-height: 1.48;
      margin-bottom: 2.5mm;
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

    .card {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 3mm 4mm;
      margin-bottom: 3mm;
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

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1.5mm;
      margin-bottom: 3mm;
      font-size: 8pt;
    }

    th {
      background: rgba(255, 255, 255, 0.06);
      color: #38bdf8;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 7.5pt;
      padding: 5px 7px;
      text-align: left;
      border-bottom: 1.5px solid rgba(56, 189, 248, 0.3);
    }

    td {
      padding: 4.5px 7px;
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
      font-size: 7pt;
      padding: 2px 5px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .photo-grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 3mm;
      margin: 3mm 0;
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
      height: 48mm;
      object-fit: cover;
      display: block;
    }

    .photo-caption {
      padding: 1.8mm 2.5mm;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7pt;
      font-weight: 700;
      background: #0b0f17;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .dedication-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(90deg, rgba(250, 204, 21, 0.18) 0%, rgba(163, 230, 53, 0.18) 100%);
      border: 1.5px solid #facc15;
      color: #facc15;
      padding: 4px 12px;
      border-radius: 9999px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 800;
      font-size: 8.5pt;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 3.5mm;
    }
  </style>
</head>
<body>

  <!-- ============================================================ -->
  <!-- PAGE 1: COVER PAGE (100% CREATED & BUILT BY ROMAN) -->
  <!-- ============================================================ -->
  <div class="page">
    <div class="bg-glow"></div>
    <div style="position: relative; z-index: 2;">
      <div class="dedication-pill">
        <span>⚡</span> CREATED &amp; ENGINEERED BY ROMAN
      </div>
      <h1 style="font-size: 28pt; margin-bottom: 1.5mm; letter-spacing: -0.02em;">
        THE 155 ➔ 180 LBS<br>
        <span style="color: #a3e635;">HYPERTROPHY</span> PROTOCOL
      </h1>
      <div style="font-family: 'Space Grotesk', sans-serif; font-size: 12.5pt; color: #94a3b8; font-weight: 700; margin-bottom: 3mm;">
        Roman's "2-Set Mechanical Failure &amp; Progressive Overload" Master Blueprint
      </div>

      <!-- Hero Photo -->
      <div style="position: relative; border-radius: 12px; overflow: hidden; border: 2px solid rgba(163, 230, 53, 0.45); box-shadow: 0 15px 40px rgba(0,0,0,0.8); margin: 3.5mm 0 4.5mm 0;">
        <img src="${imgHero}" style="width: 100%; height: 135mm; object-fit: cover; display: block;" alt="Roman Gym Training">
        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(180deg, transparent 0%, rgba(5,7,13,0.92) 80%); padding: 6mm 6mm 3mm 6mm; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <div style="font-family: 'Space Grotesk', sans-serif; font-size: 13pt; font-weight: 800; color: #ffffff;">ROMAN FITNESS · OFFICIAL SYSTEM</div>
            <div style="font-size: 8.5pt; color: #38bdf8; font-family: 'JetBrains Mono', monospace;">Proven In The Gym • Heavy Iron • Zero Fluff</div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 11pt; font-weight: 800; color: #a3e635;">155 ➔ 180 LBS</div>
            <div style="font-size: 7.5pt; color: #cbd5e1; font-family: 'JetBrains Mono', monospace;">+25 LBS PURE LEAN MASS</div>
          </div>
        </div>
      </div>

      <!-- Credentials & Core Specs Card -->
      <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 3.5mm 5mm;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3mm; text-align: center;">
          <div>
            <div style="font-size: 7.5pt; font-family: 'JetBrains Mono', monospace; color: #94a3b8;">TRAINING METHOD</div>
            <div style="font-size: 10.5pt; font-weight: 800; color: #a3e635; margin-top: 1mm;">2 Sets To Failure</div>
            <div style="font-size: 7pt; color: #64748b;">RPE 10 / True Failure</div>
          </div>
          <div>
            <div style="font-size: 7.5pt; font-family: 'JetBrains Mono', monospace; color: #94a3b8;">PROGRESSIVE RULE</div>
            <div style="font-size: 10.5pt; font-weight: 800; color: #facc15; margin-top: 1mm;">+5 lbs Load Jump</div>
            <div style="font-size: 7pt; color: #64748b;">Strict Double Progression</div>
          </div>
          <div>
            <div style="font-size: 7.5pt; font-family: 'JetBrains Mono', monospace; color: #94a3b8;">CREATOR &amp; COACH</div>
            <div style="font-size: 10.5pt; font-weight: 800; color: #38bdf8; margin-top: 1mm;">Roman</div>
            <div style="font-size: 7pt; color: #64748b;">Master Hypertrophy Coach</div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bar">
      <span>THE AESTHETIC BLUEPRINT BY ROMAN</span>
      <span style="color: #facc15;">OFFICIAL MASTER EDITION — CREATED BY ROMAN</span>
      <span>PAGE 01 / 06</span>
    </div>
  </div>

  <!-- ============================================================ -->
  <!-- PAGE 2: ROMAN'S DIRECTIVE & VISUAL PROOF -->
  <!-- ============================================================ -->
  <div class="page">
    <div class="bg-glow"></div>
    <div>
      <div class="header-bar">
        <span class="header-title">PART I: THE DIRECTIVE &amp; VERIFIED TRANSFORMATION</span>
        <span class="header-tag">CREATED BY ROMAN</span>
      </div>

      <!-- Welcome Note -->
      <div class="card card-lime" style="padding: 3.5mm 4.5mm; margin-bottom: 3.5mm;">
        <h3 style="color: #a3e635; margin-top: 0; font-size: 11pt; display: flex; align-items: center; gap: 6px;">
          <span>✉️</span> Roman's Personal Directive:
        </h3>
        <p style="font-size: 8.8pt; color: #e2e8f0; line-height: 1.45; margin-bottom: 2mm;">
          "This is the exact, uncompromised blueprint designed to take you from <b>155 lbs slender to 180 lbs dense, vascular muscle</b> while keeping full 8-pack abs and sub-10% body fat. Most guys in the gym spend 2 hours doing 20 junk sets, texting on their phones, and wondering why their physique never changes. We don't do that here."
        </p>
        <p style="font-size: 8.8pt; color: #cbd5e1; line-height: 1.45; margin-bottom: 0;">
          "Every exercise in this routine is executed for <b>exactly 2 working sets taken to absolute mechanical failure</b>. You track every rep and pound in your logbook. If you hit your rep ceiling on Set 1, you <span class="highlight">add 5 lbs next week</span>. Eat in a calibrated surplus, nail your sleep, and execute with relentless intensity. Let's build a monster physique." — <i>Roman</i>
        </p>
      </div>

      <h2>📸 Visual Proof: 155 lbs Baseline vs. 180 lbs Shredded</h2>
      <p style="font-size: 8.8pt; margin-bottom: 2.5mm;">
        Real results don't come from dirty bulking or bloated water retention. This protocol builds pure myofibrillar muscle density:
      </p>

      <div class="photo-grid-3">
        <div class="photo-card" style="border-color: rgba(239,68,68,0.4);">
          <img src="${imgBefore1}" alt="155 lbs Starting Baseline">
          <div class="photo-caption" style="color: #f87171;">START: 155 LBS (BASELINE)</div>
        </div>
        <div class="photo-card" style="border-color: rgba(56,189,248,0.4);">
          <img src="${imgAfterAbs}" alt="180 lbs Shredded 8-Pack">
          <div class="photo-caption" style="color: #38bdf8;">180 LBS (SHREDDED 8-PACK)</div>
        </div>
        <div class="photo-card" style="border-color: rgba(163,230,53,0.4);">
          <img src="${imgAfterDelts}" alt="180 lbs 3D Capped Delts">
          <div class="photo-caption" style="color: #a3e635;">180 LBS (3D BOULDER DELTS)</div>
        </div>
      </div>

      <h2>🔬 The Science: Why 2 Failure Sets Demolish 20 Junk Sets</h2>
      <p style="font-size: 8.8pt; margin-bottom: 2.5mm;">
        When you take a set to true mechanical failure (0 reps in reserve, involuntary slowing of bar speed), your central nervous system recruits <span class="cyan">100% of high-threshold Type IIx muscle fibers</span>. Research proves that sets 1 and 2 deliver over 90% of the hypertrophic signaling. Sets 3, 4, and 5 only create systemic fatigue, joint inflammation, and elevated cortisol that delays recovery by days.
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; margin-top: 1mm;">
        <div class="card" style="border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.06); padding: 3mm;">
          <div style="font-weight: 800; font-size: 8.5pt; color: #f87171; margin-bottom: 1.5mm;">❌ 20 JUNK SET METHOD</div>
          <ul style="font-size: 8pt; color: #cbd5e1; padding-left: 4mm; line-height: 1.45;">
            <li>2+ hours wasted in the gym</li>
            <li>Excess tendon &amp; joint wear</li>
            <li>High cortisol, blunted testosterone</li>
            <li>Guessing weights without progression</li>
          </ul>
        </div>

        <div class="card" style="border-color: rgba(163,230,53,0.3); background: rgba(163,230,53,0.06); padding: 3mm;">
          <div style="font-weight: 800; font-size: 8.5pt; color: #a3e635; margin-bottom: 1.5mm;">✅ ROMAN'S 2-SET FAILURE PROTOCOL</div>
          <ul style="font-size: 8pt; color: #cbd5e1; padding-left: 4mm; line-height: 1.45;">
            <li>45–50 minutes max workout density</li>
            <li>100% high-threshold fiber stimulation</li>
            <li>Rapid CNS &amp; muscular recovery</li>
            <li>Every pound logged &amp; beaten weekly</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bar">
      <span>THE AESTHETIC BLUEPRINT BY ROMAN</span>
      <span>PART I: THE DIRECTIVE &amp; VERIFIED PROOF</span>
      <span>PAGE 02 / 06</span>
    </div>
  </div>

  <!-- ============================================================ -->
  <!-- PAGE 3: THE GOLDEN LAW & WARM-UP RAMPING PROTOCOL -->
  <!-- ============================================================ -->
  <div class="page">
    <div class="bg-glow"></div>
    <div>
      <div class="header-bar">
        <span class="header-title">PART II: THE GOLDEN RULE &amp; EXECUTION MECHANICS</span>
        <span class="header-tag">CREATED BY ROMAN</span>
      </div>

      <div class="card card-gold" style="padding: 4mm 5mm; margin-bottom: 3.5mm;">
        <h2 style="color: #facc15; margin-top: 0; font-size: 13pt; margin-bottom: 1.5mm;">
          ⚡ The Golden Law: "Adding Weight IS Progressive Overload"
        </h2>
        <p style="font-size: 9.5pt; color: #ffffff; font-weight: 700; line-height: 1.45; margin-bottom: 2mm;">
          "If you bench 185 lbs for 8 reps today, and 6 months from now you still bench 185 lbs for 8 reps, you will look identical. The only stimulus that forces a muscle cell to expand is mechanical tension it has never felt before."
        </p>
        <p style="font-size: 8.5pt; color: #cbd5e1; line-height: 1.45; margin-bottom: 0;">
          Your logbook is your contract with muscle growth. Every workout, your sole mission is to beat your previous numbers: either by <span class="highlight">adding 5 lbs to the bar</span> or by fighting for 1 extra clean rep.
        </p>
      </div>

      <h2>📐 The Double Progression Algorithm</h2>
      <p style="font-size: 8.8pt;">
        Every exercise has an assigned <b>Rep Target Bracket</b> (e.g. 6–8 reps, or 8–10 reps). Here is the exact mathematical progression rule you must execute:
      </p>

      <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 3mm 4mm; margin-bottom: 3mm;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; font-size: 8.2pt;">
          <div style="border-right: 1px solid rgba(255,255,255,0.1); padding-right: 3mm;">
            <div style="color: #38bdf8; font-weight: 800; font-family: 'JetBrains Mono', monospace; margin-bottom: 1mm;">STEP 1: REPS FIRST</div>
            <p style="margin: 0; color: #cbd5e1;">Pick a working weight where you hit failure at the bottom of the rep bracket (e.g., 185 lbs x 6 reps). Keep this weight until you can hit the top bracket (8 reps) with strict form.</p>
          </div>
          <div>
            <div style="color: #a3e635; font-weight: 800; font-family: 'JetBrains Mono', monospace; margin-bottom: 1mm;">STEP 2: ADD WEIGHT IMMEDIATELY</div>
            <p style="margin: 0; color: #cbd5e1;">The moment Set 1 hits 8 clean reps, you <b>must add 5 lbs next week</b> (190 lbs). Your reps will naturally drop to 6 or 7. Build back up to 8. Repeat forever.</p>
          </div>
        </div>
      </div>

      <h2>🔥 The Non-Fatiguing Warm-Up Ramping Protocol</h2>
      <p style="font-size: 8.8pt;">
        Most lifters exhaust their glycogen on warm-up sets. Follow this strict 2-set ramp to prime your joints and nervous system without accumulating any metabolic fatigue:
      </p>

      <table>
        <thead>
          <tr>
            <th>Warm-Up Phase</th>
            <th>Weight / Load</th>
            <th>Reps</th>
            <th>Purpose &amp; Objective</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Warm-Up Set 1</b></td>
            <td>50% of Working Weight</td>
            <td>8 reps</td>
            <td>Groove bar path, lubricate synovial joint capsule, warm tendons</td>
          </tr>
          <tr>
            <td><b>Warm-Up Set 2</b></td>
            <td>75% of Working Weight</td>
            <td>3 reps</td>
            <td>Prime central nervous system fire rate; zero muscle burn or fatigue</td>
          </tr>
          <tr>
            <td><b>WORKING SET 1</b></td>
            <td>100% Target Weight</td>
            <td><b>TO FAILURE</b></td>
            <td><span class="badge-sets">All-Out Effort</span> Maximum mechanical tension; log every rep</td>
          </tr>
          <tr>
            <td><b>WORKING SET 2</b></td>
            <td>100% Target Weight</td>
            <td><b>TO FAILURE</b></td>
            <td>Rest 2.5–3 min after Set 1; second all-out failure set to recruit remaining fibers</td>
          </tr>
        </tbody>
      </table>

      <h2>⏱️ Strict Tempo &amp; Contraction Cues</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2.5mm;">
        <div class="card" style="padding: 2.5mm; text-align: center;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 8pt; color: #38bdf8; font-weight: 800;">3-SEC ECCENTRIC</div>
          <div style="font-size: 7.5pt; color: #cbd5e1; margin-top: 1mm;">Lower the weight under total control. The negative causes 80% of muscle micro-tears.</div>
        </div>
        <div class="card" style="padding: 2.5mm; text-align: center;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 8pt; color: #facc15; font-weight: 800;">1-SEC STRETCH PAUSE</div>
          <div style="font-size: 7.5pt; color: #cbd5e1; margin-top: 1mm;">Dead stop at maximum stretch. Eliminates tendon bounce and forces muscle recruitment.</div>
        </div>
        <div class="card" style="padding: 2.5mm; text-align: center;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 8pt; color: #a3e635; font-weight: 800;">EXPLOSIVE DRIVE</div>
          <div style="font-size: 7.5pt; color: #cbd5e1; margin-top: 1mm;">Push through the concentric with maximum intent to ignite high-threshold motor units.</div>
        </div>
      </div>
    </div>

    <div class="footer-bar">
      <span>THE AESTHETIC BLUEPRINT BY ROMAN</span>
      <span>PART II: THE GOLDEN RULE &amp; EXECUTION</span>
      <span>PAGE 03 / 06</span>
    </div>
  </div>

  <!-- ============================================================ -->
  <!-- PAGE 4: PUSH & PULL WORKOUT PROTOCOLS -->
  <!-- ============================================================ -->
  <div class="page">
    <div class="bg-glow"></div>
    <div>
      <div class="header-bar">
        <span class="header-title">PART III: WORKOUT PROTOCOLS (PUSH &amp; PULL)</span>
        <span class="header-tag">CREATED BY ROMAN</span>
      </div>

      <h2>🔴 DAY 1: PUSH PROTOCOL (Chest, Shoulders, Triceps)</h2>
      <p style="margin-bottom: 1.5mm; font-size: 8.5pt;">
        <span class="badge-sets">2 SETS TO FAILURE ALL</span> 2 warm-up ramp sets on the first exercise only. Every working set is taken to absolute mechanical failure.
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
            <td><b>Flat Chest Press</b> (DB or Machine)</td>
            <td>Mid / Lower Pectorals</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">6–8</td>
            <td>3-sec descent, full chest stretch at bottom; drive elbows together at peak</td>
          </tr>
          <tr>
            <td><b>Incline Chest Press</b> (Smith / DB)</td>
            <td>Upper Clavicular Pecs</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">6–9</td>
            <td>30° bench angle; tuck elbows 45°, drive up toward chin for upper chest shelf</td>
          </tr>
          <tr>
            <td><b>Pec Deck Flye</b></td>
            <td>Inner Sternal Pecs</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">8–10</td>
            <td>Soft elbow bend; squeeze pads together and hold contraction for 1 full second</td>
          </tr>
          <tr>
            <td><b>DB Lateral Raises</b></td>
            <td>Lateral Deltoid Head</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">10–12</td>
            <td>Lean forward 10°, lead with elbows; 5-sec isometric hold on the final rep</td>
          </tr>
          <tr>
            <td><b>Cable Lateral Raises</b> (Single Arm)</td>
            <td>Constant Tension Delts</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">10–12</td>
            <td>Cable set at wrist height behind back; smooth continuous tension throughout</td>
          </tr>
          <tr>
            <td><b>Skull Crushers</b> (EZ Bar / DB)</td>
            <td>Triceps Long Head</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">8–10</td>
            <td>Lower bar behind head (not forehead) for maximum stretch on the long head</td>
          </tr>
          <tr>
            <td><b>Tricep Rope Pushdown</b></td>
            <td>Lateral Triceps Horseshoe</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">10–12</td>
            <td>Flare rope outward at bottom lockout; keep elbows pinned to ribcage</td>
          </tr>
          <tr>
            <td><b>Tricep Pushdown Bar</b></td>
            <td>Heavy Overload Triceps</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">6–8</td>
            <td>Straight bar, lean slightly over bar, drive straight down with strict lockout</td>
          </tr>
        </tbody>
      </table>

      <h2>🔵 DAY 2: PULL PROTOCOL (Back, Rear Delts, Biceps)</h2>
      <p style="margin-bottom: 1.5mm; font-size: 8.5pt;">
        <span class="badge-sets">2 SETS TO FAILURE ALL</span> Initiate every pull by driving your elbows down and back into your hips, not by yanking with your forearms.
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
            <td><b>Lat Pulldowns</b> (Neutral / Close)</td>
            <td>Upper Lat Width / V-Taper</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">8–10</td>
            <td>Pull elbows straight down into back pockets; arch chest slightly to ceiling</td>
          </tr>
          <tr>
            <td><b>Lat Pullovers</b> (Cable / DB)</td>
            <td>Lat Sweep Isolation</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">10–12</td>
            <td>Slight bend in elbows; sweep bar in a wide arcing motion down to thighs</td>
          </tr>
          <tr>
            <td><b>T-Bar Row</b></td>
            <td>Mid-Back &amp; Rhomboid Meat</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">6–8</td>
            <td>45° hip hinge; pull to lower sternum, squeeze shoulder blades for 1 second</td>
          </tr>
          <tr>
            <td><b>Unilateral Row Machine</b></td>
            <td>Single-Side Lat Stretch</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">8–10</td>
            <td>Allow torso to rotate slightly forward on negative for extreme lat stretch</td>
          </tr>
          <tr>
            <td><b>Hyperextensions</b></td>
            <td>Spinal Erectors &amp; Glutes</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">10–12</td>
            <td>Neutral spine; hold 45 lb plate across chest, squeeze erectors at top</td>
          </tr>
          <tr>
            <td><b>Reverse Pec Deck</b></td>
            <td>Rear Deltoid Head</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">12–15</td>
            <td>Drive knuckles outward in wide circle; do not pinch shoulder blades together</td>
          </tr>
          <tr>
            <td><b>Cable Curl</b></td>
            <td>Bicep Peak / Short Head</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">8–10</td>
            <td>Elbows pinned slightly in front of hips; full strict supination at top</td>
          </tr>
          <tr>
            <td><b>Cable Hammer Curl</b> (Rope)</td>
            <td>Brachialis &amp; Forearms</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">10–12</td>
            <td>Thumbs-up neutral grip; pushes bicep out for 3D arm thickness from front</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer-bar">
      <span>THE AESTHETIC BLUEPRINT BY ROMAN</span>
      <span>PART III: PUSH &amp; PULL PROTOCOLS</span>
      <span>PAGE 04 / 06</span>
    </div>
  </div>

  <!-- ============================================================ -->
  <!-- PAGE 5: LEGS, ABS & RECOVERY PROTOCOLS -->
  <!-- ============================================================ -->
  <div class="page">
    <div class="bg-glow"></div>
    <div>
      <div class="header-bar">
        <span class="header-title">PART IV: LEGS, ABS &amp; RECOVERY MATRIX</span>
        <span class="header-tag">CREATED BY ROMAN</span>
      </div>

      <h2>🟢 DAY 3: LEGS PROTOCOL (Quads, Hamstrings, Adductors, Calves)</h2>
      <p style="margin-bottom: 1.5mm; font-size: 8.5pt;">
        <span class="badge-sets">2 SETS TO FAILURE ALL</span> Heavy leg training releases the highest systemic growth hormone response. Every set must be executed with full depth.
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
            <td style="text-align: center;">6–9</td>
            <td>Feet low on platform for maximum knee flexion; 3-sec descent below parallel</td>
          </tr>
          <tr>
            <td><b>Romanian Deadlifts (RDLs)</b></td>
            <td>Hamstring Belly &amp; Glutes</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">8–10</td>
            <td>Push hips straight back like touching a wall behind you; stop when hips stop</td>
          </tr>
          <tr>
            <td><b>Hip Abductor Machine</b></td>
            <td>Glute Medius / Hip Shelf</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">12–15</td>
            <td>Lean slightly forward; push knees wide apart, pause 1-sec at full spread</td>
          </tr>
          <tr>
            <td><b>Hip Adductor Machine</b></td>
            <td>Inner Thigh Density</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">12–15</td>
            <td>Slow controlled stretch on the negative; squeeze pads tight together</td>
          </tr>
          <tr>
            <td><b>Leg Extension</b></td>
            <td>Rectus Femoris Quad Peak</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">10–12</td>
            <td>Hold lockout at top for 1 full second; fight the eccentric descent down</td>
          </tr>
          <tr>
            <td><b>Leg Curl</b> (Lying or Seated)</td>
            <td>Hamstring Peak</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">8–10</td>
            <td>Keep toes dorsiflexed; do not allow lower back or hips to buck off pad</td>
          </tr>
          <tr>
            <td><b>Standing Calf Raises</b></td>
            <td>Gastrocnemius Calf Meat</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td style="text-align: center;">12–15</td>
            <td>2-sec dead stop at full bottom stretch; explode onto big toes at top</td>
          </tr>
        </tbody>
      </table>

      <h2>🟡 ABS PROTOCOL (3x Per Week, 2 Sets to Failure)</h2>
      <p style="margin-bottom: 1.5mm; font-size: 8.5pt;">
        Thick, deeply etched 8-pack abs are built by loading abdominal flexion under resistance, not by doing 500 air crunches.
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
            <td>Upper &amp; Mid 8-Pack Core</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td>Round spine into tight ball; exhale all oxygen at peak crunch, 1-sec pause</td>
          </tr>
          <tr>
            <td><b>Hanging / Captain's Chair Leg Raises</b></td>
            <td>Lower Ab Pouch &amp; Pelvis</td>
            <td style="text-align: center;"><span class="badge-sets">2 to Fail</span></td>
            <td>Do not swing legs; curl your pelvis UP toward your sternum on every single rep</td>
          </tr>
        </tbody>
      </table>

      <h2>🧠 CNS Recovery, Deep Sleep &amp; Hydration Matrix</h2>
      <div class="card card-lime" style="padding: 3mm 4mm; margin-bottom: 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; font-size: 8.2pt;">
          <div>
            <div style="font-weight: 800; color: #a3e635; margin-bottom: 1mm;">💤 7.5–8.5 HRS DEEP SLEEP MATRIX</div>
            <p style="margin: 0; color: #cbd5e1;">Muscle protein synthesis peaks during Stage 3 slow-wave sleep when human growth hormone surges. 400mg Magnesium Glycinate 30 min before bed improves deep sleep latency and relaxes muscle cramping.</p>
          </div>
          <div>
            <div style="font-weight: 800; color: #38bdf8; margin-bottom: 1mm;">💧 1 GALLON WATER &amp; ELECTROLYTES</div>
            <p style="margin: 0; color: #cbd5e1;">Muscle tissue is 70% water. A 2% drop in hydration cuts muscular power by 15%. Drink 1 gallon of filtered water daily with 1/2 tsp pink Himalayan salt pre-workout for skin-splitting pumps.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bar">
      <span>THE AESTHETIC BLUEPRINT BY ROMAN</span>
      <span>PART IV: LEGS, ABS &amp; RECOVERY</span>
      <span>PAGE 05 / 06</span>
    </div>
  </div>

  <!-- ============================================================ -->
  <!-- PAGE 6: NUTRITION, PRINTABLE LOGBOOK & SUPPLEMENT STACK -->
  <!-- ============================================================ -->
  <div class="page">
    <div class="bg-glow"></div>
    <div>
      <div class="header-bar">
        <span class="header-title">PART V: NUTRITION, LOGBOOK &amp; SUPPLEMENT PROTOCOL</span>
        <span class="header-tag">CREATED BY ROMAN</span>
      </div>

      <h2>🥩 The 155 ➔ 180 Lean Bulk Nutrition Blueprint</h2>
      <p style="font-size: 8.5pt; margin-bottom: 2mm;">
        To gain 25 lbs of dense muscle without gaining waistline fat, maintain a controlled <b>+350 to +500 kcal caloric surplus</b>:
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2.5mm; margin-bottom: 3mm;">
        <div class="card" style="border-color: rgba(56,189,248,0.4); text-align: center; padding: 2.5mm;">
          <div style="font-size: 7.5pt; color: #94a3b8; font-family: 'JetBrains Mono', monospace;">DAILY PROTEIN</div>
          <div style="font-size: 14pt; font-weight: 900; color: #38bdf8; margin: 1mm 0;">180g – 195g</div>
          <div style="font-size: 7pt; color: #cbd5e1;">Chicken, 93/7 beef, eggs, Greek yogurt, whey isolate</div>
        </div>

        <div class="card" style="border-color: rgba(163,230,53,0.4); text-align: center; padding: 2.5mm;">
          <div style="font-size: 7.5pt; color: #94a3b8; font-family: 'JetBrains Mono', monospace;">COMPLEX CARBS</div>
          <div style="font-size: 14pt; font-weight: 900; color: #a3e635; margin: 1mm 0;">340g – 380g</div>
          <div style="font-size: 7pt; color: #cbd5e1;">Jasmine rice, oats, sweet potatoes, cream of rice</div>
        </div>

        <div class="card" style="border-color: rgba(250,204,21,0.4); text-align: center; padding: 2.5mm;">
          <div style="font-size: 7.5pt; color: #94a3b8; font-family: 'JetBrains Mono', monospace;">HEALTHY FATS</div>
          <div style="font-size: 14pt; font-weight: 900; color: #facc15; margin: 1mm 0;">65g – 75g</div>
          <div style="font-size: 7pt; color: #cbd5e1;">Extra virgin olive oil, peanut butter, avocados, whole eggs</div>
        </div>
      </div>

      <h2>📓 Weekly Progressive Overload Gym Logbook Sheet</h2>
      <p style="font-size: 8.5pt; margin-bottom: 1.5mm;">
        Print this sheet or log in your notes. <span class="highlight">Your goal is to beat the previous week's numbers every single session.</span>
      </p>

      <table>
        <thead>
          <tr>
            <th>Exercise</th>
            <th style="text-align: center;">Week 1 Target</th>
            <th style="text-align: center;">Week 2 Target</th>
            <th style="text-align: center;">Week 3 Target</th>
            <th style="text-align: center;">Week 4 Target</th>
            <th>Progression Action Rule</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Flat Chest Press</b></td>
            <td style="text-align: center;">185 lbs x 8</td>
            <td style="text-align: center;">190 lbs x 6</td>
            <td style="text-align: center;">190 lbs x 8</td>
            <td style="text-align: center;">195 lbs x 6</td>
            <td><span class="highlight">+5 lbs immediately upon hitting 8 reps</span></td>
          </tr>
          <tr>
            <td><b>Hack Squat</b></td>
            <td style="text-align: center;">315 lbs x 8</td>
            <td style="text-align: center;">325 lbs x 7</td>
            <td style="text-align: center;">325 lbs x 9</td>
            <td style="text-align: center;">335 lbs x 7</td>
            <td><span class="highlight">+10 lbs upon hitting 9 deep reps</span></td>
          </tr>
          <tr>
            <td><b>T-Bar Row</b></td>
            <td style="text-align: center;">135 lbs x 8</td>
            <td style="text-align: center;">145 lbs x 7</td>
            <td style="text-align: center;">145 lbs x 8</td>
            <td style="text-align: center;">150 lbs x 7</td>
            <td><span class="highlight">+5 lbs upon hitting 8 strict reps</span></td>
          </tr>
          <tr>
            <td><b>Incline Chest Press</b></td>
            <td style="text-align: center;">155 lbs x 8</td>
            <td style="text-align: center;">160 lbs x 7</td>
            <td style="text-align: center;">160 lbs x 8</td>
            <td style="text-align: center;">165 lbs x 6</td>
            <td><span class="highlight">+5 lbs upon hitting 8 reps</span></td>
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

      <!-- Roman's Essential Supplement & Pre-Workout Stack -->
      <div class="card card-gold" style="padding: 3.5mm 4.5mm; margin-top: 2.5mm; margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5mm;">
          <div style="font-family: 'Space Grotesk', sans-serif; font-size: 9.5pt; font-weight: 800; color: #facc15;">
            ⚡ ROMAN'S EVIDENCE-BASED SUPPLEMENT PROTOCOL
          </div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 7.5pt; color: #a3e635; font-weight: 700;">
            ROMAN FITNESS
          </div>
        </div>
        <p style="font-size: 7.9pt; color: #e2e8f0; line-height: 1.45; margin-bottom: 2mm;">
          Skip the overpriced fat burners and proprietary blends. These 4 proven compounds maximize ATP power output, cell volumization, and overnight recovery:
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; font-size: 7.6pt; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2mm;">
          <div>
            <div style="color: #a3e635; font-weight: 800;">1. Creatine Monohydrate (5g Daily)</div>
            <div style="color: #cbd5e1;">Saturates intramuscular phosphocreatine stores to squeeze out 1–2 extra reps on heavy sets.</div>
          </div>
          <div>
            <div style="color: #38bdf8; font-weight: 800;">2. L-Citrulline (6g–8g Pre-Workout)</div>
            <div style="color: #cbd5e1;">Maximizes nitric oxide vasodilation, nutrient delivery, and skin-splitting vascularity.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bar">
      <span>THE AESTHETIC BLUEPRINT BY ROMAN</span>
      <span style="color: #facc15;">PART V: NUTRITION, LOGBOOK &amp; SUPPLEMENTS</span>
      <span>PAGE 06 / 06</span>
    </div>
  </div>

</body>
</html>
`;

// ============================================================================
// STANDALONE SIGNABLE AGREEMENT PDF FOR ROMAN TO SIGN
// ============================================================================
const agreementHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Roman Course &amp; Revenue Agreement</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700;800&family=Space+Grotesk:wght@700;800;900&display=swap');

    @page {
      size: A4 portrait;
      margin: 0;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: #ffffff;
      color: #0f172a;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 9.5pt;
      line-height: 1.42;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      overflow: hidden;
      padding: 15mm 18mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #ffffff;
    }

    .top-banner {
      border-bottom: 3px solid #0f172a;
      padding-bottom: 3.5mm;
      margin-bottom: 4mm;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .doc-badge {
      display: inline-block;
      background: #0f172a;
      color: #ffffff;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      font-weight: 800;
      padding: 3px 9px;
      border-radius: 4px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 2mm;
    }

    h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18.5pt;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.02em;
      line-height: 1.15;
    }

    .section-box {
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      padding: 3.5mm 4.5mm;
      margin-bottom: 3.5mm;
    }

    .section-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 10pt;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 1.5mm;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 1mm;
    }

    p, li {
      font-size: 9pt;
      color: #1e293b;
      line-height: 1.45;
    }

    ul {
      padding-left: 5mm;
    }

    li {
      margin-bottom: 1.2mm;
    }

    .split-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4mm;
      margin: 2.5mm 0 1mm 0;
    }

    .split-card {
      border: 2px solid #0f172a;
      border-radius: 8px;
      padding: 3mm;
      text-align: center;
      background: #ffffff;
    }

    .sig-area {
      border: 2px solid #0f172a;
      border-radius: 10px;
      padding: 4.5mm 5.5mm;
      background: #f8fafc;
      margin-top: 2mm;
    }

    .sig-line {
      border-bottom: 2px solid #0f172a;
      height: 9mm;
      margin-bottom: 1.5mm;
    }

    .sig-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="page">
    <div>
      <div class="top-banner">
        <div>
          <div class="doc-badge">OFFICIAL COURSE &amp; REVENUE SPLIT AGREEMENT</div>
          <h1>FITNESS COURSE OWNERSHIP &amp;<br>REVENUE SHARE ACKNOWLEDGMENT</h1>
        </div>
        <div style="text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 8.5pt; color: #475569;">
          <div><b>DOCUMENT ID:</b> RMN-2026-01</div>
          <div><b>STATUS:</b> READY FOR SIGNATURE</div>
        </div>
      </div>

      <p style="margin-bottom: 4mm;">
        This Course Ownership, White-Label Branding, and Revenue Share Agreement (the <b>"Agreement"</b>) sets forth the binding terms agreed to by <b>Roman</b> regarding the launch, sale, and monetization of <b>"The 155 ➔ 180 lbs Hypertrophy Protocol"</b> digital course, training blueprint, and associated coaching programs (collectively, the <b>"Course"</b>).
      </p>

      <div class="section-box">
        <div class="section-title">1. 100% Public Branding &amp; Authorship by Roman</div>
        <ul>
          <li><b>Full Front-Facing Attribution:</b> All public-facing course PDFs, workout trackers, sales pages, and marketing materials are branded exclusively as created, authored, and led by <b>Roman ("Roman Fitness")</b>.</li>
          <li><b>Clean Client Experience:</b> All internal revenue-split clauses have been completely removed from the customer-facing Course PDF so Roman's clients and students only see Roman's name and brand.</li>
        </ul>
      </div>

      <div class="section-box">
        <div class="section-title">2. Revenue Distribution &amp; Royalty Split</div>
        <p style="margin-bottom: 2.5mm;">
          In exchange for the complete technical buildout, course architecture, digital design, and web infrastructure provided to launch the Course, Roman agrees to the following gross revenue split on all sales generated by the Course, community memberships, and associated online coaching packages:
        </p>
        <div class="split-grid">
          <div class="split-card">
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 8pt; font-weight: 800; color: #475569;">ROMAN'S NET SHARE</div>
            <div style="font-family: 'Space Grotesk', sans-serif; font-size: 26pt; font-weight: 900; color: #0f172a; margin: 1mm 0;">75%</div>
            <div style="font-size: 8.5pt; color: #334155;">Retained directly by Roman on all course &amp; coaching sales</div>
          </div>
          <div class="split-card">
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 8pt; font-weight: 800; color: #475569;">PLATFORM &amp; BUILDER CUT</div>
            <div style="font-family: 'Space Grotesk', sans-serif; font-size: 26pt; font-weight: 900; color: #0f172a; margin: 1mm 0;">25%</div>
            <div style="font-size: 8.5pt; color: #334155;">Paid on gross sales of the Course &amp; coaching tiers</div>
          </div>
        </div>
      </div>

      <div class="section-box">
        <div class="section-title">3. Payout Schedule &amp; Transparency</div>
        <ul>
          <li><b>Automated or Monthly Settlement:</b> The 25% revenue share shall be settled automatically via checkout split (Stripe / Whop) or paid out on the 1st of each month for all gross sales collected during the prior month.</li>
          <li><b>Good-Faith Accounting:</b> Roman agrees to maintain transparent access to course checkout analytics and sales volume logs.</li>
          <li><b>Binding Acknowledgment:</b> By signing below, Roman confirms that he has reviewed the Course materials, approves the 100% Roman-branded release, and agrees to the 75% / 25% revenue split terms above.</li>
        </ul>
      </div>

      <div class="sig-area">
        <div style="font-family: 'Space Grotesk', sans-serif; font-size: 11pt; font-weight: 800; color: #0f172a; margin-bottom: 4mm; text-transform: uppercase;">
          ✍️ Official Acceptance &amp; Signature by Roman
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 6mm; margin-bottom: 5mm;">
          <div>
            <div class="sig-line"></div>
            <div class="sig-label">Roman — Signature</div>
          </div>
          <div>
            <div class="sig-line"></div>
            <div class="sig-label">Date Signed</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6mm;">
          <div>
            <div class="sig-line" style="height: 8mm; display: flex; align-items: flex-end; padding-bottom: 1mm; font-weight: 700; font-size: 10.5pt;">Roman</div>
            <div class="sig-label">Printed Name</div>
          </div>
          <div>
            <div class="sig-line" style="height: 8mm;"></div>
            <div class="sig-label">Phone / Email Contact</div>
          </div>
        </div>
      </div>
    </div>

    <div style="border-top: 1px solid #cbd5e1; padding-top: 3mm; display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 7.5pt; color: #64748b;">
      <span>ROMAN FITNESS · OFFICIAL COURSE AGREEMENT</span>
      <span>PAGE 1 OF 1</span>
    </div>
  </div>
</body>
</html>
`;

(async () => {
  console.log('Launching browser to render Roman Course PDF (No Cut Agreement, 100% Roman) + Standalone Signable Agreement PDF...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();

  // 1. Render 6-Page Course PDF (100% by Roman, no cut agreement inside)
  await page.setContent(courseHtml, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page.pdf({
    path: OUT_COURSE_LOCAL,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' }
  });
  fs.copyFileSync(OUT_COURSE_LOCAL, OUT_COURSE_ARTIFACT);
  console.log(`✓ Course PDF saved: ${OUT_COURSE_LOCAL}`);

  // Screenshot Page 1 and Page 6 of Course PDF for verification
  const coursePages = await page.$$('.page');
  if (coursePages[0]) {
    await coursePages[0].screenshot({ path: path.join(ARTIFACT_DIR, 'roman_course_clean_page_1_cover.png') });
  }
  if (coursePages[5]) {
    await coursePages[5].screenshot({ path: path.join(ARTIFACT_DIR, 'roman_course_clean_page_6_no_cut.png') });
  }

  // 2. Render 1-Page Standalone Signable Agreement PDF for Roman
  const page2 = await browser.newPage();
  await page2.setContent(agreementHtml, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page2.pdf({
    path: OUT_AGREEMENT_LOCAL,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' }
  });
  fs.copyFileSync(OUT_AGREEMENT_LOCAL, OUT_AGREEMENT_ARTIFACT);
  console.log(`✓ Signable Agreement PDF saved: ${OUT_AGREEMENT_LOCAL}`);

  const agreementPages = await page2.$$('.page');
  if (agreementPages[0]) {
    await agreementPages[0].screenshot({ path: path.join(ARTIFACT_DIR, 'roman_signable_agreement_preview.png') });
  }

  await browser.close();
  console.log('✓ All PDFs and proof images generated!');
})();
