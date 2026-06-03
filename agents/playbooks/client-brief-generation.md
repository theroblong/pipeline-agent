# Client Brief Generation Playbook

## Purpose

Use this playbook when creating, editing, or generating Pruvida client-facing PDF briefs from the pursuit knowledge base.

The goal is to help a salesperson earn or advance a meeting. Briefs should present Pruvida's relevant solution, not diagnose the prospect's weaknesses. The salesperson can bridge the solution to the client conversation.

## Required Context

Use these inputs in order:

1. `agents/context/pruvida-offerings.md`
2. `agents/personas/sales-enablement-generator.agent.md`
3. `agents/artifacts/client-brief.template.md`
4. Relevant opportunity record from `knowledge/opportunities/`
5. Relevant product/service records from `knowledge/products/`
6. Relevant prospect packet from `knowledge/sales-enablement/prospect-packets/`, when present
7. Source notes or transcript evaluations only for internal confidence and discovery gaps

## Source Priority

For opportunity briefs, prefer these sections from the opportunity record:

1. `Prospect-Facing Positioning`
2. `Conversation Focus`
3. `Solution And Value`
4. `Offer Positioning`
5. `Current Assessment`

For product or standalone offer briefs, prefer these product sections:

1. `Customer-Facing Positioning`
2. `Outcomes And Value`
3. `Best Fit`
4. `Recommended Metrics`
5. `Proof Points`

Use source notes, transcripts, risks, and internal assessments only to decide what to ask or verify. Do not publish internal diagnosis as client-facing copy.

## Prospect-Facing Language Rules

Write for the prospect, not for Brock, Robert, or an internal reviewer.

Use solution-led language:

- "Pruvida can help..."
- "A focused working session can..."
- "The first step is to..."
- "This conversation can explore..."
- "A practical pilot can prove..."

Avoid speculative or trust-eroding language in client-facing briefs:

- "appears to have"
- "seems to"
- "poor"
- "weak"
- "limited"
- "likely"
- "may be"
- "potential customer problem"
- direct claims that the prospect lacks maturity, has bad data, has broken follow-up, or is failing operationally

If a point is not confirmed, turn it into a neutral conversation focus:

- Bad: "The prospect has weak customer data."
- Better: "Explore where customer, service, and location data can support more reliable operations."
- Bad: "They have poor follow-up."
- Better: "Identify customer lifecycle workflows where automated follow-up can improve speed, visibility, or consistency."

## Brief Types

### Complete Opportunity Brief

Use when the salesperson wants one PDF bundle for a specific opportunity.

The first page should include:

- Opportunity name
- Prospect-facing positioning
- Solution focus
- Meeting goal
- Session topics or conversation focus
- Recommended flow

Additional pages should include:

- Relevant Pruvida capabilities
- Offer cards sourced from linked product pages
- Work statement
- Suggested meeting participants or buyer fit

### Standalone Offer Brief

Use when the salesperson needs a capability one-pager independent of a specific prospect.

Use product-level customer-facing positioning, outcomes, metrics, proof points, and best-fit buyers.

### Custom Bundle

Use when the salesperson has multiple stakeholder conversations inside the same account.

Include optional opportunity context plus only the selected offers. Keep the first page relevant to the stakeholder's immediate business conversation.

## Current Application Implementation

The live pursuit portal generates printable briefs in `apps/pursuit-portal`.

Important files:

- Data-to-brief mapping: `apps/pursuit-portal/src/lib/briefs.ts`
- Visual PDF document template: `apps/pursuit-portal/src/components/brief-document.tsx`
- Print toolbar: `apps/pursuit-portal/src/components/print-toolbar.tsx`
- Print and page styling: `apps/pursuit-portal/app/globals.css`
- Brief builder UI: `apps/pursuit-portal/app/briefs/page.tsx`
- Opportunity PDF route: `apps/pursuit-portal/app/briefs/preview/opportunity/[slug]/page.tsx`
- Offer PDF route: `apps/pursuit-portal/app/briefs/preview/offer/[slug]/page.tsx`
- Custom bundle route: `apps/pursuit-portal/app/briefs/preview/custom/page.tsx`

The current PDF workflow is browser print-to-PDF. Preview pages are print-ready; use the toolbar's `Print / Save PDF` action.

## Human Review Gate

Before a brief is sent externally, verify:

- Prospect name and stakeholder names
- Stakeholder roles and titles
- Any metrics, proof points, or customer examples
- Product claims and implementation scope
- Whether the selected offer bundle fits the meeting objective

If evidence is not verified, keep the client-facing copy general and solution-led.
