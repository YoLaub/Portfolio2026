import { describe, it, expect, afterEach, vi } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { Hero } from "@/components/Hero"

// motion/react anime côté client : on neutralise pour tester le rendu statique.
vi.mock("motion/react", () => {
  const FRAMER_ONLY_PROPS = ["initial", "animate", "transition"]
  const passthrough = (tag: string) =>
    function Mock({ children, ...props }: Record<string, unknown>) {
      const rest = Object.fromEntries(
        Object.entries(props).filter(([key]) => !FRAMER_ONLY_PROPS.includes(key))
      )
      const Tag = tag as React.ElementType
      return <Tag {...rest}>{children as React.ReactNode}</Tag>
    }
  return {
    useReducedMotion: () => false,
    motion: new Proxy({}, { get: (_t, key: string) => passthrough(key) }),
  }
})

afterEach(() => {
  cleanup()
})

describe("Hero - contenu", () => {
  it("affiche le H1 de positionnement (plus le nom propre)", () => {
    render(<Hero />)
    const h1 = screen.getByRole("heading", { level: 1 })
    expect(h1.textContent).toMatch(/programmer/i)
    expect(h1.textContent).toMatch(/gagner/i)
    expect(h1.textContent).toMatch(/temps/i)
  })

  it("propose les deux CTA vers contact et projets", () => {
    render(<Hero />)
    expect(screen.getByRole("link", { name: /prendre rdv/i })).toHaveAttribute(
      "href",
      "#contact"
    )
    expect(screen.getByRole("link", { name: /voir mes projets/i })).toHaveAttribute(
      "href",
      "#projets"
    )
  })

  it("affiche les 3 chiffres de preuve", () => {
    render(<Hero />)
    expect(screen.getByText("-70%")).toBeInTheDocument()
    expect(screen.getByText("Vos outils")).toBeInTheDocument()
    expect(screen.getByText("1 seul flux")).toBeInTheDocument()
  })
})

describe("Hero - graphique decoratif", () => {
  it("marque la colonne graphique comme decorative (aria-hidden)", () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it("n'affiche aucune image raster", () => {
    const { container } = render(<Hero />)
    expect(container.querySelector("img")).not.toBeInTheDocument()
  })
})

describe("Hero - bandeau defilant", () => {
  it("duplique le contenu du marquee pour une boucle sans couture", () => {
    render(<Hero />)
    expect(screen.getAllByText("AUTOMATISATIONS")).toHaveLength(2)
  })
})
