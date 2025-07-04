# Stage 1: base
FROM node:22.14-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Use pnpm version according to our package.json, if not the pnpm store will not be in synced later on, resulting in errors
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate
WORKDIR /app

# Stage 2: Installing deps, building and deploying
FROM base AS builder

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm fetch

# Copy source after fetch
COPY . .
RUN pnpm install -r --offline --prefer-offline

RUN pnpm --filter api prisma:generate
RUN pnpm --filter api build

# Create a deploy folder with only the required deps
# This respects gitignore in /apps/api, so remember to include your dist folder in the "files" section of your package.json
RUN pnpm deploy --filter="./apps/api" --prod /app/api


# Stage 3: Production (Final image)
FROM base AS runner

WORKDIR /app

# Set environment
ENV NODE_ENV=production

COPY --from=builder /app/api/node_modules ./node_modules
COPY --from=builder /app/api/dist ./dist
COPY --from=builder /app/api/package.json ./package.json
COPY --from=builder /app/api/prisma/generated ./prisma/generated

# Expose port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "pnpm run start:prod"]