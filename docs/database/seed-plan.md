# Seed Data Plan

The initial database content is copied from the original hardcoded React pages
so the CMS opens with the existing site content already present.

## Source to collection mapping

| Original source | Collection |
|-----------------|------------|
| `src/pages/index.tsx` hero, bio, social links | `profile` |
| `src/pages/index.tsx` education section | `education` |
| `src/pages/index.tsx` experience section | `experience` |
| `src/pages/index.tsx` core skills grid | `skill_categories` |
| `src/pages/{ml,swe,research}/index.tsx` projects | `projects` (with `ml_content`, `swe_content`, `research_content`) |
| new | `posts` (one welcome post) |
| new | `demos` (empty) |

The concrete values live in
[`backend/app/seed_data.py`](../../backend/app/seed_data.py).

## Running the seed

The seed routine [`backend/app/seed.py`](../../backend/app/seed.py) is shared by:

- Local dev: the mock store is seeded automatically on app startup.
- Production: run the script explicitly.

```bash
cd backend
# Local (mock) preview of what will be written:
python -m scripts.seed_firestore

# Production (requires GCP application-default credentials):
CONNECTOR=gcp GCP_PROJECT_ID=your-project python -m scripts.seed_firestore
```

The script skips collections that already contain data. Pass `--overwrite` to
replace existing documents.

## Idempotency

Re-running without `--overwrite` is safe: populated collections are skipped, so
no duplicate documents are created.
