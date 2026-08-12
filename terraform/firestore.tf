resource "google_firestore_database" "default" {
  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"

  depends_on = [google_project_service.enabled]
}

# Composite indexes for published-and-ordered queries used by the public API.
locals {
  publishable_collections = ["projects", "posts", "demos"]
}

resource "google_firestore_index" "published_by_date" {
  for_each = toset(local.publishable_collections)

  database   = google_firestore_database.default.name
  collection = each.value

  fields {
    field_path = "status"
    order      = "ASCENDING"
  }
  fields {
    field_path = "published_at"
    order      = "DESCENDING"
  }
}
