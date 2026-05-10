import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { Checkbox } from './index'

describe('Checkbox', () => {
  it('toggles between checked and unchecked', () => {
    function Harness() {
      const [checked, setChecked] = useState(false)
      return (
        <Checkbox
          checked={checked}
          onCheckedChange={setChecked}
          aria-label="agree"
        />
      )
    }
    render(<Harness />)
    const cb = screen.getByRole('checkbox', { name: 'agree' })
    expect(cb).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(cb)
    expect(cb).toHaveAttribute('aria-checked', 'true')
  })

  it('reflects indeterminate state on aria-checked', () => {
    render(
      <Checkbox indeterminate defaultChecked={false} aria-label="mixed" />,
    )
    const cb = screen.getByRole('checkbox', { name: 'mixed' })
    expect(cb).toHaveAttribute('aria-checked', 'mixed')
  })

  it('does not fire change when disabled', () => {
    const onChange = vi.fn()
    render(
      <Checkbox
        defaultChecked={false}
        onCheckedChange={onChange}
        disabled
        aria-label="lock"
      />,
    )
    fireEvent.click(screen.getByRole('checkbox', { name: 'lock' }))
    expect(onChange).not.toHaveBeenCalled()
  })
})
