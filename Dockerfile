# Stage 1: base
FROM node:22.14-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

WORKDIR /app

# Stage 2: Installing deps, building and deploying
FROM base AS builder

COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
# COPY pnpm-lock.yaml pnpm-workspace.yaml ./
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

COPY env.sh /env.sh
COPY docker.entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
RUN chmod +x /env.sh

# NGINX config for SPA
RUN echo -e "server {\n\
    listen 80;\n\
    server_name localhost;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        try_files \$uri /index.html;\n\
    }\n\
\n\
    location /api/ {\n\
        rewrite ^/api/(.*)$ /\$1 break;\n\
        proxy_pass http://localhost:3000;\n\
        proxy_http_version 1.1;\n\
        proxy_set_header Host \$host;\n\
        proxy_set_header X-Real-IP \$remote_addr;\n\
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;\n\
        proxy_set_header X-Forwarded-Proto \$scheme;\n\
    }\n\
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80 3000

CMD ["/entrypoint.sh"]