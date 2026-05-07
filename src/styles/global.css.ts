import { globalStyle } from '@vanilla-extract/css'

import { themeContract } from './theme.css'
import { typography } from './tokens/typography'

globalStyle('html', {
  colorScheme: 'dark',
  background: themeContract.color.canvas,
  color: themeContract.color.ink,
})

globalStyle('html.dark', {
  background: themeContract.color.canvas,
  color: themeContract.color.ink,
})

globalStyle('body', {
  fontFamily: themeContract.fontFamily.text,
  fontSize: typography.body.size,
  fontWeight: Number(typography.body.weight),
  lineHeight: typography.body.lineHeight,
  letterSpacing: typography.body.letterSpacing,
  background: themeContract.color.canvas,
  color: themeContract.color.ink,
})

globalStyle('code, pre, kbd, samp', {
  fontFamily: themeContract.fontFamily.mono,
})

globalStyle('::selection', {
  background: themeContract.color.primary,
  color: themeContract.color.onPrimary,
})
