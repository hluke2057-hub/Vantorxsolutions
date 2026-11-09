// scripts/debug_reel_creator_playback.js
const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  console.log('--- DIAGNOSING REEL MAKER PLAYBACK ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  const consoleLogs = [];
  const errors = [];

  page.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
    console.log(`[BROWSER ${msg.type().toUpperCase()}]:`, msg.text());
  });

  page.on('pageerror', err => {
    errors.push(err.message);
    console.error('[BROWSER EXCEPTION]:', err.message);
  });

  const fileUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'demo', 'reel-creator.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));

  // Check state on load
  const initialInfo = await page.evaluate(() => {
    return {
      isPlaying: typeof isPlaying !== 'undefined' ? isPlaying : 'undefined',
      currentTime: typeof currentTime !== 'undefined' ? currentTime : 'undefined',
      audioSrc: document.getElementById('masterAudio')?.src || 'no masterAudio element',
      btnPlayText: document.getElementById('btnPlay')?.textContent || 'no btnPlay',
      canvas: !!document.getElementById('reelCanvas')
    };
  });
  console.log('Initial state on page load:', initialInfo);

  // Click Play
  console.log('Simulating click on #btnPlay...');
  const playResult = await page.evaluate(async () => {
    const btn = document.getElementById('btnPlay');
    if (!btn) return 'btnPlay not found';
    try {
      btn.click();
      return 'clicked btnPlay successfully';
    } catch (err) {
      return 'Error clicking btnPlay: ' + err.message;
    }
  });
  console.log('Play button click action:', playResult);

  // Wait 1.5 seconds to see if playback advances
  await new Promise(r => setTimeout(r, 1500));

  const afterPlayInfo = await page.evaluate(() => {
    return {
      isPlaying: typeof isPlaying !== 'undefined' ? isPlaying : 'undefined',
      currentTime: typeof currentTime !== 'undefined' ? currentTime : 'undefined',
      audioPaused: document.getElementById('masterAudio')?.paused,
      audioCurrentTime: document.getElementById('masterAudio')?.currentTime,
      audioDuration: document.getElementById('masterAudio')?.duration,
      audioError: document.getElementById('masterAudio')?.error?.message || null,
      btnPlayText: document.getElementById('btnPlay')?.textContent
    };
  });
  console.log('State after 1.5s playback attempt:', afterPlayInfo);

  // Test calling togglePlay directly
  console.log('Testing togglePlay() directly...');
  const directToggleResult = await page.evaluate(() => {
    if (typeof togglePlay === 'function') {
      try {
        togglePlay();
        return { called: true, isPlaying, currentTime };
      } catch (e) {
        return { error: e.message, stack: e.stack };
      }
    }
    return { error: 'togglePlay is not a function' };
  });
  console.log('Direct togglePlay result:', directToggleResult);

  await new Promise(r => setTimeout(r, 1000));

  const secondCheck = await page.evaluate(() => {
    return {
      isPlaying,
      currentTime,
      audioPaused: document.getElementById('masterAudio')?.paused,
      audioCurrentTime: document.getElementById('masterAudio')?.currentTime
    };
  });
  console.log('Second check state:', secondCheck);

  await browser.close();
  console.log('--- DIAGNOSTIC COMPLETE ---');
})();
