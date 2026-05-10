import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'
import { typography } from '~/styles/tokens/typography'

export const tagRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: themeContract.spacing.xxs,
    fontFamily: themeContract.fontFamily.text,
    fontWeight: 500,
    lineHeight: '1.2',
    borderRadius: themeContract.radius.sm,
    border: `1px solid transparent`,
    whiteSpace: 'nowrap',
    userSelect: 'none',
  },
  variants: {
    tone: {
      neutral: {
        background: themeContract.color.surface2,
        color: themeContract.color.inkMuted,
        borderColor: themeContract.color.hairline,
      },
      primary: {
        background: 'rgba(94, 105, 209, 0.16)',
        color: themeContract.color.primaryHover,
        borderColor: 'rgba(94, 105, 209, 0.32)',
      },
      success: {
        background: 'rgba(39, 166, 68, 0.14)',
        color: themeContract.color.semanticSuccess,
        borderColor: 'rgba(39, 166, 68, 0.34)',
      },
      danger: {
        background: 'rgba(229, 72, 77, 0.14)',
        color: themeContract.color.semanticDanger,
        borderColor: 'rgba(229, 72, 77, 0.34)',
      },
      warning: {
        background: 'rgba(245, 165, 36, 0.14)',
        color: themeContract.color.semanticWarning,
        borderColor: 'rgba(245, 165, 36, 0.34)',
      },
      info: {
        background: 'rgba(62, 99, 221, 0.14)',
        color: themeContract.color.semanticInfo,
        borderColor: 'rgba(62, 99, 221, 0.34)',
      },
    },
    size: {
      sm: {
        fontSize: typography.caption.size,
        paddingInline: themeContract.spacing.xs,
        paddingBlock: '2px',
      },
      md: {
        fontSize: typography.bodySm.size,
        paddingInline: themeContract.spacing.sm,
        paddingBlock: '4px',
      },
    },
  },
  defaultVariants: {
    tone: 'neutral',
    size: 'sm',
  },
})

export const closeButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: themeContract.spacing.xxs,
  background: 'transparent',
  border: 'none',
  color: 'currentColor',
  opacity: 0.6,
  cursor: 'pointer',
  borderRadius: themeContract.radius.xs,
  padding: '1px',
  transition: 'opacity 120ms ease, background 120ms ease',
  selectors: {
    '&:hover': {
      opacity: 1,
      background: 'rgba(255, 255, 255, 0.08)',
    },
    '&:focus-visible': {
      outline: `2px solid currentColor`,
      outlineOffset: '1px',
      opacity: 1,
    },
  },
})

export type TagVariants = NonNullable<RecipeVariants<typeof tagRecipe>>
