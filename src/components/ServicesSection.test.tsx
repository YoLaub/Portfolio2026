import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ServicesSection } from "@/components/ServicesSection"
import { serviceSteps } from "@/data/services"
import { serviceIllustrations } from "@/components/services/illustrations"

afterEach(() => {
  cleanup()
  document.body.style.overflow = ""
})

function stepButtons() {
  const list = screen.getByRole("list", { name: /étapes/i })
  return within(list).getAllByRole("button")
}

async function openStep(index: number) {
  const user = userEvent.setup()
  render(<ServicesSection />)
  const trigger = stepButtons()[index]
  await user.click(trigger)
  return { user, trigger, dialog: screen.getByRole("dialog") }
}

describe("ServicesSection (staircase)", () => {
  it("keeps the #services anchor used by the nav", () => {
    const { container } = render(<ServicesSection />)
    expect(container.querySelector("section#services")).not.toBeNull()
  })

  it("renders the mockup heading without em dash", () => {
    render(<ServicesSection />)
    expect(
      screen.getByRole("heading", { level: 2, name: /Le numérique,\s*marche par marche/ })
    ).toBeInTheDocument()
    expect(screen.getByText(/Mes services · comprendre avant de choisir/)).toBeInTheDocument()
  })

  it("renders the 7 steps in order, each opening a dialog", () => {
    render(<ServicesSection />)
    const buttons = stepButtons()
    expect(buttons).toHaveLength(7)
    buttons.forEach((button, i) => {
      expect(button).toHaveTextContent(serviceSteps[i].title)
      expect(button).toHaveTextContent(serviceSteps[i].priceShort)
      expect(button).toHaveAttribute("aria-haspopup", "dialog")
    })
  })

  it("marks the first step as the starting point", () => {
    render(<ServicesSection />)
    expect(screen.getByText(/COMMENCEZ ICI ↓/)).toBeInTheDocument()
  })

  it("flags the Okyr steps", () => {
    render(<ServicesSection />)
    const okyr = stepButtons().filter((b) => b.dataset.okyr === "true")
    expect(okyr.map((b) => b.textContent)).toEqual([
      expect.stringContaining("Les automatisations"),
      expect.stringContaining("L'IA & le MCP"),
    ])
  })

  it("renders the extras and the contact CTA", () => {
    render(<ServicesSection />)
    expect(screen.getByText("Conseil technique")).toBeInTheDocument()
    expect(screen.getByText("Maintenance & évolution")).toBeInTheDocument()
    expect(screen.getByText(/Un avis clair avant d'investir · sur devis/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Parler de votre besoin/ })).toHaveAttribute(
      "href",
      "#contact"
    )
  })

  it("has an illustration for every step", () => {
    for (const step of serviceSteps) {
      expect(serviceIllustrations[step.id], step.id).toMatch(/<path|<rect/)
    }
  })
})

describe("concept modal", () => {
  it("opens on a step with its full explanation", async () => {
    const { dialog } = await openStep(0)
    const s = serviceSteps[0]
    expect(dialog).toHaveAttribute("aria-modal", "true")
    expect(within(dialog).getByRole("heading", { name: s.title })).toBeInTheDocument()
    expect(dialog).toHaveAccessibleName(s.title)
    for (const text of [s.phrase, s.story, s.image, s.who, s.role, s.price, ...s.uses]) {
      expect(within(dialog).getByText(text)).toBeInTheDocument()
    }
    expect(within(dialog).getAllByText("ÉTAPE 01 / 07").length).toBeGreaterThan(0)
  })

  it("moves focus into the dialog and locks page scroll", async () => {
    await openStep(0)
    expect(screen.getByRole("button", { name: "Fermer" })).toHaveFocus()
    expect(document.body.style.overflow).toBe("hidden")
  })

  it("hides previous on the first step and names the next step", async () => {
    const { dialog } = await openStep(0)
    const prevLabels = serviceSteps.map((s) => `← ${s.title}`)
    const prevButtons = within(dialog)
      .queryAllByRole("button")
      .filter((b) => prevLabels.includes(b.textContent ?? ""))
    expect(prevButtons).toHaveLength(0)
    expect(
      within(dialog).getByRole("button", { name: "Suivant : La base de données →" })
    ).toBeInTheDocument()
  })

  it("navigates with the next and previous buttons", async () => {
    const { user, dialog } = await openStep(0)
    await user.click(within(dialog).getByRole("button", { name: /^Suivant/ }))
    expect(within(dialog).getByRole("heading", { level: 3 })).toHaveTextContent(
      "La base de données"
    )
    expect(within(dialog).getAllByText("ÉTAPE 02 / 07").length).toBeGreaterThan(0)
    await user.click(within(dialog).getByRole("button", { name: "← Le site web" }))
    expect(within(dialog).getByRole("heading", { level: 3 })).toHaveTextContent("Le site web")
  })

  it("wraps from the last step back to the first", async () => {
    const { user, dialog } = await openStep(6)
    await user.click(within(dialog).getByRole("button", { name: "Revenir au début →" }))
    expect(within(dialog).getByRole("heading", { level: 3 })).toHaveTextContent("Le site web")
  })

  it("navigates with arrow keys, wrapping both ways", async () => {
    const { user, dialog } = await openStep(0)
    await user.keyboard("{ArrowLeft}")
    expect(within(dialog).getByRole("heading", { level: 3 })).toHaveTextContent("L'IA & le MCP")
    await user.keyboard("{ArrowRight}")
    expect(within(dialog).getByRole("heading", { level: 3 })).toHaveTextContent("Le site web")
  })

  it("closes on Escape and gives focus back to the step", async () => {
    const { user, trigger } = await openStep(2)
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).toBeNull()
    expect(trigger).toHaveFocus()
    expect(document.body.style.overflow).toBe("")
  })

  it("closes from the mobile back button", async () => {
    const { user, dialog } = await openStep(1)
    await user.click(within(dialog).getByRole("button", { name: "← Les 7 étapes" }))
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("closes on backdrop click", async () => {
    const { user } = await openStep(1)
    await user.click(screen.getByRole("button", { name: "Fermer l'explication", hidden: true }))
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("keeps Tab focus inside the dialog", async () => {
    const { user, dialog } = await openStep(0)
    const next = within(dialog).getByRole("button", { name: /^Suivant/ })
    next.focus()
    await user.tab()
    expect(dialog.contains(document.activeElement)).toBe(true)
    await user.tab({ shift: true })
    expect(next).toHaveFocus()
  })
})
