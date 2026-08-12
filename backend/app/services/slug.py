"""Slug normalization and uniqueness helpers.

Rules:
- lowercase, trim outer whitespace
- spaces and underscores become hyphens
- strip characters outside [a-z0-9-]
- collapse repeated hyphens
- strip leading/trailing hyphens
- on collision within a collection, append -2, -3, ...
"""

from __future__ import annotations

import re
from typing import Optional

from ..connectors.base import DatabaseConnector

_NON_SLUG = re.compile(r"[^a-z0-9-]+")
_MULTI_HYPHEN = re.compile(r"-{2,}")


def slugify(value: str) -> str:
    text = (value or "").strip().lower()
    text = text.replace("_", "-").replace(" ", "-")
    text = _NON_SLUG.sub("", text)
    text = _MULTI_HYPHEN.sub("-", text)
    return text.strip("-")


def unique_slug(
    db: DatabaseConnector,
    collection: str,
    base: str,
    *,
    exclude_id: Optional[str] = None,
) -> str:
    """Return `base`, or `base-2`, `base-3`, … until unused in the collection."""
    candidate = base or "untitled"
    root = candidate
    n = 2
    while True:
        existing = db.find_one(collection, "slug", candidate)
        if existing is None or (exclude_id and existing.get("id") == exclude_id):
            return candidate
        candidate = f"{root}-{n}"
        n += 1


def resolve_slug(
    db: DatabaseConnector,
    collection: str,
    *,
    title: str,
    slug: str = "",
    exclude_id: Optional[str] = None,
) -> str:
    """Normalize a client slug, or derive one from title when empty, then uniquify."""
    base = slugify(slug) if (slug or "").strip() else slugify(title)
    if not base:
        base = "untitled"
    return unique_slug(db, collection, base, exclude_id=exclude_id)
