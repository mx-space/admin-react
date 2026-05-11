import { useEffect, useState } from 'react'
import type { LinkCardRendererProps } from '@haklex/rich-editor/renderers'
import type { FC } from 'react'
import type { EnrichmentResult } from '~/api/enrichment'

import { LinkCardRenderer, LinkCardSkeleton } from '@haklex/rich-kit-shiro'

import { useEnrichmentFetcher } from './EnrichmentLinkCardContext'
import {
  AcademicCard,
  BookCard,
  CodeCard,
  FallbackCard,
  GithubCard,
  MediaCard,
  MusicCard,
  SelfCard,
} from './enrichment-cards/cards'

const cache = new Map<string, EnrichmentResult | null>()
const inflight = new Map<string, Promise<EnrichmentResult | null>>()

function fetchOnce(
  url: string,
  fetcher: (url: string) => Promise<EnrichmentResult | null>,
): Promise<EnrichmentResult | null> {
  if (cache.has(url)) return Promise.resolve(cache.get(url) ?? null)
  let p = inflight.get(url)
  if (p) return p
  p = fetcher(url)
    .then((res) => {
      cache.set(url, res ?? null)
      inflight.delete(url)
      return res ?? null
    })
    .catch(() => {
      cache.set(url, null)
      inflight.delete(url)
      return null
    })
  inflight.set(url, p)
  return p
}

interface EnrichmentState {
  loading: boolean
  data: EnrichmentResult | null
}

function useEnrichment(url: string): EnrichmentState | null {
  const fetcher = useEnrichmentFetcher()
  const initial: EnrichmentState =
    fetcher && url
      ? { loading: !cache.has(url), data: cache.get(url) ?? null }
      : { loading: false, data: null }
  const [state, setState] = useState<EnrichmentState>(initial)

  useEffect(() => {
    if (!fetcher || !url) {
      setState({ loading: false, data: null })
      return
    }
    if (cache.has(url)) {
      setState({ loading: false, data: cache.get(url) ?? null })
      return
    }
    setState({ loading: true, data: null })
    let mounted = true
    fetchOnce(url, fetcher).then((data) => {
      if (mounted) setState({ loading: false, data })
    })
    return () => {
      mounted = false
    }
  }, [fetcher, url])

  if (!fetcher) return null
  return state
}

export const EnrichmentLinkCard: FC<LinkCardRendererProps> = (props) => {
  const { url } = props
  const enrichment = useEnrichment(url)

  if (!enrichment) return <LinkCardRenderer {...props} />

  if (enrichment.loading) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        data-hide-print
        style={{ textDecoration: 'none' }}
      >
        <LinkCardSkeleton />
      </a>
    )
  }

  if (!enrichment.data) {
    return <LinkCardRenderer {...props} />
  }

  return <CardDispatcher data={enrichment.data} fallbackUrl={url} />
}

const CardDispatcher: FC<{ data: EnrichmentResult; fallbackUrl: string }> = ({
  data,
  fallbackUrl,
}) => {
  switch (data.category) {
    case 'github':
      return <GithubCard e={data} />
    case 'media':
      return <MediaCard e={data} />
    case 'book':
      return <BookCard e={data} />
    case 'music':
      return <MusicCard e={data} />
    case 'academic':
      return <AcademicCard e={data} />
    case 'code':
      return <CodeCard e={data} />
    case 'self':
      return <SelfCard e={data} />
    default:
      return <FallbackCard e={data} fallbackUrl={fallbackUrl} />
  }
}
