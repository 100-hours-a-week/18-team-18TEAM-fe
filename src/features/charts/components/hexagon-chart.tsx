'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ChartData {
  label: string
  value: number // 0-100
}

interface HexagonChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ChartData[]
  size?: number
}

function HexagonChart({
  data,
  size = 300,
  className,
  ...props
}: HexagonChartProps) {
  const center = size / 2
  const radius = size * 0.35
  const labelRadius = size * 0.45

  // 6개 축의 각도 계산 (위에서 시작, 시계방향)
  const getPoint = (index: number, value: number, r: number) => {
    const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2
    const distance = (value / 100) * r
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
    }
  }

  // 육각형 배경 그리드 생성
  const createHexagonPath = (r: number) => {
    const points = Array.from({ length: 6 }, (_, i) => {
      const point = getPoint(i, 100, r)
      return `${point.x},${point.y}`
    })
    return `M ${points.join(' L ')} Z`
  }

  // 데이터 영역 생성
  const dataPath = () => {
    if (data.length < 6) return ''
    const points = data.slice(0, 6).map((d, i) => {
      const point = getPoint(i, d.value, radius)
      return `${point.x},${point.y}`
    })
    return `M ${points.join(' L ')} Z`
  }

  return (
    <div
      data-slot="hexagon-chart"
      className={cn('relative', className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 배경 그리드 */}
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <path
            key={scale}
            d={createHexagonPath(radius * scale)}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border"
          />
        ))}

        {/* 축 선 */}
        {Array.from({ length: 6 }, (_, i) => {
          const point = getPoint(i, 100, radius)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-border"
            />
          )
        })}

        {/* 데이터 영역 */}
        <path
          d={dataPath()}
          fill="currentColor"
          fillOpacity="0.3"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
        />

        {/* 데이터 포인트 */}
        {data.slice(0, 6).map((d, i) => {
          const point = getPoint(i, d.value, radius)
          return (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="currentColor"
              className="text-primary"
            />
          )
        })}
      </svg>

      {/* 라벨 */}
      {data.slice(0, 6).map((d, i) => {
        const point = getPoint(i, 100, labelRadius)
        return (
          <span
            key={i}
            className="text-foreground absolute -translate-x-1/2 -translate-y-1/2 transform text-xs font-medium"
            style={{ left: point.x, top: point.y }}
          >
            {d.label}
          </span>
        )
      })}
    </div>
  )
}

export { HexagonChart }
export type { HexagonChartProps, ChartData }
