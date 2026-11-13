// scripts/export_presentation_pdf.js
// Exports the 8-Slide PRO-TECH AIR SERVICES Demo Presentation to a 16:9 Widescreen PDF and Offline ZIP Kit

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';
const DOWNLOADS_DIR = 'C:\\Users\\hungr\\Downloads';
const DESKTOP_DIR = 'C:\\Users\\hungr\\OneDrive\\Desktop';

async function generatePresentationPdf() {
  console.log('🚀 Starting Presentation PDF Export...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-device-scale-factor=1']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  const htmlUrl = 'file:///' + path.join(root, 'website/demo/pro-tech-presentation.html').replace(/\\/g, '/');
  await page.goto(htmlUrl, { waitUntil: 'networkidle0' });

  // Hide floating teleprompter drawer or unnecessary overlays during slide capture
  await page.addStyleTag({
    content: `
      .teleprompter-drawer { display: none !important; }
      #audioControls { display: none !important; }
      body { overflow: hidden !important; }
      .slides-viewport { padding: 18px !important; }
      .slide { box-shadow: 0 30px 80px rgba(0,0,0,0.85) !important; }
    `
  });

  const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
  console.log(`Found ${slideCount} slides in presentation.`);

  const slideImages = [];
  const tmpImgDir = path.join(root, 'scripts/tmp_slides');
  if (!fs.existsSync(tmpImgDir)) fs.mkdirSync(tmpImgDir, { recursive: true });

  for (let i = 1; i <= slideCount; i++) {
    await page.evaluate((idx) => {
      if (typeof window.showSlide === 'function') {
        window.showSlide(idx);
      } else {
        document.querySelectorAll('.slide').forEach((s, sIdx) => {
          if (sIdx === idx - 1) s.classList.add('active');
          else s.classList.remove('active');
        });
        const counter = document.getElementById('slideCounter');
        if (counter) counter.innerHTML = `SLIDE <strong>0${idx}</strong> / 08`;
      }
    }, i);

    // Short pause for CSS transition animation to settle
    await new Promise(r => setTimeout(r, 450));

    const imgPath = path.join(tmpImgDir, `slide_${i}.png`);
    await page.screenshot({ path: imgPath, type: 'png' });
    const b64 = fs.readFileSync(imgPath).toString('base64');
    slideImages.push({ idx: i, b64, path: imgPath });
    console.log(`Captured Slide ${i}/${slideCount} at 1920x1080`);
  }

  // Build the multi-page PDF HTML container
  let pdfHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>PRO-TECH AIR SERVICES LLC — Proposal</title>
  <style>
    @page {
      size: 1920px 1080px;
      margin: 0;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: #060911;
      width: 1920px;
    }
    .slide-page {
      width: 1920px;
      height: 1080px;
      page-break-after: always;
      break-after: page;
      display: block;
      overflow: hidden;
      position: relative;
      background: #060911;
    }
    .slide-page:last-child {
      page-break-after: avoid;
      break-after: avoid;
    }
    .slide-img {
      width: 1920px;
      height: 1080px;
      display: block;
      object-fit: cover;
    }
  </style>
</head>
<body>
`;

  slideImages.forEach(s => {
    pdfHtml += `  <div class="slide-page"><img class="slide-img" src="data:image/png;base64,${s.b64}" /></div>\n`;
  });

  pdfHtml += `</body></html>`;

  const pdfPage = await browser.newPage();
  await pdfPage.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await pdfPage.setContent(pdfHtml, { waitUntil: 'load' });

  const pdfBuffer = await pdfPage.pdf({
    width: '1920px',
    height: '1080px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true
  });

  await browser.close();

  // Save PDF to destination locations
  const outPdfName = 'PRO-TECH_AIR_SERVICES_DEMO_PRESENTATION.pdf';
  const repoPdfPath = path.join(root, 'website/demo', outPdfName);
  const downloadsPdfPath = path.join(DOWNLOADS_DIR, outPdfName);
  const desktopPdfPath = path.join(DESKTOP_DIR, outPdfName);
  const artifactPdfPath = path.join(ARTIFACT_DIR, outPdfName);

  fs.writeFileSync(repoPdfPath, pdfBuffer);
  fs.writeFileSync(downloadsPdfPath, pdfBuffer);
  if (fs.existsSync(DESKTOP_DIR)) fs.writeFileSync(desktopPdfPath, pdfBuffer);
  fs.writeFileSync(artifactPdfPath, pdfBuffer);

  const pdfSizeMb = (pdfBuffer.length / (1024 * 1024)).toFixed(2);
  console.log(`\n✅ High-Resolution PDF Generated successfully (${pdfSizeMb} MB):`);
  console.log(`  1. Downloads: ${downloadsPdfPath}`);
  console.log(`  2. Desktop:   ${desktopPdfPath}`);
  console.log(`  3. Repo:      ${repoPdfPath}`);
  console.log(`  4. Artifacts: ${artifactPdfPath}`);

  // Clean up temporary screenshots
  try {
    fs.rmSync(tmpImgDir, { recursive: true, force: true });
  } catch (e) {}

  return {
    downloadsPdfPath,
    desktopPdfPath,
    repoPdfPath,
    artifactPdfPath,
    pdfSizeMb
  };
}

generatePresentationPdf().catch(err => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});
