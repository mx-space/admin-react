// Static layout-chrome dimensions. Plain TS — not in theme contract; same value across themes.
// All header-bearing layout components MUST import `headerHeight` from here so headers
// share a global horizontal baseline.

export const chrome = {
  headerHeight: '44px',
  sidebarWidthExpanded: '232px',
  sidebarWidthCollapsed: '56px',
  sidebarMobileWidth: '280px',
  twoColListDefaultWidth: '360px',
  contentPaddingDesktop: '24px',
  contentPaddingMobile: '16px',
  setupCardMaxWidth: '480px',
  mobileBreakpoint: 768,
  tabletBreakpoint: 1024,
} as const

export type ChromeToken = keyof typeof chrome
