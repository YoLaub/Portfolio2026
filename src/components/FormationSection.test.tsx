import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { FormationSection } from "@/components/FormationSection"
import { formations } from "@/data/formations"

afterEach(() => {
  cleanup()
})

describe("FormationSection", () => {
  it("rend la section #formation avec son aria-label", () => {
    const { container } = render(<FormationSection />)
    const section = container.querySelector("section#formation")
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute("aria-label", "Formation")
  })

  it("affiche un encart par module de formation du contenu reel", () => {
    render(<FormationSection />)
    for (const item of formations) {
      expect(screen.getByText(item.title)).toBeInTheDocument()
    }
  })
})
