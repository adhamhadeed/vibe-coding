export function formatNumber(value: number) {
  return new Intl.NumberFormat().format(Math.round(value))
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatMs(value: number) {
  return `${Math.round(value)} ms`
}
