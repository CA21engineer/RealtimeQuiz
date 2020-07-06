terraform import google_compute_network.default ${TF_VAR_GOOGLE_PROJECT_ID}-network
terraform import google_compute_subnetwork.default ${TF_VAR_GOOGLE_PROJECT_ID}-subnetwork
terraform import google_container_cluster.default ${TF_VAR_GOOGLE_PROJECT_ID}/${TF_VAR_GOOGLE_COMPUTE_ZONE}/${TF_VAR_GOOGLE_PROJECT_ID}-cluster

true
