'use client'

import { useState, useEffect } from 'react'
import { formatBigNumber, formatPercent } from '@/lib/formatters'
import FearGreedGauge from '@/components/FearGreedGauge'

interface GlobalData {
  total_market_cap: number
  total_volume: number
  market_cap_change_24h: number
  btc_dominance: number
  eth_dominance: number
  active_coins: number
}

interface TrendingCoin {
  id: string
  name: string
  symbol: string
  thumb?: string
  image?: string
  price_btc?: number
  market_cap_rank?: number
}

interface GainerCoin {
  id: string
  name: string
  symbol: string
  image: string
  price_change_percentage_24h: number
  current_price: number
}

const MAIN_CARDS = [
  { key: 'market_cap', label: 'Market Cap', icon: '💎' },
  { key: 'volume', label: '24h Volume', icon: '📊' },
  { key: 'btc_dom', label: 'BTC Dominance', icon: '₿' },
  { key: 'active', label: 'Active Coins', icon: '🪙' },
] as const

export default function MarketOverviewCards() {
  const [data, setData] = useState<GlobalData | null>(null)
  const [fearGreed, setFearGreed] = useState<{ value: number; classification: string } | null>(null)
  const [trending, setTrending] = useState<TrendingCoin[]>([])
  const [gainers, setGainers] = useState<GainerCoin[]>([])

  useEffect(() => {
    fetch('/api/global')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})

    fetch('https://api.alternative.me/fng/?limit=1')
      .then(r => r.json())
      .then(res => {
        if (res?.data?.[0]) {
          setFearGreed({
            value: parseInt(res.data[0].value),
            classification: res.data[0].value_classification,
          })
        }
      })
      .catch(() => {})

    fetch('/api/tokens?view=trending&per_page=5')
      .then(r => r.json())
      .then(res => {
        if (res?.coins) setTrending(res.coins.slice(0, 5))
      })
      .catch(() => {})

    fetch('/api/tokens?view=gainers&per_page=5')
      .then(r => r.json())
      .then(res => {
        if (res?.coins) setGainers(res.coins.slice(0, 5))
      })
      .catch(() => {})
  }, [])

  function getValue(key: string): string {
    if (!data) return '—'
    switch (key) {
      case 'market_cap': return formatBigNumber(data.total_market_cap)
      case 'volume': return formatBigNumber(data.total_volume)
      case 'btc_dom': return `${data.btc_dominance.toFixed(1)}%`
      case 'active': return data.active_coins.toLocaleString()
      default: return '—'
    }
  }

  function getSubtext(key: string): { text: string; positive: boolean } | null {
    if (!data) return null
    if (key === 'market_cap') {
      const v = data.market_cap_change_24h
      return { text: `${v >= 0 ? '+' : ''}${v.toFixed(1)}% (24h)`, positive: v >= 0 }
    }
    return null
  }

  function getFearGreedColor(value: number): string {
    if (value <= 25) return 'text-[--red]'
    if (value <= 45) return 'text-orange-400'
    if (value <= 55) return 'text-[--text-primary]'
    return 'text-[--green]'
  }

  return (
    <section className="py-6">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Row 1: Main market stats — centered content */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {MAIN_CARDS.map(card => {
            const sub = getSubtext(card.key)
            return (
              <div
                key={card.key}
                className="bg-[--bg-secondary] border border-[--border] rounded-xl p-4 hover:border-[--border-hover] transition-colors text-center"
              >
                <span className="text-2xl block mb-1">{card.icon}</span>
                <span className="text-xs text-[--text-muted] font-medium uppercase tracking-wide block mb-1">
                  {card.label}
                </span>
                <div className="mono text-xl lg:text-2xl font-bold">{getValue(card.key)}</div>
                {sub && (
                  <span className={`mono text-xs ${sub.positive ? 'text-[--green]' : 'text-[--red]'}`}>
                    {sub.text}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Row 2: Fear & Greed, Trending, Top Gainers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Fear & Greed Index with gauge */}
          <div className="bg-[--bg-secondary] border border-[--border] rounded-xl p-4 hover:border-[--border-hover] transition-colors text-center flex flex-col items-center justify-center">
            <span className="text-xs text-[--text-muted] font-medium uppercase tracking-wide block mb-2">
              Fear & Greed Index
            </span>
            {fearGreed ? (
              <FearGreedGauge value={fearGreed.value} classification={fearGreed.classification} />
            ) : (
              <div className="mono text-3xl font-bold text-[--text-muted] py-4">—</div>
            )}
          </div>

          {/* Trending Coins */}
          <div className="bg-[--bg-secondary] border border-[--border] rounded-xl p-4 hover:border-[--border-hover] transition-colors">
            <div className="text-center mb-3">
              <span className="text-2xl block mb-1">🔥</span>
              <span className="text-xs text-[--text-muted] font-medium uppercase tracking-wide">
                Trending Coins
              </span>
            </div>
            <div className="space-y-1.5">
              {trending.length > 0 ? trending.map((coin, i) => (
                <div key={coin.id || i} className="flex items-center gap-2 text-sm">
                  <span className="text-[--text-muted] text-xs w-4">{i + 1}</span>
                  {(coin.thumb || coin.image) && (
                    <img src={coin.thumb || coin.image} alt="" className="w-5 h-5 rounded-full" />
                  )}
                  <span className="font-medium truncate flex-1">{coin.name}</span>
                  <span className="text-[--text-muted] text-xs uppercase">{coin.symbol}</span>
                </div>
              )) : (
                <div className="text-center text-[--text-muted] text-sm py-2">Loading...</div>
              )}
            </div>
          </div>

          {/* Top Gainers */}
          <div className="bg-[--bg-secondary] border border-[--border] rounded-xl p-4 hover:border-[--border-hover] transition-colors">
            <div className="text-center mb-3">
              <span className="text-2xl block mb-1">🚀</span>
              <span className="text-xs text-[--text-muted] font-medium uppercase tracking-wide">
                Top Gainers 24h
              </span>
            </div>
            <div className="space-y-1.5">
              {gainers.length > 0 ? gainers.map((coin, i) => {
                const pct = formatPercent(coin.price_change_percentage_24h)
                return (
                  <div key={coin.id || i} className="flex items-center gap-2 text-sm">
                    <span className="text-[--text-muted] text-xs w-4">{i + 1}</span>
                    {coin.image && <img src={coin.image} alt="" className="w-5 h-5 rounded-full" />}
                    <span className="font-medium truncate flex-1">{coin.name}</span>
                    <span className={`mono text-xs ${pct.isPositive ? 'text-[--green]' : 'text-[--red]'}`}>
                      {pct.text}
                    </span>
                  </div>
                )
              }) : (
                <div className="text-center text-[--text-muted] text-sm py-2">Loading...</div>
              )}
            </div>
          </div>
        </div>

        {/* Yellow accent divider */}
        <div className="w-full h-2 bg-[#FFFF00] mt-8 mb-0 rounded-full opacity-80" />
      </div>
    </section>
  )
}
