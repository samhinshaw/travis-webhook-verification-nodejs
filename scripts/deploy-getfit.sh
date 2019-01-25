#! /bin/bash

# Be very careful! The order of these arguments is vital
TAG=$1
COMPUSE_FILE_URL=$2
SERVER_DEPLOY_PATH=$3
REPO_OWNER=$4
REPO_NAME=$5

# exit if any command fails
set -e

# Make deploy dir if not already existing
mkdir -p $DIR 

# Get the correct docker compose file
wget -q $URL -O $DIR/docker-compose.yml

# Pull down the tagged image
docker pull $REPO_OWNER/$REPO_NAME:$TAG

# boot it up!
docker-compose -f $DIR/docker-compose.yml up -d