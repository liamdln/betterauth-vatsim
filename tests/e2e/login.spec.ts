import { expect, test } from "@playwright/test";

const vatsimDevOrigin = "https://auth-dev.vatsim.net";
const devAccount = { username: "10000009", password: "10000009" };

test("logs in through VATSIM development SSO and logs out", async ({ page, baseURL }) => {
  const appOrigin = new URL(baseURL!).origin;
  const clientSession = page.getByText("Client Session", { exact: true }).locator("..");
  const serverSession = page.getByText("Server Session", { exact: true }).locator("..");

  await page.goto("/");
  await expect(clientSession).toContainText("null");
  await expect(serverSession).toContainText("null");
  const [providerResponse] = await Promise.all([
    page.waitForResponse((response) =>
      new URL(response.url()).origin === vatsimDevOrigin &&
      response.request().isNavigationRequest()
    ),
    page.getByRole("button", { name: "Login", exact: true }).click(),
  ]);
  expect(
    providerResponse.status(),
    "VATSIM rejected the authorization request. Check the sandbox VATSIM_CLIENT_ID, " +
      "VATSIM_CLIENT_SECRET, and registered callback URL in .env."
  ).toBeLessThan(400);

  // Check the provider origin before entering the sandbox credentials.
  await expect(page).toHaveURL((url) => url.origin === vatsimDevOrigin);
  await expect(page.getByLabel("VATSIM ID", { exact: true })).toBeVisible();
  await page.getByLabel("VATSIM ID", { exact: true }).fill(devAccount.username);
  await page.getByLabel("Password", { exact: true }).fill(devAccount.password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();

  // VATSIM can skip consent if this account already authorized the OAuth client.
  await expect(page).toHaveURL((url) =>
    url.origin === appOrigin ||
    (url.origin === vatsimDevOrigin && url.pathname === "/oauth/authorize")
  );
  if (new URL(page.url()).origin === vatsimDevOrigin) {
    await page.getByRole("button", { name: /authorize/i }).click();
  }

  await expect(page).toHaveURL(`${baseURL}/`);
  await expect(page.getByRole("button", { name: "Logout", exact: true })).toBeEnabled();
  await expect(clientSession).toContainText('"cid":10000009');
  await expect(serverSession).toContainText('"cid":10000009');

  // Use the browser's cookies to verify the actual server session, not just UI.
  const response = await page.request.get("/api/auth/get-session");
  expect(response.ok()).toBe(true);
  const session = await response.json();
  expect(session).toMatchObject({
    user: { id: expect.any(String), cid: 10000009 },
    session: { userId: expect.any(String) },
  });
  expect(session.session.userId).toBe(session.user.id);

  await page.reload();
  await expect(page.getByRole("button", { name: "Logout", exact: true })).toBeEnabled();
  await expect(clientSession).toContainText('"cid":10000009');
  await expect(serverSession).toContainText('"cid":10000009');

  await page.getByRole("button", { name: "Logout", exact: true }).click();
  await expect(page.getByRole("button", { name: "Login", exact: true })).toBeEnabled();
  await expect(clientSession).toContainText("null");
  await expect(serverSession).toContainText("null");
  const signedOutResponse = await page.request.get("/api/auth/get-session");
  expect(signedOutResponse.ok()).toBe(true);
  expect(await signedOutResponse.json()).toBeNull();
});
