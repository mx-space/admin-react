import { style } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'
import { typography } from '~/styles/tokens/typography'

export const formStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.md,
})

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.md,
  paddingBlockEnd: themeContract.spacing.md,
  borderBottom: `1px solid ${themeContract.color.hairlineTertiary}`,
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
      paddingBlockEnd: 0,
    },
  },
})

export const sectionHeaderStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
})

export const sectionTitleStyle = style({
  margin: 0,
  fontFamily: themeContract.fontFamily.display,
  fontSize: typography.body.size,
  fontWeight: 500,
  color: themeContract.color.ink,
})

export const sectionDescriptionStyle = style({
  margin: 0,
  fontSize: typography.bodySm.size,
  color: themeContract.color.inkSubtle,
})

export const fieldStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.xxs,
})

export const fieldRowStyle = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: themeContract.spacing.md,
  justifyContent: 'space-between',
})

export const labelStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontFamily: themeContract.fontFamily.text,
  fontSize: typography.bodySm.size,
  fontWeight: 500,
  color: themeContract.color.ink,
})

export const requiredMarkStyle = style({
  color: themeContract.color.semanticDanger,
  fontSize: typography.bodySm.size,
})

export const helpStyle = style({
  fontSize: typography.caption.size,
  color: themeContract.color.inkSubtle,
  lineHeight: typography.caption.lineHeight,
})

export const messageStyle = style({
  fontSize: typography.caption.size,
  color: themeContract.color.semanticDanger,
  lineHeight: typography.caption.lineHeight,
  margin: 0,
})

export const rootMessageStyle = style({
  padding: themeContract.spacing.sm,
  borderRadius: themeContract.radius.sm,
  border: `1px solid rgba(229, 72, 77, 0.34)`,
  background: 'rgba(229, 72, 77, 0.10)',
  color: themeContract.color.semanticDanger,
  fontSize: typography.bodySm.size,
})
