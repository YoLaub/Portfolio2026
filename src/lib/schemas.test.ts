import { describe, it, expect } from "vitest"
import { contactSchema, type ContactFormData } from "@/lib/schemas"

describe("contactSchema", () => {
  const validData: ContactFormData = {
    name: "Jean Dupont",
    email: "jean@example.com",
    message: "Bonjour, je souhaite vous contacter pour un projet.",
    website: "",
  }

  it("accepts valid contact data", () => {
    const result = contactSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("rejects name shorter than 2 characters", () => {
    const result = contactSchema.safeParse({ ...validData, name: "A" })
    expect(result.success).toBe(false)
  })

  it("rejects name longer than 100 characters", () => {
    const result = contactSchema.safeParse({ ...validData, name: "A".repeat(101) })
    expect(result.success).toBe(false)
  })

  it("rejects invalid email", () => {
    const result = contactSchema.safeParse({ ...validData, email: "not-an-email" })
    expect(result.success).toBe(false)
  })

  it("rejects email longer than 255 characters", () => {
    const result = contactSchema.safeParse({
      ...validData,
      email: `${"a".repeat(244)}@example.com`,
    })
    expect(result.success).toBe(false)
  })

  it("rejects message shorter than 10 characters", () => {
    const result = contactSchema.safeParse({ ...validData, message: "Court" })
    expect(result.success).toBe(false)
  })

  it("rejects message longer than 2000 characters", () => {
    const result = contactSchema.safeParse({ ...validData, message: "A".repeat(2001) })
    expect(result.success).toBe(false)
  })

  it("rejects filled honeypot field", () => {
    const result = contactSchema.safeParse({ ...validData, website: "http://spam.com" })
    expect(result.success).toBe(false)
  })

  it("accepts empty honeypot field", () => {
    const result = contactSchema.safeParse({ ...validData, website: "" })
    expect(result.success).toBe(true)
  })

  it("rejects missing required fields", () => {
    const result = contactSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it("trims whitespace from name and message", () => {
    const result = contactSchema.safeParse({
      ...validData,
      name: "  Jean Dupont  ",
      message: "  Bonjour, ceci est un message.  ",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe("Jean Dupont")
      expect(result.data.message).toBe("Bonjour, ceci est un message.")
    }
  })

  it("rejects whitespace-only name after trimming", () => {
    const result = contactSchema.safeParse({ ...validData, name: "   " })
    expect(result.success).toBe(false)
  })
})
