const https = require('https');

https.get('https://www.vantorxsolutions.com/demo/reel', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status /demo/reel:', res.statusCode);
    console.log('Length:', data.length);
    console.log('Contains EMBEDDED_STUDIO_AUDIO:', data.includes('EMBEDDED_STUDIO_AUDIO'));
    console.log('Contains Uranus:', data.includes('Uranus'));
    const idx = data.indexOf('REEL_SCENES');
    if (idx !== -1) {
      console.log('REEL_SCENES snippet:');
      console.log(data.slice(idx, idx + 1500));
    }
  });
}).on('error', console.error);
