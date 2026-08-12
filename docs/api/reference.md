# API Reference

The authoritative, machine-readable spec is
[`openapi.json`](openapi.json), generated from the FastAPI app. When the server
is running you can also browse:

- Interactive docs: `GET /docs`
- Raw spec: `GET /openapi.json`

Base URL is configured per environment (`VITE_API_URL` on the front end).

## Authentication

Admin endpoints require an `Authorization: Bearer <token>` header.

- Production (`AUTH_MODE=firebase`): token is a Firebase ID token. The API
  verifies it and checks the email against `ADMIN_ALLOWED_EMAILS`.
- Local (`AUTH_MODE=mock`): token is `dev:<email>`; the same allowlist applies.

Responses: `401` for missing/invalid token, `403` for a valid token whose email
is not allowlisted.

## Public endpoints (read-only)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness + active connector/auth mode |
| GET | `/api/profile` | Profile document |
| GET | `/api/education` | Education entries (ordered) |
| GET | `/api/experience` | Experience entries (ordered) |
| GET | `/api/skills` | Skill categories (ordered) |
| GET | `/api/projects` | Published projects |
| GET | `/api/projects/{slug}` | Single published project |
| GET | `/api/posts` | Published posts |
| GET | `/api/posts/{slug}` | Single published post |
| GET | `/api/demos` | Published demos |
| GET | `/api/demos/{slug}` | Single published demo |

## Admin endpoints (auth required)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/me` | Current admin identity |
| PUT | `/api/admin/profile` | Update profile |
| GET/POST | `/api/admin/education` | List / create |
| PUT/DELETE | `/api/admin/education/{id}` | Update / delete |
| GET/POST | `/api/admin/experience` | List / create |
| PUT/DELETE | `/api/admin/experience/{id}` | Update / delete |
| GET/POST | `/api/admin/skills` | List / create |
| PUT/DELETE | `/api/admin/skills/{id}` | Update / delete |
| GET/POST | `/api/admin/projects` | List (incl. drafts) / create |
| PUT/DELETE | `/api/admin/projects/{id}` | Update / delete |
| POST | `/api/admin/projects/{id}/publish?publish=true` | Publish / unpublish |
| GET/POST | `/api/admin/posts` | List (incl. drafts) / create |
| PUT/DELETE | `/api/admin/posts/{id}` | Update / delete |
| POST | `/api/admin/posts/{id}/publish?publish=true` | Publish / unpublish |
| GET/POST | `/api/admin/demos` | List (incl. drafts) / create |
| PUT/DELETE | `/api/admin/demos/{id}` | Update / delete |
| POST | `/api/admin/demos/{id}/publish?publish=true` | Publish / unpublish |
| POST | `/api/admin/media/upload-url` | Get a signed upload URL |
| GET | `/api/admin/media` | List uploaded media |

## Media upload flow

1. `POST /api/admin/media/upload-url` with `{ filename, content_type }`.
2. Response returns `upload_url` (signed), `public_url`, and `gcs_path`.
3. Client `PUT`s the file bytes to `upload_url`.
4. Store `public_url` on the post/project/profile.

## Regenerating the spec

```bash
cd backend
python -c "import json; from app.main import app; open('../docs/api/openapi.json','w').write(json.dumps(app.openapi(), indent=2))"
```
