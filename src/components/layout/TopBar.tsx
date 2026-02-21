'use client'

import { useState, useEffect } from 'react'
import { formatBigNumber } from '@/lib/formatters'

interface GlobalData {
  total_market_cap: number
  total_volume: number
  market_cap_change_24h: number
  btc_dominance: number
  eth_dominance: number
  active_coins: number
}

export default function TopBar() {
  const [data, setData] = useState<GlobalData | null>(null)

  useEffect(() => {
    fetch('/api/global')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  const mcapChange = data?.market_cap_change_24h ?? 0
  const changeColor = mcapChange >= 0 ? 'text-[--green]' : 'text-[--red]'
  const changeArrow = mcapChange >= 0 ? '▲' : '▼'

  return (
    <div className="w-full bg-[--bg-secondary] border-b border-[--border] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 py-1.5 flex items-center gap-6 text-[11px] font-mono text-[--text-muted]">
        <div className="flex items-center gap-1">
          <div className="live-dot mr-1" />
          <span>Coins: {data ? data.active_coins.toLocaleString() : '—'}</span>
        </div>
        <span className="hidden sm:inline">|</span>
        <div className="hidden sm:flex items-center gap-1">
          <span>Market Cap:</span>
          <span className="text-[--text-primary] font-bold">{data ? formatBigNumber(data.total_market_cap) : '—'}</span>
          <span className={changeColor}>{changeArrow}{Math.abs(mcapChange).toFixed(1)}%</span>
        </div>
        <span className="hidden md:inline">|</span>
        <div className="hidden md:flex items-center gap-1">
          <span>24h Vol:</span>
          <span className="text-[--text-primary]">{data ? formatBigNumber(data.total_volume) : '—'}</span>
        </div>
        <span className="hidden lg:inline">|</span>
        <div className="hidden lg:flex items-center gap-1">
          <span>Dominance:</span>
          <span className="text-[--text-primary]">BTC {data ? data.btc_dominance.toFixed(1) : '—'}%</span>
          <span className="text-[--text-primary]">ETH {data ? data.eth_dominance.toFixed(1) : '—'}%</span>
        </div>
      </div>
    </div>
  )
}
