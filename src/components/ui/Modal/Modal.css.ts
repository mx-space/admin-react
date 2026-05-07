import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { themeContract } from '~/styles/theme.css'
import { typography } from '~/styles/tokens/typography'

const enterMs = 240
const exitMs = 180
const enterEase = 'cubic-bezier(0.2, 0, 0, 1)'

export const backdropStyle = style({
  position: 'fixed',
  inset: 0,
  background: themeContract.color.semanticOverlay,
  backdropFilter: 'blur(2px)',
  zIndex: themeContract.zIndex.modal,
  opacity: 0,
  transition: `opacity ${enterMs}ms ${enterEase}`,
  selectors: {
    '&[data-open]': {
      opacity: 1,
    },
    '&[data-starting-style], &[data-ending-style]': {
      opacity: 0,
    },
    '&[data-ending-style]': {
      transitionDuration: `${exitMs}ms`,
    },
  },
})

export const popupRecipe = recipe({
  base: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(1)',
    transformOrigin: 'center',
    background: themeContract.color.surface2,
    color: themeContract.color.ink,
    border: `1px solid ${themeContract.color.hairline}`,
    borderRadius: themeContract.radius.lg,
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.45)',
    zIndex: themeContract.zIndex.modal,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 'calc(100dvh - 64px)',
    width: 'calc(100vw - 32px)',
    opacity: 1,
    transition: `opacity ${enterMs}ms ${enterEase}, transform ${enterMs}ms ${enterEase}`,
    selectors: {
      '&[data-starting-style], &[data-ending-style]': {
        opacity: 0,
        transform: 'translate(-50%, -50%) scale(0.96)',
      },
      '&[data-ending-style]': {
        transitionDuration: `${exitMs}ms`,
      },
      '&:focus-visible': {
        outline: 'none',
      },
    },
  },
  variants: {
    size: {
      sm: { maxWidth: '360px' },
      md: { maxWidth: '480px' },
      lg: { maxWidth: '640px' },
      xl: { maxWidth: '800px' },
      full: {
        maxWidth: 'none',
        width: 'calc(100vw - 32px)',
        height: 'calc(100dvh - 32px)',
        maxHeight: 'calc(100dvh - 32px)',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const headerStyle = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: themeContract.spacing.md,
  padding: `${themeContract.spacing.lg} ${themeContract.spacing.lg} ${themeContract.spacing.sm}`,
})

export const titleStyle = style({
  margin: 0,
  fontFamily: themeContract.fontFamily.display,
  fontSize: typography.cardTitle.size,
  fontWeight: Number(typography.cardTitle.weight),
  lineHeight: typography.cardTitle.lineHeight,
  letterSpacing: typography.cardTitle.letterSpacing,
  color: themeContract.color.ink,
})

export const descriptionStyle = style({
  margin: 0,
  marginTop: themeContract.spacing.xxs,
  color: themeContract.color.inkSubtle,
  fontSize: typography.bodySm.size,
  lineHeight: typography.bodySm.lineHeight,
})

export const bodyStyle = style({
  padding: `0 ${themeContract.spacing.lg}`,
  overflowY: 'auto',
  flex: 1,
  minHeight: 0,
})

export const footerStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: themeContract.spacing.sm,
  padding: `${themeContract.spacing.md} ${themeContract.spacing.lg} ${themeContract.spacing.lg}`,
  borderTop: `1px solid ${themeContract.color.hairlineTertiary}`,
})

export type PopupVariants = NonNullable<RecipeVariants<typeof popupRecipe>>
