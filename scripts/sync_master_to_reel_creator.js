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
const engineStartMarker = '// ============================================================================\n// VANTORX VIRAL REEL ENGINE';
const engineStartIdx = html.indexOf('// VANTORX VIRAL REEL ENGINE');
const loopMarker = '// Animation Loop: Bound Directly to Hardware Audio Clock';
const loopIdx = html.indexOf(loopMarker);

if (engineStartIdx === -1 || loopIdx === -1) {
  throw new Error(`Could not locate engine bounds: engineStartIdx=${engineStartIdx}, loopIdx=${loopIdx}`);
}
// Walk back one line before engineStartIdx to include the separator comment
const blockStart = html.lastIndexOf('// ====', engineStartIdx);
html = html.slice(0, blockStart) + engineCode + '\n\n' + html.slice(loopIdx);
console.log('✅ Injected 12-scene 89.0s Cueva/Taskless Engine + Clean Lower-Third Captions');

// E. Update PRODUCTS_MIND_QUEUE[0] (voice_ai_cosmic) scripts so UI & teleprompter match the new extended hook + Bob & Sarah story
const oldHookScript = `hookScript: 'A single beam of laser light travels at 186,000 miles per second. It can reach the moon in under three seconds, and cross nearly two billion miles of deep space to Saturn in less than three hours. Yet that interplanetary space trip is STILL faster than the average contractor calls back an emergency lead.',`;
const newHookScript = `hookScript: 'If you point a single beam of laser light into the night sky, it fires into the dark at 186,000 miles per second. In just one second, it flashes past the Moon. In twelve minutes, it blazes past Mars. In forty-three minutes, it tears past Jupiter, and in under three hours, it crosses nearly two billion miles of freezing deep space to hit the rings of Uranus. Yet that two-billion-mile journey across the solar system is STILL faster than the average contractor calls back an emergency lead.',`;
if (html.includes(oldHookScript)) {
  html = html.replace(oldHookScript, newHookScript);
}

const oldProblemScript = `problemScript: '78% of homeowners hire the first business that answers the phone. When you are on a ladder, under a sink, or eating dinner with your family, every single unanswered call is an {TICKET} job handed straight to your competitor.',`;
const newProblemScript = `problemScript: "Picture this. Meet Bob. Bob is a master contractor standing twenty feet up a ladder in a scorching attic, drenched in sweat with a wrench in his hand. Across town, a pipe bursts in Sarah's ceiling and water is pouring everywhere. Panicking, she grabs her phone and calls Bob first. Bob's phone buzzes in his pocket, once, twice, three times, and dumps straight to voicemail. Sarah doesn't leave a message, because 78% of homeowners hire the very first business that answers. Within ten seconds, she taps the next contractor on Google. That shop answers on ring one, rolls a truck, and collects an $8,000 check that had Bob's name written all over it.",`;
if (html.includes(oldProblemScript)) {
  html = html.replace(oldProblemScript, newProblemScript);
} else {
  html = html.replace(/problemScript:\s*'Picture this\. Meet Bob\.[^n]+\n/, newProblemScript + '\n');
}

const oldSolutionScript = `solutionScript: 'That is why we built Ava. She answers your shop phone in zero-point-eight seconds, qualifies the caller, checks your schedule, and dispatches the job to your technician phone before the customer can even open another Google tab.',`;
const newSolutionScript = `solutionScript: "That is why we built Ava. She answers your phone in 0.8 seconds, calms the homeowner down, qualifies the job, books your calendar, and texts the dispatch straight to Bob's phone before the customer can even open another Google tab.",`;
if (html.includes(oldSolutionScript)) {
  html = html.replace(oldSolutionScript, newSolutionScript);
} else {
  html = html.replace(/solutionScript:\s*'That is why we built Ava\.[^n]+\n/, newSolutionScript + '\n');
}

// F. In buildReelAssetsForProduct(prod), preserve MASTER_COSMIC_WORD_TIMESTAMPS when prod.storyType === 'cosmic_light'
const oldDynamicTsBlock = `  // Dynamic Word Timestamps
  const dynamicWords = generateTimestampsForNarration(narrationScript, 58.5);
  window.ACTIVE_WORD_TIMESTAMPS = dynamicWords;
  window.WORD_TIMESTAMPS = dynamicWords;
  WORD_TIMESTAMPS = dynamicWords;`;

const newDynamicTsBlock = `  // Dynamic Word Timestamps (Use exact ElevenLabs character-aligned timestamps for cosmic_light!)
  const dynamicWords = (prod.storyType === 'cosmic_light' && typeof MASTER_COSMIC_WORD_TIMESTAMPS !== 'undefined')
    ? MASTER_COSMIC_WORD_TIMESTAMPS
    : generateTimestampsForNarration(narrationScript, 88.5);
  window.ACTIVE_WORD_TIMESTAMPS = dynamicWords;
  window.WORD_TIMESTAMPS = dynamicWords;
  WORD_TIMESTAMPS = dynamicWords;`;

if (html.includes(oldDynamicTsBlock.replace(/\n/g, '\r\n'))) {
  html = html.replace(oldDynamicTsBlock.replace(/\n/g, '\r\n'), newDynamicTsBlock.replace(/\n/g, '\r\n'));
} else if (html.includes(oldDynamicTsBlock)) {
  html = html.replace(oldDynamicTsBlock, newDynamicTsBlock);
}

// G. Prevent procedural startBackgroundBeat() from clashing when EMBEDDED_STUDIO_AUDIO (which has full stereo music + SFX baked in) is playing
const oldStartBeat = `  function startBackgroundBeat() {
    if (!audioCtx || !document.getElementById('chkEnableMusic').checked) return;
    stopBackgroundBeat();`;

const newStartBeat = `  function startBackgroundBeat() {
    if (!audioCtx || !document.getElementById('chkEnableMusic').checked) return;
    stopBackgroundBeat();
    // Master studio audio for cosmic_light already has the full stereo synthwave music & foley SFX baked in!
    if (window.ACTIVE_STORY && window.ACTIVE_STORY.storyType === 'cosmic_light' && uploadedAudioElement) return;`;

if (html.includes(oldStartBeat.replace(/\n/g, '\r\n'))) {
  html = html.replace(oldStartBeat.replace(/\n/g, '\r\n'), newStartBeat.replace(/\n/g, '\r\n'));
} else if (html.includes(oldStartBeat)) {
  html = html.replace(oldStartBeat, newStartBeat);
}

// Add cache-buster query string to masterMp4Player source so browser never caches the old MP4
html = html.replace(/src="video\/vantorx-speed-to-lead-reel\.mp4(\?v=[0-9]+)?"/g, 'src="video/vantorx-speed-to-lead-reel.mp4?v=8902"');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ Saved updated website/demo/reel-creator.html');
