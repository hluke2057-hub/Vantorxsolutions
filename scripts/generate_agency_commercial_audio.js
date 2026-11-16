// scripts/generate_agency_commercial_audio.js
const fs = require('fs');
const path = require('path');

const envPath = path.resolve('C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/ELEVENLABS_API_KEY=(.+)/);
if (!keyMatch) {
  console.error('Missing ELEVENLABS_API_KEY');
  process.exit(1);
}
const apiKey = keyMatch[1].trim();

// 349 characters - pristine agency commercial voiceover
const fullScript = `On the job, every missed call is a customer lost to your competitor.
Meet VantorX AI Receptionist.
It answers instantly—capturing caller info, qualifying the service need, and scheduling appointments onto your calendar, twenty-four-seven.
You focus on the work. We book the jobs.
Stop losing customers to missed calls.
Let AI answer every call.
VantorX.`;

async function main() {
  console.log('Generating agency voiceover from ElevenLabs (Adam)...');
  console.log('Script character count:', fullScript.length);
  const voiceId = 'pNInz6obpgDQGcFmaJgB'; // Adam

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
        stability: 0.55,
        similarity_boost: 0.88,
        style: 0.15,
        use_speaker_boost: true
      }
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  const chars = data.alignment.characters;
  const starts = data.alignment.character_start_times_seconds;
  const ends = data.alignment.character_end_times_seconds;

  // Build clean word timestamps
  const words = [];
  let currentWord = '';
  let wordStart = null;
  let wordEnd = null;

  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (/\s/.test(c)) {
      if (currentWord.length > 0) {
        words.push({
          word: currentWord,
          start: Math.round(wordStart * 1000) / 1000,
          end: Math.round(wordEnd * 1000) / 1000
        });
        currentWord = '';
        wordStart = null;
        wordEnd = null;
      }
    } else {
      if (currentWord.length === 0) wordStart = starts[i];
      wordEnd = ends[i];
      currentWord += c;
    }
  }
  if (currentWord.length > 0) {
    words.push({
      word: currentWord,
      start: Math.round(wordStart * 1000) / 1000,
      end: Math.round(wordEnd * 1000) / 1000
    });
  }

  const totalDuration = ends[ends.length - 1];
  console.log(`Generated ${words.length} words, total duration: ${totalDuration.toFixed(2)}s`);

  const audioBuf = Buffer.from(data.audio_base64, 'base64');
  const outAudio = path.resolve('website/demo/audio/vantorx-agency-voiceover.mp3');
  const outJson = path.resolve('website/demo/audio/vantorx-agency-timestamps.json');

  fs.writeFileSync(outAudio, audioBuf);
  fs.writeFileSync(outJson, JSON.stringify({ text: fullScript, duration: totalDuration, words }, null, 2));

  console.log('Saved voiceover:', outAudio);
  console.log('Saved timestamps:', outJson);
}

main().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
