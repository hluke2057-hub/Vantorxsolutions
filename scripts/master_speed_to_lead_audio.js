// scripts/master_speed_to_lead_audio.js
// VantorX Solutions - Speed to Lead Motion Graphics Reel Master Audio (28.0s)
// High-Octane Tech Beats + Spaced Voiceover + Precision Motion SFX

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const rawVoice = path.join(root, 'website/demo/audio/vantorx-speed-voiceover.mp3');
const tempVoiceSpaced = path.join(root, 'website/demo/audio/temp_speed_voice_spaced.wav');
const tempBed = path.join(root, 'website/demo/audio/temp_speed_music_bed.wav');
const outWav = path.join(root, 'website/demo/audio/vantorx-speed-master.wav');
const outMp3 = path.join(root, 'website/demo/audio/vantorx-speed-master.mp3');

const SAMPLE_RATE = 44100;
const DURATION = 28.0;
const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * DURATION);

console.log(`Synthesizing 28.0s High-Energy Tech Bed & SFX for Speed-To-Lead Reel...`);

// 1. Synthesize 130 BPM Driving Tech Electronic Music Bed
const left = new Float32Array(TOTAL_SAMPLES);
const right = new Float32Array(TOTAL_SAMPLES);

const BEAT = 60 / 130; // ~0.4615s
const SIXTEENTH = BEAT / 4;

// Driving Synth Scale: D minor / Cyber Tech (D, F, G, A, C, D)
const freqs = [146.83, 174.61, 196.00, 220.00, 261.63, 293.66, 349.23, 392.00, 440.00, 523.25];

for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const t = i / SAMPLE_RATE;

  // Master Gain Envelope
  let masterGain = 0.22;
  if (t < 0.4) masterGain *= (t / 0.4);
  if (t > 27.2) masterGain *= Math.max(0, (28.0 - t) / 0.8);

  // Punchy Electronic Kick Drum
  const beatTime = t % BEAT;
  let kick = 0;
  if (beatTime < 0.16 && t < 24.0) {
    const kickFreq = 160 * Math.exp(-beatTime * 38) + 45;
    const kickEnv = Math.exp(-beatTime * 28);
    kick = Math.sin(2 * Math.PI * kickFreq * beatTime) * kickEnv * 0.38;
  }

  // Crisp 16th Hi-Hat with Velocity Accent
  const subBeat = t % SIXTEENTH;
  let hihat = 0;
  if (t >= 1.5 && t < 24.0) {
    const hhEnv = Math.exp(-subBeat * 65);
    const accent = (Math.floor(t / SIXTEENTH) % 4 === 2) ? 1.4 : 0.8;
    hihat = (Math.random() * 2 - 1) * hhEnv * 0.08 * accent;
  }

  // Rolling 16th Synth Arpeggiator (Cyber Drive)
  const step = Math.floor(t / SIXTEENTH);
  const noteIdx = (step * 3) % freqs.length;
  const noteTime = t % SIXTEENTH;
  const noteFreq = freqs[noteIdx];
  const arpEnv = Math.exp(-noteTime * 16);
  const synth = (Math.sin(2 * Math.PI * noteFreq * t) + 0.4 * Math.sin(4 * Math.PI * noteFreq * t)) * arpEnv * 0.13;

  // Heavy Sub-Bass Drive
  const bassFreq = (t < 7.0) ? 58.27 : (t < 14.0) ? 65.41 : (t < 20.0) ? 73.42 : (t < 24.0) ? 58.27 : 43.65;
  const bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.18;

  let music = (kick + hihat + synth + bass) * masterGain;

  // Vocal Ducking during speech
  const isSpeaking = (
    (t >= 0.5 && t <= 2.2) ||
    (t >= 6.8 && t <= 13.8) ||
    (t >= 18.2 && t <= 20.4) ||
    (t >= 24.0 && t <= 25.8)
  );
  if (isSpeaking) {
    music *= 0.52;
  }

  left[i] = music;
  right[i] = music;
}

// 2. Add Precision Motion SFX
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

// SFX 1: Countdown Alarm Pings (Scene 1: 0.2s, 0.6s, 1.0s, 1.4s)
[0.2, 0.6, 1.0, 1.4].forEach((alarmT, idx) => {
  addSFX(alarmT, 0.2, (t) => {
    const env = Math.exp(-t * 20);
    const beep = Math.sin(2 * Math.PI * (1100 + idx * 80) * t) * env * 0.22;
    return [beep, beep];
  });
});

// SFX 2: Competitor Voicemail Drop & Disconnect Buzz (Scene 2: 3.8s & 5.0s)
addSFX(3.8, 0.4, (t) => {
  const env = Math.exp(-t * 12);
  const tone = Math.sin(2 * Math.PI * 480 * t) * env * 0.2;
  return [tone, tone];
});
addSFX(5.0, 0.35, (t, dur) => {
  const env = 1 - (t / dur);
  const drop = Math.sin(2 * Math.PI * (500 - t * 400) * t) * env * 0.22;
  return [drop, drop];
});

// SFX 3: Electric Speed Sonic Boom (Scene 3: 6.8s)
addSFX(6.8, 0.7, (t, dur) => {
  const env = Math.sin((t / dur) * Math.PI);
  const boom = Math.sin(2 * Math.PI * (80 + Math.pow(t * 8, 2) * 50) * t) * env * 0.35;
  const wind = (Math.random() * 2 - 1) * env * 0.2;
  return [boom + wind, boom + wind];
});

// SFX 4: Speed Needle Peg Chime - 0.2s Instant Answer (Scene 3: 7.5s)
addSFX(7.5, 0.6, (t) => {
  const env = Math.exp(-t * 8);
  const chime = (Math.sin(2 * Math.PI * 1318.51 * t) + Math.sin(2 * Math.PI * 1760.00 * t)) * env * 0.25;
  return [chime, chime];
});

// SFX 5: Calendar Dispatch Slot Lock (Scene 4: 11.2s)
addSFX(11.2, 0.35, (t) => {
  const env = Math.exp(-t * 18);
  const lock = Math.sin(2 * Math.PI * 1567.98 * t) * env * 0.22;
  return [lock, lock];
});

// SFX 6: Real-time SMS Ding (Scene 4: 13.5s)
addSFX(13.5, 0.45, (t) => {
  const env = Math.exp(-t * 10);
  const ping = (Math.sin(2 * Math.PI * 1046.50 * t) * 0.2 + Math.sin(2 * Math.PI * 2093.00 * t) * 0.15) * env;
  return [ping, ping];
});

// SFX 7: Upward Exponential Trajectory Sparkle (Scene 5: 18.0s - 20.0s)
addSFX(18.0, 1.8, (t, dur) => {
  const env = Math.sin((t / dur) * Math.PI);
  const rise = Math.sin(2 * Math.PI * (350 + t * 800) * t) * env * 0.18;
  return [rise, rise];
});

// SFX 8: Sub-Bass Brand Finale Boom & Shimmer (Scene 6: 23.8s)
addSFX(23.8, 2.5, (t) => {
  const env = Math.exp(-t * 2.0);
  const boom = Math.sin(2 * Math.PI * (80 * Math.exp(-t * 3.2)) * t) * env * 0.42;
  const shimmer = (Math.random() * 2 - 1) * Math.exp(-t * 5.0) * 0.14;
  return [boom + shimmer, boom + shimmer];
});

// Write WAV function
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
console.log('Synthesized speed-to-lead music bed & SFX:', tempBed);

// 3. Slicing & Spacing Voiceover Sentences
// Sentence 1: 0.0s - 1.8s ("Speed to lead is everything.") -> at t = 0.5s
// Sentence 2: 2.0s - 6.6s ("VantorX answers in 0.2 seconds and books appointments 24/7.") -> at t = 7.0s
// Sentence 3: 7.2s - 8.8s ("Out-answer your competition.") -> at t = 18.2s
// Sentence 4: 9.2s - 10.7s ("VantorX.") -> at t = 24.2s

const sliceCmd = [
  '-i', rawVoice,
  '-filter_complex',
  `[0:a]atrim=0.0:1.8,asetpts=PTS-STARTPTS,adelay=500|500[p1];` +
  `[0:a]atrim=2.0:6.6,asetpts=PTS-STARTPTS,adelay=7000|7000[p2];` +
  `[0:a]atrim=7.2:8.8,asetpts=PTS-STARTPTS,adelay=18200|18200[p3];` +
  `[0:a]atrim=9.2:10.7,asetpts=PTS-STARTPTS,adelay=24200|24200[p4];` +
  `[p1][p2][p3][p4]amix=inputs=4:dropout_transition=0,volume=1.35[voiceOut]`,
  '-map', '[voiceOut]',
  '-t', '28.0',
  '-y',
  tempVoiceSpaced
];

console.log('Aligning voiceover sentences to Speed-To-Lead storyboard...');
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

spawnSync(ffmpeg, ['-i', outWav, '-b:a', '192k', '-y', outMp3]);

try { fs.unlinkSync(tempBed); } catch(e) {}
try { fs.unlinkSync(tempVoiceSpaced); } catch(e) {}

console.log('Master WAV Generated:', outWav);
console.log('Master MP3 Generated:', outMp3);
console.log('--- SPEED TO LEAD AUDIO MASTER COMPLETE (28.0s) ---');
