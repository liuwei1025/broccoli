import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from './App'

test('request an invite', async () => {
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

test('handles server error', async () => {
  render(<App />)

  const ele = screen.getByText(/Request an invite/i)
  fireEvent.click(ele)
  await waitFor(() => screen.findByRole('dialog'))

  // input
  const name: HTMLInputElement = screen.getByTestId('name')
  fireEvent.change(name, { target: { value: 'liuwei' } })
  expect(name.value).toBe('liuwei')

  const email: HTMLInputElement = screen.getByTestId('email')
  fireEvent.change(email, { target: { value: 'usedemail@airwallex.com' } })

  const confirm: HTMLInputElement = screen.getByTestId('confirm')
  fireEvent.change(confirm, { target: { value: 'usedemail@airwallex.com' } })

  expect(email.value).toEqual(confirm.value)

  const send = screen.getByText(/Send/i)
  expect(send).toBeInTheDocument()

  // send
  fireEvent.click(send)
  await waitFor(() => screen.findByTestId('dialog-remote-error'), {
    timeout: 1e4,
  })

  expect(screen.getByTestId('dialog-remote-error')).toHaveTextContent(
    'Email is already in use'
  )
})
