import { keyframes, style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'

const indeterminate = keyframes({
  '0%': { transform: 'translateX(-100%)' },
  '100%': { transform: 'translateX(200%)' },
})

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.xxs,
  width: '100%',
})

export const trackRecipe = recipe({
  base: {
    position: 'relative',
    overflow: 'hidden',
    background: themeContract.color.surface3,
    borderRadius: themeContract.radius.pill,
  },
  variants: {
    size: {
      sm: { height: '4px' },
      md: { height: '6px' },
      lg: { height: '10px' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const indicatorRecipe = recipe({
  base: {
    height: '100%',
    borderRadius: themeContract.radius.pill,
    transition: 'width 240ms cubic-bezier(0.2, 0, 0, 1)',
    selectors: {
      '[data-status=indeterminate] &': {
        width: '40% !important',
        animation: `${indeterminate} 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
      },
    },
  },
  variants: {
    tone: {
      primary: { background: themeContract.color.primary },
      success: { background: themeContract.color.semanticSuccess },
      danger: { background: themeContract.color.semanticDanger },
      warning: { background: themeContract.color.semanticWarning },
      info: { background: themeContract.color.semanticInfo },
    },
  },
  defaultVariants: {
    tone: 'primary',
  },
})

export const labelRowStyle = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: themeContract.spacing.sm,
  fontFamily: themeContract.fontFamily.text,
  fontSize: '12px',
  color: themeContract.color.inkSubtle,
})

export const valueStyle = style({
  fontVariantNumeric: 'tabular-nums',
})

export type TrackVariants = NonNullable<RecipeVariants<typeof trackRecipe>>
export type IndicatorVariants = NonNullable<RecipeVariants<typeof indicatorRecipe>>
