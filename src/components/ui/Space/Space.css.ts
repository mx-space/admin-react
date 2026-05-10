import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'

export const spaceRecipe = recipe({
  base: {
    display: 'flex',
    minWidth: 0,
  },
  variants: {
    direction: {
      row: { flexDirection: 'row' },
      column: { flexDirection: 'column' },
    },
    gap: {
      xxs: { gap: themeContract.spacing.xxs },
      xs: { gap: themeContract.spacing.xs },
      sm: { gap: themeContract.spacing.sm },
      md: { gap: themeContract.spacing.md },
      lg: { gap: themeContract.spacing.lg },
      xl: { gap: themeContract.spacing.xl },
    },
    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
      baseline: { alignItems: 'baseline' },
    },
    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
      around: { justifyContent: 'space-around' },
    },
    wrap: {
      true: { flexWrap: 'wrap' },
      false: { flexWrap: 'nowrap' },
    },
  },
  defaultVariants: {
    direction: 'row',
    gap: 'sm',
    align: 'center',
    justify: 'start',
    wrap: false,
  },
})

export type SpaceVariants = NonNullable<RecipeVariants<typeof spaceRecipe>>
