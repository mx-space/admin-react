import { style } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: themeContract.spacing.lg,
  padding: themeContract.spacing.md,
})

export const avatarStyle = style({
  width: 96,
  height: 96,
  borderRadius: themeContract.radius.full,
  overflow: 'hidden',
  background: themeContract.color.surface2,
  border: `1px solid ${themeContract.color.hairline}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: themeContract.color.inkSubtle,
  fontSize: 32,
  fontWeight: 600,
})

export const avatarImg = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

export const nameStyle = style({
  margin: 0,
  fontSize: 18,
  fontWeight: 600,
  letterSpacing: '-0.2px',
  color: themeContract.color.ink,
})

export const formStyle = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.sm,
})

export const errorStyle = style({
  fontSize: 13,
  color: themeContract.color.semanticDanger,
  minHeight: 18,
  textAlign: 'center',
})

export const altRowStyle = style({
  display: 'flex',
  justifyContent: 'center',
  gap: themeContract.spacing.sm,
  marginTop: themeContract.spacing.xs,
})

export const altButtonStyle = style({
  width: 38,
  height: 38,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: themeContract.radius.full,
  background: themeContract.color.surface2,
  border: `1px solid ${themeContract.color.hairline}`,
  color: themeContract.color.inkMuted,
  cursor: 'pointer',
  transition: 'background 120ms ease, color 120ms ease',
  selectors: {
    '&:hover': {
      background: themeContract.color.surface3,
      color: themeContract.color.ink,
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
})

export const skeletonStyle = style({
  height: 32,
  width: '60%',
  background: themeContract.color.surface2,
  borderRadius: themeContract.radius.sm,
})
