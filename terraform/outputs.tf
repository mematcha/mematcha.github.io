output "api_url" {
  description = "Public URL of the Cloud Run API."
  value       = google_cloud_run_v2_service.api.uri
}

output "media_bucket" {
  description = "Cloud Storage bucket for media."
  value       = google_storage_bucket.media.name
}

output "artifact_registry_repo" {
  description = "Artifact Registry Docker repo path."
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.containers.repository_id}"
}

output "deployer_service_account" {
  description = "Service account GitHub Actions impersonates to deploy."
  value       = google_service_account.deployer.email
}

output "workload_identity_provider" {
  description = "Full WIF provider resource name for the GitHub Actions auth step."
  value       = "projects/${data.google_project.this.number}/locations/global/workloadIdentityPools/${google_iam_workload_identity_pool.github.workload_identity_pool_id}/providers/${google_iam_workload_identity_pool_provider.github.workload_identity_pool_provider_id}"
}
