import { describe, it, expect } from "vitest"
import { z } from "zod"
import { skills } from "@/data/skills"
import { services } from "@/data/services"
import { projects } from "@/data/projects"

describe("Smoke tests", () => {
  it("skills data is non-empty and grouped by category", () => {
    expect(skills.length).toBeGreaterThan(0)
    const categories = [...new Set(skills.map((s) => s.category))]
    expect(categories).toContain("Frontend")
    expect(categories).toContain("Backend")
    expect(categories).toContain("Outils")
  })

  it("services data is non-empty", () => {
    expect(services.length).toBeGreaterThan(0)
    services.forEach((s) => {
      expect(s.id).toBeTruthy()
      expect(s.title).toBeTruthy()
    })
  })

  it("projects data is non-empty", () => {
    expect(projects.length).toBeGreaterThan(0)
    projects.forEach((p) => {
      expect(p.id).toBeTruthy()
      expect(p.title).toBeTruthy()
      expect(p.techStack.length).toBeGreaterThan(0)
    })
  })
})

describe("Zod v4 compatibility", () => {
  it("basic schema validation works", () => {
    const schema = z.object({
      name: z.string().min(2).max(100),
      email: z.string().email().max(255),
      message: z.string().min(10).max(2000),
    })

    const valid = schema.safeParse({
      name: "Test User",
      email: "test@example.com",
      message: "Hello, this is a test message.",
    })
    expect(valid.success).toBe(true)

    const invalid = schema.safeParse({
      name: "",
      email: "not-an-email",
      message: "short",
    })
    expect(invalid.success).toBe(false)
  })

  it("honeypot field pattern works (empty string max 0)", () => {
    const honeypot = z.string().max(0)

    expect(honeypot.safeParse("").success).toBe(true)
    expect(honeypot.safeParse("bot-filled").success).toBe(false)
  })

  it("schema type inference works", () => {
    const contactSchema = z.object({
      name: z.string().min(2).max(100),
      email: z.string().email().max(255),
      message: z.string().min(10).max(2000),
      website: z.string().max(0),
    })

    type ContactFormData = z.infer<typeof contactSchema>

    const data: ContactFormData = {
      name: "Yoann",
      email: "contact@yoann.dev",
      message: "Bonjour, je suis interesse.",
      website: "",
    }

    expect(contactSchema.parse(data)).toEqual(data)
  })
})
