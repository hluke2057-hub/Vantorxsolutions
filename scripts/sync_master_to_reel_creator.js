const fs = require('fs');
const path = require('path');

// 1. Run build_extended_story_engine.js first
require('./build_extended_story_engine.js');

const htmlPath = path.resolve(__dirname, '../website/demo/reel-creator.html');
const mp3Path = path.resolve(__dirname, '../website/demo/audio/reel-voiceover-master.mp3');
const wordsPath = path.resolve(__dirname, '../website/demo/audio/word_timestamps.json');
const enginePath = path.resolve(__dirname, 'taskless_engine_code.js');

let html = fs.readFileSync(htmlPath, 'utf8');
const mp3Base64 = fs.readFileSync(mp3Path).toString('base64');
const wordsJson = fs.readFileSync(wordsPath, 'utf8');
const engineCode = fs.readFileSync(enginePath, 'utf8');

// A. Update TOTAL_DURATION = 89.0
html = html.replace(/const TOTAL_DURATION = [0-9.]+;/g, 'const TOTAL_DURATION = 89.0;');

// B. Replace EMBEDDED_STUDIO_AUDIO with the new 89.0s Full Master Mix MP3 (Voice + Music + SFX)
const embeddedRegex = /const EMBEDDED_STUDIO_AUDIO = "data:audio\/mp3;base64,[^"]+";/;
if (!embeddedRegex.test(html)) {
  throw new Error('Could not find EMBEDDED_STUDIO_AUDIO in reel-creator.html');
}
html = html.replace(embeddedRegex, `const EMBEDDED_STUDIO_AUDIO = "data:audio/mp3;base64,${mp3Base64}";`);
console.log('✅ Updated EMBEDDED_STUDIO_AUDIO with 89.0s Full Master Mix MP3 (' + (mp3Base64.length / 1024).toFixed(1) + ' KB base64)');

// C. Replace WORD_TIMESTAMPS array with the new 275-word ElevenLabs alignment
const wordTsStart = html.indexOf('const MASTER_COSMIC_WORD_TIMESTAMPS =') !== -1
  ? html.indexOf('const MASTER_COSMIC_WORD_TIMESTAMPS =')
  : html.indexOf('let WORD_TIMESTAMPS = [');
const wordTsEnd = html.indexOf('window.WORD_TIMESTAMPS = WORD_TIMESTAMPS;');
if (wordTsStart !== -1 && wordTsEnd !== -1) {
  const newWordTsBlock = `const MASTER_COSMIC_WORD_TIMESTAMPS = ${wordsJson};\nlet WORD_TIMESTAMPS = [...MASTER_COSMIC_WORD_TIMESTAMPS];\n`;
  html = html.slice(0, wordTsStart) + newWordTsBlock + html.slice(wordTsEnd);
  console.log('✅ Updated WORD_TIMESTAMPS with 275 exact ElevenLabs words');
}

// D. Replace the Taskless Engine block (from "// VANTORX VIRAL REEL ENGINE" up to "// Animation Loop: Bound Directly to Hardware Audio Clock")
const engineStartIdx = html.indexOf('// VANTORX VIRAL REEL ENGINE');
const loopMarker = '// Animation Loop: Bound Directly to Hardware Audio Clock';
const loopIdx = html.indexOf(loopMarker);

if (engineStartIdx === -1 || loopIdx === -1) {
  throw new Error(`Could not locate engine bounds: engineStartIdx=${engineStartIdx}, loopIdx=${loopIdx}`);
}
const blockStart = html.lastIndexOf('// ====', engineStartIdx);
html = html.slice(0, blockStart) + engineCode + '\n\n' + html.slice(loopIdx);
console.log('✅ Injected 12-scene 89.0s Cueva 2D Illustrated Engine + Boxless Captions');

// E. Update Audio Graph & uploadedAudioElement binding so masterCompressor (-14dB) NEVER ducks/crushes the baked-in Cueva music bed!
html = html.replace(
  /let uploadedAudioElement = new Audio\(EMBEDDED_STUDIO_AUDIO\);\s*uploadedAudioElement\.preload = 'auto';(\s*uploadedAudioElement\.addEventListener\('canplaythrough',\s*\(\)\s*=>\s*\{\s*bindAudioElementToMasterGraph\(uploadedAudioElement\);\s*\}\);)?/,
  `let uploadedAudioElement = new Audio(EMBEDDED_STUDIO_AUDIO);\n  uploadedAudioElement.preload = 'auto';\n  uploadedAudioElement.volume = 1.0;`
);

html = html.replace(
  /masterGain\.gain\.setValueAtTime\(0\.9,\s*audioCtx\.currentTime\);/,
  `masterGain.gain.setValueAtTime(1.0, audioCtx.currentTime);`
);

html = html.replace(
  /const srcNode = audioCtx\.createMediaElementSource\(audioEl\);\s*srcNode\.connect\(bassEQ\);[^\n]*/,
  `const srcNode = audioCtx.createMediaElementSource(audioEl);\n        // Connect directly to masterGain so the pre-mastered studio mix (Voice + Cueva Synthwave Music + Foley SFX)\n        // is NEVER crushed or ducked by the -14dB compressor when the narrator speaks!\n        srcNode.connect(masterGain);`
);

// Ensure togglePlay binds uploadedAudioElement on first user gesture
if (!html.includes('bindAudioElementToMasterGraph(uploadedAudioElement);\n  if (audioCtx && audioCtx.state')) {
  html = html.replace(
    /initAudioGraph\(\);\s*if \(audioCtx && audioCtx\.state === 'suspended'\)/,
    `initAudioGraph();\n  if (uploadedAudioElement) { bindAudioElementToMasterGraph(uploadedAudioElement); }\n  if (audioCtx && audioCtx.state === 'suspended')`
  );
}

// F. Update Timeline & Scene Cards UI to match 89.0s Cueva 5-Step Storyboard
html = html.replace(
  /<span id="currentSceneLabel">[^<]+<\/span>\s*<span id="totalDurationLabel">[^<]+<\/span>/,
  `<span id="currentSceneLabel">Scene 1: Cueva Speed-of-Light Hook</span>\n          <span id="totalDurationLabel">01:29</span>`
);

const oldScenesGridRegex = /<!-- Scenes List -->[\s\S]*?<\/div>\s*<\/div>\s*<!-- Action Buttons -->/;
const newScenesGrid = `<!-- Scenes List -->
    <div>
      <div class="panel-section-title">🎬 Video Scenes (Cueva 5-Step Storyboard)</div>
      <div class="scenes-grid" style="margin-top:8px">
        <div class="scene-card active" onclick="jumpToScene(0)">
          <div class="scene-idx">1</div>
          <div class="scene-meta">
            <div class="scene-name" id="scene1TitleLabel">① Cueva Hook: 186,000 MI/S &amp; Solar Relay</div>
            <div class="scene-desc" id="scene1DescLabel">Photon Cannon &amp; 4-Planet Speedometer Gauge to Uranus</div>
          </div>
          <div class="scene-time">00:00</div>
        </div>
        <div class="scene-card" onclick="jumpToScene(21.0)">
          <div class="scene-idx">2</div>
          <div class="scene-meta">
            <div class="scene-name">② 27.4 Hr Paradox &amp; Meet Bob in 130°F Attic</div>
            <div class="scene-desc">Golden Balance Scale • Master Contractor Bob 20ft up ladder</div>
          </div>
          <div class="scene-time">00:21</div>
        </div>
        <div class="scene-card" onclick="jumpToScene(36.8)">
          <div class="scene-idx">3</div>
          <div class="scene-meta">
            <div class="scene-name">③ Sarah's Burst Pipe, Voicemail &amp; 78% Hook</div>
            <div class="scene-desc">Flooding Living Room • Call Detector Machine • Underwater Hook</div>
          </div>
          <div class="scene-time">00:37</div>
        </div>
        <div class="scene-card" onclick="jumpToScene(57.5)">
          <div class="scene-idx">4</div>
          <div class="scene-meta">
            <div class="scene-name">④ $8,000 Check Lost vs. Ava 0.8s AI Hologram</div>
            <div class="scene-desc">Competitor Check Theft • Neon Pink AI Brain &amp; 24s SMS Dispatch</div>
          </div>
          <div class="scene-time">00:58</div>
        </div>
        <div class="scene-card" onclick="jumpToScene(76.2)">
          <div class="scene-idx">5</div>
          <div class="scene-meta">
            <div class="scene-name">⑤ Captured Revenue &amp; Cueva Typewriter CTA</div>
            <div class="scene-desc">+$8,000 Secured • Comment "AVA" • Live Dial: (561) 813-8602</div>
          </div>
          <div class="scene-time">01:16</div>
        </div>
      </div>
    </div>


    <!-- Action Buttons -->`;

if (oldScenesGridRegex.test(html)) {
  html = html.replace(oldScenesGridRegex, newScenesGrid);
  console.log('✅ Updated 5 Cueva Scene Cards in right panel');
}

// Update updateUI() time formatting (MM:SS) and 5-card active highlight
const oldUpdateUiCardsRegex = /const curSec = Math\.floor\(currentTime\);\s*const label = document\.getElementById\('currentTimeLabel'\);\s*if \(label\) label\.textContent = '00:' \+ \(curSec < 10 \? '0' : ''\) \+ curSec;\s*const cards = document\.querySelectorAll\('\.scene-card'\);\s*cards\.forEach\(c => c\.classList\.remove\('active'\)\);\s*if \(currentTime < 18\.5 && cards\[0\]\) cards\[0\]\.classList\.add\('active'\);\s*else if \(currentTime < 32\.5 && cards\[1\]\) cards\[1\]\.classList\.add\('active'\);\s*else if \(currentTime < 47\.5 && cards\[2\]\) cards\[2\]\.classList\.add\('active'\);\s*else if \(cards\[3\]\) cards\[3\]\.classList\.add\('active'\);/;
const newUpdateUiCards = `const curSec = Math.floor(currentTime);
    const curMin = Math.floor(curSec / 60);
    const remSec = curSec % 60;
    const label = document.getElementById('currentTimeLabel');
    if (label) label.textContent = (curMin < 10 ? '0' : '') + curMin + ':' + (remSec < 10 ? '0' : '') + remSec;

    const cards = document.querySelectorAll('.scene-card');
    cards.forEach(c => c.classList.remove('active'));
    if (currentTime < 21.0 && cards[0]) cards[0].classList.add('active');
    else if (currentTime < 36.8 && cards[1]) cards[1].classList.add('active');
    else if (currentTime < 57.5 && cards[2]) cards[2].classList.add('active');
    else if (currentTime < 76.2 && cards[3]) cards[3].classList.add('active');
    else if (cards[4]) cards[4].classList.add('active');`;

if (oldUpdateUiCardsRegex.test(html)) {
  html = html.replace(oldUpdateUiCardsRegex, newUpdateUiCards);
  console.log('✅ Updated updateUI() MM:SS clock and 5-scene active card highlights');
}

// Also update top banner text
html = html.replace(
  /59\.3s duration • ElevenLabs Adam Master Voiceover • Lofi Beat • Subdrops &amp; Laser SFX • Ready to upload to Instagram, TikTok &amp; YouTube Shorts/,
  `89.0s Extended Story Reel • Cueva 2D Illustrated Animation • ElevenLabs Master Voice + Synthwave Music &amp; Foley SFX • Ready to upload to Instagram, TikTok &amp; YouTube Shorts`
);

// Add cache-buster query string to masterMp4Player source so browser never caches the old MP4
html = html.replace(/src="video\/vantorx-speed-to-lead-reel\.mp4(\?v=[0-9]+)?"/g, 'src="video/vantorx-speed-to-lead-reel.mp4?v=8905"');
html = html.replace(/7\.5 MB/g, '11.0 MB');

if (!html.includes('VantorX_Instagram_Highlights_Complete_Package.zip')) {
  html = html.replace(
    /Open Direct Video ↗\s*<\/a>/,
    `Open Direct Video ↗\n    </a>\n    <a href="/instagram-package/VantorX_Instagram_Highlights_Complete_Package.zip" download="VantorX_Instagram_Highlights_Complete_Package.zip" style="background:#10b981;color:#041f14;font-weight:800;font-size:13.5px;padding:11px 18px;border-radius:8px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 16px rgba(16,185,129,0.35)">\n      <span>📦</span> <span>Download All 15 IG Pictures (.ZIP)</span>\n    </a>\n    <a href="/instagram-package/" target="_blank" style="color:#a7f3d0;font-size:12.5px;text-decoration:none;font-weight:700;padding:9px 14px;border:1px solid rgba(16,185,129,0.45);border-radius:8px">\n      📱 Open 15 IG Pictures Gallery ↗\n    </a>`
  );
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ Saved updated website/demo/reel-creator.html');
