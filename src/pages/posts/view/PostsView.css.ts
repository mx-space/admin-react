import { style, styleVariants } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'
import { typography } from '~/styles/tokens/typography'

/**
 * Posts-list typography (Linear-aligned compact-list density).
 *
 * Design rule: only TWO font sizes (13/12), only TWO weights (500/450).
 * Visual hierarchy is carried by **weight + color**, not size.
 *
 *   row title   → typography.listTitle  (13/500/normal/ink)
 *   row meta    → typography.listMeta   (13/450/normal/inkSubtle)
 *   row label   → typography.listLabel  (12/450/normal/inkMuted)  for chips
 *   pane title  → typography.listTitle  applied at the same size
 *
 * Vertical rhythm: row min-height 57 (matches Linear's inbox row exactly);
 * 10px top/bottom padding + 4px between title and meta lines + line-height
 * normal (≈ 1.2 of font size, font-intrinsic, no override).
 *
 * Icon sizes: row-start (Pin) = 14; inline-meta (BookOpen / ThumbsUp) = 12;
 * status-dot diameter = 7. (Linear's 16/14/12 scale, scaled down by 2 for
 * the row-start since pin glyph is square not round.)
 */

const ROW_MIN_HEIGHT = 57
const ROW_PAD_X = 16
const ROW_PAD_Y = 10
const META_GAP = 12

export const paneHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 44,
  padding: '0 12px 0 16px',
  borderBottom: `1px solid ${themeContract.color.hairline}`,
  flexShrink: 0,
})

export const paneTitleStyle = style({
  fontSize: typography.listTitle.size,
  fontWeight: Number(typography.listTitle.weight),
  lineHeight: typography.listTitle.lineHeight,
  color: themeContract.color.ink,
  display: 'flex',
  alignItems: 'baseline',
  gap: 8,
})

export const paneCountStyle = style({
  fontSize: typography.listMeta.size,
  fontWeight: Number(typography.listMeta.weight),
  lineHeight: typography.listMeta.lineHeight,
  color: themeContract.color.inkSubtle,
})

export const paneActionsStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
})

export const listContainerStyle = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minWidth: 0,
})

export const listBodyStyle = style({
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
})

export const listInnerStyle = style({
  display: 'flex',
  flexDirection: 'column',
})

export const paginationBarStyle = style({
  flexShrink: 0,
  borderTop: `1px solid ${themeContract.color.hairline}`,
  padding: '8px 12px',
  display: 'flex',
  justifyContent: 'flex-end',
})

export const rowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  minHeight: ROW_MIN_HEIGHT,
  padding: `${ROW_PAD_Y}px ${ROW_PAD_X}px`,
  borderBottom: `1px solid ${themeContract.color.hairlineTertiary}`,
  cursor: 'pointer',
  position: 'relative',
  transition: 'background 120ms ease',
  selectors: {
    '&:hover': {
      background: themeContract.color.surface1,
    },
  },
})

export const rowVariantStyle = styleVariants({
  default: {
    background: 'transparent',
  },
  active: {
    background: themeContract.color.surface3,
  },
  selected: {
    background: 'rgba(94,106,210,0.10)',
    boxShadow: `inset 2px 0 0 0 ${themeContract.color.primary}`,
    paddingLeft: ROW_PAD_X - 2,
  },
  activeSelected: {
    background: 'rgba(94,106,210,0.18)',
    boxShadow: `inset 2px 0 0 0 ${themeContract.color.primary}`,
    paddingLeft: ROW_PAD_X - 2,
  },
})

export const rowPinSlotStyle = style({
  width: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: themeContract.color.primary,
  flexShrink: 0,
})

export const rowBodyStyle = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
})

export const rowTitleLineStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  minWidth: 0,
})

export const rowTitleStyle = style({
  fontSize: typography.listTitle.size,
  fontWeight: Number(typography.listTitle.weight),
  lineHeight: typography.listTitle.lineHeight,
  letterSpacing: typography.listTitle.letterSpacing,
  color: themeContract.color.ink,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flex: 1,
  minWidth: 0,
})

/**
 * Single shared meta-line preset. All meta items render at 13/450/inkSubtle
 * — color tweaks (category/time) override only the color, never the size.
 */
export const rowMetaLineStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: META_GAP,
  fontSize: typography.listMeta.size,
  fontWeight: Number(typography.listMeta.weight),
  lineHeight: typography.listMeta.lineHeight,
  color: themeContract.color.inkSubtle,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
})

export const rowMetaItemStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  flexShrink: 0,
})

/**
 * Category meta — slightly brighter than other meta items so it acts as the
 * row's secondary anchor (Linear's "label chip" lightness role, but applied
 * inline). Same 13px / weight 450 — only the color changes.
 */
export const rowMetaCategoryStyle = style({
  color: themeContract.color.inkMuted,
})

export const rowMetaTimeStyle = style({
  marginLeft: 'auto',
  flexShrink: 0,
  color: themeContract.color.inkTertiary,
})

export const statusDotStyle = styleVariants({
  published: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: themeContract.color.semanticSuccess,
    flexShrink: 0,
  },
  draft: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: themeContract.color.inkTertiary,
    flexShrink: 0,
  },
})

export const stateContainerStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  minHeight: 240,
  padding: 24,
})

export const skeletonRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  minHeight: ROW_MIN_HEIGHT,
  padding: `${ROW_PAD_Y}px ${ROW_PAD_X}px`,
  borderBottom: `1px solid ${themeContract.color.hairlineTertiary}`,
})

