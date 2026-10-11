# VantorX Markets Intelligence

A prediction-markets analyst in the VantorX suite: every market type Polymarket
covers — politics, sports, crypto, economics, tech/AI, culture — with AI
signals, a paper portfolio, and an optional **read-only live sync from
Polymarket's public API**.

> **Demo Mode by default.** The seeded universe is fictional but realistic
> (42 markets, deterministic prices, dates relative to "now"). Live mode only
> *reads* public market prices — no accounts, no API keys, no trading, and no
> real money anywhere in the app.

## Run it

Double-click **`markets-app.html`** — fully self-contained, works offline.

To develop: edit `index.html`, `css/styles.css` or `js/**`, then rebuild:

```powershell
powershell -ExecutionPolicy Bypass -File build-bundle.ps1
```

## What's inside

| Route | Page |
|---|---|
| `#/overview` | P/L KPIs, category heat, top movers, strongest signals, activity |
| `#/markets` | Full board with category tabs + search; detail drawer per market: implied probability, 14-day trend, top-of-book, AI thesis |
| `#/signals` | AI signal board (mispricing, momentum, reversal, volatility, crowd skew) + interactive analyst Q&A |
| `#/portfolio` | Paper positions with live marks, unrealized P/L, exposure-by-category vs the 35% concentration cap, paper close flows |
| `#/settings` | Automation toggles, risk policy, and the **Polymarket connection** — Test connection / back-to-demo |

Plus: global search, notifications with unread badge, first-run tour, mobile
drawer, and **Reset demo data** in the avatar menu.

## Live data (optional)

`Settings → Test connection` calls
`https://gamma-api.polymarket.com/markets?closed=false&limit=12` — Polymarket's
public, keyless read API — and maps the top-volume open markets into the board.
If the network is unavailable (a sales demo on plane Wi-Fi, for instance), the
app catches the failure and stays on the deterministic demo universe.

## Reset for a demo

Avatar (top right) → **Reset demo data** — pristine universe, portfolio and
first-run tour, every time.
