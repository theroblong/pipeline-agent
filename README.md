# Pipeline Agent

Pipeline Agent is the working space for Pruvida's sales-pipeline agents. The project is intended to coordinate LLM-powered assistants that help qualify opportunities, shape solutions, prepare proposals, and support recurring customer growth for Pruvida offerings.

Core offers currently represented:

- Aevah
- Aevah AI-ready data and agentic semantic layer
- Aevah MDM, golden record, and entity resolution
- Aevah data flow monitoring
- Aevah automated migration tool
- Blueprint Studio
- AI transformation services
- Automation consulting services
- Product development and intelligent systems
- Government and defense AI data modernization

## Project Layout

```text
agents/
  README.md
  artifacts/
    prospect-transcript-evaluation.template.md
  context/
    pruvida-offerings.md
  personas/
    template.agent.md
    transcript-opportunity-analyst.agent.md
    sales-enablement-generator.agent.md
    marketing-strategist-nile.agent.md
    collateral-copywriter-emily.agent.md
    web-conversion-designer-russ.agent.md
    pipeline-orchestrator.agent.md
    discovery-qualifier.agent.md
    solution-strategist.agent.md
    proposal-commercial.agent.md
    customer-success-growth.agent.md
  playbooks/
    transcript-opportunity-evaluation.md
apps/
  pursuit-portal/
    README.md
docs/
  crm-export-strategy.md
  sales-pipeline-layout.md
integrations/
  hubspot/
    field-map.template.json
knowledge/
  README.md
  accounts/
  brands/
  campaigns/
  contacts/
  conversations/
  opportunities/
  products/
  sales-enablement/
  source-notes/
  transcript-evaluations/
  views/
    offer-positioning-matrix.md
    pipeline-board.md
  patterns/
transcripts/
  README.md
schemas/
  account.schema.json
  contact.schema.json
  conversation.schema.json
  opportunity.schema.json
  product.schema.json
  source-note.schema.json
  campaign.schema.json
  brand.schema.json
```

## Pursuit Portal

`apps/pursuit-portal/` is a read-only Next.js app for browsing the sales knowledge base through a role-aware web interface.

It is intended for Vercel deployment with Google authentication:

- Robert gets admin access.
- Brock sees opportunities owned by `Brock Warren` plus sales enablement materials.
- Raw transcripts are not exposed by default.

The portal includes a Brief Builder at `/briefs` for generating Pruvida-style print-ready PDF packets:

- sample preview based on the preferred `Pruvida-1Pager.html` format
- complete opportunity briefs
- standalone offer briefs
- custom stakeholder bundles assembled from selected offers

Future agents should use `agents/playbooks/client-brief-generation.md` and `agents/artifacts/client-brief.template.md` before changing client-facing PDF copy. The key rule is solution-led language: present the Pruvida offer and meeting path, while keeping speculative account diagnosis in internal notes only.

Local commands:

```bash
npm install
npm run dev:pursuit
npm run build:pursuit
```

See `apps/pursuit-portal/README.md` for environment variables and deployment notes.

## How To Use The Agent Files

The files in `agents/personas/` are intentionally model-neutral. Each one uses Markdown plus lightweight YAML frontmatter, so it can be used by Claude, Codex, ChatGPT, or another LLM runtime.

Typical use:

1. Load `agents/context/pruvida-offerings.md`.
2. Load the relevant file from `agents/personas/`.
3. Provide the current deal record, stage, notes, and requested task.
4. Ask the model to produce a structured next action, artifact, or decision.

For transcript review, start with `agents/personas/transcript-opportunity-analyst.agent.md` and the playbook in `agents/playbooks/transcript-opportunity-evaluation.md`. Raw transcripts can be staged in `transcripts/`, which ignores transcript files by default. Save approved account, opportunity, evaluation, and pattern updates in `knowledge/`.

Use `knowledge/views/pipeline-board.md` as the standard local CRM view for opportunity stages, positions, next actions, risks, and CRM sync state. See `docs/crm-export-strategy.md` for exporting selected records to HubSpot or another CRM.

Use `knowledge/products/` for per-product and per-service positioning, qualification questions, objections, proof points, and offer-fit history. Use `knowledge/views/offer-positioning-matrix.md` when deciding which offer to position.

Use `knowledge/sales-enablement/output-pack.md` and `knowledge/sales-enablement/product-marketing-library.md` with `agents/personas/sales-enablement-generator.agent.md` when generating briefs, pitches, discovery guides, battlecards, pilot proposals, SOW inputs, ROI hypotheses, or follow-up sequences.

## Pipeline Direction

See `docs/sales-pipeline-layout.md` for the recommended operating model from early lead capture through recurring success and expansion.
