import os

# Configure the mock stack before any app module reads settings.
os.environ.setdefault("CONNECTOR", "mock")
os.environ.setdefault("AUTH_MODE", "mock")
os.environ.setdefault("ADMIN_ALLOWED_EMAILS", "admin@example.com")

import pytest
from fastapi.testclient import TestClient

from app.config import get_settings
from app.connectors.factory import reset_connectors
from app.main import app

ADMIN_EMAIL = "admin@example.com"
ADMIN_TOKEN = f"dev:{ADMIN_EMAIL}"
OUTSIDER_TOKEN = "dev:stranger@example.com"


@pytest.fixture(autouse=True)
def _fresh_store():
    # Give every test a clean in-memory store, then let startup reseed it.
    get_settings.cache_clear()
    reset_connectors()
    with TestClient(app) as client:
        yield client


@pytest.fixture()
def client(_fresh_store):
    return _fresh_store


def auth(token: str = ADMIN_TOKEN) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}
