resource "google_artifact_registry_repository" "containers" {
  location      = var.region
  repository_id = "containers"
  format        = "DOCKER"
  description   = "Container images for the portfolio backend."

  depends_on = [google_project_service.enabled]
}
