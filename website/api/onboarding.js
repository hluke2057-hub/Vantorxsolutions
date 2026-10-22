const { getSession, supabaseRequest, jsonError, methodNotAllowed } = require("./_lib/supabase");
const { sendEmail } = require("./_lib/email");

async function resolveBusinessId(session) {
  if (!session || !session.user || !session.accessToken) return null;
  try {
    const members = await supabaseRequest(
      `/rest/v1/business_members?select=business_id&user_id=eq.${encodeURIComponent(session.user.id)}&order=created_at.desc&limit=1`,
      { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return Array.isArray(members) && members[0] && members[0].business_id ? members[0].business_id : null;
  } catch {
    return null;
  }
}

function buildOnboardingEmailHtml(d) {
  const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const servicesRows = Array.isArray(d.services) && d.services.length
    ? d.services.map(s => `<tr><td style="padding:6px 10px;border-bottom:1px solid #334155;">${s.name || "—"}</td><td style="padding:6px 10px;border-bottom:1px solid #334155;color:#fbbf24;font-weight:600;">$${s.price || 0}</td><td style="padding:6px 10px;border-bottom:1px solid #334155;">${s.minutes ? s.minutes + " min" : "—"}</td></tr>`).join("")
    : `<tr><td colspan="3" style="padding:8px;color:#94a3b8;">No services specified</td></tr>`;

  const hoursRows = d.hours && typeof d.hours === "object"
    ? Object.entries(d.hours).map(([day, h]) => `<tr><td style="padding:4px 10px;text-transform:uppercase;font-weight:600;color:#94a3b8;width:70px;">${day}</td><td style="padding:4px 10px;">${h.closed ? '<span style="color:#ef4444;">Closed</span>' : `${h.open || "9:00 AM"} – ${h.close || "5:00 PM"}`}</td></tr>`).join("")
    : `<tr><td colspan="2" style="padding:8px;color:#94a3b8;">Standard hours</td></tr>`;

  const ai = d.ai || {};
  const policies = d.policies || {};
  const conns = d.connections || {};

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#e2e8f0;background:#0b0f17;padding:24px;border-radius:12px;max-width:650px;margin:0 auto;border:1px solid #1e293b;">
      <div style="border-bottom:2px solid #d4af37;padding-bottom:14px;margin-bottom:20px;">
        <span style="background:#d4af37;color:#0b0f17;font-size:11px;font-weight:800;padding:3px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:1px;">New Client Onboarded</span>
        <h1 style="color:#f8fafc;margin:10px 0 4px;font-size:24px;">${d.name || "New Client"}</h1>
        <p style="color:#94a3b8;margin:0;font-size:13px;">Submitted: ${timestamp} ET · Direct Dossier for Luke Hamilton</p>
      </div>

      <!-- Contact Card -->
      <div style="background:#131b2e;padding:16px;border-radius:8px;margin-bottom:16px;border:1px solid #1e293b;">
        <h3 style="color:#d4af37;margin:0 0 10px;font-size:15px;text-transform:uppercase;letter-spacing:0.5px;">🏢 Business &amp; Contact Information</h3>
        <p style="margin:4px 0;"><strong>Owner / Contact:</strong> ${d.contact || "—"}</p>
        <p style="margin:4px 0;"><strong>Phone:</strong> <a href="tel:${d.phone}" style="color:#60a5fa;font-weight:bold;text-decoration:none;">${d.phone || "—"}</a></p>
        <p style="margin:4px 0;"><strong>Email:</strong> <a href="mailto:${d.email}" style="color:#60a5fa;text-decoration:none;">${d.email || "—"}</a></p>
        <p style="margin:4px 0;"><strong>City / Market:</strong> ${d.city || "—"}</p>
        <p style="margin:4px 0;"><strong>Industry:</strong> ${d.industry || "Trade Contractor"}</p>
        <p style="margin:4px 0;"><strong>Website:</strong> ${d.website ? `<a href="${d.website}" style="color:#60a5fa;">${d.website}</a>` : "None"}</p>
      </div>

      <!-- Ava Setup -->
      <div style="background:#131b2e;padding:16px;border-radius:8px;margin-bottom:16px;border:1px solid #1e293b;">
        <h3 style="color:#d4af37;margin:0 0 10px;font-size:15px;text-transform:uppercase;letter-spacing:0.5px;">🤖 Ava Receptionist Configuration</h3>
        <p style="margin:4px 0;"><strong>Agent Name:</strong> ${ai.name || "Ava"}</p>
        <p style="margin:4px 0;"><strong>Personality:</strong> ${ai.personality || "Friendly & Professional"}</p>
        <p style="margin:4px 0;"><strong>Opening Greeting:</strong> "${ai.greeting || "Hello, thank you for calling. How can I help you today?"}"</p>
        <p style="margin:4px 0;"><strong>Emergency / Human Transfer Number:</strong> <a href="tel:${ai.transferNumber}" style="color:#34d399;font-weight:bold;">${ai.transferNumber || d.phone || "Not set"}</a></p>
        <p style="margin:4px 0;"><strong>Transfer Triggers:</strong> ${ai.transferWhen || "Emergencies or customer request"}</p>
      </div>

      <!-- Services & Prices -->
      <div style="background:#131b2e;padding:16px;border-radius:8px;margin-bottom:16px;border:1px solid #1e293b;">
        <h3 style="color:#d4af37;margin:0 0 10px;font-size:15px;text-transform:uppercase;letter-spacing:0.5px;">📋 Service Catalog &amp; Quoting</h3>
        <table style="width:100%;border-collapse:collapse;font-size:13.5px;color:#cbd5e1;">
          <thead>
            <tr style="text-align:left;border-bottom:1px solid #475569;color:#94a3b8;">
              <th style="padding:6px 10px;">Service</th>
              <th style="padding:6px 10px;">Price</th>
              <th style="padding:6px 10px;">Duration</th>
            </tr>
          </thead>
          <tbody>${servicesRows}</tbody>
        </table>
      </div>

      <!-- Hours & Policies -->
      <div style="background:#131b2e;padding:16px;border-radius:8px;margin-bottom:16px;border:1px solid #1e293b;">
        <h3 style="color:#d4af37;margin:0 0 10px;font-size:15px;text-transform:uppercase;letter-spacing:0.5px;">🕐 Operating Hours &amp; Policies</h3>
        <table style="width:100%;border-collapse:collapse;font-size:13px;color:#cbd5e1;margin-bottom:10px;">
          <tbody>${hoursRows}</tbody>
        </table>
        <p style="margin:4px 0;font-size:13px;"><strong>Cancellation:</strong> ${policies.cancellation || "Standard"}</p>
        <p style="margin:4px 0;font-size:13px;"><strong>Payment Accepted:</strong> ${policies.payment || "Cards, Cash"}</p>
      </div>

      <!-- Connections Requested -->
      <div style="background:#131b2e;padding:16px;border-radius:8px;margin-bottom:20px;border:1px solid #1e293b;">
        <h3 style="color:#d4af37;margin:0 0 10px;font-size:15px;text-transform:uppercase;letter-spacing:0.5px;">🔌 Requested Connections</h3>
        <p style="margin:4px 0;font-size:13px;">Phone Forwarding (*71): <strong style="color:#34d399;">${conns.phone ? "YES" : "Requested"}</strong></p>
        <p style="margin:4px 0;font-size:13px;">Calendar Sync: <strong style="color:#60a5fa;">${conns.calendar ? "YES" : "No"}</strong></p>
        <p style="margin:4px 0;font-size:13px;">LeadFlow SMS Speed-to-Lead: <strong style="color:#60a5fa;">${conns.leadflow ? "YES" : "No"}</strong></p>
        <p style="margin:4px 0;font-size:13px;">AEO Search Protocol: <strong style="color:#fbbf24;">${conns.aeo ? "YES" : "No"}</strong></p>
      </div>

      <div style="text-align:center;padding-top:12px;border-top:1px solid #1e293b;font-size:12px;color:#64748b;">
        VantorX Solutions Engine · <a href="https://www.vantorxsolutions.com/vantorx-admin/" style="color:#d4af37;">Open Operations Admin Console</a>
      </div>
    </div>
  `;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const urlParts = (req.url || "").split("?")[0].split("/").filter(Boolean);
  const action = (req.query.action || urlParts[urlParts.length - 1] || "").toLowerCase();

  try {
    let session = null;
    try {
      session = await getSession(req, res);
    } catch (_) {
      session = null;
    }

    switch (action) {
      case "validate": {
        if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
        const body = req.body || {};
        const checks = {
          name: Boolean(body.name && String(body.name).trim().length >= 2),
          contact: Boolean(body.phone || body.email),
          services: Array.isArray(body.services) && body.services.length > 0 && body.services.some((s) => s.name && Number(s.price) > 0),
          hours: Boolean(body.hours && typeof body.hours === "object"),
          ai: Boolean(body.ai && body.ai.name),
        };
        const allPass = Object.values(checks).every(Boolean);
        return res.status(200).json({ ok: allPass, blocked: !allPass, checks });
      }

      case "draft": {
        if (!session) {
          if (req.method === "GET") return res.status(200).json({ ok: true, draft: null, guest: true });
          if (req.method === "PUT") return res.status(200).json({ ok: true, guest: true, saved: "local" });
          return methodNotAllowed(res, ["GET", "PUT"]);
        }

        let bizId = await resolveBusinessId(session);
        if (!bizId) {
          const body = req.body || {};
          const fallbackName = (body.name || "My Business").trim();
          bizId = await supabaseRequest("/rest/v1/rpc/create_business_with_owner", {
            method: "POST",
            headers: { Authorization: `Bearer ${session.accessToken}` },
            body: JSON.stringify({ business_name: fallbackName, business_slug: null, business_timezone: "America/New_York" }),
          }).catch(() => null);
        }

        if (req.method === "GET") {
          if (!bizId) return res.status(200).json({ ok: true, draft: null });
          const draft = await supabaseRequest(
            `/rest/v1/onboarding_drafts?business_id=eq.${encodeURIComponent(bizId)}&limit=1`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${session.accessToken}` },
            }
          ).catch(() => []);
          return res.status(200).json({ ok: true, draft: Array.isArray(draft) && draft[0] ? draft[0].data : null });
        }

        if (req.method === "PUT") {
          const body = req.body || {};
          if (bizId) {
            await supabaseRequest(
              `/rest/v1/onboarding_drafts?business_id=eq.${encodeURIComponent(bizId)}`,
              {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${session.accessToken}`,
                  Prefer: "return=representation",
                },
                body: JSON.stringify({
                  data: body,
                  updated_by: session.user.id,
                }),
              }
            ).catch(() => null);
          }
          return res.status(200).json({ ok: true });
        }

        return methodNotAllowed(res, ["GET", "PUT"]);
      }

      case "submit":
      case "golive": {
        if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

        const body = req.body || {};
        let d = body;

        // If authenticated, merge with latest draft row if present
        let bizId = null;
        if (session) {
          bizId = await resolveBusinessId(session);
          if (bizId) {
            const draftRow = await supabaseRequest(
              `/rest/v1/onboarding_drafts?business_id=eq.${encodeURIComponent(bizId)}&limit=1`,
              {
                method: "GET",
                headers: { Authorization: `Bearer ${session.accessToken}` },
              }
            ).catch(() => []);
            if (Array.isArray(draftRow) && draftRow[0] && draftRow[0].data) {
              d = { ...draftRow[0].data, ...body };
            }
          }
        }

        const clientName = (d.name || "New Client Business").trim();
        const clientEmail = (d.email || "").trim();
        const clientPhone = (d.phone || "").trim();

        // 1. Dispatch Instant Alert Email to Luke
        const emailHtml = buildOnboardingEmailHtml(d);
        await sendEmail({
          to: ["luke@vantorxsolutions.com", "hluke2057@gmail.com"],
          subject: `🚀 New Client Onboarding Dossier: ${clientName} (${d.industry || "Contractor"})`,
          html: emailHtml,
          text: `New Client Onboarding Dossier for ${clientName}\nOwner: ${d.contact || "—"}\nPhone: ${clientPhone}\nEmail: ${clientEmail}\nCity: ${d.city || "—"}\nAva Name: ${d.ai?.name || "Ava"}\nTransfer: ${d.ai?.transferNumber || clientPhone}\n\nFull details available in VantorX Admin.`,
        }).catch((err) => {
          console.warn("[Onboarding Email Warning]", err.message);
        });

        // 2. If authenticated, update Supabase records
        if (session && bizId) {
          const updateBiz = {};
          if (d.name) updateBiz.name = String(d.name).trim();
          if (d.phone) updateBiz.phone = String(d.phone).trim();
          if (d.email) updateBiz.email = String(d.email).trim();
          if (d.website) updateBiz.website = String(d.website).trim();
          if (Object.keys(updateBiz).length > 0) {
            await supabaseRequest(`/rest/v1/businesses?id=eq.${encodeURIComponent(bizId)}`, {
              method: "PATCH",
              headers: { Authorization: `Bearer ${session.accessToken}` },
              body: JSON.stringify(updateBiz),
            }).catch(() => null);
          }

          if (Array.isArray(d.services) && d.services.length > 0) {
            for (const s of d.services) {
              if (!s.name) continue;
              await supabaseRequest("/rest/v1/services", {
                method: "POST",
                headers: { Authorization: `Bearer ${session.accessToken}` },
                body: JSON.stringify({
                  business_id: bizId,
                  name: String(s.name).trim(),
                  price: Number(s.price) || 0,
                  duration_minutes: Number(s.minutes) || 30,
                  active: true,
                }),
              }).catch(() => null);
            }
          }

          const ai = d.ai || {};
          await supabaseRequest(`/rest/v1/receptionist_configs?business_id=eq.${encodeURIComponent(bizId)}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${session.accessToken}` },
            body: JSON.stringify({
              enabled: true,
              agent_name: ai.name || "Ava",
              greeting: ai.greeting || "Hello, thank you for calling. How can I help you today?",
              instructions: [
                ai.personality ? `Personality: ${ai.personality}.` : "",
                d.knowledge && d.knowledge.length ? `FAQs: ${JSON.stringify(d.knowledge)}` : "",
                d.policies ? `Policies: ${JSON.stringify(d.policies)}` : "",
              ].filter(Boolean).join(" "),
              transfer_number: ai.transferNumber || "",
              updated_by: session.user.id,
            }),
          }).catch(() => null);

          await supabaseRequest(`/rest/v1/onboarding_drafts?business_id=eq.${encodeURIComponent(bizId)}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${session.accessToken}` },
            body: JSON.stringify({
              launched_at: new Date().toISOString(),
              updated_by: session.user.id,
            }),
          }).catch(() => null);
        }

        return res.status(200).json({
          ok: true,
          submitted: true,
          business: { id: bizId || `guest_${Date.now()}`, name: clientName },
          checks: { complete: true },
          message: "Onboarding dossier received and scheduled for deployment.",
        });
      }

      default:
        return res.status(404).json({ ok: false, error: "Unknown onboarding action." });
    }
  } catch (err) {
    return jsonError(res, err);
  }
};

