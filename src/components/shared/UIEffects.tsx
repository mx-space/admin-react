import { useEffect } from 'react'

import { useUIStore } from '~/stores'

export const UIEffects = () => {
  const refreshIsDark = useUIStore((s) => s.refreshIsDark)
  const updateViewport = useUIStore((s) => s.updateViewport)

  useEffect(() => {
    refreshIsDark()
    const onResize = () => updateViewport(window.innerWidth, window.innerHeight)
    onResize()
    window.addEventListener('resize', onResize)

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onMediaChange = () => refreshIsDark()
    media.addEventListener('change', onMediaChange)

    return () => {
      window.removeEventListener('resize', onResize)
      media.removeEventListener('change', onMediaChange)
    }
  }, [refreshIsDark, updateViewport])

  return null
}
