import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ProjectCard } from "@/components/ProjectCard"
import type { ProjectData } from "@/data/projects"

afterEach(() => {
  cleanup()
})

const mobileProject: ProjectData = {
  id: "loar",
  title: "LOAR",
  description: "Compagnon IA mobile.",
  longDescription: "Compagnon IA mobile spécialisé.",
  techStack: ["React Native"],
  image: "/images/projects/loar/cover.webp",
  screens: [
    "/images/projects/loar/screen-1.webp",
    "/images/projects/loar/screen-2.webp",
    "/images/projects/loar/screen-3.webp",
    "/images/projects/loar/screen-4.webp",
  ],
  featured: true,
  platform: "mobile",
}

const webProject: ProjectData = {
  id: "restobook",
  title: "RestoBook",
  description: "App web.",
  longDescription: "App web de réservation.",
  techStack: ["Next.js"],
  image: "/images/projects/restobook.webp",
}

describe("ProjectCard - couverture toujours visible", () => {
  it("affiche la couverture du projet directement, sans avoir a ouvrir la carte", () => {
    render(<ProjectCard project={webProject} />)
    const imgs = screen.getAllByRole("img")
    expect(imgs.some((i) => (i.getAttribute("src") ?? "").includes("restobook.webp"))).toBe(true)
  })

  it("affiche un badge Mobile pour un projet platform mobile", () => {
    render(<ProjectCard project={mobileProject} />)
    expect(screen.getByText("Mobile · React Native")).toBeInTheDocument()
  })

  it("n'affiche pas de badge mobile pour un projet web", () => {
    render(<ProjectCard project={webProject} />)
    expect(screen.queryByText(/mobile/i)).not.toBeInTheDocument()
  })
})

describe("ProjectCard - detail en modale", () => {
  it("n'affiche pas le PhoneMockup (galerie d'ecrans) tant que la modale n'est pas ouverte", () => {
    render(<ProjectCard project={mobileProject} />)
    const imgs = screen.getAllByRole("img")
    expect(imgs.some((i) => (i.getAttribute("src") ?? "").includes("screen-1.webp"))).toBe(false)
  })

  it("ouvre la modale avec la galerie d'ecrans au clic sur la couverture", async () => {
    const user = userEvent.setup()
    render(<ProjectCard project={mobileProject} />)
    await user.click(screen.getByRole("button", { name: /Aperçu de LOAR/i }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    const imgs = screen.getAllByRole("img")
    expect(imgs.some((i) => (i.getAttribute("src") ?? "").includes("screen-1.webp"))).toBe(true)
  })

  it("ouvre la modale avec le detail au clic sur 'Voir le projet'", async () => {
    const user = userEvent.setup()
    render(<ProjectCard project={webProject} />)
    await user.click(screen.getByRole("button", { name: /Voir le projet/i }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText(webProject.longDescription as string)).toBeInTheDocument()
  })
})
