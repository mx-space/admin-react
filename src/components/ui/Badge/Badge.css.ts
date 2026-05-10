import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'

export const wrapperStyle = style({
  position: 'relative',
  display: 'inline-flex',
})

export const badgeRecipe = recipe({
  base: {
    position: 'absolute',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: themeContract.fontFamily.text,
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: '1',
    color: themeContract.color.onPrimary,
    boxShadow: `0 0 0 2px ${themeContract.color.canvas}`,
    pointerEvents: 'none',
    transformOrigin: '100% 0',
    transform: 'translate(50%, -50%)',
    top: 0,
    right: 0,
  },
  variants: {
    tone: {
      primary: { background: themeContract.color.primary },
      danger: { background: themeContract.color.semanticDanger },
      success: { background: themeContract.color.semanticSuccess },
      warning: { background: themeContract.color.semanticWarning },
      info: { background: themeContract.color.semanticInfo },
      neutral: {
        background: themeContract.color.surface4,
        color: themeContract.color.ink,
      },
    },
    shape: {
      dot: {
        width: '8px',
        height: '8px',
        minWidth: '8px',
        borderRadius: themeContract.radius.full,
        padding: 0,
      },
      number: {
        minWidth: '18px',
        height: '18px',
        paddingInline: '5px',
        borderRadius: themeContract.radius.pill,
        fontSize: '11px',
      },
    },
  },
  defaultVariants: {
    tone: 'danger',
    shape: 'number',
  },
})

export const standaloneRecipe = recipe({
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: themeContract.fontFamily.text,
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: '1',
    color: themeContract.color.onPrimary,
  },
  variants: {
    tone: {
      primary: { background: themeContract.color.primary },
      danger: { background: themeContract.color.semanticDanger },
      success: { background: themeContract.color.semanticSuccess },
      warning: { background: themeContract.color.semanticWarning },
      info: { background: themeContract.color.semanticInfo },
      neutral: {
        background: themeContract.color.surface4,
        color: themeContract.color.ink,
      },
    },
    shape: {
      dot: {
        width: '8px',
        height: '8px',
        minWidth: '8px',
        borderRadius: themeContract.radius.full,
        padding: 0,
      },
      number: {
        minWidth: '18px',
        height: '18px',
        paddingInline: '5px',
        borderRadius: themeContract.radius.pill,
        fontSize: '11px',
      },
    },
  },
  defaultVariants: {
    tone: 'danger',
    shape: 'number',
  },
})

export type BadgeVariants = NonNullable<RecipeVariants<typeof badgeRecipe>>
