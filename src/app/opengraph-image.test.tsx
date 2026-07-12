import { describe, it, expect, vi } from "vitest"

// next/og tire des dépendances lourdes (satori/resvg) inutiles ici : on ne
// teste que le contrat statique du module, pas le rendu binaire de l'image.
vi.mock("next/og", () => ({
  ImageResponse: class {
    options: unknown
    constructor(_element: unknown, options: unknown) {
      this.options = options
    }
  },
}))

describe("opengraph-image", () => {
  it("déclare une taille 1200x630 (format Open Graph / Twitter large)", async () => {
    const og = await import("@/app/opengraph-image")
    expect(og.size).toEqual({ width: 1200, height: 630 })
  })

  it("déclare le content-type image/png", async () => {
    const og = await import("@/app/opengraph-image")
    expect(og.contentType).toBe("image/png")
  })

  it("fournit un alt descriptif (rôle + localisation)", async () => {
    const og = await import("@/app/opengraph-image")
    expect(og.alt).toMatch(/application/i)
    expect(og.alt).toMatch(/Vannes/i)
  })

  it("n'utilise aucun tiret cadratin dans l'alt", async () => {
    const og = await import("@/app/opengraph-image")
    expect(og.alt).not.toMatch(/[—–]/)
  })

  it("exporte un générateur d'image par défaut", async () => {
    const og = await import("@/app/opengraph-image")
    expect(typeof og.default).toBe("function")
    const result = og.default()
    expect(result).toBeDefined()
  })
})
