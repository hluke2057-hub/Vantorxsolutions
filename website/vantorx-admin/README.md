# VantorX Admin — Internal Operations Console

The third piece of the VantorX system: the console your **team** uses to run every
client business. (Sales presentation sells → **Client Hub** is what clients see →
**Admin** is what your staff runs.)

## Run it

Double-click **`admin-app.html`** — fully self-contained, works offline in any
modern browser, no server or internet needed.

## What's inside

| Area | What it does |
|---|---|
| **Overview** | MRR, client counts, open request queue, outstanding invoices, needs-attention list, recent payments + activity |
| **Clients** | All 8 demo businesses with filters/search. Detail drawer: change plan, drag health (status auto-derives), convert trials, per-client requests + invoices |
| **Change Requests** | Board with 5 status columns. Cards come from the Client Hub; advance/complete them, assign staff — completion logs activity |
| **Billing** | Invoice table (send drafts, mark paid), payments feed, plan-mix revenue bars |
| **Activity** | Cross-client timeline filterable by requests/billing/clients |
| **New Client** | 4-step provisioning wizard (business → plan/sources → AI setup → review) that adds a real client to the console |
| **Settings** | Team roster, console preference toggles, factory reset |

Demo data: 8 client businesses, 8 change requests, 8 invoices, 5 payments,
8 activity events, 5 notifications. Deterministic seed + dates relative to "now",
so Today views always work in a demo.

## Structure

```
vantorx-admin/
├── admin-app.html          ← single-file build (share this)
├── index.html              ← dev shell (multi-file ES modules)
├── css/styles.css          ← shared VantorX design system
├── js/
│   ├── utils.js  data.js  state.js  components.js
│   ├── services/services.js   (clients / requests / billing / notifications)
│   └── pages/  (overview, clients, requests, billing, activity, onboarding, settings)
└── build-bundle.ps1        ← rebuilds admin-app.html after source edits
```

After editing any `js/**` file:

```powershell
powershell -ExecutionPolicy Bypass -File build-bundle.ps1
```

## Going live later

Same rules as the other VantorX apps: the service adapters in
`js/services/services.js` are the only touch points between UI and data. Replace
their demo bodies with real API calls when a backend exists — keep secrets in
**environment variables on the server**, never in frontend code.
