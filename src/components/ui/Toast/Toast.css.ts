import { style } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'

export const toasterStyle = style({
  vars: {
    '--normal-bg': themeContract.color.surface2,
    '--normal-text': themeContract.color.ink,
    '--normal-border': themeContract.color.hairlineStrong,
    '--success-bg': themeContract.color.surface2,
    '--success-text': themeContract.color.semanticSuccess,
    '--success-border': themeContract.color.hairlineStrong,
    '--error-bg': themeContract.color.surface2,
    '--error-text': themeContract.color.semanticDanger,
    '--error-border': themeContract.color.hairlineStrong,
    '--warning-bg': themeContract.color.surface2,
    '--warning-text': themeContract.color.semanticWarning,
    '--warning-border': themeContract.color.hairlineStrong,
    '--info-bg': themeContract.color.surface2,
    '--info-text': themeContract.color.semanticInfo,
    '--info-border': themeContract.color.hairlineStrong,
  },
})

export const toastStyle = style({
  fontFamily: themeContract.fontFamily.text,
  borderRadius: themeContract.radius.lg,
  border: `1px solid ${themeContract.color.hairlineStrong}`,
})
