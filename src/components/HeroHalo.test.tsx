import { describe, it, expect, afterEach, vi } from "vitest"
import { render, cleanup } from "@testing-library/react"
import { HeroHalo } from "@/components/HeroHalo"

// motion/react anime côté client : on neutralise pour tester le rendu statique
// (structure SVG), sans dépendre des animations.
vi.mock("motion/react", () => {
  const passthrough = (tag: string) =>
    function Mock({ children, ...props }: Record<string, unknown>) {
      // On retire les props d'animation non-DOM pour éviter le bruit React.
      const {
        initial: _i,
        animate: _a,
        transition: _t,
        whileHover: _w,
        style,
        ...rest
      } = props as Record<string, unknown>
      const Tag = tag as keyof JSX.IntrinsicElements
      return (
        // @ts-expect-error style typing simplifiée pour le mock
        <Tag {...rest} style={style}>
          {children as React.ReactNode}
        </Tag>
      )
    }
  return {
    useReducedMotion: () => false,
    motion: new Proxy({}, { get: (_t, key: string) => passthrough(key) }),
  }
})

afterEach(() => {
  cleanup()
})

describe("HeroHalo - réseau d'outils interconnectés", () => {
  it("expose un SVG accessible (role img + aria-label non vide)", () => {
    const { container } = render(<HeroHalo />)
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute("role", "img")
    expect(svg!.getAttribute("aria-label")!.length).toBeGreaterThan(0)
  })

  it("n'affiche aucune image raster", () => {
    const { container } = render(<HeroHalo />)
    expect(container.querySelector("img")).not.toBeInTheDocument()
  })

  it("ne contient plus le texte 'YL'", () => {
    const { container } = render(<HeroHalo />)
    expect(container.textContent).not.toContain("YL")
  })

  it("dessine plusieurs noeuds d'outils reliés par des lignes", () => {
    const { container } = render(<HeroHalo />)
    // Réseau : au moins ~10 noeuds (cercles) et plusieurs arêtes (lignes).
    expect(container.querySelectorAll("circle").length).toBeGreaterThanOrEqual(10)
    expect(container.querySelectorAll("line").length).toBeGreaterThanOrEqual(10)
  })

  it("produit des coordonnées déterministes (pas de flottant pleine précision)", () => {
    const { container } = render(<HeroHalo />)
    const html = container.innerHTML
    // Une coordonnée non arrondie ressemblerait à cx="137.892654..." (>4 décimales).
    expect(html).not.toMatch(/\d\.\d{5,}/)
  })
})
