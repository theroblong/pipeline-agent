# Claude Instructions

This project manages Pruvida sales-pipeline agents.

Use the model-neutral files in `agents/` as the source of truth:

- Shared company and offering context: `agents/context/pruvida-offerings.md`
- Agent personalities: `agents/personas/*.agent.md`
- Transcript evaluation playbook: `agents/playbooks/transcript-opportunity-evaluation.md`
- Prospect evaluation template: `agents/artifacts/prospect-transcript-evaluation.template.md`
- Sales knowledge base: `knowledge/`
- Standard pipeline view: `knowledge/views/pipeline-board.md`
- Product positioning pages: `knowledge/products/`
- Offer positioning matrix: `knowledge/views/offer-positioning-matrix.md`
- Sales enablement output catalog: `knowledge/sales-enablement/output-pack.md`
- Product marketing library: `knowledge/sales-enablement/product-marketing-library.md`
- Pruvida executive one-pager pattern: `knowledge/sales-enablement/pruvida-executive-one-pager.md`
- Campaign source material: `knowledge/campaigns/`
- Brand/channel context: `knowledge/brands/`
- CRM export strategy: `docs/crm-export-strategy.md`
- Pipeline operating model: `docs/sales-pipeline-layout.md`

When helping with a deal, load the relevant persona and keep outputs grounded in the supplied deal context. Do not invent customer facts, pricing, contractual terms, or product capabilities.

Prefer adding reusable process knowledge under `agents/` or `docs/` instead of baking it into a vendor-specific instruction file.
