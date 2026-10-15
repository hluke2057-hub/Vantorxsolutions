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
    const customer = (body.customer || body.customer_name || body.customerName || "").trim();
    if (!customer) {
      return res.status(400).json({ ok: false, error: "Customer name is required." });
    }

    const startsAt = body.at || body.starts_at || body.startsAt || new Date().toISOString();
    const endsAt = body.ends_at || body.endsAt || new Date(new Date(startsAt).getTime() + 30 * 60000).toISOString();
    const service = body.notes || body.service || "Consultation";
    const phone = body.customer_phone || body.phone || null;
    const email = body.customer_email || body.email || null;

    if (session) {
      const bizId = await resolveBusinessId(session, body.businessId);
      if (!bizId) {
        return res.status(400).json({ ok: false, error: "Business context is required before creating an appointment." });
      }

      const inserted = await supabaseRequest("/rest/v1/appointments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          business_id: bizId,
          customer_name: customer,
          customer_email: email,
          customer_phone: phone,
          starts_at: startsAt,
          ends_at: endsAt,
          status: body.status || "confirmed",
          notes: service,
          created_by: session.user.id,
        }),
      });

      return res.status(201).json({ ok: true, appointment: Array.isArray(inserted) ? inserted[0] : inserted });
    }

    // Unauthenticated booking (from AI receptionist Ava or external calendar webhook)
    const targetBizId = body.businessId || body.business_id || "e951dc91-b0e5-4f8e-9b27-80c539a16c66";
    try {
      const rpcResult = await supabaseRequest("/rest/v1/rpc/book_appointment", {
        method: "POST",
        body: JSON.stringify({
          p_business_id: targetBizId,
          p_customer_name: customer,
          p_customer_phone: phone,
          p_customer_email: email,
          p_starts_at: startsAt,
          p_ends_at: endsAt,
          p_service: service,
          p_source: body.source || "AI Receptionist Ava",
        }),
      });
      return res.status(201).json({ ok: true, result: rpcResult });
    } catch (rpcErr) {
      // Fallback: log to audit_log
      try {
        await supabaseRequest("/rest/v1/audit_log", {
          method: "POST",
          body: JSON.stringify({
            action: "appointment.request_received",
            entity_type: "appointment",
            details: { customer, phone, email, startsAt, service, error: rpcErr.message },
          }),
        });
      } catch (_) {}
      return res.status(200).json({ ok: true, message: "Appointment request logged", warning: rpcErr.message });
    }
  } catch (err) {
    return jsonError(res, err);
  }
};
