import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'

export const rootRecipe = recipe({
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    background: themeContract.color.surface3,
    color: themeContract.color.ink,
    fontFamily: themeContract.fontFamily.text,
    fontWeight: 500,
    userSelect: 'none',
    flexShrink: 0,
    border: `1px solid ${themeContract.color.hairline}`,
  },
  variants: {
    size: {
      xs: { width: '20px', height: '20px', fontSize: '10px' },
      sm: { width: '24px', height: '24px', fontSize: '11px' },
      md: { width: '32px', height: '32px', fontSize: '13px' },
      lg: { width: '40px', height: '40px', fontSize: '15px' },
      xl: { width: '56px', height: '56px', fontSize: '20px' },
    },
    shape: {
      circle: { borderRadius: themeContract.radius.full },
      rounded: { borderRadius: themeContract.radius.md },
    },
  },
  defaultVariants: {
    size: 'md',
    shape: 'circle',
  },
})

export const imageStyle = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

export type RootVariants = NonNullable<RecipeVariants<typeof rootRecipe>>
