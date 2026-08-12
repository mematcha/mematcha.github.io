resource "google_storage_bucket" "media" {
  name                        = var.bucket_name
  location                    = var.region
  uniform_bucket_level_access = true
  force_destroy               = false

  cors {
    origin          = split(",", var.cors_origins)
    method          = ["GET", "PUT", "HEAD"]
    response_header = ["Content-Type"]
    max_age_seconds = 3600
  }

  depends_on = [google_project_service.enabled]
}

# Media objects are served via public URLs, so grant public read on the bucket.
resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.media.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# The Cloud Run runtime service account may create signed upload URLs / objects.
resource "google_storage_bucket_iam_member" "runtime_admin" {
  bucket = google_storage_bucket.media.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.runtime.email}"
}
