'use client'

import { useState, useEffect, useCallback } from 'react'
import TopBar from '@/components/layout/TopBar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { formatBigNumber } from '@/lib/formatters'

interface Exchange {
  id: string
  name: string
  image: string
  year_established: number | null
  country: string | null
  url: string
  trust_score: number
  trust_score_rank: number
  trade_volume_24h_btc: number
  trade_volume_24h_btc_normalized: number
  has_trading_incentive: boolean
}

function TrustBadge({ score }: { score: number }) {
  if (score >= 8) return <span className="pill bg-[--green]/15 text-[--green] text-[10px]">{score}/10</span>
  if (score >= 5) return <span className="pill bg-[--accent-muted] text-[--accent] text-[10px]">{score}/10</span>
  return <span className="pill bg-[--red]/15 text-[--red] text-[10px]">{score}/10</span>
}

export default function ExchangesPage() {
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const fetchExchanges = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/exchanges?page=${page}&per_page=100`)
      const data = await res.json()
      setExchanges(data.exchanges || [])
    } catch {
      setExchanges([])
    }
    setLoading(false)
  }, [page])

  useEffect(() => {
    fetchExchanges()
  }, [fetchExchanges])

  const filtered = search
    ? exchanges.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        (e.country && e.country.toLowerCase().includes(search.toLowerCase()))
      )
    : exchanges

  function formatVolume(btcVol: number): string {
    const usdEst = btcVol * 97000
    return formatBigNumber(usdEst)
  }

  return (
    <>
      <TopBar />
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        <h1 className="font-heading text-2xl mb-6">Top Cryptocurrency Exchanges</h1>

        {/* Search */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search exchanges..."
            className="px-3 py-1.5 text-sm rounded-lg border border-[--border] bg-[--bg-secondary] text-[--text-primary] placeholder-[--text-muted] focus:outline-none focus:border-[--accent] w-64"
          />
          {search && (
            <button onClick={() => setSearch('')} className="btn text-xs">Clear</button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner" /></div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[--text-muted] text-xs border-b border-[#2E2D2F] dark:border-[#2E2D2F]">
                    <th className="text-left py-3 px-2 w-10">#</th>
                    <th className="text-left py-3 px-2">Exchange</th>
                    <th className="text-center py-3 px-2">Trust Score</th>
                    <th className="text-right py-3 px-2">Volume 24h (est.)</th>
                    <th className="text-right py-3 px-2">Vol. Normalized</th>
                    <th className="text-left py-3 px-2">Country</th>
                    <th className="text-center py-3 px-2">Year</th>
                    <th className="text-center py-3 px-2">Visit</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ex) => (
                    <tr key={ex.id} className="coin-row border-b border-[#2E2D2F] dark:border-[#2E2D2F]">
                      <td className="py-3 px-2 text-[--text-muted]">{ex.trust_score_rank}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          {ex.image && <img src={ex.image} alt="" className="w-6 h-6 rounded-full" />}
                          <span className="font-medium">{ex.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <TrustBadge score={ex.trust_score} />
                      </td>
                      <td className="py-3 px-2 text-right mono text-xs">{formatVolume(ex.trade_volume_24h_btc)}</td>
                      <td className="py-3 px-2 text-right mono text-xs">{formatVolume(ex.trade_volume_24h_btc_normalized)}</td>
                      <td className="py-3 px-2 text-[--text-secondary] text-xs">{ex.country || '—'}</td>
                      <td className="py-3 px-2 text-center text-[--text-muted] text-xs">{ex.year_established || '—'}</td>
                      <td className="py-3 px-2 text-center">
                        <a
                          href={ex.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[--accent] hover:underline text-xs"
                          onClick={e => e.stopPropagation()}
                        >
                          Visit →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-2">
              {filtered.map(ex => (
                <div key={ex.id} className="flex items-center gap-3 bg-[--bg-secondary] border border-[--border] rounded-xl p-3">
                  <span className="text-xs text-[--text-muted] w-5">{ex.trust_score_rank}</span>
                  {ex.image && <img src={ex.image} alt="" className="w-8 h-8 rounded-full" />}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{ex.name}</div>
                    <div className="text-xs text-[--text-muted]">{ex.country || 'Unknown'}</div>
                  </div>
                  <div className="text-right">
                    <TrustBadge score={ex.trust_score} />
                    <div className="mono text-xs mt-1">{formatVolume(ex.trade_volume_24h_btc)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {!search && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn disabled:opacity-40"
                >
                  &larr; Previous
                </button>
                <span className="mono text-sm text-[--text-muted]">Page {page}</span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={exchanges.length < 100}
                  className="btn disabled:opacity-40"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
