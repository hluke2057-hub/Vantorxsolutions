const fs = require('fs');
const path = require('path');

const p = path.resolve('website/demo/reel-creator.html');
let html = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// 1. Download buttons
html = html.replace(
  'video/vantorx-30s-reel-2.mp4?v=nvidia',
  'video/vantorx-30s-reel-2.mp4?v=cueva_master'
);
html = html.replace(
  'video/vantorx-30s-reel-2.mp4?v=nvidia',
  'video/vantorx-30s-reel-2.mp4?v=cueva_master'
);
html = html.replace(
  'Preview Reel #2 (29.7s) ↗',
  'Preview Reel #2 (26.3s) ↗'
);

// 2. Video element in stage
html = html.replace(
  '<video id="masterMp4Player" src="video/vantorx-30s-reel-2.mp4?v=nvidia" controls playsinline preload="auto" style="display:none;width:100%;max-width:540px;height:auto;aspect-ratio:9/16;border-radius:12px;background:#000;box-shadow:0 12px 48px rgba(0,0,0,0.8)"></video>',
  '<video id="masterMp4Player" src="video/vantorx-30s-reel-2.mp4?v=cueva_master" poster="video/reel_nvidia_act1_hook.png?v=cueva_master" controls playsinline preload="auto" style="display:none;width:100%;max-width:540px;height:auto;aspect-ratio:9/16;border-radius:12px;background:#000;box-shadow:0 12px 48px rgba(0,0,0,0.8)"></video>'
);

// 3. Metadata
html = html.replace(
  'videoSrc: "video/vantorx-30s-reel-2.mp4?v=nvidia"',
  'videoSrc: "video/vantorx-30s-reel-2.mp4?v=cueva_master",\n      poster: "video/reel_nvidia_act1_hook.png?v=cueva_master"'
);
html = html.replace(
  'duration: "00:27"',
  'duration: "00:26"'
);

// 4. switchActiveReel poster update
html = html.replace(
  'masterVideo.src = meta.videoSrc;',
  'masterVideo.src = meta.videoSrc;\n      if (meta.poster) masterVideo.poster = meta.poster;'
);

fs.writeFileSync(p, html, 'utf8');
console.log('Successfully patched reel-creator.html with Cueva master reel references!');
