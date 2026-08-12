resource "google_cloud_run_v2_service" "api" {
  name     = var.service_name
  location = var.region

  template {
    service_account = google_service_account.runtime.email

    scaling {
      min_instance_count = 0
      max_instance_count = 10
    }

    containers {
      image = var.container_image

      env {
        name  = "CONNECTOR"
        value = "gcp"
      }
      env {
        name  = "AUTH_MODE"
        value = "firebase"
      }
      env {
        name  = "ADMIN_ALLOWED_EMAILS"
        value = var.admin_allowed_emails
      }
      env {
        name  = "GCP_PROJECT_ID"
        value = var.project_id
      }
      env {
        name  = "GCS_BUCKET"
        value = var.bucket_name
      }
      env {
        name  = "CORS_ORIGINS"
        value = var.cors_origins
      }
    }
  }

  # CI deploys new images; let Terraform own everything except the image tag.
  lifecycle {
    ignore_changes = [template[0].containers[0].image]
  }

  depends_on = [
    google_project_service.enabled,
    google_project_iam_member.runtime_firestore,
  ]
}

# Public, unauthenticated access to the API (auth is enforced in-app).
resource "google_cloud_run_v2_service_iam_member" "public_invoke" {
  name     = google_cloud_run_v2_service.api.name
  location = google_cloud_run_v2_service.api.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
