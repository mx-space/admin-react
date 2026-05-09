import { Chart } from '@antv/g2'
import { useEffect, useRef } from 'react'

import { Card, Button } from '~/components/ui'
import { FullPage } from '~/layouts'
import { useAppInfoQuery } from '~/hooks/queries/use-app-info'

const mockSeries = [
  { date: '05-03', visits: 624 },
  { date: '05-04', visits: 712 },
  { date: '05-05', visits: 689 },
  { date: '05-06', visits: 821 },
  { date: '05-07', visits: 905 },
  { date: '05-08', visits: 1042 },
  { date: '05-09', visits: 1284 },
]

const useTrendChart = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!containerRef.current) return
    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      paddingTop: 16,
      paddingRight: 16,
      paddingBottom: 32,
      paddingLeft: 40,
    })
    chart
      .area()
      .data(mockSeries)
      .encode('x', 'date')
      .encode('y', 'visits')
      .scale('y', { nice: true })
      .style('fill', 'linear-gradient(180deg, rgba(94,106,210,0.4), rgba(94,106,210,0))')
      .style('fillOpacity', 1)
    chart
      .line()
      .data(mockSeries)
      .encode('x', 'date')
      .encode('y', 'visits')
      .style('stroke', '#5e6ad2')
      .style('lineWidth', 2)
    chart.axis('x', { line: false, tick: false })
    chart.axis('y', { gridLineDash: [2, 2] })
    chart.render()
    return () => {
      chart.destroy()
    }
  }, [])
  return containerRef
}

const Stat = ({
  label,
  value,
  delta,
}: {
  label: string
  value: string | number
  delta?: string
}) => (
  <Card padding="md" elevation="raised">
    <div
      style={{
        fontSize: 11,
        color: 'var(--ink-tertiary, #62666d)',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
      }}
    >
      {label}
    </div>
    <div
      style={{
        marginTop: 6,
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: '-0.5px',
      }}
    >
      {value}
    </div>
    {delta ? (
      <div style={{ marginTop: 4, fontSize: 11, color: '#27a644' }}>{delta}</div>
    ) : null}
  </Card>
)

const DashboardPage = () => {
  const containerRef = useTrendChart()
  const { data: appInfo, isPending } = useAppInfoQuery()

  return (
    <FullPage
      title="仪表盘"
      actions={<Button intent="secondary">刷新</Button>}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 12,
        }}
      >
        <Stat label="文章" value={142} delta="+3 本周" />
        <Stat label="日记" value={68} delta="+2 本周" />
        <Stat label="访问 24h" value="1,284" delta="+12.4%" />
        <Stat
          label="App"
          value={isPending ? '…' : (appInfo?.name ?? 'mx-core')}
          delta={isPending ? undefined : (appInfo?.version ?? '—')}
        />
      </div>

      <Card padding="md" elevation="raised" style={{ marginTop: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize: 13, color: 'var(--ink, #f7f8f8)' }}>访问 · 7d</div>
          <span style={{ fontSize: 11, color: 'var(--ink-tertiary, #62666d)' }}>
            mock data
          </span>
        </div>
        <div ref={containerRef} style={{ height: 220 }} />
      </Card>
    </FullPage>
  )
}

export default DashboardPage
