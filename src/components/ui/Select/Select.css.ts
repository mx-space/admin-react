import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'
import { typography } from '~/styles/tokens/typography'

const enterMs = 160
const exitMs = 120
const enterEase = 'cubic-bezier(0.2, 0, 0, 1)'

export const triggerRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: themeContract.spacing.xs,
    background: themeContract.color.surface1,
    border: `1px solid ${themeContract.color.hairline}`,
    color: themeContract.color.ink,
    fontFamily: themeContract.fontFamily.text,
    fontSize: typography.bodySm.size,
    lineHeight: typography.bodySm.lineHeight,
    cursor: 'pointer',
    userSelect: 'none',
    borderRadius: themeContract.radius.md,
    transition: `background 160ms ${enterEase}, border-color 160ms ${enterEase}, opacity 160ms ${enterEase}`,
    selectors: {
      '&:hover:not([data-disabled])': {
        background: themeContract.color.surface2,
        borderColor: themeContract.color.hairlineStrong,
      },
      '&[data-popup-open], &[data-pressed]': {
        borderColor: themeContract.color.primaryFocus,
      },
      '&[data-disabled]': {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
      '&:focus-visible': {
        outline: `2px solid ${themeContract.color.primaryFocus}`,
        outlineOffset: '2px',
      },
    },
  },
  variants: {
    size: {
      sm: {
        height: '28px',
        paddingInline: themeContract.spacing.sm,
        fontSize: '13px',
      },
      md: {
        height: '34px',
        paddingInline: themeContract.spacing.md,
      },
      lg: {
        height: '42px',
        paddingInline: themeContract.spacing.lg,
        fontSize: '15px',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const valueStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  flex: 1,
  minWidth: 0,
  textAlign: 'left',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const iconStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  color: themeContract.color.inkSubtle,
  transition: `transform 160ms ${enterEase}`,
  selectors: {
    '[data-popup-open] &': {
      transform: 'rotate(180deg)',
    },
  },
})

export const positionerStyle = style({
  zIndex: themeContract.zIndex.popover,
})

export const popupStyle = style({
  background: themeContract.color.surface2,
  color: themeContract.color.ink,
  border: `1px solid ${themeContract.color.hairline}`,
  borderRadius: themeContract.radius.md,
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.40)',
  paddingBlock: themeContract.spacing.xxs,
  minWidth: 'var(--anchor-width)',
  maxHeight: 'min(320px, var(--available-height))',
  display: 'flex',
  outline: 'none',
  opacity: 1,
  transform: 'translateY(0)',
  transition: `opacity ${enterMs}ms ${enterEase}, transform ${enterMs}ms ${enterEase}`,
  selectors: {
    '&[data-starting-style], &[data-ending-style]': {
      opacity: 0,
      transform: 'translateY(-4px)',
    },
    '&[data-ending-style]': { transitionDuration: `${exitMs}ms` },
  },
})

export const itemRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: themeContract.spacing.xs,
    paddingInline: themeContract.spacing.sm,
    paddingBlock: '6px',
    fontFamily: themeContract.fontFamily.text,
    fontSize: typography.bodySm.size,
    lineHeight: typography.bodySm.lineHeight,
    cursor: 'pointer',
    userSelect: 'none',
    borderRadius: themeContract.radius.sm,
    margin: `0 ${themeContract.spacing.xxs}`,
    transition: `background 120ms ${enterEase}, color 120ms ${enterEase}`,
    selectors: {
      '&[data-highlighted]': {
        background: themeContract.color.surface3,
      },
      '&[data-disabled]': {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
    },
  },
})

export const itemIndicatorStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: 'auto',
  color: themeContract.color.primary,
})

export type TriggerVariants = NonNullable<RecipeVariants<typeof triggerRecipe>>
