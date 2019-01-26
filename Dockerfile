# Start with lightweight base... but not so small
FROM node:10.15-stretch-slim

# Set debian to noninteractive mode
ARG DEBIAN_FRONTEND=noninteractive

# Install Docker, and remove build dependencies in one layer to keep image size small
RUN \
  # update apt
  apt-get update && \
  # install build dependencies 
  apt-get install -yqq apt-transport-https ca-certificates curl gnupg2 software-properties-common && \
  # Add docker gpg key & repo to sources
  curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
  add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" && \
  # Update apt with new sources & install docker
  apt-get update && \
  apt-get install -yqq docker-ce && \
  # uninstall build dependencies
  apt-get purge -yqq apt-transport-https ca-certificates curl gnupg2 software-properties-common && \
  apt-get autoremove -yqq

WORKDIR /app/

# Expose 8025 for our express server
EXPOSE 8025

# Copy in dependency files
COPY package.json /app/
COPY package-lock.json /app/

# Install dependencies
RUN npm ci

# Copy in app
COPY ./ /app/

# Start up 
CMD ["npm", "start"]