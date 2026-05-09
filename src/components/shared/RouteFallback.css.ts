import { style } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'

export const fallbackStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  minHeight: '160px',
  color: themeContract.color.inkSubtle,
})
