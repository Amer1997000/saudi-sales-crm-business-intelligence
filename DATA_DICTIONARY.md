# Data Dictionary and Rules

Identifiers are synthetic and unique per entity. Dates use ISO `YYYY-MM-DD`; timestamps use ISO 8601 UTC. Money is non-negative SAR.

| Entity | Core fields | Relationships |
|---|---|---|
| SalesRepresentative | id, displayName, territory, active | assigned records |
| Lead | id, company, contact, city, region, source, category, status | rep; optional converted account/deal |
| Account | id, legalName, industry, city, region, tier, status | rep; source lead |
| Opportunity | id, accountId, title, category, stage, valueSar, probability, close date | account, rep, lead, quotes |
| Quotation | id, number, opportunityId, accountId, dates, status, lines, totals | deal and account |
| Activity | id, type, subject, dueAt, status, priority | rep; optional lead/account/deal |

## Forecast rules

| Stage | Probability | Open? |
|---|---:|---|
| Qualification | 10% | Yes |
| Discovery | 25% | Yes |
| Solution Design | 40% | Yes |
| Quotation Submitted | 60% | Yes |
| Negotiation | 80% | Yes |
| Closed Won | 100% | No |
| Closed Lost | 0% | No |

Weighted pipeline sums `valueSar × probability` for open deals. It is planning information, not guaranteed revenue, margin, cash or accounting revenue.

Quotation rules: `line net = quantity × unit price − discount`; subtotal is gross lines; taxable is net lines; VAT = taxable × 15%; total = taxable + VAT.

## Storage

Key: `riyadah-crm-workspace-v1`; schema version: `1`. Missing, malformed or incompatible storage is conservatively replaced by a fresh valid demo workspace. Reset removes the key and reinitializes the synthetic dataset.

## Phase 2 record rules

- Lead duplicate candidate: normalized company name plus the same city, or normalized company plus normalized contact name. Detection warns; it does not merge or block.
- Account duplicate candidate: normalized legal name plus city. Detection warns without merging.
- An unlinked lead may be deleted after confirmation. A lead referenced by conversion fields, an account, opportunity or activity is protected from deletion.
- Conversion requires `Qualified`, no prior conversion links, a non-empty opportunity title, positive value and close date. One immutable transaction creates the account and Qualification-stage opportunity, then marks the original lead Converted with both links.
- Conversion copies the lead's company, contact, location, industry, owner and category. It does not invent missing customer attributes.
- CSV rows use the field names documented in README. Supported cities, sources, categories, statuses and representative IDs are validated. Valid rows are retained even when other rows fail.

## Phase 3 opportunity rules

- New opportunities begin in Qualification at its 10% default unless the user explicitly supplies a valid 0–100% override.
- Open-stage moves apply the documented target-stage default unless an explicit override is supplied. Terminal stages always use 100% for Closed Won and 0% for Closed Lost.
- Stage history is append-only in normal application use and stores `fromStage`, `toStage`, `changedAt` and optional `note`.
- Forward and backward movement is permitted. Movement from either closed stage to an open stage requires explicit reopening confirmation.
- Conservative quotation gate: Quotation Submitted and Negotiation require a linked quotation with Issued or Accepted status. Closed Won requires a linked Accepted quotation. Phase 3 cannot author quotations, so a blocked deal clearly explains that this capability belongs to Phase 4.
- Closed Lost requires a non-empty reason. Terminal records are excluded from open and weighted pipeline totals.
- Opportunity values must be positive, account and representative links must exist, and expected-close dates must be valid ISO dates.

## Phase 3 activity rules

- Types: Call, Email, Meeting, Proposal follow-up, Site visit and General task.
- Statuses: Planned, Completed and Cancelled. Completion stores `completedAt`; cancellation does not imply completion.
- Views are derived from status and due timestamp: overdue precedes the evaluation day, due today falls within it, and upcoming is later.
- Activities may link independently to an existing lead, account and/or opportunity. Invalid links are rejected.
- A follow-up gap is a Qualified lead or open opportunity without a Planned activity at or after the evaluation time. Gap detection does not create records.

## Phase 4 quotation rules

- Quotation numbers are required and case-insensitively unique.
- The selected account must match the selected opportunity's account.
- Each line requires a description, positive quantity, non-negative unit price, and discount between zero and the gross line value.
- `lineNetSar = quantity × unitPriceSar − discountSar`.
- `subtotalSar` is gross before discounts; `discountSar` is the sum of line discounts; `taxableAmountSar` is subtotal minus discounts; `vatAmountSar = taxableAmountSar × 15%`; `totalSar = taxableAmountSar + vatAmountSar`.
- The 15% rate is a demonstration assumption, not production tax advice. All calculated fields are derived and unavailable for manual editing.
- Creation starts in Draft. Allowed status paths are Draft → Issued and Issued → Accepted, Rejected, Expired or Superseded. Accepted, Rejected, Expired and Superseded are terminal in Phase 4.
- Only Draft content can be edited. A status change that would remove the only qualifying quotation from a Quotation Submitted or Negotiation opportunity is blocked.
- Creating or editing a quotation preserves the reciprocal opportunity `quotationIds` relationship.

## Phase 4 forecast rules

- Filters: expected-close date range, stage, account region, product category and representative.
- Open pipeline sums values only for Qualification, Discovery, Solution Design, Quotation Submitted and Negotiation.
- Weighted pipeline sums `valueSar × probability` for those same open stages. Stored manual overrides are respected.
- Closed Won commercial value is shown separately. Closed Won and Closed Lost never enter open or weighted totals.
- Missing or invalid expected-close dates are flagged and excluded rather than treated as zero or assigned an invented date.

## Phase 5 analytics definitions

| Metric | Numerator | Denominator / basis | Date basis |
|---|---|---|---|
| Lead qualification rate | Leads currently Qualified or Converted | Distinct lead records | Lead `createdAt` |
| Lead-to-opportunity conversion | Distinct leads referenced by an opportunity `sourceLeadId` | Distinct lead records | Lead `createdAt` |
| Opportunity win rate | Closed Won opportunities | Closed Won + Closed Lost; open excluded | `wonDate` or `lostDate` |
| Quotation acceptance rate | Accepted quotations | Accepted + Rejected | Quotation `issueDate` |
| Average Closed Won deal size | Sum of Closed Won `valueSar` | Closed Won opportunity count | `wonDate` |
| Average sales-cycle duration | Days from opportunity `createdAt` to `wonDate` | Won records with valid chronological dates | `wonDate` |

- Lead, opportunity and quotation entities are counted independently and never summed into a single total.
- Date filters use the date basis above. Open pipeline charts use `expectedCloseDate`; monthly opportunity trends use opportunity `createdAt`.
- Region comes from the linked account. Representative comes from the entity assignment. The industry/category filter matches account or lead industry and product/service category where applicable.
- Regional and representative performance charts show non-lost commercial opportunity value in scope. They do not represent recognized revenue.
- Missing dates are excluded from date-dependent calculations. Zero denominators return Unavailable.
- Charts expose text labels, numeric values and record counts so they remain understandable without color or pointer interaction.

## Phase 6 data-safety and publication rules

- CSV import is UTF-8 only. The exact required headers remain authoritative; arbitrary mappings and Excel files are unsupported.
- A row must contain the same number of columns as its header. Wrong-width rows are rejected independently and never padded with invented values.
- Unterminated quoted fields are reported as malformed files. Quoted commas, line breaks and doubled quotation marks remain supported.
- Exported text cells beginning with `=`, `+`, `-`, `@`, tab or carriage return receive a leading apostrophe before RFC-style CSV quoting. This reduces spreadsheet-formula execution risk.
- The local-storage guard requires schema version 1, all six entity collections, string record IDs, and synthetic/fictitious metadata. Invalid content is replaced by a fresh demonstration workspace.
- The static build uses relative asset paths. Module navigation is in-memory rather than URL-route based, so refresh returns safely to Executive Overview without a server rewrite rule.
