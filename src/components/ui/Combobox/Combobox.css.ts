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
    gap: themeContract.spacing.xs,
    width: '100%',
    minWidth: 0,
    background: themeContract.color.surface1,
    border: `1px solid ${themeContract.color.hairline}`,
    color: themeContract.color.ink,
    fontFamily: themeContract.fontFamily.text,
    fontSize: typography.bodySm.size,
    lineHeight: typography.bodySm.lineHeight,
    cursor: 'text',
    borderRadius: themeContract.radius.md,
    transition: `background 160ms ${enterEase}, border-color 160ms ${enterEase}, opacity 160ms ${enterEase}`,
    selectors: {
      '&:hover:not([data-disabled])': {
        borderColor: themeContract.color.hairlineStrong,
      },
      '&[data-popup-open], &:focus-within': {
        borderColor: themeContract.color.primaryFocus,
      },
      '&[data-disabled]': {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    size: {
      sm: {
        minHeight: '28px',
        paddingInline: themeContract.spacing.sm,
        paddingBlock: '2px',
        fontSize: '13px',
      },
      md: {
        minHeight: '32px',
        paddingInline: themeContract.spacing.sm,
        paddingBlock: '3px',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const inputStyle = style({
  flex: 1,
  minWidth: '4ch',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: themeContract.color.ink,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  lineHeight: 'inherit',
  padding: 0,
  selectors: {
    '&::placeholder': {
      color: themeContract.color.inkTertiary,
    },
    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
})

export const chipsStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: themeContract.spacing.xxs,
  flex: 1,
  minWidth: 0,
})

export const chipStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: themeContract.spacing.xxs,
  paddingInline: themeContract.spacing.xs,
  paddingBlock: '2px',
  background: themeContract.color.surface3,
  color: themeContract.color.ink,
  border: `1px solid ${themeContract.color.hairline}`,
  borderRadius: themeContract.radius.sm,
  fontFamily: themeContract.fontFamily.text,
  fontSize: typography.listLabel.size,
  lineHeight: typography.listLabel.lineHeight,
  userSelect: 'none',
  selectors: {
    '&[data-highlighted]': {
      borderColor: themeContract.color.primaryFocus,
      background: themeContract.color.surface4,
    },
    '&[data-disabled]': {
      opacity: 0.5,
    },
  },
})

export const chipRemoveStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '14px',
  height: '14px',
  padding: 0,
  background: 'transparent',
  border: 'none',
  color: themeContract.color.inkSubtle,
  cursor: 'pointer',
  borderRadius: themeContract.radius.xs,
  transition: `color 120ms ${enterEase}, background 120ms ${enterEase}`,
  selectors: {
    '&:hover': {
      color: themeContract.color.ink,
      background: themeContract.color.surface4,
    },
  },
})

export const clearStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '18px',
  height: '18px',
  padding: 0,
  background: 'transparent',
  border: 'none',
  color: themeContract.color.inkSubtle,
  cursor: 'pointer',
  borderRadius: themeContract.radius.xs,
  transition: `color 120ms ${enterEase}, background 120ms ${enterEase}`,
  selectors: {
    '&:hover': {
      color: themeContract.color.ink,
      background: themeContract.color.surface3,
    },
  },
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

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
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

export const emptyStyle = style({
  paddingInline: themeContract.spacing.sm,
  paddingBlock: themeContract.spacing.sm,
  color: themeContract.color.inkSubtle,
  fontFamily: themeContract.fontFamily.text,
  fontSize: typography.bodySm.size,
  textAlign: 'center',
})

export const groupStyle = style({
  display: 'flex',
  flexDirection: 'column',
})

export const groupLabelStyle = style({
  paddingInline: themeContract.spacing.sm,
  paddingBlock: '6px',
  fontFamily: themeContract.fontFamily.mono,
  fontSize: typography.caption.size,
  letterSpacing: typography.eyebrow.letterSpacing,
  textTransform: 'uppercase',
  color: themeContract.color.inkTertiary,
})

export type TriggerVariants = NonNullable<RecipeVariants<typeof triggerRecipe>>
