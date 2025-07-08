# Quick Learn Docker Setup

This guide explains how to run the Quick Learn application using Docker containers.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 4GB of available RAM
- Git (for cloning the repository)

## Project Structure

```
quick-learn/
├── Dockerfile                          # Main application Dockerfile
├── docker-compose.yml                  # Development compose file
├── docker-compose.prod.yml             # Production compose file
├── apps/
│   ├── quick-learn-backend/
│   │   └── Dockerfile                  # Backend-specific Dockerfile
│   └── quick-learn-frontend/
│       └── Dockerfile                  # Frontend-specific Dockerfile
├── env.example                         # Environment variables template
├── docker-scripts.sh                   # Docker management utility script
└── .dockerignore                       # Docker ignore file
```

## Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd quick-learn
```

### 2. Environment Configuration

Copy the environment template and configure it:

```bash
cp env.example .env
```

Edit `.env` and update the following critical values:

```env
# Required: Database Configuration (External Database)
DATABASE_HOST=your-database-host
DATABASE_PORT=5432
DATABASE_NAME=your-database-name
DATABASE_USERNAME=your-database-username
DATABASE_PASSWORD=your-database-password

# Required: JWT secrets (generate secure random strings)
JWT_SECRET_KEY=your-super-secret-jwt-key-here-change-this-in-production
JWT_REFRESH_SECRET_KEY=your-super-secret-jwt-refresh-key-here-change-this-in-production

# Required: AWS S3 Configuration
ACCESS_KEY_ID=your-aws-access-key-id
SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_DEFAULT_S3_BUCKET=your-s3-bucket-name
AWS_S3_REGION=us-east-1
BUCKET_URL=https://your-bucket-url.s3.amazonaws.com

# Required: SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_EMAIL=your-email@gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. Run the Application

**Development Mode:**
```bash
docker-compose up --build
```

**Production Mode:**
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### 4. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **Database:** Your external database server (configured in .env)

## Docker Images

### Backend (NestJS)
- **Port:** 3001
- **Database:** External PostgreSQL (configured via .env)
- **Features:** JWT authentication, TypeORM, AWS S3, SMTP

### Frontend (Next.js)
- **Port:** 3000
- **Features:** React, Tailwind CSS, Redux

### Database
- **External:** Uses your existing database server
- **Configuration:** Set via environment variables in .env file

## Development Workflow

### Building Individual Services

```bash
# Backend only
docker build -f apps/quick-learn-backend/Dockerfile -t quick-learn-backend .

# Frontend only
docker build -f apps/quick-learn-frontend/Dockerfile -t quick-learn-frontend .
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Database Management

```bash
# Run migrations (connects to your external database)
docker-compose exec backend npx nx run quick-learn-backend:migration:run

# Seed database (connects to your external database)
docker-compose exec backend npx nx run quick-learn-backend:seed:run

# Note: Database backup/restore should be done using your database server's tools
```

## Production Deployment

### 1. Environment Setup

```bash
# Create production environment file
cp env.example .env

# Edit .env with production values
nano .env
```

### 2. SSL Configuration (Optional)

Place SSL certificates in `./ssl/` directory:
- `./ssl/cert.pem`
- `./ssl/key.pem`

### 3. Deploy with Docker Compose

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up --build -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 4. External Services

This setup connects to your external services:
- **Database:** Configure your existing PostgreSQL server in .env
- **File Storage:** Uses AWS S3 for file uploads
- **Email:** Uses SMTP for email notifications

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check port usage
   lsof -i :3000
   lsof -i :3001
   lsof -i :5432
   
   # Modify ports in docker-compose.yml if needed
   ```

2. **Database Connection Issues**
   ```bash
   # Check backend logs for database connection errors
   docker-compose logs backend
   
   # Verify your external database is accessible
   # Test connection from host machine to your database server
   ```

3. **Build Failures**
   ```bash
   # Clean build cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **Environment Variables**
   ```bash
   # Check environment variables in containers
   docker-compose exec backend env
   docker-compose exec frontend env
   ```

### Performance Optimization

1. **Resource Limits** (add to docker-compose.yml):
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '1.0'
             memory: 1G
   ```

2. **Volume Optimization**:
   ```bash
   # Use named volumes for better performance
   docker volume ls
   docker volume inspect quick-learn_postgres_data
   ```

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files
   - Use strong, unique JWT secrets
   - Rotate secrets regularly

2. **Network Security:**
   - Use Docker networks for service isolation
   - Implement proper firewall rules
   - Use HTTPS in production

3. **Database Security:**
   - Use strong database passwords
   - Enable SSL for database connections in production
   - Regular database backups

## Backup and Recovery

### Database Backup

Since you're using an external database, use your database server's backup tools:

```bash
# Example for PostgreSQL (run on your database server)
pg_dump -h your-db-host -U your-username your-database > backup.sql

# Restore (run on your database server)
psql -h your-db-host -U your-username your-database < backup.sql
```

### Application Data

```bash
# Backup email templates and other application files
tar -czf app-backup.tar.gz apps/quick-learn-backend/src/email-templates/
```

## Health Checks

All containerized services include health checks:
- **Backend:** `curl -f http://localhost:3001/api/health`
- **Frontend:** `curl -f http://localhost:3000`
- **Database:** Monitor your external database server separately

Check health status:
```bash
docker-compose ps
```

## Support

For issues related to:
- Docker setup: Check this README
- Application bugs: Check the main project README
- Database issues: Check PostgreSQL logs
- Build failures: Check build logs and .dockerignore

## License

This Docker setup is part of the Quick Learn project and follows the same license terms. 
