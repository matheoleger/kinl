# Stage 1: base
FROM node:22.14-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

WORKDIR /app

# Stage 2: Installing deps, building and deploying
FROM base AS builder

ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm fetch

COPY . .
RUN pnpm install -r --offline --prefer-offline

RUN pnpm --filter api prisma:generate
RUN pnpm build

RUN pnpm deploy --filter="./apps/api" --prod /app/api
RUN pnpm deploy --filter="./apps/pwa" --prod /app/pwa

# Stage 3: Production (Final image)
FROM nginx:alpine AS final

RUN apk add --update nodejs npm

WORKDIR /app

COPY --from=builder /app/api/node_modules ./node_modules
COPY --from=builder /app/api/dist ./dist
COPY --from=builder /app/api/package.json ./package.json
COPY --from=builder /app/api/prisma/generated ./prisma/generated

COPY --from=builder /app/apps/pwa/build/client /usr/share/nginx/html

COPY docker/docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# NGINX config for SPA
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 3000

CMD ["/entrypoint.sh"]