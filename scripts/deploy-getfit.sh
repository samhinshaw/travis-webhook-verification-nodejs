#! /bin/bash

docker pull samhinshaw/get_fit:$1

docker run                 \
  -d                       \
  -p 8005:8005             \
  -e "NODE_ENV=production" \
  --env-file ./env.list    \
  --restart=always         \
  samhinshaw/get_fit:$1