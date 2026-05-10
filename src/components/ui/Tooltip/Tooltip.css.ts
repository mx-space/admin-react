import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'
import { typography } from '~/styles/tokens/typography'

const enterMs = 140
const exitMs = 100
const enterEase = 'cubic-bezier(0.2, 0, 0, 1)'

export const positionerStyle = style({
  zIndex: themeContract.zIndex.tooltip,
})

export const popupRecipe = recipe({
  base: {
    background: themeContract.color.surface4,
    color: themeContract.color.ink,
    border: `1px solid ${themeContract.color.hairline}`,
    borderRadius: themeContract.radius.sm,
    paddingInline: themeContract.spacing.sm,
    paddingBlock: themeContract.spacing.xxs,
    fontFamily: themeContract.fontFamily.text,
    fontSize: typography.caption.size,
    lineHeight: typography.caption.lineHeight,
    letterSpacing: typography.caption.letterSpacing,
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.32)',
    maxWidth: '280px',
    transformOrigin: 'var(--transform-origin, center)',
    opacity: 1,
    transform: 'scale(1)',
    transition: `opacity ${enterMs}ms ${enterEase}, transform ${enterMs}ms ${enterEase}`,
    selectors: {
      '&[data-starting-style], &[data-ending-style]': {
        opacity: 0,
        transform: 'scale(0.95)',
      },
      '&[data-ending-style]': {
        transitionDuration: `${exitMs}ms`,
      },
    },
  },
  variants: {
    tone: {
      default: {},
      inverse: {
        background: themeContract.color.inverseCanvas,
        color: themeContract.color.inverseInk,
        border: `1px solid ${themeContract.color.inverseSurface2}`,
      },
    },
  },
  defaultVariants: {
    tone: 'default',
  },
})

export type PopupVariants = NonNullable<RecipeVariants<typeof popupRecipe>>
