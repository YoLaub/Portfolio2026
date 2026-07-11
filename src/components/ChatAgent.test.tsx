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

  // 5.2b — L'événement open-chat (section contact) ouvre le panneau
  it("opens chat panel when the open-chat window event is dispatched", () => {
    render(<ChatAgent />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    fireEvent(window, new Event("open-chat"))

    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  // 5.3 — Message d'accueil avec boutons de navigation
  it("shows welcome message with 4 navigation buttons", () => {
    openChat()
    expect(screen.getByText(/Comment puis-je vous aider/)).toBeInTheDocument()
    expect(screen.getByText("Discuter de mon projet")).toBeInTheDocument()
    expect(screen.getByText("Mes Compétences")).toBeInTheDocument()
    expect(screen.getByText("Mes Services")).toBeInTheDocument()
    expect(screen.getByText("Me Contacter")).toBeInTheDocument()
  })

  // 5.4 — Parcours qualification projet : type -> stack proposée
  it("walks through project type selection and shows a suggested stack", () => {
    openChat()
    fireEvent.click(screen.getByText("Discuter de mon projet"))

    expect(screen.getByText(/Quel type de projet avez-vous en tête/)).toBeInTheDocument()
    fireEvent.click(screen.getByText("Site vitrine / landing page"))

    expect(screen.getByText("Next.js + Tailwind CSS, hébergé sur Vercel")).toBeInTheDocument()
    expect(screen.getByText("Ça me convient, on avance")).toBeInTheDocument()
  })

  // 5.5 — Validation de la stack ouvre le formulaire de contact
  it("opens the qualification form after validating the suggested stack", () => {
    openChat()
    fireEvent.click(screen.getByText("Discuter de mon projet"))
    fireEvent.click(screen.getByText("Site vitrine / landing page"))
    fireEvent.click(screen.getByText("Ça me convient, on avance"))

    expect(screen.getByPlaceholderText("Votre nom")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Votre email")).toBeInTheDocument()
    expect((screen.getByPlaceholderText("Votre message") as HTMLTextAreaElement).value).toContain(
      "Site vitrine / landing page"
    )
  })

  // 5.5b — Soumission du formulaire envoie le message via /api/contact
  it("submits the qualification form to /api/contact", async () => {
    mockFetchSuccess({ success: true })

    openChat()
    fireEvent.click(screen.getByText("Discuter de mon projet"))
    fireEvent.click(screen.getByText("Site vitrine / landing page"))
    fireEvent.click(screen.getByText("Ça me convient, on avance"))

    fireEvent.change(screen.getByPlaceholderText("Votre nom"), { target: { value: "Alice" } })
    fireEvent.change(screen.getByPlaceholderText("Votre email"), { target: { value: "alice@example.com" } })
    fireEvent.click(screen.getByText("Envoyer"))

    await waitFor(() => {
      expect(screen.getByText(/Message envoyé, merci/)).toBeInTheDocument()
    })

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({ method: "POST" })
    )
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

    expect(screen.getByText("Réserver un créneau (30 min, visio)")).toBeInTheDocument()
    expect(screen.getByText("contact@yoann-laubert.dev")).toBeInTheDocument()
    // Calendly et le formulaire classique n'existent plus
    expect(screen.queryByText(/calendly/i)).not.toBeInTheDocument()
    expect(screen.queryByText("Formulaire de contact")).not.toBeInTheDocument()
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
    fireEvent.click(screen.getByText("Mes Compétences"))

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
    fireEvent.click(screen.getByText("Mes Compétences"))

    await waitFor(() => {
      expect(screen.getByText("Oups, une erreur s'est produite")).toBeInTheDocument()
      expect(screen.getByText("Réessayer")).toBeInTheDocument()
    })

    // Test retry
    mockFetchSuccess([{ id: "react", name: "React", category: "Frontend" }])

    fireEvent.click(screen.getByText("Réessayer"))

    await waitFor(() => {
      expect(screen.getByText("Frontend")).toBeInTheDocument()
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

  // P1 — Escape ferme le panneau
  it("closes chat panel on Escape key", () => {
    openChat()
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    fireEvent.keyDown(document, { key: "Escape" })
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})
