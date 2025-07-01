FROM node:22.14-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

WORKDIR /app

FROM base AS builder

# COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch

COPY . .
RUN pnpm install -r --offline --prefer-offline
#RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm --filter api prisma:generate

RUN pnpm build

# RUN pnpm deploy --filter="./apps/api" /app/api
# RUN pnpm deploy --filter="./apps/pwa" /app/pwa

FROM nginx:alpine AS final

RUN apk add --update nodejs npm

WORKDIR /app/apps/api

COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json

COPY --from=builder /app/apps/pwa/build/client /usr/share/nginx/html

COPY docker.entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# NGINX config for SPA
RUN echo -e "server {\n\
    listen 80;\n\
    server_name localhost;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        try_files \$uri /index.html;\n\
    }\n\
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80 3000

CMD ["/entrypoint.sh"]