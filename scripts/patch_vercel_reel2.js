const fs = require('fs');
const p = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/website/vercel.json';
const conf = JSON.parse(fs.readFileSync(p, 'utf8'));

// Check if /demo/reel2 rewrite already exists
const hasReel2 = conf.rewrites.some(r => r.source === '/demo/reel2');
if (!hasReel2) {
  // Insert after /demo/reel/
  const idx = conf.rewrites.findIndex(r => r.source === '/demo/reel/');
  conf.rewrites.splice(idx + 1, 0, 
    { source: '/demo/reel2', destination: '/demo/reel2.html' },
    { source: '/demo/reel2/', destination: '/demo/reel2.html' }
  );
  fs.writeFileSync(p, JSON.stringify(conf, null, 2), 'utf8');
  console.log('Added /demo/reel2 rewrites to vercel.json');
} else {
  console.log('Already has /demo/reel2 rewrite');
}
