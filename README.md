# BetterAuth VATSIM Connect SSO

This is an implementation of BetterAuth in Next.js 15 using VATSIM's Connect SSO.

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

A custom OAuth client is setup using the GenericOauth plugin from BetterAuth. This uses `mapProfileToUser` to fill in the session with VATSIM data as well as user data.

There is also an `additionalFields` object on the `user` object that declares additional fields for data passed by VATSIM. By default, only `name_full`, `cid`, and `email` are used.

If you don't want to include all this data, you can remove it as needed.

