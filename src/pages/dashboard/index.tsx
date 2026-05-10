import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts'

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

const TrendChart = () => (
  <ResponsiveContainer width="100%" height={220}>
    <AreaChart
      data={mockSeries}
      margin={{ top: 16, right: 16, bottom: 8, left: 0 }}
    >
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5e6ad2" stopOpacity={0.45} />
          <stop offset="100%" stopColor="#5e6ad2" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid
        stroke="#23262b"
        strokeDasharray="2 2"
        vertical={false}
      />
      <XAxis
        dataKey="date"
        tickLine={false}
        axisLine={false}
        tick={{ fill: '#62666d', fontSize: 11 }}
      />
      <YAxis
        tickLine={false}
        axisLine={false}
        tick={{ fill: '#62666d', fontSize: 11 }}
        width={36}
      />
      <RechartsTooltip
        cursor={{ stroke: '#5e6ad2', strokeOpacity: 0.4 }}
        contentStyle={{
          background: '#171a1d',
          border: '1px solid #2f3239',
          borderRadius: 8,
          color: '#f7f8f8',
          fontSize: 12,
        }}
        labelStyle={{ color: '#8a8f98' }}
      />
      <Area
        type="monotone"
        dataKey="visits"
        stroke="#5e6ad2"
        strokeWidth={2}
        fill="url(#trendFill)"
      />
    </AreaChart>
  </ResponsiveContainer>
)

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
        <div style={{ height: 220 }}>
          <TrendChart />
        </div>
      </Card>
    </FullPage>
  )
}

export default DashboardPage
