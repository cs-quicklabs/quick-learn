# syntax=docker.io/docker/dockerfile:1

# Multi-stage build for Quick Learn application
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
  if [ -f package-lock.json ]; then npm ci --only=production && npm cache clean --force; \
  else echo "package-lock.json not found." && exit 1; \
  fi

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Define build arguments for backend
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

# Define build arguments for frontend
ARG NEXT_PUBLIC_BASE_API_URL
ARG NEXT_PUBLIC_API_VERSION=v1
ARG BACKEND_BASE_API_URL
ARG BUCKET_URL

# Create .env file for backend with the build arguments
RUN echo "# Auto-generated .env file for backend build" > .env.backend && \
    echo "ENV=${ENV}" >> .env.backend && \
    echo "NODE_ENV=${NODE_ENV}" >> .env.backend && \
    echo "APP_PORT=${APP_PORT}" >> .env.backend && \
    echo "FRONTEND_DOMAIN=${FRONTEND_DOMAIN}" >> .env.backend && \
    echo "BACKEND_DOMAIN=${BACKEND_DOMAIN}" >> .env.backend && \
    echo "API_PREFIX=${API_PREFIX}" >> .env.backend && \
    echo "APP_NAME=${APP_NAME}" >> .env.backend && \
    echo "DATABASE_HOST=${DATABASE_HOST}" >> .env.backend && \
    echo "DATABASE_PORT=${DATABASE_PORT}" >> .env.backend && \
    echo "DATABASE_NAME=${DATABASE_NAME}" >> .env.backend && \
    echo "DATABASE_USERNAME=${DATABASE_USERNAME}" >> .env.backend && \
    echo "DATABASE_PASSWORD=${DATABASE_PASSWORD}" >> .env.backend && \
    echo "DATABASE_TYPE=${DATABASE_TYPE}" >> .env.backend && \
    echo "DATABASE_SYNCHRONIZE=${DATABASE_SYNCHRONIZE}" >> .env.backend && \
    echo "DATABASE_LOG=${DATABASE_LOG}" >> .env.backend && \
    echo "DATABASE_MAX_CONNECTIONS=${DATABASE_MAX_CONNECTIONS}" >> .env.backend && \
    echo "DATABASE_SSL_ENABLED=${DATABASE_SSL_ENABLED}" >> .env.backend && \
    echo "DATABASE_REJECT_UNAUTHORIZED=${DATABASE_REJECT_UNAUTHORIZED}" >> .env.backend && \
    echo "JWT_SECRET_KEY=${JWT_SECRET_KEY}" >> .env.backend && \
    echo "JWT_REFRESH_SECRET_KEY=${JWT_REFRESH_SECRET_KEY}" >> .env.backend && \
    echo "JWT_EXPIRY_TIME=${JWT_EXPIRY_TIME}" >> .env.backend && \
    echo "JWT_REFRESH_EXPIRY_TIME=${JWT_REFRESH_EXPIRY_TIME}" >> .env.backend && \
    echo "JWT_REFRESH_REMEMBER_ME_EXPIRY_TIME=${JWT_REFRESH_REMEMBER_ME_EXPIRY_TIME}" >> .env.backend && \
    echo "ACCESS_KEY_ID=${ACCESS_KEY_ID}" >> .env.backend && \
    echo "SECRET_ACCESS_KEY=${SECRET_ACCESS_KEY}" >> .env.backend && \
    echo "AWS_DEFAULT_S3_BUCKET=${AWS_DEFAULT_S3_BUCKET}" >> .env.backend && \
    echo "AWS_S3_REGION=${AWS_S3_REGION}" >> .env.backend && \
    echo "AWS_Endpoint=${AWS_Endpoint}" >> .env.backend && \
    echo "SMTP_HOST=${SMTP_HOST}" >> .env.backend && \
    echo "SMTP_PORT=${SMTP_PORT}" >> .env.backend && \
    echo "SMTP_EMAIL=${SMTP_EMAIL}" >> .env.backend && \
    echo "SMTP_USER=${SMTP_USER}" >> .env.backend && \
    echo "SMTP_PASS=${SMTP_PASS}" >> .env.backend && \
    echo "NEW_RELIC_APP_NAME=${NEW_RELIC_APP_NAME}" >> .env.backend && \
    echo "NEW_RELIC_LICENSE_KEY=${NEW_RELIC_LICENSE_KEY}" >> .env.backend

# Create .env file for frontend with the build arguments
RUN echo "# Auto-generated .env file for frontend build" > .env.frontend && \
    echo "ENV=${ENV}" >> .env.frontend && \
    echo "NODE_ENV=${NODE_ENV}" >> .env.frontend && \
    echo "NEXT_PUBLIC_BASE_API_URL=${NEXT_PUBLIC_BASE_API_URL}" >> .env.frontend && \
    echo "NEXT_PUBLIC_API_VERSION=${NEXT_PUBLIC_API_VERSION}" >> .env.frontend && \
    echo "BACKEND_BASE_API_URL=${BACKEND_BASE_API_URL}" >> .env.frontend && \
    echo "BUCKET_URL=${BUCKET_URL}" >> .env.frontend && \
    echo "NEXT_TELEMETRY_DISABLED=1" >> .env.frontend

# Next.js collects completely anonymous telemetry data about general usage.
# Disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# Copy appropriate .env files
RUN cp .env.backend .env

# Build the backend using NX
RUN npx nx build quick-learn-backend --prod

# Copy frontend .env and build
RUN cp .env.frontend .env
RUN npx nx build quick-learn-frontend --prod

# Production stage for backend
FROM base AS backend-runner
WORKDIR /app

ENV NODE_ENV=production
ENV ENV=production

# Add curl for health checks
RUN apk add --no-cache curl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built backend application
COPY --from=builder --chown=nestjs:nodejs /app/dist/apps/quick-learn-backend ./

# Copy production dependencies
COPY --from=production-deps --chown=nestjs:nodejs /app/node_modules ./node_modules

# Copy package.json for reference
COPY --from=production-deps --chown=nestjs:nodejs /app/package*.json ./

USER nestjs

EXPOSE 3001

# Health check for backend
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

CMD ["node", "main.js"]

# Production stage for frontend
FROM base AS frontend-runner
WORKDIR /app

ENV NODE_ENV=production
# Disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

# Add curl for health checks
RUN apk add --no-cache curl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder from frontend
COPY --from=builder /app/apps/quick-learn-frontend/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# Copy standalone build (this recreates the full monorepo structure at /app/)
COPY --from=builder --chown=nextjs:nodejs /app/dist/apps/quick-learn-frontend/standalone ./
# Copy static files where Next.js standalone expects them
COPY --from=builder --chown=nextjs:nodejs /app/dist/apps/quick-learn-frontend/static ./.next/static

USER nextjs

# Change to the frontend directory where server.js is located (after standalone extraction)
WORKDIR /app/apps/quick-learn-frontend

# Create symlinks for static files and public directory
RUN ln -sf /app/.next/static /app/apps/quick-learn-frontend/.next/static || true
RUN ln -sf /app/public /app/apps/quick-learn-frontend/public || true

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check for frontend
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
CMD ["node", "server.js"]
