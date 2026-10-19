const { supabaseRequest, jsonError, methodNotAllowed } = require("./_lib/supabase");
const { sendEmail } = require("./_lib/email");

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

    const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
    const formattedInterests = interests.length ? interests.join(", ") : "General Consultation / Discovery";

    // 1. Dispatch Instant Lead Notification Email to Luke
    const ownerEmailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="background: #0b0f16; padding: 16px 20px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="color: #c7a468; margin: 0; font-size: 20px;">🚨 New Inbound Demo / Audit Request</h2>
          <p style="color: #9ca6b4; margin: 4px 0 0 0; font-size: 13px;">Received via VantorX Marketing Website (${timestamp} ET)</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 15px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 140px;"><strong>Contact Name:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Business Name:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${business || "Not specified"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Industry / Type:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${businessType || "Not specified"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Phone:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
              ${phone ? `<a href="tel:${phone}" style="color: #c7a468; font-weight: 600; text-decoration: none;">📞 ${phone} (Tap to Call)</a>` : '<span style="color: #94a3b8;">None provided</span>'}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Email:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
              <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Selected Packages:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 600;">
              ${formattedInterests}
            </td>
          </tr>
        </table>

        ${challenge ? `
          <div style="background: #f8fafc; border-left: 4px solid #c7a468; padding: 14px 18px; margin-bottom: 24px; border-radius: 4px;">
            <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase;">Customer Challenge / Note:</p>
            <p style="margin: 0; font-size: 14px; color: #1e293b; font-style: italic;">"${challenge}"</p>
          </div>
        ` : ""}

        <div style="margin-top: 24px; text-align: center;">
          ${phone ? `<a href="tel:${phone}" style="display: inline-block; background: #c7a468; color: #14110a; font-weight: 700; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-right: 10px;">Call Lead Now</a>` : ""}
          <a href="mailto:${email}?subject=Regarding%20your%20VantorX%20demo%20request" style="display: inline-block; background: #0f172a; color: #ffffff; font-weight: 600; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Reply via Email</a>
        </div>
      </div>
    `;

    // Fire email notifications in background or await
    const emailPromises = [
      sendEmail({
        to: ["hluke2057@gmail.com", "luke@vantorxsolutions.com"],
        replyTo: `${name} <${email}>`,
        subject: `🚨 New VantorX Lead: ${name} (${business || "Local Business"})`,
        html: ownerEmailHtml,
      }),
      sendEmail({
        to: email,
        subject: "We received your demo request — VantorX Solutions",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0f172a; margin-bottom: 8px;">Hi ${name},</h2>
            <p>Thank you for reaching out to VantorX Solutions! We received your request regarding <strong>${business || "your business"}</strong>.</p>
            <p>We are reviewing your requested services (<strong>${formattedInterests}</strong>) and will follow up shortly to schedule your personalized walk-through.</p>
            
            <div style="background: #f8fafc; border-left: 4px solid #c7a468; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #475569;">
                <strong>Want to test our AI right now?</strong><br>
                You can call Ava, our 24/7 AI Receptionist, at <a href="tel:5618138602" style="color: #c7a468; font-weight: bold; text-decoration: none;">(561) 813-8602</a> to hear how she handles emergency calls and appointments in real time.
              </p>
            </div>

            <p style="margin-top: 24px; font-size: 14px; color: #64748b;">
              Best regards,<br>
              <strong style="color: #0f172a;">Luke</strong><br>
              Founder, VantorX Solutions<br>
              <a href="https://www.vantorxsolutions.com" style="color: #c7a468;">vantorxsolutions.com</a> · (561) 813-8602
            </p>
          </div>
        `,
      }),
    ];

    // Attempt Supabase audit logging
    const supabasePromise = supabaseRequest("/rest/v1/rpc/submit_public_inquiry", {
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
    }).catch((err) => {
      console.warn("[VantorX Audit] Supabase RPC fallback:", err.message);
      return { ok: false, error: err.message };
    });

    await Promise.allSettled([...emailPromises, supabasePromise]);

    return res.status(200).json({
      ok: true,
      message: "Thanks — we've received your request and will be in touch shortly.",
    });
  } catch (err) {
    return jsonError(res, err);
  }
};
