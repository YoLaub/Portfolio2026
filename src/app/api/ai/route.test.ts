import { describe, it, expect, vi } from "vitest"

vi.mock("@/lib/content", () => ({
  getProfile: vi.fn(() => ({
    name: "Test Dev",
    jobTitle: "Full-Stack",
    location: "Test City",
    bio: "Test bio",
    email: "test@test.com",
    links: {
      github: "https://gh",
      linkedin: "https://li",
      website: "https://w",
      calendly: "https://cal",
    },
  })),
  getProjects: vi.fn(() => [
    {
      id: "proj1",
      title: "Project 1",
      techStack: ["React", "Node"],
      image: "/img.png",
    },
  ]),
  getSkills: vi.fn(() => [
    { id: "react", name: "React", category: "Frontend" },
    { id: "node", name: "Node.js", category: "Backend" },
  ]),
  getServices: vi.fn(() => [
    {
      id: "web",
      title: "Web Dev",
      description: "Web development",
      icon: "code",
    },
  ]),
}))

import { GET } from "./route"
import { getProfile } from "@/lib/content"

describe("GET /api/ai", () => {
  it("retourne status 200 avec Content-Type text/markdown", async () => {
    const response = await GET()
    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toContain("text/markdown")
  })

  it("contient les sections Markdown attendues", async () => {
    const response = await GET()
    const text = await response.text()
    expect(text).toContain("# Test Dev")
    expect(text).toContain("## Competences")
    expect(text).toContain("## Projets")
    expect(text).toContain("## Services")
    expect(text).toContain("## Contact")
  })

  it("inclut les donnees dynamiques des helpers content", async () => {
    const response = await GET()
    const text = await response.text()
    expect(text).toContain("React")
    expect(text).toContain("Project 1")
    expect(text).toContain("Web Dev")
    expect(text).toContain("Node.js")
  })

  it("inclut Cache-Control header", async () => {
    const response = await GET()
    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate"
    )
  })

  it("retourne 500 en cas d'erreur", async () => {
    vi.mocked(getProfile).mockImplementationOnce(() => {
      throw new Error("fail")
    })
    const response = await GET()
    expect(response.status).toBe(500)
    expect(response.headers.get("Content-Type")).toContain("text/markdown")
  })
})
