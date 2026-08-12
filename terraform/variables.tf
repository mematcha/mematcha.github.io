variable "project_id" {
  type        = string
  description = "GCP project ID."
}

variable "region" {
  type        = string
  description = "Region for Cloud Run, Firestore, and Cloud Storage (use an Always Free region)."
  default     = "us-central1"
}

variable "service_name" {
  type        = string
  description = "Cloud Run service name."
  default     = "portfolio-api"
}

variable "bucket_name" {
  type        = string
  description = "Globally-unique Cloud Storage bucket name for media."
}

variable "admin_allowed_emails" {
  type        = string
  description = "Comma-separated admin emails allowed to use the CMS."
  default     = "admin@example.com"
}

variable "cors_origins" {
  type        = string
  description = "Comma-separated allowed browser origins for the API."
  default     = "http://localhost:5173,https://mematcha.github.io"
}

variable "container_image" {
  type        = string
  description = "Container image for Cloud Run. Defaults to a placeholder; CI updates it on deploy."
  default     = "us-docker.pkg.dev/cloudrun/container/hello"
}

variable "github_repository" {
  type        = string
  description = "GitHub repo (owner/name) allowed to deploy via Workload Identity Federation."
  default     = "mematcha/mematcha.github.io"
}
