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
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  try {
    const session = await getSession(req, res);
    if (!session) {
      return res.status(401).json({ ok: false, error: "Authentication required." });
    }

    const bizId = await resolveBusinessId(session, req.query && req.query.businessId);
    if (!bizId) {
      return res.status(200).json({ ok: true, rows: [] });
    }

    const calls = await supabaseRequest(
      `/rest/v1/calls?business_id=eq.${encodeURIComponent(bizId)}&order=created_at.desc`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${session.accessToken}` },
      }
    );

    const rows = (Array.isArray(calls) ? calls : []).map((c) => ({
      id: c.id,
      businessId: c.business_id,
      caller: c.caller_name || "Unknown caller",
      from: c.caller_phone || "",
      direction: c.direction || "inbound",
      outcome: c.status || "completed",
      status: c.status || "completed",
      at: c.started_at || c.created_at,
      createdAt: c.created_at,
      duration: c.duration_seconds,
      summary: c.summary || "",
      transcript: c.transcript || "",
      recordingUrl: c.recording_url,
    }));

    return res.status(200).json({ ok: true, rows });
  } catch (err) {
    return jsonError(res, err);
  }
};
