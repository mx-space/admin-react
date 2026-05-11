import { style } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'
import { chrome } from '~/styles/tokens'
import { fontSize, fontWeight, typography } from '~/styles/tokens/typography'

const railWidth = '340px'

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  background: themeContract.color.canvas,
})

export const shellStyle = style({
  flex: 1,
  minHeight: 0,
  display: 'grid',
  gridTemplateColumns: `minmax(0, 1fr) ${railWidth}`,
  height: '100%',
  background: themeContract.color.canvas,
  '@media': {
    [`(max-width: 1024px)`]: {
      gridTemplateColumns: '1fr',
    },
  },
})

export const editorColStyle = style({
  minWidth: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
})

export const editorScrollStyle = style({
  flex: 1,
  minHeight: 0,
})

export const editorInnerStyle = style({
  width: '100%',
  maxWidth: '780px',
  marginInline: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.md,
  paddingInline: themeContract.spacing.xl,
  paddingTop: '48px',
  paddingBottom: '120px',
  '@media': {
    [`(max-width: ${chrome.mobileBreakpoint - 1}px)`]: {
      paddingInline: themeContract.spacing.md,
      paddingTop: themeContract.spacing.lg,
      paddingBottom: themeContract.spacing.xxl,
    },
  },
})

export const titleRowStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.xs,
})

export const hairlineStyle = style({
  height: 1,
  background: themeContract.color.hairlineTertiary,
  marginBlock: themeContract.spacing.sm,
})

export const railStyle = style({
  height: '100%',
  borderLeft: `1px solid ${themeContract.color.hairlineTertiary}`,
  background: themeContract.color.canvas,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  '@media': {
    [`(max-width: 1024px)`]: {
      borderLeft: 'none',
      borderTop: `1px solid ${themeContract.color.hairlineTertiary}`,
    },
  },
})

export const railScrollStyle = style({
  flex: 1,
  minHeight: 0,
})

export const railInnerStyle = style({
  padding: themeContract.spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.md,
})

export const railSectionHeadingStyle = style({
  margin: 0,
  fontSize: fontSize.xs,
  fontWeight: Number(fontWeight.semibold),
  color: themeContract.color.inkTertiary,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
})

export const stateMessageStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  fontSize: typography.bodySm.size,
  color: themeContract.color.inkSubtle,
})

export const deleteConfirmInputStyle = style({
  marginTop: themeContract.spacing.sm,
})
