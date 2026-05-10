import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { Radio } from './index'

describe('Radio', () => {
  it('selects an option via click', () => {
    function Harness() {
      const [value, setValue] = useState<string>('a')
      return (
        <Radio.Group
          value={value}
          onValueChange={(v) => setValue(v as string)}
          aria-label="size"
        >
          <Radio.Item value="a">A</Radio.Item>
          <Radio.Item value="b">B</Radio.Item>
        </Radio.Group>
      )
    }
    render(<Harness />)
    const buttons = screen.getAllByRole('radio')
    expect(buttons[0]).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(buttons[1])
    expect(buttons[1]).toHaveAttribute('aria-checked', 'true')
  })

  it('applies orientation variant', () => {
    render(
      <Radio.Group orientation="horizontal" defaultValue="a" data-testid="g">
        <Radio.Item value="a">A</Radio.Item>
      </Radio.Group>,
    )
    expect(screen.getByTestId('g').className).toMatch(/orientation_horizontal/)
  })
})
