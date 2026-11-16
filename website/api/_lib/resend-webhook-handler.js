const { recordEvent, addSuppression } = require("./delivery-store");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, svix-id, svix-timestamp, svix-signature");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed. Use POST." });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (_) {
        body = {};
      }
    }
    body = body || {};

    const eventType = body.type; // e.g. "email.delivered", "email.bounced"
    const data = body.data || {};
    const emailId = data.email_id || data.id || body.id;
    const recipientRaw = Array.isArray(data.to) ? data.to[0] : (data.to || body.recipient || "");
    const recipient = typeof recipientRaw === "string" ? recipientRaw.trim().toLowerCase() : "";

    if (!eventType) {
      return res.status(400).json({ ok: false, error: "Missing event type in webhook payload" });
    }

    console.log(`[Resend Webhook] Received ${eventType} for ${recipient || "unknown"} (ID: ${emailId || "none"})`);

    let failureReason = null;
    let suppressionOrigin = null;

    if (eventType === "email.bounced") {
      const bounce = data.bounce || {};
      failureReason = bounce.message || bounce.sub_type || data.message || "Hard bounce received from recipient mail server";
      suppressionOrigin = "bounce";
      if (recipient) {
        addSuppression({
          email: recipient,
          reason: `Bounced: ${failureReason}`,
          origin: "bounce"
        });
      }
    } else if (eventType === "email.complained") {
      failureReason = "Spam complaint reported by recipient";
      suppressionOrigin = "complaint";
      if (recipient) {
        addSuppression({
          email: recipient,
          reason: failureReason,
          origin: "complaint"
        });
      }
    } else if (eventType === "email.suppressed") {
      failureReason = data.message || "Address previously suppressed on Resend account";
      suppressionOrigin = "suppressed";
      if (recipient) {
        addSuppression({
          email: recipient,
          reason: failureReason,
          origin: "suppressed"
        });
      }
    } else if (eventType === "email.failed") {
      failureReason = data.message || "Email dispatch failed";
    } else if (eventType === "email.delivery_delayed") {
      failureReason = data.message || "Delivery delayed by receiving server (temporary graylisting/throttle)";
    }

    const updatedRecord = recordEvent({
      emailId,
      recipient,
      type: eventType,
      data,
      reason: failureReason,
      origin: suppressionOrigin
    });

    return res.status(200).json({
      ok: true,
      processed: true,
      eventType,
      emailId,
      recipient,
      status: updatedRecord ? updatedRecord.status : "recorded"
    });
  } catch (err) {
    console.error("[Resend Webhook Exception]", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
