'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import TopBar from '@/components/layout/TopBar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Sparkline from '@/components/Sparkline'
import { formatPrice, formatBigNumber, formatPercent } from '@/lib/formatters'

type View = 'top' | 'trending' | 'gainers' | 'losers'
type SortKey = 'market_cap_rank' | 'current_price' | 'price_change_percentage_1h_in_currency' | 'price_change_percentage_24h' | 'price_change_percentage_7d_in_currency' | 'total_volume' | 'market_cap'

const TABS: { key: View; label: string }[] = [
  { key: 'top', label: 'Top' },
  { key: 'trending', label: 'Trending' },
  { key: 'gainers', label: 'Gainers' },
  { key: 'losers', label: 'Losers' },
]

const PER_PAGE = 100
const MAX_PAGES = 50

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

function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  if (!active) return <span className="text-[--text-muted] ml-0.5">↕</span>
  return <span className="text-[--accent] ml-0.5">{dir === 'asc' ? '↑' : '↓'}</span>
}

/* ═══ Pagination Component ═══ */
function Pagination({ page, setPage, hasMore }: { page: number; setPage: (p: number) => void; hasMore: boolean }) {
  const getPageNumbers = (): (number | 'dots')[] => {
    const pages: (number | 'dots')[] = []
    // Always show first page
    pages.push(1)
    // Dots before current range
    if (page > 3) pages.push('dots')
    // Pages around current
    for (let i = Math.max(2, page - 1); i <= Math.min(MAX_PAGES, page + 1); i++) {
      pages.push(i)
    }
    // Dots after current range
    if (page < MAX_PAGES - 2) pages.push('dots')
    // Always show last page
    if (MAX_PAGES > 1 && !pages.includes(MAX_PAGES)) pages.push(MAX_PAGES)
    return pages
  }

  const goTo = (p: number) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 mb-4 flex-wrap">
      <button
        onClick={() => goTo(Math.max(1, page - 1))}
        disabled={page === 1}
        className="btn disabled:opacity-30 text-sm"
      >
        ← Previous
      </button>

      {getPageNumbers().map((p, i) =>
        p === 'dots' ? (
          <span key={`dots-${i}`} className="px-2 text-[--text-muted] mono text-sm select-none">…</span>
        ) : (
          <button
            key={`page-${p}`}
            onClick={() => goTo(p)}
            className={`min-w-[36px] h-9 rounded-lg text-sm font-semibold mono transition-colors ${
              page === p
                ? 'bg-[--accent] text-black'
                : 'bg-[--bg-secondary] border border-[--border] text-[--text-primary] hover:border-[--accent] hover:text-[--accent]'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goTo(page + 1)}
        disabled={!hasMore}
        className="btn disabled:opacity-30 text-sm"
      >
        Next →
      </button>
    </div>
  )
}

export default function MarketsPage() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('top')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>('market_cap_rank')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [search, setSearch] = useState('')

  const fetchCoins = useCallback(async () => {
    setLoading(true)
    try {
      const url = search
        ? `/api/tokens?view=search&q=${encodeURIComponent(search)}`
        : `/api/tokens?view=${view}&page=${page}&per_page=${PER_PAGE}`
      const res = await fetch(url)
      const data = await res.json()
      setCoins(data.coins || [])
    } catch {
      setCoins([])
    }
    setLoading(false)
  }, [view, page, search])

  useEffect(() => {
    fetchCoins()
    const interval = setInterval(fetchCoins, 60000)
    return () => clearInterval(interval)
  }, [fetchCoins])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'market_cap_rank' ? 'asc' : 'desc')
    }
  }

  const sorted = [...coins].sort((a: any, b: any) => {
    const av = a[sortKey] ?? 0
    const bv = b[sortKey] ?? 0
    return sortDir === 'asc' ? av - bv : bv - av
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCoins()
  }

  const hasMorePages = coins.length >= PER_PAGE

  return (
    <>
      <TopBar />
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        <h1 className="font-heading font-bold text-2xl mb-6">Cryptocurrency Prices by Market Cap</h1>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex gap-1.5 flex-wrap">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => { setView(tab.key); setPage(1); setSearch('') }}
                className={view === tab.key && !search ? 'tab tab-active' : 'tab text-[--text-secondary]'}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search coins..."
              className="px-3 py-1.5 text-sm rounded-lg border border-[--border] bg-[--bg-secondary] text-[--text-primary] placeholder-[--text-muted] focus:outline-none focus:border-[--accent] w-48"
            />
            {search && (
              <button type="button" onClick={() => { setSearch(''); }} className="btn text-xs">Clear</button>
            )}
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner" /></div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto table-container">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[--text-muted] text-xs border-b border-[--border]">
                    <th className="text-left py-3 px-2 w-10 sort-header" onClick={() => handleSort('market_cap_rank')}># <SortIcon active={sortKey === 'market_cap_rank'} dir={sortDir} /></th>
                    <th className="text-left py-3 px-2 w-[180px]">Coin</th>
                    <th className="text-right py-3 px-1 sort-header" onClick={() => handleSort('current_price')}>Price <SortIcon active={sortKey === 'current_price'} dir={sortDir} /></th>
                    <th className="text-right py-3 px-2 sort-header" onClick={() => handleSort('price_change_percentage_1h_in_currency')}>1h % <SortIcon active={sortKey === 'price_change_percentage_1h_in_currency'} dir={sortDir} /></th>
                    <th className="text-right py-3 px-2 sort-header" onClick={() => handleSort('price_change_percentage_24h')}>24h % <SortIcon active={sortKey === 'price_change_percentage_24h'} dir={sortDir} /></th>
                    <th className="text-right py-3 px-2 sort-header" onClick={() => handleSort('price_change_percentage_7d_in_currency')}>7d % <SortIcon active={sortKey === 'price_change_percentage_7d_in_currency'} dir={sortDir} /></th>
                    <th className="text-right py-3 px-2 sort-header" onClick={() => handleSort('total_volume')}>Volume 24h <SortIcon active={sortKey === 'total_volume'} dir={sortDir} /></th>
                    <th className="text-right py-3 px-2 sort-header" onClick={() => handleSort('market_cap')}>Market Cap <SortIcon active={sortKey === 'market_cap'} dir={sortDir} /></th>
                    <th className="text-right py-3 px-2 w-[110px]">Last 7 Days</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((coin, i) => {
                    const p1h = formatPercent(coin.price_change_percentage_1h_in_currency)
                    const p24h = formatPercent(coin.price_change_percentage_24h)
                    const p7d = formatPercent(coin.price_change_percentage_7d_in_currency)
                    return (
                      <tr key={coin.id} className="coin-row border-b border-[--border] cursor-pointer" onClick={() => window.location.href = `/token/${coin.id}`}>
                        <td className="py-3 px-2 text-[--text-muted]">{coin.market_cap_rank || (page - 1) * PER_PAGE + i + 1}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            {coin.image && <img src={coin.image} alt="" className="w-6 h-6 rounded-full" />}
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
                        <td className="py-3 px-2 text-right">{coin.sparkline_in_7d?.price ? <Sparkline data={coin.sparkline_in_7d.price} /> : <div className="w-[100px] h-[32px]" />}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-2">
              {sorted.map((coin, i) => {
                const p24h = formatPercent(coin.price_change_percentage_24h)
                return (
                  <Link key={coin.id} href={`/token/${coin.id}`} className="flex items-center gap-3 bg-[--bg-secondary] border border-[--border] rounded-xl p-3">
                    <span className="text-xs text-[--text-muted] w-5">{coin.market_cap_rank || (page - 1) * PER_PAGE + i + 1}</span>
                    {coin.image && <img src={coin.image} alt="" className="w-8 h-8 rounded-full" />}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{coin.name}</div>
                      <div className="text-xs text-[--text-muted] uppercase">{coin.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="mono text-sm">{formatPrice(coin.current_price)}</div>
                      <div className={`mono text-xs ${p24h.isPositive ? 'text-[--green]' : p24h.isNegative ? 'text-[--red]' : 'text-[--text-muted]'}`}>{p24h.text}</div>
                    </div>
                    {coin.sparkline_in_7d?.price && <Sparkline data={coin.sparkline_in_7d.price} width={60} height={24} />}
                  </Link>
                )
              })}
            </div>

            {/* ═══ PAGINATION ═══ */}
            {view === 'top' && !search && (
              <Pagination page={page} setPage={setPage} hasMore={hasMorePages} />
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
