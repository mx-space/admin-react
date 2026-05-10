import { style, styleVariants } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { color, radius, spacing } from '~/styles/tokens'

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  background: color.surface1,
  border: `1px solid ${color.hairline}`,
  borderRadius: radius.sm,
  overflow: 'hidden',
})

export const scrollViewportStyle = style({
  width: '100%',
})

export const tableStyle = style({
  width: '100%',
  // 'separate' (with zero spacing) is necessary for `position: sticky` on
  // <thead> to behave correctly across browsers; it also sidesteps the
  // sub-pixel shimmer that border-collapse causes when adjacent row
  // backgrounds change (selection toggling).
  borderCollapse: 'separate',
  borderSpacing: 0,
  fontFamily: 'inherit',
  fontSize: '12.5px',
  lineHeight: 1.45,
  color: color.ink,
})

export const theadStyle = style({
  position: 'sticky',
  top: 0,
  zIndex: 1,
  background: color.surface2,
})

export const headerRowStyle = style({
  // pin header row height so toggling the select-all checkbox icon
  // (null ↔ MinusIcon ↔ CheckIcon) inside its inline-flex indicator
  // can't shift the inline baseline of the row.
  height: '38px',
})

export const headerCellRecipe = recipe({
  base: {
    padding: `0 ${spacing.sm}`,
    fontWeight: 500,
    fontSize: '11px',
    // fixed-px line-height instead of unitless: any inline-flex child whose
    // intrinsic baseline shifts (icon presence inside the checkbox indicator)
    // can't extend the line box past this value.
    lineHeight: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: color.inkSubtle,
    // box-shadow instead of border-bottom — avoids border-collapse interaction
    // with the first body row's bg change.
    boxShadow: `inset 0 -1px 0 ${color.hairline}`,
    background: color.surface2,
    textAlign: 'left',
    verticalAlign: 'middle',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  variants: {
    sortable: {
      true: {
        cursor: 'pointer',
        selectors: {
          '&:hover': { color: color.ink },
        },
      },
    },
    sorted: {
      true: { color: color.ink },
    },
    align: {
      start: { textAlign: 'left' },
      center: { textAlign: 'center' },
      end: { textAlign: 'right' },
    },
  },
})

export const sortIconStyle = style({
  display: 'inline-block',
  marginLeft: '4px',
  color: color.inkTertiary,
  fontSize: '10px',
  verticalAlign: 'middle',
})

export const sortIconActiveStyle = style({
  color: color.primary,
})

export const tbodyStyle = style({})

export const rowRecipe = recipe({
  base: {
    transition: 'background 120ms ease',
    selectors: {
      '&:hover': { background: color.surface2 },
    },
  },
  variants: {
    selected: {
      true: {
        background: 'rgba(94, 106, 210, 0.08)',
        selectors: {
          '&:hover': { background: 'rgba(94, 106, 210, 0.12)' },
        },
      },
    },
    clickable: {
      true: { cursor: 'pointer' },
    },
  },
})

export const cellRecipe = recipe({
  base: {
    // box-shadow instead of border-bottom: avoids sub-pixel jitter when the
    // row background changes (selected/hover) under border-collapse:separate.
    boxShadow: `inset 0 -1px 0 ${color.surface3}`,
    fontSize: '12.5px',
    // fixed-px line-height locks vertical metrics regardless of inline-flex
    // children (e.g. checkbox indicator icon presence/absence).
    lineHeight: '20px',
    color: color.ink,
    verticalAlign: 'middle',
  },
  variants: {
    density: {
      compact: { padding: `6px ${spacing.sm}`, fontSize: '12px' },
      comfortable: { padding: `11px ${spacing.sm}` },
      roomy: { padding: `14px ${spacing.sm}` },
    },
    align: {
      start: { textAlign: 'left' },
      center: { textAlign: 'center' },
      end: { textAlign: 'right' },
    },
  },
  defaultVariants: { density: 'comfortable' },
})

export const lastRowCellStyle = style({
  boxShadow: 'none',
})

export const emptyRowStyle = style({
  padding: '60px 20px',
  textAlign: 'center',
})

export const skeletonRowStyle = style({
  boxShadow: `inset 0 -1px 0 ${color.surface3}`,
})

export const skeletonCellStyle = style({
  padding: `11px ${spacing.sm}`,
})

export const paginationFooterStyle = style({
  borderTop: `1px solid ${color.hairline}`,
  background: color.surface1,
  padding: `${spacing.xxs} ${spacing.sm}`,
})

export const selectionCellRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export const densityToggleStyle = style({
  display: 'inline-flex',

  overflow: 'hidden',
  fontSize: '10.5px',
})

export const densityToggleButtonRecipe = recipe({
  base: {
    padding: '3px 8px',
    background: color.surface1,
    color: color.inkSubtle,
    border: 0,
    cursor: 'pointer',
    borderRight: `1px solid ${color.hairlineStrong}`,
    selectors: {
      '&:last-child': { borderRight: 0 },
      '&:hover': { color: color.ink },
    },
  },
  variants: {
    active: {
      true: { background: color.surface2, color: color.ink },
    },
  },
})

export const densityVariant = styleVariants({
  compact: { fontSize: '12px' },
  comfortable: { fontSize: '12.5px' },
  roomy: { fontSize: '13px' },
})
