# Saudi Sales CRM & Business Development Intelligence

A browser-based CRM and business development intelligence portfolio for **Riyadah Business Solutions**, a fictional Saudi B2B company selling office equipment, IT products and business services across Saudi Arabia. The application demonstrates an integrated alternative to disconnected lead, account, quotation and follow-up spreadsheets.

## Disclosure

Every company, person, transaction and result is synthetic. Riyadah Business Solutions is not a real client. The app sends no data to a server: its workspace remains in the current browser's `localStorage`. Clearing browser storage removes local changes.

## Business problem and solution

Sales representatives using separate spreadsheets cannot reliably share pipeline status, follow-up commitments, quotation controls or management metrics. This prototype consolidates those workflows into a typed, browser-local workspace with validated record relationships, auditable stage transitions, controlled quotations, forecasting and executive analytics.

## Implemented functionality

- Responsive shell and navigation for eight modules
- Typed leads, accounts, opportunities, quotations, activities and representatives
- Versioned, recoverable local workspace with deliberate reset
- Internally linked Saudi B2B demonstration records
- Executive KPIs calculated from source records
- Validated lead and account create/edit workflows, search and filters
- Qualification, disqualification, safe deletion and atomic lead conversion
- Relationship-aware account detail views
- UTF-8 lead CSV template, partial-accept import, row errors and export
- Sales Pipeline Kanban and table views with validated create/edit workflows
- Audited forward/backward stage changes, explicit reopening, loss reasons and quotation gates
- Stage-default or explicitly overridden open-deal probabilities
- Follow-up creation, editing, completion, cancellation and relationship links
- Due-today, upcoming, overdue, completed and cancelled activity views
- Follow-up gap indicators for qualified leads and open opportunities
- Linked quotation builder with immutable calculated financial totals
- Draft editing, controlled quotation status transitions, viewing and print layout
- Documented 15% demonstration VAT assumption and tax-review disclosure
- Strict quotation-to-opportunity stage gates through Closed Won
- Filterable open, weighted and Closed Won commercial forecasting
- Invalid expected-close-date exclusions and calculation explanations
- Filterable qualification, conversion, win-rate and quotation-acceptance metrics
- Average Closed Won deal size and sales-cycle duration with unavailable states
- Accessible pipeline, regional, representative, category and monthly trend charts
- Enhanced executive funnel, quotation, follow-up and management-observation panels
- Transparent metric numerators, denominators and entity-specific date bases
- Domain, CRUD, conversion, CSV, fixture and storage tests

The Executive Overview includes an in-product five-minute guided demonstration. Every operational module is interactive; analytics and forecasts recalculate from the same stored CRM records.

Pipeline and probability-weighted values are estimates and are not recognized accounting revenue. Closed Won represents the commercial value stored in synthetic won records; it does not prove invoicing or cash collection.

Quotation VAT uses a fixed 15% demonstration assumption. This portfolio prototype does not determine legal tax treatment; production implementation requires qualified tax and legal review.

### Lead CSV contract

Only UTF-8 `.csv` is supported. Download the in-app template for the exact header order. Required headers are `companyName`, `contactName`, `businessEmail`, `businessPhone`, `city`, `industry`, `source`, `interestCategory`, `estimatedValueSar`, `status`, `score`, and `assignedSalesRepId`. Valid rows are accepted independently; invalid rows are reported with row and field. Incorrect row widths and malformed quotes are rejected. Possible duplicates are warned and never silently merged. CSV export prefixes spreadsheet-formula characters with an apostrophe to reduce formula-injection risk. Excel files and arbitrary column mappings are not supported.

## Architecture and privacy

- React 19 presentation components and accessible native form controls
- TypeScript domain services for validation, conversion, stage rules, quotation calculations, forecasting and analytics
- Versioned `localStorage` repository with conservative corruption recovery and two-step reset
- Vitest regression coverage for business rules and data integrity
- Vite static build with relative assets; no backend, database, authentication, telemetry or external data transmission

Browser local storage is neither encrypted nor centrally backed up and is unsuitable for confidential customer information or production CRM use.

## Five-minute recruiter demonstration

1. Read the fictional-data disclosure and Executive Overview definitions.
2. Use the guided-demo buttons to open Lead Management and qualify a synthetic lead.
3. Review the Sales Pipeline stage history and Follow-up Planner classifications.
4. Open a quotation and reconcile subtotal, discounts, taxable amount, 15% demonstration VAT and total.
5. Compare Revenue Forecasting with Sales Analytics, then use the two-step reset.

No login, installation or special setup is required after static publication. See [DEMO_GUIDE.md](DEMO_GUIDE.md) for the complete walkthrough.

## Technology and setup

React 19, TypeScript, Vite and Vitest. No backend, authentication, paid API, external transmission or database.

```bash
npm install
npm run dev
npm test
npm run typecheck
npm run lint
npm run build
npm audit
```

Final Phase 6 local verification: 10 test files and 51 tests passed; TypeScript, lint and production build passed; `npm audit` reported zero vulnerabilities. Browser walkthrough findings are documented in the project handoff.

## GitHub Pages preparation

`vite.config.ts` uses `base: './'`, so static assets work under a repository subdirectory without hard-coding a future repository name. `.github/workflows/deploy-pages.yml` runs tests, type checking, lint and build before uploading `dist`. Publication remains intentionally blocked until explicit approval.

## Limitations

This is a single-browser portfolio prototype: no authentication, concurrent users, server backup, production audit immutability, email/calendar integration, accounting recognition, tax determination or predictive AI. Stage probabilities are planning assumptions, not measured likelihoods. The synthetic metrics are demonstrations, not Riyadah or client performance.

## CV-ready description

**Saudi Sales CRM & Business Development Intelligence** — Designed and developed a React/TypeScript browser CRM for a fictional Saudi B2B sales operation, covering lead conversion, customer accounts, auditable pipeline stages, follow-up planning, VAT-aware quotations, weighted forecasting, CSV controls and filterable executive analytics, supported by automated business-rule tests and static GitHub Pages preparation.

See [BUSINESS_REQUIREMENTS.md](BUSINESS_REQUIREMENTS.md), [DATA_DICTIONARY.md](DATA_DICTIONARY.md) and [DEMO_GUIDE.md](DEMO_GUIDE.md).
