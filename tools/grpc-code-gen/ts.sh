#!/bin/bash

IMAGE_NAME='grpc-code-gen:latest'

function build () {
  mkdir -p $2
  for file in `\find $1 -name '*.proto'`; do
      docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v "${PWD}:/${PWD}" -w="/${PWD}" ${IMAGE_NAME} \
      protoc \
      -I$1 \
      -I/usr/local/include/google \
      --js_out=import_style=commonjs:$2 \
      --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:$2 \
      $file
  done
}


if [ "$(docker image ls -q ${IMAGE_NAME})" ]; then
  echo "Image ${IMAGE_NAME} already exist."
else
  docker build `dirname $0` -t ${IMAGE_NAME}
fi

build $1 $2
