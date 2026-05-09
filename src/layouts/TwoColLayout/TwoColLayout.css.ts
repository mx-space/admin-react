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
  borderRight: `1px solid ${themeContract.color.hairlineTertiary}`,
  overflow: 'auto',
  background: themeContract.color.canvas,
  '@media': {
    [`(max-width: ${chrome.mobileBreakpoint - 1}px)`]: {
      width: '100%',
      height: 'auto',
      flex: 1,
      borderRight: 'none',
      borderBottom: `1px solid ${themeContract.color.hairlineTertiary}`,
    },
  },
})

export const detailPaneStyle = style({
  flex: 1,
  minWidth: 0,
  height: '100%',
  overflow: 'auto',
  background: themeContract.color.canvas,
})

export const detailDrawerInnerStyle = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  background: themeContract.color.canvas,
  color: themeContract.color.ink,
})
