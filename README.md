# SaltPlay

Get your personal OKRs ready: SaltPlay (pun very intended) enables you to brag over your office games performance.
A way more interesting way to 1-on-1.

## Getting Started

After cloning the repository:

#### 🐳 Spin up a local database

```bash
docker compose up -d
```

This will spin up a local postgres database and required services.

#### 🖥 Setup local environment variables

```bash
yarn setup:env
```

Refer to `.env.template` for other environment variables.

#### 📦 Install packages

```bash
yarn
```

#### 🚀 Run the app in development mode

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result!

---

## Authentication

When not in production mode, you will have direct access to log in as any user via a `Dev Login` button on the front-end.

It is not possible to enable Slack to test how an OAuth2 workflow locally as slack blocks `localhost` from being one of the allowed domains. You may, though, create a new branch and push any commits, which will be automatically deployed to the preview environment via Vercel.

## Database schema and migrations

We use [Prisma](https://www.prisma.io/) to manage our database schema and migrations.

Should you make any changes to the schema, you can run the following command to update the database tables and columns accordingly:

```bash
yarn db:migrate:local --name <name>
```

where `<name>` is a descriptive name of what was done in the migration in snake_case.

## Contributing

This repository follows [Feature Branching](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow). To contribute, please open a Pull Request with your proposed changes.
