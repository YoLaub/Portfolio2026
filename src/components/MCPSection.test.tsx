import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { MCPSection } from "@/components/MCPSection"

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

describe("MCPSection", () => {
  it("renders the section with correct id and aria-label", () => {
    render(<MCPSection />)
    const section = document.querySelector("section#mcp")
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute("aria-label", "Connecteur MCP")
  })

  it("renders the title", () => {
    render(<MCPSection />)
    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toMatch(/MCP/i)
  })

  it("renders a description paragraph", () => {
    render(<MCPSection />)
    const section = document.querySelector("section#mcp")
    expect(section!.textContent).toMatch(/Model Context Protocol/i)
  })

  it("renders a code block with curl endpoint", () => {
    render(<MCPSection />)
    const section = document.querySelector("section#mcp")
    expect(section!.textContent).toMatch(/\/api\/mcp/)
  })

  it("renders a code block with JSON response example", () => {
    render(<MCPSection />)
    const section = document.querySelector("section#mcp")
    expect(section!.textContent).toMatch(/"name": "Yoann Laubert"/)
  })

  it("uses semantic tokens for styling (no raw colors)", () => {
    render(<MCPSection />)
    const section = document.querySelector("section#mcp")
    const html = section!.innerHTML
    expect(html).not.toContain("bg-amber")
    expect(html).not.toContain("text-amber")
  })

  it("wraps content in AnimatedSection", () => {
    render(<MCPSection />)
    const animatedSections = screen.getAllByTestId("animated-section")
    expect(animatedSections.length).toBeGreaterThanOrEqual(2)
  })
})
