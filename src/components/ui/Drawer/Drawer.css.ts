import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'

const enterMs = 240
const exitMs = 180
const enterEase = 'cubic-bezier(0.2, 0, 0, 1)'

export const backdropStyle = style({
  position: 'fixed',
  inset: 0,
  background: themeContract.color.semanticOverlay,
  backdropFilter: 'blur(2px)',
  zIndex: themeContract.zIndex.drawer,
  opacity: 0,
  transition: `opacity ${enterMs}ms ${enterEase}`,
  selectors: {
    '&[data-open]': { opacity: 1 },
    '&[data-starting-style], &[data-ending-style]': { opacity: 0 },
    '&[data-ending-style]': { transitionDuration: `${exitMs}ms` },
  },
})

export const popupRecipe = recipe({
  base: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    background: themeContract.color.surface1,
    color: themeContract.color.ink,
    zIndex: themeContract.zIndex.drawer,
    display: 'flex',
    flexDirection: 'column',
    transition: `transform ${enterMs}ms ${enterEase}`,
    selectors: {
      '&:focus-visible': { outline: 'none' },
      '&[data-ending-style]': { transitionDuration: `${exitMs}ms` },
    },
  },
  variants: {
    placement: {
      left: {
        left: 0,
        borderRight: `1px solid ${themeContract.color.hairline}`,
        transform: 'translate3d(0, 0, 0)',
        selectors: {
          '&[data-starting-style], &[data-ending-style]': {
            transform: 'translate3d(-100%, 0, 0)',
          },
        },
      },
      right: {
        right: 0,
        borderLeft: `1px solid ${themeContract.color.hairline}`,
        transform: 'translate3d(0, 0, 0)',
        selectors: {
          '&[data-starting-style], &[data-ending-style]': {
            transform: 'translate3d(100%, 0, 0)',
          },
        },
      },
    },
    size: {
      sm: { width: '280px' },
      md: { width: '360px' },
      lg: { width: '480px' },
      full: { width: '100vw' },
    },
  },
  defaultVariants: {
    placement: 'right',
    size: 'md',
  },
})

export type PopupVariants = NonNullable<RecipeVariants<typeof popupRecipe>>
