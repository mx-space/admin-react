import { useForm } from '@tanstack/react-form'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { Input } from '~/components/ui'

import { Form } from './Form'
import { FormField } from './FormField'

const schema = z.object({
  name: z.string().min(1, 'name required'),
  email: z.email('email invalid'),
})
type Values = z.infer<typeof schema>

function Harness({ onSubmit }: { onSubmit: (v: Values) => void }) {
  const form = useForm({
    defaultValues: { name: '', email: '' } as Values,
    validators: { onChange: schema, onSubmit: schema },
    onSubmit: ({ value }) => onSubmit(value),
  })
  return (
    <Form form={form}>
      <FormField<Values, 'name'> name="name" label="Name" required>
        {({ field }) => <Input {...field} placeholder="name" />}
      </FormField>
      <FormField<Values, 'email'> name="email" label="Email">
        {({ field }) => <Input {...field} placeholder="email" />}
      </FormField>
      <button type="submit">Save</button>
    </Form>
  )
}

describe('Form', () => {
  it('renders fields from a zod schema and submits valid values', async () => {
    const onSubmit = vi.fn()
    render(<Harness onSubmit={onSubmit} />)
    fireEvent.change(screen.getByPlaceholderText('name'), {
      target: { value: 'Innei' },
    })
    fireEvent.change(screen.getByPlaceholderText('email'), {
      target: { value: 'cc@innei.in' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit.mock.calls[0][0]).toEqual({
      name: 'Innei',
      email: 'cc@innei.in',
    })
  })

  it('shows zod validation errors and blocks submit', async () => {
    const onSubmit = vi.fn()
    render(<Harness onSubmit={onSubmit} />)
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(await screen.findByText('name required')).toBeInTheDocument()
    expect(screen.getByText('email invalid')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
