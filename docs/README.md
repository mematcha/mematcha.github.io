# Documentation

Documentation for the GCP-backed portfolio + private CMS.

## Contents

- [Architecture overview](architecture/overview.md)
- API
  - [Reference](api/reference.md)
  - [OpenAPI spec](api/openapi.json)
- CMS
  - [Overview](cms/overview.md)
  - [Admin guide (how to use the CMS)](cms/admin-guide.md)
- Database
  - [Schema](database/schema.md)
  - [Seed plan](database/seed-plan.md)
- Infrastructure
  - [GCP setup](infrastructure/gcp-setup.md)
  - [Terraform guide](infrastructure/terraform.md)
  - [Deploy and verify](infrastructure/deploy-and-verify.md)
- CI/CD
  - [Requirements](cicd/requirements.md)

## Quick start (local)

```bash
# Backend (in one terminal)
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend (in another terminal)
cp .env.example .env
npm install
npm run dev
```

Then open `http://localhost:5173` (public site) and
`http://localhost:5173/admin` (CMS). In local mock mode, sign in with the
allowlisted email; no Firebase setup is required.
