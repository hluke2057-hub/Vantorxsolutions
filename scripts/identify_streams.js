const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const { spawnSync } = require('child_process');

const artDir = 'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0';
const files = fs.readdirSync(artDir).filter(f => f.startsWith('taskless_stream_'));

for (const f of files) {
  const full = path.join(artDir, f);
  const p = spawnSync(ffmpegPath, ['-i', full], { encoding: 'utf8' });
  const audioLine = p.stderr.split('\n').find(l => l.includes('Audio:'));
  const videoLine = p.stderr.split('\n').find(l => l.includes('Video:'));
  if (audioLine) {
    console.log('FOUND AUDIO in ' + f + ':', audioLine.trim());
    spawnSync(ffmpegPath, ['-i', full, '-vn', '-c:a', 'aac', path.join(artDir, 'taskless_audio_extracted.m4a'), '-y']);
  }
  if (videoLine) {
    console.log('Video in ' + f + ':', videoLine.trim().slice(0, 80));
  }
}
