# Pruvida Sales Knowledge Base

This folder is the LLM-readable wiki for what Pruvida learns from prospects, opportunities, transcripts, and customer outcomes.

The purpose is not just to remember individual calls. It is to improve Pruvida's offer positioning over time by connecting:

- Client situation
- People and buying roles
- Conversation history
- Prospect pain
- Buying-cycle stage
- Opportunity position
- Pruvida offer positioned
- Product or service fit history
- Outcome
- Lessons learned

## Folder Structure

```text
knowledge/
  accounts/                 Company-level pages for prospects, customers, and partners.
  brands/                   Brand, partner, or channel context.
  campaigns/                Reusable campaign and outreach playbooks.
  contacts/                 Person-level pages with roles, influence, and CRM identity.
  conversations/            Dated conversation records for calls, meetings, demos, and notes.
  opportunities/            Opportunity-level pages tied to an account.
  products/                 Product and service positioning pages.
  sales-enablement/         Standard output packs and reusable sales asset guidance.
  transcript-evaluations/   Point-in-time evaluations produced from transcripts.
  source-notes/             Distilled source inputs that informed the wiki.
  views/                    Standard working views such as the pipeline board.
  patterns/                 Cross-account observations about what lands where.
```

## How To Use This Wiki

For each evaluated prospect:

1. Create a transcript evaluation from `agents/artifacts/prospect-transcript-evaluation.template.md`.
2. Create or update the dated conversation page in `knowledge/conversations/`.
3. Create or update contact pages in `knowledge/contacts/`.
4. Create or update the account page in `knowledge/accounts/`.
5. Create or update the opportunity page in `knowledge/opportunities/`.
6. Reference the relevant product page in `knowledge/products/`.
7. Update `knowledge/views/pipeline-board.md`.
8. Add a short observation to `knowledge/patterns/offer-fit-observations.md` when the transcript reveals a reusable pattern.
9. Return later to update outcome tracking after the opportunity advances, stalls, closes, renews, or expands.

Raw transcripts can be staged in `transcripts/`, but transcript files are ignored by default. Prefer storing structured evaluations and links or references instead of full raw transcript text.

## Naming Conventions

Use lowercase, hyphenated filenames:

- Account: `knowledge/accounts/company-name.md`
- Contact: `knowledge/contacts/first-last-company-name.md`
- Conversation: `knowledge/conversations/yyyy-mm-dd-company-name-topic.md`
- Opportunity: `knowledge/opportunities/company-name-opportunity-name.md`
- Product: `knowledge/products/product-or-service-name.md`
- Evaluation: `knowledge/transcript-evaluations/yyyy-mm-dd-company-name-opportunity-name.md`

## Standard Pipeline View

Use `knowledge/views/pipeline-board.md` as the local CRM board. It tracks:

- Opportunity stage
- Buying-cycle stage
- Our position in the opportunity
- Primary offer
- Last conversation
- Next action and due date
- Risk
- CRM sync state

The pipeline board is a working view. The opportunity page remains the detailed record.

## Account Brand Assets

Account records can drive dashboard brand cues for related opportunities:

- `brand_color`: the opportunity card left-border accent.
- `brand_logo_text`: compact fallback mark.
- `brand_logo_path`: approved public image used in the dashboard logo slot.
- `brand_logo_review_status`: current review state.
- `brand_logo_candidate_path`: staged candidate awaiting review.
- `brand_logo_candidate_source_url`: source URL for the staged candidate.
- `brand_logo_source_url`: source URL for the approved logo.

Use `npm run logo:stage -- account-slug` after a real `website` has been added. Review the staged asset in `apps/pursuit-portal/public/account-logos/_staged/`, then use `npm run logo:approve -- account-slug` to move it into the dashboard display path.

## Product Knowledge

Use `knowledge/products/` as the source of truth for offer positioning, target buyers, pain signals, qualification questions, objections, and offer-fit history.

Current product and service pages:

- `knowledge/products/aevah.md`
- `knowledge/products/aevah-ai-ready-data-agentic-semantic-layer.md`
- `knowledge/products/aevah-mdm-golden-record-entity-resolution.md`
- `knowledge/products/aevah-data-flow-monitoring.md`
- `knowledge/products/aevah-automated-migration-tool.md`
- `knowledge/products/blueprint-studio.md`
- `knowledge/products/ai-transformation-services.md`
- `knowledge/products/automation-consulting-services.md`
- `knowledge/products/product-development-intelligent-systems.md`
- `knowledge/products/government-defense-ai-data-modernization.md`

Use `knowledge/views/offer-positioning-matrix.md` when comparing which offer to position.

## Sales Enablement

Use `knowledge/sales-enablement/output-pack.md` when creating repeatable sales assets. The recommended agent is `agents/personas/sales-enablement-generator.agent.md`.

Use `knowledge/sales-enablement/pruvida-executive-one-pager.md` for the current Pruvida executive one-pager pattern.

Use campaign notes in `knowledge/campaigns/` as reusable source material for outreach, but verify brand relationship, claims, and proof metrics before sending externally.

Use `knowledge/sales-enablement/prospect-packets/` for draft account-specific packets created from conversations or transcripts.

The standard pack includes:

- Executive brief
- Buyer-specific pitch
- Discovery guide
- Qualification checklist
- Objection battlecard
- Demo script
- Pilot proposal
- SOW template
- ROI hypothesis
- Follow-up email sequence

## Marketing Personas

Use these personas for marketing and collateral work:

- `agents/personas/marketing-strategist-nile.agent.md`
- `agents/personas/collateral-copywriter-emily.agent.md`
- `agents/personas/web-conversion-designer-russ.agent.md`

## CRM Sync

Use `docs/crm-export-strategy.md` for export mapping to HubSpot or another CRM.

Every exportable record should include:

- External CRM IDs, when known
- `crm_sync_status`
- Last sync date
- Sync notes

Valid sync states are:

- `not-synced`
- `ready`
- `synced`
- `error`
- `do-not-sync`

## Evidence Rules

- Separate transcript evidence from interpretation.
- Use confidence levels: `high`, `medium`, `low`.
- Do not store unnecessary sensitive details.
- Do not invent account facts, contact roles, budgets, timelines, or decision criteria.
- Mark unknown fields as `unknown` instead of filling gaps with guesses.
- Do not mark a record `ready` for CRM export until a human approves the content.

## Learning Loop

At least monthly, review evaluations and outcomes to answer:

- Which offers are landing in which client situations?
- Which pain signals predict strong Aevah fit?
- Which situations call for Blueprint Studio before implementation?
- Which accounts need AI transformation strategy before tooling?
- Which automation opportunities are simple enough to move quickly?
- Which discovery questions are improving stage accuracy?
- Which product pages need better proof points, objections, or qualification questions?
