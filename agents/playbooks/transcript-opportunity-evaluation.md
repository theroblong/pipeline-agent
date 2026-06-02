# Transcript Opportunity Evaluation Playbook

Use this playbook with `transcript-opportunity-analyst` whenever a transcript needs to become sales-pipeline knowledge.

## Inputs

- Transcript text or file path
- Meeting date
- Meeting type
- Attendees and roles
- Known account or opportunity records
- Relevant prior evaluations, if any

## Step 1: Identify Entities

Extract:

- Companies mentioned
- People mentioned
- Roles and departments
- Products, systems, processes, and vendors
- Business units or locations
- Pruvida offerings mentioned or implied

Mark each company as:

- `target-company`
- `customer`
- `partner`
- `competitor`
- `vendor`
- `unclear`

## Step 2: Find Opportunity Signals

Look for:

- Pain or inefficiency
- Manual process or operational drag
- AI, automation, modernization, or transformation interest
- Stakeholder frustration
- Budget, timeline, or initiative language
- Tool replacement or consolidation
- Reporting, knowledge, workflow, or integration gaps
- Compliance, quality, risk, or capacity pressure

Classify each signal as:

- `confirmed`
- `likely`
- `weak`
- `unsupported`

## Step 3: Assess Buying Cycle

Use the taxonomy from `agents/personas/transcript-opportunity-analyst.agent.md`:

- `signal`
- `problem-exploration`
- `active-evaluation`
- `solution-shaping`
- `proposal-procurement`
- `post-sale-expansion`
- `nurture`
- `no-fit`

Explain the assessment with evidence and confidence.

## Step 4: Map To Pruvida Offers

Load the relevant product pages in `knowledge/products/` and compare the transcript evidence to the offer positioning matrix in `knowledge/views/offer-positioning-matrix.md`.

Evaluate each opportunity against:

- Aevah
- Aevah sub-offers, when the evidence is specific enough
- Blueprint Studio
- AI transformation services
- Automation consulting services
- Product development and intelligent systems
- Government and defense AI data modernization

For each offer, record:

- Fit: `strong`, `possible`, `weak`, or `not-recommended`
- Why it fits or does not fit
- What evidence supports the recommendation
- What proof is still needed
- Suggested positioning language
- Product page reference
- Whether a parent offer or a specific sub-offer should be positioned

## Step 5: Build The Prospect Evaluation

Create an artifact using `agents/artifacts/prospect-transcript-evaluation.template.md`.

The artifact should contain:

- Opportunity summary
- Target company
- Buying-cycle stage
- Offer positioning
- Evidence
- Missing information
- Recommended next action
- Knowledge-base updates to apply

## Step 6: Create Conversation And People Records

For every meaningful transcript, create or update:

- Conversation record in `knowledge/conversations/`
- Contact records in `knowledge/contacts/`
- Account relationship status in `knowledge/accounts/`

Capture:

- Conversation date, type, source, and participants
- Contact names, companies, titles, and buying roles
- Stage movement before and after the conversation
- Follow-up commitments and owners
- CRM sync recommendation

## Step 7: Update The Knowledge Base

When approved, update or create:

- Account page in `knowledge/accounts/`
- Contact pages in `knowledge/contacts/`
- Conversation page in `knowledge/conversations/`
- Opportunity page in `knowledge/opportunities/`
- Product fit history in `knowledge/products/`, when there is a meaningful learning
- Evaluation page in `knowledge/transcript-evaluations/`
- Pipeline board in `knowledge/views/pipeline-board.md`
- Offer-fit pattern note in `knowledge/patterns/offer-fit-observations.md`

## Step 8: Handoff

Recommend the next agent:

- `pipeline-orchestrator` for stage, owner, or routing decisions
- `discovery-qualifier` for open discovery
- `solution-strategist` for offer mix and solution design
- `proposal-commercial` for proposal or procurement
- `customer-success-growth` for renewal, expansion, or adoption signals

Include the reason for the handoff and the minimum context that agent needs.
