import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup, fireEvent } from "@testing-library/react"
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

// La logique de réservation est testée dans BookingSection.test.tsx :
// ici on ne vérifie que la composition de la section contact.
vi.mock("@/components/BookingSection", () => ({
  BookingSection: () => <div data-testid="booking-section">Booking</div>,
}))

afterEach(() => {
  cleanup()
})

describe("ContactSection — Structure", () => {
  it("rend la section #contact avec son aria-label", () => {
    const { container } = render(<ContactSection />)
    const section = container.querySelector("section#contact")

    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute("aria-label", "Contact")
  })

  it("affiche le titre et la promesse d'analyse gratuite", () => {
    render(<ContactSection />)

    expect(screen.getByRole("heading", { name: /prenons contact/i })).toBeInTheDocument()
    expect(screen.getByText(/analyse du besoin gratuite/i)).toBeInTheDocument()
  })

  it("intègre le module de réservation maison", () => {
    render(<ContactSection />)

    expect(screen.getByTestId("booking-section")).toBeInTheDocument()
  })
})

describe("ContactSection — Formulaire classique supprimé", () => {
  it("ne rend plus le formulaire de contact (le bot est le seul canal message)", () => {
    render(<ContactSection />)

    expect(screen.queryByLabelText("Message")).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Envoyer" })).not.toBeInTheDocument()
  })

  it("ne rend plus le widget Calendly", () => {
    render(<ContactSection />)

    expect(screen.queryByTestId("calendly-widget")).not.toBeInTheDocument()
  })
})

describe("ContactSection — Renvoi vers l'assistant", () => {
  it("propose d'écrire via l'assistant et déclenche l'événement open-chat", () => {
    const openChatListener = vi.fn()
    window.addEventListener("open-chat", openChatListener)

    render(<ContactSection />)

    const button = screen.getByRole("button", { name: /assistant/i })
    fireEvent.click(button)

    expect(openChatListener).toHaveBeenCalledOnce()
    window.removeEventListener("open-chat", openChatListener)
  })
})
