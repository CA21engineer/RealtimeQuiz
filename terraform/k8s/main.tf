variable "GOOGLE_PROJECT_ID" {}
variable "GOOGLE_COMPUTE_REGION" {
  default = "asia-northeast1"
}
variable "GOOGLE_COMPUTE_ZONE" {
  default = "asia-northeast1-a"
}
variable "GOOGLE_CREDENTIALS_JSON_PATH" {
  default = "account.json"
}

provider "google" {
  credentials = file("${var.GOOGLE_CREDENTIALS_JSON_PATH}")
  region      = "${var.GOOGLE_COMPUTE_REGION}"
  project     = "${var.GOOGLE_PROJECT_ID}"
}

resource "google_compute_network" "default" {
  name                    = "${var.GOOGLE_PROJECT_ID}-network"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "default" {
  name                     = "${var.GOOGLE_PROJECT_ID}-subnetwork"
  ip_cidr_range            = "192.168.10.0/24"
  network                  = "${google_compute_network.default.self_link}"
  region                   = "${var.GOOGLE_COMPUTE_REGION}"
  private_ip_google_access = true
}

resource "google_container_cluster" "default" {
  name               = "${var.GOOGLE_PROJECT_ID}-cluster"
  location           = "${var.GOOGLE_COMPUTE_ZONE}"
  initial_node_count = 1
  network            = "${google_compute_network.default.name}"
  subnetwork         = "${google_compute_subnetwork.default.name}"

  enable_legacy_abac = true

  master_auth {
    username = ""
    password = ""
  }

  provisioner "local-exec" {
    when    = "destroy"
    command = "sleep 90"
  }

  node_config {
    oauth_scopes = [
      "https://www.googleapis.com/auth/compute",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]
    preemptible  = true
    machine_type = "n1-standard-4"
    disk_size_gb = 10
    disk_type    = "pd-standard"
  }
}
