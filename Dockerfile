# Start with lightweight base... but not so small
FROM node:10.15-stretch-slim

# Install docker!
RUN apt-get update && \
  apt install -yq apt-transport-https ca-certificates curl gnupg2 software-properties-common && \
  curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add - && \
  add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" && \
  apt update && \
  apt-get install -yq docker-ce

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