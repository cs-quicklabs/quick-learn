FROM node:lts-alpine as builder

WORKDIR /app/builder

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production
