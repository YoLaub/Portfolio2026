import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from "vitest"
import { render, screen, cleanup, fireEvent, waitFor, act } from "@testing-library/react"
import { ContactSection } from "@/components/ContactSection"

vi.mock("@/components/AnimatedSection", () => ({
  AnimatedSection: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => (
    <div data-testid="animated-section" className={className}>
      {children}
    </div>
  ),
}))

vi.mock("next/dynamic", () => ({
  default: (_importFn: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>) => {
    const Component = (props: Record<string, unknown>) => (
      <div data-testid="calendly-widget" data-url={props.url as string}>
        Calendly Widget
      </div>
    )
    return Component
  },
}))

vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>) => {
      const htmlProps: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(props)) {
        if (!["initial", "animate", "exit", "transition"].includes(key)) {
          htmlProps[key] = value
        }
      }
      return <div {...(htmlProps as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
    },
  },
  useReducedMotion: () => false,
}))

const mockUseTheme = vi.fn(() => ({ resolvedTheme: "dark" }))
vi.mock("next-themes", () => ({
  useTheme: () => mockUseTheme(),
}))

function fillForm() {
  fireEvent.change(screen.getByLabelText("Nom"), { target: { value: "Jean Dupont" } })
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jean@example.com" } })
  fireEvent.change(screen.getByLabelText("Message"), {
    target: { value: "Bonjour, ceci est un message de test." },
  })
}

beforeAll(() => {
  vi.stubEnv("NEXT_PUBLIC_CALENDLY_URL", "https://calendly.com/test")
})

afterAll(() => {
  vi.unstubAllEnvs()
})

afterEach(() => {
  cleanup()
  mockUseTheme.mockReturnValue({ resolvedTheme: "dark" })
  vi.restoreAllMocks()
})

describe("ContactSection", () => {
  it("renders the section with correct id and aria-label", () => {
    render(<ContactSection />)
    const section = document.querySelector("section#contact")
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute("aria-label", "Contact")
  })

  it("renders the heading", () => {
    render(<ContactSection />)
    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toMatch(/contact/i)
  })

  it("renders the Calendly widget", () => {
    render(<ContactSection />)
    const widget = screen.getByTestId("calendly-widget")
    expect(widget).toBeInTheDocument()
  })

  it("renders CV download link with download attribute and correct href", () => {
    render(<ContactSection />)
    const cvLink = screen.getByRole("link", { name: /cv/i })
    expect(cvLink).toBeInTheDocument()
    expect(cvLink).toHaveAttribute("href", "/cv.pdf")
    expect(cvLink).toHaveAttribute("download")
  })

  it("renders all 3 contact options", () => {
    render(<ContactSection />)
    const widget = screen.getByTestId("calendly-widget")
    const cvLink = screen.getByRole("link", { name: /cv/i })
    const form = screen.getByRole("form", { name: /formulaire de contact/i })
    expect(widget).toBeInTheDocument()
    expect(cvLink).toBeInTheDocument()
    expect(form).toBeInTheDocument()
  })

  it("uses semantic tokens for styling (no raw colors)", () => {
    render(<ContactSection />)
    const section = document.querySelector("section#contact")
    const html = section!.innerHTML
    expect(html).not.toContain("bg-amber")
    expect(html).not.toContain("text-amber")
  })

  it("wraps content in AnimatedSection", () => {
    render(<ContactSection />)
    const animatedSections = screen.getAllByTestId("animated-section")
    expect(animatedSections.length).toBeGreaterThanOrEqual(1)
  })

  it("applies responsive classes for Calendly container", () => {
    render(<ContactSection />)
    const section = document.querySelector("section#contact")
    const html = section!.innerHTML
    expect(html).toContain("max-w-[600px]")
  })

  it("has accessible download icon in CV button", () => {
    render(<ContactSection />)
    const cvLink = screen.getByRole("link", { name: /cv/i })
    const svg = cvLink.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })

  it("does not render Calendly widget when resolvedTheme is undefined", () => {
    mockUseTheme.mockReturnValueOnce({ resolvedTheme: undefined })
    render(<ContactSection />)
    expect(screen.queryByTestId("calendly-widget")).not.toBeInTheDocument()
  })
})

describe("ContactSection — Formulaire rendu", () => {
  it("renders 3 visible form fields with labels", () => {
    render(<ContactSection />)
    expect(screen.getByLabelText("Nom")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Message")).toBeInTheDocument()
  })

  it("renders submit button with text Envoyer", () => {
    render(<ContactSection />)
    expect(screen.getByRole("button", { name: /envoyer/i })).toBeInTheDocument()
  })

  it("has form with aria-label", () => {
    render(<ContactSection />)
    const form = screen.getByRole("form", { name: /formulaire de contact/i })
    expect(form).toBeInTheDocument()
  })
})

describe("ContactSection — Accessibilité", () => {
  it("has aria-required on all visible fields", () => {
    render(<ContactSection />)
    expect(screen.getByLabelText("Nom")).toHaveAttribute("aria-required", "true")
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-required", "true")
    expect(screen.getByLabelText("Message")).toHaveAttribute("aria-required", "true")
  })

  it("has labels associated with inputs via htmlFor", () => {
    render(<ContactSection />)
    expect(screen.getByLabelText("Nom")).toHaveAttribute("id", "contact-name")
    expect(screen.getByLabelText("Email")).toHaveAttribute("id", "contact-email")
    expect(screen.getByLabelText("Message")).toHaveAttribute("id", "contact-message")
  })

  it("sets aria-invalid on fields with errors", async () => {
    render(<ContactSection />)
    const submitBtn = screen.getByRole("button", { name: /envoyer/i })

    await act(async () => {
      fireEvent.click(submitBtn)
    })

    expect(screen.getByLabelText("Nom")).toHaveAttribute("aria-invalid", "true")
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true")
    expect(screen.getByLabelText("Message")).toHaveAttribute("aria-invalid", "true")
  })

  it("has aria-describedby linking fields to error messages", async () => {
    render(<ContactSection />)

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /envoyer/i }))
    })

    expect(screen.getByLabelText("Nom")).toHaveAttribute("aria-describedby", "name-error")
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-describedby", "email-error")
    expect(screen.getByLabelText("Message")).toHaveAttribute("aria-describedby", "message-error")
    expect(document.getElementById("name-error")).toBeInTheDocument()
    expect(document.getElementById("email-error")).toBeInTheDocument()
    expect(document.getElementById("message-error")).toBeInTheDocument()
  })
})

describe("ContactSection — Validation Zod client", () => {
  it("shows validation errors for empty fields on submit", async () => {
    render(<ContactSection />)

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /envoyer/i }))
    })

    expect(screen.getByLabelText("Nom")).toHaveAttribute("aria-invalid", "true")
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true")
    expect(screen.getByLabelText("Message")).toHaveAttribute("aria-invalid", "true")
  })

  it("shows error for invalid email", async () => {
    render(<ContactSection />)
    fireEvent.change(screen.getByLabelText("Nom"), { target: { value: "Jean Dupont" } })
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "not-an-email" } })
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Bonjour, ceci est un message de test." },
    })

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /envoyer/i }))
    })

    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true")
    expect(document.getElementById("email-error")).toBeInTheDocument()
    expect(screen.getByLabelText("Nom")).toHaveAttribute("aria-invalid", "false")
  })

  it("clears field error when user types", async () => {
    render(<ContactSection />)

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /envoyer/i }))
    })

    expect(screen.getByLabelText("Nom")).toHaveAttribute("aria-invalid", "true")

    fireEvent.change(screen.getByLabelText("Nom"), { target: { value: "Jean" } })
    expect(screen.getByLabelText("Nom")).toHaveAttribute("aria-invalid", "false")
  })
})

describe("ContactSection — Soumission réussie", () => {
  it("shows success toast and resets form", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    )

    render(<ContactSection />)
    fillForm()

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /envoyer/i }))
    })

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/succès/i)
    })

    expect((screen.getByLabelText("Nom") as HTMLInputElement).value).toBe("")
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toBe("")
    expect((screen.getByLabelText("Message") as HTMLTextAreaElement).value).toBe("")
  })
})

describe("ContactSection — Soumission échouée", () => {
  it("shows error toast and keeps form filled on server error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
        status: 500,
      })
    )

    render(<ContactSection />)
    fillForm()

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /envoyer/i }))
    })

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/erreur/i)
    })

    expect((screen.getByLabelText("Nom") as HTMLInputElement).value).toBe("Jean Dupont")
  })
})

describe("ContactSection — Honeypot", () => {
  it("renders honeypot hidden input", () => {
    render(<ContactSection />)
    const form = screen.getByRole("form", { name: /formulaire de contact/i })
    const honeypot = form.querySelector('input[name="website"]')
    expect(honeypot).toBeInTheDocument()
    expect(honeypot).toHaveAttribute("type", "hidden")
  })
})

describe("ContactSection — États visuels", () => {
  it("shows loading state on submit button during submission", async () => {
    let resolvePromise: (value: Response) => void
    const fetchPromise = new Promise<Response>((resolve) => {
      resolvePromise = resolve
    })
    vi.spyOn(global, "fetch").mockReturnValueOnce(fetchPromise)

    render(<ContactSection />)
    fillForm()

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /envoyer/i }))
    })

    await waitFor(() => {
      const button = screen.getByRole("button")
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute("aria-busy", "true")
      expect(button).toHaveTextContent(/envoi en cours/i)
    })

    await act(async () => {
      resolvePromise!(new Response(JSON.stringify({ success: true }), { status: 200 }))
    })
  })

  it("dismisses error toast via close button", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
        status: 500,
      })
    )

    render(<ContactSection />)
    fillForm()

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /envoyer/i }))
    })

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole("button", { name: /fermer/i }))

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    })
  })

  it("dismisses toast on Escape key", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    )

    render(<ContactSection />)
    fillForm()

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /envoyer/i }))
    })

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument()
    })

    fireEvent.keyDown(document, { key: "Escape" })

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    })
  })
})
