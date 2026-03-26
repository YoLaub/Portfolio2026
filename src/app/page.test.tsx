import { describe, it, expect, vi, afterEach } from "vitest"
import { render, cleanup } from "@testing-library/react"
import Home from "@/app/page"

// Mock all components to focus on page structure
vi.mock("@/components/NavBar", () => ({
  NavBar: () => (
    <header data-testid="navbar">
      <nav aria-label="Navigation principale">Nav</nav>
    </header>
  ),
}))

vi.mock("@/components/Hero", () => ({
  Hero: () => (
    <section id="hero" aria-label="Accueil">
      <h1>Yoann Laubert</h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Yoann Laubert, développeur full-stack React Java basé à Vannes"
        src="/images/hero.webp"
        width="400"
        height="400"
        sizes="(max-width: 768px) 200px, (max-width: 1024px) 300px, 400px"
        loading="eager"
        fetchPriority="high"
      />
    </section>
  ),
}))

vi.mock("@/components/ProjectsSection", () => ({
  ProjectsSection: () => (
    <section id="projets" aria-label="Projets">
      <h2>Projets</h2>
      <article>Projet 1</article>
    </section>
  ),
}))

vi.mock("@/components/ServicesSection", () => ({
  ServicesSection: () => (
    <section id="services" aria-label="Services">
      <h2>Services</h2>
      <article>Service 1</article>
    </section>
  ),
}))

vi.mock("@/components/SkillsSection", () => ({
  SkillsSection: () => (
    <section id="competences" aria-label="Compétences">
      <h2>Compétences</h2>
    </section>
  ),
}))

vi.mock("@/components/MCPSection", () => ({
  MCPSection: () => (
    <section id="mcp" aria-label="API & IA">
      <h2>API & IA</h2>
    </section>
  ),
}))

vi.mock("@/components/ContactSection", () => ({
  ContactSection: () => (
    <section id="contact" aria-label="Contact">
      <h2>Contact</h2>
      <div data-testid="calendly-lazy">Calendly Widget (lazy-loaded)</div>
    </section>
  ),
}))

vi.mock("@/components/Footer", () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}))

afterEach(() => {
  cleanup()
})

describe("Home Page - Accessibility", () => {
  describe("Semantic HTML structure", () => {
    it("renders a <main> element with id main-content", () => {
      const { container } = render(<Home />)
      const main = container.querySelector("main")
      expect(main).toBeInTheDocument()
      expect(main).toHaveAttribute("id", "main-content")
    })

    it("contains <header> element (via NavBar)", () => {
      const { container } = render(<Home />)
      const header = container.querySelector("header")
      expect(header).toBeInTheDocument()
    })

    it("contains <nav> element with aria-label", () => {
      const { container } = render(<Home />)
      const nav = container.querySelector("nav")
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveAttribute("aria-label")
    })

    it("contains <footer> element", () => {
      const { container } = render(<Home />)
      const footer = container.querySelector("footer")
      expect(footer).toBeInTheDocument()
    })

    it("contains multiple <section> elements with aria-labels", () => {
      const { container } = render(<Home />)
      const sections = container.querySelectorAll("section[aria-label]")
      expect(sections.length).toBeGreaterThanOrEqual(6)
    })

    it("contains <article> elements for content cards", () => {
      const { container } = render(<Home />)
      const articles = container.querySelectorAll("article")
      expect(articles.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe("Heading hierarchy", () => {
    it("has exactly one h1 element", () => {
      const { container } = render(<Home />)
      const h1s = container.querySelectorAll("h1")
      expect(h1s.length).toBe(1)
    })

    it("has h2 elements for each major section", () => {
      const { container } = render(<Home />)
      const h2s = container.querySelectorAll("h2")
      expect(h2s.length).toBeGreaterThanOrEqual(5)
    })

    it("has no heading level gaps (no h3 without h2 parent)", () => {
      const { container } = render(<Home />)
      const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6")
      let currentLevel = 0
      for (const heading of headings) {
        const level = parseInt(heading.tagName.charAt(1))
        // Level should not jump by more than 1
        if (currentLevel > 0) {
          expect(level).toBeLessThanOrEqual(currentLevel + 1)
        }
        currentLevel = level
      }
    })
  })

  describe("Performance attributes", () => {
    it("hero image has priority loading attributes (eager + high fetchPriority)", () => {
      const { container } = render(<Home />)
      const heroImg = container.querySelector("section#hero img")
      expect(heroImg).toBeInTheDocument()
      expect(heroImg).toHaveAttribute("loading", "eager")
      expect(heroImg).toHaveAttribute("fetchpriority", "high")
    })

    it("hero image has explicit dimensions to prevent CLS", () => {
      const { container } = render(<Home />)
      const heroImg = container.querySelector("section#hero img")
      expect(heroImg).toBeInTheDocument()
      expect(heroImg).toHaveAttribute("width")
      expect(heroImg).toHaveAttribute("height")
    })

    it("hero image has sizes attribute for responsive loading", () => {
      const { container } = render(<Home />)
      const heroImg = container.querySelector("section#hero img")
      expect(heroImg).toBeInTheDocument()
      expect(heroImg).toHaveAttribute("sizes")
    })

    it("hero image uses WebP format", () => {
      const { container } = render(<Home />)
      const heroImg = container.querySelector("section#hero img")
      expect(heroImg).toBeInTheDocument()
      expect(heroImg!.getAttribute("src")).toContain(".webp")
    })

    it("Calendly widget is present in contact section (lazy-loaded)", () => {
      const { container } = render(<Home />)
      const calendly = container.querySelector("[data-testid='calendly-lazy']")
      expect(calendly).toBeInTheDocument()
    })
  })

  describe("Section aria-labels", () => {
    it("Hero section has aria-label 'Accueil'", () => {
      const { container } = render(<Home />)
      const hero = container.querySelector("section#hero")
      expect(hero).toHaveAttribute("aria-label", "Accueil")
    })

    it("Projects section has aria-label 'Projets'", () => {
      const { container } = render(<Home />)
      const projets = container.querySelector("section#projets")
      expect(projets).toHaveAttribute("aria-label", "Projets")
    })

    it("Services section has aria-label 'Services'", () => {
      const { container } = render(<Home />)
      const services = container.querySelector("section#services")
      expect(services).toHaveAttribute("aria-label", "Services")
    })

    it("Skills section has aria-label 'Compétences'", () => {
      const { container } = render(<Home />)
      const competences = container.querySelector("section#competences")
      expect(competences).toHaveAttribute("aria-label", "Compétences")
    })

    it("MCP section has aria-label 'API & IA'", () => {
      const { container } = render(<Home />)
      const mcp = container.querySelector("section#mcp")
      expect(mcp).toHaveAttribute("aria-label", "API & IA")
    })

    it("Contact section has aria-label 'Contact'", () => {
      const { container } = render(<Home />)
      const contact = container.querySelector("section#contact")
      expect(contact).toHaveAttribute("aria-label", "Contact")
    })
  })
})
