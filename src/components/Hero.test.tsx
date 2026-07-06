import { describe, it, expect, afterEach } from "vitest"
import { render, cleanup } from "@testing-library/react"
import { Hero } from "@/components/Hero"

afterEach(() => {
  cleanup()
})

describe("Hero - Halo SVG", () => {
  it("renders no raster image, only the SVG halo", () => {
    const { container } = render(<Hero />)
    expect(container.querySelector("img")).not.toBeInTheDocument()
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("exposes an accessible label for the decorative halo", () => {
    const { container } = render(<Hero />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("role", "img")
    expect(svg!.getAttribute("aria-label")!.length).toBeGreaterThan(0)
  })
})
