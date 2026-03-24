import { describe, it, expect, vi } from "vitest"
import { GET } from "./route"

vi.mock("@/lib/content", () => ({
  getProjectById: vi.fn((id: string) => {
    if (id === "proj-1") {
      return {
        id: "proj-1",
        title: "Project One",
        techStack: ["React"],
        image: "/img/p1.png",
        liveUrl: "https://example.com",
        content: "# Project One\n\nDescription du projet.",
      }
    }
    return null
  }),
}))

function makeRequest(id: string) {
  return GET(new Request("http://localhost/api/portfolio/projects/" + id), {
    params: Promise.resolve({ id }),
  })
}

describe("GET /api/portfolio/projects/[id]", () => {
  it("retourne 200 avec données projet existant", async () => {
    const response = await makeRequest("proj-1")
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.id).toBe("proj-1")
    expect(data.title).toBe("Project One")
    expect(data.content).toContain("# Project One")
  })

  it("inclut Cache-Control header", async () => {
    const response = await makeRequest("proj-1")
    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate"
    )
  })

  it("retourne 404 pour projet inexistant", async () => {
    const response = await makeRequest("nonexistent")
    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data).toEqual({ success: false, error: "Project not found" })
  })

  it("retourne 500 en cas d'erreur serveur", async () => {
    const { getProjectById } = await import("@/lib/content")
    vi.mocked(getProjectById).mockImplementationOnce(() => {
      throw new Error("fail")
    })
    const response = await makeRequest("proj-1")
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toEqual({ success: false, error: "Internal server error" })
  })
})
