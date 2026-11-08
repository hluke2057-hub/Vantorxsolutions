const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetFile = path.join(__dirname, '..', 'website', 'demo', 'reel-creator.html');
let raw = fs.readFileSync(targetFile, 'utf8');
const isCRLF = raw.includes('\r\n');
let html = raw.replace(/\r\n/g, '\n');

console.log('Original length:', html.length);

// -------------------------------------------------------------
// 1. UPGRADED STUDIO CHARACTER ENGINE (drawStickFigure)
// -------------------------------------------------------------
const upgradedStickFigure = `function drawStickFigure(ctx, x, y, opts) {
  opts = opts || {};
  ctx.save();
  const scale = opts.scale || 1.0;
  const color = opts.color || '#ffffff';
  const facing = opts.facing || 1;
  const anim = opts.anim || 0;
  const pose = opts.pose || 'stand';

  ctx.translate(x, y);
  ctx.scale(facing * scale, scale);

  ctx.strokeStyle = color;
  ctx.lineWidth = 9.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (opts.glow) {
    ctx.shadowColor = opts.glow;
    ctx.shadowBlur = 20;
  }

  const headRadius = 26;
  const headCenterY = -120;
  const shoulderY = -82;
  const hipY = 0;

  // 1. Spine / Torso with natural posture tilt
  const spineTilt = (pose === 'run_cash') ? 14 : ((pose === 'ladder_climb') ? 6 : 0);
  ctx.beginPath();
  ctx.moveTo(spineTilt * 0.4, shoulderY);
  ctx.lineTo(0, hipY);
  ctx.stroke();

  // 2. Head with 3D gradient fill & rim light
  const headGrad = ctx.createRadialGradient(-6, headCenterY - 8, 4, 0, headCenterY, headRadius);
  headGrad.addColorStop(0, '#1e293b');
  headGrad.addColorStop(0.8, '#0b1220');
  headGrad.addColorStop(1, '#050811');

  ctx.save();
  ctx.beginPath();
  ctx.arc(0, headCenterY, headRadius, 0, Math.PI * 2);
  ctx.fillStyle = headGrad;
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Expressive Eyes with Specular Sparkle & Eyelid Blink
  const isBlinking = (Math.sin(anim * 2.8) > 0.94);
  const eyeX1 = 6;
  const eyeX2 = 16;
  const eyeY = headCenterY - 3;

  ctx.save();
  if (isBlinking) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(eyeX1 - 3, eyeY); ctx.lineTo(eyeX1 + 3, eyeY);
    ctx.moveTo(eyeX2 - 3, eyeY); ctx.lineTo(eyeX2 + 3, eyeY);
    ctx.stroke();
  } else {
    // Left & Right Eyes
    ctx.fillStyle = opts.eyeColor || '#ffffff';
    ctx.beginPath();
    ctx.arc(eyeX1, eyeY, 4, 0, Math.PI * 2);
    ctx.arc(eyeX2, eyeY, 4, 0, Math.PI * 2);
    ctx.fill();
    // Specular Catchlights
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(eyeX1 + 1.2, eyeY - 1.2, 1.5, 0, Math.PI * 2);
    ctx.arc(eyeX2 + 1.2, eyeY - 1.2, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Facial Expressions
  if (opts.expression === 'worried') {
    // Angled Worried Eyebrows
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(eyeX1 - 4, eyeY - 8); ctx.lineTo(eyeX1 + 4, eyeY - 5);
    ctx.moveTo(eyeX2 - 4, eyeY - 5); ctx.lineTo(eyeX2 + 4, eyeY - 8);
    ctx.stroke();
    // Trembling O-Mouth
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(11, headCenterY + 12, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    // Flying Sweat Drops
    for (let s = 0; s < 3; s++) {
      const swX = 26 + s * 10 + Math.sin(anim * 8 + s) * 6;
      const swY = headCenterY - 14 + s * 8 + Math.cos(anim * 8 + s) * 5;
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(swX, swY, 3.5 - s * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (opts.expression === 'happy') {
    // Raised Confident Eyebrows
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(eyeX1, eyeY - 7, 5, Math.PI * 1.1, Math.PI * 1.9);
    ctx.arc(eyeX2, eyeY - 7, 5, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    // Big Confident Smile with Teeth
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(11, headCenterY + 7, 9, 0, Math.PI, false);
    ctx.fill(); ctx.stroke();
  }
  ctx.restore();

  // 3. Head Props (High-Vis Hard Hat & Cyber Headset)
  if (opts.headProp === 'hard_hat') {
    ctx.save();
    // Construction Hard Hat Dome
    const hatGrad = ctx.createLinearGradient(-headRadius, headCenterY - 32, headRadius, headCenterY - 4);
    hatGrad.addColorStop(0, '#fef08a');
    hatGrad.addColorStop(0.4, '#f59e0b');
    hatGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = hatGrad;
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, headCenterY - 6, headRadius + 5, Math.PI * 1.05, Math.PI * 1.95, false);
    ctx.fill(); ctx.stroke();
    // Front Safety Brim
    ctx.beginPath();
    ctx.ellipse(3, headCenterY - 6, headRadius + 14, 5, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    // White Reflective Safety Stripe
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, headCenterY - 14, headRadius + 2, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.restore();
  } else if (opts.headProp === 'headset') {
    ctx.save();
    // Cyber Operator Headset
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, headCenterY - 2, headRadius + 5, Math.PI * 0.9, Math.PI * 1.9);
    ctx.stroke();
    // Ear Cup
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(-headRadius - 4, headCenterY + 2, 7, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    // Mic Boom
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-headRadius - 4, headCenterY + 4);
    ctx.quadraticCurveTo(0, headCenterY + 20, 16, headCenterY + 16);
    ctx.stroke();
    // Glowing Blue Mic Tip
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(17, headCenterY + 16, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 4. Body Poses & Limbs with Physics Kinematics
  if (pose === 'ladder_climb') {
    const legWobble = Math.sin(anim * 4) * 8;
    // Left & Right Legs on Rungs
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(-24, hipY + 42 + legWobble);
    ctx.lineTo(-22, hipY + 90);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(24, hipY + 42 - legWobble);
    ctx.lineTo(26, hipY + 90);
    ctx.stroke();

    // Work Boots
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-32, hipY + 86, 20, 8);
    ctx.fillRect(18, hipY + 86, 20, 8);

    // Left Arm Gripping Ladder
    ctx.beginPath();
    ctx.moveTo(0, shoulderY);
    ctx.lineTo(-36, shoulderY - 20);
    ctx.lineTo(-50, shoulderY - 42);
    ctx.stroke();

    // Right Arm Holding Plumber Pipe Wrench
    const armShake = Math.sin(anim * 10) * 8;
    ctx.beginPath();
    ctx.moveTo(0, shoulderY);
    ctx.lineTo(36, shoulderY + 8 + armShake);
    ctx.lineTo(56, shoulderY + 24 + armShake);
    ctx.stroke();

    // Detailed Heavy-Duty Pipe Wrench
    ctx.save();
    ctx.translate(56, shoulderY + 24 + armShake);
    ctx.rotate(Math.PI * 0.25);
    ctx.fillStyle = '#ef4444'; // Red handle
    ctx.fillRect(-6, -28, 12, 40);
    ctx.fillStyle = '#94a3b8'; // Steel jaw
    ctx.fillRect(-8, -42, 16, 16);
    ctx.fillRect(-12, -42, 8, 8);
    ctx.restore();

    // Vibrating Emergency Phone in Back Pocket
    ctx.save();
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 18;
    ctx.fillRect(8, hipY - 18, 14, 22);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    const ringPulse = (anim * 8) % 1;
    ctx.beginPath();
    ctx.arc(15, hipY - 7, 16 + ringPulse * 16, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(15, hipY - 7, 24 + ringPulse * 18, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();
    ctx.restore();

  } else if (pose === 'panicked_phone') {
    const pace = Math.sin(anim * 6) * 10;
    // Pacing Legs
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(-18 + pace, hipY + 44);
    ctx.lineTo(-14 + pace, hipY + 90);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(18 - pace, hipY + 44);
    ctx.lineTo(22 - pace, hipY + 90);
    ctx.stroke();

    // Clutching Head in Panic (Left Arm)
    ctx.beginPath();
    ctx.moveTo(0, shoulderY);
    ctx.lineTo(-40, shoulderY - 30);
    ctx.lineTo(-headRadius - 6, headCenterY - 8);
    ctx.stroke();

    // Holding Phone to Ear (Right Arm)
    ctx.beginPath();
    ctx.moveTo(0, shoulderY);
    ctx.lineTo(28, shoulderY - 14);
    ctx.lineTo(headRadius + 8, headCenterY + 4);
    ctx.stroke();

    // Glowing Smartphone with Emergency Radio Waves
    ctx.save();
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 15;
    ctx.fillRect(headRadius + 6, headCenterY - 8, 10, 18);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    const radioW = (anim * 6) % 1;
    ctx.beginPath();
    ctx.arc(headRadius + 16, headCenterY + 1, 10 + radioW * 14, -Math.PI * 0.3, Math.PI * 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(headRadius + 16, headCenterY + 1, 16 + radioW * 16, -Math.PI * 0.3, Math.PI * 0.3);
    ctx.stroke();
    ctx.restore();

  } else if (pose === 'run_cash') {
    const runCycle = Math.sin(anim * 9);
    // Sprinted High-Knee Legs
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(-32 * runCycle, hipY + 38);
    ctx.lineTo(-46 * runCycle, hipY + 84);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(32 * runCycle, hipY + 38);
    ctx.lineTo(46 * runCycle, hipY + 84);
    ctx.stroke();

    // Running Arms Holding Bulging Burlap Sack
    ctx.beginPath();
    ctx.moveTo(0, shoulderY);
    ctx.lineTo(32, shoulderY - 18);
    ctx.lineTo(48, shoulderY - 42);
    ctx.stroke();

    // Burlap Sack of Cash with Glowing Green Emerald Dollar Sign
    ctx.save();
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(58, shoulderY - 48, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#064e3b';
    ctx.font = '900 24px Space Grotesk';
    ctx.textAlign = 'center';
    ctx.fillText(String.fromCharCode(36), 58, shoulderY - 40);

    // Floating Fluttering Dollar Bills Behind Runner
    for (let b = 0; b < 4; b++) {
      const bx = -20 - b * 28 + Math.sin(anim * 6 + b) * 12;
      const by = shoulderY - 10 + b * 18 + Math.cos(anim * 5 + b) * 8;
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(Math.sin(anim * 4 + b) * 0.6);
      ctx.fillStyle = '#34d399';
      ctx.strokeStyle = '#065f46';
      ctx.lineWidth = 1.5;
      ctx.fillRect(-12, -6, 24, 12);
      ctx.strokeRect(-12, -6, 24, 12);
      ctx.fillStyle = '#064e3b';
      ctx.font = '700 8px monospace';
      ctx.fillText(String.fromCharCode(36), 0, 3);
      ctx.restore();
    }
    ctx.restore();

  } else if (pose === 'ava_dispatch') {
    // Confident Heroic Stance
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(-18, hipY + 48);
    ctx.lineTo(-20, hipY + 95);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(18, hipY + 48);
    ctx.lineTo(20, hipY + 95);
    ctx.stroke();

    // Left Hand Touching Headset
    ctx.beginPath();
    ctx.moveTo(0, shoulderY);
    ctx.lineTo(-26, shoulderY - 22);
    ctx.lineTo(-headRadius - 2, headCenterY + 4);
    ctx.stroke();

    // Right Arm Projecting Holographic Glass Tablet
    ctx.beginPath();
    ctx.moveTo(0, shoulderY);
    ctx.lineTo(38, shoulderY + 12);
    ctx.lineTo(54, shoulderY + 2);
    ctx.stroke();

    // Glowing Holographic Dispatch HUD Card
    ctx.save();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 24;
    roundRect(ctx, 52, shoulderY - 26, 72, 48, 10, true, true);

    ctx.fillStyle = '#34d399';
    ctx.font = '900 12px Inter';
    ctx.fillText('⚡ DISPATCH', 58, shoulderY - 8);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 10px JetBrains Mono';
    ctx.fillText('0.8s QUALIFIED', 58, shoulderY + 8);
    ctx.restore();
  }

  ctx.restore();
}`;

// -------------------------------------------------------------
// 2. UPGRADED 7 HOOK STORIES (0.0s - 18.0s)
// -------------------------------------------------------------
const upgradedHookStories = `
// =============================================================
// STORY 1: COSMIC SPEED OF LIGHT & SATURN (Ultra High-Fidelity)
// =============================================================
function renderStory1_LaserSpeed(t) {
  renderTopPill('⚡ SPEED OF LIGHT: 186,000 MILES/SEC');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();

  // Blinding Core Laser Emitter & Energy Concentric Rings
  const pulse = (t * 8) % 1;
  ctx.strokeStyle = 'rgba(245, 158, 11, ' + (1 - pulse) + ')';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 80 + pulse * 120, 0, Math.PI * 2);
  ctx.stroke();

  // High-Energy Core Arc
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 12;
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 35;
  ctx.beginPath();
  ctx.arc(cx, cy, 140, Math.PI * 0.8, Math.PI * 0.8 + (t / 4.5) * Math.PI * 1.4);
  ctx.stroke();

  // Core Readout
  ctx.fillStyle = '#ffffff'; ctx.font = '900 56px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 30;
  ctx.fillText('186,000', cx, cy - 12);
  ctx.fillStyle = '#fbbf24'; ctx.font = '800 22px Space Grotesk';
  ctx.fillText('MILES PER SECOND', cx, cy + 32);
  ctx.restore();
}

function renderStory1_MoonImpact(t) {
  renderTopPill('🌕 1.3 SECONDS: MOON ORBIT BREACH');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();

  // Shaded Realistic Moon with Craters
  const moonGrad = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, 110);
  moonGrad.addColorStop(0, '#f8fafc');
  moonGrad.addColorStop(0.5, '#cbd5e1');
  moonGrad.addColorStop(0.85, '#475569');
  moonGrad.addColorStop(1, '#0f172a');

  ctx.fillStyle = moonGrad;
  ctx.shadowColor = '#94a3b8'; ctx.shadowBlur = 35;
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.fill();

  // Lunar Craters
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  const craters = [[-40, -30, 22], [30, 20, 32], [-20, 45, 18], [40, -40, 16], [0, -10, 14]];
  for (const c of craters) {
    ctx.beginPath();
    ctx.arc(cx + c[0], cy + c[1], c[2], 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; ctx.lineWidth = 2; ctx.stroke();
  }

  // Laser Impact Ring
  const relT = (t - 4.5);
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 6;
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.arc(cx, cy, 110 + (relT * 30) % 50, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#ffffff'; ctx.font = '900 48px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('1.3 SECONDS', cx, cy + 165);
  ctx.fillStyle = '#38bdf8'; ctx.font = '700 20px JetBrains Mono';
  ctx.fillText('EARTH ➔ MOON REACHED', cx, cy + 200);
  ctx.restore();
}

function renderStory1_SaturnDeepSpace(t) {
  renderTopPill('🪐 2 BILLION MILES TO SATURN IN 3 HOURS');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();

  // Saturn Planet Body
  const saturnGrad = ctx.createRadialGradient(cx - 20, cy - 20, 10, cx, cy, 80);
  saturnGrad.addColorStop(0, '#fef08a');
  saturnGrad.addColorStop(0.5, '#d97706');
  saturnGrad.addColorStop(1, '#451a03');
  ctx.fillStyle = saturnGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 80, 0, Math.PI * 2);
  ctx.fill();

  // Tilted Majestic Rings
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.38);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)'; ctx.lineWidth = 14;
  ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.ellipse(0, 0, 210, 48, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.5)'; ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.ellipse(0, 0, 240, 56, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Telemetry HUD
  ctx.fillStyle = '#ffffff'; ctx.font = '900 42px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('DEEP SPACE: 3 HOURS', cx, cy + 170);
  ctx.fillStyle = '#ef4444'; ctx.font = '800 20px JetBrains Mono';
  ctx.fillText('YET CONTRACTORS TAKE 4 HOURS', cx, cy + 205);
  ctx.restore();
}

// =============================================================
// STORY 2: PEREGRINE FALCON (Vector Predator Dive & Tactical HUD)
// =============================================================
function renderStory2_FalconHighAltitude(t) {
  renderTopPill('🦅 NATURE\\'S FASTEST WEAPON: PEREGRINE FALCON');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Rotating Tactical Azimuth Gimbal
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(cx, cy, 140, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, 110, 0, Math.PI * 2); ctx.stroke();

  // Crosshair Lines with Tick Marks
  ctx.beginPath(); ctx.moveTo(cx - 165, cy); ctx.lineTo(cx + 165, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - 165); ctx.lineTo(cx, cy + 165); ctx.stroke();

  // Vector Falcon Silhouette Circling at 3,500 FT
  const falconAngle = t * 1.8;
  const fx = cx + Math.cos(falconAngle) * 55;
  const fy = cy + Math.sin(falconAngle) * 35;
  ctx.save();
  ctx.translate(fx, fy);
  ctx.rotate(falconAngle + Math.PI / 2);
  drawVectorFalconSilhouette(ctx, 0.95);
  ctx.restore();

  // Altitude Readout Dropping Rapidly
  const alt = Math.max(800, Math.floor(3500 - t * 450));
  ctx.fillStyle = '#38bdf8'; ctx.font = '900 52px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 25;
  ctx.fillText('ALT: ' + alt.toLocaleString() + ' FT', cx, cy + 175);
  ctx.fillStyle = '#ffffff'; ctx.font = '800 20px Space Grotesk';
  ctx.fillText('TARGET ACQUIRED · DIVING NOW', cx, cy + 210);
  ctx.restore();
}

function renderStory2_FalconDiveHUD(t) {
  renderTopPill('⚡ DIVE SPEED: 242 MILES PER HOUR');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Full-Speed Falcon Plunging Downward with Vapor Cone
  ctx.save();
  ctx.translate(cx, cy - 20);
  ctx.rotate(Math.PI * 0.9); // diving steep angle

  // Mach Vapor Cone
  ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.beginPath();
  ctx.moveTo(0, -60);
  ctx.lineTo(-80, 80);
  ctx.lineTo(80, 80);
  ctx.closePath();
  ctx.fill();

  drawVectorFalconSilhouette(ctx, 1.4);
  ctx.restore();

  // Huge Airspeed Readout
  ctx.fillStyle = '#ffffff'; ctx.font = '900 80px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 35;
  ctx.fillText('242 MPH', cx, cy + 155);
  ctx.fillStyle = '#38bdf8'; ctx.font = '800 24px Space Grotesk';
  ctx.fillText('VERTICAL STOOP DIVE', cx, cy + 195);
  ctx.restore();
}

function renderStory2_FalconReflex15ms(t) {
  renderTopPill('⏱️ 15 MILLISECONDS NERVOUS REFLEX ARC');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Neon Emerald Reflex Ring Pulsing
  ctx.strokeStyle = '#34d399'; ctx.lineWidth = 14;
  ctx.shadowColor = '#34d399'; ctx.shadowBlur = 30;
  ctx.beginPath(); ctx.arc(cx, cy - 20, 130, 0, Math.PI * 2); ctx.stroke();

  ctx.fillStyle = '#34d399'; ctx.font = '900 76px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.fillText('15ms', cx, cy - 5);
  ctx.fillStyle = '#ffffff'; ctx.font = '800 22px Space Grotesk';
  ctx.fillText('APEX PREDATOR REFLEX', cx, cy + 45);

  ctx.fillStyle = '#ef4444'; ctx.font = '800 20px monospace';
  ctx.fillText('CONTRACTOR CALLBACK: 3.5 HOURS', cx, cy + 175);
  ctx.restore();
}

// Vector Falcon Drawing Helper
function drawVectorFalconSilhouette(ctx, scale) {
  ctx.save();
  ctx.scale(scale, scale);
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 18;
  // Fuselage Body
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 42, 0, 0, Math.PI * 2);
  ctx.fill();
  // Swept Wings
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.quadraticCurveTo(65, 5, 85, -25);
  ctx.quadraticCurveTo(55, 20, 0, 15);
  ctx.quadraticCurveTo(-55, 20, -85, -25);
  ctx.quadraticCurveTo(-65, 5, 0, -10);
  ctx.fill();
  // Tail Fan
  ctx.beginPath();
  ctx.moveTo(-10, 32); ctx.lineTo(10, 32); ctx.lineTo(16, 52); ctx.lineTo(-16, 52); ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// =============================================================
// STORY 3: FORMULA 1 WORLD RECORD PIT STOP (Vector Car & Sparks)
// =============================================================
function renderStory3_F1StartingGridLights(t) {
  renderTopPill('🏎️ FORMULA 1 WORLD RECORD PIT STOP');
  const cx = W / 2; const cy = H * 0.36;
  ctx.save();

  // 5 Red Starting Grid Lights
  for (let i = 0; i < 5; i++) {
    const lx = cx - 160 + i * 80;
    const ly = cy - 65;
    ctx.beginPath();
    ctx.arc(lx, ly, 30, 0, Math.PI * 2);
    ctx.fillStyle = (t > i * 0.7) ? '#ef4444' : '#1e293b';
    if (t > i * 0.7) {
      ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 25;
    }
    ctx.fill();
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 4; ctx.stroke();
  }

  // Draw Vector Top-Down Formula 1 Car in the Pit Box
  ctx.save();
  ctx.translate(cx, cy + 90);
  drawVectorFormula1Car(ctx, 1.25, t);
  ctx.restore();

  ctx.fillStyle = '#ffffff'; ctx.font = '900 26px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('20 CREW MEMBERS · 4 TIRES', cx, cy + 205);
  ctx.restore();
}

function renderStory3_F1Stopwatch180(t) {
  renderTopPill('⏱️ 1.80 SECONDS COMPLETE TIRE SWAP');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Digital Stopwatch Ring with Sector Purple Flash
  ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 14;
  ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 35;
  ctx.beginPath(); ctx.arc(cx, cy - 20, 135, 0, Math.PI * 2); ctx.stroke();

  // Stopwatch Count-Up
  const timer = Math.min(1.80, (t - 4.5) * 0.55).toFixed(2);
  ctx.fillStyle = '#fbbf24'; ctx.font = '900 82px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 30;
  ctx.fillText(timer + 's', cx, cy - 6);

  ctx.fillStyle = '#ffffff'; ctx.font = '900 24px Space Grotesk';
  ctx.fillText('WORLD RECORD PIT STOP', cx, cy + 42);

  ctx.fillStyle = '#ef4444'; ctx.font = '800 20px monospace';
  ctx.fillText('VS 8-SECOND CONTRACTOR SITE LOAD', cx, cy + 175);
  ctx.restore();
}

function renderStory3_F1SpinningTire(t) {
  renderTopPill('🛞 0.4s FAST MOBILE WEBSITE FUNNEL');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Spinning Racing Tire with Yellow Pirelli Rim
  ctx.save();
  ctx.translate(cx, cy - 15);
  ctx.rotate(t * 12);
  // Tire Rubber
  ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.arc(0, 0, 95, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // Yellow Stripe
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 6;
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.arc(0, 0, 75, 0, Math.PI * 2); ctx.stroke();
  // Spokes
  for (let s = 0; s < 5; s++) {
    ctx.rotate(Math.PI * 2 / 5);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 75); ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = '#34d399'; ctx.font = '900 52px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#34d399'; ctx.shadowBlur = 25;
  ctx.fillText('0.4s SPEED', cx, cy + 155);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 20px Inter';
  ctx.fillText('Loads Faster Than 99% of Competitors', cx, cy + 195);
  ctx.restore();
}

// Vector F1 Car Helper
function drawVectorFormula1Car(ctx, scale, t) {
  ctx.save();
  ctx.scale(scale, scale);
  // Monocoque Chassis
  ctx.fillStyle = '#090d16';
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -60); // Nosecone
  ctx.lineTo(12, -25);
  ctx.lineTo(24, 15); // Sidepod right
  ctx.lineTo(20, 50);
  ctx.lineTo(-20, 50);
  ctx.lineTo(-24, 15); // Sidepod left
  ctx.lineTo(-12, -25);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Front Wing
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-38, -62, 76, 8);
  // Rear Wing
  ctx.fillRect(-36, 48, 72, 10);

  // 4 Tires with Hot Brake Glow
  const tires = [[-34, -30], [34, -30], [-32, 35], [32, 35]];
  for (const tr of tires) {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(tr[0] - 6, tr[1] - 12, 12, 24);
    // Glowing Brake Disk
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 10;
    ctx.fillRect(tr[0] - 2, tr[1] - 4, 4, 8);
  }
  ctx.restore();
}

// =============================================================
// STORY 4: BRAIN SYNAPSES & AEO SEARCH (Vector Brain Anatomy)
// =============================================================
function renderStory4_BrainSynapses(t) {
  renderTopPill('🧠 86 BILLION NEURONS: 13MS SYNAPTIC FIRING');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Neon Violet Anatomical Brain Contour
  ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 4;
  ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 30;
  drawVectorBrainContour(ctx, cx, cy - 20, 1.25);

  // Synaptic Electric Firing
  for (let i = 0; i < 14; i++) {
    const pulseT = (t * 4 + i * 0.8) % 1;
    const px = cx - 90 + (i * 24) % 180;
    const py = cy - 80 + (i * 18) % 110;
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(px, py, 4 + pulseT * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#ffffff'; ctx.font = '900 48px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('13 MILLISECONDS', cx, cy + 155);
  ctx.fillStyle = '#38bdf8'; ctx.font = '800 20px monospace';
  ctx.fillText('86B NEURAL CONNECTIONS', cx, cy + 195);
  ctx.restore();
}

function renderStory4_ChatGptTerminal(t) {
  renderTopPill('🤖 CHATGPT & AI SEARCH REVOLUTION');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Futuristic Glass Terminal Card
  const cardW = 460; const cardH = 200;
  roundRect(ctx, cx - cardW / 2, cy - 90, cardW, cardH, 18, true, true);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)'; ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)'; ctx.lineWidth = 2; ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#94a3b8'; ctx.font = '700 15px JetBrains Mono';
  ctx.fillText('> user: "Best contractor near me for emergency repair?"', cx - 205, cy - 40);

  ctx.fillStyle = '#34d399'; ctx.font = '800 17px Space Grotesk';
  ctx.shadowColor = '#34d399'; ctx.shadowBlur = 14;
  ctx.fillText('✓ ChatGPT Recommendation: #1 Ranked Local Shop', cx - 205, cy + 10);
  ctx.fillStyle = '#fbbf24'; ctx.font = '700 14px monospace';
  ctx.fillText('Cited in AI Overviews · Perplexity · Gemini', cx - 205, cy + 45);
  ctx.restore();
}

function renderStory4_AiCitationRank1(t) {
  renderTopPill('🏆 RANK #1 IN AI OVERVIEWS & PERPLEXITY');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Golden Trophy Badge
  ctx.fillStyle = '#fbbf24'; ctx.font = '900 78px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 35;
  ctx.fillText('#1 CITED', cx, cy + 10);

  ctx.fillStyle = '#ffffff'; ctx.font = '800 24px Inter';
  ctx.fillText('AEO AI Dominance Engine', cx, cy + 60);
  ctx.fillStyle = '#34d399'; ctx.font = '700 18px monospace';
  ctx.fillText('Competitors invisible · You get all AI leads', cx, cy + 95);
  ctx.restore();
}

function drawVectorBrainContour(ctx, cx, cy, scale) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.beginPath();
  // Left Hemisphere
  ctx.moveTo(0, -60);
  ctx.bezierCurveTo(-45, -75, -95, -45, -85, 0);
  ctx.bezierCurveTo(-95, 35, -55, 65, 0, 60);
  // Right Hemisphere
  ctx.bezierCurveTo(55, 65, 95, 35, 85, 0);
  ctx.bezierCurveTo(95, -45, 45, -75, 0, -60);
  ctx.stroke();
  ctx.restore();
}

// =============================================================
// STORY 5: SATURN V APOLLO 11 (Stratospheric Rocket Plume)
// =============================================================
function renderStory5_ApolloCountdown(t) {
  renderTopPill('🚀 APOLLO 11 SATURN V: CAPE CANAVERAL');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Draw Saturn V Rocket Fuselage
  drawVectorSaturnVRocket(ctx, cx, cy - 20, 1.2);

  ctx.fillStyle = '#ffffff'; ctx.font = '900 48px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 25;
  ctx.fillText('LIFTOFF: 1969', cx, cy + 165);
  ctx.fillStyle = '#f59e0b'; ctx.font = '800 20px Space Grotesk';
  ctx.fillText('3,000 TONS OF THRUST', cx, cy + 200);
  ctx.restore();
}

function renderStory5_RocketExhaust(t) {
  renderTopPill('🔥 7.5 MILLION POUNDS OF ROCKET THRUST');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Blinding Core Flame Exhaust Plume
  drawVectorSaturnVRocket(ctx, cx, cy - 70, 1.35);

  // Billowing Fire & Smoke
  for (let p = 0; p < 25; p++) {
    const py = cy + 40 + p * 8;
    const px = cx + Math.sin(t * 12 + p) * (18 + p * 3);
    ctx.fillStyle = (p < 8) ? '#ffffff' : ((p < 16) ? '#fbbf24' : '#ef4444');
    ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(px, py, 14 + p * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#ffffff'; ctx.font = '900 64px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 30;
  ctx.fillText('MAX Q', cx, cy + 185);
  ctx.restore();
}

function renderStory5_Apollo4kbRAM(t) {
  renderTopPill('💾 4 KILOBYTES OF RAM REACHED THE MOON');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  ctx.fillStyle = '#38bdf8'; ctx.font = '900 84px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 35;
  ctx.fillText('4 KB', cx, cy - 10);

  ctx.fillStyle = '#ffffff'; ctx.font = '800 24px Space Grotesk';
  ctx.fillText('APOLLO GUIDANCE COMPUTER', cx, cy + 45);

  ctx.fillStyle = '#ef4444'; ctx.font = '800 20px monospace';
  ctx.fillText('CONTRACTORS STILL LOSE LEADS ON PAPER', cx, cy + 175);
  ctx.restore();
}

function drawVectorSaturnVRocket(ctx, cx, cy, scale) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  // Fuselage Body
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 3;
  ctx.fillRect(-18, -90, 36, 120);
  ctx.strokeRect(-18, -90, 36, 120);
  // Nosecone
  ctx.beginPath(); ctx.moveTo(-18, -90); ctx.lineTo(0, -135); ctx.lineTo(18, -90); ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Black Roll Markings
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-18, -50, 18, 30);
  ctx.fillRect(0, -20, 18, 30);
  // Fins
  ctx.beginPath(); ctx.moveTo(-18, 10); ctx.lineTo(-36, 30); ctx.lineTo(-18, 30); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(18, 10); ctx.lineTo(36, 30); ctx.lineTo(18, 30); ctx.closePath(); ctx.fill();
  ctx.restore();
}

// =============================================================
// STORY 6: 1-BILLION-VOLT LIGHTNING (Fractal Branching Lightning)
// =============================================================
function renderStory6_LightningStorm(t) {
  renderTopPill('⚡ ONE BILLION VOLTS: ATMOSPHERIC DISCHARGE');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // True Branching Lightning Bolt
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6;
  ctx.shadowColor = '#c084fc'; ctx.shadowBlur = 35;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 150);
  ctx.lineTo(cx - 30, cy - 80);
  ctx.lineTo(cx + 25, cy - 20);
  ctx.lineTo(cx - 15, cy + 40);
  ctx.lineTo(cx + 40, cy + 120);
  ctx.stroke();

  // Secondary Branch
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx + 25, cy - 20);
  ctx.lineTo(cx + 70, cy + 15);
  ctx.stroke();

  ctx.fillStyle = '#ffffff'; ctx.font = '900 56px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 30;
  ctx.fillText('1,000,000,000V', cx, cy + 175);
  ctx.restore();
}

function renderStory6_OneBillionVolts(t) {
  renderTopPill('⚡ 50,000°F THERMAL PLASMA CHANNEL');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  ctx.fillStyle = '#f59e0b'; ctx.font = '900 78px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 35;
  ctx.fillText('50,000°F', cx, cy - 10);

  ctx.fillStyle = '#ffffff'; ctx.font = '800 24px Space Grotesk';
  ctx.fillText('HOTTER THAN THE SUN', cx, cy + 45);

  ctx.fillStyle = '#38bdf8'; ctx.font = '800 20px monospace';
  ctx.fillText('AVA TRIAGES ELECTRICAL FIRES INSTANTLY', cx, cy + 175);
  ctx.restore();
}

function renderStory6_Thermal50kDegrees(t) {
  renderTopPill('🔥 $6,000 PANEL BURN SAVED IN 0.8s');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  drawStickFigure(ctx, cx, cy + 20, {
    pose: 'ava_dispatch',
    headProp: 'headset',
    expression: 'happy',
    color: '#fbbf24',
    glow: '#f59e0b',
    scale: 1.5,
    anim: t
  });

  ctx.fillStyle = '#34d399'; ctx.font = '900 42px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#34d399'; ctx.shadowBlur = 25;
  ctx.fillText('$6,000 RESCUE', cx, cy + 165);
  ctx.restore();
}

// =============================================================
// STORY 7: NIAGARA WATERFALL (Rushing Hydro Torrent)
// =============================================================
function renderStory7_NiagaraWaterfall(t) {
  renderTopPill('🌊 NIAGARA FALLS: 750,000 GALLONS PER SECOND');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  // Cascading Hydraulic Water Ribbons
  for (let w = 0; w < 12; w++) {
    const wx = cx - 180 + w * 32;
    ctx.strokeStyle = (w % 2 === 0) ? '#38bdf8' : '#ffffff';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(wx, cy - 120);
    ctx.lineTo(wx + Math.sin(t * 8 + w) * 10, cy + 110);
    ctx.stroke();
  }

  ctx.fillStyle = '#ffffff'; ctx.font = '900 52px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 30;
  ctx.fillText('750,000 GPM', cx, cy + 165);
  ctx.restore();
}

function renderStory7_GallonsMeter750k(t) {
  renderTopPill('🚨 BURST COMMERCIAL PIPE EMERGENCY');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  drawStickFigure(ctx, cx, cy + 15, {
    pose: 'panicked_phone',
    expression: 'worried',
    color: '#ffffff',
    scale: 1.5,
    anim: t
  });

  ctx.fillStyle = '#ef4444'; ctx.font = '900 40px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('CEILING COLLAPSING!', cx, cy - 145);
  ctx.restore();
}

function renderStory7_BurstPipePressure(t) {
  renderTopPill('⚡ 90-SECOND SMS SPEED-TO-LEAD LOCK');
  const cx = W / 2; const cy = H * 0.38;
  ctx.save();

  ctx.fillStyle = '#34d399'; ctx.font = '900 72px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#34d399'; ctx.shadowBlur = 35;
  ctx.fillText('24 SECONDS', cx, cy - 10);

  ctx.fillStyle = '#ffffff'; ctx.font = '800 24px Space Grotesk';
  ctx.fillText('AUTOMATED TWO-WAY SMS DISPATCH', cx, cy + 45);
  ctx.restore();
}
`;

// Replace drawStickFigure safely with function replacement
const stickStart = 'function drawStickFigure(ctx, x, y, opts) {';
const hookStart = 'function renderDynamicStoryHookPhase(t) {';

const idxStickStart = html.indexOf(stickStart);
const idxHookStart = html.indexOf(hookStart);
const stickOldBlock = html.substring(idxStickStart, idxHookStart);

html = html.replace(stickOldBlock, () => upgradedStickFigure + '\n\n');
console.log('✅ Replaced drawStickFigure with Studio-Grade Vector Engine');

// Replace 7 hook stories safely with function replacement
const oldStoriesStart = '// STORY 1: COSMIC LIGHT';
const oldStoriesEnd = 'function renderUniversalGlitchContrast(t) {';

const idxStoriesStart = html.indexOf(oldStoriesStart);
const idxStoriesEnd = html.indexOf(oldStoriesEnd);
const storiesOldBlock = html.substring(idxStoriesStart, idxStoriesEnd);

html = html.replace(storiesOldBlock, () => upgradedHookStories + '\n\n');
console.log('✅ Replaced all 7 hook story functions with Studio-Grade animations');

// Verify syntax in memory before saving!
const scriptStartIdx = html.indexOf('<script>');
const scriptEndIdx = html.lastIndexOf('</script>');
const scriptCode = html.substring(scriptStartIdx + 8, scriptEndIdx);

try {
  new vm.Script(scriptCode, { filename: 'test-compile.js' });
  console.log('🎉 Syntax check passed! Script is 100% valid!');
} catch (err) {
  console.error('❌ Compilation error:', err.message);
  process.exit(1);
}

if (isCRLF) html = html.replace(/\n/g, '\r\n');
fs.writeFileSync(targetFile, html, 'utf8');
console.log('🎉 Successfully saved upgraded reel-creator.html! New length:', html.length);
