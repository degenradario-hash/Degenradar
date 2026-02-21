import { NextResponse } from 'next/server'

const CG_BASE = 'https://api.coingecko.com/api/v3'
const DEX_BASE = 'https://api.dexscreener.com'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const view = searchParams.get('view') || 'top'       // top | trending | gainers | losers | new | search
  const query = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = Math.min(parseInt(searchParams.get('per_page') || '100'), 250)
  const sortBy = searchParams.get('sort') || 'market_cap_desc'

  try {
    // ─── TOP / MAIN VIEW: CoinGecko markets ───
    if (view === 'top' || view === 'gainers' || view === 'losers') {
      let order = 'market_cap_desc'
      if (view === 'gainers') order = 'market_cap_desc' // we sort client-side by 24h change
      if (view === 'losers') order = 'market_cap_desc'

      const res = await fetch(
        `${CG_BASE}/coins/markets?vs_currency=usd&order=${order}&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d&locale=en`,
        { next: { revalidate: 60 } }
      )

      if (!res.ok) {
        // Fallback if rate limited
        return NextResponse.json({ coins: [], source: 'coingecko', error: 'Rate limited, try again in 30s' }, { status: 429 })
      }

      let coins = await res.json()

      // Sort for gainers/losers
      if (view === 'gainers') {
        coins.sort((a: any, b: any) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
      }
      if (view === 'losers') {
        coins.sort((a: any, b: any) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
      }

      return NextResponse.json({ coins, source: 'coingecko', page, view })
    }

    // ─── TRENDING: CoinGecko trending ───
    if (view === 'trending') {
      const res = await fetch(`${CG_BASE}/search/trending`, { next: { revalidate: 120 } })
      if (!res.ok) return NextResponse.json({ coins: [], source: 'coingecko' })
      const data = await res.json()
      const coins = (data.coins || []).map((c: any) => ({
        id: c.item.id,
        symbol: c.item.symbol,
        name: c.item.name,
        image: c.item.small || c.item.thumb,
        current_price: c.item.data?.price,
        market_cap: c.item.data?.market_cap,
        total_volume: c.item.data?.total_volume,
        price_change_percentage_24h: c.item.data?.price_change_percentage_24h?.usd,
        sparkline_in_7d: c.item.data?.sparkline ? { price: [] } : undefined,
        market_cap_rank: c.item.market_cap_rank,
        score: c.item.score,
      }))
      return NextResponse.json({ coins, source: 'coingecko', view })
    }

    // ─── NEW PAIRS: DexScreener latest boosts ───
    if (view === 'new') {
      const res = await fetch(`${DEX_BASE}/token-boosts/latest/v1`, { next: { revalidate: 60 } })
      if (!res.ok) return NextResponse.json({ coins: [], source: 'dexscreener' })
      const boosts = await res.json()
      const tokens = (Array.isArray(boosts) ? boosts : []).slice(0, 30)

      // Get details
      const addresses = tokens.map((t: any) => t.tokenAddress).filter(Boolean).slice(0, 10)
      let pairs: any[] = []
      if (addresses.length > 0) {
        const detailRes = await fetch(`${DEX_BASE}/latest/dex/tokens/${addresses.join(',')}`)
        if (detailRes.ok) {
          const data = await detailRes.json()
          pairs = data.pairs || []
        }
      }

      // Format to match CoinGecko-ish shape
      const seen = new Set()
      const coins = pairs
        .filter((p: any) => {
          if (seen.has(p.baseToken?.address)) return false
          seen.add(p.baseToken?.address)
          return true
        })
        .slice(0, 50)
        .map((p: any) => ({
          id: p.baseToken?.address,
          symbol: p.baseToken?.symbol,
          name: p.baseToken?.name,
          image: null,
          current_price: parseFloat(p.priceUsd || '0'),
          market_cap: p.marketCap || p.fdv || 0,
          total_volume: p.volume?.h24 || 0,
          price_change_percentage_24h: p.priceChange?.h24 || 0,
          price_change_percentage_1h_in_currency: p.priceChange?.h1 || 0,
          price_change_percentage_7d_in_currency: null,
          liquidity: p.liquidity?.usd || 0,
          txns_24h: p.txns?.h24 ? (p.txns.h24.buys + p.txns.h24.sells) : 0,
          buys_24h: p.txns?.h24?.buys || 0,
          sells_24h: p.txns?.h24?.sells || 0,
          pair_created_at: p.pairCreatedAt,
          chain: p.chainId,
          dex_url: p.url,
          is_dex: true,
        }))

      return NextResponse.json({ coins, source: 'dexscreener', view })
    }

    // ─── SEARCH ───
    if (view === 'search' && query) {
      // Try CoinGecko search first
      const cgRes = await fetch(`${CG_BASE}/search?query=${encodeURIComponent(query)}`)
      let coins: any[] = []

      if (cgRes.ok) {
        const data = await cgRes.json()
        const ids = (data.coins || []).slice(0, 20).map((c: any) => c.id).join(',')
        if (ids) {
          const mkRes = await fetch(`${CG_BASE}/coins/markets?vs_currency=usd&ids=${ids}&sparkline=true&price_change_percentage=1h,24h,7d`)
          if (mkRes.ok) {
            coins = await mkRes.json()
          }
        }
      }

      // Also search DexScreener
      const dexRes = await fetch(`${DEX_BASE}/latest/dex/search?q=${encodeURIComponent(query)}`)
      if (dexRes.ok) {
        const dexData = await dexRes.json()
        const dexCoins = (dexData.pairs || []).slice(0, 20).map((p: any) => ({
          id: p.baseToken?.address,
          symbol: p.baseToken?.symbol,
          name: p.baseToken?.name,
          image: null,
          current_price: parseFloat(p.priceUsd || '0'),
          market_cap: p.marketCap || p.fdv || 0,
          total_volume: p.volume?.h24 || 0,
          price_change_percentage_24h: p.priceChange?.h24 || 0,
          chain: p.chainId,
          dex_url: p.url,
          is_dex: true,
        }))
        coins = [...coins, ...dexCoins]
      }

      return NextResponse.json({ coins, source: 'mixed', view })
    }

    return NextResponse.json({ coins: [], source: 'none' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ coins: [], error: 'Server error' }, { status: 500 })
  }
}
