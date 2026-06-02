---
view_type: offer-positioning-matrix
version: 0.1.0
owner: Pruvida
last_updated: 2026-06-02
---

# Offer Positioning Matrix

Use this view to compare Pruvida offerings during discovery, transcript evaluation, and pipeline review.

Each offer also has its own product page in `knowledge/products/`.

## Offer Fit Matrix

| Client Situation | Best Initial Offer | Supporting Offers | Buying-Cycle Signal |
| --- | --- | --- | --- |
| Enterprise data is fragmented, poorly governed, or not ready for analytics and AI | Aevah | Aevah AI-Ready Data And Agentic Semantic Layer, Aevah MDM Golden Record And Entity Resolution, Aevah Data Flow Monitoring | `problem-exploration`, `active-evaluation`, `solution-shaping` |
| AI agents need trusted business semantics, lineage, and governed operational context | Aevah AI-Ready Data And Agentic Semantic Layer | AI Transformation Services, Blueprint Studio, Aevah | `signal`, `problem-exploration`, `active-evaluation` |
| Customers, products, suppliers, SKUs, or other entities are duplicated or conflicting across systems | Aevah MDM Golden Record And Entity Resolution | Aevah, Automation Consulting Services | `problem-exploration`, `active-evaluation`, `solution-shaping` |
| Data pipelines, integrations, reports, or operational feeds are failing without clear visibility | Aevah Data Flow Monitoring | Aevah, Automation Consulting Services | `problem-exploration`, `active-evaluation`, `solution-shaping` |
| A legacy MDM or data platform migration is expensive, risky, or manually mapped | Aevah Automated Migration Tool | Aevah, Aevah MDM Golden Record And Entity Resolution, Product Development And Intelligent Systems | `active-evaluation`, `solution-shaping`, `proposal-procurement` |
| Teams are misaligned on how a process, operating model, or implementation should work | Blueprint Studio | AI Transformation Services, Automation Consulting Services, Aevah | `problem-exploration`, `active-evaluation`, `solution-shaping` |
| Leadership wants AI adoption but lacks use-case prioritization, governance, or roadmap | AI Transformation Services | Blueprint Studio, Aevah, Automation Consulting Services | `signal`, `problem-exploration`, `active-evaluation` |
| Teams are slowed by repetitive manual work, disconnected systems, handoff delays, or recurring reporting | Automation Consulting Services | Blueprint Studio, Aevah | `problem-exploration`, `active-evaluation`, `solution-shaping`, `proposal-procurement` |
| A company needs software, embedded systems, real-time platforms, or AI-enabled applications designed and built | Product Development And Intelligent Systems | Blueprint Studio, AI Transformation Services, Aevah | `problem-exploration`, `active-evaluation`, `solution-shaping`, `proposal-procurement` |
| Government or defense opportunity involves logistics intelligence, data modernization, procurement analytics, or mission data trust | Government And Defense AI Data Modernization | Aevah, Aevah MDM Golden Record And Entity Resolution, Aevah Data Flow Monitoring, AI Transformation Services | `signal`, `problem-exploration`, `active-evaluation`, `solution-shaping` |

## Product Pages

- [Aevah](../products/aevah.md)
- [Aevah AI-Ready Data And Agentic Semantic Layer](../products/aevah-ai-ready-data-agentic-semantic-layer.md)
- [Aevah MDM Golden Record And Entity Resolution](../products/aevah-mdm-golden-record-entity-resolution.md)
- [Aevah Data Flow Monitoring](../products/aevah-data-flow-monitoring.md)
- [Aevah Automated Migration Tool](../products/aevah-automated-migration-tool.md)
- [Blueprint Studio](../products/blueprint-studio.md)
- [AI Transformation Services](../products/ai-transformation-services.md)
- [Automation Consulting Services](../products/automation-consulting-services.md)
- [Product Development And Intelligent Systems](../products/product-development-intelligent-systems.md)
- [Government And Defense AI Data Modernization](../products/government-defense-ai-data-modernization.md)

## How To Use This View

- Use transcript evidence first.
- Select one primary offer and only list secondary offers when they help the prospect reach value.
- If the signal is broad AI interest without a concrete workflow, start with AI Transformation Services.
- If the signal is unclear process or operating-model alignment, start with Blueprint Studio.
- If the signal is enterprise data trust, data products, lineage, governance, or AI-ready data, consider Aevah or a specific Aevah sub-offer.
- If the signal is entity identity, duplicate records, golden records, or survivorship, consider Aevah MDM Golden Record And Entity Resolution.
- If the signal is data reliability, pipeline health, integration failures, or freshness, consider Aevah Data Flow Monitoring.
- If the signal is migration from a legacy MDM or data platform, consider Aevah Automated Migration Tool.
- If the signal is repeated manual work or disconnected workflows, consider Automation Consulting Services.
- If the signal is build capacity, embedded systems, real-time platforms, or production AI applications, consider Product Development And Intelligent Systems.
- If the signal is government, defense, logistics intelligence, or public-sector data modernization, consider Government And Defense AI Data Modernization.

## Learning Loop

When an offer lands or misses, update:

- The opportunity outcome in `knowledge/opportunities/`.
- The product's `Offer Fit History` table.
- `knowledge/patterns/offer-fit-observations.md`.
