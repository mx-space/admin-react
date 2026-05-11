export const fontFamily = {
  display:
    "'Inter Variable', 'Inter', 'SF Pro Display', -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif",
  text: "'Inter Variable', 'Inter', 'SF Pro Text', -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
} as const

export type FontFamilyToken = keyof typeof fontFamily

/**
 * Atomic typographic axes — pick one size + one weight for any new component.
 * Linear-aligned: keep size deltas small (1-2 px) and let weight + color
 * carry hierarchy.
 */
export const fontSize = {
  xs: '11px',
  sm: '12px',
  md: '13px',
  base: '14px',
  lg: '16px',
} as const
export type FontSizeToken = keyof typeof fontSize

export const fontWeight = {
  regular: '450',
  medium: '500',
  semibold: '600',
} as const
export type FontWeightToken = keyof typeof fontWeight

/**
 * Icon size scale matching Linear:
 *   lg (16) — primary semantic icon at row start
 *   md (14) — secondary status / action icon
 *   sm (12) — icon embedded inside a chip / inline with text
 */
export const iconSize = { lg: 16, md: 14, sm: 12 } as const
export type IconSizeToken = keyof typeof iconSize

/**
 * Composed presets ("size+weight+lineHeight+color hint" bundles).
 *
 * Existing display/headline/body/caption are preserved for marketing-style
 * surfaces. New `list*` and `chip` presets capture the Linear-aligned
 * compact-list density used by inbox / posts list / notes list / etc.
 *
 * Linear notes (line-height: normal = font intrinsic ≈ 1.2):
 *   listTitle  — primary row title; the only "highlighted" text on a row
 *   listMeta   — status / id / time / counts; identical metric, color-only
 *                differentiation
 *   listLabel  — chip body text on coloured backgrounds (slightly lighter
 *                color to balance contrast on tinted surfaces)
 */
export const typography = {
  displayXl: {
    size: '80px',
    weight: '600',
    lineHeight: '1.05',
    letterSpacing: '-3px',
  },
  displayLg: {
    size: '56px',
    weight: '600',
    lineHeight: '1.10',
    letterSpacing: '-1.8px',
  },
  displayMd: {
    size: '40px',
    weight: '600',
    lineHeight: '1.15',
    letterSpacing: '-1px',
  },
  headline: {
    size: '28px',
    weight: '600',
    lineHeight: '1.20',
    letterSpacing: '-0.6px',
  },
  cardTitle: {
    size: '22px',
    weight: '500',
    lineHeight: '1.25',
    letterSpacing: '-0.4px',
  },
  subhead: {
    size: '20px',
    weight: '400',
    lineHeight: '1.40',
    letterSpacing: '-0.2px',
  },
  bodyLg: {
    size: '18px',
    weight: '400',
    lineHeight: '1.50',
    letterSpacing: '-0.1px',
  },
  body: {
    size: '16px',
    weight: '400',
    lineHeight: '1.50',
    letterSpacing: '-0.05px',
  },
  bodySm: {
    size: '14px',
    weight: '400',
    lineHeight: '1.50',
    letterSpacing: '0',
  },
  caption: {
    size: '12px',
    weight: '400',
    lineHeight: '1.40',
    letterSpacing: '0',
  },
  button: {
    size: '14px',
    weight: '500',
    lineHeight: '1.20',
    letterSpacing: '0',
  },
  eyebrow: {
    size: '13px',
    weight: '500',
    lineHeight: '1.30',
    letterSpacing: '0.4px',
  },
  mono: {
    size: '13px',
    weight: '400',
    lineHeight: '1.50',
    letterSpacing: '0',
  },
  listTitle: {
    size: fontSize.md,
    weight: fontWeight.medium,
    lineHeight: 'normal',
    letterSpacing: '0',
  },
  listMeta: {
    size: fontSize.md,
    weight: fontWeight.regular,
    lineHeight: 'normal',
    letterSpacing: '0',
  },
  listLabel: {
    size: fontSize.sm,
    weight: fontWeight.regular,
    lineHeight: 'normal',
    letterSpacing: '0',
  },
  /**
   * Sidebar 一级 / 二级导航项 — Linear 风：字重 500、字号 13，
   * 不以大小立层级，唯凭明度阶 + 缩进 + 字重定主次。
   */
  navItem: {
    size: fontSize.md,
    weight: fontWeight.medium,
    lineHeight: 'normal',
    letterSpacing: '0',
  },
  /**
   * Sidebar 分组标题 / Counter pill 通用规格 — 12 / 500，
   * 仅以颜色 (text-tertiary) 与导航项区分，不用字重。
   */
  navGroup: {
    size: fontSize.sm,
    weight: fontWeight.medium,
    lineHeight: 'normal',
    letterSpacing: '0',
  },
} as const

export type TypographyToken = keyof typeof typography
