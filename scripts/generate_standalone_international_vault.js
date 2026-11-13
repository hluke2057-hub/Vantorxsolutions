// scripts/generate_standalone_international_vault.js
// Creates website/cold-call-arena/international-vault.html as a standalone dashboard

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const arenaHtmlPath = path.join(root, 'website', 'cold-call-arena', 'index.html');
const standalonePath = path.join(root, 'website', 'cold-call-arena', 'international-vault.html');

let html = fs.readFileSync(arenaHtmlPath, 'utf8');

// Replace title
html = html.replace(/<title>[\s\S]*?<\/title>/, '<title>VantorX — Private International Vault (150 English-Speaking Local Business Targets)</title>');

// Auto-switch to tabNoWebsite on load
html = html.replace('// Auto-switch tabs from URL hash', `
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.switchTab === 'function') {
    window.switchTab('tabNoWebsite');
  }
});
// Auto-switch tabs from URL hash`);

fs.writeFileSync(standalonePath, html, 'utf8');
console.log('✅ Generated standalone international-vault.html at:', standalonePath);
