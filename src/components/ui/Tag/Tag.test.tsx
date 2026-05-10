import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Tag } from './index'

describe('Tag', () => {
  it('renders with default tone class', () => {
    render(<Tag>label</Tag>)
    expect(screen.getByText('label').className).toMatch(/tone_neutral/)
  })

  it('applies tone variant', () => {
    render(<Tag tone="danger">danger</Tag>)
    expect(screen.getByText('danger').className).toMatch(/tone_danger/)
  })

  it('renders close button and fires onClose when clicked', () => {
    const onClose = vi.fn()
    render(
      <Tag closable onClose={onClose}>
        closable
      </Tag>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Remove tag' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
