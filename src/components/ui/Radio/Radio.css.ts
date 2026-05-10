import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'

const easing = 'cubic-bezier(0.2, 0, 0, 1)'

export const groupRecipe = recipe({
  base: {
    display: 'flex',
    minWidth: 0,
  },
  variants: {
    orientation: {
      horizontal: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: themeContract.spacing.lg,
        flexWrap: 'wrap',
      },
      vertical: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: themeContract.spacing.sm,
      },
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

export const rootRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
    background: themeContract.color.surface1,
    border: `1px solid ${themeContract.color.hairlineStrong}`,
    borderRadius: themeContract.radius.full,
    cursor: 'pointer',
    transition: `background 160ms ${easing}, border-color 160ms ${easing}, opacity 160ms ${easing}`,
    selectors: {
      '&[data-checked]': {
        borderColor: themeContract.color.primary,
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
      sm: { width: '14px', height: '14px' },
      md: { width: '16px', height: '16px' },
      lg: { width: '20px', height: '20px' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const indicatorRecipe = recipe({
  base: {
    display: 'inline-block',
    background: themeContract.color.primary,
    borderRadius: themeContract.radius.full,
    transform: 'scale(1)',
    transition: `transform 160ms ${easing}`,
    selectors: {
      '&[data-starting-style], &[data-ending-style]': {
        transform: 'scale(0)',
      },
    },
  },
  variants: {
    size: {
      sm: { width: '6px', height: '6px' },
      md: { width: '8px', height: '8px' },
      lg: { width: '10px', height: '10px' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const labelStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: themeContract.spacing.xs,
  fontFamily: themeContract.fontFamily.text,
  fontSize: '14px',
  color: themeContract.color.ink,
  cursor: 'pointer',
  userSelect: 'none',
})

export type GroupVariants = NonNullable<RecipeVariants<typeof groupRecipe>>
export type RootVariants = NonNullable<RecipeVariants<typeof rootRecipe>>
