import { describe, it, expect } from "vitest"
import { services, serviceSteps, serviceExtras } from "@/data/services"

describe("services data (staircase mockup)", () => {
  it("lists the 7 staircase steps in mockup order", () => {
    expect(serviceSteps.map((s) => s.id)).toEqual([
      "site-web",
      "base-de-donnees",
      "vente-en-ligne",
      "application",
      "api",
      "automatisations",
      "ia-mcp",
    ])
  })

  it("lists consulting and maintenance as extras", () => {
    expect(serviceExtras.map((s) => s.id)).toEqual(["conseil", "maintenance"])
  })

  it("keeps steps and extras as the single services source", () => {
    expect(services).toHaveLength(serviceSteps.length + serviceExtras.length)
  })

  it("flags only the Okyr-backed steps", () => {
    expect(serviceSteps.filter((s) => s.okyr).map((s) => s.id)).toEqual([
      "automatisations",
      "ia-mcp",
    ])
  })

  it("gives every step the full concept-modal content", () => {
    for (const step of serviceSteps) {
      for (const field of [
        "title",
        "description",
        "tag",
        "short",
        "priceShort",
        "image",
        "phrase",
        "story",
        "who",
        "role",
        "price",
      ] as const) {
        expect(step[field], `${step.id}.${field}`).toMatch(/\S/)
      }
      expect(step.uses.length, `${step.id}.uses`).toBeGreaterThan(0)
    }
  })

  it("gives every extra a short line and a price hint", () => {
    for (const extra of serviceExtras) {
      expect(extra.short).toMatch(/\S/)
      expect(extra.priceShort).toMatch(/\S/)
    }
  })

  it("contains no em dash in user-facing copy", () => {
    expect(JSON.stringify(services)).not.toContain("—")
  })
})
