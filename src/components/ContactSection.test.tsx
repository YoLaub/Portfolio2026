import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
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

const mockUseTheme = vi.fn(() => ({ resolvedTheme: "dark" }))
vi.mock("next-themes", () => ({
  useTheme: () => mockUseTheme(),
}))

beforeAll(() => {
  vi.stubEnv("NEXT_PUBLIC_CALENDLY_URL", "https://calendly.com/test")
})

afterAll(() => {
  vi.unstubAllEnvs()
})

afterEach(() => {
  cleanup()
  mockUseTheme.mockReturnValue({ resolvedTheme: "dark" })
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

  it("renders form placeholder for Story 3.4", () => {
    render(<ContactSection />)
    const section = document.querySelector("section#contact")
    expect(section!.textContent).toMatch(/message/i)
  })

  it("renders all 3 contact options", () => {
    render(<ContactSection />)
    const widget = screen.getByTestId("calendly-widget")
    const cvLink = screen.getByRole("link", { name: /cv/i })
    expect(widget).toBeInTheDocument()
    expect(cvLink).toBeInTheDocument()
    expect(document.querySelector("section#contact")!.textContent).toMatch(/message/i)
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
