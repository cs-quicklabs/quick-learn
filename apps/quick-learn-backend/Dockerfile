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
