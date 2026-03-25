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
    expect(section).toHaveAttribute("aria-label", "API & IA")
  })

  it("renders the title", () => {
    render(<MCPSection />)
    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toMatch(/API & IA/)
  })

  it("renders an introduction paragraph covering API REST, AI-friendly, and MCP", () => {
    render(<MCPSection />)
    const section = document.querySelector("section#mcp")
    expect(section!.textContent).toMatch(/API REST/i)
    expect(section!.textContent).toMatch(/IA/i)
    expect(section!.textContent).toMatch(/MCP/i)
  })

  it("renders a curl example for /api/portfolio/projects", () => {
    render(<MCPSection />)
    const section = document.querySelector("section#mcp")
    expect(section!.textContent).toMatch(/\/api\/portfolio\/projects/)
  })

  it("renders a curl example for /ai.md", () => {
    render(<MCPSection />)
    const section = document.querySelector("section#mcp")
    expect(section!.textContent).toMatch(/\/ai\.md/)
  })

  it("renders a curl example for /api/mcp", () => {
    render(<MCPSection />)
    const section = document.querySelector("section#mcp")
    expect(section!.textContent).toMatch(/\/api\/mcp/)
  })

  it("renders a code block with JSON response example", () => {
    render(<MCPSection />)
    const section = document.querySelector("section#mcp")
    expect(section!.textContent).toMatch(/"name": "Yoann Laubert"/)
  })

  it("renders a link to /api/docs documentation", () => {
    render(<MCPSection />)
    const link = document.querySelector('a[href="/api/docs"]')
    expect(link).toBeInTheDocument()
    expect(link!.textContent).toBeTruthy()
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
    expect(animatedSections.length).toBe(5)
  })
})
