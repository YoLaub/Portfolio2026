import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, cleanup } from "@testing-library/react"

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-inter" }),
  JetBrains_Mono: () => ({ variable: "--font-jetbrains" }),
}))

vi.mock("@/components/Providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}))

afterEach(() => {
  cleanup()
})

describe("RootLayout", () => {
  describe("JSON-LD Schema.org ProfessionalService", () => {
    let jsonLd: Record<string, unknown>
    let scriptElement: HTMLScriptElement | null

    beforeEach(async () => {
      const { default: RootLayout } = await import("@/app/layout")
      render(
        <RootLayout>
          <div>test</div>
        </RootLayout>
      )
      scriptElement = document.querySelector(
        'script[type="application/ld+json"]'
      )
      if (scriptElement?.textContent) {
        jsonLd = JSON.parse(scriptElement.textContent)
      }
    })

    it("renders a script tag with type application/ld+json", () => {
      expect(scriptElement).toBeInTheDocument()
    })

    it("contains valid JSON-LD with @type ProfessionalService", () => {
      expect(scriptElement).toBeInTheDocument()
      expect(jsonLd["@context"]).toBe("https://schema.org")
      expect(jsonLd["@type"]).toBe("ProfessionalService")
    })

    it("includes required fields: name, url, description, email, priceRange", () => {
      expect(scriptElement).toBeInTheDocument()
      expect(jsonLd.name).toBe("YL-solution")
      expect(jsonLd.url).toBe("https://yl-solution.fr")
      expect(jsonLd.description).toBeDefined()
      expect(jsonLd.email).toBe("contact@yl-solution.fr")
      expect(jsonLd.priceRange).toBeDefined()
    })

    it("includes founder Person Yoann Laubert with jobTitle", () => {
      expect(scriptElement).toBeInTheDocument()
      const founder = jsonLd.founder as Record<string, unknown>
      expect(founder["@type"]).toBe("Person")
      expect(founder.name).toBe("Yoann Laubert")
      expect(founder.jobTitle).toBeDefined()
    })

    it("includes areaServed for local SEO (Vannes, Bretagne)", () => {
      expect(scriptElement).toBeInTheDocument()
      const areaServed = jsonLd.areaServed as string[]
      expect(areaServed).toBeInstanceOf(Array)
      expect(areaServed).toContain("Vannes")
    })

    it("exposes the service catalog with price specifications", () => {
      expect(scriptElement).toBeInTheDocument()
      const catalog = jsonLd.hasOfferCatalog as Record<string, unknown>
      expect(catalog["@type"]).toBe("OfferCatalog")
      const items = catalog.itemListElement as Array<Record<string, unknown>>
      expect(items.length).toBeGreaterThanOrEqual(6)
      const first = items[0]
      expect((first.itemOffered as Record<string, unknown>).name).toBeDefined()
      expect(first.priceSpecification).toBeDefined()
    })

    it("includes address with PostalAddress type", () => {
      expect(scriptElement).toBeInTheDocument()
      const address = jsonLd.address as Record<string, unknown>
      expect(address["@type"]).toBe("PostalAddress")
      expect(address.addressLocality).toBe("Vannes")
      expect(address.addressCountry).toBe("FR")
    })

    it("includes sameAs with LinkedIn and GitHub URLs", () => {
      expect(scriptElement).toBeInTheDocument()
      const sameAs = jsonLd.sameAs as string[]
      expect(sameAs).toBeInstanceOf(Array)
      expect(sameAs.length).toBeGreaterThanOrEqual(2)
      expect(sameAs.some((u) => u.includes("linkedin.com"))).toBe(true)
      expect(sameAs.some((u) => u.includes("github.com"))).toBe(true)
    })

    it("includes knowsAbout array with skills on the founder", () => {
      expect(scriptElement).toBeInTheDocument()
      const founder = jsonLd.founder as Record<string, unknown>
      const knowsAbout = founder.knowsAbout as string[]
      expect(knowsAbout).toBeInstanceOf(Array)
      expect(knowsAbout.length).toBeGreaterThan(0)
    })

    it("uses only absolute URLs in sameAs", () => {
      expect(scriptElement).toBeInTheDocument()
      const sameAs = jsonLd.sameAs as string[]
      for (const url of sameAs) {
        expect(url).toMatch(/^https?:\/\//)
      }
    })

    it("sanitizes < characters in JSON-LD output", () => {
      expect(scriptElement).toBeInTheDocument()
      const rawHtml = scriptElement!.innerHTML
      expect(rawHtml).not.toContain("<")
    })
  })

  describe("Skip Link", () => {
    it("renders a skip link targeting #main-content", async () => {
      const { default: RootLayout } = await import("@/app/layout")
      const { container } = render(
        <RootLayout>
          <main id="main-content">Content</main>
        </RootLayout>
      )
      const skipLink = container.querySelector('a[href="#main-content"]')
      expect(skipLink).toBeInTheDocument()
      expect(skipLink).toHaveTextContent("Aller au contenu principal")
    })

    it("skip link has sr-only class for visual hiding", async () => {
      const { default: RootLayout } = await import("@/app/layout")
      const { container } = render(
        <RootLayout>
          <main id="main-content">Content</main>
        </RootLayout>
      )
      const skipLink = container.querySelector('a[href="#main-content"]')
      expect(skipLink).toHaveClass("sr-only")
    })

    it("skip link appears before providers content", async () => {
      const { default: RootLayout } = await import("@/app/layout")
      const { container } = render(
        <RootLayout>
          <main id="main-content">Content</main>
        </RootLayout>
      )
      const skipLink = container.querySelector('a[href="#main-content"]')
      const providers = container.querySelector('[data-testid="providers"]')
      expect(skipLink).toBeInTheDocument()
      expect(providers).toBeInTheDocument()
      // Skip link should come before providers in DOM order
      const comparison = skipLink!.compareDocumentPosition(providers!)
      expect(comparison & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })
  })

  describe("Metadata export", () => {
    it("exports metadata with openGraph configuration", async () => {
      const { metadata } = await import("@/app/layout")
      expect(metadata.openGraph).toBeDefined()
      const og = metadata.openGraph as Record<string, unknown>
      expect(og.title).toBeDefined()
      expect(og.description).toBeDefined()
      expect(og.siteName).toBeDefined()
      expect(og.url).toBeDefined()
      expect(og.locale).toBe("fr_FR")
      expect(og.type).toBe("website")
    })

    // og:image / twitter:image sont fournis par la convention de fichier Next
    // (src/app/opengraph-image.tsx + twitter-image.tsx), pas par les metadata
    // manuelles : on ne doit donc plus pointer vers un fichier statique ici.
    it("does not hardcode a static openGraph/twitter image path", async () => {
      const { metadata } = await import("@/app/layout")
      const og = metadata.openGraph as Record<string, unknown>
      const twitter = metadata.twitter as Record<string, unknown>
      expect(og.images).toBeUndefined()
      expect(twitter.images).toBeUndefined()
    })

    it("exports metadata with twitter card configuration", async () => {
      const { metadata } = await import("@/app/layout")
      expect(metadata.twitter).toBeDefined()
      const twitter = metadata.twitter as Record<string, unknown>
      expect(twitter.card).toBe("summary_large_image")
      expect(twitter.title).toBeDefined()
      expect(twitter.description).toBeDefined()
    })

    it("positions the site as a pro offer, not a portfolio", async () => {
      const { metadata } = await import("@/app/layout")
      expect(metadata.title).not.toMatch(/portfolio/i)
      expect(metadata.description).not.toMatch(/portfolio/i)
      expect(metadata.title).toMatch(/application/i)
    })

    it("exports metadata with metadataBase for absolute URL resolution", async () => {
      const { metadata } = await import("@/app/layout")
      expect(metadata.metadataBase).toBeDefined()
      expect(metadata.metadataBase?.toString()).toBe(
        "https://yl-solution.fr/"
      )
    })

    it("exports metadata with canonical alternates", async () => {
      const { metadata } = await import("@/app/layout")
      expect(metadata.alternates).toBeDefined()
      expect(
        (metadata.alternates as Record<string, unknown>).canonical
      ).toBeDefined()
    })

    it("uses a generated 1200x630 share image via file convention", async () => {
      const og = await import("@/app/opengraph-image")
      expect(og.size).toEqual({ width: 1200, height: 630 })
      expect(og.contentType).toBe("image/png")
      expect(og.alt).toBeDefined()
    })
  })
})
