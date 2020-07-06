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
variable "SSH_PUB_KEY" {}
variable "SSH_PORT" {
  default = "22"
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
  ip_cidr_range            = "10.128.0.0/24"
  network                  = "${google_compute_network.default.self_link}"
  region                   = "${var.GOOGLE_COMPUTE_REGION}"
  private_ip_google_access = true
}

resource "google_compute_address" "default" {
  name   = "${var.GOOGLE_PROJECT_ID}-region-address"
  region = "${var.GOOGLE_COMPUTE_REGION}"
}

resource "google_compute_instance" "default" {
  name         = "${var.GOOGLE_PROJECT_ID}-instance"
  machine_type = "g1-small"
  zone         = "${var.GOOGLE_COMPUTE_ZONE}"
  tags         = ["allow"]

  boot_disk {
    initialize_params {
      size  = 30
      type  = "pd-standard"
      image = "projects/cos-cloud/global/images/cos-stable-81-12871-69-0"
    }
  }

  network_interface {
    network    = "${google_compute_network.default.name}"
    subnetwork = "${google_compute_subnetwork.default.name}"
    access_config {
      nat_ip = "${google_compute_address.default.address}"
    }
  }

  metadata = {
    block-project-ssh-keys = "true"
    ssh-keys               = "${var.SSH_PUB_KEY}"
    user-data              = file("cloud-config")
  }

  service_account {
    scopes = ["logging-write", "monitoring-write"]
  }
}

resource "google_compute_firewall" "default" {
  name    = "${var.GOOGLE_PROJECT_ID}-firewall"
  network = "${google_compute_network.default.name}"

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
    ports    = ["${var.SSH_PORT}", "8080", "18080"]
  }

  target_tags = ["allow"]
}

