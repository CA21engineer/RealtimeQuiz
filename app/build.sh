#!/bin/bash

cd `dirname $0`

SBT_IMAGE_NAME='hseeberger/scala-sbt:8u252_1.3.12_2.12.11'

function sbt_build () {
  if type "sbt" > /dev/null 2>&1; then
    sbt fullCompile
  else
    docker run \
    --rm -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$PWD:/$PWD" -w="/$PWD" \
    ${SBT_IMAGE_NAME} \
    sbt fullCompile
  fi
  chmod +x apiServer/target/docker/stage/opt/docker/bin/scala-server
}

sbt_build
echo "apiServer/target/docker/stage"
