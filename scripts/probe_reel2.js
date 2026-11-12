const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const p = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/website/demo/video/vantorx-30s-reel-2.mp4';

try {
  // Use ffmpeg to get info
  const out = execSync(`"${ffmpeg}" -i "${p}" 2>&1`, { encoding: 'utf8' });
  console.log('FFMPEG Output:');
  console.log(out.split('\n').filter(l => l.includes('Duration') || l.includes('Stream #')).join('\n'));
} catch (e) {
  console.log(e.stdout.split('\n').filter(l => l.includes('Duration') || l.includes('Stream #')).join('\n'));
}
