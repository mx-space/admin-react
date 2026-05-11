import { style } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'
import { fontWeight } from '~/styles/tokens/typography'

export const containerStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeContract.spacing.sm,
  fontSize: 13,
  lineHeight: 1.4,
  color: themeContract.color.inkTertiary,
  flexWrap: 'wrap',
})

export const chipStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  paddingBlock: 2,
  paddingInline: 8,
  borderRadius: themeContract.radius.pill,
  background: themeContract.color.surface3,
  color: themeContract.color.primary,
  fontSize: 12,
  fontWeight: Number(fontWeight.medium),
  flexShrink: 0,
})

export const metaStyle = style({
  color: themeContract.color.inkTertiary,
  flexShrink: 0,
})

export const linkStyle = style({
  background: 'transparent',
  border: 'none',
  padding: 0,
  margin: 0,
  font: 'inherit',
  color: themeContract.color.primary,
  cursor: 'pointer',
  flexShrink: 0,
  selectors: {
    '&:hover': {
      color: themeContract.color.primaryHover,
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
})

export const sepStyle = style({
  color: themeContract.color.hairlineStrong,
  userSelect: 'none',
  flexShrink: 0,
})
