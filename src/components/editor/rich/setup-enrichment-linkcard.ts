import {
  enhancedEditRendererConfig,
  enhancedRendererConfig,
} from '@haklex/rich-kit-shiro'

import { EnrichmentLinkCard } from './EnrichmentLinkCard'

let patched = false

export function patchLinkCardWithEnrichment(): void {
  if (patched) return
  patched = true
  ;(enhancedEditRendererConfig as { LinkCard?: unknown }).LinkCard =
    EnrichmentLinkCard
  ;(enhancedRendererConfig as { LinkCard?: unknown }).LinkCard =
    EnrichmentLinkCard
}

patchLinkCardWithEnrichment()
