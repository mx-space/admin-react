import { style } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'
import { chrome } from '~/styles/tokens'

export const rootStyle = style({
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: themeContract.spacing.lg,
  background: themeContract.color.canvas,
  isolation: 'isolate',
  overflow: 'hidden',
})

export const bgStyle = style({
  position: 'absolute',
  inset: 0,
  zIndex: -1,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  opacity: 0.32,
  filter: 'saturate(0.85)',
  '@media': {
    [`(max-width: ${chrome.mobileBreakpoint - 1}px)`]: {
      display: 'none',
    },
  },
})

export const overlayStyle = style({
  position: 'absolute',
  inset: 0,
  zIndex: -1,
  background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${themeContract.color.canvas} 80%)`,
})

export const cardStyle = style({
  width: '100%',
  maxWidth: chrome.setupCardMaxWidth,
  padding: `${themeContract.spacing.xl} ${themeContract.spacing.lg}`,
  background: themeContract.color.surface1,
  border: `1px solid ${themeContract.color.hairline}`,
  borderRadius: themeContract.radius.lg,
  color: themeContract.color.ink,
  boxShadow: '0 24px 48px rgba(0, 0, 0, 0.45)',
  '@media': {
    [`(max-width: ${chrome.mobileBreakpoint - 1}px)`]: {
      maxWidth: 'none',
      padding: themeContract.spacing.lg,
      boxShadow: 'none',
    },
  },
})
