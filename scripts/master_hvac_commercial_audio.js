// scripts/master_hvac_commercial_audio.js
// Professional Sound Design & Audio Master for VantorX HVAC Commercial (34.2s)

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');
const { execFileSync } = require('child_process');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const dryVoicePath = path.join(root, 'website/demo/audio/hvac-commercial-voiceover.mp3');
const tsJsonPath = path.join(root, 'website/demo/audio/hvac-commercial-timestamps.json');
const outWavPath = path.join(root, 'website/demo/audio/hvac-commercial-master.wav');
const outMp3Path = path.join(root, 'website/demo/audio/hvac-commercial-master.mp3');

const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));
const TOTAL_SEC = Number(tsData.duration || 34.18);

console.log(`Mastering audio for HVAC Commercial (${TOTAL_SEC}s)...`);

(async () => {
  const voiceB64 = fs.readFileSync(dryVoicePath).toString('base64');
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const wavBase64 = await page.evaluate(async (vB64, dur, words) => {
    const sr = 44100;
    const ctx = new OfflineAudioContext(2, Math.ceil(sr * (dur + 1.2)), sr);

    // Master Limiter
    const masterLimiter = ctx.createDynamicsCompressor();
    masterLimiter.threshold.setValueAtTime(-2.0, 0);
    masterLimiter.ratio.setValueAtTime(8.0, 0);
    masterLimiter.attack.setValueAtTime(0.005, 0);
    masterLimiter.release.setValueAtTime(0.1, 0);
    masterLimiter.connect(ctx.destination);

    // 1. VOICEOVER BUS
    const voiceHP = ctx.createBiquadFilter();
    voiceHP.type = 'highpass';
    voiceHP.frequency.setValueAtTime(80, 0);

    const voiceWarmth = ctx.createBiquadFilter();
    voiceWarmth.type = 'peaking';
    voiceWarmth.frequency.setValueAtTime(240, 0);
    voiceWarmth.gain.setValueAtTime(1.6, 0);

    const voiceClarity = ctx.createBiquadFilter();
    voiceClarity.type = 'peaking';
    voiceClarity.frequency.setValueAtTime(2800, 0);
    voiceClarity.gain.setValueAtTime(2.2, 0);

    const voiceComp = ctx.createDynamicsCompressor();
    voiceComp.threshold.setValueAtTime(-18, 0);
    voiceComp.ratio.setValueAtTime(2.8, 0);

    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(1.12, 0);

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
    musicDucker.gain.setValueAtTime(0.48, 0);
    musicDucker.connect(masterLimiter);

    words.forEach(w => {
      musicDucker.gain.setValueAtTime(0.48, Math.max(0, w.start - 0.08));
      musicDucker.gain.linearRampToValueAtTime(0.24, w.start);
      musicDucker.gain.setValueAtTime(0.24, w.end);
      musicDucker.gain.linearRampToValueAtTime(0.48, w.end + 0.2);
    });

    // 2. CINEMATIC MUSIC BED (Modern Tech Commercial Theme)
    function playPianoNote(time, freq, duration, velocity) {
      const partials = [
        { mult: 1, gain: 1.0, decay: duration },
        { mult: 2, gain: 0.35, decay: duration * 0.75 },
        { mult: 3, gain: 0.12, decay: duration * 0.5 }
      ];

      partials.forEach(p => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * p.mult, time);

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.linearRampToValueAtTime(velocity * p.gain * 0.18, time + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, time + p.decay);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(Math.min(4800, freq * 7), time);

        osc.connect(filter);
        filter.connect(g);
        g.connect(musicDucker);

        osc.start(time);
        osc.stop(time + p.decay + 0.05);
      });
    }

    // Chords matching the 5 acts (Key of F Major / D Minor)
    const chords = [
      // 0.4s: D minor (Hook - Heat & work)
      { t: 0.4, notes: [146.83, 174.61, 220.00, 293.66], d: 4.8, v: 0.65 },
      // 5.2s: Bb Major (Phone ringing in van)
      { t: 5.2, notes: [116.54, 146.83, 174.61, 233.08], d: 4.8, v: 0.70 },
      // 10.0s: G minor (Homeowner frustration)
      { t: 10.0, notes: [98.00, 116.54, 146.83, 196.00], d: 4.5, v: 0.75 },
      // 14.5s: F Major (AVA answers - Resolution begins)
      { t: 14.5, notes: [87.31, 110.00, 130.81, 174.61], d: 5.5, v: 0.85 },
      // 20.0s: C Major (Appointment locked)
      { t: 20.0, notes: [130.81, 164.81, 196.00, 261.63], d: 5.5, v: 0.85 },
      // 25.5s: F Major (Contractor arrives at house)
      { t: 25.5, notes: [87.31, 110.00, 130.81, 174.61], d: 5.0, v: 0.80 },
      // 30.5s: F Major Final Chord (CTA)
      { t: 30.5, notes: [87.31, 110.00, 130.81, 174.61], d: 4.5, v: 0.70 }
    ];

    chords.forEach(c => {
      c.notes.forEach((freq, idx) => {
        playPianoNote(c.t + idx * 0.04, freq, c.d, c.v);
      });
    });

    // 3. FOLEY SOUND EFFECTS
    const foleyBus = ctx.createGain();
    foleyBus.gain.setValueAtTime(0.85, 0);
    foleyBus.connect(masterLimiter);

    // Phone Ringing in Van (5.5s - 8.5s)
    function playPhoneRing(time) {
      [440, 480].forEach(f => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, time);

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.001, time);
        g.gain.linearRampToValueAtTime(0.15, time + 0.05);
        g.gain.setValueAtTime(0.15, time + 1.2);
        g.gain.linearRampToValueAtTime(0.001, time + 1.3);

        osc.connect(g);
        g.connect(foleyBus);
        osc.start(time);
        osc.stop(time + 1.35);
      });
    }

    playPhoneRing(5.5);
    playPhoneRing(7.2);

    // Subtle AVA Connection Chime (15.0s)
    [1046.5, 1318.5].forEach((freq, idx) => {
      const bell = ctx.createOscillator();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(freq, 15.0 + idx * 0.08);

      const bg = ctx.createGain();
      bg.gain.setValueAtTime(0.14, 15.0 + idx * 0.08);
      bg.gain.exponentialRampToValueAtTime(0.0001, 15.0 + idx * 0.08 + 1.2);

      bell.connect(bg);
      bg.connect(foleyBus);
      bell.start(15.0 + idx * 0.08);
      bell.stop(15.0 + idx * 0.08 + 1.3);
    });

    // Clean iOS Dispatch Confirmation (21.5s)
    [1396.9, 1760.0].forEach((freq, idx) => {
      const ping = ctx.createOscillator();
      ping.type = 'sine';
      ping.frequency.setValueAtTime(freq, 21.5 + idx * 0.06);

      const pg = ctx.createGain();
      pg.gain.setValueAtTime(0.16, 21.5 + idx * 0.06);
      pg.gain.exponentialRampToValueAtTime(0.0001, 21.5 + idx * 0.06 + 0.9);

      ping.connect(pg);
      pg.connect(foleyBus);
      ping.start(21.5 + idx * 0.06);
      ping.stop(21.5 + idx * 0.06 + 1.0);
    });

    // Render AudioBuffer
    const rendered = await ctx.startRendering();

    // Export WAV
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

  console.log('HVAC Commercial Audio Master Complete.');
})().catch(err => {
  console.error('Audio mastering failed:', err);
  process.exit(1);
});
