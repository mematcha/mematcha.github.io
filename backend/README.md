# Portfolio Backend (FastAPI)

Serves the public read API and the private CMS admin API. Runs against
in-memory mock connectors locally and Firestore + Cloud Storage in production.

## Run locally

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Defaults (see `.env.example`) use the mock connector and mock auth, and the
mock store is seeded on startup, so `GET /api/projects` returns data
immediately. Interactive docs at `http://localhost:8000/docs`.

## Test

```bash
pytest -q
```

## Layout

```
app/
  main.py            FastAPI app + lifespan seed
  config.py          Settings (env vars)
  models/content.py  Pydantic models
  connectors/        base, mock, firestore, gcs, factory
  auth/firebase.py   Bearer token verify + email allowlist
  services/content.py Publish logic + published-only filtering
  routes/            public.py, admin.py
  seed.py, seed_data.py
scripts/seed_firestore.py
```

## Configuration

| Env var | Default | Purpose |
|---------|---------|---------|
| `CONNECTOR` | `mock` | `mock` or `gcp` |
| `AUTH_MODE` | `mock` | `mock` or `firebase` |
| `ADMIN_ALLOWED_EMAILS` | `matcha.s@northeastern.edu` | CMS allowlist |
| `GCP_PROJECT_ID` | | required when `CONNECTOR=gcp` |
| `GCS_BUCKET` | | media bucket when `CONNECTOR=gcp` |
| `CORS_ORIGINS` | localhost + pages | allowed browser origins |

See [../docs](../docs/README.md) for full documentation.
