# Stage 1: Install dependencies and build
FROM node:lts-alpine3.21 AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

# Set Turborepo cache directory
ENV TURBO_TOKEN=1

# Set work directory
WORKDIR /usr/src/app

# Copy only necessary files for dependency installation
COPY ./pnpm-workspace.yaml ./pnpm-lock.yaml ./package.json ./turbo.json ./.npmrc ./
COPY ./packages/common/package.json ./packages/common/
COPY ./apps/client/package.json ./apps/client/

RUN pnpm store prune
# Install dependencies for the workspace
RUN pnpm install  --frozen-lockfile

# Copy remaining source code
COPY ./packages/common ./packages/common
COPY ./apps/client ./apps/client

# Build the client application
RUN pnpm turbo run build --filter=@repo/client --cache=local:,remote:

# Stage 2: Production image
FROM node:lts-alpine3.21 AS production

# Install shadow for user management and create non-root user
RUN apk add --no-cache shadow && addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory
WORKDIR /usr/src/app

# Copy built client app and runtime dependencies (still as root)
COPY --from=builder /usr/src/app/apps/client ./apps/client
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/packages ./packages
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./

# Adjust ownership of key directories to appuser:appgroup
RUN chown -R appuser:appgroup /usr/src/app/apps/client /usr/src/app/node_modules /usr/src/app/packages /usr/src/app/pnpm-workspace.yaml

# Set working directory to client
WORKDIR /usr/src/app/apps/client

# Install pnpm for runtime (since we need it to run start)
# RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

# Expose backend service port
EXPOSE 3010