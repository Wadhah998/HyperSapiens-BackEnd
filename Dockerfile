# Dockerfile générique pour microservices
# Usage: docker build --build-arg SERVICE_NAME=api-gateway -t image-name .

ARG SERVICE_NAME=api-gateway

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Install yarn
RUN npm install -g yarn

# Copy package files
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build all microservices (NestJS monorepo builds all, we'll use only the one we need)
RUN yarn build

# Stage 2: Production
FROM node:18-alpine AS production

WORKDIR /app

# Install yarn
RUN npm install -g yarn

# Copy package files
COPY package.json yarn.lock* ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose port (will be overridden by the service)
EXPOSE 3000

# Set the service name as environment variable
ARG SERVICE_NAME=api-gateway
ENV SERVICE_NAME=${SERVICE_NAME}

# Create entrypoint script that uses the environment variable
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'exec node "dist/apps/$SERVICE_NAME/main.js"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

# Run the specific service
ENTRYPOINT ["/entrypoint.sh"]
