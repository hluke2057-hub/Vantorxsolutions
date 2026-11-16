// scripts/master_motion_commercial_audio.js
// VantorX Solutions - Animated Motion Graphics Commercial Master Audio (28.0s)
// Electronic Tech Music + Synchronized Voiceover + Motion SFX

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const rawVoice = path.join(root, 'website/demo/audio/vantorx-motion-voiceover.mp3');
const tempVoiceSpaced = path.join(root, 'website/demo/audio/temp_motion_voice_spaced.wav');
const tempBed = path.join(root, 'website/demo/audio/temp_motion_music_bed.wav');
const outWav = path.join(root, 'website/demo/audio/vantorx-motion-master.wav');
const outMp3 = path.join(root, 'website/demo/audio/vantorx-motion-master.mp3');

const SAMPLE_RATE = 44100;
const DURATION = 28.0;
const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * DURATION);

console.log(`Synthesizing 28.0s Motion Graphics Electronic Music Bed & SFX...`);

// 1. Synthesize Electronic Tech Background Music & SFX
const left = new Float32Array(TOTAL_SAMPLES);
const right = new Float32Array(TOTAL_SAMPLES);

// 128 BPM electronic tempo -> 0.46875s per beat, 0.1171875s per 16th note
const BEAT = 60 / 128;
const SIXTEENTH = BEAT / 4;

// Tech Arpeggio Scale (F minor pentatonic / modern cyber vibe: F, Ab, Bb, C, Eb, F)
const freqs = [174.61, 207.65, 233.08, 261.63, 311.13, 349.23, 415.30, 466.16, 523.25];

for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const t = i / SAMPLE_RATE;

  // Master music envelope (fade in 0.5s, strong drive, fade out at 27.5s)
  let masterGain = 0.22;
  if (t < 0.5) masterGain *= (t / 0.5);
  if (t > 27.0) masterGain *= Math.max(0, (28.0 - t) / 1.0);

  // Four-on-the-floor Kick Drum (electronic punch)
  const beatTime = t % BEAT;
  let kick = 0;
  if (beatTime < 0.18 && t < 24.0) {
    const kickFreq = 140 * Math.exp(-beatTime * 35) + 42;
    const kickEnv = Math.exp(-beatTime * 25);
    kick = Math.sin(2 * Math.PI * kickFreq * beatTime) * kickEnv * 0.35;
  }

  // 16th-note Crisp Electronic Hi-hat
  const subBeat = t % SIXTEENTH;
  let hihat = 0;
  if (t >= 3.0 && t < 24.0) {
    const hhEnv = Math.exp(-subBeat * 60);
    // Filtered white noise
    const noise = (Math.random() * 2 - 1) * hhEnv * 0.08;
    hihat = noise;
  }

  // Rolling 16th Arpeggiator (Cyber Synth)
  const noteIdx = Math.floor(t / SIXTEENTH) % freqs.length;
  const noteTime = t % SIXTEENTH;
  const noteFreq = freqs[noteIdx];
  const arpEnv = Math.exp(-noteTime * 18);
  const synthOsc = (Math.sin(2 * Math.PI * noteFreq * t) + 0.5 * Math.sin(4 * Math.PI * noteFreq * t)) * arpEnv * 0.12;

  // Deep Sub-Bass Drone
  const bassFreq = (t < 7.0) ? 55.0 : (t < 11.0) ? 65.4 : (t < 19.0) ? 55.0 : (t < 24.0) ? 73.4 : 43.65;
  const bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.16;

  // Mix Music Bed
  let music = (kick + hihat + synthOsc + bass) * masterGain;

  // Voice Ducking during speech windows
  const isSpeaking = (
    (t >= 0.5 && t <= 2.2) ||
    (t >= 3.5 && t <= 5.8) ||
    (t >= 7.5 && t <= 9.2) ||
    (t >= 11.2 && t <= 18.0) ||
    (t >= 19.5 && t <= 22.0) ||
    (t >= 24.6 && t <= 26.5)
  );
  if (isSpeaking) {
    music *= 0.55; // Clean 5dB ducking for crisp vocal clarity
  }

  left[i] = music;
  right[i] = music;
}

// 2. Inject Synchronized Motion Graphic SFX Events
function addSFX(startTime, duration, genFn) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const totalS = Math.floor(duration * SAMPLE_RATE);
  for (let s = 0; s < totalS; s++) {
    const idx = startSample + s;
    if (idx >= TOTAL_SAMPLES) break;
    const st = s / SAMPLE_RATE;
    const [lVal, rVal] = genFn(st, duration);
    left[idx] += lVal;
    right[idx] += rVal;
  }
}

// SFX 1: Swoosh / Whoosh (Phone flying into screen at 0.1s)
addSFX(0.1, 0.6, (t, dur) => {
  const env = Math.sin((t / dur) * Math.PI);
  const noise = (Math.random() * 2 - 1) * env * 0.22;
  const sweep = Math.sin(2 * Math.PI * (120 + t * 450) * t) * env * 0.15;
  return [noise + sweep, noise + sweep];
});

// SFX 2: Multiple Incoming Call Notification Pings (Scene 1: 0.8s, 1.2s, 1.6s, 2.0s)
[0.8, 1.2, 1.6, 2.0].forEach((pingT, pIdx) => {
  addSFX(pingT, 0.25, (t) => {
    const freq = 880 + pIdx * 120;
    const env = Math.exp(-t * 22);
    const sound = (Math.sin(2 * Math.PI * freq * t) + 0.3 * Math.sin(4 * Math.PI * freq * t)) * env * 0.25;
    const pan = (pIdx % 2 === 0) ? 0.7 : -0.7;
    return [sound * (1 - pan), sound * (1 + pan)];
  });
});

// SFX 3: Disconnect Tone & Lost Customer Drop (Scene 2: 3.5s & 4.8s)
addSFX(3.5, 0.4, (t) => {
  const env = Math.exp(-t * 12);
  const sound = Math.sin(2 * Math.PI * 440 * t) * env * 0.20;
  return [sound, sound];
});
addSFX(4.8, 0.5, (t, dur) => {
  const env = 1 - (t / dur);
  const pitch = 600 - t * 450;
  const sound = Math.sin(2 * Math.PI * Math.max(80, pitch) * t) * env * 0.18;
  return [sound, sound];
});

// SFX 4: High-Tech Cyber Snap & Laser Sweep (Scene 3: 7.0s Interface Assembly)
addSFX(7.0, 0.7, (t, dur) => {
  const env = Math.sin((t / dur) * Math.PI);
  const sweep = Math.sin(2 * Math.PI * (300 + Math.pow(t * 10, 2) * 40) * t) * env * 0.22;
  const click = (t < 0.05) ? (Math.random() * 2 - 1) * 0.35 : 0;
  return [sweep + click, sweep + click];
});

// SFX 5: Crystal Call-Answered Chime (Scene 3: 8.2s Green Indicator)
addSFX(8.2, 0.8, (t) => {
  const env = Math.exp(-t * 6);
  const chime = (
    Math.sin(2 * Math.PI * 1046.50 * t) * 0.2 + // C6
    Math.sin(2 * Math.PI * 1318.51 * t) * 0.15 + // E6
    Math.sin(2 * Math.PI * 1567.98 * t) * 0.12   // G6
  ) * env;
  return [chime, chime];
});

// SFX 6: Digital Connect Beep & Waveform Ripple (Scene 4: 11.2s & 13.0s)
addSFX(11.2, 0.3, (t) => {
  const env = Math.exp(-t * 18);
  const beep = Math.sin(2 * Math.PI * 1200 * t) * env * 0.22;
  return [beep, beep];
});
addSFX(13.0, 0.6, (t, dur) => {
  const env = Math.sin((t / dur) * Math.PI);
  const pulse = Math.sin(2 * Math.PI * 520 * t + Math.sin(t * 40) * 3) * env * 0.14;
  return [pulse, pulse];
});

// SFX 7: Triple Lead Card Pop (Scene 4: 15.0s, 15.35s, 15.7s)
[15.0, 15.35, 15.7].forEach((popT, idx) => {
  addSFX(popT, 0.2, (t) => {
    const env = Math.exp(-t * 30);
    const pop = Math.sin(2 * Math.PI * (700 + idx * 180) * t) * env * 0.22;
    return [pop, pop];
  });
});

// SFX 8: Calendar Slot Lock & Clock Tick (Scene 4: 17.2s & 18.0s)
addSFX(17.2, 0.4, (t) => {
  const env = Math.exp(-t * 15);
  const sound = (Math.sin(2 * Math.PI * 1400 * t) + Math.sin(2 * Math.PI * 1800 * t)) * env * 0.2;
  return [sound, sound];
});

// SFX 9: Upward Trajectory Ascend / Success Shimmer (Scene 5: 19.4s & 21.0s)
addSFX(19.4, 0.8, (t, dur) => {
  const env = Math.exp(-t * 4);
  const chime = (Math.sin(2 * Math.PI * 1174.66 * t) + Math.sin(2 * Math.PI * 1760 * t)) * env * 0.2;
  return [chime, chime];
});
addSFX(21.0, 1.2, (t, dur) => {
  const env = (1 - (t / dur));
  const rise = Math.sin(2 * Math.PI * (400 + t * 900) * t) * env * 0.16;
  return [rise, rise];
});

// SFX 10: Deep Sub-Bass Logo Whoosh & Brand Cymbal (Scene 6: 24.0s Finale)
addSFX(24.0, 2.5, (t, dur) => {
  const env = Math.exp(-t * 2.2);
  const subBoom = Math.sin(2 * Math.PI * (75 * Math.exp(-t * 3)) * t) * env * 0.38;
  const shimmer = (Math.random() * 2 - 1) * Math.exp(-t * 4.5) * 0.12;
  return [subBoom + shimmer, subBoom + shimmer];
});

// Write temporary WAV for electronic bed
function writeWav(filePath, lData, rData) {
  const buffer = Buffer.alloc(44 + TOTAL_SAMPLES * 4);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + TOTAL_SAMPLES * 4, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(2, 22); // Stereo
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 4, 28);
  buffer.writeUInt16LE(4, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(TOTAL_SAMPLES * 4, 40);

  let offset = 44;
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    const sL = Math.max(-1, Math.min(1, lData[i]));
    const sR = Math.max(-1, Math.min(1, rData[i]));
    buffer.writeInt16LE(Math.floor(sL * 32767), offset);
    buffer.writeInt16LE(Math.floor(sR * 32767), offset + 2);
    offset += 4;
  }
  fs.writeFileSync(filePath, buffer);
}

writeWav(tempBed, left, right);
console.log('Synthesized electronic music bed and SFX:', tempBed);

// 3. Precision Speech Slicing and Scene Placement
// We extract each sentence from rawVoice and place them at exact scene timestamps:
// - Part 1 (0.0s - 1.8s): "How many customers are you missing?" -> at t = 0.5s
// - Part 2 (2.0s - 4.6s): "Missed calls mean lost revenue." -> at t = 3.5s
// - Part 3 (4.9s - 6.8s): "Meet VantorX AI." -> at t = 7.5s
// - Part 4 (7.2s - 14.5s): "It answers instantly, captures leads, and books appointments twenty-four-seven." -> at t = 11.2s
// - Part 5 (14.6s - 16.0s): "Never miss an opportunity again." -> at t = 19.5s
// - Part 6 (16.0s - 16.65s): "VantorX." -> at t = 24.6s

const sliceCmd = [
  '-i', rawVoice,
  '-filter_complex',
  `[0:a]atrim=0.0:1.8,asetpts=PTS-STARTPTS,adelay=500|500[p1];` +
  `[0:a]atrim=2.0:4.6,asetpts=PTS-STARTPTS,adelay=3500|3500[p2];` +
  `[0:a]atrim=4.9:6.8,asetpts=PTS-STARTPTS,adelay=7500|7500[p3];` +
  `[0:a]atrim=7.2:14.5,asetpts=PTS-STARTPTS,adelay=11200|11200[p4];` +
  `[0:a]atrim=14.6:16.0,asetpts=PTS-STARTPTS,adelay=19500|19500[p5];` +
  `[0:a]atrim=16.0:16.65,asetpts=PTS-STARTPTS,adelay=24600|24600[p6];` +
  `[p1][p2][p3][p4][p5][p6]amix=inputs=6:dropout_transition=0,volume=1.3[voiceOut]`,
  '-map', '[voiceOut]',
  '-t', '28.0',
  '-y',
  tempVoiceSpaced
];

console.log('Aligning voiceover sentences to 6-scene storyboard...');
const sliceRes = spawnSync(ffmpeg, sliceCmd);
if (sliceRes.status !== 0) {
  console.error('Slice error:', sliceRes.stderr.toString());
  process.exit(1);
}

// 4. Mix Voiceover + Music Bed + SFX into 28.0s Master
console.log('Mixing Voiceover with Music Bed and Master SFX...');
const mixCmd = [
  '-i', tempBed,
  '-i', tempVoiceSpaced,
  '-filter_complex', '[0:a][1:a]amix=inputs=2:duration=first:dropout_transition=0,loudnorm=I=-14:TP=-1.5:LRA=7[masterAudio]',
  '-map', '[masterAudio]',
  '-t', '28.0',
  '-y',
  outWav
];

const mixRes = spawnSync(ffmpeg, mixCmd);
if (mixRes.status !== 0) {
  console.error('Master mix error:', mixRes.stderr.toString());
  process.exit(1);
}

// Export MP3 version
spawnSync(ffmpeg, ['-i', outWav, '-b:a', '192k', '-y', outMp3]);

// Clean temporary files
try { fs.unlinkSync(tempBed); } catch(e) {}
try { fs.unlinkSync(tempVoiceSpaced); } catch(e) {}

console.log('Master WAV Generated:', outWav);
console.log('Master MP3 Generated:', outMp3);
console.log('--- AUDIO MASTER COMPLETE (28.0s) ---');
