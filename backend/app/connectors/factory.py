"""Selects concrete connectors based on configuration.

Connectors are created lazily and cached so a single process reuses one client.
The GCP client libraries are imported only when the GCP connector is selected,
which keeps local/mock runs free of any GCP dependency at import time.
"""

from functools import lru_cache

from ..config import get_settings
from .base import DatabaseConnector, StorageConnector


@lru_cache
def get_database() -> DatabaseConnector:
    settings = get_settings()
    if settings.connector == "gcp":
        from .firestore import FirestoreConnector

        return FirestoreConnector(
            project_id=settings.gcp_project_id,
            database=settings.firestore_database,
        )
    from .mock import MockDatabaseConnector

    return MockDatabaseConnector()


@lru_cache
def get_storage() -> StorageConnector:
    settings = get_settings()
    if settings.connector == "gcp":
        from .gcs import GCSStorageConnector

        return GCSStorageConnector(
            bucket_name=settings.gcs_bucket,
            project_id=settings.gcp_project_id,
        )
    from .mock import MockStorageConnector

    return MockStorageConnector()


def reset_connectors() -> None:
    """Clear cached connectors (used by tests to get a fresh in-memory store)."""
    get_database.cache_clear()
    get_storage.cache_clear()
