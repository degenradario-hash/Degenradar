'use client'

interface FearGreedGaugeProps {
  value: number
  classification: string
}

export default function FearGreedGauge({ value, classification }: FearGreedGaugeProps) {
  const cx = 90
  const cy = 90
  const r = 70
  const strokeWidth = 14

  // Needle angle: value 0 = left (180°), value 100 = right (0°)
  const needleAngle = Math.PI - (value / 100) * Math.PI
  const needleLen = r - 15
  const needleX = cx + needleLen * Math.cos(needleAngle)
  const needleY = cy - needleLen * Math.sin(needleAngle)

  // Arc path helper
  function arcPath(startA: number, endA: number, radius: number): string {
    const x1 = cx + radius * Math.cos(startA)
    const y1 = cy - radius * Math.sin(startA)
    const x2 = cx + radius * Math.cos(endA)
    const y2 = cy - radius * Math.sin(endA)
    const largeArc = Math.abs(startA - endA) > Math.PI ? 1 : 0
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
  }

  // 5 color segments across 180° arc
  const segments = [
    { from: Math.PI, to: Math.PI * 0.8, color: '#EA3943' },
    { from: Math.PI * 0.8, to: Math.PI * 0.6, color: '#EA8C00' },
    { from: Math.PI * 0.6, to: Math.PI * 0.4, color: '#F5D100' },
    { from: Math.PI * 0.4, to: Math.PI * 0.2, color: '#93D900' },
    { from: Math.PI * 0.2, to: 0, color: '#16C784' },
  ]

  function getColor(v: number): string {
    if (v <= 20) return '#EA3943'
    if (v <= 40) return '#EA8C00'
    if (v <= 60) return '#F5D100'
    if (v <= 80) return '#93D900'
    return '#16C784'
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="180" height="105" viewBox="0 0 180 105">
          {/* Background arc (gray track) */}
          <path
            d={arcPath(Math.PI, 0, r)}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-700/30 dark:text-gray-700/50"
          />

          {/* Colored arc segments */}
          {segments.map((seg, i) => (
            <path
              key={i}
              d={arcPath(seg.from, seg.to, r)}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeLinecap={i === 0 || i === segments.length - 1 ? 'round' : 'butt'}
            />
          ))}

          {/* Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={needleX}
            y2={needleY}
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Center dot */}
          <circle cx={cx} cy={cy} r="5" fill="white" />
        </svg>

        {/* Side labels */}
        <span className="absolute bottom-0 left-0 text-[9px] text-[--text-muted] leading-none">
          Fear
        </span>
        <span className="absolute bottom-0 right-0 text-[9px] text-[--text-muted] leading-none">
          Greed
        </span>
      </div>

      {/* Value and classification */}
      <div className="mono text-3xl font-bold mt-1" style={{ color: getColor(value) }}>
        {value}
      </div>
      <div className="text-xs font-medium" style={{ color: getColor(value) }}>
        {classification}
      </div>
    </div>
  )
}
