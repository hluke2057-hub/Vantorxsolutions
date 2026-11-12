const fs = require('fs');
const path = require('path');

const filePath = path.resolve('scripts/cloud_outbound_engine.js');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Add QUOTA_FILE paths near other file paths
const targetPaths = `const CSV_FILE = path.join(REPO_ROOT, 'data', 'outbound_cloud_campaign.csv');`;
const newPaths = `const CSV_FILE = path.join(REPO_ROOT, 'data', 'outbound_cloud_campaign.csv');
const QUOTA_FILE = path.join(REPO_ROOT, 'data', 'daily_outbound_quota.json');
const WEB_QUOTA_FILE = path.join(REPO_ROOT, 'website', 'data', 'daily_outbound_quota.json');
const DAILY_LIMIT = 100;

function getDailyQuotaStatus(currentDateStr) {
  let quota = {
    date: currentDateStr,
    dailyLimit: DAILY_LIMIT,
    todaySent: 0,
    todayRemaining: DAILY_LIMIT,
    lastDispatchAt: null,
    history: {}
  };

  if (fs.existsSync(QUOTA_FILE)) {
    try {
      const saved = readJsonSafe(QUOTA_FILE);
      if (saved && typeof saved === 'object') {
        const hist = saved.history || {};
        if (saved.date && saved.date !== currentDateStr && saved.todaySent !== undefined) {
          hist[saved.date] = saved.todaySent;
        }
        if (saved.date === currentDateStr) {
          quota.todaySent = saved.todaySent || 0;
        } else {
          quota.todaySent = 0;
        }
        quota.history = hist;
      }
    } catch (e) {}
  }
  quota.date = currentDateStr;
  quota.todayRemaining = Math.max(0, DAILY_LIMIT - quota.todaySent);
  return quota;
}

function saveDailyQuotaStatus(quota) {
  writeJsonSafe(QUOTA_FILE, quota);
  writeJsonSafe(WEB_QUOTA_FILE, quota);
}`;

code = code.replace(targetPaths, newPaths);

// 2. Fix line 137 suppression guard to allow MX-verified leads
const oldGuard = `  const srcLower = (lead.emailSource || '').toLowerCase();
  const isWebsiteVerified = srcLower.includes('website verified') || srcLower.includes('website scraped') || srcLower.includes('published');
  if (
    KNOWN_SUPPRESSED.has(cleanEmail) ||
    localPart === 'the.owner' ||
    localPart === 'executive.leadership' ||
    localPart === 'franchise.owner' ||
    cleanEmail.includes('the.owner@') ||
    srcLower.includes('pattern synthesized') ||
    !isWebsiteVerified
  ) {`;

const newGuard = `  const srcLower = (lead.emailSource || '').toLowerCase();
  const isMxVerified = srcLower.includes('mx verified') || lead.mx_status === 'VERIFIED';
  const isWebsiteVerified = srcLower.includes('website verified') || srcLower.includes('website scraped') || srcLower.includes('published');
  if (
    KNOWN_SUPPRESSED.has(cleanEmail) ||
    localPart === 'the.owner' ||
    localPart === 'executive.leadership' ||
    localPart === 'franchise.owner' ||
    cleanEmail.includes('the.owner@') ||
    cleanEmail.endsWith('.con') ||
    (!isMxVerified && !isWebsiteVerified)
  ) {`;

code = code.replace(oldGuard, newGuard);

// 3. Enhance autoReplenishQueue to keep queue filled
const oldReplenishFallback = `  // 3. Fallback: Recycle oldest sent leads (> 14 days old) ONLY if they have verified published website emails
  if (queue.filter(t => t.status === "pending").length < 10) {
    const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
    for (const item of queue) {
      const srcL = (item.emailSource || '').toLowerCase();
      const verifiedSrc = srcL.includes('website verified') || srcL.includes('website scraped') || srcL.includes('published');
      if (item.status === "sent" && item.sentAt && verifiedSrc && !KNOWN_SUPPRESSED.has((item.email || '').toLowerCase())) {
        const sentTime = new Date(item.sentAt).getTime();
        if (now - sentTime >= fourteenDaysMs) {
          item.status = "pending";
          item.touch = 1;
          item.resendMessageId = null;
          advanced++;
          if (queue.filter(t => t.status === "pending").length >= 20) break;
        }
      }
    }
  }`;

const newReplenishFallback = `  // 3. Fallback: Recycle oldest sent leads (> 7 days old) to maintain infinite 100/day drip
  if (queue.filter(t => t.status === "pending").length < 30) {
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    for (const item of queue) {
      const srcL = (item.emailSource || '').toLowerCase();
      const isEligible = srcL.includes('mx verified') || srcL.includes('website') || item.mx_status === 'VERIFIED';
      if (item.status === "sent" && item.sentAt && isEligible && !KNOWN_SUPPRESSED.has((item.email || '').toLowerCase())) {
        const sentTime = new Date(item.sentAt).getTime();
        if (now - sentTime >= sevenDaysMs) {
          item.status = "pending";
          item.touch = 1;
          item.resendMessageId = null;
          advanced++;
          if (queue.filter(t => t.status === "pending").length >= 50) break;
        }
      }
    }
  }`;

code = code.replace(oldReplenishFallback, newReplenishFallback);

// 4. Update runAutonomousEngine date resolution and quota checking
const oldTimeBlock = `  const parts = etFormatter.formatToParts(now);
  const hourPart = parts.find(p => p.type === "hour");
  const weekdayPart = parts.find(p => p.type === "weekday");
  const currentHour = parseInt(hourPart.value, 10);
  const currentDay = weekdayPart.value; // 'Mon', 'Tue', etc.`;

const newTimeBlock = `  const parts = etFormatter.formatToParts(now);
  const hourPart = parts.find(p => p.type === "hour");
  const weekdayPart = parts.find(p => p.type === "weekday");
  const currentHour = parseInt(hourPart.value, 10);
  const currentDay = weekdayPart.value; // 'Mon', 'Tue', etc.

  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);
  const y = dateParts.find(p => p.type === 'year').value;
  const m = dateParts.find(p => p.type === 'month').value;
  const d = dateParts.find(p => p.type === 'day').value;
  const currentDateStr = \`\${y}-\${m}-\${d}\`;
  const quota = getDailyQuotaStatus(currentDateStr);`;

code = code.replace(oldTimeBlock, newTimeBlock);

// 5. Update quota logging and pause check
const oldOverrideLog = `  console.log(\`Current Time (ET):  \${currentDay} \${currentHour}:00 ET\`);
  console.log(\`Sender:             \${SENDER_NAME} <\${SENDER_EMAIL}>\`);
  console.log(\`Resend API Key:     \${RESEND_API_KEY ? "CONFIGURED (Live Dispatch Active)" : "NOT SET (Simulation Mode)"}\`);
  console.log(\`Force Override:     \${forceDispatch ? "ENABLED" : "Disabled"}\`);`;

const newOverrideLog = `  console.log(\`Current Time (ET):  \${currentDay} \${currentHour}:00 ET (\${currentDateStr})\`);
  console.log(\`Sender:             \${SENDER_NAME} <\${SENDER_EMAIL}>\`);
  console.log(\`Resend API Key:     \${RESEND_API_KEY ? "CONFIGURED (Live Dispatch Active)" : "NOT SET (Simulation Mode)"}\`);
  console.log(\`Daily 100 Quota:    \${quota.todaySent} / \${quota.dailyLimit} sent today (\${quota.todayRemaining} remaining)\`);
  console.log(\`Force Override:     \${forceDispatch ? "ENABLED" : "Disabled"}\`);

  if (!forceDispatch && quota.todayRemaining <= 0) {
    console.log(\`\\n🎯 [DAILY 100 QUOTA MET] All 100 verified emails for \${currentDateStr} have been dispatched!\`);
    console.log(\`    Engine pausing physical sends until tomorrow at 8:00 AM ET.\\n\`);
    return;
  }`;

code = code.replace(oldOverrideLog, newOverrideLog);

// 6. Update batch sizing to enforce daily remaining limit
const oldBatchBlock = `  // 3. Take next verified targets (Scaled Outbound: 10-15/batch or configurable)
  const defaultBatch = 10;
  const batchArg = process.argv.find(a => a.startsWith('--batch='));
  const requestedBatch = batchArg ? parseInt(batchArg.split('=')[1], 10) : (parseInt(process.env.BATCH_SIZE, 10) || defaultBatch);
  const batchSize = Math.min(requestedBatch, pendingTargets.length);
  const currentBatch = pendingTargets.slice(0, batchSize);`;

const newBatchBlock = `  // 3. Take next verified targets (Scaled Outbound: default 15/batch, capped by 100/day quota)
  const defaultBatch = 15;
  const batchArg = process.argv.find(a => a.startsWith('--batch='));
  const requestedBatch = batchArg ? parseInt(batchArg.split('=')[1], 10) : (parseInt(process.env.BATCH_SIZE, 10) || defaultBatch);
  const effectiveBatchLimit = forceDispatch ? requestedBatch : Math.min(requestedBatch, quota.todayRemaining);
  const batchSize = Math.min(effectiveBatchLimit, pendingTargets.length);
  const currentBatch = pendingTargets.slice(0, batchSize);`;

code = code.replace(oldBatchBlock, newBatchBlock);

// 7. Track successful sends in quota
const oldSendSuccess = `    if (resendResult && typeof resendResult === 'string') {
      target.status = "sent";
      target.resendMessageId = resendResult;
      target.sentAt = new Date().toISOString();
      console.log(\`   ✅ DISPATCHED via Resend! Delivery ID: \${resendResult}\\n\`);`;

const newSendSuccess = `    if (resendResult && typeof resendResult === 'string') {
      target.status = "sent";
      target.resendMessageId = resendResult;
      target.sentAt = new Date().toISOString();
      quota.todaySent++;
      quota.todayRemaining = Math.max(0, quota.dailyLimit - quota.todaySent);
      quota.lastDispatchAt = target.sentAt;
      console.log(\`   ✅ DISPATCHED via Resend! Delivery ID: \${resendResult} [Today's Progress: \${quota.todaySent}/\${quota.dailyLimit}]\\n\`);`;

code = code.replace(oldSendSuccess, newSendSuccess);

// 8. Save quota at end of batch
const oldSaveQueue = `  // 4. Save Updated Queue (Master & Website)
  writeJsonSafe(QUEUE_FILE, queue);
  writeJsonSafe(WEB_QUEUE_FILE, queue);`;

const newSaveQueue = `  // 4. Save Updated Queue and Daily Quota Status
  writeJsonSafe(QUEUE_FILE, queue);
  writeJsonSafe(WEB_QUEUE_FILE, queue);
  saveDailyQuotaStatus(quota);`;

code = code.replace(oldSaveQueue, newSaveQueue);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully patched scripts/cloud_outbound_engine.js!');
