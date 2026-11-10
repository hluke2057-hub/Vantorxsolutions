const puppeteer = require('puppeteer-core');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const urls = [
  'https://www.instagram.com/reel/DfYw8NXtIlL/',
  'https://www.instagram.com/reel/DfER2bzxQJj/',
  'https://www.instagram.com/reel/DfL4zEcNnmf/'
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  for (let i = 0; i < urls.length; i++) {
    const u = urls[i];
    console.log('Fetching:', u);
    try {
      await page.goto(u, { waitUntil: 'networkidle2', timeout: 25000 });
      await new Promise(r => setTimeout(r, 2000));
      const info = await page.evaluate(() => {
        const ogTitle = document.querySelector('meta[property="og:title"]')?.content;
        const ogDesc = document.querySelector('meta[property="og:description"]')?.content;
        const ogImage = document.querySelector('meta[property="og:image"]')?.content;
        const ogVideo = document.querySelector('meta[property="og:video"]')?.content;
        const title = document.title;
        // Check for account name or caption text
        const bodyText = document.body.innerText.slice(0, 1000);
        return { title, ogTitle, ogDesc, ogImage, ogVideo, bodyPreview: bodyText };
      });
      console.log('Result for', u, ':', JSON.stringify(info, null, 2));

      // Take a screenshot of each reel page so we can visually see what's on screen!
      const shotPath = `C:\\Users\\hungr\\.gemini\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0\\ig_reel_${i + 1}.png`;
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log('Saved screenshot to:', shotPath);
    } catch (e) {
      console.error('Error fetching', u, e.message);
    }
  }
  await browser.close();
})();
