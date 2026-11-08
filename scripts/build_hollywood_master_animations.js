const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🎬 Assembling Hollywood Master Animation Engine for VantorX Reels...');

const targetFile = path.join(__dirname, '..', 'website', 'demo', 'reel-creator.html');
let raw = fs.readFileSync(targetFile, 'utf8');
const isCRLF = raw.includes('\r\n');
let html = raw.replace(/\r\n/g, '\n');

// 1. Relocate the stage overlay toolbar so it sits cleanly above the canvas rather than obstructing it
const oldStageOverlay = `    <div class="stage-overlay">
      
      <div style="display:flex;gap:6px">
        <button id="btnViewCanvas" onclick="switchStageView('canvas')" style="background:rgba(245,158,11,0.9);color:#0b0f19;border:none;font-size:11px;font-weight:800;padding:3px 10px;border-radius:6px;cursor:pointer">Interactive Canvas</button>
        <button id="btnViewVideo" onclick="switchStageView('video')" style="background:rgba(255,255,255,0.15);color:#ffffff;border:1px solid rgba(255,255,255,0.2);font-size:11px;font-weight:600;padding:3px 10px;border-radius:6px;cursor:pointer">🎬 Watch Master MP4</button>
      </div>

      <div class="stage-pill rec-indicator" id="recStatusPill">
        <span class="rec-dot"></span>
        <span id="recText">READY</span>
      </div>
    </div>`;

const newToolbarAbove = `    <!-- Clean Top Toolbar Above Phone Screen (Never Covers Video Headers) -->
    <div class="stage-top-toolbar" style="display:flex;justify-content:space-between;align-items:center;width:100%;max-width:440px;margin:0 auto 12px auto;padding:0 4px">
      <div style="display:flex;gap:8px">
        <button id="btnViewCanvas" onclick="switchStageView('canvas')" style="background:rgba(245,158,11,0.95);color:#0b0f19;border:none;font-size:12px;font-weight:800;padding:6px 14px;border-radius:8px;cursor:pointer;box-shadow:0 0 12px rgba(245,158,11,0.3);transition:all 0.2s">Interactive Canvas</button>
        <button id="btnViewVideo" onclick="switchStageView('video')" style="background:rgba(255,255,255,0.12);color:#ffffff;border:1px solid rgba(255,255,255,0.22);font-size:12px;font-weight:600;padding:6px 14px;border-radius:8px;cursor:pointer;transition:all 0.2s">🎬 Watch Master MP4</button>
      </div>

      <div class="stage-pill rec-indicator" id="recStatusPill" style="padding:5px 12px;border-radius:20px;background:rgba(15,23,42,0.85);border:1px solid rgba(255,255,255,0.15);display:flex;align-items:center;gap:6px">
        <span class="rec-dot" style="width:8px;height:8px;border-radius:50%;background:#ef4444;box-shadow:0 0 8px #ef4444"></span>
        <span id="recText" style="font-size:11px;font-weight:800;color:#ef4444;letter-spacing:0.5px">READY</span>
      </div>
    </div>`;

if (html.includes(oldStageOverlay)) {
  html = html.replace(oldStageOverlay, () => '');
  html = html.replace('<div class="video-stage">', () => newToolbarAbove + '\n  <div class="video-stage">');
  console.log('✅ Relocated top toolbar above phone canvas');
}

// 2. Identify the animation block from drawStickFigure to renderKineticSubtitles
const sMarker = 'function drawStickFigure(ctx, x, y, opts) {';
const eMarker = 'function renderKineticSubtitles(t) {';

const idxStart = html.indexOf(sMarker);
const idxEnd = html.indexOf(eMarker);

if (idxStart === -1 || idxEnd === -1) {
  console.error('❌ Could not locate animation markers:', { idxStart, idxEnd });
  process.exit(1);
}

console.log('Target animation block starts at byte:', idxStart, 'ends at:', idxEnd);

const masterEngineCode = `function drawStickFigure(ctx, x, y, opts) {
  opts = opts || {};
  ctx.save();
  const scale = opts.scale || 1.0;
  const color = opts.color || '#ffffff';
  const facing = opts.facing || 1;
  const anim = opts.anim || 0;
  const pose = opts.pose || 'stand';
  const isContractor = opts.role === 'contractor' || pose === 'ladder_climb' || pose === 'panicked_phone';

  ctx.translate(x, y);
  ctx.scale(facing * scale, scale);

  if (opts.glow) {
    ctx.shadowColor = opts.glow;
    ctx.shadowBlur = 18;
  }

  const headRadius = 24;
  const headCenterY = -118;
  const neckY = -92;
  const shoulderY = -78;
  const hipY = 0;

  // 1. VOLUMETRIC TORSO & APPAREL
  if (isContractor) {
    // High-Vis Safety Vest over Dark Work Shirt
    // Dark base shirt
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-16, shoulderY - 4, 32, hipY - shoulderY + 4, 6);
    ctx.fill();

    // Fluorescent Lime-Yellow Safety Vest
    const vestGrad = ctx.createLinearGradient(-15, shoulderY, 15, hipY);
    vestGrad.addColorStop(0, '#bef264');
    vestGrad.addColorStop(0.5, '#a3e635');
    vestGrad.addColorStop(1, '#65a30d');
    ctx.fillStyle = vestGrad;
    ctx.beginPath();
    ctx.roundRect(-14, shoulderY - 2, 28, hipY - shoulderY + 2, 5);
    ctx.fill();

    // Safety Orange Shoulder Yoke
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.roundRect(-14, shoulderY - 2, 28, 14, [5, 5, 0, 0]);
    ctx.fill();

    // Dual Silver Retroreflective Stripes
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 6;
    ctx.fillRect(-14, shoulderY + 20, 28, 4);
    ctx.fillRect(-14, shoulderY + 36, 28, 4);
    ctx.shadowBlur = 0;

    // Rugged Leather Toolbelt with Brass Buckle
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-16, hipY - 7, 32, 9);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-5, hipY - 6, 10, 7);
  } else if (pose === 'run_cash') {
    // Athletic Competitor Technician Body (Sleek Red/Charcoal Uniform)
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.roundRect(-14, shoulderY - 4, 28, hipY - shoulderY + 4, 6);
    ctx.fill();
    // Silver Tech Accent Stripe
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-14, shoulderY + 18, 28, 3.5);
  } else if (pose === 'ava_dispatch') {
    // Ava AI Cyber Suit (Cyan / Indigo Holographic)
    const suitGrad = ctx.createLinearGradient(-14, shoulderY, 14, hipY);
    suitGrad.addColorStop(0, '#0284c7');
    suitGrad.addColorStop(0.6, '#0f172a');
    suitGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = suitGrad;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-14, shoulderY - 4, 28, hipY - shoulderY + 4, 6);
    ctx.fill(); ctx.stroke();

    // Cyber Chest Core Reactor
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, shoulderY + 18, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else {
    // Stylized Clean Body
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, shoulderY);
    ctx.lineTo(0, hipY);
    ctx.stroke();
  }

  // 2. HEAD WITH 3D GRADIENT & EXPRESSIVE EYES
  const headGrad = ctx.createRadialGradient(-5, headCenterY - 6, 3, 0, headCenterY, headRadius);
  headGrad.addColorStop(0, '#ffffff');
  headGrad.addColorStop(0.6, '#f1f5f9');
  headGrad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = headGrad;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, headCenterY, headRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Expressive Blinking Eyes
  const isBlinking = (Math.sin(anim * 2.8) > 0.94);
  const eyeX1 = 4;
  const eyeX2 = 14;
  const eyeY = headCenterY - 2;

  ctx.save();
  if (isBlinking) {
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(eyeX1 - 3, eyeY); ctx.lineTo(eyeX1 + 3, eyeY);
    ctx.moveTo(eyeX2 - 3, eyeY); ctx.lineTo(eyeX2 + 3, eyeY);
    ctx.stroke();
  } else {
    // Sclera & Pupils
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(eyeX1, eyeY, 3.8, 0, Math.PI * 2);
    ctx.arc(eyeX2, eyeY, 3.8, 0, Math.PI * 2);
    ctx.fill();
    // Catchlight Specular Dots
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(eyeX1 + 1.2, eyeY - 1.2, 1.4, 0, Math.PI * 2);
    ctx.arc(eyeX2 + 1.2, eyeY - 1.2, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Facial Expressions (Eyebrows & Mouth)
  if (opts.expression === 'worried') {
    // Angled Worried Eyebrows
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(eyeX1 - 4, eyeY - 8); ctx.lineTo(eyeX1 + 4, eyeY - 5);
    ctx.moveTo(eyeX2 - 4, eyeY - 5); ctx.lineTo(eyeX2 + 4, eyeY - 8);
    ctx.stroke();
    // Trembling O-Mouth
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(9, headCenterY + 11, 4.5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Panic Sweat Drops
    for (let s = 0; s < 3; s++) {
      const swX = 22 + s * 8 + Math.sin(anim * 8 + s) * 5;
      const swY = headCenterY - 12 + s * 7;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(swX, swY, 2.8 - s * 0.4, 0, Math.PI * 2); ctx.fill();
    }
  } else if (opts.expression === 'happy') {
    // Confident Curved Eyebrows
    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(eyeX1, eyeY - 7, 4.5, Math.PI * 1.15, Math.PI * 1.85);
    ctx.arc(eyeX2, eyeY - 7, 4.5, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    // Smiling Teeth Mouth
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#059669'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(9, headCenterY + 7, 7, 0, Math.PI, false);
    ctx.fill(); ctx.stroke();
  }
  ctx.restore();

  // 3. HEAD PROPS (3D Construction Hard Hat & Cyber Headset)
  if (opts.headProp === 'hard_hat') {
    ctx.save();
    // Domed OSHA Hard Hat
    const hatGrad = ctx.createLinearGradient(-headRadius, headCenterY - 30, headRadius, headCenterY - 4);
    hatGrad.addColorStop(0, '#fef08a');
    hatGrad.addColorStop(0.4, '#f59e0b');
    hatGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = hatGrad;
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, headCenterY - 5, headRadius + 4, Math.PI * 1.05, Math.PI * 1.95, false);
    ctx.fill(); ctx.stroke();
    // Front Visor Safety Brim
    ctx.beginPath();
    ctx.ellipse(3, headCenterY - 5, headRadius + 12, 4.5, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    // White Reflective Safety Stripe
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, headCenterY - 12, headRadius + 1.5, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.restore();
  } else if (opts.headProp === 'headset') {
    ctx.save();
    // Cyber Headset Arc
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, headCenterY - 2, headRadius + 4, Math.PI * 0.9, Math.PI * 1.9);
    ctx.stroke();
    // Ear Cup
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(-headRadius - 3, headCenterY + 2, 6, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    // Mic Boom & Glowing Cyan LED Tip
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-headRadius - 3, headCenterY + 4);
    ctx.quadraticCurveTo(0, headCenterY + 18, 15, headCenterY + 14);
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(16, headCenterY + 14, 3.8, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // 4. LIMB KINEMATICS & PROPS
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (pose === 'ladder_climb') {
    // Pre-bent Legs on Ladder Rungs
    const legW = Math.sin(anim * 4) * 6;
    ctx.beginPath();
    ctx.moveTo(-6, hipY); ctx.lineTo(-20, hipY + 38 + legW); ctx.lineTo(-18, hipY + 84);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6, hipY); ctx.lineTo(20, hipY + 38 - legW); ctx.lineTo(22, hipY + 84);
    ctx.stroke();

    // Work Boots
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-26, hipY + 80, 16, 7);
    ctx.fillRect(16, hipY + 80, 16, 7);

    // Left Arm Holding Ladder Rail
    ctx.beginPath();
    ctx.moveTo(-10, shoulderY); ctx.lineTo(-32, shoulderY - 16); ctx.lineTo(-44, shoulderY - 36);
    ctx.stroke();

    // Right Arm Gripping Pipe Wrench
    const shake = Math.sin(anim * 10) * 6;
    ctx.beginPath();
    ctx.moveTo(10, shoulderY); ctx.lineTo(32, shoulderY + 8 + shake); ctx.lineTo(50, shoulderY + 22 + shake);
    ctx.stroke();

    // Realistic Heavy-Duty Pipe Wrench
    ctx.save();
    ctx.translate(50, shoulderY + 22 + shake);
    ctx.rotate(Math.PI * 0.28);
    ctx.fillStyle = '#ef4444'; // Red handle
    ctx.fillRect(-5, -24, 10, 36);
    ctx.fillStyle = '#94a3b8'; // Steel jaw
    ctx.fillRect(-7, -36, 14, 14);
    ctx.fillRect(-10, -36, 7, 7);
    ctx.restore();

    // Vibrating Cell Phone in Toolbelt
    ctx.save();
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 14;
    ctx.fillRect(10, hipY - 14, 12, 18);
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.5;
    const rPulse = (anim * 8) % 1;
    ctx.beginPath(); ctx.arc(16, hipY - 5, 14 + rPulse * 12, -Math.PI * 0.4, Math.PI * 0.4); ctx.stroke();
    ctx.restore();

  } else if (pose === 'panicked_phone') {
    // Pacing Legs
    const pace = Math.sin(anim * 6) * 8;
    ctx.beginPath();
    ctx.moveTo(-6, hipY); ctx.lineTo(-14 + pace, hipY + 40); ctx.lineTo(-12 + pace, hipY + 84);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6, hipY); ctx.lineTo(14 - pace, hipY + 40); ctx.lineTo(18 - pace, hipY + 84);
    ctx.stroke();

    // Clutching Head in Panic (Left Arm)
    ctx.beginPath();
    ctx.moveTo(-10, shoulderY); ctx.lineTo(-34, shoulderY - 26); ctx.lineTo(-headRadius - 4, headCenterY - 6);
    ctx.stroke();

    // Holding Phone to Ear (Right Arm)
    ctx.beginPath();
    ctx.moveTo(10, shoulderY); ctx.lineTo(26, shoulderY - 12); ctx.lineTo(headRadius + 6, headCenterY + 4);
    ctx.stroke();

    // Glowing Smartphone with Radio Pulse
    ctx.save();
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 14;
    ctx.fillRect(headRadius + 4, headCenterY - 7, 9, 16);
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
    const rW = (anim * 6) % 1;
    ctx.beginPath(); ctx.arc(headRadius + 12, headCenterY + 1, 9 + rW * 12, -Math.PI * 0.3, Math.PI * 0.3); ctx.stroke();
    ctx.restore();

  } else if (pose === 'run_cash') {
    const cycle = Math.sin(anim * 9);
    // Dynamic High-Knee Sprinting Legs
    ctx.beginPath();
    ctx.moveTo(-6, hipY); ctx.lineTo(-28 * cycle, hipY + 34); ctx.lineTo(-40 * cycle, hipY + 76);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6, hipY); ctx.lineTo(28 * cycle, hipY + 34); ctx.lineTo(40 * cycle, hipY + 76);
    ctx.stroke();

    // Running Arms Holding Bulging Burlap Sack
    ctx.beginPath();
    ctx.moveTo(10, shoulderY); ctx.lineTo(30, shoulderY - 14); ctx.lineTo(44, shoulderY - 36);
    ctx.stroke();

    // Bulging Sack of Cash with Emerald Glow
    ctx.save();
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#10b981'; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.arc(52, shoulderY - 40, 24, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#064e3b'; ctx.font = '900 22px Space Grotesk'; ctx.textAlign = 'center';
    ctx.fillText('$', 52, shoulderY - 32);

    // Floating Fluttering Dollar Bills
    for (let b = 0; b < 4; b++) {
      const bx = -16 - b * 24 + Math.sin(anim * 6 + b) * 10;
      const by = shoulderY - 8 + b * 16 + Math.cos(anim * 5 + b) * 6;
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(Math.sin(anim * 4 + b) * 0.5);
      ctx.fillStyle = '#34d399'; ctx.strokeStyle = '#065f46'; ctx.lineWidth = 1.2;
      ctx.fillRect(-10, -5, 20, 10); ctx.strokeRect(-10, -5, 20, 10);
      ctx.fillStyle = '#064e3b'; ctx.font = '700 7px monospace';
      ctx.fillText('$', 0, 3);
      ctx.restore();
    }
    ctx.restore();

  } else if (pose === 'ava_dispatch') {
    // Confident Heroic Stance
    ctx.beginPath();
    ctx.moveTo(-6, hipY); ctx.lineTo(-14, hipY + 44); ctx.lineTo(-16, hipY + 86);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6, hipY); ctx.lineTo(14, hipY + 44); ctx.lineTo(16, hipY + 86);
    ctx.stroke();

    // Left Hand Touching Headset
    ctx.beginPath();
    ctx.moveTo(-10, shoulderY); ctx.lineTo(-24, shoulderY - 18); ctx.lineTo(-headRadius - 2, headCenterY + 4);
    ctx.stroke();

    // Right Hand Projecting Holographic Glass Tablet
    ctx.beginPath();
    ctx.moveTo(10, shoulderY); ctx.lineTo(34, shoulderY + 10); ctx.lineTo(48, shoulderY);
    ctx.stroke();

    // Glowing Holographic Dispatch HUD Card
    ctx.save();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
    ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 20;
    roundRect(ctx, 46, shoulderY - 24, 68, 44, 8, true, true);
    ctx.fillStyle = '#34d399'; ctx.font = '900 11px Inter';
    ctx.fillText('⚡ DISPATCH', 52, shoulderY - 8);
    ctx.fillStyle = '#ffffff'; ctx.font = '800 9px JetBrains Mono';
    ctx.fillText('0.8s QUALIFIED', 52, shoulderY + 8);
    ctx.restore();
  } else {
    // Neutral Stance
    ctx.beginPath();
    ctx.moveTo(-6, hipY); ctx.lineTo(-12, hipY + 42); ctx.lineTo(-14, hipY + 86);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6, hipY); ctx.lineTo(12, hipY + 42); ctx.lineTo(14, hipY + 86);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-10, shoulderY); ctx.lineTo(-22, shoulderY + 24); ctx.lineTo(-24, shoulderY + 54);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(10, shoulderY); ctx.lineTo(22, shoulderY + 24); ctx.lineTo(24, shoulderY + 54);
    ctx.stroke();
  }

  ctx.restore();
}

function renderDynamicStoryHookPhase(t) {
  const storyType = (window.ACTIVE_STORY && window.ACTIVE_STORY.storyType) ? window.ACTIVE_STORY.storyType : 'cosmic_light';

  if (t < 4.5) {
    switch (storyType) {
      case 'falcon_dive': renderStory2_FalconHighAltitude(t); break;
      case 'f1_pitstop': renderStory3_F1StartingGridLights(t); break;
      case 'brain_ai': renderStory4_BrainSynapses(t); break;
      case 'saturn_rocket': renderStory5_ApolloCountdown(t); break;
      case 'lightning_strike': renderStory6_LightningStorm(t); break;
      case 'niagara_torrent': renderStory7_NiagaraWaterfall(t); break;
      default: renderStory1_LaserSpeed(t); break;
    }
  } else if (t < 8.2) {
    switch (storyType) {
      case 'falcon_dive': renderStory2_FalconDiveHUD(t); break;
      case 'f1_pitstop': renderStory3_F1Stopwatch180(t); break;
      case 'brain_ai': renderStory4_ChatGptTerminal(t); break;
      case 'saturn_rocket': renderStory5_RocketExhaust(t); break;
      case 'lightning_strike': renderStory6_OneBillionVolts(t); break;
      case 'niagara_torrent': renderStory7_GallonsMeter750k(t); break;
      default: renderStory1_MoonImpact(t); break;
    }
  } else if (t < 13.5) {
    switch (storyType) {
      case 'falcon_dive': renderStory2_FalconReflex15ms(t); break;
      case 'f1_pitstop': renderStory3_F1SpinningTire(t); break;
      case 'brain_ai': renderStory4_AiCitationRank1(t); break;
      case 'saturn_rocket': renderStory5_Apollo4kbRAM(t); break;
      case 'lightning_strike': renderStory6_Thermal50kDegrees(t); break;
      case 'niagara_torrent': renderStory7_BurstPipePressure(t); break;
      default: renderStory1_SaturnDeepSpace(t); break;
    }
  } else {
    renderUniversalGlitchContrast(t);
  }
}

// =============================================================
// STORY 1: COSMIC SPEED OF LIGHT & SATURN (Ultra High-Fidelity)
// =============================================================
function renderStory1_LaserSpeed(t) {
  renderTopPill('⚡ SPEED OF LIGHT: 186,000 MILES/SEC');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Relativistic Lightspeed Radial Lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2 + t * 0.4;
    const r1 = 90 + ((t * 80 + i * 20) % 180);
    const r2 = r1 + 35;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
    ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
    ctx.stroke();
  }

  // Blinding Concentric Core Pulses
  const pulse = (t * 6) % 1;
  ctx.strokeStyle = 'rgba(245, 158, 11, ' + (1 - pulse) + ')';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 70 + pulse * 130, 0, Math.PI * 2);
  ctx.stroke();

  // High-Energy Tachometer Arc
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 14;
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.arc(cx, cy, 130, Math.PI * 0.75, Math.PI * 0.75 + (t / 4.5) * Math.PI * 1.5);
  ctx.stroke();

  // Digital Velocity Metric
  ctx.fillStyle = '#ffffff'; ctx.font = '900 52px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 25;
  ctx.fillText('186,000', cx, cy - 10);
  ctx.fillStyle = '#fbbf24'; ctx.font = '800 20px JetBrains Mono';
  ctx.fillText('MILES PER SECOND', cx, cy + 30);
  ctx.restore();
}

function renderStory1_MoonImpact(t) {
  renderTopPill('🌕 1.3 SECONDS: MOON ORBIT BREACH');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Shaded Realistic Moon with Detailed Craters
  const moonGrad = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, 105);
  moonGrad.addColorStop(0, '#f8fafc');
  moonGrad.addColorStop(0.5, '#cbd5e1');
  moonGrad.addColorStop(0.85, '#475569');
  moonGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = moonGrad;
  ctx.shadowColor = '#94a3b8'; ctx.shadowBlur = 25;
  ctx.beginPath(); ctx.arc(cx, cy, 105, 0, Math.PI * 2); ctx.fill();

  // Dark Crater Formations
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  const craters = [[-40, -25, 20], [25, -45, 16], [-20, 35, 26], [40, 20, 18], [10, -10, 14], [-55, 10, 12]];
  for (const c of craters) {
    ctx.beginPath(); ctx.arc(cx + c[0], cy + c[1], c[2], 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'; ctx.lineWidth = 1.5; ctx.stroke();
  }

  // Laser Strike Beam & Particle Splash
  const beamProgress = Math.min(1, (t - 4.5) / 1.5);
  const startX = -60; const startY = cy - 220;
  const curX = startX + (cx - startX) * beamProgress;
  const curY = startY + (cy - startY) * beamProgress;

  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 8;
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 30;
  ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(curX, curY); ctx.stroke();

  if (beamProgress >= 0.85) {
    ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 45;
    ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = '#ffffff'; ctx.font = '900 36px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 20;
  ctx.fillText('1.3 SECONDS', cx, cy + 150);
  ctx.fillStyle = '#38bdf8'; ctx.font = '800 18px JetBrains Mono';
  ctx.fillText('EARTH TO MOON BREACH', cx, cy + 185);
  ctx.restore();
}

function renderStory1_SaturnDeepSpace(t) {
  renderTopPill('🪐 2 BILLION MILES TO SATURN IN 3 HOURS');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Photorealistic Shaded Saturn Globe
  const satGrad = ctx.createRadialGradient(cx - 35, cy - 35, 15, cx, cy, 95);
  satGrad.addColorStop(0, '#fef08a');
  satGrad.addColorStop(0.35, '#f59e0b');
  satGrad.addColorStop(0.7, '#d97706');
  satGrad.addColorStop(1, '#78350f');
  ctx.fillStyle = satGrad;
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 30;
  ctx.beginPath(); ctx.arc(cx, cy, 95, 0, Math.PI * 2); ctx.fill();

  // Atmospheric Cloud Striations
  ctx.strokeStyle = 'rgba(120, 53, 15, 0.4)'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(cx, cy, 80, 0.2, Math.PI - 0.2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, 60, 0.3, Math.PI - 0.3); ctx.stroke();

  // 3D Tilted Planetary Rings with Cassini Gap
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-Math.PI * 0.16);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)'; ctx.lineWidth = 18;
  ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 25;
  ctx.beginPath(); ctx.ellipse(0, 0, 230, 48, 0, 0, Math.PI * 2); ctx.stroke();
  // Outer delicate ring
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.ellipse(0, 0, 255, 54, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  // Laser Slicing Across Solar System
  const lX = ((t - 8.2) * 220) % (W + 200) - 100;
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 6;
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 25;
  ctx.beginPath(); ctx.moveTo(lX - 120, cy - 140); ctx.lineTo(lX, cy - 140); ctx.stroke();

  ctx.fillStyle = '#ffffff'; ctx.font = '900 36px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 20;
  ctx.fillText('3 HOURS TO SATURN', cx, cy + 155);
  ctx.fillStyle = '#fbbf24'; ctx.font = '800 18px JetBrains Mono';
  ctx.fillText('YET CONTRACTORS TAKE 4+ HOURS', cx, cy + 190);
  ctx.restore();
}

// =============================================================
// STORY 2: PEREGRINE FALCON 242 MPH DIVE (Studio Vector Graphics)
// =============================================================
function renderStory2_FalconHighAltitude(t) {
  renderTopPill('🦅 NATURE\\'S FASTEST WEAPON: PEREGRINE FALCON');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // High-Altitude Circling Soar
  const wingFlap = Math.sin(t * 7) * 12;
  ctx.save();
  ctx.translate(cx, cy + Math.sin(t * 3) * 15);

  // Aerodynamic Delta Wings
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.moveTo(0, -35);
  ctx.quadraticCurveTo(75, -25 + wingFlap, 140, 10 + wingFlap);
  ctx.quadraticCurveTo(80, 20, 25, 15);
  ctx.lineTo(0, 45); // Tail
  ctx.lineTo(-25, 15);
  ctx.quadraticCurveTo(-80, 20, -140, 10 + wingFlap);
  ctx.quadraticCurveTo(-75, -25 + wingFlap, 0, -35);
  ctx.fill();

  // Falcon Head & Curved Beak
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(0, -35, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fbbf24'; // Beak
  ctx.beginPath(); ctx.moveTo(-5, -42); ctx.lineTo(5, -42); ctx.lineTo(0, -54); ctx.fill();
  ctx.restore();

  // Telemetry Altitude Tape
  ctx.fillStyle = '#ffffff'; ctx.font = '900 48px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 25;
  ctx.fillText('3,500 FEET', cx, cy + 140);
  ctx.fillStyle = '#38bdf8'; ctx.font = '800 20px JetBrains Mono';
  ctx.fillText('HIGH ALTITUDE TARGET ACQUIRED', cx, cy + 175);
  ctx.restore();
}

function renderStory2_FalconDiveHUD(t) {
  renderTopPill('⚡ DIVE SPEED: 242 MILES PER HOUR');
  const cx = W / 2; const cy = H * 0.36;
  ctx.save();

  // Supersonic Shock Vapor Cone
  const conePulse = (t * 8) % 1;
  ctx.strokeStyle = 'rgba(56, 189, 248, ' + (0.9 - conePulse) + ')';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 30, 70 + conePulse * 90, 22 + conePulse * 30, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Aerodynamic Stoop Dive Silhouette
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.moveTo(0, 80); // Pointed beak downwards
  ctx.quadraticCurveTo(24, 20, 50, -40); // Right swept wing
  ctx.lineTo(25, -60);
  ctx.lineTo(0, -45); // Tail
  ctx.lineTo(-25, -60);
  ctx.lineTo(-50, -40); // Left swept wing
  ctx.quadraticCurveTo(-24, 20, 0, 80);
  ctx.fill();

  // Piercing Golden Predator Eye
  ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 15;
  ctx.beginPath(); ctx.arc(6, 45, 4.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Tactical Jet HUD Overlay
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'; ctx.lineWidth = 2;
  ctx.strokeRect(cx - 160, cy - 100, 320, 200);
  ctx.beginPath();
  ctx.moveTo(cx - 180, cy); ctx.lineTo(cx - 140, cy);
  ctx.moveTo(cx + 140, cy); ctx.lineTo(cx + 180, cy);
  ctx.moveTo(cx, cy - 120); ctx.lineTo(cx, cy - 80);
  ctx.stroke();

  // 242 MPH Readout
  ctx.fillStyle = '#ffffff'; ctx.font = '900 56px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 30;
  ctx.fillText('242 MPH', cx, cy + 145);
  ctx.fillStyle = '#fbbf24'; ctx.font = '800 20px JetBrains Mono';
  ctx.fillText('TERMINAL VELOCITY STOOP DIVE', cx, cy + 182);
  ctx.restore();
}

function renderStory2_FalconReflex15ms(t) {
  renderTopPill('⏱️ 15 MILLISECONDS NERVOUS REFLEX ARC');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Digital Stopwatch Arc
  const prog = Math.min(1, (t - 8.2) / 5.0);
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 14;
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.arc(cx, cy, 125, -Math.PI * 0.5, -Math.PI * 0.5 + prog * Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#ffffff'; ctx.font = '900 64px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 25;
  ctx.fillText('15 MS', cx, cy + 5);

  ctx.fillStyle = '#fbbf24'; ctx.font = '800 20px Space Grotesk';
  ctx.fillText('NEURAL REFLEX SPEED', cx, cy + 45);

  ctx.fillStyle = '#94a3b8'; ctx.font = '700 16px Inter';
  ctx.fillText('AVA ANSWERS CALLS IN 0.8 SECONDS', cx, cy + 145);
  ctx.restore();
}

// =============================================================
// STORY 3: FORMULA 1 WORLD RECORD 1.80s PIT STOP
// =============================================================
function renderStory3_F1StartingGridLights(t) {
  renderTopPill('🏎️ FORMULA 1 WORLD RECORD PIT STOP');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // 5 Overhead Gantry Starting Lights
  const litCount = Math.min(5, Math.floor(((t * 2) % 6) + 1));
  for (let i = 0; i < 5; i++) {
    const lx = cx - 140 + i * 70;
    const ly = cy - 130;
    ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(lx, ly, 24, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    if (i < litCount) {
      ctx.fillStyle = '#ef4444'; ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 25;
      ctx.beginPath(); ctx.arc(lx, ly, 18, 0, Math.PI * 2); ctx.fill();
    }
  }

  // High-Detail Top-Down F1 Car Silhouette
  ctx.save();
  ctx.translate(cx, cy + 25);
  // Aerodynamic Carbon Chassis
  ctx.fillStyle = '#ef4444'; ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.moveTo(0, -95); // Front nose tip
  ctx.lineTo(14, -40); ctx.lineTo(26, 15); ctx.lineTo(28, 65); // Right sidepod
  ctx.lineTo(0, 85); // Rear wing
  ctx.lineTo(-28, 65); ctx.lineTo(-26, 15); ctx.lineTo(-14, -40); // Left sidepod
  ctx.closePath(); ctx.fill();

  // Multi-Element Front Wing
  ctx.fillStyle = '#0f172a'; ctx.fillRect(-52, -92, 104, 12);
  // Rear Wing
  ctx.fillRect(-48, 75, 96, 14);

  // 4 Wide Pirelli Racing Slick Tires
  ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.5;
  const tires = [[-50, -55], [32, -55], [-52, 42], [34, 42]];
  for (const pos of tires) {
    ctx.fillRect(pos[0], pos[1], 18, 32);
    ctx.strokeRect(pos[0], pos[1], 18, 32);
  }
  ctx.restore();

  ctx.fillStyle = '#ffffff'; ctx.font = '900 32px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 20;
  ctx.fillText('20 CREW MEMBERS · 4 TIRES', cx, cy + 155);
  ctx.restore();
}

function renderStory3_F1Stopwatch180(t) {
  renderTopPill('⏱️ 1.80 SECONDS COMPLETE TIRE SWAP');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Animated Titanium Sparks from Wheel Guns
  for (let s = 0; s < 30; s++) {
    const spAngle = (s * 41 + t * 20) % (Math.PI * 2);
    const spDist = 45 + ((t * 220 + s * 15) % 140);
    ctx.fillStyle = (s % 2 === 0) ? '#ffffff' : '#fbbf24';
    ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(spAngle) * spDist, cy - 20 + Math.sin(spAngle) * spDist, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Glowing Chronometer Dial
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 14;
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 30;
  ctx.beginPath(); ctx.arc(cx, cy - 20, 125, 0, Math.PI * 2); ctx.stroke();

  ctx.fillStyle = '#ffffff'; ctx.font = '900 72px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 30;
  ctx.fillText('1.80s', cx, cy - 10);

  ctx.fillStyle = '#fbbf24'; ctx.font = '900 22px Space Grotesk';
  ctx.fillText('WORLD RECORD PIT STOP', cx, cy + 35);

  ctx.fillStyle = '#38bdf8'; ctx.font = '800 18px JetBrains Mono';
  ctx.fillText('EVERY FRACTION OF A SECOND COUNTS', cx, cy + 145);
  ctx.restore();
}

function renderStory3_F1SpinningTire(t) {
  renderTopPill('🛞 0.4s FAST MOBILE WEBSITE FUNNEL');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Spinning Carbon Fiber Rim & Brake Disc Glow
  ctx.save();
  ctx.translate(cx, cy - 10);
  ctx.rotate(t * 12);
  // Glowing Red Brake Rotor Disc
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 18;
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 35;
  ctx.beginPath(); ctx.arc(0, 0, 70, 0, Math.PI * 2); ctx.stroke();

  // Black Carbon Rim & Spokes
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6; ctx.shadowBlur = 0;
  for (let s = 0; s < 5; s++) {
    const spAngle = (s / 5) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(spAngle) * 95, Math.sin(spAngle) * 95); ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = '#ffffff'; ctx.font = '900 38px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 25;
  ctx.fillText('0.4s PAGE LOAD', cx, cy + 145);
  ctx.fillStyle = '#fbbf24'; ctx.font = '800 18px JetBrains Mono';
  ctx.fillText('CONVERTS 3X MORE LOCAL LEADS', cx, cy + 180);
  ctx.restore();
}

// =============================================================
// STORY 4: BRAIN NEURAL SYNAPSES & AI SEARCH (13ms Neural Firing)
// =============================================================
function renderStory4_BrainSynapses(t) {
  renderTopPill('🧠 86 BILLION NEURONS: 13MS SYNAPTIC FIRING');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Glowing 3D Cerebral Hemispheres
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4;
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 30;
  ctx.beginPath();
  // Left Hemisphere
  ctx.arc(cx - 45, cy - 20, 75, Math.PI * 0.5, Math.PI * 1.5);
  // Right Hemisphere
  ctx.arc(cx + 45, cy - 20, 75, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.stroke();

  // Internal Synaptic Circuit Convolutions
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)'; ctx.lineWidth = 2.5;
  for (let c = 0; c < 8; c++) {
    const angle = (c / 8) * Math.PI * 2 + t * 0.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 20);
    ctx.quadraticCurveTo(cx + Math.cos(angle) * 60, cy - 20 + Math.sin(angle) * 50, cx + Math.cos(angle) * 110, cy - 20 + Math.sin(angle) * 70);
    ctx.stroke();
  }

  // Firing Synaptic Sparks
  for (let s = 0; s < 18; s++) {
    const sx = cx - 110 + ((s * 47 + t * 180) % 220);
    const sy = cy - 70 + ((s * 31) % 110);
    ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 15;
    ctx.beginPath(); ctx.arc(sx, sy, 3.5, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = '#ffffff'; ctx.font = '900 36px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 25;
  ctx.fillText('13 MILLISECONDS', cx, cy + 145);
  ctx.fillStyle = '#38bdf8'; ctx.font = '800 18px JetBrains Mono';
  ctx.fillText('HUMAN VISUAL RECOGNITION SPEED', cx, cy + 180);
  ctx.restore();
}

function renderStory4_ChatGptTerminal(t) {
  renderTopPill('🤖 CHATGPT & AI SEARCH REVOLUTION');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Futuristic AI Terminal Card
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5;
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 30;
  roundRect(ctx, cx - 180, cy - 110, 360, 220, 16, true, true);

  // Terminal Header Bar
  ctx.fillStyle = '#1e293b';
  roundRect(ctx, cx - 180, cy - 110, 360, 34, [16, 16, 0, 0], true, false);
  ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(cx - 155, cy - 93, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(cx - 138, cy - 93, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(cx - 121, cy - 93, 5, 0, Math.PI * 2); ctx.fill();

  // Prompt Query Text
  ctx.fillStyle = '#38bdf8'; ctx.font = '700 13px JetBrains Mono'; ctx.textAlign = 'left';
  ctx.fillText('> Perplexity AI Search Engine', cx - 160, cy - 50);
  ctx.fillStyle = '#ffffff'; ctx.font = '800 16px Space Grotesk';
  ctx.fillText('"Top Emergency AC Contractor in Orlando"', cx - 160, cy - 18);

  // AI Citation Response Box
  ctx.fillStyle = 'rgba(16, 185, 129, 0.15)'; ctx.strokeStyle = '#10b981'; ctx.lineWidth = 1.5;
  roundRect(ctx, cx - 160, cy + 10, 320, 75, 10, true, true);
  ctx.fillStyle = '#34d399'; ctx.font = '800 12px JetBrains Mono';
  ctx.fillText('AI CITATION #1 (100% CONFIDENCE):', cx - 145, cy + 34);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 14px Space Grotesk';
  ctx.fillText('VantorX Automated Client Network', cx - 145, cy + 62);
  ctx.restore();
}

function renderStory4_AiCitationRank1(t) {
  renderTopPill('🏆 RANK #1 IN AI OVERVIEWS & PERPLEXITY');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Glowing Golden Trophy
  ctx.save();
  ctx.translate(cx, cy - 20);
  ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 35;
  // Cup
  ctx.beginPath();
  ctx.moveTo(-50, -50); ctx.lineTo(50, -50);
  ctx.quadraticCurveTo(45, 15, 0, 35);
  ctx.quadraticCurveTo(-45, 15, -50, -50);
  ctx.fill();
  // Handles
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(-55, -25, 20, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
  ctx.beginPath(); ctx.arc(55, -25, 20, -Math.PI * 0.5, Math.PI * 0.5); ctx.stroke();
  // Pedestal
  ctx.fillRect(-28, 35, 56, 16);
  ctx.fillRect(-45, 51, 90, 16);
  ctx.restore();

  ctx.fillStyle = '#ffffff'; ctx.font = '900 42px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 25;
  ctx.fillText('RANK #1', cx, cy + 145);
  ctx.fillStyle = '#fbbf24'; ctx.font = '800 18px JetBrains Mono';
  ctx.fillText('DOMINATE EVERY AI OVERVIEW', cx, cy + 180);
  ctx.restore();
}

// =============================================================
// STORY 5: SATURN V APOLLO 11 MOON ROCKET
// =============================================================
function renderStory5_ApolloCountdown(t) {
  renderTopPill('🚀 APOLLO 11 SATURN V: CAPE CANAVERAL');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Launch Umbilical Gantry Tower
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
  ctx.strokeRect(cx - 105, cy - 130, 35, 220);
  for (let r = 0; r < 6; r++) {
    ctx.beginPath();
    ctx.moveTo(cx - 105, cy - 130 + r * 36);
    ctx.lineTo(cx - 70, cy - 94 + r * 36);
    ctx.stroke();
  }

  // Saturn V Rocket Silhouette
  ctx.save();
  ctx.translate(cx + 10, cy - 10);
  // White Rocket Body with Black Chevrons
  ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 20;
  roundRect(ctx, -20, -110, 40, 180, [12, 12, 0, 0], true, false);
  ctx.fillStyle = '#0f172a'; // Black Roll Patterns
  ctx.fillRect(-20, -70, 40, 24);
  ctx.fillRect(-20, 0, 40, 24);
  // Nosecone Escape Tower
  ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(0, -145); ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#ffffff'; ctx.font = '900 52px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 25;
  ctx.fillText('T - 00:03', cx, cy + 155);
  ctx.restore();
}

function renderStory5_RocketExhaust(t) {
  renderTopPill('🔥 7.5 MILLION POUNDS OF ROCKET THRUST');
  const cx = W / 2; const cy = H * 0.36;
  ctx.save();

  // Massive Dual-Layer Roaring Rocket Flame Plume
  const flameWobble = Math.sin(t * 25) * 8;
  ctx.save();
  ctx.translate(cx, cy + 20);

  // Outer Turbulent Orange Fireball
  const fireGrad = ctx.createLinearGradient(0, 0, 0, 180);
  fireGrad.addColorStop(0, '#ffffff');
  fireGrad.addColorStop(0.2, '#fef08a');
  fireGrad.addColorStop(0.55, '#f97316');
  fireGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = fireGrad;
  ctx.shadowColor = '#f97316'; ctx.shadowBlur = 40;
  ctx.beginPath();
  ctx.moveTo(-28, 0);
  ctx.quadraticCurveTo(-65 + flameWobble, 90, 0, 180);
  ctx.quadraticCurveTo(65 - flameWobble, 90, 28, 0);
  ctx.closePath(); ctx.fill();

  // Rocket Stage Base
  ctx.fillStyle = '#ffffff'; ctx.fillRect(-25, -90, 50, 90);
  ctx.fillStyle = '#0f172a'; ctx.fillRect(-25, -50, 50, 20);
  ctx.restore();

  // Billowing Rolling White Steam Clouds
  for (let c = 0; c < 16; c++) {
    const cxP = cx - 180 + ((c * 43 + t * 90) % 360);
    const cyP = cy + 150 + Math.sin(t * 4 + c) * 15;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath(); ctx.arc(cxP, cyP, 26 + (c % 4) * 8, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = '#ffffff'; ctx.font = '900 36px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#f97316'; ctx.shadowBlur = 25;
  ctx.fillText('7.5 MILLION LBS', cx, cy + 220);
  ctx.restore();
}

function renderStory5_Apollo4kbRAM(t) {
  renderTopPill('💾 4 KILOBYTES OF RAM REACHED THE MOON');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Vintage NASA AGC Phosphor Monitor Screen
  ctx.fillStyle = '#022c22'; ctx.strokeStyle = '#10b981'; ctx.lineWidth = 3;
  ctx.shadowColor = '#10b981'; ctx.shadowBlur = 25;
  roundRect(ctx, cx - 160, cy - 90, 320, 180, 14, true, true);

  ctx.fillStyle = '#34d399'; ctx.font = '900 48px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.fillText('4 KB RAM', cx, cy - 10);
  ctx.font = '800 16px JetBrains Mono';
  ctx.fillText('APOLLO GUIDANCE COMPUTER', cx, cy + 30);
  ctx.fillText('TRAVELED 240,000 MILES', cx, cy + 55);

  ctx.fillStyle = '#ffffff'; ctx.font = '800 18px Space Grotesk';
  ctx.fillText('AND CONTRACTORS CANNOT ANSWER A CALL?', cx, cy + 145);
  ctx.restore();
}

// =============================================================
// STORY 6: ONE BILLION VOLTS LIGHTNING STORM
// =============================================================
function renderStory6_LightningStorm(t) {
  renderTopPill('⚡ ONE BILLION VOLTS: ATMOSPHERIC DISCHARGE');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Thunderhead Clouds
  ctx.fillStyle = '#0f172a';
  for (let c = 0; c < 8; c++) {
    ctx.beginPath(); ctx.arc(cx - 160 + c * 48, cy - 120 + Math.sin(c) * 15, 48, 0, Math.PI * 2); ctx.fill();
  }

  // Screen Flash
  if (Math.sin(t * 18) > 0.85) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(0, 0, W, H);
  }

  ctx.fillStyle = '#ffffff'; ctx.font = '900 36px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 25;
  ctx.fillText('THUNDERSTORM OVERHEAD', cx, cy + 140);
  ctx.restore();
}

function renderStory6_OneBillionVolts(t) {
  renderTopPill('⚡ 1,000,000,000 VOLTS ATMOSPHERIC BOLT');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // High-Energy Fractal Branching Lightning Bolt
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6;
  ctx.shadowColor = '#c084fc'; ctx.shadowBlur = 40;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 140);
  ctx.lineTo(cx - 30, cy - 70);
  ctx.lineTo(cx + 25, cy - 20);
  ctx.lineTo(cx - 15, cy + 40);
  ctx.lineTo(cx + 35, cy + 90);
  ctx.stroke();

  // Tributary Branches
  ctx.lineWidth = 2.5; ctx.strokeStyle = '#c084fc';
  ctx.beginPath();
  ctx.moveTo(cx - 30, cy - 70); ctx.lineTo(cx - 75, cy - 35);
  ctx.moveTo(cx + 25, cy - 20); ctx.lineTo(cx + 80, cy + 15);
  ctx.moveTo(cx - 15, cy + 40); ctx.lineTo(cx - 65, cy + 70);
  ctx.stroke();

  // Ground Impact Flash
  ctx.fillStyle = '#ffffff'; ctx.shadowBlur = 50;
  ctx.beginPath(); ctx.arc(cx + 35, cy + 90, 24, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#ffffff'; ctx.font = '900 52px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 30;
  ctx.fillText('1 BILLION', cx, cy + 150);
  ctx.fillStyle = '#c084fc'; ctx.font = '800 22px JetBrains Mono';
  ctx.fillText('VOLTS OF RAW POWER', cx, cy + 188);
  ctx.restore();
}

function renderStory6_Thermal50kDegrees(t) {
  renderTopPill('🔥 50,000°F THERMAL PLASMA CHANNEL');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Heat Thermometer Arc
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 14;
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 30;
  ctx.beginPath(); ctx.arc(cx, cy - 10, 120, 0, Math.PI * 2); ctx.stroke();

  ctx.fillStyle = '#ffffff'; ctx.font = '900 64px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 30;
  ctx.fillText('50,000°F', cx, cy + 5);

  ctx.fillStyle = '#fbbf24'; ctx.font = '800 18px JetBrains Mono';
  ctx.fillText('5X HOTTER THAN THE SUN', cx, cy + 45);

  ctx.fillStyle = '#94a3b8'; ctx.font = '700 16px Inter';
  ctx.fillText('ELECTRICAL EMERGENCIES CANNOT WAIT', cx, cy + 145);
  ctx.restore();
}

// =============================================================
// STORY 7: NIAGARA FALLS 750,000 GALLONS/SEC WATER TORRENT
// =============================================================
function renderStory7_NiagaraWaterfall(t) {
  renderTopPill('🌊 NIAGARA FALLS: 750,000 GALLONS PER SECOND');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Cascading Waterfall Volume
  const fallGrad = ctx.createLinearGradient(0, cy - 120, 0, cy + 100);
  fallGrad.addColorStop(0, '#0284c7');
  fallGrad.addColorStop(0.5, '#38bdf8');
  fallGrad.addColorStop(1, '#ffffff');
  ctx.fillStyle = fallGrad;
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 30;
  roundRect(ctx, cx - 140, cy - 110, 280, 200, 16, true, false);

  // Churning Foam & Mist Sprays
  for (let m = 0; m < 20; m++) {
    const mx = cx - 160 + ((m * 39 + t * 120) % 320);
    const my = cy + 90 + Math.sin(t * 6 + m) * 12;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath(); ctx.arc(mx, my, 14 + (m % 3) * 6, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = '#ffffff'; ctx.font = '900 48px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 25;
  ctx.fillText('750,000', cx, cy + 160);
  ctx.fillStyle = '#38bdf8'; ctx.font = '800 20px JetBrains Mono';
  ctx.fillText('GALLONS PER SECOND', cx, cy + 195);
  ctx.restore();
}

function renderStory7_GallonsMeter750k(t) {
  renderTopPill('🚨 BURST COMMERCIAL PIPE EMERGENCY');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Burst Pipe Spraying Pressurized Water
  ctx.strokeStyle = '#b45309'; ctx.lineWidth = 26; // Copper Pipe
  ctx.beginPath(); ctx.moveTo(cx - 160, cy); ctx.lineTo(cx + 160, cy); ctx.stroke();

  // High-Pressure Water Jet Spray
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 14;
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 35;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx - 40, cy - 90);
  ctx.stroke();

  // Water Droplets Spraying
  for (let d = 0; d < 25; d++) {
    const dx = cx + Math.sin(d + t * 10) * 110;
    const dy = cy - 20 - ((t * 220 + d * 15) % 120);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(dx, dy, 3.5, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = '#ef4444'; ctx.font = '900 36px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 25;
  ctx.fillText('WATER SPREADING FAST', cx, cy + 145);
  ctx.restore();
}

function renderStory7_BurstPipePressure(t) {
  renderTopPill('⚡ 90-SECOND SMS SPEED-TO-LEAD LOCK');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // SMS Speed Stopwatch
  ctx.strokeStyle = '#10b981'; ctx.lineWidth = 14;
  ctx.shadowColor = '#10b981'; ctx.shadowBlur = 30;
  ctx.beginPath(); ctx.arc(cx, cy - 10, 120, 0, Math.PI * 2); ctx.stroke();

  ctx.fillStyle = '#ffffff'; ctx.font = '900 64px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#10b981'; ctx.shadowBlur = 25;
  ctx.fillText('24 SEC', cx, cy + 5);

  ctx.fillStyle = '#34d399'; ctx.font = '800 20px Space Grotesk';
  ctx.fillText('AUTOMATED TWO-WAY SMS DISPATCH', cx, cy + 45);

  ctx.fillStyle = '#94a3b8'; ctx.font = '700 16px Inter';
  ctx.fillText('LEAD SECURED BEFORE COMPETITOR WAKES UP', cx, cy + 145);
  ctx.restore();
}

function renderUniversalGlitchContrast(t) {
  renderTopPill('⚠️ YET CONTRACTORS TAKE 4+ HOURS TO CALLBACK');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();
  ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
  ctx.fillRect(0, 0, W, H);

  drawStickFigure(ctx, cx, cy + 15, {
    pose: 'panicked_phone',
    role: 'contractor',
    headProp: 'hard_hat',
    expression: 'worried',
    color: '#f8fafc',
    scale: 1.45,
    anim: t
  });

  ctx.fillStyle = '#f87171'; ctx.font = '900 30px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('VOICEMAIL... PLEASE HOLD', cx, cy - 135);
  ctx.fillStyle = '#fbbf24'; ctx.font = '800 18px JetBrains Mono';
  ctx.fillText('AVERAGE DELAY: 4 HOURS 12 MINS', cx, cy + 135);
  ctx.restore();
}

// =============================================================
// SCENES 5 TO 15: CINEMATIC HOLLYWOOD PROBLEM, MECHANISM & CTA
// =============================================================
function renderScene5_Stat78PercentSlam(t) {
  const relT = t - 18.0;
  renderTopPill('⚡ THE SPEED-TO-LEAD LAW: 78% CLOSING RULE');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Impact Earthquake Shockwave Blast
  const wave = (relT * 3.5) % 1;
  ctx.strokeStyle = 'rgba(239, 68, 68, ' + (1 - wave) + ')';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(cx, cy + 20, 40 + wave * 220, 0, Math.PI * 2); ctx.stroke();

  // Massive 78% Pop Slam
  const popScale = Math.min(1.0, relT * 3.5);
  ctx.save();
  ctx.translate(cx, cy - 25);
  ctx.scale(popScale, popScale);

  ctx.fillStyle = '#ef4444'; ctx.font = '900 110px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 40;
  ctx.fillText('78%', 0, 0);
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3.5;
  ctx.strokeText('78%', 0, 0);
  ctx.restore();

  // Gold Coin Explosive Scatter
  for (let c = 0; c < 6; c++) {
    const coinX = cx - 120 + c * 48;
    const coinY = cy + 70 + Math.sin(relT * 8 + c) * 4;
    ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 15;
    ctx.beginPath(); ctx.ellipse(coinX, coinY, 18, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#b45309'; ctx.lineWidth = 2; ctx.stroke();
  }

  ctx.fillStyle = '#ffffff'; ctx.font = '900 24px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('OF HOMEOWNERS HIRE', cx, cy + 125);
  ctx.fillStyle = '#fbbf24'; ctx.font = '800 18px JetBrains Mono';
  ctx.fillText('THE 1ST CONTRACTOR WHO ANSWERS', cx, cy + 155);
  ctx.restore();
}

function renderScene6_IncomingEmergencyCall(t) {
  const relT = t - 22.5;
  renderTopPill('🚨 INCOMING HIGH-TICKET EMERGENCY CALL');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Realistic iPhone 16 Pro Ceramic Device
  const phoneW = 260; const phoneH = 360;
  ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 30;
  roundRect(ctx, cx - phoneW / 2, cy - phoneH / 2, phoneW, phoneH, 36, true, true);

  // Dynamic Island Notch
  ctx.fillStyle = '#000000';
  roundRect(ctx, cx - 45, cy - phoneH / 2 + 10, 90, 22, 11, true, false);

  // Realistic iOS Incoming Call UI
  ctx.fillStyle = '#38bdf8'; ctx.font = '800 13px Inter'; ctx.textAlign = 'center';
  ctx.fillText('INCOMING EMERGENCY CALL', cx, cy - 100);

  const trade = (window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.trade) ? window.ACTIVE_SCENARIO.trade : 'HVAC Emergency';
  const ticket = (window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.ticket) ? window.ACTIVE_SCENARIO.ticket : '$9,200';

  ctx.fillStyle = '#ffffff'; ctx.font = '900 24px Space Grotesk';
  ctx.fillText(trade, cx, cy - 65);

  ctx.fillStyle = '#fbbf24'; ctx.font = '900 32px JetBrains Mono';
  ctx.fillText(ticket + ' REVENUE', cx, cy - 25);

  // Slide-to-Answer Button with Pulse
  const ringPulse = (relT * 4) % 1;
  ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
  ctx.beginPath(); ctx.arc(cx, cy + 85, 34 + ringPulse * 22, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#10b981'; ctx.shadowColor = '#10b981'; ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.arc(cx, cy + 85, 30, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.font = '900 24px Inter';
  ctx.fillText('📞', cx, cy + 93);
  ctx.restore();
}

function renderScene7_OnTheLadderNoAnswer(t) {
  const relT = t - 26.8;
  renderTopPill('🪜 ON A LADDER · CANNOT REACH THE PHONE');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Ceiling Leaking Pipe & Water Drops
  ctx.strokeStyle = '#b45309'; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.moveTo(cx - 160, cy - 180); ctx.lineTo(cx + 160, cy - 180); ctx.stroke();

  // Leaking Drops
  for (let d = 0; d < 3; d++) {
    const dropY = cy - 170 + ((relT * 260 + d * 60) % 110);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(cx + 30, dropY, 3.5, 0, Math.PI * 2); ctx.fill();
  }

  // 12-Foot Heavy-Duty Aluminum Ladder
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(cx - 50, cy - 170); ctx.lineTo(cx - 75, cy + 140); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 50, cy - 170); ctx.lineTo(cx + 75, cy + 140); ctx.stroke();

  ctx.lineWidth = 4; ctx.strokeStyle = '#cbd5e1';
  for (let r = 0; r < 7; r++) {
    const ry = cy - 140 + r * 42;
    const rw = 52 + r * 3.5;
    ctx.beginPath(); ctx.moveTo(cx - rw, ry); ctx.lineTo(cx + rw, ry); ctx.stroke();
  }

  // Contractor Balanced at Top with Pipe Wrench
  drawStickFigure(ctx, cx + 5, cy - 60, {
    pose: 'ladder_climb',
    role: 'contractor',
    headProp: 'hard_hat',
    expression: 'worried',
    color: '#f8fafc',
    scale: 1.35,
    anim: relT
  });

  // Panic Speech Callout Bubble
  ctx.fillStyle = '#ef4444'; ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 20;
  roundRect(ctx, cx - 145, cy - 20, 110, 36, 10, true, false);
  ctx.fillStyle = '#ffffff'; ctx.font = '900 13px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText("CAN'T REACH!!", cx - 90, cy + 3);

  ctx.fillStyle = '#fbbf24'; ctx.font = '800 18px JetBrains Mono';
  ctx.fillText('RINGING IN BACK POCKET...', cx, cy + 160);
  ctx.restore();
}

function renderScene8_HandedToCompetitorBurn(t) {
  const relT = t - 31.0;
  const burnTicket = (window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.ticket) ? window.ACTIVE_SCENARIO.ticket : '$9,200';
  renderTopPill('💸 ' + burnTicket + ' JOB HANDED TO YOUR COMPETITOR');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Competitor Service Van Driving Across Bottom
  const vanX = cx - 180 + (relT * 85) % 360;
  const vanY = cy + 110;

  // Van Body
  ctx.fillStyle = '#dc2626'; ctx.shadowColor = '#dc2626'; ctx.shadowBlur = 25;
  roundRect(ctx, vanX - 70, vanY - 30, 140, 55, 10, true, false);
  // Cab Window
  ctx.fillStyle = '#0f172a';
  roundRect(ctx, vanX + 18, vanY - 24, 42, 24, 5, true, false);
  // Commercial Roof Rack with Ladders
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(vanX - 60, vanY - 38); ctx.lineTo(vanX + 40, vanY - 38); ctx.stroke();
  // Xenon Headlights
  ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#fef08a'; ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.arc(vanX + 68, vanY + 5, 8, 0, Math.PI * 2); ctx.fill();
  // Wheels
  ctx.fillStyle = '#1e293b'; ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.arc(vanX - 35, vanY + 28, 15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(vanX + 35, vanY + 28, 15, 0, Math.PI * 2); ctx.fill();

  // Sprinted Runner with Money Sack Leaping Ahead
  drawStickFigure(ctx, cx - 10, cy + 10, {
    pose: 'run_cash',
    expression: 'happy',
    color: '#ef4444',
    scale: 1.35,
    anim: relT
  });

  ctx.fillStyle = '#ef4444'; ctx.font = '900 32px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 25;
  ctx.fillText('COMPETITOR ANSWERED 1ST', cx, cy - 130);
  ctx.fillStyle = '#fbbf24'; ctx.font = '800 20px JetBrains Mono';
  ctx.fillText('CONTRACT SIGNED: ' + burnTicket, cx, cy - 95);
  ctx.restore();
}

function renderScene9_MeetAvaReveal(t) {
  const relT = t - 35.5;
  renderTopPill('⚡ MEET AVA: 24/7 AI PHONE RECEPTIONIST');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Cyan Holographic Acoustic Waveform Aura
  for (let r = 0; r < 3; r++) {
    const auraPulse = (relT * 3 + r * 0.33) % 1;
    ctx.strokeStyle = 'rgba(56, 189, 248, ' + (0.8 - auraPulse) + ')';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cy - 50, 70 + auraPulse * 90, 0, Math.PI * 2); ctx.stroke();
  }

  // 24 Dancing Spectrum Frequency Bars
  for (let b = 0; b < 24; b++) {
    const barX = cx - 120 + b * 10;
    const barH = 12 + Math.abs(Math.sin(relT * 12 + b * 0.5)) * 48;
    ctx.fillStyle = '#38bdf8'; ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 12;
    ctx.fillRect(barX, cy + 85 - barH / 2, 6, barH);
  }

  // Ava Heroine Avatar with Cyber Headset
  drawStickFigure(ctx, cx, cy + 5, {
    pose: 'ava_dispatch',
    headProp: 'headset',
    expression: 'happy',
    color: '#38bdf8',
    glow: '#38bdf8',
    scale: 1.45,
    anim: relT
  });

  ctx.fillStyle = '#34d399'; ctx.font = '900 32px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#10b981'; ctx.shadowBlur = 25;
  ctx.fillText('ANSWERS IN 0.8 SECONDS', cx, cy - 135);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 16px Inter';
  ctx.fillText('1-Ring Pickup · Zero Voicemails · Auto-Dispatches Tech', cx, cy + 140);
  ctx.restore();
}

function renderScene10_ConversationalTriage(t) {
  renderTopPill('🛡️ AUTONOMOUS CALL TRIAGE & CRM CHECK');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Frosted-Glass Interactive iPad Triage Console
  const cW = 420; const cH = 230;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5;
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 25;
  roundRect(ctx, cx - cW / 2, cy - cH / 2, cW, cH, 16, true, true);

  // Header Title
  ctx.fillStyle = '#38bdf8'; ctx.font = '800 13px JetBrains Mono'; ctx.textAlign = 'left';
  ctx.fillText('⚡ LIVE CONVERSATIONAL CRM TRIAGE', cx - cW / 2 + 18, cy - cH / 2 + 30);

  // Homeowner Bubble
  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  roundRect(ctx, cx - cW / 2 + 18, cy - 65, 340, 48, 10, true, false);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 14px Space Grotesk';
  ctx.fillText('"My AC unit died and it is 95° inside!"', cx - cW / 2 + 30, cy - 35);

  // Ava AI Response Bubble
  ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
  roundRect(ctx, cx - cW / 2 + 50, cy - 5, 350, 52, 10, true, false);
  ctx.fillStyle = '#34d399'; ctx.font = '800 14px Space Grotesk';
  ctx.fillText('Ava: "Got it! Tech Dave can arrive by 2:15 PM."', cx - cW / 2 + 62, cy + 26);

  // Qualified Badge
  ctx.fillStyle = '#fbbf24'; ctx.font = '900 16px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.fillText('✅ EMERGENCY LEAD QUALIFIED IN 0.8s', cx, cy + 85);
  ctx.restore();
}

function renderScene11_TechSmsDispatch(t) {
  renderTopPill('📲 INSTANT TECHNICIAN SMS DISPATCH');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Floating iOS Notification Banner
  const nW = 440; const nH = 140;
  ctx.fillStyle = 'rgba(30, 41, 59, 0.96)';
  ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.5;
  ctx.shadowColor = '#10b981'; ctx.shadowBlur = 30;
  roundRect(ctx, cx - nW / 2, cy - nH / 2, nW, nH, 18, true, true);

  // Messages App Icon
  ctx.fillStyle = '#10b981';
  roundRect(ctx, cx - nW / 2 + 18, cy - nH / 2 + 18, 36, 36, 8, true, false);
  ctx.fillStyle = '#ffffff'; ctx.font = '900 18px Inter'; ctx.textAlign = 'center';
  ctx.fillText('💬', cx - nW / 2 + 36, cy - nH / 2 + 42);

  // Sender & Timestamp
  ctx.fillStyle = '#94a3b8'; ctx.font = '700 12px Inter'; ctx.textAlign = 'left';
  ctx.fillText('AVA AI DISPATCH · NOW', cx - nW / 2 + 65, cy - nH / 2 + 32);

  // SMS Body
  const trade = (window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.trade) ? window.ACTIVE_SCENARIO.trade : 'HVAC Emergency';
  const ticket = (window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.ticket) ? window.ACTIVE_SCENARIO.ticket : '$9,200';
  ctx.fillStyle = '#ffffff'; ctx.font = '800 16px Space Grotesk';
  ctx.fillText('New ' + trade + ' (' + ticket + '): 742 Elm St.', cx - nW / 2 + 65, cy - nH / 2 + 62);
  ctx.fillStyle = '#34d399'; ctx.font = '700 14px Inter';
  ctx.fillText('Homeowner accepted estimate. Tap to navigate ➔', cx - nW / 2 + 65, cy - nH / 2 + 92);

  ctx.fillStyle = '#fbbf24'; ctx.font = '900 24px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 20;
  ctx.fillText('⚡ DISPATCHED IN 24 SECONDS', cx, cy + 120);
  ctx.restore();
}

function renderScene12_CompetitorTabClosed(t) {
  renderTopPill('🚫 ZERO TIME TO OPEN COMPETITOR TABS');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Browser Tab Slammed Shut
  ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 30;
  roundRect(ctx, cx - 180, cy - 80, 360, 140, 16, true, true);

  ctx.fillStyle = '#ef4444'; ctx.font = '900 48px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('❌ CLOSED', cx, cy - 10);

  ctx.fillStyle = '#ffffff'; ctx.font = '800 18px Inter';
  ctx.fillText('COMPETITOR NEVER HAD A CHANCE', cx, cy + 35);
  ctx.restore();
}

function renderScene13_StopBleedingDashboard(t) {
  renderTopPill('🛡️ AUTONOMOUS REVENUE PROTECTION');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Metrics Dashboard HUD
  const dW = 420; const dH = 200;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.5;
  ctx.shadowColor = '#10b981'; ctx.shadowBlur = 25;
  roundRect(ctx, cx - dW / 2, cy - dH / 2, dW, dH, 16, true, true);

  const ticket = (window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.ticket) ? window.ACTIVE_SCENARIO.ticket : '$9,200';
  ctx.fillStyle = '#34d399'; ctx.font = '900 52px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#10b981'; ctx.shadowBlur = 25;
  ctx.fillText('+' + ticket, cx, cy - 10);

  ctx.fillStyle = '#ffffff'; ctx.font = '800 20px Space Grotesk';
  ctx.fillText('REVENUE SECURED THIS WEEK', cx, cy + 30);

  ctx.fillStyle = '#fbbf24'; ctx.font = '800 14px JetBrains Mono';
  ctx.fillText('0 MISSED CALLS · 100% REVENUE CAPTURE', cx, cy + 65);
  ctx.restore();
}

function renderScene14_DialDemoLineLive(t) {
  renderTopPill('📞 TEST AVA LIVE RIGHT NOW ON SPEAKERPHONE');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Mobile Phone Dialer Keypad Card
  const kW = 420; const kH = 220;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 30;
  roundRect(ctx, cx - kW / 2, cy - kH / 2, kW, kH, 20, true, true);

  ctx.fillStyle = '#38bdf8'; ctx.font = '800 14px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.fillText('OFFICIAL 24/7 FLORIDA LIVE DEMO LINE', cx, cy - 60);

  // Big Glowing Florida Phone Number
  ctx.fillStyle = '#ffffff'; ctx.font = '900 42px JetBrains Mono';
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 35;
  ctx.fillText('(561) 813-8602', cx, cy);

  // Pulsing Green Call Button
  const pulse = (t * 4) % 1;
  ctx.fillStyle = 'rgba(16, 185, 129, ' + (0.9 - pulse * 0.5) + ')';
  roundRect(ctx, cx - 130, cy + 35, 260, 48, 24, true, false);
  ctx.fillStyle = '#ffffff'; ctx.font = '900 18px Space Grotesk';
  ctx.fillText('📞 TAP TO CALL AVA LIVE', cx, cy + 65);
  ctx.restore();
}

function renderScene15_InstagramCommentManyChat(t) {
  const keyword = (window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.keyword) ? window.ACTIVE_SCENARIO.keyword : 'AVA';
  renderTopPill('💬 COMMENT "' + keyword + '" BELOW FOR INSTANT ACCESS');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // ManyChat Auto-DM Callout Box
  const cW = 440; const cH = 220;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.98)';
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 35;
  roundRect(ctx, cx - cW / 2, cy - cH / 2, cW, cH, 20, true, true);

  ctx.fillStyle = '#ffffff'; ctx.font = '900 24px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('WANT THE INTERACTIVE DEMO LINK?', cx, cy - 40);

  ctx.fillStyle = '#fbbf24'; ctx.font = '900 48px JetBrains Mono';
  ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 30;
  ctx.fillText('COMMENT "' + keyword + '"', cx, cy + 20);

  ctx.fillStyle = '#34d399'; ctx.font = '800 18px Inter';
  ctx.fillText('🚀 We will DM you the live link instantly!', cx, cy + 70);
  ctx.restore();
}
`;

const oldAnimationBlock = html.substring(idxStart, idxEnd);
html = html.replace(oldAnimationBlock, () => masterEngineCode + '\n\n');
console.log('✅ Replaced entire animation block with Hollywood Master Engine');

// 3. Syntax Verification via vm.Script before saving to disk
const scriptStartIdx = html.indexOf('<script>');
const scriptEndIdx = html.lastIndexOf('</script>');
const scriptCode = html.substring(scriptStartIdx + 8, scriptEndIdx);

try {
  new vm.Script(scriptCode, { filename: 'test-compile.js' });
  console.log('🎉 Syntax check passed! Script is 100% valid!');
} catch (err) {
  console.error('❌ Compilation error in script:', err.message);
  process.exit(1);
}

if (isCRLF) html = html.replace(/\n/g, '\r\n');
fs.writeFileSync(targetFile, html, 'utf8');
console.log('🎉 Successfully saved upgraded reel-creator.html! Total length:', html.length);
