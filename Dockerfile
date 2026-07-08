# Base image is node:22-slim, we cannot use node:22-alpine because of
# a known issue for arm/v7 architecture (hangs on dependency installation)
# see https://github.com/nodejs/docker-node/issues/2077
FROM node:22-slim AS builder

# Set the working directory for the app
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to install dependencies
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY packages/crypto/package.json packages/crypto/package.json
COPY packages/lib/package.json packages/lib/package.json
COPY packages/app-client/package.json packages/app-client/package.json
COPY packages/app-server/package.json packages/app-server/package.json

# Install pnpm
RUN npm install -g pnpm --ignore-scripts && pnpm install --frozen-lockfile --ignore-scripts

# Copy the entire app
COPY . .

# Build the apps
RUN pnpm --filter @enclosed/crypto run build && \
    pnpm --filter @enclosed/lib run build && \
    pnpm --filter @enclosed/app-client run build && \
    pnpm --filter @enclosed/app-server run build:node

# Production image
FROM node:22-alpine

WORKDIR /app

# Copy the built apps
COPY --from=builder /app/packages/app-client/dist ./public
COPY --from=builder /app/packages/app-server/dist-node/index.cjs ./index.cjs

# Create the .data directory and hand ownership to the built-in unprivileged
# `node` user so the container does not run as root.
RUN mkdir -p /app/.data && chown -R node:node /app

USER node

EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8787/api/ping || exit 1

CMD ["node", "index.cjs"]