# Terraform Guide

Terraform provisions all GCP resources for the backend. State is local by
default; for a single-admin project that is acceptable, but you may migrate to a
GCS backend later.

## Prerequisites

- `gcloud` CLI and Terraform >= 1.5 installed.
- A GCP project with billing linked and Firebase enabled (see
  [gcp-setup.md](gcp-setup.md)).
- Application-default credentials:

  ```bash
  gcloud auth application-default login
  gcloud config set project YOUR_PROJECT_ID
  ```

## Files

| File | Provisions |
|------|------------|
| `versions.tf` | Provider + version constraints |
| `variables.tf` | Input variables |
| `main.tf` | Enables required GCP APIs |
| `firestore.tf` | Firestore database + composite indexes |
| `storage.tf` | Media bucket, public read, CORS |
| `artifact_registry.tf` | Docker repository |
| `iam.tf` | Runtime + deploy service accounts, Workload Identity Federation |
| `cloud_run.tf` | Cloud Run service + public invoker |
| `outputs.tf` | API URL, bucket, AR repo, WIF provider, deployer SA |

## Apply

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars   # then edit values

terraform init
terraform plan      # review carefully
terraform apply
```

The first apply creates the Cloud Run service using a placeholder image
(`cloudrun/hello`). The real image is pushed and deployed by CI (or the manual
deploy script). Terraform ignores later image changes via `lifecycle`.

## Outputs you will need

After apply:

```bash
terraform output api_url                     # set as VITE_API_URL for the front end
terraform output artifact_registry_repo      # image push target
terraform output deployer_service_account    # GitHub secret GCP_DEPLOY_SA
terraform output workload_identity_provider  # GitHub secret GCP_WORKLOAD_IDENTITY_PROVIDER
```

## Verification checklist (before/after apply)

- [ ] `gcloud auth application-default login` succeeded
- [ ] `terraform init` succeeded
- [ ] `terraform plan` shows only expected resources
- [ ] Billing budget alert configured in the console
- [ ] After apply, `terraform output api_url` returns a URL
- [ ] `curl $(terraform output -raw api_url)/health` returns `{"status":"ok"}`

## Destroy

```bash
terraform destroy
```

The media bucket has `force_destroy = false`; empty it first if you need to
remove it.
