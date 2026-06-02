# Transcript Intake

Use this folder for transcript intake references and temporary local transcript files.

Raw transcripts may contain sensitive customer, prospect, pricing, personnel, or strategy details. By default, transcript files in this folder are ignored by git. The durable knowledge that should live in the repo belongs in:

- `knowledge/transcript-evaluations/`
- `knowledge/accounts/`
- `knowledge/opportunities/`
- `knowledge/patterns/`

Recommended workflow:

1. Place a transcript here temporarily, or provide an external reference.
2. Run `transcript-opportunity-analyst` with `agents/playbooks/transcript-opportunity-evaluation.md`.
3. Create a structured evaluation from `agents/artifacts/prospect-transcript-evaluation.template.md`.
4. Save only approved knowledge-base updates.
5. Remove or archive the raw transcript according to Pruvida's data-handling rules.
