import { describe, expect, it } from 'vitest'
import { validateOpportunity } from '../domain/rules'
import { DEMO_WORKSPACE } from './demoData'

const unique = (values: string[]) => new Set(values).size === values.length

describe('synthetic demonstration data', () => {
  it('uses unique entity identifiers', () => {
    for (const records of [DEMO_WORKSPACE.representatives, DEMO_WORKSPACE.leads, DEMO_WORKSPACE.accounts, DEMO_WORKSPACE.opportunities, DEMO_WORKSPACE.quotations, DEMO_WORKSPACE.activities]) {
      expect(unique(records.map((record) => record.id))).toBe(true)
    }
  })

  it('maintains foreign-key relationships and valid opportunity rules', () => {
    const reps = new Set(DEMO_WORKSPACE.representatives.map((x) => x.id))
    const accounts = new Set(DEMO_WORKSPACE.accounts.map((x) => x.id))
    const opportunities = new Set(DEMO_WORKSPACE.opportunities.map((x) => x.id))
    DEMO_WORKSPACE.leads.forEach((x) => expect(reps.has(x.assignedSalesRepId)).toBe(true))
    DEMO_WORKSPACE.opportunities.forEach((x) => {
      expect(accounts.has(x.accountId)).toBe(true)
      expect(reps.has(x.assignedSalesRepId)).toBe(true)
      expect(validateOpportunity(x)).toEqual([])
    })
    DEMO_WORKSPACE.quotations.forEach((x) => {
      expect(accounts.has(x.accountId)).toBe(true)
      expect(opportunities.has(x.opportunityId)).toBe(true)
      expect(x.totalSar).toBe(x.taxableAmountSar + x.vatAmountSar)
    })
  })

  it('labels the dataset as fictional synthetic data', () => {
    expect(DEMO_WORKSPACE.metadata).toMatchObject({ dataClassification: 'Synthetic demonstration data', companyScenario: 'Fictional' })
  })
})
