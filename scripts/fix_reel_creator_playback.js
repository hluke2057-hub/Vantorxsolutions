const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, '..', 'website', 'demo', 'reel-creator.html');
let html = fs.readFileSync(htmlPath, 'utf8');

console.log('Original reel-creator.html size:', html.length);

// 1. ADD CSS FOR REEL PLAY OVERLAY IF NOT PRESENT
if (!html.includes('.reel-play-overlay')) {
  const overlayCss = `
  /* Big Interactive Play Overlay over Canvas */
  .reel-play-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(5, 8, 15, 0.72);
    backdrop-filter: blur(5px);
    z-index: 12;
    cursor: pointer;
    transition: all 0.25s ease;
    user-select: none;
    text-align: center;
    padding: 24px;
    box-sizing: border-box;
  }
  .reel-play-overlay:hover .reel-play-circle {
    transform: scale(1.12);
    box-shadow: 0 0 35px #f59e0b, inset 0 0 15px rgba(245, 158, 11, 0.4);
    border-color: #fbbf24;
  }
  .reel-play-circle {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(217, 119, 6, 0.95));
    border: 3px solid #ffffff;
    box-shadow: 0 0 25px rgba(245, 158, 11, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 16px;
    transition: all 0.25s ease;
  }
  .reel-play-pulse-ring {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 2px solid #f59e0b;
    animation: pulseRing 1.8s infinite;
  }
  @keyframes pulseRing {
    0% { transform: scale(0.95); opacity: 0.9; }
    50% { transform: scale(1.2); opacity: 0.3; }
    100% { transform: scale(1.35); opacity: 0; }
  }
  .reel-play-triangle {
    font-size: 32px;
    color: #070a0f;
    margin-left: 5px;
  }
  .reel-play-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 20px;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 0.04em;
    margin-bottom: 6px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.8);
  }
  .reel-play-sub {
    font-size: 12.5px;
    color: #fbbf24;
    font-weight: 700;
    max-width: 300px;
    line-height: 1.45;
    margin-bottom: 14px;
  }
  .reel-play-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.18);
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 10.5px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    color: #cbd5e1;
  }
`;
  html = html.replace('/* Studio Workspace */', () => overlayCss + '\n/* Studio Workspace */');
  console.log('✅ Added .reel-play-overlay CSS');
}

// 2. CONNECT MORNING & EVENING SLOT BUTTONS in HTML
const morningOldBtn = `<button type="button" id="btnMorningSlot" class="btn-slot-drop active" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0.12)); border: 1.5px solid #f59e0b; color: #fbbf24; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 0 16px rgba(245, 158, 11, 0.25); transition: all 0.2s;">`;
const morningNewBtn = `<button type="button" id="btnMorningSlot" class="btn-slot-drop active" onclick="selectDailySlot('morning')" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0.12)); border: 1.5px solid #f59e0b; color: #fbbf24; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 0 16px rgba(245, 158, 11, 0.25); transition: all 0.2s;">`;

const eveningOldBtn = `<button type="button" id="btnEveningSlot" class="btn-slot-drop" style="background: rgba(30, 41, 59, 0.8); border: 1.5px solid rgba(255, 255, 255, 0.15); color: #94a3b8; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;">`;
const eveningNewBtn = `<button type="button" id="btnEveningSlot" class="btn-slot-drop" onclick="selectDailySlot('evening')" style="background: rgba(30, 41, 59, 0.8); border: 1.5px solid rgba(255, 255, 255, 0.15); color: #94a3b8; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;">`;

if (html.includes(morningOldBtn)) {
  html = html.replace(morningOldBtn, () => morningNewBtn);
  console.log('✅ Added onclick="selectDailySlot(\'morning\')" to #btnMorningSlot');
}
if (html.includes(eveningOldBtn)) {
  html = html.replace(eveningOldBtn, () => eveningNewBtn);
  console.log('✅ Added onclick="selectDailySlot(\'evening\')" to #btnEveningSlot');
}

// 3. INJECT #reelPlayOverlay into .video-stage right after #reelRenderingOverlay
if (!html.includes('id="reelPlayOverlay"')) {
  const stageTarget = `<canvas id="reelCanvas" width="540" height="960"></canvas>`;
  const playOverlayHtml = `
    <!-- 🎬 PROMINENT PLAY/PAUSE OVERLAY OVER VIDEO STAGE -->
    <div id="reelPlayOverlay" class="reel-play-overlay" onclick="togglePlay()" role="button" tabindex="0">
      <div class="reel-play-circle">
        <div class="reel-play-pulse-ring"></div>
        <span class="reel-play-triangle">▶</span>
      </div>
      <div class="reel-play-title">CLICK TO PLAY VIRAL REEL</div>
      <div class="reel-play-sub" id="reelPlayStorySub">Speed of Light &amp; The Ladder Dilemma · Ava Voice AI ($9,200 Save)</div>
      <div class="reel-play-badge">
        <span>⚡ 60 FPS INTERACTIVE CANVAS</span>
        <span>•</span>
        <span>🎵 SYNTHWAVE AUDIO</span>
      </div>
    </div>
    <canvas id="reelCanvas" width="540" height="960" onclick="togglePlay()" style="cursor:pointer"></canvas>`;

  html = html.replace(stageTarget, () => playOverlayHtml);
  console.log('✅ Injected #reelPlayOverlay & canvas onclick handler');
}

// 4. UPDATE togglePlay to show/hide overlay and sync indicators
const togglePlayTarget = `function togglePlay() {
  initAudioGraph();
  isPlaying = !isPlaying;
  window.isPlaying = isPlaying;
  window.currentTime = currentTime;
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
}`;

const togglePlayReplacement = `function togglePlay() {
  initAudioGraph();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  isPlaying = !isPlaying;
  window.isPlaying = isPlaying;
  window.currentTime = currentTime;
  const btn = document.getElementById('btnPlayPause');
  const playOverlay = document.getElementById('reelPlayOverlay');
  const recText = document.getElementById('recText');
  const recPill = document.getElementById('recStatusPill');

  if (isPlaying) {
    if (btn) btn.innerHTML = '<span>⏸️</span> Pause Reel';
    if (playOverlay) playOverlay.style.display = 'none';
    if (recText) recText.textContent = 'PLAYING';
    if (recPill) {
      recPill.style.color = '#10b981';
      recPill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    }
    startBackgroundBeat();
    triggerAudioForCurrentTime();
  } else {
    if (btn) btn.innerHTML = '<span>▶️</span> Play &amp; Preview Reel';
    if (playOverlay) playOverlay.style.display = 'flex';
    if (recText) recText.textContent = 'READY';
    if (recPill) {
      recPill.style.color = '#ef4444';
      recPill.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    }
    stopBackgroundBeat();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (uploadedAudioElement) uploadedAudioElement.pause();
  }
}`;

if (html.includes(togglePlayTarget)) {
  html = html.replace(togglePlayTarget, () => togglePlayReplacement);
  console.log('✅ Updated togglePlay() with overlay display and rec indicator toggle');
}

// 5. INJECT selectDailySlot logic
if (!html.includes('window.selectDailySlot')) {
  const slotLogic = `
  // -------------------------------------------------------------
  // 📅 DAILY 2-REELS PIPELINE SELECTION HANDLER (Morning vs Evening)
  // -------------------------------------------------------------
  window.selectDailySlot = function(slot) {
    const btnMorning = document.getElementById('btnMorningSlot');
    const btnEvening = document.getElementById('btnEveningSlot');
    const playSub = document.getElementById('reelPlayStorySub');

    if (slot === 'morning') {
      if (btnMorning) {
        btnMorning.className = 'btn-slot-drop active';
        btnMorning.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0.12))';
        btnMorning.style.borderColor = '#f59e0b';
        btnMorning.style.color = '#fbbf24';
        btnMorning.style.boxShadow = '0 0 16px rgba(245, 158, 11, 0.25)';
      }
      if (btnEvening) {
        btnEvening.className = 'btn-slot-drop';
        btnEvening.style.background = 'rgba(30, 41, 59, 0.8)';
        btnEvening.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        btnEvening.style.color = '#94a3b8';
        btnEvening.style.boxShadow = 'none';
      }

      // Drop #1: Morning (9:00 AM)
      // Product: Ava 24/7 Voice AI Phone Receptionist
      // Hook & Story: Speed of Light & The Ladder Dilemma ($9,200 Save)
      window.PRODUCT_ROTATION_INDEX = 0;
      const prod = window.PRODUCTS_MIND_QUEUE[0];
      buildReelAssetsForProduct(prod);

      if (playSub) {
        playSub.textContent = 'Speed of Light & The Ladder Dilemma · Ava Voice AI ($9,200 Save)';
      }

      currentTime = 0;
      resetSfxFlags();
      renderFrame(0);

      // Scroll to video stage
      const stage = document.querySelector('.video-stage');
      if (stage) stage.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Start playback
      if (!isPlaying) togglePlay();

    } else {
      if (btnEvening) {
        btnEvening.className = 'btn-slot-drop active';
        btnEvening.style.background = 'linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(56, 189, 248, 0.12))';
        btnEvening.style.borderColor = '#38bdf8';
        btnEvening.style.color = '#38bdf8';
        btnEvening.style.boxShadow = '0 0 16px rgba(56, 189, 248, 0.25)';
      }
      if (btnMorning) {
        btnMorning.className = 'btn-slot-drop';
        btnMorning.style.background = 'rgba(30, 41, 59, 0.8)';
        btnMorning.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        btnMorning.style.color = '#94a3b8';
        btnMorning.style.boxShadow = 'none';
      }

      // Drop #2: Evening (5:00 PM)
      // Product: 90-Second SMS Speed-to-Lead Auto-Responder
      // Hook & Story: Peregrine Falcon 242 MPH Dive & The Cash Thief ($14,000 Save)
      window.PRODUCT_ROTATION_INDEX = 1;
      const prod = window.PRODUCTS_MIND_QUEUE[1];
      buildReelAssetsForProduct(prod);

      if (playSub) {
        playSub.textContent = 'Peregrine Falcon 242 MPH Dive & Cash Thief · 90s SMS ($14k Save)';
      }

      currentTime = 0;
      resetSfxFlags();
      renderFrame(0);

      // Scroll to video stage
      const stage = document.querySelector('.video-stage');
      if (stage) stage.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Start playback
      if (!isPlaying) togglePlay();
    }
  };
`;
  html = html.replace('// Initialize Box 2 and Mind State on load', () => slotLogic + '\n// Initialize Box 2 and Mind State on load');
  console.log('✅ Injected window.selectDailySlot logic');
}

// 6. UPDATE generatePromptAndMakeReel to sync Morning/Evening slot indicators & immediately resume audio
const genOldStart = `  window.generatePromptAndMakeReel = async function() {
    if (window.IS_RENDERING_REEL) return;
    window.IS_RENDERING_REEL = true;`;

const genNewStart = `  window.generatePromptAndMakeReel = async function() {
    if (window.IS_RENDERING_REEL) return;
    window.IS_RENDERING_REEL = true;

    // Synchronously unlock AudioContext in direct user gesture handler
    if (typeof initAudioGraph === 'function') initAudioGraph();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }`;

if (html.includes(genOldStart)) {
  html = html.replace(genOldStart, () => genNewStart);
  console.log('✅ Injected synchronous audio unlock in generatePromptAndMakeReel');
}

// 7. Verify all script tags compile with Node vm.Script
const scriptMatch = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi);
console.log('Validating script tags with vm.Script...');
for (const s of scriptMatch) {
  const code = s.replace(/<script[\s\S]*?>/i, '').replace(/<\/script>/i, '');
  try {
    new vm.Script(code);
  } catch (err) {
    console.error('FATAL: Script tag compilation failed:', err.message);
    process.exit(1);
  }
}
console.log('✅ All script tags compiled cleanly in Node.js VM!');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ Successfully wrote updated reel-creator.html! New length:', html.length);
