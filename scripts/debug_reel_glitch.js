const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function debugReelGlitch() {
  console.log('🔍 Debugging reel generation click in Edge...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log(`[Browser Console ${msg.type()}]:`, msg.text()));
  page.on('pageerror', err => console.error('[Page Error]:', err.message));

  const url = `file:///${path.resolve('website/demo/reel-creator.html').replace(/\\/g, '/')}`;
  await page.goto(url, { waitUntil: 'load', timeout: 20000 });
  console.log('Page loaded.');

  // Check Giant Button
  const btn = await page.$('#btnGiantGenerateReel');
  console.log('Giant button found:', !!btn);

  // Check other generate buttons if any
  const genBtn = await page.$('#btnGeneratePromptAndReel');
  console.log('btnGeneratePromptAndReel found:', !!genBtn);

  if (btn) {
    console.log('Clicking #btnGiantGenerateReel...');
    await btn.click();
    await new Promise(r => setTimeout(r, 4000));
  } else if (genBtn) {
    console.log('Clicking #btnGeneratePromptAndReel...');
    await genBtn.click();
    await new Promise(r => setTimeout(r, 4000));
  }

  // Check state
  const state = await page.evaluate(() => {
    return {
      isPlaying: window.IS_PLAYING,
      isRendering: window.IS_RENDERING_REEL,
      rotationIndex: window.PRODUCT_ROTATION_INDEX,
      activeStory: window.ACTIVE_STORY ? window.ACTIVE_STORY.storyTitle : null,
      overlayDisplay: document.getElementById('reelRenderingOverlay') ? document.getElementById('reelRenderingOverlay').style.display : null,
      videoStageScroll: window.scrollY
    };
  });

  console.log('State after click:', state);

  await browser.close();
}

debugReelGlitch();
