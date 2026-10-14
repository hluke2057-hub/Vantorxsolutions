# VantorX Client Hub

The client-facing portal for VantorX customers — command center for the AI Receptionist and LeadFlow, plus the same-day change-request channel.

## Files

| File | Purpose |
|---|---|
| `client-hub-app.html` | **Single-file bundle** — runs anywhere: double-click, preview server, email attachment. No internet needed. |
| `index.html` + `css/` + `js/` | Editable multi-file source. Edit here, then rebuild the bundle. |
| `build-bundle.ps1` | Bundle builder. Run after editing any `js/*.js` file. |

## Edit → rebuild workflow

```powershell
cd client-hub
powershell -ExecutionPolicy Bypass -File build-bundle.ps1
```

The builder strips `import`/`export` statements and concatenates modules at top level (names are unique by convention), so cross-module references keep working. It reads and writes strict UTF-8 — emoji and special characters are safe.

## Demo mode

- All data is generated locally (`js/data.js`) and persisted in `localStorage` under `vantorx_clienthub_v1`.
- **Reset demo data** (Account menu → Reset demo data) restores the factory dataset and replays the 8-step welcome tour.
- The AI test area, transcripts, and billing are clearly labeled demo simulations — no external calls are made, and no secrets exist anywhere in the code.

## Services (production swap points)

Each `js/services/*.js` file is a demo adapter with the real integration point documented at the top:

| Adapter | Production backend |
|---|---|
| `aiReceptionistService` | Retell AI (status, knowledge, test calls) via a backend proxy |
| `callService` | Twilio/Retell webhook records |
| `appointmentService` | Google Calendar / Cal.com |
| `leadflowService` | LeadFlow backend API (read-only overview) |
| `requestService` | VantorX Admin Request Queue |
| `notificationService` | Realtime push (websocket/SSE) |
| `billingService` | Stripe customer portal session (server-side) |

**Never put API keys in frontend code** — when you go live, implement these adapters against your backend and keep provider keys in server environment variables.

## Conventions

- Pages export `renderX(root, ctx)` and receive a shared `ctx` (state, navigate, openCall, openAppointment, testAI, openLeadFlowApp).
- Services are object exports over the central store (`state.js`); UI never touches `localStorage` directly.
- Design tokens live in `css/styles.css` `:root` — shared with LeadFlow for a consistent product family.
