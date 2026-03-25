import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react"
import { ChatAgent } from "@/components/ChatAgent"

// Mock motion/react — on rend les éléments sans animation
vi.mock("motion/react", () => ({
  motion: {
    button: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) => {
      const { ...htmlProps } = props as Record<string, unknown>
      const filtered: Record<string, unknown> = {}
      for (const key of Object.keys(htmlProps)) {
        if (!key.startsWith("while") && key !== "initial" && key !== "animate" && key !== "exit" && key !== "transition") {
          filtered[key] = htmlProps[key]
        }
      }
      return <button {...(filtered as React.HTMLAttributes<HTMLButtonElement>)}>{children}</button>
    },
    div: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => {
      const { ...htmlProps } = props as Record<string, unknown>
      const filtered: Record<string, unknown> = {}
      for (const key of Object.keys(htmlProps)) {
        if (!key.startsWith("while") && key !== "initial" && key !== "animate" && key !== "exit" && key !== "transition") {
          filtered[key] = htmlProps[key]
        }
      }
      return <div {...(filtered as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}))

// Mock fetch global
beforeEach(() => {
  global.fetch = vi.fn()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

// ─── Helpers ─────────────────────────────────────────────────────
function openChat() {
  render(<ChatAgent />)
  fireEvent.click(screen.getByLabelText("Ouvrir le chat"))
}

function mockFetchSuccess(data: unknown) {
  ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  })
}

function mockFetchError() {
  ;(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Network error"))
}

// ─── Tests ───────────────────────────────────────────────────────
describe("ChatAgent", () => {
  // 5.1 — Bouton flottant rendu et cliquable
  it("renders floating chat button", () => {
    render(<ChatAgent />)
    const button = screen.getByLabelText("Ouvrir le chat")
    expect(button).toBeInTheDocument()
  })

  // 5.2 — Panneau s'ouvre et se ferme
  it("opens chat panel on button click and closes on X", () => {
    render(<ChatAgent />)
    fireEvent.click(screen.getByLabelText("Ouvrir le chat"))
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    // Fermer via le bouton X dans le header (2e bouton "Fermer le chat")
    const closeButtons = screen.getAllByLabelText("Fermer le chat")
    fireEvent.click(closeButtons[1]) // Le X dans le header du panneau
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  // 5.3 — Message d'accueil avec boutons de navigation
  it("shows welcome message with 5 navigation buttons", () => {
    openChat()
    expect(screen.getByText(/Comment puis-je vous aider/)).toBeInTheDocument()
    expect(screen.getByText("Mes Projets")).toBeInTheDocument()
    expect(screen.getByText("Mes Compétences")).toBeInTheDocument()
    expect(screen.getByText("Mes Services")).toBeInTheDocument()
    expect(screen.getByText("Me Contacter")).toBeInTheDocument()
    expect(screen.getByText("Télécharger CV")).toBeInTheDocument()
  })

  // 5.4 — Fetch projets et affichage liste
  it("fetches and displays projects list", async () => {
    mockFetchSuccess([
      { id: "restobook", title: "RestoBook", techStack: ["React", "Node.js"], image: "/img.png" },
      { id: "fintrack", title: "FinTrack", techStack: ["Next.js"], image: "/img2.png" },
    ])

    openChat()
    fireEvent.click(screen.getByText("Mes Projets"))

    await waitFor(() => {
      expect(screen.getByText("RestoBook")).toBeInTheDocument()
      expect(screen.getByText("FinTrack")).toBeInTheDocument()
    })

    expect(global.fetch).toHaveBeenCalledWith("/api/portfolio/projects", expect.objectContaining({ signal: expect.any(AbortSignal) }))
  })

  // 5.5 — Fetch détail projet
  it("fetches and displays project detail", async () => {
    // Premier fetch — liste projets
    mockFetchSuccess([
      { id: "restobook", title: "RestoBook", techStack: ["React"], image: "/img.png", githubUrl: "https://github.com/test" },
    ])

    openChat()
    fireEvent.click(screen.getByText("Mes Projets"))

    await waitFor(() => {
      expect(screen.getByText("RestoBook")).toBeInTheDocument()
    })

    // Deuxième fetch — détail
    mockFetchSuccess({
      id: "restobook",
      title: "RestoBook",
      techStack: ["React", "Node.js"],
      image: "/img.png",
      content: "Application de réservation de restaurants",
      githubUrl: "https://github.com/test",
      liveUrl: "https://restobook.demo",
    })

    fireEvent.click(screen.getByText("En savoir plus : RestoBook"))

    await waitFor(() => {
      expect(screen.getByText("Application de réservation de restaurants")).toBeInTheDocument()
      expect(screen.getByText("GitHub")).toBeInTheDocument()
      expect(screen.getByText("Démo")).toBeInTheDocument()
    })

    expect(global.fetch).toHaveBeenCalledWith("/api/portfolio/projects/restobook", expect.objectContaining({ signal: expect.any(AbortSignal) }))
  })

  // 5.6 — Fetch compétences groupées
  it("fetches and displays skills grouped by category", async () => {
    mockFetchSuccess([
      { id: "react", name: "React", category: "Frontend" },
      { id: "next", name: "Next.js", category: "Frontend" },
      { id: "node", name: "Node.js", category: "Backend" },
    ])

    openChat()
    fireEvent.click(screen.getByText("Mes Compétences"))

    await waitFor(() => {
      expect(screen.getByText("Frontend")).toBeInTheDocument()
      expect(screen.getByText("Backend")).toBeInTheDocument()
      expect(screen.getByText(/React, Next\.js/)).toBeInTheDocument()
    })

    expect(global.fetch).toHaveBeenCalledWith("/api/portfolio/skills", expect.objectContaining({ signal: expect.any(AbortSignal) }))
  })

  // 5.7 — Options contact affichées
  it("displays contact options", () => {
    openChat()
    fireEvent.click(screen.getByText("Me Contacter"))

    expect(screen.getByText("Prendre rendez-vous (Calendly)")).toBeInTheDocument()
    expect(screen.getByText("Formulaire de contact")).toBeInTheDocument()
    expect(screen.getByText("contact@yoann-laubert.dev")).toBeInTheDocument()
  })

  // 5.8 — État loading pendant fetch
  it("shows loading state during fetch", async () => {
    // Créer une promesse qui ne se résout pas immédiatement
    let resolvePromise: (value: unknown) => void
    ;(global.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePromise = resolve
      })
    )

    openChat()
    fireEvent.click(screen.getByText("Mes Projets"))

    await waitFor(() => {
      expect(screen.getByText("Chargement...")).toBeInTheDocument()
    })

    // Résoudre la promesse pour nettoyer
    resolvePromise!({
      ok: true,
      json: async () => [],
    })
  })

  // 5.9 — État erreur et bouton réessayer
  it("shows error message and retry button on fetch failure", async () => {
    mockFetchError()

    openChat()
    fireEvent.click(screen.getByText("Mes Projets"))

    await waitFor(() => {
      expect(screen.getByText("Oups, une erreur s'est produite")).toBeInTheDocument()
      expect(screen.getByText("Réessayer")).toBeInTheDocument()
    })

    // Test retry
    mockFetchSuccess([
      { id: "restobook", title: "RestoBook", techStack: ["React"], image: "/img.png" },
    ])

    fireEvent.click(screen.getByText("Réessayer"))

    await waitFor(() => {
      expect(screen.getByText("RestoBook")).toBeInTheDocument()
    })
  })

  // P9 — Fetch services et affichage liste
  it("fetches and displays services list", async () => {
    mockFetchSuccess([
      { id: "web", title: "Sites web", description: "Création de sites vitrines", icon: "globe" },
      { id: "api", title: "API", description: "Développement d'APIs REST", icon: "server" },
    ])

    openChat()
    fireEvent.click(screen.getByText("Mes Services"))

    await waitFor(() => {
      expect(screen.getByText("Sites web")).toBeInTheDocument()
      expect(screen.getByText("API")).toBeInTheDocument()
      expect(screen.getByText("Création de sites vitrines")).toBeInTheDocument()
    })

    expect(global.fetch).toHaveBeenCalledWith("/api/portfolio/services", expect.objectContaining({ signal: expect.any(AbortSignal) }))
  })

  // P10 — Télécharger CV affiche un lien de téléchargement
  it("displays CV download link when clicking Télécharger CV", () => {
    openChat()
    fireEvent.click(screen.getByText("Télécharger CV"))

    const link = screen.getByText("Télécharger le CV (PDF)")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/cv.pdf")
    expect(link).toHaveAttribute("download", "cv.pdf")
  })

  // P1 — Escape ferme le panneau
  it("closes chat panel on Escape key", () => {
    openChat()
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    fireEvent.keyDown(document, { key: "Escape" })
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})
