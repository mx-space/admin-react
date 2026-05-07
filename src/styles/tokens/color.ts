export const color = {
  primary: '#5e6ad2',
  primaryHover: '#828fff',
  primaryFocus: '#5e69d1',
  brandSecure: '#7a7fad',
  onPrimary: '#ffffff',

  canvas: '#010102',
  surface1: '#0f1011',
  surface2: '#181a1c',
  surface3: '#1f2124',
  surface4: '#26282b',

  hairline: '#23252a',
  hairlineStrong: '#2f3137',
  hairlineTertiary: '#1a1c20',

  inverseCanvas: '#ffffff',
  inverseSurface1: '#f5f5f5',
  inverseSurface2: '#ebebeb',
  inverseInk: '#0c0d0e',

  ink: '#f7f8f8',
  inkMuted: '#d0d6e0',
  inkSubtle: '#8a8f98',
  inkTertiary: '#62666d',

  semanticSuccess: '#27a644',
  semanticOverlay: 'rgba(0, 0, 0, 0.65)',
  semanticDanger: '#e5484d',
  semanticWarning: '#f5a524',
  semanticInfo: '#3e63dd',
} as const

export type ColorToken = keyof typeof color
