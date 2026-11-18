const fs = require('fs');
const path = require('path');

const target = path.resolve('website/demo/reel2.html');
let content = fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n');

content = content.replaceAll('v=speed_to_lead_28s', 'v=continuous_voiceover_28s');
content = content.replace('⚡ Speed To Lead • 28.0s Vector Explainer', '⚡ Speed To Lead • 28.0s Continuous Narration & Karaoke Captions');
content = content.replace('100% Vector Motion Graphics • 0.2s Instant Response • Continuous Motion', '100% Vector Motion Graphics • Continuous Voice Narration • Real-Time Dynamic Karaoke Captions');

content = content.replace(
  `      { id: 'act1', start: 0, end: 3.0 },
      { id: 'act2', start: 3.0, end: 7.0 },
      { id: 'act3', start: 7.0, end: 11.0 },
      { id: 'act4', start: 11.0, end: 18.0 },
      { id: 'act5', start: 18.0, end: 24.0 },
      { id: 'act6', start: 24.0, end: 28.0 }`,
  `      { id: 'act1', start: 0, end: 4.05 },
      { id: 'act2', start: 4.05, end: 8.05 },
      { id: 'act3', start: 8.05, end: 12.15 },
      { id: 'act4', start: 12.15, end: 19.85 },
      { id: 'act5', start: 19.85, end: 23.95 },
      { id: 'act6', start: 23.95, end: 28.0 }`
);

fs.writeFileSync(target, content, 'utf8');
console.log('✓ Updated reel2.html successfully!');
