import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

export const ellipsisRecipe = recipe({
  base: {
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  },
  variants: {
    block: {
      true: { display: 'block' },
      false: { display: 'inline-block', verticalAlign: 'bottom' },
    },
  },
  defaultVariants: {
    block: false,
  },
})

export type EllipsisVariants = NonNullable<RecipeVariants<typeof ellipsisRecipe>>
