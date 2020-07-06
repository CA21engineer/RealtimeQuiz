terraform import google_compute_network.default ${TF_VAR_GOOGLE_PROJECT_ID}-network
terraform import google_compute_subnetwork.default ${TF_VAR_GOOGLE_PROJECT_ID}-subnetwork

terraform import google_compute_instance.default ${TF_VAR_GOOGLE_PROJECT_ID}/${TF_VAR_GOOGLE_COMPUTE_ZONE}/${TF_VAR_GOOGLE_PROJECT_ID}-instance
terraform import google_compute_firewall.default ${TF_VAR_GOOGLE_PROJECT_ID}-firewall

terraform import google_compute_address.default ${TF_VAR_GOOGLE_PROJECT_ID}-region-address

true
