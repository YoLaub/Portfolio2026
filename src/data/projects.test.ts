import { describe, it, expect } from "vitest"
import { projects } from "@/data/projects"

describe("projects data - LOAR mobile entry", () => {
  it("inclut le projet LOAR en premier", () => {
    expect(projects[0]?.id).toBe("loar")
  })

  it("LOAR est marqué featured et platform mobile", () => {
    const loar = projects.find((p) => p.id === "loar")
    expect(loar?.featured).toBe(true)
    expect(loar?.platform).toBe("mobile")
  })

  it("LOAR expose 4 screenshots .webp", () => {
    const loar = projects.find((p) => p.id === "loar")
    expect(loar?.screens).toHaveLength(4)
    for (const src of loar!.screens!) {
      expect(src).toMatch(/\/images\/projects\/loar\/screen-\d\.webp$/)
    }
  })

  it("les projets existants n'ont pas de champ screens", () => {
    const mcpAgent = projects.find((p) => p.id === "mcp-agent")
    expect(mcpAgent?.screens).toBeUndefined()
  })
})
