// scripts/create_perfect_continuous_reel_audio.js
// Synthesizes continuous, unbroken voiceover across 28.0s + dynamic ducked 130BPM tech bed + SFX
// Generates word/phrase subtitle metadata for on-screen continuous readout.

const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const tts = new MsEdgeTTS();

const outWav = path.join(root, 'website/demo/audio/vantorx-speed-master.wav');
const outMp3 = path.join(root, 'website/demo/audio/vantorx-speed-master.mp3');
const tempBed = path.join(root, 'website/demo/audio/temp_music_bed_28.wav');
const tempVoiceMixed = path.join(root, 'website/demo/audio/temp_voice_mixed_28.wav');

const SAMPLE_RATE = 44100;
const DURATION = 28.0;
const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * DURATION);

const scenes = [
  {
    id: 's1',
    start: 0.15,
    targetDur: 3.8,
    rate: '+15%',
    text: 'Speed to lead is everything. Most customers hire whoever answers first.',
    caption: 'SPEED TO LEAD IS EVERYTHING. MOST CUSTOMERS HIRE WHOEVER ANSWERS FIRST.'
  },
  {
    id: 's2',
    start: 4.1,
    targetDur: 3.8,
    rate: '+15%',
    text: 'When your phone hits voicemail, that caller hangs up and calls your competitor.',
    caption: 'WHEN YOU HIT VOICEMAIL, THAT CALLER HANGS UP AND CALLS YOUR COMPETITOR.'
  },
  {
    id: 's3',
    start: 8.1,
    targetDur: 3.9,
    rate: '+15%',
    text: 'VantorX answers in zero-point-two seconds, picking up before the second ring.',
    caption: 'VANTORX ANSWERS IN 0.2 SECONDS, PICKING UP BEFORE THE SECOND RING.'
  },
  {
    id: 's4a',
    start: 12.2,
    targetDur: 3.6,
    rate: '+15%',
    text: 'Our AI receptionist qualifies the customer and captures every job detail live.',
    caption: 'OUR AI RECEPTIONIST QUALIFIES THE CUSTOMER AND CAPTURES EVERY DETAIL LIVE.'
  },
  {
    id: 's4b',
    start: 16.0,
    targetDur: 3.7,
    rate: '+15%',
    text: 'It syncs your calendar, locks the slot, and texts the dispatch alert to your phone.',
    caption: 'IT SYNCS YOUR CALENDAR, LOCKS THE SLOT, AND TEXTS THE DISPATCH ALERT.'
  },
  {
    id: 's5',
    start: 19.9,
    targetDur: 3.9,
    rate: '+12%',
    text: 'While you focus on the job, VantorX stacks your schedule with confirmed revenue.',
    caption: 'WHILE YOU FOCUS ON THE JOB, VANTORX STACKS YOUR SCHEDULE WITH REVENUE.'
  },
  {
    id: 's6',
    start: 24.0,
    targetDur: 3.6,
    rate: '+10%',
    text: 'Out-answer your competition today. Visit vantorxsolutions.com.',
    caption: 'OUT-ANSWER YOUR COMPETITION TODAY. VISIT VANTORXSOLUTIONS.COM'
  }
];

async function main() {
  console.log('=== CREATING CONTINUOUS 28.0S AUDIO MASTER ===');
  await tts.setMetadata('en-US-ChristopherNeural', OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

  const ttsDir = path.join(root, 'website/demo/audio/final_continuous_clips');
  if (!fs.existsSync(ttsDir)) fs.mkdirSync(ttsDir, { recursive: true });

  const filterInputs = [];
  const filterParts = [];
  let inputIdx = 0;

  for (const sc of scenes) {
    const scDir = path.join(ttsDir, sc.id);
    if (!fs.existsSync(scDir)) fs.mkdirSync(scDir, { recursive: true });
    
    await tts.toFile(scDir, sc.text, { rate: sc.rate });
    const rawMp3 = path.join(scDir, 'audio.mp3');
    const fittedWav = path.join(scDir, 'fitted.wav');

    // Probe duration
    let probe = spawnSync(ffmpeg, ['-i', rawMp3]);
    let match = probe.stderr.toString().match(/Duration: ([0-9:.]+)/);
    let p = match[1].split(':');
    let rawDur = parseFloat(p[0]) * 3600 + parseFloat(p[1]) * 60 + parseFloat(p[2]);

    if (rawDur > sc.targetDur) {
      const atempo = (rawDur / sc.targetDur).toFixed(3);
      console.log(`[${sc.id}] Fitting: ${rawDur.toFixed(2)}s -> ${sc.targetDur}s (atempo=${atempo})`);
      spawnSync(ffmpeg, ['-i', rawMp3, '-filter:a', `atempo=${atempo}`, '-y', fittedWav]);
      sc.actualDur = sc.targetDur;
    } else {
      spawnSync(ffmpeg, ['-i', rawMp3, '-y', fittedWav]);
      sc.actualDur = rawDur;
    }

    sc.end = sc.start + sc.actualDur;
    console.log(`✓ [${sc.id}] [${sc.start.toFixed(2)}s -> ${sc.end.toFixed(2)}s] "${sc.text}"`);

    // Prepare filter_complex delay
    filterInputs.push('-i', fittedWav);
    const delayMs = Math.round(sc.start * 1000);
    filterParts.push(`[${inputIdx}:a]adelay=${delayMs}|${delayMs},volume=1.3[v${inputIdx}]`);
    inputIdx++;
  }

  // Combine voiceover clips with exact timing
  const mixLabel = filterParts.map((_, idx) => `[v${idx}]`).join('');
  const filterComplex = `${filterParts.join(';')};${mixLabel}amix=inputs=${scenes.length}:dropout_transition=0,volume=1.2[allVoice]`;

  console.log('Assembling continuous voiceover track...');
  const voiceMixCmd = [
    ...filterInputs,
    '-filter_complex', filterComplex,
    '-map', '[allVoice]',
    '-t', '28.0',
    '-y',
    tempVoiceMixed
  ];

  const vmRes = spawnSync(ffmpeg, voiceMixCmd);
  if (vmRes.status !== 0) {
    console.error('Voice mix error:', vmRes.stderr.toString());
    process.exit(1);
  }

  // Synthesize 130 BPM Driving Tech Electronic Music Bed & Foley SFX
  console.log('Synthesizing 130 BPM Cyber Tech Bed & Foley SFX...');
  const left = new Float32Array(TOTAL_SAMPLES);
  const right = new Float32Array(TOTAL_SAMPLES);

  const BEAT = 60 / 130; // ~0.4615s
  const SIXTEENTH = BEAT / 4;
  const freqs = [146.83, 174.61, 196.00, 220.00, 261.63, 293.66, 349.23, 392.00, 440.00, 523.25];

  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;

    // Master Envelope
    let masterGain = 0.20;
    if (t < 0.3) masterGain *= (t / 0.3);
    if (t > 27.2) masterGain *= Math.max(0, (28.0 - t) / 0.8);

    // Punchy Kick Drum
    const beatTime = t % BEAT;
    let kick = 0;
    if (beatTime < 0.16 && t < 25.0) {
      const kickFreq = 160 * Math.exp(-beatTime * 38) + 45;
      const kickEnv = Math.exp(-beatTime * 28);
      kick = Math.sin(2 * Math.PI * kickFreq * beatTime) * kickEnv * 0.35;
    }

    // Hi-Hat
    const subBeat = t % SIXTEENTH;
    let hihat = 0;
    if (t >= 1.0 && t < 25.0) {
      const hhEnv = Math.exp(-subBeat * 65);
      const accent = (Math.floor(t / SIXTEENTH) % 4 === 2) ? 1.3 : 0.75;
      hihat = (Math.random() * 2 - 1) * hhEnv * 0.07 * accent;
    }

    // Arpeggiator
    const step = Math.floor(t / SIXTEENTH);
    const noteIdx = (step * 3) % freqs.length;
    const noteTime = t % SIXTEENTH;
    const noteFreq = freqs[noteIdx];
    const arpEnv = Math.exp(-noteTime * 16);
    const synth = (Math.sin(2 * Math.PI * noteFreq * t) + 0.35 * Math.sin(4 * Math.PI * noteFreq * t)) * arpEnv * 0.11;

    // Sub-Bass
    const bassFreq = (t < 8.0) ? 58.27 : (t < 16.0) ? 65.41 : (t < 22.0) ? 73.42 : 58.27;
    const bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.16;

    let music = (kick + hihat + synth + bass) * masterGain;

    // Smart vocal ducking: since voice is now active almost continuously, duck gently (-3.5dB)
    let isSpeaking = false;
    for (const sc of scenes) {
      if (t >= sc.start && t <= sc.end) {
        isSpeaking = true;
        break;
      }
    }
    if (isSpeaking) {
      music *= 0.62;
    }

    left[i] = music;
    right[i] = music;
  }

  // SFX Helper
  function addSFX(startTime, duration, genFn) {
    const startSample = Math.floor(startTime * SAMPLE_RATE);
    const totalS = Math.floor(duration * SAMPLE_RATE);
    for (let s = 0; s < totalS; s++) {
      const idx = startSample + s;
      if (idx >= TOTAL_SAMPLES) break;
      const st = s / SAMPLE_RATE;
      const [lVal, rVal] = genFn(st, duration);
      left[idx] += lVal;
      right[idx] += rVal;
    }
  }

  // SFX: Scene 1 Ticking Alerts
  [0.2, 0.8, 1.4, 2.0].forEach((alarmT, idx) => {
    addSFX(alarmT, 0.15, (t) => {
      const env = Math.exp(-t * 22);
      const beep = Math.sin(2 * Math.PI * (1150 + idx * 70) * t) * env * 0.16;
      return [beep, beep];
    });
  });

  // SFX: Scene 2 Voicemail Tone & Drop
  addSFX(5.0, 0.35, (t) => {
    const env = Math.exp(-t * 12);
    const tone = Math.sin(2 * Math.PI * 480 * t) * env * 0.18;
    return [tone, tone];
  });
  addSFX(6.2, 0.35, (t, dur) => {
    const env = 1 - (t / dur);
    const drop = Math.sin(2 * Math.PI * (500 - t * 400) * t) * env * 0.2;
    return [drop, drop];
  });

  // SFX: Scene 3 0.2s Sonic Answer & Chime
  addSFX(8.1, 0.6, (t, dur) => {
    const env = Math.sin((t / dur) * Math.PI);
    const boom = Math.sin(2 * Math.PI * (80 + Math.pow(t * 8, 2) * 50) * t) * env * 0.28;
    return [boom, boom];
  });
  addSFX(8.8, 0.5, (t) => {
    const env = Math.exp(-t * 8);
    const chime = (Math.sin(2 * Math.PI * 1318.51 * t) + Math.sin(2 * Math.PI * 1760.00 * t)) * env * 0.22;
    return [chime, chime];
  });

  // SFX: Scene 4 Calendar Lock & SMS Ding
  addSFX(16.2, 0.35, (t) => {
    const env = Math.exp(-t * 18);
    const lock = Math.sin(2 * Math.PI * 1567.98 * t) * env * 0.2;
    return [lock, lock];
  });
  addSFX(17.8, 0.45, (t) => {
    const env = Math.exp(-t * 10);
    const ping = (Math.sin(2 * Math.PI * 1046.50 * t) * 0.18 + Math.sin(2 * Math.PI * 2093.00 * t) * 0.14) * env;
    return [ping, ping];
  });

  // SFX: Scene 5 Upward Trajectory
  addSFX(20.0, 1.8, (t, dur) => {
    const env = Math.sin((t / dur) * Math.PI);
    const rise = Math.sin(2 * Math.PI * (350 + t * 800) * t) * env * 0.16;
    return [rise, rise];
  });

  // SFX: Scene 6 Brand Finale Boom
  addSFX(24.0, 2.5, (t) => {
    const env = Math.exp(-t * 2.0);
    const boom = Math.sin(2 * Math.PI * (80 * Math.exp(-t * 3.2)) * t) * env * 0.38;
    return [boom, boom];
  });

  // Write temp WAV for music bed
  const buffer = Buffer.alloc(44 + TOTAL_SAMPLES * 4);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + TOTAL_SAMPLES * 4, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(2, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 4, 28);
  buffer.writeUInt16LE(4, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(TOTAL_SAMPLES * 4, 40);

  let offset = 44;
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    const sL = Math.max(-1, Math.min(1, left[i]));
    const sR = Math.max(-1, Math.min(1, right[i]));
    buffer.writeInt16LE(Math.floor(sL * 32767), offset);
    buffer.writeInt16LE(Math.floor(sR * 32767), offset + 2);
    offset += 4;
  }
  fs.writeFileSync(tempBed, buffer);

  // Mix Music Bed + Continuous Voiceover into Master WAV & MP3
  console.log('Final Master Mix: Music Bed + Continuous Voiceover...');
  const finalMixCmd = [
    '-i', tempBed,
    '-i', tempVoiceMixed,
    '-filter_complex', '[0:a][1:a]amix=inputs=2:duration=first:dropout_transition=0,loudnorm=I=-14:TP=-1.5:LRA=7[masterAudio]',
    '-map', '[masterAudio]',
    '-t', '28.0',
    '-y',
    outWav
  ];

  const fRes = spawnSync(ffmpeg, finalMixCmd);
  if (fRes.status !== 0) {
    console.error('Final mix error:', fRes.stderr.toString());
    process.exit(1);
  }

  spawnSync(ffmpeg, ['-i', outWav, '-b:a', '192k', '-y', outMp3]);

  try { fs.unlinkSync(tempBed); } catch(e) {}
  try { fs.unlinkSync(tempVoiceMixed); } catch(e) {}

  // Write Subtitle Metadata for Canvas Motion Graphics
  const captionPath = path.join(root, 'website/demo/audio/caption_data.json');
  fs.writeFileSync(captionPath, JSON.stringify(scenes, null, 2));

  console.log('✓ Master WAV exported:', outWav);
  console.log('✓ Master MP3 exported:', outMp3);
  console.log('✓ Caption data saved:', captionPath);
  console.log('=== CONTINUOUS AUDIO MASTER GENERATION COMPLETE ===');
}

main().catch(console.error);
