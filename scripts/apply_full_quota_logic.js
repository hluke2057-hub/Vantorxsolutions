const fs = require('fs');
const path = require('path');

const filePath = path.resolve('scripts/cloud_outbound_engine.js');
let code = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// 1. Operational window & Date resolution
const oldTime = `  const parts = etFormatter.formatToParts(now);
  const hourPart = parts.find(p => p.type === "hour");
  const weekdayPart = parts.find(p => p.type === "weekday");
  const currentHour = parseInt(hourPart.value, 10);
  const currentDay = weekdayPart.value; // 'Mon', 'Tue', etc.

  const forceDispatch = process.argv.includes('--force') || process.env.FORCE_DISPATCH === 'true';

  console.log(\`Current Time (ET):  \${currentDay} \${currentHour}:00 ET\`);
  console.log(\`Sender:             \${SENDER_NAME} <\${SENDER_EMAIL}>\`);
  console.log(\`Resend API Key:     \${RESEND_API_KEY ? "CONFIGURED (Live Dispatch Active)" : "NOT SET (Simulation Mode)"}\`);
  console.log(\`Force Override:     \${forceDispatch ? "ENABLED" : "Disabled"}\`);`;

const newTime = `  const parts = etFormatter.formatToParts(now);
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
  const quota = getDailyQuotaStatus(currentDateStr);

  const forceDispatch = process.argv.includes('--force') || process.env.FORCE_DISPATCH === 'true';

  console.log(\`Current Time (ET):  \${currentDay} \${currentHour}:00 ET (\${currentDateStr})\`);
  console.log(\`Sender:             \${SENDER_NAME} <\${SENDER_EMAIL}>\`);
  console.log(\`Resend API Key:     \${RESEND_API_KEY ? "CONFIGURED (Live Dispatch Active)" : "NOT SET (Simulation Mode)"}\`);
  console.log(\`Daily 100 Quota:    \${quota.todaySent} / \${quota.dailyLimit} sent today (\${quota.todayRemaining} remaining)\`);
  console.log(\`Force Override:     \${forceDispatch ? "ENABLED" : "Disabled"}\`);

  if (!forceDispatch && quota.todayRemaining <= 0) {
    console.log(\`\\n🎯 [DAILY 100 QUOTA MET] All 100 verified emails for \${currentDateStr} have been dispatched!\`);
    console.log(\`    Engine pausing physical sends until tomorrow at 8:00 AM ET.\\n\`);
    return;
  }`;

if (!code.includes(oldTime)) {
  console.error('Could not find oldTime!');
  process.exit(1);
}
code = code.replace(oldTime, newTime);

// 2. Batch sizing
const oldBatch = `  // 3. Take next verified targets (Scaled Outbound: 10-15/batch or configurable)
  const defaultBatch = 10;
  const batchArg = process.argv.find(a => a.startsWith('--batch='));
  const requestedBatch = batchArg ? parseInt(batchArg.split('=')[1], 10) : (parseInt(process.env.BATCH_SIZE, 10) || defaultBatch);
  const batchSize = Math.min(requestedBatch, pendingTargets.length);
  const currentBatch = pendingTargets.slice(0, batchSize);`;

const newBatch = `  // 3. Take next verified targets (Scaled Outbound: default 15/batch, capped by 100/day quota)
  const defaultBatch = 15;
  const batchArg = process.argv.find(a => a.startsWith('--batch='));
  const requestedBatch = batchArg ? parseInt(batchArg.split('=')[1], 10) : (parseInt(process.env.BATCH_SIZE, 10) || defaultBatch);
  const effectiveBatchLimit = forceDispatch ? requestedBatch : Math.min(requestedBatch, quota.todayRemaining);
  const batchSize = Math.min(effectiveBatchLimit, pendingTargets.length);
  const currentBatch = pendingTargets.slice(0, batchSize);`;

if (!code.includes(oldBatch)) {
  console.error('Could not find oldBatch!');
  process.exit(1);
}
code = code.replace(oldBatch, newBatch);

// 3. Tracking send and updating quota
const oldSend = `    if (resendResult && typeof resendResult === 'string') {
      target.status = "sent";
      target.resendMessageId = resendResult;
      target.sentAt = new Date().toISOString();
      console.log(\`   ✅ DISPATCHED via Resend! Delivery ID: \${resendResult}\\n\`);`;

const newSend = `    if (resendResult && typeof resendResult === 'string') {
      target.status = "sent";
      target.resendMessageId = resendResult;
      target.sentAt = new Date().toISOString();
      quota.todaySent++;
      quota.todayRemaining = Math.max(0, quota.dailyLimit - quota.todaySent);
      quota.lastDispatchAt = target.sentAt;
      console.log(\`   ✅ DISPATCHED via Resend! Delivery ID: \${resendResult} [Today's Progress: \${quota.todaySent}/\${quota.dailyLimit}]\\n\`);`;

if (!code.includes(oldSend)) {
  console.error('Could not find oldSend!');
  process.exit(1);
}
code = code.replace(oldSend, newSend);

// 4. Save quota status after batch
const oldSave = `  // 4. Save Updated Queue (Master & Website)
  writeJsonSafe(QUEUE_FILE, queue);
  writeJsonSafe(WEB_QUEUE_FILE, queue);`;

const newSave = `  // 4. Save Updated Queue and Daily Quota Status
  writeJsonSafe(QUEUE_FILE, queue);
  writeJsonSafe(WEB_QUEUE_FILE, queue);
  saveDailyQuotaStatus(quota);`;

if (!code.includes(oldSave)) {
  console.error('Could not find oldSave!');
  process.exit(1);
}
code = code.replace(oldSave, newSave);

// 5. Update intel metrics with quota info
const oldMetrics = `    if (!intel.metrics) intel.metrics = { totalSent: 0, totalOpened: 0, totalResponses: 0, qualifiedMeetingsBooked: 0 };
    intel.metrics.totalSent = (intel.metrics.totalSent || 0) + newlyDispatched.filter(d => d.status === "sent").length;
    intel.lastUpdated = new Date().toISOString();`;

const newMetrics = `    if (!intel.metrics) intel.metrics = { totalSent: 0, totalOpened: 0, totalResponses: 0, qualifiedMeetingsBooked: 0 };
    intel.metrics.totalSent = (intel.metrics.totalSent || 0) + newlyDispatched.filter(d => d.status === "sent").length;
    intel.metrics.todaySent = quota.todaySent;
    intel.metrics.dailyLimit = quota.dailyLimit;
    intel.metrics.todayRemaining = quota.todayRemaining;
    intel.lastUpdated = new Date().toISOString();`;

if (!code.includes(oldMetrics)) {
  console.error('Could not find oldMetrics!');
  process.exit(1);
}
code = code.replace(oldMetrics, newMetrics);

fs.writeFileSync(filePath, code, 'utf8');
console.log('All 5 quota and batch updates applied successfully!');
