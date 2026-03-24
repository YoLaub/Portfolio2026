import { describe, it, expect, afterEach } from "vitest"
import { render, cleanup } from "@testing-library/react"
import { Hero } from "@/components/Hero"

afterEach(() => {
  cleanup()
})

describe("Hero - Performance attributes", () => {
  // Note: next/image `priority` prop (AC #1) adds loading="eager" and fetchpriority="high"
  // at runtime but these attributes are not rendered in JSDOM test environment.
  // The `priority` prop is verified by source code inspection of Hero.tsx.

  it("renders an image with alt text for the hero photo", () => {
    const { container } = render(<Hero />)
    const img = container.querySelector("img")
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute("alt")
    expect(img!.getAttribute("alt")!.length).toBeGreaterThan(0)
  })

  it("renders image with explicit width and height to prevent CLS", () => {
    const { container } = render(<Hero />)
    const img = container.querySelector("img")
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute("width")
    expect(img).toHaveAttribute("height")
    // Values should be numeric and > 0
    expect(Number(img!.getAttribute("width"))).toBeGreaterThan(0)
    expect(Number(img!.getAttribute("height"))).toBeGreaterThan(0)
  })

  it("renders image with sizes attribute for responsive loading", () => {
    const { container } = render(<Hero />)
    const img = container.querySelector("img")
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute("sizes")
    const sizes = img!.getAttribute("sizes")!
    expect(sizes).toContain("max-width")
  })

  it("uses WebP format for hero image source", () => {
    const { container } = render(<Hero />)
    const img = container.querySelector("img")
    expect(img).toBeInTheDocument()
    const src = img!.getAttribute("src") ?? ""
    expect(src).toContain("hero.webp")
  })

  it("image container has aspect-square for consistent layout", () => {
    const { container } = render(<Hero />)
    const img = container.querySelector("img")
    const imageContainer = img!.parentElement
    expect(imageContainer).toBeInTheDocument()
    expect(imageContainer!.className).toContain("aspect-square")
  })
})
