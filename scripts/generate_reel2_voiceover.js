const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/ELEVENLABS_API_KEY=(.+)/);
const apiKey = keyMatch[1].trim();

// Punchy ~54-word 4-Act Script (Hook -> Explanation -> Example -> Final Comment) strictly under 28s!
const fullScript = `Stop scrolling. Every call hitting your voicemail costs your shop $8,000. 78% of homeowners hire whoever picks up first. When you are on a job, they tap the next company on Google. Imagine Friday at 7 PM: an AC dies. Ava answers in one second, qualifies the leak, and texts you the booked job. Call (561) 813-8602 or comment AVA below.`;

async function main() {
  console.log('Generating tight <=28s Reel #2 ElevenLabs voiceover...');
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
        style: 0.30,
        speed: 1.06,
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

  fs.writeFileSync(path.resolve('website/demo/audio/reel2-30s-voiceover-dry.mp3'), Buffer.from(data.audio_base64, 'base64'));
  fs.writeFileSync(path.resolve('website/demo/audio/reel2-30s-timestamps.json'), JSON.stringify({ duration: totalSec, script: fullScript, words }, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });
