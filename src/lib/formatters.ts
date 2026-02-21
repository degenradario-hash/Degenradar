// Consolidated format helpers for the entire app

export function formatPrice(n: number | null | undefined): string {
  if (!n) return '—'
  if (n >= 1000) return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  if (n >= 1) return `$${n.toFixed(2)}`
  if (n >= 0.0001) return `$${n.toFixed(4)}`
  if (n >= 0.00000001) return `$${n.toFixed(8)}`
  return `$${n.toExponential(2)}`
}

export function formatPriceStr(price: string | undefined): string {
  if (!price) return '—'
  const n = parseFloat(price)
  return formatPrice(n)
}

export function formatBigNumber(n: number | null | undefined): string {
  if (!n) return '—'
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

export function formatPercent(value: number | null | undefined): {
  text: string
  isPositive: boolean
  isNegative: boolean
} {
  if (value == null) return { text: '—', isPositive: false, isNegative: false }
  const text = `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  return { text, isPositive: value > 0, isNegative: value < 0 }
}

export function formatNumber(value: number | undefined): string {
  if (!value) return '0'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toFixed(0)
}

export function formatAge(createdAt: number | undefined): string {
  if (!createdAt) return '?'
  const diff = Date.now() - createdAt
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d`
  return `${Math.floor(days / 30)}mo`
}
