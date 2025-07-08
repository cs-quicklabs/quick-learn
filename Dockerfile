# Multi-stage build for Quick Learn application
FROM node:22.14-alpine AS base

# Install all dependencies (for building)
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Install production dependencies only
FROM base AS production-deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the applications
RUN npx nx build quick-learn-backend --prod
RUN npx nx build quick-learn-frontend --prod

# Production stage for backend
FROM base AS backend-runner
WORKDIR /app

ENV NODE_ENV=production
ENV ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy backend build and dependencies
COPY --from=builder /app/dist/apps/quick-learn-backend ./
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=production-deps /app/package*.json ./

USER nestjs

EXPOSE 3001

CMD ["node", "main.js"]

# Production stage for frontend
FROM base AS frontend-runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy frontend build and dependencies
COPY --from=builder /app/dist/apps/quick-learn-frontend/standalone ./
COPY --from=builder /app/dist/apps/quick-learn-frontend/static ./dist/apps/quick-learn-frontend/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
