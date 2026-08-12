"""Shared FastAPI dependencies."""

from .connectors.base import StorageConnector
from .connectors.factory import get_database, get_storage
from .services.content import ContentService


def get_content_service() -> ContentService:
    return ContentService(get_database())


def get_storage_connector() -> StorageConnector:
    return get_storage()
