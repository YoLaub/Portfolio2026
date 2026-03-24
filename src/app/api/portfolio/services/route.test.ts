import { describe, it, expect, vi } from "vitest"
import { GET } from "./route"

vi.mock("@/lib/content", () => ({
  getServices: vi.fn(() => [
    { id: "web-dev", title: "Développement Web", description: "Création de sites", icon: "code" },
    { id: "consulting", title: "Consulting", description: "Conseil technique", icon: "users" },
  ]),
}))

describe("GET /api/portfolio/services", () => {
  it("retourne status 200 avec tableau de services", async () => {
    const response = await GET()
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveLength(2)
    expect(data[0].id).toBe("web-dev")
    expect(data[0].title).toBe("Développement Web")
    expect(data[1].icon).toBe("users")
  })

  it("inclut Cache-Control header", async () => {
    const response = await GET()
    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate"
    )
  })

  it("retourne 500 en cas d'erreur serveur", async () => {
    const { getServices } = await import("@/lib/content")
    vi.mocked(getServices).mockImplementationOnce(() => {
      throw new Error("fail")
    })
    const response = await GET()
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toEqual({ success: false, error: "Internal server error" })
  })
})
