import { describe, it, expect, vi } from "vitest"
import { GET } from "./route"

vi.mock("@/lib/content", () => ({
  getFormations: vi.fn(() => [
    { id: "decouverte", title: "Découverte", description: "Panorama des outils IA.", icon: "graduation-cap" },
    { id: "usage", title: "Usage au quotidien", description: "Prompts efficaces.", icon: "lightbulb" },
  ]),
}))

describe("GET /api/portfolio/formation", () => {
  it("retourne status 200 avec tableau de modules de formation", async () => {
    const response = await GET()
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveLength(2)
    expect(data[0].id).toBe("decouverte")
    expect(data[1].icon).toBe("lightbulb")
  })

  it("inclut Cache-Control header", async () => {
    const response = await GET()
    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate"
    )
  })

  it("retourne 500 en cas d'erreur serveur", async () => {
    const { getFormations } = await import("@/lib/content")
    vi.mocked(getFormations).mockImplementationOnce(() => {
      throw new Error("fail")
    })
    const response = await GET()
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toEqual({ success: false, error: "Internal server error" })
  })
})
