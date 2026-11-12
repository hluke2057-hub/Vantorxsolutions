const fs = require('fs');
const { execSync } = require('child_process');

const p1 = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/website/downloads/vantorx_instagram_complete_package.zip';
try {
  const out = execSync(`tar -tf "${p1}"`, { encoding: 'utf8' });
  const lines = out.split('\n').filter(Boolean);
  console.log('vantorx_instagram_complete_package.zip entries:', lines.length);
  console.log(lines.slice(0, 15).join('\n'));
} catch (e) {
  console.error(e.message);
}
