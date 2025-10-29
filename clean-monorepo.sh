#!/bin/bash

echo "Deleting all node_modules, .next, and .pnpm directories from the monorepo..."

pnpm turbo daemon stop || true
# Find and delete node_modules, .next, and .pnpm in all subdirectories
find . -name "node_modules" -type d -prune -exec rm -rf {} +
find . -name ".next" -type d -prune -exec rm -rf {} +
find . -name ".pnpm" -type d -prune -exec rm -rf {} +
find . -name "dist" -type d -prune -exec rm -rf {} +
find . -name "build" -type d -prune -exec rm -rf {} +
find . -name "dist" -type d -prune -exec rm -rf {} +
find . -name ".turbo" -type d -prune -exec rm -rf {} +
find . -name "package-lock.json" -type f -delete
find . -name "pnpm-lock.yaml" -type f -delete
find . -name "yarn.lock" -type f -delete

echo "Cleanup completed!"

pnpm install

echo "Installation completed!"
