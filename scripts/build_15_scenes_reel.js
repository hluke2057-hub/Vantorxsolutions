const fs = require('fs');
const path = require('path');

// 1. Load word timestamps
const wordsPath = path.resolve('website/demo/audio/word_timestamps.json');
const words = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));
console.log(`Loaded ${words.length} word timestamps.`);

const reelHtmlPath = path.resolve('website/demo/reel-creator.html');
let html = fs.readFileSync(reelHtmlPath, 'utf8');

// 2. Build 15-Scene Definition Array for UI
const scenesMeta = [
  { idx: 1, name: "Laser Speed Hook", range: "0:00 - 0:04", start: 0.0, end: 4.5, desc: "186,000 mi/s cybernetic laser speedometer" },
  { idx: 2, name: "3D Moon Impact", range: "0:04 - 0:08", start: 4.5, end: 8.2, desc: "238k miles lunar orbit & laser impact ring" },
  { idx: 3, name: "Deep Space Saturn", range: "0:08 - 0:13", start: 8.2, end: 13.5, desc: "Ringed gas giant & 1.8 billion miles voyage" },
  { idx: 4, name: "Contractor Glitch", range: "0:13 - 0:18", start: 13.5, end: 18.0, desc: "4-hour callback delay vs 2.9h deep space flight" },
  { idx: 5, name: "78% Stat Slam", range: "0:18 - 0:22", start: 18.0, end: 22.5, desc: "First responder stat slam & emerald shockwave" },
  { idx: 6, name: "Incoming $8.5k Call", range: "0:22 - 0:26", start: 22.5, end: 26.8, desc: "Vibrating 3D phone ringing with emergency repipe" },
  { idx: 7, name: "On The Ladder", range: "0:26 - 0:31", start: 26.8, end: 31.0, desc: "No answer at desk, 4 rings timeout" },
  { idx: 8, name: "The $8,000 Burn", range: "0:31 - 0:36", start: 31.0, end: 36.5, desc: "Emergency Red X, revenue vaporized to rival" },
  { idx: 9, name: "Meet Ava Voice AI", range: "0:36 - 0:40", start: 36.5, end: 40.5, desc: "0.8s answer speed, golden neural waveform" },
  { idx: 10, name: "Live Triage Chat", range: "0:40 - 0:44", start: 40.5, end: 44.0, desc: "Conversational qualification & calendar check" },
  { idx: 11, name: "Tech SMS Dispatch", range: "0:44 - 0:47", start: 44.0, end: 47.8, desc: "iOS lock screen alert to on-call tech Mark" },
  { idx: 12, name: "Competitor Closed", range: "0:47 - 0:50", start: 47.8, end: 50.8, desc: "Google search tab slammed shut with victory stamp" },
  { idx: 13, name: "Stop Dead Voicemails", range: "0:50 - 0:54", start: 50.8, end: 54.0, desc: "3D Operations dashboard, 0 missed calls" },
  { idx: 14, name: "Dial (561) 813-8602", range: "0:54 - 0:58", start: 54.0, end: 58.2, desc: "Massive glowing live phone test card" },
  { idx: 15, name: "Comment AVA & DM", range: "0:58 - 1:03", start: 58.2, end: 63.0, desc: "Instagram typing simulation & ManyChat instant DM" }
];

// Replace TOTAL_DURATION with 63.0
html = html.replace(/const TOTAL_DURATION = [0-9.]+;/, 'const TOTAL_DURATION = 63.0;');
html = html.replace(/<span id="totalDurationLabel">00:[0-9.]+<\/span>/, '<span id="totalDurationLabel">01:03</span>');

// Replace the UI scenes list
let newScenesHtml = '<div class="scenes-grid">\n';
scenesMeta.forEach(s => {
  newScenesHtml += `      <div class="scene-card" data-idx="${s.idx}" onclick="jumpToTime(${s.start})">
        <div class="scene-idx">${s.idx}</div>
        <div class="scene-meta">
          <div class="scene-name">${s.name}</div>
          <div class="scene-desc">${s.desc}</div>
        </div>
        <div class="scene-time">${s.range}</div>
      </div>\n`;
});
newScenesHtml += '    </div>';

html = html.replace(/<div class="scenes-grid">[\s\S]*?<\/div>[\s]*<\/div>[\s]*<!-- Audio/m, newScenesHtml + '\n    </div>\n    <!-- Audio');

// Build JavaScript code for WORD_TIMESTAMPS and the 15 scenes
const jsReplacement = `
// -------------------------------------------------------------
// 🎙️ PRECISE ELEVENLABS WORD-BY-WORD TIMESTAMPS (161 Spoken Words)
// -------------------------------------------------------------
const WORD_TIMESTAMPS = ${JSON.stringify(words, null, 2)};

// Dynamic Camera Shake & Transition Impacts
function getCameraShake(t) {
  let intensity = 0;
  // Punch pulses on every scene transition
  const cuts = [0.0, 4.5, 8.2, 13.5, 18.0, 22.5, 26.8, 31.0, 36.5, 40.5, 44.0, 47.8, 50.8, 54.0, 58.2];
  for (const c of cuts) {
    const dt = t - c;
    if (dt >= 0 && dt < 0.45) {
      intensity = Math.max(intensity, (1 - dt / 0.45) * 8.5);
    }
  }
  if (intensity === 0) return { x: 0, y: 0 };
  return {
    x: Math.sin(t * 60) * intensity,
    y: Math.cos(t * 52) * intensity
  };
}

let playedSfxMap = {};
function resetSfxFlags() {
  playedSfxMap = {};
}

// -------------------------------------------------------------
// 🎬 MASTER 15-SCENE MULTI-SCENE RENDER ENGINE (3-4s Cuts)
// -------------------------------------------------------------
function renderFrame(time) {
  window.renderFrame = renderFrame;
  ctx.save();
  ctx.clearRect(0, 0, W, H);

  // Apply Camera Shake
  const shake = getCameraShake(time);
  ctx.translate(shake.x, shake.y);

  // Background Cosmic Void
  const bgGrad = ctx.createRadialGradient(W / 2, H * 0.4, 40, W / 2, H / 2, H * 0.85);
  bgGrad.addColorStop(0, '#0a101f');
  bgGrad.addColorStop(0.5, '#04070d');
  bgGrad.addColorStop(1, '#010204');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(-20, -20, W + 40, H + 40);

  // Render 3D Warp Stars
  renderWarpStars(time);

  // SFX Triggers calibrated to exact scene cuts
  if (time >= 0.2 && !playedSfxMap['laser']) { playSfx('laser'); playedSfxMap['laser'] = true; }
  if (time >= 18.0 && !playedSfxMap['subdrop']) { playSfx('subdrop'); playedSfxMap['subdrop'] = true; }
  if (time >= 22.5 && !playedSfxMap['phone']) { playSfx('phone_ring'); playedSfxMap['phone'] = true; }
  if (time >= 44.0 && !playedSfxMap['ios_ping']) { playSfx('ios_ping'); playedSfxMap['ios_ping'] = true; }

  // 15 Fast-Paced Scene Switches (Every 3.0 - 4.5 seconds)
  if (time < 4.5) {
    renderScene1_LaserSpeedHook(time);
  } else if (time < 8.2) {
    renderScene2_MoonImpact(time);
  } else if (time < 13.5) {
    renderScene3_DeepSpaceSaturn(time);
  } else if (time < 18.0) {
    renderScene4_ContractorGlitchDelay(time);
  } else if (time < 22.5) {
    renderScene5_Stat78PercentSlam(time);
  } else if (time < 26.8) {
    renderScene6_IncomingEmergencyCall(time);
  } else if (time < 31.0) {
    renderScene7_OnTheLadderNoAnswer(time);
  } else if (time < 36.5) {
    renderScene8_HandedToCompetitorBurn(time);
  } else if (time < 40.5) {
    renderScene9_MeetAvaReveal(time);
  } else if (time < 44.0) {
    renderScene10_ConversationalTriage(time);
  } else if (time < 47.8) {
    renderScene11_TechSmsDispatch(time);
  } else if (time < 50.8) {
    renderScene12_CompetitorTabClosed(time);
  } else if (time < 54.0) {
    renderScene13_StopBleedingDashboard(time);
  } else if (time < 58.2) {
    renderScene14_DialDemoLineLive(time);
  } else {
    renderScene15_InstagramCommentManyChat(time);
  }

  // Word-by-Word Kinetic Caption Bar (Alex Hormozi Style)
  renderKineticSubtitles(time);

  // Cinematic Vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.28, W / 2, H / 2, H * 0.65);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(0.7, 'rgba(0,0,0,0.3)');
  vig.addColorStop(1, 'rgba(0,0,0,0.85)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  ctx.restore();
}

// Helper: 3D Warp Starfield
function renderWarpStars(t) {
  const warpSpeed = t < 18.0 ? (12 + Math.sin(t * 2) * 5) : 4;
  ctx.save();
  ctx.translate(W / 2, H / 2);

  for (const s of WARP_STARS) {
    s.prevZ = s.z;
    s.z -= warpSpeed;
    if (s.z <= 10) {
      s.z = 1000;
      s.prevZ = 1000;
      s.x = (Math.random() - 0.5) * W * 2.2;
      s.y = (Math.random() - 0.5) * H * 2.2;
    }

    const k = 420 / s.z;
    const px = s.x * k;
    const py = s.y * k;

    const prevK = 420 / s.prevZ;
    const prevPx = s.x * prevK;
    const prevPy = s.y * prevK;

    if (px > -W && px < W && py > -H && py < H) {
      const alpha = Math.min(1, (1000 - s.z) / 450);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = Math.max(1, (1 - s.z / 1000) * 3);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(prevPx, prevPy);
      ctx.lineTo(px, py);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// Helper: 3D Planetary Rings
function renderPlanetaryRings(ctx, rot, isBack) {
  ctx.save();
  ctx.rotate(-0.42);
  ctx.scale(1.0, 0.28);

  const startAngle = isBack ? Math.PI : 0;
  const endAngle = isBack ? Math.PI * 2 : Math.PI;

  const ringGrad = ctx.createLinearGradient(-190, 0, 190, 0);
  ringGrad.addColorStop(0, 'rgba(245, 158, 11, 0.7)');
  ringGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.5)');
  ringGrad.addColorStop(0.7, 'rgba(251, 191, 36, 0.8)');
  ringGrad.addColorStop(1, 'rgba(217, 119, 6, 0.6)');

  ctx.strokeStyle = ringGrad;
  ctx.lineWidth = 28;
  ctx.beginPath();
  ctx.arc(0, 0, 150, startAngle, endAngle);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 175, startAngle, endAngle);
  ctx.stroke();

  ctx.restore();
}

// Helper: Top Scene Indicator Pill
function renderTopPill(text) {
  ctx.save();
  const pillW = 440;
  const pillH = 34;
  const pillX = (W - pillW) / 2;
  const pillY = 32;

  ctx.fillStyle = 'rgba(11, 15, 25, 0.88)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
  ctx.lineWidth = 1;
  roundRect(ctx, pillX, pillY, pillW, pillH, 17, true, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 11.5px JetBrains Mono';
  ctx.fillText(text, W / 2, pillY + 22);
  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 1 (0.00s - 4.50s): Cybernetic Laser Speedometer
// -------------------------------------------------------------
function renderScene1_LaserSpeedHook(t) {
  renderTopPill('⚡ SPEED OF LIGHT: 186,000 MILES/SEC');
  const cx = W / 2;
  const cy = H * 0.42;

  // Animated Digital Tachometer Arc
  ctx.save();
  ctx.translate(cx, cy);
  const prog = Math.min(1, t / 3.5);
  const speedVal = Math.floor(prog * 186000);

  // Outer Arc
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(0, 0, 140, Math.PI * 0.75, Math.PI * 2.25);
  ctx.stroke();

  // Glowing Speed Arc
  ctx.strokeStyle = '#38bdf8';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.arc(0, 0, 140, Math.PI * 0.75, Math.PI * 0.75 + (Math.PI * 1.5 * prog));
  ctx.stroke();

  // Speed Readout
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '800 13px JetBrains Mono';
  ctx.fillText('VELOCITY METRIC', 0, -45);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 46px Space Grotesk';
  ctx.fillText(speedVal.toLocaleString(), 0, 15);

  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 16px JetBrains Mono';
  ctx.fillText('MILES / SECOND', 0, 52);

  // Laser Core Beam pulsing
  const laserW = Math.sin(t * 20) * 8 + 24;
  ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.fillRect(-laserW, 110, laserW * 2, 160);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-laserW / 3, 110, laserW * 0.66, 160);
  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 2 (4.50s - 8.20s): 3D Moon Orbit & Lunar Laser Impact
// -------------------------------------------------------------
function renderScene2_MoonImpact(t) {
  const relT = t - 4.5;
  renderTopPill('🌕 EARTH ➔ MOON: 2.8 SECONDS · 238,900 MI');
  const cx = W / 2;
  const cy = H * 0.42;

  ctx.save();
  ctx.translate(cx, cy);

  // Orbit path ring
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.ellipse(0, 0, 210, 80, 0.2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Moon Sphere with craters
  const moonR = 86;
  const moonGrad = ctx.createRadialGradient(-30, -30, 10, 0, 0, moonR);
  moonGrad.addColorStop(0, '#f1f5f9');
  moonGrad.addColorStop(0.5, '#cbd5e1');
  moonGrad.addColorStop(0.85, '#64748b');
  moonGrad.addColorStop(1, '#1e293b');

  ctx.fillStyle = moonGrad;
  ctx.beginPath();
  ctx.arc(0, 0, moonR, 0, Math.PI * 2);
  ctx.fill();

  // Lunar Craters
  ctx.fillStyle = 'rgba(30, 41, 59, 0.55)';
  [[-25, -20, 14], [18, -35, 10], [-10, 25, 18], [35, 15, 12], [-45, 10, 8]].forEach(([x, y, r]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Laser Strike Impact Shockwave at 2.8s relative (t = 7.3s)
  if (relT >= 1.5) {
    const shockProg = (relT - 1.5) / 1.8;
    const shockR = shockProg * 180;
    ctx.strokeStyle = 'rgba(56, 189, 248, ' + (1 - shockProg) + ')';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, shockR, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Countdown timer card
  ctx.restore();
  const cardW = 380;
  const cardH = 50;
  const cardX = (W - cardW) / 2;
  const cardY = H * 0.58;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, cardX, cardY, cardW, cardH, 12, true, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 15px JetBrains Mono';
  const remaining = Math.max(0, 2.8 - relT).toFixed(1);
  ctx.fillText('LASER FLIGHT TIME: ' + remaining + 's / 2.8s', W / 2, cardY + 31);
}

// -------------------------------------------------------------
// SCENE 3 (8.20s - 13.50s): Deep Space Ringed Gas Giant (2B Miles)
// -------------------------------------------------------------
function renderScene3_DeepSpaceSaturn(t) {
  renderTopPill('🪐 DEEP SPACE VOYAGE: 1.8 BILLION MILES');
  const cx = W / 2;
  const cy = H * 0.40;
  const planetRot = t * 0.4;

  ctx.save();
  ctx.translate(cx, cy);

  // Outer Atmosphere Nebula Glow
  const atmoGlow = ctx.createRadialGradient(0, 0, 60, 0, 0, 210);
  atmoGlow.addColorStop(0, 'rgba(168, 85, 247, 0.7)');
  atmoGlow.addColorStop(0.4, 'rgba(59, 130, 246, 0.3)');
  atmoGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = atmoGlow;
  ctx.beginPath();
  ctx.arc(0, 0, 210, 0, Math.PI * 2);
  ctx.fill();

  // Planetary Rings Behind Planet
  renderPlanetaryRings(ctx, planetRot, true);

  // Shaded Gas Giant Sphere
  const sphereR = 82;
  const planetGrad = ctx.createRadialGradient(-35, -35, 15, 0, 0, sphereR);
  planetGrad.addColorStop(0, '#fde047');
  planetGrad.addColorStop(0.3, '#f59e0b');
  planetGrad.addColorStop(0.65, '#9333ea');
  planetGrad.addColorStop(0.95, '#1e1b4b');
  planetGrad.addColorStop(1, '#050510');
  ctx.fillStyle = planetGrad;
  ctx.beginPath();
  ctx.arc(0, 0, sphereR, 0, Math.PI * 2);
  ctx.fill();

  // Planetary Rings in Front of Planet
  renderPlanetaryRings(ctx, planetRot, false);
  ctx.restore();

  // Telemetry Box
  const teleW = 420;
  const teleH = 68;
  const teleX = (W - teleW) / 2;
  const teleY = H * 0.58;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, teleX, teleY, teleW, teleH, 14, true, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 13px JetBrains Mono';
  ctx.fillText('SPACE TRANSIT TIME: UNDER 3 HOURS', W / 2, teleY + 28);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 15px Space Grotesk';
  ctx.fillText('Distance: 1,800,000,000 Miles from Earth', W / 2, teleY + 52);
}

// -------------------------------------------------------------
// SCENE 4 (13.50s - 18.00s): Contractor 4-Hour Callback Delay Glitch
// -------------------------------------------------------------
function renderScene4_ContractorGlitchDelay(t) {
  renderTopPill('⚠️ THE CONTRACTOR CALLBACK GRAVEYARD');

  // Red strobe glitch overlay
  const flash = Math.sin(t * 16) > 0 ? 0.15 : 0.05;
  ctx.fillStyle = 'rgba(239, 68, 68, ' + flash + ')';
  ctx.fillRect(0, 0, W, H);

  // Big Clock Centerpiece
  const cx = W / 2;
  const cy = H * 0.38;
  ctx.save();
  ctx.translate(cx, cy);

  // Clock Face
  ctx.fillStyle = '#0a0f1d';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.arc(0, 0, 95, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Spinning Hands
  const handAngle = t * 14;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(handAngle) * 65, Math.sin(handAngle) * 65);
  ctx.stroke();

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(handAngle * 0.15) * 45, Math.sin(handAngle * 0.15) * 45);
  ctx.stroke();
  ctx.restore();

  // Comparison Card
  const compW = 440;
  const compH = 110;
  const compX = (W - compW) / 2;
  const compY = H * 0.54;
  ctx.fillStyle = 'rgba(20, 10, 15, 0.95)';
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
  ctx.lineWidth = 2;
  roundRect(ctx, compX, compY, compW, compH, 16, true, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f87171';
  ctx.font = '800 13px JetBrains Mono';
  ctx.fillText('🚨 BRUTAL INDUSTRY BENCHMARK', W / 2, compY + 28);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px Space Grotesk';
  ctx.fillText('4 HOURS 12 MINUTES', W / 2, compY + 62);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 13px Inter';
  ctx.fillText('Average trade contractor emergency callback delay', W / 2, compY + 88);
}

// -------------------------------------------------------------
// SCENE 5 (18.00s - 22.50s): The 78% First-Responder Stat Slam
// -------------------------------------------------------------
function renderScene5_Stat78PercentSlam(t) {
  const relT = t - 18.0;
  renderTopPill('🏆 SPEED-TO-LEAD LAW');

  const cx = W / 2;
  const cy = H * 0.40;

  // Expanding shockwave ring
  const ringR = Math.min(260, relT * 120);
  ctx.strokeStyle = 'rgba(16, 185, 129, ' + Math.max(0, 1 - ringR / 260) + ')';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
  ctx.stroke();

  // Giant Stat 78%
  ctx.save();
  const slamScale = Math.max(1.0, 1.45 - relT * 0.8);
  ctx.translate(cx, cy);
  ctx.scale(slamScale, slamScale);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#10b981';
  ctx.shadowColor = '#10b981';
  ctx.shadowBlur = 35;
  ctx.font = '900 115px Space Grotesk';
  ctx.fillText('78%', 0, 30);
  ctx.restore();

  // Description Card
  const descW = 440;
  const descH = 95;
  const descX = (W - descW) / 2;
  const descY = H * 0.55;
  ctx.fillStyle = 'rgba(10, 25, 20, 0.95)';
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
  ctx.lineWidth = 2;
  roundRect(ctx, descX, descY, descW, descH, 16, true, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#6ee7b7';
  ctx.font = '800 18px Space Grotesk';
  ctx.fillText('HIRE THE FIRST BUSINESS THAT PICKS UP', W / 2, descY + 38);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 14px Inter';
  ctx.fillText('Homeowners do NOT wait for voicemails.', W / 2, descY + 68);
}

// -------------------------------------------------------------
// SCENE 6 (22.50s - 26.80s): Vibrating Phone with $8,500 Call
// -------------------------------------------------------------
function renderScene6_IncomingEmergencyCall(t) {
  const relT = t - 22.5;
  renderTopPill('📞 INCOMING HIGH-TICKET HOMEOWNER CALL');

  // Vibrate shake
  const vibe = Math.sin(relT * 40) * 6;
  const phoneW = 320;
  const phoneH = 430;
  const phoneX = (W - phoneW) / 2 + vibe;
  const phoneY = 190;

  ctx.save();
  ctx.fillStyle = '#0a0f1d';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
  ctx.lineWidth = 3;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 24;
  roundRect(ctx, phoneX, phoneY, phoneW, phoneH, 24, true, true);

  // Dynamic Island
  ctx.fillStyle = '#000';
  roundRect(ctx, phoneX + (phoneW - 80) / 2, phoneY + 10, 80, 20, 10, true, false);

  // Caller details
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 12px Inter';
  ctx.fillText('INCOMING EMERGENCY DISPATCH', W / 2, phoneY + 58);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 22px Space Grotesk';
  ctx.fillText('Palm Beach Homeowner', W / 2, phoneY + 90);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '700 14px JetBrains Mono';
  ctx.fillText('(561) 813-8602', W / 2, phoneY + 115);

  // High Ticket Card
  const dossW = phoneW - 32;
  const dossH = 75;
  const dossX = phoneX + 16;
  const dossY = phoneY + 135;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, dossX, dossY, dossW, dossH, 12, true, true);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 11px JetBrains Mono';
  ctx.fillText('🚨 BURST PIPE EMERGENCY REPIPE', dossX + 14, dossY + 24);

  ctx.fillStyle = '#10b981';
  ctx.font = '900 18px Space Grotesk';
  ctx.fillText('VALUE: $8,500.00', dossX + 14, dossY + 55);

  // Ring Counter
  const ringCount = Math.floor(relT * 0.9) + 1;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 16px Space Grotesk';
  ctx.fillText('RINGING... (' + ringCount + ' / 4)', W / 2, phoneY + 250);

  // Answer Buttons
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(phoneX + 75, phoneY + 325, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = '22px sans-serif';
  ctx.fillText('📞', phoneX + 75, phoneY + 333);

  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(phoneX + phoneW - 75, phoneY + 325, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText('📵', phoneX + phoneW - 75, phoneY + 333);
  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 7 (26.80s - 31.00s): On The Ladder / Dinner Table (No Answer)
// -------------------------------------------------------------
function renderScene7_OnTheLadderNoAnswer(t) {
  renderTopPill('🪜 ON A LADDER · AT DINNER · NO DESK');

  const cx = W / 2;
  const cy = H * 0.40;

  // Red Strobe Warning
  ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
  ctx.fillRect(0, 0, W, H);

  // Big Timeout Card
  const cardW = 440;
  const cardH = 240;
  const cardX = (W - cardW) / 2;
  const cardY = cy - 120;
  ctx.fillStyle = 'rgba(20, 10, 15, 0.96)';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 25;
  roundRect(ctx, cardX, cardY, cardW, cardH, 20, true, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ef4444';
  ctx.font = '900 48px Space Grotesk';
  ctx.fillText('4 RINGS EXPIRED', W / 2, cardY + 65);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 22px Space Grotesk';
  ctx.fillText('CALL ROLLED TO VOICEMAIL', W / 2, cardY + 115);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 15px Inter';
  ctx.fillText('"Please leave a message after the beep..."', W / 2, cardY + 155);

  // Audio waveform flatlining
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cardX + 40, cardY + 195);
  ctx.lineTo(cardX + cardW - 40, cardY + 195);
  ctx.stroke();
}

// -------------------------------------------------------------
// SCENE 8 (31.00s - 36.50s): Emergency Red X & $8,500 Cash Burn
// -------------------------------------------------------------
function renderScene8_HandedToCompetitorBurn(t) {
  const relT = t - 31.0;
  renderTopPill('💸 $8,500 HANDED TO YOUR COMPETITOR');

  const cx = W / 2;
  const cy = H * 0.40;

  // Red X Slam
  ctx.save();
  ctx.translate(cx, cy - 30);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 14;
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.moveTo(-60, -60);
  ctx.lineTo(60, 60);
  ctx.moveTo(60, -60);
  ctx.lineTo(-60, 60);
  ctx.stroke();
  ctx.restore();

  // Burn Card
  const cardW = 440;
  const cardH = 130;
  const cardX = (W - cardW) / 2;
  const cardY = H * 0.48;
  ctx.fillStyle = 'rgba(25, 8, 12, 0.98)';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  roundRect(ctx, cardX, cardY, cardW, cardH, 18, true, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ef4444';
  ctx.font = '900 38px Space Grotesk';
  ctx.fillText('-$8,500.00 REVENUE', W / 2, cardY + 50);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 16px Inter';
  ctx.fillText('Customer immediately called next contractor', W / 2, cardY + 85);
  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 13px JetBrains Mono';
  ctx.fillText('COMPETITOR ANSWERED LIVE & BOOKED JOB', W / 2, cardY + 110);
}

// -------------------------------------------------------------
// SCENE 9 (36.50s - 40.50s): Meet Ava · 0.8s Voice AI Reveal
// -------------------------------------------------------------
function renderScene9_MeetAvaReveal(t) {
  renderTopPill('⚡ MEET AVA · 0.8s VOICE AI RECEPTIONIST');
  const cx = W / 2;
  const cy = H * 0.40;

  ctx.save();
  ctx.translate(cx, cy);

  // Outer Hexagonal Glowing Shield
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 28;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x = Math.cos(angle) * 110;
    const y = Math.sin(angle) * 110;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // Neural Voice Waveform Sphere
  const sphereGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 75);
  sphereGrad.addColorStop(0, '#fef08a');
  sphereGrad.addColorStop(0.4, '#f59e0b');
  sphereGrad.addColorStop(1, '#78350f');
  ctx.fillStyle = sphereGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 75, 0, Math.PI * 2);
  ctx.fill();

  // Waveform bars
  for (let i = -5; i <= 5; i++) {
    const barH = (Math.sin(t * 12 + i) * 0.5 + 0.5) * 35 + 8;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(i * 10 - 2, -barH / 2, 4, barH);
  }
  ctx.restore();

  // Stat Badge
  const badgeW = 420;
  const badgeH = 80;
  const badgeX = (W - badgeW) / 2;
  const badgeY = H * 0.56;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 16, true, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#10b981';
  ctx.font = '900 28px Space Grotesk';
  ctx.fillText('0.8 SECOND PICKUP', W / 2, badgeY + 38);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 14px Inter';
  ctx.fillText('Never puts customers on hold · 100% answer rate', W / 2, badgeY + 64);
}

// -------------------------------------------------------------
// SCENE 10 (40.50s - 44.00s): Real-Time Conversational Triage
// -------------------------------------------------------------
function renderScene10_ConversationalTriage(t) {
  renderTopPill('🛡️ AUTONOMOUS CALL TRIAGE & CRM CHECK');

  const cardW = 460;
  const cardH = 310;
  const cardX = (W - cardW) / 2;
  const cardY = 180;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, cardX, cardY, cardW, cardH, 20, true, true);

  // Status Bar
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(cardX + 26, cardY + 28, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.textAlign = 'left';
  ctx.fillStyle = '#34d399';
  ctx.font = '800 12px JetBrains Mono';
  ctx.fillText('CALL ACTIVE · LATENCY: 0.81s · SERVICE TITAN SYNC', cardX + 42, cardY + 32);

  // Dialogue 1: Homeowner
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  roundRect(ctx, cardX + 20, cardY + 55, cardW - 40, 80, 12, true, false);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 11px JetBrains Mono';
  ctx.fillText('CALLER (HOMEOWNER)', cardX + 34, cardY + 76);
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 14px Inter';
  ctx.fillText('"My water heater burst and is flooding into my hall!"', cardX + 34, cardY + 102);

  // Dialogue 2: Ava
  ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 1;
  roundRect(ctx, cardX + 20, cardY + 155, cardW - 40, 95, 12, true, true);
  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 11px JetBrains Mono';
  ctx.fillText('AVA (24/7 VOICE AI)', cardX + 34, cardY + 176);
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 14px Inter';
  ctx.fillText('I understand, that is urgent. Locking in priority', cardX + 34, cardY + 202);
  ctx.fillText('dispatch now. What is your address?', cardX + 34, cardY + 224);

  // Triage checkmark
  ctx.fillStyle = '#10b981';
  ctx.font = '800 12px JetBrains Mono';
  ctx.fillText('✓ EMERGENCY PRIORITY DISPATCH CONFIRMED', cardX + 24, cardY + 285);
  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 11 (44.00s - 47.80s): Autonomous Technician SMS Dispatch
// -------------------------------------------------------------
function renderScene11_TechSmsDispatch(t) {
  renderTopPill('📲 INSTANT TECHNICIAN SMS DISPATCH');

  // iOS Lockscreen Dispatch Notification Card
  const notifW = 460;
  const notifH = 150;
  const notifX = (W - notifW) / 2;
  const notifY = 220;

  ctx.save();
  ctx.fillStyle = 'rgba(30, 41, 59, 0.98)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 24;
  roundRect(ctx, notifX, notifY, notifW, notifH, 18, true, true);

  // App Header
  ctx.textAlign = 'left';
  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 12px JetBrains Mono';
  ctx.fillText('⚡ VANTORX DISPATCH · JUST NOW', notifX + 20, notifY + 30);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 17px Space Grotesk';
  ctx.fillText('EMERGENCY JOB DISPATCHED TO TECH MARK', notifX + 20, notifY + 62);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 14px Inter';
  ctx.fillText('482 Ocean Drive, Palm Beach FL · Burst Pipe ($8,500)', notifX + 20, notifY + 92);

  ctx.fillStyle = '#34d399';
  ctx.font = '700 12px JetBrains Mono';
  ctx.fillText('✓ Full Call Audio & Transcript Texted in 4.0 Seconds', notifX + 20, notifY + 124);
  ctx.restore();

  // Tech Response Pill
  const pillW = 380;
  const pillH = 46;
  const pillX = (W - pillW) / 2;
  const pillY = 400;
  ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, pillX, pillY, pillW, pillH, 12, true, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#34d399';
  ctx.font = '800 14px Space Grotesk';
  ctx.fillText('TECH EN ROUTE IN UNDER 90 SECONDS', W / 2, pillY + 29);
}

// -------------------------------------------------------------
// SCENE 12 (47.80s - 50.80s): Competitor Google Tab Closed
// -------------------------------------------------------------
function renderScene12_CompetitorTabClosed(t) {
  renderTopPill('🚫 ZERO TIME TO OPEN COMPETITOR TABS');

  const tabW = 460;
  const tabH = 220;
  const tabX = (W - tabW) / 2;
  const tabY = 220;

  ctx.save();
  // Browser Tab Mockup
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, tabX, tabY, tabW, tabH, 16, true, true);

  // Search Bar
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  roundRect(ctx, tabX + 20, tabY + 18, tabW - 40, 38, 8, true, false);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px JetBrains Mono';
  ctx.fillText('google.com/search?q=emergency+plumber', tabX + 34, tabY + 42);

  // Search Results
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 14px Inter';
  ctx.fillText('1. Rival Plumbing & Rooter (No Answer)', tabX + 30, tabY + 95);
  ctx.fillText('2. All-Star Emergency AC (Voicemail)', tabX + 30, tabY + 130);

  // Big Red Stamp: CLOSED / LOCKED IN
  ctx.save();
  ctx.translate(W / 2, tabY + 110);
  ctx.rotate(-0.14);
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 5;
  roundRect(ctx, -190, -35, 380, 70, 12, false, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#10b981';
  ctx.font = '900 24px Space Grotesk';
  ctx.fillText('JOB LOCKED IN · ZERO BOUNCE', 0, 10);
  ctx.restore();

  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 13 (50.80s - 54.00s): Stop Bleeding Dead Voicemails
// -------------------------------------------------------------
function renderScene13_StopBleedingDashboard(t) {
  renderTopPill('🛡️ AUTONOMOUS REVENUE PROTECTION');

  const dashW = 460;
  const dashH = 290;
  const dashX = (W - dashW) / 2;
  const dashY = 190;

  ctx.save();
  ctx.fillStyle = 'rgba(14, 20, 32, 0.96)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 2;
  roundRect(ctx, dashX, dashY, dashW, dashH, 20, true, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 13px JetBrains Mono';
  ctx.fillText('ANNUAL PERFORMANCE DASHBOARD', W / 2, dashY + 34);

  // 3 Metric Cards Grid
  const metrics = [
    { label: 'MISSED CALLS', val: '0', color: '#10b981' },
    { label: 'PICKUP SPEED', val: '0.8s', color: '#38bdf8' },
    { label: 'RECOVERED / MO', val: '+$38k', color: '#fbbf24' }
  ];

  metrics.forEach((m, idx) => {
    const bW = 125;
    const bH = 88;
    const bX = dashX + 22 + idx * 142;
    const bY = dashY + 60;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    roundRect(ctx, bX, bY, bW, bH, 12, true, true);

    ctx.fillStyle = m.color;
    ctx.font = '900 28px Space Grotesk';
    ctx.fillText(m.val, bX + bW / 2, bY + 42);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 10.5px JetBrains Mono';
    ctx.fillText(m.label, bX + bW / 2, bY + 70);
  });

  // Guarantee Pill
  ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, dashX + 24, dashY + 175, dashW - 48, 80, 12, true, true);

  ctx.fillStyle = '#10b981';
  ctx.font = '800 16px Space Grotesk';
  ctx.fillText('100% REVENUE CAPTURE GUARANTEE', W / 2, dashY + 208);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 13px Inter';
  ctx.fillText('Never lose an after-hours emergency call again.', W / 2, dashY + 236);

  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 14 (54.00s - 58.20s): Dial Live Demo Line: (561) 813-8602
// -------------------------------------------------------------
function renderScene14_DialDemoLineLive(t) {
  renderTopPill('📞 TEST AVA LIVE RIGHT NOW ON SPEAKERPHONE');

  const ctaW = 460;
  const ctaH = 260;
  const ctaX = (W - ctaW) / 2;
  const ctaY = 200;

  ctx.save();
  const pulse = Math.sin(t * 8) * 4;
  ctx.fillStyle = 'rgba(20, 26, 42, 0.98)';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 30 + pulse;
  roundRect(ctx, ctaX, ctaY, ctaW, ctaH, 22, true, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 13px JetBrains Mono';
  ctx.fillText('DIAL FROM YOUR SMARTPHONE RIGHT NOW', W / 2, ctaY + 40);

  // Big Bold Phone Number
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 42px Space Grotesk';
  ctx.fillText('(561) 813-8602', W / 2, ctaY + 105);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 14px Inter';
  ctx.fillText('Available 24/7/365 · Speak normally or test emergency', W / 2, ctaY + 145);

  // Audio wave under phone
  for (let i = -8; i <= 8; i++) {
    const waveH = (Math.sin(t * 14 + i) * 0.5 + 0.5) * 28 + 6;
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(W / 2 + i * 16 - 3, ctaY + 185 - waveH / 2, 6, waveH);
  }

  // CTA Pill
  ctx.fillStyle = '#f59e0b';
  roundRect(ctx, ctaX + 24, ctaY + 208, ctaW - 48, 36, 10, true, false);
  ctx.fillStyle = '#070a0f';
  ctx.font = '900 13px Space Grotesk';
  ctx.fillText('TAP TO CALL OR TEST LIVE NOW', W / 2, ctaY + 231);

  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 15 (58.20s - 63.00s): Instagram Comment "AVA" & ManyChat DM
// -------------------------------------------------------------
function renderScene15_InstagramCommentManyChat(t) {
  const relT = t - 58.2;
  renderTopPill('💬 COMMENT "AVA" BELOW FOR FREE INSTANT ACCESS');

  // VantorX Official Monogram Shield Logo
  const logoSize = 100;
  const logoY = 175;
  ctx.save();
  if (ASSETS.logo && ASSETS.logo.complete && ASSETS.logo.naturalWidth > 0) {
    ctx.drawImage(ASSETS.logo, (W - logoSize) / 2, logoY, logoSize, logoSize);
  } else {
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 36px Space Grotesk';
    ctx.textAlign = 'center';
    ctx.fillText('VANTORX', W / 2, logoY + 70);
  }
  ctx.restore();

  // ManyChat Comment & Instant DM Card
  const dmCardW = 460;
  const dmCardH = 170;
  const dmCardX = (W - dmCardW) / 2;
  const dmCardY = 300;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.98)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  roundRect(ctx, dmCardX, dmCardY, dmCardW, dmCardH, 18, true, true);

  // Comment Input Box with Animated Typing of "AVA"
  const chars = relT > 1.8 ? 'AVA' : (relT > 1.2 ? 'AV' : (relT > 0.6 ? 'A' : ''));
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  roundRect(ctx, dmCardX + 18, dmCardY + 20, dmCardW - 36, 42, 10, true, false);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 16px JetBrains Mono';
  ctx.fillText('Comment: "' + chars + (Math.sin(relT * 10) > 0 ? '|' : '') + '"', dmCardX + 34, dmCardY + 47);

  // ManyChat Instant Delivery Badge
  if (relT >= 2.0) {
    ctx.fillStyle = '#10b981';
    ctx.font = '800 13px JetBrains Mono';
    ctx.fillText('⚡ MANYCHAT AUTOMATED DM DISPATCHED', dmCardX + 20, dmCardY + 95);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 13.5px Inter';
    ctx.fillText('@vantorxsolutions: "Here is your private line: (561) 813-8602"', dmCardX + 20, dmCardY + 124);
    ctx.fillText('Interactive demo activated in 0.5 seconds.', dmCardX + 20, dmCardY + 148);
  } else {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 13px Inter';
    ctx.fillText('Type "AVA" in the comments & our bot will DM you instantly.', dmCardX + 20, dmCardY + 105);
  }
  ctx.restore();

  // Bottom Big Button
  const btnW = 460;
  const btnH = 50;
  const btnX = (W - btnW) / 2;
  const btnY = 495;
  ctx.fillStyle = '#f59e0b';
  roundRect(ctx, btnX, btnY, btnW, btnH, 12, true, false);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#070a0f';
  ctx.font = '900 16px Space Grotesk';
  ctx.fillText('COMMENT "AVA" ON THIS REEL NOW', W / 2, btnY + 32);
}

// -------------------------------------------------------------
// 💬 HIGH-RETENTION WORD-BY-WORD KINETIC SUBTITLES
// -------------------------------------------------------------
function renderKineticSubtitles(t) {
  // Find current active word
  const activeIdx = WORD_TIMESTAMPS.findIndex(w => t >= w.start && t <= w.end);
  let activeWord = null;
  let targetIdx = -1;

  if (activeIdx !== -1) {
    activeWord = WORD_TIMESTAMPS[activeIdx];
    targetIdx = activeIdx;
  } else {
    // If during small pause, find nearest recent word within 0.35s
    const prev = WORD_TIMESTAMPS.filter(w => w.end <= t).slice(-1)[0];
    if (prev && t - prev.end < 0.35) {
      activeWord = prev;
      targetIdx = WORD_TIMESTAMPS.indexOf(prev);
    }
  }

  if (targetIdx === -1) return; // silence

  // 3-word centered cluster window
  const windowSize = 3;
  const start = Math.max(0, Math.min(WORD_TIMESTAMPS.length - windowSize, targetIdx - 1));
  const cluster = WORD_TIMESTAMPS.slice(start, start + windowSize);

  ctx.save();
  const subY = H * 0.77;
  ctx.textAlign = 'center';
  ctx.lineJoin = 'round';

  // Measure total width to center
  ctx.font = '900 28px Space Grotesk';
  let totalW = 0;
  const wordWidths = cluster.map(w => {
    const cleanWord = w.word.toUpperCase().replace(/[.,!]/g, '');
    const wWidth = ctx.measureText(cleanWord).width + 26;
    totalW += wWidth;
    return wWidth;
  });

  // Dark Translucent Subtitle Pill Background
  const pillW = Math.max(300, totalW + 48);
  const pillH = 56;
  const pillX = (W - pillW) / 2;
  const pillY = subY - 38;

  ctx.fillStyle = 'rgba(7, 10, 15, 0.85)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 1;
  roundRect(ctx, pillX, pillY, pillW, pillH, 14, true, true);

  let startX = (W - totalW) / 2;

  cluster.forEach((w, idx) => {
    const isCurrent = (w === activeWord);
    const cleanWord = w.word.toUpperCase().replace(/[.,!]/g, '');
    const wordW = wordWidths[idx];
    const wordCenterX = startX + wordW / 2;

    ctx.save();
    if (isCurrent) {
      // Pop scale animation
      ctx.translate(wordCenterX, subY);
      ctx.scale(1.22, 1.22);
      ctx.translate(-wordCenterX, -subY);

      // Heavy Dark Stroke
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 8;
      ctx.strokeText(cleanWord, wordCenterX, subY);

      // Custom Color Highlight by Category
      if (cleanWord.includes('186,000') || cleanWord.includes('FASTER') || cleanWord.includes('AVA') || cleanWord.includes('0.8') || cleanWord.includes('DIAL') || cleanWord.includes('813-8602')) {
        ctx.fillStyle = '#fbbf24'; // electric gold
      } else if (cleanWord.includes('78%') || cleanWord.includes('8,000') || cleanWord.includes('MOON')) {
        ctx.fillStyle = '#10b981'; // electric lime emerald
      } else if (cleanWord.includes('VOICEMAILS') || cleanWord.includes('BLEEDING') || cleanWord.includes('COMPETITOR')) {
        ctx.fillStyle = '#ef4444'; // emergency red
      } else {
        ctx.fillStyle = '#38bdf8'; // electric cyan
      }
      ctx.fillText(cleanWord, wordCenterX, subY);
    } else {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.lineWidth = 5;
      ctx.strokeText(cleanWord, wordCenterX, subY);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(cleanWord, wordCenterX, subY);
    }
    ctx.restore();
    startX += wordW;
  });

  ctx.restore();
}
`;

// Replace from `let playedLaserSfx = false;` down to right before `function roundRect`
const startIdx = html.indexOf('let playedLaserSfx = false;');
const endIdx = html.indexOf('function roundRect(ctx, x, y, width, height');

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find function bounds in HTML!');
  process.exit(1);
}

html = html.slice(0, startIdx) + jsReplacement.trim() + '\n\n' + html.slice(endIdx);

fs.writeFileSync(reelHtmlPath, html, 'utf8');
console.log('Successfully upgraded reel-creator.html with 15 cinematic scenes and millisecond word-by-word kinetic captions!');
