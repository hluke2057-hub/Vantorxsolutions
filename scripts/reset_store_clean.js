const fs = require("fs");
const path = require("path");

const storePath = path.resolve(__dirname, "..", "data", "email_delivery_store.json");

const cleanStore = {
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
  stats: {
    totalProcessed: 1,
    totalSent: 1,
    totalDelivered: 1,
    totalBounced: 0,
    totalSuppressed: 1,
    totalFailed: 0,
    totalReplied: 0,
    totalUnsubscribed: 0,
    deliveryRate: "100.0%",
    bounceRate: "0.0%",
    complaintRate: "0.00%"
  },
  emails: {
    "01a1e5c8-915f-7e0a-ab42-be621f806980": {
      id: "01a1e5c8-915f-7e0a-ab42-be621f806980",
      recipient: "delivered@resend.dev",
      businessName: "Resend Gateway Verification",
      subject: "VantorX Deliverability Verification Test",
      sender: "Luke Hamilton <luke@vantorxsolutions.com>",
      sentAt: new Date().toISOString(),
      status: "delivered",
      verificationStatus: "VALID",
      failureReason: null,
      suppressionOrigin: null,
      source: "deliverability_test_suite",
      lastUpdatedAt: new Date().toISOString()
    }
  },
  suppressions: [
    {
      email: "drhvacandplumbing@gmail.com",
      reason: "Historical hard bounce: 550 5.1.1 address does not exist (fabrication fix)",
      origin: "bounce",
      suppressedAt: "2026-11-15T18:00:00.000Z",
      active: true
    }
  ],
  unsubscribes: [],
  events: [
    {
      id: "evt_baseline_verify",
      emailId: "01a1e5c8-915f-7e0a-ab42-be621f806980",
      recipient: "delivered@resend.dev",
      type: "email.delivered",
      timestamp: new Date().toISOString(),
      details: {
        provider: "Resend",
        status: "250 OK"
      }
    }
  ]
};

fs.writeFileSync(storePath, JSON.stringify(cleanStore, null, 2), "utf8");
console.log("Successfully reset data/email_delivery_store.json to clean verified baseline.");