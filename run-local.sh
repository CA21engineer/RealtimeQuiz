#!/bin/bash

cd `dirname $0`

sh ./app/build.sh
sh ./front/build.sh

if type "docker-compose" > /dev/null 2>&1; then
  docker-compose -f ./deploy/gce/docker-compose-local.yaml up --build
else
  docker run \
  --rm -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$PWD:/$PWD" -w="/$PWD" \
  docker/compose:1.22.0 \
  -f ./deploy/gce/docker-compose-local.yaml up --build -d
fi
