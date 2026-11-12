const fs = require('fs');
const { execSync } = require('child_process');

const src = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/website/instagram-package/VantorX_Instagram_Highlights_Complete_Package.zip';
const dest = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/test_extract';

if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });

try {
  // Test extracting using tar (built into modern Windows)
  execSync(`tar -xf "${src}" -C "${dest}"`);
  console.log('Tar extraction succeeded!');
  const files = [];
  function walk(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(d => {
      const full = dir + '/' + d.name;
      if (d.isDirectory()) walk(full);
      else files.push(full.replace(dest + '/', ''));
    });
  }
  walk(dest);
  console.log(`Extracted ${files.length} files:`);
  files.forEach(f => console.log(' - ' + f));
} catch (e) {
  console.error('Tar extraction failed:', e.message);
}
