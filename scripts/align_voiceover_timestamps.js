const fs = require('fs');
const path = require('path');

// Read API key
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/ELEVENLABS_API_KEY=(.+)/);
if (!keyMatch) {
  console.error('Missing ELEVENLABS_API_KEY');
  process.exit(1);
}
const apiKey = keyMatch[1].trim();

// Script text optimized for viral hooks, numbers, and CTA
const fullScript = `A single beam of laser light travels at 186,000 miles per second. It can reach the moon in under three seconds, and cross nearly two billion miles of deep space in less than three hours. Yet that interplanetary space trip is STILL faster than the average contractor calls back an emergency lead.

78% of homeowners hire the first business that answers the phone. When you are on a ladder, under a sink, or eating dinner with your family, every single unanswered call is an $8,000 job handed straight to your competitor.

That is why we built Ava. She answers your shop phone in 0.8 seconds, qualifies the caller, checks your schedule, and dispatches the job to your technician phone before the customer can even open another Google tab.

Stop bleeding thousands on dead voicemails. Call the demo number on your screen right now to hear Ava answer live, or comment AVA below and we will DM you the free interactive link.`;

async function main() {
  console.log('Generating voiceover with character timestamps from ElevenLabs (Adam)...');
  const voiceId = 'pNInz6obpgDQGcFmaJgB'; // Adam - Professional, deep authoritative tone

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
        style: 0.25,
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
    const st = starts[i];
    const en = ends[i];

    if (ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t') {
      if (curWord.length > 0) {
        words.push({
          word: curWord,
          start: parseFloat(curStart.toFixed(3)),
          end: parseFloat(curEnd.toFixed(3)),
          duration: parseFloat((curEnd - curStart).toFixed(3))
        });
        curWord = '';
        curStart = null;
        curEnd = null;
      }
    } else {
      if (curStart === null) curStart = st;
      curEnd = en;
      curWord += ch;
    }
  }

  if (curWord.length > 0) {
    words.push({
      word: curWord,
      start: parseFloat(curStart.toFixed(3)),
      end: parseFloat(curEnd.toFixed(3)),
      duration: parseFloat((curEnd - curStart).toFixed(3))
    });
  }

  console.log(`Extracted ${words.length} precise spoken words!`);
  console.log('First 5 words:', words.slice(0, 5));
  console.log('Last 5 words:', words.slice(-5));

  // Save audio
  const audioBuf = Buffer.from(data.audio_base64, 'base64');
  const audioOutPath = path.resolve('website/demo/audio/reel-voiceover-master.mp3');
  fs.writeFileSync(audioOutPath, audioBuf);
  console.log(`Saved audio to ${audioOutPath} (${(audioBuf.length / 1024).toFixed(1)} KB)`);

  // Save words timestamp JSON
  const jsonOutPath = path.resolve('website/demo/audio/word_timestamps.json');
  fs.writeFileSync(jsonOutPath, JSON.stringify(words, null, 2));
  console.log(`Saved word timestamps to ${jsonOutPath}`);

  return words;
}

main().catch(err => {
  console.error('Alignment failed:', err);
  process.exit(1);
});
