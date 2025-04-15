import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sunglasses } from 'assets/images/Sunglasses'

import { Tile } from './Tile'

describe(Tile, () => {
  const defaultProps = {
    title: 'Tile text',
    subtitle: 'Subtitle text',
    onClick: () => {},
    icon: Sunglasses,
    isSelected: true,
  }

  it('renders Tile component with title and subtitle', () => {
    render(<Tile {...defaultProps} />)

    const tile = screen.getByText('Tile text')

    expect(tile).toBeInTheDocument()
    expect(tile).toHaveTextContent('Tile text')
    expect(screen.getByText('Subtitle text')).toBeInTheDocument()
  })

  it('renders Tile component with icon', () => {
    render(<Tile {...defaultProps} />)

    const icon = screen.getByTestId('tile-icon')

    expect(icon).toBeInTheDocument()
  })

  it('displays specific styles if Tile is NOT selected', () => {
    render(<Tile {...defaultProps} isSelected={false} />)

    const tile = screen.getByText('Tile text')
    const subtitle = screen.getByText('Subtitle text')
    const icon = screen.getByTestId('tile-icon')
    const path = icon.querySelector('path')

    expect(tile).toHaveClass('bg-black')
    expect(tile).toHaveClass('text-yellow')
    expect(tile).toHaveClass('border border-yellow')
    expect(subtitle).toHaveClass('text-white')
    expect(path).toHaveAttribute('fill', 'rgba(255, 234, 0, 1)')
  })

  it('displays specific styles if Tile is selected', () => {
    render(<Tile {...defaultProps} />)

    const tile = screen.getByText('Tile text')
    const subtitle = screen.getByText('Subtitle text')
    const icon = screen.getByTestId('tile-icon')
    const path = icon.querySelector('path')

    expect(tile).toHaveClass('bg-yellow')
    expect(tile).toHaveClass('text-black')
    expect(tile).toHaveClass('transition')
    expect(subtitle).toHaveClass('text-black')
    expect(path).toHaveAttribute('fill', 'black')
  })

  it('displays tooltip if provided', () => {
    render(<Tile {...defaultProps} tooltip='Tooltip text' />)

    const alert = screen.getByTestId('alert')
    const path = alert.querySelector('path')

    expect(alert).toBeInTheDocument()
    expect(path).toHaveAttribute('fill', '#000000')
  })

  it('displays badge if badgeText is provided', () => {
    render(<Tile {...defaultProps} badgeText='Bestseller!' />)

    const badge = screen.getByText('Bestseller!')

    expect(badge).toBeInTheDocument()
  })

  it('calls onClick when tile is clicked', async () => {
    const onClick = jest.fn()

    render(<Tile {...defaultProps} onClick={onClick} />)

    const tile = screen.getByText('Tile text')

    await userEvent.click(tile)

    expect(onClick).toHaveBeenCalled()
  })

  it('displays correct styles for hovered/unhovered Tile', async () => {
    render(<Tile {...defaultProps} isSelected={false} />)

    const tile = screen.getByText('Tile text')
    const icon = screen.getByTestId('tile-icon')
    const path = icon.querySelector('path')
    const subtitle = screen.getByText('Subtitle text')

    await act(async () => {
      userEvent.hover(tile)
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(path).toHaveAttribute('fill', 'black')
    expect(subtitle).toHaveClass('text-black')

    await act(async () => {
      userEvent.unhover(tile)
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(path).toHaveAttribute('fill', 'rgba(255, 234, 0, 1)')
    expect(subtitle).toHaveClass('text-white')
  })
})
