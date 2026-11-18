// scripts/build_continuous_voiceover.js
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const tts = new MsEdgeTTS();

const scriptLines = [
  {
    id: 'scene1',
    start: 0.15,
    maxDur: 3.0,
    rate: '+22%',
    text: 'Speed to lead is everything. Most customers hire whoever answers first.'
  },
  {
    id: 'scene2',
    start: 3.25,
    maxDur: 3.65,
    rate: '+22%',
    text: 'When you hit voicemail, that caller hangs up and books your competitor in seconds.'
  },
  {
    id: 'scene3',
    start: 7.0,
    maxDur: 3.9,
    rate: '+20%',
    text: 'VantorX answers in zero-point-two seconds, picking up before the second ring.'
  },
  {
    id: 'scene4a',
    start: 11.0,
    maxDur: 3.4,
    rate: '+22%',
    text: 'Our AI qualifies the lead, diagnoses the issue, and captures every detail live.'
  },
  {
    id: 'scene4b',
    start: 14.5,
    maxDur: 3.4,
    rate: '+22%',
    text: 'It syncs your calendar, locks the slot, and texts the dispatch alert to your phone.'
  },
  {
    id: 'scene5',
    start: 18.0,
    maxDur: 5.6,
    rate: '+18%',
    text: 'While you focus on the job site, VantorX stacks your schedule with confirmed revenue.'
  },
  {
    id: 'scene6',
    start: 23.8,
    maxDur: 3.8,
    rate: '+15%',
    text: 'Out-answer your competition today. Visit vantorxsolutions.com.'
  }
];

async function main() {
  await tts.setMetadata('en-US-ChristopherNeural', OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
  const outDir = path.join(root, 'website/demo/audio/final_tts_clips');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const processed = [];

  for (const item of scriptLines) {
    const dir = path.join(outDir, item.id);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    // Generate TTS
    await tts.toFile(dir, item.text, { rate: item.rate });
    const rawClip = path.join(dir, 'audio.mp3');
    const fittedClip = path.join(dir, 'fitted.wav');

    // Check duration
    let probe = spawnSync(ffmpeg, ['-i', rawClip]);
    let match = probe.stderr.toString().match(/Duration: ([0-9:.]+)/);
    let parts = match[1].split(':');
    let dur = parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);

    // If duration exceeds maxDur, apply atempo in ffmpeg
    if (dur > item.maxDur) {
      const speedFactor = dur / item.maxDur;
      console.log(`[${item.id}] Adjusting atempo: ${speedFactor.toFixed(2)}x (from ${dur.toFixed(2)}s to ${item.maxDur.toFixed(2)}s)`);
      spawnSync(ffmpeg, ['-i', rawClip, '-filter:a', `atempo=${speedFactor.toFixed(3)}`, '-y', fittedClip]);
      dur = item.maxDur;
    } else {
      spawnSync(ffmpeg, ['-i', rawClip, '-y', fittedClip]);
    }

    processed.push({
      ...item,
      actualDur: dur,
      fittedPath: fittedClip
    });

    console.log(`✓ [${item.id}] Start: ${item.start}s, Dur: ${dur.toFixed(2)}s, End: ${(item.start + dur).toFixed(2)}s -> "${item.text}"`);
  }

  // Save metadata
  fs.writeFileSync(path.join(root, 'website/demo/audio/continuous_voiceover_metadata.json'), JSON.stringify(processed, null, 2));
  console.log('Voiceover processing complete!');
}

main().catch(console.error);
