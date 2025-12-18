import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Icon from '../../src/components/Icon/Icon'

describe('Icon', () => {
  it('renders icon with correct name', () => {
    const { container } = render(<Icon name="User" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies size prop correctly', () => {
    const { container } = render(<Icon name="Mail" size={32} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    // Lucide icons use width/height attributes
    expect(svg?.getAttribute('width')).toBe('32')
    expect(svg?.getAttribute('height')).toBe('32')
  })

  it('applies color prop correctly', () => {
    const { container } = render(<Icon name="Github" color="#ff0000" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('handles invalid icon names gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container } = render(<Icon name="InvalidIconName" />)
    expect(container.querySelector('svg')).toBeNull()
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('supports ariaLabel for accessibility', () => {
    const { container } = render(
      <Icon name="Mail" ariaLabel="Email icon" />
    )
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('aria-label')).toBe('Email icon')
  })

  it('applies className correctly', () => {
    const { container } = render(
      <Icon name="User" className="custom-class" />
    )
    const svg = container.querySelector('svg')
    expect(svg?.classList.contains('custom-class')).toBe(true)
  })
})

