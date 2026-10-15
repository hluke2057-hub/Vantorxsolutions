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
    if (req.method === "POST") {
      // Inbound webhook from Vapi / Voice Provider
      const body = req.body || {};
      const message = body.message || body;
      const callData = message.call || body.call || {};
      const customer = message.customer || callData.customer || {};
      const analysis = message.analysis || callData.analysis || {};

      const providerCallId = callData.id || message.callId || body.id || `call_${Date.now()}`;
      const callerPhone = customer.number || customer.phone || callData.phoneNumber || "";
      const callerName = analysis.structuredData?.caller_name || customer.name || "Inbound Caller";
      const durationSeconds = Math.round(Number(callData.duration || message.duration || 0));
      const summary = message.summary || analysis.summary || "";
      const transcript = message.transcript || "";
      const recordingUrl = message.recordingUrl || callData.recordingUrl || null;
      const bizId = req.query?.businessId || "e951dc91-b0e5-4f8e-9b27-80c539a16c66";

      // Insert record into calls table
      await supabaseRequest("/rest/v1/calls", {
        method: "POST",
        headers: {
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          business_id: bizId,
          provider_call_id: providerCallId,
          caller_name: callerName,
          caller_phone: callerPhone,
          direction: "inbound",
          status: "completed",
          started_at: callData.startedAt || new Date().toISOString(),
          ended_at: callData.endedAt || new Date().toISOString(),
          duration_seconds: durationSeconds,
          summary: summary,
          transcript: transcript,
          recording_url: recordingUrl,
          metadata: { provider: "vapi", raw: body },
        }),
      });

      // Automatically capture lead in LeadFlow if caller phone is known
      if (callerPhone) {
        try {
          await supabaseRequest("/rest/v1/leads", {
            method: "POST",
            headers: {
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              business_id: bizId,
              name: callerName || "Inbound Phone Lead",
              phone: callerPhone,
              source: "AI Receptionist Ava",
              status: "contacted",
              notes: summary || "Auto-captured from AI phone call.",
            }),
          });
        } catch (_) {
          // non-fatal lead sync
        }
      }

      return res.status(200).json({ ok: true, message: "Call webhook processed successfully" });
    }

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
