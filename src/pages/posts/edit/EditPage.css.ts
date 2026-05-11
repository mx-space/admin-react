import { style } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'
import { chrome } from '~/styles/tokens'
import { typography } from '~/styles/tokens/typography'

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
  display: 'grid',
  gridTemplateColumns: '360px 1fr',
  gap: 0,
  width: '100%',
  height: '100%',
})

export const railStyle = style({
  borderRight: `1px solid ${themeContract.color.hairlineTertiary}`,
  padding: chrome.contentPaddingDesktop,
  fontSize: typography.bodySm.size,
  color: themeContract.color.inkSubtle,
  overflow: 'auto',
  minHeight: 0,
})

export const editorStyle = style({
  padding: chrome.contentPaddingDesktop,
  fontSize: typography.bodySm.size,
  color: themeContract.color.inkSubtle,
  overflow: 'auto',
  minHeight: 0,
})

export const stateMessageStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  fontSize: typography.bodySm.size,
  color: themeContract.color.inkSubtle,
})
