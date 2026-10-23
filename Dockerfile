FROM node:22.23.4-slim AS builder

# Set the working directory for the app
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to install dependencies
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY packages/crypto/package.json packages/crypto/package.json
COPY packages/lib/package.json packages/lib/package.json
COPY packages/app-client/package.json packages/app-client/package.json
COPY packages/app-server/package.json packages/app-server/package.json

# Install the pnpm version pinned in package.json
RUN npm install -g pnpm@9.15.0 --ignore-scripts && pnpm install --frozen-lockfile --ignore-scripts

# Copy the entire app
COPY . .

# Build the apps
RUN pnpm --filter @enclosed/crypto run build && \
    pnpm --filter @enclosed/lib run build && \
    pnpm --filter @enclosed/app-client run build && \
    pnpm --filter @enclosed/app-server run build:node

# Production image 
FROM node:22.23.4-alpine

WORKDIR /app

# Copy the built apps
COPY --from=builder /app/packages/app-client/dist ./public
COPY --from=builder /app/packages/app-server/dist-node/index.cjs ./index.cjs

# Create the .data directory 
RUN mkdir -p /app/.data 

EXPOSE 8787

CMD ["node", "index.cjs"]