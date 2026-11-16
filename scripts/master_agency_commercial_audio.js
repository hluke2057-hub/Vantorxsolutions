// scripts/master_agency_commercial_audio.js
// Mixes pristine agency commercial sound design:
// - ElevenLabs Adam Voiceover (delayed by 1.8s for opening hook)
// - Tactile Foley SFX: Phone vibration, voicemail beep, AI pickup chime, calendar ping, dispatch notification, cinematic sub-bass logo reveal
// - High-end modern corporate tech & piano score (ducked dynamically behind speech)
// - Output: website/demo/audio/vantorx-agency-commercial-master.wav (29.8s) & .mp3

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const voicePath = path.join(root, 'website/demo/audio/vantorx-agency-voiceover.mp3');
const outWav = path.join(root, 'website/demo/audio/vantorx-agency-commercial-master.wav');
const outMp3 = path.join(root, 'website/demo/audio/vantorx-agency-commercial-master.mp3');

const sampleRate = 44100;
const totalDuration = 29.8; // 29.8 seconds
const totalSamples = Math.ceil(totalDuration * sampleRate);

console.log(`Synthesizing agency commercial sound design (${totalDuration}s @ ${sampleRate}Hz)...`);

// 1. Synthesize Audio Score & Foley Buffers
const left = new Float32Array(totalSamples);
const right = new Float32Array(totalSamples);

function addTone(freq, startSec, durationSec, gain = 0.1, fadeSec = 0.05) {
  const startSample = Math.floor(startSec * sampleRate);
  const numSamples = Math.floor(durationSec * sampleRate);
  for (let i = 0; i < numSamples; i++) {
    const idx = startSample + i;
    if (idx >= totalSamples) break;
    const t = i / sampleRate;
    let env = 1;
    if (t < fadeSec) env = t / fadeSec;
    else if (t > durationSec - fadeSec) env = (durationSec - t) / fadeSec;
    const sample = Math.sin(2 * Math.PI * freq * t) * gain * env;
    left[idx] += sample;
    right[idx] += sample;
  }
}

function addPhoneVibration(startSec) {
  // Heavy phone vibration motor (140Hz rumble + 280Hz harmonic + sub 70Hz)
  const duration = 0.55;
  const startSample = Math.floor(startSec * sampleRate);
  const numSamples = Math.floor(duration * sampleRate);
  for (let i = 0; i < numSamples; i++) {
    const idx = startSample + i;
    if (idx >= totalSamples) break;
    const t = i / sampleRate;
    const env = Math.sin(Math.PI * (t / duration));
    const noise = (Math.random() * 2 - 1) * 0.04;
    const motor = Math.sin(2 * Math.PI * 140 * t) * 0.22 +
                  Math.sin(2 * Math.PI * 70 * t) * 0.15 +
                  Math.sin(2 * Math.PI * 280 * t) * 0.08;
    const s = (motor + noise) * env * 0.35;
    left[idx] += s * 0.9;
    right[idx] += s * 1.1; // Slight stereo spread
  }
}

function addDigitalChime(startSec, baseFreq = 880) {
  // Glassy modern connection chime (Major triad: base, 1.25x, 1.5x)
  const duration = 0.9;
  const startSample = Math.floor(startSec * sampleRate);
  const numSamples = Math.floor(duration * sampleRate);
  for (let i = 0; i < numSamples; i++) {
    const idx = startSample + i;
    if (idx >= totalSamples) break;
    const t = i / sampleRate;
    const decay = Math.exp(-t * 5.2);
    const s = (
      Math.sin(2 * Math.PI * baseFreq * t) * 0.20 +
      Math.sin(2 * Math.PI * (baseFreq * 1.25) * t) * 0.14 +
      Math.sin(2 * Math.PI * (baseFreq * 1.5) * t) * 0.10 +
      Math.sin(2 * Math.PI * (baseFreq * 2.0) * t) * 0.06
    ) * decay * 0.30;
    left[idx] += s * 1.05;
    right[idx] += s * 0.95;
  }
}

function addLogoBoom(startSec) {
  // Deep cinematic sub-bass hit for logo reveal
  const duration = 3.2;
  const startSample = Math.floor(startSec * sampleRate);
  const numSamples = Math.floor(duration * sampleRate);
  for (let i = 0; i < numSamples; i++) {
    const idx = startSample + i;
    if (idx >= totalSamples) break;
    const t = i / sampleRate;
    const pitch = 75 * Math.exp(-t * 1.8) + 38; // 113Hz down to 38Hz
    const decay = Math.exp(-t * 1.4);
    const s = Math.sin(2 * Math.PI * pitch * t) * 0.32 * decay;
    left[idx] += s;
    right[idx] += s;
  }
}

// Background Tech Music / Piano Bed
// Elegant progression: Dm -> Bb -> F -> C
const chords = [
  { time: 0.0, freqs: [146.83, 220.00, 261.63, 349.23] }, // Dm7
  { time: 7.2, freqs: [116.54, 233.08, 293.66, 349.23] }, // Bbmaj7
  { time: 14.5, freqs: [174.61, 261.63, 329.63, 392.00] }, // Fmaj9
  { time: 21.8, freqs: [130.81, 196.00, 246.94, 329.63] }, // Cmaj7
];

chords.forEach(c => {
  c.freqs.forEach(f => {
    addTone(f, c.time, 7.0, 0.045, 0.8);
    // Subtle acoustic harmonic overtone
    addTone(f * 2, c.time + 0.1, 6.8, 0.015, 1.2);
  });
});

// Foley Injections
console.log('Injecting precision Foley events...');
addPhoneVibration(0.3); // Phone rings 1
addPhoneVibration(1.1); // Phone rings 2
addTone(440, 4.8, 0.4, 0.08, 0.02); // Telephone disconnect beep
addDigitalChime(6.8, 1046.5); // C6 modern AI pickup chime
addDigitalChime(14.2, 1318.5); // E6 calendar sync confirmation
addDigitalChime(21.2, 1174.6); // D6 push notification success
addLogoBoom(25.4); // Cinematic logo sub impact

// Build temporary Foley + Music WAV
const foleyWavPath = path.join(root, 'website/demo/audio/temp_foley_bed.wav');
const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + totalSamples * 4, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16); // PCM chunk size
header.writeUInt16LE(1, 20); // PCM
header.writeUInt16LE(2, 22); // Stereo
header.writeUInt32LE(sampleRate, 24);
header.writeUInt32LE(sampleRate * 4, 28); // byte rate
header.writeUInt16LE(4, 32); // block align
header.writeUInt16LE(16, 34); // bits per sample
header.write('data', 36);
header.writeUInt32LE(totalSamples * 4, 40);

const pcmBuf = Buffer.alloc(totalSamples * 4);
for (let i = 0; i < totalSamples; i++) {
  // Soft limiter
  const l = Math.max(-1, Math.min(1, left[i]));
  const r = Math.max(-1, Math.min(1, right[i]));
  pcmBuf.writeInt16LE(Math.floor(l * 32767), i * 4);
  pcmBuf.writeInt16LE(Math.floor(r * 32767), i * 4 + 2);
}

fs.writeFileSync(foleyWavPath, Buffer.concat([header, pcmBuf]));
console.log('Wrote temporary sound design bed:', foleyWavPath);

// 2. Mix Voiceover (delayed by 1.7s) + Sound Design Bed using FFmpeg
console.log('Mixing Voiceover with sound design bed in FFmpeg...');
const ffmpegMixArgs = [
  '-i', foleyWavPath,
  '-itsoffset', '1.7',
  '-i', voicePath,
  '-filter_complex',
  // Voice is boosted to pristine broadcast level (1.15x), foley bed dynamically ducks slightly behind voice
  '[1:a]volume=1.18,alimiter=limit=0.92[voice];[0:a]volume=0.90[bed];[bed][voice]amix=inputs=2:duration=first:dropout_transition=2[out]',
  '-map', '[out]',
  '-c:a', 'pcm_s16le',
  '-y',
  outWav
];

const res1 = spawnSync(ffmpegPath, ffmpegMixArgs);
if (res1.status !== 0) {
  console.error('FFmpeg mix error:', res1.stderr.toString());
  process.exit(1);
}

console.log('Generated Master WAV:', outWav);

// Also encode pristine MP3 version
const res2 = spawnSync(ffmpegPath, ['-i', outWav, '-c:a', 'libmp3lame', '-b:a', '256k', '-y', outMp3]);
if (res2.status !== 0) {
  console.error('FFmpeg mp3 error:', res2.stderr.toString());
} else {
  console.log('Generated Master MP3:', outMp3);
}

try { fs.unlinkSync(foleyWavPath); } catch (_) {}
console.log('--- AUDIO MASTERING COMPLETE (29.8s) ---');
