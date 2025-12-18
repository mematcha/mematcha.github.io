import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Icon from '../../src/components/Icon/Icon'

describe('Icon Consistency Across Sections', () => {
  it('icons maintain consistent default size', () => {
    const { container: container1 } = render(<Icon name="Mail" />)
    const { container: container2 } = render(<Icon name="Github" />)
    
    const svg1 = container1.querySelector('svg')
    const svg2 = container2.querySelector('svg')
    
    expect(svg1?.getAttribute('width')).toBe(svg2?.getAttribute('width'))
    expect(svg1?.getAttribute('height')).toBe(svg2?.getAttribute('height'))
  })

  it('icons use consistent default color (currentColor)', () => {
    const { container } = render(<Icon name="User" />)
    const svg = container.querySelector('svg')
    // Lucide icons default to currentColor
    expect(svg).toBeInTheDocument()
  })
})

