import { simulateInvestment } from '../src/utils/investment'
import { describe, it, expect } from 'vitest'

describe('simulateInvestment', () => {
  it('computes basic growth', () => {
    const rows = simulateInvestment({
      startAmount: 1000,
      annualReturnPercent: 12,
      years: 1,
      months: 0,
      monthlyContribution: 0,
      startDate: new Date(2025, 0, 1),
      currency: 'DKK'
    })

    // with 12% annually compounded monthly, monthly rate = 1%
    // after 12 months balance ~= 1000 * (1+0.01)^12
    const last = rows[rows.length - 1]
    expect(rows.length).toBe(12)
    expect(last.balance).toBeGreaterThan(1100)
  })
})
