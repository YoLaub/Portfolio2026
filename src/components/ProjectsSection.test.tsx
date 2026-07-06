import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { ProjectsSection } from "@/components/ProjectsSection"

afterEach(() => {
  cleanup()
})

describe("ProjectsSection - ordre featured", () => {
  it("affiche le titre de LOAR avant celui des Gants Melecien dans le DOM", () => {
    render(<ProjectsSection />)
    const headings = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)
    const loar = headings.findIndex((t) => t?.includes("LOAR"))
    const gantsMelecien = headings.findIndex((t) => t?.includes("Les Gants Melecien"))
    expect(loar).toBeGreaterThanOrEqual(0)
    expect(gantsMelecien).toBeGreaterThanOrEqual(0)
    expect(loar).toBeLessThan(gantsMelecien)
  })
})
