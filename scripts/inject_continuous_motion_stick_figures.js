const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('website/demo/reel-creator.html');
let html = fs.readFileSync(targetFile, 'utf8');

// =========================================================================
// SECTION A & B: ATMOSPHERE, STICK FIGURE ENGINE, AVA ROBOT 2.0, PROPS & RENDERFRAME
// =========================================================================
const upgradedEngineCode = `// 🎨 IMMERSIVE STICK FIGURE STORY ANIMATION ENGINE (CONTINUOUS KINETIC MOTION)
// Non-stop movement, full character articulation, squash & stretch, physics particles, and zero still frames
// =========================================================================

// --- 40 CONTINUOUS LIVING AMBIENT PARTICLES ---
const AMBIENT_PARTICLES = Array.from({ length: 48 }, (_, i) => ({
  x: Math.random() * 540,
  y: Math.random() * 960,
  vx: (Math.random() - 0.5) * 0.8,
  vy: -0.4 - Math.random() * 0.8,
  size: 1.5 + Math.random() * 2.5,
  alpha: 0.2 + Math.random() * 0.5,
  color: i % 4 === 0 ? '#38bdf8' : (i % 4 === 1 ? '#c8ff00' : (i % 4 === 2 ? '#a855f7' : '#ffffff')),
  pulseSpeed: 2 + Math.random() * 4
}));

// --- LIVING DARK CANVAS BACKGROUND WITH CONTINUOUS PARTICLES ---
function renderDynamicAtmosphere(t, storyType) {
  // Deep clean midnight chalkboard navy with subtle moving gradient
  const shiftY = Math.sin(t * 0.5) * 40;
  const grad = ctx.createLinearGradient(0, -shiftY, 0, H + shiftY);
  grad.addColorStop(0, '#090d16');
  grad.addColorStop(0.5, '#0d1322');
  grad.addColorStop(1, '#080c14');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Subtle moving cosmic / ambient particle drift (ALWAYS MOVING)
  ctx.save();
  for (let i = 0; i < AMBIENT_PARTICLES.length; i++) {
    const p = AMBIENT_PARTICLES[i];
    p.y += p.vy;
    p.x += p.vx + Math.sin(t * 1.5 + i) * 0.3;
    if (p.y < -10) p.y = H + 10;
    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;

    const pulse = 0.5 + 0.5 * Math.sin(t * p.pulseSpeed + i);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha * pulse;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Subtle clean floor ground line with energy ripple
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, H - 180);
  ctx.lineTo(W, H - 180);
  ctx.stroke();

  // Moving floor scanline shimmer
  const scanX = (t * 140) % (W + 200) - 100;
  const scanGrad = ctx.createLinearGradient(scanX - 60, 0, scanX + 60, 0);
  scanGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
  scanGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.25)');
  scanGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.strokeStyle = scanGrad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(scanX - 60, H - 180);
  ctx.lineTo(scanX + 60, H - 180);
  ctx.stroke();
  ctx.restore();
}

// --- EXPRESSIVE STICK FIGURE CHARACTER DRAWING ROUTINE 2.0 ---
// Features full squash-and-stretch, articulated walk/run cycles, blinking, sweating, and talking
function drawStickPerson(ctx, x, y, opts) {
  opts = opts || {};
  const t = opts.t || 0;
  ctx.save();

  // Dynamic squash-and-stretch & idle breathing
  const breath = Math.sin(t * 7) * 2.5;
  const squashY = 1.0 + Math.sin(t * 7) * 0.02;
  const squashX = 1.0 - Math.sin(t * 7) * 0.015;

  ctx.translate(x, y + breath);

  const scale = opts.scale || 1.0;
  const facing = opts.facing || 1; // 1 = right, -1 = left
  ctx.scale(facing * scale * squashX, scale * squashY);

  const color = opts.color || '#ffffff';
  ctx.strokeStyle = color;
  ctx.lineWidth = opts.lineWidth || 4.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const headRadius = 22;
  const headY = -120;
  const neckY = -98;
  const hipY = -35;
  const footY = 0;

  // 1. HEAD (Circle)
  ctx.fillStyle = opts.headFill || '#0d1322';
  ctx.beginPath();
  ctx.arc(0, headY, headRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Blinking mechanic: every 2.8s, blink for 0.12s
  const isBlink = (t % 2.8) < 0.12;

  // 2. FACIAL EXPRESSIONS
  const expr = opts.expr || 'happy';
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  if (isBlink && expr !== 'sleep') {
    // Blinking closed eyes - -
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-9, headY - 2); ctx.lineTo(-3, headY - 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(3, headY - 2); ctx.lineTo(9, headY - 2); ctx.stroke();
  } else if (expr === 'happy') {
    // Smiling eyes ^ ^
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(-7, headY - 2, 4, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(7, headY - 2, 4, Math.PI, 0); ctx.stroke();
    // Talking mouth or happy smile
    const mouthOpen = opts.talking ? Math.abs(Math.sin(t * 14)) * 6 : 0;
    if (mouthOpen > 1) {
      ctx.fillStyle = '#f87171';
      ctx.beginPath();
      ctx.ellipse(0, headY + 6, 6, mouthOpen, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(0, headY + 5, 8, 0, Math.PI);
      ctx.stroke();
    }
  } else if (expr === 'panic' || expr === 'shock') {
    // Wide open shocked shaking eyes O O
    const eyeShake = Math.sin(t * 30) * 1.5;
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(-7 + eyeShake, headY - 2, 6, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(7 + eyeShake, headY - 2, 6, 0, Math.PI * 2); ctx.stroke();
    // Vibrating screaming mouth
    const mouthWiggle = Math.sin(t * 24) * 2;
    ctx.beginPath(); ctx.arc(0, headY + 8 + mouthWiggle, 7, 0, Math.PI * 2); ctx.stroke();

    // 3 Dynamic flying sweat drops flinging off forehead!
    for (let sw = 0; sw < 3; sw++) {
      const swT = (t * 6 + sw * 0.8) % 2.0;
      const swDist = swT * 30;
      const swX = 14 + swDist * 0.8;
      const swY = headY - 10 + swDist * 0.6;
      const swAlpha = Math.max(0, 1 - swT / 2.0);
      ctx.fillStyle = `rgba(56, 189, 248, ${swAlpha})`;
      ctx.beginPath();
      ctx.arc(swX, swY, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (expr === 'sweat') {
    // Stressed eyebrows and heavy sweat
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-10, headY - 4); ctx.lineTo(-4, headY - 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(4, headY - 2); ctx.lineTo(10, headY - 4); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, headY + 6, 7, 0, Math.PI); ctx.stroke();

    // Blue sweat drops flying off forehead in arc
    for (let sw = 0; sw < 2; sw++) {
      const swT = (t * 5 + sw * 1.2) % 1.5;
      const swX = 16 + swT * 22;
      const swY = headY - 8 + swT * 18;
      const swAlpha = Math.max(0, 1 - swT / 1.5);
      ctx.fillStyle = `rgba(56, 189, 248, ${swAlpha})`;
      ctx.beginPath();
      ctx.arc(swX, swY, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (expr === 'sad') {
    // Sad frown :(
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(-7, headY - 2, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(7, headY - 2, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, headY + 12, 8, Math.PI, 0); ctx.stroke();
  } else if (expr === 'sleep') {
    // Closed peaceful eyes - - and smile
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-10, headY); ctx.lineTo(-4, headY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(4, headY); ctx.lineTo(10, headY); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, headY + 6, 6, 0, Math.PI); ctx.stroke();
  }

  // 3. HARD HAT (For contractor)
  if (opts.hat === 'hardhat') {
    ctx.fillStyle = '#facc15'; // Bright Safety Yellow
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, headY - 14, headRadius + 2, Math.PI, 0);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(-headRadius - 8, headY - 14, (headRadius + 8) * 2, 6, 3);
    ctx.fill();
    ctx.stroke();
  } else if (opts.hat === 'nightcap') {
    // Striped nightcap with swaying pom-pom
    const capSway = Math.sin(t * 3.5) * 6;
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.moveTo(-headRadius, headY - 12);
    ctx.quadraticCurveTo(0, headY - 48, 30 + capSway, headY - 40);
    ctx.lineTo(headRadius, headY - 12);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(32 + capSway, headY - 40, 6, 0, Math.PI * 2); ctx.fill();
  }

  // 4. TORSO (Spine)
  ctx.strokeStyle = color;
  ctx.lineWidth = opts.lineWidth || 4.5;
  ctx.beginPath();
  ctx.moveTo(0, neckY);
  ctx.lineTo(0, hipY);
  ctx.stroke();

  // Safety Vest overlay (Contractor)
  if (opts.vest) {
    ctx.fillStyle = '#a3e635'; // Neon lime
    ctx.fillRect(-10, neckY + 8, 20, hipY - neckY - 14);
    ctx.fillStyle = '#f97316'; // Orange reflective stripe
    ctx.fillRect(-10, neckY + 22, 20, 6);
  }

  // 5. ARMS & LEGS BASED ON POSE (WITH FULL FLUID LOCOMOTION)
  const pose = opts.pose || 'stand';

  if (pose === 'run' || pose === 'sprint') {
    // Full athletic running cycle!
    const runFreq = 16;
    const leg1 = Math.sin(t * runFreq) * 32;
    const leg2 = Math.sin(t * runFreq + Math.PI) * 32;
    const arm1 = Math.sin(t * runFreq + Math.PI) * 28;
    const arm2 = Math.sin(t * runFreq) * 28;

    // Body forward tilt
    ctx.rotate(0.12);

    // Arms pumping
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-arm1, neckY + 30); ctx.lineTo(-arm1 * 1.3, hipY + 10);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(arm2, neckY + 30); ctx.lineTo(arm2 * 1.3, hipY - 10);
    ctx.stroke();

    // Legs sprinting
    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(leg1 * 0.7, hipY + 25); ctx.lineTo(leg1, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(leg2 * 0.7, hipY + 25); ctx.lineTo(leg2, footY);
    ctx.stroke();

    // Dust puffs behind back heel
    const puffCycle = (t * 8) % 1;
    ctx.fillStyle = \`rgba(226, 232, 240, \${1 - puffCycle})\`;
    ctx.beginPath();
    ctx.arc(-24 - puffCycle * 20, footY - puffCycle * 8, 4 + puffCycle * 6, 0, Math.PI * 2);
    ctx.fill();
  } else if (pose === 'walk' || pose === 'pace') {
    // Smooth natural walk cycle
    const walkFreq = 8;
    const leg1 = Math.sin(t * walkFreq) * 20;
    const leg2 = Math.sin(t * walkFreq + Math.PI) * 20;
    const arm1 = Math.sin(t * walkFreq + Math.PI) * 16;
    const arm2 = Math.sin(t * walkFreq) * 16;

    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-arm1, neckY + 30); ctx.lineTo(-arm1 * 1.2, hipY + 10);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(arm2, neckY + 30); ctx.lineTo(arm2 * 1.2, hipY + 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(leg1 * 0.6, hipY + 20); ctx.lineTo(leg1, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(leg2 * 0.6, hipY + 20); ctx.lineTo(leg2, footY);
    ctx.stroke();
  } else if (pose === 'ladder_work') {
    // Contractor balancing on ladder, wrenching with sparks
    const wrenchAnim = Math.sin(t * 10) * 12;
    const balanceTilt = Math.sin(t * 7) * 0.05;
    ctx.rotate(balanceTilt);

    // Left arm holding ladder rail
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12);
    ctx.lineTo(-24, neckY - 10);
    ctx.lineTo(-32, neckY - 35);
    // Right arm cranking wrench
    ctx.moveTo(0, neckY + 12);
    ctx.lineTo(26, neckY - 8 + wrenchAnim);
    ctx.lineTo(44, neckY - 28 + wrenchAnim);
    ctx.stroke();

    // Silver Pipe Wrench
    ctx.save();
    ctx.fillStyle = '#94a3b8';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.fillRect(38, neckY - 42 + wrenchAnim, 10, 24);
    ctx.fillRect(34, neckY - 46 + wrenchAnim, 18, 8);
    // Clank sparks at wrench tip
    if (Math.sin(t * 10) > 0.6) {
      ctx.fillStyle = '#fde047';
      ctx.beginPath(); ctx.arc(43, neckY - 48 + wrenchAnim, 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();

    // Legs shifting on rungs
    const footShift = Math.sin(t * 5) * 3;
    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-18, hipY + 35); ctx.lineTo(-14 + footShift, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(18, hipY + 30); ctx.lineTo(14 - footShift, footY - 12);
    ctx.stroke();
  } else if (pose === 'panic_phone') {
    // One hand on cheek, one hand holding vibrating phone, pacing nervous legs
    const phoneVibe = Math.sin(t * 30) * 3;
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-24 + phoneVibe, neckY); ctx.lineTo(-18 + phoneVibe, headY + 5);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(24, neckY); ctx.lineTo(18, headY + 5);
    ctx.stroke();

    // Vibrating phone in left hand
    ctx.fillStyle = '#38bdf8';
    roundRect(ctx, -28 + phoneVibe, headY - 5, 10, 18, 3, true, false);

    // Legs pacing/trembling
    const paceLeg = Math.sin(t * 12) * 12;
    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-16 + paceLeg, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(16 - paceLeg, footY);
    ctx.stroke();
  } else if (pose === 'laser_pointer') {
    // Aiming laser pointer with subtle tracking motion
    const aimWobble = Math.sin(t * 4) * 6;
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(28, neckY - 12 + aimWobble); ctx.lineTo(50, neckY - 30 + aimWobble);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-18, neckY + 10); ctx.lineTo(-6, hipY);
    ctx.stroke();

    // Laser pointer gadget
    ctx.fillStyle = '#22c55e';
    roundRect(ctx, 46, neckY - 36 + aimWobble, 18, 8, 3, true, false);

    // Excited little victory hop on Earth
    const hop = Math.abs(Math.sin(t * 6)) * 8;
    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-20, footY - hop);
    ctx.moveTo(0, hipY); ctx.lineTo(20, footY - hop);
    ctx.stroke();
  } else if (pose === 'cheer' || pose === 'jump_cheer') {
    // Active cheering and jumping!
    const jump = Math.abs(Math.sin(t * 8)) * 20;
    const wave1 = Math.sin(t * 12) * 14;
    const wave2 = Math.cos(t * 12) * 14;
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-28, neckY - 25); ctx.lineTo(-40 + wave1, neckY - 55);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(28, neckY - 25); ctx.lineTo(40 + wave2, neckY - 55);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-18, footY - jump);
    ctx.moveTo(0, hipY); ctx.lineTo(18, footY - jump);
    ctx.stroke();
  } else if (pose === 'drag_heavy') {
    // Slow sluggish trudging dragging heavy ball and chain
    const step = Math.sin(t * 4) * 12;
    ctx.rotate(-0.15); // hunched over
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-22, neckY + 36); ctx.lineTo(-28, hipY + 15);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(12, neckY + 36); ctx.lineTo(18, hipY + 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-16 + step, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(16 - step, footY);
    ctx.stroke();
  } else if (pose === 'sad_ladder') {
    // Slumped shoulders, head down, heavy sigh
    const sigh = Math.sin(t * 3) * 3;
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-18, neckY + 40 + sigh); ctx.lineTo(-12, hipY + 15);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(18, neckY + 40 + sigh); ctx.lineTo(12, hipY + 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-16, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(16, footY);
    ctx.stroke();
  } else {
    // Default stand with lively idle breathing and weight shift
    const weightShift = Math.sin(t * 4) * 2;
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-22, neckY + 30); ctx.lineTo(-18, hipY + 10);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(22, neckY + 30); ctx.lineTo(18, hipY + 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-18 + weightShift, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(18 - weightShift, footY);
    ctx.stroke();
  }

  ctx.restore();
}

// --- CUTE AVA ROBOT 2.0 (HOVERING, ANIMATED EMOTES, HOLOGRAPHIC STREAM) ---
function drawAvaRobot(ctx, x, y, opts) {
  opts = opts || {};
  const t = opts.t || 0;
  ctx.save();

  // Floating hover engine mechanics!
  const hoverY = Math.sin(t * 5.5) * 12;
  const hoverTilt = Math.sin(t * 4) * 0.04;

  ctx.translate(x, y + hoverY);
  ctx.rotate(hoverTilt);

  const scale = opts.scale || 1.0;
  ctx.scale(scale, scale);

  const headRadius = 24;
  const headY = -120;
  const neckY = -96;
  const hipY = -35;
  const footY = 0;

  // Glowing Cyan Aura
  ctx.save();
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 24;

  // Head: Sleek rounded robot helmet
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  roundRect(ctx, -headRadius - 4, headY - headRadius, (headRadius + 4) * 2, headRadius * 2 + 4, 16, true, true);
  ctx.restore();

  // Dual plasma thruster flames below her feet (ALWAYS FLICKERING)
  const flameH = 16 + Math.sin(t * 26) * 6;
  [-14, 14].forEach(fx => {
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(fx - 6, footY);
    ctx.lineTo(fx + 6, footY);
    ctx.lineTo(fx, footY + flameH);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#c8ff00';
    ctx.beginPath();
    ctx.moveTo(fx - 3, footY);
    ctx.lineTo(fx + 3, footY);
    ctx.lineTo(fx, footY + flameH * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Antenna with pulsing neon star and expanding signal waves
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, headY - headRadius);
  ctx.lineTo(0, headY - headRadius - 16);
  ctx.stroke();

  // Expanding antenna signal wave
  const sigR = (t * 25) % 35;
  const sigA = Math.max(0, 1 - sigR / 35);
  ctx.strokeStyle = \`rgba(56, 189, 248, \${sigA})\`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, headY - headRadius - 18, sigR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#c8ff00';
  ctx.shadowColor = '#c8ff00';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(0, headY - headRadius - 18, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Headset on side of helmet
  ctx.fillStyle = '#a855f7';
  roundRect(ctx, -headRadius - 8, headY - 8, 8, 16, 4, true, false);
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-headRadius - 4, headY);
  ctx.quadraticCurveTo(-12, headY + 18, 6, headY + 14);
  ctx.stroke();
  // Mic tip with pulsing voice soundwave
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath(); ctx.arc(8, headY + 14, 3.5, 0, Math.PI * 2); ctx.fill();

  // Radiating speech soundwave rings from mic
  const micR = (t * 30) % 25;
  const micA = Math.max(0, 1 - micR / 25);
  ctx.strokeStyle = \`rgba(56, 189, 248, \${micA})\`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(8, headY + 14, micR, -0.6, 0.6);
  ctx.stroke();

  // Digital animated face cycling through cute expressions!
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  const emoteCycle = Math.floor(t * 1.5) % 4;
  let emote = '^ ‿ ^';
  if (emoteCycle === 1) emote = '⚡ ‿ ⚡';
  else if (emoteCycle === 2) emote = '◕ ‿ ◕';
  else if (emoteCycle === 3) emote = '^ ‿ ^';
  ctx.fillText(emote, 0, headY + 6);

  // Torso
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, neckY);
  ctx.lineTo(0, hipY);
  ctx.stroke();

  // AVA Heart Badge pulsing
  const badgePulse = 1.0 + Math.sin(t * 8) * 0.08;
  ctx.save();
  ctx.scale(badgePulse, badgePulse);
  ctx.fillStyle = '#a855f7';
  roundRect(ctx, -14, neckY + 12, 28, 20, 6, true, false);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('AVA', 0, neckY + 26);
  ctx.restore();

  // Active Typing & Holographic Display
  const typeMotion = Math.sin(t * 22) * 5;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  // Right arm typing or pointing
  ctx.moveTo(0, neckY + 10);
  ctx.lineTo(24, neckY + 4 + typeMotion);
  ctx.lineTo(16, neckY + 24 + typeMotion);
  // Left arm holding tablet
  ctx.moveTo(0, neckY + 10);
  ctx.lineTo(-24, neckY + 12);
  ctx.lineTo(-12, neckY + 30);
  ctx.stroke();

  // Glowing Tablet in left hand
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 1.5;
  roundRect(ctx, -32, neckY + 22, 34, 22, 4, true, true);

  // Holographic 3D Light Cone projecting upward from tablet!
  ctx.save();
  const holoGrad = ctx.createLinearGradient(0, neckY + 20, 0, neckY - 60);
  holoGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
  holoGrad.addColorStop(1, 'rgba(200, 255, 0, 0)');
  ctx.fillStyle = holoGrad;
  ctx.beginPath();
  ctx.moveTo(-28, neckY + 22);
  ctx.lineTo(0, neckY + 22);
  ctx.lineTo(18, neckY - 50);
  ctx.lineTo(-44, neckY - 50);
  ctx.closePath();
  ctx.fill();

  // Floating data particles rising from tablet
  for (let dp = 0; dp < 3; dp++) {
    const dpT = (t * 3 + dp * 0.7) % 1.5;
    const dpY = neckY + 20 - dpT * 50;
    const dpX = -14 + Math.sin(t * 5 + dp) * 12;
    ctx.fillStyle = '#c8ff00';
    ctx.fillRect(dpX, dpY, 3, 3);
  }
  ctx.restore();

  // Hovering Legs tucked in flight
  ctx.beginPath();
  ctx.moveTo(0, hipY); ctx.lineTo(-14, hipY + 20); ctx.lineTo(-14, footY);
  ctx.moveTo(0, hipY); ctx.lineTo(14, hipY + 20); ctx.lineTo(14, footY);
  ctx.stroke();

  ctx.restore();
}

// --- PROPS & STORY HELPERS WITH DYNAMIC CONTINUOUS PHYSICS ---

// 1. Tall Wooden Trade Ladder (Dynamic Sway)
function drawLadder(ctx, x, y, h, t) {
  ctx.save();
  const sway = Math.sin((t || 0) * 7) * 0.035;
  ctx.translate(x, y + h);
  ctx.rotate(sway);
  ctx.translate(-x, -(y + h));

  ctx.strokeStyle = '#f59e0b'; // Amber wood
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  const w = 48;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2, y + h);
  ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h);

  const numRungs = Math.floor(h / 32);
  for (let i = 1; i < numRungs; i++) {
    const ry = y + i * 32;
    ctx.moveTo(x - w / 2, ry);
    ctx.lineTo(x + w / 2, ry);
  }
  ctx.stroke();
  ctx.restore();
}

// 2. Leaky Pipe with Active Rapid Water Droplets & Real Splash Physics
function drawLeakyPipe(ctx, x, y, t) {
  ctx.save();
  // Pipe vibration under pressure
  const vibe = Math.sin(t * 26) * 2;
  ctx.fillStyle = '#475569';
  ctx.fillRect(x - 80 + vibe, y, 160, 18);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(x - 12 + vibe, y - 4, 24, 26);

  const floorY = y + 210;

  // 2 Alternating Falling Water Droplets
  for (let d = 0; d < 2; d++) {
    const dropCycle = ((t * 2.8 + d * 0.5) % 1.0);
    const dropY = y + 26 + dropCycle * (floorY - (y + 26));
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(x + vibe, dropY, 5, 0, Math.PI * 2);
    ctx.fill();

    // High impact splash when droplet hits floor!
    if (dropCycle > 0.85) {
      const splashProgress = (dropCycle - 0.85) / 0.15;
      const splashR = splashProgress * 22;
      const splashAlpha = 1 - splashProgress;
      ctx.strokeStyle = \`rgba(56, 189, 248, \${splashAlpha})\`;
      ctx.lineWidth = 2;
      for (let a = 0; a < 5; a++) {
        const ang = (Math.PI / 6) * a + Math.PI;
        const spX = x + Math.cos(ang) * splashR;
        const spY = floorY + Math.sin(ang) * splashR * 0.5;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(spX, spY, 2.5, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  // Sloshing water puddle with animated undulating ripples on floor
  const puddleW = 54 + Math.sin(t * 6) * 6;
  ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.beginPath();
  ctx.ellipse(x, floorY, puddleW, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Expanding ripple rings
  const ripR = (t * 35) % 50 + 10;
  const ripAlpha = Math.max(0, 1 - ripR / 60);
  ctx.strokeStyle = \`rgba(56, 189, 248, \${ripAlpha})\`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(x, floorY, ripR * 1.4, ripR * 0.4, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// 3. Flying Money Bag with Dynamic Swoop, Wing Flaps & Flying Dollar Particles
function drawFlyingMoneyBag(ctx, x, y, t, amount) {
  ctx.save();
  // Dynamic swoop motion
  const swoopY = Math.sin(t * 8) * 14;
  ctx.translate(x, y + swoopY);

  const flap = Math.sin(t * 22) * 0.5;

  // Trail of floating mini dollar signs $ drifting behind!
  for (let dt = 1; dt <= 3; dt++) {
    const trailT = (t * 4 + dt * 0.4) % 1.2;
    const trX = -35 - trailT * 50;
    const trY = Math.sin(t * 6 + dt) * 18 + trailT * 15;
    const trAlpha = Math.max(0, 1 - trailT / 1.2);
    ctx.fillStyle = \`rgba(34, 197, 94, \${trAlpha})\`;
    ctx.font = 'bold 12px "Space Grotesk", sans-serif';
    ctx.fillText('$', trX, trY);
  }

  // Wings flapping vigorously
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  // Left Wing
  ctx.save();
  ctx.rotate(flap);
  ctx.beginPath(); ctx.ellipse(-26, -10, 22, 9, -0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
  // Right Wing
  ctx.save();
  ctx.rotate(-flap);
  ctx.beginPath(); ctx.ellipse(26, -10, 22, 9, 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();

  // Green Money Bag with squash-and-stretch
  const bagSquash = 1.0 + Math.sin(t * 12) * 0.06;
  ctx.scale(1 / bagSquash, bagSquash);
  ctx.fillStyle = '#22c55e';
  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 8, 22, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Tie top
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(-8, -18, 16, 8);

  // Dollar amount label
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(amount || '$8,000', 0, 12);

  ctx.restore();
}

// 4. Cartoon Trade Work Van with Suspension Bounce, Spinning Spokes & Continuous Smoke
function drawWorkVan(ctx, x, y, t) {
  ctx.save();
  // Suspension bounce
  const bounceY = Math.sin(t * 22) * 3.5;
  ctx.translate(x, y + bounceY);

  // Van Body
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  roundRect(ctx, -80, -45, 160, 45, 10, true, true);

  // Cab Front
  ctx.fillStyle = '#38bdf8';
  roundRect(ctx, 40, -40, 35, 24, 6, true, false);

  // Ladder on Roof (vibrating)
  drawLadder(ctx, 0, -62, 22, t);

  // VantorX Dispatch logo on side
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ VantorX DISPATCH', -10, -20);

  // Spinning Wheels with motion blur
  const wheelSpin = t * 28;
  [-45, 45].forEach(wx => {
    ctx.save();
    ctx.translate(wx, 5);
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
    ctx.rotate(wheelSpin);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-7, 0); ctx.lineTo(7, 0); ctx.moveTo(0, -7); ctx.lineTo(0, 7); ctx.stroke();
    ctx.restore();
  });

  // Exhaust Smoke Puffs (3 continuous billows)
  for (let s = 0; s < 3; s++) {
    const puffCycle = ((t * 50 + s * 25) % 75);
    const puffAlpha = Math.max(0, 1 - puffCycle / 75);
    ctx.fillStyle = \`rgba(203, 213, 225, \${puffAlpha * 0.7})\`;
    ctx.beginPath();
    ctx.arc(-95 - puffCycle * 1.1, -5 - puffCycle * 0.4, 8 + puffCycle * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// 5. Contractor Sleeping in Bed with Deep Breathing Snore & Dream Cloud
function drawBedWithContractor(ctx, x, y, t) {
  ctx.save();
  // Bed deep breathing rhythm
  const snoreBreath = Math.sin(t * 3.5) * 4;
  ctx.translate(x, y);

  // Bed Frame
  ctx.fillStyle = '#92400e';
  roundRect(ctx, -90, -70, 18, 70, 4, true, false);
  ctx.fillStyle = '#78350f';
  roundRect(ctx, 75, -40, 14, 40, 4, true, false);

  // Mattress & Blanket (heaving with snore breath)
  ctx.fillStyle = '#1e3a8a';
  roundRect(ctx, -75, -35 + snoreBreath * 0.5, 150, 35 - snoreBreath * 0.5, 8, true, false);

  // Pillow
  ctx.fillStyle = '#f8fafc';
  roundRect(ctx, -68, -48, 36, 18, 8, true, false);

  // Contractor Head sleeping peacefully
  drawStickPerson(ctx, -50, -32 + snoreBreath * 0.3, {
    scale: 0.85,
    expr: 'sleep',
    hat: 'nightcap',
    t: t
  });

  // Floating Animated Z z z bubbles (rising in zigzag)
  for (let z = 0; z < 3; z++) {
    const zT = (t * 1.2 + z * 0.8) % 2.5;
    const zY = -60 - zT * 35;
    const zX = -40 + Math.sin(t * 4 + z) * 14 + zT * 12;
    const zAlpha = Math.max(0, 1 - zT / 2.5);
    ctx.fillStyle = \`rgba(147, 197, 253, \${zAlpha})\`;
    ctx.font = \`bold \${14 + z * 5}px "JetBrains Mono", monospace\`;
    ctx.textAlign = 'center';
    ctx.fillText('Z', zX, zY);
  }

  ctx.restore();
}

// 6. Speech Bubble with Comic Pop-in & Floating Hover
function drawSpeechBubble(ctx, x, y, text, opts) {
  opts = opts || {};
  const t = opts.t || 0;
  ctx.save();
  const floatY = Math.sin(t * 6) * 3;
  ctx.translate(0, floatY);

  ctx.font = opts.font || 'bold 14px "Space Grotesk", sans-serif';
  const textW = ctx.measureText(text).width;
  const bubbleW = textW + 32;
  const bubbleH = 42;
  const bx = x - bubbleW / 2;
  const by = y - bubbleH;

  // Bubble Box
  ctx.fillStyle = opts.bg || '#ffffff';
  ctx.strokeStyle = opts.border || '#38bdf8';
  ctx.lineWidth = 2;
  ctx.shadowColor = opts.shadow || 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 10;
  roundRect(ctx, bx, by, bubbleW, bubbleH, 14, true, true);
  ctx.shadowBlur = 0;

  // Pointer tail
  ctx.fillStyle = opts.bg || '#ffffff';
  ctx.beginPath();
  ctx.moveTo(x - 8, by + bubbleH);
  ctx.lineTo(x, by + bubbleH + 10);
  ctx.lineTo(x + 8, by + bubbleH);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Text inside bubble
  ctx.fillStyle = opts.textColor || '#0f172a';
  ctx.textAlign = 'center';
  ctx.fillText(text, x, by + 26);
  ctx.restore();
}

// 7. Dynamic Story Pill at top of screen
function renderStoryPill(badge, text) {
  ctx.save();
  const pillW = 420;
  const pillH = 42;
  const pillX = (W - pillW) / 2;
  const pillY = 46;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, pillX, pillY, pillW, pillH, 21, true, true);

  ctx.font = 'bold 13px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(badge + ' · ' + text, W / 2, pillY + 26);
  ctx.restore();
}
`;

// Replace from line 3004 to line 3638
const startMarkerA = '// 🎨 IMMERSIVE STICK FIGURE STORY ANIMATION ENGINE';
const endMarkerA = 'function renderFrame(time) {';

const idxA = html.indexOf(startMarkerA);
const idxB = html.indexOf(endMarkerA);

if (idxA === -1 || idxB === -1) {
  console.error('ERROR: Could not find markers for Section A!', { idxA, idxB });
  process.exit(1);
}

html = html.slice(0, idxA) + upgradedEngineCode + '\n' + html.slice(idxB);
console.log('✓ Section A (Stick Figure Engine & Living Props) successfully injected.');

// =========================================================================
// SECTION B: RENDERFRAME WITH CONTINUOUS CAMERA DRIFT & 124 BPM BEAT ZOOM
// =========================================================================
const upgradedRenderFrame = `function renderFrame(time) {
  window.renderFrame = renderFrame;

  if (!Number.isFinite(time) || isNaN(time) || time < 0) {
    time = 0;
  }
  time = Math.min(time, TOTAL_DURATION || 63);

  ctx.save();
  ctx.clearRect(0, 0, W, H);

  // Apply 124 BPM Heartbeat Zoom & Continuous Smooth Cinematic Camera Drift
  // Guarantees that literally EVERY SINGLE PIXEL on screen has continuous motion!
  const beat = (time * 124 / 60) * Math.PI * 2;
  const breatheZoom = 1.0 + 0.012 * Math.sin(beat);
  const driftX = Math.sin(time * 0.8) * 6;
  const driftY = Math.cos(time * 0.6) * 4;

  ctx.translate(W / 2 + driftX, H / 2 + driftY);
  ctx.scale(breatheZoom, breatheZoom);
  ctx.translate(-W / 2, -H / 2);

  // Apply Camera Shake if active
  const shake = getCameraShake(time);
  ctx.translate(shake.x, shake.y);

  renderDynamicAtmosphere(time);

  // STUDIO HERO POSTER CARD ON PAUSE / INITIAL LOAD (t === 0)
  if (!isPlaying && time === 0) {
    renderStudioHeroPosterCard();
    ctx.restore();
    return;
  }

  // SFX Triggers calibrated to exact story moments
  if (isPlaying && !document.hidden) {
    if (time >= 0.3 && !playedSfxMap['laser']) { playSfx('laser'); playedSfxMap['laser'] = true; }
    if (time >= 13.2 && !playedSfxMap['drip']) { playSfx('water_drip'); playedSfxMap['drip'] = true; }
    if (time >= 15.0 && !playedSfxMap['phone1']) { playSfx('phone_ring'); playedSfxMap['phone1'] = true; }
    if (time >= 25.2 && !playedSfxMap['phone2']) { playSfx('phone_ring'); playedSfxMap['phone2'] = true; }
    if (time >= 28.5 && !playedSfxMap['whoosh']) { playSfx('whoosh'); playedSfxMap['whoosh'] = true; }
    if (time >= 33.0 && !playedSfxMap['ava']) { playSfx('ava_chime'); playedSfxMap['ava'] = true; }
    if (time >= 41.5 && !playedSfxMap['van']) { playSfx('van_zoom'); playedSfxMap['van'] = true; }
    if (time >= 48.0 && !playedSfxMap['chaching']) { playSfx('chaching'); playedSfxMap['chaching'] = true; }
  }

  // Continuous Dynamic Scene Progression
  if (time < 7.2) {
    renderTasklessScene1_NightPhone(time);
  } else if (time < 12.8) {
    renderTasklessScene2_LasersUranus(time);
  } else if (time < 18.2) {
    renderTasklessScene3_CustomerWindow(time);
  } else if (time < 24.8) {
    renderTasklessScene4_Stat78Percent(time);
  } else if (time < 32.2) {
    renderTasklessScene5_TwoShopsComparison(time);
  } else if (time < 39.2) {
    renderTasklessScene6_ShopB_AvaReply(time);
  } else if (time < 47.2) {
    renderTasklessScene7_WorkflowNodes(time);
  } else if (time < 53.0) {
    renderTasklessScene8_TechDispatchAndDashboard(time);
  } else if (time < 58.5) {
    renderTasklessScene9_LiveDemoDialer(time);
  } else {
    renderTasklessScene10_TryTasklessCTA(time);
  }

  // Kinetic Subtitles
  renderKineticSubtitles(time);

  // Subtle Cinematic Vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.75);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  ctx.restore();
}`;

const startMarkerFrame = 'function renderFrame(time) {';
const endMarkerFrame = '// Helper: 3D Warp Starfield';

const idxF1 = html.indexOf(startMarkerFrame);
const idxF2 = html.indexOf(endMarkerFrame);

if (idxF1 === -1 || idxF2 === -1) {
  console.error('ERROR: Could not find markers for renderFrame!', { idxF1, idxF2 });
  process.exit(1);
}

html = html.slice(0, idxF1) + upgradedRenderFrame + '\n\n' + html.slice(idxF2);
console.log('✓ Section B (renderFrame camera pulse & continuous drift) successfully injected.');

// =========================================================================
// SECTION C: ALL 10 STORY SCENES WITH CONTINUOUS HIGH-ENERGY KINETIC MOTION
// =========================================================================
const upgradedScenesCode = `// =========================================================================
// 🎬 10 NARRATION-MATCHED STICK FIGURE STORY SCENES (CONTINUOUS KINETIC ACTION)
// Zero still frames: continuous locomotion, particle bursts, physics, and animations
// =========================================================================

// --- SCENE 1: THE LASER SPEED HOOK (0.0s - 7.2s) ---
// Voiceover: "A single beam of laser light travels at 186,000 miles per second."
function renderTasklessScene1_NightPhone(t) {
  renderStoryPill('⚡ ACT 1: THE SPEED HOOK', '186,000 MILES PER SECOND');

  // Ground: Cartoon planet Earth curve at bottom with continuous rotation!
  ctx.save();
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(W / 2, H + 460, 700, 0, Math.PI * 2);
  ctx.fill();

  // Continents smoothly moving across horizon
  const earthShift = (t * 18) % 360;
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.ellipse(W / 2 - 120 + earthShift, H - 130, 90, 42, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(W / 2 + 140 + earthShift, H - 120, 80, 36, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(W / 2 - 380 + earthShift, H - 125, 95, 40, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Stick figure sprints in from left edge (t < 0.9s), then whips out laser pointer!
  const sprintIn = Math.min(1, t / 0.9);
  const charX = -60 + (W / 2 - 20) * sprintIn;
  const charY = H - 180;
  const isRunning = t < 0.9;

  drawStickPerson(ctx, charX, charY, {
    scale: 1.15,
    facing: 1,
    expr: 'happy',
    pose: isRunning ? 'run' : 'laser_pointer',
    color: '#ffffff',
    talking: t >= 1.0,
    t: t
  });

  // Skidding dust puffs when stopping at t ≈ 0.9s
  if (t >= 0.8 && t <= 1.4) {
    const skidT = (t - 0.8) / 0.6;
    ctx.fillStyle = \`rgba(226, 232, 240, \${1 - skidT})\`;
    ctx.beginPath(); ctx.arc(charX - 25, charY, 6 + skidT * 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(charX - 45, charY, 4 + skidT * 8, 0, Math.PI * 2); ctx.fill();
  }

  // Neon Green Laser Beam with traveling energy pulses and muzzle flare!
  if (t >= 0.9) {
    const beamStartX = charX + 54;
    const beamStartY = charY - 146;
    const beamProgress = Math.min(1, (t - 0.9) / 0.8);
    const beamEndX = beamStartX + (W + 200) * beamProgress;
    const beamEndY = beamStartY - 480 * beamProgress;

    ctx.save();
    // Glowing laser beam
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 28;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 6 + Math.sin(t * 30) * 1.5;
    ctx.beginPath();
    ctx.moveTo(beamStartX, beamStartY);
    ctx.lineTo(beamEndX, beamEndY);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(beamStartX, beamStartY);
    ctx.lineTo(beamEndX, beamEndY);
    ctx.stroke();

    // Muzzle Flare spark at pointer tip
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(beamStartX, beamStartY, 8 + Math.sin(t * 40) * 3, 0, Math.PI * 2);
    ctx.fill();

    // Traveling photon pulses along the beam
    const beamLen = Math.hypot(beamEndX - beamStartX, beamEndY - beamStartY);
    const pulseCount = 4;
    for (let p = 0; p < pulseCount; p++) {
      const pulseT = ((t * 3.5 + p / pulseCount) % 1.0);
      const px = beamStartX + (beamEndX - beamStartX) * pulseT;
      const py = beamStartY + (beamEndY - beamStartY) * pulseT;
      ctx.fillStyle = '#c8ff00';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Big Bold Comic Headline Card with floating hover and animated odometer
  ctx.save();
  const floatCard = Math.sin(t * 4) * 4;
  const cardW = 420;
  const cardH = 110;
  const cardX = (W - cardW) / 2;
  const cardY = 110 + floatCard;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(34, 197, 94, 0.4)';
  ctx.shadowBlur = 20;
  roundRect(ctx, cardX, cardY, cardW, cardH, 16, true, true);
  ctx.shadowBlur = 0;

  // Rolling counter up to 186,000
  const counterVal = Math.min(186000, Math.floor(t * 186000 / 2.0));
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 46px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(counterVal.toLocaleString(), W / 2, cardY + 54);

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText('⚡ MILES PER SECOND ⚡', W / 2, cardY + 86);
  ctx.restore();
}

// --- SCENE 2: MOON IN 1.3s & DEEP SPACE (7.3s - 12.8s) ---
// Voiceover: "It can reach the moon in under three seconds, and cross nearly two billion miles of space in under three hours."
function renderTasklessScene2_LasersUranus(t) {
  renderStoryPill('🔭 ACT 1: INTERPLANETARY SPEED', 'EARTH TO MOON IN 1.3s');

  // Cute Cartoon Moon on Top Right with bouncing laugh, blinking eyes & blushing cheeks!
  const moonBounce = Math.sin(t * 6) * 8;
  const moonX = W - 125;
  const moonY = 240 + moonBounce;
  const moonR = 64;

  ctx.save();
  // Moon glow
  ctx.fillStyle = '#f8fafc';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
  ctx.shadowBlur = 28;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Craters
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath(); ctx.arc(moonX - 22, moonY - 14, 13, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(moonX + 18, moonY + 20, 15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(moonX + 9, moonY - 24, 9, 0, Math.PI * 2); ctx.fill();

  // Cute Blinking Happy Face
  const isBlink = (t % 2.5) < 0.12;
  ctx.fillStyle = '#1e293b';
  if (isBlink) {
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(moonX - 16, moonY); ctx.lineTo(moonX - 4, moonY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(moonX + 6, moonY); ctx.lineTo(moonX + 18, moonY); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.arc(moonX - 10, moonY, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(moonX + 12, moonY, 4.5, 0, Math.PI * 2); ctx.fill();
  }
  // Laughing smile
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(moonX + 1, moonY + 12, 10, 0, Math.PI); ctx.stroke();

  // Pink Blushing Cheeks
  ctx.fillStyle = 'rgba(244, 114, 182, 0.6)';
  ctx.beginPath(); ctx.arc(moonX - 18, moonY + 10, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(moonX + 20, moonY + 10, 6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Passing Cartoon Comet / Shooting Star streaking through space!
  const cometX = ((t * 300) % (W + 300)) - 100;
  const cometY = 160 + Math.sin(t * 2) * 40;
  ctx.save();
  const cometGrad = ctx.createLinearGradient(cometX - 80, cometY + 20, cometX, cometY);
  cometGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
  cometGrad.addColorStop(1, 'rgba(200, 255, 0, 0.8)');
  ctx.strokeStyle = cometGrad;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cometX - 80, cometY + 20);
  ctx.lineTo(cometX, cometY);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(cometX, cometY, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Distant Saturn with spinning tilted rings
  ctx.save();
  const satX = 90; const satY = 380 + Math.sin(t * 3) * 6;
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath(); ctx.arc(satX, satY, 24, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(satX, satY, 44 + Math.sin(t * 4) * 2, 9, -0.3, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  // Pulsing Laser beam zooming to Moon with traveling energy packets
  ctx.save();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 5 + Math.sin(t * 24) * 1.5;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.moveTo(80, H - 200);
  ctx.lineTo(moonX - 45, moonY + 25);
  ctx.stroke();

  // Sparks at Moon impact point!
  const sparkR = 12 + Math.sin(t * 30) * 8;
  ctx.fillStyle = '#c8ff00';
  ctx.beginPath();
  ctx.arc(moonX - 45, moonY + 25, sparkR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Speech bubble tag: ⏱️ 1.3 SECONDS! (Bouncing)
  drawSpeechBubble(ctx, moonX - 45, moonY - 45, '⏱️ 1.3 SECONDS!', {
    bg: '#ffffff',
    border: '#22c55e',
    textColor: '#15803d',
    t: t
  });

  // Story Card with counting timer
  const cardW = 420; const cardH = 100;
  const cardX = (W - cardW) / 2;
  const cardY = 100 + Math.sin(t * 3) * 3;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  roundRect(ctx, cardX, cardY, cardW, cardH, 16, true, true);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('2 BILLION MILES', W / 2, cardY + 40);

  ctx.fillStyle = '#c8ff00';
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillText('IN UNDER 3.0 HOURS FLAT', W / 2, cardY + 72);
  ctx.restore();
}

// --- SCENE 3: THE LEAKY PIPE & 4-HOUR DELAY (12.9s - 18.2s) ---
// Voiceover: "Yet that interplanetary space trip is STILL faster than the average contractor calls back an emergency lead."
function renderTasklessScene3_CustomerWindow(t) {
  renderStoryPill('💧 ACT 2: THE HOMEOWNER EMERGENCY', 'WATER LEAKING EVERYWHERE');

  const roomY = 220;

  // Active leaky pipe with rapid drops & splash physics
  drawLeakyPipe(ctx, W / 2 - 30, roomY + 20, t);

  // Homeowner is PACING frantically back and forth across the room!
  const paceX = Math.sin(t * 4.5) * 65;
  const homeX = W / 2 + 50 + paceX;
  const homeY = roomY + 230;
  const homeFacing = paceX >= 0 ? 1 : -1;

  drawStickPerson(ctx, homeX, homeY, {
    scale: 1.1,
    facing: homeFacing,
    expr: 'panic',
    pose: 'panic_phone',
    color: '#ffffff',
    talking: true,
    t: t
  });

  // Floating Panic Speech Bubble
  drawSpeechBubble(ctx, homeX - 30 * homeFacing, homeY - 145, 'HELP! CEILING LEAKING! 😱', {
    bg: '#ffffff',
    border: '#ef4444',
    textColor: '#b91c1c',
    t: t
  });

  // Wall Clock with spinning hands AND swinging pendulum!
  const clockX = 90; const clockY = roomY + 70;
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(clockX, clockY, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Spinning clock hands
  const handAngle = t * 14;
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.cos(handAngle) * 18, clockY + Math.sin(handAngle) * 18);
  ctx.stroke();

  // Swinging Pendulum below clock
  const pendAngle = Math.sin(t * 6) * 0.4;
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY + 30);
  ctx.lineTo(clockX + Math.sin(pendAngle) * 35, clockY + 30 + Math.cos(pendAngle) * 35);
  ctx.stroke();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(clockX + Math.sin(pendAngle) * 35, clockY + 30 + Math.cos(pendAngle) * 35, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Harsh Truth Banner Card pulsing red
  const cardW = 440; const cardH = 120;
  const cardX = (W - cardW) / 2;
  const cardY = H - 280 + Math.sin(t * 3) * 3;
  ctx.save();
  const alertPulse = 0.15 + 0.1 * Math.sin(t * 8);
  ctx.fillStyle = \`rgba(239, 68, 68, \${alertPulse})\`;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  roundRect(ctx, cardX, cardY, cardW, cardH, 16, true, true);

  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('AVERAGE CONTRACTOR CALLBACK TIME:', W / 2, cardY + 36);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 32px "Space Grotesk", sans-serif';
  ctx.fillText('4.2 HOURS (OR NEVER)', W / 2, cardY + 76);

  ctx.fillStyle = '#fca5a5';
  ctx.font = '500 12px -apple-system, sans-serif';
  ctx.fillText('Space travel is literally faster than returning a lead.', W / 2, cardY + 102);
  ctx.restore();
}

// --- SCENE 4: THE 78% RACE TRACK (18.5s - 24.8s) ---
// Voiceover: "78% of homeowners hire the first business that answers the phone."
function renderTasklessScene4_Stat78Percent(t) {
  renderStoryPill('⚡ ACT 3: THE SPEED-TO-LEAD LAW', 'FIRST TO ANSWER WINS');

  // Big Bold Comic 78% Card with dancing electric arcs!
  const cardW = 440;
  const cardH = 240;
  const cardX = (W - cardW) / 2;
  const cardY = 110 + Math.sin(t * 4) * 4;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(200, 255, 0, 0.4)';
  ctx.shadowBlur = 28;
  roundRect(ctx, cardX, cardY, cardW, cardH, 20, true, true);
  ctx.shadowBlur = 0;

  // Dancing Electric Arcs on Card corners
  for (let e = 0; e < 3; e++) {
    const arcX = cardX + Math.random() * cardW;
    ctx.strokeStyle = '#c8ff00';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(arcX, cardY);
    ctx.lineTo(arcX + (Math.random() - 0.5) * 20, cardY - 10);
    ctx.stroke();
  }

  ctx.fillStyle = '#c8ff00';
  ctx.font = '900 86px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('78%', W / 2, cardY + 98);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 22px "Space Grotesk", sans-serif';
  ctx.fillText('OF HOMEOWNERS HIRE', W / 2, cardY + 148);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 18px "Space Grotesk", sans-serif';
  ctx.fillText('THE 1ST CONTRACTOR WHO ANSWERS', W / 2, cardY + 178);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.fillText('They do NOT wait for your voicemail.', W / 2, cardY + 212);
  ctx.restore();

  // ACTIVE RACE TRACK ACTION AT BOTTOM:
  const gy = H - 200;

  // Contractor 1 (Green Winner) SPRINTS across the screen tear through the finish line!
  const run1Progress = Math.min(1, (t - 18.5) / 5.5);
  const g1X = 60 + run1Progress * 320;

  drawStickPerson(ctx, g1X, gy, {
    scale: 1.05,
    facing: 1,
    expr: 'happy',
    pose: 'run',
    color: '#22c55e',
    t: t
  });
  drawSpeechBubble(ctx, g1X, gy - 140, 'HIRED! 🏆', { bg: '#22c55e', border: '#ffffff', textColor: '#ffffff', t: t });

  // Finish Line Ribbon fluttering at x = 380
  ctx.save();
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(380, gy - 150);
  ctx.lineTo(380, gy);
  ctx.stroke();
  // Fluttering banner
  const flutter = Math.sin(t * 14) * 8;
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(380, gy - 140);
  ctx.lineTo(430 + flutter, gy - 125);
  ctx.lineTo(380, gy - 110);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Contractor 2 (Slow Sluggish) dragging heavy ball & chain labeled VOICEMAIL
  const g2X = 80 + Math.min(120, run1Progress * 100);
  drawStickPerson(ctx, g2X, gy, {
    scale: 0.95,
    facing: 1,
    expr: 'sad',
    pose: 'drag_heavy',
    color: '#94a3b8',
    t: t
  });

  // Heavy Iron Ball & Chain
  ctx.save();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(g2X - 10, gy);
  ctx.lineTo(g2X - 45, gy);
  ctx.stroke();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.arc(g2X - 55, gy - 8, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 9px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('VOICEMAIL', g2X - 55, gy - 26);
  ctx.restore();
}

// --- SCENE 5: CONTRACTOR ON LADDER & FLYING $8,000 (24.9s - 32.2s) ---
// Voiceover: "When you're on a ladder or eating dinner with family, every unanswered call is an $8,000 job handed to your competitor."
function renderTasklessScene5_TwoShopsComparison(t) {
  renderStoryPill('🪜 ACT 3: THE LADDER DILEMMA', 'MISSED CALL = -$8,000');

  const p = Math.min(1, Math.max(0, (t - 24.9) / 7.3));

  // Tall Ladder in Center-Left with weight sway
  const ladX = 140;
  const ladY = 220;
  const ladH = 340;
  drawLadder(ctx, ladX, ladY, ladH, t);

  // Hardworking Contractor balancing on the ladder with wrenching & sparks
  const conY = ladY + 80;
  drawStickPerson(ctx, ladX, conY, {
    scale: 1.05,
    facing: 1,
    expr: 'sweat',
    hat: 'hardhat',
    vest: true,
    pose: 'ladder_work',
    t: t
  });

  // AC Condenser Unit on roof vibrating next to him
  const acVibe = Math.sin(t * 30) * 1.5;
  ctx.fillStyle = '#334155';
  ctx.fillRect(ladX + 45 + acVibe, ladY + 30, 70, 80);
  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.arc(ladX + 80 + acVibe, ladY + 70, 24, 0, Math.PI * 2); ctx.fill();

  // His smartphone jumping and bouncing on the floor below with vibration rings!
  const phoneX = ladX - 60;
  const phoneY = ladY + ladH;
  const hopY = Math.abs(Math.sin(t * 18)) * 14;
  const phoneRot = Math.sin(t * 24) * 0.2;

  ctx.save();
  ctx.translate(phoneX, phoneY - hopY);
  ctx.rotate(phoneRot);
  ctx.fillStyle = '#ef4444';
  roundRect(ctx, -11, -19, 22, 38, 5, true, false);

  // Radiating soundwave rings
  const ringR = (t * 40) % 50;
  const ringA = Math.max(0, 1 - ringR / 50);
  ctx.strokeStyle = \`rgba(239, 68, 68, \${ringA})\`;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, ringR, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  // Big Vibrating Call Bubble: "RING RING! 📞"
  drawSpeechBubble(ctx, phoneX - 10, phoneY - 50, 'RING! (( 📞 ))', {
    bg: '#ef4444',
    border: '#ffffff',
    textColor: '#ffffff',
    t: t
  });

  // Flying Money Bag ($8,000) swooping across screen with flapping wings & dollar particles!
  const flyStartX = ladX + 30;
  const flyTargetX = W - 100;
  const curFlyX = flyStartX + (flyTargetX - flyStartX) * Math.min(1, p * 1.4);
  const curFlyY = ladY + 50 + Math.sin(t * 7) * 25;

  drawFlyingMoneyBag(ctx, curFlyX, curFlyY, t, '$8,000');

  // Competitor stick figure jumping with outstretched arms / butterfly net to catch the money!
  const compX = W - 90;
  const compY = ladY + ladH;
  drawStickPerson(ctx, compX, compY, {
    scale: 1.0,
    facing: -1,
    expr: 'happy',
    pose: 'jump_cheer',
    color: '#22c55e',
    t: t
  });
  drawSpeechBubble(ctx, compX, compY - 140, 'Thanks! 🤑', { bg: '#22c55e', border: '#ffffff', textColor: '#ffffff', t: t });

  // Sad Contractor thought bubble
  drawSpeechBubble(ctx, ladX, conY - 150, "I can't reach it! 😭", {
    bg: '#ffffff',
    border: '#ef4444',
    textColor: '#b91c1c',
    t: t
  });
}

// --- SCENE 6: ENTER AVA THE ROBOT (32.5s - 39.2s) ---
// Voiceover: "That's why we built Ava. She answers your shop's phone in 0.8 seconds and qualifies the caller."
function renderTasklessScene6_ShopB_AvaReply(t) {
  renderStoryPill('🤖 ACT 4: MEET AVA VOICE AI', 'ANSWERS IN 0.8 SECONDS');

  // Big Speed Badge at top with counting timer: 0.8 SECONDS
  const badgeW = 380;
  const badgeH = 80;
  const badgeX = (W - badgeW) / 2;
  const badgeY = 110 + Math.sin(t * 4) * 3;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 2;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 16, true, true);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SPEED TO LEAD BENCHMARK:', W / 2, badgeY + 28);

  ctx.fillStyle = '#c8ff00';
  ctx.font = '900 32px "Space Grotesk", sans-serif';
  ctx.fillText('ANSWERS IN 0.8s ⚡', W / 2, badgeY + 62);
  ctx.restore();

  // Ava the friendly robot placed in the center with continuous hover & holographic stream!
  const avaX = W / 2;
  const avaY = 440;
  drawAvaRobot(ctx, avaX, avaY, {
    scale: 1.3,
    t: t
  });

  // Speech Bubble from Ava: "Hi! VantorX Dispatch!"
  drawSpeechBubble(ctx, avaX, avaY - 180, '⚡ "Hi! How can we help?" 📞', {
    bg: '#ffffff',
    border: '#38bdf8',
    textColor: '#0284c7',
    t: t
  });

  // Checklist below Ava with animated spring bounces
  const checkY = H - 260;
  const checkW = 440;
  const checkX = (W - checkW) / 2;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, checkX, checkY, checkW, 110, 14, true, true);

  ctx.font = 'bold 13.5px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#22c55e';
  ctx.fillText('✓ Answers in 0.8s · Never misses a ring', checkX + 24, checkY + 34);
  ctx.fillText('✓ Qualifies emergency leak & customer address', checkX + 24, checkY + 64);
  ctx.fillText('✓ Books calendar slot directly into your CRM', checkX + 24, checkY + 94);
  ctx.restore();
}

// --- SCENE 7: AUTO DISPATCH WORK VAN PARALLAX (39.3s - 47.2s) ---
// Voiceover: "She checks your schedule and dispatches the job to your technician's phone before the customer can open another Google tab."
function renderTasklessScene7_WorkflowNodes(t) {
  renderStoryPill('📲 ACT 4: INSTANT DISPATCH', 'TECH DISPATCHED IN 6 SECONDS');

  const p = Math.min(1, Math.max(0, (t - 39.3) / 7.9));

  // Calendar Card at top
  const calW = 380;
  const calH = 76;
  const calX = (W - calW) / 2;
  const calY = 110 + Math.sin(t * 4) * 3;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  roundRect(ctx, calX, calY, calW, calH, 14, true, true);

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('📅 SCHEDULE AUTO-BOOKED', W / 2, calY + 30);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px "Space Grotesk", sans-serif';
  ctx.fillText('Tomorrow 8:00 AM Locked ✓', W / 2, calY + 56);
  ctx.restore();

  // HIGH-SPEED SIDE-SCROLLING PARALLAX ROAD & SKYLINE!
  const vanY = 480;

  // Background building silhouettes scrolling left at 80 px/s
  const bldgShift = (t * 80) % 240;
  ctx.fillStyle = '#0f172a';
  for (let b = -1; b < 4; b++) {
    const bx = b * 240 - bldgShift;
    ctx.fillRect(bx, vanY - 140, 90, 140);
    ctx.fillRect(bx + 110, vanY - 90, 70, 90);
    ctx.fillRect(bx + 190, vanY - 120, 45, 120);
  }

  // Asphalt Road surface
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, vanY + 12, W, 70);

  // White Dashed Road Stripes rushing past at 500 px/s!
  const stripeShift = (t * 500) % 90;
  ctx.fillStyle = '#facc15';
  for (let s = -1; s < 8; s++) {
    ctx.fillRect(s * 90 - stripeShift, vanY + 42, 45, 8);
  }

  // Work Van driving across screen with animated bounce & exhaust billows!
  const vanStartX = -100;
  const vanEndX = W + 120;
  const vanX = vanStartX + (vanEndX - vanStartX) * Math.min(1, p * 1.3);

  drawWorkVan(ctx, vanX, vanY, t);

  // Speed bubble above van: "ON MY WAY! 🚗💨"
  drawSpeechBubble(ctx, vanX, vanY - 72, 'ON MY WAY! 🚗💨', {
    bg: '#38bdf8',
    border: '#ffffff',
    textColor: '#ffffff',
    t: t
  });

  // Punchline Banner at bottom
  const banW = 440;
  const banH = 70;
  const banX = (W - banW) / 2;
  const banY = H - 260;
  ctx.save();
  ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1.5;
  roundRect(ctx, banX, banY, banW, banH, 14, true, true);

  ctx.fillStyle = '#c8ff00';
  ctx.font = '900 17px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BEFORE TAB CLOSE', W / 2, banY + 30);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.fillText('Customer never even had time to call Shop B.', W / 2, banY + 52);
  ctx.restore();
}

// --- SCENE 8: SLEEPING PEACEFULLY WHILE AVA STACKS CASH (47.5s - 53.0s) ---
// Voiceover: "Stop bleeding thousands on dead voicemails."
function renderTasklessScene8_TechDispatchAndDashboard(t) {
  renderStoryPill('🛡️ ACT 5: STOP BLEEDING REVENUE', '+$44,800 BOOKED WHILE ASLEEP');

  // Big Green Revenue Metric Card at Top with floating glow
  const cardW = 440;
  const cardH = 120;
  const cardX = (W - cardW) / 2;
  const cardY = 110 + Math.sin(t * 4) * 3;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(200, 255, 0, 0.35)';
  ctx.shadowBlur = 24;
  roundRect(ctx, cardX, cardY, cardW, cardH, 18, true, true);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MONTHLY RECOVERED REVENUE:', W / 2, cardY + 34);

  ctx.fillStyle = '#c8ff00';
  ctx.font = '900 48px "Space Grotesk", sans-serif';
  ctx.fillText('+$44,800', W / 2, cardY + 82);

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 12px -apple-system, sans-serif';
  ctx.fillText('✓ 14 AFTER-HOURS JOBS SAVED THIS MONTH', W / 2, cardY + 104);
  ctx.restore();

  // Contractor sleeping in cozy bed on the left with breathing blanket & Zzz
  const bedX = 140;
  const bedY = 520;
  drawBedWithContractor(ctx, bedX, bedY, t);

  // Ava on the right hovering and actively tossing money bags!
  const avaX = W - 120;
  const avaY = 520;
  drawAvaRobot(ctx, avaX, avaY, {
    scale: 1.15,
    t: t
  });

  // Growing Stack of Money Bags next to Ava with bouncing squash!
  drawFlyingMoneyBag(ctx, avaX - 45, avaY - 20, t * 0.5, '$8k');
  drawFlyingMoneyBag(ctx, avaX - 45, avaY - 60, (t + 1) * 0.5, '$8k');
  drawFlyingMoneyBag(ctx, avaX - 45, avaY - 100, (t + 2) * 0.5, '$8k');

  // Floating +$8,000 green badges floating up like video game points!
  for (let b = 0; b < 2; b++) {
    const bT = (t * 0.8 + b * 0.6) % 1.5;
    const bY = avaY - 80 - bT * 40;
    const bX = avaX - 45 + Math.sin(t * 4 + b) * 10;
    const bA = Math.max(0, 1 - bT / 1.5);
    ctx.fillStyle = \`rgba(200, 255, 0, \${bA})\`;
    ctx.font = 'bold 14px "Space Grotesk", sans-serif';
    ctx.fillText('+$8,000 ✓', bX, bY);
  }
}

// --- SCENE 9: LIVE DEMO DIALER WITH PULSING RADAR WAVES (53.1s - 58.5s) ---
// Voiceover: "Call the demo number on screen right now to hear Ava live..."
function renderTasklessScene9_LiveDemoDialer(t) {
  renderStoryPill('📞 ACT 5: TEST AVA LIVE RIGHT NOW', 'FLORIDA DEDICATED DEMO LINE');

  // Giant Friendly Clickable Phone Card at Top
  const cardW = 460;
  const cardH = 240;
  const cardX = (W - cardW) / 2;
  const cardY = 110 + Math.sin(t * 4) * 3;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
  ctx.shadowBlur = 24;
  roundRect(ctx, cardX, cardY, cardW, cardH, 20, true, true);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PICK UP YOUR CELL & DIAL RIGHT NOW:', W / 2, cardY + 38);

  // Phone Number Pill with expanding radar ping wave!
  const numW = cardW - 40;
  const numH = 80;
  const numX = cardX + 20;
  const numY = cardY + 58;

  // Expanding Radar ping
  const pingR = (t * 50) % 90;
  const pingA = Math.max(0, 1 - pingR / 90);
  ctx.strokeStyle = \`rgba(56, 189, 248, \${pingA})\`;
  ctx.lineWidth = 2;
  roundRect(ctx, numX - pingR * 0.3, numY - pingR * 0.2, numW + pingR * 0.6, numH + pingR * 0.4, 18, false, true);

  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  roundRect(ctx, numX, numY, numW, numH, 16, true, true);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 36px "JetBrains Mono", monospace';
  ctx.fillText('(561) 813-8602', W / 2, numY + 48);

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText('● ONLINE 24/7 · ANSWERS IN 0.8 SECONDS', W / 2, numY + 70);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.fillText('Experience real AI voice triage on your own phone.', W / 2, cardY + 175);
  ctx.fillText('No sales pitch — just instant live technology.', W / 2, cardY + 202);
  ctx.restore();

  // Bouncing Big Arrow pointing directly at the phone number!
  const arrowBounce = Math.sin(t * 12) * 12;
  ctx.save();
  ctx.fillStyle = '#c8ff00';
  ctx.shadowColor = '#c8ff00';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.moveTo(W / 2, cardY - 20 + arrowBounce);
  ctx.lineTo(W / 2 - 14, cardY - 40 + arrowBounce);
  ctx.lineTo(W / 2 + 14, cardY - 40 + arrowBounce);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Ava pointing up at the phone number from below with lively hover
  const avaX = W / 2;
  const avaY = 560;
  drawAvaRobot(ctx, avaX, avaY, {
    scale: 1.25,
    t: t
  });

  drawSpeechBubble(ctx, avaX + 80, avaY - 150, 'DIAL ME NOW! 📞', {
    bg: '#22c55e',
    border: '#ffffff',
    textColor: '#ffffff',
    t: t
  });
}

// --- SCENE 10: VIRAL ACTION CARD WITH FLOATING HEARTS & CONFETTI (58.5s - 63.0s) ---
// Voiceover: "...or comment 'AVA' below for free instant access."
function renderTasklessScene10_TryTasklessCTA(t) {
  renderStoryPill('⚡ GET INSTANT ACCESS', 'VANTORX SOLUTIONS');

  // Floating Instagram Hearts and Flames drifting upward!
  const emojis = ['❤️', '🔥', '🚀', '⚡', '👏'];
  for (let em = 0; em < 8; em++) {
    const emT = (t * 0.8 + em * 0.45) % 3.0;
    const emY = H - emT * 280;
    const emX = 60 + (em * 65) % (W - 120) + Math.sin(t * 4 + em) * 16;
    const emAlpha = Math.max(0, 1 - emT / 3.0);
    ctx.save();
    ctx.globalAlpha = emAlpha;
    ctx.font = '22px -apple-system, sans-serif';
    ctx.fillText(emojis[em % emojis.length], emX, emY);
    ctx.restore();
  }

  // Confetti particles tumbling continuously
  for (let c = 0; c < 16; c++) {
    const cT = (t * 1.5 + c * 0.3) % 2.5;
    const cY = cT * 380;
    const cX = (c * 35) % W + Math.sin(t * 6 + c) * 20;
    const cRot = t * 8 + c;
    const cColor = c % 3 === 0 ? '#c8ff00' : (c % 3 === 1 ? '#38bdf8' : '#f43f5e');
    ctx.save();
    ctx.translate(cX, cY);
    ctx.rotate(cRot);
    ctx.fillStyle = cColor;
    ctx.fillRect(-4, -6, 8, 12);
    ctx.restore();
  }

  const cardW = 460;
  const cardH = 500;
  const cardX = (W - cardW) / 2;
  const cardY = 110 + Math.sin(t * 4) * 3;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  roundRect(ctx, cardX, cardY, cardW, cardH, 24, true, true);

  // Cute Ava robot icon at top
  drawAvaRobot(ctx, W / 2, cardY + 130, {
    scale: 0.9,
    t: t
  });

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 32px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('VantorX AI', W / 2, cardY + 175);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 14px -apple-system, sans-serif';
  ctx.fillText('The 24/7 Trade Dispatcher', W / 2, cardY + 202);

  // Bullets
  const bullets = [
    '✓ Never miss another high-ticket emergency call',
    '✓ Answers in 0.8s and dispatches your techs',
    '✓ Zero software change · Keeps your number'
  ];
  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.textAlign = 'left';
  for (let i = 0; i < bullets.length; i++) {
    ctx.fillText(bullets[i], cardX + 36, cardY + 245 + i * 28);
  }

  // Giant High-Contrast Action Button with animated rainbow gradient border!
  const btnW = cardW - 50;
  const btnH = 64;
  const btnX = cardX + 25;
  const btnY = cardY + 345;
  const btnPulse = 1.0 + Math.sin(t * 8) * 0.03;

  ctx.save();
  ctx.translate(W / 2, btnY + btnH / 2);
  ctx.scale(btnPulse, btnPulse);
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, -btnW / 2, -btnH / 2, btnW, btnH, 32, true, false);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 18px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('COMMENT "AVA" ON THIS REEL', 0, 7);
  ctx.restore();

  ctx.fillStyle = '#c8ff00';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('We\\'ll DM you the free instant setup blueprint.', W / 2, cardY + 440);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.fillText('Or dial demo: (561) 813-8602', W / 2, cardY + 470);
  ctx.restore();
}
`;

const startMarkerScenes = '// =========================================================================\n// 🎬 10 NARRATION-MATCHED STICK FIGURE STORY SCENES';
const endMarkerScenes = '// --- INITIAL HERO POSTER CARD ON PAUSE / LOAD (t === 0) ---';

const idxS1 = html.indexOf(startMarkerScenes);
const idxS2 = html.indexOf(endMarkerScenes);

if (idxS1 === -1 || idxS2 === -1) {
  console.error('ERROR: Could not find markers for Section C scenes!', { idxS1, idxS2 });
  process.exit(1);
}

html = html.slice(0, idxS1) + upgradedScenesCode + '\n' + html.slice(idxS2);
console.log('✓ Section C (All 10 Kinetic Story Scenes) successfully injected.');

// Save updated html
fs.writeFileSync(targetFile, html, 'utf8');
console.log('✓ Wrote updated website/demo/reel-creator.html successfully (' + html.length + ' bytes).');
