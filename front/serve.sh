#!/bin/bash

cd `dirname $0`

FRONT_IMAGE_NAME='node:12.12.0-alpine'

function build () {
  if type "npm" > /dev/null 2>&1; then
    bash -c "npm ci && npm run dev -- --port $1 --host 0.0.0.0"
  else
    docker run \
    --rm -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$PWD:/$PWD" -w="/$PWD" \
    ${FRONT_IMAGE_NAME} \
    sh -c "npm ci && npm run dev -- --port $1 --host 0.0.0.0"
  fi
}

build $1
