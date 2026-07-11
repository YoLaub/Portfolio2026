import { describe, it, expect } from "vitest"
import { getProjects } from "@/lib/content"

describe("projects data - LOAR mobile entry", () => {
  it("inclut le projet LOAR", () => {
    const ids = getProjects().map((p) => p.id)
    expect(ids).toContain("loar")
  })

  it("LOAR est marqué featured et platform mobile", () => {
    const loar = getProjects().find((p) => p.id === "loar")
    expect(loar?.featured).toBe(true)
    expect(loar?.platform).toBe("mobile")
  })

  it("LOAR expose 4 screenshots .webp", () => {
    const loar = getProjects().find((p) => p.id === "loar")
    expect(loar?.screens).toHaveLength(4)
    for (const src of loar!.screens!) {
      expect(src).toMatch(/\/images\/projects\/loar\/screen-\d\.webp$/)
    }
  })

  it("les projets non-mobile n'ont pas de champ screens", () => {
    const mcpAgent = getProjects().find((p) => p.id === "mcp-agent")
    expect(mcpAgent?.screens).toBeUndefined()
  })

  it("studio-uml est marqué non listé (masqué de la grille d'accueil)", () => {
    const studioUml = getProjects().find((p) => p.id === "studio-uml")
    expect(studioUml?.listed).toBe(false)
  })
})
