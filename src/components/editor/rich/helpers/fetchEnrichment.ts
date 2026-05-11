import { enrichmentApi } from '~/api/enrichment'
import type { EnrichmentResult } from '~/api/enrichment'

export const fetchEnrichment = (
  url: string,
): Promise<EnrichmentResult | null> =>
  enrichmentApi.resolve(url).catch(() => null)
