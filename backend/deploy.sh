#!/usr/bin/env bash
#
# Manual backend deploy to Cloud Run from your local machine.
#
# Prereqs: gcloud authenticated (`gcloud auth login`), project set, and the
# Terraform stack applied (Artifact Registry repo + runtime SA must exist).
#
# Usage:
#   PROJECT_ID=your-project REGION=us-central1 ./deploy.sh
#
set -euo pipefail

PROJECT_ID="${PROJECT_ID:?set PROJECT_ID}"
REGION="${REGION:-us-central1}"
SERVICE="${SERVICE:-portfolio-api}"
REPO="${REPO:-containers}"
RUNTIME_SA="${RUNTIME_SA:-portfolio-api-runtime@${PROJECT_ID}.iam.gserviceaccount.com}"

IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${SERVICE}:$(git rev-parse --short HEAD 2>/dev/null || date +%s)"

echo "Building and pushing ${IMAGE} via Cloud Build..."
gcloud builds submit --tag "${IMAGE}" --project "${PROJECT_ID}" .

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
