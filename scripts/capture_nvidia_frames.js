const { execSync } = require('child_process');
const path = require('path');
const ffmpeg = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const videoPath = path.join(root, 'website/demo/video/vantorx-30s-reel-2.mp4');
const artifactDir = 'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0';

// Act 1: 0s - 7.0s (Gradual Hook: Empire question at 2.2s, Jensen Cheated reveal at 5.5s)
// Act 2: 7.0s - 14.36s (Sega Boardroom Rescue at 10.5s)
// Act 3: 14.36s - 18.62s (Nobody's Perfect / Contractor Ladder at 16.5s)
// Act 4: 18.62s - 29.2s (AVA Neon AI Promotion & CTA at 24.0s)
const frames = [
  { time: '00:00:02.200', name: 'reel_nvidia_act1_empire_intro.png' },
  { time: '00:00:05.500', name: 'reel_nvidia_act1_hook.png' },
  { time: '00:00:10.500', name: 'reel_nvidia_act2_sega.png' },
  { time: '00:00:16.500', name: 'reel_nvidia_act3_nobody_perfect.png' },
  { time: '00:00:24.000', name: 'reel_nvidia_act4_ava_cta.png' }
];

frames.forEach(f => {
  const outPath = path.join(artifactDir, f.name);
  const webPath = path.join(root, 'website/demo/video', f.name);
  execSync(`"${ffmpeg}" -y -ss ${f.time} -i "${videoPath}" -vframes 1 "${outPath}"`);
  execSync(`"${ffmpeg}" -y -ss ${f.time} -i "${videoPath}" -vframes 1 "${webPath}"`);
  console.log('Extracted frame:', f.name);
});
