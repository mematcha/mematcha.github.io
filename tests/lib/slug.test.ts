import { describe, expect, it } from 'vitest'

import { slugify } from '../../src/lib/slug'

describe('slugify', () => {
  it('normalizes titles into URL-safe slugs', () => {
    expect(slugify('  My Cool_Post!! ')).toBe('my-cool-post')
    expect(slugify('Hello---World')).toBe('hello-world')
    expect(slugify('A_B C')).toBe('a-b-c')
    expect(slugify('___')).toBe('')
  })
})
