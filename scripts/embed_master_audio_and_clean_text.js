const fs = require('fs');
const path = require('path');

const audioPath = path.resolve(__dirname, '../website/demo/audio/reel-voiceover-master.mp3');
const targetHtmlPath = path.resolve(__dirname, '../website/demo/reel-creator.html');

console.log('Reading master audio from:', audioPath);
const audioBuffer = fs.readFileSync(audioPath);
const base64Audio = 'data:audio/mp3;base64,' + audioBuffer.toString('base64');
console.log('Base64 length:', base64Audio.length);

let html = fs.readFileSync(targetHtmlPath, 'utf8');
const isCRLF = html.includes('\r\n');
const EOL = isCRLF ? '\r\n' : '\n';

// 1. Purge all references to Uranus and old script
// Line 525 mic teleprompter:
html = html.replace(
  '"8 billion lasers pointed at Uranus... 6 hours round trip."',
  '"A single beam of laser light travels at 186,000 miles per second... yet that space trip is STILL faster than a contractor calls back an emergency lead."'
);

// Line 1310 keyword highlight in wrapText:
html = html.replace(
  "if (l.includes('URANUS') || l.includes('FASTER') || l.includes('AVA') || l.includes('$7,800') || l.includes('(561)')) {",
  "if (l.includes('186,000') || l.includes('FASTER') || l.includes('AVA') || l.includes('$8,000') || l.includes('(561)')) {"
);

// Line 1635 copyElevenLabsScript:
const oldScriptStart = 'function copyElevenLabsScript() {';
const oldScriptEnd = "alert('✓ Copied 30-second extended story script! Open elevenlabs.io, select the Adam voice, generate the MP3, and drag it into the Upload Audio tab.');" + EOL + "  }";

const idxScriptStart = html.indexOf(oldScriptStart);
if (idxScriptStart !== -1) {
  const idxScriptEnd = html.indexOf(oldScriptEnd, idxScriptStart);
  if (idxScriptEnd !== -1) {
    const fullOldScriptBlock = html.slice(idxScriptStart, idxScriptEnd + oldScriptEnd.length);
    const newScriptBlock = `function copyElevenLabsScript() {
    const script = \`A single beam of laser light travels at one hundred and eighty-six thousand miles per second. It can reach the moon in under three seconds, and cross nearly two billion miles of deep space in less than three hours. Yet that interplanetary space trip is STILL faster than the average contractor calls back an emergency lead.

Seventy-eight percent of homeowners hire the first business that answers the phone. When you're on a ladder, under a sink, or eating dinner with your family, every single unanswered call is an eight thousand dollar job handed straight to your competitor.

That's why we built Ava. She answers your shop's phone in zero-point-eight seconds, qualifies the caller, checks your schedule, and dispatches the job to your technician's phone before the customer can even open another Google tab.

Stop bleeding thousands on dead voicemails. Call the demo number on your screen right now to hear Ava answer live, or comment "AVA" below and we'll D-M you the free interactive link.\`;
    navigator.clipboard.writeText(script);
    alert('✓ Copied 60-second coherent script with extended hook! You can paste it into ElevenLabs or click [⚡ Generate Studio Voice] right here.');
  }`.split('\n').join(EOL);

    html = html.replace(fullOldScriptBlock, newScriptBlock);
    console.log('1. Replaced copyElevenLabsScript with coherent script');
  }
}

// 2. Embed base64 audio directly into reel-creator.html
// Replace uploadedAudioElement initialization
const oldAudioInitSearch = "let uploadedAudioElement = new Audio('audio/reel-voiceover-master.mp3');";
const newAudioInitEmbed = `// Embedded Studio Audio (ElevenLabs Adam Master Voiceover — 100% Self-Contained, zero CORS/file:// issues)
  const EMBEDDED_STUDIO_AUDIO = "${base64Audio}";
  let uploadedAudioElement = new Audio(EMBEDDED_STUDIO_AUDIO);`;

if (html.includes(oldAudioInitSearch)) {
  html = html.replace(oldAudioInitSearch, newAudioInitEmbed);
  console.log('2. Successfully embedded base64 studio audio directly into HTML');
} else {
  console.log('2. Could not locate oldAudioInitSearch');
}

// 3. Fix bindAudioElementToMasterGraph for file:// compatibility
const oldBind = `    if (!audioEl._vantorxBound) {
      const srcNode = audioCtx.createMediaElementSource(audioEl);
      srcNode.connect(masterGain);
      srcNode.connect(mediaStreamDestination);
      audioEl._vantorxBound = true;
    }`.split('\n').join(EOL);

const newBind = `    if (!audioEl._vantorxBound) {
      try {
        if (window.location.protocol !== 'file:') {
          const srcNode = audioCtx.createMediaElementSource(audioEl);
          srcNode.connect(masterGain);
          if (mediaStreamDestination) srcNode.connect(mediaStreamDestination);
          audioEl._vantorxBound = true;
        }
      } catch(e) {
        console.warn('WebAudio media element source bypassed (direct audio playback active):', e);
      }
    }`.split('\n').join(EOL);

if (html.includes(oldBind)) {
  html = html.replace(oldBind, newBind);
  console.log('3. Updated bindAudioElementToMasterGraph for file:// and cross-origin compatibility');
}

fs.writeFileSync(targetHtmlPath, html, 'utf8');
console.log('Done embed_master_audio_and_clean_text.js!');
console.log('Updated reel-creator.html length:', fs.readFileSync(targetHtmlPath, 'utf8').length);
