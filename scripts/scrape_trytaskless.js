const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('--- SCRAPING TRYTASKLESS.AI ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  try {
    const url = 'https://trytaskless.ai';
    console.log(`Navigating to ${url}...`);
    const resp = await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('Response Status:', resp ? resp.status() : 'null');
    await new Promise(r => setTimeout(r, 3000));

    // Full page screenshot
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'trytaskless_home_full.png'), fullPage: true });
    console.log('Captured trytaskless_home_full.png');

    // Extract structure, videos, social links, styles
    const siteData = await page.evaluate(() => {
      const title = document.title;
      const allLinks = Array.from(document.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.href
      }));
      const socialLinks = allLinks.filter(l => 
        l.href.includes('instagram') || 
        l.href.includes('tiktok') || 
        l.href.includes('youtube') || 
        l.href.includes('twitter') || 
        l.href.includes('x.com') || 
        l.href.includes('linkedin')
      );
      const videos = Array.from(document.querySelectorAll('video, iframe')).map(v => ({
        tag: v.tagName,
        src: v.src || v.getAttribute('src'),
        poster: v.getAttribute('poster')
      }));
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => ({
        tag: h.tagName,
        text: h.innerText.trim()
      }));
      const bodyText = document.body.innerText;
      return { title, socialLinks, allLinks: allLinks.slice(0, 50), videos, headings, bodyLength: bodyText.length, bodyTextSample: bodyText.slice(0, 3000) };
    });

    console.log('Site Data:', JSON.stringify(siteData, null, 2));
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'trytaskless_data.json'), JSON.stringify(siteData, null, 2), 'utf8');

    // Also check Instagram or social links found
    if (siteData.socialLinks.length > 0) {
      console.log('Found Social Links:', siteData.socialLinks);
      for (const s of siteData.socialLinks) {
        if (s.href.includes('instagram')) {
          console.log('Navigating to IG link:', s.href);
          const igPage = await browser.newPage();
          await igPage.setViewport({ width: 1440, height: 1200 });
          try {
            await igPage.goto(s.href, { waitUntil: 'networkidle2', timeout: 25000 });
            await new Promise(r => setTimeout(r, 2000));
            await igPage.screenshot({ path: path.join(ARTIFACTS_DIR, 'trytaskless_instagram.png') });
            console.log('Captured trytaskless_instagram.png');
          } catch(e) {
            console.log('Error loading IG:', e.message);
          } finally {
            await igPage.close();
          }
        }
      }
    }

  } catch (err) {
    console.error('Scrape error:', err.message);
  } finally {
    await browser.close();
  }
})();
