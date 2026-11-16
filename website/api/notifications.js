const { getSession, supabaseRequest, jsonError, methodNotAllowed } = require("./_lib/supabase");
const { sendEmail } = require("./_lib/email");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, svix-id, svix-timestamp, svix-signature");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const url = req.url || "";
  const query = req.query || {};
  let body = req.body || {};
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  const action = query.action || body.action || "";

  // 1. Resend Inbound Webhook Router
  if (action === "resend-webhook" || url.includes("resend-webhook")) {
    const webhookHandler = require("./_lib/resend-webhook-handler");
    return webhookHandler(req, res);
  }

  // 2. Email Delivery & Suppression Infrastructure Router
  if (
    action === "email-delivery" ||
    url.includes("email-delivery") ||
    url.includes("verify-email") ||
    url.includes("unsubscribe") ||
    query.deliveryAction ||
    action === "metrics" ||
    action === "log" ||
    action === "detail" ||
    action === "suppressions" ||
    action === "verify" ||
    action === "unsubscribe"
  ) {
    const deliveryHandler = require("./_lib/email-delivery-handler");
    return deliveryHandler(req, res);
  }

  // 3. VantorX Official Business Email Dispatch Router (/api/send-email)
  if (action === "send-email" || url.includes("send-email")) {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ ok: false, error: "Method not allowed. Use POST." });
    }
    try {
      const { to, subject, text, html, senderAlias, businessName, source } = body;

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

      let fromAddress = "Luke Hamilton <luke@vantorxsolutions.com>";
      if (senderAlias === "ava") {
        fromAddress = "Ava - VantorX AI Solutions <ava@vantorxsolutions.com>";
      } else if (senderAlias === "contact" || senderAlias === "outbound") {
        fromAddress = "VantorX Outbound Team <contact@vantorxsolutions.com>";
      } else if (body.from && body.from.includes("@vantorxsolutions.com")) {
        fromAddress = body.from;
      }

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
        replyTo: "Luke Hamilton <luke@vantorxsolutions.com>",
        businessName: businessName || null,
        source: source || "arena_app"
      });

      if (!result.ok) {
        const statusCode = result.suppressed ? 403 : (result.unverified ? 422 : 502);
        return res.status(statusCode).json({
          ok: false,
          error: result.error || "Failed to dispatch email through VantorX email gateway.",
          suppressed: Boolean(result.suppressed),
          unverified: Boolean(result.unverified)
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
      return res.status(500).json({
        ok: false,
        error: err.message || "Internal server error dispatching email."
      });
    }
  }

  // 4. Default Supabase Notifications Handler
  if (req.method !== "GET" && req.method !== "PUT" && req.method !== "POST") {
    return methodNotAllowed(res, ["GET", "PUT", "POST"]);
  }

  try {
    const session = await getSession(req, res);
    if (!session) {
      return res.status(401).json({ ok: false, error: "Authentication required." });
    }

    if (req.method === "GET") {
      const data = await supabaseRequest(
        "/rest/v1/notifications?order=created_at.desc&limit=50",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      const rows = (Array.isArray(data) ? data : []).map((n) => ({
        id: n.id,
        businessId: n.business_id,
        title: n.title,
        body: n.body || "",
        category: n.category || "general",
        at: n.created_at,
        createdAt: n.created_at,
        read: Boolean(n.read_at),
        readAt: n.read_at,
      }));

      return res.status(200).json({ ok: true, rows });
    }

    // PUT/POST - mark read
    const notifId = body.id || query.id;

    if (notifId) {
      await supabaseRequest(`/rest/v1/notifications?id=eq.${encodeURIComponent(notifId)}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ read_at: new Date().toISOString() }),
      });
    } else {
      // Mark all read for this user
      await supabaseRequest(`/rest/v1/notifications?user_id=eq.${encodeURIComponent(session.user.id)}&read_at=is.null`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ read_at: new Date().toISOString() }),
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return jsonError(res, err);
  }
};
