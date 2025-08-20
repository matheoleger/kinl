# kinL

## Table of Contents

- [What is kinL?](#what-is-kinl)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Development](#development)
  - [Backend development](#backend-development)
  - [Codegen-api package](#codegen-api-package)
  - [Frontend development](#frontend-development)
- [Contributing](#contributing)

### Other documentation files

- [Deployment](./docs/deployment.md)
- [Dependencies update](./docs/dependencies_update.md)
- [Github Actions README](./.github/README.md)
- [Docker README](./docker/README.md)
- [Monitoring README](./docker/monitoring/README.md)
- [API README](./apps/api/README.md)
- [PWA README](./apps/pwa/README.md)
- [Codegen API README](./packages/codegen-api/README.md)

## What is kinL?

kinL is a web application (and mobile because it's a PWA) that allows you to store and share links (videos, blogs, websites, etc.). It's like a collaborative bookmarking tool. With this application, you can easily save your favorite content, organize your links and share them with other people (friends, family, colleagues, etc.).

The goal of kinL is to provide a simple and easy-to-use application that allows you to store and share links. It's a tool that can help you organize your content and make it easily accessible to others. It's self-hostable, so you can use it on your own server or on a cloud-based platform.

## Features

- Self-hostable: You can host kinL on your own server or on a cloud-based platform.
- PWA: kinL is a Progressive Web App (PWA) that can be installed on your device and accessed from the home screen.
- Links: You can store and share links from any website, video, blog, etc. You can also retrieve links from RSS feeds.
- Organization: You can organize your links by tags.
- Search: You can search for links by title, description, tags, etc.

In future versions, we plan to add the following features:
- Sharing: You can share your links with other users or even externally.
- Notes: You can add notes to your links. For example, you can summarize the content of your links or add additional information.

## Tech Stack

kinL is built using the following technologies:

- [TypeScript](https://www.typescriptlang.org/): A strongly typed programming language that builds on JavaScript.

- Frontend:
  - [React](https://react.dev/): Powerful JavaScript library for building user interfaces.
  - [React Router v7](https://reactrouter.com/): Routing library for React that provides a declarative way to define routes and navigate between them.
  - [TanStack Query](https://tanstack.com/query/latest): Powerful asynchronous state management, server-state utilities and data fetching library.
  - [shadcn/ui](https://ui.shadcn.com/): A set of beautifully designed components that you can customize, extend, and build on.

- Backend:
  - [NestJS](https://nestjs.com/): A powerful and flexible Node.js framework for building scalable and reliable server-side applications.
  - [Prisma](https://www.prisma.io/): A database ORM that provides a simple and intuitive API for working with databases.
  - [Nzoth](https://github.com/lonestone/nzoth): A collection of NestJS utilities for building RESTful APIs
  - [PostgreSQL](https://www.postgresql.org/): A powerful, open-source relational database management system.

- Other:
  - [HeyAPI](https://heyapi.dev/): A powerful and flexible API client generator for TypeScript.

## Installation

First, you need to clone the repository to your machine via:

```bash
git clone git@github.com:matheoleger/kinl.git
```

Once this is done, you will have access to the project's source code and can configure things accordingly.

> :bulb: Note that if you are using Visual Studio Code (or another IDE based on it), you will normally see recommendations for the recommended extensions for working on this project. Furthermore, we use ESLint as our linter and code formatter, so you don't necessarily need Prettier.

Next, you need to copy the various environment variable files and modify them accordingly if necessary:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/pwa/.env.example apps/pwa/.env
cp packages/codegen-api/.env.example packages/codegen-api/.env
```

Normally, all the example files are ready to be used for a development environment, but if you need to change some settings (such as the development server ports), you can do so in the `.env` file for each relevant part.

The project uses `pnpm workspace` to manage the monorepo. To install the dependencies for each part of the project, simply run the following command at the root level:

```bash
pnpm install
```

This will install all the dependencies for the project.

## Start the project

Now that everything is in place, you're ready to develop the project. The first step is to launch the Docker services for Docker Compose. Docker Compose contains a Postgres service to create a development database and an administrator to view the database contents (if needed during development). To do this, launch the services with the command:

```bash
pnpm compose:up
```

This will start the services in the background.

Once the database services are launched, you need to generate the prisma client and run the migrations so that the database is ISO-compliant with the database schema. To do this, run the following commands:

```bash
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate
```

The first command will generate the Prisma client and the second command will run the migrations to update the database schema.

There are other commands you may need during development, including the database reset command (useful during development and when modifying a migration):

```bash
pnpm --filter api prisma:reset
```

Then, you can launch the different parts of the project. To do this, you can launch everything with a single command at the root level:

```bash
pnpm dev
```

And that's it, the project is running!

## Development

It's time to move on to development. As you can see, the project is divided into three main parts: `apps/api`, `apps/pwa`, and the `codegen-api` package.

Each part has a README explaining how you're supposed to develop within it. Here's a quick overview of the different parts:

### Backend development

Go here for further information: [apps/api/README.md](./apps/api/README.md)

The apps/api folder contains the NestJS backend.

You need to start by creating a module, you can use the NestJS CLI to do that:

```bash
cd apps/api
pnpm nest g module <feature-name>
pnpm nest g service <feature-name>
pnpm nest g controller <feature-name>
```

Once the module is created, you can create the contract file: `modules/<features>/contracts/<module>.controller.ts`

It's important to type the routes using NZoth decorators to generate an Open API schema that will be useful for generating the API client. You can find more information about NZoth decorators [here](https://github.com/lonestone/nzoth?tab=readme-ov-file#type-safety-and-validation).

During development, you may need to modify the Prisma schema. Once the schema is modified, you need to regenerate the client and the migrations

### Codegen-api package

Go here for further information: [packages/codegen-api/README.md](./packages/codegen-api/README.md)

The codegen-api package contains the API client generated by HeyAPI.

Once your API-side functionality is ready, you can generate the API client with its types and SDK methods, and generate the Zod schemas:
To work on your front-end functionality, you need to create a folder corresponding to your functionality.

### Frontend development

Go here for further information: [apps/pwa/README.md](./apps/pwa/README.md)

The apps/pwa folder contains the React PWA frontend.

To work on your front-end functionality, you need to create a folder corresponding to your functionality. This folder can contain the components, hooks, etc. that are related to your functionality:

```bash
apps/pwa/
├── features/
│   ├── <feature-name>/
│   │   ├── components/
│   │   │   ├── <component-name>.tsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── <hook-name>.ts
│   │   │   └── ...
│   │   ├── tests/
│   │   │   ├── <component-name>.test.tsx
│   │   │   ├── <hook-name>.test.ts
│   │   │   └── ...
└── routes/
    ├── <page-name>.tsx
    └── ...
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct.
