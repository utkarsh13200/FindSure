# FindSure

**Know before you go.**

FindSure is a Product Manager portfolio MVP that adds a **trust and freshness layer** on top of local business discovery. It is **not** a Google Maps replacement.

> Can I trust that this local business still exists at this location before I travel there?

---

## Problem

Users discover local services on Google Maps, but listings can be stale:

- A business moved, but the old pin remains
- A business closed, but still appears active
- A listing exists, but nothing is there
- Old reviews do not prove the business still operates at that address

## Product hypothesis

Better **freshness and verification signals** can help users avoid wasted trips to inaccurate local listings.

**Expected outcome (not measured yet):** lower rate of navigation to listings that users later report as moved, closed, or nonexistent.

**How I would measure after deployment:** see [Proposed success metrics](#proposed-success-metrics).

This README does **not** invent interviews, traction, or conversion numbers.

---

## MVP scope

Focused initially on **laptop repair** in Bengaluru (demo data), with architecture ready for other service categories.

Included:

- Search by keyword + location (incl. browser geolocation)
- Results list + interactive map (Google Maps when configured; demo map otherwise)
- Business cards with trust score, verification freshness, confirmations, warnings
- Business detail page with reviews, confirmations, directions
- Report incorrect information → persisted in SQLite → trust score / concern state updates immediately
- Filters & sorting (trust, distance, open now, outdated, rating)
- Demo mode without Google credentials

---

## Tech stack

| Layer | Stack |
|--------|--------|
| Frontend | React, TypeScript, Vite, React Router, Tailwind CSS, Lucide, TanStack Query, `@react-google-maps/api` |
| Backend | Node.js, Express, TypeScript |
| Database | SQLite + Prisma (swap to PostgreSQL later via `provider` + `DATABASE_URL`) |
| Google | Maps JavaScript API (client), Places API / Text Search (server, optional) |

---

## Architecture

```text
Browser (React)
   │  REST
   ▼
Express API  ──► Prisma / SQLite (trust, reports, confirmations, reviews)
   │
   └──► Google Places (when DEMO_MODE=false + API key)
```

- Google Places supplies discovery baseline (name, address, coords, rating, etc.).
- FindSure enriches with trust score, verification history, confirmations, reports, and concern state.
- Frontend calls **only** the FindSure API for business logic.

### Trust score (deterministic)

Documented in `server/src/services/trustScore.ts`:

- Start at **100**
- Subtract for stale verification, weighted reports (relocation / closure / not-found), no recent confirmations
- Add for recent confirmations, recent owner verification, recent reviews
- Report weight **decays with age** (2-year-old report ≈ negligible)

### Concern states (product rule)

| State | Rule |
|--------|------|
| `NO_CONCERN` | No recent serious reports; verification not too old |
| `NEEDS_VERIFICATION` | 1 recent issue report **or** very stale verification |
| `POTENTIALLY_MOVED` | **2+** recent relocation / not-found reports |
| `POTENTIALLY_CLOSED` | **2+** recent closure reports |

A **single** report never auto-closes a listing.

### Recommended ranking

Blends query relevance, distance, trust score, rating, and verification freshness (`recommendedRank` in the same file).

---

## Setup

### Prerequisites

- Node.js 20+
- npm

### Install & run (recommended)

```bash
cd findsure
npm run setup
npm run dev
```

- API: http://localhost:4000  
- App: http://localhost:5173  

`npm run setup` installs root/server/client deps, runs Prisma migrate, and seeds demo data.

### Manual steps

```bash
# Root
npm install

# Server
cd server
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev

# Client (new terminal)
cd client
cp .env.example .env
npm install
npm run dev
```

### Tests

```bash
cd server && npm test
cd client && npm test
```

---

## Environment variables

### Server (`server/.env`)

| Variable | Purpose |
|----------|---------|
| `PORT` | API port (default `4000`) |
| `DATABASE_URL` | Prisma URL, e.g. `file:./dev.db` |
| `GOOGLE_MAPS_API_KEY` | Server-side Places requests |
| `DEMO_MODE` | `true` = use SQLite demo businesses; `false` = call Places when key present |

### Client (`client/.env`)

| Variable | Purpose |
|----------|---------|
| `VITE_GOOGLE_MAPS_API_KEY` | Maps JavaScript API (browser-restricted key) |
| `VITE_API_BASE_URL` | Default `http://localhost:4000/api` |

Never commit real `.env` files.

---

## Google Maps setup

1. Create a Google Cloud project.
2. Enable **Maps JavaScript API** and **Places API** (or Places API New).
3. Create two keys (recommended):
   - **Browser key** → restrict by HTTP referrer (`http://localhost:5173/*`) → `VITE_GOOGLE_MAPS_API_KEY`
   - **Server key** → restrict by IP / API → `GOOGLE_MAPS_API_KEY`
4. Set `DEMO_MODE=false` on the server when you want live Places search.
5. Restart server and client.

Without keys, the app still runs in **Demo data** mode with a demo map overlay.

---

## Demo mode

```env
DEMO_MODE=true
```

- 11 Bengaluru laptop-repair businesses with mixed trust profiles
- Includes **TechFix Hub** (stale + 2 “moved” reports) for the portfolio narrative
- Submitting another “Business has moved” report updates count, concern state, and trust score immediately
- Reports/confirmations persist in SQLite

UI shows a **Demo data** badge when applicable.

### Portfolio demo script

1. Search **Laptop repair**
2. Open **TechFix Hub** → note “Potentially outdated” / low trust score / 2 moved reports
3. Report **Business has moved**
4. Observe report count rise (e.g. 2 → 3) and trust score drop without refresh

---

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health |
| GET | `/api/businesses/search` | Search + enrich |
| GET | `/api/businesses/:id` | Detail |
| GET | `/api/businesses/:id/trust` | Trust payload |
| POST | `/api/businesses/:id/reports` | Create report |
| GET | `/api/businesses/:id/reports` | List reports |
| POST | `/api/businesses/:id/confirm` | Create confirmation |
| GET | `/api/businesses/:id/reviews` | Reviews (`?sort=`) |

---

## Product decisions

- **Trust score exists** to make confidence scannable in a results list, with transparent inputs.
- **Freshness matters** because star ratings alone do not prove a shop is still at that pin.
- **Reports are weighted, not absolute truth** — false reports should not destroy a listing.
- **One report ≠ closed** — concern escalates with corroboration and recency.

---

## Proposed success metrics

These are **proposed**, not measured results.

### Primary outcome

**Inaccurate listing visit rate** — share of users who navigate to a business and later report moved / closed / nonexistent / wrong location.

### Supporting

- Verification coverage
- Listing freshness distribution
- Report resolution rate
- Trust-score accuracy (vs later confirmed outcomes)
- Search → business selection rate
- Navigation intent rate
- False-warning rate

---

## Project structure

See monorepo layout under `client/` and `server/` as specified in the product brief.

---

## License

Portfolio / educational use.
