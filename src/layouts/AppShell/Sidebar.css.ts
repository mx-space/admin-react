import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'
import { chrome } from '~/styles/tokens'

export const sidebarRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
    background: themeContract.color.surface1,
    borderRight: `1px solid ${themeContract.color.hairlineTertiary}`,
    overflow: 'hidden',
  },
  variants: {
    collapsed: {
      true: { width: chrome.sidebarWidthCollapsed },
      false: { width: chrome.sidebarWidthExpanded },
    },
    mobile: {
      true: {
        width: '100%',
        borderRight: 'none',
      },
    },
  },
  defaultVariants: {
    collapsed: false,
    mobile: false,
  },
})

export const topRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: themeContract.spacing.xs,
  paddingBlock: '10px',
  paddingInline: '12px',
  flex: 'none',
})

export const orgChipStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeContract.spacing.xs,
  paddingBlock: '4px',
  paddingInline: '6px',
  borderRadius: themeContract.radius.sm,
  cursor: 'pointer',
  flex: 1,
  minWidth: 0,
  background: 'transparent',
  border: 0,
  color: themeContract.color.ink,
  fontFamily: themeContract.fontFamily.text,
  selectors: {
    '&:hover': { background: themeContract.color.surface2 },
  },
})

export const orgAvatarStyle = style({
  width: '22px',
  height: '22px',
  borderRadius: '5px',
  background: `linear-gradient(135deg, ${themeContract.color.primary}, ${themeContract.color.primaryHover})`,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: themeContract.color.onPrimary,
  fontWeight: 600,
  fontSize: '11px',
  flex: 'none',
})

export const orgNameStyle = style({
  fontWeight: 600,
  fontSize: '13px',
  letterSpacing: '-0.1px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const iconBtnStyle = style({
  width: '24px',
  height: '24px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 0,
  color: themeContract.color.inkSubtle,
  borderRadius: themeContract.radius.xs,
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      background: themeContract.color.surface2,
      color: themeContract.color.ink,
    },
  },
})

export const scrollAreaStyle = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
})

export const scrollInnerStyle = style({
  width: '100%',
  paddingBlock: '4px',
  paddingInline: '8px',
})

export const groupStyle = style({
  marginTop: themeContract.spacing.md,
})

export const groupHeaderStyle = style({
  paddingBlock: '4px',
  paddingInline: '8px',
  color: themeContract.color.inkTertiary,
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.4px',
  textTransform: 'uppercase',
})

export const itemRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: themeContract.spacing.xs,
    paddingBlock: '6px',
    paddingInline: '8px',
    borderRadius: themeContract.radius.sm,
    fontSize: '13px',
    color: themeContract.color.inkMuted,
    textDecoration: 'none',
    cursor: 'pointer',
    minWidth: 0,
    selectors: {
      '&:hover:not([data-active])': {
        background: themeContract.color.surface2,
        color: themeContract.color.ink,
      },
    },
  },
  variants: {
    active: {
      true: {
        // v1 calibration: 太亮（surface3）则突兀，宜介 surface2/3 之间
        background: '#1a1c20',
        color: themeContract.color.ink,
      },
    },
    stub: {
      true: { color: themeContract.color.inkSubtle, opacity: 0.85 },
    },
    collapsed: {
      true: { justifyContent: 'center', paddingInline: '6px' },
    },
  },
})

export const itemIconStyle = style({
  width: '14px',
  height: '14px',
  flex: 'none',
})

export const itemLabelStyle = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const itemBadgeStyle = style({
  fontSize: '10px',
  color: themeContract.color.inkTertiary,
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
})

export const userChipStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeContract.spacing.xs,
  paddingBlock: '8px',
  paddingInline: '10px',
  borderTop: `1px solid ${themeContract.color.hairlineTertiary}`,
  flex: 'none',
})

export const userAvatarStyle = style({
  width: '22px',
  height: '22px',
  borderRadius: '50%',
  background: themeContract.color.surface4,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '10px',
  color: themeContract.color.inkMuted,
  flex: 'none',
})

export const userMetaStyle = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  lineHeight: 1.2,
})

export const userNameStyle = style({
  fontSize: '13px',
  color: themeContract.color.ink,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const userRoleStyle = style({
  fontSize: '11px',
  color: themeContract.color.inkTertiary,
})

export const popoverPanelStyle = style({
  minWidth: '200px',
  background: themeContract.color.surface3,
  border: `1px solid ${themeContract.color.hairline}`,
  borderRadius: themeContract.radius.md,
  padding: '4px',
  boxShadow: '0 12px 24px rgba(0,0,0,0.45)',
  color: themeContract.color.ink,
  zIndex: themeContract.zIndex.popover,
})

export const popoverItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeContract.spacing.xs,
  width: '100%',
  paddingBlock: '6px',
  paddingInline: '10px',
  fontSize: '13px',
  color: themeContract.color.ink,
  background: 'transparent',
  border: 0,
  borderRadius: themeContract.radius.sm,
  cursor: 'pointer',
  textAlign: 'left',
  selectors: {
    '&:hover': {
      background: themeContract.color.surface4,
    },
    '&[disabled]': { opacity: 0.5, cursor: 'not-allowed' },
  },
})

export type SidebarVariants = NonNullable<RecipeVariants<typeof sidebarRecipe>>
export type ItemVariants = NonNullable<RecipeVariants<typeof itemRecipe>>
