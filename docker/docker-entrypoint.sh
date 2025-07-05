#!/bin/sh

set -e
echo "Starting Node backend..."
# node /app/apps/api/dist/main.js &
node /app/dist/main.js & # dont forget to migrate prisma

echo "Starting NGINX..."
nginx -g 'daemon off;'
