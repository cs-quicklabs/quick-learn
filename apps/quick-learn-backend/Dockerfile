# syntax=docker.io/docker/dockerfile:1

FROM node:22.14-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager (adapted for NX monorepo)
COPY package.json package-lock.json* ./
COPY nx.json ./
COPY tsconfig*.json ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "package-lock.json not found." && exit 1; \
  fi

# Install production dependencies only
FROM base AS production-deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci && npm cache clean --force; \
  else echo "package-lock.json not found." && exit 1; \
  fi

# Build the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Define build arguments for environment variables
ARG ENV=prod
ARG NODE_ENV=production
ARG APP_PORT=3001
ARG FRONTEND_DOMAIN
ARG BACKEND_DOMAIN
ARG API_PREFIX=api
ARG APP_NAME="Quick Learn"
ARG DATABASE_HOST
ARG DATABASE_PORT=5432
ARG DATABASE_NAME
ARG DATABASE_USERNAME
ARG DATABASE_PASSWORD
ARG DATABASE_TYPE=postgres
ARG DATABASE_SYNCHRONIZE=false
ARG DATABASE_LOG=false
ARG DATABASE_MAX_CONNECTIONS=100
ARG DATABASE_SSL_ENABLED=true
ARG DATABASE_REJECT_UNAUTHORIZED=false
ARG JWT_SECRET_KEY
ARG JWT_REFRESH_SECRET_KEY
ARG JWT_EXPIRY_TIME=1h
ARG JWT_REFRESH_EXPIRY_TIME=1d
ARG JWT_REFRESH_REMEMBER_ME_EXPIRY_TIME=30d
ARG ACCESS_KEY_ID
ARG SECRET_ACCESS_KEY
ARG AWS_DEFAULT_S3_BUCKET
ARG AWS_S3_REGION=us-east-1
ARG AWS_Endpoint=https://s3.amazonaws.com
ARG SMTP_HOST
ARG SMTP_PORT=587
ARG SMTP_EMAIL
ARG SMTP_USER
ARG SMTP_PASS
ARG NEW_RELIC_APP_NAME="Quick Learn"
ARG NEW_RELIC_LICENSE_KEY

# Create .env file with the build arguments
RUN echo "# Auto-generated .env file for build" > .env && \
    echo "ENV=${ENV}" >> .env && \
    echo "NODE_ENV=${NODE_ENV}" >> .env && \
    echo "APP_PORT=${APP_PORT}" >> .env && \
    echo "FRONTEND_DOMAIN=${FRONTEND_DOMAIN}" >> .env && \
    echo "BACKEND_DOMAIN=${BACKEND_DOMAIN}" >> .env && \
    echo "API_PREFIX=${API_PREFIX}" >> .env && \
    echo "APP_NAME=${APP_NAME}" >> .env && \
    echo "DATABASE_HOST=${DATABASE_HOST}" >> .env && \
    echo "DATABASE_PORT=${DATABASE_PORT}" >> .env && \
    echo "DATABASE_NAME=${DATABASE_NAME}" >> .env && \
    echo "DATABASE_USERNAME=${DATABASE_USERNAME}" >> .env && \
    echo "DATABASE_PASSWORD=${DATABASE_PASSWORD}" >> .env && \
    echo "DATABASE_TYPE=${DATABASE_TYPE}" >> .env && \
    echo "DATABASE_SYNCHRONIZE=${DATABASE_SYNCHRONIZE}" >> .env && \
    echo "DATABASE_LOG=${DATABASE_LOG}" >> .env && \
    echo "DATABASE_MAX_CONNECTIONS=${DATABASE_MAX_CONNECTIONS}" >> .env && \
    echo "DATABASE_SSL_ENABLED=${DATABASE_SSL_ENABLED}" >> .env && \
    echo "DATABASE_REJECT_UNAUTHORIZED=${DATABASE_REJECT_UNAUTHORIZED}" >> .env && \
    echo "JWT_SECRET_KEY=${JWT_SECRET_KEY}" >> .env && \
    echo "JWT_REFRESH_SECRET_KEY=${JWT_REFRESH_SECRET_KEY}" >> .env && \
    echo "JWT_EXPIRY_TIME=${JWT_EXPIRY_TIME}" >> .env && \
    echo "JWT_REFRESH_EXPIRY_TIME=${JWT_REFRESH_EXPIRY_TIME}" >> .env && \
    echo "JWT_REFRESH_REMEMBER_ME_EXPIRY_TIME=${JWT_REFRESH_REMEMBER_ME_EXPIRY_TIME}" >> .env && \
    echo "ACCESS_KEY_ID=${ACCESS_KEY_ID}" >> .env && \
    echo "SECRET_ACCESS_KEY=${SECRET_ACCESS_KEY}" >> .env && \
    echo "AWS_DEFAULT_S3_BUCKET=${AWS_DEFAULT_S3_BUCKET}" >> .env && \
    echo "AWS_S3_REGION=${AWS_S3_REGION}" >> .env && \
    echo "AWS_Endpoint=${AWS_Endpoint}" >> .env && \
    echo "SMTP_HOST=${SMTP_HOST}" >> .env && \
    echo "SMTP_PORT=${SMTP_PORT}" >> .env && \
    echo "SMTP_EMAIL=${SMTP_EMAIL}" >> .env && \
    echo "SMTP_USER=${SMTP_USER}" >> .env && \
    echo "SMTP_PASS=${SMTP_PASS}" >> .env && \
    echo "NEW_RELIC_APP_NAME=${NEW_RELIC_APP_NAME}" >> .env && \
    echo "NEW_RELIC_LICENSE_KEY=${NEW_RELIC_LICENSE_KEY}" >> .env

# Build the backend using NX
RUN npx nx build quick-learn-backend --prod

# Production image, copy only necessary files and run node
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV ENV=production

# Add curl for health checks
RUN apk add --no-cache curl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist/apps/quick-learn-backend ./

# Copy production dependencies only
COPY --from=production-deps --chown=nestjs:nodejs /app/node_modules ./node_modules

# Copy email templates if they exist
# COPY --from=builder --chown=nestjs:nodejs /app/apps/quick-learn-backend/src/email-templates ./email-templates

USER nestjs

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

CMD ["node", "main.js"]
