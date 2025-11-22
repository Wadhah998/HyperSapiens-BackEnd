# Dockerfile générique pour microservices
# Usage: docker build --build-arg SERVICE_NAME=api-gateway -t image-name .

ARG SERVICE_NAME=api-gateway

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Enable corepack and use yarn 1.22.22 (same as local)
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Copy package files
COPY package.json yarn.lock* ./

# Install dependencies (using --frozen-lockfile for yarn 1.x)
# Retry up to 3 times in case of network errors
RUN for i in 1 2 3; do \
        yarn install --frozen-lockfile && break || \
        (echo "Attempt $i failed, retrying..." && sleep 5); \
    done

# Install missing peer dependencies (graphql, uuid, and passport)
# Retry up to 3 times in case of network errors
RUN for i in 1 2 3; do \
        yarn add graphql@^16.8.1 uuid@^9.0.1 passport@^0.7.0 --ignore-workspace-root-check && break || \
        (echo "Attempt $i failed, retrying..." && sleep 5); \
    done

# Copy source code
COPY . .

# Build all microservices individually (NestJS monorepo with webpack needs individual builds)
RUN yarn nest build api-gateway && \
    yarn nest build user-service && \
    yarn nest build auth-service && \
    yarn nest build project-service && \
    yarn nest build hyperdev-service

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Enable corepack and use yarn 1.22.22 (same as local)
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose all possible ports for microservices
# api-gateway: 3000, user-service: 3001, auth-service: 3002, project-service: 3003, hyperdev-service: 3004
EXPOSE 3000 3001 3002 3003 3004

# Set the service name as environment variable
ARG SERVICE_NAME=api-gateway
ENV SERVICE_NAME=${SERVICE_NAME}

# Create entrypoint script that uses the environment variable
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'exec node "dist/apps/$SERVICE_NAME/main.js"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

# Run the specific service
ENTRYPOINT ["/entrypoint.sh"]
