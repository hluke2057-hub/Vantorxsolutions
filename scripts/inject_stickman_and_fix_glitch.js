const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetFile = path.resolve('website/demo/reel-creator.html');
let html = fs.readFileSync(targetFile, 'utf8');

// ==============================================================
// 1. CODE FOR STICK FIGURE ENGINE & DYNAMIC STORIES
// ==============================================================
const stickmanAndStoriesCode = `
// =============================================================
// 🎭 QUALITY STICK FIGURE ANIMATION & CHARACTER STORYTELLING ENGINE
// =============================================================

function drawStickFigure(ctx, x, y, opts) {
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
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (opts.glow) {
    ctx.shadowColor = opts.glow;
    ctx.shadowBlur = 16;
  }

  const headRadius = 24;
  const headCenterY = -115;
  const shoulderY = -80;
  const hipY = 0;

  // 1. Spine / Torso
  ctx.beginPath();
  ctx.moveTo(0, shoulderY);
  ctx.lineTo(0, hipY);
  ctx.stroke();

  // 2. Head
  ctx.beginPath();
  ctx.arc(0, headCenterY, headRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0b111e';
  ctx.fill();
  ctx.stroke();

  // Expressive Face
  ctx.fillStyle = opts.eyeColor || '#ffffff';
  if (opts.expression === 'worried') {
    ctx.beginPath();
    ctx.arc(5, headCenterY - 4, 3, 0, Math.PI * 2);
    ctx.arc(14, headCenterY - 4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(9, headCenterY + 11, 7, Math.PI * 1.1, Math.PI * 1.9, false);
    ctx.stroke();
    // Flying Sweat Drops
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(26, headCenterY - 12 + Math.sin(anim * 8) * 5, 4, 0, Math.PI * 2);
    ctx.arc(32, headCenterY - 4 + Math.cos(anim * 8) * 4, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (opts.expression === 'happy') {
    ctx.beginPath();
    ctx.arc(7, headCenterY - 2, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7, headCenterY + 5, 8, 0, Math.PI, false);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(7, headCenterY - 2, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Head Props
  if (opts.headProp === 'hard_hat') {
    ctx.save();
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, headCenterY - 5, headRadius + 4, Math.PI * 1.05, Math.PI * 1.95, false);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-headRadius - 10, headCenterY - 5);
    ctx.lineTo(headRadius + 16, headCenterY - 5);
    ctx.stroke();
    ctx.restore();
  } else if (opts.headProp === 'headset') {
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, headCenterY, headRadius + 4, Math.PI * 0.9, Math.PI * 1.9);
    ctx.stroke();
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(-headRadius - 3, headCenterY + 4, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-headRadius - 3, headCenterY + 4);
    ctx.lineTo(12, headCenterY + 15);
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(14, headCenterY + 15, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 4. Body Poses & Limbs
  if (pose === 'ladder_climb') {
    const legWobble = Math.sin(anim * 4) * 8;
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(-20, hipY + 40 + legWobble);
    ctx.lineTo(-20, hipY + 85);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(20, hipY + 40 - legWobble);
    ctx.lineTo(20, hipY + 85);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, shoulderY);
    ctx.lineTo(-32, shoulderY - 15);
    ctx.lineTo(-45, shoulderY - 32);
    ctx.stroke();

    const armShake = Math.sin(anim * 10) * 8;
    ctx.beginPath();
    ctx.moveTo(0, shoulderY);
    ctx.lineTo(32, shoulderY + 8 + armShake);
    ctx.lineTo(50, shoulderY + 22 + armShake);
    ctx.stroke();

    ctx.save();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(50, shoulderY + 22 + armShake);
    ctx.lineTo(70, shoulderY + 32 + armShake);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(72, shoulderY + 33 + armShake, 6, 0, Math.PI * 1.5);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 14;
    ctx.fillRect(8, hipY - 14, 12, 18);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    const ringPulse = (anim * 8) % 1;
    ctx.beginPath();
    ctx.arc(14, hipY - 5, 14 + ringPulse * 12, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(14, hipY - 5, 20 + ringPulse * 14, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();
    ctx.restore();

  } else if (pose === 'panicked_phone') {
    const pace = Math.sin(anim * 6) * 6;
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(-15 + pace, hipY + 42);
    ctx.lineTo(-12 + pace, hipY + 85);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(15 - pace, hipY + 42);
    ctx.lineTo(18 - pace, hipY + 85);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, shoulderY);
    ctx.lineTo(-35, shoulderY - 25);
    ctx.lineTo(-45, headCenterY - 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, shoulderY);
    ctx.lineTo(24, shoulderY - 12);
    ctx.lineTo(12, headCenterY + 4);
    ctx.stroke();

    ctx.save();
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(14, headCenterY - 8, 8, 14);
    ctx.restore();

  } else if (pose === 'ava_dispatch') {
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(-14, hipY + 45);
    ctx.lineTo(-15, hipY + 90);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(14, hipY + 45);
    ctx.lineTo(15, hipY + 90);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, shoulderY);
    ctx.lineTo(-22, shoulderY - 18);
    ctx.lineTo(-headRadius - 2, headCenterY + 4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, shoulderY);
    ctx.lineTo(32, shoulderY + 12);
    ctx.lineTo(46, shoulderY + 4);
    ctx.stroke();

    ctx.save();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 18;
    ctx.strokeRect(48, shoulderY - 18, 52, 36);
    ctx.fillRect(48, shoulderY - 18, 52, 36);

    ctx.fillStyle = '#34d399';
    ctx.font = '900 11px Inter';
    ctx.fillText('DISPATCH', 52, shoulderY - 5);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 9px monospace';
    ctx.fillText('0.8s SMS', 52, shoulderY + 8);
    ctx.restore();

  } else if (pose === 'run_cash') {
    const runCycle = Math.sin(anim * 8);
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(-28 * runCycle, hipY + 35);
    ctx.lineTo(-38 * runCycle, hipY + 80);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(28 * runCycle, hipY + 35);
    ctx.lineTo(38 * runCycle, hipY + 80);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, shoulderY);
    ctx.lineTo(25, shoulderY - 20);
    ctx.lineTo(35, shoulderY - 40);
    ctx.stroke();

    ctx.save();
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(45, shoulderY - 45, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#064e3b';
    ctx.font = '900 20px Space Grotesk';
    ctx.textAlign = 'center';
    ctx.fillText('$', 45, shoulderY - 38);
    ctx.restore();
  }

  ctx.restore();
}

// -------------------------------------------------------------
// DYNAMIC STORY DISPATCHER (0.00s - 18.00s)
// -------------------------------------------------------------
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

// STORY 1: COSMIC LIGHT
function renderStory1_LaserSpeed(t) {
  renderTopPill('⚡ SPEED OF LIGHT: 186,000 MILES/SEC');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 10;
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.arc(cx, cy, 140, Math.PI * 0.8, Math.PI * 0.8 + (t / 4.5) * Math.PI * 1.4);
  ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.font = '900 52px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.fillText('186,000', cx, cy - 10);
  ctx.fillStyle = '#f59e0b'; ctx.font = '700 20px Space Grotesk';
  ctx.fillText('MILES PER SECOND', cx, cy + 30);
  ctx.restore();
}

function renderStory1_MoonImpact(t) {
  renderTopPill('🌕 REACHES THE MOON IN 2.6 SECONDS');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(cx, cy, 100, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  const pulse = (Math.sin(t * 12) + 1) * 12;
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 6;
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.arc(cx, cy, 100 + pulse, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.font = '900 36px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('2.6 SECONDS', cx, cy + 12);
  ctx.restore();
}

function renderStory1_SaturnDeepSpace(t) {
  renderTopPill('🪐 2 BILLION MILES TO SATURN IN 3 HOURS');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(cx, cy, 70, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.7)'; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.ellipse(cx, cy, 150, 40, -Math.PI * 0.15, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.font = '900 32px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('2,000,000,000 MILES', cx, cy + 120);
  ctx.restore();
}

// STORY 2: FALCON DIVE
function renderStory2_FalconHighAltitude(t) {
  renderTopPill('🦅 NATURE\\'S FASTEST WEAPON: PEREGRINE FALCON');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, 120, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 140, cy); ctx.lineTo(cx + 140, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - 140); ctx.lineTo(cx, cy + 140); ctx.stroke();
  ctx.fillStyle = '#38bdf8'; ctx.font = '900 48px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('ALT: 3,500 FT', cx, cy - 20);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 22px JetBrains Mono';
  ctx.fillText('LOCKING TARGET...', cx, cy + 30);
  ctx.restore();
}

function renderStory2_FalconDiveHUD(t) {
  renderTopPill('⚡ DIVE SPEED: 242 MILES PER HOUR');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.fillStyle = '#ffffff'; ctx.font = '900 72px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 25;
  ctx.fillText('242 MPH', cx, cy);
  ctx.fillStyle = '#38bdf8'; ctx.font = '800 24px Space Grotesk';
  ctx.fillText('VERTICAL STOOP DIVE', cx, cy + 45);
  ctx.restore();
}

function renderStory2_FalconReflex15ms(t) {
  renderTopPill('⏱️ 15 MILLISECONDS NERVOUS REFLEX');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.strokeStyle = '#34d399'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.arc(cx, cy, 130, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#34d399'; ctx.font = '900 64px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.fillText('15ms', cx, cy + 15);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 20px Space Grotesk';
  ctx.fillText('STRIKE ACCURACY: 100%', cx, cy + 60);
  ctx.restore();
}

// STORY 3: FORMULA 1 PIT STOP
function renderStory3_F1StartingGridLights(t) {
  renderTopPill('🏎️ FORMULA 1 WORLD RECORD PIT STOP');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(cx - 160 + i * 80, cy - 30, 28, 0, Math.PI * 2);
    ctx.fillStyle = (t > i * 0.7) ? '#ef4444' : '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 4; ctx.stroke();
  }
  ctx.fillStyle = '#ffffff'; ctx.font = '800 24px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('20 CREW MEMBERS · 4 TIRES', cx, cy + 60);
  ctx.restore();
}

function renderStory3_F1Stopwatch180(t) {
  renderTopPill('⏱️ 1.80 SECONDS COMPLETE TIRE SWAP');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.fillStyle = '#fbbf24'; ctx.font = '900 84px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 30;
  ctx.fillText('1.80s', cx, cy + 10);
  ctx.fillStyle = '#ffffff'; ctx.font = '800 22px Space Grotesk';
  ctx.fillText('MCLAREN F1 WORLD RECORD', cx, cy + 55);
  ctx.restore();
}

function renderStory3_F1SpinningTire(t) {
  renderTopPill('⚙️ ZERO HESITATION · PURE EFFICIENCY');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.translate(cx, cy); ctx.rotate(t * 10);
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.arc(0, 0, 90, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 6; i++) {
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(i * Math.PI / 3) * 90, Math.sin(i * Math.PI / 3) * 90);
    ctx.stroke();
  }
  ctx.restore();
}

// STORY 4: BRAIN & AI
function renderStory4_BrainSynapses(t) {
  renderTopPill('🧠 86 BILLION NEURONS: 13MS SYNAPTIC FIRING');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI / 4 + t * 0.5;
    const nx = cx + Math.cos(angle) * 100;
    const ny = cy + Math.sin(angle) * 70;
    ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny); ctx.stroke();
    ctx.fillStyle = '#c084fc'; ctx.shadowColor = '#c084fc'; ctx.shadowBlur = 15;
    ctx.beginPath(); ctx.arc(nx, ny, 8, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#ffffff'; ctx.font = '900 38px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('13 MILLISECONDS', cx, cy + 120);
  ctx.restore();
}

function renderStory4_ChatGptTerminal(t) {
  renderTopPill('🤖 CHATGPT & AI SEARCH REVOLUTION');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
  ctx.strokeRect(cx - 180, cy - 80, 360, 160);
  ctx.fillRect(cx - 180, cy - 80, 360, 160);
  ctx.fillStyle = '#38bdf8'; ctx.font = '800 16px monospace'; ctx.textAlign = 'left';
  ctx.fillText('> user: Best AC contractor near me?', cx - 160, cy - 35);
  ctx.fillStyle = '#34d399';
  ctx.fillText('> ai: Recommending Titan Air #1', cx - 160, cy + 15);
  ctx.restore();
}

function renderStory4_AiCitationRank1(t) {
  renderTopPill('🏆 RANK #1 IN AI OVERVIEWS & PERPLEXITY');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.fillStyle = '#f59e0b'; ctx.font = '900 76px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 25;
  ctx.fillText('#1 CITED', cx, cy + 10);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 22px Inter';
  ctx.fillText('ChatGPT · Perplexity · Gemini', cx, cy + 55);
  ctx.restore();
}

// STORY 5: SATURN ROCKET
function renderStory5_ApolloCountdown(t) {
  renderTopPill('🚀 APOLLO 11 MOON LANDING MISSION');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.fillStyle = '#ef4444'; ctx.font = '900 64px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 20;
  ctx.fillText('T-MINUS 0:03', cx, cy);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 22px Space Grotesk';
  ctx.fillText('7.5 MILLION LBS OF THRUST', cx, cy + 45);
  ctx.restore();
}

function renderStory5_RocketExhaust(t) {
  renderTopPill('🔥 24,000 MPH ESCAPE VELOCITY');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = (i % 2 === 0) ? '#f59e0b' : '#ef4444';
    ctx.beginPath(); ctx.arc(cx, cy + i * 20, 40 - i * 5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#ffffff'; ctx.font = '900 48px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('24,000 MPH', cx, cy - 60);
  ctx.restore();
}

function renderStory5_Apollo4kbRAM(t) {
  renderTopPill('💾 NASA LANDED ON THE MOON WITH 4KB RAM');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.fillStyle = '#38bdf8'; ctx.font = '900 74px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 25;
  ctx.fillText('4 KB RAM', cx, cy + 10);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 20px Space Grotesk';
  ctx.fillText('LESS MEMORY THAN A MICROWAVE', cx, cy + 55);
  ctx.restore();
}

// STORY 6: LIGHTNING
function renderStory6_LightningStorm(t) {
  renderTopPill('⚡ 1 BILLION VOLTS: NATURE\\'S ELECTRIC PLASMA');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 6;
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 120); ctx.lineTo(cx - 30, cy - 40); ctx.lineTo(cx + 20, cy);
  ctx.lineTo(cx - 20, cy + 60); ctx.lineTo(cx + 40, cy + 130);
  ctx.stroke();
  ctx.restore();
}

function renderStory6_OneBillionVolts(t) {
  renderTopPill('💥 1.0 GV SURGE IN 30 MICROSECONDS');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.fillStyle = '#38bdf8'; ctx.font = '900 70px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 30;
  ctx.fillText('1.0 GV', cx, cy + 10);
  ctx.fillStyle = '#ffffff'; ctx.font = '800 22px Space Grotesk';
  ctx.fillText('300,000 AMPERES OF CURRENT', cx, cy + 55);
  ctx.restore();
}

function renderStory6_Thermal50kDegrees(t) {
  renderTopPill('🔥 50,000°F (5X HOTTER THAN THE SUN)');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.fillStyle = '#fbbf24'; ctx.font = '900 64px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 25;
  ctx.fillText('50,000°F', cx, cy + 10);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 20px Inter';
  ctx.fillText('5X HOTTER THAN SUN CORONA', cx, cy + 55);
  ctx.restore();
}

// STORY 7: NIAGARA
function renderStory7_NiagaraWaterfall(t) {
  renderTopPill('🌊 NIAGARA FALLS: 750,000 GALLONS PER MINUTE');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.fillStyle = '#38bdf8';
  for (let i = 0; i < 12; i++) {
    const wy = cy - 80 + ((t * 80 + i * 20) % 180);
    ctx.fillRect(cx - 140 + i * 24, wy, 16, 25);
  }
  ctx.fillStyle = '#ffffff'; ctx.font = '900 36px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('750,000 GPM', cx, cy + 120);
  ctx.restore();
}

function renderStory7_GallonsMeter750k(t) {
  renderTopPill('💧 1,200 SWIMMING POOLS POURED EVERY MINUTE');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.fillStyle = '#38bdf8'; ctx.font = '900 68px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.fillText('1,200 POOLS', cx, cy + 10);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 22px Space Grotesk';
  ctx.fillText('EVERY 60 SECONDS', cx, cy + 55);
  ctx.restore();
}

function renderStory7_BurstPipePressure(t) {
  renderTopPill('⚠️ 120 PSI BURST WATER LINE = FINISHED BASEMENT FLOOD');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.fillStyle = '#ef4444'; ctx.font = '900 70px JetBrains Mono'; ctx.textAlign = 'center';
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 25;
  ctx.fillText('120 PSI', cx, cy + 10);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 20px Space Grotesk';
  ctx.fillText('600 GALLONS / HOUR IN LIVING ROOM', cx, cy + 55);
  ctx.restore();
}

// UNIVERSAL GLITCH CONTRAST
function renderUniversalGlitchContrast(t) {
  renderTopPill('⚠️ YET CONTRACTORS TAKE 4+ HOURS TO CALLBACK');
  const cx = W / 2; const cy = H * 0.40;
  ctx.save();
  ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
  ctx.fillRect(0, 0, W, H);
  drawStickFigure(ctx, cx, cy + 20, {
    pose: 'panicked_phone',
    expression: 'worried',
    color: '#f8fafc',
    scale: 1.5,
    anim: t
  });
  ctx.fillStyle = '#f87171'; ctx.font = '900 32px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('VOICEMAIL... PLEASE HOLD', cx, cy - 130);
  ctx.fillStyle = '#fbbf24'; ctx.font = '800 20px monospace';
  ctx.fillText('LOST REVENUE: $8,500+', cx, cy + 130);
  ctx.restore();
}
`;

// ==============================================================
// 2. UPGRADED SCENES 6, 7, 8, 9 WITH ANIMATED STICK FIGURES
// ==============================================================
const upgradedScenesCode = `
// -------------------------------------------------------------
// SCENE 6 (22.50s - 26.80s): Panicked Homeowner & Spraying Pipe
// -------------------------------------------------------------
function renderScene6_IncomingEmergencyCall(t) {
  const relT = t - 22.5;
  renderTopPill('🚨 INCOMING HIGH-TICKET EMERGENCY CALL');
  const cx = W / 2; const cy = H * 0.38;

  ctx.save();
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.moveTo(cx - 120, cy - 140); ctx.lineTo(cx + 120, cy - 140); ctx.stroke();

  ctx.fillStyle = '#38bdf8'; ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 15;
  for (let i = 0; i < 7; i++) {
    const dropY = cy - 130 + ((relT * 120 + i * 22) % 110);
    ctx.beginPath();
    ctx.arc(cx - 20 + (i - 3) * 10, dropY, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawStickFigure(ctx, cx, cy + 25, {
    pose: 'panicked_phone',
    expression: 'worried',
    color: '#ffffff',
    scale: 1.5,
    anim: relT
  });

  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
  ctx.strokeRect(cx - 160, cy + 120, 320, 65);
  ctx.fillRect(cx - 160, cy + 120, 320, 65);
  ctx.fillStyle = '#ffffff'; ctx.font = '800 18px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('"Water is pouring through ceiling!"', cx, cy + 148);
  ctx.fillStyle = '#38bdf8'; ctx.font = '700 13px JetBrains Mono';
  ctx.fillText('DIALING CONTRACTOR...', cx, cy + 170);
  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 7 (26.80s - 31.00s): Contractor On The Ladder Stickman
// -------------------------------------------------------------
function renderScene7_OnTheLadderNoAnswer(t) {
  const relT = t - 26.8;
  renderTopPill('🪜 ON A LADDER · CANNOT REACH THE PHONE');
  const cx = W / 2; const cy = H * 0.38;

  ctx.save();
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(cx - 45, cy - 160); ctx.lineTo(cx - 45, cy + 140);
  ctx.moveTo(cx + 45, cy - 160); ctx.lineTo(cx + 45, cy + 140);
  for (let y = cy - 140; y <= cy + 120; y += 45) {
    ctx.moveTo(cx - 45, y); ctx.lineTo(cx + 45, y);
  }
  ctx.stroke();

  drawStickFigure(ctx, cx, cy + 20, {
    pose: 'ladder_climb',
    headProp: 'hard_hat',
    expression: 'worried',
    color: '#f8fafc',
    scale: 1.5,
    anim: relT
  });

  ctx.fillStyle = '#ef4444'; ctx.font = '900 24px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 18;
  ctx.fillText('PHONE RINGING IN POCKET!', cx, cy - 175);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 16px Inter';
  ctx.fillText('Hands full · If you drop wrench, you lose $9,200', cx, cy + 165);
  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 8 (31.00s - 35.50s): Competitor Thief Running With Cash
// -------------------------------------------------------------
function renderScene8_HandedToCompetitorBurn(t) {
  const relT = t - 31.0;
  const burnTicket = (window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.ticket) ? window.ACTIVE_SCENARIO.ticket : '$9,200';
  renderTopPill('💸 ' + burnTicket + ' JOB HANDED TO YOUR COMPETITOR');
  const cx = W / 2; const cy = H * 0.38;

  ctx.save();
  const runOffset = Math.sin(relT * 3) * 60;
  drawStickFigure(ctx, cx + runOffset, cy + 10, {
    pose: 'run_cash',
    expression: 'happy',
    color: '#ef4444',
    scale: 1.5,
    anim: relT
  });

  ctx.fillStyle = '#ef4444'; ctx.font = '900 36px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 24;
  ctx.fillText('COMPETITOR ANSWERED 1ST', cx, cy - 140);
  ctx.fillStyle = '#fbbf24'; ctx.font = '800 22px JetBrains Mono';
  ctx.fillText('CONTRACT SIGNED: ' + burnTicket, cx, cy + 145);
  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 9 (35.50s - 40.00s): Meet Ava Heroine & Instant Dispatch
// -------------------------------------------------------------
function renderScene9_MeetAvaReveal(t) {
  const relT = t - 35.5;
  renderTopPill('⚡ MEET AVA: 24/7 AI PHONE RECEPTIONIST');
  const cx = W / 2; const cy = H * 0.38;

  ctx.save();
  const aura = (Math.sin(relT * 6) + 1) * 20;
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 30;
  ctx.beginPath(); ctx.arc(cx, cy - 30, 110 + aura, 0, Math.PI * 2); ctx.stroke();

  drawStickFigure(ctx, cx, cy + 15, {
    pose: 'ava_dispatch',
    headProp: 'headset',
    expression: 'happy',
    color: '#fbbf24',
    glow: '#f59e0b',
    scale: 1.6,
    anim: relT
  });

  ctx.fillStyle = '#34d399'; ctx.font = '900 34px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('ANSWERS IN 0.8 SECONDS', cx, cy - 150);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 17px Inter';
  ctx.fillText('Dispatches On-Call Tech · Checks Schedule · SMS Confirmation', cx, cy + 145);
  ctx.restore();
}
`;

// ==============================================================
// 3. ELEVATED 124 BPM SYNTHWAVE AUDIO ENGINE
// ==============================================================
const elevatedAudioCode = `
  // -----------------------------------------------------------
  // 🎵 ELEVATED 124 BPM SYNTHWAVE & TRAP AUDIO ENGINE
  // -----------------------------------------------------------
  let beatTimer = null;
  function startBackgroundBeat() {
    if (!audioCtx || !document.getElementById('chkEnableMusic').checked) return;
    stopBackgroundBeat();

    let step = 0;
    // 124 BPM = 121ms per 16th note
    beatTimer = setInterval(() => {
      if (!isPlaying || !audioCtx) return;
      const t = audioCtx.currentTime;

      // 1. Driving 808 Sub Kick on 1 and 3 (beats 0, 8)
      if (step % 8 === 0 || step % 16 === 6) {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.frequency.setValueAtTime(125, t);
        osc.frequency.exponentialRampToValueAtTime(38, t + 0.18);
        g.gain.setValueAtTime(0.28, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(g);
        g.connect(musicGainNode);
        osc.start(t);
        osc.stop(t + 0.18);
      }

      // 2. Snare / Clap on 2 and 4 (beats 4, 12)
      if (step % 8 === 4) {
        const snareNoise = audioCtx.createOscillator();
        const snareGain = audioCtx.createGain();
        snareNoise.type = 'triangle';
        snareNoise.frequency.setValueAtTime(220, t);
        snareGain.gain.setValueAtTime(0.14, t);
        snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        snareNoise.connect(snareGain);
        snareGain.connect(musicGainNode);
        snareNoise.start(t);
        snareNoise.stop(t + 0.12);
      }

      // 3. Syncopated Hi-Hats on every 16th note
      const hatOsc = audioCtx.createOscillator();
      const hatGain = audioCtx.createGain();
      hatOsc.type = 'square';
      hatOsc.frequency.setValueAtTime((step % 4 === 2) ? 10000 : 7500, t);
      hatGain.gain.setValueAtTime((step % 2 === 0) ? 0.025 : 0.012, t);
      hatGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
      hatOsc.connect(hatGain);
      hatGain.connect(musicGainNode);
      hatOsc.start(t);
      hatOsc.stop(t + 0.045);

      // 4. Synth Tension Bassline
      if (step % 4 === 0) {
        const bassOsc = audioCtx.createOscillator();
        const bassGain = audioCtx.createGain();
        const notes = [55, 65.4, 73.4, 82.4];
        const note = notes[Math.floor(step / 8) % notes.length];
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(note, t);
        bassGain.gain.setValueAtTime(0.08, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        bassOsc.connect(bassGain);
        bassGain.connect(musicGainNode);
        bassOsc.start(t);
        bassOsc.stop(t + 0.22);
      }

      step++;
    }, 121);
  }

  function stopBackgroundBeat() {
    if (beatTimer) {
      clearInterval(beatTimer);
      beatTimer = null;
    }
  }
`;

// ==============================================================
// 4. DAILY 2-REELS PRODUCTION SCHEDULER UI
// ==============================================================
const schedulerUiCode = `
      <!-- 🌞 DAILY 2-REELS PRODUCTION SCHEDULER 🌙 -->
      <div class="daily-reels-scheduler" style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 14px; padding: 14px 18px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 22px;">📅</span>
          <div>
            <div style="font-size: 13px; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.05em;">DAILY 2-REELS VIRAL PIPELINE</div>
            <div style="font-size: 12px; color: #94a3b8;">Guaranteed 0 repeated reels · Distinct stories, stickman animations & hooks</div>
          </div>
        </div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn-slot-drop" id="btnMorningSlot" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(245, 158, 11, 0.1)); border: 1px solid #f59e0b; color: #fbbf24; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <span>🌞 Drop #1: Morning (9:00 AM)</span>
          </button>
          <button type="button" class="btn-slot-drop" id="btnEveningSlot" style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.15); color: #94a3b8; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <span>🌙 Drop #2: Evening (5:00 PM)</span>
          </button>
        </div>
      </div>
`;

// ==============================================================
// 5. WIRE SCHEDULER JS
// ==============================================================
const schedulerJsWire = `
  // -----------------------------------------------------------
  // 📅 WIRE DAILY 2-REELS SCHEDULER (MORNING & EVENING SLOTS)
  // -----------------------------------------------------------
  const btnMorning = document.getElementById('btnMorningSlot');
  const btnEvening = document.getElementById('btnEveningSlot');

  if (btnMorning && btnEvening) {
    btnMorning.addEventListener('click', () => {
      btnMorning.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(245, 158, 11, 0.1))';
      btnMorning.style.borderColor = '#f59e0b';
      btnMorning.style.color = '#fbbf24';
      btnEvening.style.background = 'rgba(30, 41, 59, 0.7)';
      btnEvening.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      btnEvening.style.color = '#94a3b8';

      window.PRODUCT_ROTATION_INDEX = 0;
      const targetProd = window.PRODUCTS_MIND_QUEUE[0];
      buildReelAssetsForProduct(targetProd);
      updateGiantButtonMindState(targetProd);
    });

    btnEvening.addEventListener('click', () => {
      btnEvening.style.background = 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(56, 189, 248, 0.1))';
      btnEvening.style.borderColor = '#38bdf8';
      btnEvening.style.color = '#38bdf8';
      btnMorning.style.background = 'rgba(30, 41, 59, 0.7)';
      btnMorning.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      btnMorning.style.color = '#94a3b8';

      window.PRODUCT_ROTATION_INDEX = 1;
      const targetProd = window.PRODUCTS_MIND_QUEUE[1];
      buildReelAssetsForProduct(targetProd);
      updateGiantButtonMindState(targetProd);
    });
  }
`;

// Insertion logic:
// 1. Insert stickmanAndStoriesCode right before 'function renderScene1_LaserSpeedHook'
const scene1Target = 'function renderScene1_LaserSpeedHook';
if (html.includes(scene1Target)) {
  html = html.replace(scene1Target, () => stickmanAndStoriesCode + '\n' + scene1Target);
  console.log('✅ Injected Stickman Engine and Dynamic Stories before renderScene1');
}

// 2. Replace Scenes 6 to 9
const scene6Target = 'function renderScene6_IncomingEmergencyCall';
const scene10Target = 'function renderScene10_ConversationalTriage';
const s6Idx = html.indexOf(scene6Target);
const s10Idx = html.indexOf(scene10Target);

if (s6Idx !== -1 && s10Idx !== -1) {
  html = html.slice(0, s6Idx) + upgradedScenesCode + '\n' + html.slice(s10Idx);
  console.log('✅ Injected Upgraded Stickman Scenes 6, 7, 8, 9');
}

// 3. Replace background beat
const beatTargetStart = '// Synthesized Ambient Trap Beat';
const beatTargetEnd = '// Script Cues with Timestamps';
const bStart = html.indexOf(beatTargetStart);
const bEnd = html.indexOf(beatTargetEnd);

if (bStart !== -1 && bEnd !== -1) {
  html = html.slice(0, bStart) + elevatedAudioCode + '\n  ' + html.slice(bEnd);
  console.log('✅ Replaced audio beat with 124 BPM Synthwave Beat Synthesizer');
}

// 4. Inject 2-Reels Scheduler UI before #btnGiantGenerateReel
const giantBtnTag = '<div id="btnGiantGenerateReel"';
if (html.includes(giantBtnTag) && !html.includes('daily-reels-scheduler')) {
  html = html.replace(giantBtnTag, () => schedulerUiCode + '\n' + giantBtnTag);
  console.log('✅ Injected 2-Reels Scheduler UI');
}

// 5. Wire scheduler JS
const mindQueueInitTarget = 'updateGiantButtonMindState(window.PRODUCTS_MIND_QUEUE[0]);';
if (html.includes(mindQueueInitTarget)) {
  html = html.replace(mindQueueInitTarget, () => mindQueueInitTarget + '\n' + schedulerJsWire);
  console.log('✅ Wired 2-Reels Scheduler JS');
}

// 6. Test syntax with vm.Script BEFORE writing to file
const sIdx = html.indexOf('<script>');
const eIdx = html.lastIndexOf('</script>');
const jsCode = html.slice(sIdx + 8, eIdx);

try {
  new vm.Script(jsCode);
  console.log('🎉 VERIFIED: JS CODE COMPILES WITH ZERO SYNTAX ERRORS!');
  fs.writeFileSync(targetFile, html, 'utf8');
  console.log('✅ Successfully written upgraded website/demo/reel-creator.html!');
} catch (e) {
  console.error('❌ SYNTAX ERROR DETECTED, NOT WRITTEN:', e.message);
  const m = e.stack.match(/evalmachine\.<anonymous>:(\d+)/);
  if (m) {
    const lineNum = parseInt(m[1]);
    console.log('Error at line:', lineNum);
    const lines = jsCode.split(/\r?\n/);
    console.log(lines.slice(Math.max(0, lineNum - 5), lineNum + 5).map((l, i) => (lineNum - 5 + i + 1) + ': ' + l).join('\n'));
  }
  process.exit(1);
}
