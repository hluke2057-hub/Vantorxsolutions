const https = require('https');

https.get('https://www.vantorxsolutions.com/cold-call-arena/index.html', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const idx = data.indexOf('function syncCallRecordToCloud');
    if (idx !== -1) {
      console.log('--- Deployed syncCallRecordToCloud ---');
      console.log(data.slice(idx, idx + 1200));
    } else {
      console.log('Not found');
    }
  });
}).on('error', (e) => console.error(e));
