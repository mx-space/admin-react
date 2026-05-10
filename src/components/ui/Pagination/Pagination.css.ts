import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'
import { typography } from '~/styles/tokens/typography'

const easing = 'cubic-bezier(0.2, 0, 0, 1)'

export const rootStyle = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: themeContract.spacing.sm,
  fontFamily: themeContract.fontFamily.text,
  fontSize: typography.bodySm.size,
  color: themeContract.color.inkSubtle,
})

export const totalStyle = style({
  fontVariantNumeric: 'tabular-nums',
})

export const pageListStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
})

export const pageButtonRecipe = recipe({
  base: {
    minWidth: '28px',
    height: '28px',
    padding: '0 8px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: `1px solid transparent`,
    color: themeContract.color.inkSubtle,
    fontFamily: themeContract.fontFamily.text,
    fontSize: typography.bodySm.size,
    fontVariantNumeric: 'tabular-nums',
    cursor: 'pointer',
    borderRadius: themeContract.radius.sm,
    transition: `background 160ms ${easing}, color 160ms ${easing}, border-color 160ms ${easing}`,
    selectors: {
      '&:hover:not(:disabled)': {
        background: themeContract.color.surface2,
        color: themeContract.color.ink,
      },
      '&:focus-visible': {
        outline: `2px solid ${themeContract.color.primaryFocus}`,
        outlineOffset: '2px',
      },
      '&:disabled': {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    active: {
      true: {
        background: themeContract.color.surface3,
        color: themeContract.color.ink,
        borderColor: themeContract.color.hairlineStrong,
      },
      false: {},
    },
  },
  defaultVariants: { active: false },
})

export const ellipsisStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '28px',
  height: '28px',
  color: themeContract.color.inkTertiary,
})

export type PageButtonVariants = NonNullable<
  RecipeVariants<typeof pageButtonRecipe>
>
