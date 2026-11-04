const SCRIPT_CUES = [
  // SCENE 1: EXTENDED STORY HOOK (0:00 - 18.5s)
  { start: 0.0, end: 7.2, text: "A single beam of laser light travels at 186,000 miles per second." },
  { start: 7.3, end: 12.8, text: "It can reach the moon in under three seconds, and cross nearly two billion miles of space in under three hours." },
  { start: 12.9, end: 18.2, text: "Yet that interplanetary space trip is STILL faster than the average contractor calls back an emergency lead." },
  
  // SCENE 2: THE VOICEMAIL GRAVEYARD (18.5s - 32.5s)
  { start: 18.5, end: 24.8, text: "78% of homeowners hire the first business that answers the phone." },
  { start: 24.9, end: 32.2, text: "When you're on a ladder or eating dinner with family, every unanswered call is an $8,000 job handed to your competitor." },
  
  // SCENE 3: AVA 24/7 VOICE AI (32.5s - 47.5s)
  { start: 32.5, end: 39.2, text: "That's why we built Ava. She answers your shop's phone in 0.8 seconds and qualifies the caller." },
  { start: 39.3, end: 47.2, text: "She checks your schedule and dispatches the job to your technician's phone before the customer can open another Google tab." },
  
  // SCENE 4: DIRECT RESPONSE CALL TO ACTION (47.5s - 59.3s)
  { start: 47.5, end: 53.0, text: "Stop bleeding thousands on dead voicemails." },
  { start: 53.1, end: 59.3, text: "Call the demo number on screen right now to hear Ava live, or comment 'AVA' below for free instant access." }
];

// -------------------------------------------------------------
// 🎨 PRELOAD 3D HIGH-RESOLUTION STUDIO RENDERS
// -------------------------------------------------------------
const ASSETS = {
  iphone: new Image(),
  dashboard: new Image(),
  logo: new Image(),
  leadLeak: new Image(),
  avaCard: new Image(),
  ctaCard: new Image()
};
let assetsLoadedCount = 0;
const assetSources = {
  iphone: 'assets/iphone_ava_3d.jpg',
  dashboard: 'assets/dashboard_3d.jpg',
  logo: 'assets/vantorx_logo.png',
  leadLeak: 'assets/lead_leak_card.png',
  avaCard: 'assets/ava_dispatch_card.png',
  ctaCard: 'assets/cta_card.png'
};
for (const [k, src] of Object.entries(assetSources)) {
  ASSETS[k].onload = () => { assetsLoadedCount++; };
  ASSETS[k].src = src;
}

// -------------------------------------------------------------
// 🌌 CINEMATIC 3D WARP PARTICLE & LASER SYSTEM
// -------------------------------------------------------------
const WARP_STARS = [];
for (let i = 0; i < 180; i++) {
  WARP_STARS.push({
    x: (Math.random() - 0.5) * W * 2.2,
    y: (Math.random() - 0.5) * H * 2.2,
    z: Math.random() * 1000 + 10,
    prevZ: 1000,
    size: Math.random() * 2.2 + 0.8,
    speed: Math.random() * 8 + 6,
    color: Math.random() > 0.75 ? '#38bdf8' : (Math.random() > 0.9 ? '#fbbf24' : '#ffffff')
  });
}

const LASER_BURSTS = [];
for (let i = 0; i < 48; i++) {
  LASER_BURSTS.push({
    startX: (Math.random() - 0.5) * W * 1.5 + W * 0.5,
    startY: H + Math.random() * 150,
    targetX: W * 0.5 + (Math.random() - 0.5) * 240,
    targetY: H * 0.42 + (Math.random() - 0.5) * 140,
    progress: Math.random(),
    speed: 0.02 + Math.random() * 0.035,
    width: Math.random() * 3.5 + 1.5,
    color: Math.random() > 0.4 ? '#38bdf8' : '#fbbf24'
  });
}

// Camera Shake Engine
function getCameraShake(t) {
  let intensity = 0;
  // Shake pulses on major audio beats / laser drops
  const impactPoints = [0.5, 3.2, 7.3, 12.9, 18.5, 23.0, 32.5, 47.5];
  for (const p of impactPoints) {
    const dt = t - p;
    if (dt >= 0 && dt < 0.65) {
      intensity = Math.max(intensity, (1 - dt / 0.65) * 8.0);
    }
  }
  if (intensity === 0) return { x: 0, y: 0 };
  return {
    x: (Math.sin(t * 55) * intensity),
    y: (Math.cos(t * 48) * intensity)
  };
}

let playedLaserSfx = false;
let playedSubdropSfx = false;
let playedPhoneSfx = false;
let playedIosPingSfx = false;

// -------------------------------------------------------------
// 🎬 MASTER FRAME RENDERER (60 FPS CINEMATIC MOVIE ENGINE)
// -------------------------------------------------------------
function renderFrame(time) {
  ctx.save();
  ctx.clearRect(0, 0, W, H);

  // Apply Camera Shake
  const shake = getCameraShake(time);
  ctx.translate(shake.x, shake.y);

  // Deep Cosmic Background with Subtle Ambient Glow
  const bgGrad = ctx.createRadialGradient(W / 2, H * 0.4, 40, W / 2, H / 2, H * 0.85);
  bgGrad.addColorStop(0, '#0a101f');
  bgGrad.addColorStop(0.5, '#04070d');
  bgGrad.addColorStop(1, '#010204');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(-20, -20, W + 40, H + 40);

  // Render 3D Warp Stars
  renderWarpStars(time);

  // SFX Triggers Calibrated to 59.3s master audio
  if (time >= 0.5 && !playedLaserSfx) { playSfx('laser'); playedLaserSfx = true; }
  if (time >= 18.5 && !playedSubdropSfx) { playSfx('subdrop'); playedSubdropSfx = true; }
  if (time >= 19.8 && !playedPhoneSfx) { playSfx('phone_ring'); playedPhoneSfx = true; }
  if (time >= 39.0 && !playedIosPingSfx) { playSfx('ios_ping'); playedIosPingSfx = true; }

  // RENDER SCENES BASED ON TIMELINE
  if (time < 18.5) {
    renderScene1_CosmicLaserMovie(time);
  } else if (time < 32.5) {
    renderScene2_BrutalLeadLeakMovie(time);
  } else if (time < 47.5) {
    renderScene3_AvaDemoMovie(time);
  } else {
    renderScene4_ManyChatCTAMovie(time);
  }

  // High-Retention Word-by-Word Kinetic Subtitles (Alex Hormozi Style)
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

// -------------------------------------------------------------
// 🌠 3D WARP STARFIELD ENGINE
// -------------------------------------------------------------
function renderWarpStars(t) {
  const warpSpeed = t < 18.5 ? (12 + Math.sin(t * 2) * 5) : 4;
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

// -------------------------------------------------------------
// 🪐 SCENE 1: INTERPLANETARY COSMIC LASER RACE (0:00 - 18.5s)
// -------------------------------------------------------------
function renderScene1_CosmicLaserMovie(t) {
  const cx = W * 0.5;
  const cy = H * 0.44;

  // Dynamic Camera Zoom & Orbit Pulse
  const zoomProgress = Math.min(1, t / 4.0);
  const cameraScale = 1.35 - (zoomProgress * 0.35) + Math.sin(t * 0.8) * 0.04;
  const planetRot = t * 0.45;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(cameraScale, cameraScale);

  // 1. Planetary Outer Atmosphere Glow
  const atmoGlow = ctx.createRadialGradient(0, 0, 50, 0, 0, 190);
  atmoGlow.addColorStop(0, 'rgba(56, 189, 248, 0.85)');
  atmoGlow.addColorStop(0.4, 'rgba(14, 165, 233, 0.35)');
  atmoGlow.addColorStop(0.8, 'rgba(2, 132, 199, 0.12)');
  atmoGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = atmoGlow;
  ctx.beginPath();
  ctx.arc(0, 0, 190, 0, Math.PI * 2);
  ctx.fill();

  // 2. BACK HALF OF 3D PLANETARY RINGS (Behind planet)
  renderPlanetaryRings(ctx, planetRot, true);

  // 3. Shaded 3D Sphere (Planet Body)
  const sphereRadius = 78;
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, sphereRadius, 0, Math.PI * 2);
  ctx.clip();

  // 3D Spherical Normal Lighting
  const sphereGrad = ctx.createRadialGradient(-32, -32, 10, 0, 0, sphereRadius);
  sphereGrad.addColorStop(0, '#bae6fd');
  sphereGrad.addColorStop(0.25, '#38bdf8');
  sphereGrad.addColorStop(0.65, '#0284c7');
  sphereGrad.addColorStop(0.9, '#03456e');
  sphereGrad.addColorStop(1, '#02182b');
  ctx.fillStyle = sphereGrad;
  ctx.fill();

  // Rotating 3D Surface Clouds / Terrain Bands
  ctx.save();
  ctx.rotate(0.35); // axial tilt
  for (let band = -4; band <= 4; band++) {
    const bandY = band * 18;
    const waveOffset = Math.sin(t * 1.8 + band) * 12 + (t * 22) % 180;
    ctx.fillStyle = band % 2 === 0 ? 'rgba(255, 255, 255, 0.16)' : 'rgba(14, 165, 233, 0.22)';
    ctx.beginPath();
    ctx.ellipse(-sphereRadius + (waveOffset % (sphereRadius * 2)), bandY, 45, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Celestial Longitude/Latitude 3D Depth Grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 5]);
  for (let angle = 0; angle < Math.PI; angle += Math.PI / 4) {
    const rotAngle = angle + planetRot;
    const xRadius = Math.abs(Math.sin(rotAngle)) * sphereRadius;
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.max(2, xRadius), sphereRadius, 0.35, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Night-Side Terminator Shadow
  const nightGrad = ctx.createLinearGradient(sphereRadius * 0.2, -sphereRadius, sphereRadius, sphereRadius);
  nightGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  nightGrad.addColorStop(0.4, 'rgba(1, 4, 10, 0.65)');
  nightGrad.addColorStop(1, 'rgba(1, 2, 6, 0.96)');
  ctx.fillStyle = nightGrad;
  ctx.fillRect(-sphereRadius, -sphereRadius, sphereRadius * 2, sphereRadius * 2);

  ctx.restore(); // end planet clip

  // 4. FRONT HALF OF 3D PLANETARY RINGS (In front of planet)
  renderPlanetaryRings(ctx, planetRot, false);

  // 5. Planetary Ring Shadow on Front
  ctx.save();
  ctx.rotate(-0.4);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(-sphereRadius, 8, sphereRadius * 2, 14);
  ctx.restore();

  ctx.restore(); // end camera transform

  // -----------------------------------------------------------
  // ⚡ SUPER LASER CANNON & SHOCKWAVES
  // -----------------------------------------------------------
  // Kinetic laser beams shooting from planet
  LASER_BURSTS.forEach(b => {
    b.progress += b.speed;
    if (b.progress > 1) {
      b.progress = 0;
      b.startX = (Math.random() - 0.5) * W * 1.5 + W * 0.5;
      b.startY = H + Math.random() * 150;
    }

    const curX = b.startX + (b.targetX - b.startX) * b.progress;
    const curY = b.startY + (b.targetY - b.startY) * b.progress;
    const trail = Math.max(0, b.progress - 0.28);
    const prevX = b.startX + (b.targetX - b.startX) * trail;
    const prevY = b.startY + (b.targetY - b.startY) * trail;

    ctx.save();
    ctx.strokeStyle = b.color;
    ctx.lineWidth = b.width;
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(curX, curY);
    ctx.stroke();

    // Energy plasma head
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(curX, curY, b.width * 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Central Master Laser Beam (Firing into Deep Space)
  ctx.save();
  const beamPulse = Math.sin(t * 30) * 2 + 6;
  const beamGrad = ctx.createLinearGradient(cx, cy, cx, 0);
  beamGrad.addColorStop(0, '#ffffff');
  beamGrad.addColorStop(0.3, '#38bdf8');
  beamGrad.addColorStop(0.7, '#0284c7');
  beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

  ctx.strokeStyle = beamGrad;
  ctx.lineWidth = beamPulse * 2.2;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 28;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.sin(t * 1.5) * 45, 0);
  ctx.stroke();

  // Intense Core
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = beamPulse * 0.8;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.sin(t * 1.5) * 45, 0);
  ctx.stroke();

  // Anamorphic Lens Flare
  const flareWidth = 380 + Math.sin(t * 20) * 80;
  const flareGrad = ctx.createLinearGradient(cx - flareWidth, cy, cx + flareWidth, cy);
  flareGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
  flareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
  flareGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = flareGrad;
  ctx.fillRect(cx - flareWidth, cy - 2, flareWidth * 2, 4);

  // Shockwave rings expanding from planet
  const shockwaveAge = (t * 2.2) % 1.0;
  const shockR = shockwaveAge * 220;
  const shockAlpha = (1 - shockwaveAge) * 0.75;
  ctx.strokeStyle = 'rgba(56, 189, 248, ' + shockAlpha + ')';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, shockR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();

  // -----------------------------------------------------------
  // 📡 INTERACTIVE SCI-FI TELEMETRY HUD (TOP COCKPIT)
  // -----------------------------------------------------------
  const isAlarm = (t >= 12.8);
  const hudW = 460;
  const hudH = 110;
  const hudX = (W - hudW) / 2;
  const hudY = 85;

  ctx.save();
  // Glassmorphic Backdrop
  ctx.fillStyle = isAlarm ? 'rgba(35, 10, 15, 0.92)' : 'rgba(8, 14, 25, 0.90)';
  ctx.strokeStyle = isAlarm ? 'rgba(239, 68, 68, 0.85)' : 'rgba(56, 189, 248, 0.55)';
  ctx.lineWidth = isAlarm ? 2.5 : 1.5;
  ctx.shadowColor = isAlarm ? 'rgba(239, 68, 68, 0.6)' : 'rgba(56, 189, 248, 0.35)';
  ctx.shadowBlur = 20;
  roundRect(ctx, hudX, hudY, hudW, hudH, 14, true, true);

  // Top Header Pill
  ctx.fillStyle = isAlarm ? '#ef4444' : '#38bdf8';
  ctx.font = '700 11px JetBrains Mono';
  ctx.textAlign = 'left';
  ctx.fillText(isAlarm ? '🚨 TELEMETRY ANOMALY DETECTED • CRITICAL DELAY' : '📡 DEEP SPACE TELEMETRY BENCHMARK • MISSION #104', hudX + 16, hudY + 24);

  // Animated Digital Speedometer & Distance
  if (!isAlarm) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 17px Space Grotesk';
    const speedJitter = Math.floor(Math.random() * 9);
    ctx.fillText('SPEED: 186,28' + speedJitter + ' MILES / SEC', hudX + 16, hudY + 54);

    // Distance Counter Counting Up
    const distMiles = Math.floor(Math.min(1784000000, (t / 12.8) * 1784000000));
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 13px Inter';
    ctx.fillText('DISTANCE: ' + distMiles.toLocaleString() + ' MILES TRANSIT', hudX + 16, hudY + 78);

    // Dynamic Animated Audio EQ Bars
    const eqX = hudX + 320;
    const eqY = hudY + 78;
    for (let b = 0; b < 14; b++) {
      const barH = Math.sin(t * 12 + b * 1.5) * 14 + 16;
      ctx.fillStyle = b > 9 ? '#fbbf24' : '#38bdf8';
      ctx.fillRect(eqX + b * 8, eqY - barH, 5, barH);
    }
  } else {
    // Urgent Anomaly Alert Display
    ctx.fillStyle = '#f87171';
    ctx.font = '800 16px Space Grotesk';
    ctx.fillText('CRITICAL: 4.2 HR LOCAL CONTRACTOR LAG', hudX + 16, hudY + 54);

    ctx.fillStyle = '#fca5a5';
    ctx.font = '600 13px Inter';
    ctx.fillText('⚡ 2 BILLION MILE SPACE TRIP WINS OVER 1-RING REPLY', hudX + 16, hudY + 78);

    // Warning Strobe Icon
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(hudX + hudW - 32, hudY + 50, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 14px Space Grotesk';
    ctx.textAlign = 'center';
    ctx.fillText('!', hudX + hudW - 32, hudY + 55);
  }
  ctx.restore();
}

// Helper: 3D Planetary Rings
function renderPlanetaryRings(ctx, rot, isBack) {
  ctx.save();
  ctx.rotate(-0.42); // tilt
  ctx.scale(1.0, 0.28); // perspective foreshortening

  const startAngle = isBack ? Math.PI : 0;
  const endAngle = isBack ? Math.PI * 2 : Math.PI;

  // Outer Ring
  ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(0, 0, 138, startAngle, endAngle);
  ctx.stroke();

  // Cassini Division (dark gap)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 118, startAngle, endAngle);
  ctx.stroke();

  // Inner Amber Glow Ring
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(0, 0, 98, startAngle, endAngle);
  ctx.stroke();

  ctx.restore();
}

// -------------------------------------------------------------
// 💀 SCENE 2: THE VOICEMAIL GRAVEYARD & CASH BLEED (18.5s - 32.5s)
// -------------------------------------------------------------
function renderScene2_BrutalLeadLeakMovie(t) {
  const relT = t - 18.5;
  const isMissed = (relT >= 4.5);

  renderTopPill(isMissed ? '🚨 EMERGENCY LEAD LOST TO VOICEMAIL' : '📞 INCOMING HIGH-TICKET HOMEOWNER CALL');

  // Phone Vibration / Spring Physics
  const vibe = (!isMissed && relT < 4.5) ? Math.sin(relT * 35) * 5 : 0;
  const phoneW = 310;
  const phoneH = 470;
  const phoneX = (W - phoneW) / 2 + vibe;
  const phoneY = 200;

  // Red Emergency Strobe on Missed Call
  if (isMissed) {
    const redAlpha = Math.sin(relT * 8) * 0.18 + 0.22;
    ctx.fillStyle = 'rgba(239, 68, 68, ' + redAlpha + ')';
    ctx.fillRect(0, 0, W, H);
  }

  ctx.save();
  // 3D Phone Chassis
  ctx.fillStyle = '#0a0f1d';
  ctx.strokeStyle = isMissed ? 'rgba(239, 68, 68, 0.85)' : 'rgba(56, 189, 248, 0.6)';
  ctx.lineWidth = 3;
  ctx.shadowColor = isMissed ? 'rgba(239, 68, 68, 0.7)' : 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 28;
  roundRect(ctx, phoneX, phoneY, phoneW, phoneH, 28, true, true);

  // Dynamic Island / Speaker Notch
  ctx.fillStyle = '#000000';
  roundRect(ctx, phoneX + (phoneW - 90) / 2, phoneY + 12, 90, 22, 11, true, false);

  // Call Header
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 13px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('INCOMING EMERGENCY DISPATCH', W / 2, phoneY + 65);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 22px Space Grotesk';
  ctx.fillText('Palm Beach Homeowner', W / 2, phoneY + 98);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '700 14px JetBrains Mono';
  ctx.fillText('(561) 813-8602 • UNVERIFIED CELL', W / 2, phoneY + 125);

  // Job Value Dossier Box
  const dossW = phoneW - 36;
  const dossH = 82;
  const dossX = phoneX + 18;
  const dossY = phoneY + 145;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  roundRect(ctx, dossX, dossY, dossW, dossH, 12, true, true);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#fbbf24';
  ctx.font = '700 11.5px JetBrains Mono';
  ctx.fillText('🚨 HIGH-TICKET PRIORITY DETECTED', dossX + 14, dossY + 24);

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 13px Inter';
  ctx.fillText('Burst Pipe Flooding Master Bedroom', dossX + 14, dossY + 46);

  ctx.fillStyle = '#34d399';
  ctx.font = '800 15px Space Grotesk';
  ctx.fillText('ESTIMATED REVENUE: $8,500.00', dossX + 14, dossY + 70);

  // Ringing vs Missed State
  if (!isMissed) {
    // Ring Counter
    const currentRing = Math.min(4, Math.floor(relT * 0.95) + 1);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 16px Space Grotesk';
    ctx.fillText('RINGING... (' + currentRing + ' / 4)', W / 2, phoneY + 265);

    // Pulsing Green Answer Call Button
    const btnPulse = Math.sin(relT * 10) * 4;
    const btnR = 32 + btnPulse;
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(phoneX + 75, phoneY + 340, btnR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px sans-serif';
    ctx.fillText('📞', phoneX + 75, phoneY + 348);

    // Red Decline Button
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(phoneX + phoneW - 75, phoneY + 340, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText('📵', phoneX + phoneW - 75, phoneY + 348);
  } else {
    // SLAM DOWN MISSED CALL STAMP
    ctx.save();
    ctx.translate(W / 2, phoneY + 280);
    ctx.rotate(-0.08);

    ctx.fillStyle = 'rgba(239, 68, 68, 0.92)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    roundRect(ctx, -135, -34, 270, 68, 12, true, true);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 19px Space Grotesk';
    ctx.textAlign = 'center';
    ctx.fillText('❌ CALL MISSED', 0, -4);
    ctx.font = '700 13px JetBrains Mono';
    ctx.fillText('LOST TO VOICEMAIL', 0, 20);
    ctx.restore();

    // Cash Bleed Rapid Countdown
    const lostAmount = Math.min(8500, Math.floor((relT - 4.5) * 2800));
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ef4444';
    ctx.font = '900 24px Space Grotesk';
    ctx.fillText('-$' + lostAmount.toLocaleString() + '.00', W / 2, phoneY + 380);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 12px Inter';
    ctx.fillText('HANDED TO FIRST COMPETITOR TO ANSWER', W / 2, phoneY + 404);
  }

  ctx.restore();
}

// -------------------------------------------------------------
// ⚡ SCENE 3: AVA 24/7 VOICE AI DISPATCH (32.5s - 47.5s)
// -------------------------------------------------------------
function renderScene3_AvaDemoMovie(t) {
  const relT = t - 32.5;
  renderTopPill('⚡ AVA 24/7 VOICE AI • ANSWERED IN 0.8s');

  const phoneW = 310;
  const phoneH = 480;
  const phoneX = (W - phoneW) / 2;
  // Smooth levitation float
  const floatY = Math.sin(relT * 2.5) * 7;
  const phoneY = 190 + floatY;

  ctx.save();
  // Dark Titanium Phone with Gold Rim Lighting
  ctx.fillStyle = '#0a0d17';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
  ctx.shadowBlur = 26;
  roundRect(ctx, phoneX, phoneY, phoneW, phoneH, 28, true, true);

  // Native Dynamic Island
  ctx.fillStyle = '#000000';
  roundRect(ctx, phoneX + (phoneW - 90) / 2, phoneY + 12, 90, 22, 11, true, false);

  // Ava Voice AI Header
  ctx.fillStyle = '#f59e0b';
  ctx.font = '800 12px JetBrains Mono';
  ctx.textAlign = 'center';
  ctx.fillText('● AVA 24/7 EMERGENCY DISPATCHER', W / 2, phoneY + 58);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 20px Space Grotesk';
  ctx.fillText('Titan HVAC Services', W / 2, phoneY + 84);

  // -----------------------------------------------------------
  // 🔮 THE GLOWING AVA VOICE ORB (UNDULATING PLASMA WAVES)
  // -----------------------------------------------------------
  const orbX = W / 2;
  const orbY = phoneY + 160;

  // Multi-layer glowing voice rings
  for (let r = 6; r >= 1; r--) {
    const ringPulse = Math.sin(relT * 6 + r * 0.9) * 8 + r * 14;
    const ringAlpha = (7 - r) * 0.08;
    ctx.fillStyle = 'rgba(245, 158, 11, ' + ringAlpha + ')';
    ctx.beginPath();
    ctx.arc(orbX, orbY, ringPulse + 18, 0, Math.PI * 2);
    ctx.fill();
  }

  // Core Orb
  const orbGrad = ctx.createRadialGradient(orbX, orbY, 6, orbX, orbY, 32);
  orbGrad.addColorStop(0, '#ffffff');
  orbGrad.addColorStop(0.4, '#fbbf24');
  orbGrad.addColorStop(0.85, '#f59e0b');
  orbGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = orbGrad;
  ctx.beginPath();
  ctx.arc(orbX, orbY, 28 + Math.sin(relT * 8) * 3, 0, Math.PI * 2);
  ctx.fill();

  // Latency Stopwatch Badge
  ctx.fillStyle = '#34d399';
  ctx.font = '800 13px JetBrains Mono';
  ctx.fillText('⚡ 0.8s RESPONSE TIME', W / 2, phoneY + 225);

  // -----------------------------------------------------------
  // 💬 REAL-TIME CONVERSATION DIALOGUE CARDS
  // -----------------------------------------------------------
  const chatY = phoneY + 245;

  // Ava Message 1
  renderChatBubble(ctx, phoneX + 16, chatY, phoneW - 32, 44, '🤖 Ava (0.8s):', 'Titan HVAC, this is Ava. What is your AC emergency?', '#f59e0b');

  // Homeowner Reply
  if (relT >= 2.0) {
    renderChatBubble(ctx, phoneX + 16, chatY + 54, phoneW - 32, 44, '👤 Homeowner:', 'Our AC shut off and ceiling is leaking water!', '#38bdf8');
  }

  // Ava Dispatch Confirmation
  if (relT >= 5.0) {
    renderChatBubble(ctx, phoneX + 16, chatY + 108, phoneW - 32, 44, '🤖 Ava (Confirmed):', 'Technician Dave is dispatched. ETA 15 mins.', '#34d399');
  }

  // Dynamic Island Pop-Down Notification at 7.5s
  if (relT >= 7.5) {
    const notifW = phoneW - 20;
    const notifH = 50;
    const notifX = phoneX + 10;
    const notifY = phoneY + 12;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.98)';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#34d399';
    ctx.shadowBlur = 16;
    roundRect(ctx, notifX, notifY, notifW, notifH, 16, true, true);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#34d399';
    ctx.font = '800 11px JetBrains Mono';
    ctx.fillText('✓ TECH DISPATCHED VIA SMS', notifX + 14, notifY + 20);

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 12px Inter';
    ctx.fillText('Dave Confirmed • $8,200 Job Saved', notifX + 14, notifY + 38);
  }

  ctx.restore();
}

function renderChatBubble(ctx, x, y, w, h, speaker, text, color) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, w, h, 10, true, true);

  ctx.textAlign = 'left';
  ctx.fillStyle = color;
  ctx.font = '800 10.5px JetBrains Mono';
  ctx.fillText(speaker, x + 10, y + 16);

  ctx.fillStyle = '#ffffff';
  ctx.font = '500 11.5px Inter';
  ctx.fillText(text, x + 10, y + 34);
  ctx.restore();
}

// -------------------------------------------------------------
// 🚀 SCENE 4: MANYCHAT VIRAL DM LOOP & CTA (47.5s - 59.3s)
// -------------------------------------------------------------
function renderScene4_ManyChatCTAMovie(t) {
  const relT = t - 47.5;
  renderTopPill('🔥 VIRAL DIRECT-RESPONSE CTA • COMMENT "AVA"');

  // 1. 3D Floating Metallic Gold VantorX Logo
  const logoSize = 140;
  const logoX = (W - logoSize) / 2;
  const logoY = 160 + Math.sin(relT * 3) * 6;

  ctx.save();
  // Glowing Radial Halo behind Logo
  const logoHalo = ctx.createRadialGradient(W / 2, logoY + logoSize / 2, 20, W / 2, logoY + logoSize / 2, 130);
  logoHalo.addColorStop(0, 'rgba(245, 158, 11, 0.65)');
  logoHalo.addColorStop(0.6, 'rgba(245, 158, 11, 0.15)');
  logoHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = logoHalo;
  ctx.beginPath();
  ctx.arc(W / 2, logoY + logoSize / 2, 130, 0, Math.PI * 2);
  ctx.fill();

  // Render VantorX 3D Logo Asset if loaded, or procedural emblem
  if (ASSETS.logo && ASSETS.logo.complete && ASSETS.logo.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(W / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(ASSETS.logo, logoX, logoY, logoSize, logoSize);
    ctx.restore();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(W / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 36px Space Grotesk';
    ctx.textAlign = 'center';
    ctx.fillText('VANTORX', W / 2, logoY + 80);
  }
  ctx.restore();

  // -----------------------------------------------------------
  // 💬 INTERACTIVE INSTAGRAM COMMENT & MANYCHAT DM SIMULATION
  // -----------------------------------------------------------
  const dmCardW = 460;
  const dmCardH = 120;
  const dmCardX = (W - dmCardW) / 2;
  const dmCardY = 325;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, dmCardX, dmCardY, dmCardW, dmCardH, 16, true, true);

  // Comment Input Box
  const inputW = dmCardW - 32;
  const inputH = 40;
  const inputX = dmCardX + 16;
  const inputY = dmCardY + 16;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  roundRect(ctx, inputX, inputY, inputW, inputH, 10, true, false);

  // Animated Typing of "AVA"
  const isTyping = (relT > 1.0);
  const charsToShow = isTyping ? (relT > 2.2 ? 'AVA' : (relT > 1.6 ? 'AV' : 'A')) : '';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 15px JetBrains Mono';
  ctx.fillText('Comment: "' + charsToShow + (Math.sin(relT * 12) > 0 ? '|' : '') + '"', inputX + 14, inputY + 26);

  // Instant ManyChat DM Delivery Confirmation
  if (relT >= 2.5) {
    ctx.fillStyle = '#34d399';
    ctx.font = '800 12px JetBrains Mono';
    ctx.fillText('⚡ MANYCHAT AUTOMATED DM DISPATCHED', dmCardX + 16, dmCardY + 82);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 12.5px Inter';
    ctx.fillText('@vantorxsolutions: "Here is your private line: (561) 813-8602"', dmCardX + 16, dmCardY + 104);
  } else {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 12px Inter';
    ctx.fillText('Type "AVA" below & automated assistant instantly DMs you', dmCardX + 16, dmCardY + 85);
  }
  ctx.restore();

  // -----------------------------------------------------------
  // 📞 HUGE PULSING CALL-TO-ACTION CARD
  // -----------------------------------------------------------
  const ctaW = 460;
  const ctaH = 135;
  const ctaX = (W - ctaW) / 2;
  const ctaY = 465;

  ctx.save();
  const pulseScale = Math.sin(relT * 6) * 3;
  ctx.fillStyle = 'rgba(20, 26, 42, 0.98)';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 24 + pulseScale;
  roundRect(ctx, ctaX, ctaY, ctaW, ctaH, 18, true, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 12px JetBrains Mono';
  ctx.fillText('📞 DIAL LIVE EMERGENCY PHONE TEST LINE NOW', W / 2, ctaY + 30);

  // Big Bold Phone Number
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 32px Space Grotesk';
  ctx.fillText('(561) 813-8602', W / 2, ctaY + 74);

  // Bottom Action Pill
  ctx.fillStyle = '#f59e0b';
  roundRect(ctx, ctaX + 24, ctaY + 92, ctaW - 48, 30, 8, true, false);
  ctx.fillStyle = '#070a0f';
  ctx.font = '900 12px Space Grotesk';
  ctx.fillText('OR COMMENT "AVA" BELOW FOR FREE INSTANT ACCESS', W / 2, ctaY + 112);

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
// 💬 WORD-BY-WORD KINETIC SUBTITLES (HORMOZI / MRBEAST STYLE)
// -------------------------------------------------------------
function renderKineticSubtitles(t) {
  const cue = SCRIPT_CUES.find(c => t >= c.start && t <= c.end);
  if (!cue) return;

  const words = cue.text.split(' ');
  const cueDuration = cue.end - cue.start;
  const progress = (t - cue.start) / cueDuration;
  const currentWordIndex = Math.min(words.length - 1, Math.floor(progress * words.length));

  ctx.save();
  const subY = H * 0.84;
  ctx.textAlign = 'center';
  ctx.lineJoin = 'round';

  // Render 4 words at a time window around current word
  const windowSize = 4;
  const startIdx = Math.max(0, Math.min(words.length - windowSize, currentWordIndex - 1));
  const visibleWords = words.slice(startIdx, startIdx + windowSize);

  // Calculate line width to center
  ctx.font = '900 24px Space Grotesk';
  let totalW = 0;
  const wordWidths = visibleWords.map(w => {
    const wWidth = ctx.measureText(w.toUpperCase()).width + 12;
    totalW += wWidth;
    return wWidth;
  });

  let startX = (W - totalW) / 2;

  visibleWords.forEach((word, idx) => {
    const globalIdx = startIdx + idx;
    const isCurrent = (globalIdx === currentWordIndex);

    ctx.save();
    const wordW = wordWidths[idx];
    const wordCenterX = startX + wordW / 2;

    if (isCurrent) {
      // Kinetic Pop-Up Scale Animation
      ctx.translate(wordCenterX, subY);
      ctx.scale(1.18, 1.18);
      ctx.translate(-wordCenterX, -subY);

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 7;
      ctx.strokeText(word.toUpperCase(), wordCenterX, subY);

      // Vibrant Highlight for Key Business Words
      if (word.includes('186,000') || word.includes('faster') || word.includes('78%') || word.includes('$8,000') || word.includes('Ava') || word.includes('0.8') || word.includes('AVA')) {
        ctx.fillStyle = '#fbbf24'; // electric gold
      } else {
        ctx.fillStyle = '#38bdf8'; // electric cyan
      }
      ctx.fillText(word.toUpperCase(), wordCenterX, subY);
    } else {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.lineWidth = 5;
      ctx.strokeText(word.toUpperCase(), wordCenterX, subY);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(word.toUpperCase(), wordCenterX, subY);
    }

    ctx.restore();
    startX += wordW;
  });

  ctx.restore();
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

// Animation Loop
function loop(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const delta = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  if (isPlaying) {
    currentTime += delta;
    if (currentTime >= TOTAL_DURATION) {
      currentTime = 0;
      resetSfxFlags();
    }
    updateUI();
    triggerAudioForCurrentTime();
  }

  renderFrame(currentTime);
  animationFrameId = requestAnimationFrame(loop);
}

function resetSfxFlags() {
  playedLaserSfx = false;
  playedSubdropSfx = false;
  playedPhoneSfx = false;
  playedIosPingSfx = false;
}

function togglePlay() {
  initAudioGraph();
  isPlaying = !isPlaying;
  const btn = document.getElementById('btnPlayPause');

  if (isPlaying) {
    btn.innerHTML = '<span>⏸️</span> Pause Reel';
    startBackgroundBeat();
    triggerAudioForCurrentTime();
  } else {
    btn.innerHTML = '<span>▶️</span> Play &amp; Preview Reel';
    stopBackgroundBeat();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (uploadedAudioElement) uploadedAudioElement.pause();
  }
}

window.switchStageView = function(view) {
  const canvasEl = document.getElementById('reelCanvas');
  const videoEl = document.getElementById('masterMp4Player');
  const btnC = document.getElementById('btnViewCanvas');
  const btnV = document.getElementById('btnViewVideo');
  if (view === 'video') {
    if (isPlaying) togglePlay();
    if (canvasEl) canvasEl.style.display = 'none';
    if (videoEl) {
      videoEl.style.display = 'block';
      videoEl.play().catch(() => {});
    }
    if (btnV) {
      btnV.style.background = 'rgba(245,158,11,0.9)';
      btnV.style.color = '#0b0f19';
      btnV.style.fontWeight = '800';
    }
    if (btnC) {
      btnC.style.background = 'rgba(255,255,255,0.15)';
      btnC.style.color = '#ffffff';
      btnC.style.fontWeight = '600';
    }
  } else {
    if (videoEl) {
      videoEl.pause();
      videoEl.style.display = 'none';
    }
    if (canvasEl) canvasEl.style.display = 'block';
    if (btnC) {
      btnC.style.background = 'rgba(245,158,11,0.9)';
      btnC.style.color = '#0b0f19';
      btnC.style.fontWeight = '800';
    }
    if (btnV) {
      btnV.style.background = 'rgba(255,255,255,0.15)';
      btnV.style.color = '#ffffff';
      btnV.style.fontWeight = '600';
    }
  }
};
