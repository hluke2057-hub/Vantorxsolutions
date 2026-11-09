const https = require('https');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

(async () => {
  try {
    const res = await fetchPage('https://www.instagram.com/taskless.ai/');
    console.log('Status:', res.status);
    console.log('Body length:', res.body.length);
    // Find any JSON data or meta tags
    const metaMatches = res.body.match(/<meta[^>]+>/g) || [];
    metaMatches.forEach(m => {
      if (m.includes('description') || m.includes('title') || m.includes('image')) {
        console.log(m);
      }
    });
  } catch (e) {
    console.error('Fetch error:', e.message);
  }
})();
