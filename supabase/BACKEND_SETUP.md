# VantorX API foundation

The Vercel project uses `website/` as its Root Directory, so serverless functions must live under `website/api/`. This keeps the existing website entry point intact while adding API routes at the same origin.

## First endpoint

- `GET /api/health` reports whether the required Supabase environment variables are configured.
- It never returns key values.
- It returns HTTP 503 until both variables are set; this is expected before configuration.

## Configure Vercel

In the Vercel project **Vantorxsolutions**, open **Settings → Environment Variables** and add these variables for Preview and Production (and Development if desired):

- `SUPABASE_URL` = your Supabase project URL, e.g. `https://YOUR_PROJECT_REF.supabase.co`
- `SUPABASE_PUBLISHABLE_KEY` = the Supabase publishable key (safe for server configuration; do not commit it)

Use the publishable key, not a service-role/secret key. Never put service-role keys in browser JavaScript. Redeploy after saving environment variables, then visit `/api/health`.

## Current scope

This is only the backend deployment/readiness foundation. It does not yet implement authentication, cookie sessions, or the app-specific API routes. Those must be added and tested before the apps can be considered connected to Supabase or production-ready.


## Authentication and business API (first implementation)

The first same-origin API routes now exist under `website/api/`:

- `POST /api/auth/signup` — creates a Supabase Auth account. Depending on Supabase email-confirmation settings, it either establishes a session or asks the user to confirm email.
- `POST /api/auth/login` — signs in with email and password.
- `POST /api/auth/logout` — clears the app session cookies.
- `GET /api/auth/me` — returns the current user, refreshing an expired access token when possible.
- `POST /api/businesses/create` — requires a signed-in user and calls `create_business_with_owner`, which derives the owner from the authenticated Supabase identity.

Access and refresh tokens are stored in HttpOnly, SameSite=Lax cookies (Secure in production), rather than exposed to frontend JavaScript. The publishable key is used only as the Supabase API key; no service-role key is used.

## Before production

These routes are an initial implementation and have not yet been verified against the deployed Vercel runtime or the actual Supabase project. After Vercel redeploys, test signup/login/session/logout and business creation with a test account first. Add rate limiting and abuse protection before public launch, and verify Supabase email-confirmation and redirect settings. Do not consider the backend production-ready until those checks pass.
