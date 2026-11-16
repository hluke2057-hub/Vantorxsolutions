const { sendEmail } = require("../website/api/_lib/email");
const {
  isSuppressed,
  recordEvent,
  getMetrics,
  getEmails,
  getSuppressionList,
  loadStore
} = require("../website/api/_lib/delivery-store");
const { verifyEmail } = require("../website/api/_lib/verifier");

async function runTestSuite() {
  console.log("============================================================");
  console.log("🧪 VANTORX COMPLETE EMAIL SENDER & DELIVERABILITY TEST SUITE");
  console.log("============================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✕ FAIL: ${message}`);
      failed++;
    }
  }

  // ------------------------------------------------------------
  // TEST 1: SUCCESSFUL DISPATCH TO delivered@resend.dev
  // ------------------------------------------------------------
  console.log("--- TEST 1: Official Resend Test Delivery (delivered@resend.dev) ---");
  const test1Recipient = "delivered@resend.dev";
  const sendResult1 = await sendEmail({
    to: test1Recipient,
    subject: "VantorX Deliverability Verification Test",
    text: "Automated test dispatch validating Resend API integration, CAN-SPAM headers, and tracking.",
    businessName: "Resend Test Harness",
    source: "deliverability_test_suite"
  });

  assert(sendResult1.ok === true, `sendEmail returned ok=true (ID: ${sendResult1.id || "none"})`);
  assert(Boolean(sendResult1.id), `Received valid Resend dispatch ID: ${sendResult1.id}`);

  // Simulate Resend Webhook callback: email.delivered
  const webhookDelivered = recordEvent({
    emailId: sendResult1.id,
    recipient: test1Recipient,
    type: "email.delivered",
    data: {
      email_id: sendResult1.id,
      to: [test1Recipient],
      subject: "VantorX Deliverability Verification Test"
    }
  });

  assert(webhookDelivered && webhookDelivered.status === "delivered", "Webhook updated email status to 'delivered'");

  // ------------------------------------------------------------
  // TEST 2: BOUNCE WEBHOOK & IMMEDIATE SUPPRESSION GUARD
  // ------------------------------------------------------------
  console.log("\n--- TEST 2: Hard Bounce Ingestion & Suppression Guard (bounced@resend.dev) ---");
  const bounceEmail = "bounced@resend.dev";
  const fakeBounceId = "test_bounce_" + Date.now();

  // Ingest bounce event as if from Resend webhook
  const bounceEvent = recordEvent({
    emailId: fakeBounceId,
    recipient: bounceEmail,
    type: "email.bounced",
    data: {
      email_id: fakeBounceId,
      to: [bounceEmail],
      bounce: {
        message: "550 5.1.1 The email account that you tried to reach does not exist.",
        type: "permanent"
      }
    },
    reason: "550 5.1.1 The email account that you tried to reach does not exist.",
    origin: "bounce"
  });

  assert(bounceEvent && bounceEvent.status === "bounced", "Recorded bounced status in store");

  // Verify suppression check now reports suppressed
  const suppCheck = isSuppressed(bounceEmail);
  assert(suppCheck.suppressed === true, `Address ${bounceEmail} is now registered as suppressed`);
  assert(suppCheck.origin === "bounce", `Suppression origin recorded as '${suppCheck.origin}'`);

  // Attempt to send email to this address again -> MUST BE BLOCKED
  const sendAttemptToBounced = await sendEmail({
    to: bounceEmail,
    subject: "Should be blocked",
    text: "This email must never reach Resend",
    businessName: "Bounced Lead",
    source: "test"
  });

  assert(sendAttemptToBounced.ok === false, "Suppression guard blocked send attempt (ok=false)");
  assert(sendAttemptToBounced.suppressed === true, "Send result flagged with suppressed=true");

  // ------------------------------------------------------------
  // TEST 3: SPAM COMPLAINT INGESTION & IMMEDIATE BLOCK
  // ------------------------------------------------------------
  console.log("\n--- TEST 3: Spam Complaint Ingestion & Protection (complained@resend.dev) ---");
  const complaintEmail = "complained@resend.dev";
  const fakeComplaintId = "test_complaint_" + Date.now();

  const complaintEvent = recordEvent({
    emailId: fakeComplaintId,
    recipient: complaintEmail,
    type: "email.complained",
    data: {
      email_id: fakeComplaintId,
      to: [complaintEmail]
    },
    reason: "Recipient reported email as spam (complaint)",
    origin: "complaint"
  });

  assert(complaintEvent && complaintEvent.status === "complained", "Recorded complaint status in store");

  const complaintSuppCheck = isSuppressed(complaintEmail);
  assert(complaintSuppCheck.suppressed === true, "Complaint recipient is now in suppression store");
  assert(complaintSuppCheck.origin === "complaint", "Suppression origin is 'complaint'");

  const sendAttemptToComplained = await sendEmail({
    to: complaintEmail,
    subject: "Should be blocked",
    text: "This email must never reach Resend",
    businessName: "Complaint Lead",
    source: "test"
  });

  assert(sendAttemptToComplained.ok === false, "Suppression guard blocked complained address");

  // ------------------------------------------------------------
  // TEST 4: PRE-SEND DNS MX VERIFICATION & DISPOSABLE BLOCK
  // ------------------------------------------------------------
  console.log("\n--- TEST 4: Pre-Send Verification (DNS MX & Disposable) ---");
  
  // Non-existent domain
  const nonExistentEmail = "owner@nonexistentcompanyxyz987654321.org";
  const verNonExistent = await verifyEmail(nonExistentEmail);
  assert(verNonExistent.status === "INVALID", "Pre-send check classified non-existent domain as INVALID");
  const sendNonExistent = await sendEmail({
    to: nonExistentEmail,
    subject: "Test Non Existent",
    text: "Should never send",
    businessName: "Non Existent Co"
  });
  assert(sendNonExistent.ok === false, "Send blocked for non-existent domain");

  // Disposable domain
  const disposableEmail = "tempcontact@mailinator.com";
  const verDisposable = await verifyEmail(disposableEmail);
  assert(verDisposable.status === "INVALID", "Pre-send check classified disposable domain as INVALID");
  const sendDisposable = await sendEmail({
    to: disposableEmail,
    subject: "Test Disposable",
    text: "Should never send",
    businessName: "Disposable Co"
  });
  assert(sendDisposable.ok === false, "Send blocked for disposable email domain");

  // Valid domain MX resolution
  const validCheck = await verifyEmail("luke@vantorxsolutions.com");
  assert(validCheck.status === "VALID", "MX verification succeeded for vantorxsolutions.com");
  assert(validCheck.provider === "Cloudflare Email Routing", `Detected provider: ${validCheck.provider}`);

  // ------------------------------------------------------------
  // TEST 5: HISTORICAL HARD BOUNCE FABRICATION BLOCK
  // ------------------------------------------------------------
  console.log("\n--- TEST 5: Verification of Known Fabricated Email Protection ---");
  const fabricatedEmail = "drhvacandplumbing@gmail.com";
  const fabCheck = isSuppressed(fabricatedEmail);
  assert(fabCheck.suppressed === true, `drhvacandplumbing@gmail.com is suppressed`);

  const sendFab = await sendEmail({
    to: fabricatedEmail,
    subject: "Should be blocked",
    text: "Should never send",
    businessName: "DR HVAC"
  });
  assert(sendFab.ok === false && sendFab.suppressed === true, "Send blocked for drhvacandplumbing@gmail.com");

  // ------------------------------------------------------------
  // TEST 6: DELIVERY METRICS & DASHBOARD DATA AGGREGATION
  // ------------------------------------------------------------
  console.log("\n--- TEST 6: Delivery Dashboard Telemetry & Health Checks ---");
  const metrics = getMetrics();
  console.log("  Telemetry Snapshot:", {
    totalProcessed: metrics.totalProcessed,
    totalSent: metrics.totalSent,
    totalDelivered: metrics.totalDelivered,
    totalBounced: metrics.totalBounced,
    totalSuppressed: metrics.totalSuppressed,
    deliveryRate: metrics.deliveryRate,
    bounceRate: metrics.bounceRate,
    complaintRate: metrics.complaintRate
  });

  assert(metrics.totalProcessed >= 1, `Total processed emails recorded: ${metrics.totalProcessed}`);
  assert(metrics.totalDelivered >= 1, `Total delivered emails recorded: ${metrics.totalDelivered}`);
  assert(metrics.totalSuppressed >= 1, `Total suppressed addresses recorded: ${metrics.totalSuppressed}`);
  assert(typeof metrics.deliveryRate === "string", "Delivery rate is calculated");
  assert(typeof metrics.bounceRate === "string", "Bounce rate is calculated");

  // Verify drill-down email lookup
  const emails = getEmails({ limit: 10 });
  assert(emails.length > 0, `Outbound email log returned ${emails.length} records`);
  const firstEmail = emails[0];
  assert(Boolean(firstEmail.id), `Drill-down email has valid ID: ${firstEmail.id}`);
  assert(Boolean(firstEmail.recipient), `Drill-down email has recipient: ${firstEmail.recipient}`);

  console.log("\n============================================================");
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("============================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error("Test Suite crashed:", err);
  process.exit(1);
});