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

export const navRow = style({
  display: 'flex',
  gap: themeContract.spacing.sm,
  marginTop: themeContract.spacing.sm,
})

export const navLink = style({
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

export const subEyebrow = style([
  eyebrow,
  {
    color: themeContract.color.inkTertiary,
    paddingBottom: themeContract.spacing.xs,
    borderBottom: `1px solid ${themeContract.color.hairlineTertiary}`,
  },
])

export const cluster = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.md,
})

export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: themeContract.spacing.sm,
})

export const rowBaseline = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  gap: themeContract.spacing.md,
})

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: themeContract.spacing.md,
})

export const gridSurfaceCells = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: themeContract.spacing.md,
})

export const cellLabel = style([
  eyebrow,
  {
    color: themeContract.color.inkSubtle,
  },
])

export const labelStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.xs,
  flex: 1,
  minWidth: '200px',
})

export const inlineLabel = style({
  fontFamily: themeContract.fontFamily.mono,
  fontSize: typography.caption.size,
  color: themeContract.color.inkSubtle,
})

export const codeline = style({
  fontFamily: themeContract.fontFamily.mono,
  fontSize: typography.caption.size,
  color: themeContract.color.inkSubtle,
  fontVariantNumeric: 'tabular-nums',
})

export const cardTitle = style({
  fontFamily: themeContract.fontFamily.display,
  fontSize: typography.cardTitle.size,
  fontWeight: Number(typography.cardTitle.weight),
  lineHeight: typography.cardTitle.lineHeight,
  letterSpacing: typography.cardTitle.letterSpacing,
  margin: 0,
  color: themeContract.color.ink,
})

export const cardDescription = style({
  margin: 0,
  marginTop: themeContract.spacing.xxs,
  color: themeContract.color.inkSubtle,
  fontSize: typography.bodySm.size,
  lineHeight: typography.bodySm.lineHeight,
})

export const modalText = style({
  margin: 0,
  color: themeContract.color.inkMuted,
  fontSize: typography.body.size,
  lineHeight: typography.body.lineHeight,
})

export const iconBox = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'currentColor',
})
