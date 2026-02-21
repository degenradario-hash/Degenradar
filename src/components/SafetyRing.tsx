'use client'

const SIZES = {
  sm: { size: 38, stroke: 3, fontSize: 12 },
  md: { size: 48, stroke: 3.5, fontSize: 14 },
  lg: { size: 80, stroke: 5, fontSize: 22 },
} as const

const FLAG_LABELS: Record<string, string> = {
  LOW_LIQUIDITY: '💧 Low Liq',
  LOW_VOLUME: '📉 Low Vol',
  HEAVY_SELLING: '🔴 Sells',
  SUSPICIOUS_BUY_PATTERN: '⚠️ Sus Buys',
  VERY_NEW: '🆕 Very New',
  NEW_TOKEN: '🕐 New',
  DUMPING: '📉 Dumping',
  PUMP_ALERT: '🚀 Pump',
  MICRO_CAP: '🔬 Micro',
}

function getScoreColor(score: number): string {
  if (score >= 70) return 'var(--green)'
  if (score >= 40) return '#FFAA00'
  return 'var(--red)'
}

interface SafetyRingProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  flags?: string[]
  showFlags?: boolean
}

export default function SafetyRing({
  score,
  size = 'sm',
  flags = [],
  showFlags = false,
}: SafetyRingProps) {
  const { size: dim, stroke, fontSize } = SIZES[size]
  const radius = (dim - stroke * 2) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(100, score)) / 100
  const dashArray = `${circumference * progress} ${circumference * (1 - progress)}`
  const color = getScoreColor(score)

  return (
    <div className={showFlags ? 'flex items-start gap-3' : 'inline-flex'}>
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90">
          {/* Track */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
          />
          {/* Progress */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={dashArray}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center font-mono font-bold"
          style={{ fontSize, color }}
        >
          {score}
        </span>
      </div>

      {showFlags && flags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {flags.map(flag => (
            <span
              key={flag}
              className="pill text-[10px]"
              style={{ background: `${color}15`, color }}
            >
              {FLAG_LABELS[flag] || flag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
