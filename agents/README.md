# Agent Workspace

This folder stores Pruvida's reusable agent personalities, shared company context, and future playbooks.

The goal is portability: these definitions should work across Claude, Codex, ChatGPT, local models, and future orchestration tools. Avoid vendor-specific syntax unless it lives in a vendor-specific adapter.

## Folder Structure

```text
agents/
  context/       Shared Pruvida facts, offerings, positioning, constraints.
  personas/     Reusable agent personalities and operating instructions.
  playbooks/    Stage-specific workflows and checklists.
  artifacts/    Templates for outputs like evaluations, discovery briefs, or proposals.
```

## Persona Format

Each persona file should:

- Use the `.agent.md` suffix.
- Start with YAML frontmatter for metadata.
- Keep model instructions in plain Markdown.
- Reference shared context instead of duplicating company facts.
- Include inputs, outputs, guardrails, and handoff behavior.

## Recommended Runtime Pattern

For a given task, assemble the prompt in this order:

1. Company context from `agents/context/`.
2. One persona from `agents/personas/`.
3. Optional playbook or artifact template.
4. The deal record and user request.

This keeps the agent's identity stable while allowing the deal context to change every run.

## Transcript Intake Pattern

When the input is a transcript, use:

1. `agents/context/pruvida-offerings.md`
2. `agents/personas/transcript-opportunity-analyst.agent.md`
3. `agents/playbooks/transcript-opportunity-evaluation.md`
4. `agents/artifacts/prospect-transcript-evaluation.template.md`
5. Any existing account or opportunity pages from `knowledge/`

The expected result is not only a summary. The agent should extract target companies, opportunity signals, buying-cycle stage, offer fit, follow-up questions, and proposed wiki updates.

## Sales Enablement Pattern

When the task is to generate sales assets, use:

1. `agents/context/pruvida-offerings.md`
2. `agents/personas/sales-enablement-generator.agent.md`
3. The relevant product page from `knowledge/products/`
4. `knowledge/sales-enablement/output-pack.md`
5. `knowledge/sales-enablement/product-marketing-library.md`
6. The current account, opportunity, or conversation record

The expected result is a reusable sales asset grounded in product knowledge and prospect context.

## Client-Facing PDF Brief Pattern

When the task is to create or revise a prospect-facing PDF brief, use:

1. `agents/context/pruvida-offerings.md`
2. `agents/personas/sales-enablement-generator.agent.md`
3. `agents/playbooks/client-brief-generation.md`
4. `agents/artifacts/client-brief.template.md`
5. The relevant opportunity record from `knowledge/opportunities/`
6. The selected product pages from `knowledge/products/`
7. The relevant prospect packet from `knowledge/sales-enablement/prospect-packets/`, if present

The expected result is solution-led, prospect-facing copy that helps earn or advance a meeting. Internal transcript notes and risks can inform discovery questions, but should not appear as speculative claims about the prospect.

## Account Brand Logo Pattern

When a new account record has a real company website and the dashboard needs a prospect logo, use:

1. `agents/playbooks/account-brand-logo-staging.md`
2. The account record from `knowledge/accounts/`
3. `npm run logo:stage -- account-slug`
4. Human review of the staged logo
5. `npm run logo:approve -- account-slug`

The expected result is an approved `brand_logo_path` in the account record. Staged candidates should remain in `brand_logo_candidate_path` until reviewed.

## Marketing And Collateral Pattern

When the task involves campaign strategy, collateral, one-pagers, or website conversion direction, use:

1. `marketing-strategist-nile` for strategy and executive narrative.
2. `collateral-copywriter-emily` for copy, one-pager structure, and collateral polish.
3. `web-conversion-designer-russ` for page structure, visual hierarchy, conversion, and SEO-aware design.

Use `knowledge/sales-enablement/pruvida-executive-one-pager.md`, `knowledge/campaigns/`, and the relevant product pages as context.
