#!/bin/bash

cd `dirname $0`

FRONT_IMAGE_NAME='node:12.12.0-alpine'

#function build_docker_image () {
#  if [ "$(docker image ls -q ${NAME_IMAGE})" ]; then
#    echo "Image ${NAME_IMAGE} already exist."
#  else
#    docker build tools/vuecli4 -t ${VUE_IMAGE_NAME}
#  fi
#}

function build () {
  if type "npm" > /dev/null 2>&1; then
    bash -c "npm ci && npm run build"
  else
#    build_docker_image
    docker run \
    --rm -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$PWD:/$PWD" -w="/$PWD" \
    ${FRONT_IMAGE_NAME} \
    sh -c "npm ci && npm run build"
  fi
}

build
