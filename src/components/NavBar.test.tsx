import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { NavBar } from "@/components/NavBar"

afterEach(() => {
  cleanup()
})

describe("NavBar - liens", () => {
  it("ne pointe plus vers la section formation retirée de la page", () => {
    const { container } = render(<NavBar />)
    expect(container.querySelector('a[href="#formation"]')).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /^formation$/i })).not.toBeInTheDocument()
  })
})
