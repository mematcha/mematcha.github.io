# GCP Setup

The backend runs on Google Cloud, chosen to stay within the Always Free tier for
a low-traffic personal site.

## Services used

| Service | Role | Free tier (us-central1) |
|---------|------|--------------------------|
| Cloud Run | FastAPI backend | 2M requests/mo; scales to zero |
| Firestore (Native) | Database | 1 GB storage; 50k reads/day |
| Cloud Storage | Media bucket | 5 GB storage |
| Artifact Registry | Docker images | 0.5 GB |
| Firebase Auth | Admin login | Free for this scale |
| Cloud Build | Optional image builds | 2500 build-min/mo |
| IAM + Workload Identity Federation | GitHub -> GCP auth | Free |

Not used in Phase 1: GKE/Kubernetes, Cloud SQL, external Load Balancer.

## One-time manual setup

1. Create a GCP project and note the project ID.
2. Link a billing account (required even for Always Free).
3. Create a budget alert (e.g. $5) in Billing → Budgets & alerts.
4. Enable Firebase on the project (Firebase console → add project → select the
   existing GCP project) and enable the Google and GitHub sign-in providers in
   Firebase Auth. Add authorized domains: `localhost` and
   `mematcha.github.io` (and any custom domain).
5. Install the `gcloud` CLI and Terraform locally.
6. Authenticate for Terraform:

   ```bash
   gcloud auth application-default login
   gcloud config set project YOUR_PROJECT_ID
   ```

## Region

Deploy everything in `us-central1` (an Always Free region for Cloud Run and
Cloud Storage).

## What Terraform provisions

See [terraform.md](terraform.md). Terraform enables APIs and creates Firestore,
the bucket, Artifact Registry, service accounts, the Cloud Run service, and the
Workload Identity Federation pool for GitHub Actions.

## Cost guardrails

- Cloud Run `min_instances = 0` (no idle cost; cold starts acceptable).
- Firestore and Cloud Storage stay within free quotas at portfolio traffic.
- Budget alert catches any unexpected spend.
