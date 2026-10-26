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
  it("affiche le positionnement YL Solution centré sur le métier", () => {
    render(<Hero />)
    const h1 = screen.getByRole("heading", { level: 1 })
    expect(h1).toHaveTextContent("Le numérique qui s’adapte à votre métier.")
    expect(
      screen.getByText(
        /Sites web, applications métier et intégrations techniques conçus autour de votre façon de travailler/i
      )
    ).toBeInTheDocument()
  })

  it("propose les deux CTA vers contact et projets", () => {
    render(<Hero />)
    expect(screen.getByRole("link", { name: /parler de votre besoin/i })).toHaveAttribute(
      "href",
      "#contact"
    )
    expect(screen.getByRole("link", { name: /voir mes réalisations/i })).toHaveAttribute(
      "href",
      "#projets"
    )
  })

  it("affiche les trois engagements de réassurance sans promesse chiffrée", () => {
    render(<Hero />)
    expect(screen.getByText("Comprendre votre métier")).toBeInTheDocument()
    expect(screen.getByText("Construire l’outil juste")).toBeInTheDocument()
    expect(screen.getByText("Le faire évoluer avec vous")).toBeInTheDocument()
    expect(screen.queryByText("-70%")).not.toBeInTheDocument()
    expect(screen.queryByText("Vos outils")).not.toBeInTheDocument()
    expect(screen.queryByText("1 seul flux")).not.toBeInTheDocument()
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
  it("duplique le bandeau des services YL Solution, sans automatisation ni formation IA", () => {
    render(<Hero />)
    expect(screen.getAllByText("SITES WEB")).toHaveLength(2)
    expect(screen.getAllByText("APPLICATIONS MÉTIER")).toHaveLength(2)
    expect(screen.getAllByText("INTÉGRATIONS TECHNIQUES")).toHaveLength(2)
    expect(screen.getAllByText("MAINTENANCE & ÉVOLUTION")).toHaveLength(2)
    expect(screen.queryByText("AUTOMATISATIONS")).not.toBeInTheDocument()
    expect(screen.queryByText("FORMATION IA")).not.toBeInTheDocument()
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
