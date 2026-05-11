import { style } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'
import { fontSize, fontWeight, typography } from '~/styles/tokens/typography'

export const paneStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  background: themeContract.color.surface1,
})

export const scrollWrapStyle = style({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
})

export const bodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.md,
  paddingInline: themeContract.spacing.lg,
  paddingBlock: themeContract.spacing.lg,
  minWidth: 0,
})

export const titleInputStyle = style({
  width: '100%',
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: themeContract.color.ink,
  fontFamily: themeContract.fontFamily.display,
  fontSize: '24px',
  fontWeight: Number(fontWeight.semibold),
  lineHeight: 1.25,
  letterSpacing: '-0.4px',
  padding: 0,
  selectors: {
    '&::placeholder': {
      color: themeContract.color.inkTertiary,
    },
  },
})

export const titleRenderStyle = style({
  cursor: 'text',
  color: themeContract.color.ink,
  fontFamily: themeContract.fontFamily.display,
  fontSize: '24px',
  fontWeight: Number(fontWeight.semibold),
  lineHeight: 1.25,
  letterSpacing: '-0.4px',
  minHeight: 30,
  selectors: {
    '&[data-empty="true"]': {
      color: themeContract.color.inkTertiary,
    },
  },
})

export const metaStripStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeContract.spacing.sm,
  fontSize: typography.listMeta.size,
  fontWeight: Number(typography.listMeta.weight),
  color: themeContract.color.inkSubtle,
  flexWrap: 'wrap',
})

export const metaItemStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
})

export const metaDotStyle = style({
  width: 6,
  height: 6,
  borderRadius: '50%',
  flexShrink: 0,
})

export const metaDotPublishedStyle = style({
  background: themeContract.color.semanticSuccess,
})

export const metaDotDraftStyle = style({
  background: themeContract.color.inkTertiary,
})

export const metaLinkStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  color: themeContract.color.inkSubtle,
  textDecoration: 'none',
  borderRadius: themeContract.radius.xs,
  padding: '2px 4px',
  selectors: {
    '&:hover': {
      color: themeContract.color.ink,
      background: themeContract.color.surface2,
    },
  },
})

export const hairlineStyle = style({
  height: 1,
  background: themeContract.color.hairlineTertiary,
  marginBlock: themeContract.spacing.sm,
})

export const propsListStyle = style({
  display: 'flex',
  flexDirection: 'column',
})

export const propRowStyle = style({
  display: 'grid',
  gridTemplateColumns: '88px minmax(0, 1fr)',
  alignItems: 'start',
  gap: themeContract.spacing.sm,
  paddingBlock: themeContract.spacing.xs,
  minHeight: 36,
})

export const propLabelStyle = style({
  fontSize: fontSize.sm,
  fontWeight: Number(fontWeight.regular),
  color: themeContract.color.inkSubtle,
  paddingTop: 6,
  userSelect: 'none',
})

export const propValueStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.xxs,
  minWidth: 0,
})

export const propRenderStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  minHeight: 28,
  paddingInline: 6,
  borderRadius: themeContract.radius.xs,
  cursor: 'text',
  color: themeContract.color.ink,
  fontSize: fontSize.md,
  selectors: {
    '&:hover': {
      background: themeContract.color.surface1,
    },
    '&[data-empty="true"]': {
      color: themeContract.color.inkTertiary,
    },
  },
})

export const propEditStyle = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minWidth: 0,
})

export const propErrorStyle = style({
  fontSize: typography.caption.size,
  color: themeContract.color.semanticDanger,
  margin: 0,
  paddingInline: 6,
})

export const switchRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeContract.spacing.sm,
})

export const pinOrderStyle = style({
  width: 80,
})

export const stateStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  minHeight: 240,
  padding: themeContract.spacing.lg,
})

export const skeletonStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.sm,
  padding: themeContract.spacing.lg,
})

export const tagChipsRowStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 4,
  width: '100%',
})

export const deleteConfirmInputStyle = style({
  marginTop: themeContract.spacing.sm,
})
