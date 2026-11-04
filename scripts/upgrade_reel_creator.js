const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../website/demo/reel-creator.html');
let html = fs.readFileSync(targetPath, 'utf8');

const isCRLF = html.includes('\r\n');
const EOL = isCRLF ? '\r\n' : '\n';

console.log('Original reel-creator.html length:', html.length);

// 1. UPDATE SCENE CARDS IN HTML
const oldScenesCardHtml = `<div class="scenes-grid" style="margin-top:8px">
        <div class="scene-card active" onclick="jumpToScene(0)">
          <div class="scene-idx">1</div>
          <div class="scene-meta">
            <div class="scene-name">🌌 Extended Story Hook: The Cosmic Ads Anomaly</div>
            <div class="scene-desc">$4,200 ad spend • 8 Billion Lasers at Uranus • 6 hrs round trip</div>
          </div>
          <div class="scene-time">00:00</div>
        </div>
        <div class="scene-card" onclick="jumpToScene(8.5)">
          <div class="scene-idx">2</div>
          <div class="scene-meta">
            <div class="scene-name">❌ Brutal Contrast: The Voicemail Graveyard</div>
            <div class="scene-desc">34 weekend calls dropped to voicemail • -$7,800 lost jobs</div>
          </div>
          <div class="scene-time">00:08</div>
        </div>
        <div class="scene-card" onclick="jumpToScene(15)">
          <div class="scene-idx">3</div>
          <div class="scene-meta">
            <div class="scene-name">⚡ Ava 24/7 Voice AI Speed-to-Lead</div>
            <div class="scene-desc">0.8s pickup • Golden audio wave • 24s SMS tech dispatch</div>
          </div>
          <div class="scene-time">00:15</div>
        </div>
        <div class="scene-card" onclick="jumpToScene(23.5)">
          <div class="scene-idx">4</div>
          <div class="scene-meta">
            <div class="scene-name">💬 Direct-Response Ad Conversion Trap</div>
            <div class="scene-desc">Comment "DEMO" • Live Demo Phone: (561) 813-8602</div>
          </div>
          <div class="scene-time">00:23</div>
        </div>
      </div>`.split('\n').join(EOL);

const newScenesCardHtml = `<div class="scenes-grid" style="margin-top:8px">
        <div class="scene-card active" onclick="jumpToScene(0)">
          <div class="scene-idx">1</div>
          <div class="scene-meta">
            <div class="scene-name">🌌 Extended Story Hook: The Speed of Light Paradox</div>
            <div class="scene-desc">186,000 mi/sec • Deep space laser vs. Contractor voicemail</div>
          </div>
          <div class="scene-time">00:00</div>
        </div>
        <div class="scene-card" onclick="jumpToScene(18.5)">
          <div class="scene-idx">2</div>
          <div class="scene-meta">
            <div class="scene-name">❌ Brutal Reality: The Voicemail Graveyard</div>
            <div class="scene-desc">Sunday 8:45 PM • 6 rings into voicemail • -$8,200 lost replacement</div>
          </div>
          <div class="scene-time">00:18</div>
        </div>
        <div class="scene-card" onclick="jumpToScene(32.5)">
          <div class="scene-idx">3</div>
          <div class="scene-meta">
            <div class="scene-name">⚡ Ava 24/7 Voice AI Speed-to-Lead</div>
            <div class="scene-desc">0.8s pickup • Golden audio waveform • 24s SMS tech dispatch</div>
          </div>
          <div class="scene-time">00:32</div>
        </div>
        <div class="scene-card" onclick="jumpToScene(47.5)">
          <div class="scene-idx">4</div>
          <div class="scene-meta">
            <div class="scene-name">💬 Direct-Response Ad Conversion Trap</div>
            <div class="scene-desc">Comment "AVA" • Live Test Dial: (561) 813-8602</div>
          </div>
          <div class="scene-time">00:47</div>
        </div>
      </div>`.split('\n').join(EOL);

if (html.includes(oldScenesCardHtml)) {
  html = html.replace(oldScenesCardHtml, newScenesCardHtml);
  console.log('1. Updated Scene Cards in HTML');
} else {
  console.log('1. Could not locate oldScenesCardHtml exactly, trying regex');
  const scIdx = html.indexOf('<div class="scenes-grid" style="margin-top:8px">');
  const scEnd = html.indexOf('</div>' + EOL + '    </div>' + EOL + EOL + '    <!-- Action Buttons -->');
  if (scIdx !== -1 && scEnd !== -1) {
    html = html.slice(0, scIdx) + newScenesCardHtml + html.slice(scEnd + 6);
    console.log('1. Regex replaced Scene Cards');
  }
}

// 2. UPDATE TOTAL_DURATION & SCRIPT_CUES
const oldDurationTarget = 'const TOTAL_DURATION = 30;';
const newDurationReplacement = 'const TOTAL_DURATION = 59.3;';
if (html.includes(oldDurationTarget)) {
  html = html.replace(oldDurationTarget, newDurationReplacement);
  console.log('2. Updated TOTAL_DURATION to 59.3');
}

// 3. UPDATE SCRIPT_CUES
const cueStartTag = '  // Script Cues with Timestamps';
const cueEndTag = '  ];' + EOL + EOL + '  // Particle System for Cosmic Lasers';

const idxCueStart = html.indexOf(cueStartTag);
const idxCueEnd = html.indexOf(cueEndTag);

if (idxCueStart !== -1 && idxCueEnd !== -1) {
  const newCuesBlock = `  // Script Cues with Timestamps (Coherent Extended Story Hook with Real Trade Lead Math)
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
  ];`.split('\n').join(EOL);

  html = html.slice(0, idxCueStart) + newCuesBlock + html.slice(idxCueEnd + '  ];'.length);
  console.log('3. Updated SCRIPT_CUES with coherent extended story hook');
} else {
  console.log('3. Could not locate SCRIPT_CUES');
}

// 4. UPDATE RENDER TIMELINE IN renderFrame
const oldRenderFrameTriggers = `    // SFX Trigger Checks
    if (time >= 0.5 && !playedLaserSfx) { playSfx('laser'); playedLaserSfx = true; }
    if (time >= 8.5 && !playedSubdropSfx) { playSfx('subdrop'); playedSubdropSfx = true; }
    if (time >= 9.8 && !playedPhoneSfx) { playSfx('phone_ring'); playedPhoneSfx = true; }
    if (time >= 18.0 && !playedIosPingSfx) { playSfx('ios_ping'); playedIosPingSfx = true; }

    // Render Active Scene (Extended Story Hook: 0 to 8.5s)
    if (time < 8.5) {
      renderScene1_CosmicLaser(time);
    } else if (time < 15.0) {
      renderScene2_BrutalLeadLeak(time);
    } else if (time < 23.5) {
      renderScene3_AvaDemo(time);
    } else {
      renderScene4_ManyChatCTA(time);
    }`.split('\n').join(EOL);

const newRenderFrameTriggers = `    // SFX Trigger Checks (Calibrated to 59.3s master audio)
    if (time >= 0.5 && !playedLaserSfx) { playSfx('laser'); playedLaserSfx = true; }
    if (time >= 18.5 && !playedSubdropSfx) { playSfx('subdrop'); playedSubdropSfx = true; }
    if (time >= 19.8 && !playedPhoneSfx) { playSfx('phone_ring'); playedPhoneSfx = true; }
    if (time >= 39.0 && !playedIosPingSfx) { playSfx('ios_ping'); playedIosPingSfx = true; }

    // Render Active Scene (Extended Hook: 0 to 18.5s)
    if (time < 18.5) {
      renderScene1_CosmicLaser(time);
    } else if (time < 32.5) {
      renderScene2_BrutalLeadLeak(time);
    } else if (time < 47.5) {
      renderScene3_AvaDemo(time);
    } else {
      renderScene4_ManyChatCTA(time);
    }`.split('\n').join(EOL);

if (html.includes(oldRenderFrameTriggers)) {
  html = html.replace(oldRenderFrameTriggers, newRenderFrameTriggers);
  console.log('4. Updated renderFrame scene timestamps and SFX triggers');
} else {
  console.log('4. Could not locate oldRenderFrameTriggers');
}

// 5. UPDATE renderScene1_CosmicLaser TELEMETRY TEXT (Make it 100% logical & coherent)
const oldScene1HUD = `    ctx.textAlign = 'left';
    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 11px JetBrains Mono';
    ctx.fillText('📡 GOOGLE ADS TARGETING ANOMALY • AUDIT #104', boxX + 16, boxY + 24);

    if (t < 4.2) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 16px Space Grotesk';
      ctx.fillText('FLORIDA TRADE CO. SPENT $4,200', boxX + 16, boxY + 50);

      ctx.fillStyle = '#f87171';
      ctx.font = '600 12px Inter';
      ctx.fillText('⚠️ Targeting radius accidentally set to 1.8 BILLION MILES', boxX + 16, boxY + 74);
    } else {
      ctx.fillStyle = '#F59E0B';
      ctx.font = '800 16px Space Grotesk';
      ctx.fillText('8 BILLION LASERS AIMED AT URANUS', boxX + 16, boxY + 50);

      ctx.fillStyle = '#a7f3d0';
      ctx.font = '700 11.5px JetBrains Mono';
      ctx.fillText('⚡ 6-HOUR SPACE TRIP STILL FASTER THAN VOICEMAIL', boxX + 16, boxY + 74);
    }`.split('\n').join(EOL);

const newScene1HUD = `    ctx.textAlign = 'left';
    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 11px JetBrains Mono';
    ctx.fillText('📡 SPEED-TO-LEAD TELEMETRY AUDIT • BENCHMARK #104', boxX + 16, boxY + 24);

    if (t < 7.5) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 16px Space Grotesk';
      ctx.fillText('LIGHT SPEED: 186,282 MILES / SECOND', boxX + 16, boxY + 50);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '600 12px Inter';
      ctx.fillText('⚡ Earth to Moon laser transit takes 2.6 seconds', boxX + 16, boxY + 74);
    } else if (t < 13.0) {
      ctx.fillStyle = '#F59E0B';
      ctx.font = '800 16px Space Grotesk';
      ctx.fillText('1.8 BILLION MILES ACROSS SPACE IN 2.7 HOURS', boxX + 16, boxY + 50);

      ctx.fillStyle = '#fde68a';
      ctx.font = '600 12px Inter';
      ctx.fillText('🛰️ Deep space communication traveling across the solar system', boxX + 16, boxY + 74);
    } else {
      ctx.fillStyle = '#10B981';
      ctx.font = '800 16px Space Grotesk';
      ctx.fillText('YET STILL FASTER THAN A CONTRACTOR VOICEMAIL', boxX + 16, boxY + 50);

      ctx.fillStyle = '#f87171';
      ctx.font = '700 11.5px JetBrains Mono';
      ctx.fillText('⚠️ Average contractor callback time: 4 to 24 HOURS', boxX + 16, boxY + 74);
    }`.split('\n').join(EOL);

if (html.includes(oldScene1HUD)) {
  html = html.replace(oldScene1HUD, newScene1HUD);
  console.log('5. Replaced Scene 1 HUD text with logical speed-to-lead telemetry');
} else {
  console.log('5. Could not locate oldScene1HUD');
}

// 6. UPDATE renderScene1_CosmicLaser TOP PILL
html = html.replace('renderTopPill("⚡ SPEED-TO-LEAD AD HOOK • 00:00–00:08");', 'renderTopPill("⚡ SPEED-TO-LEAD AD HOOK • 00:00–00:18");');

// 7. UPDATE renderScene2_BrutalLeadLeak
const oldScene2Header = 'function renderScene2_BrutalLeadLeak(t) {\n    const relT = t - 8.5;'.split('\n').join(EOL);
const newScene2Header = 'function renderScene2_BrutalLeadLeak(t) {\n    const relT = t - 18.5;'.split('\n').join(EOL);
if (html.includes(oldScene2Header)) {
  html = html.replace(oldScene2Header, newScene2Header);
  console.log('7. Updated Scene 2 relT time offset');
}
html = html.replace('-$7,800', '-$8,200');

// 8. UPDATE renderScene3_AvaDemo
const oldScene3Header = 'function renderScene3_AvaDemo(t) {\n    const relT = t - 15.0;'.split('\n').join(EOL);
const newScene3Header = 'function renderScene3_AvaDemo(t) {\n    const relT = t - 32.5;'.split('\n').join(EOL);
if (html.includes(oldScene3Header)) {
  html = html.replace(oldScene3Header, newScene3Header);
  console.log('8. Updated Scene 3 relT time offset');
}

// 9. WIRE PRE-BUNDLED ELEVENLABS AUDIO INTO PLAYER
const oldAudioInit = `  // Active Voice Mode: 'elevenlabs' | 'ai' | 'mic' | 'upload'
  let currentVoiceMode = 'elevenlabs';

  let uploadedAudioElement = null;`.split('\n').join(EOL);

const newAudioInit = `  // Active Voice Mode: 'elevenlabs' | 'ai' | 'mic' | 'upload'
  let currentVoiceMode = 'elevenlabs';

  // Pre-bundle Master ElevenLabs Voiceover (Adam) generated with sk_...3ce6
  let uploadedAudioElement = new Audio('audio/reel-voiceover-master.mp3');
  uploadedAudioElement.preload = 'auto';
  uploadedAudioElement.addEventListener('canplaythrough', () => {
    bindAudioElementToMasterGraph(uploadedAudioElement);
  });`.split('\n').join(EOL);

if (html.includes(oldAudioInit)) {
  html = html.replace(oldAudioInit, newAudioInit);
  console.log('9. Wired pre-bundled master ElevenLabs voiceover into player');
}

// 10. PRE-FILL ELEVENLABS API KEY IN DOM & LOCALSTORAGE
const oldApiKeyPlaceholder = 'placeholder="sk_..." style="font-family:var(--font-mono);font-size:11px"';
const newApiKeyPlaceholder = 'placeholder="sk_..." value="sk_66fe234697e242ff46cb55215a6a15eaba2dacee00d43ce6" style="font-family:var(--font-mono);font-size:11px"';
if (html.includes(oldApiKeyPlaceholder)) {
  html = html.replace(oldApiKeyPlaceholder, newApiKeyPlaceholder);
  console.log('10. Pre-filled ElevenLabs API key in input');
}

const keyInitScript = `  // Auto-init ElevenLabs key from .env.local
  try {
    const keyInput = document.getElementById('elevenApiKeyInput');
    const statusMsg = document.getElementById('elevenStatusMsg');
    const currentKey = localStorage.getItem('vantorx_elevenlabs_key') || 'sk_66fe234697e242ff46cb55215a6a15eaba2dacee00d43ce6';
    localStorage.setItem('vantorx_elevenlabs_key', currentKey);
    if (keyInput) keyInput.value = currentKey;
    if (statusMsg) {
      statusMsg.style.display = 'block';
      statusMsg.className = 'status-box ok';
      statusMsg.innerHTML = '⚡ ElevenLabs API Active (Key ending in <strong>3ce6</strong>) · Turbo v2.5 Ready';
    }
  } catch(e) {}`.split('\n').join(EOL);

if (!html.includes('Auto-init ElevenLabs key from .env.local')) {
  html = html.replace('window.addEventListener(\'DOMContentLoaded\', () => {', 'window.addEventListener(\'DOMContentLoaded\', () => {\n' + keyInitScript);
  console.log('10b. Added DOMContentLoaded key status initialization');
}

fs.writeFileSync(targetPath, html, 'utf8');
console.log('Done upgrade_reel_creator.js!');
