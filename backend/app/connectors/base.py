"""Abstract connector interfaces.

The rest of the app depends only on these interfaces, so the same route and
service code runs against the in-memory mock (local dev / tests) or the real
GCP-backed implementations (Firestore + Cloud Storage) in production.
"""

from abc import ABC, abstractmethod
from typing import Any, Optional

Document = dict[str, Any]


class DatabaseConnector(ABC):
    @abstractmethod
    def get(self, collection: str, doc_id: str) -> Optional[Document]:
        ...

    @abstractmethod
    def list(
        self,
        collection: str,
        filters: Optional[dict[str, Any]] = None,
        order_by: Optional[str] = None,
        descending: bool = False,
    ) -> list[Document]:
        ...

    @abstractmethod
    def find_one(self, collection: str, field: str, value: Any) -> Optional[Document]:
        ...

    @abstractmethod
    def set(self, collection: str, doc_id: str, data: Document) -> Document:
        ...

    @abstractmethod
    def create(self, collection: str, data: Document, doc_id: Optional[str] = None) -> Document:
        ...

    @abstractmethod
    def update(self, collection: str, doc_id: str, data: Document) -> Optional[Document]:
        ...

    @abstractmethod
    def delete(self, collection: str, doc_id: str) -> bool:
        ...


class StorageConnector(ABC):
    @abstractmethod
    def create_upload_url(
        self, path: str, content_type: str, ttl_seconds: int
    ) -> str:
        """Return a URL the browser can PUT bytes to (or a local stand-in)."""

    @abstractmethod
    def public_url(self, path: str) -> str:
        """Return the public URL at which an uploaded object is served."""
