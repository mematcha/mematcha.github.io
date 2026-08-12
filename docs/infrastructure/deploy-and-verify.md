# Deploy and Verify (Step 7)

Manual first deployment of the backend and initial data seed. Run after
`terraform apply` succeeds.

## 1. Deploy the backend

```bash
cd backend
PROJECT_ID=your-project REGION=us-central1 ./deploy.sh
# Or from the repo root:
# PROJECT_ID=your-project REGION=us-central1 ./backend/deploy.sh
```

The script always uses `backend/` (where `Dockerfile` lives) as the Cloud Build
context, matching the CI workflow.

Capture the printed service URL; it is your `VITE_API_URL`.

## 2. Seed Firestore

```bash
cd backend
CONNECTOR=gcp GCP_PROJECT_ID=your-project python -m scripts.seed_firestore
```

Populates profile, education, experience, skills, projects, and a welcome post.
Safe to re-run (skips populated collections).

## 3. Configure Identity Platform (Google sign-in)

Do this in **Google Cloud Console** (same project), not a separate product:

1. Open **Identity Platform** → **Providers** → enable **Google**.
2. Open **Identity Platform** → **Settings** → **Authorized domains**.
3. Add (if missing):
   - `localhost`
   - `mematcha.github.io`
4. Also check **APIs & Services → Credentials → OAuth 2.0 Client (Web)**:
   - Authorized JavaScript origins: `http://localhost:5173`, `https://mematcha.github.io`
   - Authorized redirect URIs: include your auth domain callback if listed
     (often `https://mematcha-portfolio.firebaseapp.com/__/auth/handler`)

If you see `auth/unauthorized-domain` on `/admin/login`, the site origin is
missing from step 3 — the Google consent screen will not appear until that
domain is authorized.

## 4. Health and CMS verification checklist

Replace `$API` with your Cloud Run URL.

```bash
API=https://portfolio-api-xxxx-uc.a.run.app
curl -s $API/health
curl -s $API/api/projects | head
```

- [ ] `GET $API/health` returns `{"status":"ok","connector":"gcp",...}`
- [ ] `GET $API/api/profile` returns seeded profile
- [ ] `GET $API/api/projects` returns published projects
- [ ] Front end (`VITE_API_URL=$API`, `VITE_AUTH_MODE=firebase`) loads `/blog`
- [ ] Sign in at `/admin/login` with allowlisted email -> dashboard
- [ ] Sign in with non-allowlisted email -> access denied
- [ ] Create a draft post -> not visible on `/api/posts`
- [ ] Publish it -> visible at `/blog/<slug>`
- [ ] Upload a cover image -> appears on the published post
- [ ] `curl -X PUT $API/api/admin/posts/x` (no token) -> 401

Only after these pass, proceed to CI/CD (Steps 8-9).
