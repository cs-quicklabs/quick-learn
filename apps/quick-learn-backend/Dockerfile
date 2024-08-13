FROM quick-learn:nx-base AS builder

WORKDIR /app/builder

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies, including Nx
RUN npm ci

# Copy the rest of the application code
COPY . .

# Install Nx globally
RUN npm install -g nx

# Build the application without using cache
RUN nx reset && nx build quick-learn-backend --configuration=production --skip-nx-cache

FROM quick-learn:nx-base

WORKDIR /app
COPY --from=builder /app/builder/dist/apps/quick-learn-backend ./dist
COPY --from=builder /app/builder/node_modules ./node_modules

CMD ["node", "dist/main.js"]
