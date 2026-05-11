import { style, styleVariants } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'
import { typography } from '~/styles/tokens/typography'

export const externalLinkFullStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 28,
  paddingInline: '10px',
  background: 'transparent',
  border: 'none',
  color: themeContract.color.inkSubtle,
  borderRadius: themeContract.radius.sm,
  cursor: 'pointer',
  fontSize: typography.bodySm.size,
  fontWeight: 500,
  textDecoration: 'none',
  transition: 'background 120ms ease, color 120ms ease',
  flexShrink: 0,
  selectors: {
    '&:hover': {
      background: themeContract.color.surface2,
      color: themeContract.color.ink,
    },
    '&:focus-visible': {
      outline: `2px solid ${themeContract.color.primaryFocus}`,
      outlineOffset: 1,
    },
  },
})

export const breadcrumbStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: typography.bodySm.size,
  fontWeight: 450,
  color: themeContract.color.inkSubtle,
  minWidth: 0,
  flex: 1,
})

export const breadcrumbCrumbStyle = style({
  color: themeContract.color.inkSubtle,
  flexShrink: 0,
})

export const breadcrumbSepStyle = style({
  color: themeContract.color.inkTertiary,
  flexShrink: 0,
})

export const breadcrumbCurrentStyle = style({
  color: themeContract.color.ink,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
})

export const saveIndicatorStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: typography.caption.size,
  color: themeContract.color.inkSubtle,
  whiteSpace: 'nowrap',
})

export const saveDotRecipe = styleVariants({
  pending: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: themeContract.color.inkTertiary,
    flexShrink: 0,
  },
  saving: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: themeContract.color.inkTertiary,
    flexShrink: 0,
  },
  saved: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: themeContract.color.semanticSuccess,
    flexShrink: 0,
  },
  error: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: themeContract.color.semanticDanger,
    flexShrink: 0,
  },
})

export const saveHistoryLinkStyle = style({
  background: 'transparent',
  border: 'none',
  color: themeContract.color.primaryHover,
  cursor: 'pointer',
  padding: 0,
  font: 'inherit',
  selectors: {
    '&:hover': { textDecoration: 'underline' },
  },
})

export const draftBadgeCompareBtnStyle = style({
  background: 'transparent',
  border: 'none',
  color: themeContract.color.primaryHover,
  cursor: 'pointer',
  padding: 0,
  marginLeft: 6,
  font: 'inherit',
  selectors: {
    '&:hover': { textDecoration: 'underline' },
  },
})

export const publishMenuRootStyle = style({
  display: 'inline-flex',
  alignItems: 'stretch',
  flexShrink: 0,
})

export const publishSplitPrimaryStyle = style({
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderRight: 'none',
})

export const publishSplitChevronStyle = style({
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  paddingInline: 8,
})

export const publishCompactPrimaryStyle = style({
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderRight: 'none',
})

export const publishCompactChevronStyle = style({
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  paddingInline: 6,
})

export const menuListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 200,
  paddingBlock: 4,
})

export const menuItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 10px',
  background: 'transparent',
  border: 'none',
  color: themeContract.color.ink,
  fontSize: typography.bodySm.size,
  fontWeight: 450,
  cursor: 'pointer',
  textAlign: 'left',
  borderRadius: themeContract.radius.xs,
  selectors: {
    '&:hover': { background: themeContract.color.surface3 },
    '&:focus-visible': {
      outline: 'none',
      background: themeContract.color.surface3,
    },
    '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
  },
})

export const menuItemDangerStyle = style({
  color: themeContract.color.semanticDanger,
  selectors: {
    '&:hover': { background: 'rgba(229, 72, 77, 0.10)' },
  },
})

export const menuSeparatorStyle = style({
  height: 1,
  background: themeContract.color.hairline,
  marginBlock: 4,
})
