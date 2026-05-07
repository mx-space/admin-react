import { keyframes, style } from '@vanilla-extract/css'

const spin = keyframes({
  to: { transform: 'rotate(360deg)' },
})

export const spinnerStyle = style({
  display: 'inline-block',
  animation: `${spin} 720ms linear infinite`,
})
