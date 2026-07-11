import { describe, it, expect } from "vitest"
import {
  getProfile,
  getServices,
  getSkills,
  getProjects,
  getProjectById,
} from "@/lib/content"
import type { Profile, ProjectMeta, ProjectContent } from "@/lib/content"

describe("content helpers", () => {
  describe("getProfile", () => {
    it("returns a valid Profile object", () => {
      const profile: Profile = getProfile()

      expect(profile.name).toBe("Yoann Laubert")
      expect(profile.jobTitle).toBeTypeOf("string")
      expect(profile.location).toBeTypeOf("string")
      expect(profile.bio).toBeTypeOf("string")
      expect(profile.email).toBeTypeOf("string")
      expect(profile.links).toBeDefined()
      expect(profile.links.github).toBeTypeOf("string")
      expect(profile.links.linkedin).toBeTypeOf("string")
      expect(profile.links.website).toBeTypeOf("string")
      // La prise de RDV est intégrée au site : plus de lien Calendly
      expect("calendly" in profile.links).toBe(false)
    })
  })

  describe("getServices", () => {
    it("returns a non-empty array of ServiceData", () => {
      const services = getServices()

      expect(Array.isArray(services)).toBe(true)
      expect(services.length).toBeGreaterThan(0)

      const first = services[0]
      expect(first.id).toBeTypeOf("string")
      expect(first.title).toBeTypeOf("string")
      expect(first.description).toBeTypeOf("string")
      expect(first.icon).toBeTypeOf("string")
    })

    it("expose un tarif sur les sites, applications et prestations TJM", () => {
      const services = getServices()
      const byId = (id: string) => services.find((s) => s.id === id)

      expect(byId("site-web")?.price).toBe("À partir de 500 €")
      expect(byId("application")?.price).toBe("À partir de 1 500 €")
      expect(byId("conseil")?.price).toBe("250 € / jour")
    })
  })

  describe("getSkills", () => {
    it("returns a non-empty array of SkillData", () => {
      const skills = getSkills()

      expect(Array.isArray(skills)).toBe(true)
      expect(skills.length).toBeGreaterThan(0)

      const first = skills[0]
      expect(first.id).toBeTypeOf("string")
      expect(first.name).toBeTypeOf("string")
      expect(first.category).toBeTypeOf("string")
    })
  })

  describe("getProjects", () => {
    it("returns an array of ProjectMeta without content field", () => {
      const projects: ProjectMeta[] = getProjects()

      expect(Array.isArray(projects)).toBe(true)
      expect(projects.length).toBeGreaterThan(0)

      const first = projects[0]
      expect(first.id).toBeTypeOf("string")
      expect(first.title).toBeTypeOf("string")
      expect(Array.isArray(first.techStack)).toBe(true)
      expect(first.image).toBeTypeOf("string")

      // ProjectMeta should NOT have content
      expect((first as Record<string, unknown>).content).toBeUndefined()
    })
  })

  describe("getProjectById", () => {
    it("returns a ProjectContent for an existing project", () => {
      const project: ProjectContent | null = getProjectById("studio-uml")

      expect(project).not.toBeNull()
      expect(project!.id).toBe("studio-uml")
      expect(project!.title).toBe("Studio UML")
      expect(Array.isArray(project!.techStack)).toBe(true)
      expect(project!.content).toBeTypeOf("string")
      expect(project!.content.length).toBeGreaterThan(0)
    })

    it("returns null for a non-existent project", () => {
      const project = getProjectById("inexistant")

      expect(project).toBeNull()
    })

    it("returns null for path traversal attempts", () => {
      const project = getProjectById("../../etc/passwd")

      expect(project).toBeNull()
    })
  })
})

describe("content - projet LOAR", () => {
  it("getProjects inclut LOAR", () => {
    const ids = getProjects().map((p) => p.id)
    expect(ids).toContain("loar")
  })

  it("getProjectById('loar') renvoie le contenu avec la stack confidentialité", () => {
    const loar = getProjectById("loar")
    expect(loar).not.toBeNull()
    expect(loar?.techStack).toContain("Presidio")
    expect(loar?.content.length).toBeGreaterThan(0)
  })
})
