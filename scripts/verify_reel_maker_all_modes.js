// scripts/verify_reel_maker_all_modes.js
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('=== VERIFYING REEL MAKER PLAYBACK (CANVAS & VIDEO MODES) ===');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  const consoleLogs = [];
  const errors = [];

  page.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') console.error('[PAGE ERROR LOG]:', msg.text());
  });

  page.on('pageerror', err => {
    errors.push(err.message);
    console.error('[UNCAUGHT EXCEPTION]:', err.message);
  });

  const fileUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'demo', 'reel-creator.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200));

  // --- TEST 1: Initial Page Load State ---
  const initialLoad = await page.evaluate(() => {
    const overlay = document.getElementById('reelPlayOverlay');
    const playCircle = overlay?.querySelector('.reel-play-circle');
    const canvas = document.getElementById('reelCanvas');
    const video = document.getElementById('masterMp4Player');
    const btnPlay = document.getElementById('btnPlayPause');
    return {
      isPlaying,
      currentTime,
      canvasVisible: getComputedStyle(canvas).display === 'block',
      videoVisible: getComputedStyle(video).display === 'block',
      overlayVisible: getComputedStyle(overlay).display === 'flex',
      playCircleVisible: getComputedStyle(playCircle).display === 'flex',
      btnPlayText: btnPlay?.textContent.trim()
    };
  });
  console.log('1. Initial Load Check:', initialLoad);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'reel_initial_load.png'), fullPage: false });

  // --- TEST 2: Play Interactive Canvas ---
  console.log('2. Clicking #btnPlayPause to start Canvas Playback...');
  await page.click('#btnPlayPause');
  await new Promise(r => setTimeout(r, 2000));

  const canvasPlayCheck = await page.evaluate(() => {
    return {
      isPlaying,
      currentTime: Number(currentTime.toFixed(2)),
      audioPaused: uploadedAudioElement?.paused,
      audioCurrentTime: Number(uploadedAudioElement?.currentTime.toFixed(2)),
      overlayDisplay: getComputedStyle(document.getElementById('reelPlayOverlay')).display
    };
  });
  console.log('2. Canvas Play Check (after 2s):', canvasPlayCheck);

  if (!canvasPlayCheck.isPlaying || canvasPlayCheck.currentTime <= 0) {
    throw new Error('Canvas failed to advance time during playback!');
  }

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'reel_canvas_playing.png'), fullPage: false });

  // --- TEST 3: Switch to Master MP4 Video View ---
  console.log('3. Clicking #btnViewVideo to switch to Master MP4 View...');
  await page.click('#btnViewVideo');
  await new Promise(r => setTimeout(r, 1000));

  const videoSwitchCheck = await page.evaluate(() => {
    const video = document.getElementById('masterMp4Player');
    const canvas = document.getElementById('reelCanvas');
    const overlay = document.getElementById('reelPlayOverlay');
    const btnPlay = document.getElementById('btnPlayPause');
    return {
      videoDisplay: getComputedStyle(video).display,
      canvasDisplay: getComputedStyle(canvas).display,
      overlayDisplay: getComputedStyle(overlay).display,
      videoPaused: video.paused,
      videoCurrentTime: Number(video.currentTime.toFixed(2)),
      videoDuration: Number(video.duration.toFixed(2)),
      btnPlayText: btnPlay?.textContent.trim()
    };
  });
  console.log('3. Master Video Switch Check:', videoSwitchCheck);

  if (videoSwitchCheck.overlayDisplay !== 'none') {
    throw new Error('Overlay is NOT hidden in Video view! It blocks video clicks!');
  }
  if (videoSwitchCheck.videoDisplay !== 'block') {
    throw new Error('Video element is NOT displayed in Video view!');
  }

  // --- TEST 4: Play/Pause Video via #btnPlayPause ---
  console.log('4. Testing Video Playback & Time Advance...');
  // Ensure video is playing
  await page.evaluate(() => {
    const video = document.getElementById('masterMp4Player');
    if (video.paused) video.play();
  });
  await new Promise(r => setTimeout(r, 2500));

  const videoPlaybackCheck = await page.evaluate(() => {
    const video = document.getElementById('masterMp4Player');
    const progressFill = document.getElementById('progressFill');
    const currentTimeLabel = document.getElementById('currentTimeLabel');
    return {
      videoPaused: video.paused,
      videoCurrentTime: Number(video.currentTime.toFixed(2)),
      progressWidth: progressFill?.style.width,
      currentTimeLabel: currentTimeLabel?.textContent
    };
  });
  console.log('4. Video Playback Check (after 2.5s):', videoPlaybackCheck);

  if (videoPlaybackCheck.videoPaused || videoPlaybackCheck.videoCurrentTime <= 0.5) {
    throw new Error('Video did not advance currentTime while playing!');
  }

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'reel_mp4_playing.png'), fullPage: false });

  // Pause video via #btnPlayPause
  console.log('Pausing video via #btnPlayPause...');
  await page.click('#btnPlayPause');
  await new Promise(r => setTimeout(r, 600));

  const videoPauseCheck = await page.evaluate(() => {
    const video = document.getElementById('masterMp4Player');
    const btnPlay = document.getElementById('btnPlayPause');
    return {
      videoPaused: video.paused,
      btnPlayText: btnPlay?.textContent.trim()
    };
  });
  console.log('Video Pause Check:', videoPauseCheck);

  if (!videoPauseCheck.videoPaused) {
    throw new Error('Video failed to pause via #btnPlayPause!');
  }

  // --- TEST 5: Video Timeline Seeking ---
  console.log('5. Testing Timeline Scrubber on Video...');
  await page.evaluate(() => {
    jumpToScene(35.0); // Jump to scene 3 (35 seconds in)
  });
  await new Promise(r => setTimeout(r, 500));

  const seekCheck = await page.evaluate(() => {
    const video = document.getElementById('masterMp4Player');
    const progressFill = document.getElementById('progressFill');
    const currentTimeLabel = document.getElementById('currentTimeLabel');
    return {
      videoCurrentTime: Number(video.currentTime.toFixed(2)),
      currentTime: Number(currentTime.toFixed(2)),
      progressWidth: progressFill?.style.width,
      currentTimeLabel: currentTimeLabel?.textContent
    };
  });
  console.log('5. Video Scrubber Seek Check:', seekCheck);

  if (Math.abs(seekCheck.videoCurrentTime - 35.0) > 1.0) {
    throw new Error('Video scrubber did not jump to target scene!');
  }

  // --- TEST 6: Switch back to Canvas ---
  console.log('6. Switching back to Interactive Canvas...');
  await page.click('#btnViewCanvas');
  await new Promise(r => setTimeout(r, 800));

  const canvasRestoreCheck = await page.evaluate(() => {
    const video = document.getElementById('masterMp4Player');
    const canvas = document.getElementById('reelCanvas');
    const overlay = document.getElementById('reelPlayOverlay');
    return {
      videoDisplay: getComputedStyle(video).display,
      canvasDisplay: getComputedStyle(canvas).display,
      overlayDisplay: getComputedStyle(overlay).display,
      videoPaused: video.paused,
      currentTime: Number(currentTime.toFixed(2))
    };
  });
  console.log('6. Canvas Restored Check:', canvasRestoreCheck);

  if (canvasRestoreCheck.canvasDisplay !== 'block' || canvasRestoreCheck.videoDisplay !== 'none') {
    throw new Error('Canvas failed to restore properly!');
  }

  console.log('--- Checking for uncaught errors during run ---');
  console.log('Total Exceptions:', errors.length);
  if (errors.length > 0) {
    console.error('Errors encountered:', errors);
    throw new Error(`Encountered ${errors.length} browser errors during test`);
  }

  await browser.close();
  console.log('🎉 ALL PLAYBACK TESTS PASSED PERFECTLY!');
})();
