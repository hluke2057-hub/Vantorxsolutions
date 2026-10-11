const { supabaseRequest, setSessionCookies, jsonError, methodNotAllowed } = require("../_lib/supabase");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    const body = req.body || {};
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password || password.length > 128) return res.status(400).json({ ok: false, error: "Email and password are required." });

    const session = await supabaseRequest("/auth/v1/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!session.access_token || !session.refresh_token || !session.user) {
      return res.status(401).json({ ok: false, error: "Login failed. Check your credentials and email confirmation." });
    }
    setSessionCookies(res, session);
    return res.status(200).json({ ok: true, user: { id: session.user.id, email: session.user.email } });
  } catch (err) {
    if (err.status === 400 || err.status === 401) return res.status(401).json({ ok: false, error: "Invalid email or password, or email confirmation is required." });
    return jsonError(res, err);
  }
};
