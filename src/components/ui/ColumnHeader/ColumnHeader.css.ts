import { style, styleVariants } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'
import { chrome } from '~/styles/tokens'

export const rootRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    height: chrome.headerHeight,
    background: themeContract.color.surface1,
    borderBottom: `1px solid ${themeContract.color.hairline}`,
    flexShrink: 0,
  },
  variants: {
    size: {
      compact: { paddingInline: '12px', gap: 4 },
      spacious: { paddingInline: '24px', gap: 8 },
    },
  },
  defaultVariants: { size: 'compact' },
})

export type RootVariants = NonNullable<RecipeVariants<typeof rootRecipe>>

export const leftStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flex: 1,
  minWidth: 0,
})

export const centerStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  flexShrink: 0,
})

export const rightStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  flexShrink: 0,
})

const iconButtonBase = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  color: themeContract.color.inkSubtle,
  borderRadius: themeContract.radius.sm,
  cursor: 'pointer',
  transition: 'background 120ms ease, color 120ms ease',
  flexShrink: 0,
  selectors: {
    '&:hover:not(:disabled)': {
      background: themeContract.color.surface2,
      color: themeContract.color.ink,
    },
    '&:focus-visible': {
      outline: `2px solid ${themeContract.color.primaryFocus}`,
      outlineOffset: 1,
    },
    '&:disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
    '&[data-active="true"]': {
      background: themeContract.color.surface2,
      color: themeContract.color.ink,
    },
  },
} as const

export const iconButtonRecipe = styleVariants({
  sm: { ...iconButtonBase, width: 28, height: 28 },
  md: { ...iconButtonBase, width: 32, height: 32 },
})

export const dividerStyle = style({
  width: 1,
  height: 16,
  background: themeContract.color.hairline,
  flexShrink: 0,
})
