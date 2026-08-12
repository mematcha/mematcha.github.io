from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration, populated from environment variables.

    Local development defaults to the in-memory mock connectors and a mock
    auth mode so the backend can run and be tested without any GCP access.
    """

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Connector selection: "mock" (in-memory) or "gcp" (Firestore + GCS).
    connector: str = "mock"

    # Auth mode: "mock" (accept a dev bearer token) or "firebase".
    auth_mode: str = "mock"

    # Comma-separated list of emails allowed to use the admin CMS API.
    admin_allowed_emails: str = "matcha.s@northeastern.edu"

    # GCP configuration (only required when connector == "gcp").
    gcp_project_id: str = ""
    firestore_database: str = "(default)"
    gcs_bucket: str = ""

    # Signed URL lifetime for CMS media uploads, in seconds.
    upload_url_ttl_seconds: int = 900

    # CORS: comma-separated list of allowed origins for the browser clients.
    cors_origins: str = "http://localhost:5173,https://mematcha.github.io"

    @property
    def allowed_emails(self) -> set[str]:
        return {e.strip().lower() for e in self.admin_allowed_emails.split(",") if e.strip()}

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
