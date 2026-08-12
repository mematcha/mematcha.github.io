"""Shared seeding routine used by local dev startup and the Firestore seed script."""

from .connectors.base import DatabaseConnector
from .services.content import (
    DEMOS,
    EDUCATION,
    EXPERIENCE,
    POSTS,
    PROFILE,
    PROJECTS,
    SKILLS,
)
from . import seed_data


def seed_database(db: DatabaseConnector, *, overwrite: bool = False) -> dict[str, int]:
    """Populate the database with the initial content.

    When `overwrite` is False (default), collections that already contain data
    are skipped so re-running is safe and does not duplicate documents.
    """
    counts: dict[str, int] = {}

    if overwrite or db.get(PROFILE, "profile") is None:
        db.set(PROFILE, "profile", seed_data.PROFILE)
        counts[PROFILE] = 1

    seeds = {
        EDUCATION: seed_data.EDUCATION,
        EXPERIENCE: seed_data.EXPERIENCE,
        SKILLS: seed_data.SKILLS,
        PROJECTS: seed_data.PROJECTS,
        POSTS: seed_data.POSTS,
        DEMOS: seed_data.DEMOS,
    }

    for collection, items in seeds.items():
        if not overwrite and db.list(collection):
            continue
        for item in items:
            db.create(collection, dict(item))
        counts[collection] = len(items)

    return counts
