const { supabaseRequest, setSessionCookies, clearSessionCookies, getSession, jsonError, methodNotAllowed } = require("./_lib/supabase");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  
  // Extract action from query (via vercel rewrite) or from path
  const urlParts = (req.url || "").split("?")[0].split("/").filter(Boolean);
  const action = req.query.action || urlParts[urlParts.length - 1] || "";

  try {
    switch (action.toLowerCase()) {
      case "login": {
        if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
        const body = req.body || {};
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        const password = typeof body.password === "string" ? body.password : "";
        if (!email || !password || password.length > 128) {
          return res.status(400).json({ ok: false, error: "Email and password are required." });
        }

        const session = await supabaseRequest("/auth/v1/token?grant_type=password", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        if (!session.access_token || !session.refresh_token || !session.user) {
          return res.status(401).json({ ok: false, error: "Login failed. Check your credentials and email confirmation." });
        }
        setSessionCookies(res, session);
        return res.status(200).json({ ok: true, user: { id: session.user.id, email: session.user.email } });
      }

      case "signup": {
        if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
        const body = req.body || {};
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        const password = typeof body.password === "string" ? body.password : "";
        const fullName = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 120) : "";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return res.status(400).json({ ok: false, error: "Enter a valid email address." });
        }
        if (password.length < 8 || password.length > 128) {
          return res.status(400).json({ ok: false, error: "Password must be between 8 and 128 characters." });
        }

        const result = await supabaseRequest("/auth/v1/signup", {
          method: "POST",
          body: JSON.stringify({ email, password, data: { full_name: fullName } }),
        });
        if (result.access_token && result.refresh_token) {
          setSessionCookies(res, result);
        }
        return res.status(201).json({
          ok: true,
          authenticated: Boolean(result.access_token),
          user: result.user ? { id: result.user.id, email: result.user.email } : null,
          message: result.access_token ? "Account created." : "Account created. Check your email to confirm it before logging in.",
        });
      }

      case "logout": {
        if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
        clearSessionCookies(res);
        return res.status(200).json({ ok: true });
      }

      case "me": {
        if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
        const session = await getSession(req, res);
        if (!session) {
          return res.status(401).json({ ok: false, authenticated: false, user: null });
        }
        return res.status(200).json({
          ok: true,
          authenticated: true,
          user: { id: session.user.id, email: session.user.email, lastSignInAt: session.user.last_sign_in_at || null },
        });
      }

      default:
        return res.status(404).json({ ok: false, error: "Unknown auth action." });
    }
  } catch (err) {
    if (action === "login" && (err.status === 400 || err.status === 401)) {
      let msg = "Invalid email or password, or email confirmation is required.";
      if (err.message) {
        if (/email not confirmed/i.test(err.message)) {
          msg = "Email confirmation is required before logging in. Please check your inbox.";
        } else if (/invalid login credentials/i.test(err.message)) {
          msg = "Invalid email or password.";
        } else if (!err.message.includes("Supabase")) {
          msg = err.message;
        }
      }
      return res.status(401).json({ ok: false, error: msg });
    }
    return jsonError(res, err);
  }
};
