import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { ProjectsSection } from "@/components/ProjectsSection"

afterEach(() => {
  cleanup()
})

describe("ProjectsSection - ordre featured", () => {
  it("affiche le titre de LOAR avant celui de Studio UML dans le DOM", () => {
    render(<ProjectsSection />)
    const headings = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)
    const loar = headings.findIndex((t) => t?.includes("LOAR"))
    const studioUml = headings.findIndex((t) => t?.includes("Studio UML"))
    expect(loar).toBeGreaterThanOrEqual(0)
    expect(studioUml).toBeGreaterThanOrEqual(0)
    expect(loar).toBeLessThan(studioUml)
  })
})
