// scripts/generate_caption_chunks.js
const fs = require('fs');
const path = require('path');

const words = JSON.parse(fs.readFileSync('website/demo/audio/word_timestamps.json', 'utf8'));

// Group into natural phrases of 2-4 words, breaking at punctuation (. , ? !) or natural breath pauses
const chunks = [];
let currentWords = [];

for (let i = 0; i < words.length; i++) {
  const w = words[i];
  currentWords.push(w);

  const endsWithPunct = /[.,?!:;]/.test(w.word);
  const nextWord = words[i + 1];
  const pauseAfter = nextWord ? (nextWord.start - w.end > 0.35) : true;
  const reachedMaxWords = currentWords.length >= 3;

  if (endsWithPunct || pauseAfter || reachedMaxWords || i === words.length - 1) {
    const start = currentWords[0].start;
    const end = Math.max(w.end, nextWord ? Math.min(nextWord.start, w.end + 0.3) : w.end + 0.5);
    chunks.push({
      id: chunks.length + 1,
      start: parseFloat(start.toFixed(3)),
      end: parseFloat(end.toFixed(3)),
      text: currentWords.map(item => item.word).join(' '),
      words: currentWords.map(item => ({
        word: item.word.replace(/[.,?!:;]/g, ''),
        rawWord: item.word,
        start: parseFloat(item.start.toFixed(3)),
        end: parseFloat(item.end.toFixed(3))
      }))
    });
    currentWords = [];
  }
}

console.log(`Generated ${chunks.length} clean, stable caption chunks from ${words.length} words.`);
console.log('Sample chunk 1:', JSON.stringify(chunks[0], null, 2));
console.log('Sample chunk 2:', JSON.stringify(chunks[1], null, 2));

fs.writeFileSync('website/demo/audio/caption_chunks.json', JSON.stringify(chunks, null, 2), 'utf8');
console.log('Saved to website/demo/audio/caption_chunks.json');
