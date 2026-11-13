const { execSync } = require('child_process');
const path = require('path');
const ffmpeg = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const videoPath = path.join(root, 'website/demo/video/vantorx-30s-reel-2.mp4');
const artifactDir = 'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0';

// Act 1: 0.0s - 15.5s (Gradual Hook: $3T Empire at 3s, Think Again at 6s, Jensen Cheated at 10s, Blueprint at 14s)
// Act 2: 15.5s - 33.5s (Bankruptcy at 18s, Sega $5M at 25s, Automation at 31s)
// Act 3: 33.5s - 46.1s (Nobody's Perfect at 36s, Voicemail Graveyard at 42s)
// Act 4: 46.1s - 75.1s (Unfair Advantage at 48s, AVA & 0.6s Site at 54s, SMS Dispatch at 62s, Live Dialer CTA at 71s)
const frames = [
  { time: 3.0, name: 'reel_nvidia_act1_empire_intro.png' },
  { time: 6.0, name: 'reel_nvidia_act1_think_again.png' },
  { time: 10.0, name: 'reel_nvidia_act1_hook.png' },
  { time: 14.0, name: 'reel_nvidia_act1_blueprint.png' },
  { time: 18.0, name: 'reel_nvidia_act2_bankruptcy.png' },
  { time: 25.0, name: 'reel_nvidia_act2_sega.png' },
  { time: 31.0, name: 'reel_nvidia_act2_automation.png' },
  { time: 36.0, name: 'reel_nvidia_act3_nobody_perfect.png' },
  { time: 42.0, name: 'reel_nvidia_act3_voicemail_graveyard.png' },
  { time: 48.0, name: 'reel_nvidia_act4_unfair_advantage.png' },
  { time: 54.0, name: 'reel_nvidia_act4_ava_mobile.png' },
  { time: 62.0, name: 'reel_nvidia_act4_sms_dispatch.png' },
  { time: 71.0, name: 'reel_nvidia_act4_ava_cta.png' }
];

frames.forEach(f => {
  const outPath = path.join(artifactDir, f.name);
  const webPath = path.join(root, 'website/demo/video', f.name);
  execSync(`"${ffmpeg}" -y -ss ${f.time} -i "${videoPath}" -vframes 1 "${outPath}"`);
  execSync(`"${ffmpeg}" -y -ss ${f.time} -i "${videoPath}" -vframes 1 "${webPath}"`);
  console.log('✅ Extracted frame:', f.name, `at ${f.time}s`);
});
