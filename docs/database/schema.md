# Database Schema (Firestore)

Firestore in Native mode. One collection per content type. Document shapes match
the Pydantic models in
[`backend/app/models/content.py`](../../backend/app/models/content.py).

## Audit and status fields

Publishable collections (`projects`, `posts`, `demos`) carry:

| Field | Type | Notes |
|-------|------|-------|
| `status` | string | `draft` or `published` |
| `published_at` | timestamp | Set when first published |
| `created_at` | timestamp | Set on create |
| `updated_at` | timestamp | Set on every admin write |
| `updated_by_email` | string | Email of the admin who wrote |

The public API returns publishable documents only when `status == "published"`.

## Collections

### profile (single document, id = `profile`)

| Field | Type |
|-------|------|
| `name` | string |
| `tagline` | string |
| `bio` | string |
| `profile_image_url` | string |
| `social_links` | array of `{ label, url, icon }` |

### education / experience / skill_categories

Ordered semi-static lists sorted by `sort_order`.

- `education`: `institution`, `degree`, `location`, `date_range`, `sort_order`
- `experience`: `title`, `company`, `location`, `date_range`, `bullets[]`, `sort_order`
- `skill_categories`: `name`, `items[]`, `sort_order`

### projects

| Field | Type | Notes |
|-------|------|-------|
| `slug` | string | Unique |
| `title` | string | |
| `summary` | string | |
| `ml_content` | object or null | Perspective content |
| `swe_content` | object or null | Perspective content |
| `research_content` | object or null | Perspective content |
| `tags` | array | |
| `featured` | bool | Show on home page |
| `status` | string | draft / published |

Perspective content shape:

```json
{
  "date": "October 2025",
  "tags": ["RAG", "LLMs"],
  "headings": [{ "title": "Modeling Approach", "body": "..." }]
}
```

### posts

`slug` (unique), `title`, `excerpt`, `body_markdown`, `cover_image_url`,
`tags[]`, `status`.

### demos

`slug` (unique), `title`, `description`, `demo_type` (`iframe` | `link`),
`demo_url`, `repo_url`, `project_id` (optional), `status`.

### media

`gcs_path`, `public_url`, `content_type`, `uploaded_by_email`, `uploaded_at`.

## Required composite indexes

Firestore needs composite indexes for queries that filter and order together.

| Collection | Fields |
|------------|--------|
| `posts` | `status ==` + `published_at desc` |
| `projects` | `status ==` + `published_at desc` |
| `demos` | `status ==` + `published_at desc` |

When first run against Firestore, any missing-index error includes a console
link that creates the exact index. Define them ahead of time in
`firestore.indexes.json` (see infrastructure docs) to avoid runtime errors.

## Seeding

Initial content mirrors the original hardcoded pages and lives in
[`backend/app/seed_data.py`](../../backend/app/seed_data.py). See
[seed-plan.md](seed-plan.md) for the mapping.
