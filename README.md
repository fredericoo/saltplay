# SaltPlay

Get your personal OKRs ready: SaltPlay (pun very intended) enables you to brag over your office games performance.
A way more interesting way to 1-on-1.

## Getting Started

After cloning the repository:

#### Setup docker container

```bash
docker compose up -d
```

This will spin up a local postgres database and required services.

#### Setup your environment

- Create a `.env.local` file in the root of the repository.
- Copy the contents of `.env.template` to `.env.local` and replace the values with your own.

#### Install packages

```bash
yarn
```

#### Run the app in development mode

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication

By default, the development app uses emails to authenticate users. You can type in any email and receive a magic link to login to it in Mailhog, also running in the docker image: [http://localhost:8025](http://localhost:8025)

It is possible to enable GitHub to test how an OAuth2 workflow would behave by creating a GitHub OAuth application and adding `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to the `.env.local` file.

## Database schema and migrations

We use [Prisma](https://www.prisma.io/) to manage our database schema and migrations.

Should you make any changes to the schema, you can run the following command to update the database tables and columns accordingly:

```bash
yarn db:migrate --name <name>
```

where `<name>` is a descriptive name of what was done in the migration in snake_case.

## Contributing

This repository follows [Feature Branching](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow). To contribute, please open a Pull Request with your proposed changes.
