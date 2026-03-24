import { describe, it, expect, vi } from "vitest"
import { GET } from "./route"

vi.mock("@/lib/content", () => ({
  getProfile: vi.fn(() => ({
    name: "Test",
    jobTitle: "Dev",
    location: "Test City",
    bio: "Bio test",
    email: "t@t.com",
    links: { github: "gh", linkedin: "li", website: "ws", calendly: "ca" },
  })),
}))

describe("GET /api/portfolio/profile", () => {
  it("retourne status 200 avec données profil", async () => {
    const response = await GET()
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.name).toBe("Test")
    expect(data.jobTitle).toBe("Dev")
    expect(data.email).toBe("t@t.com")
    expect(data.links.github).toBe("gh")
  })

  it("inclut Cache-Control header", async () => {
    const response = await GET()
    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate"
    )
  })

  it("retourne 500 en cas d'erreur serveur", async () => {
    const { getProfile } = await import("@/lib/content")
    vi.mocked(getProfile).mockImplementationOnce(() => {
      throw new Error("fail")
    })
    const response = await GET()
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toEqual({ success: false, error: "Internal server error" })
  })
})
