import type { CSSProperties } from 'react'

import { cx } from '~/utils/cx'

import { spinnerStyle } from './Spinner.css'

const sizeMap = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
} as const

export type SpinnerSize = keyof typeof sizeMap

export interface SpinnerProps {
  size?: SpinnerSize
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

export const Spinner = ({
  size = 'sm',
  className,
  style,
  'aria-label': ariaLabel,
}: SpinnerProps) => {
  const px = sizeMap[size]
  const decorative = ariaLabel === undefined
  return (
    <svg
      className={cx(spinnerStyle, className)}
      style={style}
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      role={decorative ? undefined : 'status'}
      aria-hidden={decorative || undefined}
      aria-label={ariaLabel}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
