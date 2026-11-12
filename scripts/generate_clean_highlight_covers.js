// scripts/generate_clean_highlight_covers.js
// Generates ultra-clean 1080x1080 minimalist Instagram Highlight Covers
// matching VantorX dark obsidian + neon emerald/cyan/gold aesthetics with circle-crop safety.

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = path.resolve('website/assets/instagram/covers');
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

fs.mkdirSync(OUT_DIR, { recursive: true });

const COVERS = [
  {
    file: 'cover_01_ava_ai.png',
    label: 'AVA AI',
    accent: '#34d399',
    accent2: '#38bdf8',
    glow: 'rgba(52, 211, 153, 0.28)',
    svg: `
      <svg viewBox="0 0 240 240" width="380" height="380" fill="none">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#34d399"/>
            <stop offset="100%" stop-color="#38bdf8"/>
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="92" stroke="url(#g1)" stroke-width="2.5" stroke-opacity="0.35" stroke-dasharray="8 8"/>
        <rect x="96" y="48" width="48" height="86" rx="24" stroke="url(#g1)" stroke-width="7"/>
        <line x1="108" y1="76" x2="132" y2="76" stroke="url(#g1)" stroke-width="5" stroke-linecap="round"/>
        <line x1="108" y1="92" x2="132" y2="92" stroke="url(#g1)" stroke-width="5" stroke-linecap="round"/>
        <line x1="108" y1="108" x2="132" y2="108" stroke="url(#g1)" stroke-width="5" stroke-linecap="round"/>
        <path d="M68 112 C68 148, 172 148, 172 112" stroke="url(#g1)" stroke-width="7" stroke-linecap="round"/>
        <line x1="120" y1="146" x2="120" y2="180" stroke="url(#g1)" stroke-width="7" stroke-linecap="round"/>
        <line x1="90" y1="180" x2="150" y2="180" stroke="url(#g1)" stroke-width="7" stroke-linecap="round"/>
        <path d="M46 96 L46 124 M30 104 L30 116 M194 96 L194 124 M210 104 L210 116" stroke="#34d399" stroke-width="5" stroke-linecap="round" stroke-opacity="0.8"/>
      </svg>
    `
  },
  {
    file: 'cover_02_leadflow.png',
    label: 'LEADFLOW',
    accent: '#38bdf8',
    accent2: '#818cf8',
    glow: 'rgba(56, 189, 248, 0.28)',
    svg: `
      <svg viewBox="0 0 240 240" width="380" height="380" fill="none">
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="100%" stop-color="#a78bfa"/>
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="92" stroke="url(#g2)" stroke-width="2.5" stroke-opacity="0.35" stroke-dasharray="8 8"/>
        <polygon points="134,42 74,132 116,132 104,198 168,104 124,104" stroke="url(#g2)" stroke-width="7" stroke-linejoin="round" fill="rgba(56,189,248,0.10)"/>
      </svg>
    `
  },
  {
    file: 'cover_03_websites.png',
    label: 'WEBSITES',
    accent: '#fbbf24',
    accent2: '#f97316',
    glow: 'rgba(251, 191, 36, 0.25)',
    svg: `
      <svg viewBox="0 0 240 240" width="380" height="380" fill="none">
        <defs>
          <linearGradient id="g3" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#fbbf24"/>
            <stop offset="100%" stop-color="#f97316"/>
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="92" stroke="url(#g3)" stroke-width="2.5" stroke-opacity="0.35" stroke-dasharray="8 8"/>
        <rect x="66" y="48" width="108" height="144" rx="18" stroke="url(#g3)" stroke-width="7"/>
        <line x1="104" y1="64" x2="136" y2="64" stroke="url(#g3)" stroke-width="5" stroke-linecap="round"/>
        <rect x="82" y="84" width="76" height="44" rx="8" stroke="url(#g3)" stroke-width="5" fill="rgba(251,191,36,0.08)"/>
        <rect x="82" y="142" width="76" height="22" rx="11" fill="url(#g3)"/>
      </svg>
    `
  },
  {
    file: 'cover_04_aeo_rank.png',
    label: 'AEO RANK',
    accent: '#c084fc',
    accent2: '#38bdf8',
    glow: 'rgba(192, 132, 252, 0.28)',
    svg: `
      <svg viewBox="0 0 240 240" width="380" height="380" fill="none">
        <defs>
          <linearGradient id="g4" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#e879f9"/>
            <stop offset="100%" stop-color="#38bdf8"/>
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="92" stroke="url(#g4)" stroke-width="2.5" stroke-opacity="0.35" stroke-dasharray="8 8"/>
        <circle cx="108" cy="108" r="50" stroke="url(#g4)" stroke-width="7"/>
        <line x1="145" y1="145" x2="186" y2="186" stroke="url(#g4)" stroke-width="9" stroke-linecap="round"/>
        <path d="M108 74 L115 99 L140 106 L115 113 L108 138 L101 113 L76 106 L101 99 Z" fill="url(#g4)"/>
      </svg>
    `
  },
  {
    file: 'cover_05_accelerate.png',
    label: 'ACCELERATE',
    accent: '#34d399',
    accent2: '#fbbf24',
    glow: 'rgba(52, 211, 153, 0.26)',
    svg: `
      <svg viewBox="0 0 240 240" width="380" height="380" fill="none">
        <defs>
          <linearGradient id="g5" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#34d399"/>
            <stop offset="100%" stop-color="#fbbf24"/>
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="92" stroke="url(#g5)" stroke-width="2.5" stroke-opacity="0.35" stroke-dasharray="8 8"/>
        <polygon points="120,48 188,82 120,116 52,82" stroke="url(#g5)" stroke-width="6.5" stroke-linejoin="round" fill="rgba(52,211,153,0.10)"/>
        <polyline points="52,120 120,154 188,120" stroke="url(#g5)" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="52,158 120,192 188,158" stroke="url(#g5)" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `
  },
  {
    file: 'cover_06_results.png',
    label: 'RESULTS',
    accent: '#10b981',
    accent2: '#34d399',
    glow: 'rgba(16, 185, 129, 0.28)',
    svg: `
      <svg viewBox="0 0 240 240" width="380" height="380" fill="none">
        <defs>
          <linearGradient id="g6" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#34d399"/>
            <stop offset="100%" stop-color="#38bdf8"/>
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="92" stroke="url(#g6)" stroke-width="2.5" stroke-opacity="0.35" stroke-dasharray="8 8"/>
        <polyline points="58,154 96,116 126,138 180,74" stroke="url(#g6)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="148,74 180,74 180,106" stroke="url(#g6)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="58" y1="178" x2="182" y2="178" stroke="url(#g6)" stroke-width="5" stroke-opacity="0.5" stroke-linecap="round"/>
      </svg>
    `
  },
  {
    file: 'cover_07_live_demo.png',
    label: 'LIVE DEMO',
    accent: '#f59e0b',
    accent2: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.28)',
    svg: `
      <svg viewBox="0 0 240 240" width="380" height="380" fill="none">
        <defs>
          <linearGradient id="g7" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#fbbf24"/>
            <stop offset="100%" stop-color="#34d399"/>
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="92" stroke="url(#g7)" stroke-width="2.5" stroke-opacity="0.35" stroke-dasharray="8 8"/>
        <path d="M84 58 L108 58 L118 90 L98 106 C108 124 122 138 140 148 L156 128 L188 138 L188 162 C188 176 172 186 156 182 C104 168 68 132 58 84 C54 68 68 58 84 58 Z" stroke="url(#g7)" stroke-width="7" stroke-linejoin="round" fill="rgba(251,191,36,0.10)"/>
        <path d="M138 72 C158 76 168 88 172 106" stroke="#34d399" stroke-width="6" stroke-linecap="round"/>
        <path d="M138 92 C148 94 152 100 154 108" stroke="#34d399" stroke-width="6" stroke-linecap="round"/>
      </svg>
    `
  },
  {
    file: 'cover_08_scale_fleet.png',
    label: 'SCALE',
    accent: '#38bdf8',
    accent2: '#34d399',
    glow: 'rgba(56, 189, 248, 0.26)',
    svg: `
      <svg viewBox="0 0 240 240" width="380" height="380" fill="none">
        <defs>
          <linearGradient id="g8" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="100%" stop-color="#34d399"/>
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="92" stroke="url(#g8)" stroke-width="2.5" stroke-opacity="0.35" stroke-dasharray="8 8"/>
        <path d="M120 48 L178 72 L178 122 C178 158 152 184 120 194 C88 184 62 158 62 122 L62 72 Z" stroke="url(#g8)" stroke-width="7" stroke-linejoin="round" fill="rgba(56,189,248,0.08)"/>
        <polyline points="94,122 114,142 152,102" stroke="url(#g8)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `
  }
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });

  for (const c of COVERS) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: 1080px;
            height: 1080px;
            background: radial-gradient(circle at 50% 48%, #0f172a 0%, #070a11 58%, #030508 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif;
            overflow: hidden;
          }
          .aura {
            position: absolute;
            width: 640px;
            height: 640px;
            border-radius: 50%;
            background: radial-gradient(circle, ${c.glow} 0%, transparent 70%);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            filter: blur(36px);
          }
          .safe-ring {
            width: 620px;
            height: 620px;
            border-radius: 50%;
            border: 3px solid rgba(255, 255, 255, 0.08);
            background: radial-gradient(circle at 50% 35%, rgba(255,255,255,0.05) 0%, rgba(10,15,25,0.92) 75%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
            box-shadow: inset 0 0 80px rgba(0,0,0,0.65), 0 0 90px ${c.glow};
          }
          .label {
            margin-top: -12px;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: 0.22em;
            color: #f8fafc;
            text-transform: uppercase;
            opacity: 0.92;
          }
        </style>
      </head>
      <body>
        <div class="aura"></div>
        <div class="safe-ring">
          ${c.svg}
          <div class="label">${c.label}</div>
        </div>
      </body>
      </html>
    `;
    await page.setContent(html, { waitUntil: 'load' });
    const outFile = path.join(OUT_DIR, c.file);
    await page.screenshot({ path: outFile, type: 'png' });
    fs.copyFileSync(outFile, path.join(ARTIFACT_DIR, c.file));
    console.log('Generated clean cover:', c.file);
  }

  await browser.close();
  console.log('All 8 clean Instagram Highlight covers generated successfully!');
})();
