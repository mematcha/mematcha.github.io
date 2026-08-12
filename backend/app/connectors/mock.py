"""In-memory connector implementations for local development and tests."""

import copy
import uuid
from typing import Any, Optional

from .base import DatabaseConnector, Document, StorageConnector


class MockDatabaseConnector(DatabaseConnector):
    def __init__(self) -> None:
        self._data: dict[str, dict[str, Document]] = {}

    def _collection(self, collection: str) -> dict[str, Document]:
        return self._data.setdefault(collection, {})

    def get(self, collection: str, doc_id: str) -> Optional[Document]:
        doc = self._collection(collection).get(doc_id)
        return copy.deepcopy(doc) if doc is not None else None

    def list(
        self,
        collection: str,
        filters: Optional[dict[str, Any]] = None,
        order_by: Optional[str] = None,
        descending: bool = False,
    ) -> list[Document]:
        items = [copy.deepcopy(d) for d in self._collection(collection).values()]
        if filters:
            items = [d for d in items if all(d.get(k) == v for k, v in filters.items())]
        if order_by:
            items.sort(
                key=lambda d: (d.get(order_by) is None, d.get(order_by)),
                reverse=descending,
            )
        return items

    def find_one(self, collection: str, field: str, value: Any) -> Optional[Document]:
        for doc in self._collection(collection).values():
            if doc.get(field) == value:
                return copy.deepcopy(doc)
        return None

    def set(self, collection: str, doc_id: str, data: Document) -> Document:
        stored = copy.deepcopy(data)
        stored["id"] = doc_id
        self._collection(collection)[doc_id] = stored
        return copy.deepcopy(stored)

    def create(self, collection: str, data: Document, doc_id: Optional[str] = None) -> Document:
        new_id = doc_id or uuid.uuid4().hex
        return self.set(collection, new_id, data)

    def update(self, collection: str, doc_id: str, data: Document) -> Optional[Document]:
        existing = self._collection(collection).get(doc_id)
        if existing is None:
            return None
        existing.update(copy.deepcopy(data))
        existing["id"] = doc_id
        return copy.deepcopy(existing)

    def delete(self, collection: str, doc_id: str) -> bool:
        return self._collection(collection).pop(doc_id, None) is not None


class MockStorageConnector(StorageConnector):
    """Returns fake but well-formed URLs so the CMS upload flow works offline."""

    def __init__(self, base_url: str = "http://localhost:8000/mock-storage") -> None:
        self.base_url = base_url.rstrip("/")

    def create_upload_url(self, path: str, content_type: str, ttl_seconds: int) -> str:
        return f"{self.base_url}/upload/{path}"

    def public_url(self, path: str) -> str:
        return f"{self.base_url}/{path}"
