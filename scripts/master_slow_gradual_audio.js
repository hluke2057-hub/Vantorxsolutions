// scripts/master_slow_gradual_audio.js
// Masters voiceover with rich tactile Foley SFX throughout all 75 seconds
// Ensures a sound effect fires every 2 to 3 seconds to keep viewers hooked

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
const TOTAL_SEC = Number((tsData.duration + 0.8).toFixed(2)); // ~75.1s

async function renderAudioMaster() {
  console.log(`Mastering audio for ${TOTAL_SEC}s with voiceover + continuous tactile SFX...`);
  const voiceB64 = fs.readFileSync(dryVoicePath).toString('base64');
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const wavBase64 = await page.evaluate(async (vB64, dur, words) => {
    const sr = 44100;
    const ctx = new OfflineAudioContext(2, Math.ceil(sr * dur), sr);

    // Master bus limiter
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-1.5, 0);
    limiter.ratio.setValueAtTime(10.0, 0);
    limiter.connect(ctx.destination);

    // Voice EQ & presence
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(90, 0);

    const pres = ctx.createBiquadFilter();
    pres.type = 'peaking';
    pres.frequency.setValueAtTime(3100, 0);
    pres.gain.setValueAtTime(2.2, 0);

    const vGain = ctx.createGain();
    vGain.gain.setValueAtTime(1.05, 0);

    hp.connect(pres);
    pres.connect(vGain);
    vGain.connect(limiter);

    const vBuf = await ctx.decodeAudioData(Uint8Array.from(atob(vB64), c => c.charCodeAt(0)).buffer);
    const vSrc = ctx.createBufferSource();
    vSrc.buffer = vBuf;
    vSrc.connect(hp);
    vSrc.start(0);

    // SFX Bus
    const sfxGain = ctx.createGain();
    sfxGain.gain.setValueAtTime(0.70, 0);
    sfxGain.connect(limiter);

    // --- SFX GENERATORS ---
    function subBoom(t, vol = 0.8) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(120, t);
      o.frequency.exponentialRampToValueAtTime(30, t + 0.45);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.50);
      o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.52);
    }

    function impactSlam(t) {
      subBoom(t, 0.9);
      // Punch crack
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(450, t);
      o.frequency.exponentialRampToValueAtTime(60, t + 0.12);
      g.gain.setValueAtTime(0.6, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.16);
    }

    function whoosh(t, f = 800) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(f * 0.4, t);
      o.frequency.exponentialRampToValueAtTime(f * 1.6, t + 0.15);
      o.frequency.exponentialRampToValueAtTime(100, t + 0.35);
      g.gain.setValueAtTime(0.01, t);
      g.gain.linearRampToValueAtTime(0.35, t + 0.15);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
      o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.40);
    }

    function riser(t, dur = 2.5) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(80, t);
      o.frequency.exponentialRampToValueAtTime(550, t + dur);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(200, t);
      lp.frequency.exponentialRampToValueAtTime(1400, t + dur);
      g.gain.setValueAtTime(0.05, t);
      g.gain.linearRampToValueAtTime(0.28, t + dur);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.08);
      o.connect(lp); lp.connect(g); g.connect(sfxGain);
      o.start(t); o.stop(t + dur + 0.1);
    }

    function tapeStop(t) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(600, t);
      o.frequency.exponentialRampToValueAtTime(40, t + 0.28);
      g.gain.setValueAtTime(0.35, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.30);
      o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.32);
    }

    function clockTick(t) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(1200, t);
      o.frequency.exponentialRampToValueAtTime(400, t + 0.03);
      g.gain.setValueAtTime(0.35, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.05);
    }

    function retroChime(t) {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, t + idx * 0.06);
        g.gain.setValueAtTime(0.28, t + idx * 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.45);
        o.connect(g); g.connect(sfxGain);
        o.start(t + idx * 0.06); o.stop(t + idx * 0.06 + 0.48);
      });
    }

    function cashChime(t) {
      [987.77, 1318.51].forEach((f, idx) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, t + idx * 0.08);
        g.gain.setValueAtTime(0.40, t + idx * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.65);
        o.connect(g); g.connect(sfxGain);
        o.start(t + idx * 0.08); o.stop(t + idx * 0.08 + 0.70);
      });
    }

    function phoneRing(t) {
      const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
      o1.type = 'sine'; o1.frequency.setValueAtTime(440, t);
      o2.type = 'sine'; o2.frequency.setValueAtTime(480, t);
      g.gain.setValueAtTime(0.32, t);
      g.gain.setValueAtTime(0.32, t + 0.35);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.40);
      o1.connect(g); o2.connect(g); g.connect(sfxGain);
      o1.start(t); o1.stop(t + 0.42); o2.start(t); o2.stop(t + 0.42);
    }

    function glassCrack(t) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(2200, t);
      o.frequency.exponentialRampToValueAtTime(150, t + 0.18);
      g.gain.setValueAtTime(0.45, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.25);
    }

    function cyberChime(t) {
      [440, 554.37, 659.25, 880].forEach((f, idx) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(f, t + idx * 0.05);
        g.gain.setValueAtTime(0.35, t + idx * 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.55);
        o.connect(g); g.connect(sfxGain);
        o.start(t + idx * 0.05); o.stop(t + idx * 0.05 + 0.60);
      });
    }

    function smsDing(t) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(1567.98, t); // G6
      o.frequency.exponentialRampToValueAtTime(1318.51, t + 0.22); // E6
      g.gain.setValueAtTime(0.50, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.60);
    }

    function dtmfTone(t, freq1, freq2, dur = 0.08) {
      const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
      o1.type = 'sine'; o1.frequency.setValueAtTime(freq1, t);
      o2.type = 'sine'; o2.frequency.setValueAtTime(freq2, t);
      g.gain.setValueAtTime(0.22, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o1.connect(g); o2.connect(g); g.connect(sfxGain);
      o1.start(t); o1.stop(t + dur + 0.01);
      o2.start(t); o2.stop(t + dur + 0.01);
    }

    // --- SCHEDULE CONTINUOUS SOUND EFFECTS ---
    // Scene 1: Gradual Hook (0s - 12.65s)
    subBoom(0.05, 0.7);
    riser(0.8, 3.2); // Building suspense
    whoosh(4.2, 700);
    riser(6.0, 3.0);
    tapeStop(10.2); // Tape stop right before "Jensen cheated"
    impactSlam(10.8); // Drop on "cheated"
    whoosh(12.2, 900); // Transition into 1995 Sega

    // Scene 2: 1995 Sega Story (12.65s - 31.81s)
    clockTick(14.5);
    clockTick(15.2);
    clockTick(15.9);
    subBoom(16.5, 0.6); // "thirty days of cash"
    whoosh(18.2);
    impactSlam(20.5); // "chip was broken"
    retroChime(22.8); // "Sega's boardroom"
    whoosh(25.0);
    cashChime(27.8); // "$5,000,000"
    cashChime(28.4);
    subBoom(30.0, 0.65); // "automation"
    whoosh(31.5);

    // Scene 3: Nobody's Perfect & The Bleed (31.81s - 45.43s)
    impactSlam(32.5); // "Nobody is perfect"
    whoosh(35.2);
    phoneRing(38.0); // Contractor phone ringing
    phoneRing(40.2);
    glassCrack(42.5); // -$8,000 lost to voicemail
    subBoom(43.5, 0.75);
    whoosh(45.0, 1100); // High-speed whoosh transition into product cut

    // Scene 4: Seamless Cut to Products - AVA & Web (45.43s - 74.30s)
    cyberChime(46.0); // Ava activation
    subBoom(47.2, 0.6);
    clockTick(51.0); // 0.8 seconds answer
    whoosh(54.0);
    smsDing(57.5); // Instant SMS dispatch ticket
    cashChime(60.2); // Job secured
    whoosh(62.8); // Website mockup slide-in
    subBoom(65.0, 0.65);

    // Live CTA Dialing Tones
    dtmfTone(67.5, 770, 1336); // '5'
    dtmfTone(67.7, 770, 1477); // '6'
    dtmfTone(67.9, 697, 1209); // '1'
    dtmfTone(68.2, 852, 1336); // '8'
    dtmfTone(68.4, 697, 1209); // '1'
    dtmfTone(68.6, 697, 1477); // '3'
    smsDing(70.5);
    subBoom(72.0, 0.85); // Final grand sub drop

    const rendered = await ctx.startRendering();

    // Export 16-bit stereo WAV buffer
    const nCh = 2;
    const nSamples = rendered.length;
    const wavHeader = new ArrayBuffer(44 + nSamples * nCh * 2);
    const view = new DataView(wavHeader);
    function wStr(offset, str) { for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)); }
    wStr(0, 'RIFF');
    view.setUint32(4, 36 + nSamples * nCh * 2, true);
    wStr(8, 'WAVE');
    wStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, nCh, true);
    view.setUint32(24, sr, true);
    view.setUint32(28, sr * nCh * 2, true);
    view.setUint16(32, nCh * 2, true);
    view.setUint16(34, 16, true);
    wStr(36, 'data');
    view.setUint32(40, nSamples * nCh * 2, true);

    const ch0 = rendered.getChannelData(0);
    const ch1 = rendered.getChannelData(1);
    let offset = 44;
    for (let i = 0; i < nSamples; i++) {
      let s0 = Math.max(-1, Math.min(1, ch0[i]));
      let s1 = Math.max(-1, Math.min(1, ch1[i]));
      view.setInt16(offset, s0 < 0 ? s0 * 0x8000 : s0 * 0x7FFF, true);
      offset += 2;
      view.setInt16(offset, s1 < 0 ? s1 * 0x8000 : s1 * 0x7FFF, true);
      offset += 2;
    }

    const bytes = new Uint8Array(wavHeader);
    let binary = '';
    const chunkSz = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSz) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSz));
    }
    return btoa(binary);
  }, voiceB64, TOTAL_SEC, tsData.words);

  await browser.close();

  fs.writeFileSync(outWavPath, Buffer.from(wavBase64, 'base64'));
  console.log(`✅ Saved Foley-mastered WAV: ${outWavPath}`);

  // Convert to high-quality MP3 via FFmpeg
  execFileSync(ffmpegPath, ['-y', '-i', outWavPath, '-b:a', '192k', outMp3Path]);
  console.log(`✅ Converted to MP3: ${outMp3Path}`);
}

renderAudioMaster().catch(console.error);
