'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatPrice, formatBigNumber, formatPercent } from '@/lib/formatters'
import Sparkline from '@/components/Sparkline'

interface Coin {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  market_cap: number
  total_volume: number
  price_change_percentage_24h: number
  price_change_percentage_1h_in_currency: number
  price_change_percentage_7d_in_currency: number
  sparkline_in_7d?: { price: number[] }
  market_cap_rank: number
}

export default function MarketsPreview() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tokens?view=top&per_page=20&page=1')
      .then(r => r.json())
      .then(data => {
        setCoins((data.coins || []).slice(0, 20))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-xl lg:text-2xl">
            Cryptocurrency Prices by Market Cap
          </h2>
          <Link
            href="/markets"
            className="text-sm accent-link font-medium transition-colors"
          >
            View All Markets &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="spinner" />
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto table-container">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[--text-muted] text-xs border-b border-[#2E2D2F] dark:border-[#2E2D2F]">
                    <th className="text-left py-3 px-2 w-10">#</th>
                    <th className="text-left py-3 px-2 w-[180px]">Coin</th>
                    <th className="text-right py-3 px-1">Price</th>
                    <th className="text-right py-3 px-2">1h %</th>
                    <th className="text-right py-3 px-2">24h %</th>
                    <th className="text-right py-3 px-2">7d %</th>
                    <th className="text-right py-3 px-2">Volume 24h</th>
                    <th className="text-right py-3 px-2">Market Cap</th>
                    <th className="text-right py-3 px-2 w-[110px]">Last 7 Days</th>
                  </tr>
                </thead>
                <tbody>
                  {coins.map((coin, i) => {
                    const p1h = formatPercent(coin.price_change_percentage_1h_in_currency)
                    const p24h = formatPercent(coin.price_change_percentage_24h)
                    const p7d = formatPercent(coin.price_change_percentage_7d_in_currency)
                    return (
                      <tr
                        key={coin.id}
                        className="coin-row border-b border-[#2E2D2F] dark:border-[#2E2D2F] hover:cursor-pointer"
                        onClick={() => window.location.href = `/token/${coin.id}`}
                      >
                        <td className="py-3 px-2 text-[--text-muted]">{coin.market_cap_rank || i + 1}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            {coin.image && (
                              <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                            )}
                            <span className="font-medium">{coin.name}</span>
                            <span className="text-[--text-muted] text-xs uppercase">{coin.symbol}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-right mono">{formatPrice(coin.current_price)}</td>
                        <td className={`py-3 px-2 text-right mono text-xs ${p1h.isPositive ? 'text-[--green]' : p1h.isNegative ? 'text-[--red]' : 'text-[--text-muted]'}`}>{p1h.text}</td>
                        <td className={`py-3 px-2 text-right mono text-xs ${p24h.isPositive ? 'text-[--green]' : p24h.isNegative ? 'text-[--red]' : 'text-[--text-muted]'}`}>{p24h.text}</td>
                        <td className={`py-3 px-2 text-right mono text-xs ${p7d.isPositive ? 'text-[--green]' : p7d.isNegative ? 'text-[--red]' : 'text-[--text-muted]'}`}>{p7d.text}</td>
                        <td className="py-3 px-2 text-right mono text-xs">{formatBigNumber(coin.total_volume)}</td>
                        <td className="py-3 px-2 text-right mono text-xs">{formatBigNumber(coin.market_cap)}</td>
                        <td className="py-3 px-2 text-right">
                          {coin.sparkline_in_7d?.price ? (
                            <Sparkline data={coin.sparkline_in_7d.price} />
                          ) : (
                            <div className="w-[100px] h-[32px]" />
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-2">
              {coins.map((coin, i) => {
                const p24h = formatPercent(coin.price_change_percentage_24h)
                return (
                  <Link
                    key={coin.id}
                    href={`/token/${coin.id}`}
                    className="flex items-center gap-3 bg-[--bg-secondary] border border-[--border] rounded-xl p-3"
                  >
                    <span className="text-xs text-[--text-muted] w-5">{coin.market_cap_rank || i + 1}</span>
                    {coin.image && <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{coin.name}</div>
                      <div className="text-xs text-[--text-muted] uppercase">{coin.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="mono text-sm">{formatPrice(coin.current_price)}</div>
                      <div className={`mono text-xs ${p24h.isPositive ? 'text-[--green]' : p24h.isNegative ? 'text-[--red]' : 'text-[--text-muted]'}`}>{p24h.text}</div>
                    </div>
                    {coin.sparkline_in_7d?.price && (
                      <Sparkline data={coin.sparkline_in_7d.price} width={60} height={24} />
                    )}
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
