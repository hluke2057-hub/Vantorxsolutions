const { getSession, supabaseRequest, jsonError, methodNotAllowed } = require("./_lib/supabase");

async function resolveBusinessId(session, requestedId) {
  if (requestedId && typeof requestedId === "string" && requestedId.trim()) {
    return requestedId.trim();
  }
  try {
    const members = await supabaseRequest(
      `/rest/v1/business_members?select=business_id&user_id=eq.${encodeURIComponent(session.user.id)}&order=created_at.desc&limit=1`,
      { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return Array.isArray(members) && members[0] && members[0].business_id ? members[0].business_id : null;
  } catch (_) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET" && req.method !== "PUT" && req.method !== "PATCH" && req.method !== "POST") {
    return methodNotAllowed(res, ["GET", "PUT", "PATCH", "POST"]);
  }

  try {
    const session = await getSession(req, res);
    if (!session) {
      return res.status(401).json({ ok: false, error: "Authentication required." });
    }

    const body = req.body || {};
    const action = req.query?.action || body.action;

    // AI Talk Simulation endpoint
    if (action === "talk" || action === "start" || action === "turn") {
      if (action === "turn") {
        const text = (body.text || "").toLowerCase();
        let reply = "I'd be glad to help you schedule that service. What day and time works best for you?";

        // 1. Critical Life Safety: Self-Harm & Suicide Crisis Interceptor (CRISIS_INTERCEPTOR - National 988 Lifeline)
        if (text.includes("suicide") || text.includes("kill myself") || text.includes("hurt myself") || text.includes("end my life") || text.includes("want to die") || text.includes("self harm") || text.includes("overdose") || text.includes("hang myself")) {
          reply = "If you are in distress or thinking about self-harm, please know that you are not alone. Please dial, call, or text 988 immediately to connect with the 988 Suicide & Crisis Lifeline for free, confidential support 24/7. People care and help is available right now.";
          return res.status(200).json({ ok: true, sessionId: body.sessionId || "crisis_session", reply, crisisAlert: true, hotline: "988", interceptor: "CRISIS_INTERCEPTOR" });
        }

        // 2. Critical Life Safety: 911 Life-Threatening Emergency Guardrail (EMERGENCY_INTERCEPTOR)
        if (text.includes("heart attack") || text.includes("cannot breathe") || text.includes("can't breathe") || text.includes("unconscious") || text.includes("house fire") || text.includes("building fire") || text.includes("call 911") || text.includes("intruder") || text.includes("active shooter")) {
          reply = "Ava cannot dispatch 911 emergency services. If you or someone nearby is in immediate physical danger, please hang up immediately and dial 911.";
          return res.status(200).json({ ok: true, sessionId: body.sessionId || "emergency_session", reply, emergency911: true, interceptor: "EMERGENCY_INTERCEPTOR" });
        }

        if (text.includes("transfer") || text.includes("human") || text.includes("person") || text.includes("speak with") || text.includes("talk to") || text.includes("manager") || text.includes("luke")) {
          reply = "I'd be glad to connect you. Hold on just a moment while I transfer your call directly to our line at (561) 813-8602.";
          return res.status(200).json({ ok: true, sessionId: body.sessionId || "test_session", reply, action: "transfer", transferNumber: "(561) 813-8602" });
        } else if (text.includes("emergency") || text.includes("leak") || text.includes("ac broken") || text.includes("no heat")) {
          reply = "I understand this is an emergency. I have flagged your location for priority dispatch and sent an instant SMS to our on-call technician.";
        } else if (text.includes("pricing") || text.includes("cost") || text.includes("quote")) {
          reply = "We offer upfront, transparent flat-rate pricing. We can have a specialist visit for a comprehensive free estimate. Would you like to set that up?";
        }
        return res.status(200).json({ ok: true, sessionId: body.sessionId || "test_session", reply });
      }

      // Default start with two-party recording disclosure
      return res.status(200).json({
        ok: true,
        sessionId: `sess_${Date.now()}`,
        reply: "Hi! Thank you for calling. This call may be recorded for quality and training. I'm Ava, your 24/7 AI receptionist. How can I help you today?",
      });
    }

    const bizId = await resolveBusinessId(session, (req.query && req.query.businessId) || body.businessId);
    if (!bizId) {
      return res.status(400).json({ ok: false, error: "Business ID is required." });
    }

    if (req.method === "GET") {
      let cfg = null;
      try {
        const data = await supabaseRequest(
          `/rest/v1/receptionist_configs?business_id=eq.${encodeURIComponent(bizId)}&limit=1`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${session.accessToken}` },
          }
        );
        cfg = Array.isArray(data) && data[0] ? data[0] : null;
      } catch (_) {}

      return res.status(200).json({
        ok: true,
        businessId: bizId,
        config: cfg || {
          business_id: bizId,
          enabled: true,
          agent_name: "Ava",
          greeting: "Hello, thank you for calling. This call is recorded for quality assurance. How can I help you today?",
          instructions: "Help customers book appointments, answer pricing questions, and dispatch emergency calls. Transfer to Luke at (561) 813-8602 when requested. In case of mental health crisis or self-harm, immediately provide the 988 Suicide & Crisis Lifeline. In case of life-threatening physical emergency, instruct to hang up and call 911 immediately.",
          voice: "alloy",
          transfer_number: "(561) 813-8602",
          allow_transfer: true,
          settings: {
            transferNumber: "(561) 813-8602",
            allowTransfer: true,
            transferWhen: "When caller asks for a human, manager, or immediate emergency dispatch"
          },
        },
      });
    }

    // POST / PUT / PATCH - update config or toggle activation
    const patch = {};
    if (action === "activate") patch.enabled = true;
    if (action === "deactivate") patch.enabled = false;
    if (typeof body.enabled === "boolean") patch.enabled = body.enabled;
    if (typeof body.agent_name === "string") patch.agent_name = body.agent_name.trim();
    if (typeof body.greeting === "string") patch.greeting = body.greeting.trim();
    if (typeof body.instructions === "string") patch.instructions = body.instructions.trim();
    if (typeof body.voice === "string") patch.voice = body.voice.trim();
    if (typeof body.transfer_number === "string") patch.transfer_number = body.transfer_number.trim();
    if (body.settings && typeof body.settings === "object") patch.settings = body.settings;
    patch.updated_by = session.user.id;

    try {
      const updated = await supabaseRequest(
        `/rest/v1/receptionist_configs?business_id=eq.${encodeURIComponent(bizId)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify(patch),
        }
      );
      return res.status(200).json({ ok: true, config: Array.isArray(updated) ? updated[0] : updated });
    } catch (_) {
      return res.status(200).json({ ok: true, config: { business_id: bizId, ...patch } });
    }
  } catch (err) {
    return jsonError(res, err);
  }
};
