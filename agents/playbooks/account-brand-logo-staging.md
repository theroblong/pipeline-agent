---
record_type: agent-playbook
version: 0.1.0
playbook_id: account-brand-logo-staging
owner: pipeline-orchestrator
last_updated: 2026-06-03
---

# Account Brand Logo Staging

Use this playbook when an account record is created or updated with a real company website and the pursuit portal needs a prospect logo on dashboard opportunity cards.

## Source Of Truth

Account-level brand fields live in `knowledge/accounts/*.md`:

- `brand_color`: dashboard accent color, stored as a hex value.
- `brand_logo_text`: compact fallback mark when no approved logo is available.
- `brand_logo_path`: approved public logo path used by the portal.
- `brand_logo_review_status`: `not-reviewed`, `pending-review`, `approved`, or `rejected`.
- `brand_logo_candidate_path`: staged logo path waiting for review.
- `brand_logo_candidate_source_url`: URL where the staged logo was found.
- `brand_logo_source_url`: URL for the approved logo.

## Standard Workflow

1. Confirm the account has a real `website` value.
2. Stage a logo candidate:

```bash
npm run logo:stage -- account-slug
```

3. Review the staged file in `apps/pursuit-portal/public/account-logos/_staged/`.
4. Confirm the mark is appropriate, recognizable, and sourced from the prospect domain or an approved brand page.
5. Promote the staged asset:

```bash
npm run logo:approve -- account-slug
```

6. Run the pursuit portal build before committing:

```bash
npm run build:pursuit
```

## Explicit Source Override

If the website discovery picks a poor candidate, use a known approved image URL:

```bash
npm run logo:stage -- account-slug --source=https://example.com/path/to/logo.png
```

For a new account whose website field is still empty, pass the website during staging:

```bash
npm run logo:stage -- account-slug --website=https://example.com
```

## Guardrails

- Stage before approval unless Robert has provided an explicit source.
- Prefer assets from the prospect's own domain, brand page, or website metadata.
- Avoid search-result thumbnails, third-party scraper logos, or social-card images unless the user approves them.
- Keep the dashboard compact: use the image for the icon slot and keep the company name in text beside it.
- If the asset is uncertain, leave `brand_logo_path: unknown` and keep the text fallback visible.
