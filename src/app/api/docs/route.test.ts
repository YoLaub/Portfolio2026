import { describe, it, expect } from "vitest"
import { GET } from "./route"

describe("GET /api/docs", () => {
  it("retourne status 200", async () => {
    const response = await GET()
    expect(response.status).toBe(200)
  })

  it("retourne une spec OpenAPI 3.0.3", async () => {
    const response = await GET()
    const data = await response.json()
    expect(data.openapi).toBe("3.0.3")
  })

  it("contient les 6 endpoints (5 portfolio + /ai.md)", async () => {
    const response = await GET()
    const data = await response.json()
    const paths = Object.keys(data.paths)
    expect(paths).toContain("/portfolio/profile")
    expect(paths).toContain("/portfolio/projects")
    expect(paths).toContain("/portfolio/projects/{id}")
    expect(paths).toContain("/portfolio/skills")
    expect(paths).toContain("/portfolio/services")
    expect(paths).toContain("/ai.md")
    expect(paths).toHaveLength(6)
  })

  it("contient les schémas requis dans components", async () => {
    const response = await GET()
    const data = await response.json()
    const schemaNames = Object.keys(data.components.schemas)
    expect(schemaNames).toContain("Profile")
    expect(schemaNames).toContain("ProjectMeta")
    expect(schemaNames).toContain("ProjectContent")
    expect(schemaNames).toContain("ServiceData")
    expect(schemaNames).toContain("SkillData")
    expect(schemaNames).toContain("ErrorResponse")
  })

  it("inclut Cache-Control header", async () => {
    const response = await GET()
    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate"
    )
  })

  it("contient info avec titre et version", async () => {
    const response = await GET()
    const data = await response.json()
    expect(data.info.title).toBe("Portfolio API — Yoann Laubert")
    expect(data.info.version).toBe("1.0.0")
  })
})
