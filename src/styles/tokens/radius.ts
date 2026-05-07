export const radius = {
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  xxl: '24px',
  pill: '9999px',
  full: '9999px',
} as const

export type RadiusToken = keyof typeof radius
