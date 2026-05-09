import { chrome } from '~/styles/tokens'
import { useUIStore } from '~/stores'

export interface ViewportInfo {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

export const useViewport = (): ViewportInfo => {
  const viewport = useUIStore((s) => s.viewport)
  const width = viewport.width
  return {
    width,
    height: viewport.height,
    isMobile: width > 0 && width < chrome.mobileBreakpoint,
    isTablet:
      width >= chrome.mobileBreakpoint && width < chrome.tabletBreakpoint,
    isDesktop: width >= chrome.tabletBreakpoint,
  }
}
