import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'

const easing = 'cubic-bezier(0.2, 0, 0, 1)'

export const rootRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
    background: themeContract.color.surface1,
    border: `1px solid ${themeContract.color.hairlineStrong}`,
    borderRadius: themeContract.radius.xs,
    color: themeContract.color.onPrimary,
    cursor: 'pointer',
    transition: `background 160ms ${easing}, border-color 160ms ${easing}, opacity 160ms ${easing}`,
    selectors: {
      '&[data-checked], &[data-indeterminate]': {
        background: themeContract.color.primary,
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
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'currentColor',
  },
  variants: {
    size: {
      sm: { width: '10px', height: '10px' },
      md: { width: '12px', height: '12px' },
      lg: { width: '14px', height: '14px' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type RootVariants = NonNullable<RecipeVariants<typeof rootRecipe>>
