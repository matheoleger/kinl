#!/bin/sh

set -e

echo "Running Prisma migration..."
npx prisma migrate deploy

echo "Starting Node backend..."
node /app/dist/main.js &

echo "Starting NGINX..."
nginx -g 'daemon off;'
