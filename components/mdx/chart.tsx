'use client'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

interface ChartProps {
  data: Record<string, string | number>[]
  type?: 'bar' | 'pie'
  title?: string
  height?: number
}

export function Chart({ data, type = 'bar', title, height = 280 }: ChartProps) {
  return (
    <div className="my-6">
      {title && (
        <p className="text-sm font-semibold text-foreground mb-3 text-center">{title}</p>
      )}
      <div className="w-full" style={{ height }}>
        {type === 'pie' ? (
          <PieSvg data={data} />
        ) : (
          <BarSvg data={data} />
        )}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 justify-center">
        {data.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            {String(item.name)}
          </span>
        ))}
      </div>
    </div>
  )
}

function BarSvg({ data }: { data: Record<string, string | number>[] }) {
  const keys = Object.keys(data[0] || {}).filter(k => k !== 'name')
  const padding = { top: 12, right: 12, bottom: 36, left: 12 }
  const chartW = 100 // percent
  const chartH = 100 // percent
  const barGroupW = chartW / data.length
  const numBars = keys.length
  const barW = (barGroupW * 0.6) / numBars
  const bottomPadding = chartH - padding.bottom

  // Find max value for scaling
  const allVals = data.flatMap(d => keys.map(k => Number(d[k]) || 0))
  const maxVal = Math.max(...allVals, 1)

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map(pct => {
        const y = padding.top + (bottomPadding - padding.top) * (1 - pct / 100)
        return (
          <line
            key={pct}
            x1={padding.left}
            y1={y}
            x2={chartW - padding.right}
            y2={y}
            stroke="var(--border)"
            strokeDasharray="3,3"
          />
        )
      })}

      {/* Bars */}
      {data.map((item, gi) => {
        const groupX = padding.left + gi * barGroupW + barGroupW / 2
        return keys.map((k, bi) => {
          const val = Number(item[k]) || 0
          const barH = ((val / maxVal) * (bottomPadding - padding.top)) || 1
          const x = groupX - (barW * numBars) / 2 + bi * barW
          const y = bottomPadding - barH
          return (
            <g key={`${gi}-${bi}`}>
              <rect
                x={x + 0.5}
                y={y}
                width={barW - 1}
                height={barH}
                rx={2}
                fill={COLORS[bi % COLORS.length]}
                opacity={0.9}
              />
              <text
                x={groupX}
                y={chartH - 6}
                textAnchor="middle"
                fontSize={3.5}
                fill="var(--muted-foreground)"
              >
                {String(item.name)}
              </text>
            </g>
          )
        })
      })}
    </svg>
  )
}

function PieSvg({ data }: { data: Record<string, string | number>[] }) {
  const vals = data.map(d => Number(d.name) || 0)
  const labels = data.map(d => String(d.name))
  const total = vals.reduce((a, b) => a + b, 0)
  if (total === 0) return null

  const cx = 50
  const cy = 50
  const r = 40

  let startAngle = -90 // start from top
  const paths = vals.map((val, i) => {
    const angle = (val / total) * 360
    const endAngle = startAngle + angle
    const largeArc = angle > 180 ? 1 : 0

    const toRad = (deg: number) => (deg * Math.PI) / 180
    const x1 = cx + r * Math.cos(toRad(startAngle))
    const y1 = cy + r * Math.sin(toRad(startAngle))
    const x2 = cx + r * Math.cos(toRad(endAngle))
    const y2 = cy + r * Math.sin(toRad(endAngle))

    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
    startAngle = endAngle

    return { d, color: COLORS[i % COLORS.length], label: labels[i], val }
  })

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} opacity={0.9} />
      ))}
      {/* Center donut hole */}
      <circle cx={cx} cy={cy} r={20} fill="var(--background)" />
      <text x={cx} y={cy - 3} textAnchor="middle" fontSize={7} fontWeight="bold" fill="var(--foreground)">
        {total}
      </text>
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={4} fill="var(--muted-foreground)">
        total
      </text>
    </svg>
  )
}