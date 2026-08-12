#!/usr/bin/env bash
#
# Manual backend deploy to Cloud Run from your local machine.
#
# Prereqs: gcloud authenticated (`gcloud auth login`), project set, and the
# Terraform stack applied (Artifact Registry repo + runtime SA must exist).
#
# Usage (from repo root or from backend/):
#   PROJECT_ID=your-project REGION=us-central1 ./backend/deploy.sh
#   PROJECT_ID=your-project REGION=us-central1 ./deploy.sh
#
set -euo pipefail

# Always build from this script's directory (where Dockerfile lives), regardless
# of the caller's cwd — matches CI: `gcloud builds submit backend ...`.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

PROJECT_ID="${PROJECT_ID:?set PROJECT_ID}"
REGION="${REGION:-us-central1}"
SERVICE="${SERVICE:-portfolio-api}"
REPO="${REPO:-containers}"
RUNTIME_SA="${RUNTIME_SA:-portfolio-api-runtime@${PROJECT_ID}.iam.gserviceaccount.com}"

GIT_SHA="$(git -C "${REPO_ROOT}" rev-parse --short HEAD 2>/dev/null || date +%s)"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${SERVICE}:${GIT_SHA}"

echo "Building and pushing ${IMAGE} via Cloud Build (context: ${SCRIPT_DIR})..."
gcloud builds submit --tag "${IMAGE}" --project "${PROJECT_ID}" "${SCRIPT_DIR}"

echo "Deploying to Cloud Run service ${SERVICE}..."
gcloud run deploy "${SERVICE}" \
  --project "${PROJECT_ID}" \
  --region "${REGION}" \
  --image "${IMAGE}" \
  --service-account "${RUNTIME_SA}" \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10

echo "Done. Service URL:"
gcloud run services describe "${SERVICE}" --project "${PROJECT_ID}" --region "${REGION}" --format='value(status.url)'
