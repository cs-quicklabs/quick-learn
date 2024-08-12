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
RUN nx build quick-learn-frontend --skip-nx-cache

CMD ["nx", "start", "quick-learn-frontend"]
