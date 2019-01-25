# Start with lightweight base... but not so small
FROM node:10.15-stretch-slim

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