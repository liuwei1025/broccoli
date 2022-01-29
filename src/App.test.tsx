import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from './App'

test('renders request an invite', async () => {
  render(<App />)
  const ele = screen.getByText(/Request an invite/i)
  expect(ele).toBeInTheDocument()

  fireEvent.click(ele)
  await waitFor(() => screen.findByRole('dialog'))

  // input
  const name: HTMLInputElement = screen.getByTestId('name')
  fireEvent.change(name, { target: { value: 'liuwei' } })
  expect(name.value).toBe('liuwei')

  const email: HTMLInputElement = screen.getByTestId('email')
  fireEvent.change(email, { target: { value: 'we1025@qq.com' } })
  expect(email.value).toBe('we1025@qq.com')

  const confirm: HTMLInputElement = screen.getByTestId('confirm')
  fireEvent.change(confirm, { target: { value: 'we1025@qq.com' } })
  expect(confirm.value).toBe('we1025@qq.com')

  expect(email.value).toEqual(confirm.value)

  const send = screen.getByText(/Send/i)
  expect(send).toBeInTheDocument()

  // send
  fireEvent.click(send)
  await waitFor(() => Promise.resolve())
  expect(send.innerHTML).toEqual('Sending, please wait...')
})
