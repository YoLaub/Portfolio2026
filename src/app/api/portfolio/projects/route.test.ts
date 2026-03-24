import { describe, it, expect, vi } from "vitest"
import { GET } from "./route"

vi.mock("@/lib/content", () => ({
  getProjects: vi.fn(() => [
    {
      id: "proj-1",
      title: "Project One",
      techStack: ["React", "Node"],
      image: "/img/p1.png",
      liveUrl: "https://example.com",
    },
    {
      id: "proj-2",
      title: "Project Two",
      techStack: ["Vue"],
      image: "/img/p2.png",
      githubUrl: "https://github.com/test",
    },
  ]),
}))

describe("GET /api/portfolio/projects", () => {
  it("retourne status 200 avec tableau de projets", async () => {
    const response = await GET()
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveLength(2)
    expect(data[0].id).toBe("proj-1")
    expect(data[0].techStack).toEqual(["React", "Node"])
    expect(data[1].githubUrl).toBe("https://github.com/test")
  })

  it("inclut Cache-Control header", async () => {
    const response = await GET()
    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate"
    )
  })

  it("retourne 500 en cas d'erreur serveur", async () => {
    const { getProjects } = await import("@/lib/content")
    vi.mocked(getProjects).mockImplementationOnce(() => {
      throw new Error("fail")
    })
    const response = await GET()
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toEqual({ success: false, error: "Internal server error" })
  })
})
