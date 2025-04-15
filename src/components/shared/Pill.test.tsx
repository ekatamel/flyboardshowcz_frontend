import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Pill } from './Pill'

describe(Pill, () => {
  it('renders Pill component with text', () => {
    render(<Pill text='Pill text' />)

    const pill = screen.getByText('Pill text')

    expect(pill).toBeInTheDocument()
    expect(pill.textContent).toBe('Pill text')
  })

  it('calls onClick when user clicks on pill ', async () => {
    const onClick = jest.fn()

    render(<Pill text='Pill text' onClick={onClick} />)

    const pill = screen.getByText('Pill text')

    await userEvent.click(pill)

    expect(onClick).toHaveBeenCalled()
  })

  it('does not call onClick if disabled is true', async () => {
    const onClick = jest.fn()

    render(<Pill text='Pill text' onClick={onClick} disabled={true} />)

    const pill = screen.getByText('Pill text')

    await userEvent.click(pill)

    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies custom classNames if provided', () => {
    render(<Pill text='Pill text' disabled={true} className='custom-class' />)

    const pill = screen.getByText('Pill text')

    expect(pill).toHaveClass('custom-class')
  })
})
