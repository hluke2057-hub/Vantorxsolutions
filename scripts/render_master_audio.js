// scripts/render_master_audio.js
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const voiceoverPath = path.resolve('website/demo/audio/reel-voiceover-master.mp3');
const outWavPath = path.resolve('website/demo/audio/reel-audio-full-master.wav');

(async () => {
  console.log('Rendering 63s master audio with Voice + Synthwave Beat + SFX via OfflineAudioContext...');
  const voiceoverB64 = fs.readFileSync(voiceoverPath).toString('base64');

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const wavBase64 = await page.evaluate(async (vB64) => {
    const sampleRate = 44100;
    const duration = 63.0;
    const totalSamples = Math.ceil(sampleRate * duration);
    const offlineCtx = new OfflineAudioContext(2, totalSamples, sampleRate);

    // 1. Master Compression & EQ
    const compressor = offlineCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-14, 0);
    compressor.knee.setValueAtTime(6, 0);
    compressor.ratio.setValueAtTime(4.5, 0);
    compressor.attack.setValueAtTime(0.003, 0);
    compressor.release.setValueAtTime(0.18, 0);
    compressor.connect(offlineCtx.destination);

    const bassEQ = offlineCtx.createBiquadFilter();
    bassEQ.type = 'lowshelf';
    bassEQ.frequency.setValueAtTime(135, 0);
    bassEQ.gain.setValueAtTime(3.5, 0);
    bassEQ.connect(compressor);

    const musicGain = offlineCtx.createGain();
    musicGain.gain.setValueAtTime(0.09, 0); // calibrated background bed volume
    musicGain.connect(compressor);

    const sfxGain = offlineCtx.createGain();
    sfxGain.gain.setValueAtTime(0.35, 0);
    sfxGain.connect(compressor);

    // 2. Decode and Schedule Voiceover
    const voiceData = Uint8Array.from(atob(vB64), c => c.charCodeAt(0)).buffer;
    const voiceBuffer = await offlineCtx.decodeAudioData(voiceData);
    const voiceSource = offlineCtx.createBufferSource();
    voiceSource.buffer = voiceBuffer;
    voiceSource.connect(bassEQ);
    voiceSource.start(0);

    // 3. Synthesize 124 BPM Futuristic Synthwave Beat (63 seconds)
    // 124 BPM = 0.121s per 16th note
    const stepTime = 60 / 124 / 4; // ~0.120967s
    const totalSteps = Math.floor(duration / stepTime);

    for (let step = 0; step < totalSteps; step++) {
      const t = step * stepTime;

      // Kick on 1 and 3 (every 8 steps)
      if (step % 8 === 0 || step % 16 === 6) {
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.frequency.setValueAtTime(125, t);
        osc.frequency.exponentialRampToValueAtTime(38, t + 0.18);
        g.gain.setValueAtTime(0.32, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(g);
        g.connect(musicGain);
        osc.start(t);
        osc.stop(t + 0.18);
      }

      // Snare on 2 and 4 (beat 4, 12)
      if (step % 8 === 4) {
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, t);
        g.gain.setValueAtTime(0.16, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(g);
        g.connect(musicGain);
        osc.start(t);
        osc.stop(t + 0.12);
      }

      // Hi-Hats
      const hat = offlineCtx.createOscillator();
      const hatG = offlineCtx.createGain();
      hat.type = 'square';
      hat.frequency.setValueAtTime((step % 4 === 2) ? 9500 : 7000, t);
      hatG.gain.setValueAtTime((step % 2 === 0) ? 0.022 : 0.012, t);
      hatG.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
      hat.connect(hatG);
      hatG.connect(musicGain);
      hat.start(t);
      hat.stop(t + 0.045);

      // Bassline note
      if (step % 4 === 0) {
        const bass = offlineCtx.createOscillator();
        const bG = offlineCtx.createGain();
        const notes = [55, 65.4, 73.4, 82.4];
        const note = notes[Math.floor(step / 8) % notes.length];
        bass.type = 'sawtooth';
        bass.frequency.setValueAtTime(note, t);
        bG.gain.setValueAtTime(0.07, t);
        bG.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        bass.connect(bG);
        bG.connect(musicGain);
        bass.start(t);
        bass.stop(t + 0.22);
      }
    }

    // 4. Sound Effects at Key Scene Transitions
    function scheduleSfx(type, time) {
      if (type === 'ios_ping') {
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, time);
        osc.frequency.setValueAtTime(1318.51, time + 0.08);
        g.gain.setValueAtTime(0.35, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.45);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(time);
        osc.stop(time + 0.45);
      } else if (type === 'laser') {
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, time);
        osc.frequency.exponentialRampToValueAtTime(180, time + 0.4);
        g.gain.setValueAtTime(0.3, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(time);
        osc.stop(time + 0.4);
      } else if (type === 'subdrop') {
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, time);
        osc.frequency.exponentialRampToValueAtTime(32, time + 0.7);
        g.gain.setValueAtTime(0.55, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.7);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(time);
        osc.stop(time + 0.7);
      }
    }

    // Cue SFX
    scheduleSfx('ios_ping', 0.8);   // Scene 1: Bedside iPhone Notification
    scheduleSfx('laser', 7.5);      // Scene 2: Uranus Laser Hook
    scheduleSfx('subdrop', 19.5);   // Scene 4: 78% Stat Card
    scheduleSfx('subdrop', 25.5);   // Scene 5: Two Shops Comparison
    scheduleSfx('ios_ping', 39.5);  // Scene 7: 5-Node Workflow
    scheduleSfx('ios_ping', 46.5);  // Scene 8: Tech Mobile Dispatch
    scheduleSfx('subdrop', 58.5);   // Scene 10: Signature CTA Impact

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

      // Convert to binary string -> base64
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
