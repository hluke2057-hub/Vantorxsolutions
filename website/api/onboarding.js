const { getSession, supabaseRequest, jsonError, methodNotAllowed } = require("./_lib/supabase");

async function resolveBusinessId(session) {
  const members = await supabaseRequest(
    `/rest/v1/business_members?select=business_id&user_id=eq.${encodeURIComponent(session.user.id)}&order=created_at.desc&limit=1`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } }
  );
  return Array.isArray(members) && members[0] && members[0].business_id ? members[0].business_id : null;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const urlParts = (req.url || "").split("?")[0].split("/").filter(Boolean);
  const action = req.query.action || urlParts[urlParts.length - 1] || "";

  try {
    const session = await getSession(req, res);
    if (!session) {
      return res.status(401).json({ ok: false, error: "Authentication required." });
    }

    let bizId = await resolveBusinessId(session);
    if (!bizId) {
      // If no business exists yet for this user, create one automatically as first owner
      const body = req.body || {};
      const fallbackName = (body.name || "My Business").trim();
      bizId = await supabaseRequest("/rest/v1/rpc/create_business_with_owner", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ business_name: fallbackName, business_slug: null, business_timezone: "America/New_York" }),
      });
    }

    switch (action.toLowerCase()) {
      case "draft": {
        if (req.method === "GET") {
          const draft = await supabaseRequest(
            `/rest/v1/onboarding_drafts?business_id=eq.${encodeURIComponent(bizId)}&limit=1`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${session.accessToken}` },
            }
          );
          return res.status(200).json({ ok: true, draft: Array.isArray(draft) && draft[0] ? draft[0].data : null });
        }

        if (req.method === "PUT") {
          const body = req.body || {};
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
          );
          return res.status(200).json({ ok: true });
        }

        return methodNotAllowed(res, ["GET", "PUT"]);
      }

      case "validate": {
        if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
        const body = req.body || {};
        const checks = {
          name: Boolean(body.name && String(body.name).trim().length >= 2),
          contact: Boolean(body.phone || body.email),
          services: Array.isArray(body.services) && body.services.length > 0 && body.services.some((s) => s.name && s.price > 0),
          hours: Boolean(body.hours && typeof body.hours === "object"),
          ai: Boolean(body.ai && body.ai.name),
        };
        const allPass = Object.values(checks).every(Boolean);
        return res.status(200).json({ ok: allPass, blocked: !allPass, checks });
      }

      case "golive": {
        if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
        
        // 1. Fetch latest draft data
        const draftRow = await supabaseRequest(
          `/rest/v1/onboarding_drafts?business_id=eq.${encodeURIComponent(bizId)}&limit=1`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${session.accessToken}` },
          }
        );
        const d = (Array.isArray(draftRow) && draftRow[0] && draftRow[0].data) || req.body || {};

        // 2. Update business profile
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
          });
        }

        // 3. Upsert services
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
            });
          }
        }

        // 4. Update AI receptionist config
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
        });

        // 5. Mark draft launched
        await supabaseRequest(`/rest/v1/onboarding_drafts?business_id=eq.${encodeURIComponent(bizId)}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${session.accessToken}` },
          body: JSON.stringify({
            launched_at: new Date().toISOString(),
            updated_by: session.user.id,
          }),
        });

        return res.status(200).json({
          ok: true,
          business: { id: bizId, name: d.name || "Business" },
          checks: { complete: true },
        });
      }

      default:
        return res.status(404).json({ ok: false, error: "Unknown onboarding action." });
    }
  } catch (err) {
    return jsonError(res, err);
  }
};
