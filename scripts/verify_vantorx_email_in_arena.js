// scripts/verify_vantorx_email_in_arena.js
const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('Launching browser to test VantorX Email Sender in Cold Call Arena...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const htmlUrl = 'file:///' + path.resolve('website/cold-call-arena/index.html').replace(/\\/g, '/');
  console.log('Navigating to:', htmlUrl);
  await page.goto(htmlUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Open call log modal for Quality Air (bw_034)
  console.log('Opening call modal for lead bw_034 (Quality Air Conditioning Company)...');
  await page.evaluate(() => {
    window.openCallLogModal('bw_034');
  });

  await new Promise(r => setTimeout(r, 600));

  // Check sender text
  const senderText = await page.evaluate(() => {
    return document.getElementById('vantorxSenderDisplay')?.textContent;
  });
  console.log('Sender Display Text:', senderText);

  // Set recipient
  await page.evaluate(() => {
    const input = document.getElementById('callLogEmailRecipient');
    input.value = 'service@qualityairflorida.com';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  const btnSendText = await page.evaluate(() => {
    return document.getElementById('btnAutoSendEmail')?.textContent?.trim();
  });
  console.log('Send Button Text:', btnSendText);

  // Click Send via VantorX Email
  console.log('Clicking Send via VantorX Email button with recipient service@qualityairflorida.com...');
  await page.evaluate(() => {
    document.getElementById('btnAutoSendEmail')?.click();
  });

  await new Promise(r => setTimeout(r, 1200));

  const sentBadgeText = await page.evaluate(() => {
    return document.getElementById('callLogEmailSentBadge')?.textContent;
  });
  console.log('Sent Badge Result:', sentBadgeText);

  const notesText = await page.evaluate(() => {
    return document.getElementById('callLogModalNotes')?.value;
  });
  console.log('Call Notes Audit Trail:', notesText);

  // Screenshot modal
  const screenshotPath = path.join(ARTIFACT_DIR, 'verified_vantorx_email_sender_modal.png');
  await page.screenshot({ path: screenshotPath });
  console.log('✅ Screenshot saved to:', screenshotPath);

  await browser.close();
  console.log('Finished Arena Email verification successfully!');
})();
