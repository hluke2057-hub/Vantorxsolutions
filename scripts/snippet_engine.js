// 🎨 IMMERSIVE STICK FIGURE STORY ANIMATION ENGINE (CONTINUOUS KINETIC MOTION)
// Non-stop movement, full character articulation, squash & stretch, physics particles, and zero still frames
// =========================================================================

// --- 48 CONTINUOUS LIVING AMBIENT PARTICLES ---
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
      ctx.fillStyle = 'rgba(56, 189, 248, ' + swAlpha + ')';
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
      ctx.fillStyle = 'rgba(56, 189, 248, ' + swAlpha + ')';
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

    ctx.rotate(0.12);

    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-arm1, neckY + 30); ctx.lineTo(-arm1 * 1.3, hipY + 10);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(arm2, neckY + 30); ctx.lineTo(arm2 * 1.3, hipY - 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(leg1 * 0.7, hipY + 25); ctx.lineTo(leg1, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(leg2 * 0.7, hipY + 25); ctx.lineTo(leg2, footY);
    ctx.stroke();

    // Dust puffs behind back heel
    const puffCycle = (t * 8) % 1;
    ctx.fillStyle = 'rgba(226, 232, 240, ' + (1 - puffCycle) + ')';
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

    ctx.beginPath();
    ctx.moveTo(0, neckY + 12);
    ctx.lineTo(-24, neckY - 10);
    ctx.lineTo(-32, neckY - 35);
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
    if (Math.sin(t * 10) > 0.6) {
      ctx.fillStyle = '#fde047';
      ctx.beginPath(); ctx.arc(43, neckY - 48 + wrenchAnim, 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();

    const footShift = Math.sin(t * 5) * 3;
    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-18, hipY + 35); ctx.lineTo(-14 + footShift, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(18, hipY + 30); ctx.lineTo(14 - footShift, footY - 12);
    ctx.stroke();
  } else if (pose === 'panic_phone') {
    const phoneVibe = Math.sin(t * 30) * 3;
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-24 + phoneVibe, neckY); ctx.lineTo(-18 + phoneVibe, headY + 5);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(24, neckY); ctx.lineTo(18, headY + 5);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    roundRect(ctx, -28 + phoneVibe, headY - 5, 10, 18, 3, true, false);

    const paceLeg = Math.sin(t * 12) * 12;
    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-16 + paceLeg, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(16 - paceLeg, footY);
    ctx.stroke();
  } else if (pose === 'laser_pointer') {
    const aimWobble = Math.sin(t * 4) * 6;
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(28, neckY - 12 + aimWobble); ctx.lineTo(50, neckY - 30 + aimWobble);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-18, neckY + 10); ctx.lineTo(-6, hipY);
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    roundRect(ctx, 46, neckY - 36 + aimWobble, 18, 8, 3, true, false);

    const hop = Math.abs(Math.sin(t * 6)) * 8;
    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-20, footY - hop);
    ctx.moveTo(0, hipY); ctx.lineTo(20, footY - hop);
    ctx.stroke();
  } else if (pose === 'cheer' || pose === 'jump_cheer') {
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
    const step = Math.sin(t * 4) * 12;
    ctx.rotate(-0.15);
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-22, neckY + 36); ctx.lineTo(-28, hipY + 15);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(12, neckY + 36); ctx.lineTo(18, hipY + 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-16 + step, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(16 - step, footY);
    ctx.stroke();
  } else if (pose === 'sad_ladder') {
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

  ctx.save();
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 24;

  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  roundRect(ctx, -headRadius - 4, headY - headRadius, (headRadius + 4) * 2, headRadius * 2 + 4, 16, true, true);
  ctx.restore();

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

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, headY - headRadius);
  ctx.lineTo(0, headY - headRadius - 16);
  ctx.stroke();

  const sigR = (t * 25) % 35;
  const sigA = Math.max(0, 1 - sigR / 35);
  ctx.strokeStyle = 'rgba(56, 189, 248, ' + sigA + ')';
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

  ctx.fillStyle = '#a855f7';
  roundRect(ctx, -headRadius - 8, headY - 8, 8, 16, 4, true, false);
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-headRadius - 4, headY);
  ctx.quadraticCurveTo(-12, headY + 18, 6, headY + 14);
  ctx.stroke();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath(); ctx.arc(8, headY + 14, 3.5, 0, Math.PI * 2); ctx.fill();

  const micR = (t * 30) % 25;
  const micA = Math.max(0, 1 - micR / 25);
  ctx.strokeStyle = 'rgba(56, 189, 248, ' + micA + ')';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(8, headY + 14, micR, -0.6, 0.6);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  const emoteCycle = Math.floor(t * 1.5) % 4;
  let emote = '^ ‿ ^';
  if (emoteCycle === 1) emote = '⚡ ‿ ⚡';
  else if (emoteCycle === 2) emote = '◕ ‿ ◕';
  else if (emoteCycle === 3) emote = '^ ‿ ^';
  ctx.fillText(emote, 0, headY + 6);

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, neckY);
  ctx.lineTo(0, hipY);
  ctx.stroke();

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

  const typeMotion = Math.sin(t * 22) * 5;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, neckY + 10);
  ctx.lineTo(24, neckY + 4 + typeMotion);
  ctx.lineTo(16, neckY + 24 + typeMotion);
  ctx.moveTo(0, neckY + 10);
  ctx.lineTo(-24, neckY + 12);
  ctx.lineTo(-12, neckY + 30);
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 1.5;
  roundRect(ctx, -32, neckY + 22, 34, 22, 4, true, true);

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

  for (let dp = 0; dp < 3; dp++) {
    const dpT = (t * 3 + dp * 0.7) % 1.5;
    const dpY = neckY + 20 - dpT * 50;
    const dpX = -14 + Math.sin(t * 5 + dp) * 12;
    ctx.fillStyle = '#c8ff00';
    ctx.fillRect(dpX, dpY, 3, 3);
  }
  ctx.restore();

  ctx.beginPath();
  ctx.moveTo(0, hipY); ctx.lineTo(-14, hipY + 20); ctx.lineTo(-14, footY);
  ctx.moveTo(0, hipY); ctx.lineTo(14, hipY + 20); ctx.lineTo(14, footY);
  ctx.stroke();

  ctx.restore();
}

// --- PROPS & STORY HELPERS WITH DYNAMIC CONTINUOUS PHYSICS ---

function drawLadder(ctx, x, y, h, t) {
  ctx.save();
  const sway = Math.sin((t || 0) * 7) * 0.035;
  ctx.translate(x, y + h);
  ctx.rotate(sway);
  ctx.translate(-x, -(y + h));

  ctx.strokeStyle = '#f59e0b';
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

function drawLeakyPipe(ctx, x, y, t) {
  ctx.save();
  const vibe = Math.sin(t * 26) * 2;
  ctx.fillStyle = '#475569';
  ctx.fillRect(x - 80 + vibe, y, 160, 18);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(x - 12 + vibe, y - 4, 24, 26);

  const floorY = y + 210;

  for (let d = 0; d < 2; d++) {
    const dropCycle = ((t * 2.8 + d * 0.5) % 1.0);
    const dropY = y + 26 + dropCycle * (floorY - (y + 26));
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(x + vibe, dropY, 5, 0, Math.PI * 2);
    ctx.fill();

    if (dropCycle > 0.85) {
      const splashProgress = (dropCycle - 0.85) / 0.15;
      const splashR = splashProgress * 22;
      const splashAlpha = 1 - splashProgress;
      ctx.strokeStyle = 'rgba(56, 189, 248, ' + splashAlpha + ')';
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

  const puddleW = 54 + Math.sin(t * 6) * 6;
  ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.beginPath();
  ctx.ellipse(x, floorY, puddleW, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  const ripR = (t * 35) % 50 + 10;
  const ripAlpha = Math.max(0, 1 - ripR / 60);
  ctx.strokeStyle = 'rgba(56, 189, 248, ' + ripAlpha + ')';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(x, floorY, ripR * 1.4, ripR * 0.4, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawFlyingMoneyBag(ctx, x, y, t, amount) {
  ctx.save();
  const swoopY = Math.sin(t * 8) * 14;
  ctx.translate(x, y + swoopY);

  const flap = Math.sin(t * 22) * 0.5;

  for (let dt = 1; dt <= 3; dt++) {
    const trailT = (t * 4 + dt * 0.4) % 1.2;
    const trX = -35 - trailT * 50;
    const trY = Math.sin(t * 6 + dt) * 18 + trailT * 15;
    const trAlpha = Math.max(0, 1 - trailT / 1.2);
    ctx.fillStyle = 'rgba(34, 197, 94, ' + trAlpha + ')';
    ctx.font = 'bold 12px "Space Grotesk", sans-serif';
    ctx.fillText('$', trX, trY);
  }

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.save();
  ctx.rotate(flap);
  ctx.beginPath(); ctx.ellipse(-26, -10, 22, 9, -0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.rotate(-flap);
  ctx.beginPath(); ctx.ellipse(26, -10, 22, 9, 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();

  const bagSquash = 1.0 + Math.sin(t * 12) * 0.06;
  ctx.scale(1 / bagSquash, bagSquash);
  ctx.fillStyle = '#22c55e';
  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 8, 22, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#16a34a';
  ctx.fillRect(-8, -18, 16, 8);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(amount || '$8,000', 0, 12);

  ctx.restore();
}

function drawWorkVan(ctx, x, y, t) {
  ctx.save();
  const bounceY = Math.sin(t * 22) * 3.5;
  ctx.translate(x, y + bounceY);

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  roundRect(ctx, -80, -45, 160, 45, 10, true, true);

  ctx.fillStyle = '#38bdf8';
  roundRect(ctx, 40, -40, 35, 24, 6, true, false);

  drawLadder(ctx, 0, -62, 22, t);

  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ VantorX DISPATCH', -10, -20);

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

  for (let s = 0; s < 3; s++) {
    const puffCycle = ((t * 50 + s * 25) % 75);
    const puffAlpha = Math.max(0, 1 - puffCycle / 75);
    ctx.fillStyle = 'rgba(203, 213, 225, ' + (puffAlpha * 0.7) + ')';
    ctx.beginPath();
    ctx.arc(-95 - puffCycle * 1.1, -5 - puffCycle * 0.4, 8 + puffCycle * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawBedWithContractor(ctx, x, y, t) {
  ctx.save();
  const snoreBreath = Math.sin(t * 3.5) * 4;
  ctx.translate(x, y);

  ctx.fillStyle = '#92400e';
  roundRect(ctx, -90, -70, 18, 70, 4, true, false);
  ctx.fillStyle = '#78350f';
  roundRect(ctx, 75, -40, 14, 40, 4, true, false);

  ctx.fillStyle = '#1e3a8a';
  roundRect(ctx, -75, -35 + snoreBreath * 0.5, 150, 35 - snoreBreath * 0.5, 8, true, false);

  ctx.fillStyle = '#f8fafc';
  roundRect(ctx, -68, -48, 36, 18, 8, true, false);

  drawStickPerson(ctx, -50, -32 + snoreBreath * 0.3, {
    scale: 0.85,
    expr: 'sleep',
    hat: 'nightcap',
    t: t
  });

  for (let z = 0; z < 3; z++) {
    const zT = (t * 1.2 + z * 0.8) % 2.5;
    const zY = -60 - zT * 35;
    const zX = -40 + Math.sin(t * 4 + z) * 14 + zT * 12;
    const zAlpha = Math.max(0, 1 - zT / 2.5);
    ctx.fillStyle = 'rgba(147, 197, 253, ' + zAlpha + ')';
    ctx.font = 'bold ' + (14 + z * 5) + 'px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Z', zX, zY);
  }

  ctx.restore();
}

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

  ctx.fillStyle = opts.bg || '#ffffff';
  ctx.strokeStyle = opts.border || '#38bdf8';
  ctx.lineWidth = 2;
  ctx.shadowColor = opts.shadow || 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 10;
  roundRect(ctx, bx, by, bubbleW, bubbleH, 14, true, true);
  ctx.shadowBlur = 0;

  ctx.fillStyle = opts.bg || '#ffffff';
  ctx.beginPath();
  ctx.moveTo(x - 8, by + bubbleH);
  ctx.lineTo(x, by + bubbleH + 10);
  ctx.lineTo(x + 8, by + bubbleH);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = opts.textColor || '#0f172a';
  ctx.textAlign = 'center';
  ctx.fillText(text, x, by + 26);
  ctx.restore();
}

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
