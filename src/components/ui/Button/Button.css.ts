import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'
import { typography } from '~/styles/tokens/typography'

export const buttonRecipe = recipe({
  base: {
    fontFamily: themeContract.fontFamily.text,
    fontSize: typography.button.size,
    fontWeight: Number(typography.button.weight),
    lineHeight: typography.button.lineHeight,
    letterSpacing: typography.button.letterSpacing,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: themeContract.spacing.xs,
    borderRadius: themeContract.radius.md,
    border: '1px solid transparent',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    transition:
      'background-color 160ms cubic-bezier(0.2, 0, 0, 1), border-color 160ms cubic-bezier(0.2, 0, 0, 1), color 160ms cubic-bezier(0.2, 0, 0, 1), opacity 160ms cubic-bezier(0.2, 0, 0, 1)',
    selectors: {
      '&:focus-visible': {
        outline: `2px solid ${themeContract.color.primaryFocus}`,
        outlineOffset: '2px',
      },
    },
  },
  variants: {
    intent: {
      primary: {
        background: themeContract.color.primary,
        color: themeContract.color.onPrimary,
        borderColor: themeContract.color.primary,
        selectors: {
          '&:hover:not(:disabled)': {
            background: themeContract.color.primaryHover,
            borderColor: themeContract.color.primaryHover,
          },
        },
      },
      secondary: {
        background: themeContract.color.surface1,
        color: themeContract.color.ink,
        borderColor: themeContract.color.hairline,
        selectors: {
          '&:hover:not(:disabled)': {
            background: themeContract.color.surface2,
            borderColor: themeContract.color.hairlineStrong,
          },
        },
      },
      tertiary: {
        background: 'transparent',
        color: themeContract.color.ink,
        borderColor: 'transparent',
        selectors: {
          '&:hover:not(:disabled)': {
            background: themeContract.color.surface1,
          },
        },
      },
      inverse: {
        background: themeContract.color.inverseCanvas,
        color: themeContract.color.inverseInk,
        borderColor: themeContract.color.inverseCanvas,
        selectors: {
          '&:hover:not(:disabled)': {
            background: themeContract.color.inverseSurface1,
            borderColor: themeContract.color.inverseSurface1,
          },
        },
      },
      danger: {
        background: themeContract.color.semanticDanger,
        color: themeContract.color.onPrimary,
        borderColor: themeContract.color.semanticDanger,
        selectors: {
          '&:hover:not(:disabled)': {
            opacity: 0.9,
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
      },
      lg: {
        height: '42px',
        paddingInline: themeContract.spacing.lg,
        fontSize: '15px',
      },
    },
    state: {
      disabled: {
        opacity: 0.4,
        pointerEvents: 'none',
      },
    },
  },
  defaultVariants: {
    intent: 'secondary',
    size: 'md',
  },
})

export type ButtonVariants = NonNullable<RecipeVariants<typeof buttonRecipe>>
