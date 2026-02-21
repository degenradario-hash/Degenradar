'use client'

interface FearGreedGaugeProps {
  value: number
  classification: string
}

export default function FearGreedGauge({ value, classification }: FearGreedGaugeProps) {
  // SVG arc gauge: 180° from left (red) to right (green)
  const cx = 60
  const cy = 55
  const r = 45
  const startAngle = Math.PI       // left (180°)
  const endAngle = 0               // right (0°)

  // Needle angle: value 0 = left (180°), value 100 = right (0°)
  const needleAngle = Math.PI - (value / 100) * Math.PI
  const needleX = cx + r * Math.cos(needleAngle)
  const needleY = cy - r * Math.sin(needleAngle)

  // Arc path helper
  function arcPath(startA: number, endA: number, radius: number): string {
    const x1 = cx + radius * Math.cos(startA)
    const y1 = cy - radius * Math.sin(startA)
    const x2 = cx + radius * Math.cos(endA)
    const y2 = cy - radius * Math.sin(endA)
    const largeArc = Math.abs(startA - endA) > Math.PI ? 1 : 0
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
  }

  // Color segments: Extreme Fear → Fear → Neutral → Greed → Extreme Greed
  const segments = [
    { from: Math.PI, to: Math.PI * 0.8, color: '#FF4466' },         // Extreme Fear
    { from: Math.PI * 0.8, to: Math.PI * 0.6, color: '#FF8844' },   // Fear
    { from: Math.PI * 0.6, to: Math.PI * 0.4, color: '#FFCC00' },   // Neutral
    { from: Math.PI * 0.4, to: Math.PI * 0.2, color: '#88CC44' },   // Greed
    { from: Math.PI * 0.2, to: 0, color: '#00CC66' },               // Extreme Greed
  ]

  function getColor(v: number): string {
    if (v <= 20) return '#FF4466'
    if (v <= 40) return '#FF8844'
    if (v <= 60) return '#FFCC00'
    if (v <= 80) return '#88CC44'
    return '#00CC66'
  }

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="68" viewBox="0 0 120 68">
        {/* Arc segments */}
        {segments.map((seg, i) => (
          <path
            key={i}
            d={arcPath(seg.from, seg.to, r)}
            fill="none"
            stroke={seg.color}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.7"
          />
        ))}

        {/* Needle line */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="var(--text-primary)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Needle dot */}
        <circle
          cx={needleX}
          cy={needleY}
          r="4"
          fill={getColor(value)}
          stroke="var(--bg-secondary)"
          strokeWidth="1.5"
        />

        {/* Center pivot */}
        <circle cx={cx} cy={cy} r="3" fill="var(--text-muted)" />
      </svg>

      {/* Value + label */}
      <div className="mono text-2xl font-bold mt-1" style={{ color: getColor(value) }}>
        {value}
      </div>
      <div className="text-xs font-medium" style={{ color: getColor(value) }}>
        {classification}
      </div>
    </div>
  )
}
