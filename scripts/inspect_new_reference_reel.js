const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const https = require('https');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

const reelUrl = 'https://www.instagram.com/reel/DfjYNESOhdF/?rpxt=MmhseW5yZGh6d3pw';

(async () => {
  console.log('--- INSPECTING NEW REFERENCE REEL ---');
  console.log('Target URL:', reelUrl);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });

  let videoUrl = null;
  page.on('response', async resp => {
    const url = resp.url();
    if (url.includes('.mp4') || (resp.headers()['content-type'] && resp.headers()['content-type'].includes('video/mp4'))) {
      if (!videoUrl && (url.includes('cdninstagram.com') || url.includes('fbcdn.net'))) {
        videoUrl = url;
        console.log('FOUND INSTAGRAM REEL MP4 STREAM:', url);
      }
    }
  });

  try {
    await page.goto(reelUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  } catch (e) {
    console.log('Navigation timeout or note:', e.message);
  }

  await new Promise(r => setTimeout(r, 4000));

  // Extract meta tags: title, description, og:title, og:description, author
  const meta = await page.evaluate(() => {
    const getMeta = (prop) => {
      const el = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`);
      return el ? el.getAttribute('content') : null;
    };
    const videoEl = document.querySelector('video');
    return {
      title: document.title,
      ogTitle: getMeta('og:title'),
      ogDescription: getMeta('og:description'),
      description: getMeta('description'),
      videoSrc: videoEl ? videoEl.src : null
    };
  });

  console.log('Extracted Meta:', meta);

  // Take screenshot of the page view
  const pageShot = path.join(ARTIFACTS_DIR, 'ref_reel_page_screenshot.png');
  await page.screenshot({ path: pageShot });
  console.log('Saved page screenshot ->', pageShot);

  const targetStream = videoUrl || meta.videoSrc;
  if (targetStream) {
    console.log('Downloading MP4 video stream from:', targetStream);
    const dest = path.join(ARTIFACTS_DIR, 'new_reference_reel.mp4');
    const file = fs.createWriteStream(dest);

    await new Promise((resolve, reject) => {
      https.get(targetStream, res => {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('DOWNLOADED new_reference_reel.mp4 successfully! Size:', fs.statSync(dest).size);
          resolve();
        });
      }).on('error', err => {
        console.error('Download error:', err);
        reject(err);
      });
    });
  } else {
    console.log('Could not locate direct video stream. Looking for video elements on page...');
  }

  await browser.close();
  console.log('Done inspecting reel.');
})();
