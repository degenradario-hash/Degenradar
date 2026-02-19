'use client'

interface StatsBarProps {
  tokenCount: number
  loading: boolean
}

export default function StatsBar({ tokenCount, loading }: StatsBarProps) {
  return (
    <div className="flex items-center justify-between py-3 px-1">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-degen-green animate-pulse-green" />
          <span className="text-degen-muted text-xs">
            {loading ? 'Scanning...' : `${tokenCount} tokens loaded`}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-degen-muted">
        <span>Data: DexScreener</span>
        <span>|</span>
        <span>Safety: GoPlus (coming soon)</span>
        <span>|</span>
        <span className="text-degen-green">Live</span>
      </div>
    </div>
  )
}
