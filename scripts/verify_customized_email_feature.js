// scripts/verify_customized_email_feature.js
const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('=== VERIFYING CUSTOMIZED COMPANY EMAIL IN SUCCESS/NO LUCK MODAL ===');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  const errors = [];
  page.on('pageerror', err => {
    errors.push(err.message);
    console.error('[BROWSER EXCEPTION]:', err.message);
  });

  const fileUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));

  // Clear previous test storage
  await page.evaluate(() => localStorage.clear());

  // --- 1. Open Call Log Modal for Lead #1 ---
  console.log('1. Opening Call Log Modal for Lead #1 (Palm Air)...');
  await page.evaluate(() => {
    window.openCallLogModal(window.LEADS_DATA[0].id);
  });
  await new Promise(r => setTimeout(r, 500));

  const modalState = await page.evaluate(() => {
    const modal = document.getElementById('callLogModal');
    const recipientInput = document.getElementById('callLogEmailRecipient');
    const subjectInput = document.getElementById('callLogEmailSubject');
    const bodyInput = document.getElementById('callLogEmailBody');
    const sendBtn = document.getElementById('btnAutoSendEmail');
    const leadName = document.getElementById('callLogModalLeadName')?.textContent;
    return {
      modalVisible: modal ? getComputedStyle(modal).display === 'flex' : false,
      leadName,
      recipient: recipientInput?.value,
      subject: subjectInput?.value,
      bodyExcerpt: bodyInput?.value?.substring(0, 80),
      hasSendBtn: !!sendBtn
    };
  });
  console.log('1. Modal Initial State:', modalState);

  if (!modalState.modalVisible) throw new Error('callLogModal did not open!');
  if (!modalState.hasSendBtn) throw new Error('Auto Send button not found in modal!');

  // --- 2. Test selecting "No Luck" ---
  console.log('2. Clicking "No Luck" button to verify dynamic No Luck email template...');
  await page.evaluate(() => {
    document.getElementById('btnCallOutcomeNoLuck').click();
  });
  await new Promise(r => setTimeout(r, 300));

  const noLuckState = await page.evaluate(() => {
    return {
      subject: document.getElementById('callLogEmailSubject')?.value,
      body: document.getElementById('callLogEmailBody')?.value,
      isNoLuckActive: document.getElementById('btnCallOutcomeNoLuck')?.classList.contains('active')
    };
  });
  console.log('2. No Luck Email Subject:', noLuckState.subject);
  console.log('2. Body Preview:\n', noLuckState.body.substring(0, 160) + '...\n');

  if (!noLuckState.subject.toLowerCase().includes('voicemail') && !noLuckState.subject.toLowerCase().includes('follow-up')) {
    throw new Error('Email subject did not adapt to No Luck template!');
  }
  if (!noLuckState.body.includes('Palm Air Air Conditioning')) {
    throw new Error('Email body does not contain customized company name!');
  }

  // --- 3. Test typing a custom input email ---
  console.log('3. Typing custom email into recipient input field...');
  await page.evaluate(() => {
    const input = document.getElementById('callLogEmailRecipient');
    input.value = 'owner@palm-air-florida.com';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 200));

  const badgeText = await page.evaluate(() => {
    return document.getElementById('callLogEmailStatusBadge')?.textContent;
  });
  console.log('3. Badge text after input:', badgeText);
  if (!badgeText.includes('Email Ready')) {
    throw new Error('Status badge did not reflect email ready!');
  }

  // Capture screenshot of the modal with No Luck selected and custom email input
  const screenshotPath = path.join(ARTIFACT_DIR, 'verified_call_log_custom_email.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Saved screenshot to:', screenshotPath);

  // --- 4. Test selecting "Success" (Demo Booked) ---
  console.log('4. Clicking "Success" button to verify dynamic Demo Confirmation email...');
  await page.evaluate(() => {
    document.getElementById('btnCallOutcomeSuccess').click();
  });
  await new Promise(r => setTimeout(r, 300));

  const successState = await page.evaluate(() => {
    return {
      subject: document.getElementById('callLogEmailSubject')?.value,
      body: document.getElementById('callLogEmailBody')?.value,
      isSuccessActive: document.getElementById('btnCallOutcomeSuccess')?.classList.contains('active')
    };
  });
  console.log('4. Success Email Subject:', successState.subject);
  if (!successState.subject.toLowerCase().includes('confirmed') && !successState.subject.toLowerCase().includes('demo')) {
    throw new Error('Email subject did not adapt to Success template!');
  }

  // Re-select No Luck for the final send test
  await page.evaluate(() => {
    document.getElementById('btnCallOutcomeNoLuck').click();
  });
  await new Promise(r => setTimeout(r, 200));

  // --- 5. Test "Automatically Send Email" click ---
  console.log('5. Clicking #btnAutoSendEmail...');
  await page.evaluate(() => {
    window.sendCustomizedCallEmail();
  });
  await new Promise(r => setTimeout(r, 400));

  const sendResult = await page.evaluate(() => {
    const notes = document.getElementById('callLogModalNotes')?.value;
    const sentBadge = document.getElementById('callLogEmailSentBadge')?.textContent;
    return { notes, sentBadge };
  });
  console.log('5. Send Result Notes:', sendResult.notes);
  console.log('5. Sent Badge:', sendResult.sentBadge);

  if (!sendResult.sentBadge.includes('Sent to owner@palm-air-florida.com')) {
    throw new Error('Send badge did not confirm email dispatched!');
  }
  if (!sendResult.notes.includes('Email sent to owner@palm-air-florida.com')) {
    throw new Error('Call notes did not record email dispatch!');
  }

  // --- 6. Save Call Log Result ---
  console.log('6. Saving Call Log Result...');
  await page.evaluate(() => {
    document.getElementById('btnSaveCallLog').click();
  });
  await new Promise(r => setTimeout(r, 600));

  const finalCheck = await page.evaluate(() => {
    const modal = document.getElementById('callLogModal');
    const rec = CALL_RECORDS[window.LEADS_DATA[0].id];
    return {
      modalClosed: getComputedStyle(modal).display === 'none',
      recordSaved: rec?.called,
      recordEmail: rec?.email,
      recordEmailSent: rec?.emailSent
    };
  });
  console.log('6. Final Call Record State:', finalCheck);

  if (!finalCheck.modalClosed) throw new Error('Modal did not close after saving!');
  if (!finalCheck.recordSaved) throw new Error('Call record was not saved!');
  if (finalCheck.recordEmail !== 'owner@palm-air-florida.com') throw new Error('Custom email was not persisted!');

  if (errors.length > 0) {
    throw new Error(`Encountered ${errors.length} browser errors: ${errors.join(', ')}`);
  }

  await browser.close();
  console.log('🎉 ALL CUSTOMIZED EMAIL IN SUCCESS/NO LUCK AREA TESTS PASSED!');
})();
