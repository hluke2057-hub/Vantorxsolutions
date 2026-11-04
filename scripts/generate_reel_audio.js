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
console.log('Using ElevenLabs API Key ending in:', apiKey.slice(-4));

// 2. Coherent, high-retention script with extended hook (34s target)
const fullScript = `A single beam of laser light travels at one hundred and eighty-six thousand miles per second. It can reach the moon in under three seconds, and cross nearly two billion miles of deep space in less than three hours. Yet that interplanetary space trip is STILL faster than the average contractor calls back an emergency lead.

Seventy-eight percent of homeowners hire the first business that answers the phone. When you're on a ladder, under a sink, or eating dinner with your family, every single unanswered call is an eight thousand dollar job handed straight to your competitor.

That's why we built Ava. She answers your shop's phone in zero-point-eight seconds, qualifies the caller, checks your schedule, and dispatches the job to your technician's phone before the customer can even open another Google tab.

Stop bleeding thousands on dead voicemails. Call the demo number on your screen right now to hear Ava answer live, or comment "AVA" below and we'll D-M you the free interactive link.`;

async function generateVoiceover(voiceId, voiceName, outputPath) {
  console.log(`Generating ElevenLabs studio voiceover (${voiceName})...`);

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text: fullScript,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.85,
        style: 0.25,
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
  
  // Ensure output directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Saved ${voiceName} audio to: ${outputPath} (${buffer.length} bytes)`);
}

async function run() {
  try {
    // Generate with Adam (Dominant, Firm, High authority)
    const adamPath = path.resolve(__dirname, '../website/demo/audio/reel-voiceover-adam.mp3');
    await generateVoiceover('pNInz6obpgDQGcFmaJgB', 'Adam', adamPath);

    // Also copy to master default
    const masterPath = path.resolve(__dirname, '../website/demo/audio/reel-voiceover-master.mp3');
    fs.copyFileSync(adamPath, masterPath);
    console.log(`✓ Master audio set to Adam: ${masterPath}`);

    // Generate with Charlie (Deep, Confident, Energetic) as alternative
    const charliePath = path.resolve(__dirname, '../website/demo/audio/reel-voiceover-charlie.mp3');
    await generateVoiceover('IKne3meq5aSn9XLyUdCD', 'Charlie', charliePath);

    console.log('--- ALL AUDIO GENERATION COMPLETED SUCCESSFULLY ---');
  } catch (err) {
    console.error('Generation failed:', err);
    process.exit(1);
  }
}

run();
