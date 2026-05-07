import { themeContract } from '../theme.css'

export const elevation = {
  flat: {
    background: themeContract.color.canvas,
    border: 'none',
    boxShadow: 'none',
  },
  raised: {
    background: themeContract.color.surface1,
    border: `1px solid ${themeContract.color.hairline}`,
    boxShadow: 'none',
  },
  raisedStrong: {
    background: themeContract.color.surface2,
    border: `1px solid ${themeContract.color.hairlineStrong}`,
    boxShadow: 'none',
  },
  popover: {
    background: themeContract.color.surface3,
    border: `1px solid ${themeContract.color.hairline}`,
    boxShadow: 'none',
  },
  focusRing: {
    outline: `2px solid ${themeContract.color.primaryFocus}`,
    outlineOffset: '2px',
    outlineColor: 'rgba(94, 105, 209, 0.5)',
  },
} as const

export type ElevationToken = keyof typeof elevation
