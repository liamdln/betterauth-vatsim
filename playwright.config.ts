import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  workers: 1,
  retries: 0,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: "list",
  use: {
    baseURL,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm dev --hostname localhost --port 3000",
    url: baseURL,
    // Always start our own server so a running app cannot use production OAuth.
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      BETTER_AUTH_URL: baseURL,
      VATSIM_AUTH_URL: "https://auth-dev.vatsim.net",
    },
  },
});
