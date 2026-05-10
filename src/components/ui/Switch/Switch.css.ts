import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'

const easing = 'cubic-bezier(0.2, 0, 0, 1)'

export const rootRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
    padding: '2px',
    background: themeContract.color.surface3,
    border: `1px solid ${themeContract.color.hairline}`,
    borderRadius: themeContract.radius.pill,
    cursor: 'pointer',
    transition: `background 160ms ${easing}, border-color 160ms ${easing}, opacity 160ms ${easing}`,
    selectors: {
      '&[data-checked]': {
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
      sm: { width: '28px', height: '16px' },
      md: { width: '36px', height: '20px' },
      lg: { width: '44px', height: '24px' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const thumbRecipe = recipe({
  base: {
    display: 'block',
    background: themeContract.color.ink,
    borderRadius: themeContract.radius.full,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
    transform: 'translateX(0)',
    transition: `transform 160ms ${easing}, background 160ms ${easing}`,
    selectors: {
      '[data-checked] &': {
        background: themeContract.color.onPrimary,
      },
    },
  },
  variants: {
    size: {
      sm: {
        width: '12px',
        height: '12px',
        selectors: {
          '[data-checked] &': { transform: 'translateX(12px)' },
        },
      },
      md: {
        width: '16px',
        height: '16px',
        selectors: {
          '[data-checked] &': { transform: 'translateX(16px)' },
        },
      },
      lg: {
        width: '20px',
        height: '20px',
        selectors: {
          '[data-checked] &': { transform: 'translateX(20px)' },
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type RootVariants = NonNullable<RecipeVariants<typeof rootRecipe>>
export type ThumbVariants = NonNullable<RecipeVariants<typeof thumbRecipe>>
