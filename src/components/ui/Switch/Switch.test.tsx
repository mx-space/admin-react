import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { Switch } from './index'

describe('Switch', () => {
  it('toggles between checked and unchecked', () => {
    function Harness() {
      const [checked, setChecked] = useState(false)
      return (
        <Switch
          checked={checked}
          onCheckedChange={setChecked}
          aria-label="enable"
        />
      )
    }
    render(<Harness />)
    const sw = screen.getByRole('switch', { name: 'enable' })
    expect(sw).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(sw)
    expect(sw).toHaveAttribute('aria-checked', 'true')
  })

  it('does not fire change when disabled', () => {
    const onChange = vi.fn()
    render(
      <Switch
        defaultChecked={false}
        onCheckedChange={onChange}
        disabled
        aria-label="lock"
      />,
    )
    const sw = screen.getByRole('switch', { name: 'lock' })
    fireEvent.click(sw)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('applies the size variant class', () => {
    render(<Switch defaultChecked size="lg" aria-label="big" />)
    const sw = screen.getByRole('switch', { name: 'big' })
    expect(sw.className).toMatch(/size_lg/)
  })
})
