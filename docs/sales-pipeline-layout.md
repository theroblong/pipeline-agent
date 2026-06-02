# Sales Pipeline Layout

This document proposes the first project layout for managing Pruvida deals from initial interest through recurring customer growth.

## Pipeline Stages

### 1. Lead Capture

Goal: collect enough context to decide whether the lead deserves active follow-up.

Recommended data:

- Source
- Company
- Contact
- Stated need
- Offering interest
- Urgency
- Owner
- Next action

Primary agent: `pipeline-orchestrator`

Supporting agent for transcript-sourced leads: `transcript-opportunity-analyst`

### 2. Discovery

Goal: understand business pain, impact, stakeholders, decision process, and fit.

Recommended data:

- Business problem
- Current process or system
- Impact of doing nothing
- Desired outcomes
- Stakeholders
- Decision criteria
- Budget signal
- Timeline
- Risks and blockers

Primary agent: `discovery-qualifier`

Supporting agent for call notes and transcripts: `transcript-opportunity-analyst`

### 3. Solution Fit

Goal: decide whether Pruvida can credibly help and what path creates the fastest useful value.

Recommended data:

- Recommended offering mix
- Use cases
- Pilot or project shape
- Required integrations or data
- Delivery assumptions
- Success metrics
- Open technical and organizational risks

Primary agent: `solution-strategist`

### 4. Proposal

Goal: present a clear commercial path with scope, outcomes, assumptions, and next steps.

Recommended data:

- Executive summary
- Scope
- Deliverables
- Out-of-scope items
- Customer responsibilities
- Pruvida responsibilities
- Timeline assumptions
- Pricing and approval state
- Legal, security, or procurement needs

Primary agent: `proposal-commercial`

### 5. Negotiation And Close

Goal: resolve commercial, legal, security, and operational questions while preserving the business case.

Recommended data:

- Decision owner
- Procurement path
- Contract status
- Security review status
- Redlines or objections
- Close plan
- Mutual action plan

Primary agent: `proposal-commercial`

### 6. Onboarding

Goal: transfer context from sales to delivery without losing the promise that won the deal.

Recommended data:

- Signed scope
- Promised outcomes
- Success metrics
- Stakeholder map
- Delivery team
- Kickoff date
- First milestone
- Known risks

Primary agent: `customer-success-growth`

### 7. Recurring Success

Goal: prove value, maintain account health, renew, and expand only where it serves the customer.

Recommended data:

- Adoption signals
- Value delivered
- Open issues
- Customer sentiment
- Renewal date
- Expansion opportunities
- Business review cadence
- Executive sponsor status

Primary agent: `customer-success-growth`

## Recommended Project Shape

As the project grows, split the repo into these areas:

```text
agents/
  context/       Company, offerings, voice, qualification rules.
  personas/     Portable model-neutral agent identities.
  playbooks/    Stage-specific workflows.
  artifacts/    Templates for repeatable outputs.
deals/
  active/        Current opportunity records.
  closed-won/    Won deal summaries and handoff records.
  closed-lost/   Loss notes and learning.
  recurring/     Customer success and expansion records.
docs/
  process/       Operating procedures and pipeline definitions.
  governance/    Approval rules, claims policy, data handling.
knowledge/
  accounts/      Company-level wiki pages.
  contacts/      Person-level pages with roles and CRM identity.
  conversations/ Dated call, meeting, email, and note records.
  opportunities/ Opportunity-level wiki pages.
  products/      Product and service positioning pages.
  sales-enablement/
  transcript-evaluations/
  views/         Standard pipeline and operating views.
  patterns/      Cross-account offer-fit observations.
transcripts/     Temporary transcript intake; raw transcript files are ignored by default.
schemas/
  deal.schema.json
  account.schema.json
  activity.schema.json
```

## Initial Deal Record Shape

Start simple. A deal record can be Markdown with frontmatter or JSON, depending on how much automation you want.

Suggested fields:

- `id`
- `account_name`
- `stage`
- `owner`
- `source`
- `contacts`
- `offerings`
- `pain`
- `desired_outcomes`
- `next_action`
- `next_action_due`
- `risks`
- `last_activity`
- `agent_recommendation`
- `product_page_refs`

## Standard Opportunity Position

Track Pruvida's position in each opportunity separately from the pipeline stage:

- `strong`: Clear pain, strong fit, engaged stakeholder, credible next step.
- `developing`: Fit appears real, but stakeholder alignment or proof is still forming.
- `neutral`: Opportunity exists, but Pruvida has no clear advantage yet.
- `weak`: Fit, access, urgency, or differentiation is poor.
- `blocked`: Progress depends on an unresolved blocker.
- `unknown`: Not enough evidence.

Use `knowledge/views/pipeline-board.md` as the standard view for stages and positions.

## Conversation Record Shape

Every meaningful sales interaction should have a dated conversation record:

- `conversation_id`
- `conversation_date`
- `conversation_type`
- `account_id`
- `company_name`
- `contact_ids`
- `opportunity_ids`
- `pipeline_stage_before`
- `pipeline_stage_after`
- `buying_cycle_stage_before`
- `buying_cycle_stage_after`
- `summary`
- `key_signals`
- `commitments`
- `follow_ups`
- `crm_sync_status`

## Transcript Evaluation Record Shape

Every prospect transcript evaluation should capture:

- `evaluation_id`
- `source_transcript`
- `meeting_date`
- `company_name`
- `opportunity_name`
- `buying_cycle_stage`
- `pipeline_stage`
- `recommended_primary_offer`
- `recommended_secondary_offers`
- `confidence`
- `evidence`
- `missing_information`
- `recommended_next_action`
- `knowledge_base_updates`
- `outcome_tracking`

Use `agents/artifacts/prospect-transcript-evaluation.template.md` for the full format.

## Operating Cadence

Daily:

- Triage new leads.
- Update next actions.
- Flag stuck deals.

Weekly:

- Review stage movement.
- Review proposal and close risks.
- Review customer-success signals for recurring accounts.

Monthly:

- Analyze win and loss patterns.
- Refresh offering positioning.
- Improve agent personas, playbooks, and templates.

## Near-Term Build Recommendation

The next useful project increment is to add:

- A `schemas/deal.schema.json` file.
- A `deals/active/` folder with one example deal record.
- Stage playbooks under `agents/playbooks/`.
- Artifact templates for discovery briefs, solution briefs, proposal outlines, and customer-success plans.
- A transcript processing routine that writes approved evaluations into `knowledge/transcript-evaluations/`.
- A CRM export adapter that pushes `ready` accounts, contacts, opportunities, and conversations to HubSpot.
