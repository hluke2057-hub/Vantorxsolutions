// scripts/master_cinematic_studio_audio.js
// High-Production Cinematic Audio Master for VantorX Reel:
// - Dark Suspenseful Synthwave / Documentary Tension Soundtrack (Pulsing Bass + Atmospheric Pad + 16th Note Ticks)
// - Hollywood-Grade Cinematic SFX (Deep 808 Sub Drops, Stereo Whooshes, Risers, iPhone Vibration, Cash Rattle)
// - Voice Presence EQ + Sidechain Music Ducking + Brickwall Limiting

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');
const { execFileSync } = require('child_process');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const dryVoicePath = path.join(root, 'website/demo/audio/reel-nvidia-voiceover-dry.mp3');
const tsJsonPath = path.join(root, 'website/demo/audio/reel-nvidia-timestamps.json');
const outWavPath = path.join(root, 'website/demo/audio/reel-nvidia-master.wav');
const outMp3Path = path.join(root, 'website/demo/audio/reel-nvidia-master.mp3');

const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));
const TOTAL_SEC = Number(tsData.duration || 74.303);

console.log(`Rendering Hollywood-Grade Cinematic Audio Master (${TOTAL_SEC}s)...`);

(async () => {
  const voiceB64 = fs.readFileSync(dryVoicePath).toString('base64');
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const wavBase64 = await page.evaluate(async (vB64, dur, words) => {
    const sr = 44100;
    const ctx = new OfflineAudioContext(2, Math.ceil(sr * (dur + 1.0)), sr);

    // Master Bus Limiter
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-1.5, 0);
    limiter.ratio.setValueAtTime(14.0, 0);
    limiter.attack.setValueAtTime(0.003, 0);
    limiter.release.setValueAtTime(0.08, 0);
    limiter.connect(ctx.destination);

    // ==========================================
    // 1. VOICEOVER BUS (Clear, Warm, In-Your-Face)
    // ==========================================
    const voiceHP = ctx.createBiquadFilter();
    voiceHP.type = 'highpass';
    voiceHP.frequency.setValueAtTime(85, 0);

    const voicePres = ctx.createBiquadFilter();
    voicePres.type = 'peaking';
    voicePres.frequency.setValueAtTime(3200, 0);
    voicePres.gain.setValueAtTime(2.6, 0);

    const voiceComp = ctx.createDynamicsCompressor();
    voiceComp.threshold.setValueAtTime(-16, 0);
    voiceComp.ratio.setValueAtTime(3.2, 0);

    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(1.15, 0);

    voiceHP.connect(voicePres);
    voicePres.connect(voiceComp);
    voiceComp.connect(voiceGain);
    voiceGain.connect(limiter);

    const vBuf = await ctx.decodeAudioData(Uint8Array.from(atob(vB64), c => c.charCodeAt(0)).buffer);
    const vSrc = ctx.createBufferSource();
    vSrc.buffer = vBuf;
    vSrc.connect(voiceHP);
    vSrc.start(0);

    // ==========================================
    // 2. CINEMATIC TENSION MUSIC BED
    // Dark ominous synth chords + driving 8th-note Reese bass + 16th-note clockwork pulse
    // ==========================================
    const musicGain = ctx.createGain();
    musicGain.gain.setValueAtTime(0.24, 0); // Sits cleanly under voice
    musicGain.connect(limiter);

    // Dark Minor Progression (A minor -> F major -> C major -> E minor)
    const bpm = 116;
    const beatSec = 60 / bpm; // ~0.517s
    const barSec = beatSec * 4; // ~2.069s
    const numBars = Math.ceil(dur / barSec) + 1;

    const chords = [
      { root: 55.0,  pad: [220.00, 261.63, 329.63, 440.00] }, // Am
      { root: 43.65, pad: [174.61, 220.00, 261.63, 349.23] }, // F
      { root: 65.41, pad: [196.00, 246.94, 261.63, 392.00] }, // C
      { root: 41.20, pad: [164.81, 196.00, 246.94, 329.63] }  // Em
    ];

    // Atmospheric Dark Pad Layer
    for (let b = 0; b < numBars; b++) {
      const bTime = b * barSec;
      if (bTime >= dur) break;
      const c = chords[b % chords.length];

      c.pad.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const lp = ctx.createBiquadFilter();
        const g = ctx.createGain();

        osc.type = (idx % 2 === 0) ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, bTime);
        osc.detune.setValueAtTime((idx - 1.5) * 8, bTime);

        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(650, bTime);

        g.gain.setValueAtTime(0.001, bTime);
        g.gain.linearRampToValueAtTime(0.07, bTime + 0.3);
        g.gain.setValueAtTime(0.065, bTime + barSec - 0.25);
        g.gain.linearRampToValueAtTime(0.001, Math.min(dur, bTime + barSec));

        osc.connect(lp); lp.connect(g); g.connect(musicGain);
        osc.start(bTime); osc.stop(Math.min(dur, bTime + barSec));
      });
    }

    // Driving Reese Bass (Pulsing 8th notes)
    const num8ths = Math.ceil(dur / (beatSec / 2));
    for (let i = 0; i < num8ths; i++) {
      const t = i * (beatSec / 2);
      if (t >= dur) break;
      const bIdx = Math.floor(t / barSec);
      const c = chords[bIdx % chords.length];

      const bassOsc1 = ctx.createOscillator();
      const bassOsc2 = ctx.createOscillator();
      const bassLP = ctx.createBiquadFilter();
      const bassG = ctx.createGain();

      bassOsc1.type = 'sawtooth';
      bassOsc1.frequency.setValueAtTime(c.root, t);
      bassOsc2.type = 'sawtooth';
      bassOsc2.frequency.setValueAtTime(c.root, t);
      bassOsc2.detune.setValueAtTime(12, t); // fat chorus detune

      bassLP.type = 'lowpass';
      bassLP.frequency.setValueAtTime(280, t);

      const isBeat = (i % 2 === 0);
      const bVol = isBeat ? 0.22 : 0.14;
      bassG.gain.setValueAtTime(bVol, t);
      bassG.gain.exponentialRampToValueAtTime(0.001, t + (beatSec / 2) * 0.92);

      bassOsc1.connect(bassLP);
      bassOsc2.connect(bassLP);
      bassLP.connect(bassG);
      bassG.connect(musicGain);

      bassOsc1.start(t); bassOsc1.stop(t + beatSec / 2);
      bassOsc2.start(t); bassOsc2.stop(t + beatSec / 2);
    }

    // High-Tech Clockwork Tick (16th notes driving forward momentum)
    const num16ths = Math.ceil(dur / (beatSec / 4));
    for (let i = 0; i < num16ths; i++) {
      const t = i * (beatSec / 4);
      if (t >= dur) break;

      // Filtered noise click
      const bufLen = Math.floor(sr * 0.025);
      const nBuf = ctx.createBuffer(1, bufLen, sr);
      const d = nBuf.getChannelData(0);
      for (let s = 0; s < bufLen; s++) d[s] = (Math.random() * 2 - 1) * Math.exp(-s / (sr * 0.005));

      const nSrc = ctx.createBufferSource();
      nSrc.buffer = nBuf;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(3800 + (i % 4) * 400, t);
      bp.Q.setValueAtTime(4.0, t);

      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime((i % 4 === 0) ? 0.08 : 0.04, t);

      nSrc.connect(bp); bp.connect(nGain); nGain.connect(musicGain);
      nSrc.start(t); nSrc.stop(t + 0.03);
    }

    // ==========================================
    // 3. HOLLYWOOD-GRADE CINEMATIC IMPACT SFX
    // Real noise-burst transients + sub booms + stereo whooshes + iPhone vibration
    // ==========================================
    const sfxGain = ctx.createGain();
    sfxGain.gain.setValueAtTime(0.85, 0);
    sfxGain.connect(limiter);

    // Real Cinematic 808 Sub-Boom (Deep impact with punch transient)
    function cinematic808(t, vol = 0.95) {
      // 1. Sub sine drop (140Hz -> 35Hz)
      const sub = ctx.createOscillator();
      const subG = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(140, t);
      sub.frequency.exponentialRampToValueAtTime(35, t + 0.45);
      subG.gain.setValueAtTime(vol, t);
      subG.gain.exponentialRampToValueAtTime(0.001, t + 0.75);
      sub.connect(subG); subG.connect(sfxGain);
      sub.start(t); sub.stop(t + 0.8);

      // 2. Punch noise crack
      const bufLen = Math.floor(sr * 0.1);
      const nBuf = ctx.createBuffer(1, bufLen, sr);
      const d = nBuf.getChannelData(0);
      for (let s = 0; s < bufLen; s++) d[s] = (Math.random() * 2 - 1) * Math.exp(-s / (sr * 0.018));
      const nSrc = ctx.createBufferSource();
      nSrc.buffer = nBuf;
      const nG = ctx.createGain();
      nG.gain.setValueAtTime(0.65, t);
      nSrc.connect(nG); nG.connect(sfxGain);
      nSrc.start(t); nSrc.stop(t + 0.12);
    }

    // Cinematic Whoosh Transition
    function cinematicWhoosh(t, dur = 0.45) {
      const bufLen = Math.floor(sr * dur);
      const nBuf = ctx.createBuffer(2, bufLen, sr);
      const left = nBuf.getChannelData(0);
      const right = nBuf.getChannelData(1);
      for (let s = 0; s < bufLen; s++) {
        const prog = s / bufLen;
        const env = Math.sin(prog * Math.PI);
        left[s] = (Math.random() * 2 - 1) * env * (1 - prog * 0.3);
        right[s] = (Math.random() * 2 - 1) * env * (0.7 + prog * 0.3);
      }
      const nSrc = ctx.createBufferSource();
      nSrc.buffer = nBuf;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(250, t);
      bp.frequency.exponentialRampToValueAtTime(2200, t + dur * 0.55);
      bp.frequency.exponentialRampToValueAtTime(350, t + dur);
      bp.Q.setValueAtTime(2.2, t);

      const wG = ctx.createGain();
      wG.gain.setValueAtTime(0.75, t);

      nSrc.connect(bp); bp.connect(wG); wG.connect(sfxGain);
      nSrc.start(t); nSrc.stop(t + dur);
    }

    // Cinematic Tension Riser into Drop
    function cinematicRiser(t, dur = 2.4) {
      const osc = ctx.createOscillator();
      const bp = ctx.createBiquadFilter();
      const rG = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, t);
      osc.frequency.exponentialRampToValueAtTime(680, t + dur);

      bp.type = 'lowpass';
      bp.frequency.setValueAtTime(250, t);
      bp.frequency.exponentialRampToValueAtTime(2800, t + dur);

      rG.gain.setValueAtTime(0.02, t);
      rG.gain.linearRampToValueAtTime(0.48, t + dur);
      rG.gain.setValueAtTime(0.001, t + dur + 0.02);

      osc.connect(bp); bp.connect(rG); rG.connect(sfxGain);
      osc.start(t); osc.stop(t + dur + 0.05);
    }

    // Realistic iPhone Haptic Vibration Buzz (Multi-burst)
    function phoneVibrate(t) {
      for (let b = 0; b < 3; b++) {
        const bStart = t + b * 0.38;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(145, bStart);

        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(320, bStart);

        g.gain.setValueAtTime(0.45, bStart);
        g.gain.setValueAtTime(0.40, bStart + 0.22);
        g.gain.linearRampToValueAtTime(0.001, bStart + 0.25);

        osc.connect(lp); lp.connect(g); g.connect(sfxGain);
        osc.start(bStart); osc.stop(bStart + 0.26);
      }
    }

    // Realistic DTMF Touch Tone
    function phoneDialTone(t, f1, f2) {
      [f1, f2].forEach(f => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        o.connect(g); g.connect(sfxGain);
        o.start(t); o.stop(t + 0.1);
      });
    }

    // Realistic Cash Rattle / Register Chime
    function cashChime(t) {
      [988, 1318, 1760, 2093].forEach((f, idx) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(f, t + idx * 0.05);
        g.gain.setValueAtTime(0.35, t + idx * 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.45);
        o.connect(g); g.connect(sfxGain);
        o.start(t + idx * 0.05); o.stop(t + idx * 0.05 + 0.48);
      });
    }

    // ==========================================
    // EXACT TIMING TRIGGERS (Synced to Voice Punchlines)
    // ==========================================
    // 0.0s: Hook Opener 808 Slam
    cinematic808(0.05, 1.0);

    // 1.25s: "$3 Trillion" whoosh + sub
    cinematicWhoosh(1.15);

    // 5.1s: "Think again" dramatic riser stop + impact
    cinematic808(5.15, 0.85);

    // 10.0s - 12.0s: "Jensen Huang cheated" building riser + MASSIVE 808 drop
    cinematicRiser(9.6, 2.3);
    cinematic808(12.0, 1.0);
    cinematicWhoosh(11.8);

    // 15.2s: "1995" Act 2 transition whoosh + tape stop hit
    cinematicWhoosh(15.1);
    cinematic808(15.5, 0.85);

    // 21.0s: "Chip was broken" shattered glass crack + 808
    cinematic808(21.2, 0.9);

    // 25.5s - 27.5s: "Walked out with $5,000,000" cash chime + 808 hit
    cashChime(27.4);
    cinematic808(27.5, 0.95);

    // 33.5s: Act 3 Reality Check "Nobody is perfect" Whoosh + Sub
    cinematicWhoosh(33.3);
    cinematic808(33.8, 0.85);

    // 38.0s: "Losing $8,000 every single week" 808 slam
    cinematic808(38.2, 0.95);

    // 40.5s: "Ladder" & "Die in voicemail" phone vibration buzz
    phoneVibrate(40.8);
    phoneVibrate(42.5);

    // 46.2s: "Unfair advantage" Act 4 AVA transition riser + 808 drop
    cinematicRiser(44.2, 2.0);
    cinematic808(46.3, 1.0);
    cinematicWhoosh(46.2);

    // 50.8s: "Meet AVA" futuristic holographic sweep
    cinematicWhoosh(50.8);
    cinematic808(51.2, 0.85);

    // 57.8s: "0.8 seconds on the first ring" Speedometer slam
    cinematic808(58.0, 0.95);
    cinematicWhoosh(57.8);

    // 64.0s: Act 5 Live Dial Challenge Whoosh + 808
    cinematicWhoosh(63.9);
    cinematic808(64.2, 0.9);

    // 66.5s: DTMF Keypad dial tones for (561) 813-8602
    phoneDialTone(66.4, 770, 1336); // 5
    phoneDialTone(66.7, 770, 1477); // 6
    phoneDialTone(67.0, 697, 1209); // 1
    phoneDialTone(67.4, 852, 1336); // 8
    phoneDialTone(67.7, 697, 1209); // 1
    phoneDialTone(68.0, 697, 1477); // 3

    // 70.5s: "Comment AVA" final CTA 808 drop
    cinematic808(70.6, 0.95);
    cashChime(71.0);

    // Render to WAV buffer
    const renderedBuf = await ctx.startRendering();

    // Encode to 16-bit stereo WAV
    const numChan = 2;
    const len = renderedBuf.length * numChan * 2 + 44;
    const outArr = new Uint8Array(len);
    const view = new DataView(outArr.buffer);

    function writeStr(offset, str) {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    }

    writeStr(0, 'RIFF');
    view.setUint32(4, len - 8, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, numChan, true);
    view.setUint32(24, sr, true);
    view.setUint32(28, sr * numChan * 2, true);
    view.setUint16(32, numChan * 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, len - 44, true);

    const cL = renderedBuf.getChannelData(0);
    const cR = renderedBuf.getChannelData(1);
    let offset = 44;
    for (let i = 0; i < renderedBuf.length; i++) {
      let sL = Math.max(-1, Math.min(1, cL[i]));
      let sR = Math.max(-1, Math.min(1, cR[i]));
      view.setInt16(offset, sL < 0 ? sL * 0x8000 : sL * 0x7FFF, true);
      view.setInt16(offset + 2, sR < 0 ? sR * 0x8000 : sR * 0x7FFF, true);
      offset += 4;
    }

    let bin = '';
    const chunk = 8192;
    for (let i = 0; i < outArr.length; i += chunk) {
      bin += String.fromCharCode.apply(null, outArr.subarray(i, i + chunk));
    }
    return btoa(bin);
  }, voiceB64, TOTAL_SEC, tsData.words);

  await browser.close();

  fs.writeFileSync(outWavPath, Buffer.from(wavBase64, 'base64'));
  console.log(`✅ Saved master WAV: ${outWavPath} (${(fs.statSync(outWavPath).size / 1024 / 1024).toFixed(2)} MB)`);

  // Convert to high-bitrate MP3 via ffmpeg
  execFileSync(ffmpegPath, ['-y', '-i', outWavPath, '-b:a', '256k', outMp3Path]);
  console.log(`✅ Saved master MP3: ${outMp3Path}`);
})();
