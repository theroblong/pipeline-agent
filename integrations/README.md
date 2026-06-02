# Integrations

This folder is reserved for adapters that move approved local knowledge-base records into external systems.

The first intended destination is HubSpot, but adapters should keep the local knowledge base as the source of truth.

Expected pattern:

1. Read records from `knowledge/`.
2. Select records with `crm_sync_status: ready`.
3. Validate frontmatter against `schemas/`.
4. Export to the target CRM.
5. Write external CRM IDs and sync status back to the local records.
6. Support a dry-run mode before writing externally.
