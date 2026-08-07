import { formatCurrency } from './format'

export type SimulationRow = {
  date: string
  contribution: number
  interest: number
  balance: number
}

export type SimParams = {
  startAmount: number
  annualReturnPercent: number
  years: number
  months: number
  monthlyContribution: number
  startDate?: Date
  currency?: string
}

export function simulateInvestment(params: SimParams) {
  const {
    startAmount,
    annualReturnPercent,
    years,
    months,
    monthlyContribution,
    startDate = new Date(),
    currency = 'DKK'
  } = params

  const totalMonths = years * 12 + months
  const monthlyRate = annualReturnPercent / 100 / 12

  const rows: any[] = []
  let balance = startAmount
  const cur = currency

  for (let i = 0; i < totalMonths; i++) {
    // compute date label
    const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1)
    const dateLabel = d.toLocaleDateString('da-DK', { year: 'numeric', month: 'short' })

    // interest on current balance
    const interest = balance * monthlyRate
    balance = balance + interest + monthlyContribution

    rows.push({
      date: dateLabel,
      contribution: monthlyContribution,
      interest,
      balance,
      contributionFormatted: formatCurrency(monthlyContribution, cur),
      interestFormatted: formatCurrency(interest, cur),
      balanceFormatted: formatCurrency(balance, cur)
    })
  }

  return rows
}
