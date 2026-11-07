const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  path.join(__dirname, '..', 'website', 'index.html'),
  path.join(__dirname, '..', 'website', 'motion-mock', 'index.html'),
  path.join(__dirname, '..', 'website', 'privacy', 'index.html'),
  path.join(__dirname, '..', 'website', 'terms', 'index.html')
];

filesToUpdate.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log('Skipping missing file:', f);
    return;
  }

  let raw = fs.readFileSync(f, 'utf8');
  const isCRLF = raw.includes('\r\n');
  let content = raw.replace(/\r\n/g, '\n');

  // Replace sticky header in index.html and motion-mock
  if (content.includes('header {\n  position: sticky;\n  top: 37px;')) {
    content = content.replace(
      'header {\n  position: sticky;\n  top: 37px;',
      'header {\n  position: relative;\n  top: 0;'
    );
    console.log('✅ Replaced sticky header (top: 37px) in:', f);
  } else if (content.includes('position:sticky;top:0;')) {
    content = content.replace('position:sticky;top:0;', 'position:relative;top:0;');
    console.log('✅ Replaced position:sticky;top:0 in:', f);
  }

  // Replace sticky in .demo-controller-bar
  if (content.includes('.demo-controller-bar {\n  position: sticky;\n  top: 0;')) {
    content = content.replace(
      '.demo-controller-bar {\n  position: sticky;\n  top: 0;',
      '.demo-controller-bar {\n  position: relative;\n  top: 0;'
    );
    console.log('✅ Replaced .demo-controller-bar sticky in:', f);
  }

  if (isCRLF) {
    content = content.replace(/\n/g, '\r\n');
  }

  fs.writeFileSync(f, content, 'utf8');
});

console.log('🎉 Done updating headers!');
