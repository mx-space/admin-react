import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'

export const cardRecipe = recipe({
  base: {
    display: 'block',
    color: themeContract.color.ink,
    transition:
      'background-color 160ms cubic-bezier(0.2, 0, 0, 1), border-color 160ms cubic-bezier(0.2, 0, 0, 1)',
  },
  variants: {
    elevation: {
      flat: {
        background: themeContract.color.canvas,
        border: 'none',
      },
      raised: {
        background: themeContract.color.surface1,
        border: `1px solid ${themeContract.color.hairline}`,
      },
      raisedStrong: {
        background: themeContract.color.surface2,
        border: `1px solid ${themeContract.color.hairlineStrong}`,
      },
      popover: {
        background: themeContract.color.surface3,
        border: `1px solid ${themeContract.color.hairline}`,
      },
    },
    padding: {
      none: { padding: 0 },
      sm: { padding: themeContract.spacing.sm },
      md: { padding: themeContract.spacing.md },
      lg: { padding: themeContract.spacing.lg },
    },
    radius: {
      md: { borderRadius: themeContract.radius.md },
      lg: { borderRadius: themeContract.radius.lg },
      xl: { borderRadius: themeContract.radius.xl },
    },
  },
  defaultVariants: {
    elevation: 'raised',
    padding: 'md',
    radius: 'lg',
  },
})

export const cardHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: themeContract.spacing.md,
  paddingBottom: themeContract.spacing.sm,
})

export const cardBodyStyle = style({
  display: 'block',
})

export const cardFooterStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: themeContract.spacing.sm,
  paddingTop: themeContract.spacing.md,
  borderTop: `1px solid ${themeContract.color.hairlineTertiary}`,
  marginTop: themeContract.spacing.md,
})

export type CardVariants = NonNullable<RecipeVariants<typeof cardRecipe>>
