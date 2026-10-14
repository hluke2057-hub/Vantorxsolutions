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

      const appts = await supabaseRequest(
        `/rest/v1/appointments?business_id=eq.${encodeURIComponent(bizId)}&order=starts_at.asc`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      const rows = (Array.isArray(appts) ? appts : []).map((a) => ({
        id: a.id,
        businessId: a.business_id,
        customer: a.customer_name,
        customerName: a.customer_name,
        customerEmail: a.customer_email || "",
        customerPhone: a.customer_phone || "",
        at: a.starts_at,
        startsAt: a.starts_at,
        endsAt: a.ends_at,
        status: a.status || "requested",
        service: a.notes || "Consultation",
        source: a.source || "manual",
        createdAt: a.created_at,
      }));

      return res.status(200).json({ ok: true, rows });
    }

    // POST - create appointment
    const body = req.body || {};
    const bizId = await resolveBusinessId(session, body.businessId);
    if (!bizId) {
      return res.status(400).json({ ok: false, error: "Business context is required before creating an appointment." });
    }

    const customer = (body.customer || body.customer_name || body.customerName || "").trim();
    if (!customer) {
      return res.status(400).json({ ok: false, error: "Customer name is required." });
    }

    const startsAt = body.at || body.starts_at || body.startsAt || new Date().toISOString();
    const endsAt = body.ends_at || body.endsAt || new Date(new Date(startsAt).getTime() + 30 * 60000).toISOString();

    const inserted = await supabaseRequest("/rest/v1/appointments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        business_id: bizId,
        customer_name: customer,
        customer_email: body.customer_email || body.email || null,
        customer_phone: body.customer_phone || body.phone || null,
        starts_at: startsAt,
        ends_at: endsAt,
        status: body.status || "confirmed",
        notes: body.notes || body.service || null,
        created_by: session.user.id,
      }),
    });

    return res.status(201).json({ ok: true, appointment: Array.isArray(inserted) ? inserted[0] : inserted });
  } catch (err) {
    return jsonError(res, err);
  }
};
