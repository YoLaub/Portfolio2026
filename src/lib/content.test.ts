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
      expect(profile.links.calendly).toBeTypeOf("string")
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
      const project: ProjectContent | null = getProjectById("restobook")

      expect(project).not.toBeNull()
      expect(project!.id).toBe("restobook")
      expect(project!.title).toBe("RestoBook")
      expect(Array.isArray(project!.techStack)).toBe(true)
      expect(project!.content).toBeTypeOf("string")
      expect(project!.content.length).toBeGreaterThan(0)
    })

    it("returns null for a non-existent project", () => {
      const project = getProjectById("inexistant")

      expect(project).toBeNull()
    })
  })
})
