// scripts/preview_pdf_pages.js
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

// We can render each .page element directly into a PNG image!
(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1414, deviceScaleFactor: 2 }); // A4 ratio high-DPI

  // Re-read html from generator
  const genScript = fs.readFileSync(path.resolve('scripts/generate_luke_course_pdf.js'), 'utf8');
  const match = genScript.match(/const htmlContent = `([\s\S]+?)`;\n\n\(async/);
  if (!match) throw new Error('Could not parse htmlContent');

  // Eval the template in node
  const htmlFn = new Function('imgBefore1', 'imgBefore2', 'imgAfterAbs', 'imgAfterDelts', 'imgAfterFull', 'return `' + match[1] + '`;');

  function getBase64Image(filename) {
    const p = path.resolve('website/fitness/images', filename);
    return 'data:image/jpeg;base64,' + fs.readFileSync(p).toString('base64');
  }

  const renderedHtml = htmlFn(
    getBase64Image('luke_before_155_bathroom.jpg'),
    getBase64Image('luke_before_155_shirt_lift.jpg'),
    getBase64Image('luke_after_180_shredded_abs.jpg'),
    getBase64Image('luke_after_180_gym_delts.jpg'),
    getBase64Image('luke_after_180_full_physique.jpg')
  );

  await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });

  const pages = await page.$$('.page');
  console.log(`Found ${pages.length} pages in course document.`);

  for (let i = 0; i < pages.length; i++) {
    const outPath = path.join(ARTIFACT_DIR, `luke_course_page_${i + 1}.png`);
    await pages[i].screenshot({ path: outPath });
    console.log(`✓ Saved page ${i + 1} screenshot to: ${outPath}`);
  }

  await browser.close();
  console.log('--- ALL PDF PAGES CAPTURED AS SCREENSHOTS ---');
})();
