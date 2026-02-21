import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/global', {
      next: { revalidate: 120 },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Rate limited' },
        { status: 429 }
      )
    }

    const data = await res.json()
    const g = data.data

    return NextResponse.json({
      total_market_cap: g.total_market_cap?.usd || 0,
      total_volume: g.total_volume?.usd || 0,
      market_cap_change_24h: g.market_cap_change_percentage_24h_usd || 0,
      btc_dominance: g.market_cap_percentage?.btc || 0,
      eth_dominance: g.market_cap_percentage?.eth || 0,
      active_coins: g.active_cryptocurrencies || 0,
    })
  } catch (error) {
    console.error('Global API error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
