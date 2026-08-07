import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function ChartComponent({ data }: { data: any[] }) {
  const labels = data.map((d) => d.date)
  const balances = data.map((d) => Number(d.balance.toFixed(2)))

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Saldo',
        data: balances,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6,182,212,0.1)',
        tension: 0.25
      }
    ]
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Vækstkurve</h2>
      {data.length === 0 ? (
        <div className="text-gray-500">Kør en beregning for at se grafen.</div>
      ) : (
        <Line data={chartData} />
      )}
    </div>
  )
}
