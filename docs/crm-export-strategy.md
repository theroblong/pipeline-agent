# CRM Export Strategy

The local knowledge base is Pruvida's sales system of record. HubSpot or another CRM should receive selected structured fields for operational visibility, contact management, and reporting.

## Source Of Truth

Local records:

- Accounts: `knowledge/accounts/`
- Contacts: `knowledge/contacts/`
- Conversations: `knowledge/conversations/`
- Opportunities: `knowledge/opportunities/`
- Products and services: `knowledge/products/`
- Brands and campaigns: `knowledge/brands/`, `knowledge/campaigns/`
- Transcript evaluations: `knowledge/transcript-evaluations/`
- Pipeline view: `knowledge/views/pipeline-board.md`

CRM destinations:

- Company records
- Contact records
- Deal records
- Activity or engagement records
- Notes
- Product interest properties or line items

## Export Principles

- Export structured fields, not every internal note.
- Keep transcript text local or externally controlled unless approved.
- Sync external CRM IDs back into the local record frontmatter.
- Mark records as `ready` before export and `synced` after confirmed export.
- Treat HubSpot fields as configurable per portal; verify property names before implementation.

## Local To CRM Object Mapping

| Local Record | HubSpot Object | Other CRM Equivalent | Notes |
| --- | --- | --- | --- |
| Account | Company | Account | Company-level identity and firmographic fields |
| Contact | Contact | Contact or Lead | Person-level identity and relationship fields |
| Opportunity | Deal | Opportunity | Pipeline stage, amount, close date, owner, offer fit |
| Product or Service | Product, line item, or custom property | Product, service, or product-interest field | Use custom deal fields first unless quoting needs product catalog sync |
| Conversation | Engagement, meeting, call, note, or email | Activity | Date, participants, summary, follow-ups |
| Transcript Evaluation | Note or custom object | Note or custom object | Usually better as local wiki plus a CRM note summary |
| Offer-Fit Pattern | Internal note or custom object | Internal note | Usually local only unless CRM reporting needs it |

## Suggested Export Fields

### Company

| Local Field | CRM Field Concept |
| --- | --- |
| `company_name` | Company name |
| `industry` | Industry |
| `status` | Account status |
| `owner` | Owner |
| `last_interaction_date` | Last activity date |
| `next_action` | Next task or note |

### Contact

| Local Field | CRM Field Concept |
| --- | --- |
| `first_name` | First name |
| `last_name` | Last name |
| `email` | Email |
| `phone` | Phone |
| `title` | Job title |
| `company_name` | Associated company |
| `role_in_opportunity` | Buying role or custom property |
| `influence_level` | Custom property |
| `relationship_status` | Custom property |

### Opportunity

| Local Field | CRM Field Concept |
| --- | --- |
| `opportunity_name` | Deal name |
| `company_name` | Associated company |
| `pipeline_stage` | Deal stage |
| `primary_offer` | Product/service interest or custom property |
| `secondary_offers` | Custom property |
| `product_page_refs` | Local-only context or custom property |
| `owner` | Deal owner |
| `status` | Deal status |
| `target_close_date` | Close date |
| `estimated_value` | Amount |
| `next_action` | Task or note |
| `crm_sync_status` | Local-only sync state |

### Conversation

| Local Field | CRM Field Concept |
| --- | --- |
| `conversation_date` | Activity date |
| `conversation_type` | Activity type |
| `company_name` | Associated company |
| `contact_ids` | Associated contacts |
| `opportunity_ids` | Associated deals |
| Summary | Activity body or note |
| Commitments | Tasks |
| `hubspot_engagement_id` | External activity ID |

### Product Or Service

| Local Field | CRM Field Concept |
| --- | --- |
| `product_name` | Product name or service name |
| `product_type` | Product type |
| `crm_product_code` | SKU, product code, or internal code |
| `hubspot_product_id` | HubSpot product ID |
| `primary_positioning` | Internal description or custom property |

## Pipeline Stage Mapping

The local stage names should remain stable. CRM stage names can be mapped per CRM implementation.

| Local Stage | CRM Stage Concept |
| --- | --- |
| `lead-capture` | New lead or open deal |
| `discovery` | Discovery |
| `solution-fit` | Qualified or solution fit |
| `proposal` | Proposal sent or proposal preparation |
| `negotiation-close` | Negotiation or contract review |
| `onboarding` | Closed won, onboarding |
| `recurring-success` | Customer success or renewal |
| `nurture` | Nurture or inactive |
| `closed-won` | Closed won |
| `closed-lost` | Closed lost |
| `no-fit` | Closed lost or disqualified |

## Sync States

Use the same sync state values across local records:

- `not-synced`: The record has not been exported.
- `ready`: The record is approved for export.
- `synced`: The record was exported and the external ID is recorded.
- `error`: Export failed and needs review.
- `do-not-sync`: The record should remain local.

## Recommended Export Workflow

1. Agents update local records after a transcript, email, call, or meeting.
2. A human marks CRM-safe records as `ready`.
3. Export routine creates or updates CRM records.
4. Export routine writes external CRM IDs back to local frontmatter.
5. Pipeline review uses `knowledge/views/pipeline-board.md` as the local control view.

## Future Automation

The schemas and initial HubSpot field-map template now exist:

- `schemas/account.schema.json`
- `schemas/contact.schema.json`
- `schemas/conversation.schema.json`
- `schemas/opportunity.schema.json`
- `schemas/product.schema.json`
- `schemas/source-note.schema.json`
- `schemas/campaign.schema.json`
- `schemas/brand.schema.json`
- `integrations/hubspot/field-map.template.json`

The next build step is to add a small export adapter:

- `integrations/hubspot/export-ready-records.*`

The adapter should support dry runs before writing to any CRM.
