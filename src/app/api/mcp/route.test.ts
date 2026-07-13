import { describe, it, expect, vi } from "vitest"

// Le module enregistre le serveur MCP au chargement ; ce mock évite toute
// dépendance à la config email au moment de l'import.
vi.mock("@/lib/brevo", () => ({
  sendContactEmail: vi.fn(),
  ConfigurationError: class extends Error {},
}))

import * as route from "./route"

// Smoke test : la logique protocolaire est couverte par src/lib/mcp/*.test.ts
// (transport in-memory du SDK). Ici on vérifie seulement le câblage de la route.
describe("route /api/mcp", () => {
  it("expose les handlers HTTP GET, POST et DELETE", () => {
    expect(typeof route.GET).toBe("function")
    expect(typeof route.POST).toBe("function")
    expect(typeof route.DELETE).toBe("function")
  })
})
