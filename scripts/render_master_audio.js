// scripts/render_master_audio.js
// VantorX Master Audio Synthesizer (89.0s Extended Hook + Bob & Sarah Story + Unmistakable Background Music + Cueva Foley SFX)
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const dryVoiceoverPath = path.resolve(__dirname, '../website/demo/audio/reel-voiceover-dry.mp3');
const outWavPath = path.resolve(__dirname, '../website/demo/audio/reel-audio-full-master.wav');
const outMasterMp3Path = path.resolve(__dirname, '../website/demo/audio/reel-voiceover-master.mp3');

(async () => {
  console.log('==============================================================================');
  console.log('   RENDERING 89.0s EXTENDED STORY MASTER AUDIO (VOICE + MUSIC + FOLEY SFX)    ');
  console.log('==============================================================================');

  if (!fs.existsSync(dryVoiceoverPath)) {
    console.error('ERROR: Dry voiceover file not found at:', dryVoiceoverPath);
    process.exit(1);
  }

  const voiceoverB64 = fs.readFileSync(dryVoiceoverPath).toString('base64');

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const wavBase64 = await page.evaluate(async (vB64) => {
    const sampleRate = 44100;
    const duration = 89.0;
    const totalSamples = Math.ceil(sampleRate * duration);
    const offlineCtx = new OfflineAudioContext(2, totalSamples, sampleRate);

    // Master Limiter / Glue Bus (Gentle ratio so voice never crushes background music)
    const masterLimiter = offlineCtx.createDynamicsCompressor();
    masterLimiter.threshold.setValueAtTime(-6, 0);
    masterLimiter.knee.setValueAtTime(4, 0);
    masterLimiter.ratio.setValueAtTime(3.0, 0);
    masterLimiter.attack.setValueAtTime(0.005, 0);
    masterLimiter.release.setValueAtTime(0.15, 0);
    masterLimiter.connect(offlineCtx.destination);

    // -------------------------------------------------------------------------
    // 1. VOICEOVER CHANNEL (Clear, crisp, authoritative)
    // -------------------------------------------------------------------------
    const voiceEQ = offlineCtx.createBiquadFilter();
    voiceEQ.type = 'highpass';
    voiceEQ.frequency.setValueAtTime(85, 0); // Free up low-end for music bass & kick

    const voicePresence = offlineCtx.createBiquadFilter();
    voicePresence.type = 'peaking';
    voicePresence.frequency.setValueAtTime(3200, 0);
    voicePresence.gain.setValueAtTime(2.5, 0);
    voicePresence.Q.setValueAtTime(1.0, 0);

    const voiceGain = offlineCtx.createGain();
    voiceGain.gain.setValueAtTime(0.92, 0);

    voiceEQ.connect(voicePresence);
    voicePresence.connect(voiceGain);
    voiceGain.connect(masterLimiter);

    const voiceData = Uint8Array.from(atob(vB64), c => c.charCodeAt(0)).buffer;
    const voiceBuffer = await offlineCtx.decodeAudioData(voiceData);
    const voiceSource = offlineCtx.createBufferSource();
    voiceSource.buffer = voiceBuffer;
    voiceSource.connect(voiceEQ);
    voiceSource.start(0);

    // -------------------------------------------------------------------------
    // 2. UNMISTAKABLE BACKGROUND MUSIC BED (Warm Synthwave Pad + Plucks + Beat)
    // Audible on laptop speakers, phone speakers, and headphones from 0.0s!
    // -------------------------------------------------------------------------
    const musicBus = offlineCtx.createGain();
    musicBus.gain.setValueAtTime(0.48, 0); // Strong, unmistakable musical presence
    musicBus.connect(masterLimiter);

    const bpm = 120; // 0.5s per beat, 2.0s per bar
    const stepTime = 60 / bpm / 4; // 0.125s per 16th note
    const totalSteps = Math.floor(duration / stepTime);

    // Chord progression every 2 seconds (1 bar = 16 steps):
    // Bar 0: A minor 9 (A3=220, C4=261.63, E4=329.63, G4=392.00, B4=493.88)
    // Bar 1: F major 7 (F3=174.61, A3=220.00, C4=261.63, E4=329.63, G4=392.00)
    // Bar 2: C major 9 (C3=130.81, G3=196.00, B3=246.94, D4=293.66, E4=329.63)
    // Bar 3: G6sus4    (G3=196.00, B3=246.94, D4=293.66, E4=329.63, A4=440.00)
    const chords = [
      { root: 110.00, sub: 55.00, notes: [220.00, 261.63, 329.63, 392.00, 493.88] },
      { root: 87.31,  sub: 43.65, notes: [174.61, 220.00, 261.63, 329.63, 392.00] },
      { root: 130.81, sub: 65.41, notes: [196.00, 246.94, 293.66, 329.63, 392.00] },
      { root: 98.00,  sub: 49.00, notes: [196.00, 246.94, 293.66, 329.63, 440.00] }
    ];

    // Warm Stereo Pad Layer (every bar = 2.0s)
    const barDuration = stepTime * 16; // 2.0s
    const totalBars = Math.ceil(duration / barDuration);
    for (let bar = 0; bar < totalBars; bar++) {
      const barStart = bar * barDuration;
      if (barStart >= duration) break;
      const chord = chords[bar % chords.length];

      // Lush detuned warm pad in 200Hz-500Hz range (heard clearly on all speakers)
      chord.notes.slice(0, 4).forEach((freq, idx) => {
        const osc = offlineCtx.createOscillator();
        const filter = offlineCtx.createBiquadFilter();
        const pan = offlineCtx.createStereoPanner();
        const g = offlineCtx.createGain();

        osc.type = (idx % 2 === 0) ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, barStart);
        osc.detune.setValueAtTime((idx - 1.5) * 8, barStart); // Warm chorus detune

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1100, barStart);

        pan.pan.setValueAtTime((idx - 1.5) * 0.35, barStart);

        g.gain.setValueAtTime(0.001, barStart);
        g.gain.linearRampToValueAtTime(0.055, barStart + 0.25);
        g.gain.setValueAtTime(0.050, barStart + barDuration - 0.25);
        g.gain.linearRampToValueAtTime(0.001, Math.min(duration, barStart + barDuration));

        osc.connect(filter);
        filter.connect(pan);
        pan.connect(g);
        g.connect(musicBus);

        osc.start(barStart);
        osc.stop(Math.min(duration, barStart + barDuration));
      });
    }

    // Step Sequencer: Arpeggiated Synth Plucks + Driving Bass + Crisp Drums
    for (let step = 0; step < totalSteps; step++) {
      const t = step * stepTime;
      if (t >= duration - 0.05) break;
      const barIdx = Math.floor(step / 16);
      const stepInBar = step % 16;
      const chord = chords[barIdx % chords.length];

      // A. Hypnotic Synthwave Arpeggio Pluck on every 8th/16th note (Storytelling pulse!)
      const arpPattern = [0, 1, 2, 3, 4, 3, 2, 1, 0, 2, 4, 3, 1, 2, 3, 4];
      const noteFreq = chord.notes[arpPattern[stepInBar]];
      const isStrongStep = (stepInBar % 2 === 0);

      const pluck = offlineCtx.createOscillator();
      const pluckFilter = offlineCtx.createBiquadFilter();
      const pluckGain = offlineCtx.createGain();
      const pluckPan = offlineCtx.createStereoPanner();

      pluck.type = 'triangle';
      pluck.frequency.setValueAtTime(noteFreq * (stepInBar % 4 === 0 ? 2 : 1), t);

      pluckFilter.type = 'lowpass';
      pluckFilter.frequency.setValueAtTime(2400, t);
      pluckFilter.frequency.exponentialRampToValueAtTime(600, t + 0.11);

      pluckPan.pan.setValueAtTime(Math.sin(step * 0.7) * 0.4, t);

      const pluckVol = isStrongStep ? 0.11 : 0.065;
      pluckGain.gain.setValueAtTime(pluckVol, t);
      pluckGain.gain.exponentialRampToValueAtTime(0.001, t + 0.115);

      pluck.connect(pluckFilter);
      pluckFilter.connect(pluckPan);
      pluckPan.connect(pluckGain);
      pluckGain.connect(musicBus);
      pluck.start(t);
      pluck.stop(t + 0.12);

      // B. Warm Mid-Bass + Sub-Bass Pulse (110Hz + 220Hz harmonics so phones hear the bass!)
      if (stepInBar % 2 === 0) {
        const bass = offlineCtx.createOscillator();
        const bassFilter = offlineCtx.createBiquadFilter();
        const bassG = offlineCtx.createGain();

        bass.type = 'sawtooth';
        bass.frequency.setValueAtTime(chord.root, t); // 87Hz - 130Hz

        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(520, t); // Keep 2nd & 3rd harmonics audible on small speakers!
        bassFilter.Q.setValueAtTime(2.5, t);

        bassG.gain.setValueAtTime((stepInBar % 4 === 0) ? 0.15 : 0.10, t);
        bassG.gain.exponentialRampToValueAtTime(0.005, t + 0.22);

        bass.connect(bassFilter);
        bassFilter.connect(bassG);
        bassG.connect(musicBus);
        bass.start(t);
        bass.stop(t + 0.23);
      }

      // C. Punchy Kick Drum (Beats 0, 6, 8, 14)
      if (stepInBar === 0 || stepInBar === 6 || stepInBar === 8 || (barIdx % 2 === 1 && stepInBar === 14)) {
        const kick = offlineCtx.createOscillator();
        const kickG = offlineCtx.createGain();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(160, t);
        kick.frequency.exponentialRampToValueAtTime(46, t + 0.15);
        kickG.gain.setValueAtTime(0.32, t);
        kickG.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        kick.connect(kickG);
        kickG.connect(musicBus);
        kick.start(t);
        kick.stop(t + 0.16);
      }

      // D. Crisp Rim/Snare on Backbeat (Steps 4 and 12)
      if (stepInBar === 4 || stepInBar === 12) {
        const snareBody = offlineCtx.createOscillator();
        const snareG = offlineCtx.createGain();
        snareBody.type = 'triangle';
        snareBody.frequency.setValueAtTime(260, t);
        snareBody.frequency.exponentialRampToValueAtTime(130, t + 0.10);
        snareG.gain.setValueAtTime(0.18, t);
        snareG.gain.exponentialRampToValueAtTime(0.001, t + 0.10);
        snareBody.connect(snareG);
        snareG.connect(musicBus);
        snareBody.start(t);
        snareBody.stop(t + 0.10);

        // High snap
        const snap = offlineCtx.createOscillator();
        const snapG = offlineCtx.createGain();
        snap.type = 'square';
        snap.frequency.setValueAtTime(1450, t);
        snap.frequency.exponentialRampToValueAtTime(420, t + 0.045);
        snapG.gain.setValueAtTime(0.08, t);
        snapG.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        snap.connect(snapG);
        snapG.connect(musicBus);
        snap.start(t);
        snap.stop(t + 0.05);
      }

      // E. Crisp Hi-Hat Groove
      const hat = offlineCtx.createOscillator();
      const hatFilter = offlineCtx.createBiquadFilter();
      const hatG = offlineCtx.createGain();
      hat.type = 'square';
      const openHat = (stepInBar % 4 === 2);
      hat.frequency.setValueAtTime(openHat ? 8400 : 6800, t);
      hatFilter.type = 'highpass';
      hatFilter.frequency.setValueAtTime(5000, t);
      hatG.gain.setValueAtTime(openHat ? 0.045 : 0.022, t);
      hatG.gain.exponentialRampToValueAtTime(0.0005, t + (openHat ? 0.07 : 0.035));
      hat.connect(hatFilter);
      hatFilter.connect(hatG);
      hatG.connect(musicBus);
      hat.start(t);
      hat.stop(t + 0.075);
    }

    // -------------------------------------------------------------------------
    // 3. TACTILE CUEVA FOLEY SOUND EFFECTS BUS (Synced to 89.0s Story Milestones!)
    // -------------------------------------------------------------------------
    const sfxGain = offlineCtx.createGain();
    sfxGain.gain.setValueAtTime(0.65, 0);
    sfxGain.connect(masterLimiter);

    function playLaserSweep(time) {
      const osc = offlineCtx.createOscillator();
      const g = offlineCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1900, time);
      osc.frequency.exponentialRampToValueAtTime(110, time + 0.45);
      g.gain.setValueAtTime(0.38, time);
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
      osc.frequency.exponentialRampToValueAtTime(freq * 1.45, time + 0.09);
      g.gain.setValueAtTime(0.36, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.09);
      osc.connect(g);
      g.connect(sfxGain);
      osc.start(time);
      osc.stop(time + 0.09);
    }

    function playSpaceWarp(time) {
      const osc = offlineCtx.createOscillator();
      const g = offlineCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, time);
      osc.frequency.exponentialRampToValueAtTime(480, time + 0.35);
      osc.frequency.exponentialRampToValueAtTime(65, time + 0.8);
      g.gain.setValueAtTime(0.42, time);
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
      osc.frequency.setValueAtTime(850, time);
      osc.frequency.setValueAtTime(240, time + 0.03);
      osc.frequency.setValueAtTime(1650, time + 0.06);
      g.gain.setValueAtTime(0.32, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
      osc.connect(g);
      g.connect(sfxGain);
      osc.start(time);
      osc.stop(time + 0.12);
    }

    function playLadderWrench(time) {
      const osc1 = offlineCtx.createOscillator();
      const g1 = offlineCtx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1500, time);
      osc1.frequency.exponentialRampToValueAtTime(680, time + 0.18);
      g1.gain.setValueAtTime(0.38, time);
      g1.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
      osc1.connect(g1);
      g1.connect(sfxGain);
      osc1.start(time);
      osc1.stop(time + 0.18);
    }

    function playPipeBurst(time) {
      const osc = offlineCtx.createOscillator();
      const g = offlineCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, time);
      osc.frequency.exponentialRampToValueAtTime(38, time + 0.55);
      g.gain.setValueAtTime(0.50, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.55);
      osc.connect(g);
      g.connect(sfxGain);
      osc.start(time);
      osc.stop(time + 0.55);
    }

    function playPhoneBuzz(time) {
      [0, 0.15].forEach(offset => {
        const t = time + offset;
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(165, t);
        g.gain.setValueAtTime(0.34, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.10);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.10);
      });
    }

    function playHeavyHit(time) {
      const osc = offlineCtx.createOscillator();
      const g = offlineCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(190, time);
      osc.frequency.exponentialRampToValueAtTime(32, time + 0.48);
      g.gain.setValueAtTime(0.58, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.48);
      osc.connect(g);
      g.connect(sfxGain);
      osc.start(time);
      osc.stop(time + 0.48);
    }

    function playTruckWhoosh(time) {
      const osc = offlineCtx.createOscillator();
      const g = offlineCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(70, time);
      osc.frequency.linearRampToValueAtTime(125, time + 0.35);
      osc.frequency.exponentialRampToValueAtTime(42, time + 0.85);
      g.gain.setValueAtTime(0.38, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.85);
      osc.connect(g);
      g.connect(sfxGain);
      osc.start(time);
      osc.stop(time + 0.85);
    }

    function playAvaChime(time) {
      const freqs = [1318.51, 1661.22, 1975.53];
      freqs.forEach((f, idx) => {
        const t = time + idx * 0.06;
        const osc = offlineCtx.createOscillator();
        const g = offlineCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.40, t);
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
      osc.frequency.setValueAtTime(1046.50, time);
      osc.frequency.setValueAtTime(1567.98, time + 0.08);
      g.gain.setValueAtTime(0.42, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.40);
      osc.connect(g);
      g.connect(sfxGain);
      osc.start(time);
      osc.stop(time + 0.40);
    }

    function playCashRegister(time) {
      const oscBell = offlineCtx.createOscillator();
      const gBell = offlineCtx.createGain();
      oscBell.type = 'sine';
      oscBell.frequency.setValueAtTime(2093.00, time);
      gBell.gain.setValueAtTime(0.45, time);
      gBell.gain.exponentialRampToValueAtTime(0.001, time + 0.55);
      oscBell.connect(gBell);
      gBell.connect(sfxGain);
      oscBell.start(time);
      oscBell.stop(time + 0.55);
    }

    // Schedule Cueva Foley SFX to Exact 89.0s Story Timestamps:
    playLaserSweep(0.08);         // 0:00 Laser fired into night sky
    playDigitalBlip(5.40, 1500);  // 0:05.4 "186,000 miles per second"
    playDigitalBlip(9.05, 1200);  // 0:09.0 "Moon"
    playDigitalBlip(11.85, 1350); // 0:11.8 "Mars"
    playDigitalBlip(14.45, 1500); // 0:14.4 "Jupiter"
    playSpaceWarp(19.80);         // 0:19.8 "rings of Uranus"
    playGlitchTick(24.10);        // 0:24.1 "STILL faster than the average contractor"
    playLadderWrench(28.90);      // 0:28.9 "Meet Bob... twenty feet up a ladder"
    playLadderWrench(35.20);      // 0:35.2 "wrench in his hand"
    playPipeBurst(37.40);         // 0:37.4 "pipe bursts in Sarah's ceiling"
    playPhoneBuzz(44.60);         // 0:44.6 "Bob's phone buzzes in his pocket, once"
    playPhoneBuzz(45.80);         // 0:45.8 "twice"
    playPhoneBuzz(46.70);         // 0:46.7 "three times"
    playHeavyHit(51.65);          // 0:51.6 "78% of homeowners"
    playTruckWhoosh(59.80);       // 0:59.8 "rolls a truck"
    playCashRegister(61.90);      // 1:01.9 "collects an $8,000 check"
    playAvaChime(66.15);          // 1:06.1 "That is why we built Ava"
    playDigitalBlip(68.15, 1600); // 1:08.1 "0.8 seconds"
    playSmsDing(73.10);           // 1:13.1 "texts the dispatch straight to Bob's phone"
    playCashRegister(78.85);      // 1:18.8 "Stop handing $8,000 checks"
    playAvaChime(81.10);          // 1:21.1 "Call the live demo number"

    const renderedBuffer = await offlineCtx.startRendering();

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
  const wavStat = fs.statSync(outWavPath);
  console.log(`✅ Master WAV Rendered: ${outWavPath} (${(wavStat.size / (1024*1024)).toFixed(2)} MB)`);

  // Also encode Master MP3 (with Music + SFX + Voiceover baked in!)
  execFileSync(ffmpegPath, [
    '-y',
    '-i', outWavPath,
    '-codec:a', 'libmp3lame',
    '-b:a', '192k',
    outMasterMp3Path
  ]);
  const mp3Stat = fs.statSync(outMasterMp3Path);
  console.log(`✅ Master MP3 Rendered (Voice + Music + SFX): ${outMasterMp3Path} (${(mp3Stat.size / 1024).toFixed(1)} KB)`);
})();
