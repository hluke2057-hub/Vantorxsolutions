const { execSync } = require('child_process');
const path = require('path');
const ffmpeg = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const videoPath = path.join(root, 'website/demo/video/vantorx-30s-reel-2.mp4');
const artifactDir = 'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0';

// Act 1: 1.5s (Hook: Nvidia's CEO Cheated)
// Act 2: 7.5s (Sega Boardroom Rescue)
// Act 3: 14.5s (Nobody's Perfect / Contractor Voicemail)
// Act 4: 22.0s (AVA Voice AI Promotion)
const frames = [
  { time: '00:00:01.500', name: 'reel_nvidia_act1_hook.png' },
  { time: '00:00:07.500', name: 'reel_nvidia_act2_sega.png' },
  { time: '00:00:14.500', name: 'reel_nvidia_act3_nobody_perfect.png' },
  { time: '00:00:22.000', name: 'reel_nvidia_act4_ava_cta.png' }
];

frames.forEach(f => {
  const outPath = path.join(artifactDir, f.name);
  const webPath = path.join(root, 'website/demo/video', f.name);
  execSync(`"${ffmpeg}" -y -ss ${f.time} -i "${videoPath}" -vframes 1 "${outPath}"`);
  execSync(`"${ffmpeg}" -y -ss ${f.time} -i "${videoPath}" -vframes 1 "${webPath}"`);
  console.log('Extracted frame:', f.name);
});
