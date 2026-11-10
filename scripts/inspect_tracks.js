const https = require('https');
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const { spawnSync } = require('child_process');

const urls = [
  'https://scontent-mia5-1.cdninstagram.com/o1/v/t2/f2/m86/AQMgwrXH-TFPnAitqByjV-6QqfgTjJF_yP0qs7-msqID',
  'https://scontent-mia3-1.cdninstagram.com/o1/v/t2/f2/m86/AQNpNAhK-Vi8fenp62PN7gqF4cSqN6tmSoWHSD4SYeWO',
  'https://scontent-mia3-2.cdninstagram.com/o1/v/t2/f2/m78/AQMJi78fea_0qfxQ6YXN9Sj7FJo5L2ku4Kel9Wfix3jy'
];

async function download(url, dest) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (res2) => {
          const stream = fs.createWriteStream(dest);
          res2.pipe(stream);
          stream.on('finish', resolve);
        });
      } else {
        const stream = fs.createWriteStream(dest);
        res.pipe(stream);
        stream.on('finish', resolve);
      }
    }).on('error', (e) => {
      console.error('Download error:', e.message);
      resolve();
    });
  });
}

(async () => {
  for (let i = 0; i < urls.length; i++) {
    const dest = path.resolve('temp_track_' + i + '.mp4');
    await download(urls[i], dest);
    const stat = fs.existsSync(dest) ? fs.statSync(dest) : { size: 0 };
    console.log('Track ' + i + ' size: ' + stat.size + ' bytes');
    if (stat.size > 0) {
      const p = spawnSync(ffmpegPath, ['-i', dest], { encoding: 'utf8' });
      const streamLines = p.stderr.split('\n').filter(l => l.includes('Stream #'));
      console.log('Track ' + i + ' streams:', streamLines);
    }
  }
})();
