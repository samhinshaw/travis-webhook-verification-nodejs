# Start with lightweight base... but not so small
FROM node:10.15-stretch-slim

RUN apt-get update && \
  apt-get install -yq docker-ce libltdl7

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