# CMS Admin Guide

A practical guide for you, the site owner, to run the CMS.

## Running everything locally

Open two terminals.

**Terminal 1 — backend:**

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — front end:**

```bash
cp .env.example .env   # defaults target the local mock backend
npm install
npm run dev
```

Then open `http://localhost:5173/admin`.

## Signing in

- Local (mock): enter your email (the allowlisted one) and click Sign in.
- Production (Firebase): click Continue with Google or GitHub and use the
  account whose email is on the allowlist.

If you see "Access denied", your email is not in the allowlist. Update
`ADMIN_ALLOWED_EMAILS` (backend) and `VITE_ADMIN_EMAILS` (front end).

## Publishing a blog post

1. Go to Blog Posts, click New post.
2. Fill in Title and Slug (the slug is the URL: `/blog/<slug>`).
3. Optionally add an excerpt, tags, and a cover image (Upload image).
4. Write the body in Markdown; use the Preview tab to check rendering.
5. Click Save draft. The post is not yet public.
6. When ready, click Publish. It now appears at `/blog` and `/blog/<slug>`.

To unpublish, open the post and click Unpublish.

## Editing a project

1. Go to Projects and open a project (or create a new one).
2. Fill in Title, Slug, Summary, Tags, and toggle Featured to show it on the
   home page.
3. Use the ML / SWE / Research tabs to add per-perspective content. For each
   perspective set a date, tags, and one or more sections (heading + body).
4. Save draft, then Publish.

The section pages (`/ml`, `/swe`, `/research`) show projects that have content
for that perspective.

## Managing a demo

1. Go to Demos, create or edit a demo.
2. Choose a type:
   - External link: visitors get a "Launch demo" button to `demo_url`.
   - Embedded iframe: the demo is embedded on the page.
3. Optionally set a repository URL.
4. Save and Publish.

## Editing profile, education, experience, skills

These are simple forms. Edit fields and click Save. Use Sort order to control
display order. Changes are reflected on the public API immediately (subject to
any front-end caching).

## Uploading images

Use the Media page, or the Upload image button in the post/profile editors. In
production, files go to the Cloud Storage bucket and are served from a public
URL. Locally (mock), a placeholder URL is returned so the flow can be tested.

## Troubleshooting

| Symptom | Likely cause |
|---------|--------------|
| "Access denied" after login | Email not in allowlist |
| Admin calls return 401 | Not signed in / token expired |
| Admin calls return 403 | Signed in with non-allowlisted email |
| Public page can't load content | Backend not running or `VITE_API_URL` wrong |
| Uploaded image not visible | Bucket not public / CORS not configured (prod) |
