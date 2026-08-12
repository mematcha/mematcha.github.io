"""Content service: thin business logic over the database connector.

Centralizes collection names, audit-field stamping, publish transitions, and
the published-only filtering that the public API relies on.
"""

from datetime import datetime, timezone
from typing import Any, Optional

from ..connectors.base import DatabaseConnector, Document

PROFILE = "profile"
EDUCATION = "education"
EXPERIENCE = "experience"
SKILLS = "skill_categories"
PROJECTS = "projects"
POSTS = "posts"
DEMOS = "demos"
MEDIA = "media"

# Collections that carry a draft/published status.
PUBLISHABLE = {PROJECTS, POSTS, DEMOS}


def _now() -> datetime:
    return datetime.now(timezone.utc)


class ContentService:
    def __init__(self, db: DatabaseConnector) -> None:
        self.db = db

    # ---- Public reads (published only for publishable collections) ---------

    def list_public(self, collection: str, order_by: Optional[str] = None,
                    descending: bool = False) -> list[Document]:
        filters = {"status": "published"} if collection in PUBLISHABLE else None
        return self.db.list(collection, filters=filters, order_by=order_by, descending=descending)

    def get_public_by_slug(self, collection: str, slug: str) -> Optional[Document]:
        doc = self.db.find_one(collection, "slug", slug)
        if doc is None:
            return None
        if collection in PUBLISHABLE and doc.get("status") != "published":
            return None
        return doc

    def get_profile(self) -> Optional[Document]:
        return self.db.get(PROFILE, "profile")

    # ---- Admin reads (everything, incl. drafts) ----------------------------

    def list_all(self, collection: str, order_by: Optional[str] = None,
                 descending: bool = False) -> list[Document]:
        return self.db.list(collection, order_by=order_by, descending=descending)

    def get(self, collection: str, doc_id: str) -> Optional[Document]:
        return self.db.get(collection, doc_id)

    # ---- Admin writes ------------------------------------------------------

    def _stamp(self, data: dict[str, Any], email: str, *, creating: bool) -> dict[str, Any]:
        now = _now()
        data = dict(data)
        data["updated_at"] = now
        data["updated_by_email"] = email
        if creating:
            data.setdefault("created_at", now)
        if collection_is_publishable(data) and data.get("status") == "published" \
                and not data.get("published_at"):
            data["published_at"] = now
        return data

    def set_profile(self, data: dict[str, Any], email: str) -> Document:
        stamped = self._stamp(data, email, creating=False)
        return self.db.set(PROFILE, "profile", stamped)

    def create(self, collection: str, data: dict[str, Any], email: str) -> Document:
        stamped = self._stamp(data, email, creating=True)
        return self.db.create(collection, stamped)

    def update(self, collection: str, doc_id: str, data: dict[str, Any],
               email: str) -> Optional[Document]:
        stamped = self._stamp(data, email, creating=False)
        return self.db.update(collection, doc_id, stamped)

    def delete(self, collection: str, doc_id: str) -> bool:
        return self.db.delete(collection, doc_id)

    def publish(self, collection: str, doc_id: str, publish: bool,
                email: str) -> Optional[Document]:
        patch = {
            "status": "published" if publish else "draft",
            "updated_at": _now(),
            "updated_by_email": email,
        }
        if publish:
            patch["published_at"] = _now()
        return self.db.update(collection, doc_id, patch)


def collection_is_publishable(data: dict[str, Any]) -> bool:
    return "status" in data
