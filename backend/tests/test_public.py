def test_health(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert body["connector"] == "mock"


def test_profile_seeded(client):
    resp = client.get("/api/profile")
    assert resp.status_code == 200
    assert resp.json()["name"] == "Sathwik Matcha"


def test_projects_published_only(client):
    resp = client.get("/api/projects")
    assert resp.status_code == 200
    projects = resp.json()
    assert len(projects) >= 3
    assert all(p["status"] == "published" for p in projects)


def test_get_project_by_slug(client):
    resp = client.get("/api/projects/project-aurelia-rag")
    assert resp.status_code == 200
    assert resp.json()["slug"] == "project-aurelia-rag"


def test_missing_project_returns_404(client):
    assert client.get("/api/projects/does-not-exist").status_code == 404


def test_posts_and_education(client):
    assert client.get("/api/posts").status_code == 200
    assert len(client.get("/api/education").json()) == 2
