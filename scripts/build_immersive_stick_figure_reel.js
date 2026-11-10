const fs = require('fs');
const path = require('path');

const targetHtml = path.resolve('website/demo/reel-creator.html');
console.log('Target HTML file:', targetHtml);

let content = fs.readFileSync(targetHtml, 'utf8');

// 1. SOUND EFFECTS SYNTHESIS EXPANSION
// Add water drip, coin/cash register, van zoom, and sad slide whistle SFX
const sfxExpansion = `
  // Sound Effects Synthesis with Web Audio (Expanded for Immersive Storytelling)
  function playSfx(type) {
    if (!audioCtx || !document.getElementById('chkEnableSfx').checked) return;
    try {
      const t = audioCtx.currentTime;
      if (type === 'laser') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, t);
        osc.frequency.exponentialRampToValueAtTime(220, t + 0.32);
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
        osc.connect(gain);
        gain.connect(bassEQ);
        osc.start(t);
        osc.stop(t + 0.32);
      } else if (type === 'water_drip') {
        // Cute high-pitched water droplet "blop"
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, t);
        osc.frequency.exponentialRampToValueAtTime(1600, t + 0.08);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(gain);
        gain.connect(presenceEQ);
        osc.start(t);
        osc.stop(t + 0.12);
      } else if (type === 'phone_ring') {
        // Double electronic phone chime
        for (let i = 0; i < 2; i++) {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(580, t + i * 0.14);
          gain.gain.setValueAtTime(0.18, t + i * 0.14);
          gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.14 + 0.1);
          osc.connect(gain);
          gain.connect(presenceEQ);
          osc.start(t + i * 0.14);
          osc.stop(t + i * 0.14 + 0.1);
        }
      } else if (type === 'whoosh') {
        // Flying money whoosh
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, t);
        osc.frequency.exponentialRampToValueAtTime(180, t + 0.35);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(bassEQ);
        osc.start(t);
        osc.stop(t + 0.35);
      } else if (type === 'ios_ping' || type === 'ava_chime') {
        // Friendly bright success chime
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((f, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t + idx * 0.06);
          gain.gain.setValueAtTime(0.18, t + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.28);
          osc.connect(gain);
          gain.connect(presenceEQ);
          osc.start(t + idx * 0.06);
          osc.stop(t + idx * 0.06 + 0.28);
        });
      } else if (type === 'chaching') {
        // Cash register chime
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(987.77, t);
        osc.frequency.setValueAtTime(1318.51, t + 0.09);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        osc.connect(gain);
        gain.connect(presenceEQ);
        osc.start(t);
        osc.stop(t + 0.45);
      } else if (type === 'van_zoom') {
        // Van engine whoosh
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.linearRampToValueAtTime(260, t + 0.3);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.6);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        osc.connect(gain);
        gain.connect(bassEQ);
        osc.start(t);
        osc.stop(t + 0.6);
      }
    } catch(e) {}
  }
`;

const playSfxRegex = /\/\/ Sound Effects Synthesis with Web Audio[\s\S]*?function playSfx\(type\) \{[\s\S]*?\n  \}/;
if (playSfxRegex.test(content)) {
  content = content.replace(playSfxRegex, sfxExpansion.trim());
  console.log('✓ Successfully upgraded playSfx with storytelling sound effects');
}

// 2. COMPLETE STICK FIGURE STORY ANIMATION ENGINE
const stickFigureEngine = `
// =========================================================================
// 🎨 IMMERSIVE STICK FIGURE STORY ANIMATION ENGINE
// Clean, charming, narrative-driven viral reel animation (100% voiceover-matched)
// =========================================================================

// --- CLEAN MINIMALIST DARK CANVAS BACKGROUND ---
function renderDynamicAtmosphere(t, storyType) {
  // Deep clean midnight chalkboard navy
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#090d16');
  grad.addColorStop(0.5, '#0d1322');
  grad.addColorStop(1, '#080c14');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Subtle clean floor ground line
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, H - 180);
  ctx.lineTo(W, H - 180);
  ctx.stroke();
  ctx.restore();
}

// --- EXPRESSIVE STICK FIGURE CHARACTER DRAWING ROUTINE ---
function drawStickPerson(ctx, x, y, opts) {
  opts = opts || {};
  ctx.save();
  ctx.translate(x, y);

  const scale = opts.scale || 1.0;
  const facing = opts.facing || 1; // 1 = right, -1 = left
  ctx.scale(facing * scale, scale);

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

  // 2. FACIAL EXPRESSIONS
  const expr = opts.expr || 'happy';
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  if (expr === 'happy') {
    // Smiling eyes ^ ^
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(-7, headY - 2, 4, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(7, headY - 2, 4, Math.PI, 0);
    ctx.stroke();
    // Smile arc
    ctx.beginPath();
    ctx.arc(0, headY + 5, 8, 0, Math.PI);
    ctx.stroke();
  } else if (expr === 'panic' || expr === 'shock') {
    // Wide open shocked eyes O O
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(-7, headY - 2, 5, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(7, headY - 2, 5, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, headY + 8, 6, 0, Math.PI * 2); ctx.stroke();
  } else if (expr === 'sweat') {
    // Stressed eyes and open mouth
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-10, headY - 4); ctx.lineTo(-4, headY - 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(4, headY - 2); ctx.lineTo(10, headY - 4); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, headY + 6, 7, 0, Math.PI); ctx.stroke();
    // Blue sweat droplet flying off forehead
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(18, headY - 14, 5, 0, Math.PI * 2);
    ctx.fill();
  } else if (expr === 'sad') {
    // Sad frown :(
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(-7, headY - 2, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(7, headY - 2, 2, 0, Math.PI * 2); ctx.fill();
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
    // Cap dome
    ctx.beginPath();
    ctx.arc(0, headY - 14, headRadius + 2, Math.PI, 0);
    ctx.fill();
    ctx.stroke();
    // Brim
    ctx.beginPath();
    ctx.roundRect(-headRadius - 8, headY - 14, (headRadius + 8) * 2, 6, 3);
    ctx.fill();
    ctx.stroke();
  } else if (opts.hat === 'nightcap') {
    // Striped nightcap
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.moveTo(-headRadius, headY - 12);
    ctx.quadraticCurveTo(0, headY - 48, 30, headY - 40);
    ctx.lineTo(headRadius, headY - 12);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(32, headY - 40, 6, 0, Math.PI * 2); ctx.fill();
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

  // 5. ARMS & LEGS BASED ON POSE
  const pose = opts.pose || 'stand';

  if (pose === 'ladder_work') {
    // Arms up holding wrench on pipe
    const wrenchAnim = Math.sin((opts.t || 0) * 8) * 8;
    ctx.beginPath();
    // Left arm holding pipe
    ctx.moveTo(0, neckY + 12);
    ctx.lineTo(-24, neckY - 10);
    ctx.lineTo(-32, neckY - 35);
    // Right arm turning wrench with animation
    ctx.moveTo(0, neckY + 12);
    ctx.lineTo(26, neckY - 8 + wrenchAnim);
    ctx.lineTo(42, neckY - 30 + wrenchAnim);
    ctx.stroke();

    // Silver Pipe Wrench in hand
    ctx.save();
    ctx.fillStyle = '#94a3b8';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.fillRect(36, neckY - 44 + wrenchAnim, 10, 26);
    ctx.fillRect(32, neckY - 48 + wrenchAnim, 18, 8);
    ctx.restore();

    // Legs standing on ladder rungs
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(-18, hipY + 35);
    ctx.lineTo(-14, footY);
    ctx.moveTo(0, hipY);
    ctx.lineTo(18, hipY + 30);
    ctx.lineTo(14, footY - 12);
    ctx.stroke();
  } else if (pose === 'panic_phone') {
    // One hand on cheek, one hand holding vibrating phone
    ctx.beginPath();
    // Left arm holding phone up to ear
    ctx.moveTo(0, neckY + 12);
    ctx.lineTo(-24, neckY);
    ctx.lineTo(-18, headY + 5);
    // Right arm on cheek in panic
    ctx.moveTo(0, neckY + 12);
    ctx.lineTo(24, neckY);
    ctx.lineTo(18, headY + 5);
    ctx.stroke();

    // Phone in left hand
    ctx.fillStyle = '#38bdf8';
    roundRect(ctx, -28, headY - 5, 10, 18, 3, true, false);

    // Legs standing slightly shaken
    const shake = Math.sin((opts.t || 0) * 20) * 2;
    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-16 + shake, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(16 - shake, footY);
    ctx.stroke();
  } else if (pose === 'laser_pointer') {
    // Holding laser pointer aiming up at sky
    ctx.beginPath();
    // Left arm pointing forward
    ctx.moveTo(0, neckY + 12);
    ctx.lineTo(28, neckY - 12);
    ctx.lineTo(48, neckY - 28);
    // Right arm on hip
    ctx.moveTo(0, neckY + 12);
    ctx.lineTo(-18, neckY + 10);
    ctx.lineTo(-6, hipY);
    ctx.stroke();

    // Laser pointer gadget
    ctx.fillStyle = '#22c55e';
    roundRect(ctx, 45, neckY - 34, 18, 8, 3, true, false);

    // Confident standing legs
    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-20, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(20, footY);
    ctx.stroke();
  } else if (pose === 'cheer' || pose === 'wave') {
    // Arms raised cheering / waving
    const wave = Math.sin((opts.t || 0) * 10) * 12;
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-28, neckY - 25); ctx.lineTo(-40, neckY - 50);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(28, neckY - 25); ctx.lineTo(40 + wave, neckY - 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-18, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(18, footY);
    ctx.stroke();
  } else if (pose === 'sad_ladder') {
    // Slumped shoulders, head down, empty hands
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-18, neckY + 40); ctx.lineTo(-12, hipY + 15);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(18, neckY + 40); ctx.lineTo(12, hipY + 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-16, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(16, footY);
    ctx.stroke();
  } else {
    // Default stand
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-22, neckY + 30); ctx.lineTo(-18, hipY + 10);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(22, neckY + 30); ctx.lineTo(18, hipY + 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-18, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(18, footY);
    ctx.stroke();
  }

  ctx.restore();
}

// --- CUTE AVA ROBOT CHARACTER ---
function drawAvaRobot(ctx, x, y, opts) {
  opts = opts || {};
  ctx.save();
  ctx.translate(x, y);

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

  // Antenna with pulsing neon star
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, headY - headRadius);
  ctx.lineTo(0, headY - headRadius - 16);
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
  // Mic tip
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath(); ctx.arc(8, headY + 14, 3.5, 0, Math.PI * 2); ctx.fill();

  // Smiling digital face inside screen ^ _ ^
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('^ ‿ ^', 0, headY + 6);

  // Torso with glowing heart/name badge
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, neckY);
  ctx.lineTo(0, hipY);
  ctx.stroke();

  // AVA Heart Badge
  ctx.fillStyle = '#a855f7';
  roundRect(ctx, -14, neckY + 12, 28, 20, 6, true, false);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('AVA', 0, neckY + 26);

  // Arms: Typing on glowing tablet or waving
  const wave = Math.sin((opts.t || 0) * 10) * 14;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  // Right arm waving
  ctx.moveTo(0, neckY + 10);
  ctx.lineTo(26, neckY - 10);
  ctx.lineTo(36 + wave, neckY - 38);
  // Left arm holding tablet
  ctx.moveTo(0, neckY + 10);
  ctx.lineTo(-24, neckY + 12);
  ctx.lineTo(-12, neckY + 30);
  ctx.stroke();

  // Glowing Tablet in left hand
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 1.5;
  roundRect(ctx, -32, neckY + 22, 28, 20, 4, true, true);
  ctx.fillStyle = '#c8ff00';
  ctx.fillRect(-28, neckY + 27, 20, 3);
  ctx.fillRect(-28, neckY + 33, 14, 3);

  // Legs standing
  ctx.beginPath();
  ctx.moveTo(0, hipY); ctx.lineTo(-16, footY);
  ctx.moveTo(0, hipY); ctx.lineTo(16, footY);
  ctx.stroke();

  ctx.restore();
}

// --- PROPS & STORY HELPERS ---

// 1. Tall Wooden Trade Ladder
function drawLadder(ctx, x, y, h) {
  ctx.save();
  ctx.strokeStyle = '#f59e0b'; // Amber wood
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  const w = 48;
  // Left and right rails
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y);
  ctx.lineTo(x - w / 2, y + h);
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w / 2, y + h);

  // Rungs every 32px
  const numRungs = Math.floor(h / 32);
  for (let i = 1; i < numRungs; i++) {
    const ry = y + i * 32;
    ctx.moveTo(x - w / 2, ry);
    ctx.lineTo(x + w / 2, ry);
  }
  ctx.stroke();
  ctx.restore();
}

// 2. Leaky Pipe with Animated Water Droplets
function drawLeakyPipe(ctx, x, y, t) {
  ctx.save();
  // Iron Pipe at top
  ctx.fillStyle = '#475569';
  ctx.fillRect(x - 80, y, 160, 18);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(x - 12, y - 4, 24, 26); // Pipe joint

  // Falling Water Droplets
  const dropCycle = (t * 2.5) % 1.0;
  const dropY = y + 26 + dropCycle * 180;
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(x, dropY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Water puddle with animated ripples on floor
  const floorY = y + 210;
  ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.beginPath();
  ctx.ellipse(x, floorY, 48, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ripple ring
  const ripR = (t * 30) % 40 + 10;
  const ripAlpha = Math.max(0, 1 - ripR / 50);
  ctx.strokeStyle = \`rgba(56, 189, 248, \${ripAlpha})\`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(x, floorY, ripR * 1.4, ripR * 0.4, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// 3. Flying Money Bag with Cartoon Wings ($8,000)
function drawFlyingMoneyBag(ctx, x, y, t, amount) {
  ctx.save();
  ctx.translate(x, y);

  const flap = Math.sin(t * 16) * 0.4;

  // Wings
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  // Left Wing
  ctx.save();
  ctx.rotate(flap);
  ctx.beginPath();
  ctx.ellipse(-26, -10, 20, 8, -0.4, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.restore();
  // Right Wing
  ctx.save();
  ctx.rotate(-flap);
  ctx.beginPath();
  ctx.ellipse(26, -10, 20, 8, 0.4, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.restore();

  // Green Money Bag
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

// 4. Cartoon Trade Work Van
function drawWorkVan(ctx, x, y, t) {
  ctx.save();
  ctx.translate(x, y);

  // Van Body
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  roundRect(ctx, -80, -45, 160, 45, 10, true, true);

  // Cab Front
  ctx.fillStyle = '#38bdf8';
  roundRect(ctx, 40, -40, 35, 24, 6, true, false);

  // Ladder on Roof
  drawLadder(ctx, 0, -62, 22);

  // VantorX Dispatch logo on side
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ VantorX DISPATCH', -10, -20);

  // Spinning Wheels
  const wheelSpin = t * 20;
  [-45, 45].forEach(wx => {
    ctx.save();
    ctx.translate(wx, 5);
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
    // Wheel spokes
    ctx.rotate(wheelSpin);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.moveTo(0, -6); ctx.lineTo(0, 6); ctx.stroke();
    ctx.restore();
  });

  // Exhaust Smoke Puffs
  const puff1 = ((t * 40) % 60);
  const puffAlpha = Math.max(0, 1 - puff1 / 60);
  ctx.fillStyle = \`rgba(203, 213, 225, \${puffAlpha * 0.6})\`;
  ctx.beginPath();
  ctx.arc(-95 - puff1 * 0.8, -5 - puff1 * 0.3, 8 + puff1 * 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 5. Contractor Sleeping in Bed
function drawBedWithContractor(ctx, x, y, t) {
  ctx.save();
  ctx.translate(x, y);

  // Bed Frame
  ctx.fillStyle = '#92400e'; // Wood headboard
  roundRect(ctx, -90, -70, 18, 70, 4, true, false);
  ctx.fillStyle = '#78350f';
  roundRect(ctx, 75, -40, 14, 40, 4, true, false);

  // Mattress & Blanket
  ctx.fillStyle = '#1e3a8a'; // Deep blue blanket
  roundRect(ctx, -75, -35, 150, 35, 8, true, false);

  // Pillow
  ctx.fillStyle = '#f8fafc';
  roundRect(ctx, -68, -48, 36, 18, 8, true, false);

  // Contractor Head with Nightcap sleeping peacefully
  drawStickPerson(ctx, -50, -32, {
    scale: 0.85,
    expr: 'sleep',
    hat: 'nightcap',
    pose: 'sleeping'
  });

  // Floating Z z z animation
  const zCycle = (t * 1.5) % 3;
  ctx.fillStyle = '#93c5fd';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Z', -40 + zCycle * 10, -80 - zCycle * 18);
  ctx.font = 'bold 22px "JetBrains Mono", monospace';
  ctx.fillText('Z', -30 + zCycle * 12, -100 - zCycle * 22);

  ctx.restore();
}

// 6. Speech Bubble Helper
function drawSpeechBubble(ctx, x, y, text, opts) {
  opts = opts || {};
  ctx.save();
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

  // Speech Pointer Triangle
  ctx.fillStyle = opts.bg || '#ffffff';
  ctx.beginPath();
  ctx.moveTo(x - 8, by + bubbleH);
  ctx.lineTo(x, by + bubbleH + 10);
  ctx.lineTo(x + 8, by + bubbleH);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Text
  ctx.fillStyle = opts.textColor || '#090d16';
  ctx.textAlign = 'center';
  ctx.fillText(text, x, by + 26);

  ctx.restore();
}

// --- TOP STORY BANNER PILL ---
function renderStoryPill(badge, text) {
  ctx.save();
  const pillW = Math.min(W - 40, 480);
  const pillH = 42;
  const pillX = (W - pillW) / 2;
  const pillY = 36;

  ctx.fillStyle = 'rgba(13, 19, 34, 0.95)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, pillX, pillY, pillW, pillH, 21, true, true);

  ctx.font = 'bold 13px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(badge + ' · ' + text, W / 2, pillY + 26);
  ctx.restore();
}
`;

// Replace existing helpers & preloader with the Stick Figure Engine
const oldEngineRegex = /\/\/ 🚀 TASKLESS AI 3D ASSETS ENGINE[\s\S]*?function renderDynamicAtmosphere\(t, storyType\) \{[\s\S]*?ctx\.fillRect\(0, 0, W, H\);\s*\}/;
if (oldEngineRegex.test(content)) {
  content = content.replace(oldEngineRegex, stickFigureEngine.trim());
  console.log('✓ Successfully injected Stick Figure Story Animation Engine');
} else {
  console.warn('Could not match oldEngineRegex - using fallback injection');
}

// 3. BUILD THE 10 STORY SCENES WITH VIVID STICK FIGURES
const storyScenesCode = `
// =========================================================================
// 🎬 10 NARRATION-MATCHED STICK FIGURE STORY SCENES
// =========================================================================

// --- SCENE 1: THE LASER SPEED HOOK (0.0s - 7.2s) ---
// Voiceover: "A single beam of laser light travels at 186,000 miles per second."
function renderTasklessScene1_NightPhone(t) {
  renderStoryPill('⚡ ACT 1: THE SPEED HOOK', '186,000 MILES PER SECOND');

  // Ground: Cartoon planet Earth curve
  ctx.save();
  ctx.fillStyle = '#0369a1';
  ctx.beginPath();
  ctx.arc(W / 2, H + 480, 720, 0, Math.PI * 2);
  ctx.fill();

  // Green continent patches
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.ellipse(W / 2 - 80, H - 120, 110, 45, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(W / 2 + 100, H - 110, 90, 38, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Stick figure standing on Earth holding laser pointer aiming up-right
  const charX = W / 2 - 80;
  const charY = H - 170;
  drawStickPerson(ctx, charX, charY, {
    scale: 1.15,
    facing: 1,
    expr: 'happy',
    pose: 'laser_pointer',
    color: '#ffffff'
  });

  // Animated Neon Green/Cyan Laser Beam shooting across the night sky!
  const beamStartX = charX + 55;
  const beamStartY = charY - 32;
  const beamProgress = Math.min(1, t / 1.5);
  const beamEndX = beamStartX + (W + 100) * beamProgress;
  const beamEndY = beamStartY - 380 * beamProgress;

  ctx.save();
  ctx.shadowColor = '#22c55e';
  ctx.shadowBlur = 28;
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 6;
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
  ctx.restore();

  // Big Bold Comic Headline Card
  ctx.save();
  const cardW = 420;
  const cardH = 110;
  const cardX = (W - cardW) / 2;
  const cardY = 110;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  roundRect(ctx, cardX, cardY, cardW, cardH, 16, true, true);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 46px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('186,000', W / 2, cardY + 54);

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText('MILES PER SECOND', W / 2, cardY + 86);
  ctx.restore();
}

// --- SCENE 2: MOON IN 1.3s & DEEP SPACE (7.3s - 12.8s) ---
// Voiceover: "It can reach the moon in under three seconds, and cross nearly two billion miles of space in under three hours."
function renderTasklessScene2_LasersUranus(t) {
  renderStoryPill('🔭 ACT 1: INTERPLANETARY SPEED', 'EARTH TO MOON IN 1.3s');

  const p = Math.min(1, Math.max(0, (t - 7.3) / 5.5));

  // Cute Cartoon Moon on Top Right with eyes and smile!
  const moonX = W - 120;
  const moonY = 220;
  const moonR = 64;

  ctx.save();
  ctx.fillStyle = '#f1f5f9';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Craters
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath(); ctx.arc(moonX - 22, moonY - 14, 12, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(moonX + 18, moonY + 20, 15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(moonX + 10, moonY - 24, 9, 0, Math.PI * 2); ctx.fill();

  // Cute Moon Happy Face
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.arc(moonX - 12, moonY + 2, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(moonX + 12, moonY + 2, 4, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(moonX, moonY + 12, 8, 0, Math.PI); ctx.stroke();
  ctx.restore();

  // Distant cartoon planets (Saturn with cute ring)
  ctx.save();
  const satX = 100; const satY = 340;
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath(); ctx.arc(satX, satY, 26, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(satX, satY, 46, 10, -0.3, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  // Laser beam zooming all the way to Moon
  ctx.save();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 5;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.moveTo(80, H - 200);
  ctx.lineTo(moonX - 45, moonY + 35);
  ctx.stroke();
  ctx.restore();

  // Moon Timer Tag
  drawSpeechBubble(ctx, moonX - 50, moonY - 50, '⏱️ 1.3 SECONDS!', {
    bg: '#ffffff',
    border: '#22c55e',
    textColor: '#15803d'
  });

  // Story Card
  const cardW = 420; const cardH = 100;
  const cardX = (W - cardW) / 2;
  const cardY = 100;
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

  // Homeowner Living Room Cross-Section
  const roomY = 240;

  // Leaky pipe dripping from ceiling
  drawLeakyPipe(ctx, W / 2 - 30, roomY + 20, t);

  // Panicked Homeowner Stick Figure standing in water puddle
  const homeX = W / 2 + 50;
  const homeY = roomY + 230;
  drawStickPerson(ctx, homeX, homeY, {
    scale: 1.1,
    facing: -1,
    expr: 'panic',
    pose: 'panic_phone',
    color: '#ffffff'
  });

  // Speech bubble from Homeowner: "HELP! CEILING LEAKING!"
  drawSpeechBubble(ctx, homeX - 30, homeY - 145, 'HELP! AC LEAKING! 😱', {
    bg: '#ffffff',
    border: '#ef4444',
    textColor: '#b91c1c'
  });

  // Giant Clock on the wall spinning fast
  const clockX = 100; const clockY = roomY + 70;
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(clockX, clockY, 32, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Spinning clock hands
  const handAngle = t * 6;
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.cos(handAngle) * 20, clockY + Math.sin(handAngle) * 20);
  ctx.stroke();
  ctx.restore();

  // Harsh Truth Banner Card
  const cardW = 440; const cardH = 120;
  const cardX = (W - cardW) / 2;
  const cardY = H - 280;
  ctx.save();
  ctx.fillStyle = 'rgba(239, 68, 68, 0.18)';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
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

// --- SCENE 4: THE 78% LAW (18.5s - 24.8s) ---
// Voiceover: "78% of homeowners hire the first business that answers the phone."
function renderTasklessScene4_Stat78Percent(t) {
  renderStoryPill('⚡ ACT 3: THE SPEED-TO-LEAD LAW', 'FIRST TO ANSWER WINS');

  // Big Bold Comic 78% Stamp
  const cardW = 440;
  const cardH = 260;
  const cardX = (W - cardW) / 2;
  const cardY = 130;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(200, 255, 0, 0.35)';
  ctx.shadowBlur = 24;
  roundRect(ctx, cardX, cardY, cardW, cardH, 20, true, true);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#c8ff00';
  ctx.font = '900 88px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('78%', W / 2, cardY + 105);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 22px "Space Grotesk", sans-serif';
  ctx.fillText('OF HOMEOWNERS HIRE', W / 2, cardY + 155);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 18px "Space Grotesk", sans-serif';
  ctx.fillText('THE 1ST CONTRACTOR WHO ANSWERS', W / 2, cardY + 185);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.fillText('They do NOT wait for your voicemail.', W / 2, cardY + 225);
  ctx.restore();

  // Two cartoon stick figures at bottom:
  // Guy 1 taps phone and gets job, Guy 2 looks shocked
  const g1X = W / 2 - 90;
  const g2X = W / 2 + 90;
  const gy = H - 200;

  drawStickPerson(ctx, g1X, gy, {
    scale: 1.0,
    facing: 1,
    expr: 'happy',
    pose: 'cheer',
    color: '#22c55e'
  });
  drawSpeechBubble(ctx, g1X, gy - 140, 'HIRED! 🏆', { bg: '#22c55e', border: '#ffffff', textColor: '#ffffff' });

  drawStickPerson(ctx, g2X, gy, {
    scale: 1.0,
    facing: -1,
    expr: 'sad',
    pose: 'sad_ladder',
    color: '#94a3b8'
  });
  drawSpeechBubble(ctx, g2X, gy - 140, 'Too late... 😢', { bg: '#1e293b', border: '#ef4444', textColor: '#fca5a5' });
}

// --- SCENE 5: CONTRACTOR ON LADDER & FLYING $8,000 (24.9s - 32.2s) ---
// Voiceover: "When you're on a ladder or eating dinner with family, every unanswered call is an $8,000 job handed to your competitor."
function renderTasklessScene5_TwoShopsComparison(t) {
  renderStoryPill('🪜 ACT 3: THE LADDER DILEMMA', 'MISSED CALL = -$8,000');

  const p = Math.min(1, Math.max(0, (t - 24.9) / 7.3));

  // Tall Ladder in Center-Left
  const ladX = 140;
  const ladY = 240;
  const ladH = 340;
  drawLadder(ctx, ladX, ladY, ladH);

  // Hardworking Contractor A on the ladder with sweat drops and wrench!
  const conY = ladY + 90;
  drawStickPerson(ctx, ladX, conY, {
    scale: 1.05,
    facing: 1,
    expr: 'sweat',
    hat: 'hardhat',
    vest: true,
    pose: 'ladder_work',
    t: t
  });

  // AC Condenser Unit on roof next to him
  ctx.fillStyle = '#334155';
  ctx.fillRect(ladX + 45, ladY + 40, 70, 80);
  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.arc(ladX + 80, ladY + 80, 24, 0, Math.PI * 2); ctx.fill(); // Fan circle

  // His smartphone vibrating on the floor below
  const phoneX = ladX - 60;
  const phoneY = ladY + ladH;
  const buzz = Math.sin(t * 30) * 4;
  ctx.fillStyle = '#ef4444';
  roundRect(ctx, phoneX + buzz, phoneY - 26, 22, 38, 5, true, false);

  // Big Vibrating Call Bubble: "RING RING! 📞"
  drawSpeechBubble(ctx, phoneX - 10, phoneY - 50, 'RING! RING! (( 📞 ))', {
    bg: '#ef4444',
    border: '#ffffff',
    textColor: '#ffffff'
  });

  // Flying Money Bag ($8,000) with wings flying across screen!
  const flyStartX = ladX + 30;
  const flyTargetX = W - 100;
  const curFlyX = flyStartX + (flyTargetX - flyStartX) * Math.min(1, p * 1.5);
  const curFlyY = ladY + 60 + Math.sin(t * 6) * 20;

  drawFlyingMoneyBag(ctx, curFlyX, curFlyY, t, '$8,000');

  // Competitor stick figure on far right waiting to catch the money!
  const compX = W - 90;
  const compY = ladY + ladH;
  drawStickPerson(ctx, compX, compY, {
    scale: 1.0,
    facing: -1,
    expr: 'happy',
    pose: 'cheer',
    color: '#22c55e'
  });
  drawSpeechBubble(ctx, compX, compY - 140, 'Thanks! 🤑', { bg: '#22c55e', border: '#ffffff', textColor: '#ffffff' });

  // Sad Contractor thought bubble
  drawSpeechBubble(ctx, ladX, conY - 150, "I can't reach it! 😭", {
    bg: '#ffffff',
    border: '#ef4444',
    textColor: '#b91c1c'
  });
}

// --- SCENE 6: ENTER AVA THE ROBOT (32.5s - 39.2s) ---
// Voiceover: "That's why we built Ava. She answers your shop's phone in 0.8 seconds and qualifies the caller."
function renderTasklessScene6_ShopB_AvaReply(t) {
  renderStoryPill('🤖 ACT 4: MEET AVA VOICE AI', 'ANSWERS IN 0.8 SECONDS');

  // Glowing Spotlight onto Ava
  ctx.save();
  const spotGrad = ctx.createRadialGradient(W / 2, 320, 30, W / 2, 320, 240);
  spotGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
  spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = spotGrad;
  ctx.fillRect(0, 100, W, 450);
  ctx.restore();

  // Ava the friendly robot in the center!
  const avaX = W / 2;
  const avaY = 380;
  drawAvaRobot(ctx, avaX, avaY, {
    scale: 1.25,
    t: t
  });

  // Speech Bubble from Ava: "Hi! VantorX Dispatch!"
  drawSpeechBubble(ctx, avaX, avaY - 170, '⚡ "Hi! How can we help?" 📞', {
    bg: '#ffffff',
    border: '#38bdf8',
    textColor: '#0284c7'
  });

  // Big Speed Badge: 0.8 SECONDS
  const badgeW = 380;
  const badgeH = 80;
  const badgeX = (W - badgeW) / 2;
  const badgeY = 120;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 2;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 16, true, true);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SPEED TO LEAD BENCHMARK:', W / 2, badgeY + 30);

  ctx.fillStyle = '#c8ff00';
  ctx.font = '900 32px "Space Grotesk", sans-serif';
  ctx.fillText('ANSWERS IN 0.8s ⚡', W / 2, badgeY + 64);
  ctx.restore();

  // Checklist below Ava
  const checkY = H - 280;
  const checkW = 440;
  const checkX = (W - checkW) / 2;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  roundRect(ctx, checkX, checkY, checkW, 110, 14, true, true);

  ctx.font = 'bold 14px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#22c55e';
  ctx.fillText('✓ Answers in 0.8s · Never misses a ring', checkX + 24, checkY + 34);
  ctx.fillText('✓ Qualifies emergency leak & customer address', checkX + 24, checkY + 64);
  ctx.fillText('✓ Books calendar slot directly into your CRM', checkX + 24, checkY + 94);
  ctx.restore();
}

// --- SCENE 7: AUTO DISPATCH WORK VAN (39.3s - 47.2s) ---
// Voiceover: "She checks your schedule and dispatches the job to your technician's phone before the customer can open another Google tab."
function renderTasklessScene7_WorkflowNodes(t) {
  renderStoryPill('📲 ACT 4: INSTANT DISPATCH', 'TECH DISPATCHED IN 6 SECONDS');

  const p = Math.min(1, Math.max(0, (t - 39.3) / 7.9));

  // Calendar Card at top
  const calW = 380;
  const calH = 76;
  const calX = (W - calW) / 2;
  const calY = 120;
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

  // Work Van driving across the screen from left to right!
  const vanStartX = -100;
  const vanEndX = W + 120;
  const vanX = vanStartX + (vanEndX - vanStartX) * Math.min(1, p * 1.3);
  const vanY = H - 280;

  drawWorkVan(ctx, vanX, vanY, t);

  // Speed bubble above van: "ON MY WAY! 🚗💨"
  drawSpeechBubble(ctx, vanX, vanY - 70, 'ON MY WAY! 🚗💨', {
    bg: '#38bdf8',
    border: '#ffffff',
    textColor: '#ffffff'
  });

  // Punchline Banner
  const banW = 440;
  const banH = 70;
  const banX = (W - banW) / 2;
  const banY = H - 190;
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

  // Contractor sleeping in cozy bed on the left
  const bedX = 140;
  const bedY = 360;
  drawBedWithContractor(ctx, bedX, bedY, t);

  // Ava on the right standing guard and catching falling money bags!
  const avaX = W - 120;
  const avaY = 380;
  drawAvaRobot(ctx, avaX, avaY, {
    scale: 1.1,
    t: t
  });

  // Stack of Money Bags next to Ava!
  drawFlyingMoneyBag(ctx, avaX - 45, avaY - 20, t * 0.5, '$8k');
  drawFlyingMoneyBag(ctx, avaX - 45, avaY - 60, (t + 1) * 0.5, '$8k');

  // Big Green Revenue Metric Card
  const cardW = 440;
  const cardH = 130;
  const cardX = (W - cardW) / 2;
  const cardY = 120;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 2.5;
  roundRect(ctx, cardX, cardY, cardW, cardH, 18, true, true);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MONTHLY RECOVERED REVENUE:', W / 2, cardY + 36);

  ctx.fillStyle = '#c8ff00';
  ctx.font = '900 52px "Space Grotesk", sans-serif';
  ctx.fillText('+$44,800', W / 2, cardY + 92);

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillText('✓ 14 AFTER-HOURS JOBS SAVED THIS MONTH', W / 2, cardY + 115);
  ctx.restore();
}

// --- SCENE 9: LIVE DEMO DIALER (53.1s - 58.5s) ---
// Voiceover: "Call the demo number on screen right now to hear Ava live..."
function renderTasklessScene9_LiveDemoDialer(t) {
  renderStoryPill('📞 ACT 5: TEST AVA LIVE RIGHT NOW', 'FLORIDA DEDICATED DEMO LINE');

  // Ava pointing up at the phone number
  const avaX = W / 2 - 100;
  const avaY = H - 260;
  drawAvaRobot(ctx, avaX, avaY, {
    scale: 1.2,
    t: t
  });

  drawSpeechBubble(ctx, avaX + 90, avaY - 140, 'DIAL ME NOW! 📞', {
    bg: '#22c55e',
    border: '#ffffff',
    textColor: '#ffffff'
  });

  // Giant Friendly Clickable Phone Card
  const cardW = 460;
  const cardH = 260;
  const cardX = (W - cardW) / 2;
  const cardY = 120;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  roundRect(ctx, cardX, cardY, cardW, cardH, 20, true, true);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 14px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PICK UP YOUR CELL & DIAL RIGHT NOW:', W / 2, cardY + 44);

  // Phone Number Pill
  const numW = cardW - 40;
  const numH = 84;
  const numX = cardX + 20;
  const numY = cardY + 65;
  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  roundRect(ctx, numX, numY, numW, numH, 16, true, true);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 36px "JetBrains Mono", monospace';
  ctx.fillText('(561) 813-8602', W / 2, numY + 48);

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText('● ONLINE 24/7 · ANSWERS IN 0.8 SECONDS', W / 2, numY + 72);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.fillText('Experience real AI voice triage on your own phone.', W / 2, cardY + 185);
  ctx.fillText('No sales pitch — just instant live technology.', W / 2, cardY + 215);
  ctx.restore();
}

// --- SCENE 10: VIRAL ACTION CARD (58.5s - 63.0s) ---
// Voiceover: "...or comment 'AVA' below for free instant access."
function renderTasklessScene10_TryTasklessCTA(t) {
  renderStoryPill('⚡ GET INSTANT ACCESS', 'VANTORX SOLUTIONS');

  const cardW = 460;
  const cardH = 500;
  const cardX = (W - cardW) / 2;
  const cardY = 110;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
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

  // Giant High-Contrast Action Button
  const btnW = cardW - 50;
  const btnH = 64;
  const btnX = cardX + 25;
  const btnY = cardY + 345;
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, btnX, btnY, btnW, btnH, 32, true, false);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 18px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('COMMENT "AVA" ON THIS REEL', W / 2, btnY + 40);

  ctx.fillStyle = '#c8ff00';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillText('We\\'ll DM you the free instant setup blueprint.', W / 2, cardY + 440);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.fillText('Or dial demo: (561) 813-8602', W / 2, cardY + 470);
  ctx.restore();
}

// --- INITIAL HERO POSTER CARD ON PAUSE / LOAD (t === 0) ---
function renderStudioHeroPosterCard(storyType) {
  renderTasklessScene1_NightPhone(1.2);
}
`;

// Replace previous scene rendering routines with the new stick figure story scenes
const oldScenesRegex = /\/\/ =========================================================================\s*\/\/ 🎬 CINEMATIC TASKLESS\.AI MOTION GRAPHICS ENGINE[\s\S]*?function renderStudioHeroPosterCard\(storyType\) \{[\s\S]*?\}/;
if (oldScenesRegex.test(content)) {
  content = content.replace(oldScenesRegex, storyScenesCode.trim());
  console.log('✓ Successfully replaced scenes with Immersive Stick Figure Story Engine');
} else {
  console.warn('Could not match oldScenesRegex - trying fallback find');
  const startIdx = content.indexOf('function renderTasklessScene1_NightPhone');
  const endIdx = content.indexOf('function renderKineticSubtitles');
  if (startIdx !== -1 && endIdx !== -1) {
    content = content.slice(0, startIdx) + storyScenesCode.trim() + '\n\n' + content.slice(endIdx);
    console.log('✓ Replaced scenes using slice indices');
  } else {
    console.error('Failed to locate scenes start/end');
  }
}

// 4. CALIBRATE SOUND EFFECT TIMESTAMPS IN renderFrame
const sfxTimingCode = `
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
`;

const oldSfxTimingRegex = /\/\/ SFX Triggers calibrated to exact scene cuts[\s\S]*?playedSfxMap\['ios_ping'\] = true; \}/;
if (oldSfxTimingRegex.test(content)) {
  content = content.replace(oldSfxTimingRegex, sfxTimingCode.trim());
  console.log('✓ Calibrated story SFX triggers');
}

fs.writeFileSync(targetHtml, content, 'utf8');
console.log('Successfully written upgraded reel-creator.html with Immersive Stick Figure Story!');
