from app.connectors.mock import MockDatabaseConnector
from app.services.slug import resolve_slug, slugify, unique_slug
from tests.conftest import auth


def test_slugify_rules():
    assert slugify("  My Cool_Post!! ") == "my-cool-post"
    assert slugify("Hello---World") == "hello-world"
    assert slugify("___") == ""
    assert slugify("A_B C") == "a-b-c"


def test_unique_slug_appends_suffix():
    db = MockDatabaseConnector()
    db.create("posts", {"slug": "hello", "title": "Hello"})
    assert unique_slug(db, "posts", "hello") == "hello-2"
    db.create("posts", {"slug": "hello-2", "title": "Hello 2"})
    assert unique_slug(db, "posts", "hello") == "hello-3"


def test_unique_slug_allows_same_doc_on_update():
    db = MockDatabaseConnector()
    doc = db.create("posts", {"slug": "hello", "title": "Hello"}, doc_id="abc")
    assert unique_slug(db, "posts", "hello", exclude_id=doc["id"]) == "hello"


def test_resolve_slug_from_title_when_empty():
    db = MockDatabaseConnector()
    assert resolve_slug(db, "posts", title="Welcome Home", slug="") == "welcome-home"


def test_create_normalizes_and_uniquifies_slug(client):
    first = client.post(
        "/api/admin/posts",
        headers=auth(),
        json={"title": "Hello World!!", "body_markdown": "x", "status": "draft"},
    )
    assert first.status_code == 200
    assert first.json()["slug"] == "hello-world"

    second = client.post(
        "/api/admin/posts",
        headers=auth(),
        json={"title": "Hello World!!", "body_markdown": "y", "status": "draft"},
    )
    assert second.status_code == 200
    assert second.json()["slug"] == "hello-world-2"


def test_update_normalizes_client_slug(client):
    created = client.post(
        "/api/admin/posts",
        headers=auth(),
        json={"title": "Original", "slug": "original", "status": "draft"},
    )
    post_id = created.json()["id"]
    updated = client.put(
        f"/api/admin/posts/{post_id}",
        headers=auth(),
        json={"title": "Original", "slug": "  My_New Slug!! ", "status": "draft"},
    )
    assert updated.status_code == 200
    assert updated.json()["slug"] == "my-new-slug"
