# Pruvida Pursuit Portal

The Pursuit Portal is a read-only Next.js app for Brock and Robert to work from the local sales knowledge base without browsing Markdown files directly.

## What It Shows

- Brock's visible opportunities, based on `owner: Brock Warren`
- Next actions, buying-cycle stage, position, and CRM sync status
- Stakeholders connected to each opportunity
- Draft prospect packets from `knowledge/sales-enablement/prospect-packets/`
- Product and service positioning pages from `knowledge/products/`
- A brief builder for print-ready Pruvida one-pager bundles
- Read-only CRM staging fields for HubSpot review

Raw transcripts are not exposed through the portal.

## Brief Builder

Open `/briefs` to build client conversation packets.

Current bundle types:

- Sample preview: shows the preferred Pruvida one-pager style based on `Pruvida-1Pager.html`.
- Complete opportunity brief: generates a packet from an opportunity record and its linked offers.
- Standalone offer brief: generates a product/service one-pager from `knowledge/products/`.
- Custom bundle: lets Brock select an optional opportunity plus the exact offers needed for a stakeholder conversation.

Preview pages are print-ready. Use `Print / Save PDF` and choose Save as PDF from the browser print dialog.

Generated briefs include review warnings where account facts, stakeholder titles, metrics, or claims need human verification before sending.

## Access Model

Hardcoded initial access:

- `robert@pruvida.com`: admin, all records
- `brock@pruvida.com`: seller, opportunities owned by `Brock Warren`, plus enablement

Additional admins can be added with `PORTAL_ADMIN_EMAILS`.

Additional sellers can be added with `PORTAL_SELLER_ACCESS_JSON`.

## Local Development

From the repository root:

```bash
npm install
npm run dev:pursuit
```

For local development without Google OAuth, copy `.env.example` to `.env.local` in this app folder and set:

```bash
DEV_AUTH_EMAIL=robert@pruvida.com
```

Then open `http://localhost:3015`.

## Google Auth Setup

Create a Google OAuth client and configure this redirect URI:

```text
https://YOUR_VERCEL_DOMAIN/api/auth/callback/google
```

Set these Vercel environment variables:

```bash
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_TRUST_HOST=true
```

Generate `AUTH_SECRET` with an Auth.js-compatible secret generator or a strong random value.

## Vercel Deployment

Deploy from the repository root so the app can read the root `knowledge/` folder.

Recommended Vercel settings:

- Framework preset: Next.js
- Install command: `npm install`
- Build command: `npm run build:pursuit`
- Development command: `npm run dev:pursuit`

The app config traces `knowledge/**/*.md` into the Next.js server build. Keep source records in `knowledge/`; do not copy raw transcripts into the app.
