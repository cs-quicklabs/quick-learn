# Quick Learn Docker Setup

This directory contains a comprehensive Docker setup for the Quick Learn application, which includes both backend (NestJS) and frontend (Next.js) applications.

## 📁 Files Overview

- **`Dockerfile`** - Multi-stage build configuration for both applications
- **`docker-compose.yml`** - Orchestration file to run all services together
- **`environment.example`** - Template for environment variables

## 🚀 Quick Start

### 1. Environment Setup

First, create your environment configuration:

```bash
# Copy the environment template
cp environment.example .env

# Edit the .env file with your actual values
nano .env  # or use your preferred editor
```

**Important**: Update the following variables in your `.env` file:
- Database credentials
- JWT secret keys (generate secure ones for production)
- AWS credentials for S3 storage
- SMTP settings for email functionality

### 2. Run with Docker Compose (Recommended)

```bash
# Start all services (backend, frontend, database)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

This will start:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000  
- **PostgreSQL Database**: localhost:5432

### 3. Build Individual Services

You can also build and run individual services:

#### Backend Only
```bash
# Build backend image
docker build --target backend-runner -t quicklearn-backend .

# Run backend container
docker run -p 3001:3001 \
  --env-file .env \
  quicklearn-backend
```

#### Frontend Only
```bash
# Build frontend image
docker build --target frontend-runner -t quicklearn-frontend .

# Run frontend container
docker run -p 3000:3000 \
  --env-file .env \
  quicklearn-frontend
```

## 🏗 Architecture Overview

### Multi-Stage Build Process

The Dockerfile uses a multi-stage build approach:

1. **Base Stage** (`base`) - Base Node.js Alpine image
2. **Dependencies Stage** (`deps`) - Installs all dependencies
3. **Production Dependencies Stage** (`production-deps`) - Production-only dependencies
4. **Builder Stage** (`builder`) - Builds both applications
5. **Backend Runner** (`backend-runner`) - Final backend production image
6. **Frontend Runner** (`frontend-runner`) - Final frontend production image

### Key Features

- ✅ **Optimized for Production**: Minimal image sizes with multi-stage builds
- ✅ **Security**: Non-root users, proper file permissions
- ✅ **Health Checks**: Built-in health monitoring for both services
- ✅ **Environment Variables**: Comprehensive configuration management
- ✅ **NX Monorepo Support**: Properly handles NX workspace structure

## 🔧 Configuration

### Environment Variables

The setup supports comprehensive environment configuration:

#### Backend Variables
- Database configuration (PostgreSQL)
- JWT authentication settings
- AWS S3 for file storage
- SMTP for email functionality
- New Relic monitoring (optional)

#### Frontend Variables
- API endpoint configurations
- Next.js specific settings
- Bucket URLs for static assets

### Database

The docker-compose setup includes a PostgreSQL database with:
- Persistent data storage via Docker volumes
- Health checks
- Configurable credentials via environment variables

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check if ports are already in use
   lsof -i :3000  # Frontend
   lsof -i :3001  # Backend
   lsof -i :5432  # Database
   ```

2. **Environment Variables Not Loading**
   - Ensure `.env` file exists in the root directory
   - Check file permissions
   - Verify no syntax errors in the .env file

3. **Database Connection Issues**
   - Ensure PostgreSQL service is running: `docker-compose ps`
   - Check database credentials in `.env` file
   - Wait for database to be ready (health checks handle this automatically)

4. **Build Failures**
   ```bash
   # Clean Docker cache and rebuild
   docker system prune -a
   docker-compose build --no-cache
   ```

### Health Checks

Both services include health checks:
- **Backend**: `GET /api/health`
- **Frontend**: `GET /` (homepage)
- **Database**: PostgreSQL ready check

View health status:
```bash
docker-compose ps
```

### Logs

Access logs for debugging:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## 🚢 Deployment

### Production Considerations

1. **Security**
   - Change default database passwords
   - Generate secure JWT secret keys
   - Use SSL certificates
   - Enable database SSL in production

2. **Performance**
   - Configure database connection pooling
   - Set up proper caching strategies
   - Use a reverse proxy (nginx) for production

3. **Monitoring**
   - Configure New Relic for application monitoring
   - Set up log aggregation
   - Monitor health check endpoints

### Docker Compose Production Override

Create a `docker-compose.prod.yml` for production-specific configurations:

```yaml
version: '3.8'
services:
  backend:
    restart: always
    build:
      args:
        DATABASE_SSL_ENABLED: "true"
  
  frontend:
    restart: always
  
  postgres:
    restart: always
```

Run with production overrides:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📊 Monitoring

The setup includes built-in monitoring capabilities:

- **Health Checks**: Automatic service health monitoring
- **New Relic**: Application performance monitoring (when configured)
- **Database Monitoring**: PostgreSQL health checks

Access health endpoints directly:
- Backend Health: http://localhost:3001/api/health
- Frontend Health: http://localhost:3000

## 🤝 Contributing

When modifying the Docker setup:

1. Test changes locally with `docker-compose up --build`
2. Verify health checks are working
3. Update this README if adding new configuration options
4. Test with both development and production environment variables 
