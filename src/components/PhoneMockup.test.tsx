import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup, fireEvent } from "@testing-library/react"
import { PhoneMockup } from "@/components/PhoneMockup"

afterEach(() => {
  cleanup()
})

const screens = [
  "/images/projects/loar/screen-1.webp",
  "/images/projects/loar/screen-2.webp",
  "/images/projects/loar/screen-3.webp",
  "/images/projects/loar/screen-4.webp",
]

describe("PhoneMockup", () => {
  it("affiche le premier écran avec un alt incluant le nom de l'app", () => {
    render(<PhoneMockup screens={screens} appName="LOAR" />)
    const img = screen.getByRole("img")
    expect(img).toHaveAttribute("alt")
    expect(img.getAttribute("alt")).toContain("LOAR")
  })

  it("rend un point indicateur par écran", () => {
    render(<PhoneMockup screens={screens} appName="LOAR" />)
    expect(screen.getAllByRole("tab")).toHaveLength(4)
  })

  it("le bouton suivant change l'écran affiché", () => {
    render(<PhoneMockup screens={screens} appName="LOAR" />)
    const before = screen.getByRole("img").getAttribute("src")
    fireEvent.click(screen.getByRole("button", { name: /suivant/i }))
    const after = screen.getByRole("img").getAttribute("src")
    expect(after).not.toBe(before)
  })

  it("le bouton précédent depuis le premier écran boucle au dernier", () => {
    render(<PhoneMockup screens={screens} appName="LOAR" />)
    fireEvent.click(screen.getByRole("button", { name: /précédent/i }))
    const src = screen.getByRole("img").getAttribute("src") ?? ""
    expect(src).toContain("screen-4.webp")
  })

  it("cliquer un point indicateur va à l'écran correspondant", () => {
    render(<PhoneMockup screens={screens} appName="LOAR" />)
    fireEvent.click(screen.getAllByRole("tab")[2])
    const src = screen.getByRole("img").getAttribute("src") ?? ""
    expect(src).toContain("screen-3.webp")
  })
})
