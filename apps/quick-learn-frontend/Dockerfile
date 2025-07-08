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

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Define build arguments for environment variables
ARG NEXT_PUBLIC_BASE_API_URL
ARG NEXT_PUBLIC_API_VERSION=v1
ARG BACKEND_BASE_API_URL
ARG BUCKET_URL
ARG ENV=prod
ARG NODE_ENV=production

# Create .env file with the build arguments
RUN echo "# Auto-generated .env file for build" > .env && \
    echo "ENV=${ENV}" >> .env && \
    echo "NODE_ENV=${NODE_ENV}" >> .env && \
    echo "NEXT_PUBLIC_BASE_API_URL=${NEXT_PUBLIC_BASE_API_URL}" >> .env && \
    echo "NEXT_PUBLIC_API_VERSION=${NEXT_PUBLIC_API_VERSION}" >> .env && \
    echo "BACKEND_BASE_API_URL=${BACKEND_BASE_API_URL}" >> .env && \
    echo "BUCKET_URL=${BUCKET_URL}" >> .env && \
    echo "NEXT_TELEMETRY_DISABLED=1" >> .env

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# Build the frontend using NX
RUN npx nx build quick-learn-frontend

# Production image, copy all the files and run next
FROM base AS runner
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
COPY --from=builder --chown=nextjs:nodejs /app/apps/quick-learn-frontend/.next/standalone ./
# Copy static files to root level where standalone expects them
COPY --from=builder --chown=nextjs:nodejs /app/apps/quick-learn-frontend/.next/static ./.next/static

USER nextjs

# Change to the frontend directory where server.js is located (after standalone extraction)
WORKDIR /app/apps/quick-learn-frontend

# Create symlinks for static files and public directory
RUN ln -sf /app/.next/static /app/apps/quick-learn-frontend/.next/static
RUN ln -sf /app/public /app/apps/quick-learn-frontend/public

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
CMD ["node", "server.js"]
