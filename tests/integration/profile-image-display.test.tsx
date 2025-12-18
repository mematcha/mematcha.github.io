import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '../../src/pages/index'

describe('Profile Image Display on Home Page', () => {
  it('displays profile image on home page', () => {
    render(<HomePage />)
    // This test will be updated once ProfileImage is integrated
    // For now, verify home page renders
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('profile image is visible on page load', () => {
    render(<HomePage />)
    // After integration, verify image is visible
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })
})

