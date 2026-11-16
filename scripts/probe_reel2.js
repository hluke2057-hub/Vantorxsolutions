const { execSync } = require('child_process');
const path = require('path');
const ffmpeg = require('ffmpeg-static');
const p = path.resolve('website/demo/video/vantorx-nvidia-reel.mp4');

try {
  // Use ffmpeg to get info
  const out = execSync(`"${ffmpeg}" -i "${p}" 2>&1`, { encoding: 'utf8' });
  console.log('FFMPEG Output:');
  console.log(out.split('\n').filter(l => l.includes('Duration') || l.includes('Stream #')).join('\n'));
} catch (e) {
  console.log(e.stdout.split('\n').filter(l => l.includes('Duration') || l.includes('Stream #')).join('\n'));
}
