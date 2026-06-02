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

## Marketing And Collateral Pattern

When the task involves campaign strategy, collateral, one-pagers, or website conversion direction, use:

1. `marketing-strategist-nile` for strategy and executive narrative.
2. `collateral-copywriter-emily` for copy, one-pager structure, and collateral polish.
3. `web-conversion-designer-russ` for page structure, visual hierarchy, conversion, and SEO-aware design.

Use `knowledge/sales-enablement/pruvida-executive-one-pager.md`, `knowledge/campaigns/`, and the relevant product pages as context.
