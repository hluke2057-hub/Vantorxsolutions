const { supabaseRequest, setSessionCookies, jsonError, methodNotAllowed } = require("../_lib/supabase");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    const body = req.body || {};
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const fullName = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 120) : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, error: "Enter a valid email address." });
    if (password.length < 8 || password.length > 128) return res.status(400).json({ ok: false, error: "Password must be between 8 and 128 characters." });

    const result = await supabaseRequest("/auth/v1/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, data: { full_name: fullName } }),
    });
    if (result.access_token && result.refresh_token) setSessionCookies(res, result);
    return res.status(201).json({
      ok: true,
      authenticated: Boolean(result.access_token),
      user: result.user ? { id: result.user.id, email: result.user.email } : null,
      message: result.access_token ? "Account created." : "Account created. Check your email to confirm it before logging in.",
    });
  } catch (err) { return jsonError(res, err); }
};
