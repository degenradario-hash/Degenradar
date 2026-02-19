'use client'

import SafetyScore from './SafetyScore'

interface TokenData {
  chainId: string
  pairAddress: string
  baseToken: { name: string; symbol: string; address: string }
  quoteToken: { symbol: string }
  priceUsd: string
  priceChange: { m5: number; h1: number; h24: number }
  volume: { h24: number; h1: number }
  txns: { h24: { buys: number; sells: number }; h1: { buys: number; sells: number } }
  liquidity?: { usd: number }
  marketCap?: number
  fdv?: number
  pairCreatedAt?: number
  url: string
  safetyScore: { score: number; flags: string[] }
}

function formatUsd(value: number | undefined | null): string {
  if (!value) return '—'
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${value.toFixed(0)}`
}

function formatPrice(price: string | undefined): string {
  if (!price) return '—'
  const num = parseFloat(price)
  if (num >= 1) return `$${num.toFixed(2)}`
  if (num >= 0.0001) return `$${num.toFixed(4)}`
  if (num >= 0.00000001) return `$${num.toFixed(8)}`
  return `$${num.toExponential(2)}`
}

function formatAge(createdAt: number | undefined): string {
  if (!createdAt) return '—'
  const diff = Date.now() - createdAt
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d`
  return `${Math.floor(days / 30)}mo`
}

function PriceChange({ value }: { value: number | undefined }) {
  if (value === undefined || value === null) return <span className="text-[#3A3A52]">—</span>
  const isUp = value > 0
  const isDown = value < 0
  return (
    <span className={`mono text-xs ${isUp ? 'text-[#00FF7F]' : isDown ? 'text-[#FF3366]' : 'text-[#5A5A72]'}`}>
      {isUp ? '+' : ''}{value.toFixed(1)}%
    </span>
  )
}

function ChainBadge({ chainId }: { chainId: string }) {
  const config: Record<string, { label: string; cls: string }> = {
    solana: { label: 'SOL', cls: 'chain-sol' },
    ethereum: { label: 'ETH', cls: 'chain-eth' },
    base: { label: 'BASE', cls: 'chain-base' },
    bsc: { label: 'BSC', cls: 'chain-bsc' },
    arbitrum: { label: 'ARB', cls: 'chain-arb' },
  }
  const c = config[chainId] || { label: chainId.slice(0, 4).toUpperCase(), cls: 'chain-sol' }
  return <span className={`pill ${c.cls}`}>{c.label}</span>
}

export default function TokenTable({ tokens, loading }: { tokens: TokenData[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-2 border-[#1A1A28] rounded-full" />
            <div className="absolute inset-0 border-2 border-transparent border-t-[#00FF7F] rounded-full animate-spin" />
            <div className="absolute inset-2 border border-[#1A1A28] rounded-full" />
            <div className="absolute inset-2 border border-transparent border-t-[#00FF7F66] rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
          </div>
          <span className="text-[#5A5A72] text-sm font-['Outfit']">Scanning blockchain...</span>
        </div>
      </div>
    )
  }

  if (tokens.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 text-[#5A5A72] font-['Outfit']">
        No tokens detected. Adjust filters or search.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto scanline-overlay">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#1A1A28]">
            {['#', 'Token', 'Chain', 'Price', '5m', '1h', '24h', 'Vol 24h', 'Liq', 'MCap', 'Txns', 'Age', 'Safety'].map(h => (
              <th key={h} className={`py-3 px-3 text-[10px] font-semibold tracking-wider text-[#3A3A52] font-['Space_Mono'] uppercase ${
                ['Price', 'Vol 24h', 'Liq', 'MCap', '5m', '1h', '24h'].includes(h) ? 'text-right' : h === 'Safety' ? 'text-center' : 'text-left'
              }`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, i) => (
            <tr
              key={`${token.pairAddress}-${i}`}
              className={`token-row cursor-pointer border-b border-[#1A1A28]/50 fade-up fade-up-${Math.min(i + 1, 8)}`}
              onClick={() => window.open(token.url, '_blank')}
            >
              <td className="py-3 px-3 mono text-[#3A3A52] text-xs">{i + 1}</td>
              <td className="py-3 px-3">
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-[13px] font-['Chakra_Petch']">{token.baseToken.symbol}</span>
                  <span className="text-[#3A3A52] text-[10px] truncate max-w-[130px] font-['Outfit']">{token.baseToken.name}</span>
                </div>
              </td>
              <td className="py-3 px-3"><ChainBadge chainId={token.chainId} /></td>
              <td className="py-3 px-3 text-right mono text-xs text-white">{formatPrice(token.priceUsd)}</td>
              <td className="py-3 px-3 text-right"><PriceChange value={token.priceChange?.m5} /></td>
              <td className="py-3 px-3 text-right"><PriceChange value={token.priceChange?.h1} /></td>
              <td className="py-3 px-3 text-right"><PriceChange value={token.priceChange?.h24} /></td>
              <td className="py-3 px-3 text-right mono text-xs text-[#C8C8D4]">{formatUsd(token.volume?.h24)}</td>
              <td className="py-3 px-3 text-right mono text-xs text-[#C8C8D4]">{formatUsd(token.liquidity?.usd)}</td>
              <td className="py-3 px-3 text-right mono text-xs text-[#C8C8D4]">{formatUsd(token.marketCap || token.fdv)}</td>
              <td className="py-3 px-3 text-right">
                <span className="mono text-[10px]">
                  <span className="text-[#00FF7F]">{token.txns?.h24?.buys || 0}</span>
                  <span className="text-[#3A3A52]">/</span>
                  <span className="text-[#FF3366]">{token.txns?.h24?.sells || 0}</span>
                </span>
              </td>
              <td className="py-3 px-3 text-center">
                <span className="mono text-xs text-[#5A5A72]">{formatAge(token.pairCreatedAt)}</span>
              </td>
              <td className="py-3 px-3">
                <div className="flex justify-center">
                  <SafetyScore score={token.safetyScore.score} flags={token.safetyScore.flags} compact />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
