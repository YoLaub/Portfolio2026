import { defineConfig, devices } from "@playwright/test"

// E2E : vérifie le vrai rendu dans un navigateur, en complément des tests
// vitest (unitaires/jsdom). Lance automatiquement `pnpm dev` s'il ne tourne
// pas déjà (cf webServer.reuseExistingServer).
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})
