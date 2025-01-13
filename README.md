# Quick Learn

## Description

This project is a full-stack application built with Nx, a powerful tool for creating smart monorepos and enabling fast CI. The backend of the application is developed using Nest, a progressive Node.js framework, while the frontend is built with Next.js, a popular React framework. The database used is Postgres, and TypeORM is utilized as the ORM (Object-Relational Mapping) tool.

This project combines the power of Nx, Nest, Next.js, Postgres, and TypeORM to provide a robust and efficient full-stack development experience.

## Setup

Install all the dependencies needed for the project.

```bash
npm install
```

For the database either, you can setup everything in your system or you can use docker.

1. Sytem setup: [Install Postgresql](https://www.postgresql.org/download/)

2. Docker Setup:
   1. [Install docker](https://www.docker.com/)
   2. Create docker image of the database: (Here -d will create and start the containers in the background, allowing you to continue using your terminal for other tasks.)

```bash
docker-compose -f docker-compose.dev.yml up -d
```

After successful installation, you can seed some minimum data to the database to run your app:

```bash
npx nx seed:run quick-learn-backend
```

After successful seeding, you can set the env variable for the apps:

```bash
cp apps/quick-learn-backend/.env.example apps/quick-learn-backend/.env.dev
cp apps/quick-learn-frontend/.env.example apps/quick-learn-frontend/.env
```

update this variables to desired values.

Now, you can run the backend and frontend or you can use the nx to run multiple apps at once.

Start Backend

```bash
npx nx run quick-learn-backend:dev
```

Start Frontend

```bash
npx nx run quick-learn-frontend:dev
```

Or, run both the app at once:

```bash
npx nx run-many --target=dev
```

Or, you can use the predefined script in _package.json_. This is make the db up and at the same time it will run both the apps.

```bash
npm run dev
```

## Hosting

Note: Before going for hosting, check if the backend app has _.env.production_ and frontend app has _.env_ files.

For hosting, quick-learn is using two ways. you can use whatever that suits you:

1. Using Docker
2. Using PM2

### Using Docker

Build the base image:

```bash
docker build . -t quick-learn:nx-base
```

Building image for both the apps:

```bash
docker compose build
```

Run the apps:

```bash
docker compose up -d
```

### Using PM2

Install pm2 globally:

```bash
npm install pm2@latest
```

Create build for both the apps

```bash
npm run build:frontend:production
npm run build:backend:production
```

Now using pm2, run both the apps:

```bash
pm start ecosystem.config.js
```

You can go through this [pm2 docs](https://pm2.keymetrics.io/docs/usage/quick-start/), to monitor the pm2 running apps.

TODO: Add a well docs for using nginx for the reverse proxy.

## Testing

For running tests locally, you can use the following commands:

There are two ways to run Cypress tests:

1. Run Cypress in the CLI (Headless Mode)

   To execute the tests in headless mode, run the following command:

    ```bash
    npx nx run quick-learn-frontend-e2e:e2e
    ```

    Cypress will run all the tests and output the results in the terminal.

2. Run Cypress in the Interactive Mode

    To open Cypress's interactive test runner, use:

    ```bash
    npx nx run quick-learn-frontend-e2e:e2e:watch
    ```

    This will launch the Cypress Test Runner, where you can select and run individual test files.
