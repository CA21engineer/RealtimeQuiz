#!/bin/bash

export MYSQL_NAMESPACE=mysql
export PROMETHEUS_NAMESPACE=prometheus
export GRAFANA_NAMESPACE=grafana

helm upgrade --install ${MYSQL_NAMESPACE} -f ./helm/mysql/values.yaml stable/mysql
helm upgrade --install ${PROMETHEUS_NAMESPACE} -f ./helm/prometheus/values.yaml stable/prometheus
helm upgrade --install ${GRAFANA_NAMESPACE} -f ./helm/grafana/values.yaml stable/grafana


