// scripts/master_missed_dinner_audio.js
// Subtle, Emotional, Cinematic Sound Design for "The Missed Dinner"
// - Acoustic piano emotional score
// - Realistic wooden table phone vibration (muted, tactile)
// - Realistic quiet room ambience & clock tick
// - Gentle iOS notification chime
// - Zero cartoon whooshes, zero 808 explosions, zero arcade bleeps

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');
const { execFileSync } = require('child_process');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const dryVoicePath = path.join(root, 'website/demo/audio/missed-dinner-voiceover.mp3');
const tsJsonPath = path.join(root, 'website/demo/audio/missed-dinner-timestamps.json');
const outWavPath = path.join(root, 'website/demo/audio/missed-dinner-master.wav');
const outMp3Path = path.join(root, 'website/demo/audio/missed-dinner-master.mp3');

const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));
const TOTAL_SEC = Number(tsData.duration || 38.267);

console.log(`Mastering subtle cinematic audio for "The Missed Dinner" (${TOTAL_SEC}s)...`);

(async () => {
  const voiceB64 = fs.readFileSync(dryVoicePath).toString('base64');
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const wavBase64 = await page.evaluate(async (vB64, dur, words) => {
    const sr = 44100;
    const ctx = new OfflineAudioContext(2, Math.ceil(sr * (dur + 1.5)), sr);

    // Master Bus Limiter (Clean, transparent, no pumping)
    const masterLimiter = ctx.createDynamicsCompressor();
    masterLimiter.threshold.setValueAtTime(-2.0, 0);
    masterLimiter.ratio.setValueAtTime(8.0, 0);
    masterLimiter.attack.setValueAtTime(0.005, 0);
    masterLimiter.release.setValueAtTime(0.1, 0);
    masterLimiter.connect(ctx.destination);

    // ==========================================
    // 1. VOICEOVER BUS (Natural Warm Human Tone)
    // ==========================================
    const voiceHP = ctx.createBiquadFilter();
    voiceHP.type = 'highpass';
    voiceHP.frequency.setValueAtTime(80, 0);

    const voiceWarmth = ctx.createBiquadFilter();
    voiceWarmth.type = 'peaking';
    voiceWarmth.frequency.setValueAtTime(240, 0);
    voiceWarmth.gain.setValueAtTime(1.5, 0);

    const voiceClarity = ctx.createBiquadFilter();
    voiceClarity.type = 'peaking';
    voiceClarity.frequency.setValueAtTime(2800, 0);
    voiceClarity.gain.setValueAtTime(1.8, 0);

    const voiceComp = ctx.createDynamicsCompressor();
    voiceComp.threshold.setValueAtTime(-18, 0);
    voiceComp.ratio.setValueAtTime(2.5, 0);

    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(1.10, 0);

    voiceHP.connect(voiceWarmth);
    voiceWarmth.connect(voiceClarity);
    voiceClarity.connect(voiceComp);
    voiceComp.connect(voiceGain);
    voiceGain.connect(masterLimiter);

    const vBuf = await ctx.decodeAudioData(Uint8Array.from(atob(vB64), c => c.charCodeAt(0)).buffer);
    const vSrc = ctx.createBufferSource();
    vSrc.buffer = vBuf;
    vSrc.connect(voiceHP);
    vSrc.start(0.0);

    // Music Ducking Bus
    const musicDucker = ctx.createGain();
    musicDucker.gain.setValueAtTime(0.45, 0);
    musicDucker.connect(masterLimiter);

    words.forEach(w => {
      musicDucker.gain.setValueAtTime(0.45, Math.max(0, w.start - 0.08));
      musicDucker.gain.linearRampToValueAtTime(0.24, w.start);
      musicDucker.gain.setValueAtTime(0.24, w.end);
      musicDucker.gain.linearRampToValueAtTime(0.45, w.end + 0.2);
    });

    // ==========================================
    // 2. PIANO MUSIC SCORE (Warm, Emotional, Acoustic)
    // ==========================================
    function playPianoNote(time, freq, duration, velocity) {
      // Harmonic partials modeling acoustic piano hammer
      const partials = [
        { mult: 1, gain: 1.0, decay: duration },
        { mult: 2, gain: 0.4, decay: duration * 0.7 },
        { mult: 3, gain: 0.15, decay: duration * 0.5 },
        { mult: 4, gain: 0.05, decay: duration * 0.3 }
      ];

      partials.forEach(p => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * p.mult, time);

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.linearRampToValueAtTime(velocity * p.gain * 0.18, time + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, time + p.decay);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(Math.min(4500, freq * 6), time);

        osc.connect(filter);
        filter.connect(g);
        g.connect(musicDucker);

        osc.start(time);
        osc.stop(time + p.decay + 0.05);
      });
    }

    // Piano Chord Progression (Enters at 4.5s with the dilemma, builds warmth through 38s)
    // Key: Eb Major / C minor (Emotional, warm, grounded)
    const chords = [
      // 4.8s: Eb Major (Eb3, G3, Bb3, Eb4)
      { t: 4.8, notes: [155.56, 196.00, 233.08, 311.13], d: 4.5, v: 0.65 },
      // 9.5s: C minor (C3, Eb3, G3, C4)
      { t: 9.5, notes: [130.81, 155.56, 196.00, 261.63], d: 4.8, v: 0.75 },
      // 14.8s: Ab Major (Ab2, C3, Eb3, Ab3) - "Meet AVA"
      { t: 14.8, notes: [103.83, 130.81, 155.56, 207.65], d: 4.8, v: 0.8 },
      // 19.8s: Bb Major (Bb2, D3, F3, Bb3)
      { t: 19.8, notes: [116.54, 146.83, 174.61, 233.08], d: 4.5, v: 0.75 },
      // 24.5s: Eb Major (Eb3, G3, Bb3, Eb4) - "The job is won"
      { t: 24.5, notes: [155.56, 196.00, 233.08, 311.13], d: 5.0, v: 0.85 },
      // 29.8s: Ab Major (Ab2, C3, Eb3, Ab3) - "Never left the table"
      { t: 29.8, notes: [103.83, 130.81, 155.56, 207.65], d: 4.5, v: 0.75 },
      // 34.2s: Eb Major final resolution
      { t: 34.2, notes: [155.56, 196.00, 233.08, 311.13], d: 5.0, v: 0.7 }
    ];

    chords.forEach(c => {
      c.notes.forEach((freq, idx) => {
        // Slight arpeggiation (humanized touch)
        playPianoNote(c.t + idx * 0.04, freq, c.d, c.v);
      });
    });

    // ==========================================
    // 3. REALISTIC FOLEY SOUND DESIGN
    // ==========================================
    const foleyBus = ctx.createGain();
    foleyBus.gain.setValueAtTime(0.85, 0);
    foleyBus.connect(masterLimiter);

    // Subtle Room Clock Tick (0.0s to 5.0s)
    for (let t = 0.5; t < 5.0; t += 1.0) {
      const tick = ctx.createOscillator();
      tick.type = 'sine';
      tick.frequency.setValueAtTime(1800, t);
      tick.frequency.exponentialRampToValueAtTime(120, t + 0.015);

      const tg = ctx.createGain();
      tg.gain.setValueAtTime(0.04, t);
      tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

      tick.connect(tg);
      tg.connect(foleyBus);
      tick.start(t);
      tick.stop(t + 0.025);
    }

    // Realistic Muted iPhone Vibration on Wooden Table (5.2s - 8.5s)
    // Low frequency motor hum + wooden resonance
    function playTableVibration(time) {
      const motor = ctx.createOscillator();
      motor.type = 'triangle';
      motor.frequency.setValueAtTime(145, time);

      const tableResonance = ctx.createBiquadFilter();
      tableResonance.type = 'bandpass';
      tableResonance.frequency.setValueAtTime(190, time);
      tableResonance.Q.setValueAtTime(4.0, time);

      const vg = ctx.createGain();
      vg.gain.setValueAtTime(0.001, time);
      vg.gain.linearRampToValueAtTime(0.28, time + 0.05);
      vg.gain.setValueAtTime(0.28, time + 0.35);
      vg.gain.linearRampToValueAtTime(0.001, time + 0.42);

      motor.connect(tableResonance);
      tableResonance.connect(vg);
      vg.connect(foleyBus);

      motor.start(time);
      motor.stop(time + 0.45);
    }

    playTableVibration(5.2);
    playTableVibration(5.8);
    playTableVibration(7.0);
    playTableVibration(7.6);

    // Subtle AVA Connection Chime (15.2s) - Soft Glass Bell Tone
    [1046.5, 1318.5].forEach((freq, idx) => {
      const bell = ctx.createOscillator();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(freq, 15.2 + idx * 0.08);

      const bg = ctx.createGain();
      bg.gain.setValueAtTime(0.12, 15.2 + idx * 0.08);
      bg.gain.exponentialRampToValueAtTime(0.0001, 15.2 + idx * 0.08 + 1.2);

      bell.connect(bg);
      bg.connect(foleyBus);
      bell.start(15.2 + idx * 0.08);
      bell.stop(15.2 + idx * 0.08 + 1.3);
    });

    // Clean iOS Dispatch Notification Chime (24.8s)
    [1396.9, 1760.0].forEach((freq, idx) => {
      const ping = ctx.createOscillator();
      ping.type = 'sine';
      ping.frequency.setValueAtTime(freq, 24.8 + idx * 0.06);

      const pg = ctx.createGain();
      pg.gain.setValueAtTime(0.15, 24.8 + idx * 0.06);
      pg.gain.exponentialRampToValueAtTime(0.0001, 24.8 + idx * 0.06 + 0.9);

      ping.connect(pg);
      pg.connect(foleyBus);
      ping.start(24.8 + idx * 0.06);
      ping.stop(24.8 + idx * 0.06 + 1.0);
    });

    // Render AudioBuffer
    const rendered = await ctx.startRendering();

    // Export 16-bit PCM Stereo WAV
    const numChannels = rendered.numberOfChannels;
    const length = rendered.length;
    const bytesPerSample = 2;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sr * blockAlign;
    const dataSize = length * blockAlign;
    const headerSize = 44;
    const wavBytes = new Uint8Array(headerSize + dataSize);
    const view = new DataView(wavBytes.buffer);

    function writeString(offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sr, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    const chL = rendered.getChannelData(0);
    const chR = numChannels > 1 ? rendered.getChannelData(1) : chL;
    let offset = 44;

    for (let i = 0; i < length; i++) {
      let sL = Math.max(-1, Math.min(1, chL[i]));
      let sR = Math.max(-1, Math.min(1, chR[i]));
      view.setInt16(offset, sL < 0 ? sL * 0x8000 : sL * 0x7FFF, true);
      view.setInt16(offset + 2, sR < 0 ? sR * 0x8000 : sR * 0x7FFF, true);
      offset += 4;
    }

    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < wavBytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, wavBytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }, voiceB64, TOTAL_SEC, tsData.words);

  await browser.close();

  const wavBuf = Buffer.from(wavBase64, 'base64');
  fs.writeFileSync(outWavPath, wavBuf);
  console.log(`Master WAV written: ${outWavPath} (${(wavBuf.length / (1024 * 1024)).toFixed(2)} MB)`);

  console.log('Encoding 256k MP3...');
  execFileSync(ffmpegPath, [
    '-y',
    '-i', outWavPath,
    '-b:a', '256k',
    outMp3Path
  ], { stdio: 'inherit' });

  console.log('Emotional Cinematic Audio Master for "The Missed Dinner" Complete.');
})().catch(err => {
  console.error('Audio mastering failed:', err);
  process.exit(1);
});
