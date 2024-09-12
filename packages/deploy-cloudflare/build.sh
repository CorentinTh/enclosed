#!/bin/bash
set -e  # Exit the script if any command fails

# Build the app server and client
pnpm --filter @enclosed/app-server build:cloudflare
pnpm --filter @enclosed/app-client build

# Reset the dist folder
rm -rf dist
mkdir dist

# Copy the app server and client to the dist folder
cp -r ../app-server/dist-cloudflare/* dist/
cp -r ../app-client/dist/* dist/

# Copy routes.json to the dist folder
cp _routes.json dist/
