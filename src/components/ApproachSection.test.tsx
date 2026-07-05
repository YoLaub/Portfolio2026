import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { ApproachSection } from "@/components/ApproachSection"
import { approach } from "@/data/approach"

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

afterEach(() => {
  cleanup()
})

describe("ApproachSection", () => {
  it("renders the section with correct id and aria-label", () => {
    render(<ApproachSection />)
    const section = document.querySelector("section#approche")
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute("aria-label", "Approche")
  })

  it("renders the title", () => {
    render(<ApproachSection />)
    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading.textContent).toMatch(/Mon Approche/)
  })

  it("renders all approach items with their tag, title and body", () => {
    render(<ApproachSection />)
    for (const item of approach) {
      expect(screen.getByText(item.tag)).toBeInTheDocument()
      expect(screen.getByText(item.title)).toBeInTheDocument()
      expect(screen.getByText(item.body)).toBeInTheDocument()
    }
  })
})
