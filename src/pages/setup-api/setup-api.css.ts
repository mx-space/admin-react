import { style } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.lg,
  alignItems: 'center',
})

export const heroStyle = style({
  width: 64,
  height: 64,
  borderRadius: themeContract.radius.full,
  background: themeContract.color.surface2,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: themeContract.color.primary,
  border: `1px solid ${themeContract.color.hairline}`,
})

export const headStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: themeContract.spacing.xxs,
})

export const titleStyle = style({
  margin: 0,
  fontSize: 18,
  fontWeight: 600,
  color: themeContract.color.ink,
})

export const subtitleStyle = style({
  margin: 0,
  fontSize: 13,
  color: themeContract.color.inkSubtle,
})

export const formStyle = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.sm,
})

export const fieldStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.xxs,
})

export const labelStyle = style({
  fontSize: 12,
  fontWeight: 500,
  color: themeContract.color.inkMuted,
})

export const persistRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${themeContract.spacing.xs} 0`,
  fontSize: 13,
  color: themeContract.color.inkMuted,
})

export const checkboxStyle = style({
  width: 16,
  height: 16,
  accentColor: themeContract.color.primary,
})

export const actionsStyle = style({
  display: 'flex',
  gap: themeContract.spacing.xs,
})
