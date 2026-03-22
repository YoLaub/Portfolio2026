import { describe, it, expect } from "vitest"
import { GET } from "./route"
import { projects } from "@/data/projects"
import { services } from "@/data/services"
import { skills } from "@/data/skills"

describe("GET /api/mcp", () => {
  it("retourne 200 avec JSON structuré", async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty("name")
    expect(data).toHaveProperty("title")
    expect(data).toHaveProperty("location")
    expect(data).toHaveProperty("contact")
    expect(data).toHaveProperty("projects")
    expect(data).toHaveProperty("services")
    expect(data).toHaveProperty("skills")
  })

  it("contient les headers Cache-Control corrects", async () => {
    const response = await GET()

    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate=86400"
    )
  })

  it("retourne les projets depuis data/projects.ts", async () => {
    const response = await GET()
    const data = await response.json()

    expect(data.projects).toEqual(projects)
  })

  it("retourne les services depuis data/services.ts", async () => {
    const response = await GET()
    const data = await response.json()

    expect(data.services).toEqual(services)
  })

  it("retourne les skills depuis data/skills.ts", async () => {
    const response = await GET()
    const data = await response.json()

    expect(data.skills).toEqual(skills)
  })

  it("contient le profil avec les champs attendus", async () => {
    const response = await GET()
    const data = await response.json()

    expect(data.name).toBe("Yoann Laubert")
    expect(data.title).toBe("Développeur Full-Stack React & Java")
    expect(data.location).toBe("Vannes, Bretagne")
    expect(data.contact).toEqual({
      email: "contact@yoannlaubert.dev",
      github: "https://github.com/yoannlaubert",
      linkedin: "https://linkedin.com/in/yoannlaubert",
    })
  })
})
