// scripts/render_master_audio.js
// VantorX Master Audio Synthesizer: Voiceover + Engaging Background Music Bed + Cueva Tactile Foley SFX
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const voiceoverPath = path.resolve('website/demo/audio/reel-voiceover-master.mp3');
const outWavPath = path.resolve('website/demo/audio/reel-audio-full-master.wav');

(async () => {
  console.log('==============================================================================');
  console.log('   RENDERING CUEVA-GRADE MASTER AUDIO (VOICE + BEAT + TACTILE FOLEY SFX)     ');
  console.log('==============================================================================');

  if (!fs.existsSync(voiceoverPath)) {
    console.error('ERROR: Voiceover file not found at:', voiceoverPath);
    process.exit(1);
  }

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

    // 1. Master Output Bus with High-End Dynamics & EQ
    const masterCompressor = offlineCtx.createDynamicsCompressor();
    masterCompressor.threshold.setValueAtTime(-12, 0);
    masterCompressor.knee.setValueAtTime(6, 0);
    masterCompressor.ratio.setValueAtTime(4.0, 0);
    masterCompressor.attack.setValueAtTime(0.003, 0);
    masterCompressor.release.setValueAtTime(0.18, 0);
    masterCompressor.connect(offlineCtx.destination);

    // Voiceover Channel with Warm EQ
    const voiceEQ = offlineCtx.createBiquadFilter();
    voiceEQ.type = 'lowshelf';
    voiceEQ.frequency.setValueAtTime(140, 0);
    voiceEQ.gain.setValueAtTime(3.0, 0);

    const voiceClarity = offlineCtx.createBiquadFilter();
    voiceClarity.type = 'peaking';
    voiceClarity.frequency.setValueAtTime(3200, 0);
    voiceClarity.gain.setValueAtTime(2.5, 0);
    voiceClarity.Q.setValueAtTime(1.0, 0);

    const voiceGain = offlineCtx.createGain();
    voiceGain.gain.setValueAtTime(1.15, 0); // Dominant clean vocal presence

    voiceEQ.connect(voiceClarity);
    voiceClarity.connect(voiceGain);
    voiceGain.connect(masterCompressor);

    // Decode Voiceover Audio
    const voiceData = Uint8Array.from(atob(vB64), c => c.charCodeAt(0)).buffer;
    const voiceBuffer = await offlineCtx.decodeAudioData(voiceData);
    const voiceSource = offlineCtx.createBufferSource();
    voiceSource.buffer = voiceBuffer;
    voiceSource.connect(voiceEQ);
    voiceSource.start(0);

    // 2. Background Music Bed (Engaging Cyberpunk / Lo-Fi Driving Beat @ 124 BPM)
    const musicGain = offlineCtx.createGain();
    musicGain.gain.setValueAtTime(0.20, 0); // Calibrated background bed level (clearly audible & engaging)
    musicGain.connect(masterCompressor);

    const stepTime = 60 / 124 / 4; // ~0.12097s per 16th note
    const totalSteps = Math.floor(duration / stepTime);

    for (let step = 0; step < totalSteps; step++) {
      const t = step * stepTime;

      // Punchy Kick on 1 and 3 (with syncopation)
      if (step % 8 === 0 || step % 16 === 6 || step % 32 === 14) {
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.frequency.setValueAtTime(135, t);
        osc.frequency.exponentialRampToValueAtTime(38, t + 0.16);
        g.gain.setValueAtTime(0.42, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        osc.connect(g);
        g.connect(musicGain);
        osc.start(t);
        osc.stop(t + 0.16);
      }

      // Snappy Snare on 2 and 4 (beat 4, 12 of bar)
      if (step % 8 === 4) {
        // Body
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(230, t);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.11);
        g.gain.setValueAtTime(0.22, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
        osc.connect(g);
        g.connect(musicGain);
        osc.start(t);
        osc.stop(t + 0.11);

        // Noise crackle
        const noise = offlineCtx.createOscillator();
        const nG = offlineCtx.createGain();
        noise.type = 'square';
        noise.frequency.setValueAtTime(1200, t);
        nG.gain.setValueAtTime(0.06, t);
        nG.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
        noise.connect(nG);
        nG.connect(musicGain);
        noise.start(t);
        noise.stop(t + 0.14);
      }

      // 16th-Note Hi-Hats (driving rhythm)
      const hat = offlineCtx.createOscillator();
      const hatG = offlineCtx.createGain();
      hat.type = 'square';
      const isAccented = (step % 4 === 2);
      hat.frequency.setValueAtTime(isAccented ? 9800 : 7200, t);
      hatG.gain.setValueAtTime(isAccented ? 0.035 : 0.016, t);
      hatG.gain.exponentialRampToValueAtTime(0.0001, t + (isAccented ? 0.06 : 0.035));
      hat.connect(hatG);
      hatG.connect(musicGain);
      hat.start(t);
      hat.stop(t + 0.06);

      // Rolling Cyberpunk Sawtooth Bassline
      if (step % 2 === 0) {
        const bass = offlineCtx.createOscillator();
        const bG = offlineCtx.createGain();
        const notes = [55, 55, 65.4, 65.4, 73.4, 73.4, 49.0, 49.0]; // A - C - D - G progression
        const note = notes[Math.floor(step / 4) % notes.length];
        bass.type = 'sawtooth';
        bass.frequency.setValueAtTime(note, t);
        bG.gain.setValueAtTime(0.09, t);
        bG.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        bass.connect(bG);
        bG.connect(musicGain);
        bass.start(t);
        bass.stop(t + 0.18);
      }

      // Engaging Melodic Synth Plucks (keeps viewers involved)
      if (step % 8 === 2 || step % 16 === 10 || step % 32 === 26) {
        const synth = offlineCtx.createOscillator();
        const sG = offlineCtx.createGain();
        synth.type = 'triangle';
        const chordPitches = [440, 523.25, 659.25, 783.99, 880];
        const pitch = chordPitches[(step * 3) % chordPitches.length];
        synth.frequency.setValueAtTime(pitch, t);
        sG.gain.setValueAtTime(0.065, t);
        sG.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
        synth.connect(sG);
        sG.connect(musicGain);
        synth.start(t);
        synth.stop(t + 0.28);
      }
    }

    // 3. Tactile Foley Sound Effects Bus
    const sfxGain = offlineCtx.createGain();
    sfxGain.gain.setValueAtTime(0.60, 0); // Tactile punchy SFX level
    sfxGain.connect(masterCompressor);

    // Foley Generators
    function playLaserSweep(time) {
      const osc = offlineCtx.createOscillator();
      const g = offlineCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1800, time);
      osc.frequency.exponentialRampToValueAtTime(90, time + 0.45);
      g.gain.setValueAtTime(0.40, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.45);
      osc.connect(g);
      g.connect(sfxGain);
      osc.start(time);
      osc.stop(time + 0.45);
    }

    function playDigitalBlip(time, freq = 1400) {
      const osc = offlineCtx.createOscillator();
      const g = offlineCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, time + 0.08);
      g.gain.setValueAtTime(0.35, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
      osc.connect(g);
      g.connect(sfxGain);
      osc.start(time);
      osc.stop(time + 0.08);
    }

    function playSpaceWarp(time) {
      const osc = offlineCtx.createOscillator();
      const g = offlineCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, time);
      osc.frequency.exponentialRampToValueAtTime(450, time + 0.35);
      osc.frequency.exponentialRampToValueAtTime(60, time + 0.8);
      g.gain.setValueAtTime(0.45, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
      osc.connect(g);
      g.connect(sfxGain);
      osc.start(time);
      osc.stop(time + 0.8);
    }

    function playGlitchTick(time) {
      const osc = offlineCtx.createOscillator();
      const g = offlineCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, time);
      osc.frequency.setValueAtTime(200, time + 0.03);
      osc.frequency.setValueAtTime(1600, time + 0.06);
      g.gain.setValueAtTime(0.35, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
      osc.connect(g);
      g.connect(sfxGain);
      osc.start(time);
      osc.stop(time + 0.12);
    }

    function playPipeBurst(time) {
      // Deep water rumble & blast
      const osc = offlineCtx.createOscillator();
      const g = offlineCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, time);
      osc.frequency.exponentialRampToValueAtTime(35, time + 0.6);
      g.gain.setValueAtTime(0.55, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.6);
      osc.connect(g);
      g.connect(sfxGain);
      osc.start(time);
      osc.stop(time + 0.6);
    }

    function playHeavyHit(time) {
      const osc = offlineCtx.createOscillator();
      const g = offlineCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, time);
      osc.frequency.exponentialRampToValueAtTime(28, time + 0.5);
      g.gain.setValueAtTime(0.65, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
      osc.connect(g);
      g.connect(sfxGain);
      osc.start(time);
      osc.stop(time + 0.5);
    }

    function playLadderWrench(time) {
      // Metallic clang
      const osc1 = offlineCtx.createOscillator();
      const g1 = offlineCtx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1450, time);
      osc1.frequency.exponentialRampToValueAtTime(700, time + 0.18);
      g1.gain.setValueAtTime(0.35, time);
      g1.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
      osc1.connect(g1);
      g1.connect(sfxGain);
      osc1.start(time);
      osc1.stop(time + 0.18);

      // Low metallic body
      const osc2 = offlineCtx.createOscillator();
      const g2 = offlineCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(420, time);
      osc2.frequency.exponentialRampToValueAtTime(200, time + 0.22);
      g2.gain.setValueAtTime(0.30, time);
      g2.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
      osc2.connect(g2);
      g2.connect(sfxGain);
      osc2.start(time);
      osc2.stop(time + 0.22);
    }

    function playPhoneBuzz(time) {
      // Two quick motor pulses (bzz-bzz)
      [0, 0.14].forEach(offset => {
        const t = time + offset;
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, t);
        g.gain.setValueAtTime(0.30, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.09);
      });
    }

    function playTruckWhoosh(time) {
      // Engine rumble + whoosh
      const osc = offlineCtx.createOscillator();
      const g = offlineCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, time);
      osc.frequency.linearRampToValueAtTime(110, time + 0.4);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.9);
      g.gain.setValueAtTime(0.40, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.9);
      osc.connect(g);
      g.connect(sfxGain);
      osc.start(time);
      osc.stop(time + 0.9);
    }

    function playCashFlutter(time) {
      // Fast paper swishes
      [0, 0.07, 0.14, 0.21].forEach(offset => {
        const t = time + offset;
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1800 + offset * 400, t);
        g.gain.setValueAtTime(0.20, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.06);
      });
    }

    function playAvaChime(time) {
      // Beautiful 2-tone crystal major triad chime (E6 -> G#6 -> B6)
      const freqs = [1318.51, 1661.22, 1975.53];
      freqs.forEach((f, idx) => {
        const t = time + idx * 0.06;
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.38, t);
        g.gain.exponentialRampToValueAtTime(0.0005, t + 0.45);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.45);
      });
    }

    function playSmsDing(time) {
      const osc = offlineCtx.createOscillator();
      const g = offlineCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.50, time); // C6
      osc.frequency.setValueAtTime(1567.98, time + 0.08); // G6
      g.gain.setValueAtTime(0.42, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
      osc.connect(g);
      g.connect(sfxGain);
      osc.start(time);
      osc.stop(time + 0.4);
    }

    function playCashRegister(time) {
      // Metallic cash drawer opening spring + high bell ding
      const oscBell = offlineCtx.createOscillator();
      const gBell = offlineCtx.createGain();
      oscBell.type = 'sine';
      oscBell.frequency.setValueAtTime(2093.00, time); // C7 bell ding
      gBell.gain.setValueAtTime(0.45, time);
      gBell.gain.exponentialRampToValueAtTime(0.001, time + 0.55);
      oscBell.connect(gBell);
      gBell.connect(sfxGain);
      oscBell.start(time);
      oscBell.stop(time + 0.55);

      // Cha-ching ratchet click
      [0, 0.05, 0.09].forEach(off => {
        const t = time + off;
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(3200, t);
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.04);
      });
    }

    function playFinalCtaImpact(time) {
      // Cinematic riser sweep
      const osc = offlineCtx.createOscillator();
      const g = offlineCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, time - 1.2);
      osc.frequency.exponentialRampToValueAtTime(800, time);
      g.gain.setValueAtTime(0.05, time - 1.2);
      g.gain.linearRampToValueAtTime(0.45, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.6);
      osc.connect(g);
      g.connect(sfxGain);
      osc.start(time - 1.2);
      osc.stop(time + 0.6);

      // Heavy 808 sub impact
      const sub = offlineCtx.createOscillator();
      const subG = offlineCtx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(150, time);
      sub.frequency.exponentialRampToValueAtTime(32, time + 0.7);
      subG.gain.setValueAtTime(0.70, time);
      subG.gain.exponentialRampToValueAtTime(0.001, time + 0.7);
      sub.connect(subG);
      subG.connect(sfxGain);
      sub.start(time);
      sub.stop(time + 0.7);
    }

    // Schedule All Cueva Foley SFX Across the 63-Second Timeline
    playLaserSweep(0.05);         // 0:00 Laser crowd hook
    playDigitalBlip(3.2, 1600);   // 0:03.2 186,000 miles blip
    playSpaceWarp(7.2);           // 0:07.2 Deep space dive
    playGlitchTick(13.2);         // 0:13.2 Speed paradox glitch
    playPipeBurst(17.5);          // 0:17.5 Homeowner burst pipe
    playHeavyHit(22.0);           // 0:22.0 78% win rate rule
    playLadderWrench(26.5);       // 0:26.5 Bob on 20ft ladder & wrench
    playPhoneBuzz(28.2);          // 0:28.2 Violent phone vibration
    playPhoneBuzz(29.8);          // 0:29.8 Second urgent buzz
    playTruckWhoosh(31.2);        // 0:31.2 Competitor truck zoom past
    playCashFlutter(33.0);        // 0:33.0 $8,000 fluttering into truck bed
    playAvaChime(34.2);           // 0:34.2 Ava 0.8s crystal resolution
    playDigitalBlip(40.0, 1200);  // 0:40.0 32-band audio waveform pulse
    playSmsDing(44.2);            // 0:44.2 Tech SMS dispatch alert
    playCashRegister(49.5);       // 0:49.5 +$80k revenue waterfall
    playFinalCtaImpact(58.0);     // 0:58.0 Final CTA dialer blast

    console.log('Rendering full audio buffer...');
    const renderedBuffer = await offlineCtx.startRendering();

    // Convert AudioBuffer to 16-bit PCM WAV
    function audioBufferToWav(buffer) {
      const numChannels = buffer.numberOfChannels;
      const sampleRate = buffer.sampleRate;
      const format = 1;
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
  console.log(`✅ Cueva Master Audio WAV Rendered: ${outWavPath} (${(stat.size / (1024*1024)).toFixed(2)} MB)`);
})();
