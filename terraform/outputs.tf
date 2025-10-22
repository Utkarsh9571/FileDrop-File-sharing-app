output "cluster_name" {
  value = google_container_cluster.filedrop.name
}

output "cluster_endpoint" {
  value = google_container_cluster.filedrop.endpoint
}
