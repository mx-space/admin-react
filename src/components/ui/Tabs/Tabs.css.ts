import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'
import { typography } from '~/styles/tokens/typography'

const easing = 'cubic-bezier(0.2, 0, 0, 1)'

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.md,
})

export const listRecipe = recipe({
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: themeContract.spacing.xxs,
  },
  variants: {
    variant: {
      underline: {
        borderBottom: `1px solid ${themeContract.color.hairlineTertiary}`,
        gap: themeContract.spacing.md,
      },
      pill: {
        background: themeContract.color.surface1,
        border: `1px solid ${themeContract.color.hairline}`,
        borderRadius: themeContract.radius.md,
        padding: '4px',
      },
    },
  },
  defaultVariants: {
    variant: 'underline',
  },
})

export const tabRecipe = recipe({
  base: {
    position: 'relative',
    background: 'transparent',
    border: 'none',
    color: themeContract.color.inkSubtle,
    fontFamily: themeContract.fontFamily.text,
    fontSize: typography.bodySm.size,
    fontWeight: 500,
    lineHeight: typography.bodySm.lineHeight,
    cursor: 'pointer',
    userSelect: 'none',
    transition: `color 160ms ${easing}, background 160ms ${easing}`,
    selectors: {
      '&[data-selected]': {
        color: themeContract.color.ink,
      },
      '&:hover:not([data-disabled])': {
        color: themeContract.color.ink,
      },
      '&[data-disabled]': {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
      '&:focus-visible': {
        outline: `2px solid ${themeContract.color.primaryFocus}`,
        outlineOffset: '2px',
        borderRadius: themeContract.radius.xs,
      },
    },
  },
  variants: {
    variant: {
      underline: {
        paddingInline: 0,
        paddingBlock: themeContract.spacing.xs,
      },
      pill: {
        paddingInline: themeContract.spacing.sm,
        paddingBlock: themeContract.spacing.xxs,
        borderRadius: themeContract.radius.sm,
      },
    },
  },
  defaultVariants: {
    variant: 'underline',
  },
})

export const indicatorRecipe = recipe({
  base: {
    position: 'absolute',
    pointerEvents: 'none',
    transition: `left 220ms ${easing}, width 220ms ${easing}, top 220ms ${easing}, height 220ms ${easing}`,
    left: 'var(--active-tab-left)',
    top: 'var(--active-tab-top)',
    width: 'var(--active-tab-width)',
    height: 'var(--active-tab-height)',
  },
  variants: {
    variant: {
      underline: {
        bottom: 0,
        height: '2px',
        top: 'auto',
        background: themeContract.color.primary,
        borderRadius: themeContract.radius.xs,
      },
      pill: {
        background: themeContract.color.surface3,
        border: `1px solid ${themeContract.color.hairline}`,
        borderRadius: themeContract.radius.sm,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.32)',
      },
    },
  },
  defaultVariants: {
    variant: 'underline',
  },
})

export const panelStyle = style({
  outline: 'none',
})

export type ListVariants = NonNullable<RecipeVariants<typeof listRecipe>>
export type TabVariants = NonNullable<RecipeVariants<typeof tabRecipe>>
export type IndicatorVariants = NonNullable<RecipeVariants<typeof indicatorRecipe>>
