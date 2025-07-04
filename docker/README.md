# Docker

This folder contains the Dockerfile and all the files needed to build and run the Docker image.

- [Dockerfile](./Dockerfile) : Contains both NestJS backend and PWA frontend in the same image.
- [docker-entrypoint.sh](./docker-entrypoint.sh): The entrypoint script for the Docker image to run the backend with Node and the NGINX server for the frontend.
- [nginx.conf](./nginx.conf): The NGINX configuration file for the Docker image.
    - Handle SPA redirection
    - Handle API requests via reverse proxy

## Build kinL Docker image

You need to add a .env.production file in the apps/pwa folder following the .env.example file.

> :bulb: The important variable is VITE_API_URL which is the same domain for PWA and API to avoid overwriting the baseUrl in the API client (no need to have bash script to override env variables)

Then, you can build the Docker image with the following command:

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
