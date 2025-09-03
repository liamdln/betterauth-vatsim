# BetterAuth VATSIM Connect SSO

This is a basic implementation of BetterAuth in Next.js 15 using VATSIM's Connect SSO.

More details about BetterAuth can be found in their [documentation](https://www.better-auth.com/docs/introduction). 

## Running

First you will need to initialise the database:

1. Setup a MySQL database server (I recommend MySQL Docker) and create a database.
2. Setup all the environment variables found in `.env.example` and place them in a file called `.env` in the same folder as `.env.example`.
3. Run `npx drizzle-kit push` to push the auth schema to the database.

Then run the following commands in the root folder of the Next.js project:

```shell
npm i
npm run dev
```

The web server will then be available at `http://localhost:3000`.

## How it Works

A custom OAuth client is setup [here](/lib/auth.ts) using the GenericOauth plugin from BetterAuth. This uses `mapProfileToUser` to fill in the session with VATSIM data as well as user data.

There is also an `additionalFields` object on the `user` object that declares additional fields for data passed by VATSIM. By default, only `name_full`, `cid`, and `email` are used.

If you don't want to include all this data, you can remove it as needed. If you change the structure, you'll need to push your changes to the database by running the following:

```shell
npx @better-auth/cli generate # generates the auth schema - you may have to overwrite the old one
npx drizzle-kit push # pushes the changes to the database - if you remove anything it will ask for additional information
```

## Authenticating and Sessions

### Server Side and Client Side Sessions

An example of accessing the session both server side and client side can be found in the following files:

- [Server Side](/app/page.tsx)
- [Client Side](/components/client-side-session.tsx)

### Login and Logout

Examples of logging in and out can be found in the [auth-buttons component](/components/auth-buttons.tsx).

## Extra Features

BetterAuth offer a multitude of different features, including [integration guides with other frameworks](https://www.better-auth.com/docs/integrations/next) and using different [databases](https://www.better-auth.com/docs/adapters/mysql) and [adapters](https://www.better-auth.com/docs/adapters/drizzle).
