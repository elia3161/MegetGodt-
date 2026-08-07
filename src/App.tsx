import React, { useState } from 'react'
import Calculator from './components/Calculator'
import ChartComponent from './components/ChartComponent'

export default function App() {
  const [data, setData] = useState<any[]>([])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="max-w-4xl mx-auto p-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">MegetGodt Invest</h1>
        <div className="text-sm text-gray-500">PWA · Investeringskalkulator</div>
      </header>

      <main className="max-w-4xl mx-auto p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <Calculator onResult={(r: any[]) => setData(r)} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <ChartComponent data={data} />
        </div>

        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Månedlig oversigt</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="p-2">Måned</th>
                  <th className="p-2">Indskud</th>
                  <th className="p-2">Rente</th>
                  <th className="p-2">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{row.date}</td>
                    <td className="p-2">{row.contributionFormatted}</td>
                    <td className="p-2">{row.interestFormatted}</td>
                    <td className="p-2">{row.balanceFormatted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
