'use client'

interface SafetyScoreProps {
  score: number
  flags: string[]
  compact?: boolean
}

export default function SafetyScore({ score, flags, compact = false }: SafetyScoreProps) {
  const getStyle = () => {
    if (score >= 70) return { stroke: '#00FF7F', bg: '#00FF7F', label: 'SAFE', glow: '#00FF7F33' }
    if (score >= 40) return { stroke: '#FFAA00', bg: '#FFAA00', label: 'WARN', glow: '#FFAA0033' }
    return { stroke: '#FF3366', bg: '#FF3366', label: 'RISK', glow: '#FF336633' }
  }

  const s = getStyle()
  const circumference = 2 * Math.PI * 14
  const dashArray = `${(score / 100) * circumference} ${circumference}`

  if (compact) {
    return (
      <div className="relative flex items-center justify-center" style={{ width: 38, height: 38 }}>
        <svg width="38" height="38" viewBox="0 0 36 36" className="-rotate-90">
          <circle cx="18" cy="18" r="14" fill="none" stroke="#1A1A28" strokeWidth="2.5" />
          <circle
            cx="18" cy="18" r="14" fill="none"
            stroke={s.stroke}
            strokeWidth="2.5"
            strokeDasharray={dashArray}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${s.glow})`, transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>
        <span
          className="absolute text-[11px] font-bold font-['Space_Mono']"
          style={{ color: s.bg }}
        >
          {score}
        </span>
      </div>
    )
  }

  const flagLabels: Record<string, string> = {
    LOW_LIQUIDITY: '💧 Low Liq',
    LOW_VOLUME: '📉 Low Vol',
    HEAVY_SELLING: '🔴 Selling',
    SUSPICIOUS_BUY_PATTERN: '🤖 Sus Buys',
    VERY_NEW: '⏰ <1h',
    NEW_TOKEN: '🆕 <24h',
    DUMPING: '📉 Dump',
    PUMP_ALERT: '🚀 Pump',
    MICRO_CAP: '🔬 Micro',
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center" style={{ width: 48, height: 48 }}>
        <svg width="48" height="48" viewBox="0 0 36 36" className="-rotate-90">
          <circle cx="18" cy="18" r="14" fill="none" stroke="#1A1A28" strokeWidth="2.5" />
          <circle
            cx="18" cy="18" r="14" fill="none"
            stroke={s.stroke}
            strokeWidth="2.5"
            strokeDasharray={dashArray}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${s.glow})` }}
          />
        </svg>
        <span className="absolute text-sm font-bold font-['Space_Mono']" style={{ color: s.bg }}>
          {score}
        </span>
      </div>
      <div>
        <span className="text-xs font-bold font-['Chakra_Petch'] tracking-wider" style={{ color: s.bg }}>
          {s.label}
        </span>
        {flags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {flags.slice(0, 3).map(f => (
              <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-[#111119] text-[#5A5A72] border border-[#1A1A28]">
                {flagLabels[f] || f}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
