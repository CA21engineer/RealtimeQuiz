#!/bin/bash

# 第一引数はgitリポジトリを指定(以下例)
# sh deploy.sh https://github.com/dockersamples/example-voting-app

# 初回のみClone、以降はPullする
if cd app; then
  git pull $1;
else
  git clone $1 app
  cd app
fi

# 全て削除
#docker run \
#--rm -v /var/run/docker.sock:/var/run/docker.sock \
#-v "$PWD:/$PWD" -w="/$PWD" \
#docker/compose:1.22.0 \
#down --rmi all --volumes

if type "docker-compose" > /dev/null 2>&1; then
  docker-compose -f ./deploy/gce/docker-compose.yaml up --build -d
else
  docker run \
  --rm -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$PWD:/$PWD" -w="/$PWD" \
  docker/compose:1.22.0 \
  -f ./deploy/gce/docker-compose.yaml up --build -d
fi
