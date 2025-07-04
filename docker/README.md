# Docker

This folder contains the Dockerfile and all the files needed to build and run the Docker image.

- [Dockerfile](./Dockerfile) : Contains both NestJS backend and PWA frontend in the same image.
- [docker-entrypoint.sh](./docker-entrypoint.sh): The entrypoint script for the Docker image to run the backend with Node and the NGINX server for the frontend.
- [nginx.conf](./nginx.conf): The NGINX configuration file for the Docker image.
    - Handle SPA redirection
    - Handle API requests via reverse proxy

## Build kinL Docker image

You can build the Docker image with the following command:

```bash
pnpm docker:build
```

## Run kinL Docker image

### With Docker Compose

```yaml
services:
  kinl:
    image: kinl:latest
    ports:
      - '3002:3000' # Useful for the browser extension but not for the PWA
      - '81:80'
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - TRUSTED_ORIGINS=${TRUSTED_ORIGINS}
    depends_on:
      - db
  db:
    image: postgres:16.9-alpine
    environment:
      POSTGRES_USER: ${DATABASE_USER}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
      POSTGRES_DB: ${DATABASE_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - '${DATABASE_PORT}:5432'

volumes:
  postgres_data:
```
