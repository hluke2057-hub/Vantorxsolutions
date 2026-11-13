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
const TOTAL_SEC = 29.2; // Perfectly under 30 seconds!

async function renderAudioMaster() {
  console.log(`Mastering audio for ${TOTAL_SEC}s with voiceover + tactile SFX...`);
  const voiceB64 = fs.readFileSync(dryVoicePath).toString('base64');
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const wavBase64 = await page.evaluate(async (vB64, dur, words) => {
    const sr = 44100;
    const ctx = new OfflineAudioContext(2, Math.ceil(sr * dur), sr);

    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-1.5, 0);
    limiter.ratio.setValueAtTime(12.0, 0);
    limiter.connect(ctx.destination);

    // Voice EQ
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(95, 0);

    const pres = ctx.createBiquadFilter();
    pres.type = 'peaking';
    pres.frequency.setValueAtTime(3200, 0);
    pres.gain.setValueAtTime(2.5, 0);

    const vGain = ctx.createGain();
    vGain.gain.setValueAtTime(1.0, 0);

    hp.connect(pres);
    pres.connect(vGain);
    vGain.connect(limiter);

    const vBuf = await ctx.decodeAudioData(Uint8Array.from(atob(vB64), c => c.charCodeAt(0)).buffer);
    const vSrc = ctx.createBufferSource();
    vSrc.buffer = vBuf;
    vSrc.connect(hp);
    vSrc.start(0);

    // Tactile Foley SFX chain
    const sfxGain = ctx.createGain();
    sfxGain.gain.setValueAtTime(0.65, 0);
    sfxGain.connect(limiter);

    function subHit(t) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(130, t);
      o.frequency.exponentialRampToValueAtTime(32, t + 0.38);
      g.gain.setValueAtTime(0.75, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.46);
    }

    function glitchBlip(t, f = 1450) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(f, t);
      o.frequency.exponentialRampToValueAtTime(f * 0.4, t + 0.08);
      g.gain.setValueAtTime(0.35, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.1);
    }

    function cashChime(t) {
      [784, 988, 1175, 1568].forEach((freq, idx) => {
        const st = t + idx * 0.04;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, st);
        g.gain.setValueAtTime(0.3, st);
        g.gain.exponentialRampToValueAtTime(0.001, st + 0.4);
        o.connect(g); g.connect(sfxGain); o.start(st); o.stop(st + 0.42);
      });
    }

    function avaChime(t) {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const st = t + idx * 0.045;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, st);
        g.gain.setValueAtTime(0.28, st);
        g.gain.exponentialRampToValueAtTime(0.001, st + 0.36);
        o.connect(g); g.connect(sfxGain); o.start(st); o.stop(st + 0.38);
      });
    }

    function smsDing(t) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(1046.5, t);
      o.frequency.setValueAtTime(1567.98, t + 0.08);
      g.gain.setValueAtTime(0.4, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.36);
    }

    // Trigger SFX at exact spoken moments
    subHit(0.05); // Initial question boom
    glitchBlip(3.4, 1600); // "Think again"
    subHit(4.2); // "cheated"
    glitchBlip(6.0, 1100); // "Let me explain"
    subHit(7.2); // "1995"
    cashChime(12.5); // "five million"
    glitchBlip(13.8, 1400); // "automation"
    subHit(15.0); // "Nobody is perfect"
    glitchBlip(17.2, 850); // "voicemail"
    avaChime(19.0); // "Meet AVA"
    smsDing(22.8); // "books jobs"
    avaChime(24.5); // "Call"

    const buf = await ctx.startRendering();
    const numCh = buf.numberOfChannels, numS = buf.length, dataSize = numS * numCh * 2;
    const ab = new ArrayBuffer(44 + dataSize), dv = new DataView(ab);
    const ws = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
    ws(0, 'RIFF'); dv.setUint32(4, 36 + dataSize, true); ws(8, 'WAVE'); ws(12, 'fmt ');
    dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, numCh, true);
    dv.setUint32(24, sr, true); dv.setUint32(28, sr * numCh * 2, true);
    dv.setUint16(32, numCh * 2, true); dv.setUint16(34, 16, true);
    ws(36, 'data'); dv.setUint32(40, dataSize, true);
    let off = 44;
    const c0 = buf.getChannelData(0), c1 = buf.getChannelData(1);
    for (let i = 0; i < numS; i++) {
      dv.setInt16(off, Math.max(-1, Math.min(1, c0[i])) * 0x7FFF, true); off += 2;
      dv.setInt16(off, Math.max(-1, Math.min(1, c1[i])) * 0x7FFF, true); off += 2;
    }
    const bytes = new Uint8Array(ab);
    let bin = '';
    for (let i = 0; i < bytes.byteLength; i += 8192) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + 8192, bytes.byteLength)));
    }
    return btoa(bin);
  }, voiceB64, TOTAL_SEC, tsData.words);

  await browser.close();
  fs.writeFileSync(outWavPath, Buffer.from(wavBase64, 'base64'));
  execFileSync(ffmpegPath, ['-y', '-i', outWavPath, '-codec:a', 'libmp3lame', '-b:a', '192k', outMp3Path]);
  console.log('Audio master rendered successfully:', outMp3Path);
}

renderAudioMaster().catch(err => { console.error(err); process.exit(1); });
