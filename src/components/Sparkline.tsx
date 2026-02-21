'use client'

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  showGradient?: boolean
  className?: string
}

export default function Sparkline({
  data,
  width = 100,
  height = 32,
  color,
  showGradient = false,
  className = '',
}: SparklineProps) {
  if (!data || data.length < 2) return <div style={{ width, height }} />

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x},${y}`
  })

  const isUp = data[data.length - 1] >= data[0]
  const lineColor = color || (isUp ? 'var(--green)' : 'var(--red)')
  const gradientId = `sg-${Math.random().toString(36).slice(2, 8)}`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      {showGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {showGradient && (
        <polygon
          points={`0,${height} ${points.join(' ')} ${width},${height}`}
          fill={`url(#${gradientId})`}
        />
      )}
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={lineColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
