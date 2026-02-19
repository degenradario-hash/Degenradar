import { NextResponse } from 'next/server'

const DEXSCREENER_BASE = 'https://api.dexscreener.com'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const chain = searchParams.get('chain') || 'all'

  try {
    let pairs: any[] = []

    if (query) {
      // Search mode
      const res = await fetch(`${DEXSCREENER_BASE}/latest/dex/search?q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data = await res.json()
        pairs = data.pairs || []
      }
    } else {
      // Default: get boosted tokens (trending)
      const res = await fetch(`${DEXSCREENER_BASE}/token-boosts/latest/v1`)
      if (res.ok) {
        const boosts = await res.json()
        // Get details for boosted tokens
        const tokenAddresses = (Array.isArray(boosts) ? boosts : [])
          .slice(0, 20)
          .map((b: any) => b.tokenAddress)
          .filter(Boolean)

        if (tokenAddresses.length > 0) {
          // Batch fetch - DexScreener allows comma-separated addresses
          const batchRes = await fetch(
            `${DEXSCREENER_BASE}/latest/dex/tokens/${tokenAddresses.slice(0, 10).join(',')}`
          )
          if (batchRes.ok) {
            const data = await batchRes.json()
            pairs = data.pairs || []
          }
        }
      }

      // Fallback: search popular terms if no boosted tokens
      if (pairs.length === 0) {
        const fallbackRes = await fetch(`${DEXSCREENER_BASE}/latest/dex/search?q=SOL`)
        if (fallbackRes.ok) {
          const data = await fallbackRes.json()
          pairs = (data.pairs || []).slice(0, 30)
        }
      }
    }

    // Filter by chain if specified
    if (chain !== 'all') {
      pairs = pairs.filter((p: any) => p.chainId === chain)
    }

    // Sort by volume (24h) descending
    pairs.sort((a: any, b: any) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))

    // Limit results
    pairs = pairs.slice(0, 50)

    // Add safety indicators (basic version)
    pairs = pairs.map((pair: any) => ({
      ...pair,
      safetyScore: calculateBasicSafety(pair),
    }))

    return NextResponse.json({ pairs, count: pairs.length })
  } catch (error) {
    console.error('Token fetch error:', error)
    return NextResponse.json({ pairs: [], count: 0, error: 'Failed to fetch tokens' }, { status: 500 })
  }
}

function calculateBasicSafety(pair: any): { score: number; flags: string[] } {
  const flags: string[] = []
  let score = 50 // Start neutral

  // Liquidity check
  const liqUsd = pair.liquidity?.usd || 0
  if (liqUsd > 100000) { score += 15; }
  else if (liqUsd > 10000) { score += 5; }
  else if (liqUsd < 1000) { score -= 20; flags.push('LOW_LIQUIDITY') }

  // Volume check
  const vol24 = pair.volume?.h24 || 0
  if (vol24 > 100000) score += 10
  else if (vol24 < 1000) { score -= 10; flags.push('LOW_VOLUME') }

  // Buy/sell ratio check (potential rug signal)
  const buys24 = pair.txns?.h24?.buys || 0
  const sells24 = pair.txns?.h24?.sells || 0
  const totalTxns = buys24 + sells24
  if (totalTxns > 0) {
    const buyRatio = buys24 / totalTxns
    if (buyRatio < 0.2) { score -= 15; flags.push('HEAVY_SELLING') }
    if (buyRatio > 0.9) { score -= 10; flags.push('SUSPICIOUS_BUY_PATTERN') }
  }

  // Age check
  const ageMs = Date.now() - (pair.pairCreatedAt || Date.now())
  const ageHours = ageMs / (1000 * 60 * 60)
  if (ageHours < 1) { score -= 15; flags.push('VERY_NEW') }
  else if (ageHours < 24) { score -= 5; flags.push('NEW_TOKEN') }
  else if (ageHours > 720) score += 10 // 30+ days

  // Price change check
  const priceChange24 = pair.priceChange?.h24 || 0
  if (priceChange24 < -50) { score -= 10; flags.push('DUMPING') }
  if (priceChange24 > 500) { score -= 5; flags.push('PUMP_ALERT') }

  // Market cap check
  const mcap = pair.marketCap || pair.fdv || 0
  if (mcap > 1000000) score += 5
  if (mcap < 10000 && mcap > 0) { score -= 10; flags.push('MICRO_CAP') }

  // Clamp
  score = Math.max(0, Math.min(100, score))

  return { score, flags }
}
