import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Progress } from './index'

describe('Progress', () => {
  it('renders progressbar role with current value', () => {
    render(<Progress value={42} aria-label="upload" />)
    const bar = screen.getByRole('progressbar', { name: 'upload' })
    expect(bar).toHaveAttribute('aria-valuenow', '42')
  })

  it('renders indeterminate when value is null', () => {
    render(<Progress value={null} aria-label="loading" />)
    const bar = screen.getByRole('progressbar', { name: 'loading' })
    expect(bar).not.toHaveAttribute('aria-valuenow')
  })

  it('shows label when provided', () => {
    render(<Progress value={20} label="Uploading" />)
    expect(screen.getByText('Uploading')).toBeInTheDocument()
  })
})
