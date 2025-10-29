# Stage 1: Install dependencies and build
FROM node:lts-alpine3.21 AS builder

# Install OpenSSL and other dependencies for Prisma
RUN apk add --no-cache openssl openssl-dev libc6-compat

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
# Set work directory
WORKDIR /usr/src/app

# Copy only necessary files for dependency installation
COPY ./pnpm-workspace.yaml ./pnpm-lock.yaml ./package.json ./turbo.json ./.npmrc ./

# Copy package configurations for relevant apps and libraries
COPY ./packages/common/package.json ./packages/common/
COPY ./packages/prisma/package.json ./packages/prisma/
COPY ./apps/server/package.json ./apps/server/

RUN pnpm store prune
# Install dependencies for the workspace (only fetching, no actual builds yet)
RUN pnpm install  --frozen-lockfile

# Copy remaining source code (this minimizes the build context size)
COPY ./packages/common ./packages/common
COPY ./packages/prisma ./packages/prisma
COPY ./apps/server ./apps/server

# Generate Prisma client with proper OpenSSL environment
ENV PRISMA_OPENSSL_VERSION=openssl-3.0.x

# Build the server application
RUN pnpm turbo run build --filter=@repo/prisma --cache=local:,remote:
RUN pnpm turbo run build --filter=@repo/server --cache=local:,remote:

# Stage 2: Production image
FROM node:lts-alpine3.21 AS production

# Install OpenSSL for Prisma in production
RUN apk add --no-cache openssl libc6-compat

# Set Prisma OpenSSL version for runtime
ENV PRISMA_OPENSSL_VERSION=openssl-3.0.x

# Set non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Set working directory
WORKDIR /usr/src/app

# Copy built server app and runtime dependencies
COPY --from=builder /usr/src/app/apps/server ./apps/server
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/packages ./packages
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./


# Expose backend service port
EXPOSE 8010