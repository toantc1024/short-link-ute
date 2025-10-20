# Use Node.js 22.12.0 as the base image
FROM node:22.12.0-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Development stage
FROM base AS development
# Install all dependencies (including dev dependencies)
RUN npm ci
# Copy source code
COPY . .
# Expose port
EXPOSE 5173
# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Build stage
FROM base AS build
# Install all dependencies for building
RUN npm ci
# Copy source code
COPY . .
# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production
# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html
# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
