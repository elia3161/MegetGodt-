import React, { useState } from 'react'
import { simulateInvestment } from '../utils/investment'

type Props = {
  onResult: (rows: any[]) => void
}

export default function Calculator({ onResult }: Props) {
  const [start, setStart] = useState('10000')
  const [annual, setAnnual] = useState('6')
  const [years, setYears] = useState('10')
  const [months, setMonths] = useState('0')
  const [monthly, setMonthly] = useState('500')
  const [currency, setCurrency] = useState('DKK')

  function run() {
    const rows = simulateInvestment({
      startAmount: Number(start) || 0,
      annualReturnPercent: Number(annual) || 0,
      years: Number(years) || 0,
      months: Number(months) || 0,
      monthlyContribution: Number(monthly) || 0,
      currency
    })
    onResult(rows)
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Kalkulator</h2>

      <div className="grid gap-3">
        <label className="text-sm">Startbeløb</label>
        <input className="p-2 rounded border" value={start} onChange={(e) => setStart(e.target.value)} />

        <label className="text-sm">Årligt afkast (%)</label>
        <input className="p-2 rounded border" value={annual} onChange={(e) => setAnnual(e.target.value)} />

        <div className="flex gap-2">
          <div>
            <label className="text-sm">År</label>
            <input className="p-2 rounded border w-24" value={years} onChange={(e) => setYears(e.target.value)} />
          </div>

          <div>
            <label className="text-sm">Måneder</label>
            <input className="p-2 rounded border w-24" value={months} onChange={(e) => setMonths(e.target.value)} />
          </div>
        </div>

        <label className="text-sm">Månedligt indskud</label>
        <input className="p-2 rounded border" value={monthly} onChange={(e) => setMonthly(e.target.value)} />

        <label className="text-sm">Valuta</label>
        <select className="p-2 rounded border" value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="DKK">DKK</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>

        <div className="flex gap-3 mt-4">
          <button onClick={run} className="px-4 py-2 bg-teal-500 text-white rounded">Beregn</button>
          <button
            onClick={() => {
              setStart('10000')
              setAnnual('6')
              setYears('10')
              setMonths('0')
              setMonthly('500')
            }}
            className="px-4 py-2 border rounded"
          >
            Nulstil
          </button>
        </div>
      </div>
    </div>
  )
}
