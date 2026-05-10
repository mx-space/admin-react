import { style } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'
import { typography } from '~/styles/tokens/typography'

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  gap: themeContract.spacing.sm,
  paddingBlock: themeContract.spacing.xl,
  paddingInline: themeContract.spacing.lg,
  color: themeContract.color.inkSubtle,
})

export const iconStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '48px',
  borderRadius: themeContract.radius.full,
  background: themeContract.color.surface2,
  color: themeContract.color.inkSubtle,
  marginBlockEnd: themeContract.spacing.xxs,
})

export const titleStyle = style({
  margin: 0,
  fontFamily: themeContract.fontFamily.display,
  fontSize: typography.body.size,
  fontWeight: 500,
  color: themeContract.color.ink,
})

export const descriptionStyle = style({
  margin: 0,
  maxWidth: '40ch',
  fontFamily: themeContract.fontFamily.text,
  fontSize: typography.bodySm.size,
  lineHeight: typography.bodySm.lineHeight,
  color: themeContract.color.inkSubtle,
})

export const actionStyle = style({
  marginBlockStart: themeContract.spacing.xs,
})
