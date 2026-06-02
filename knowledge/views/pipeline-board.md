---
view_type: pipeline-board
version: 0.1.0
owner: Pruvida
last_updated: 2026-06-02
---

# Pipeline Board

This is the standard local CRM view for tracking opportunity stages and positions.

Update this page during pipeline review. Each opportunity should also have its own page in `knowledge/opportunities/`.

## Stage Definitions

| Pipeline Stage | Buying-Cycle Signal | Exit Criteria | Primary Agent |
| --- | --- | --- | --- |
| `lead-capture` | Relevant signal exists | Target company, contact, source, and next action are known | `pipeline-orchestrator` |
| `discovery` | Pain and fit need clarification | Pain, impact, stakeholders, and open questions are documented | `discovery-qualifier` |
| `solution-fit` | Prospect is exploring solution paths | Offer mix, pilot shape, success metrics, and risks are documented | `solution-strategist` |
| `proposal` | Scope and commercial path are needed | Proposal/SOW inputs, assumptions, and approvals are ready | `proposal-commercial` |
| `negotiation-close` | Prospect is resolving approval or procurement | Close plan, blockers, and decision path are documented | `proposal-commercial` |
| `onboarding` | Customer is moving from sale to delivery | Handoff, kickoff, success metrics, and first milestone are documented | `customer-success-growth` |
| `recurring-success` | Value, renewal, or expansion is being managed | Health, renewal, expansion, and business-review cadence are documented | `customer-success-growth` |
| `nurture` | Relevant but not active | Nurture reason and next review date are documented | `pipeline-orchestrator` |
| `closed-won` | Customer committed | Outcome, landed offer, and handoff are documented | `customer-success-growth` |
| `closed-lost` | Opportunity ended unsuccessfully | Loss reason and lessons learned are documented | `pipeline-orchestrator` |
| `no-fit` | No credible fit | No-fit reason is documented | `pipeline-orchestrator` |

## Standard Opportunity Columns

Use these columns for exports, reviews, and reports:

| Field | Description |
| --- | --- |
| Opportunity | Local opportunity page |
| Account | Local account page |
| Owner | Pruvida owner |
| Pipeline Stage | Local sales stage |
| Buying-Cycle Stage | Prospect buying-cycle assessment |
| Position | Our relationship position in the opportunity |
| Primary Offer | Best-fit Pruvida offer |
| Secondary Offers | Supporting offers |
| Product Pages | Product or service knowledge pages |
| Value Hypothesis | Why the prospect should care |
| Last Conversation | Most recent conversation page |
| Next Action | Specific next action |
| Next Action Due | Date |
| Risk | Main risk or blocker |
| CRM Sync | HubSpot/CRM sync state |

## Active Pipeline

| Opportunity | Account | Owner | Pipeline Stage | Buying-Cycle Stage | Position | Primary Offer | Product Page | Last Conversation | Next Action | Due | Risk | CRM Sync |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [Fiserv Data Unification And Portal Consolidation](../opportunities/fiserv-data-unification-portal-consolidation.md) | [Fiserv](../accounts/fiserv.md) | Brock Warren | solution-fit | active-evaluation | strong | Aevah | [Aevah](../products/aevah.md) | [2026-06-02 prospect review](../conversations/2026-06-02-robert-brock-prospect-review.md) | Schedule onsite Alpharetta meeting and prepare paid-pilot teaser | unknown | Contact/title verification and pilot scope | not-synced |
| [RaceTrac Operational Intelligence And Workforce Automation](../opportunities/racetrac-operational-intelligence-workforce-automation.md) | [RaceTrac](../accounts/racetrac.md) | Brock Warren | discovery | problem-exploration | developing | Aevah | [Aevah](../products/aevah.md) | [2026-06-02 prospect review](../conversations/2026-06-02-robert-brock-prospect-review.md) | Prepare discovery brief for driver efficiency, food cost, and onboarding | unknown | Stakeholder and data-system details unverified | not-synced |
| [Loud Security Customer Operations Automation](../opportunities/loud-security-customer-operations-automation.md) | [Loud Security](../accounts/loud-security.md) | Brock Warren | lead-capture | problem-exploration | developing | Automation Consulting Services | [Automation Consulting Services](../products/automation-consulting-services.md) | [2026-06-02 prospect review](../conversations/2026-06-02-robert-brock-prospect-review.md) | Confirm meeting and prepare practical AI/customer-ops packet | unknown | Limited direct discovery so far | not-synced |

## Nurture

| Opportunity | Account | Reason | Review Date | Owner | Last Conversation | CRM Sync |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  | not-synced |

## Closed

| Opportunity | Account | Outcome | Landed Offer | Lost Reason | Closed Date | Lesson | CRM Sync |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  | not-synced |
