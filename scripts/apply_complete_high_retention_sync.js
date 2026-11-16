const fs = require('fs');
const path = require('path');

const reelCreatorPath = path.resolve('website/demo/reel-creator.html');
const tsData = JSON.parse(fs.readFileSync(path.resolve('website/demo/audio/reel2-30s-timestamps.json'), 'utf8'));

// Build chunks from tsData
const colors = ['#ff6b4a', '#38bdf8', '#facc15', '#c084fc', '#4ade80'];
const chunks = [];
for (let i = 0; i < tsData.words.length; i += 3) {
  const slice = tsData.words.slice(i, i + 3).map(w => ({
    word: w.word,
    rawWord: w.word,
    start: w.start,
    end: w.end
  }));
  const nextStart = tsData.words[i + 3] ? tsData.words[i + 3].start : (slice[slice.length - 1].end + 0.4);
  chunks.push({
    id: chunks.length + 1,
    start: slice[0].start,
    end: nextStart,
    color: colors[chunks.length % colors.length],
    text: slice.map(w => w.word).join(' '),
    words: slice
  });
}

let html = fs.readFileSync(reelCreatorPath, 'utf8');

// 1. Replace CAPTION_CHUNKS
const chunkRegex = /const CAPTION_CHUNKS = \[.*?\];/s;
html = html.replace(chunkRegex, 'const CAPTION_CHUNKS = ' + JSON.stringify(chunks) + ';');

// 2. Make masterMp4Player visible by default, canvas hidden by default
html = html.replace(
  '<video id="masterMp4Player" src="video/vantorx-30s-reel-2.mp4?v=high_retention_29s" controls playsinline preload="auto" style="display:none;width:100%;max-width:540px;height:auto;aspect-ratio:9/16;border-radius:12px;background:#000;box-shadow:0 12px 48px rgba(0,0,0,0.8)"></video>',
  '<video id="masterMp4Player" src="video/vantorx-30s-reel-2.mp4?v=high_retention_29s" controls playsinline preload="auto" style="display:block;width:100%;max-width:540px;height:auto;aspect-ratio:9/16;border-radius:12px;background:#000;box-shadow:0 12px 48px rgba(0,0,0,0.8)"></video>'
);
html = html.replace(
  '<canvas id="reelCanvas" width="540" height="960" onclick="togglePlay()" style="cursor:pointer"></canvas>',
  '<canvas id="reelCanvas" width="540" height="960" onclick="togglePlay()" style="display:none;cursor:pointer"></canvas>'
);

// 3. Make sure download links all have fresh version tag
html = html.replace(/vantorx-speed-to-lead-reel\.mp4\?v=\d+/g, 'vantorx-30s-reel-2.mp4?v=high_retention_29s');

// 4. Update any remaining occurrences of 89s / 89.0s in UI labels
html = html.replace(/89\.0s Extended Story Reel/g, '29.7s High-Retention Fast-Hook Cut');
html = html.replace(/89s Story/g, '29.7s Master Cut');
html = html.replace(/89s MP4/g, '29.7s MP4');

fs.writeFileSync(reelCreatorPath, html, 'utf8');
console.log('✅ reel-creator.html fully synchronized with 29.7s high-retention cut!');
