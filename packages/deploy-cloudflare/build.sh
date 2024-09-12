#!/bin/bash

# Exit script on any error, use unset variables as error, and catch failures in pipelines
set -euo pipefail

log() {
    local TIMESTAMP
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
    echo "[$TIMESTAMP] [INFO] $1"
}

log "Building the server"
pnpm --filter @enclosed/app-server --fail-if-no-match build:cloudflare

log "Building the client"
pnpm --filter @enclosed/app-client --fail-if-no-match build

log "Resetting the dist folder"
rm -rf dist
mkdir -p dist

log "Copying the app server files to the dist folder"
cp -r ../app-server/dist-cloudflare/* dist/

log "Copying the app client files to the dist folder"
cp -r ../app-client/dist/* dist/

log "Copying routes.json to the dist folder"
cp _routes.json dist/

log "Build complete"