const fs = require('fs');
const path = require('path');

// Read API key from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/ELEVENLABS_API_KEY=(.+)/);
if (!keyMatch) {
  console.error('Missing ELEVENLABS_API_KEY in .env.local');
  process.exit(1);
}
const apiKey = keyMatch[1].trim();

// Extended Cosmic Hook + Full "Meet Bob & Sarah" Story + Ava Resolution + Direct CTA
const fullScript = `If you point a single beam of laser light into the night sky, it fires into the dark at 186,000 miles per second. In just one second, it flashes past the Moon. In twelve minutes, it blazes past Mars. In forty-three minutes, it tears past Jupiter, and in under three hours, it crosses nearly two billion miles of freezing deep space to hit the rings of Uranus. Yet that two-billion-mile journey across the solar system is STILL faster than the average contractor calls back an emergency lead.

Picture this. Meet Bob. Bob is a master contractor standing twenty feet up a ladder in a scorching attic, drenched in sweat with a wrench in his hand. Across town, a pipe bursts in Sarah's ceiling and water is pouring everywhere. Panicking, she grabs her phone and calls Bob first. Bob's phone buzzes in his pocket, once, twice, three times, and dumps straight to voicemail. Sarah doesn't leave a message, because 78% of homeowners hire the very first business that answers. Within ten seconds, she taps the next contractor on Google. That shop answers on ring one, rolls a truck, and collects an $8,000 check that had Bob's name written all over it.

That is why we built Ava. She answers your phone in 0.8 seconds, calms the homeowner down, qualifies the job, books your calendar, and texts the dispatch straight to Bob's phone before the customer can even open another Google tab.

Stop handing $8,000 checks to your competitors. Call the live demo number on your screen right now to hear Ava answer live, or comment AVA below and we will DM you the free interactive link.`;

async function main() {
  console.log('Generating extended story voiceover with exact character timestamps from ElevenLabs (Adam)...');
  const voiceId = 'pNInz6obpgDQGcFmaJgB'; // Adam - Deep, authoritative storytelling voice

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
        stability: 0.48,
        similarity_boost: 0.86,
        style: 0.22,
        speed: 1.18,
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
  const totalDur = words[words.length - 1].end;
  console.log(`Total spoken duration: ${totalDur.toFixed(2)}s`);

  // Print key story milestone timestamps so we align scenes 1:1
  words.forEach((w, idx) => {
    const clean = w.word.toLowerCase();
    if (['moon.', 'mars.', 'jupiter,', 'uranus.', 'still', 'picture', 'bob.', 'attic,', 'sarah\'s', 'buzzes', 'voicemail.', '78%', 'google.', '$8,000', 'ava.', '0.8', 'stop', 'call', 'comment'].includes(clean)) {
      console.log(`  [${w.start.toFixed(2)}s - ${w.end.toFixed(2)}s] (${idx}) "${w.word}"`);
    }
  });

  // Save dry voiceover MP3
  const audioBuf = Buffer.from(data.audio_base64, 'base64');
  const dryOutPath = path.resolve(__dirname, '../website/demo/audio/reel-voiceover-dry.mp3');
  fs.writeFileSync(dryOutPath, audioBuf);
  console.log(`Saved dry voiceover to ${dryOutPath} (${(audioBuf.length / 1024).toFixed(1)} KB)`);

  // Save words timestamp JSON
  const jsonOutPath = path.resolve(__dirname, '../website/demo/audio/word_timestamps.json');
  fs.writeFileSync(jsonOutPath, JSON.stringify(words, null, 2));
  console.log(`Saved word timestamps to ${jsonOutPath}`);

  // Group into compact 2-word (or 3 short-word) Cueva-style caption chunks (max 16 chars per chunk!)
  const chunks = [];
  let curChunkWords = [];
  let curChunkChars = 0;

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const cleanWord = w.word.replace(/[^a-zA-Z0-9$%.']/g, '');
    const nextLen = curChunkChars + (curChunkWords.length > 0 ? 1 : 0) + w.word.length;

    const prevWord = curChunkWords.length > 0 ? curChunkWords[curChunkWords.length - 1] : null;
    const prevEndsSentence = prevWord && /[.?!,;]$/.test(prevWord.rawWord);
    const timeGap = prevWord ? (w.start - prevWord.end) : 0;

    if (
      curChunkWords.length >= 2 && (nextLen > 15 || prevEndsSentence || timeGap > 0.25) ||
      curChunkWords.length >= 3 ||
      (curChunkWords.length >= 1 && (prevEndsSentence || timeGap > 0.35 || nextLen > 18))
    ) {
      chunks.push({
        id: chunks.length + 1,
        start: curChunkWords[0].start,
        end: curChunkWords[curChunkWords.length - 1].end,
        text: curChunkWords.map(cw => cw.rawWord).join(' '),
        words: curChunkWords
      });
      curChunkWords = [];
      curChunkChars = 0;
    }

    curChunkWords.push({
      word: cleanWord,
      rawWord: w.word,
      start: w.start,
      end: w.end
    });
    curChunkChars += (curChunkWords.length > 1 ? 1 : 0) + w.word.length;
  }

  if (curChunkWords.length > 0) {
    chunks.push({
      id: chunks.length + 1,
      start: curChunkWords[0].start,
      end: curChunkWords[curChunkWords.length - 1].end + 0.3,
      text: curChunkWords.map(cw => cw.rawWord).join(' '),
      words: curChunkWords
    });
  }

  // Smooth tiny gaps (< 0.18s) between consecutive chunks so captions don't flicker off/on mid-sentence
  for (let i = 0; i < chunks.length - 1; i++) {
    const gap = chunks[i + 1].start - chunks[i].end;
    if (gap > 0 && gap < 0.22) {
      chunks[i].end = chunks[i + 1].start;
    }
  }

  const chunksPath = path.resolve(__dirname, '../website/demo/audio/caption_chunks.json');
  fs.writeFileSync(chunksPath, JSON.stringify(chunks, null, 2));
  console.log(`Saved ${chunks.length} Cueva-style compact caption chunks to ${chunksPath}`);
}

main().catch(err => {
  console.error('Voiceover generation failed:', err);
  process.exit(1);
});
