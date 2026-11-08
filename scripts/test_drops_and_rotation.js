const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1100 });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  const url = 'file:///' + path.resolve(__dirname, '..', 'website', 'demo', 'reel-creator.html').replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Select Morning Drop
  console.log('Testing selectDailySlot("morning")...');
  await page.evaluate(() => {
    window.selectDailySlot('morning');
  });
  await new Promise(r => setTimeout(r, 500));
  
  let state = await page.evaluate(() => ({
    isPlaying: window.isPlaying,
    currentTime: window.currentTime,
    activeStory: window.ACTIVE_STORY ? window.ACTIVE_STORY.storyType : null,
    storyTitle: window.ACTIVE_STORY ? window.ACTIVE_STORY.storyTitle : null
  }));
  console.log('Morning state:', state);

  // 2. Select Evening Drop
  console.log('Testing selectDailySlot("evening")...');
  await page.evaluate(() => {
    window.selectDailySlot('evening');
  });
  await new Promise(r => setTimeout(r, 500));
  
  state = await page.evaluate(() => ({
    isPlaying: window.isPlaying,
    currentTime: window.currentTime,
    activeStory: window.ACTIVE_STORY ? window.ACTIVE_STORY.storyType : null,
    storyTitle: window.ACTIVE_STORY ? window.ACTIVE_STORY.storyTitle : null
  }));
  console.log('Evening state:', state);

  await browser.close();
})();
