import { style } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'

export const rootStyle = style({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
})

export const viewportStyle = style({
  width: '100%',
  height: '100%',
  outline: 'none',
})

export const scrollbarStyle = style({
  position: 'absolute',
  display: 'flex',
  touchAction: 'none',
  userSelect: 'none',
  padding: '2px',
  background: 'transparent',
  opacity: 0,
  transition: 'opacity 200ms ease',
  selectors: {
    '&[data-orientation=vertical]': {
      top: 0,
      right: 0,
      width: '8px',
      height: '100%',
    },
    '&[data-orientation=horizontal]': {
      left: 0,
      bottom: 0,
      height: '8px',
      width: '100%',
      flexDirection: 'column',
    },
    '&[data-hovering], &[data-scrolling]': {
      opacity: 1,
    },
  },
})

export const thumbStyle = style({
  flex: 1,
  background: themeContract.color.hairlineStrong,
  borderRadius: themeContract.radius.full,
  transition: 'background 160ms ease',
  selectors: {
    '&:hover': {
      background: themeContract.color.inkSubtle,
    },
  },
})

export const cornerStyle = style({
  background: 'transparent',
})
