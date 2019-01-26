#! /bin/bash

# exit if any command fails
set -e

# Be very careful! The order of these arguments is vital
TAG=$1
COMPOSE_FILE_URL=$2
SERVER_DEPLOY_PATH=$3
REPO_OWNER=$4
REPO_NAME=$5

# Make deploy dir if not already existing
mkdir -p $SERVER_DEPLOY_PATH

# Get the correct docker compose file
wget -q $COMPOSE_FILE_URL -O $SERVER_DEPLOY_PATH/docker-compose.yml

# Pull down the tagged image
docker pull $REPO_OWNER/$REPO_NAME:$TAG

# boot it up!
DOCKER_TAG=$TAG docker-compose -f $SERVER_DEPLOY_PATH/docker-compose.yml up -d
