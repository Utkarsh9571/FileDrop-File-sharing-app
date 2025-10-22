provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_container_cluster" "filedrop" {
  name     = "filedrop-cluster"
  location = var.region
  initial_node_count = 1

  deletion_protection = false

  node_config {
    machine_type = "e2-medium"
    disk_size_gb = 20
    disk_type    = "pd-standard"
  }
}

