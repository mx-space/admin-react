// Static layout-chrome dimensions. Plain TS — not in theme contract; same value across themes.
// All header-bearing layout components MUST import `headerHeight` from here so headers
// share a global horizontal baseline.

export const chrome = {
  headerHeight: '44px',
  // Linear sidebar: 12px inset + 220px content + 12px inset = 244px
  sidebarWidthExpanded: '244px',
  sidebarWidthCollapsed: '56px',
  sidebarMobileWidth: '280px',
  // Linear sidebar 内部节奏
  sidebarHeaderHeight: '52px', // 工作区头：13 × 4
  sidebarRowHeight: '28px', // 一级 / 二级 / 分组标题之统一行高：7 × 4
  sidebarRowInsetX: '12px', // 容器左右留白，使选中条不贴边
  sidebarSectionGap: '24px', // 组间呼吸距：6 × 4
  sidebarIndent: '16px', // 子树缩进单位
  twoColListDefaultWidth: '360px',
  contentPaddingDesktop: '24px',
  contentPaddingMobile: '16px',
  setupCardMaxWidth: '480px',
  mobileBreakpoint: 768,
  tabletBreakpoint: 1024,
} as const

export type ChromeToken = keyof typeof chrome
