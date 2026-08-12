from tests.conftest import auth


def test_draft_post_hidden_then_published_visible(client):
    # Create a draft post via the CMS admin API.
    create = client.post(
        "/api/admin/posts",
        headers=auth(),
        json={"slug": "hello-world", "title": "Hello World", "body_markdown": "# Hi",
              "status": "draft"},
    )
    assert create.status_code == 200
    post_id = create.json()["id"]

    # Draft must not appear on the public API.
    public = client.get("/api/posts").json()
    assert all(p["slug"] != "hello-world" for p in public)
    assert client.get("/api/posts/hello-world").status_code == 404

    # Publish it.
    published = client.post(f"/api/admin/posts/{post_id}/publish", headers=auth())
    assert published.status_code == 200
    assert published.json()["status"] == "published"
    assert published.json()["published_at"] is not None

    # Now it is publicly visible.
    assert client.get("/api/posts/hello-world").status_code == 200


def test_republish_preserves_original_published_at(client):
    created = client.post(
        "/api/admin/posts",
        headers=auth(),
        json={"slug": "evergreen", "title": "Evergreen", "status": "draft"},
    )
    post_id = created.json()["id"]

    first = client.post(f"/api/admin/posts/{post_id}/publish", headers=auth())
    assert first.status_code == 200
    original = first.json()["published_at"]
    assert original is not None

    unpublished = client.post(
        f"/api/admin/posts/{post_id}/publish?publish=false", headers=auth()
    )
    assert unpublished.status_code == 200
    assert unpublished.json()["status"] == "draft"
    # First-publish timestamp is retained while draft.
    assert unpublished.json()["published_at"] == original

    republished = client.post(f"/api/admin/posts/{post_id}/publish", headers=auth())
    assert republished.status_code == 200
    assert republished.json()["status"] == "published"
    assert republished.json()["published_at"] == original


def test_profile_update_reflected_publicly(client):
    resp = client.put(
        "/api/admin/profile",
        headers=auth(),
        json={"name": "Sathwik M.", "tagline": "ML Engineer"},
    )
    assert resp.status_code == 200
    assert resp.json()["updated_by_email"] == "admin@example.com"
    assert client.get("/api/profile").json()["name"] == "Sathwik M."


def test_project_crud_lifecycle(client):
    created = client.post(
        "/api/admin/projects",
        headers=auth(),
        json={"slug": "temp", "title": "Temp Project", "status": "draft"},
    )
    assert created.status_code == 200
    pid = created.json()["id"]

    updated = client.put(
        f"/api/admin/projects/{pid}",
        headers=auth(),
        json={"slug": "temp", "title": "Renamed", "status": "draft"},
    )
    assert updated.json()["title"] == "Renamed"

    deleted = client.delete(f"/api/admin/projects/{pid}", headers=auth())
    assert deleted.status_code == 200
    assert client.get("/api/admin/projects", headers=auth()).json().__len__() >= 3


def test_media_upload_url(client):
    resp = client.post(
        "/api/admin/media/upload-url",
        headers=auth(),
        json={"filename": "cover.png", "content_type": "image/png"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["upload_url"]
    assert body["public_url"]
    assert body["gcs_path"].startswith("media/")
