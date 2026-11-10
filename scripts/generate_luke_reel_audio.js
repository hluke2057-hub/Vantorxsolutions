// scripts/generate_luke_reel_audio.js
const fs = require('fs');
const path = require('path');

// 1. Read API Key from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/ELEVENLABS_API_KEY=(.+)/);
if (!keyMatch) {
  console.error('ELEVENLABS_API_KEY not found in .env.local');
  process.exit(1);
}
const apiKey = keyMatch[1].trim();
console.log('ElevenLabs API Key ending in:', apiKey.slice(-4));

// 2. High-retention, high-authority Taskless script for Luke Hamilton
const scriptText = `Most guys waste two hours in the gym doing twenty junk-volume sets, destroying their joints and gaining pure body fat.

Luke took his physique from a soft one hundred and fifty-five pounds to an ultra-shredded one hundred and eighty pounds with razor-sharp eight-pack abs. And he did it by following one unbreakable law:

Adding weight is progressive overload. Every single exercise is performed for exactly two working sets taken to absolute mechanical failure. Forty-eight minutes per workout. Zero wasted effort.

When you push the final two reps to true failure, your central nervous system recruits one hundred percent of high-threshold muscle fibers. You don't need five exercises for chest. You need two sets executed with surgical violence and logged in your tracking sheet.

Comment "BULK" below right now, and we'll D-M you Luke's exact Push, Pull, Legs workout split, logbook template, and lean bulk meal formula for free.`;

async function generateVoiceover(voiceId, voiceName, outputPath) {
  console.log(`Generating ElevenLabs studio voiceover for Luke Hamilton (${voiceName})...`);

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text: scriptText,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: 0.48,
        similarity_boost: 0.88,
        style: 0.22,
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs API error (${response.status}): ${errText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Saved ${voiceName} audio to: ${outputPath} (${buffer.length} bytes)`);
}

async function run() {
  try {
    const outAudioPath = path.resolve(__dirname, '../website/fitness/audio/luke-voiceover-master.mp3');
    // Adam voice ID: pNInz6obpgDQGcFmaJgB (Dominant, authoritative, elite fitness tone)
    await generateVoiceover('pNInz6obpgDQGcFmaJgB', 'Adam', outAudioPath);
    console.log('--- LUKE HAMILTON VOICEOVER GENERATED SUCCESSFULLY ---');
  } catch (err) {
    console.error('Audio generation failed:', err);
    process.exit(1);
  }
}

run();
