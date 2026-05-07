import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'

const primaryRing = '0 0 0 3px rgba(94, 105, 209, 0.18)'
const dangerRing = '0 0 0 3px rgba(229, 72, 77, 0.18)'

export const inputRootRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: themeContract.spacing.xs,
    width: '100%',
    background: themeContract.color.surface1,
    border: `1px solid ${themeContract.color.hairline}`,
    borderRadius: themeContract.radius.md,
    color: themeContract.color.ink,
    fontFamily: themeContract.fontFamily.text,
    transition:
      'border-color 160ms cubic-bezier(0.2, 0, 0, 1), box-shadow 160ms cubic-bezier(0.2, 0, 0, 1)',
    selectors: {
      '&:focus-within': {
        borderColor: themeContract.color.primaryFocus,
        boxShadow: primaryRing,
      },
    },
  },
  variants: {
    intent: {
      default: {},
      danger: {
        borderColor: themeContract.color.semanticDanger,
        selectors: {
          '&:focus-within': {
            borderColor: themeContract.color.semanticDanger,
            boxShadow: dangerRing,
          },
        },
      },
    },
    size: {
      sm: {
        height: '28px',
        paddingInline: themeContract.spacing.sm,
        fontSize: '13px',
        borderRadius: themeContract.radius.sm,
      },
      md: {
        height: '34px',
        paddingInline: themeContract.spacing.md,
        fontSize: '14px',
      },
      lg: {
        height: '42px',
        paddingInline: themeContract.spacing.md,
        fontSize: '15px',
      },
    },
    state: {
      disabled: {
        opacity: 0.5,
        pointerEvents: 'none',
      },
    },
  },
  defaultVariants: {
    intent: 'default',
    size: 'md',
  },
})

export const inputFieldStyle = style({
  flex: 1,
  minWidth: 0,
  height: '100%',
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'inherit',
  font: 'inherit',
  padding: 0,
  selectors: {
    '&::placeholder': {
      color: themeContract.color.inkSubtle,
    },
    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
})

export const inputAffixStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  color: themeContract.color.inkSubtle,
  flex: 'none',
})

export type InputRootVariants = NonNullable<RecipeVariants<typeof inputRootRecipe>>
