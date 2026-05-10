import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.lg,
})

export const stepperStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: themeContract.spacing.xs,
})

export const stepDotStyle = recipe({
  base: {
    width: 36,
    height: 36,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: themeContract.radius.full,
    border: `1px solid ${themeContract.color.hairline}`,
    background: themeContract.color.surface2,
    color: themeContract.color.inkSubtle,
    cursor: 'default',
    transition: 'background 120ms ease, color 120ms ease',
  },
  variants: {
    state: {
      active: {
        background: themeContract.color.primary,
        color: themeContract.color.onPrimary,
        borderColor: themeContract.color.primary,
      },
      completed: {
        background: themeContract.color.surface3,
        color: themeContract.color.ink,
        borderColor: themeContract.color.hairlineStrong,
        cursor: 'pointer',
      },
      pending: {},
    },
  },
  defaultVariants: { state: 'pending' },
})

export const stepConnectorStyle = style({
  width: 24,
  height: 1,
  background: themeContract.color.hairline,
})

export const headStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: themeContract.spacing.xxs,
})

export const titleStyle = style({
  margin: 0,
  fontSize: 20,
  fontWeight: 600,
  color: themeContract.color.ink,
  letterSpacing: '-0.3px',
})

export const subtitleStyle = style({
  margin: 0,
  fontSize: 13,
  color: themeContract.color.inkSubtle,
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
  display: 'flex',
  alignItems: 'center',
  gap: 4,
})

export const requiredMarkStyle = style({
  color: themeContract.color.semanticDanger,
})

export const formStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.sm,
})

export const gridTwoStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: themeContract.spacing.sm,
})

export const actionsStyle = style({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: themeContract.spacing.sm,
})

export const heroIconStyle = style({
  alignSelf: 'center',
  width: 72,
  height: 72,
  borderRadius: themeContract.radius.full,
  background: themeContract.color.surface2,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: themeContract.color.primary,
  border: `1px solid ${themeContract.color.hairline}`,
})

export const ctaRowStyle = style({
  display: 'flex',
  gap: themeContract.spacing.sm,
})

export const helperTextStyle = style({
  fontSize: 12,
  color: themeContract.color.inkSubtle,
  textAlign: 'center',
})

export const errorTextStyle = style({
  fontSize: 12,
  color: themeContract.color.semanticDanger,
  minHeight: 16,
})
