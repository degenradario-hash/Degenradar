'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import TopBar from '@/components/layout/TopBar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SafetyRing from '@/components/SafetyRing'
import { formatPrice, formatBigNumber, formatPercent, formatAge } from '@/lib/formatters'
import { getChainName, getChainColor } from '@/lib/dexscreener'

const CHAINS = [
  { id: 'all', label: 'All Chains', icon: '◆' },
  { id: 'solana', label: 'Solana', icon: '◎' },
  { id: 'ethereum', label: 'Ethereum', icon: '⬡' },
  { id: 'base', label: 'Base', icon: '▣' },
  { id: 'bsc', label: 'BSC', icon: '◈' },
  { id: 'arbitrum', label: 'Arbitrum', icon: '△' },
]

interface DexToken {
  chainId: string
  pairAddress: string
  baseToken: { address: string; name: string; symbol: string }
  quoteToken: { address: string; name: string; symbol: string }
  priceUsd: string
  priceChange: { m5: number; h1: number; h6: number; h24: number }
  volume: { m5: number; h1: number; h6: number; h24: number }
  txns: { m5: { buys: number; sells: number }; h1: { buys: number; sells: number }; h24: { buys: number; sells: number } }
  liquidity?: { usd: number }
  marketCap?: number
  fdv?: number
  pairCreatedAt?: number
  url: string
  safetyScore: { score: number; flags: string[] }
}

function ChainBadge({ chainId }: { chainId: string }) {
  const color = getChainColor(chainId)
  return (
    <span
      className="pill text-[10px] border"
      style={{ borderColor: `${color}50`, color, background: `${color}12` }}
    >
      {getChainName(chainId)}
    </span>
  )
}

export default function DexScanPage() {
  const [tokens, setTokens] = useState<DexToken[]>([])
  const [loading, setLoading] = useState(true)
  const [chain, setChain] = useState('all')
  const [search, setSearch] = useState('')

  const fetchTokens = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (chain !== 'all') params.set('chain', chain)
      if (search) params.set('q', search)
      const res = await fetch(`/api/dex?${params}`)
      const data = await res.json()
      setTokens(data.tokens || [])
    } catch {
      setTokens([])
    }
    setLoading(false)
  }, [chain, search])

  useEffect(() => {
    fetchTokens()
    const interval = setInterval(fetchTokens, 30000)
    return () => clearInterval(interval)
  }, [fetchTokens])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTokens()
  }

  return (
    <>
      <TopBar />
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        <h1 className="font-heading font-bold text-2xl mb-6">DexScan — Memecoin Screener</h1>

        {/* Chain filter + search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex gap-1.5 flex-wrap">
            {CHAINS.map(c => {
              const isActive = chain === c.id
              const chainColor = c.id !== 'all' ? getChainColor(c.id) : undefined
              return (
                <button
                  key={c.id}
                  onClick={() => setChain(c.id)}
                  className={`tab text-xs ${isActive ? 'tab-active' : 'text-[--text-secondary]'}`}
                  style={isActive && chainColor ? { background: chainColor, color: '#000' } : undefined}
                >
                  {c.icon} {c.label}
                </button>
              )
            })}
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search token or address..."
              className="px-3 py-1.5 text-sm rounded-lg border border-[--border] bg-[--bg-secondary] text-[--text-primary] placeholder-[--text-muted] focus:outline-none focus:border-[--accent] w-56"
            />
            {search && <button type="button" onClick={() => setSearch('')} className="btn text-xs">Clear</button>}
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner" /></div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-20 text-[--text-muted]">No tokens found</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[--text-muted] text-xs border-b border-[#2E2D2F] dark:border-[#2E2D2F]">
                    <th className="text-left py-3 px-2 w-8">#</th>
                    <th className="text-left py-3 px-2">Token</th>
                    <th className="text-left py-3 px-2">Chain</th>
                    <th className="text-right py-3 px-2">Price</th>
                    <th className="text-right py-3 px-2">5m %</th>
                    <th className="text-right py-3 px-2">1h %</th>
                    <th className="text-right py-3 px-2">24h %</th>
                    <th className="text-right py-3 px-2">Vol 24h</th>
                    <th className="text-right py-3 px-2">Liquidity</th>
                    <th className="text-right py-3 px-2">MCap</th>
                    <th className="text-center py-3 px-2">Txns</th>
                    <th className="text-right py-3 px-2">Age</th>
                    <th className="text-center py-3 px-2">Safety</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((token, i) => {
                    const p5m = formatPercent(token.priceChange?.m5)
                    const p1h = formatPercent(token.priceChange?.h1)
                    const p24h = formatPercent(token.priceChange?.h24)
                    const buys = token.txns?.h24?.buys || 0
                    const sells = token.txns?.h24?.sells || 0
                    return (
                      <tr
                        key={`${token.chainId}-${token.pairAddress}`}
                        className="coin-row border-b border-[#2E2D2F] dark:border-[#2E2D2F] cursor-pointer"
                        onClick={() => window.location.href = `/token/${token.baseToken?.address}?chain=${token.chainId}`}
                      >
                        <td className="py-3 px-2 text-[--text-muted]">{i + 1}</td>
                        <td className="py-3 px-2">
                          <div className="font-medium">{token.baseToken?.name || '?'}</div>
                          <div className="text-[--text-muted] text-xs">{token.baseToken?.symbol}</div>
                        </td>
                        <td className="py-3 px-2"><ChainBadge chainId={token.chainId} /></td>
                        <td className="py-3 px-2 text-right mono">{formatPrice(parseFloat(token.priceUsd || '0'))}</td>
                        <td className={`py-3 px-2 text-right mono text-xs ${p5m.isPositive ? 'text-[--green]' : p5m.isNegative ? 'text-[--red]' : 'text-[--text-muted]'}`}>{p5m.text}</td>
                        <td className={`py-3 px-2 text-right mono text-xs ${p1h.isPositive ? 'text-[--green]' : p1h.isNegative ? 'text-[--red]' : 'text-[--text-muted]'}`}>{p1h.text}</td>
                        <td className={`py-3 px-2 text-right mono text-xs ${p24h.isPositive ? 'text-[--green]' : p24h.isNegative ? 'text-[--red]' : 'text-[--text-muted]'}`}>{p24h.text}</td>
                        <td className="py-3 px-2 text-right mono text-xs">{formatBigNumber(token.volume?.h24)}</td>
                        <td className="py-3 px-2 text-right mono text-xs">{formatBigNumber(token.liquidity?.usd)}</td>
                        <td className="py-3 px-2 text-right mono text-xs">{formatBigNumber(token.marketCap || token.fdv)}</td>
                        <td className="py-3 px-2 text-center">
                          <span className="text-[--green] text-xs">{buys}</span>
                          <span className="text-[--text-muted] text-xs"> / </span>
                          <span className="text-[--red] text-xs">{sells}</span>
                        </td>
                        <td className="py-3 px-2 text-right mono text-xs">{formatAge(token.pairCreatedAt)}</td>
                        <td className="py-3 px-2 text-center"><SafetyRing score={token.safetyScore?.score ?? 0} size="sm" /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-2">
              {tokens.map((token, i) => {
                const p24h = formatPercent(token.priceChange?.h24)
                return (
                  <Link
                    key={`${token.chainId}-${token.pairAddress}`}
                    href={`/token/${token.baseToken?.address}?chain=${token.chainId}`}
                    className="flex items-center gap-3 bg-[--bg-secondary] border border-[--border] rounded-xl p-3"
                  >
                    <span className="text-xs text-[--text-muted] w-5">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{token.baseToken?.name}</span>
                        <ChainBadge chainId={token.chainId} />
                      </div>
                      <div className="text-xs text-[--text-muted]">{token.baseToken?.symbol}</div>
                    </div>
                    <div className="text-right mr-2">
                      <div className="mono text-sm">{formatPrice(parseFloat(token.priceUsd || '0'))}</div>
                      <div className={`mono text-xs ${p24h.isPositive ? 'text-[--green]' : p24h.isNegative ? 'text-[--red]' : 'text-[--text-muted]'}`}>{p24h.text}</div>
                    </div>
                    <SafetyRing score={token.safetyScore?.score ?? 0} size="sm" />
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
