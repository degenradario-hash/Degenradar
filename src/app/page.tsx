'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import ChainFilter from '@/components/ChainFilter'
import TokenTable from '@/components/TokenTable'

export default function Home() {
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [chain, setChain] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchTokens = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      if (chain !== 'all') params.set('chain', chain)
      const res = await fetch(`/api/tokens?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setTokens(data.pairs || [])
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }, [chain, searchQuery])

  useEffect(() => { setLoading(true); fetchTokens() }, [fetchTokens])
  useEffect(() => {
    const interval = setInterval(fetchTokens, 30000)
    return () => clearInterval(interval)
  }, [fetchTokens])

  return (
    <main className="min-h-screen bg-[#050508]">
      <Header onSearch={(q) => { setSearchQuery(q); setLoading(true) }} />

      {/* Hero section with grid background */}
      <div className="relative border-b border-[#1A1A28] overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 grid-bg" />
        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#00FF7F] opacity-[0.03] blur-[100px] rounded-full" />

        <div className="relative max-w-[1440px] mx-auto px-5 py-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold font-['Chakra_Petch'] text-white tracking-tight">
                  MEMECOIN <span className="text-[#00FF7F] glow-text">RADAR</span>
                </h2>
                <span className="pill bg-[#00FF7F12] text-[#00FF7F] border border-[#00FF7F33]">
                  <div className="live-dot mr-0.5" /> LIVE
                </span>
              </div>
              <p className="text-[#5A5A72] text-sm font-['Outfit'] max-w-lg">
                Real-time token intelligence with on-chain Safety Scoring.
                Click any row to deep-dive on DexScreener.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => { setLoading(true); fetchTokens() }}
                className="btn-ghost flex items-center gap-2 text-xs font-['Space_Mono']"
              >
                <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                REFRESH
              </button>
              <span className="text-[10px] text-[#3A3A52] font-['Space_Mono']">
                {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-5 py-5">
        {/* Controls row */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <ChainFilter selected={chain} onChange={(c) => { setChain(c); setLoading(true) }} />
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[10px] text-[#3A3A52] font-['Space_Mono']">
              {tokens.length} tokens
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0C0C14] border border-[#1A1A28]">
              <div className="live-dot" />
              <span className="text-[10px] text-[#5A5A72] font-['Space_Mono']">
                Auto-refresh 30s
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0C0C14] border border-[#1A1A28] rounded-2xl overflow-hidden glow-border">
          <TokenTable tokens={tokens} loading={loading} />
        </div>

        {/* Stats strip */}
        <div className="mt-4 flex items-center justify-between text-[10px] font-['Space_Mono'] text-[#3A3A52] px-2">
          <div className="flex items-center gap-4">
            <span>DATA: DexScreener API</span>
            <span>SAFETY: On-chain analysis</span>
            <span>BUNDLE DETECTOR: Coming soon</span>
          </div>
          <span>degenradar.io © 2026</span>
        </div>

        {/* Footer links */}
        <footer className="mt-8 pb-10 flex items-center justify-center gap-6 text-xs">
          {[
            { label: 'Twitter/X', href: 'https://x.com/DegenRadarHQ' },
            { label: 'YouTube', href: '#' },
            { label: 'TikTok', href: '#' },
            { label: 'Telegram', href: '#' },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              className="text-[#3A3A52] hover:text-[#00FF7F] transition-colors font-['Outfit']"
            >
              {link.label}
            </a>
          ))}
        </footer>
      </div>
    </main>
  )
}
