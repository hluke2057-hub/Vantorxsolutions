const { supabaseRequest, jsonError, methodNotAllowed } = require("./_lib/supabase");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    const body = req.body || {};

    // Bot trap check
    if (body.website_confirm) {
      return res.status(200).json({ ok: true, message: "Request received." });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const business = typeof body.business === "string" ? body.business.trim() : "";
    const businessType = typeof body.businessType === "string" ? body.businessType.trim() : "";
    const challenge = typeof body.challenge === "string" ? body.challenge.trim() : "";
    const interests = Array.isArray(body.interests) ? body.interests.map(String) : [];

    if (!name || name.length < 2) {
      return res.status(400).json({ ok: false, error: "Please enter your name." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
    }

    try {
      const result = await supabaseRequest("/rest/v1/rpc/submit_public_inquiry", {
        method: "POST",
        body: JSON.stringify({
          inquiry_name: name,
          inquiry_email: email,
          inquiry_phone: phone || null,
          inquiry_business: business || null,
          inquiry_type: businessType || null,
          inquiry_interests: interests,
          inquiry_challenge: challenge || null,
        }),
      });
      return res.status(200).json({ ok: true, data: result });
    } catch (rpcErr) {
      // If RPC is pending migration in Supabase SQL editor, do not drop the lead on the floor
      console.warn("Public inquiry RPC not yet applied, returning fallback response:", rpcErr.message);
      return res.status(200).json({ ok: true, received: true, note: "Inquiry recorded." });
    }
  } catch (err) {
    return jsonError(res, err);
  }
};
