import type { CSSProperties, FC, ReactNode } from 'react'
import type {
  EnrichmentAttribute,
  EnrichmentResult,
} from '~/api/enrichment'

export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function pathOf(url: string): string {
  try {
    return new URL(url).pathname
  } catch {
    return url
  }
}

export function formatAttr(a: EnrichmentAttribute): string {
  const v = a.value
  switch (a.format) {
    case 'rating':
      return typeof v === 'number' ? `★ ${v.toFixed(1)}` : `★ ${v}`
    case 'percent':
      return typeof v === 'number' ? `${(v * 100).toFixed(1)}%` : `${v}`
    case 'date':
      return typeof v === 'string'
        ? new Date(v).toLocaleDateString('zh-CN')
        : String(v)
    case 'duration':
      if (typeof v === 'number') {
        const m = Math.floor(v / 60)
        const s = Math.floor(v % 60)
        return `${m}:${s.toString().padStart(2, '0')}`
      }
      return String(v)
    case 'number':
      return typeof v === 'number' ? v.toLocaleString() : String(v)
    default:
      return String(v)
  }
}

const categoryColorFallback: Record<string, string> = {
  github: '#24292f',
  media: '#01b4e4',
  book: '#8b6f4e',
  music: '#c20c0c',
  academic: '#b31b1b',
  code: '#ffa116',
  self: '#3b82f6',
}

export function colorFor(e: EnrichmentResult): string {
  return e.color || categoryColorFallback[e.category] || '#737373'
}

export const cardStyle: CSSProperties = {
  display: 'block',
  overflow: 'hidden',
  borderRadius: 8,
  border: '1px solid var(--enrich-border, rgba(115,115,115,0.25))',
  background: 'var(--enrich-bg, rgba(255,255,255,0.6))',
  textDecoration: 'none',
  color: 'inherit',
  margin: '12px 0',
  transition: 'border-color 120ms ease, background-color 120ms ease',
}

export const colorBarStyle = (color: string): CSSProperties => ({
  display: 'flex',
  gap: 12,
  padding: '10px 12px',
  borderLeft: `3px solid ${color}`,
})

export const imageShellStyle: CSSProperties = {
  display: 'flex',
  gap: 12,
  padding: 12,
}

export const titleStyle: CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  fontSize: 14,
  fontWeight: 600,
  lineHeight: 1.4,
  margin: 0,
}

export const descStyle: CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  fontSize: 12,
  lineHeight: 1.5,
  color: 'var(--enrich-muted, #737373)',
  margin: '4px 0 0',
}

const footerStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  marginTop: 6,
  fontSize: 12,
  color: 'var(--enrich-muted-2, #a3a3a3)',
}

export const badgeStyle = (color?: string): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '1px 6px',
  borderRadius: 4,
  fontSize: 10,
  fontWeight: 600,
  background: color
    ? `color-mix(in srgb, ${color} 15%, transparent)`
    : 'rgba(115,115,115,0.15)',
  color: color || 'inherit',
  textTransform: 'uppercase',
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
})

export const CardShell: FC<{ href?: string; children: ReactNode }> = ({
  href,
  children,
}) => {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-hide-print
        style={cardStyle}
      >
        {children}
      </a>
    )
  }
  return <div style={cardStyle}>{children}</div>
}

const ExternalIcon: FC = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 3h6v6" />
    <path d="M10 14L21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
)

export const LinkFooter: FC<{ url: string; self?: boolean }> = ({
  url,
  self,
}) => (
  <span style={footerStyle}>
    <ExternalIcon />
    <span
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {self ? pathOf(url) : hostnameOf(url)}
    </span>
  </span>
)

export const AttributeRow: FC<{
  attrs?: EnrichmentAttribute[]
  exclude?: string[]
  limit?: number
}> = ({ attrs, exclude = [], limit = 3 }) => {
  const visible = (attrs || [])
    .filter((a) => !exclude.includes(a.key))
    .slice(0, limit)
  if (visible.length === 0) return null
  return (
    <div
      style={{
        marginTop: 4,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0 12px',
        fontSize: 12,
        color: 'var(--enrich-muted, #737373)',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {visible.map((a) => (
        <span key={a.key}>
          {a.label ? `${a.label} ` : ''}
          {formatAttr(a)}
        </span>
      ))}
    </div>
  )
}
