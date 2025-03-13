# Build stage
FROM node:22.14-alpine AS builder

WORKDIR /app

# Install dependencies first (for better layer caching)
COPY package.json package-lock.json* ./
RUN npm ci

# Reset NX cache before building
RUN npx nx reset

# Copy the rest of the codebase
COPY . .

# Build the applications
RUN npx nx reset && npx nx build quick-learn-backend --prod --skip-nx-cache
RUN npx nx reset && npx nx build quick-learn-frontend --prod --skip-nx-cache

# Production stage
FROM node:22.14-alpine

WORKDIR /app

# Copy package.json files for runtime dependencies
COPY --from=builder /app/package.json /app/package-lock.json* ./
RUN npm ci

# Copy Nest.js application from dist
COPY --from=builder /app/dist/apps/quick-learn-backend ./dist/apps/quick-learn-backend

# Copy Next.js application files
COPY --from=builder /app/apps/quick-learn-frontend/.next ./apps/quick-learn-frontend/.next
COPY --from=builder /app/apps/quick-learn-frontend/public ./apps/quick-learn-frontend/public

# Copy nx.json for potential runtime usage
COPY --from=builder /app/nx.json ./

# Expose ports for both Next.js and Nest.js applications
EXPOSE 10000 4000

# Create a startup script in the app directory
WORKDIR /app
RUN printf '#!/bin/sh\ncd /app\nnode dist/apps/quick-learn-backend/main.js & \ncd /app/apps/quick-learn-frontend && \nnode /app/node_modules/.bin/next start -p 3000\n' > start.sh && \
    chmod +x start.sh

# Start both applications
CMD ["/app/start.sh"]
