import { useState } from 'react'

import { slugify } from '../../lib/slug'

/**
 * Auto-fills slug from title while creating a new item, until the user edits
 * the slug field manually. Existing items start locked (title edits do not
 * overwrite the slug).
 *
 * Manual slug input is left as-typed; normalize on blur. The backend always
 * re-normalizes and resolves collisions on save.
 */
export function useAutoSlug(isNew: boolean) {
  const [slugLocked, setSlugLocked] = useState(!isNew)

  const onTitleChange = (title: string, setSlug: (slug: string) => void) => {
    if (!slugLocked) setSlug(slugify(title))
  }

  const onSlugChange = (value: string, setSlug: (slug: string) => void) => {
    setSlugLocked(true)
    setSlug(value)
  }

  const onSlugBlur = (value: string, setSlug: (slug: string) => void) => {
    setSlug(slugify(value))
  }

  return { slugLocked, onTitleChange, onSlugChange, onSlugBlur, setSlugLocked }
}
