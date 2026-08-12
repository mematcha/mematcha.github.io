"""Cloud Storage-backed storage connector (production)."""

from datetime import timedelta

from google.cloud import storage

from .base import StorageConnector


class GCSStorageConnector(StorageConnector):
    def __init__(self, bucket_name: str, project_id: str = "") -> None:
        self._client = storage.Client(project=project_id or None)
        self._bucket_name = bucket_name
        self._bucket = self._client.bucket(bucket_name)

    def create_upload_url(self, path: str, content_type: str, ttl_seconds: int) -> str:
        blob = self._bucket.blob(path)
        return blob.generate_signed_url(
            version="v4",
            expiration=timedelta(seconds=ttl_seconds),
            method="PUT",
            content_type=content_type,
        )

    def public_url(self, path: str) -> str:
        return f"https://storage.googleapis.com/{self._bucket_name}/{path}"
