const https = require('https');

async function testFetch(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log(`URL: ${url} -> Status: ${res.status}`);
    const text = await res.text();
    console.log(`Length: ${text.length}`);
    return text;
  } catch (err) {
    console.error(`Fetch error for ${url}:`, err.message);
  }
}

async function run() {
  await testFetch('https://www.yellowpages.com/search?search_terms=plumbers&geo_location_terms=Miami%2C+FL');
  await testFetch('https://www.cylex.us.com/s?q=plumbing&c=Tampa&z=FL');
}

run();
