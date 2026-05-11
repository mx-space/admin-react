import type { FC } from 'react'
import type { EnrichmentResult } from '~/api/enrichment'

import {
  AttributeRow,
  CardShell,
  LinkFooter,
  badgeStyle,
  colorBarStyle,
  colorFor,
  descStyle,
  imageShellStyle,
  titleStyle,
} from './shared'

export const GithubCard: FC<{ e: EnrichmentResult }> = ({ e }) => {
  const stateAttr = e.attributes?.find((a) => a.key === 'state')
  const stateColors: Record<string, string> = {
    OPEN: '#238636',
    CLOSED: '#f85149',
    MERGED: '#8957e5',
  }
  const stateValue = String(stateAttr?.value ?? '').toUpperCase()
  const subtypeLabel = e.subtype ? e.subtype.toUpperCase() : 'REPO'
  return (
    <CardShell href={e.url}>
      <div style={colorBarStyle(colorFor(e))}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexWrap: 'wrap',
            }}
          >
            {stateAttr ? (
              <span style={badgeStyle(stateColors[stateValue])}>
                {stateValue}
              </span>
            ) : (
              <span style={badgeStyle()}>{subtypeLabel}</span>
            )}
            <h4 style={{ ...titleStyle, fontFamily: 'monospace' }}>
              {e.title}
            </h4>
          </div>
          {e.description && <p style={descStyle}>{e.description}</p>}
          <AttributeRow attrs={e.attributes} exclude={['state']} limit={4} />
          <LinkFooter url={e.url} />
        </div>
      </div>
    </CardShell>
  )
}

export const MediaCard: FC<{ e: EnrichmentResult }> = ({ e }) => (
  <CardShell href={e.url}>
    <div style={imageShellStyle}>
      {e.image && (
        <img
          src={e.image.url}
          alt={e.image.alt || e.title}
          loading="lazy"
          style={{
            width: 80,
            height: 120,
            flexShrink: 0,
            borderRadius: 4,
            objectFit: 'cover',
          }}
        />
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <h4 style={titleStyle}>{e.title}</h4>
        {e.description && <p style={descStyle}>{e.description}</p>}
        <AttributeRow attrs={e.attributes} limit={4} />
        <LinkFooter url={e.url} />
      </div>
    </div>
  </CardShell>
)

export const BookCard: FC<{ e: EnrichmentResult }> = ({ e }) => (
  <CardShell href={e.url}>
    <div style={imageShellStyle}>
      {e.image && (
        <img
          src={e.image.url}
          alt={e.image.alt || e.title}
          loading="lazy"
          style={{
            width: 60,
            height: 80,
            flexShrink: 0,
            borderRadius: 4,
            objectFit: 'cover',
          }}
        />
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <h4 style={titleStyle}>{e.title}</h4>
        <AttributeRow attrs={e.attributes} limit={4} />
        <LinkFooter url={e.url} />
      </div>
    </div>
  </CardShell>
)

export const MusicCard: FC<{ e: EnrichmentResult }> = ({ e }) => (
  <CardShell href={e.url}>
    <div style={imageShellStyle}>
      {e.image && (
        <img
          src={e.image.url}
          alt={e.image.alt || e.title}
          loading="lazy"
          style={{
            width: 72,
            height: 72,
            flexShrink: 0,
            borderRadius: 4,
            objectFit: 'cover',
          }}
        />
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'var(--enrich-muted, #737373)' }}>▶</span>
          <h4 style={titleStyle}>{e.title}</h4>
        </div>
        <AttributeRow attrs={e.attributes} limit={3} />
        <LinkFooter url={e.url} />
      </div>
    </div>
  </CardShell>
)

export const AcademicCard: FC<{ e: EnrichmentResult }> = ({ e }) => {
  const arxivId = e.attributes?.find((a) => a.key === 'arxivId')
  return (
    <CardShell href={e.url}>
      <div style={colorBarStyle(colorFor(e))}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--enrich-muted, #737373)' }}>📄</span>
            {arxivId && (
              <span style={badgeStyle('#b31b1b')}>arXiv:{arxivId.value}</span>
            )}
          </div>
          <h4 style={{ ...titleStyle, marginTop: 4 }}>{e.title}</h4>
          <AttributeRow attrs={e.attributes} exclude={['arxivId']} limit={2} />
          {e.description && <p style={descStyle}>{e.description}</p>}
          <LinkFooter url={e.url} />
        </div>
      </div>
    </CardShell>
  )
}

export const CodeCard: FC<{ e: EnrichmentResult }> = ({ e }) => {
  const difficulty = e.attributes?.find((a) => a.key === 'difficulty')
  const number = e.attributes?.find((a) => a.key === 'number')
  const tags = e.attributes?.find((a) => a.key === 'tags')
  const diffColors: Record<string, string> = {
    easy: '#00bfa5',
    medium: '#ffa726',
    hard: '#f44336',
  }
  const d = String(difficulty?.value ?? '').toLowerCase()
  return (
    <CardShell href={e.url}>
      <div style={colorBarStyle(colorFor(e))}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexWrap: 'wrap',
            }}
          >
            {number && <span style={badgeStyle()}>#{number.value}</span>}
            {difficulty && (
              <span style={badgeStyle(diffColors[d])}>
                {String(difficulty.value)}
              </span>
            )}
            <h4 style={{ ...titleStyle, fontFamily: 'monospace' }}>
              {e.title}
            </h4>
          </div>
          {tags && typeof tags.value === 'string' && (
            <div
              style={{
                marginTop: 4,
                fontSize: 12,
                color: 'var(--enrich-muted, #737373)',
              }}
            >
              {tags.value}
            </div>
          )}
          <AttributeRow
            attrs={e.attributes}
            exclude={['difficulty', 'number', 'tags']}
            limit={3}
          />
          <LinkFooter url={e.url} />
        </div>
      </div>
    </CardShell>
  )
}

export const SelfCard: FC<{ e: EnrichmentResult }> = ({ e }) => {
  const subtypeLabel: Record<string, string> = {
    post: '博文',
    note: '手记',
    page: '页面',
  }
  const label = e.subtype ? subtypeLabel[e.subtype] || e.subtype : ''
  return (
    <CardShell href={e.url}>
      <div style={colorBarStyle(colorFor(e))}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ color: 'var(--enrich-muted, #737373)' }}>📝</span>
            {label && <span style={badgeStyle('#3b82f6')}>{label}</span>}
            <h4 style={titleStyle}>{e.title}</h4>
          </div>
          {e.description && <p style={descStyle}>{e.description}</p>}
          <AttributeRow attrs={e.attributes} limit={3} />
          <LinkFooter url={e.url} self />
        </div>
      </div>
    </CardShell>
  )
}

export const FallbackCard: FC<{
  e: EnrichmentResult
  fallbackUrl: string
}> = ({ e, fallbackUrl }) => (
  <CardShell href={e.url || fallbackUrl}>
    <div style={imageShellStyle}>
      {e.image && (
        <img
          src={e.image.url}
          alt={e.image.alt || e.title}
          loading="lazy"
          style={{
            width: 80,
            height: 80,
            flexShrink: 0,
            borderRadius: 4,
            objectFit: 'cover',
          }}
        />
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <h4 style={titleStyle}>{e.title}</h4>
        <div
          style={{
            marginTop: 2,
            fontSize: 12,
            color: 'var(--enrich-muted-2, #a3a3a3)',
          }}
        >
          {e.category}
          {e.subtype ? ` · ${e.subtype}` : ''}
        </div>
        <AttributeRow attrs={e.attributes} limit={3} />
        <LinkFooter url={e.url || fallbackUrl} />
      </div>
    </div>
  </CardShell>
)
