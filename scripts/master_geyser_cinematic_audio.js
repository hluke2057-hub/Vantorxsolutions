// scripts/master_geyser_cinematic_audio.js
// Hollywood-Grade Cinematic Audio Master for "The $14,000 Midnight Geyser"
// Features:
// - Multi-layered Foley: High-pressure pipe explosion, water spray, haptic phone vibration, table drop, tire screech, cash register, crystal AI chime
// - Dynamic Music Bed: Suspenseful minor synthwave tension -> sudden drop to voicemail -> upbeat triumphant tech resolution
// - Studio Master Chain: Voice HP/presence EQ, sidechain ducking, brickwall limiter

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');
const { execFileSync } = require('child_process');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const dryVoicePath = path.join(root, 'website/demo/audio/geyser-voiceover.mp3');
const tsJsonPath = path.join(root, 'website/demo/audio/geyser-timestamps.json');
const outWavPath = path.join(root, 'website/demo/audio/geyser-master.wav');
const outMp3Path = path.join(root, 'website/demo/audio/geyser-master.mp3');

const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));
const TOTAL_SEC = Number(tsData.duration || 41.378);

console.log(`Rendering Hollywood-Grade Cinematic Audio Master for Geyser Story (${TOTAL_SEC}s)...`);

(async () => {
  const voiceB64 = fs.readFileSync(dryVoicePath).toString('base64');
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const wavBase64 = await page.evaluate(async (vB64, dur, words) => {
    const sr = 44100;
    const ctx = new OfflineAudioContext(2, Math.ceil(sr * (dur + 1.2)), sr);

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
    voicePres.gain.setValueAtTime(2.8, 0);

    const voiceComp = ctx.createDynamicsCompressor();
    voiceComp.threshold.setValueAtTime(-16, 0);
    voiceComp.ratio.setValueAtTime(3.4, 0);

    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(1.18, 0);

    voiceHP.connect(voicePres);
    voicePres.connect(voiceComp);
    voiceComp.connect(voiceGain);
    voiceGain.connect(limiter);

    const vBuf = await ctx.decodeAudioData(Uint8Array.from(atob(vB64), c => c.charCodeAt(0)).buffer);
    const vSrc = ctx.createBufferSource();
    vSrc.buffer = vBuf;
    vSrc.connect(voiceHP);
    vSrc.start(0.0);

    // Sidechain Ducking Curve from Voice Activity
    const musicDuckingGain = ctx.createGain();
    musicDuckingGain.gain.setValueAtTime(0.7, 0);

    words.forEach(w => {
      musicDuckingGain.gain.setValueAtTime(0.7, Math.max(0, w.start - 0.05));
      musicDuckingGain.gain.linearRampToValueAtTime(0.32, w.start);
      musicDuckingGain.gain.setValueAtTime(0.32, w.end);
      musicDuckingGain.gain.linearRampToValueAtTime(0.7, w.end + 0.15);
    });

    // ==========================================
    // 2. CINEMATIC MUSIC BED (Synthwave Tension -> Tech Resolve)
    // ==========================================
    const musicMaster = ctx.createGain();
    musicMaster.gain.setValueAtTime(0.72, 0);
    musicMaster.connect(musicDuckingGain);
    musicDuckingGain.connect(limiter);

    // Act 1-3 Tension Bass (0s to 25s) - Dark C minor 8th-note pulse
    const bassFreqs = [65.41, 65.41, 77.78, 58.27]; // C2, C2, Eb2, Bb1
    const bpm = 118;
    const beatSec = 60 / bpm;
    const eighthSec = beatSec / 2;

    const bassOsc = ctx.createOscillator();
    bassOsc.type = 'sawtooth';

    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(280, 0);
    bassFilter.Q.setValueAtTime(3.5, 0);

    const bassGain = ctx.createGain();
    bassGain.gain.setValueAtTime(0.42, 0);

    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(musicMaster);

    bassOsc.start(0);
    bassOsc.stop(25.5);

    // Automate pulsing 8th notes up to 25s
    const totalEighths = Math.floor(25.0 / eighthSec);
    for (let i = 0; i < totalEighths; i++) {
      const t = i * eighthSec;
      const chordIdx = Math.floor(i / 16) % bassFreqs.length;
      const freq = bassFreqs[chordIdx];
      bassOsc.frequency.setValueAtTime(freq, t);
      bassFilter.frequency.setValueAtTime(220, t);
      bassFilter.frequency.exponentialRampToValueAtTime(550, t + 0.04);
      bassFilter.frequency.exponentialRampToValueAtTime(180, t + eighthSec - 0.02);
    }

    // Atmospheric Pad (Minor to Suspense)
    const padOsc = ctx.createOscillator();
    padOsc.type = 'triangle';
    padOsc.frequency.setValueAtTime(130.81, 0); // C3

    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.setValueAtTime(450, 0);

    const padGain = ctx.createGain();
    padGain.gain.setValueAtTime(0.18, 0);
    padOsc.connect(padFilter);
    padFilter.connect(padGain);
    padGain.connect(musicMaster);
    padOsc.start(0);
    padOsc.stop(25.5);

    // Clockwork 16th-Note Tension Ticks (4s to 14s)
    const tickGain = ctx.createGain();
    tickGain.gain.setValueAtTime(0.14, 0);
    tickGain.connect(musicMaster);

    const sixteenthSec = beatSec / 4;
    for (let t = 4.0; t < 14.5; t += sixteenthSec) {
      const click = ctx.createOscillator();
      click.type = 'sine';
      click.frequency.setValueAtTime(1400, t);
      click.frequency.exponentialRampToValueAtTime(80, t + 0.02);

      const cg = ctx.createGain();
      cg.gain.setValueAtTime(0.18, t);
      cg.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

      click.connect(cg);
      cg.connect(tickGain);
      click.start(t);
      click.stop(t + 0.025);
    }

    // Act 4-6 Triumphant Tech Soundtrack (26.0s to end)
    const upbeatBass = ctx.createOscillator();
    upbeatBass.type = 'sawtooth';

    const upbeatFilter = ctx.createBiquadFilter();
    upbeatFilter.type = 'lowpass';
    upbeatFilter.frequency.setValueAtTime(480, 26.0);
    upbeatFilter.Q.setValueAtTime(2.8, 26.0);

    const upbeatGain = ctx.createGain();
    upbeatGain.gain.setValueAtTime(0.0, 0);
    upbeatGain.gain.setValueAtTime(0.0, 25.8);
    upbeatGain.gain.linearRampToValueAtTime(0.48, 26.5);

    upbeatBass.connect(upbeatFilter);
    upbeatFilter.connect(upbeatGain);
    upbeatGain.connect(musicMaster);

    upbeatBass.start(25.8);
    upbeatBass.stop(dur + 1.0);

    // High energy synth progression: F -> G -> A minor -> C
    const techChords = [87.31, 98.00, 110.00, 130.81]; // F2, G2, A2, C3
    for (let t = 26.0, idx = 0; t < dur + 0.5; t += eighthSec, idx++) {
      const f = techChords[Math.floor(idx / 8) % techChords.length];
      upbeatBass.frequency.setValueAtTime(f, t);
      upbeatFilter.frequency.setValueAtTime(350, t);
      upbeatFilter.frequency.exponentialRampToValueAtTime(900, t + 0.06);
      upbeatFilter.frequency.exponentialRampToValueAtTime(300, t + eighthSec - 0.02);
    }

    // ==========================================
    // 3. CINEMATIC FOLEY & IMPACT SFX LAYER
    // ==========================================
    const sfxBus = ctx.createGain();
    sfxBus.gain.setValueAtTime(1.0, 0);
    sfxBus.connect(limiter);

    // HELPER: 808 Sub Drop
    function trigger808(time, startFreq, decayTime, gainVal) {
      const sub = ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(startFreq || 120, time);
      sub.frequency.exponentialRampToValueAtTime(28, time + decayTime);

      const g = ctx.createGain();
      g.gain.setValueAtTime(gainVal || 0.85, time);
      g.gain.exponentialRampToValueAtTime(0.0001, time + decayTime);

      sub.connect(g);
      g.connect(sfxBus);
      sub.start(time);
      sub.stop(time + decayTime + 0.05);
    }

    // HELPER: Stereo Noise Burst / Whoosh
    function triggerNoiseBurst(time, duration, hpFreq, lpFreq, peakGain) {
      const bufferSize = Math.floor(sr * duration);
      const buffer = ctx.createBuffer(2, bufferSize, sr);
      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
        }
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(hpFreq, time);

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(lpFreq, time);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.001, time);
      g.gain.linearRampToValueAtTime(peakGain, time + duration * 0.3);
      g.gain.exponentialRampToValueAtTime(0.001, time + duration);

      noise.connect(hp);
      hp.connect(lp);
      lp.connect(g);
      g.connect(sfxBus);
      noise.start(time);
      noise.stop(time + duration + 0.05);
    }

    // HELPER: iPhone Vibration Buzz Burst
    function triggerHapticBuzz(time, bursts) {
      for (let b = 0; b < bursts; b++) {
        const t0 = time + b * 0.65;
        // Motor resonance: 165Hz
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(165, t0);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, t0);

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.001, t0);
        g.gain.linearRampToValueAtTime(0.38, t0 + 0.05);
        g.gain.setValueAtTime(0.38, t0 + 0.32);
        g.gain.linearRampToValueAtTime(0.001, t0 + 0.40);

        osc.connect(filter);
        filter.connect(g);
        g.connect(sfxBus);
        osc.start(t0);
        osc.stop(t0 + 0.42);
      }
    }

    // HELPER: DTMF Phone Dial Beeps
    function triggerDTMF(time, count) {
      const rowCols = [
        [697, 1209], [770, 1336], [852, 1477], [941, 1336], [697, 1477]
      ];
      for (let i = 0; i < count; i++) {
        const t = time + i * 0.12;
        const pair = rowCols[i % rowCols.length];
        pair.forEach(f => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.12, t);
          g.gain.setValueAtTime(0.12, t + 0.07);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
          osc.connect(g);
          g.connect(sfxBus);
          osc.start(t);
          osc.stop(t + 0.1);
        });
      }
    }

    // HELPER: Cash Register Bell & Shimmer
    function triggerCashChime(time) {
      const bellFreqs = [1975, 2349, 2960]; // High B, D, F#
      bellFreqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, time + idx * 0.04);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.24, time + idx * 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, time + idx * 0.04 + 1.2);
        osc.connect(g);
        g.connect(sfxBus);
        osc.start(time + idx * 0.04);
        osc.stop(time + idx * 0.04 + 1.3);
      });
    }

    // HELPER: Futuristic AI Crystal Chime
    function triggerAIChime(time) {
      const freqs = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7 arpeggio
      freqs.forEach((f, i) => {
        const t = time + i * 0.06;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.22, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
        osc.connect(g);
        g.connect(sfxBus);
        osc.start(t);
        osc.stop(t + 1.6);
      });
    }

    // ==========================================
    // SCHEDULE EXACT SCENE FOLEY SFX
    // ==========================================

    // 0.0s: Opening Dark Sub Drop
    trigger808(0.05, 90, 1.4, 0.7);

    // 3.08s: High-Pressure Pipe Rupture ("burst")
    // Heavy 808 explosion + metallic tear + continuous water hiss
    trigger808(3.08, 140, 1.2, 0.95);
    triggerNoiseBurst(3.08, 0.6, 1200, 7500, 0.65); // metallic snap
    triggerNoiseBurst(3.20, 3.5, 300, 3800, 0.42);  // gushing high pressure water

    // 6.2s: Homeowner Panics & Dials DTMF
    triggerDTMF(6.2, 5);

    // 11.2s - 13.5s: Plumber Frank asleep, phone violently vibrating on nightstand
    triggerHapticBuzz(11.2, 3); // 3 double-burst vibrations

    // 13.2s: Phone slips and tumbles off nightstand (thud + water drop)
    trigger808(13.2, 110, 0.35, 0.6); // wood thump
    triggerNoiseBurst(13.25, 0.4, 600, 2400, 0.35); // water glass splash

    // 14.8s: Call drops to voicemail (busy disconnect pulse)
    for (let i = 0; i < 3; i++) {
      const t = 14.8 + i * 0.4;
      const d1 = ctx.createOscillator();
      d1.type = 'sine';
      d1.frequency.setValueAtTime(480, t);
      const d2 = ctx.createOscillator();
      d2.type = 'sine';
      d2.frequency.setValueAtTime(620, t);
      const dg = ctx.createGain();
      dg.gain.setValueAtTime(0.12, t);
      dg.gain.setValueAtTime(0.12, t + 0.22);
      dg.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      d1.connect(dg);
      d2.connect(dg);
      dg.connect(sfxBus);
      d1.start(t);
      d2.start(t);
      d1.stop(t + 0.26);
      d2.stop(t + 0.26);
    }

    // 18.0s: Competitor takes the call (tire screech / fast whoosh)
    triggerNoiseBurst(18.0, 0.8, 1500, 6500, 0.55);

    // 19.5s: $14,000 Check Taken! (Cash Register Bell + 808 punch)
    trigger808(19.5, 95, 0.8, 0.7);
    triggerCashChime(19.5);

    // 25.5s: AVA Cinematic Whoosh / Riser Transition
    triggerNoiseBurst(25.5, 0.9, 200, 8000, 0.7);

    // 26.8s: "Meet AVA" - Crystal AI Voice Chime & Sub Drop
    trigger808(26.8, 80, 1.2, 0.85);
    triggerAIChime(26.8);

    // 30.5s: "Locks the job" - Clean confirmation UI notification ping
    const ping = ctx.createOscillator();
    ping.type = 'sine';
    ping.frequency.setValueAtTime(1760, 30.5); // A6
    const pg = ctx.createGain();
    pg.gain.setValueAtTime(0.2, 30.5);
    pg.gain.exponentialRampToValueAtTime(0.001, 30.5 + 0.6);
    ping.connect(pg);
    pg.connect(sfxBus);
    ping.start(30.5);
    ping.stop(30.5 + 0.65);

    // 35.0s: Morning Sunlight Payoff - Warm Swell & 808
    trigger808(35.0, 75, 1.5, 0.75);

    // 38.5s - 40.5s: Dial CTA Keypad Taps
    triggerDTMF(38.8, 4);

    // Final Resolution 808
    trigger808(dur - 0.5, 65, 1.2, 0.6);

    // Render AudioBuffer
    const rendered = await ctx.startRendering();

    // Convert AudioBuffer to 16-bit PCM Stereo WAV
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

  // Convert to high-bitrate MP3 via ffmpeg-static
  console.log('Encoding high-fidelity 256k MP3...');
  execFileSync(ffmpegPath, [
    '-y',
    '-i', outWavPath,
    '-b:a', '256k',
    outMp3Path
  ], { stdio: 'inherit' });

  console.log(`Master MP3 created: ${outMp3Path}`);
  console.log('Hollywood-Grade Cinematic Audio Master Complete.');
})().catch(err => {
  console.error('Mastering failed:', err);
  process.exit(1);
});
