# Docker Scripts for Short Link Frontend

This directory contains Docker configuration for the Short Link frontend application.

## Quick Start

### Development Mode

```bash
# Start development server with hot reload
npm run docker:dev

# Or use docker-compose directly
docker-compose --profile dev up --build
```

### Production Mode

```bash
# Build and start production server
npm run docker:prod

# Or use docker-compose directly
docker-compose --profile prod up --build
```

### Build Only

```bash
# Build the application (useful for CI/CD)
docker-compose --profile build up --build
```

### Stop Services

```bash
# Stop all running services
npm run docker:down

# Or use docker-compose directly
docker-compose down
```

## Available Services

### Development (`frontend-dev`)

- **Port**: 5173
- **Features**: Hot reload, source maps, development optimizations
- **Target audience**: Local development

### Production (`frontend-prod`)

- **Port**: 80
- **Features**: Optimized build, nginx serving, production optimizations
- **Target audience**: Production deployment

### Build (`frontend-build`)

- **Purpose**: Build artifacts only
- **Output**: `./dist` directory
- **Target audience**: CI/CD pipelines

## Environment Variables

The application uses the following environment variables:

- `VITE_SUPABASE_HOST`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

These are loaded from the `.env` file in development mode.

## Nginx Configuration

The production build uses nginx with the following optimizations:

- **SPA Routing**: Proper handling of client-side routes
- **Caching**: Aggressive caching for static assets, shorter cache for HTML
- **Compression**: Gzip compression for text-based files
- **Security Headers**: Basic security headers including CSP
- **CORS**: Preflight request handling for API calls

## Docker Commands

### Build specific stage

```bash
# Build development image
docker build --target development -t short-link-frontend:dev .

# Build production image
docker build --target production -t short-link-frontend:prod .
```

### Run individual containers

```bash
# Development
docker run -p 5173:5173 -v ${PWD}:/app -v /app/node_modules short-link-frontend:dev

# Production
docker run -p 80:80 short-link-frontend:prod
```

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port mapping in `docker-compose.yml`
2. **Hot reload not working**: Ensure `CHOKIDAR_USEPOLLING=true` is set
3. **Build fails**: Check that all dependencies are properly installed
4. **Environment variables not loaded**: Ensure the `.env` file exists and is properly formatted

### Logs

```bash
# View logs for development service
docker-compose logs frontend-dev

# Follow logs in real-time
docker-compose logs -f frontend-dev
```

### Cleanup

```bash
# Remove all containers and images
docker-compose down --rmi all --volumes --remove-orphans

# Remove unused images and containers
docker system prune -a
```
