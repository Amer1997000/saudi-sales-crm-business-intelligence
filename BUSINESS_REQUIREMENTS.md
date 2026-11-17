# Business Requirements

## Scenario and problem

Riyadah Business Solutions is a **fictional** Saudi B2B supplier. Representatives currently manage leads, accounts, quotations, deals and follow-ups in disconnected spreadsheets, leaving management without a consolidated pipeline or action view.

## Stakeholders and workflow

Sales representatives maintain assigned records; managers review pipeline and follow-ups; leadership reviews coverage and conversion; commercial administrators control accounts and quotations.

Capture lead → qualify/disqualify → convert to account and opportunity → progress an auditable stage → issue quotation → follow up → close won/lost → analyze.

## Scope implemented through Phase 6 preparation

Typed browser foundation, versioned local workspace, synthetic dataset, lead/account operations, audited opportunity stages, follow-up planning, quotation management, forecasting, sales analytics, executive intelligence, recruiter walkthrough, defensive CSV handling and static-hosting preparation. No authentication, collaboration, server persistence, integrations or production audit controls.

## Rules

1. SAR is the base currency. Opportunity values are pre-VAT.
2. Weighted value = opportunity value × probability.
3. Stage defaults: Qualification 10%, Discovery 25%, Solution Design 40%, Quotation Submitted 60%, Negotiation 80%, Closed Won 100%, Closed Lost 0%.
4. Closed Won requires won date/100%; Closed Lost requires lost date, reason/0%.
5. Converted leads may link to one account and initial opportunity.
6. Line net = quantity × unit price − discount. Demonstration VAT is 15%.
7. Active leads are New, Contacted or Qualified. Open deals exclude terminal stages.
8. Overdue means Planned with a due time before the evaluation date.
9. Every opportunity stage change records previous stage, target stage, timestamp and an optional note.
10. Reopening a closed opportunity requires explicit confirmation. Closed Lost requires a supplied loss reason.
11. Quotation Submitted and Negotiation require an Issued or Accepted quotation; Closed Won requires an Accepted quotation.
12. Activity gaps are advisory only. The system never fabricates or automatically schedules activities.
13. Quotation financial totals are derived from validated lines and cannot be manually overwritten.
14. Demonstration VAT is fixed at 15%; production tax treatment requires professional review.
15. Draft quotations may be edited. Issued quotations move only to Accepted, Rejected, Expired or Superseded; terminal statuses are immutable in Phase 4.
16. Forecasts use expected-close dates, stored opportunity values and probabilities. They are sales-planning estimates, not recognized accounting revenue.
17. Lead qualification rate = current Qualified or Converted leads ÷ lead cohort.
18. Lead-to-opportunity conversion = unique leads referenced by at least one opportunity ÷ lead cohort.
19. Opportunity win rate = Closed Won ÷ (Closed Won + Closed Lost); open opportunities are excluded.
20. Quotation acceptance = Accepted ÷ (Accepted + Rejected); Draft, Issued, Expired and Superseded do not enter the denominator.
21. Zero-denominator rates and averages without eligible records display Unavailable rather than 0.
22. Management observations are transparent summaries of stored records, not AI recommendations or causal explanations.
23. CSV rows with malformed quoting, missing required headers or incorrect column counts are rejected with explicit errors; valid rows remain independently eligible.
24. CSV exports neutralize leading spreadsheet-formula characters. This is defense in depth and does not replace safe spreadsheet configuration.
25. Stored workspaces must match the supported schema, synthetic-data metadata and basic entity structure; incompatible or corrupt values reset to the known demonstration dataset.
26. Publication builds are static and perform all processing locally. No CRM record is transmitted by application code.

## Acceptance and limitations

All modules must be discoverable, overview values must reconcile, storage must initialize/reset safely, and tests/typecheck/build must pass. This is a single-user prototype. Local storage is not encrypted and is unsuitable for confidential production CRM data. Probabilities are planning assumptions, not measured performance. No improvement claim is made.
