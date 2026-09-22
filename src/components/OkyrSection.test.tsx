import { describe, it, expect, afterEach, vi } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { OkyrSection } from "@/components/OkyrSection"

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

describe("OkyrSection", () => {
  it("renders the section with correct id and aria-label", () => {
    render(<OkyrSection />)
    const section = document.querySelector("section#okyr")
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute("aria-label", "Okyr")
  })

  it("links to okyr.fr in a new tab", () => {
    render(<OkyrSection />)
    const link = screen.getByRole("link", { name: /okyr/i })
    expect(link).toHaveAttribute("href", "https://okyr.fr")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"))
  })
})
