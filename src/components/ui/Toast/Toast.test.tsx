import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { ToastViewport, toast } from './index'

afterEach(() => {
  toast.dismiss()
})

describe('Toast', () => {
  it('mounts the sonner viewport once a toast is fired', async () => {
    render(<ToastViewport position="top-right" />)
    await act(async () => {
      toast('hi')
      await new Promise((r) => setTimeout(r, 50))
    })
    expect(document.querySelector('[data-sonner-toaster]')).toBeInTheDocument()
  })

  it('renders the four semantic variants', async () => {
    render(<ToastViewport />)

    await act(async () => {
      toast.success('saved')
      toast.error('boom')
      toast.warning('careful')
      toast.info('fyi')
      await new Promise((r) => setTimeout(r, 50))
    })

    expect(await screen.findByText('saved')).toBeInTheDocument()
    expect(await screen.findByText('boom')).toBeInTheDocument()
    expect(await screen.findByText('careful')).toBeInTheDocument()
    expect(await screen.findByText('fyi')).toBeInTheDocument()
  })
})
