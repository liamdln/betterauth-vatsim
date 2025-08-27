import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  schema: "./auth-schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});