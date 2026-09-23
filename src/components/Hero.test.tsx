import { describe, it, expect, afterEach, vi } from "vitest"
import { render, screen, cleanup, waitFor } from "@testing-library/react"
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

describe("Hero - pastille de disponibilité", () => {
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
  })

  it("n'affiche rien tant que l'agenda n'a pas répondu (ou erreur/503)", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false })
    render(<Hero />)
    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(screen.queryByText(/disponible/i)).not.toBeInTheDocument()
  })

  it('affiche "Disponible" en vert (--color-success) quand l\'agenda est vide de rendez-vous', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        slots: Array.from({ length: 100 }, () => ({ start: "2026-09-01T09:00:00Z" })),
        capacity: 100,
      }),
    })
    render(<Hero />)
    expect(await screen.findByText("Disponible")).toBeInTheDocument()
    expect(screen.getByTestId("availability-dot")).toHaveStyle({
      backgroundColor: "rgb(16, 185, 129)",
    })
  })

  it('affiche "Indisponible" en rouge (--color-error) quand l\'agenda est plein', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ slots: [], capacity: 100 }),
    })
    render(<Hero />)
    expect(await screen.findByText("Indisponible")).toBeInTheDocument()
    expect(screen.getByTestId("availability-dot")).toHaveStyle({
      backgroundColor: "rgb(239, 68, 68)",
    })
  })

  it("rougit progressivement la pastille à mesure que l'agenda se remplit, sans devenir indisponible", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ slots: [{ start: "2026-09-01T09:00:00Z" }], capacity: 100 }),
    })
    render(<Hero />)
    expect(await screen.findByText("Disponible")).toBeInTheDocument()
    const dot = screen.getByTestId("availability-dot")
    // 99% de remplissage, plafonné à 92% : ni vert pur, ni rouge pur.
    expect(dot).not.toHaveStyle({ backgroundColor: "rgb(16, 185, 129)" })
    expect(dot).not.toHaveStyle({ backgroundColor: "rgb(239, 68, 68)" })
  })
})
