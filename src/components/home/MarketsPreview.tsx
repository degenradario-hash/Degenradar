'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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

const PER_PAGE = 100
const TOTAL_PAGES = 10 // ~1000 coins max

export default function MarketsPreview() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const tableRef = useRef<HTMLDivElement>(null)

  const fetchPage = useCallback((page: number) => {
    setLoading(true)
    fetch(`/api/tokens?view=top&per_page=${PER_PAGE}&page=${page}`)
      .then(r => r.json())
      .then(data => {
        setCoins(data.coins || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchPage(1)
  }, [fetchPage])

  const handlePageChange = (page: number) => {
    if (page < 1 || page > TOTAL_PAGES || page === currentPage) return
    setCurrentPage(page)
    fetchPage(page)
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Build page numbers to display
  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = []
    if (TOTAL_PAGES <= 7) {
      for (let i = 1; i <= TOTAL_PAGES; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(TOTAL_PAGES - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < TOTAL_PAGES - 2) pages.push('...')
      pages.push(TOTAL_PAGES)
    }
    return pages
  }

  const rangeStart = (currentPage - 1) * PER_PAGE + 1
  const rangeEnd = rangeStart + coins.length - 1

  return (
    <section className="py-12" ref={tableRef}>
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
                  <tr className="text-[--text-muted] text-xs border-b border-[--border]">
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
                        className="coin-row border-b border-[--border] hover:cursor-pointer"
                        onClick={() => window.location.href = `/token/${coin.id}`}
                      >
                        <td className="py-3 px-2 text-[--text-muted]">{coin.market_cap_rank || (currentPage - 1) * PER_PAGE + i + 1}</td>
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
                    <span className="text-xs text-[--text-muted] w-5">{coin.market_cap_rank || (currentPage - 1) * PER_PAGE + i + 1}</span>
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

            {/* Pagination controls */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="min-w-[40px] h-[40px] rounded-lg text-sm font-mono border border-[--border] flex items-center justify-center transition-colors hover:border-[--accent] disabled:opacity-30 disabled:hover:border-[--border] disabled:cursor-not-allowed"
                >
                  &laquo;
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((page, idx) =>
                  page === '...' ? (
                    <span key={`dots-${idx}`} className="min-w-[40px] h-[40px] flex items-center justify-center text-[--text-muted] text-sm font-mono">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[40px] h-[40px] rounded-lg text-sm font-mono border flex items-center justify-center transition-colors ${
                        page === currentPage
                          ? 'bg-[#FFFF00] text-black font-bold border-[#FFFF00]'
                          : 'border-[--border] hover:border-[--accent]'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === TOTAL_PAGES}
                  className="min-w-[40px] h-[40px] rounded-lg text-sm font-mono border border-[--border] flex items-center justify-center transition-colors hover:border-[--accent] disabled:opacity-30 disabled:hover:border-[--border] disabled:cursor-not-allowed"
                >
                  &raquo;
                </button>
              </div>

              <span className="text-xs text-[--text-muted] font-mono">
                Showing {rangeStart}-{rangeEnd} of {TOTAL_PAGES * PER_PAGE}+ coins
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
