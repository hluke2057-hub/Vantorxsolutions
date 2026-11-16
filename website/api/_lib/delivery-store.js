const fs = require("fs");
const path = require("path");

// Resolve persistent store path
function getStorePath() {
  const candidateDirs = [
    path.resolve(__dirname, "..", "..", "..", "data"),
    path.resolve(process.cwd(), "data"),
    path.resolve(__dirname, "..", "..", "data"),
    "/tmp"
  ];

  for (const dir of candidateDirs) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const testFile = path.join(dir, ".store_write_test");
      fs.writeFileSync(testFile, "ok");
      fs.unlinkSync(testFile);
      return path.join(dir, "email_delivery_store.json");
    } catch (_) {}
  }
  return path.join(process.cwd(), "email_delivery_store.json");
}

const STORE_PATH = getStorePath();

// Default initial state
const DEFAULT_STORE = {
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
  stats: {
    totalProcessed: 0,
    totalSent: 0,
    totalDelivered: 0,
    totalBounced: 0,
    totalSuppressed: 0,
    totalFailed: 0,
    totalReplied: 0,
    totalUnsubscribed: 0,
    deliveryRate: "100.0%",
    bounceRate: "0.0%",
    complaintRate: "0.0%"
  },
  // Map of email ID or key to tracking record
  emails: {},
  // List of suppression records
  suppressions: [
    {
      email: "drhvacandplumbing@gmail.com",
      reason: "Historical hard bounce: 550 5.1.1 address does not exist (fabrication fix)",
      origin: "bounce",
      suppressedAt: "2026-11-15T18:00:00.000Z",
      active: true
    }
  ],
  // List of unsubscribed emails
  unsubscribes: [],
  // Event stream for audit log
  events: []
};

// In-memory cache
let memoryStore = null;

function loadStore() {
  if (memoryStore) return memoryStore;
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, "utf8");
      memoryStore = JSON.parse(data);
      if (!memoryStore.suppressions) memoryStore.suppressions = [];
      if (!memoryStore.emails) memoryStore.emails = {};
      if (!memoryStore.unsubscribes) memoryStore.unsubscribes = [];
      if (!memoryStore.events) memoryStore.events = [];
      if (!memoryStore.stats) memoryStore.stats = { ...DEFAULT_STORE.stats };
      return memoryStore;
    }
  } catch (err) {
    console.error("[DeliveryStore] Error reading store from disk:", err.message);
  }
  memoryStore = JSON.parse(JSON.stringify(DEFAULT_STORE));
  saveStore();
  return memoryStore;
}

function saveStore() {
  if (!memoryStore) return;
  try {
    memoryStore.lastUpdated = new Date().toISOString();
    recalculateStats(memoryStore);
    fs.writeFileSync(STORE_PATH, JSON.stringify(memoryStore, null, 2), "utf8");
  } catch (err) {
    console.error("[DeliveryStore] Error writing store to disk:", err.message);
  }
}

function recalculateStats(store) {
  const emailRecords = Object.values(store.emails || {});
  const total = emailRecords.length;
  let sent = 0;
  let delivered = 0;
  let bounced = 0;
  let suppressed = 0;
  let failed = 0;
  let replied = 0;

  for (const rec of emailRecords) {
    const s = (rec.status || "").toLowerCase();
    if (s === "sent" || s === "delivered") sent++;
    if (s === "delivered") delivered++;
    if (s === "bounced") bounced++;
    if (s === "suppressed") suppressed++;
    if (s === "failed") failed++;
    if (s === "replied") replied++;
  }

  // Also include standalone suppression table count
  const activeSuppressions = (store.suppressions || []).filter(s => s.active !== false).length;
  const totalSuppressedCount = Math.max(suppressed, activeSuppressions);
  const totalUnsubCount = (store.unsubscribes || []).length;

  const totalSendsAttempted = sent + bounced + failed + suppressed;
  const deliveryRate = totalSendsAttempted > 0 ? ((delivered / totalSendsAttempted) * 100).toFixed(1) + "%" : "100.0%";
  const bounceRate = totalSendsAttempted > 0 ? ((bounced / totalSendsAttempted) * 100).toFixed(1) + "%" : "0.0%";
  const complaintCount = (store.events || []).filter(e => e.type === "email.complained").length;
  const complaintRate = totalSendsAttempted > 0 ? ((complaintCount / totalSendsAttempted) * 100).toFixed(2) + "%" : "0.00%";

  store.stats = {
    totalProcessed: total,
    totalSent: sent,
    totalDelivered: delivered,
    totalBounced: bounced,
    totalSuppressed: totalSuppressedCount,
    totalFailed: failed,
    totalReplied: replied,
    totalUnsubscribed: totalUnsubCount,
    deliveryRate,
    bounceRate,
    complaintRate
  };
}

/**
 * Check if an address is suppressed
 */
function isSuppressed(email) {
  if (!email || typeof email !== "string") return { suppressed: false };
  const cleanEmail = email.trim().toLowerCase();
  const store = loadStore();

  const found = (store.suppressions || []).find(
    s => s.email && s.email.toLowerCase() === cleanEmail && s.active !== false
  );

  if (found) {
    return {
      suppressed: true,
      reason: found.reason || "Suppressed in email protection database",
      origin: found.origin || "bounce",
      suppressedAt: found.suppressedAt
    };
  }

  // Also check if any recent record for this email had status 'bounced' or 'suppressed'
  const emailRecords = Object.values(store.emails || {});
  const matchingRec = emailRecords.find(
    r => r.recipient && r.recipient.toLowerCase() === cleanEmail && (r.status === "bounced" || r.status === "suppressed")
  );

  if (matchingRec) {
    return {
      suppressed: true,
      reason: matchingRec.failureReason || `Marked ${matchingRec.status} on previous dispatch`,
      origin: matchingRec.suppressionOrigin || (matchingRec.status === "bounced" ? "bounce" : "manual"),
      suppressedAt: matchingRec.lastUpdatedAt
    };
  }

  return { suppressed: false };
}

/**
 * Check if an address has opted out / unsubscribed
 */
function isUnsubscribed(email) {
  if (!email || typeof email !== "string") return false;
  const cleanEmail = email.trim().toLowerCase();
  const store = loadStore();
  return (store.unsubscribes || []).some(
    u => u.email && u.email.toLowerCase() === cleanEmail
  );
}

/**
 * Record a dispatch attempt
 */
function recordSend({
  id,
  recipient,
  businessName = "Unknown Business",
  subject = "(No Subject)",
  sender = "Luke Hamilton <luke@vantorxsolutions.com>",
  status = "sent",
  verificationStatus = "VALID",
  failureReason = null,
  suppressionOrigin = null,
  source = "manual"
}) {
  const store = loadStore();
  const cleanEmail = (recipient || "").trim().toLowerCase();
  const recordId = id || `send_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  store.emails[recordId] = {
    id: recordId,
    recipient: cleanEmail,
    businessName: businessName || cleanEmail.split("@")[0],
    subject,
    sender,
    sentAt: new Date().toISOString(),
    status,
    verificationStatus,
    failureReason,
    suppressionOrigin,
    source,
    lastUpdatedAt: new Date().toISOString()
  };

  store.events.push({
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    emailId: recordId,
    recipient: cleanEmail,
    type: status === "sent" ? "email.sent" : `email.${status}`,
    timestamp: new Date().toISOString(),
    details: { subject, sender, failureReason }
  });

  saveStore();
  return store.emails[recordId];
}

/**
 * Update email status via Resend Webhook or internal event
 */
function recordEvent({
  emailId,
  recipient,
  type,
  data = {},
  reason = null,
  origin = null
}) {
  const store = loadStore();
  const cleanEmail = (recipient || "").trim().toLowerCase();

  // Find matching email record by ID or recipient
  let record = emailId ? store.emails[emailId] : null;
  if (!record && cleanEmail) {
    const list = Object.values(store.emails);
    record = list.reverse().find(r => r.recipient && r.recipient.toLowerCase() === cleanEmail);
  }

  const normalizedStatusMap = {
    "email.sent": "sent",
    "email.delivered": "delivered",
    "email.delivery_delayed": "delayed",
    "email.bounced": "bounced",
    "email.complained": "complained",
    "email.suppressed": "suppressed",
    "email.failed": "failed"
  };

  const newStatus = normalizedStatusMap[type] || type.replace("email.", "");

  if (record) {
    record.status = newStatus;
    record.lastUpdatedAt = new Date().toISOString();
    if (reason) record.failureReason = reason;
    if (origin) record.suppressionOrigin = origin;
  } else if (cleanEmail) {
    // Create new tracking record if event arrived before or without local record
    const id = emailId || `webhook_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    record = {
      id,
      recipient: cleanEmail,
      businessName: data.businessName || cleanEmail.split("@")[0],
      subject: data.subject || "(Webhook Recorded)",
      sender: data.from || "VantorX Outbound",
      sentAt: data.created_at || new Date().toISOString(),
      status: newStatus,
      verificationStatus: "UNKNOWN",
      failureReason: reason,
      suppressionOrigin: origin,
      source: "resend_webhook",
      lastUpdatedAt: new Date().toISOString()
    };
    store.emails[id] = record;
  }

  // If bounce, complaint, or suppression, add to suppression list immediately
  if (newStatus === "bounced" || newStatus === "suppressed" || newStatus === "complained") {
    addSuppression({
      email: cleanEmail,
      reason: reason || `Automatically suppressed following ${type} event`,
      origin: origin || (newStatus === "complained" ? "complaint" : "bounce")
    });
  }

  // Push audit event
  store.events.push({
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    emailId: record ? record.id : emailId,
    recipient: cleanEmail,
    type,
    timestamp: new Date().toISOString(),
    details: { ...data, reason }
  });

  saveStore();
  return record;
}

/**
 * Add an address to permanent suppression list
 */
function addSuppression({ email, reason = "Manual suppression", origin = "manual" }) {
  if (!email || typeof email !== "string") return;
  const cleanEmail = email.trim().toLowerCase();
  const store = loadStore();

  const existingIdx = (store.suppressions || []).findIndex(
    s => s.email && s.email.toLowerCase() === cleanEmail
  );

  const suppressionEntry = {
    email: cleanEmail,
    reason,
    origin,
    suppressedAt: new Date().toISOString(),
    active: true
  };

  if (existingIdx >= 0) {
    store.suppressions[existingIdx] = suppressionEntry;
  } else {
    store.suppressions.push(suppressionEntry);
  }

  saveStore();
  return suppressionEntry;
}

/**
 * Add an address to unsubscribe list
 */
function addUnsubscribe({ email, ip = "direct" }) {
  if (!email || typeof email !== "string") return;
  const cleanEmail = email.trim().toLowerCase();
  const store = loadStore();

  const existing = (store.unsubscribes || []).some(
    u => u.email && u.email.toLowerCase() === cleanEmail
  );

  if (!existing) {
    store.unsubscribes.push({
      email: cleanEmail,
      unsubscribedAt: new Date().toISOString(),
      ip
    });
  }

  // Also suppress from future sends
  addSuppression({
    email: cleanEmail,
    reason: "Recipient requested unsubscribe (CAN-SPAM / Opt-Out)",
    origin: "manual"
  });

  saveStore();
}

/**
 * Get full deliverability metrics & tripwire health
 */
function getMetrics() {
  const store = loadStore();
  recalculateStats(store);
  
  const stats = store.stats;
  const bounceRateNum = parseFloat(stats.bounceRate) || 0;
  const complaintRateNum = parseFloat(stats.complaintRate) || 0;

  // Tripwires: Google & Yahoo enforcement threshold is 0.3% complaints and 3-5% bounces
  const tripwireTriggered = bounceRateNum >= 3.0 || complaintRateNum >= 0.1;

  return {
    ...stats,
    tripwireTriggered,
    tripwireWarning: tripwireTriggered
      ? `CRITICAL ALERT: Deliverability tripwire reached (Bounce: ${stats.bounceRate}, Complaint: ${stats.complaintRate}). Sending paused.`
      : "DELIVERABILITY HEALTHY: Rates within safe thresholds (Bounce < 3%, Complaint < 0.1%).",
    storePath: STORE_PATH
  };
}

/**
 * Get emails list with optional filters
 */
function getEmails({ limit = 100, status = null, search = "" } = {}) {
  const store = loadStore();
  let list = Object.values(store.emails || {});

  if (status && status !== "all") {
    list = list.filter(e => (e.status || "").toLowerCase() === status.toLowerCase());
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(e =>
      (e.recipient && e.recipient.toLowerCase().includes(q)) ||
      (e.businessName && e.businessName.toLowerCase().includes(q)) ||
      (e.subject && e.subject.toLowerCase().includes(q)) ||
      (e.id && e.id.toLowerCase().includes(q))
    );
  }

  // Sort descending by sentAt/lastUpdatedAt
  list.sort((a, b) => new Date(b.sentAt || b.lastUpdatedAt || 0) - new Date(a.sentAt || a.lastUpdatedAt || 0));

  return list.slice(0, limit);
}

/**
 * Get suppression list
 */
function getSuppressionList() {
  const store = loadStore();
  return (store.suppressions || []).filter(s => s.active !== false);
}

module.exports = {
  isSuppressed,
  isUnsubscribed,
  recordSend,
  recordEvent,
  addSuppression,
  addUnsubscribe,
  getMetrics,
  getEmails,
  getSuppressionList,
  loadStore
};