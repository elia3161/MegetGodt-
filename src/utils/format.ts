export function formatCurrency(value: number, currency = 'DKK') {
  try {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2
    }).format(value)
  } catch (e) {
    return value.toFixed(2) + ' ' + currency
  }
}
