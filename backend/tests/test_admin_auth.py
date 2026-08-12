from tests.conftest import OUTSIDER_TOKEN, auth


def test_admin_requires_token(client):
    resp = client.put("/api/admin/profile", json={"name": "X"})
    assert resp.status_code == 401


def test_admin_rejects_non_allowlisted_email(client):
    resp = client.get("/api/admin/posts", headers=auth(OUTSIDER_TOKEN))
    assert resp.status_code == 403


def test_admin_rejects_malformed_token(client):
    resp = client.get("/api/admin/posts", headers={"Authorization": "Bearer not-a-dev-token"})
    assert resp.status_code == 401


def test_admin_allows_allowlisted_email(client):
    resp = client.get("/api/admin/me", headers=auth())
    assert resp.status_code == 200
    assert resp.json()["email"] == "matcha.s@northeastern.edu"
