const {
  getMetrics,
  getEmails,
  getSuppressionList,
  addSuppression,
  addUnsubscribe,
  loadStore
} = require("./delivery-store");
const { verifyEmail, verifyBatch } = require("./verifier");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  let action = (req.query && (req.query.deliveryAction || req.query.action)) || 
               (req.body && (req.body.deliveryAction || req.body.action)) || "metrics";

  if (action === "email-delivery") {
    action = (req.query && req.query.deliveryAction) || "metrics";
  }

  // 1. GET METRICS
  if (action === "metrics" && req.method === "GET") {
    try {
      const metrics = getMetrics();
      return res.status(200).json({ ok: true, metrics });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  // 2. GET EMAIL LOG
  if (action === "log" && req.method === "GET") {
    try {
      const limit = parseInt(req.query.limit || "100", 10);
      const status = req.query.status || null;
      const search = req.query.search || "";
      const emails = getEmails({ limit, status, search });
      return res.status(200).json({ ok: true, count: emails.length, emails });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  // 3. GET EMAIL DETAIL
  if (action === "detail" && req.method === "GET") {
    try {
      const id = req.query.id;
      const store = loadStore();
      const record = store.emails[id];
      if (!record) {
        return res.status(404).json({ ok: false, error: "Email record not found" });
      }
      const relatedEvents = (store.events || []).filter(
        e => e.emailId === id || (e.recipient && e.recipient === record.recipient)
      );
      const isCurrentlySuppressed = (store.suppressions || []).find(
        s => s.email && s.email.toLowerCase() === record.recipient.toLowerCase()
      );

      return res.status(200).json({
        ok: true,
        email: record,
        events: relatedEvents,
        suppressionInfo: isCurrentlySuppressed || null
      });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  // 4. GET SUPPRESSIONS LIST
  if (action === "suppressions" && req.method === "GET") {
    try {
      const list = getSuppressionList();
      return res.status(200).json({ ok: true, count: list.length, suppressions: list });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  // 5. LIVE PRE-SEND VERIFICATION
  if (action === "verify" && req.method === "POST") {
    try {
      let body = req.body;
      if (typeof body === "string") {
        try { body = JSON.parse(body); } catch (_) { body = {}; }
      }
      const email = body?.email;
      if (!email) {
        return res.status(400).json({ ok: false, error: "Missing email to verify" });
      }
      const result = await verifyEmail(email);
      return res.status(200).json({ ok: true, verification: result });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  // 6. 1-CLICK UNSUBSCRIBE (CAN-SPAM COMPLIANCE)
  if (action === "unsubscribe") {
    const email = (req.query && req.query.email) || (req.body && req.body.email);
    if (!email || !email.includes("@")) {
      return res.status(400).send("Invalid email address for unsubscribe.");
    }

    addUnsubscribe({
      email: email.trim().toLowerCase(),
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || "web"
    });

    if (req.method === "GET") {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Unsubscribed &bull; VantorX Solutions</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 36px; max-width: 480px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
    h1 { font-size: 20px; margin-bottom: 12px; color: #38bdf8; }
    p { font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 20px; }
    .badge { display: inline-block; background: rgba(16,185,129,0.15); border: 1px solid #10b981; color: #10b981; padding: 6px 14px; border-radius: 999px; font-weight: 600; font-size: 13px; }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size: 44px; margin-bottom: 16px;">✓</div>
    <h1>You have been unsubscribed</h1>
    <p><strong>${email}</strong> has been permanently removed from VantorX outreach campaigns and added to our suppression guard list.</p>
    <div class="badge">Opt-Out Recorded</div>
  </div>
</body>
</html>`);
    }

    return res.status(200).json({ ok: true, message: `Successfully unsubscribed ${email}` });
  }

  return res.status(400).json({ ok: false, error: `Unknown action: ${action}` });
};
