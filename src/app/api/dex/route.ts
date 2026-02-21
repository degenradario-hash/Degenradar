import { NextResponse } from 'next/server'

const DEX_BASE = 'https://api.dexscreener.com'

function calculateSafetyScore(pair: any): { score: number; flags: string[] } {
  let score = 50
  const flags: string[] = []

  // Liquidity check
  const liq = pair.liquidity?.usd || 0
  if (liq < 5000) { score -= 25; flags.push('LOW_LIQUIDITY') }
  else if (liq < 20000) { score -= 10; flags.push('LOW_LIQUIDITY') }
  else if (liq > 100000) { score += 15 }
  else { score += 5 }

  // Volume check
  const vol = pair.volume?.h24 || 0
  if (vol < 1000) { score -= 15; flags.push('LOW_VOLUME') }
  else if (vol > 50000) { score += 10 }

  // Age check
  const ageMs = Date.now() - (pair.pairCreatedAt || 0)
  if (ageMs < 3600000) { score -= 15; flags.push('VERY_NEW') }
  else if (ageMs < 86400000) { score -= 5; flags.push('NEW_TOKEN') }
  else if (ageMs > 604800000) { score += 10 }

  // Buy/sell ratio
  const buys = pair.txns?.h24?.buys || 0
  const sells = pair.txns?.h24?.sells || 0
  if (sells > buys * 2 && sells > 10) { score -= 15; flags.push('HEAVY_SELLING') }
  if (buys > sells * 5 && buys > 50) { flags.push('SUSPICIOUS_BUY_PATTERN') }

  // Price dump check
  const priceChange24h = pair.priceChange?.h24 || 0
  if (priceChange24h < -50) { score -= 10; flags.push('DUMPING') }
  if (priceChange24h > 500) { flags.push('PUMP_ALERT') }

  // Market cap check
  const mcap = pair.marketCap || pair.fdv || 0
  if (mcap > 0 && mcap < 10000) { score -= 10; flags.push('MICRO_CAP') }

  return { score: Math.max(0, Math.min(100, score)), flags }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chain = searchParams.get('chain') || 'all'
  const query = searchParams.get('q') || ''

  try {
    let pairs: any[] = []

    if (query) {
      // Search mode
      const res = await fetch(
        `${DEX_BASE}/latest/dex/search?q=${encodeURIComponent(query)}`,
        { next: { revalidate: 30 } }
      )
      if (res.ok) {
        const data = await res.json()
        pairs = data.pairs || []
      }
    } else {
      // Default: latest boosted tokens
      const boostRes = await fetch(`${DEX_BASE}/token-boosts/latest/v1`, {
        next: { revalidate: 30 },
      })
      if (!boostRes.ok) {
        return NextResponse.json({ tokens: [], source: 'dexscreener', error: 'Rate limited' }, { status: 429 })
      }
      const boosts = await boostRes.json()
      const tokens = (Array.isArray(boosts) ? boosts : []).slice(0, 30)

      // Get details for boosted tokens
      const addresses = tokens.map((t: any) => t.tokenAddress).filter(Boolean).slice(0, 10)
      if (addresses.length > 0) {
        const detailRes = await fetch(`${DEX_BASE}/latest/dex/tokens/${addresses.join(',')}`)
        if (detailRes.ok) {
          const data = await detailRes.json()
          pairs = data.pairs || []
        }
      }
    }

    // Filter by chain if specified
    if (chain !== 'all') {
      pairs = pairs.filter((p: any) => p.chainId === chain)
    }

    // Deduplicate by base token address
    const seen = new Set()
    pairs = pairs.filter((p: any) => {
      const key = `${p.chainId}-${p.baseToken?.address}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }).slice(0, 50)

    // Add safety scores
    const tokens = pairs.map((p: any) => ({
      chainId: p.chainId,
      pairAddress: p.pairAddress,
      baseToken: p.baseToken,
      quoteToken: p.quoteToken,
      priceUsd: p.priceUsd,
      priceChange: p.priceChange,
      volume: p.volume,
      txns: p.txns,
      liquidity: p.liquidity,
      marketCap: p.marketCap,
      fdv: p.fdv,
      pairCreatedAt: p.pairCreatedAt,
      url: p.url,
      info: p.info,
      safetyScore: calculateSafetyScore(p),
    }))

    return NextResponse.json({ tokens, source: 'dexscreener', chain })
  } catch (error) {
    console.error('Dex API error:', error)
    return NextResponse.json({ tokens: [], error: 'Server error' }, { status: 500 })
  }
}
