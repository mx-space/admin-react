import { style, styleVariants } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'
import { typography } from '~/styles/tokens/typography'

export const popupStyle = style({
  width: 280,
})

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: '8px 4px',
})

export const sectionLabelStyle = style({
  fontSize: typography.caption.size,
  color: themeContract.color.inkSubtle,
  fontWeight: 500,
  letterSpacing: 0.2,
  textTransform: 'uppercase',
  paddingInline: 4,
})

export const sectionDividerStyle = style({
  height: 1,
  background: themeContract.color.hairline,
  marginBlock: 2,
})

export const segmentedGroupStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  flexWrap: 'wrap',
})

export const segmentButtonRecipe = styleVariants({
  off: {
    height: 26,
    paddingInline: 10,
    fontSize: typography.bodySm.size,
    fontWeight: 450,
    color: themeContract.color.inkSubtle,
    background: 'transparent',
    border: `1px solid ${themeContract.color.hairline}`,
    borderRadius: themeContract.radius.sm,
    cursor: 'pointer',
    selectors: {
      '&:hover': {
        color: themeContract.color.ink,
        background: themeContract.color.surface2,
      },
      '&:focus-visible': {
        outline: `2px solid ${themeContract.color.primaryFocus}`,
        outlineOffset: 1,
      },
      '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
    },
  },
  on: {
    height: 26,
    paddingInline: 10,
    fontSize: typography.bodySm.size,
    fontWeight: 500,
    color: themeContract.color.ink,
    background: themeContract.color.surface3,
    border: `1px solid ${themeContract.color.hairlineStrong}`,
    borderRadius: themeContract.radius.sm,
    cursor: 'pointer',
    selectors: {
      '&:focus-visible': {
        outline: `2px solid ${themeContract.color.primaryFocus}`,
        outlineOffset: 1,
      },
    },
  },
})

export const checkRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 6px',
  borderRadius: themeContract.radius.xs,
  cursor: 'pointer',
  fontSize: typography.bodySm.size,
  color: themeContract.color.ink,
  selectors: {
    '&:hover': { background: themeContract.color.surface2 },
  },
})

export const categoryListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 180,
  overflow: 'auto',
})

export const tagInputRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  flexWrap: 'wrap',
  paddingInline: 4,
})

export const tagChipStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  height: 22,
  paddingInline: 8,
  borderRadius: 999,
  background: themeContract.color.surface3,
  color: themeContract.color.ink,
  fontSize: typography.caption.size,
})

export const tagChipRemoveStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 14,
  height: 14,
  border: 'none',
  background: 'transparent',
  color: themeContract.color.inkSubtle,
  cursor: 'pointer',
  selectors: {
    '&:hover': { color: themeContract.color.ink },
  },
})

export const popupFooterStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 6,
  paddingTop: 6,
  borderTop: `1px solid ${themeContract.color.hairline}`,
  marginTop: 4,
})

export const filterChipsStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  flexWrap: 'wrap',
  minWidth: 0,
})

export const filterChipStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  height: 24,
  paddingInline: 8,
  borderRadius: 999,
  background: themeContract.color.surface2,
  color: themeContract.color.ink,
  fontSize: typography.caption.size,
  border: 'none',
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'background 120ms ease, color 120ms ease',
  selectors: {
    '&:hover': {
      background: themeContract.color.surface3,
    },
    '&:focus-visible': {
      outline: `2px solid ${themeContract.color.primaryFocus}`,
      outlineOffset: 1,
    },
  },
})

export const filterChipCloseStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 12,
  height: 12,
  color: themeContract.color.inkSubtle,
})
