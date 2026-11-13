const fs = require('fs');
const path = require('path');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const envPath = path.join(root, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/ELEVENLABS_API_KEY=(.+)/);
const apiKey = keyMatch[1].trim();

const fullScript = `Think Nvidia became a three-trillion-dollar empire by playing fair? Think again. Nvidia's CEO cheated to survive. Let me explain. In 1995, Jensen Huang built a broken chip and had thirty days of cash left. He confessed to Sega, and got five million anyway by pivoting to automation. Nobody's perfect. Neither is your business. You're losing eight grand a week to voicemail while on a ladder. Meet AVA: our Voice AI that answers in one second and books jobs 24/7. Call (561) 813-8602 or comment AVA below.`;

async function main() {
  console.log('Generating calibrated gradual hook voiceover...');
  const voiceId = 'pNInz6obpgDQGcFmaJgB';

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: fullScript,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.85,
        style: 0.35,
        speed: 1.20,
        use_speaker_boost: true
      }
    })
  });

  if (!res.ok) {
    throw new Error(`ElevenLabs error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const chars = data.alignment.characters;
  const starts = data.alignment.character_start_times_seconds;
  const ends = data.alignment.character_end_times_seconds;

  const words = [];
  let curWord = '', curStart = null, curEnd = null;
  for (let i = 0; i < chars.length; i++) {
    if (/\s/.test(chars[i])) {
      if (curWord) {
        words.push({ word: curWord, start: Number(curStart.toFixed(3)), end: Number(curEnd.toFixed(3)) });
        curWord = ''; curStart = null; curEnd = null;
      }
    } else {
      if (curStart === null) curStart = starts[i];
      curEnd = ends[i];
      curWord += chars[i];
    }
  }
  if (curWord) words.push({ word: curWord, start: Number(curStart.toFixed(3)), end: Number(curEnd.toFixed(3)) });

  const totalSec = words.length ? words[words.length - 1].end : 0;
  console.log(`Word count: ${words.length} | Spoken duration: ${totalSec.toFixed(2)}s`);

  const outAudio = path.join(root, 'website/demo/audio/reel-nvidia-voiceover-dry.mp3');
  const outJson = path.join(root, 'website/demo/audio/reel-nvidia-timestamps.json');
  fs.writeFileSync(outAudio, Buffer.from(data.audio_base64, 'base64'));
  fs.writeFileSync(outJson, JSON.stringify({ duration: totalSec, script: fullScript, words }, null, 2));

  // Find act breakdown timestamps
  const explainIdx = words.findIndex(w => w.word.toLowerCase().includes('explain'));
  const segaIdx = words.findIndex(w => w.word.toLowerCase().includes('nobody'));
  const avaIdx = words.findIndex(w => w.word.toLowerCase().includes('meet'));

  console.log('Act 1 Gradual Hook ends at:', explainIdx !== -1 ? words[explainIdx].end : 'n/a');
  console.log('Act 2 Story ends at:', segaIdx !== -1 ? words[segaIdx].start : 'n/a');
  console.log('Act 3 Message ends at:', avaIdx !== -1 ? words[avaIdx].start : 'n/a');
}

main().catch(err => { console.error(err); process.exit(1); });
