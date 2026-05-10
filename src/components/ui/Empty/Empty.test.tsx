import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Empty } from './index'

describe('Empty', () => {
  it('renders default title and icon', () => {
    render(<Empty />)
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument()
  })

  it('renders custom title + description + action', () => {
    render(
      <Empty
        title="No posts"
        description="Try inviting a teammate."
        action={<button type="button">Invite</button>}
      />,
    )
    expect(screen.getByText('No posts')).toBeInTheDocument()
    expect(screen.getByText('Try inviting a teammate.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Invite' })).toBeInTheDocument()
  })
})
