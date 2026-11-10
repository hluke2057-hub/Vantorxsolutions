// scripts/verify_gmail_and_killer_templates.js
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('=== VERIFYING GMAIL INTEGRATION & KILLER PRODUCT EMAIL TEMPLATES ===');

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
    console.error('[BROWSER ERROR]:', err.message);
  });

  const fileUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html').replace(/\\/g, '/');
  console.log('Opening:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200));

  // Sign in as Luke / dismiss gate
  await page.evaluate(() => {
    localStorage.setItem('vantorx_active_closer', 'Luke');
    localStorage.setItem('closer_authenticated_Luke', 'true');
    const gate = document.getElementById('signInGateModal');
    if (gate) gate.style.display = 'none';
    const authModal = document.getElementById('closerAuthModal');
    if (authModal) authModal.style.display = 'none';
  });
  await new Promise(r => setTimeout(r, 400));

  // --- 1. Open Call Log Modal for Lead #1 ---
  console.log('1. Opening Call Log Modal for Lead #1...');
  await page.evaluate(() => {
    window.openCallLogModal(window.LEADS_DATA[0].id);
  });
  await new Promise(r => setTimeout(r, 500));

  // Verify Gmail status bar presence
  const initialGmailState = await page.evaluate(() => {
    const bar = document.getElementById('gmailStatusBar');
    const dot = document.getElementById('gmailStatusDot')?.textContent;
    const text = document.getElementById('gmailStatusText')?.textContent;
    const btnConnect = document.getElementById('btnConnectGmail');
    return {
      barExists: !!bar,
      dot,
      text,
      btnConnectExists: !!btnConnect
    };
  });
  console.log('1. Gmail Initial Bar State:', initialGmailState);
  if (!initialGmailState.barExists) throw new Error('gmailStatusBar is missing in callLogModal!');

  // --- 2. Test Opening and Connecting Gmail in Gmail Connect Modal ---
  console.log('2. Opening Gmail Connect Modal...');
  await page.evaluate(() => {
    window.openGmailConnectModal();
  });
  await new Promise(r => setTimeout(r, 400));

  const connectModalVisible = await page.evaluate(() => {
    const modal = document.getElementById('gmailConnectModal');
    return modal ? getComputedStyle(modal).display === 'flex' : false;
  });
  console.log('2. Connect Modal Visible:', connectModalVisible);
  if (!connectModalVisible) throw new Error('gmailConnectModal did not open!');

  console.log('2b. Connecting test Gmail account (luke@vantorxsolutions.com)...');
  await page.evaluate(() => {
    document.getElementById('gmailInputAccount').value = 'luke@vantorxsolutions.com';
    document.getElementById('gmailOAuthTokenInput').value = 'valid_test_token';
    document.getElementById('modeGmailApi').checked = true;
    window.saveManualGmailConfig();
  });
  await new Promise(r => setTimeout(r, 400));

  const afterConnectState = await page.evaluate(() => {
    const modal = document.getElementById('gmailConnectModal');
    const dot = document.getElementById('gmailStatusDot')?.textContent;
    const text = document.getElementById('gmailStatusText')?.textContent;
    const userInStorage = localStorage.getItem('vantorx_gmail_user');
    return {
      modalClosed: getComputedStyle(modal).display === 'none',
      dot,
      text,
      userInStorage
    };
  });
  console.log('2c. After Connect State:', afterConnectState);
  if (!afterConnectState.modalClosed) throw new Error('Gmail Connect modal did not close after saving!');
  if (!afterConnectState.text.includes('luke@vantorxsolutions.com')) throw new Error('Gmail status text did not reflect connected user!');

  // --- 3. Verify Upgraded Programmed Email Content (No Luck) ---
  console.log('3. Verifying "No Luck" Upgraded Email Copy...');
  await page.evaluate(() => {
    window.setCallLogEmailTemplate('No Luck');
  });
  await new Promise(r => setTimeout(r, 300));

  const noLuckCopy = await page.evaluate(() => {
    const subject = document.getElementById('callLogEmailSubject')?.value || '';
    const body = document.getElementById('callLogEmailBody')?.value || '';
    return { subject, body };
  });

  console.log('3. Subject:', noLuckCopy.subject);
  console.log('3. Body Sample (First 250 chars):\n', noLuckCopy.body.substring(0, 250) + '...\n');

  // Verify requirements in email:
  // - Explains products: Ava 24/7 Autonomous Voice AI, SMS Dispatch, Calendar booking, Review engine
  if (!noLuckCopy.body.includes('Ava 24/7 Autonomous Voice AI') && !noLuckCopy.body.includes('Voice AI')) {
    throw new Error('Email body missing Ava Voice AI product explanation!');
  }
  if (!noLuckCopy.body.includes('SMS Dispatch') || !noLuckCopy.body.includes('Calendar')) {
    throw new Error('Email body missing SMS Dispatch or Calendar booking explanation!');
  }
  // - Explains how much money we make/save them ($35k to $85k+)
  if (!noLuckCopy.body.includes('$35,000') || !noLuckCopy.body.includes('$85,000')) {
    throw new Error('Email body missing exact dollar revenue recovery numbers ($35,000 to $85,000+)!');
  }
  // - Explains how many new clients we get them a month (15 to 30+)
  if (!noLuckCopy.body.includes('15 to 30+') && !noLuckCopy.body.includes('15 to 30')) {
    throw new Error('Email body missing new clients volume (15 to 30+ new clients/month)!');
  }
  // - Mentions test phone number
  if (!noLuckCopy.body.includes('(561) 813-8602')) {
    throw new Error('Email body missing live test phone number!');
  }

  // --- 4. Verify Other Templates (Success, Callback) ---
  console.log('4. Verifying "Success" Demo Confirmation Template...');
  await page.evaluate(() => {
    window.setCallLogEmailTemplate('Success');
  });
  await new Promise(r => setTimeout(r, 200));

  const successCopy = await page.evaluate(() => {
    return {
      subject: document.getElementById('callLogEmailSubject')?.value || '',
      body: document.getElementById('callLogEmailBody')?.value || ''
    };
  });
  console.log('4. Success Subject:', successCopy.subject);
  if (!successCopy.body.includes('Ava 24/7 Voice AI Receptionist') || !successCopy.body.includes('15 to 30+ new high-ticket clients')) {
    throw new Error('Success template does not explain products or client metrics!');
  }

  // --- 5. Test "Automatically Send Email" Execution (Intercepting network fetch to verify API call) ---
  console.log('5. Testing Automatic Send with Connected Gmail and Mocked 200 OK...');
  await page.evaluate(() => {
    // Mock fetch for gmail send endpoint
    const origFetch = window.fetch;
    window.fetch = async function(url, opts) {
      if (typeof url === 'string' && url.includes('gmail.googleapis.com/gmail/v1/users/me/messages/send')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ id: 'mock_msg_98765', threadId: 'thread_12345' })
        };
      }
      return origFetch.apply(this, arguments);
    };

    window.setCallLogEmailTemplate('No Luck');
    document.getElementById('callLogEmailRecipient').value = 'owner@palm-air-florida.com';
    window.sendCustomizedCallEmail();
  });
  await new Promise(r => setTimeout(r, 500));

  const sendState = await page.evaluate(() => {
    const sentBadge = document.getElementById('callLogEmailSentBadge')?.textContent || '';
    const notes = document.getElementById('callLogModalNotes')?.value || '';
    return { sentBadge, notes };
  });
  console.log('5. Sent Badge:', sendState.sentBadge);
  console.log('5. Call Notes:', sendState.notes);

  if (!sendState.sentBadge.includes('Sent from luke@vantorxsolutions.com')) {
    throw new Error('Send status did not confirm dispatch via connected Gmail API!');
  }
  if (!sendState.notes.includes('Email sent to owner@palm-air-florida.com')) {
    throw new Error('Call notes did not record email dispatch!');
  }

  // --- 6. Capture Verification Screenshot ---
  const screenshotPath = path.join(ARTIFACT_DIR, 'verified_gmail_sender_and_killer_templates.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('✓ Saved verification screenshot to:', screenshotPath);

  // --- 7. Save Call Log and Verify Persistence ---
  console.log('7. Saving Call Result to verify record sync...');
  await page.evaluate(() => {
    document.getElementById('btnSaveCallLog').click();
  });
  await new Promise(r => setTimeout(r, 500));

  const lead1Record = await page.evaluate(() => {
    return window.CALL_RECORDS[window.LEADS_DATA[0].id];
  });
  console.log('7. Lead #1 Saved Record:', lead1Record);
  if (!lead1Record.emailSent || lead1Record.email !== 'owner@palm-air-florida.com') {
    throw new Error('Lead record failed to persist email sent state!');
  }

  if (errors.length > 0) {
    throw new Error(`Encountered ${errors.length} browser errors: ${errors.join(', ')}`);
  }

  await browser.close();
  console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! GMAIL INTEGRATION & KILLER TEMPLATES 100% VERIFIED!');
})();
