import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'
import { chrome } from '~/styles/tokens'
import { typography } from '~/styles/tokens/typography'

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  background: themeContract.color.canvas,
})

export const headerStyle = style({
  flex: 'none',
  height: chrome.headerHeight,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: themeContract.spacing.md,
  paddingInline: themeContract.spacing.md,
  borderBottom: `1px solid ${themeContract.color.hairlineTertiary}`,
  background: themeContract.color.canvas,
})

export const titleStyle = style({
  margin: 0,
  flex: 1,
  minWidth: 0,
  fontSize: typography.body.size,
  fontWeight: 500,
  lineHeight: typography.body.lineHeight,
  letterSpacing: typography.body.letterSpacing,
  color: themeContract.color.ink,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const actionsStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeContract.spacing.xs,
  flex: 'none',
})

export const bodyRecipe = recipe({
  base: {
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
    background: themeContract.color.canvas,
  },
  variants: {
    padding: {
      default: {
        padding: chrome.contentPaddingDesktop,
        '@media': {
          [`(max-width: ${chrome.mobileBreakpoint - 1}px)`]: {
            padding: chrome.contentPaddingMobile,
          },
        },
      },
      none: { padding: 0 },
    },
  },
  defaultVariants: { padding: 'default' },
})

export type BodyVariants = NonNullable<RecipeVariants<typeof bodyRecipe>>
