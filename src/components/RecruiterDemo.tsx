type DemoTarget = 'leads' | 'pipeline' | 'activities' | 'quotations' | 'forecast' | 'analytics'

const steps: Array<{ title: string; detail: string; target: DemoTarget; action: string }> = [
  { title: 'Review and qualify a lead', detail: 'Open Lead Management, inspect validation and qualify a synthetic prospect.', target: 'leads', action: 'Open leads' },
  { title: 'Inspect the commercial pipeline', detail: 'Use Kanban or table view and review auditable stage history.', target: 'pipeline', action: 'Open pipeline' },
  { title: 'Check follow-up control', detail: 'Review due, upcoming and overdue activities without automatic scheduling.', target: 'activities', action: 'Open planner' },
  { title: 'Review quotation controls', detail: 'Inspect calculated discounts, taxable value, 15% demonstration VAT and totals.', target: 'quotations', action: 'Open quotations' },
  { title: 'Reconcile executive intelligence', detail: 'Compare forecasting assumptions with filterable sales analytics.', target: 'analytics', action: 'Open analytics' },
]

export function RecruiterDemo({ onNavigate }: { onNavigate: (target: DemoTarget) => void }) {
  return <section className="guided-demo" aria-labelledby="guided-demo-title">
    <div className="guided-demo-head">
      <div>
        <p className="eyebrow">GETTING STARTED · FIVE-MINUTE WALKTHROUGH</p>
        <h2 id="guided-demo-title">Explore the complete synthetic sales workflow</h2>
        <p>Riyadah Business Solutions is a fictional Saudi B2B supplier replacing disconnected sales spreadsheets with one controlled CRM workspace.</p>
      </div>
      <span>No login or installation required</span>
    </div>
    <ol className="demo-steps">
      {steps.map((step, index) => <li key={step.target}>
        <span className="demo-step-number">{index + 1}</span>
        <div><b>{step.title}</b><p>{step.detail}</p></div>
        <button type="button" onClick={() => onNavigate(step.target)}>{step.action}</button>
      </li>)}
    </ol>
    <div className="demo-safety">
      <b>Safe portfolio demonstration</b>
      <span>Every record is synthetic. Changes stay in this browser only. Use <strong>Reset demo</strong>, then <strong>Confirm reset</strong>, to restore the original dataset. Do not enter confidential customer information.</span>
    </div>
  </section>
}
