import { keyframes, style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'

const pulse = keyframes({
  '0%, 100%': { opacity: 0.6 },
  '50%': { opacity: 1 },
})

const shimmer = keyframes({
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
})

export const groupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: themeContract.spacing.xs,
})

export const skeletonRecipe = recipe({
  base: {
    background: themeContract.color.surface3,
    backgroundImage: `linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)`,
    backgroundSize: '200% 100%',
    animation: `${pulse} 1.6s ease-in-out infinite, ${shimmer} 2.4s linear infinite`,
  },
  variants: {
    shape: {
      text: {
        height: '12px',
        borderRadius: themeContract.radius.xs,
      },
      rect: {
        borderRadius: themeContract.radius.sm,
      },
      circle: {
        borderRadius: themeContract.radius.full,
      },
    },
  },
  defaultVariants: {
    shape: 'rect',
  },
})

export type SkeletonVariants = NonNullable<RecipeVariants<typeof skeletonRecipe>>
