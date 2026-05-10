import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'

const enterMs = 160
const exitMs = 120
const enterEase = 'cubic-bezier(0.2, 0, 0, 1)'

export const positionerStyle = style({
  zIndex: themeContract.zIndex.popover,
})

export const backdropStyle = style({
  position: 'fixed',
  inset: 0,
  zIndex: themeContract.zIndex.popover,
})

export const popupRecipe = recipe({
  base: {
    background: themeContract.color.surface2,
    color: themeContract.color.ink,
    border: `1px solid ${themeContract.color.hairline}`,
    borderRadius: themeContract.radius.md,
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.40)',
    transformOrigin: 'var(--transform-origin, center)',
    opacity: 1,
    transform: 'translateY(0) scale(1)',
    transition: `opacity ${enterMs}ms ${enterEase}, transform ${enterMs}ms ${enterEase}`,
    selectors: {
      '&:focus-visible': { outline: 'none' },
      '&[data-starting-style], &[data-ending-style]': {
        opacity: 0,
        transform: 'translateY(-4px) scale(0.98)',
      },
      '&[data-ending-style]': {
        transitionDuration: `${exitMs}ms`,
      },
    },
  },
  variants: {
    padding: {
      none: { padding: 0 },
      sm: { padding: themeContract.spacing.sm },
      md: { padding: themeContract.spacing.md },
      lg: { padding: themeContract.spacing.lg },
    },
    width: {
      auto: {},
      sm: { width: '200px' },
      md: { width: '280px' },
      lg: { width: '360px' },
    },
  },
  defaultVariants: {
    padding: 'sm',
    width: 'auto',
  },
})

export type PopupVariants = NonNullable<RecipeVariants<typeof popupRecipe>>
