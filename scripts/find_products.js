const fs = require('fs');

const content = fs.readFileSync('website/index.html', 'utf8');

// Find service sections
const sections = ['Ava 24/7', 'Websites', 'LeadFlow', 'Core Offerings', 'Packages', 'Accelerate', 'Scale'];
sections.forEach(s => {
  let idx = 0;
  while ((idx = content.indexOf(s, idx)) !== -1) {
    console.log(`Found "${s}" at index ${idx}:`);
    console.log(content.slice(idx - 50, idx + 250));
    console.log('-----------------------------------');
    idx += s.length + 500;
  }
});
