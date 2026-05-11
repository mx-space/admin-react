/**
 * Linear-aligned 双主题 token (Light hue 282 ↔ Dark hue 272)
 *
 * 直采 LCH 通道实测值，色相、明度、彩度三者皆显式：
 *   - L 通道：Light + Dark 之 L 和 ≈ 100 (主题对偶之数学锚点)
 *   - C 通道：暗主题略提至 0.3–3，避免黑底"发暖"显脏
 *   - h 通道：Light 282° / Dark 272°，差 10°，暗下沉得更冷
 *
 * 三层约束：
 *   1. 组件只消费无后缀语义名 (color.surface1 / color.ink 等)
 *   2. 状态色独立 fg/bg 配对；两主题各自配色，不受明度反转规则约束
 *   3. 新增任何语义 token，L 通道之 Light+Dark 须落 [95,105] 区间
 */

/* ------------------------------------------------------------------
 *  Dark palette · hue 272 · 偏冷蓝
 * ------------------------------------------------------------------ */
export const darkColor = {
  // — Brand / interactive accent (跨主题共用色相)
  primary: '#5e6ad2',
  primaryHover: '#828fff',
  primaryFocus: '#5e69d1',
  brandSecure: '#7a7fad',
  onPrimary: '#ffffff',

  // — Surface ladder · 直对 Linear bg-base/quaternary/secondary/tertiary
  canvas: 'lch(4.52% 0.3 272)', // bg-base
  surface1: 'lch(6.77% 0.75 272)', // bg-quaternary — 默认卡 / 面板
  surface2: 'lch(9.02% 2.1 272)', // bg-secondary — hover / selected
  surface3: 'lch(11.27% 3 272)', // bg-tertiary — popover / chip
  surface4: 'lch(15.32% 1.38 272)', // floating / 强 hover

  // — Sidebar 专色
  // bgSidebar 与 canvas 同色：sidebar 与 AppShell 外层共构一 chrome 面，
  // 仅 mainStyle (inset card) 之 surface1 单独显焦。token 仍存以表语义之异。
  bgSidebar: 'lch(4.52% 0.3 272)', // = canvas
  bgSidebarRow: 'lch(9.02% 2.1 272)', // hover / selected — 较 chrome 抬一档
  bgSidebarChip: 'lch(11.27% 3 272)', // counter pill — 再抬一档
  sidebarTreeLine: 'lch(15.32% 1.38 272)', // border-tertiary

  // — Hairline · 三档须皆较 surface1 (L=6.77) 明，否则与 card 同明全失
  hairline: 'lch(12% 1.38 272)', // 常规分隔线 — clearly visible
  hairlineStrong: 'lch(18% 1.38 272)', // 强分隔 / section header
  hairlineTertiary: 'lch(9.5% 1 272)', // whisper — sub-section, 仍可辨

  // — Inverse (反主题取色，登录 hero / 品牌等强制浅)
  inverseCanvas: 'lch(98.94% 0.5 282)',
  inverseSurface1: 'lch(93.44% 0.5 282)',
  inverseSurface2: 'lch(91.94% 0.5 282)',
  inverseInk: 'lch(9.89% 0 282)',

  // — Ink ladder · L 100 → 90 → 60 → 36 (Linear 实测)
  ink: 'lch(100% 0 272)',
  inkMuted: 'lch(90.35% 1.15 272)',
  inkSubtle: 'lch(60.30% 1.15 272)',
  inkTertiary: 'lch(36.30% 1.15 272)',

  // — Status (fg + tinted bg 配对；Dark 取深 bg)
  semanticSuccess: '#40b956',
  semanticSuccessBg: '#0e1d11',
  semanticDanger: '#ff8583',
  semanticDangerBg: '#2c1113',
  semanticWarning: '#ff8647',
  semanticWarningBg: '#1f190d',
  semanticInfo: '#67d9ff',
  semanticInfoBg: '#091d20',
  semanticOverlay: 'rgba(0, 0, 0, 0.65)',
} as const

/* ------------------------------------------------------------------
 *  Light palette · hue 282 · 偏紫蓝 — 与 Dark 之 L 镜像 (和 ≈ 100)
 * ------------------------------------------------------------------ */
export const lightColor: Record<keyof typeof darkColor, string> = {
  // — Brand
  primary: '#5e6ad2',
  primaryHover: '#4e5ac0',
  primaryFocus: '#3f4bb0',
  brandSecure: '#7a7fad',
  onPrimary: '#ffffff',

  // — Surface ladder · 与 Dark L 通道反演
  canvas: 'lch(95.94% 0.5 282)', // bg-base · Linear 实测
  surface1: 'lch(98.94% 0.5 282)', // bg-primary
  surface2: 'lch(93.44% 0.5 282)', // bg-secondary — hover
  surface3: 'lch(91.94% 0.5 282)', // bg-tertiary — chip / popover
  surface4: 'lch(85.44% 0 282)', // floating · 与 border-tertiary 同 L

  // — Sidebar 专色
  // bgSidebar 与 canvas 同色：sidebar 与 AppShell 外层共构一 chrome 面，
  // 仅 mainStyle (inset card) 之 surface1 单独显焦。token 仍存以表语义之异。
  bgSidebar: 'lch(95.94% 0.5 282)', // = canvas
  bgSidebarRow: 'lch(91.94% 0.5 282)', // hover / selected — 较 chrome 深一档
  bgSidebarChip: 'lch(89.49% 0 282)', // counter pill — 再深一档
  sidebarTreeLine: 'lch(85.44% 0 282)', // 子树连线

  // — Hairline (Light 中之描边) · 须皆较 surface1 (L=98.94) 暗，方能现
  hairline: 'lch(89% 0.5 282)', // 常规分隔线
  hairlineStrong: 'lch(82% 0.5 282)', // 强分隔
  hairlineTertiary: 'lch(94% 0.5 282)', // whisper — 微差于 surface1

  // — Inverse (Light 反向取深色)
  inverseCanvas: 'lch(4.52% 0.3 272)',
  inverseSurface1: 'lch(6.77% 0.75 272)',
  inverseSurface2: 'lch(9.02% 2.1 272)',
  inverseInk: 'lch(100% 0 272)',

  // — Ink ladder · L 9.89 → 19.79 → 39.58 → 65.30 (Linear 实测)
  ink: 'lch(9.89% 0 282)',
  inkMuted: 'lch(19.79% 1.25 282)',
  inkSubtle: 'lch(39.58% 1.25 282)',
  inkTertiary: 'lch(65.30% 1.25 282)',

  // — Status (Light 取饱和 fg + 浅 tinted bg)
  semanticSuccess: '#26a544',
  semanticSuccessBg: '#d5ffd6',
  semanticDanger: '#eb5757',
  semanticDangerBg: '#ffe7de',
  semanticWarning: '#ff7235',
  semanticWarningBg: '#ffeac6',
  semanticInfo: '#007def',
  semanticInfoBg: '#dbffff',
  semanticOverlay: 'rgba(0, 0, 0, 0.45)',
}

/**
 * Default export = dark palette。
 * 该 alias 仅供文档展示及向后兼容；新代码勿直接引用，
 * 一律走 `themeContract.color.*` 以参主题切换。
 */
export const color = darkColor

export type ColorToken = keyof typeof darkColor
