import { style } from '@vanilla-extract/css'

import { themeContract } from '~/styles/theme.css'

const enterMs = 200
const exitMs = 160
const enterEase = 'cubic-bezier(0.2, 0, 0, 1)'

export const backdropStyle = style({
  position: 'fixed',
  inset: 0,
  background: themeContract.color.semanticOverlay,
  backdropFilter: 'blur(4px)',
  zIndex: themeContract.zIndex.kbar,
  opacity: 0,
  transition: `opacity ${enterMs}ms ${enterEase}`,
  selectors: {
    '&[data-open]': { opacity: 1 },
    '&[data-starting-style], &[data-ending-style]': { opacity: 0 },
    '&[data-ending-style]': { transitionDuration: `${exitMs}ms` },
  },
})

export const popupStyle = style({
  position: 'fixed',
  top: '20vh',
  left: '50%',
  transform: 'translateX(-50%) scale(1)',
  transformOrigin: 'top center',
  width: 'calc(100vw - 32px)',
  maxWidth: 560,
  background: themeContract.color.surface2,
  border: `1px solid ${themeContract.color.hairline}`,
  borderRadius: themeContract.radius.lg,
  boxShadow: '0 32px 64px rgba(0, 0, 0, 0.55)',
  zIndex: themeContract.zIndex.kbar,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  opacity: 1,
  transition: `opacity ${enterMs}ms ${enterEase}, transform ${enterMs}ms ${enterEase}`,
  selectors: {
    '&[data-starting-style], &[data-ending-style]': {
      opacity: 0,
      transform: 'translateX(-50%) translateY(-4px) scale(0.98)',
    },
    '&[data-ending-style]': { transitionDuration: `${exitMs}ms` },
    '&:focus-visible': { outline: 'none' },
  },
})

export const searchRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeContract.spacing.xs,
  padding: `${themeContract.spacing.sm} ${themeContract.spacing.md}`,
  borderBottom: `1px solid ${themeContract.color.hairlineTertiary}`,
})

export const searchIconStyle = style({
  color: themeContract.color.inkSubtle,
  flex: 'none',
})

export const searchInputStyle = style({
  flex: 1,
  background: 'transparent',
  border: 0,
  outline: 'none',
  color: themeContract.color.ink,
  fontSize: 14,
  fontFamily: themeContract.fontFamily.text,
  selectors: {
    '&::placeholder': { color: themeContract.color.inkSubtle },
  },
})

export const escHintStyle = style({
  fontSize: 11,
  fontFamily: themeContract.fontFamily.mono,
  color: themeContract.color.inkSubtle,
  background: themeContract.color.surface3,
  padding: '2px 6px',
  borderRadius: themeContract.radius.xs,
  border: `1px solid ${themeContract.color.hairline}`,
})

export const listStyle = style({
  maxHeight: 'min(60vh, 480px)',
  display: 'flex',
})

export const listInnerStyle = style({
  width: '100%',
  padding: themeContract.spacing.xxs,
  display: 'flex',
  flexDirection: 'column',
})

export const sectionLabelStyle = style({
  fontSize: 11,
  fontWeight: 500,
  color: themeContract.color.inkSubtle,
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
  padding: `${themeContract.spacing.xs} ${themeContract.spacing.sm} ${themeContract.spacing.xxs}`,
})

export const itemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeContract.spacing.sm,
  padding: `${themeContract.spacing.xs} ${themeContract.spacing.sm}`,
  borderRadius: themeContract.radius.sm,
  cursor: 'pointer',
  color: themeContract.color.inkMuted,
  fontSize: 13,
  background: 'transparent',
  border: 0,
  textAlign: 'left',
  width: '100%',
  selectors: {
    '&[data-active="true"]': {
      background: themeContract.color.surface3,
      color: themeContract.color.ink,
    },
  },
})

export const itemIconStyle = style({
  width: 18,
  height: 18,
  flex: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: themeContract.color.inkSubtle,
})

export const itemBodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
})

export const itemNameStyle = style({
  fontSize: 13,
  color: themeContract.color.ink,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const itemSubtitleStyle = style({
  fontSize: 11,
  color: themeContract.color.inkSubtle,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const itemEnterHintStyle = style({
  flex: 'none',
  color: themeContract.color.inkSubtle,
})

export const emptyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: themeContract.spacing.xs,
  padding: `${themeContract.spacing.xl} ${themeContract.spacing.md}`,
  color: themeContract.color.inkSubtle,
  fontSize: 13,
})
