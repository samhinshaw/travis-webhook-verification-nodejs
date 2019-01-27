#! /bin/bash

# exit if any command fails
set -e

# Be very careful! The order of these arguments is vital
TAG=$1
COMPOSE_FILE_URL=$2
SERVER_DEPLOY_PATH=$3
REPO_OWNER=$4
REPO_NAME=$5
CONTAINERS_DOWNED=false

# Make deploy dir if not already existing
mkdir -p $SERVER_DEPLOY_PATH

# If a docker-compose file is already in our deploy path, down the containers with it
# Note: DOCKER_TAG does not need to be specified for the 'down' command
if [ -f $SERVER_DEPLOY_PATH/docker-compose.yml ]; then
  CONTAINERS_DOWNED=true
  docker-compose -f $SERVER_DEPLOY_PATH/docker-compose.yml down -v
fi

# Get the correct docker compose file
# wget -q $COMPOSE_FILE_URL -O $SERVER_DEPLOY_PATH/docker-compose.yml
curl -fsSL $COMPOSE_FILE_URL > $SERVER_DEPLOY_PATH/docker-compose.yml

# Pull down the tagged image
# send the stdout to /dev/null, but keep stderr going to console
docker pull $REPO_OWNER/$REPO_NAME:$TAG > /dev/null

# If we haven't already downed the currently-running containers, do so now
if [ "$CONTAINERS_DOWNED" = false ]; then
  docker-compose -f $SERVER_DEPLOY_PATH/docker-compose.yml down -v
fi

# boot it up!
DOCKER_TAG=$TAG docker-compose -f $SERVER_DEPLOY_PATH/docker-compose.yml up -d

# print status to show that UP was successful!
DOCKER_TAG=$TAG docker-compose -f $SERVER_DEPLOY_PATH/docker-compose.yml ps
