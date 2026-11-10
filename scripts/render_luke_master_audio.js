// scripts/render_luke_master_audio.js
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const voiceoverPath = path.resolve('website/fitness/audio/luke-voiceover-master.mp3');
const outWavPath = path.resolve('website/fitness/audio/luke-audio-full-master.wav');

(async () => {
  console.log('Rendering 63.5s master audio for Luke Hamilton Reel (Voice + Phonk/Synth Beat + Barbell SFX + Subdrops)...');
  const voiceoverB64 = fs.readFileSync(voiceoverPath).toString('base64');

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const wavBase64 = await page.evaluate(async (vB64) => {
    const sampleRate = 44100;
    const duration = 63.5;
    const totalSamples = Math.ceil(sampleRate * duration);
    const offlineCtx = new OfflineAudioContext(2, totalSamples, sampleRate);

    // 1. Master Compression & Limiter
    const compressor = offlineCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-12, 0);
    compressor.knee.setValueAtTime(4, 0);
    compressor.ratio.setValueAtTime(6.0, 0);
    compressor.attack.setValueAtTime(0.002, 0);
    compressor.release.setValueAtTime(0.15, 0);
    compressor.connect(offlineCtx.destination);

    // Warm Low Shelf EQ for Voice & Bass
    const bassEQ = offlineCtx.createBiquadFilter();
    bassEQ.type = 'lowshelf';
    bassEQ.frequency.setValueAtTime(140, 0);
    bassEQ.gain.setValueAtTime(3.8, 0);
    bassEQ.connect(compressor);

    // High Shelf for Crispness
    const highEQ = offlineCtx.createBiquadFilter();
    highEQ.type = 'highshelf';
    highEQ.frequency.setValueAtTime(8000, 0);
    highEQ.gain.setValueAtTime(2.5, 0);
    highEQ.connect(bassEQ);

    const voiceGain = offlineCtx.createGain();
    voiceGain.gain.setValueAtTime(1.0, 0);
    voiceGain.connect(highEQ);

    const musicGain = offlineCtx.createGain();
    musicGain.gain.setValueAtTime(0.11, 0); // calibrated background bed volume
    musicGain.connect(compressor);

    const sfxGain = offlineCtx.createGain();
    sfxGain.gain.setValueAtTime(0.42, 0);
    sfxGain.connect(compressor);

    // 2. Decode and Schedule Voiceover
    const voiceData = Uint8Array.from(atob(vB64), c => c.charCodeAt(0)).buffer;
    const voiceBuffer = await offlineCtx.decodeAudioData(voiceData);
    const voiceSource = offlineCtx.createBufferSource();
    voiceSource.buffer = voiceBuffer;
    voiceSource.connect(voiceGain);
    voiceSource.start(0.2); // slight 200ms lead-in

    // 3. Synthesize 128 BPM Dark Phonk / Synthwave Beat
    const stepTime = 60 / 128 / 4; // ~0.1171875s per 16th note
    const totalSteps = Math.floor(duration / stepTime);

    for (let step = 0; step < totalSteps; step++) {
      const t = step * stepTime;

      // Heavy 808 Kick on 1 and 3 (step % 8 == 0 or step % 16 == 6)
      if (step % 8 === 0 || step % 16 === 6 || (step > 32 && step % 16 === 10)) {
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.frequency.setValueAtTime(130, t);
        osc.frequency.exponentialRampToValueAtTime(35, t + 0.22);
        g.gain.setValueAtTime(0.36, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(g);
        g.connect(musicGain);
        osc.start(t);
        osc.stop(t + 0.22);
      }

      // Snappy Phonk Snare / Clap on 2 and 4 (step % 8 == 4)
      if (step % 8 === 4) {
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);
        g.gain.setValueAtTime(0.22, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(g);
        g.connect(musicGain);
        osc.start(t);
        osc.stop(t + 0.12);

        // Noise snap
        const noise = offlineCtx.createOscillator();
        const nG = offlineCtx.createGain();
        noise.type = 'sawtooth';
        noise.frequency.setValueAtTime(1400, t);
        nG.gain.setValueAtTime(0.06, t);
        nG.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        noise.connect(nG);
        nG.connect(musicGain);
        noise.start(t);
        noise.stop(t + 0.08);
      }

      // Rolling Trap/Phonk Hi-Hats
      const hat = offlineCtx.createOscillator();
      const hatG = offlineCtx.createGain();
      hat.type = 'square';
      hat.frequency.setValueAtTime((step % 4 === 2) ? 10000 : 7500, t);
      hatG.gain.setValueAtTime((step % 2 === 0) ? 0.024 : 0.014, t);
      hatG.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
      hat.connect(hatG);
      hatG.connect(musicGain);
      hat.start(t);
      hat.stop(t + 0.04);

      // Dark Reeses / Phonk Bassline
      if (step % 4 === 0) {
        const bass = offlineCtx.createOscillator();
        const bG = offlineCtx.createGain();
        const notes = [58.27, 65.41, 69.30, 82.41]; // Bb, C, Db, E
        const note = notes[Math.floor(step / 8) % notes.length];
        bass.type = 'sawtooth';
        bass.frequency.setValueAtTime(note, t);
        bG.gain.setValueAtTime(0.085, t);
        bG.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        bass.connect(bG);
        bG.connect(musicGain);
        bass.start(t);
        bass.stop(t + 0.22);
      }
    }

    // 4. Sound Effects at Key Scene Transitions
    function scheduleSfx(type, time) {
      if (type === 'laser_scan') {
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2200, time);
        osc.frequency.exponentialRampToValueAtTime(400, time + 0.35);
        g.gain.setValueAtTime(0.28, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(time);
        osc.stop(time + 0.35);
      } else if (type === 'iron_clank') {
        // Barbell iron plate sound
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, time);
        osc.frequency.exponentialRampToValueAtTime(110, time + 0.5);
        g.gain.setValueAtTime(0.4, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(time);
        osc.stop(time + 0.5);

        // Sub thud
        const sub = offlineCtx.createOscillator();
        const subG = offlineCtx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(95, time);
        sub.frequency.exponentialRampToValueAtTime(28, time + 0.4);
        subG.gain.setValueAtTime(0.5, time);
        subG.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
        sub.connect(subG);
        subG.connect(sfxGain);
        sub.start(time);
        sub.stop(time + 0.4);
      } else if (type === 'subdrop') {
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, time);
        osc.frequency.exponentialRampToValueAtTime(30, time + 0.75);
        g.gain.setValueAtTime(0.6, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.75);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(time);
        osc.stop(time + 0.75);
      } else if (type === 'tech_beep') {
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1480, time);
        g.gain.setValueAtTime(0.2, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(time);
        osc.stop(time + 0.12);
      }
    }

    // Cue SFX across scenes
    scheduleSfx('subdrop', 0.1);       // Hook start
    scheduleSfx('iron_clank', 6.8);    // 155 -> 180 lbs reveal
    scheduleSfx('laser_scan', 7.5);    // Biometric Scanner pass
    scheduleSfx('iron_clank', 14.2);   // The Golden Law drop
    scheduleSfx('tech_beep', 21.0);    // Push / Pull / Legs protocol
    scheduleSfx('laser_scan', 28.5);   // 3D Delts biometric card
    scheduleSfx('tech_beep', 36.2);    // Lean Bulk Matrix
    scheduleSfx('subdrop', 45.0);      // High threshold fibers
    scheduleSfx('subdrop', 53.5);      // Taskless Signature CTA Card Impact

    // Render AudioBuffer
    const renderedBuffer = await offlineCtx.startRendering();

    // Convert AudioBuffer to WAV Base64
    function audioBufferToWav(buffer) {
      const numChannels = buffer.numberOfChannels;
      const sampleRate = buffer.sampleRate;
      const format = 1; // PCM
      const bitDepth = 16;
      const bytesPerSample = bitDepth / 8;
      const blockAlign = numChannels * bytesPerSample;
      const numSamples = buffer.length;
      const dataSize = numSamples * blockAlign;
      const headerSize = 44;
      const totalSize = headerSize + dataSize;
      const arrayBuffer = new ArrayBuffer(totalSize);
      const view = new DataView(arrayBuffer);

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
      view.setUint16(20, format, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * blockAlign, true);
      view.setUint16(32, blockAlign, true);
      view.setUint16(34, bitDepth, true);
      writeString(36, 'data');
      view.setUint32(40, dataSize, true);

      let offset = 44;
      const ch0 = buffer.getChannelData(0);
      const ch1 = numChannels > 1 ? buffer.getChannelData(1) : ch0;
      for (let i = 0; i < numSamples; i++) {
        let s0 = Math.max(-1, Math.min(1, ch0[i]));
        view.setInt16(offset, s0 < 0 ? s0 * 0x8000 : s0 * 0x7FFF, true);
        offset += 2;
        if (numChannels > 1) {
          let s1 = Math.max(-1, Math.min(1, ch1[i]));
          view.setInt16(offset, s1 < 0 ? s1 * 0x8000 : s1 * 0x7FFF, true);
          offset += 2;
        }
      }

      let binary = '';
      const bytes = new Uint8Array(arrayBuffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i += 8192) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + 8192, len)));
      }
      return btoa(binary);
    }

    return audioBufferToWav(renderedBuffer);
  }, voiceoverB64);

  await browser.close();

  fs.writeFileSync(outWavPath, Buffer.from(wavBase64, 'base64'));
  const stat = fs.statSync(outWavPath);
  console.log(`✅ Master audio rendered successfully: ${outWavPath} (${(stat.size / (1024*1024)).toFixed(2)} MB)`);
})();
