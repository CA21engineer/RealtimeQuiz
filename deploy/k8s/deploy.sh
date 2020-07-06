#!/bin/bash

kubectl apply -f load-balancer-service.yaml

cat apiServer.tpl.yaml | ./extcat.sh > apiServer.yaml
kubectl apply -f apiServer.yaml


