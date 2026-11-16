const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/ELEVENLABS_API_KEY=(.+)/);
if (!keyMatch) {
  console.error('Missing ELEVENLABS_API_KEY');
  process.exit(1);
}
const apiKey = keyMatch[1].trim();

const fullScript = `It’s one hundred and thirty degrees on this roof. Your hands are locked on a two-hundred-pound compressor.
And your phone is screaming. A frantic homeowner with a dead A-C unit. If you let go, the equipment drops. If you don't answer, she calls your competitor.
Meet AVA. She answers in point eight seconds, speaks with calm professional empathy, and locks the emergency dispatch while you keep working.
You finish the job. Check your phone. The five-thousand-dollar replacement is already on your calendar.
Never lose a high-ticket job to voicemail again. Call the number on your screen to test AVA live, or comment AVA below.`;

async function main() {
  console.log('Generating voiceover with character timestamps from ElevenLabs (Adam)...');
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
        stability: 0.52,
        similarity_boost: 0.85,
        style: 0.20,
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

  console.log(`Received alignment for ${chars.length} characters.`);

  const words = [];
  let curWord = '';
  let curStart = null;
  let curEnd = null;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const s = starts[i];
    const e = ends[i];

    if (/\s/.test(ch)) {
      if (curWord.length > 0) {
        words.push({ word: curWord, start: curStart, end: curEnd });
        curWord = '';
        curStart = null;
        curEnd = null;
      }
    } else {
      if (curStart === null) curStart = s;
      curEnd = e;
      curWord += ch;
    }
  }
  if (curWord.length > 0) {
    words.push({ word: curWord, start: curStart, end: curEnd });
  }

  const audioBuffer = Buffer.from(data.audio_base64, 'base64');
  const outAudioPath = path.resolve('website/demo/audio/rooftop-voiceover.mp3');
  fs.writeFileSync(outAudioPath, audioBuffer);
  console.log(`Audio saved: ${outAudioPath} (${(audioBuffer.length / 1024).toFixed(1)} KB)`);

  const totalDuration = words[words.length - 1].end;
  console.log(`Script has ${words.length} words. Total duration: ${totalDuration.toFixed(2)}s`);

  const outJsonPath = path.resolve('website/demo/audio/rooftop-timestamps.json');
  fs.writeFileSync(outJsonPath, JSON.stringify({
    text: fullScript,
    duration: totalDuration,
    words: words
  }, null, 2));
  console.log(`Timestamps saved to ${outJsonPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
