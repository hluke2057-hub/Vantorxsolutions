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

const fullScript = `At two in the morning, a fourteen thousand dollar pipe burst inside a luxury estate.
The homeowner panicked and dialed the top contractor in town.
Frank was fast asleep. His phone buzzed, tumbled off the nightstand, and died in voicemail.
Ten seconds later, his competitor answered and took the fourteen thousand dollar check.
Contractors don't lose jobs to price. They lose them to sleep.
Meet AVA. She answers in point eight seconds, qualifies the emergency, and locks the job while you rest.
Stop losing jobs to voicemail. Dial the number on screen or comment AVA to test her live.`;

async function main() {
  console.log('Generating voiceover with character timestamps from ElevenLabs (Adam)...');
  const voiceId = 'pNInz6obpgDQGcFmaJgB'; // Adam - Deep, authoritative, storytelling

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
        style: 0.22,
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

  // Group characters into words
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

  // Save MP3 audio
  const audioBuffer = Buffer.from(data.audio_base64, 'base64');
  const outAudioPath = path.resolve('website/demo/audio/geyser-voiceover.mp3');
  fs.writeFileSync(outAudioPath, audioBuffer);
  console.log(`Audio saved to ${outAudioPath} (${(audioBuffer.length / 1024).toFixed(1)} KB)`);

  const totalDuration = words[words.length - 1].end;
  console.log(`Script has ${words.length} words. Total spoken duration: ${totalDuration.toFixed(2)}s`);

  // Save timestamps JSON
  const outJsonPath = path.resolve('website/demo/audio/geyser-timestamps.json');
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
