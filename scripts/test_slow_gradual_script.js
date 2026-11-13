const fs = require('fs');
const path = require('path');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const envPath = path.join(root, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/ELEVENLABS_API_KEY=(.+)/);
const apiKey = keyMatch[1].trim();

// Calibrated 115-word script:
// Slow gradual hook (0s - 12s) -> Sega 1995 Story (12s - 25s) -> Nobody's perfect bleed (25s - 34s) -> Seamless Cut to Ava & Web (34s - 48s)
const script = `Did Nvidia build a three trillion dollar empire by playing by the book? Think again. The untold truth about how Nvidia actually survived... is that Jensen Huang cheated. Let me explain. In 1995, Nvidia was thirty days from total bankruptcy. Their chip was broken. Jensen walked into Sega's boardroom, confessed they failed, and walked out with five million dollars anyway... by pivoting to ruthless automation. Here's the truth: Nobody is perfect. And neither is your business. You're losing eight thousand dollars every single week because emergency calls ring while you're on a ladder, and die in voicemail. Jensen had an unfair advantage, and now you do too. Meet AVA: our 24/7 Voice AI Receptionist paired with a sub-second mobile website. She answers in zero point eight seconds on the first ring, qualifies the job, and texts booking dispatch straight to your truck. Call (561) 813-8602 to test her live, or comment AVA.`;

async function main() {
  const voiceId = 'pNInz6obpgDQGcFmaJgB';

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: script,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: 0.50,
        similarity_boost: 0.85,
        style: 0.25,
        speed: 0.98, // Slow, authoritative, deliberate cadence
        use_speaker_boost: true
      }
    })
  });

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
  fs.writeFileSync(outJson, JSON.stringify({ duration: totalSec, script, words }, null, 2));

  console.log(`✅ Saved dry voiceover to: ${outAudio}`);
  console.log(`✅ Saved timestamps to: ${outJson}`);

  const hookEnd = words.find(w => w.word.toLowerCase().includes('cheated'))?.end || 0;
  const segaEnd = words.find(w => w.word.toLowerCase().includes('automation.'))?.end || 0;
  const bleedEnd = words.find(w => w.word.toLowerCase().includes('voicemail.'))?.end || 0;
  console.log(`Timings:`);
  console.log(`- Gradual Hook: 0.0s -> ${hookEnd}s`);
  console.log(`- Sega Story: ${hookEnd}s -> ${segaEnd}s`);
  console.log(`- Nobody's Perfect & Bleed: ${segaEnd}s -> ${bleedEnd}s`);
  console.log(`- Seamless Product Cut (Ava + Web + CTA): ${bleedEnd}s -> ${totalSec.toFixed(2)}s`);
}

main().catch(console.error);
