const fs = require('fs');
const path = require('path');
const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';

const dirs = [path.join(root, 'data'), path.join(root, 'website', 'data')];
dirs.forEach(d => {
  if (!fs.existsSync(d)) return;
  fs.readdirSync(d).filter(f => f.endsWith('.json')).forEach(f => {
    const p = path.join(d, f);
    try {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (Array.isArray(data)) {
        const withEmail = data.filter(item => item && item.email && item.email.includes('@'));
        if (withEmail.length > 0) {
          console.log(`${f}: ${withEmail.length} items with email (total: ${data.length})`);
        }
      }
    } catch (e) {}
  });
});
