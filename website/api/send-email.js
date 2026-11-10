// website/api/send-email.js
// VantorX Official Business Email Dispatch API
const { sendEmail } = require("./_lib/email");

module.exports = async function handler(req, res) {
  // CORS Headers for internal arena & web client access
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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

    const { to, subject, text, html, senderAlias } = body;

    if (!to || !to.includes("@")) {
      return res.status(400).json({ ok: false, error: "Missing or invalid recipient email address ('to')." });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({ ok: false, error: "Missing email subject line ('subject')." });
    }

    const emailBody = (text || html || body.body || "").trim();
    if (!emailBody) {
      return res.status(400).json({ ok: false, error: "Missing email message body." });
    }

    // Configure official VantorX business sender identity
    let fromAddress = "Luke Hamilton <luke@vantorxsolutions.com>";
    if (senderAlias === "ava") {
      fromAddress = "Ava - VantorX AI Solutions <ava@vantorxsolutions.com>";
    } else if (senderAlias === "contact" || senderAlias === "outbound") {
      fromAddress = "VantorX Outbound Team <contact@vantorxsolutions.com>";
    } else if (body.from && body.from.includes("@vantorxsolutions.com")) {
      fromAddress = body.from;
    }

    // Convert plain text newlines to HTML paragraphs for high deliverability
    const htmlFormatted = html || emailBody
      .split("\n\n")
      .map(p => `<p style="margin-bottom: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1e293b;">${p.replace(/\n/g, "<br>")}</p>`)
      .join("");

    const result = await sendEmail({
      to,
      subject,
      text: emailBody,
      html: htmlFormatted,
      from: fromAddress,
      replyTo: "Luke Hamilton <luke@vantorxsolutions.com>"
    });

    if (!result.ok) {
      return res.status(502).json({
        ok: false,
        error: result.error || "Failed to dispatch email through VantorX email gateway."
      });
    }

    return res.status(200).json({
      ok: true,
      id: result.id,
      sender: fromAddress,
      recipient: to,
      dispatchedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error("[VantorX Send Email API Error]", err);
    return res.status(500).json({
      ok: false,
      error: err.message || "Internal server error dispatching email."
    });
  }
};
