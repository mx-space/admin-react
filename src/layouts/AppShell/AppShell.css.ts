import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'
import { chrome } from '~/styles/tokens'

export const rootRecipe = recipe({
  base: {
    display: 'grid',
    gridTemplateRows: '100vh',
    height: '100vh',
    background: themeContract.color.canvas,
    color: themeContract.color.ink,
    overflow: 'hidden',
  },
  variants: {
    sidebar: {
      expanded: { gridTemplateColumns: `${chrome.sidebarWidthExpanded} 1fr` },
      collapsed: { gridTemplateColumns: `${chrome.sidebarWidthCollapsed} 1fr` },
      mobile: { gridTemplateColumns: '1fr' },
    },
  },
  defaultVariants: { sidebar: 'expanded' },
})

export const mainStyle = style({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  height: '100%',
  overflow: 'hidden',
})

export const mobileHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeContract.spacing.sm,
  height: chrome.headerHeight,
  paddingInline: themeContract.spacing.md,
  borderBottom: `1px solid ${themeContract.color.hairlineTertiary}`,
  background: themeContract.color.canvas,
  flex: 'none',
})

export const mobileHamburgerStyle = style({
  width: '32px',
  height: '32px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 0,
  borderRadius: themeContract.radius.sm,
  color: themeContract.color.inkSubtle,
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      background: themeContract.color.surface1,
      color: themeContract.color.ink,
    },
  },
})

export const mobileBrandStyle = style({
  fontWeight: 600,
  fontSize: '14px',
  letterSpacing: '-0.1px',
  color: themeContract.color.ink,
})

export type RootVariants = NonNullable<RecipeVariants<typeof rootRecipe>>
