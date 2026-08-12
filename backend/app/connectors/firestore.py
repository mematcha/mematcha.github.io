"""Firestore-backed database connector (production)."""

import uuid
from typing import Any, Optional

from google.cloud import firestore

from .base import DatabaseConnector, Document


class FirestoreConnector(DatabaseConnector):
    def __init__(self, project_id: str, database: str = "(default)") -> None:
        self._client = firestore.Client(project=project_id, database=database)

    def get(self, collection: str, doc_id: str) -> Optional[Document]:
        snap = self._client.collection(collection).document(doc_id).get()
        if not snap.exists:
            return None
        data = snap.to_dict() or {}
        data["id"] = snap.id
        return data

    def list(
        self,
        collection: str,
        filters: Optional[dict[str, Any]] = None,
        order_by: Optional[str] = None,
        descending: bool = False,
    ) -> list[Document]:
        query: Any = self._client.collection(collection)
        for key, value in (filters or {}).items():
            query = query.where(key, "==", value)
        if order_by:
            direction = firestore.Query.DESCENDING if descending else firestore.Query.ASCENDING
            query = query.order_by(order_by, direction=direction)
        results = []
        for snap in query.stream():
            data = snap.to_dict() or {}
            data["id"] = snap.id
            results.append(data)
        return results

    def find_one(self, collection: str, field: str, value: Any) -> Optional[Document]:
        query = self._client.collection(collection).where(field, "==", value).limit(1)
        for snap in query.stream():
            data = snap.to_dict() or {}
            data["id"] = snap.id
            return data
        return None

    def set(self, collection: str, doc_id: str, data: Document) -> Document:
        payload = {k: v for k, v in data.items() if k != "id"}
        self._client.collection(collection).document(doc_id).set(payload)
        return self.get(collection, doc_id) or {**data, "id": doc_id}

    def create(self, collection: str, data: Document, doc_id: Optional[str] = None) -> Document:
        new_id = doc_id or uuid.uuid4().hex
        return self.set(collection, new_id, data)

    def update(self, collection: str, doc_id: str, data: Document) -> Optional[Document]:
        ref = self._client.collection(collection).document(doc_id)
        if not ref.get().exists:
            return None
        payload = {k: v for k, v in data.items() if k != "id"}
        ref.update(payload)
        return self.get(collection, doc_id)

    def delete(self, collection: str, doc_id: str) -> bool:
        ref = self._client.collection(collection).document(doc_id)
        if not ref.get().exists:
            return False
        ref.delete()
        return True
