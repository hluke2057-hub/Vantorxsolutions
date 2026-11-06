// scripts/build_viral_fun_facts_engine.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../website/demo/reel-creator.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Prepare the Story Rendering Canvas Functions
const storyRenderingFunctions = `
// =============================================================
// 🎨 VIRAL FUN-FACTS ANIMATION SUITE (8 DIVERSE VISUAL STORIES)
// =============================================================

// Helper: Draw Circular Progress Arc
function drawGaugeArc(ctx, cx, cy, radius, startAngle, endAngle, color, lineWidth = 12) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle);
  ctx.stroke();
  ctx.restore();
}

// -------------------------------------------------------------
// STORY 1: COSMIC LASER (186,000 MI/SEC & MOON/SATURN)
// -------------------------------------------------------------
function renderStory1_LaserSpeed(t) {
  renderTopPill('⚡ SPEED OF LIGHT: 186,000 MILES/SEC');
  const cx = W / 2;
  const cy = H * 0.42;
  ctx.save();
  ctx.translate(cx, cy);
  const prog = Math.min(1, t / 3.5);
  const speedVal = Math.floor(prog * 186000);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(0, 0, 140, Math.PI * 0.75, Math.PI * 2.25);
  ctx.stroke();

  ctx.strokeStyle = '#38bdf8';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.arc(0, 0, 140, Math.PI * 0.75, Math.PI * 0.75 + (Math.PI * 1.5 * prog));
  ctx.stroke();

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

  // Pulsing Laser Core Beam
  const beamW = 12 + Math.sin(t * 20) * 4;
  const beamGrad = ctx.createLinearGradient(0, 80, 0, 240);
  beamGrad.addColorStop(0, '#ffffff');
  beamGrad.addColorStop(0.3, '#38bdf8');
  beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = beamGrad;
  ctx.fillRect(-beamW / 2, 85, beamW, 160);
  ctx.restore();
}

function renderStory1_MoonImpact(t) {
  const relT = t - 4.5;
  renderTopPill('🌕 MOON TRANSIT: 1.3 SECONDS FLAT');
  const cx = W / 2;
  const cy = H * 0.40;
  ctx.save();
  ctx.translate(cx, cy);

  // 3D Moon Sphere
  const moonGrad = ctx.createRadialGradient(-30, -30, 15, 0, 0, 100);
  moonGrad.addColorStop(0, '#f8fafc');
  moonGrad.addColorStop(0.6, '#94a3b8');
  moonGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = moonGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 95, 0, Math.PI * 2);
  ctx.fill();

  // Expanding shockwave
  if (relT > 0.8) {
    const shockR = (relT - 0.8) * 160;
    ctx.strokeStyle = 'rgba(56, 189, 248, ' + Math.max(0, 1 - shockR / 220) + ')';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, shockR, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function renderStory1_SaturnDeepSpace(t) {
  renderTopPill('🪐 2 BILLION MILES TO SATURN IN <3 HOURS');
  const cx = W / 2;
  const cy = H * 0.40;
  ctx.save();
  ctx.translate(cx, cy);

  renderPlanetaryRings(ctx, t, true);
  const planetGrad = ctx.createRadialGradient(-35, -35, 15, 0, 0, 110);
  planetGrad.addColorStop(0, '#fef08a');
  planetGrad.addColorStop(0.5, '#f59e0b');
  planetGrad.addColorStop(1, '#78350f');
  ctx.fillStyle = planetGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 105, 0, Math.PI * 2);
  ctx.fill();
  renderPlanetaryRings(ctx, t, false);
  ctx.restore();
}

// -------------------------------------------------------------
// STORY 2: PEREGRINE FALCON (242 MPH & 15ms REFLEX ARC)
// -------------------------------------------------------------
function renderStory2_FalconHighAltitude(t) {
  renderTopPill('🦅 FASTEST CREATURE ON EARTH: PEREGRINE FALCON');
  const cx = W / 2;
  const cy = H * 0.42;

  ctx.save();
  ctx.translate(cx, cy);

  // Cloud streak lines rushing by
  for (let i = 0; i < 8; i++) {
    const yOff = ((t * 400 + i * 50) % 280) - 140;
    const xOff = (i - 4) * 45;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(xOff, yOff);
    ctx.lineTo(xOff, yOff + 60);
    ctx.stroke();
  }

  // Altitude Altimeter Bar
  const altVal = Math.max(1200, Math.floor(15000 - t * 2800));
  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 13px JetBrains Mono';
  ctx.fillText('HIGH-ALTITUDE HUNTING DIVE', 0, -60);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 48px Space Grotesk';
  ctx.fillText(altVal.toLocaleString() + ' FT', 0, 5);
  ctx.fillStyle = '#fbbf24';
  ctx.font = '700 15px JetBrains Mono';
  ctx.fillText('TERMINAL VELOCITY LOCKED', 0, 45);

  ctx.restore();
}

function renderStory2_FalconDiveHUD(t) {
  const relT = t - 4.5;
  renderTopPill('🎯 DIVE VELOCITY: 242 MPH · 18G IMPACT');
  const cx = W / 2;
  const cy = H * 0.40;

  ctx.save();
  ctx.translate(cx, cy);

  // Military HUD Crosshair & Targeting Reticle
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 16;

  // Outer Reticle Ring
  ctx.beginPath();
  ctx.arc(0, 0, 110, 0, Math.PI * 2);
  ctx.stroke();

  // Corner brackets
  const bSize = 35;
  [-1, 1].forEach(sx => {
    [-1, 1].forEach(sy => {
      ctx.beginPath();
      ctx.moveTo(sx * 90, sy * 60);
      ctx.lineTo(sx * 90, sy * 90);
      ctx.lineTo(sx * 60, sy * 90);
      ctx.stroke();
    });
  });

  // 242 MPH Big Slam
  const speedProg = Math.min(242, Math.floor(120 + relT * 50));
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 52px Space Grotesk';
  ctx.fillText(speedProg + ' MPH', 0, 15);
  ctx.fillStyle = '#ef4444';
  ctx.font = '800 14px JetBrains Mono';
  ctx.fillText('⚡ LETHAL DIVING STRIKE', 0, 50);

  ctx.restore();
}

function renderStory2_FalconReflex15ms(t) {
  renderTopPill('⚡ NEURAL REFLEX ARC: 15 MILLISECONDS');
  const cx = W / 2;
  const cy = H * 0.40;

  ctx.save();
  ctx.translate(cx, cy);

  // Oscilloscope Reflex Waveform
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#10b981';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  for (let x = -180; x <= 180; x += 5) {
    const y = Math.sin(x * 0.05 + t * 15) * Math.exp(-Math.pow(x / 90, 2)) * 65;
    if (x === -180) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Metric Text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 48px Space Grotesk';
  ctx.fillText('15 ms', 0, -50);
  ctx.fillStyle = '#34d399';
  ctx.font = '800 14px JetBrains Mono';
  ctx.fillText('30X FASTER THAN HUMAN EYE BLINK', 0, 90);

  ctx.restore();
}

// -------------------------------------------------------------
// STORY 3: FORMULA 1 PIT STOP (1.80s WORLD RECORD)
// -------------------------------------------------------------
function renderStory3_F1StartingGridLights(t) {
  renderTopPill('🏎️ FORMULA 1 WORLD RECORD PIT STOP');
  const cx = W / 2;
  const cy = H * 0.42;

  ctx.save();
  ctx.translate(cx, cy);

  // Draw 5 F1 Starting Gantry Lights
  const lightCount = 5;
  const spacing = 65;
  const startX = -((lightCount - 1) * spacing) / 2;
  const litCount = Math.min(5, Math.floor(t * 1.5) + 1);

  for (let i = 0; i < lightCount; i++) {
    const lx = startX + i * spacing;
    // Outer housing
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    roundRect(ctx, lx - 24, -40, 48, 80, 10, true, true);

    // Bulb
    ctx.beginPath();
    ctx.arc(lx, 0, 18, 0, Math.PI * 2);
    if (i < litCount) {
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 22;
      ctx.fill();
    } else {
      ctx.fillStyle = '#334155';
      ctx.shadowBlur = 0;
      ctx.fill();
    }
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = '900 16px Space Grotesk';
  ctx.fillText(litCount >= 5 ? 'LIGHTS OUT AND AWAY WE GO!' : 'BUILDING RPM GRID MATRIX', 0, 80);

  ctx.restore();
}

function renderStory3_F1Stopwatch180(t) {
  const relT = t - 4.5;
  renderTopPill('⏱️ McLAREN F1 PIT CREW: 1.80 SECONDS FLAT');
  const cx = W / 2;
  const cy = H * 0.40;

  ctx.save();
  ctx.translate(cx, cy);

  // Digital Stopwatch Ring
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 10;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.arc(0, 0, 120, 0, Math.PI * 2);
  ctx.stroke();

  // Stopwatch Display
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '800 13px JetBrains Mono';
  ctx.fillText('ALL 4 TIRES REPLACED IN', 0, -45);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 56px Space Grotesk';
  ctx.fillText('1.80s', 0, 18);
  ctx.fillStyle = '#10b981';
  ctx.font = '800 15px JetBrains Mono';
  ctx.fillText('🏆 FIA OFFICIAL WORLD RECORD', 0, 60);

  ctx.restore();
}

function renderStory3_F1SpinningTire(t) {
  renderTopPill('⚡ 20 MECHANICS · 4 TIRES · 2 HEARTBEATS');
  const cx = W / 2;
  const cy = H * 0.40;

  ctx.save();
  ctx.translate(cx, cy);

  // Spinning Racing Wheel Rim
  ctx.rotate(t * 8);
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(0, 0, 95, 0, Math.PI * 2);
  ctx.fill();

  // Yellow rim ring
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Wheel Spokes
  for (let i = 0; i < 5; i++) {
    ctx.rotate((Math.PI * 2) / 5);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 85);
    ctx.stroke();
  }

  // Center Lock Nut
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// -------------------------------------------------------------
// STORY 4: BRAIN NEURONS & AI SEARCH (86B NEURONS & CHATGPT)
// -------------------------------------------------------------
function renderStory4_BrainSynapses(t) {
  renderTopPill('🧠 86 BILLION NEURONS: 13ms PERCEPTION');
  const cx = W / 2;
  const cy = H * 0.42;

  ctx.save();
  ctx.translate(cx, cy);

  // Glowing Synaptic Network Nodes
  const nodes = [
    { x: -110, y: -70 }, { x: 0, y: -90 }, { x: 120, y: -60 },
    { x: -70, y: 10 }, { x: 70, y: 20 }, { x: 0, y: 40 },
    { x: -120, y: 80 }, { x: 110, y: 90 }
  ];

  // Draw connecting synapses
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
  ctx.lineWidth = 2;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < 160) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  // Draw Pulsing Nodes
  nodes.forEach((n, idx) => {
    const pulse = Math.sin(t * 10 + idx) * 4 + 8;
    ctx.fillStyle = '#c084fc';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(n.x, n.y, pulse, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px Space Grotesk';
  ctx.fillText('13 MILLISECOND REFLEX', 0, 150);

  ctx.restore();
}

function renderStory4_ChatGptTerminal(t) {
  renderTopPill('🔍 HOMEOWNERS ASK AI: "WHO IS BEST NEAR ME?"');
  const cx = W / 2;
  const cy = H * 0.40;

  ctx.save();
  ctx.translate(cx, cy);

  // ChatGPT Terminal Window
  const termW = 420;
  const termH = 180;
  ctx.fillStyle = '#090d16';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  roundRect(ctx, -termW / 2, -termH / 2, termW, termH, 14, true, true);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#10b981';
  ctx.font = '800 13px JetBrains Mono';
  ctx.fillText('ChatGPT 5.0 · Autonomous Search Query', -termW / 2 + 18, -termH / 2 + 28);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 14px Inter';
  ctx.fillText('"Find me the top emergency contractor', -termW / 2 + 18, -termH / 2 + 65);
  ctx.fillText('open right now with 5-star reviews."', -termW / 2 + 18, -termH / 2 + 92);

  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 14px JetBrains Mono';
  ctx.fillText('⚡ 100 TRILLION PARAMETERS SCANNED', -termW / 2 + 18, -termH / 2 + 140);

  ctx.restore();
}

function renderStory4_AiCitationRank1(t) {
  renderTopPill('🏆 AEO DOMINANCE: RECOMMENDED #1 BY AI');
  const cx = W / 2;
  const cy = H * 0.40;

  ctx.save();
  ctx.translate(cx, cy);

  // Glowing #1 Citation Hexagon Badge
  ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#10b981';
  ctx.shadowBlur = 28;
  roundRect(ctx, -140, -90, 280, 180, 20, true, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#10b981';
  ctx.font = '900 68px Space Grotesk';
  ctx.fillText('#1', 0, 10);
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 16px Space Grotesk';
  ctx.fillText('PRIMARY AI CITATION', 0, 52);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 12px JetBrains Mono';
  ctx.fillText('CHATGPT · PERPLEXITY · SGE', 0, 75);

  ctx.restore();
}

// -------------------------------------------------------------
// STORY 5: SATURN V MOON ROCKET (4KB RAM COMPUTING)
// -------------------------------------------------------------
function renderStory5_ApolloCountdown(t) {
  renderTopPill('🚀 APOLLO 11: 4 KILOBYTES OF MEMORY');
  const cx = W / 2;
  const cy = H * 0.42;

  ctx.save();
  ctx.translate(cx, cy);

  // Digital Countdown Timer Box
  const countSec = Math.max(0, 3 - Math.floor(t));
  ctx.fillStyle = '#0b0f19';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 24;
  roundRect(ctx, -130, -70, 260, 140, 16, true, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ef4444';
  ctx.font = '900 64px Space Grotesk';
  ctx.fillText('T - 0' + countSec, 0, 15);
  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 13px JetBrains Mono';
  ctx.fillText('KENNEDY SPACE CENTER', 0, 48);

  ctx.restore();
}

function renderStory5_RocketExhaust(t) {
  renderTopPill('🔥 7.5 MILLION POUNDS OF THRUST');
  const cx = W / 2;
  const cy = H * 0.40;

  ctx.save();
  ctx.translate(cx, cy);

  // Fiery Particle Plume
  for (let i = 0; i < 24; i++) {
    const rx = (Math.random() - 0.5) * 80;
    const ry = (Math.random()) * 160;
    const rSize = Math.random() * 18 + 8;
    ctx.fillStyle = i % 2 === 0 ? '#f59e0b' : '#ef4444';
    ctx.beginPath();
    ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 36px Space Grotesk';
  ctx.fillText('LIFTOFF DETECTED', 0, -40);

  ctx.restore();
}

function renderStory5_Apollo4kbRAM(t) {
  renderTopPill('🛰️ 240,000 MILES THROUGH DEEP SPACE');
  const cx = W / 2;
  const cy = H * 0.40;

  ctx.save();
  ctx.translate(cx, cy);

  // Wireframe Moon Trajectory Arc
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(0, 80, 160, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 48px Space Grotesk';
  ctx.fillText('4 KB RAM', 0, -10);
  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 14px JetBrains Mono';
  ctx.fillText('NAVIGATED THE MOON MISSION', 0, 30);

  ctx.restore();
}

// -------------------------------------------------------------
// STORY 6: LIGHTNING STRIKE (1 BILLION VOLTS & 50,000°F)
// -------------------------------------------------------------
function renderStory6_LightningStorm(t) {
  renderTopPill('⚡ 1 BILLION VOLTS IN 30 MICROSECONDS');
  const cx = W / 2;
  const cy = H * 0.42;

  ctx.save();
  ctx.translate(cx, cy);

  // Jagged electric plasma bolt
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 25;
  ctx.beginPath();
  let lx = 0, ly = -140;
  ctx.moveTo(lx, ly);
  while (ly < 140) {
    lx += (Math.random() - 0.5) * 45;
    ly += 25;
    ctx.lineTo(lx, ly);
  }
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 38px Space Grotesk';
  ctx.fillText('PLASMA DISCHARGE', 0, 175);

  ctx.restore();
}

function renderStory6_OneBillionVolts(t) {
  renderTopPill('⚡ 1,000,000,000 VOLTS OF ELECTRIC POWER');
  const cx = W / 2;
  const cy = H * 0.40;

  ctx.save();
  ctx.translate(cx, cy);

  // Voltage Meter Arc
  drawGaugeArc(ctx, 0, 0, 110, Math.PI * 0.8, Math.PI * 2.2, '#38bdf8', 12);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '800 12px JetBrains Mono';
  ctx.fillText('PEAK ENERGY SURGE', 0, -35);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 50px Space Grotesk';
  ctx.fillText('1.0 GV', 0, 16);
  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 14px JetBrains Mono';
  ctx.fillText('ONE BILLION VOLTS', 0, 52);

  ctx.restore();
}

function renderStory6_Thermal50kDegrees(t) {
  renderTopPill('🔥 50,000° FAHRENHEIT (5X HOTTER THAN SUN)');
  const cx = W / 2;
  const cy = H * 0.40;

  ctx.save();
  ctx.translate(cx, cy);

  // Blazing Core Sphere
  const sunGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 90);
  sunGrad.addColorStop(0, '#ffffff');
  sunGrad.addColorStop(0.3, '#fef08a');
  sunGrad.addColorStop(0.7, '#f97316');
  sunGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 90, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 48px Space Grotesk';
  ctx.fillText('50,000°F', 0, 15);
  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 14px JetBrains Mono';
  ctx.fillText('SUPERHEATED AIR CHANNEL', 0, 55);

  ctx.restore();
}

// -------------------------------------------------------------
// STORY 7: NIAGARA TORRENT (750,000 GALLONS/SEC FLUID DYNAMICS)
// -------------------------------------------------------------
function renderStory7_NiagaraWaterfall(t) {
  renderTopPill('🌊 NIAGARA FALLS: 750,000 GALLONS / SECOND');
  const cx = W / 2;
  const cy = H * 0.42;

  ctx.save();
  ctx.translate(cx, cy);

  // Cascading water stream lines
  for (let i = 0; i < 16; i++) {
    const x = (i - 8) * 22;
    const yOff = ((t * 500 + i * 40) % 260) - 130;
    ctx.strokeStyle = i % 2 === 0 ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, yOff);
    ctx.lineTo(x, yOff + 80);
    ctx.stroke();
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 42px Space Grotesk';
  ctx.fillText('750,000 GPM', 0, 160);

  ctx.restore();
}

function renderStory7_GallonsMeter750k(t) {
  renderTopPill('🏊 FILLS 1,200 OLYMPIC POOLS PER MINUTE');
  const cx = W / 2;
  const cy = H * 0.40;

  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = 'rgba(2, 132, 199, 0.2)';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  roundRect(ctx, -135, -80, 270, 160, 16, true, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 52px Space Grotesk';
  ctx.fillText('1,200', 0, 10);
  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 14px JetBrains Mono';
  ctx.fillText('OLYMPIC POOLS / MINUTE', 0, 45);

  ctx.restore();
}

function renderStory7_BurstPipePressure(t) {
  renderTopPill('⚠️ BURST PIPE: 600 GALLONS PER HOUR IN HOME');
  const cx = W / 2;
  const cy = H * 0.40;

  ctx.save();
  ctx.translate(cx, cy);

  // Pressure gauge in danger zone
  drawGaugeArc(ctx, 0, 0, 105, Math.PI * 0.8, Math.PI * 2.2, '#ef4444', 12);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 48px Space Grotesk';
  ctx.fillText('120 PSI', 0, 14);
  ctx.fillStyle = '#ef4444';
  ctx.font = '800 14px JetBrains Mono';
  ctx.fillText('CRITICAL PIPE RUPTURE', 0, 52);

  ctx.restore();
}

// -------------------------------------------------------------
// UNIVERSAL SCENE 4 GLITCH CONTRAST (13.5s - 18.0s)
// -------------------------------------------------------------
function renderUniversalGlitchContrast(t) {
  const relT = t - 13.5;
  renderTopPill('⚡ THE BRUTAL CONTRACTOR SPEED CONTRAST');

  const cx = W / 2;
  const cy = H * 0.42;

  ctx.save();
  ctx.translate(cx, cy);

  // Glitch jitter
  const glitch = Math.sin(relT * 35) * (relT > 2.0 ? 8 : 2);
  ctx.translate(glitch, 0);

  // Contrast Card
  const cW = 440;
  const cH = 220;
  ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  roundRect(ctx, -cW / 2, -cH / 2, cW, cH, 18, true, true);

  const headline1 = (window.ACTIVE_STORY && window.ACTIVE_STORY.contrastLine1) ? window.ACTIVE_STORY.contrastLine1 : 'YET AN INTERPLANETARY SPACE TRIP';
  const headline2 = (window.ACTIVE_STORY && window.ACTIVE_STORY.contrastLine2) ? window.ACTIVE_STORY.contrastLine2 : 'IS FASTER THAN A CONTRACTOR VOICEMAIL';

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f87171';
  ctx.font = '800 14px JetBrains Mono';
  ctx.fillText(headline1, 0, -40);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 22px Space Grotesk';
  ctx.fillText(headline2, 0, -5);

  ctx.fillStyle = '#f59e0b';
  ctx.font = '800 14px JetBrains Mono';
  ctx.fillText('AVERAGE CALLBACK DELAY: 4+ HOURS', 0, 45);

  ctx.restore();
}

// -------------------------------------------------------------
// DYNAMIC STORY DISPATCHER (0.00s - 18.00s)
// -------------------------------------------------------------
function renderDynamicStoryHookPhase(t) {
  const storyType = (window.ACTIVE_STORY && window.ACTIVE_STORY.type) ? window.ACTIVE_STORY.type : 'cosmic_light';

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
`;

// Insert the story rendering functions right before renderScene5_Stat78PercentSlam
const scene5Target = '// -------------------------------------------------------------\n// SCENE 5 (18.00s - 22.50s): The 78% First-Responder Stat Slam';
content = content.replace(scene5Target, storyRenderingFunctions + '\n' + scene5Target);
console.log('✓ Injected 8 Distinct Story Animation Renderers into Canvas Engine');

// 2. Route draw(time) to call renderDynamicStoryHookPhase(time)
const oldSceneSwitchRegex = /if \(time < 4\.5\) \{[\s\S]*?renderScene4_ContractorGlitchDelay\(time\);\s*\}/;
const newSceneSwitch = `if (time < 18.0) {
    renderDynamicStoryHookPhase(time);
  }`;

content = content.replace(oldSceneSwitchRegex, newSceneSwitch);
console.log('✓ Routed draw() to renderDynamicStoryHookPhase for time < 18.0s');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Successfully written upgraded website/demo/reel-creator.html with Dynamic Story Engine');
