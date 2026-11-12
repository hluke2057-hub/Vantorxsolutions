const puppeteer = require('puppeteer-core');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const fs = require('fs');
const https = require('https');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new' });
  const page = await browser.newPage();
  let videoBaseUrl = null;
  let audioBaseUrl = null;

  page.on('response', async resp => {
    const url = resp.url();
    if (url.includes('/m86/AQ') && !videoBaseUrl) {
      videoBaseUrl = url.replace(/&bytestart=\d+&byteend=\d+/, '');
      console.log('FOUND FULL VIDEO BASE URL:', videoBaseUrl);
    }
    if (url.includes('/m78/AQ') && !audioBaseUrl) {
      audioBaseUrl = url.replace(/&bytestart=\d+&byteend=\d+/, '');
      console.log('FOUND FULL AUDIO BASE URL:', audioBaseUrl);
    }
  });

  await page.goto('https://www.instagram.com/reel/DfjYNESOhdF/', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.evaluate(() => {
    const btn = document.querySelector('svg[aria-label="Close"]');
    if (btn && btn.closest('button')) btn.closest('button').click();
    const v = document.querySelector('video');
    if (v) { v.muted = false; v.play(); }
  });
  await new Promise(r => setTimeout(r, 4000));
  await browser.close();

  if (videoBaseUrl && audioBaseUrl) {
    console.log('Downloading video stream...');
    await downloadFile(videoBaseUrl, 'cueva_video_stream.mp4');
    console.log('Downloading audio stream...');
    await downloadFile(audioBaseUrl, 'cueva_audio_stream.mp4');

    console.log('Muxing video and audio with ffmpeg...');
    const outMuxed = 'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0/cueva_full_with_sound.mp4';
    const proc = spawn(ffmpegPath, [
      '-i', 'cueva_video_stream.mp4',
      '-i', 'cueva_audio_stream.mp4',
      '-c:v', 'copy',
      '-c:a', 'aac',
      '-y',
      outMuxed
    ]);

    proc.on('close', code => {
      console.log('Muxed finished with code', code);
      if (fs.existsSync(outMuxed)) {
        console.log('SUCCESS! Full Cueva reference reel with original sound:', outMuxed, fs.statSync(outMuxed).size, 'bytes');
      }
    });
  }
})();

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Saved', dest, fs.statSync(dest).size, 'bytes');
        resolve();
      });
    }).on('error', reject);
  });
}
