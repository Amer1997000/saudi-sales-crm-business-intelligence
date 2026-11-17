import { describe, expect, it } from 'vitest'
import { DEMO_WORKSPACE } from '../data/demoData'
import { calculateQuotation, overviewMetrics, quotationLineNet, STAGE_PROBABILITIES, validateOpportunity, weightedValue } from './rules'

describe('CRM domain rules', () => {
  it('uses documented stage probabilities', () => {
    expect(STAGE_PROBABILITIES['Qualification']).toBe(0.1)
    expect(STAGE_PROBABILITIES['Negotiation']).toBe(0.8)
    expect(STAGE_PROBABILITIES['Closed Won']).toBe(1)
    expect(STAGE_PROBABILITIES['Closed Lost']).toBe(0)
  })

  it('calculates weighted pipeline and quotation VAT', () => {
    const open = DEMO_WORKSPACE.opportunities.find((item) => item.stage === 'Quotation Submitted')!
    expect(weightedValue({ ...open, valueSar: 200_000, probability: 0.6 })).toBe(120_000)
    const line = { quantity: 10, unitPriceSar: 1_000, discountSar: 500 }
    expect(quotationLineNet(line)).toBe(9_500)
    expect(calculateQuotation([line], 0.15))
      .toEqual({ subtotalSar: 10_000, discountSar: 500, taxableAmountSar: 9_500, vatAmountSar: 1_425, totalSar: 10_925 })
  })

  it('derives overview values from records', () => {
    expect(overviewMetrics(DEMO_WORKSPACE, new Date('2026-11-16T12:00:00Z'))).toMatchObject({
      openPipelineSar: 700_000, weightedPipelineSar: 363_000, wonValueSar: 95_000,
      openOpportunityCount: 4, activeLeadCount: 3, overdueActivityCount: 1,
    })
  })

  it('requires correct terminal-stage fields', () => {
    const won = DEMO_WORKSPACE.opportunities.find((item) => item.stage === 'Closed Won')!
    expect(validateOpportunity(won)).toEqual([])
    expect(validateOpportunity({ ...won, wonDate: undefined, probability: 0.5 })).toContain('Closed Won requires a won date.')
  })
})
