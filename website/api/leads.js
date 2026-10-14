const { getSession, supabaseRequest, jsonError, methodNotAllowed } = require("./_lib/supabase");

async function resolveBusinessId(session, requestedId) {
  if (requestedId && typeof requestedId === "string" && requestedId.trim()) {
    return requestedId.trim();
  }
  const members = await supabaseRequest(
    `/rest/v1/business_members?select=business_id&user_id=eq.${encodeURIComponent(session.user.id)}&order=created_at.desc&limit=1`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } }
  );
  return Array.isArray(members) && members[0] && members[0].business_id ? members[0].business_id : null;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET" && req.method !== "POST") {
    return methodNotAllowed(res, ["GET", "POST"]);
  }

  try {
    const session = await getSession(req, res);
    if (!session) {
      return res.status(401).json({ ok: false, error: "Authentication required." });
    }

    if (req.method === "GET") {
      const bizId = await resolveBusinessId(session, req.query && req.query.businessId);
      if (!bizId) {
        return res.status(200).json({ ok: true, rows: [] });
      }

      const leads = await supabaseRequest(
        `/rest/v1/leads?business_id=eq.${encodeURIComponent(bizId)}&order=created_at.desc`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      const rows = (Array.isArray(leads) ? leads : []).map((l) => ({
        id: l.id,
        businessId: l.business_id,
        name: l.name,
        email: l.email || "",
        phone: l.phone || "",
        source: l.source || "Website",
        status: l.status || "new",
        value: l.value,
        notes: l.notes || "",
        createdAt: l.created_at,
        updatedAt: l.updated_at,
      }));

      return res.status(200).json({ ok: true, rows });
    }

    // POST - add lead
    const body = req.body || {};
    const bizId = await resolveBusinessId(session, body.businessId);
    if (!bizId) {
      return res.status(400).json({ ok: false, error: "Business context is required before creating a lead." });
    }

    const name = typeof body.name === "string" && body.name.trim()
      ? body.name.trim()
      : [body.firstName, body.lastName].filter(Boolean).join(" ").trim();

    if (!name || name.length < 2) {
      return res.status(400).json({ ok: false, error: "Lead name is required." });
    }

    const email = typeof body.email === "string" ? body.email.trim() : null;
    const phone = typeof body.phone === "string" ? body.phone.trim() : null;
    const source = typeof body.source === "string" && body.source.trim() ? body.source.trim() : "Manual";
    const status = typeof body.status === "string" && body.status.trim() ? body.status.trim().toLowerCase() : "new";
    const notes = typeof body.notes === "string" ? body.notes.trim() : null;
    const value = typeof body.value === "number" && body.value >= 0 ? body.value : null;

    const inserted = await supabaseRequest("/rest/v1/leads", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        business_id: bizId,
        name,
        email: email || null,
        phone: phone || null,
        source,
        status,
        notes,
        value,
      }),
    });

    const lead = Array.isArray(inserted) && inserted[0] ? inserted[0] : null;
    return res.status(201).json({ ok: true, lead });
  } catch (err) {
    return jsonError(res, err);
  }
};
