import { style } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'
import { chrome } from '~/styles/tokens'

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  background: themeContract.color.canvas,
})

export const bodyStyle = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'row',
  background: themeContract.color.canvas,
  '@media': {
    [`(max-width: ${chrome.mobileBreakpoint - 1}px)`]: {
      flexDirection: 'column',
    },
  },
})

export const listPaneStyle = style({
  flex: 'none',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRight: `1px solid ${themeContract.color.hairlineTertiary}`,
  background: themeContract.color.canvas,
  '@media': {
    [`(max-width: ${chrome.mobileBreakpoint - 1}px)`]: {
      width: '100%',
      height: 'auto',
      flex: 1,
      minHeight: 0,
      borderRight: 'none',
      borderBottom: `1px solid ${themeContract.color.hairlineTertiary}`,
    },
  },
})

export const listHeaderSlotStyle = style({
  flexShrink: 0,
})

export const detailPaneStyle = style({
  flex: 1,
  minWidth: 0,
  height: '100%',
  display: 'flex',
  background: themeContract.color.canvas,
})

export const detailDrawerInnerStyle = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  background: themeContract.color.canvas,
  color: themeContract.color.ink,
})

export const slotFillStyle = style({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
})
