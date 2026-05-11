import { style } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'

export const bodyEditorStyle = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 200,
  paddingBlock: themeContract.spacing.xs,
  color: themeContract.color.ink,
})
