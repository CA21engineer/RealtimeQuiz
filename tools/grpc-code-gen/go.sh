#!/bin/bash

IMAGE_NAME='grpc-code-gen:latest'

function build () {
  mkdir -p $2
  for file in `\find $1 -name '*.proto'`; do
      docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v "${PWD}:/${PWD}" -w="/${PWD}" protoc-gen-grpc-web \
      protoc \
      -I$1 \
      -I/usr/local/include/google \
      --go_out=plugins=grpc:$2 \
      $file
  done
}


if [ "$(docker image ls -q ${IMAGE_NAME})" ]; then
  echo "Image ${IMAGE_NAME} already exist."
else
  docker build `dirname $0` -t ${IMAGE_NAME}
fi

build $1 $2
