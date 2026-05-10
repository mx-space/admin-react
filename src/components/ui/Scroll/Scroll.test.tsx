import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Scroll } from './index'

describe('Scroll', () => {
  it('renders children inside the viewport', () => {
    render(
      <Scroll>
        <p>scroll body</p>
      </Scroll>,
    )
    expect(screen.getByText('scroll body')).toBeInTheDocument()
  })
})
