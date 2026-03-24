import { describe, it, expect, vi } from "vitest"
import { GET } from "./route"

vi.mock("@/lib/content", () => ({
  getSkills: vi.fn(() => [
    { id: "react", name: "React", category: "Frontend" },
    { id: "node", name: "Node.js", category: "Backend" },
  ]),
}))

describe("GET /api/portfolio/skills", () => {
  it("retourne status 200 avec tableau de compétences", async () => {
    const response = await GET()
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveLength(2)
    expect(data[0].id).toBe("react")
    expect(data[0].category).toBe("Frontend")
  })

  it("inclut Cache-Control header", async () => {
    const response = await GET()
    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate"
    )
  })

  it("retourne 500 en cas d'erreur serveur", async () => {
    const { getSkills } = await import("@/lib/content")
    vi.mocked(getSkills).mockImplementationOnce(() => {
      throw new Error("fail")
    })
    const response = await GET()
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toEqual({ success: false, error: "Internal server error" })
  })
})
