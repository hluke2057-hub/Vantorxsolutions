const fs = require('fs');

let c = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');
const search = `      if (isFounder) {
        row.addEventListener('click', () => {
          window.quickSwitchCaller(uid);
          const accountModal = document.getElementById('accountModal');
          if (accountModal) accountModal.classList.remove('active');
        });
      }`;

const replace = `      if (isFounder) {
        row.addEventListener('click', () => {
          if (uid === activeUserId) return;
          const accountModal = document.getElementById('accountModal');
          if (accountModal) accountModal.classList.remove('active');
          window.quickSwitchCaller(uid);
        });
      }`;

if (c.includes(search)) {
  c = c.replace(search, replace);
  fs.writeFileSync('website/cold-call-arena/index.html', c, 'utf8');
  console.log('✓ Successfully updated row click in arena!');
} else {
  console.log('Searching pattern with CRLF normalized...');
  const cNorm = c.replace(/\r\n/g, '\n');
  const searchNorm = search.replace(/\r\n/g, '\n');
  const replaceNorm = replace.replace(/\r\n/g, '\n');
  if (cNorm.includes(searchNorm)) {
    c = cNorm.replace(searchNorm, replaceNorm);
    fs.writeFileSync('website/cold-call-arena/index.html', c, 'utf8');
    console.log('✓ Successfully updated normalized row click in arena!');
  } else {
    console.error('Could not find search pattern!');
  }
}
