import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'
import { chrome, typography } from '~/styles/tokens'

/* ============================================================
 * Linear sidebar 节奏：
 *   宽 244 = 12px inset + 220px content + 12px inset
 *   行 28、组距 24、头 52；皆为 4px baseline grid。
 *   字号收敛二档：12（组/计数）/ 13（导航项）。
 *   层级以 (明度阶 × 缩进 × 字重统一 500) 三轴协同表达。
 * ============================================================ */

export const sidebarRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
    background: themeContract.color.bgSidebar,
    // 不画 border-right：main 现为 inset card，与 sidebar 之间隔 canvas-gap，
    // 借 chrome 与 focal 之色阶自分，无需硬线。
    borderRight: 'none',
    overflow: 'hidden',
    fontFamily: themeContract.fontFamily.text,
    color: themeContract.color.inkSubtle,
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

/* ---------- L0 · Workspace header (52px) ---------- */

export const topRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeContract.spacing.xs,
  height: chrome.sidebarHeaderHeight,
  paddingInline: chrome.sidebarRowInsetX,
  flex: 'none',
})

export const orgChipStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeContract.spacing.xs,
  height: '32px',
  paddingInline: '8px',
  borderRadius: themeContract.radius.lg,
  cursor: 'pointer',
  flex: 1,
  minWidth: 0,
  background: 'transparent',
  border: 0,
  color: themeContract.color.ink,
  fontFamily: 'inherit',
  selectors: {
    '&:hover': { background: themeContract.color.bgSidebarRow },
  },
})

export const orgAvatarStyle = style({
  width: '20px',
  height: '20px',
  borderRadius: '5px',
  background: `linear-gradient(135deg, ${themeContract.color.primary}, ${themeContract.color.primaryHover})`,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: themeContract.color.onPrimary,
  fontWeight: typography.navGroup.weight,
  fontSize: '11px',
  flex: 'none',
})

export const orgNameStyle = style({
  fontSize: typography.navItem.size,
  fontWeight: typography.navItem.weight,
  letterSpacing: '-0.1px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: themeContract.color.ink,
  flex: 1,
})

export const orgChevronStyle = style({
  color: themeContract.color.inkSubtle,
  flex: 'none',
})

export const iconRowStyle = style({
  display: 'flex',
  gap: '2px',
  flex: 'none',
})

export const iconBtnStyle = style({
  width: '28px',
  height: '28px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 0,
  color: themeContract.color.inkSubtle,
  borderRadius: themeContract.radius.md,
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      background: themeContract.color.bgSidebarRow,
      color: themeContract.color.ink,
    },
  },
})

/* ---------- Scroll body ---------- */

export const scrollAreaStyle = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
})

export const scrollInnerStyle = style({
  width: '100%',
  paddingBlock: '4px',
  paddingInline: chrome.sidebarRowInsetX,
  display: 'flex',
  flexDirection: 'column',
})

/* ---------- Section (group) ---------- */

export const groupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  // 组间留白即层级，弃边框／背景块
  marginTop: chrome.sidebarSectionGap,
  selectors: {
    '&:first-child': { marginTop: 0 },
  },
})

export const groupHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeContract.spacing.xs,
  height: chrome.sidebarRowHeight,
  paddingLeft: '10px',
  paddingRight: '9px',
  background: 'transparent',
  border: 0,
  borderRadius: themeContract.radius.md,
  color: themeContract.color.inkSubtle,
  fontSize: typography.navGroup.size,
  fontWeight: typography.navGroup.weight,
  letterSpacing: '0',
  textTransform: 'none',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',
  selectors: {
    '&:hover': {
      color: themeContract.color.inkMuted,
      background: themeContract.color.bgSidebarRow,
    },
  },
})

export const groupHeaderLabelStyle = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const groupChevronStyle = style({
  color: 'inherit',
  flex: 'none',
  transition: 'transform 120ms ease',
  selectors: {
    '&[data-collapsed="true"]': { transform: 'rotate(-90deg)' },
  },
})

/* ---------- NavItem ---------- */

export const itemRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: themeContract.spacing.xs,
    height: chrome.sidebarRowHeight,
    paddingLeft: '10px',
    paddingRight: '9px',
    marginBlock: '1px',
    borderRadius: themeContract.radius.md,
    fontSize: typography.navItem.size,
    // 字重统一 500：层级不靠 weight，靠 color
    fontWeight: typography.navItem.weight,
    lineHeight: typography.navItem.lineHeight,
    letterSpacing: '0',
    // default · L=60 (text-tertiary)
    color: themeContract.color.inkSubtle,
    textDecoration: 'none',
    cursor: 'pointer',
    minWidth: 0,
    transition: 'background 120ms ease, color 120ms ease',
    selectors: {
      // hover · L=90 (text-secondary)
      '&:hover:not([data-active])': {
        background: themeContract.color.bgSidebarRow,
        color: themeContract.color.inkMuted,
      },
    },
  },
  variants: {
    active: {
      true: {
        // active · L=100 (text-primary) + bgSidebarRow
        background: themeContract.color.bgSidebarRow,
        color: themeContract.color.ink,
      },
    },
    stub: {
      // disabled · L=36 (text-quaternary)
      true: {
        color: themeContract.color.inkTertiary,
      },
    },
    collapsed: {
      true: {
        justifyContent: 'center',
        paddingInline: '6px',
      },
    },
  },
})

export const itemIconStyle = style({
  width: '16px',
  height: '16px',
  flex: 'none',
  color: 'currentColor',
})

export const itemLabelStyle = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

/* Counter pill — 仅当 count ≥ 1 显，99+ 截断 */
export const counterStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '18px',
  height: '18px',
  paddingInline: '6px',
  background: themeContract.color.bgSidebarChip,
  borderRadius: themeContract.radius.pill,
  color: themeContract.color.inkSubtle,
  fontSize: typography.navGroup.size,
  fontWeight: typography.navGroup.weight,
  letterSpacing: '0',
  flex: 'none',
  selectors: {
    // 当父行 active 时 pill 不换底，唯文本提亮
    '[data-active] &': {
      color: themeContract.color.ink,
    },
  },
})

export const itemBadgeStyle = style({
  fontSize: '10px',
  color: themeContract.color.inkTertiary,
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
  flex: 'none',
})

/* ---------- L4 · Nested subtree (team children) ---------- */

export const subtreeStyle = style({
  position: 'relative',
  paddingLeft: chrome.sidebarIndent,
  // 1px hairline 连接线，自父项延伸至末端子项
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      // 与父行 icon 中线对齐：10 (paddingLeft) + 8 (icon 中线) = 18
      left: '18px',
      top: 0,
      bottom: 0,
      width: '1px',
      background: themeContract.color.sidebarTreeLine,
    },
  },
})

/* ---------- User chip (bottom) ---------- */

export const userChipStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeContract.spacing.xs,
  paddingBlock: '8px',
  paddingInline: chrome.sidebarRowInsetX,
  borderTop: `1px solid ${themeContract.color.hairlineTertiary}`,
  flex: 'none',
})

export const userAvatarStyle = style({
  width: '24px',
  height: '24px',
  borderRadius: themeContract.radius.pill,
  background: themeContract.color.bgSidebarChip,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '10px',
  fontWeight: typography.navGroup.weight,
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
  fontSize: typography.navItem.size,
  fontWeight: typography.navItem.weight,
  color: themeContract.color.ink,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const userRoleStyle = style({
  fontSize: typography.navGroup.size,
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
  fontSize: typography.navItem.size,
  fontWeight: typography.navItem.weight,
  color: themeContract.color.ink,
  background: 'transparent',
  border: 0,
  borderRadius: themeContract.radius.md,
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
