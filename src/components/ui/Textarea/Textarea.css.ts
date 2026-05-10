import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'

const primaryRing = '0 0 0 3px rgba(94, 105, 209, 0.18)'
const dangerRing = '0 0 0 3px rgba(229, 72, 77, 0.18)'

export const textareaRecipe = recipe({
  base: {
    display: 'block',
    width: '100%',
    background: themeContract.color.surface1,
    border: `1px solid ${themeContract.color.hairline}`,
    borderRadius: themeContract.radius.md,
    color: themeContract.color.ink,
    fontFamily: themeContract.fontFamily.text,
    fontSize: '14px',
    lineHeight: '1.5',
    paddingInline: themeContract.spacing.md,
    paddingBlock: themeContract.spacing.xs,
    resize: 'vertical',
    transition:
      'border-color 160ms cubic-bezier(0.2, 0, 0, 1), box-shadow 160ms cubic-bezier(0.2, 0, 0, 1)',
    selectors: {
      '&:focus': {
        outline: 'none',
        borderColor: themeContract.color.primaryFocus,
        boxShadow: primaryRing,
      },
      '&::placeholder': {
        color: themeContract.color.inkSubtle,
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.5,
      },
    },
  },
  variants: {
    intent: {
      default: {},
      danger: {
        borderColor: themeContract.color.semanticDanger,
        selectors: {
          '&:focus': {
            borderColor: themeContract.color.semanticDanger,
            boxShadow: dangerRing,
          },
        },
      },
    },
    size: {
      sm: { fontSize: '13px' },
      md: { fontSize: '14px' },
      lg: { fontSize: '15px' },
    },
  },
  defaultVariants: {
    intent: 'default',
    size: 'md',
  },
})

export type TextareaVariants = NonNullable<RecipeVariants<typeof textareaRecipe>>
