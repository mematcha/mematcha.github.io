/**
 * Slug helpers shared by the CMS editors.
 *
 * Mirrors backend/app/services/slug.py so the UI preview matches what the API
 * will store (uniqueness suffixes are applied server-side on save).
 */

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}
