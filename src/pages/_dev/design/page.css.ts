import { keyframes, style } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'
import { typography } from '~/styles/tokens/typography'

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(12px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

export const page = style({
  minHeight: '100dvh',
  background: themeContract.color.canvas,
  color: themeContract.color.ink,
  paddingBlock: themeContract.spacing.section,
  paddingInline: themeContract.spacing.xl,
})

export const container = style({
  maxWidth: '1080px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.section,
})

export const eyebrow = style({
  fontFamily: themeContract.fontFamily.mono,
  fontSize: typography.eyebrow.size,
  fontWeight: Number(typography.eyebrow.weight),
  letterSpacing: typography.eyebrow.letterSpacing,
  lineHeight: typography.eyebrow.lineHeight,
  color: themeContract.color.inkSubtle,
  textTransform: 'uppercase',
})

export const heroEyebrow = style([
  eyebrow,
  {
    color: themeContract.color.primaryHover,
  },
])

export const heroTitle = style({
  fontFamily: themeContract.fontFamily.display,
  fontSize: typography.displayLg.size,
  fontWeight: Number(typography.displayLg.weight),
  lineHeight: typography.displayLg.lineHeight,
  letterSpacing: typography.displayLg.letterSpacing,
  margin: 0,
  color: themeContract.color.ink,
})

export const heroLede = style({
  fontFamily: themeContract.fontFamily.text,
  fontSize: typography.bodyLg.size,
  lineHeight: typography.bodyLg.lineHeight,
  letterSpacing: typography.bodyLg.letterSpacing,
  margin: 0,
  color: themeContract.color.inkMuted,
  maxWidth: '60ch',
})

export const hero = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.lg,
  paddingBlockEnd: themeContract.spacing.xl,
  borderBottom: `1px solid ${themeContract.color.hairline}`,
  animation: `${fadeUp} 0.4s ease-out both`,
})

export const heroLink = style({
  alignSelf: 'flex-start',
  fontFamily: themeContract.fontFamily.mono,
  fontSize: typography.caption.size,
  letterSpacing: typography.eyebrow.letterSpacing,
  textTransform: 'uppercase',
  color: themeContract.color.inkSubtle,
  textDecoration: 'none',
  paddingInline: themeContract.spacing.sm,
  paddingBlock: '6px',
  borderRadius: themeContract.radius.sm,
  border: `1px solid ${themeContract.color.hairline}`,
  background: themeContract.color.surface1,
  transition: 'color 160ms ease, border-color 160ms ease',
  selectors: {
    '&:hover': {
      color: themeContract.color.ink,
      borderColor: themeContract.color.hairlineStrong,
    },
  },
})

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.lg,
  animation: `${fadeUp} 0.5s ease-out both`,
})

export const sectionHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.xxs,
})

export const sectionTitle = style({
  fontFamily: themeContract.fontFamily.display,
  fontSize: typography.headline.size,
  fontWeight: Number(typography.headline.weight),
  lineHeight: typography.headline.lineHeight,
  letterSpacing: typography.headline.letterSpacing,
  margin: 0,
  color: themeContract.color.ink,
})

export const sectionLede = style({
  fontFamily: themeContract.fontFamily.text,
  fontSize: typography.body.size,
  lineHeight: typography.body.lineHeight,
  margin: 0,
  color: themeContract.color.inkSubtle,
  maxWidth: '60ch',
})

export const colorGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.sm,
})

export const colorGroupLabel = style([
  eyebrow,
  {
    paddingBottom: themeContract.spacing.xs,
    borderBottom: `1px solid ${themeContract.color.hairlineTertiary}`,
  },
])

export const colorGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: themeContract.spacing.sm,
})

export const swatch = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.xs,
})

export const swatchTile = style({
  height: '88px',
  borderRadius: themeContract.radius.md,
  border: `1px solid ${themeContract.color.hairline}`,
})

export const swatchLabel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
})

export const swatchName = style({
  fontFamily: themeContract.fontFamily.text,
  fontSize: typography.bodySm.size,
  fontWeight: 500,
  color: themeContract.color.ink,
})

export const swatchValue = style({
  fontFamily: themeContract.fontFamily.mono,
  fontSize: typography.caption.size,
  color: themeContract.color.inkSubtle,
  fontVariantNumeric: 'tabular-nums',
})

export const typeRow = style({
  display: 'grid',
  gridTemplateColumns: '120px 1fr',
  gap: themeContract.spacing.lg,
  alignItems: 'baseline',
  paddingBlock: themeContract.spacing.md,
  borderTop: `1px solid ${themeContract.color.hairlineTertiary}`,

  selectors: {
    '&:last-child': {
      borderBottom: `1px solid ${themeContract.color.hairlineTertiary}`,
    },
  },
})

export const typeMeta = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
})

export const typeName = style([
  eyebrow,
  {
    color: themeContract.color.ink,
  },
])

export const typeSpecs = style({
  fontFamily: themeContract.fontFamily.mono,
  fontSize: typography.caption.size,
  color: themeContract.color.inkTertiary,
  fontVariantNumeric: 'tabular-nums',
})

export const typeSpecimen = style({
  margin: 0,
  color: themeContract.color.ink,
})

export const spacingTable = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.xs,
})

export const spacingRow = style({
  display: 'grid',
  gridTemplateColumns: '80px 100px 1fr',
  gap: themeContract.spacing.md,
  alignItems: 'center',
  paddingBlock: themeContract.spacing.xs,
})

export const spacingName = style({
  fontFamily: themeContract.fontFamily.mono,
  fontSize: typography.bodySm.size,
  color: themeContract.color.ink,
})

export const spacingValue = style({
  fontFamily: themeContract.fontFamily.mono,
  fontSize: typography.caption.size,
  color: themeContract.color.inkSubtle,
  fontVariantNumeric: 'tabular-nums',
})

export const spacingBar = style({
  height: '8px',
  background: themeContract.color.primary,
  borderRadius: themeContract.radius.xs,
})

export const radiusGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
  gap: themeContract.spacing.md,
})

export const radiusCell = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.xs,
  alignItems: 'flex-start',
})

export const radiusTile = style({
  width: '100%',
  height: '88px',
  background: themeContract.color.surface2,
  border: `1px solid ${themeContract.color.hairlineStrong}`,
})

export const surfaceLadder = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: themeContract.spacing.md,
})

export const surfaceCard = style({
  padding: themeContract.spacing.lg,
  borderRadius: themeContract.radius.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.xs,
  minHeight: '160px',
})

export const motionGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: themeContract.spacing.md,
})

export const motionCell = style({
  padding: themeContract.spacing.md,
  borderRadius: themeContract.radius.md,
  background: themeContract.color.surface1,
  border: `1px solid ${themeContract.color.hairline}`,
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.sm,
  position: 'relative',
  overflow: 'hidden',
})

const slide = keyframes({
  '0%, 30%': { transform: 'translateX(0)' },
  '60%, 100%': { transform: 'translateX(calc(100% - 16px))' },
})

export const motionDot = style({
  width: '16px',
  height: '16px',
  borderRadius: themeContract.radius.pill,
  background: themeContract.color.primary,
  animation: `${slide} 2.4s infinite alternate`,
})
