import { request } from '~/lib/request'

export interface EnrichmentImage {
  url: string
  width?: number
  height?: number
  alt?: string
  blurhash?: string
}

export interface EnrichmentAttribute {
  key: string
  value: string | number | boolean
  label?: string
  format?: 'number' | 'rating' | 'date' | 'percent' | 'text' | 'duration'
}

export interface EnrichmentResult {
  title: string
  description?: string
  image?: EnrichmentImage
  url: string
  category: string
  subtype?: string
  publishedAt?: string
  fetchedAt: string
  attributes?: EnrichmentAttribute[]
  color?: string
  links?: { rel: string; url: string; label?: string }[]
}

export const enrichmentApi = {
  resolve: (url: string, lang?: string) =>
    request<EnrichmentResult>('/enrichment/resolve', {
      query: lang ? { url, lang } : { url },
    }),
}
